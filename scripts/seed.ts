import { transaction, closeDB } from "../src/lib/db";
import { installCurriculum } from "../src/lib/curriculum-install";
transaction(installCurriculum).then(result=>console.log("Kurikulum aktif (data lama tetap disimpan):",result)).catch(e=>{console.error(e);process.exitCode=1;}).finally(closeDB);
