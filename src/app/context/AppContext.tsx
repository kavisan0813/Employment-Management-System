import React, { createContext, useContext, useState, ReactNode } from "react";
import { employees as initialEmployees } from "../data/mockData";

export interface Candidate {
  id: string;
  name: string;
  role: string;
  date: string;
  avatar: string | null;
  initials: string;
  type: string;
  location: string;
  rating: number;
  source: "LinkedIn" | "Indeed" | "Referral";
  interviewerAvatars: string[];
  interviewDate?: string;
}

export interface JobPosting {
  id: string;
  jobId?: string;
  vacancies?: number;
  title: string;
  department: string;
  location: string;
  type: string;
  experience: string;
  salary: string;
  description: string;
  postedAt: string;
  applicants: number;
}

export interface ScheduledInterview {
  id: string;
  candidateId: string;
  candidateName: string;
  candidateInitials: string;
  role: string;
  date: string;
  time: string;
  type: string;
  interviewer: string;
}

export type Stage =
  | "Applied"
  | "Screening"
  | "Round 1"
  | "Round 2"
  | "Offer"
  | "Hired";

interface RecruitmentContextType {
  recruitmentPipeline: Record<Stage, Candidate[]>;
  addCandidate: (stage: Stage, candidate: Candidate) => void;
  deleteCandidate: (id: string, stage: Stage) => void;
  moveCandidate: (id: string, fromStage: Stage, toStage: Stage) => void;
  jobs: JobPosting[];
  addJob: (job: Omit<JobPosting, "id" | "postedAt" | "applicants">) => void;
  deleteJob: (id: string) => void;
  interviews: ScheduledInterview[];
  scheduleInterview: (iv: Omit<ScheduledInterview, "id">) => void;
  cancelInterview: (id: string) => void;
}

const RecruitmentContext = createContext<RecruitmentContextType | undefined>(
  undefined,
);

export const RecruitmentProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [pipeline, setPipeline] = useState<Record<Stage, Candidate[]>>({
    Applied: [],
    Screening: [],
    "Round 1": [],
    "Round 2": [],
    Offer: [],
    Hired: [],
  });
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [interviews, setInterviews] = useState<ScheduledInterview[]>([]);

  const addCandidate = (stage: Stage, candidate: Candidate) => {
    setPipeline((prev) => ({
      ...prev,
      [stage]: [...prev[stage], candidate],
    }));
  };

  const deleteCandidate = (id: string, stage: Stage) => {
    setPipeline((prev) => ({
      ...prev,
      [stage]: prev[stage].filter((c) => c.id !== id),
    }));
  };

  const moveCandidate = (id: string, fromStage: Stage, toStage: Stage) => {
    setPipeline((prev) => {
      const candidate = prev[fromStage].find((c) => c.id === id);
      if (!candidate) return prev;
      return {
        ...prev,
        [fromStage]: prev[fromStage].filter((c) => c.id !== id),
        [toStage]: [...prev[toStage], candidate],
      };
    });
  };

  const addJob = (job: Omit<JobPosting, "id" | "postedAt" | "applicants">) => {
    setJobs((prev) => [
      ...prev,
      {
        ...job,
        id: `J${Date.now()}`,
        postedAt: new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        applicants: 0,
      },
    ]);
  };

  const deleteJob = (id: string) => {
    setJobs((prev) => prev.filter((j) => j.id !== id));
  };

  const scheduleInterview = (iv: Omit<ScheduledInterview, "id">) => {
    setInterviews((prev) => [...prev, { ...iv, id: `IV${Date.now()}` }]);
  };

  const cancelInterview = (id: string) => {
    setInterviews((prev) => prev.filter((iv) => iv.id !== id));
  };

  return (
    <RecruitmentContext.Provider
      value={{
        recruitmentPipeline: pipeline,
        addCandidate,
        deleteCandidate,
        moveCandidate,
        jobs,
        addJob,
        deleteJob,
        interviews,
        scheduleInterview,
        cancelInterview,
      }}
    >
      {children}
    </RecruitmentContext.Provider>
  );
};

export const useRecruitment = () => {
  const context = useContext(RecruitmentContext);
  if (context === undefined) {
    throw new Error("useRecruitment must be used within a RecruitmentProvider");
  }
  return context;
};

