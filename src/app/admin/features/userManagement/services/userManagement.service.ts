import { db } from "../../../mockData";
import { PlatformUser } from "../../../types";
import { UserSession, CustomRole } from "../types/userManagement.types";

export const userManagementService = {
  getUsers: (): PlatformUser[] => db.users.get(),
  saveUsers: (users: PlatformUser[]) => db.users.save(users),

  getSessions: (): UserSession[] => db.userSessions.get(),
  saveSessions: (sessions: UserSession[]) => db.userSessions.save(sessions),

  getRoles: (): CustomRole[] => db.customRoles.get(),
  saveRoles: (roles: CustomRole[]) => db.customRoles.save(roles),

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
};
