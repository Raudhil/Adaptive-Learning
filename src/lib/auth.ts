import { createHash, randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { db, type DB } from "./db";
import type { Role, User } from "./types";
import { roleHomePath } from "./roles";
export class HttpError extends Error { constructor(public status:number,message:string) { super(message); } }
const digest=(s:string)=>createHash("sha256").update(s).digest("hex");
export const cookieName="learning_session";
export async function currentUser():Promise<User|null> {
 const token=(await cookies()).get(cookieName)?.value;
 if (!token) return null;
 const {rows}=await db.query("SELECT u.id,u.email,u.name,u.role,u.consent_at,u.created_at FROM sessions s JOIN users u ON u.id=s.user_id WHERE s.token_hash=$1 AND s.expires_at>now()",[digest(token)]);
 return (rows[0] as User)??null;
}
export async function requireUser(roles?:Role[]) {
 const user=await currentUser();
 if (!user) throw new HttpError(401,"Silakan masuk terlebih dahulu.");
 if (roles&&!roles.includes(user.role)) throw new HttpError(403,"Anda tidak memiliki hak akses.");
 return user;
}
export async function pageUser(roles?:Role[]) {
 const user=await currentUser();
 if (!user) redirect("/login");
 if (roles&&!roles.includes(user.role)) redirect(roleHomePath(user.role));
 return user;
}
export async function createSession(userId:string) {
 const token=randomBytes(32).toString("hex");
 const days=Math.max(1,Math.min(30,Number(process.env.SESSION_DAYS)||7));
 await db.query("DELETE FROM sessions WHERE expires_at<now()");
 await db.query("INSERT INTO sessions(token_hash,user_id,expires_at) VALUES($1,$2,$3)",[digest(token),userId,new Date(Date.now()+days*86400000).toISOString()]);
 (await cookies()).set(cookieName,token,{httpOnly:true,secure:process.env.APP_URL?.startsWith("https://")??false,sameSite:"lax",path:"/",maxAge:days*86400});
}
export async function destroySession() {
 const cookie=await cookies(), token=cookie.get(cookieName)?.value;
 if (token) await db.query("DELETE FROM sessions WHERE token_hash=$1",[digest(token)]);
 cookie.delete(cookieName);
}
export function checkMutation(request:Request) {
 const expected=new URL(process.env.APP_URL||"http://localhost:3000").origin;
 if (request.headers.get("origin")!==expected || request.headers.get("x-csrf-protection")!=="1") throw new HttpError(403,"Permintaan tidak valid (proteksi CSRF).");
}
export async function checkRateLimit(key:string, tx:DB=db) {
 const hashed=digest(key);
 await tx.query("INSERT INTO login_limits(key,failures,window_start) VALUES($1,1,now()) ON CONFLICT(key) DO UPDATE SET failures=CASE WHEN login_limits.window_start<now()-interval '15 minutes' THEN 1 ELSE login_limits.failures+1 END, window_start=CASE WHEN login_limits.window_start<now()-interval '15 minutes' THEN now() ELSE login_limits.window_start END",[hashed]);
 const {rows}=await tx.query("SELECT failures FROM login_limits WHERE key=$1",[hashed]);
 if (rows[0].failures>10) throw new HttpError(429,"Terlalu banyak percobaan. Coba lagi dalam 15 menit.");
}
