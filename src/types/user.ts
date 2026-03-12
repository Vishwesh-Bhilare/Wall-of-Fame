export type UserRole = "student" | "admin" | "head_admin";

export interface UserProfile {
  id: string;
  name?: string | null;
  email?: string | null;
  prn?: string | null;
  department?: string | null;
  year?: number | null;
  role: UserRole;
  github_url?: string | null;
  created_at?: string;
  updated_at?: string;
}
