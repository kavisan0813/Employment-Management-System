/**
 * Sidebar navigation structure.
 * Icons are referenced by name (see components/layout/nav-icon.jsx) instead of
 * storing JSX here, so this file stays plain data — easy to test, easy to drive
 * from a permissions/feature-flag check later.
 */
export const NAV_CONFIG = [
  {
    group: "",
    items: [{ id: "dashboard", label: "Dashboard", iconName: "dashboard", path: "/" }],
  },
  {
    group: "Tenant Management",
    items: [
      { id: "organizations", label: "Organizations", iconName: "organizations", path: "/organizations" },
      { id: "global-users", label: "Global Users", iconName: "users", path: "/users" },
      { id: "subscriptions", label: "Subscriptions", iconName: "subscriptions", path: "/subscriptions" },
    ],
  },
  {
    group: "Platform",
    items: [
      { id: "feature-management", label: "Feature Management", iconName: "features", path: "/features" },
      { id: "role-templates", label: "Role Templates", iconName: "roles", path: "/roles" },
      { id: "integrations", label: "Integrations", iconName: "integrations", path: "/integrations" },
      { id: "api-management", label: "API Management", iconName: "api", path: "/api-management" },
    ],
  },
  {
    group: "Analytics",
    items: [
      { id: "reports", label: "Reports", iconName: "reports", path: "/reports" },
      { id: "audit-logs", label: "Audit Logs", iconName: "auditLogs", path: "/audit-logs" },
    ],
  },
  {
    group: "Support",
    items: [
      { id: "support-tickets", label: "Support Tickets", iconName: "support", path: "/support-tickets" },
      { id: "announcements", label: "Announcements", iconName: "announcements", path: "/announcements" },
    ],
  },
  {
    group: "System",
    items: [
      { id: "email-templates", label: "Email Templates", iconName: "email", path: "/settings/email-templates" },
      { id: "notifications", label: "Notifications", iconName: "notifications", path: "/settings/notifications" },
      { id: "backup-restore", label: "Backup & Restore", iconName: "backup", path: "/settings/backup" },
      { id: "branding", label: "Branding", iconName: "branding", path: "/settings/branding" },
      { id: "security", label: "Security", iconName: "security", path: "/settings/security" },
      { id: "ai-settings", label: "AI Settings", iconName: "ai", path: "/settings/ai" },
      { id: "settings", label: "Settings", iconName: "settings", path: "/settings" },
    ],
  },
];
