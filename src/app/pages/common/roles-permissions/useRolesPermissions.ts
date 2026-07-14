import { useState } from "react";
import { showToast } from "../../../components/workflow/ToastNotification";

export const rolesData = [
  {
    id: "super_admin",
    name: "Super Admin",
    members: 2,
    created: "2023-10-01",
    modified: "2026-04-15",
    isDefault: true,
    color: "#3B82F6",
  },
  {
    id: "hr_manager",
    name: "HR Manager",
    members: 5,
    created: "2023-10-01",
    modified: "2026-04-18",
    isDefault: true,
    color: "#8B5CF6",
  },
  {
    id: "finance",
    name: "Finance",
    members: 3,
    created: "2024-01-12",
    modified: "2026-03-22",
    isDefault: false,
    color: "#10B981",
  },
  {
    id: "manager",
    name: "Manager",
    members: 14,
    created: "2023-10-15",
    modified: "2026-04-20",
    isDefault: false,
    color: "#F59E0B",
  },
  {
    id: "employee",
    name: "Employee",
    members: 142,
    created: "2023-10-01",
    modified: "2026-01-01",
    isDefault: true,
    color: "#6B7280",
  },
];

export const initialPermissions = {
  dashboard: {
    super_admin: "full",
    hr_manager: "full",
    finance: "full",
    manager: "full",
    employee: "view",
  },
  employees: {
    super_admin: "full",
    hr_manager: "full",
    finance: "view",
    manager: "view",
    employee: "view",
  },
  attendance: {
    super_admin: "full",
    hr_manager: "full",
    finance: "view",
    manager: "full",
    employee: "view",
  },
  leave: {
    super_admin: "full",
    hr_manager: "full",
    finance: "view",
    manager: "full",
    employee: "view",
  },
  payroll: {
    super_admin: "full",
    hr_manager: "view",
    finance: "full",
    manager: "view",
    employee: "no",
  },
  recruitment: {
    super_admin: "full",
    hr_manager: "full",
    finance: "no",
    manager: "view",
    employee: "no",
  },
  performance: {
    super_admin: "full",
    hr_manager: "full",
    finance: "no",
    manager: "full",
    employee: "view",
  },
  reports: {
    super_admin: "full",
    hr_manager: "full",
    finance: "full",
    manager: "view",
    employee: "no",
  },
  settings: {
    super_admin: "full",
    hr_manager: "view",
    finance: "no",
    manager: "no",
    employee: "no",
  },
};

export const permissionGroups = [
  {
    id: "core",
    name: "Core Modules",
    modules: [
      { id: "dashboard", name: "Dashboard" },
      { id: "employees", name: "Employees" },
      { id: "settings", name: "Settings" },
    ],
  },
  {
    id: "hr",
    name: "HR Workspace",
    modules: [
      { id: "attendance", name: "Attendance" },
      { id: "leave", name: "Leave" },
      { id: "payroll", name: "Payroll" },
      { id: "recruitment", name: "Recruitment" },
      { id: "performance", name: "Performance" },
    ],
  },
  {
    id: "analytics",
    name: "Analytics",
    modules: [{ id: "reports", name: "Reports" }],
  },
];

export function useRolesPermissions() {
  const [expandedGroups, setExpandedGroups] = useState({
    core: true,
    hr: true,
    analytics: true,
  });

  const [permissions, setPermissions] = useState<Record<string, Record<string, string>>>(initialPermissions);
  const [rolesList, setRolesList] = useState(rolesData);
  const [selectedRoleForEdit, setSelectedRoleForEdit] = useState<(typeof rolesData)[0] | null>(null);
  const [roleForm, setRoleForm] = useState({
    name: "",
    description: "",
    status: "Active",
    permissions: {} as Record<string, string>,
  });
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const openCreateRoleModal = () => {
    setSelectedRoleForEdit(null);
    setRoleForm({
      name: "",
      description: "",
      status: "Active",
      permissions: Object.keys(initialPermissions).reduce(
        (acc, modId) => ({ ...acc, [modId]: "no" }),
        {}
      ),
    });
    setActiveModal("create_role");
  };

  const openEditRoleModal = (role: (typeof rolesData)[0]) => {
    setSelectedRoleForEdit(role);
    setRoleForm({
      name: role.name,
      description: `${role.name} access level`,
      status: "Active",
      permissions: Object.keys(initialPermissions).reduce(
        (acc, modId) => ({
          ...acc,
          [modId]: permissions[modId][role.id] || "no",
        }),
        {}
      ),
    });
    setActiveModal("edit_role");
  };

  const handleRoleSubmit = () => {
    if (!roleForm.name.trim()) {
      showToast("Role Name is required", "error");
      return;
    }
    const duplicate = rolesList.find(
      (r) =>
        r.name.toLowerCase() === roleForm.name.toLowerCase() &&
        (!selectedRoleForEdit || r.id !== selectedRoleForEdit.id)
    );
    if (duplicate) {
      showToast("A role with this name already exists", "error");
      return;
    }

    if (activeModal === "edit_role") {
      setActiveModal("confirm_edit_role");
    } else {
      setIsSubmitting(true);
      setTimeout(() => {
        const newRole = {
          id: roleForm.name.toLowerCase().replace(/\s+/g, "_"),
          name: roleForm.name,
          members: 0,
          created: new Date().toISOString().split("T")[0],
          modified: new Date().toISOString().split("T")[0],
          isDefault: false,
          color: "#8B5CF6",
        };
        setRolesList([...rolesList, newRole]);
        
        const newPerms = { ...permissions };
        Object.keys(roleForm.permissions).forEach((modId) => {
          newPerms[modId] = {
            ...newPerms[modId],
            [newRole.id]: roleForm.permissions[modId],
          };
        });
        setPermissions(newPerms);
        
        setIsSubmitting(false);
        setActiveModal(null);
        showToast("Role created successfully", "success");
      }, 600);
    }
  };

  const confirmEditRole = () => {
    if (!selectedRoleForEdit) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setRolesList((prev) =>
        prev.map((r) =>
          r.id === selectedRoleForEdit.id
            ? { ...r, name: roleForm.name, modified: new Date().toISOString().split("T")[0] }
            : r
        )
      );

      const newPerms = { ...permissions };
      Object.keys(roleForm.permissions).forEach((modId) => {
        newPerms[modId] = {
          ...newPerms[modId],
          [selectedRoleForEdit.id]: roleForm.permissions[modId],
        };
      });
      setPermissions(newPerms);

      setIsSubmitting(false);
      setActiveModal(null);
      showToast("Role updated successfully", "success");
    }, 600);
  };

  const toggleCell = (modId: string, roleId: string) => {
    const currentState = permissions[modId]?.[roleId] || "no";
    const nextState =
      currentState === "no"
        ? "view"
        : currentState === "view"
          ? "full"
          : "no";

    setPermissions((prev) => ({
      ...prev,
      [modId]: {
        ...prev[modId],
        [roleId]: nextState,
      },
    }));
  };

  return {
    rolesList,
    setRolesList,
    permissions,
    setPermissions,
    permissionGroups,
    expandedGroups,
    setExpandedGroups,
    roleForm,
    setRoleForm,
    selectedRoleForEdit,
    activeModal,
    setActiveModal,
    isSubmitting,
    openCreateRoleModal,
    openEditRoleModal,
    handleRoleSubmit,
    confirmEditRole,
    toggleCell,
  };
}
