import { pageUser } from "@/lib/auth";
import { Classes } from "@/components/classes";
export default async function Page(){await pageUser(["lecturer","admin"]);return <Classes/>;}
