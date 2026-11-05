import { notFound,redirect } from "next/navigation";
import { pageUser } from "@/lib/auth";
import { getExercises } from "@/lib/content";
import { hasPretest } from "@/lib/learning";
import { Workspace } from "@/components/workspace";
export default async function Page({params}:{params:Promise<{id:string}>}){
 const user=await pageUser(["student"]);if(!await hasPretest(user.id))redirect("/pretest");
 const {id}=await params,exercise=(await getExercises()).find(e=>e.id===id);if(!exercise)notFound();
 return <Workspace userId={user.id} exercise={{...exercise,hints:exercise.hints.map(()=>"")}}/>;
}
