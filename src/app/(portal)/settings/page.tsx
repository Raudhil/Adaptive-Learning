import { pageUser } from "@/lib/auth";
import { Settings } from "@/components/settings";
export default async function Page(){await pageUser(["admin"]);return <Settings/>;}
