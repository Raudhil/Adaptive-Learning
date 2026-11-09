export { curriculumKCs as seedKCs } from "./curriculum-data";
export { curriculumExercises as seedExercises, curriculumSolutions as seedSolutions } from "./curriculum-exercises";
export { curriculumMaterials } from "./curriculum-materials";
export { PRETEST_INSTRUMENT_VERSION } from "./curriculum";
import { defaultConfig as legacyConfig } from "./legacy-seed-data";
import { PRETEST_INSTRUMENT_VERSION } from "./curriculum";
import type { ModelConfig } from "./types";
// Preserve existing pilot probabilities. No fabricated training data.
export const defaultConfig:ModelConfig={...legacyConfig,instrumentVersion:PRETEST_INSTRUMENT_VERSION,training:[],bktByKc:{}};
export { pretestQuestions } from "./pretest-data";
