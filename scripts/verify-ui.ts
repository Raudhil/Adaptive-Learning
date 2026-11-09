import assert from "node:assert/strict";
import { chromium } from "@playwright/test";
import { mkdir,writeFile } from "node:fs/promises";
import { pretestQuestions } from "../src/lib/pretest-data";
import { curriculumExercises,curriculumSolutions } from "../src/lib/curriculum-exercises";
/** Only call with synthetic users on the smoke-test database. */
export async function verifyUI(origin:string,cookie:string){
 const browser=await chromium.launch({channel:"chrome",headless:true});
 try{
  const context=await browser.newContext(),split=cookie.indexOf("=");
  await context.addCookies([{name:cookie.slice(0,split),value:cookie.slice(split+1),url:origin,httpOnly:true,sameSite:"Lax"}]);
  const page=await context.newPage(),errors:string[]=[];page.on("pageerror",e=>errors.push(e.message));
  await page.goto(origin+"/pretest");
  for(const module of ["HTML","CSS","JavaScript"]){
   await page.getByRole("heading",{name:module,exact:true}).waitFor();
   for(const q of pretestQuestions.filter(q=>q.module===module))await page.getByRole("group",{name:q.question,exact:true}).getByRole("radio").nth(q.answer).check();
   await page.getByRole("button",{name:"Lanjut",exact:false}).click();
  }
  await page.getByRole("button",{name:"Simpan asesmen",exact:false}).click();
  await page.waitForURL("**/dashboard");
  await page.getByRole("heading",{name:"Peta penguasaan konsep"}).waitFor();
  await page.goto(origin+"/learn");
  await page.getByText("25 konsep", {exact:false}).waitFor();
  assert.equal(await page.getByRole("heading",{name:"React",exact:true}).count(),0);
  const ex=curriculumExercises.find(e=>e.id==="simpus-h01-1-v1")!;
  await page.goto(origin+"/exercise/"+ex.id);
  const editor=page.locator(".cm-content[contenteditable=true]");
  await editor.waitFor();await editor.fill(curriculumSolutions[ex.id].html);
  await page.getByRole("button",{name:"Jalankan tes & kirim",exact:false}).click();
  await page.getByRole("heading",{name:"Seluruh tes lulus",exact:true}).waitFor({timeout:15000});
  const pending=curriculumExercises.find(e=>e.kcs[0].id==="C07")!;
  await page.goto(origin+"/exercise/"+pending.id);
  await page.locator(".cm-content[contenteditable=true]").waitFor();
  assert.equal(await page.getByRole("button",{name:"Jalankan tes & kirim",exact:false}).isDisabled(),true);
  await page.goto(origin+"/history");await page.getByRole("heading",{name:"Riwayat kurikulum lama",exact:true}).waitFor();
  assert.deepEqual(errors,[]);
  await mkdir("output/validation",{recursive:true});
  await page.screenshot({path:"output/validation/kc25-history.png",fullPage:true});
  await writeFile("output/validation/kc25-ui.json",JSON.stringify({browser:await browser.version(),pretestModules:3,questions:25,learnCatalog:25,sourceGrading:"passed",pendingSubmit:"disabled",history:"accessible",pageErrors:errors},null,2));
  console.log("Chromium UI passed: 25-question pretest, 25-KC catalog, H01 original-source grading, pending submit disabled, history.");
 }finally{await browser.close();}
}
