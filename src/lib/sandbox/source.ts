import { parse as parseHTML } from "parse5";
import { parse as parseJS } from "@babel/parser";
import type { Code } from "../types";

/** Static parsing only: submitted HTML/JS is never evaluated in the host document/server. */
export function analyzeSource(code:Code) {
 const errors:string[]=[];
 const document=parseHTML(code.html,{sourceCodeLocationInfo:true,onParseError:e=>errors.push(e.code)});
 const tags:Record<string,{text:string;attrs:Record<string,string>;parent:string;explicit:boolean;closed:boolean}[]>={};
 const text=(n:any):string=>n.nodeName==="#text"?n.value:(n.childNodes??[]).map(text).join("");
 const stack:any[]=[document];let doctype="";
 while(stack.length){const n=stack.pop();if(n.nodeName==="#documentType")doctype=n.name;
  if(n.tagName){(tags[n.tagName]??=[]).push({text:text(n),attrs:Object.fromEntries(n.attrs.map((a:any)=>[a.name,a.value])),parent:n.parentNode?.tagName??"",explicit:!!n.sourceCodeLocation?.startTag,closed:!!n.sourceCodeLocation?.endTag});}
  stack.push(...(n.childNodes??[]).slice().reverse());
 }
 const counts:Record<string,number>={};let syntaxError="";
 try{const ast=parseJS(code.js,{sourceType:"script"});const pending:any[]=[ast.program];
  while(pending.length){const n=pending.pop();if(!n||typeof n!=="object")continue;
   if(typeof n.type==="string")counts[n.type]=(counts[n.type]??0)+1;
   for(const [key,value] of Object.entries(n)){if(["loc","start","end","comments","tokens","leadingComments","trailingComments"].includes(key))continue;if(Array.isArray(value))pending.push(...value);else if(value&&typeof value==="object")pending.push(value);}
  }
 }catch(e){syntaxError=(e as Error).message;}
 return {html:{doctype,errors,tags},js:{counts,syntaxError,statements:Object.entries(counts).filter(([k])=>k.endsWith("Statement")||k.endsWith("Declaration")).reduce((n,[,v])=>n+v,0)}};
}
