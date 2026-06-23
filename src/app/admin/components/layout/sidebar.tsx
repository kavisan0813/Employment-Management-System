/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React, { useState } from "react";
import { NavLink, useLocation } from "react-router";
import {
  Building2,
  Users,
  CreditCard,
  LayoutDashboard,
  ToggleLeft,
  Users2,
  GitMerge,
  Terminal,
  AreaChart,
  History,
  MessageSquare,
  Settings,
  ShieldCheck,
  Megaphone,
  Fingerprint,
  Cpu,
  Layers,
  HelpCircle,
  ChevronDown,
  Zap,
  User,
} from "lucide-react";

const CURRENT_ADMIN_EMAIL = "admin@ems.io";

export function Sidebar() {
  const location = useLocation();

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
          label: "Analytics",
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
    {
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
    },
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
          id: "announcements",
          label: "Announcements",
          icon: Megaphone,
          path: "/platform-admin/announcements",
        },
        {
          id: "auditLogs",
          label: "Audit Logs",
          icon: History,
          path: "/platform-admin/audit-logs",
        },
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

  // Auto-expand a group if the user is currently on a path belonging to it
  const initialOpenState = superAdminGroups.reduce(
    (acc, group) => {
      const isCurrentPathInGroup = group.items.some(
        (item) => location.pathname === item.path,
      );
      acc[group.id] = isCurrentPathInGroup;
      return acc;
    },
    {} as Record<string, boolean>,
  );

  const [openGroups, setOpenOpenGroups] =
    useState<Record<string, boolean>>(initialOpenState);

  const toggleGroup = (groupId: string) => {
    setOpenOpenGroups((prev) => ({
      ...prev,
      [groupId]: !prev[groupId],
    }));
  };

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

        {/* Switch to HRMS Workspace Button */}
        <div className="px-3.5 pt-3.5 shrink-0">
          <NavLink
            to="/hr/dashboard"
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 hover:bg-indigo-100 hover:border-indigo-200 transition-all cursor-pointer shadow-sm"
          >
            <Zap className="w-3.5 h-3.5 fill-indigo-600 text-indigo-600" />
            <span>Go to HRMS Workspace</span>
          </NavLink>
        </div>

        {/* Menugroups Accordion Iteration */}
        <nav className="p-3.5 space-y-2">
          {superAdminGroups.map((group) => {
            const isOpen = !!openGroups[group.id];
            const isGroupActive = group.items.some(
              (item) => location.pathname === item.path,
            );

            return (
              <div key={group.id} className="space-y-1">
                {/* Header Trigger Accordion Button */}
                <button
                  onClick={() => toggleGroup(group.id)}
                  className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer select-none border border-transparent ${
                    isGroupActive
                      ? "text-indigo-900 bg-indigo-50/40"
                      : "text-gray-400 hover:bg-gray-50 hover:text-gray-700"
                  }`}
                >
                  <span className="uppercase tracking-wider text-[9px]">
                    {group.title}
                  </span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${
                      isOpen ? "transform rotate-180 text-indigo-600" : ""
                    }`}
                  />
                </button>

                {/* Sub-Items Navigation List with Animation Block */}
                <div
                  className={`space-y-0.5 transition-all duration-200 overflow-hidden ${
                    isOpen
                      ? "max-h-60 opacity-100 pl-1.5 pt-0.5"
                      : "max-h-0 opacity-0 pointer-events-none"
                  }`}
                >
                  {group.items.map((item) => {
                    const IconComp = item.icon;
                    return (
                      <NavLink
                        key={item.id}
                        to={item.path}
                        className={({ isActive }) =>
                          `w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                            isActive
                              ? "bg-indigo-50/70 text-indigo-800"
                              : "text-gray-600 hover:bg-gray-100 hover:text-gray-950"
                          }`
                        }
                      >
                        {({ isActive }) => (
                          <>
                            <IconComp
                              className={`w-4 h-4 ${isActive ? "text-indigo-600" : "text-gray-400"}`}
                            />
                            <span>{item.label}</span>
                          </>
                        )}
                      </NavLink>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </nav>
      </div>

      {/* Console Operator Badge Footer section */}
      <div className="p-4 border-t border-gray-200 bg-gray-50/50 space-y-2 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center font-bold text-xs text-indigo-700 border border-indigo-200 uppercase shrink-0">
            PK
          </div>
          <div className="overflow-hidden">
            <span className="block text-[11px] font-bold text-gray-900 truncate">
              {CURRENT_ADMIN_EMAIL}
            </span>
            <span className="text-[10px] text-emerald-600 font-bold block uppercase tracking-wide">
              Platform Super Admin
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
