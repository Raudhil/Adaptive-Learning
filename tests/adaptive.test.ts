import { test } from "node:test";
import assert from "node:assert/strict";
import { updateBKT,predictCorrect } from "../src/lib/adaptive/bkt";
import { classify,normalize,selectK } from "../src/lib/adaptive/knn";
import { inferReadiness,validateDAG,diagnose } from "../src/lib/adaptive/bayes-net";
import { recommend } from "../src/lib/adaptive/recommender";
import { seedKCs,seedExercises,defaultConfig } from "../src/lib/seed-data";
import { instrument } from "../src/lib/sandbox/instrument";
import { pseudonym,csvCell } from "../src/lib/export";
import type { KC,TrainingRow } from "../src/lib/types";
test("BKT: manual correct, incorrect, prediction and fractional weighting",()=>{
 const params={initial:0.2,learn:0.15,guess:0.2,slip:0.1};
 assert.ok(Math.abs(updateBKT(.2,true,params)-.6)<1e-12);
 assert.ok(Math.abs(updateBKT(.2,false,params)-(.15+.85*(.02/.66)))<1e-12);
 assert.ok(Math.abs(predictCorrect(.2,params)-.34)<1e-12);
 assert.ok(updateBKT(.2,true,params,.5)<updateBKT(.2,true,params));
});
test("KNN: fallback, fixed normalization, nearest distances, zero-distance vote",()=>{
 assert.equal(classify([.9,.9,.9,.9,100,100,100,100,3,70],[],3,15).label,"mahir");
 assert.equal(normalize([1,0,0,0,1800,0,0,0,5,100])[4],1);
 assert.throws(()=>normalize([1]));
 const features=[.2,.2,.2,.2,20,20,20,20,2,50];
 const training:TrainingRow[]=[{id:"a",features,label:"pemula"},{id:"b",features:features.map((x,i)=>i<4?1:x),label:"mahir"},{id:"c",features:features.map((x,i)=>i<4?.5:x),label:"menengah"}];
 const result=classify(features,training,3,3);
 assert.equal(result.label,"pemula");assert.equal(result.neighbors[0].distance,0);
 assert.deepEqual(result,classify(features,training,3,3));
});
test("KNN stratified CV is deterministic and includes confusion + per-class metrics",()=>{
 const rows:TrainingRow[]=Array.from({length:30},(_,i)=>({id:String(i).padStart(2,"0"),features:[...new Array(4).fill(Math.floor(i/10)/2),100,100,100,100,3,50],label:(["pemula","menengah","mahir"] as const)[Math.floor(i/10)]}));
 const r=selectK(rows);assert.equal(r.selectedK,3);assert.equal(r.reports[0].accuracy,1);assert.equal(r.reports[0].perClass[0].f1,1);assert.deepEqual(r,selectK([...rows].reverse()));
});
const graph:KC[]=[{id:"A",code:"A",name:"A",module:"HTML",position:0,prerequisites:[]},{id:"B",code:"B",name:"B",module:"HTML",position:1,prerequisites:[{id:"A",weight:.9}]}];
test("BN exact soft evidence agrees with enumeration (not product of mastery)",()=>{
 const mastery={A:.8,B:.3},config={...defaultConfig,bnLeak:.1,bnRoot:.5};
 const r=inferReadiness(graph,mastery,config);
 // P(A,B)=.5 * P(B|A); likelihoods A=[.2,.8], B=[.7,.3].
 const w00=.5*.91*.2*.7,w01=.5*.09*.2*.3,w10=.5*.1*.8*.7,w11=.5*.9*.8*.3;
 const expected=(w10+w11)/(w00+w01+w10+w11);
 assert.ok(Math.abs(r.readiness.B-expected)<1e-12);assert.equal(r.readiness.A,1);assert.equal(diagnose(graph[1],r.posterior),"A");
 const cyclic=graph.map(k=>({...k,prerequisites:k.id==="A"?[{id:"B",weight:.9}]:k.prerequisites}));assert.throws(()=>validateDAG(cyclic),/siklus/);
});
test("Joint readiness retains correlation between prerequisites",()=>{
 const g=[...graph,{id:"C",code:"C",name:"C",module:"HTML" as const,position:2,prerequisites:[{id:"A",weight:.9},{id:"B",weight:.9}]}];
 const r=inferReadiness(g,{},defaultConfig);
 assert.ok(Math.abs(r.readiness.C-r.posterior.A*r.posterior.B)>.01);
});
test("Recommendation respects control sequence, first-observation availability and determinism",()=>{
 const mastery=Object.fromEntries(seedKCs.map(k=>[k.id,.2])),inference=inferReadiness(seedKCs,mastery,defaultConfig);
 const input={nodes:seedKCs,exercises:seedExercises,mastery,...inference,config:defaultConfig,mode:"adaptive" as const,recent:[],attempted:[],failures:{}};
 const r=recommend(input);assert.equal(r.kc_id,"H1");assert.deepEqual(r,recommend(input));
 const control=recommend({...input,mode:"control",attempted:["ex-h1-1"]});assert.equal(control.exercise_id,"ex-h1-2");
 const next=recommend({...input,recent:[r.exercise_id!],attempted:[r.exercise_id!]});assert.notEqual(next.exercise_id,r.exercise_id);
});
test("JS budget interrupts while loops and recursive callbacks",()=>{
 let steps=0;const guard=()=>{if(++steps>100)throw new Error("budget");};
 assert.throws(()=>new Function("guard",instrument("while(true){}","guard"))(guard),/budget/);
 steps=0;assert.throws(()=>new Function("guard",instrument("function f(){f()} f()","guard"))(guard),/budget/);
 assert.throws(()=>instrument("import('https://example.com')","guard"),/Import/);
});
test("Pseudonyms are stable and secret-scoped; CSV blocks formula injection",()=>{
 const secret="s".repeat(32);assert.equal(pseudonym("a",secret),pseudonym("a",secret));assert.notEqual(pseudonym("a",secret),pseudonym("a","x".repeat(32)));assert.throws(()=>pseudonym("a",""));assert.equal(csvCell(" =1+1"),'"\' =1+1"');
});
