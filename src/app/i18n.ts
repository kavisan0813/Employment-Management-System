import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      adminDashboard: "Admin Dashboard",
      mondayDate: "Monday, April 6, 2026",
      live: "Live",
      systemAllServicesOperational: "System: All services operational",
      headcountTrend: "Headcount Trend",
      deptDistribution: "Dept Distribution",
      pendingAdminActions: "Pending Admin Actions",
      viewAllActions: "View All Actions",
      recentSystemActivity: "Recent System Activity",
      moduleUsage: "Module Usage",
      mostUsedAttendance: "Most used: Attendance {{value}}%",
      userRolesDistribution: "User Roles Distribution",
      roleName: "Role Name",
      members: "Members",
      status: "Status",
      action: "Action",
      manageArrow: "Manage →",
      quickSystemActions: "Quick System Actions",
      leaveHistory: "Leave History",
    },
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "en",
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
