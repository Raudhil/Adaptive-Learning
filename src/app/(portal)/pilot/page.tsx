import { pageUser } from "@/lib/auth";
import { PilotManager } from "@/components/pilot-manager";
export default async function Page(){await pageUser(["lecturer","admin"]);return <PilotManager/>;}
