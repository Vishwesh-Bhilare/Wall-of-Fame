export interface DepartmentReport {
  department: string;
  type: string;
  total: number;
}

export interface YearlyReport {
  year: number;
  totalAchievements: number;
}

export interface FacultyReport {
  facultyName: string;
  totalSupervised: number;
}