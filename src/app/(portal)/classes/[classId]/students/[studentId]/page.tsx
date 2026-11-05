import { notFound } from "next/navigation";
import { pageUser,HttpError } from "@/lib/auth";
import { studentDetail } from "@/lib/analytics";
import { StudentDetail } from "@/components/student-detail";

export default async function Page({params}:{params:Promise<{classId:string;studentId:string}>}){
 const user=await pageUser(["lecturer","admin"]);
 const {classId,studentId}=await params;
 try{return <StudentDetail initial={await studentDetail(user,classId,studentId)}/>;}
 catch(error){if(error instanceof HttpError&&(error.status===403||error.status===404))notFound();throw error;}
}
