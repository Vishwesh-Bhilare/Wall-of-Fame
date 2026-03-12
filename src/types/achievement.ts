export type AchievementStatus = "pending" | "approved" | "rejected";

export type AchievementType =
  | "publication"
  | "hackathon"
  | "patent"
  | "copyright";

export interface Achievement {
  id: string;
  user_id: string;

  title: string;
  type: AchievementType;
  description?: string;

  status: AchievementStatus;

  event_name?: string;
  rank?: string;
  team_size?: number;

  doi?: string;
  journal_name?: string;
  indexing?: string;

  patent_number?: string;
  copyright_number?: string;

  submitted_at?: string;
  verified_at?: string;
}