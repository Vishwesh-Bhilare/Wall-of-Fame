export type AchievementStatus = "pending" | "approved" | "rejected";

export type AchievementType =
  | "publication"
  | "hackathon"
  | "patent"
  | "copyright"
  | "course"
  | "extracurricular";

export interface Achievement {
  id: string;
  user_id?: string;
  verified_by?: string | null;

  title: string;
  type: AchievementType;
  description?: string | null;

  status: AchievementStatus;

  event_name?: string | null;
  rank?: string | null;
  team_size?: number | null;

  doi?: string | null;
  journal_name?: string | null;
  indexing?: string | null;

  patent_number?: string | null;
  copyright_number?: string | null;

  github?: string | null;
  youtube?: string | null;
  certificate?: string | null;

  submitted_at?: string | null;
  verified_at?: string | null;
  created_at?: string;
  updated_at?: string;

  profiles?: {
    name?: string | null;
    department?: string | null;
    year?: number | null;
    email?: string | null;
  } | null;

  verifier_profile?: {
    email?: string | null;
    name?: string | null;
  } | null;
}

export type CreateAchievementInput = Pick<
  Achievement,
  | "user_id"
  | "title"
  | "type"
  | "description"
  | "event_name"
  | "rank"
  | "doi"
  | "journal_name"
  | "indexing"
  | "patent_number"
  | "copyright_number"
  | "github"
  | "youtube"
  | "certificate"
>;
