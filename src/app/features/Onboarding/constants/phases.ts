import type { OnboardingPhase } from "../types/onboarding.types";

/* ─── Default Onboarding Phases (for employee nh1) ─── */
export const DEFAULT_PHASES_DATA: Record<string, OnboardingPhase[]> = {
  nh1: [
    {
      id: "p1",
      name: "Pre-Joining",
      status: "completed",
      date: "Apr 5, 2026",
      tasks: [
        { id: "t1", task: "Welcome email sent", owner: "HR", dueDate: "Apr 1", status: "done", assignee: "HR Team" },
        { id: "t2", task: "Offer letter signed", owner: "Employee", dueDate: "Apr 2", status: "done", assignee: "Priya Sharma" },
        { id: "t3", task: "Background verification completed", owner: "HR", dueDate: "Apr 3", status: "done", assignee: "HR Team" },
        { id: "t4", task: "Documents collected: Aadhar, PAN, Degree", owner: "HR", dueDate: "Apr 3", status: "done", assignee: "Priya Sharma" },
        { id: "t5", task: "IT equipment ordered: Dell XPS + iPhone", owner: "IT", dueDate: "Apr 4", status: "done", assignee: "IT Team" },
        { id: "t6", task: "Workspace/desk assigned: Zone B, Desk 14", owner: "Admin", dueDate: "Apr 4", status: "done", assignee: "Admin" },
      ],
    },
    {
      id: "p2",
      name: "Day 1",
      status: "in-progress",
      date: "Apr 8, 2026 — Today",
      tasks: [
        { id: "t7", task: "System credentials created", owner: "IT", dueDate: "Apr 7", status: "done", assignee: "IT Team" },
        { id: "t8", task: "Email account setup: priya@viyanhr.com", owner: "IT", dueDate: "Apr 7", status: "done", assignee: "IT Team" },
        { id: "t9", task: "Laptop setup & configuration", owner: "IT", dueDate: "Apr 8", status: "in-progress", assignee: "IT Team" },
        { id: "t10", task: "Office tour", owner: "HR", dueDate: "Apr 8", status: "in-progress", assignee: "HR Team" },
        { id: "t11", task: "Access card issuance", owner: "Admin", dueDate: "Apr 8", status: "overdue", assignee: "Admin" },
        { id: "t12", task: "Welcome lunch arranged", owner: "HR", dueDate: "Apr 8", status: "pending", assignee: "HR Team" },
        { id: "t13", task: "Meet team", owner: "Manager", dueDate: "Apr 8", status: "pending", assignee: "Suresh Iyer" },
      ],
    },
    {
      id: "p3",
      name: "Week 1",
      status: "upcoming",
      date: "Apr 8–14, 2026",
      tasks: [
        { id: "t14", task: "Department orientation", owner: "HR", dueDate: "Apr 9", status: "pending", assignee: "HR Team" },
        { id: "t15", task: "System access setup — CRM, JIRA, GitHub", owner: "IT", dueDate: "Apr 9", status: "pending", assignee: "IT Team" },
        { id: "t16", task: "NDA & policy acknowledgment signing", owner: "HR", dueDate: "Apr 10", status: "pending", assignee: "Priya Sharma" },
        { id: "t17", task: "HR policy training (mandatory e-learning)", owner: "HR", dueDate: "Apr 11", status: "pending", assignee: "HR Team" },
        { id: "t18", task: "Initial 1:1 with manager", owner: "Manager", dueDate: "Apr 10", status: "pending", assignee: "Suresh Iyer" },
        { id: "t19", task: "Introduce to key stakeholders", owner: "Manager", dueDate: "Apr 11", status: "pending", assignee: "Suresh Iyer" },
        { id: "t20", task: "Health insurance enrollment", owner: "Finance", dueDate: "Apr 12", status: "pending", assignee: "Finance Team" },
        { id: "t21", task: "PF/ESI enrollment", owner: "Finance", dueDate: "Apr 14", status: "pending", assignee: "Finance Team" },
      ],
    },
    {
      id: "p4",
      name: "Month 1",
      status: "upcoming",
      date: "Apr 8 – May 8, 2026",
      tasks: [
        { id: "t22", task: "Role-specific technical training", owner: "Manager", dueDate: "Apr 22", status: "pending", assignee: "Suresh Iyer" },
        { id: "t23", task: "Company culture & values session", owner: "HR", dueDate: "Apr 15", status: "pending", assignee: "HR Team" },
        { id: "t24", task: "Complete all mandatory e-learning modules", owner: "HR", dueDate: "Apr 30", status: "pending", assignee: "Priya Sharma" },
        { id: "t25", task: "Set FY goals with manager", owner: "Manager", dueDate: "Apr 20", status: "pending", assignee: "Suresh Iyer" },
        { id: "t26", task: "First performance check-in", owner: "Manager", dueDate: "May 1", status: "pending", assignee: "Suresh Iyer" },
        { id: "t27", task: "Buddy/mentor program enrollment", owner: "HR", dueDate: "Apr 15", status: "pending", assignee: "HR Team" },
        { id: "t28", task: "30-day feedback form completion", owner: "HR", dueDate: "May 8", status: "pending", assignee: "Priya Sharma" },
      ],
    },
    {
      id: "p5",
      name: "Onboarding Complete",
      status: "upcoming",
      date: "",
      tasks: [],
    },
  ],
};
