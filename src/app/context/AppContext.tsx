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
  role: string;
  designation: string;
  status: string;
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
  notes?: Array<{ id: string; text: string; author: string; time: string; }>;
  promotions?: Array<{ oldDesignation: string; newDesignation: string; oldSalary: number; newSalary: number; effectiveDate: string; }>;
  transfers?: Array<{ id: string; type: string; oldValue: string; newValue: string; status: "Pending" | "Approved" | "Rejected"; initiatedDate: string; }>;
  assets?: Array<{ id: string; name: string; category: string; date: string; status: string; }>;
}

interface EmployeesContextType {
  employeesList: Employee[];
  addEmployee: (emp: Omit<Employee, "id" | "grossSalary" | "deductions" | "netPay" | "avatar">) => void;
  updateEmployee: (id: string, emp: Partial<Employee>) => void;
  deleteEmployee: (id: string) => void;
  promoteEmployee: (id: string, newDesignation: string, newSalary: number, effectiveDate: string) => void;
  initiateTransfer: (id: string, type: string, newValue: string) => void;
  approveTransfer: (empId: string, transferId: string) => void;
  rejectTransfer: (empId: string, transferId: string) => void;
  bulkImportEmployees: (emps: Omit<Employee, "id" | "grossSalary" | "deductions" | "netPay" | "avatar">[]) => void;
}

const EmployeesContext = createContext<EmployeesContextType | undefined>(undefined);

export const EmployeesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [employeesList, setEmployeesList] = useState<Employee[]>(() => {
    // Look up in localStorage or load initialEmployees
    const saved = localStorage.getItem("nexus_employees");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return initialEmployees.map(emp => ({
      ...emp,
      notes: [
        {
          id: "N1",
          text: "Arjun has been performing exceptionally well in the recent Q3 sprint. Needs to focus slightly more on peer code reviews going forward.",
          author: emp.manager || "David Chen",
          time: "2 weeks ago",
        }
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
      ]
    }));
  });

  const saveEmployees = (list: Employee[]) => {
    setEmployeesList(list);
    localStorage.setItem("nexus_employees", JSON.stringify(list));
  };

  const addEmployee = (emp: Omit<Employee, "id" | "grossSalary" | "deductions" | "netPay" | "avatar">) => {
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
      avatar: "https://images.unsplash.com/photo-1651684215020-f7a5b6610f23?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200",
      status: "Active",
      phone: emp.phone || "+1 (555) 000-0000",
      employmentType: emp.employmentType || "Full-time",
      gender: emp.gender || "Male",
      dob: emp.dob || "1995-01-01",
      address: emp.address || "123 Street",
      emergencyContact: emp.emergencyContact || "Contact - 123",
      performance: 85,
      notes: [],
    };
    saveEmployees([...employeesList, newEmp]);
  };

  const updateEmployee = (id: string, updatedFields: Partial<Employee>) => {
    const newList = employeesList.map((e) => {
      if (e.id !== id) return e;
      const newSalary = updatedFields.salary !== undefined ? Number(updatedFields.salary) : e.salary;
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

  const promoteEmployee = (id: string, newDesignation: string, newSalary: number, effectiveDate: string) => {
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
      let updatedFields: Partial<Employee> = {};
      const updatedTransfers = transfersHistory.map((tr) => {
        if (tr.id !== transferId) return tr;
        if (tr.type === "Department Transfer") updatedFields.department = tr.newValue;
        else if (tr.type === "Location Transfer") updatedFields.location = tr.newValue;
        else if (tr.type === "Manager Transfer") updatedFields.manager = tr.newValue;
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

  const bulkImportEmployees = (emps: Omit<Employee, "id" | "grossSalary" | "deductions" | "netPay" | "avatar">[]) => {
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
        avatar: "https://images.unsplash.com/photo-1651684215020-f7a5b6610f23?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200",
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
