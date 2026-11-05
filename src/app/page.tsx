import { redirect } from "next/navigation";
import { currentUser } from "@/lib/auth";
import { roleHomePath } from "@/lib/roles";
export default async function Home(){
 const user=await currentUser();
 redirect(user?roleHomePath(user.role):"/login");
}
