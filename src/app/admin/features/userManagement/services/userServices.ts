export interface PlatformUser {
  id: string;
  name: string;
  email: string;
  avatarInitials: string;
  organization: string;
  totalEmployees: number;
  status: "Active" | "Suspended" | "Trial";
  lastActive: string;
  role: string;
}

export interface FetchUsersParams {
  page: number;
  limit: number;
  search?: string;
  role?: string;
  organization?: string;
}

export interface FetchUsersResponse {
  data: PlatformUser[];
  total: number;
  page: number;
  limit: number;
}

// Roles & Permissions Mock API

export interface RolePermissions {
  employee: { view: boolean; create: boolean; edit: boolean; delete: boolean };
  leave: { view: boolean; approve: boolean; reject: boolean };
  payroll: { view: boolean; edit: boolean; generate_payslip: boolean };
  reports: { view: boolean };
  settings: { edit: boolean };
  billing: { view: boolean; edit: boolean };
}

export interface Role {
  id: string;
  name: string;
  isSystemRole: boolean;
  userCount: number;
  permissions: RolePermissions;
}

const defaultPermissions: RolePermissions = {
  employee: { view: false, create: false, edit: false, delete: false },
  leave: { view: false, approve: false, reject: false },
  payroll: { view: false, edit: false, generate_payslip: false },
  reports: { view: false },
  settings: { edit: false },
  billing: { view: false, edit: false },
};

let MOCK_ROLES: Role[] = [
  {
    id: "role_1",
    name: "Super Admin",
    isSystemRole: true,
    userCount: 0,
    permissions: {
      employee: { view: true, create: true, edit: true, delete: true },
      leave: { view: true, approve: true, reject: true },
      payroll: { view: true, edit: true, generate_payslip: true },
      reports: { view: true },
      settings: { edit: true },
      billing: { view: true, edit: true },
    },
  },
  {
    id: "role_2",
    name: "Company Admin",
    isSystemRole: true,
    userCount: 150,
    permissions: {
      employee: { view: true, create: true, edit: true, delete: true },
      leave: { view: true, approve: true, reject: true },
      payroll: { view: true, edit: true, generate_payslip: true },
      reports: { view: true },
      settings: { edit: true },
      billing: { view: true, edit: false },
    },
  },
  {
    id: "role_3",
    name: "HR",
    isSystemRole: true,
    userCount: 45,
    permissions: {
      ...defaultPermissions,
      employee: { view: true, create: true, edit: true, delete: false },
      leave: { view: true, approve: true, reject: true },
    },
  },
  {
    id: "role_4",
    name: "Manager",
    isSystemRole: true,
    userCount: 120,
    permissions: {
      ...defaultPermissions,
      employee: { view: true, create: false, edit: false, delete: false },
      leave: { view: true, approve: true, reject: true },
    },
  },
  {
    id: "role_5",
    name: "Employee",
    isSystemRole: true,
    userCount: 4500,
    permissions: {
      ...defaultPermissions,
      employee: { view: true, create: false, edit: false, delete: false },
      leave: { view: true, approve: false, reject: false },
    },
  },
];

export const fetchRoles = async (): Promise<Role[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...MOCK_ROLES]);
    }, 400);
  });
};

export const createRole = async (role: Partial<Role>): Promise<Role> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (
        MOCK_ROLES.some(
          (r) => r.name.toLowerCase() === role.name?.toLowerCase(),
        )
      ) {
        reject(new Error("Role name must be unique"));
        return;
      }
      const newRole: Role = {
        id: `role_${Date.now()}`,
        name: role.name || "New Role",
        isSystemRole: false,
        userCount: 0,
        permissions: role.permissions || defaultPermissions,
      };
      MOCK_ROLES.push(newRole);
      resolve(newRole);
    }, 600);
  });
};

export const deleteRole = async (roleId: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const role = MOCK_ROLES.find((r) => r.id === roleId);
      if (!role) {
        reject(new Error("Role not found"));
        return;
      }
      if (role.isSystemRole) {
        reject(new Error("Cannot delete system roles"));
        return;
      }
      MOCK_ROLES = MOCK_ROLES.filter((r) => r.id !== roleId);
      resolve();
    }, 600);
  });
};

export const updateRole = async (
  roleId: string,
  roleData: Partial<Role>,
): Promise<Role> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (
        roleData.name &&
        MOCK_ROLES.some(
          (r) =>
            r.name.toLowerCase() === roleData.name?.toLowerCase() &&
            r.id !== roleId,
        )
      ) {
        reject(new Error("Role name must be unique"));
        return;
      }
      const roleIndex = MOCK_ROLES.findIndex((r) => r.id === roleId);
      if (roleIndex === -1) {
        reject(new Error("Role not found"));
        return;
      }
      MOCK_ROLES[roleIndex] = { ...MOCK_ROLES[roleIndex], ...roleData };
      resolve(MOCK_ROLES[roleIndex]);
    }, 600);
  });
};
