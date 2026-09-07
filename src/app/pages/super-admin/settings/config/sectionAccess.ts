// Section access configurations mapping role -> allowed section keys

export interface SettingsItem {
  id: string;
  label: string;
  iconName: string; // Storing as string to look up dynamically
}

export interface SettingsCategory {
  title: string;
  items: SettingsItem[];
}

export const ROLE_NAVIGATION: Record<string, SettingsCategory[]> = {
  "Super Admin": [
    {
      title: "GENERAL",
      items: [
        { id: "organization", label: "Organization", iconName: "Building2" },
        { id: "appearance", label: "Appearance & Branding", iconName: "Palette" },
      ],
    },
    {
      title: "GOVERNANCE",
      items: [
        { id: "policies", label: "Policies", iconName: "ShieldCheck" },
        { id: "workflows", label: "Approval Workflows", iconName: "GitPullRequest" },
        { id: "roles", label: "Roles & Permissions", iconName: "Lock" },
        { id: "features", label: "Feature Management", iconName: "Sliders" },
      ],
    },
    {
      title: "COMMUNICATION",
      items: [
        { id: "notifications", label: "Notification Preferences", iconName: "Bell" },
      ],
    },
    {
      title: "SECURITY",
      items: [
        { id: "security", label: "Security & Sessions", iconName: "Shield" },
        { id: "integrations", label: "Integrations", iconName: "Link2" },
      ],
    },
    {
      title: "SYSTEM",
      items: [
        { id: "audit_logs", label: "Audit & Logs", iconName: "FileText" },
      ],
    },
  ],
  "HR Manager": [
    {
      title: "GENERAL",
      items: [
        { id: "organization", label: "Organization", iconName: "Building2" },
        { id: "appearance", label: "Appearance & Branding", iconName: "Palette" },
      ],
    },
    {
      title: "GOVERNANCE",
      items: [
        { id: "policies", label: "Policies", iconName: "ShieldCheck" },
        { id: "workflows", label: "Approval Workflows", iconName: "GitPullRequest" },
        { id: "roles", label: "Roles & Permissions", iconName: "Lock" },
      ],
    },
    {
      title: "COMMUNICATION",
      items: [
        { id: "notifications", label: "Notification Preferences", iconName: "Bell" },
      ],
    },
    {
      title: "SYSTEM",
      items: [
        { id: "audit_logs", label: "Audit & Logs", iconName: "FileText" },
      ],
    },
  ],
  Employee: [
    {
      title: "ACCOUNT",
      items: [
        { id: "emp_security", label: "Account & Security", iconName: "Lock" },
        { id: "emp_privacy", label: "Privacy", iconName: "ShieldCheck" },
      ],
    },
    {
      title: "PREFERENCES",
      items: [
        { id: "emp_notifications", label: "Notifications", iconName: "Bell" },
        { id: "emp_appearance", label: "Appearance", iconName: "Moon" },
        { id: "emp_language", label: "Language & Region", iconName: "Globe" },
      ],
    },
    {
      title: "DEVICES & DATA",
      items: [
        { id: "emp_devices", label: "Connected Devices", iconName: "Laptop" },
        { id: "emp_data", label: "My Data & Downloads", iconName: "Download" },
      ],
    },
    {
      title: "SUPPORT",
      items: [
        { id: "emp_help", label: "Help & FAQ", iconName: "HelpCircle" },
        {
          id: "emp_contact",
          label: "Contact HR / Support",
          iconName: "Headphones",
        },
      ],
    },
  ],
};