/* ─── Employees Context ─────────────────────────────────── */
export interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  team?: string;
  role: string;
  roleAssignments?: Array<{
    id: string;
    role: string;
    scope: string; // e.g. "organization" | "branch" | "department" | "team"
    scopeId: string;
  }>;
  designation: string;
  status: "Active" | "Inactive" | "On Leave" | "Pending Invite";
  joinDate: string;
  salary: number;
  grossSalary: number;
  deductions: number;
  netPay: number;
  avatar: string;
  location: string;
  manager: string;
  employmentType: string;
  gender: string;
  dob: string;
  address: string;
  emergencyContact: string;
  performance: number;
  notes?: Array<{ id: string; text: string; author: string; time: string }>;
  promotions?: Array<{
    oldDesignation: string;
    newDesignation: string;
    oldSalary: number;
    newSalary: number;
    effectiveDate: string;
  }>;
  transfers?: Array<{
    id: string;
    type: string;
    oldValue: string;
    newValue: string;
    status: "Pending" | "Approved" | "Rejected";
    initiatedDate: string;
  }>;
  assets?: Array<{
    id: string;
    name: string;
    category: string;
    date: string;
    status: string;
  }>;
}

export type EmployeeInput = Pick<
  Employee,
  "name" | "email" | "department" | "designation" | "joinDate"
> & { salary: string | number } & Partial<Employee>;

interface EmployeesContextType {
  employeesList: Employee[];
  addEmployee: (emp: EmployeeInput) => void;
  updateEmployee: (id: string, emp: Partial<Employee>) => void;
  deleteEmployee: (id: string) => void;
  promoteEmployee: (
    id: string,
    newDesignation: string,
    newSalary: number,
    effectiveDate: string,
  ) => void;
  initiateTransfer: (id: string, type: string, newValue: string) => void;
  approveTransfer: (empId: string, transferId: string) => void;
  rejectTransfer: (empId: string, transferId: string) => void;
  bulkImportEmployees: (emps: EmployeeInput[]) => void;
}

const EmployeesContext = createContext<EmployeesContextType | undefined>(
  undefined,
);

