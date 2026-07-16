import type { TrainingRecord } from "../types/training.types";

export const trainingRecords: TrainingRecord[] = [
  { id: "TR001", title: "Java Spring Boot", category: "Technical", trainer: "John Mathews", department: "Engineering", participants: "35 / 40", dueDate: "18 Jul 2026", progress: 70, status: "Ongoing" },
  { id: "TR002", title: "React Advanced", category: "Technical", trainer: "David Chen", department: "Development", participants: "28 / 30", dueDate: "20 Jul 2026", progress: 40, status: "Ongoing" },
  { id: "TR003", title: "Cyber Security", category: "Compliance", trainer: "Priya Nair", department: "IT", participants: "52 / 60", dueDate: "12 Jul 2026", progress: 100, status: "Completed" },
  { id: "TR004", title: "POSH Compliance", category: "Compliance", trainer: "Kavya Rao", department: "All departments", participants: "410 / 500", dueDate: "25 Jul 2026", progress: 15, status: "Upcoming" },
  { id: "TR005", title: "Flutter Architecture", category: "Technical", trainer: "Rahul Das", department: "Mobile", participants: "18 / 20", dueDate: "10 Jul 2026", progress: 80, status: "Overdue" },
];

export const activityItems = [
  "Java Spring Boot training published",
  "48 employees assigned to React Advanced",
  "Cyber Security training completed",
  "POSH Compliance training scheduled",
  "Flutter Architecture marked as overdue",
  "New training request submitted",
];
