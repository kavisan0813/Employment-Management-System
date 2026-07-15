import { useState } from "react";
import { Employee } from "../types/employee.types";

export function useEmployeeModals() {
  const [showImportModal, setShowImportModal] = useState(false);
  const [editEmployee, setEditEmployee] = useState<Employee | null>(null);
  const [deleteEmployee, setDeleteEmployee] = useState<Employee | null>(null);

  return {
    showImportModal,
    setShowImportModal,
    editEmployee,
    setEditEmployee,
    deleteEmployee,
    setDeleteEmployee,
  };
}
