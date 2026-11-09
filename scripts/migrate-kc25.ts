/** Stop the local app before running: PGlite is a single-process store. */
import { cp,mkdir,writeFile } from "node:fs/promises";
import path from "node:path";
import { createHash } from "node:crypto";
import { db,transaction,closeDB } from "../src/lib/db";
import { installCurriculum } from "../src/lib/curriculum-install";
async function main(){
 if(process.env.DATABASE_URL)throw new Error("Untuk PostgreSQL eksternal, siapkan backup server dan jalankan db:seed pada jendela migrasi. Skrip backup ini khusus PGlite lokal.");
 const root=process.cwd(),source=path.resolve(process.env.LOCAL_DB_PATH??path.join(root,".data/postgres"));
 const backup=path.join(root,"output/backups","kc25-"+Date.now());
 await mkdir(backup,{recursive:true});await cp(source,path.join(backup,"postgres"),{recursive:true,errorOnExist:true});
 const tables=["attempts","mastery_states","mastery_log","pretest_results"];
 const snapshot=async()=>{
  const result:Record<string,{count:number;sha256:string}>={};
  for(const table of tables){const rows=(await db.query("SELECT row_to_json(t) AS row FROM "+table+" t ORDER BY row_to_json(t)::text")).rows;
   result[table]={count:rows.length,sha256:createHash("sha256").update(JSON.stringify(rows)).digest("hex")};
  }return result;
 };
 const before=await snapshot();
 const installed=await transaction(async tx=>{
  const result=await installCurriculum(tx);
  // Check preservation inside the same transaction, before commit.
  for(const table of tables){const rows=(await tx.query("SELECT row_to_json(t) AS row FROM "+table+" t ORDER BY row_to_json(t)::text")).rows;
   if(createHash("sha256").update(JSON.stringify(rows)).digest("hex")!==before[table].sha256)throw new Error("Riwayat "+table+" berubah; transaksi dibatalkan.");
  }return result;
 });
 const after=await snapshot();
 const report={installed,before,after,backup,historyUnchanged:JSON.stringify(before)===JSON.stringify(after)};
 await writeFile(path.join(backup,"migration-report.json"),JSON.stringify(report,null,2));
 console.log(JSON.stringify(report,null,2));
}
main().catch(e=>{console.error(e);process.exitCode=1;}).finally(closeDB);
