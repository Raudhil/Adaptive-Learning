import { test } from "node:test";
import assert from "node:assert/strict";
import { Script, createContext } from "node:vm";
import { buildSandbox } from "../src/lib/sandbox/runner";
import { seedExercises } from "../src/lib/legacy-seed-data";
import { GET as workerResponse } from "../src/app/sandbox-worker.js/route";
import type { Code, TestCase } from "../src/lib/types";

// These checks exercise generated scripts, not HTML parsing/sanitization.
// DOM parsing and sanitization are outside this VM test's scope.
function sandboxScripts(code: Code, tests: TestCase[] = []) {
 const original = globalThis.DOMParser;
 globalThis.DOMParser = class {
  parseFromString(html: string) {
   return { body: { innerHTML: html }, querySelectorAll: () => [] };
  }
 } as unknown as typeof DOMParser;
 try {
  const page = buildSandbox(code, "regression-channel", tests);
  return [...page.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(match => new Script(match[1]));
 } finally {
  if (original) globalThis.DOMParser = original;
  else Reflect.deleteProperty(globalThis, "DOMParser");
 }
}

async function execute(code: Code, tests: TestCase[]) {
 const messages: { type: string; id?: string; passed?: boolean; error?: string; text?: string }[] = [];
 let complete!: () => void;
 const completed = new Promise<void>(resolve => { complete = resolve; });
 const context = createContext({
  performance, setTimeout, clearTimeout,
  document: { querySelector: (selector: string) => ({ textContent: selector === "h1" ? "Halo Web" : "Belajar HTML" }) },
  parent: { postMessage: (message: typeof messages[number]) => { messages.push(message); if (message.type === "complete") complete(); } },
 });
 context.window = context;
 context.addEventListener = (type:string,callback:()=>void) => {if(type==="load")setTimeout(callback,0);};
 context.requestAnimationFrame = (callback:()=>void) => setTimeout(callback,0);
 for (const script of sandboxScripts(code, tests)) script.runInContext(context, { timeout: 1000 });
 await completed;
 return messages;
}

test("HTML answers pass with untouched JavaScript starter comments", async () => {
 const exercise = seedExercises.find(exercise => exercise.id === "ex-h1-1")!;
 const code = { html: "<body><h1>Halo Web</h1><p>Belajar HTML</p></body>", css: "", js: exercise.starter_code.js };
 const messages = await execute(code, exercise.tests);
 assert.deepEqual(messages.filter(message => message.type === "test").map(message => message.passed), [true, true]);
 assert.equal(messages.some(message => message.type === "console" && message.text?.includes("SyntaxError")), false);
});

test("generated scripts preserve boundaries after trailing JavaScript comments", async () => {
 for (const js of ["", "// komentar", "window.answer = 42; // komentar terakhir"]){
  const messages = await execute({ html: "", css: "", js }, [{ id: "answer", description: "Answer", script: js.includes("answer") ? "window.answer === 42" : "true", timeout_ms: 100 }]);
  assert.equal(messages.find(message => message.type === "test")?.passed, true);
 }
});

test("test expressions may end with line comments", async () => {
 const messages = await execute({ html: "", css: "", js: "// kode awal" }, [{ id: "comment", description: "Comment", script: "document.querySelector('h1').textContent === 'Halo Web' // penjelasan tes", timeout_ms: 100 }]);
 assert.equal(messages.find(message => message.type === "test")?.passed, true);
});

test("runtime errors still fail otherwise correct test expressions", async () => {
 const messages = await execute({ html: "", css: "", js: "throw new Error('kesalahan mahasiswa'); // komentar" }, [{ id: "runtime", description: "Runtime", script: "true", timeout_ms: 100 }]);
 assert.equal(messages.find(message => message.type === "test")?.passed, false);
 assert.ok(messages.some(message => message.type === "console" && message.text === "kesalahan mahasiswa"));
 assert.equal(messages.find(message => message.type === "test")?.error, "Ada error JavaScript. Periksa konsol.");
});

test("worker test expressions also preserve trailing-comment boundaries", async () => {
 let results: { id: string; passed: boolean }[] = [];
 const context = createContext({ postMessage: (data: { results: typeof results }) => { results = data.results; } });
 context.self = context;
 new Script(await workerResponse().text()).runInContext(context);
 await context.onmessage({ data: { code: "window.answer = 42; // komentar", tests: [{ id: "worker", script: "window.answer === 42 // penjelasan" }] } });
 assert.deepEqual(Array.from(results, result => result.passed), [true]);
});
