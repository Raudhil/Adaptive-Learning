export const dynamic="force-static";
export function GET() {
 const source=`self.onmessage=async({data})=>{const results=[];const facts=data.sourceFacts;self.window=self;try{if(data.evaluator!=='source')(0,eval)(data.code);}catch(e){self.postMessage({results:data.tests.map(t=>({id:t.id,passed:false,error:String(e.message)}))});return;}for(const t of data.tests){try{const fn=new Function('sourceFacts','return (async()=>('+'\\n'+t.script+'\\n'+'))()');const result=await fn(facts);results.push({id:t.id,passed:result===true});}catch(e){results.push({id:t.id,passed:false,error:String(e.message)});}}self.postMessage({results});};`;
 return new Response(source,{headers:{"Content-Type":"text/javascript; charset=utf-8","Content-Security-Policy":"default-src 'none'; script-src 'unsafe-eval'; connect-src 'none'; worker-src 'none'","X-Content-Type-Options":"nosniff","Cache-Control":"no-store"}});
}
