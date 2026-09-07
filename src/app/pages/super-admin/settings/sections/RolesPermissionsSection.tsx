import React, { useState } from "react";
import { useSettingsContext } from "../SettingsContext";
import * as Icons from "lucide-react";

export function RolesPermissionsSection() {
  const {
    rolesList,
    permissions,
    setPermissions,
    openCreateRoleModal,
    openEditRoleModal,
    showToast,
  } = useSettingsContext();

  const [selectedRoleId, setSelectedRoleId] = useState<string>("super_admin");
  const [roleSearch, setRoleSearch] = useState<string>("");
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});

  const selectedRole = (rolesList || []).find((r) => r.id === selectedRoleId) || rolesList[0];

  const permissionGroups = [
    {
      id: "core",
      name: "Core Modules",
      modules: [
        { id: "dashboard", name: "Dashboard" },
        { id: "employees", name: "Employees & Directory" },
        { id: "settings", name: "System Settings" },
      ],
    },
    {
      id: "hr",
      name: "HR Workspace",
      modules: [
        { id: "attendance", name: "Attendance & Rosters" },
        { id: "leave", name: "Leave & Entitlements" },
        { id: "payroll", name: "Payroll & Compensation" },
        { id: "recruitment", name: "Recruitment & Onboarding" },
        { id: "performance", name: "Performance & Appraisals" },
      ],
    },
    {
      id: "analytics",
      name: "Analytics & Reports",
      modules: [
        { id: "reports", name: "Reports & Exports" },
      ],
    },
  ];

  const filteredRoles = (rolesList || []).filter((r) =>
    r.name.toLowerCase().includes(roleSearch.toLowerCase())
  );

  const handlePermissionChange = (moduleId: string, level: string) => {
    setPermissions((prev) => ({
      ...prev,
      [moduleId]: {
        ...(prev[moduleId] || {}),
        [selectedRoleId]: level,
      },
    }));
  };

  const toggleGroup = (groupId: string) => {
    setCollapsedGroups((prev) => ({ ...prev, [groupId]: !prev[groupId] }));
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-foreground">
            Roles & Permissions Matrix
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage system roles, module access levels, and granular RBAC permissions.
          </p>
        </div>
        <button
          type="button"
          onClick={openCreateRoleModal}
          className="px-4 py-2 bg-[#00B87C] hover:bg-[#00B87C]/90 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs"
        >
          + Create Custom Role
        </button>
      </div>

      {/* TWO COLUMN MATRIX LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: ROLE LIST */}
        <div className="lg:col-span-4 bg-card rounded-2xl border border-border p-4 space-y-3">
          <div className="relative">
            <Icons.Search size={14} className="absolute left-3 top-2.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search roles..."
              value={roleSearch}
              onChange={(e) => setRoleSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-border bg-input-background text-foreground outline-none"
            />
          </div>

          <div className="space-y-1">
            {filteredRoles.map((role) => {
              const active = selectedRoleId === role.id;
              return (
                <div
                  key={role.id}
                  onClick={() => setSelectedRoleId(role.id)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                    active
                      ? "bg-[#00B87C]/10 border-[#00B87C] text-foreground"
                      : "bg-card border-border/60 hover:border-border text-foreground"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: role.color || "#00B87C" }}
                    />
                    <div>
                      <div className="text-xs font-bold">{role.name}</div>
                      <div className="text-[10px] text-muted-foreground">
                        {role.members} Users assigned
                      </div>
                    </div>
                  </div>
                  {role.isDefault && (
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-muted text-muted-foreground">
                      System
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT COLUMN: PERMISSION MATRIX FOR SELECTED ROLE */}
        <div className="lg:col-span-8 bg-card rounded-2xl border border-border p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
            <div className="flex items-center gap-3">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: selectedRole?.color || "#00B87C" }}
              />
              <div>
                <h3 className="text-base font-bold text-foreground">
                  {selectedRole?.name} Permissions
                </h3>
                <p className="text-xs text-muted-foreground">
                  Modified on {selectedRole?.modified || "2026-04-18"} • {selectedRole?.members} assigned members
                </p>
              </div>
            </div>
            {selectedRole && (
              <button
                type="button"
                onClick={() => openEditRoleModal(selectedRole)}
                className="px-3 py-1.5 text-xs font-semibold rounded-xl border border-border text-foreground hover:bg-muted cursor-pointer"
              >
                Edit Role Name
              </button>
            )}
          </div>

          {/* PERMISSION GROUPS (COLLAPSIBLE SECTIONS) */}
          <div className="space-y-4">
            {permissionGroups.map((group) => {
              const isCollapsed = !!collapsedGroups[group.id];
              return (
                <div key={group.id} className="border border-border/70 rounded-xl overflow-hidden">
                  <div
                    onClick={() => toggleGroup(group.id)}
                    className="p-3 bg-muted/40 flex items-center justify-between cursor-pointer select-none"
                  >
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      {group.name}
                    </span>
                    <Icons.ChevronDown
                      size={14}
                      className={`text-muted-foreground transition-transform duration-200 ${
                        isCollapsed ? "rotate-[-90deg]" : ""
                      }`}
                    />
                  </div>

                  {!isCollapsed && (
                    <div className="divide-y divide-border/50">
                      {group.modules.map((mod) => {
                        const currentLevel = permissions[mod.id]?.[selectedRoleId] || "no";
                        return (
                          <div
                            key={mod.id}
                            className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-muted/20 transition-colors"
                          >
                            <span className="text-xs font-semibold text-foreground">
                              {mod.name}
                            </span>
                            <div className="flex items-center gap-1.5">
                              {[
                                { level: "full", label: "Full Access" },
                                { level: "view", label: "View Only" },
                                { level: "no", label: "No Access" },
                              ].map((opt) => (
                                <button
                                  key={opt.level}
                                  type="button"
                                  onClick={() => handlePermissionChange(mod.id, opt.level)}
                                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                                    currentLevel === opt.level
                                      ? opt.level === "full"
                                        ? "bg-[#00B87C] text-white"
                                        : opt.level === "view"
                                        ? "bg-blue-500 text-white"
                                        : "bg-rose-500 text-white"
                                      : "bg-muted/50 text-muted-foreground hover:bg-muted"
                                  }`}
                                >
                                  {opt.label}
                                </button>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex justify-end pt-4 border-t border-border">
            <button
              type="button"
              onClick={() => showToast(`Permissions updated for ${selectedRole?.name}`, "success")}
              className="px-4 py-2 bg-[#00B87C] hover:bg-[#00B87C]/90 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
            >
              Save Permissions Matrix
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
