import { AuthForm } from "@/components/auth-form";
import { currentUser } from "@/lib/auth";
import { roleHomePath } from "@/lib/roles";
import { redirect } from "next/navigation";
export default async function Page(){
 const user=await currentUser();
 if(user)redirect(roleHomePath(user.role));
 return <AuthForm register/>;
}
