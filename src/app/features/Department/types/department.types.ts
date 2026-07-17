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
}

export interface DepartmentInput extends Omit<Department, "id" | "employees" | "activeEmployees" | "onLeaveEmployees" | "growth"> {}
