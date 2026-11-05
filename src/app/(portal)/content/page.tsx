import { pageUser } from "@/lib/auth";
import { ContentManager } from "@/components/content-manager";
export default async function Page(){await pageUser(["lecturer","admin"]);return <ContentManager/>;}
