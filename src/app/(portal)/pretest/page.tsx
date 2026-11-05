import { pageUser } from "@/lib/auth";
import { Pretest } from "@/components/pretest";
export default async function Page(){await pageUser(["student"]);return <Pretest/>;}
