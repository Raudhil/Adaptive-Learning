import { pageUser } from "@/lib/auth";
import { CurriculumHistory } from "@/components/curriculum-history";
export default async function Page(){await pageUser(["student"]);return <CurriculumHistory/>;}
