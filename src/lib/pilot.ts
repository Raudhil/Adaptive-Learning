import { db, id, type DB } from "./db";
import { HttpError } from "./auth";
import { PRETEST_INSTRUMENT_VERSION } from "./seed-data";
import type { User, Level, TrainingRow, DatasetProvenance } from "./types";

export async function managedClass(user:User,classId:string,tx:DB=db) {
 const course=(await tx.query("SELECT * FROM classes WHERE id=$1",[classId])).rows[0];
 if(!course||(user.role!=="admin"&&(user.role!=="lecturer"||course.lecturer_id!==user.id))) throw new HttpError(403,"Kelas tidak dapat diakses.");
 return course;
}

export async function labelPilot(user:User,input:{class_id:string;user_id:string;rubric_version:string;label:Level;rationale:string},tx:DB) {
 const course=await managedClass(user,input.class_id,tx);
 if(course.purpose!=="pilot")throw new HttpError(409,"Pelabelan referensi hanya untuk kelas berjenis Pilot, bukan kelas eksperimen atau latihan.");
 const rubric=(await tx.query("SELECT * FROM pilot_rubrics WHERE version=$1 AND status='approved'",[input.rubric_version])).rows[0];
 if(!rubric)throw new HttpError(409,"Gunakan rubrik yang sudah ditandai disetujui dosen.");
 const participant=(await tx.query("SELECT p.user_id FROM enrollments e JOIN users u ON u.id=e.user_id JOIN pretest_results p ON p.user_id=u.id WHERE e.class_id=$1 AND u.id=$2 AND u.consent_at IS NOT NULL AND p.created_at>=u.consent_at AND p.instrument_version=$3",[course.id,input.user_id,PRETEST_INSTRUMENT_VERSION])).rows[0];
 if(!participant)throw new HttpError(409,"Peserta harus memiliki pretest dengan instrumen yang didukung dan persetujuan penelitian aktif sejak sebelum pretest.");
 const {rows}=await tx.query("INSERT INTO pilot_labels(id,user_id,class_id,rubric_version,label,rationale,created_by) VALUES($1,$2,$3,$4,$5,$6,$7) RETURNING *",[id(),input.user_id,course.id,rubric.version,input.label,input.rationale,user.id]);
 return rows[0];
}

// Recheck consent when preparing a dataset and at prediction time. Historical
// model versions retain their snapshot; withdrawn records cannot drive new predictions.
async function eligibleLabels(tx:DB,kind?:string,classId?:string,ids?:string[]) {
 const {rows}=await tx.query(`SELECT l.*,c.data_kind,p.features,p.instrument_version FROM pilot_labels l
 JOIN pilot_rubrics r ON r.version=l.rubric_version JOIN classes c ON c.id=l.class_id
 JOIN enrollments e ON e.user_id=l.user_id AND e.class_id=l.class_id JOIN users u ON u.id=l.user_id
 JOIN pretest_results p ON p.user_id=l.user_id
 WHERE c.purpose='pilot' AND r.status='approved' AND u.consent_at IS NOT NULL
 AND p.created_at>=u.consent_at AND l.created_at>=u.consent_at AND p.instrument_version=$1
 AND ($2::text IS NULL OR c.data_kind=$2) AND ($3::text IS NULL OR c.id=$3)
 AND ($4::text[] IS NULL OR l.id=ANY($4::text[])) ORDER BY l.created_at DESC,l.id DESC`,[PRETEST_INSTRUMENT_VERSION,kind??null,classId??null,ids??null]);
 return rows;
}

export async function pilotDataset(kind:"real"|"simulation",classId?:string,tx:DB=db) {
 const rows=await eligibleLabels(tx,kind,classId);
 const seen=new Set<string>();
 const latest=rows.filter(row=>{if(seen.has(row.user_id))return false;seen.add(row.user_id);return true;});
 return {training:latest.map(row=>({id:row.id,pilot_label_id:row.id,features:row.features.raw,label:row.label} as TrainingRow)),dataset:{source:"pilot",kind,rubricVersions:[...new Set(latest.map(row=>row.rubric_version as string))].sort()} as DatasetProvenance,instrumentVersion:PRETEST_INSTRUMENT_VERSION};
}

export async function validateTraining(rows:TrainingRow[],tx:DB):Promise<DatasetProvenance> {
 const linked=rows.filter(row=>row.pilot_label_id);
 if(!linked.length)return {source:"manual",kind:"unverified",rubricVersions:[]};
 if(linked.length!==rows.length)throw new HttpError(400,"Pisahkan referensi pilot bertinjau dari data manual yang belum diverifikasi.");
 const eligible=await eligibleLabels(tx,undefined,undefined,linked.map(row=>row.pilot_label_id!));
 const students=new Set<string>(),kinds=new Set<string>(),rubrics=new Set<string>();
 for(const row of rows){
  const reference=eligible.find(label=>label.id===row.pilot_label_id);
  if(!reference||row.id!==reference.id||row.label!==reference.label||JSON.stringify(row.features)!==JSON.stringify(reference.features.raw))throw new HttpError(409,"Data pilot berubah, persetujuan tidak aktif, atau fitur/label tidak sesuai catatan. Muat ulang dataset pilot.");
  if(students.has(reference.user_id))throw new HttpError(400,"Satu peserta hanya boleh menjadi satu baris referensi KNN.");
  students.add(reference.user_id);kinds.add(reference.data_kind);rubrics.add(reference.rubric_version);
 }
 if(kinds.size!==1)throw new HttpError(400,"Data simulasi dan data nyata harus berada dalam versi model terpisah.");
 return {source:"pilot",kind:[...kinds][0] as "real"|"simulation",rubricVersions:[...rubrics].sort()};
}

export async function effectiveTraining(rows:TrainingRow[],tx:DB) {
 const ids=rows.flatMap(row=>row.pilot_label_id?[row.pilot_label_id]:[]);
 if(!ids.length)return rows;
 const eligible=await eligibleLabels(tx,undefined,undefined,ids);
 return rows.filter(row=>!row.pilot_label_id||eligible.some(label=>label.id===row.pilot_label_id));
}
