import type { Role } from "./types";

const homePaths: Record<Role, string> = {
  student: "/dashboard",
  lecturer: "/classes",
  admin: "/settings",
  researcher: "/research",
};

export function roleHomePath(role: Role) {
  return homePaths[role];
}
