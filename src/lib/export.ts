import { createHmac } from "node:crypto";
export function pseudonym(userId:string,secret:string) {
 if (secret.length<32) throw new Error("RESEARCH_SECRET minimal 32 karakter wajib diatur sebelum ekspor.");
 return createHmac("sha256",secret).update(userId).digest("hex").slice(0,24);
}
export function csvCell(value:unknown) {
 let text=value===null||value===undefined?"":typeof value==="object"?JSON.stringify(value):String(value);
 // Prevent formula execution on spreadsheet import, including leading whitespace.
 if (/^\s*[=+@-]/.test(text)) text="'"+text;
 return '"'+text.replaceAll('"','""')+'"';
}
export function toCSV(headers:string[],rows:unknown[][]) {return '\uFEFF'+[headers,...rows].map(r=>r.map(csvCell).join(",")).join("\r\n");}
