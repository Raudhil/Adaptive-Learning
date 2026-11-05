import { pageUser } from "@/lib/auth";
import { Research } from "@/components/research";
export default async function Page(){await pageUser(["researcher","admin"]);return <Research/>;}
