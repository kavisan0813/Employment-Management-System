export interface ChangeRecord {
  id: string;
  changedBy: {
    name: string;
    avatar?: string;
    role?: string;
  };
  newValue: string;
  date: string;
  comment: string;
}

export interface Department {
  id: string;
  name: string;
  code: string;
  head: string;
  status: "Active" | "Inactive";
  employees: number;
  activeEmployees: number;
  onLeaveEmployees: number;
  growth: number;
  description?: string;
  createdDate?: string;
  lastUpdated?: string;
  parentDepartment?: string;
  teams?: { name: string; lead: string }[];
  changeHistory?: ChangeRecord[];

  // Finance fields
  budgetAmount: string;
  budgetUsedPct: number;
  budgetUsedAmount: string;
  budgetStatus: "green" | "amber" | "red";
  nearLimit?: boolean;
}

export interface DepartmentInput extends Omit<Department, "id" | "employees" | "activeEmployees" | "onLeaveEmployees" | "growth" | "budgetUsedPct" | "budgetUsedAmount" | "budgetStatus"> {
  budgetAmount: string;
}
