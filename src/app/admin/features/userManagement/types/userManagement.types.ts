export interface UserSession {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  ipAddress: string;
  device: string;
  browser: string;
  loginTime: string;
  lastActivityTime: string;
  status: "Active" | "Expired" | "Terminated";
}

export interface CustomRole {
  id: string;
  name: string;
  description: string;
  status: "Active" | "Inactive";
  type: "System" | "Custom";
  hierarchyLevel: number; // 0 for Super Admin, 1 for Org Admin, etc.
}

export interface Permission {
  id: string;
  module: string;
  action: "View" | "Create" | "Edit" | "Delete" | "Approve" | "Export";
}

export interface RolePermission {
  roleId: string;
  permissionId: string;
}

// Map for UI table
export interface PermissionMatrixRow {
  module: string;
  view: boolean;
  create: boolean;
  edit: boolean;
  delete: boolean;
  approve: boolean;
  export: boolean;
}
