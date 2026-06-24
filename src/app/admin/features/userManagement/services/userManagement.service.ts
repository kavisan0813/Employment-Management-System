import { db } from "../../../mockData";
import { PlatformUser } from "../../../types";
import { UserSession, CustomRole } from "../types/userManagement.types";
import { AdminTeamMember } from "../../../types";

export const userManagementService = {
  getUsers: (): PlatformUser[] => db.users.get(),
  saveUsers: (users: PlatformUser[]) => db.users.save(users),

  getSessions: (): UserSession[] => db.userSessions.get(),
  saveSessions: (sessions: UserSession[]) => db.userSessions.save(sessions),

  getRoles: (): CustomRole[] => db.customRoles.get(),
  saveRoles: (roles: CustomRole[]) => db.customRoles.save(roles),

  getSuperAdmins: (): AdminTeamMember[] => db.settings.getTeam(),
  saveSuperAdmins: (admins: AdminTeamMember[]) => db.settings.saveTeam(admins),
  updateSuperAdminStatus: (adminId: string, status: AdminTeamMember["status"]) => {
    const admins = db.settings.getTeam();
    db.settings.saveTeam(admins.map(a => a.id === adminId ? { ...a, status } : a));
  },

  killSession: (sessionId: string) => {
    const sessions = db.userSessions.get();
    const updated = sessions.map((s) =>
      s.id === sessionId ? { ...s, status: "Terminated" as const } : s,
    );
    db.userSessions.save(updated);
  },

  updateUserStatus: (userId: string, status: PlatformUser["status"]) => {
    const users = db.users.get();
    const updated = users.map((u) => (u.id === userId ? { ...u, status } : u));
    db.users.save(updated);
  },

  deleteUser: (userId: string) => {
    const users = db.users.get();
    db.users.save(users.filter((u) => u.id !== userId));
  },

  updateUser: (userId: string, updates: Partial<PlatformUser>) => {
    const users = db.users.get();
    const updated = users.map((u) =>
      u.id === userId ? { ...u, ...updates } : u,
    );
    db.users.save(updated);
  },
};
