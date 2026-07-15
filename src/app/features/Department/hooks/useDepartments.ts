import { useState } from "react";
import { Department, DepartmentInput } from "../types/department.types";
import { INITIAL_DEPARTMENTS } from "../constants/department.constants";
import { showToast } from "../../../components/workflow/ToastNotification";

export function useDepartments() {
  const [departmentsList, setDepartmentsList] = useState<Department[]>(() => {
    const saved = localStorage.getItem("viyan_departments");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Error loading departments from localStorage:", e);
      }
    }
    return INITIAL_DEPARTMENTS;
  });

  const saveDepartments = (list: Department[]) => {
    setDepartmentsList(list);
    localStorage.setItem("viyan_departments", JSON.stringify(list));
  };

  const addDepartment = (deptInput: DepartmentInput) => {
    const newDept: Department = {
      id: `DEPT${String(departmentsList.length + 1).padStart(3, "0")}`,
      name: deptInput.name,
      code: deptInput.code.toUpperCase(),
      head: deptInput.head,
      status: deptInput.status,
      employees: 0,
      activeEmployees: 0,
      onLeaveEmployees: 0,
      growth: 0,
      description: deptInput.description || "",
      createdDate: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      lastUpdated: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      parentDepartment: deptInput.parentDepartment || "None",
      teams: deptInput.teams || [],
      changeHistory: [],
      budgetAmount: deptInput.budgetAmount || "₹0L",
      budgetUsedPct: 0,
      budgetUsedAmount: "₹0L",
      budgetStatus: "green",
    };
    saveDepartments([...departmentsList, newDept]);
    showToast(
      "Department Created",
      "success",
      `${newDept.name} has been added.`,
    );
  };

  const updateDepartment = (id: string, updates: Partial<Department>) => {
    const updated = departmentsList.map((d) => {
      if (d.id === id) {
        return {
          ...d,
          ...updates,
          lastUpdated: new Date().toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }),
        };
      }
      return d;
    });
    saveDepartments(updated);
    showToast("Department Updated", "success", "Changes saved successfully.");
  };

  const deleteDepartment = (id: string) => {
    const target = departmentsList.find((d) => d.id === id);
    const updated = departmentsList.filter((d) => d.id !== id);
    saveDepartments(updated);
    if (target) {
      showToast(
        "Department Deleted",
        "success",
        `${target.name} has been removed.`,
      );
    }
  };

  const assignHead = (id: string, headName: string, reason?: string) => {
    const now = new Date().toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    const updated = departmentsList.map((d) => {
      if (d.id === id) {
        const changeHistory = d.changeHistory || [];
        const newRecord = {
          id: Math.random().toString(),
          changedBy: {
            name: "Admin",
            role: "Admin",
          },
          newValue: `Head: ${headName}`,
          date: now,
          comment: reason || "Manager Head re-assignment",
        };
        return {
          ...d,
          head: headName,
          changeHistory: [...changeHistory, newRecord],
          lastUpdated: now,
        };
      }
      return d;
    });
    saveDepartments(updated);
    showToast(
      "Head Assigned",
      "success",
      `${headName} is now leading the department.`,
    );
  };

  return {
    departmentsList,
    addDepartment,
    updateDepartment,
    deleteDepartment,
    assignHead,
  };
}
