import { z } from "zod";
import { PRETEST_INSTRUMENT_VERSION } from "./curriculum";
export const codeSchema=z.object({html:z.string().max(50000),css:z.string().max(30000),js:z.string().max(50000)});
const probability=z.number().min(0.001).max(0.999);
const bkt=z.object({initial:probability,learn:probability,guess:probability,slip:probability}).refine(p=>p.guess+p.slip<1,"Guess + slip harus < 1.");
export const trainingSchema=z.array(z.object({id:z.string().min(1).max(100),features:z.array(z.number().finite()).length(8),label:z.enum(["pemula","menengah","mahir"]),instrument_version:z.literal(PRETEST_INSTRUMENT_VERSION),pilot_label_id:z.string().min(1).max(100).optional()})).max(10000)
 .refine(rows=>new Set(rows.map(r=>r.id)).size===rows.length,"ID siswa data latih harus unik.")
 .refine(rows=>rows.every(r=>r.features.every((v,i)=>i<3?v>=0&&v<=1:i<6?v>=0&&v<=1800:i===6?v>=1&&v<=5:v>=0&&v<=100)),"Fitur di luar rentang yang didokumentasikan.");
export const configSchema=z.object({
 instrumentVersion:z.literal(PRETEST_INSTRUMENT_VERSION).default(PRETEST_INSTRUMENT_VERSION),
 bkt, bktByKc:z.record(z.string(),bkt), initialByLevel:z.object({pemula:probability,menengah:probability,mahir:probability}),
 masteryThreshold:z.literal(0.95),readinessThreshold:probability,targetCorrect:probability,bnLeak:probability,bnRoot:probability,
 k:z.number().int().min(1).max(31).refine(k=>k%2===1,"k harus ganjil"),minTraining:z.number().int().min(3).max(10000),training:trainingSchema,
 fallbackThresholds:z.object({intermediate:z.number().min(0).max(1),advanced:z.number().min(0).max(1)}).refine(v=>v.intermediate<v.advanced,"Ambang menengah harus lebih kecil daripada ambang mahir.").default({intermediate:0.4,advanced:0.75}),
 dataset:z.object({source:z.enum(["pilot","manual"]),kind:z.enum(["real","simulation","unverified"]),rubricVersions:z.array(z.string())}).optional(),
 recentSessions:z.number().int().min(1).max(100),failureThreshold:z.number().int().min(2).max(30),inactiveDays:z.number().int().min(1).max(90)
});
export const kcSchema=z.object({id:z.string().min(1).max(80),code:z.string().min(1).max(20),name:z.string().min(3).max(180),module:z.enum(["HTML","CSS","JavaScript"]),position:z.number().int().min(0).max(1000),prerequisites:z.array(z.object({id:z.string(),weight:probability.or(z.literal(1))})).max(5),description:z.string().max(3000).optional(),importance_weight:z.number().int().min(1).max(5).optional(),difficulty_level:z.enum(["Beginner","Intermediate","Advanced"]).optional()});
export const exerciseSchema=z.object({evaluator:z.enum(["dom","js","source"]).default("dom"),assessment_ready:z.boolean().default(false),assessment_note:z.string().max(2000).default("Belum divalidasi dosen untuk penilaian otomatis."),id:z.string().min(1).max(80),title:z.string().min(3).max(180),instructions:z.string().min(10).max(20000),starter_code:codeSchema,difficulty:z.number().min(0).max(1),hints:z.array(z.string().min(1).max(3000)).max(3),kcs:z.array(z.object({id:z.string(),weight:z.number().positive().max(1)})).min(1).max(5),tests:z.array(z.object({id:z.string().min(1).max(80),description:z.string().min(3).max(500),script:z.string().min(1).max(10000),timeout_ms:z.number().int().min(100).max(5000)})).min(0).max(15)}).refine(e=>new Set(e.tests.map(t=>t.id)).size===e.tests.length&&new Set(e.kcs.map(k=>k.id)).size===e.kcs.length,"ID tes/KC duplikat.").refine(e=>!e.assessment_ready||e.tests.length>=2,"Penilaian otomatis memerlukan beberapa test case.");
export const materialSchema=z.object({id:z.string().min(1).max(80),kc_id:z.string(),title:z.string().min(3).max(180),type:z.enum(["text","video","code"]),content:z.string().max(50000),url:z.string().url().refine(u=>u.startsWith("https://"),"URL harus HTTPS").nullable()});
