import React from "react";
import {
  LayoutDashboard,
  Building2,
  Users,
  CreditCard,
  Puzzle,
  Shield,
  Zap,
  Key,
  BarChart3,
  ScrollText,
  LifeBuoy,
  Megaphone,
  Mail,
  Bell,
  DatabaseBackup,
  Palette,
  Lock,
  BrainCircuit,
  Settings
} from "lucide-react";

const ICON_MAP = {
  dashboard: LayoutDashboard,
  organizations: Building2,
  users: Users,
  subscriptions: CreditCard,
  features: Puzzle,
  roles: Shield,
  integrations: Zap,
  api: Key,
  reports: BarChart3,
  auditLogs: ScrollText,
  support: LifeBuoy,
  announcements: Megaphone,
  email: Mail,
  notifications: Bell,
  backup: DatabaseBackup,
  branding: Palette,
  security: Lock,
  ai: BrainCircuit,
  settings: Settings
};

export function NavIcon({ name, ...props }: { name: string; [key: string]: any }) {
  const Icon = (ICON_MAP as Record<string, any>)[name] || Settings;
  return <Icon size={15} {...props} />;
}
