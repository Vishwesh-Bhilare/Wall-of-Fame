export type UserRole = "student" | "admin" | "head_admin";

export interface User {
  id: string;
  name: string;
  email: string;
  prn?: string;
  department?: string;
  year?: number;
  role: UserRole;
  github_url?: string;
  created_at?: string;
}