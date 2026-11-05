import type { KC, ModelConfig } from "../types";
type Factor = { vars: string[]; values: number[] };
export function validateDAG(nodes: KC[]) {
  const map = new Map(nodes.map(k=>[k.id,k]));
  if (map.size !== nodes.length) throw new Error("ID KC duplikat.");
  const visiting = new Set<string>(), done = new Set<string>();
  function visit(id: string) {
    if (visiting.has(id)) throw new Error("Graf prasyarat mengandung siklus.");
    if (done.has(id)) return;
    const node=map.get(id);
    if (!node) throw new Error("KC prasyarat tidak ditemukan.");
    if (node.prerequisites.length>5) throw new Error("Maksimal 5 prasyarat langsung per KC.");
    if (new Set(node.prerequisites.map(p=>p.id)).size!==node.prerequisites.length) throw new Error("Prasyarat duplikat.");
    visiting.add(id);
    for (const p of node.prerequisites) visit(p.id);
    visiting.delete(id); done.add(id);
  }
  nodes.forEach(k=>visit(k.id));
}
function multiply(a: Factor, b: Factor): Factor {
  const vars=[...a.vars,...b.vars.filter(v=>!a.vars.includes(v))];
  if (vars.length>22) throw new Error("Graf terlalu kompleks untuk inferensi eksak lokal.");
  const ai=a.vars.map(v=>vars.indexOf(v)), bi=b.vars.map(v=>vars.indexOf(v));
  return {vars, values:Array.from({length:2**vars.length},(_,mask)=> {
    const index=(positions:number[])=>positions.reduce((n,pos,i)=>n+((mask>>pos)&1)*2**i,0);
    return a.values[index(ai)]*b.values[index(bi)];
  })};
}
function sumOut(f: Factor, variable: string): Factor {
  const pos=f.vars.indexOf(variable), vars=f.vars.filter(v=>v!==variable), values=new Array(2**(f.vars.length-1)).fill(0);
  f.values.forEach((value,i)=> { const low=i & ((1<<pos)-1), high=(i>>(pos+1))<<pos; values[low+high]+=value; });
  return {vars,values};
}
/** Exact variable elimination, using minimum union size and deterministic ties. */
function partition(initial: Factor[]) {
  let factors=[...initial];
  const variables=new Set(factors.flatMap(f=>f.vars));
  while (variables.size) {
    const next=[...variables].sort((a,b)=> {
      const size=(v:string)=>new Set(factors.filter(f=>f.vars.includes(v)).flatMap(f=>f.vars)).size;
      return size(a)-size(b)||a.localeCompare(b);
    })[0];
    const bucket=factors.filter(f=>f.vars.includes(next));
    factors=factors.filter(f=>!f.vars.includes(next));
    const product=bucket.reduce(multiply);
    let reduced=sumOut(product,next);
    // Rescaling avoids underflow; same rescaling cancels only within a partition.
    factors.push(reduced); variables.delete(next);
  }
  return factors.reduce((n,f)=>n*f.values[0],1);
}
function factorsFor(nodes: KC[], mastery: Record<string,number>, config: ModelConfig): Factor[] {
  return nodes.flatMap(node=> {
    const vars=[node.id,...node.prerequisites.map(p=>p.id)];
    const values=Array.from({length:2**vars.length},(_,mask)=> {
      let p=config.bnRoot;
      if (node.prerequisites.length) {
        // Noisy-AND: a missing parent inhibits the child according to edge weight.
        p=(1-config.bnLeak)*node.prerequisites.reduce((v,parent,i)=>v*(((mask>>(i+1))&1)?1:1-parent.weight),1);
      }
      return mask&1?p:1-p;
    });
    const p=mastery[node.id];
    return p===undefined ? [{vars,values}] : [{vars,values},{vars:[node.id],values:[1-p,p]}];
  });
}
export function inferReadiness(nodes: KC[], mastery: Record<string,number>, config: ModelConfig) {
  validateDAG(nodes);
  const factors=factorsFor(nodes,mastery,config), denominator=partition(factors);
  if (!Number.isFinite(denominator)||denominator<=0) throw new Error("Evidence Bayesian Network tidak mungkin.");
  const probability=(ids:string[])=>Math.min(1,Math.max(0,partition([...factors,...ids.map(v=>({vars:[v],values:[0,1]}))])/denominator));
  const posterior=Object.fromEntries(nodes.map(k=>[k.id,probability([k.id])]));
  const readiness=Object.fromEntries(nodes.map(k=>[k.id,k.prerequisites.length ? probability(k.prerequisites.map(p=>p.id)) : 1]));
  return {readiness,posterior};
}
export function diagnose(node: KC, posterior: Record<string,number>) {
  return [...node.prerequisites].sort((a,b)=>(posterior[a.id]??0)-(posterior[b.id]??0)||a.id.localeCompare(b.id))[0]?.id ?? null;
}