export const EmployeesProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [employeesList, setEmployeesList] = useState<Employee[]>(() => {
    // Look up in localStorage or load initialEmployees
    const saved = localStorage.getItem("viyan_employees");
    let list: Employee[] = [];
    if (saved) {
      try {
        list = JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }

    if (!list || list.length === 0) {
      list = initialEmployees.map((emp) => ({
        ...emp,
        status: emp.status as Employee["status"],
        notes: [
          {
            id: "N1",
            text: "Arjun has been performing exceptionally well in the recent Q3 sprint. Needs to focus slightly more on peer code reviews going forward.",
            author: emp.manager || "David Chen",
            time: "2 weeks ago",
          },
        ],
        assets: [
          {
            id: "AST-2022-041",
            name: 'MacBook Pro 16"',
            category: "Laptop",
            date: "01 Mar 2022",
            status: "Assigned",
          },
          {
            id: "AST-2022-089",
            name: 'Dell UltraSharp 27"',
            category: "Monitor",
            date: "15 Mar 2022",
            status: "Assigned",
          },
          {
            id: "AST-2024-102",
            name: "Magic Keyboard",
            category: "Accessory",
            date: "10 Jan 2024",
            status: "Assigned",
          },
        ],
      }));
    }

    // Ensure manager (Sarah Chen) exists in the list
    const hasManager = list.some(
      (e) => e.email.toLowerCase() === "manager@viyanhr.com",
    );
    if (!hasManager) {
      list.push({
        id: "EMP012",
        name: "Sarah Chen",
        email: "manager@viyanhr.com",
        phone: "+1 (555) 901-2345",
        department: "Engineering",
        team: "Frontend",
        role: "Engineering Manager",
        designation: "Engineering Manager",
        status: "Active" as const,
        joinDate: "2020-04-10",
        salary: 120000,
        grossSalary: 12000,
        deductions: 1440,
        netPay: 10560,
        avatar:
          "https://images.unsplash.com/photo-1762522921456-cdfe882d36c3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200",
        location: "San Francisco, CA",
        manager: "Robert Chen",
        employmentType: "Full-time",
        gender: "Female",
        dob: "1989-08-15",
        address: "789 Market St, San Francisco, CA 94103",
        emergencyContact: "Kenji Chen — +1 (555) 567-8901",
        performance: 96,
        notes: [],
        assets: [],
      });
    }

    return list;
  });

  const saveEmployees = (list: Employee[]) => {
    setEmployeesList(list);
    localStorage.setItem("viyan_employees", JSON.stringify(list));
  };

  const addOnboardingEntries = (
    entries: Array<{
      name: string;
      role: string;
      department: string;
      manager: string;
      joiningDate?: string;
      email?: string;
    }>,
  ) => {
    try {
      const onboardingQueue = JSON.parse(
        localStorage.getItem("viyan_onboarding_queue") || "[]",
      );
      const onboardingPhases = JSON.parse(
        localStorage.getItem("viyan_onboarding_phases") || "{}",
      );
      const nowStr = new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
      const nowIso = new Date().toISOString().split("T")[0];

      const newEntries = entries.map((entry, idx) => {
        const initials = entry.name
          .split(" ")
          .map((w) => w[0] || "")
          .join("")
          .toUpperCase()
          .slice(0, 2);
        const onboardingId = `onb-${Date.now()}-${idx}-${Math.floor(Math.random() * 1000)}`;

        const defaultPhases = [
          {
            id: "p1",
            name: "Pre-Joining",
            status: "in-progress" as const,
            date: nowStr,
            tasks: [
              {
                id: "t1",
                task: "Welcome email sent",
                owner: "HR",
                dueDate: "Day 1",
                status: "pending" as const,
                assignee: "HR Team",
              },
              {
                id: "t2",
                task: "Offer letter signed",
                owner: "Employee",
                dueDate: "Day 2",
                status: "pending" as const,
                assignee: entry.name,
              },
              {
                id: "t3",
                task: "Background verification completed",
                owner: "HR",
                dueDate: "Day 3",
                status: "pending" as const,
                assignee: "HR Team",
              },
            ],
          },
        ];
        onboardingPhases[onboardingId] = defaultPhases;

        return {
          id: onboardingId,
          initials,
          avatarColor: "#8B5CF6",
          name: entry.name,
          role: entry.role || "Software Engineer",
          dept: entry.department || "Engineering",
          deptColor: "#00B87C",
          joiningDate: entry.joiningDate || nowIso,
          progress: 0,
          progressColor: "#00B87C",
          status: "pre-joining" as const,
          daysInOnboarding: 0,
          expectedCompletion: "To be scheduled",
          manager: entry.manager || "Arun Nair",
          email:
            entry.email ||
            `${entry.name.toLowerCase().replace(/\s+/g, ".")}@viyanhr.com`,
        };
      });

      localStorage.setItem(
        "viyan_onboarding_queue",
        JSON.stringify([...newEntries, ...onboardingQueue]),
      );
      localStorage.setItem(
        "viyan_onboarding_phases",
        JSON.stringify(onboardingPhases),
      );

      window.dispatchEvent(new Event("storage"));
      window.dispatchEvent(new Event("viyan:onboarding-updated"));
    } catch (e) {
      console.error("Failed to append onboarding entries", e);
    }
  };

  const addEmployee = (emp: EmployeeInput) => {
    const salaryVal = Number(emp.salary) || 0;
    const gross = Math.round(salaryVal / 12);
    const deductions = Math.round(gross * 0.12);
    const netPay = gross - deductions;
    const newEmp: Employee = {
      ...emp,
      salary: salaryVal,
      grossSalary: gross,
      deductions,
      netPay,
      id: `EMP${String(employeesList.length + 1).padStart(3, "0")}`,
      avatar:
        "https://images.unsplash.com/photo-1651684215020-f7a5b6610f23?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200",
      status: "Active",
      phone: emp.phone || "+1 (555) 000-0000",
      employmentType: emp.employmentType || "Full-time",
      gender: emp.gender || "Male",
      dob: emp.dob || "1995-01-01",
      address: emp.address || "123 Street",
      emergencyContact: emp.emergencyContact || "Contact - 123",
      role: emp.role || "Employee",
      location: emp.location || "Office",
      manager: emp.manager || "Unassigned",
      performance: 85,
      notes: [],
    };
    saveEmployees([...employeesList, newEmp]);
    addOnboardingEntries([
      {
        name: newEmp.name,
        role: newEmp.designation || newEmp.role || "Staff",
        department: newEmp.department || "Engineering",
        manager: newEmp.manager || "Unassigned",
        joiningDate: newEmp.joinDate || new Date().toISOString().split("T")[0],
        email: newEmp.email,
      },
    ]);
  };

  const updateEmployee = (id: string, updatedFields: Partial<Employee>) => {
    const newList = employeesList.map((e) => {
      if (e.id !== id) return e;
      const newSalary =
        updatedFields.salary !== undefined
          ? Number(updatedFields.salary)
          : e.salary;
      const gross = Math.round(newSalary / 12);
      const deductions = Math.round(gross * 0.12);
      const netPay = gross - deductions;
      return {
        ...e,
        ...updatedFields,
        salary: newSalary,
        grossSalary: gross,
        deductions,
        netPay,
      };
    });
    saveEmployees(newList);
  };

  const deleteEmployee = (id: string) => {
    const newList = employeesList.filter((e) => e.id !== id);
    saveEmployees(newList);
  };

  const promoteEmployee = (
    id: string,
    newDesignation: string,
    newSalary: number,
    effectiveDate: string,
  ) => {
    const newList = employeesList.map((e) => {
      if (e.id !== id) return e;
      const oldDesignation = e.designation;
      const oldSalary = e.salary;
      const promoHistory = e.promotions || [];
      const newPromo = {
        oldDesignation,
        newDesignation,
        oldSalary,
        newSalary,
        effectiveDate,
      };
      const gross = Math.round(newSalary / 12);
      const deductions = Math.round(gross * 0.12);
      const net = gross - deductions;
      return {
        ...e,
        designation: newDesignation,
        role: newDesignation,
        salary: newSalary,
        grossSalary: gross,
        deductions,
        netPay: net,
        promotions: [...promoHistory, newPromo],
      };
    });
    saveEmployees(newList);
  };

  const initiateTransfer = (id: string, type: string, newValue: string) => {
    const newList = employeesList.map((e) => {
      if (e.id !== id) return e;
      const transfersHistory = e.transfers || [];
      let oldValue = "";
      if (type === "Department Transfer") oldValue = e.department;
      else if (type === "Location Transfer") oldValue = e.location;
      else if (type === "Manager Transfer") oldValue = e.manager;
      else if (type === "Project Transfer") oldValue = "None";

      const newTransfer = {
        id: `TR${Date.now()}`,
        type,
        oldValue,
        newValue,
        status: "Pending" as const,
        initiatedDate: new Date().toISOString().split("T")[0],
      };
      return {
        ...e,
        transfers: [...transfersHistory, newTransfer],
      };
    });
    saveEmployees(newList);
  };

  const approveTransfer = (empId: string, transferId: string) => {
    const newList = employeesList.map((e) => {
      if (e.id !== empId) return e;
      const transfersHistory = e.transfers || [];
      const updatedFields: Partial<Employee> = {};
      const updatedTransfers = transfersHistory.map((tr) => {
        if (tr.id !== transferId) return tr;
        if (tr.type === "Department Transfer")
          updatedFields.department = tr.newValue;
        else if (tr.type === "Location Transfer")
          updatedFields.location = tr.newValue;
        else if (tr.type === "Manager Transfer")
          updatedFields.manager = tr.newValue;
        return { ...tr, status: "Approved" as const };
      });
      return {
        ...e,
        ...updatedFields,
        transfers: updatedTransfers,
      };
    });
    saveEmployees(newList);
  };

  const rejectTransfer = (empId: string, transferId: string) => {
    const newList = employeesList.map((e) => {
      if (e.id !== empId) return e;
      const transfersHistory = e.transfers || [];
      const updatedTransfers = transfersHistory.map((tr) => {
        if (tr.id !== transferId) return tr;
        return { ...tr, status: "Rejected" as const };
      });
      return {
        ...e,
        transfers: updatedTransfers,
      };
    });
    saveEmployees(newList);
  };

  const bulkImportEmployees = (emps: EmployeeInput[]) => {
    let currentLength = employeesList.length;
    const newEmps = emps.map((emp) => {
      currentLength++;
      const salaryVal = Number(emp.salary) || 50000;
      const gross = Math.round(salaryVal / 12);
      const deductions = Math.round(gross * 0.12);
      const netPay = gross - deductions;
      return {
        ...emp,
        salary: salaryVal,
        grossSalary: gross,
        deductions,
        netPay,
        id: `EMP${String(currentLength).padStart(3, "0")}`,
        avatar:
          "https://images.unsplash.com/photo-1651684215020-f7a5b6610f23?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200",
        status: emp.status || "Active",
        phone: emp.phone || "+1 (555) 000-0000",
        employmentType: emp.employmentType || "Full-time",
        gender: emp.gender || "Male",
        dob: emp.dob || "1995-01-01",
        address: emp.address || "123 Street",
        emergencyContact: emp.emergencyContact || "Contact - 123",
        performance: 80,
        notes: [],
      } as Employee;
    });
    saveEmployees([...employeesList, ...newEmps]);
  };

  return (
    <EmployeesContext.Provider
      value={{
        employeesList,
        addEmployee,
        updateEmployee,
        deleteEmployee,
        promoteEmployee,
        initiateTransfer,
        approveTransfer,
        rejectTransfer,
        bulkImportEmployees,
      }}
    >
      {children}
    </EmployeesContext.Provider>
  );
};

export const useEmployees = () => {
  const context = useContext(EmployeesContext);
  if (context === undefined) {
    throw new Error("useEmployees must be used within an EmployeesProvider");
  }
  return context;
};
