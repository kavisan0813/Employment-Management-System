import { useState } from "react";
import { Department } from "../types/department.types";

export function useDepartmentModals() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editDept, setEditDept] = useState<Department | null>(null);
  const [selectedDept, setSelectedDept] = useState<Department | null>(null);
  const [deleteConfirmDept, setDeleteConfirmDept] = useState<Department | null>(null);
  const [assignHeadDept, setAssignHeadDept] = useState<Department | null>(null);
  const [viewEmployeesDept, setViewEmployeesDept] = useState<Department | null>(null);
  const [moveDept, setMoveDept] = useState<Department | null>(null);
  const [showExportModal, setShowExportModal] = useState(false);

  return {
    showAddModal,
    setShowAddModal,
    editDept,
    setEditDept,
    selectedDept,
    setSelectedDept,
    deleteConfirmDept,
    setDeleteConfirmDept,
    assignHeadDept,
    setAssignHeadDept,
    viewEmployeesDept,
    setViewEmployeesDept,
    moveDept,
    setMoveDept,
    showExportModal,
    setShowExportModal,
  };
}
