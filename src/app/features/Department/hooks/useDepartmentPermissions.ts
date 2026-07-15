import { useAuth } from "../../../context/AuthContext";
import { useEmployees } from "../../../context/AppContext";
import { P, usePermissions, ROLE_IDS } from "../../../shared/permission-engine";
import { Department } from "../types/department.types";

export function useDepartmentPermissions() {
  const { user } = useAuth();
  const { employeesList } = useEmployees();
  const { hasPermissionKey, roleAssignments } = usePermissions();

  const currentEmployee = employeesList.find((e) => e.email === user?.email);
  const employeeDept = currentEmployee?.department || "";
  const employeeTeam = currentEmployee?.team || "";

  const role = user?.role || "Employee";

  // Determine roles based on permission engine assignments (fully backward-compatible)
  const isPlatformAdmin = roleAssignments.some(
    (a) => a.isActive && a.roleId === ROLE_IDS.PLATFORM_ADMIN
  );
  const isSuperAdmin = roleAssignments.some(
    (a) => a.isActive && a.roleId === ROLE_IDS.SUPER_ADMIN
  );
  const isHRManager = roleAssignments.some(
    (a) => a.isActive && a.roleId === ROLE_IDS.HR_MANAGER
  );
  const isFinance = roleAssignments.some(
    (a) => a.isActive && a.roleId === ROLE_IDS.FINANCE_MANAGER
  );
  const isManager = roleAssignments.some(
    (a) => a.isActive && a.roleId === ROLE_IDS.DEPT_MANAGER
  );
  const isTeamLead = roleAssignments.some(
    (a) => a.isActive && a.roleId === ROLE_IDS.TEAM_LEAD
  );

  // Resolve scope:
  // - Super Admin, HR Manager, Platform Admin: organization-level visibility
  // - Finance, Manager: department-level visibility (Finance views all, Manager views own)
  // - Team Lead: team-level visibility
  // - Employee: self-level visibility
  let scope: "organization" | "department" | "team" | "self" = "self";
  if (isSuperAdmin || isPlatformAdmin || isHRManager) {
    scope = "organization";
  } else if (isFinance || isManager) {
    scope = "department";
  } else if (isTeamLead) {
    scope = "team";
  }

  // Action Permissions
  // Super Admin & HR Manager have full management/edit abilities
  const canCreate = isSuperAdmin || isHRManager || hasPermissionKey(P.DEPARTMENTS_MANAGE);
  const canEdit = isSuperAdmin || isHRManager || hasPermissionKey(P.DEPARTMENTS_MANAGE);
  
  // Deleting is restricted only to Super Admins (and Platform Admin)
  const canDelete = isSuperAdmin || isPlatformAdmin;
  const canAssignHead = isSuperAdmin || isHRManager || hasPermissionKey(P.DEPARTMENTS_MANAGE);

  // Finance visibility rules: only Finance or Super Admin can see budgets & cost metrics
  const shouldShowFinance = isFinance || isSuperAdmin;

  // Filter visibility helper
  const isDeptVisible = (dept: Department) => {
    if (scope === "organization") return true;
    if (isFinance) return true; // Finance can see all departments (view-only)
    
    // For Managers, Team Leads, and Employees, check if it matches their department
    if (!employeeDept) return false;
    return dept.name.toLowerCase() === employeeDept.toLowerCase();
  };

  return {
    scope,
    userDept: employeeDept,
    userTeam: employeeTeam,
    role,
    canCreate,
    canEdit,
    canDelete,
    canAssignHead,
    shouldShowFinance,
    isDeptVisible,
  };
}
