export type TrainingStatus = "Upcoming" | "Ongoing" | "Completed" | "Draft" | "Pending approval" | "Overdue";

export interface TrainingRecord {
  id: string;
  title: string;
  category: string;
  trainer: string;
  department: string;
  participants: string;
  dueDate: string;
  progress: number;
  status: TrainingStatus;
}

export type TrainingView = "dashboard" | "trainings" | "calendar" | "my-training" | "library" | "reports" | "settings" | "details";
