import { hash } from "bcryptjs";
import { db, id, closeDB } from "../src/lib/db";
import { z } from "zod";
async function main() {
 const [email,name,role]=process.argv.slice(2);
 if (!email||!name||!role||!process.env.ACCOUNT_PASSWORD) throw new Error('Gunakan ACCOUNT_PASSWORD dan npm run account:create -- email "Nama" lecturer|admin|researcher. Password tidak dimasukkan sebagai argumen.');
 const value=z.object({email:z.email(),name:z.string().min(2),role:z.enum(["lecturer","admin","researcher"]),password:z.string().min(12).max(72)}).parse({email:email.toLowerCase(),name,role,password:process.env.ACCOUNT_PASSWORD});
 await db.query("INSERT INTO users(id,email,name,role,password_hash) VALUES($1,$2,$3,$4,$5)",[id(),value.email,value.name,value.role,await hash(value.password,12)]);
 console.log("Akun dibuat:",value.email,value.role);
}
main().catch(e=>{console.error(e.message);process.exitCode=1;}).finally(closeDB);
