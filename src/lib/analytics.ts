import { db } from "./db";
import { getConfig, getKCs } from "./content";
import { HttpError } from "./auth";
import { managedClass } from "./pilot";
import type { User } from "./types";

export async function classAnalytics(user:User,classId:string) {
 const course=await managedClass(user,classId);
 const {values}=await getConfig();
 const [{rows:students},{rows:states},nodes]=await Promise.all([
  db.query(`SELECT u.id,u.name,u.email,u.consent_at,e.joined_at,p.knn_label,p.method,p.created_at AS pretest_at,p.model_version,
   (SELECT label FROM pilot_labels WHERE user_id=u.id AND class_id=e.class_id ORDER BY created_at DESC,id DESC LIMIT 1) AS expert_label,
   (SELECT rubric_version FROM pilot_labels WHERE user_id=u.id AND class_id=e.class_id ORDER BY created_at DESC,id DESC LIMIT 1) AS expert_rubric_version,
   COALESCE(a.attempts,0)::int AS attempts,a.last_active FROM enrollments e JOIN users u ON u.id=e.user_id
   LEFT JOIN pretest_results p ON p.user_id=u.id
   LEFT JOIN (SELECT user_id,count(*) AS attempts,max(created_at) AS last_active FROM attempts GROUP BY user_id) a ON a.user_id=u.id
   WHERE e.class_id=$1 ORDER BY u.name`,[classId]),
  db.query(`SELECT m.*,COALESCE(l.observations,0)::int AS observations FROM mastery_states m
   JOIN enrollments e ON e.user_id=m.user_id LEFT JOIN (SELECT user_id,kc_id,count(*) AS observations FROM mastery_log GROUP BY user_id,kc_id) l ON l.user_id=m.user_id AND l.kc_id=m.kc_id WHERE e.class_id=$1`,[classId]),
  getKCs(),
 ]);
 return {course,nodes,states,masteryThreshold:values.masteryThreshold,students:students.map(student=>{
  const ss=states.filter(state=>state.user_id===student.id);
  const average=ss.length?ss.reduce((sum,state)=>sum+state.p_learned,0)/ss.length:0;
  return {...student,average,observedConcepts:ss.filter(state=>state.observations>0).length,atRisk:average<0.4||Date.now()-new Date(student.last_active??student.joined_at).getTime()>values.inactiveDays*86400000};
 })};
}

export async function studentDetail(user:User,classId:string,studentId:string,page=1) {
 const course=await managedClass(user,classId);
 const student=(await db.query("SELECT u.id,u.name,u.email,u.consent_at,e.joined_at FROM users u JOIN enrollments e ON e.user_id=u.id WHERE e.class_id=$1 AND u.id=$2",[classId,studentId])).rows[0];
 if(!student)throw new HttpError(404,"Mahasiswa tidak terdaftar di kelas ini.");
 const [{rows:pretests},{rows:attempts},{rows:totals},{rows:states},{rows:history},{rows:recommendations},{rows:labels},nodes,config]=await Promise.all([
  db.query("SELECT p.*,m.values->'initialByLevel' AS initial_by_level FROM pretest_results p LEFT JOIN model_params m ON m.version=p.model_version WHERE p.user_id=$1",[studentId]),
  db.query("SELECT a.*,e.title FROM attempts a LEFT JOIN exercises e ON e.id=a.exercise_id WHERE a.user_id=$1 ORDER BY a.created_at DESC,a.id DESC LIMIT 10 OFFSET $2",[studentId,(page-1)*10]),
  db.query("SELECT count(*)::int AS attempts,count(DISTINCT exercise_id)::int AS exercises,count(*) FILTER(WHERE passed)::int AS passed FROM attempts WHERE user_id=$1",[studentId]),
  db.query("SELECT m.*,COALESCE(l.observations,0)::int AS observations FROM mastery_states m LEFT JOIN (SELECT kc_id,count(*) AS observations FROM mastery_log WHERE user_id=$1 GROUP BY kc_id) l ON l.kc_id=m.kc_id WHERE m.user_id=$1",[studentId]),
  db.query("SELECT * FROM mastery_log WHERE user_id=$1 ORDER BY created_at DESC,id DESC LIMIT 100",[studentId]),
  db.query("SELECT id,kc_id,exercise_id,reason,inputs->>'param_version' AS param_version,inputs->'readiness' AS readiness,accepted,created_at FROM recommendations WHERE user_id=$1 ORDER BY created_at DESC,id DESC LIMIT 10",[studentId]),
  db.query("SELECT l.*,r.title AS rubric_title,r.criteria FROM pilot_labels l JOIN pilot_rubrics r ON r.version=l.rubric_version WHERE l.user_id=$1 AND l.class_id=$2 ORDER BY l.created_at DESC,l.id DESC LIMIT 10",[studentId,classId]),
  getKCs(),getConfig(),
 ]);
 return {course,student,pretest:pretests[0]??null,attempts,totals:totals[0],states,history,recommendations,labels,nodes,page,hasNext:page*10<totals[0].attempts,masteryThreshold:config.values.masteryThreshold,readinessThreshold:config.values.readinessThreshold};
}
