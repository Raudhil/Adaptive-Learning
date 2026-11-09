CREATE TABLE IF NOT EXISTS users (
  id text PRIMARY KEY, email text UNIQUE NOT NULL, name text NOT NULL, role text NOT NULL CHECK(role IN ('student','lecturer','admin','researcher')),
  password_hash text NOT NULL, consent_at timestamptz, created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS sessions (
  token_hash text PRIMARY KEY, user_id text NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires_at timestamptz NOT NULL, created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS login_limits (key text PRIMARY KEY, failures int NOT NULL DEFAULT 0, window_start timestamptz NOT NULL DEFAULT now());
CREATE TABLE IF NOT EXISTS classes (
  id text PRIMARY KEY, name text NOT NULL, lecturer_id text NOT NULL REFERENCES users(id), join_code text UNIQUE NOT NULL,
  mode text NOT NULL CHECK(mode IN ('adaptive','control')), created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS enrollments (
  user_id text NOT NULL REFERENCES users(id), class_id text NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  joined_at timestamptz NOT NULL DEFAULT now(), PRIMARY KEY(user_id,class_id), UNIQUE(user_id)
);
ALTER TABLE classes ADD COLUMN IF NOT EXISTS purpose text NOT NULL DEFAULT 'practice' CHECK(purpose IN ('practice','pilot','experiment'));
ALTER TABLE classes ADD COLUMN IF NOT EXISTS data_kind text NOT NULL DEFAULT 'simulation' CHECK(data_kind IN ('real','simulation'));
CREATE TABLE IF NOT EXISTS knowledge_components (
  id text PRIMARY KEY, code text UNIQUE NOT NULL, name text NOT NULL, module text NOT NULL,
  position int NOT NULL CHECK(position>=0)
);
CREATE TABLE IF NOT EXISTS kc_prerequisites (
  kc_id text NOT NULL REFERENCES knowledge_components(id) ON DELETE CASCADE,
  prereq_kc_id text NOT NULL REFERENCES knowledge_components(id), weight double precision NOT NULL CHECK(weight>0 AND weight<=1),
  PRIMARY KEY(kc_id,prereq_kc_id), CHECK(kc_id<>prereq_kc_id)
);
CREATE TABLE IF NOT EXISTS materials (
  id text PRIMARY KEY, kc_id text NOT NULL REFERENCES knowledge_components(id), type text NOT NULL CHECK(type IN ('text','video','code')),
  title text NOT NULL, content text NOT NULL DEFAULT '', url text, updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS exercises (
  id text PRIMARY KEY, title text NOT NULL, instructions text NOT NULL, starter_code jsonb NOT NULL,
  difficulty double precision NOT NULL CHECK(difficulty>=0 AND difficulty<=1), hints jsonb NOT NULL DEFAULT '[]', created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS exercise_kc (
  exercise_id text NOT NULL REFERENCES exercises(id) ON DELETE CASCADE, kc_id text NOT NULL REFERENCES knowledge_components(id),
  weight double precision NOT NULL CHECK(weight>0 AND weight<=1), PRIMARY KEY(exercise_id,kc_id)
);
CREATE TABLE IF NOT EXISTS test_cases (
  id text PRIMARY KEY, exercise_id text NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
  description text NOT NULL, script text NOT NULL, timeout_ms int NOT NULL CHECK(timeout_ms BETWEEN 100 AND 5000)
);
CREATE TABLE IF NOT EXISTS pretest_results (
  user_id text PRIMARY KEY REFERENCES users(id), features jsonb NOT NULL, answers jsonb NOT NULL, knn_label text NOT NULL,
  neighbors jsonb NOT NULL, model_version text NOT NULL, method text NOT NULL, created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS mastery_states (
  user_id text NOT NULL REFERENCES users(id), kc_id text NOT NULL REFERENCES knowledge_components(id),
  p_learned double precision NOT NULL CHECK(p_learned BETWEEN 0 AND 1), readiness double precision NOT NULL CHECK(readiness BETWEEN 0 AND 1),
  updated_at timestamptz NOT NULL DEFAULT now(), PRIMARY KEY(user_id,kc_id)
);
ALTER TABLE pretest_results ADD COLUMN IF NOT EXISTS instrument_version text NOT NULL DEFAULT 'legacy-unknown';
ALTER TABLE pretest_results ADD COLUMN IF NOT EXISTS audit jsonb NOT NULL DEFAULT '{}';
CREATE TABLE IF NOT EXISTS attempts (
  id text PRIMARY KEY, user_id text NOT NULL REFERENCES users(id), exercise_id text NOT NULL REFERENCES exercises(id), code jsonb NOT NULL,
  passed boolean NOT NULL, tests_result jsonb NOT NULL, hints_used int NOT NULL, duration_ms int NOT NULL, is_first boolean NOT NULL,
  selection text NOT NULL, created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS attempts_user_exercise ON attempts(user_id,exercise_id);
CREATE UNIQUE INDEX IF NOT EXISTS attempts_first ON attempts(user_id,exercise_id) WHERE is_first=true;
ALTER TABLE attempts ADD COLUMN IF NOT EXISTS context jsonb NOT NULL DEFAULT '{}';
CREATE TABLE IF NOT EXISTS mastery_log (
  id text PRIMARY KEY, user_id text NOT NULL REFERENCES users(id), kc_id text NOT NULL REFERENCES knowledge_components(id),
  attempt_id text NOT NULL REFERENCES attempts(id), p_before double precision NOT NULL, p_after double precision NOT NULL,
  predicted_correct double precision NOT NULL, observed_correct boolean NOT NULL, param_version text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS mastery_log_user_date ON mastery_log(user_id,created_at);
CREATE TABLE IF NOT EXISTS recommendations (
  id text PRIMARY KEY, user_id text NOT NULL REFERENCES users(id), kc_id text REFERENCES knowledge_components(id), exercise_id text REFERENCES exercises(id),
  reason text NOT NULL, inputs jsonb NOT NULL, accepted boolean, created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS model_params (
  version text PRIMARY KEY, type text NOT NULL DEFAULT 'hybrid', kc_id text REFERENCES knowledge_components(id), values jsonb NOT NULL,
  active boolean NOT NULL DEFAULT false, created_at timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS model_one_active ON model_params(active) WHERE active=true;
CREATE TABLE IF NOT EXISTS drafts (
  user_id text NOT NULL REFERENCES users(id), exercise_id text NOT NULL REFERENCES exercises(id), code jsonb NOT NULL,
  hints_used int NOT NULL DEFAULT 0, started_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(), PRIMARY KEY(user_id,exercise_id)
);
CREATE TABLE IF NOT EXISTS pilot_rubrics (
 version text PRIMARY KEY, title text NOT NULL, criteria jsonb NOT NULL, status text NOT NULL DEFAULT 'draft' CHECK(status IN ('draft','approved')),
 created_by text NOT NULL REFERENCES users(id), approved_by text REFERENCES users(id), approved_at timestamptz, created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS pilot_labels (
 id text PRIMARY KEY, user_id text NOT NULL REFERENCES users(id), class_id text NOT NULL REFERENCES classes(id),
 rubric_version text NOT NULL REFERENCES pilot_rubrics(version), label text NOT NULL CHECK(label IN ('pemula','menengah','mahir')),
 rationale text NOT NULL, created_by text NOT NULL REFERENCES users(id), created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS pilot_labels_user_history ON pilot_labels(user_id,created_at DESC);

-- Additive curriculum migration: legacy rows and all learner evidence remain intact.
CREATE TABLE IF NOT EXISTS curriculum_versions (
 version text PRIMARY KEY, title text NOT NULL, instrument_version text NOT NULL,
 active boolean NOT NULL DEFAULT false, created_at timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS curriculum_one_active ON curriculum_versions(active) WHERE active;
INSERT INTO curriculum_versions(version,title,instrument_version)
 VALUES('legacy-srs-v1','SRS awal: HTML/CSS/JS/React','mcq-pilot-v1') ON CONFLICT DO NOTHING;
ALTER TABLE knowledge_components ADD COLUMN IF NOT EXISTS curriculum_version text NOT NULL DEFAULT 'legacy-srs-v1';
ALTER TABLE knowledge_components ADD COLUMN IF NOT EXISTS weight_reason text NOT NULL DEFAULT '';
ALTER TABLE pilot_labels ADD COLUMN IF NOT EXISTS instrument_version text NOT NULL DEFAULT 'legacy-unknown';
ALTER TABLE knowledge_components ADD COLUMN IF NOT EXISTS description text NOT NULL DEFAULT '';
ALTER TABLE knowledge_components ADD COLUMN IF NOT EXISTS importance_weight int NOT NULL DEFAULT 1 CHECK(importance_weight BETWEEN 1 AND 5);
ALTER TABLE knowledge_components ADD COLUMN IF NOT EXISTS difficulty_level text NOT NULL DEFAULT 'Beginner' CHECK(difficulty_level IN ('Beginner','Intermediate','Advanced'));
ALTER TABLE knowledge_components ADD COLUMN IF NOT EXISTS sources jsonb NOT NULL DEFAULT '[]';
ALTER TABLE knowledge_components ADD COLUMN IF NOT EXISTS external_prerequisites jsonb NOT NULL DEFAULT '[]';
ALTER TABLE knowledge_components ADD COLUMN IF NOT EXISTS assessment_ready boolean NOT NULL DEFAULT true;
ALTER TABLE knowledge_components ADD COLUMN IF NOT EXISTS assessment_note text NOT NULL DEFAULT '';
ALTER TABLE exercises ADD COLUMN IF NOT EXISTS curriculum_version text NOT NULL DEFAULT 'legacy-srs-v1';
ALTER TABLE exercises ADD COLUMN IF NOT EXISTS evaluator text NOT NULL DEFAULT 'dom' CHECK(evaluator IN ('dom','js','source'));
ALTER TABLE exercises ADD COLUMN IF NOT EXISTS assessment_ready boolean NOT NULL DEFAULT true;
ALTER TABLE exercises ADD COLUMN IF NOT EXISTS assessment_note text NOT NULL DEFAULT '';
ALTER TABLE exercises ADD COLUMN IF NOT EXISTS sources jsonb NOT NULL DEFAULT '[]';
CREATE TABLE IF NOT EXISTS kc_version_mapping (
 old_kc_id text NOT NULL REFERENCES knowledge_components(id), new_kc_id text NOT NULL REFERENCES knowledge_components(id),
 curriculum_version text NOT NULL REFERENCES curriculum_versions(version),
 relation text NOT NULL DEFAULT 'review-required', PRIMARY KEY(old_kc_id,new_kc_id,curriculum_version)
);
-- Only the uniqueness definition changes. No pretest row is deleted or overwritten.
DO $$ BEGIN
 IF EXISTS (SELECT 1 FROM pg_constraint WHERE conrelid='pretest_results'::regclass AND contype='p' AND array_length(conkey,1)=1) THEN
  ALTER TABLE pretest_results DROP CONSTRAINT pretest_results_pkey;
  ALTER TABLE pretest_results ADD PRIMARY KEY(user_id,instrument_version);
 END IF;
END $$;
CREATE OR REPLACE VIEW current_pretests AS
 SELECT * FROM pretest_results WHERE instrument_version='simpus-mcq-v2';
