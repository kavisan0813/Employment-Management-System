/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import { NavLink, useLocation } from "react-router";
import {
  Building2,
  Users,
  CreditCard,
  LayoutDashboard,
  AreaChart,
  History,
  MessageSquare,
  Settings,
  ShieldCheck,
  Megaphone,
  User,
} from "lucide-react";

import { useAuth } from "../../../context/AuthContext";

const CURRENT_ADMIN_EMAIL = "admin@ems.io";

export function Sidebar() {
  const location = useLocation();
  const { user } = useAuth();

  // Navigation schema defining the core clusters
  const superAdminGroups = [
    {
      title: "Core Monitor",
      id: "monitor",
      items: [
        {
          id: "dashboard",
          label: "Dashboard",
          icon: LayoutDashboard,
          path: "/platform-admin/dashboard",
        },
        {
          id: "reports",
          label: "Reports & Analytics",
          icon: AreaChart,
          path: "/platform-admin/reports",
        },
      ],
    },
    {
      title: "Tenant Portals",
      id: "tenants",
      items: [
        {
          id: "organizations",
          label: "Organizations",
          icon: Building2,
          path: "/platform-admin/organizations",
        },
        {
          id: "subscriptions",
          label: "Subscriptions",
          icon: CreditCard,
          path: "/platform-admin/subscriptions",
        },
        {
          id: "globalUsers",
          label: "Users",
          icon: Users,
          path: "/platform-admin/users",
        },
      ],
    },
    /* {
      title: "Workforce System",
      id: "workforce",
      items: [
        { id: "shiftTemplates", label: "Shifts", icon: Cpu, path: "/platform-admin/shifts" },
        { id: "biometricGateways", label: "Biometrics", icon: Fingerprint, path: "/platform-admin/biometrics" },
        { id: "complianceRules", label: "Compliance", icon: Layers, path: "/platform-admin/compliance" }
      ]
    }, */
    /*  {
      title: "Security & API",
      id: "security_api",
      items: [
        {
          id: "featureFlags",
          label: "Feature Flags",
          icon: ToggleLeft,
          path: "/platform-admin/features",
        },
        {
          id: "roleTemplates",
          label: "Roles",
          icon: Users2,
          path: "/platform-admin/roles",
        },
      ],
    }, */
    {
      title: "SLA & Helpdesk",
      id: "helpdesk",
      items: [
        {
          id: "supportTickets",
          label: "Support",
          icon: MessageSquare,
          path: "/platform-admin/support-tickets",
        },
        {
          id: "communication",
          label: "Communication",
          icon: Megaphone,
          path: "/platform-admin/communication",
        },
        {
          id: "auditLogs",
          label: "Audit Logs",
          icon: History,
          path: "/platform-admin/audit-logs",
        },
        // {
        //   id: "notifications",
        //   label: "Notifications",
        //   icon: Bell,
        //   path: "/platform-admin/notifications",
        // },
      ],
    },
    {
      title: "Operational Controls",
      id: "operations",
      items: [
        {
          id: "platformSettings",
          label: "Settings",
          icon: Settings,
          path: "/platform-admin/settings",
        },
      ],
    },
  ];

  return (
    <aside className="w-64 border-r border-gray-200 bg-white flex flex-col justify-between shrink-0 h-screen sticky top-0">
      <div className="flex flex-col overflow-y-auto flex-1">
        {/* Header branding lock */}
        <div className="p-4 border-b border-gray-200 flex items-center gap-2.5 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-extrabold text-sm tracking-widest">
            <User size={18} />
          </div>
          <div>
            <span className="font-extrabold text-xs tracking-wider block text-gray-950">
              PLATFORM ADMIN
            </span>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
              Consolidated Portals
            </span>
          </div>
        </div>

        {/* Menu Navigation (Always Expanded) */}
        <nav className="p-3.5 space-y-6">
          {superAdminGroups.map((group) => (
            <div key={group.title} className="space-y-1">
              <div className="px-2.5 mb-1">
                <span className="uppercase tracking-wider text-[9px] font-bold text-gray-400">
                  {group.title}
                </span>
              </div>

              {group.items.map((item) => {
                const IconComp = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <NavLink
                    key={item.id}
                    to={item.path}
                    className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      isActive
                        ? "bg-indigo-50/70 text-indigo-800"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-950"
                    }`}
                  >
                    <IconComp
                      className={`w-4 h-4 ${isActive ? "text-indigo-600" : "text-gray-400"}`}
                    />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </div>
          ))}
        </nav>
      </div>

      {/* Console Operator Badge Footer section */}
      <div className="p-4 border-t border-gray-200 bg-gray-50/50 space-y-2 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center font-bold text-xs text-indigo-700 border border-indigo-200 uppercase shrink-0">
            {user?.initials || "SR"}
          </div>
          <div className="overflow-hidden">
            <span className="block text-[11px] font-bold text-gray-900 truncate" title={user?.email || "platform@nexushr.com"}>
              {user?.email || "platform@nexushr.com"}
            </span>
            <span className="text-[10px] text-emerald-600 font-bold block uppercase tracking-wide">
              Platform System Admin
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 pt-1.5 border-t border-gray-150 text-[10px] text-gray-400 font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>Secure SSL Active &bull; Compliance</span>
        </div>
      </div>
    </aside>
  );
}

export { Sidebar as SidebarNav };
