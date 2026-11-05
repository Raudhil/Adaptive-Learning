import { pageUser } from "@/lib/auth";
import { Dashboard } from "@/components/dashboard";
export default async function Page(){const user=await pageUser();return <Dashboard user={user}/>;}
