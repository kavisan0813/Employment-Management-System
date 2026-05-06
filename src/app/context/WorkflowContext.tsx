import { createContext, useContext, useState, ReactNode } from "react";

interface WorkflowCounts {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
}

interface WorkflowContextType {
  counts: WorkflowCounts;
  updateCounts: (newCounts: Partial<WorkflowCounts>) => void;
}

const WorkflowContext = createContext<WorkflowContextType | undefined>(
  undefined,
);

export function WorkflowProvider({ children }: { children: ReactNode }) {
  const [counts, setCounts] = useState<WorkflowCounts>({
    total: 248,
    pending: 12,
    approved: 185,
    rejected: 51,
  });

  const updateCounts = (newCounts: Partial<WorkflowCounts>) => {
    setCounts((prev) => ({ ...prev, ...newCounts }));
  };

  return (
    <WorkflowContext.Provider value={{ counts, updateCounts }}>
      {children}
    </WorkflowContext.Provider>
  );
}

export function useWorkflow() {
  const context = useContext(WorkflowContext);
  if (context === undefined)
    throw new Error("useWorkflow must be used within a WorkflowProvider");
  return context;
}
