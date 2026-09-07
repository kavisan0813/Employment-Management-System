import React from "react";
import * as Icons from "lucide-react";

interface CategoryCardProps {
  id: string;
  title: string;
  description: string;
  iconName: string;
  statusText: string;
  onSelect: (id: string) => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({
  id,
  title,
  description,
  iconName,
  statusText,
  onSelect,
}) => {
  const IconComp = Icons[iconName as keyof typeof Icons] || Icons.Settings;
  const Icon = IconComp as React.ComponentType<{ size?: number; className?: string }>;

  return (
    <div
      onClick={() => onSelect(id)}
      className="p-5 rounded-2xl border border-border bg-card hover:border-[#00B87C]/40 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group select-none"
    >
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="w-10 h-10 rounded-xl bg-[#00B87C]/10 text-[#00B87C] group-hover:bg-[#00B87C] group-hover:text-white transition-all flex items-center justify-center">
            <Icon size={20} />
          </div>
          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-muted text-muted-foreground group-hover:bg-[#00B87C]/10 group-hover:text-[#00B87C] transition-all">
            {statusText}
          </span>
        </div>
        <h3 className="text-sm font-bold text-foreground group-hover:text-[#00B87C] transition-colors mb-1">
          {title}
        </h3>
        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
          {description}
        </p>
      </div>

      <div className="mt-4 pt-3 border-t border-border/50 flex items-center justify-between text-xs font-semibold text-[#00B87C]">
        <span>Manage</span>
        <Icons.ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
      </div>
    </div>
  );
};

interface SettingsOverviewProps {
  onSelectCategory: (id: string) => void;
  policyCount?: number;
  rolesCount?: number;
  flagsCount?: number;
}

export const SettingsOverview: React.FC<SettingsOverviewProps> = ({
  onSelectCategory,
  policyCount = 12,
  rolesCount = 5,
  flagsCount = 14,
}) => {
  const categories = [
    {
      id: "organization",
      title: "Organization",
      description: "Manage company identity, localized settings, fiscal year, and site locations.",
      iconName: "Building2",
      statusText: "Active Profile",
    },
    {
      id: "appearance",
      title: "Appearance & Branding",
      description: "Customize theme appearance, color palette, display density, logo, and brand assets.",
      iconName: "Palette",
      statusText: "Theme & Logo",
    },
    {
      id: "policies",
      title: "Policies",
      description: "Manage organization-wide HR, Leave, Payroll, and Security policies.",
      iconName: "ShieldCheck",
      statusText: `${policyCount} Active Policies`,
    },
    {
      id: "workflows",
      title: "Approval Workflows",
      description: "Configure multi-level approval routing for leave, attendance, expenses, and payroll.",
      iconName: "GitPullRequest",
      statusText: "5 Workflows",
    },
    {
      id: "roles",
      title: "Roles & Permissions",
      description: "Define role-based access control (RBAC), access levels, and module permissions matrix.",
      iconName: "Lock",
      statusText: `${rolesCount} System Roles`,
    },
    {
      id: "features",
      title: "Feature Management",
      description: "Toggle platform feature flags, beta rollouts, and organization plan overrides.",
      iconName: "Sliders",
      statusText: `${flagsCount} Feature Flags`,
    },
    {
      id: "notifications",
      title: "Notifications",
      description: "Manage event notification rules, delivery channels (In-App, Email, SMS, Push), and templates.",
      iconName: "Bell",
      statusText: "4 Channels",
    },
    {
      id: "security",
      title: "Security & Sessions",
      description: "Configure password policies, session timeouts, MFA enforcement, and active session rules.",
      iconName: "Shield",
      statusText: "Enhanced Security",
    },
    {
      id: "integrations",
      title: "Connected Apps & API",
      description: "Manage third-party connectors (Slack, Teams), REST API access keys, and webhooks.",
      iconName: "Link2",
      statusText: "Apps & Tokens",
    },
    {
      id: "audit_logs",
      title: "Audit & Logs",
      description: "Inspect system event audit trails, database backup schedules, and data import/export logs.",
      iconName: "FileText",
      statusText: "Audit Records",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-base font-bold text-foreground mb-1">
          Category Quick Access
        </h2>
        <p className="text-xs text-muted-foreground">
          Select a setting category below or use the left menu to navigate directly.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {categories.map((cat) => (
          <CategoryCard
            key={cat.id}
            id={cat.id}
            title={cat.title}
            description={cat.description}
            iconName={cat.iconName}
            statusText={cat.statusText}
            onSelect={onSelectCategory}
          />
        ))}
      </div>
    </div>
  );
};
