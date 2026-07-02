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
      title: "ORGANIZATION",
      items: [
        { id: "company", label: "Company Profile", iconName: "Building2" },
        { id: "departments", label: "Departments", iconName: "FolderTree" },
        { id: "locations", label: "Locations", iconName: "MapPin" },
        { id: "schedules", label: "Work Schedules", iconName: "CalendarDays" },
        { id: "holidays", label: "Holidays", iconName: "PartyPopper" },
      ],
    },
    {
      title: "HR POLICIES",
      items: [
        { id: "attendance_policy", label: "Attendance Policy", iconName: "ClipboardCheck" },
        { id: "leave_policy", label: "Leave Policy", iconName: "TreePalm" },
        { id: "payroll_settings", label: "Payroll Settings", iconName: "IndianRupee" },
        { id: "performance_settings", label: "Performance & Appraisal", iconName: "Star" },
      ],
    },
    {
      title: "SECURITY & ACCESS",
      items: [
        { id: "user_management", label: "User Management", iconName: "User" },
        { id: "roles", label: "Roles & Permissions", iconName: "Lock" },
        { id: "security", label: "Security Settings", iconName: "Shield" },
        { id: "audit_logs", label: "Audit Logs", iconName: "FileText" },
      ],
    },
    {
      title: "INTEGRATIONS",
      items: [
        { id: "connected_apps", label: "Connected Apps", iconName: "Link2" },
        { id: "api", label: "API & Tokens", iconName: "Key" },
        { id: "webhooks", label: "Webhooks", iconName: "Zap" },
      ],
    },
    {
      title: "NOTIFICATIONS",
      items: [
        { id: "email_templates", label: "Email Templates", iconName: "Mail" },
        { id: "notification_rules", label: "Notification Rules", iconName: "Bell" },
        { id: "sms", label: "SMS Settings", iconName: "Smartphone" },
      ],
    },
    {
      title: "SYSTEM PREFERENCES",
      items: [
        { id: "appearance", label: "Appearance", iconName: "Palette" },
        { id: "language", label: "Language & Region", iconName: "Globe" },
        { id: "backup", label: "Backup & Restore", iconName: "Database" },
        { id: "import_export", label: "Data Import / Export", iconName: "Download" },
      ],
    },
    {
      title: "WORKFLOW AUTOMATION",
      items: [
        { id: "workflows", label: "Approval Workflows", iconName: "GitPullRequest" },
        { id: "leave_approvals", label: "Leave Approvals", iconName: "CheckCircle" },
        { id: "shift_swaps", label: "Shift Swap Rules", iconName: "RefreshCw" },
      ],
    },
    {
      title: "MODULE SETTINGS",
      items: [
        { id: "docs", label: "Document Settings", iconName: "FileCode" },
        { id: "training", label: "Training Settings", iconName: "GraduationCap" },
        { id: "onboarding", label: "Onboarding Settings", iconName: "UserPlus" },
      ],
    },
  ],
  "HR Manager": [
    {
      title: "ORGANIZATION",
      items: [
        { id: "schedules", label: "Work Schedules", iconName: "CalendarDays" },
        { id: "holidays", label: "Holidays", iconName: "PartyPopper" },
      ],
    },
    {
      title: "HR POLICIES",
      items: [
        { id: "attendance_policy", label: "Attendance Policy", iconName: "ClipboardCheck" },
        { id: "leave_policy", label: "Leave Policy", iconName: "TreePalm" },
        { id: "payroll_settings", label: "Payroll Settings", iconName: "IndianRupee" },
        { id: "performance_settings", label: "Performance & Appraisal", iconName: "Star" },
      ],
    },
    {
      title: "NOTIFICATIONS",
      items: [
        { id: "email_templates", label: "Email Templates", iconName: "Mail" },
        { id: "notification_rules", label: "Notification Rules", iconName: "Bell" },
        { id: "sms", label: "SMS Settings", iconName: "Smartphone" },
      ],
    },
    {
      title: "SYSTEM PREFERENCES",
      items: [
        { id: "appearance", label: "Appearance", iconName: "Palette" },
        { id: "language", label: "Language & Region", iconName: "Globe" },
      ],
    },
    {
      title: "WORKFLOW AUTOMATION",
      items: [
        { id: "workflows", label: "Approval Workflows", iconName: "GitPullRequest" },
        { id: "leave_approvals", label: "Leave Approvals", iconName: "CheckCircle" },
        { id: "shift_swaps", label: "Shift Swap Rules", iconName: "RefreshCw" },
      ],
    },
    {
      title: "MODULE SETTINGS",
      items: [
        { id: "docs", label: "Document Settings", iconName: "FileCode" },
        { id: "training", label: "Training Settings", iconName: "GraduationCap" },
        { id: "onboarding", label: "Onboarding Settings", iconName: "UserPlus" },
      ],
    },
  ],
  "Employee": [
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
        { id: "emp_contact", label: "Contact HR / Support", iconName: "Headphones" },
      ],
    },
  ],
};
