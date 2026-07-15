import { useState } from "react";
import { Employee, EmployeeInput } from "../types/employee.types";

// Mock data or API integration
const initialEmployees: Employee[] = [
  // ... your sample data here
];

export function useEmployees() {
  const [employeesList, setEmployeesList] =
    useState<Employee[]>(initialEmployees);

  const updateEmployee = (id: string, updates: Partial<Employee>) => {
    setEmployeesList((prev) =>
      prev.map((emp) => (emp.id === id ? { ...emp, ...updates } : emp)),
    );
  };

  const deleteEmployee = (id: string) => {
    setEmployeesList((prev) => prev.filter((emp) => emp.id !== id));
  };

  const bulkImportEmployees = (newEmployees: EmployeeInput[]) => {
    const formatted = newEmployees.map((emp, index) => ({
      ...emp,
      id: `EMP${String(1000 + employeesList.length + index)}`,
      salary: Number(emp.salary),
      avatar: emp.avatar || `https://i.pravatar.cc/150?u=${emp.email}`,
    })) as Employee[];

    setEmployeesList((prev) => [...prev, ...formatted]);
  };

  return {
    employeesList,
    updateEmployee,
    deleteEmployee,
    bulkImportEmployees,
  };
}
