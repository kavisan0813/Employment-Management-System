import { useState, useEffect, useMemo } from "react";
import { PlatformUser, AdminTeamMember } from "../../../types";
import { UserSession, CustomRole } from "../types/userManagement.types";
import { userManagementService } from "../services/userManagement.service";
import { db } from "../../../mockData";

export function useUserManagement() {
  const [users, setUsers] = useState<PlatformUser[]>([]);
  const [sessions, setSessions] = useState<UserSession[]>([]);
  const [roles, setRoles] = useState<CustomRole[]>([]);
  const [superAdmins, setSuperAdmins] = useState<AdminTeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [userSearch, setUserSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [orgFilter, setOrgFilter] = useState("ALL");

  const loadData = () => {
    setLoading(true);
    setUsers(userManagementService.getUsers());
    setSessions(userManagementService.getSessions());
    setRoles(userManagementService.getRoles());
    setSuperAdmins(userManagementService.getSuperAdmins());
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchSearch =
        u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
        u.email.toLowerCase().includes(userSearch.toLowerCase());
      const matchRole = roleFilter === "ALL" || u.role === roleFilter;
      const matchStatus = statusFilter === "ALL" || u.status === statusFilter;
      const matchOrg = orgFilter === "ALL" || u.organizationId === orgFilter;

      return matchSearch && matchRole && matchStatus && matchOrg;
    });
  }, [users, userSearch, roleFilter, statusFilter, orgFilter]);

  const killSession = (sessionId: string) => {
    userManagementService.killSession(sessionId);
    loadData(); // refresh
  };

  const killAllSessions = () => {
    sessions
      .filter((s) => s.status === "Active")
      .forEach((s) => userManagementService.killSession(s.id));
    loadData();
  };

  const updateUserStatus = (userId: string, status: PlatformUser["status"]) => {
    userManagementService.updateUserStatus(userId, status);
    loadData();
  };

  const updateSuperAdminStatus = (adminId: string, status: AdminTeamMember["status"]) => {
    userManagementService.updateSuperAdminStatus(adminId, status);
    loadData();
  };

  const deleteUser = (userId: string) => {
    userManagementService.deleteUser(userId);
    loadData();
  };

  const updateUser = (userId: string, updates: Partial<PlatformUser>) => {
    userManagementService.updateUser(userId, updates);
    loadData();
  };

  const organizations = useMemo(() => db.organizations.get(), []);

  return {
    users,
    filteredUsers,
    sessions,
    roles,
    superAdmins,
    setRoles,
    loading,
    organizations,
    filters: {
      userSearch,

      setUserSearch,
      roleFilter,
      setRoleFilter,
      statusFilter,
      setStatusFilter,
      orgFilter,
      setOrgFilter,
    },
    actions: {
      loadData,
      killSession,
      killAllSessions,
      updateUserStatus,
      updateSuperAdminStatus,
      updateUser,
      deleteUser,
    },
  };
}
