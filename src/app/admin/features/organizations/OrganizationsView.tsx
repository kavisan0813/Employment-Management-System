/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { db, pushAuditLog } from "../../mockData";
import {
  Organization,
  PlatformUser,
  Subscription,
  EntityStatus,
} from "../../types";
import {
  Plus,
  Search,
  ChevronDown,
  CheckSquare,
  Square,
  X,
  Building2,
  ShieldAlert,
  Mail,
  Globe,
  MapPin,
  Users,
  Activity,
  Trash2,
  ArrowUpRight,
} from "lucide-react";

// Current platform admin performing actions. Replace with the authenticated
// admin's identity once auth is wired up — was previously hardcoded per-call.
const CURRENT_ADMIN_EMAIL = "admin@ems.io";

interface OrganizationsViewProps {
  initialSelectId?: string | null;
  clearInitialSelectId?: () => void;
  onNavigate?: (view: string, targetId?: string) => void;
}

const REGIONS = [
  "North America",
  "Europe",
  "Asia Pacific",
  "United Kingdom",
  "Latin America",
];

const PLAN_PRICING: Record<"Starter" | "Growth" | "Enterprise", number> = {
  Starter: 99,
  Growth: 1200,
  Enterprise: 3500,
};

export default function OrganizationsView({
  initialSelectId = null,
  clearInitialSelectId = () => {},
  onNavigate = () => {},
}: OrganizationsViewProps) {
  const [orgs, setOrgs] = useState<Organization[]>([]);
  const [selectedOrgs, setSelectedOrgs] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Filters
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [planFilter, setPlanFilter] = useState<string>("ALL");
  const [regionFilter, setRegionFilter] = useState<string>("ALL");

  // Selection detail drawer
  const [drawerOrgId, setDrawerOrgId] = useState<string | null>(null);
  const [drawerTab, setDrawerTab] = useState<
    "overview" | "users" | "billing" | "activity" | "settings"
  >("overview");

  // Modals
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isSuspendConfirmOpen, setIsSuspendConfirmOpen] = useState(false);

  // Form state
  const [selectedFormOrg, setSelectedFormOrg] = useState<Organization | null>(
    null,
  );
  const [formName, setFormName] = useState("");
  const [formDomain, setFormDomain] = useState("");
  const [formPlan, setFormPlan] = useState<"Starter" | "Growth" | "Enterprise">(
    "Starter",
  );
  const [formRegion, setFormRegion] = useState("North America");
  const [formOwnerEmail, setFormOwnerEmail] = useState("");
  const [formSeatLimit, setFormSeatLimit] = useState(50);
  const [formIndustry, setFormIndustry] = useState("Technology");
  const [formPassword, setFormPassword] = useState("");

  // Delete double-verification field
  const [deleteInputName, setDeleteInputName] = useState("");

  const refreshData = () => {
    setOrgs(db.organizations.get());
  };

  useEffect(() => {
    refreshData();
  }, []);

  useEffect(() => {
    if (initialSelectId) {
      setDrawerOrgId(initialSelectId);
      setDrawerTab("overview");
      clearInitialSelectId();
    }
  }, [initialSelectId]);

  const filteredOrgs = orgs.filter((org) => {
    const matchesSearch =
      org.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      org.domain.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || org.status === statusFilter;
    const matchesPlan = planFilter === "ALL" || org.plan === planFilter;
    const matchesRegion = regionFilter === "ALL" || org.region === regionFilter;
    return matchesSearch && matchesStatus && matchesPlan && matchesRegion;
  });

  const toggleSelectAll = () => {
    setSelectedOrgs(
      selectedOrgs.length === filteredOrgs.length
        ? []
        : filteredOrgs.map((o) => o.id),
    );
  };

  const toggleSelect = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedOrgs((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  // ---- Bulk actions ----
  const handleBulkSuspend = () => {
    const currentOrgs = db.organizations.get();
    const updated = currentOrgs.map((o) =>
      selectedOrgs.includes(o.id) ? { ...o, status: "Suspended" as const } : o,
    );
    db.organizations.save(updated);
    pushAuditLog(
      "org.bulk_suspend",
      "Admin Action",
      CURRENT_ADMIN_EMAIL,
      "platform_admin",
      null,
      "Active",
      { count: String(selectedOrgs.length), orgIds: selectedOrgs.join(", ") },
    );
    const count = selectedOrgs.length;
    setSelectedOrgs([]);
    refreshData();
    if (drawerOrgId && selectedOrgs.includes(drawerOrgId)) setDrawerOrgId(null);
    toast(`Suspended ${count} tenant organization${count === 1 ? "" : "s"}.`);
  };

  const handleBulkExport = () => {
    const targets = orgs.filter((o) => selectedOrgs.includes(o.id));
    const header = "ID,Name,Domain,Plan,Status,Users,MRR,Region,JoinedAt\n";
    const rows = targets
      .map(
        (t) =>
          `${t.id},"${t.name}",${t.domain},${t.plan},${t.status},${t.userCount},${t.mrr},"${t.region}",${t.joinedAt}`,
      )
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `ems-organizations-export-${Date.now()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    setSelectedOrgs([]);
  };

  // ---- Create ----
  const openCreateDialog = () => {
    setFormName("");
    setFormDomain("");
    setFormPlan("Starter");
    setFormRegion("North America");
    setFormOwnerEmail("");
    setFormSeatLimit(20);
    setFormIndustry("Technology");
    setFormPassword("");
    setIsCreateOpen(true);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formDomain || !formOwnerEmail || !formPassword) {
      toast("Name, domain, owner email, and password are required.", "error");
      return;
    }

    const newOrg: Organization = {
      id: `org-${Date.now()}`,
      name: formName,
      domain: formDomain,
      status: "Pending",
      plan: formPlan,
      userCount: 1,
      seatLimit: Number(formSeatLimit),
      mrr: PLAN_PRICING[formPlan],
      industry: formIndustry,
      region: formRegion,
      ownerEmail: formOwnerEmail,
      joinedAt: new Date().toISOString(),
      lastActiveAt: new Date().toISOString(),
    };

    db.organizations.save([newOrg, ...db.organizations.get()]);

    const newSub: Subscription = {
      id: `sub-${Date.now()}`,
      organization: newOrg.name,
      organizationId: newOrg.id,
      plan: newOrg.plan,
      status: "Pending",
      billingCycle: "Monthly",
      amount: newOrg.mrr,
      currency: "USD",
      startDate: new Date().toISOString().slice(0, 10),
      renewalDate: null,
      paymentMethodLast4: null,
      failedPaymentCount: 0,
    };
    db.subscriptions.save([newSub, ...db.subscriptions.get()]);

    const newUser: PlatformUser = {
      id: `user-${Date.now()}`,
      name: "Owner Account",
      email: formOwnerEmail,
      status: "Pending",
      role: "Org Admin",
      organization: formName,
      organizationId: newOrg.id,
      lastLoginAt: new Date().toISOString(),
      mfaEnabled: false,
      joinedAt: new Date().toISOString(),
      password: formPassword,
    };
    db.users.save([newUser, ...db.users.get()]);

    pushAuditLog(
      "org.create",
      "Admin Action",
      CURRENT_ADMIN_EMAIL,
      "platform_admin",
      newOrg.name,
      "Active",
      { domain: newOrg.domain, owner: newOrg.ownerEmail, plan: newOrg.plan },
    );

    setIsCreateOpen(false);
    refreshData();
    toast(`${newOrg.name} created successfully.`);
  };

  // ---- Edit ----
  const openEditDialog = (org: Organization, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedFormOrg(org);
    setFormName(org.name);
    setFormDomain(org.domain);
    setFormPlan(org.plan);
    setFormRegion(org.region);
    setFormOwnerEmail(org.ownerEmail);
    setFormSeatLimit(org.seatLimit);
    setFormIndustry(org.industry);
    setIsEditOpen(true);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFormOrg) return;

    const updated = db.organizations.get().map((o) =>
      o.id === selectedFormOrg.id
        ? {
            ...o,
            name: formName,
            domain: formDomain,
            plan: formPlan,
            region: formRegion,
            ownerEmail: formOwnerEmail,
            seatLimit: Number(formSeatLimit),
            industry: formIndustry,
            mrr: PLAN_PRICING[formPlan],
          }
        : o,
    );

    db.organizations.save(updated);
    pushAuditLog(
      "org.edit",
      "Admin Action",
      CURRENT_ADMIN_EMAIL,
      "platform_admin",
      formName,
      "Active",
      { id: selectedFormOrg.id, plan: formPlan, seats: String(formSeatLimit) },
    );

    setIsEditOpen(false);
    refreshData();
    toast(`${formName} updated.`);
  };

  // ---- Suspend / reactivate ----
  const promptSuspendToggle = (org: Organization, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedFormOrg(org);
    setIsSuspendConfirmOpen(true);
  };

  const handleSuspendToggleConfirm = () => {
    if (!selectedFormOrg) return;
    const nextStatus = (
      selectedFormOrg.status === "Suspended" ? "Active" : "Suspended"
    ) as EntityStatus;
    const updated = db.organizations
      .get()
      .map((o) =>
        o.id === selectedFormOrg.id ? { ...o, status: nextStatus } : o,
      );

    db.organizations.save(updated);
    pushAuditLog(
      `org.${nextStatus.toLowerCase()}`,
      "Security",
      CURRENT_ADMIN_EMAIL,
      "platform_admin",
      selectedFormOrg.name,
      "Active",
      { previous_status: selectedFormOrg.status, result: nextStatus },
    );

    setIsSuspendConfirmOpen(false);
    refreshData();
    toast(`${selectedFormOrg.name} is now ${nextStatus.toLowerCase()}.`);
  };

  // ---- Delete ----
  const promptConfirmDelete = (org: Organization, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedFormOrg(org);
    setDeleteInputName("");
    setIsDeleteOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (!selectedFormOrg || deleteInputName !== selectedFormOrg.name) return;

    db.organizations.save(
      db.organizations.get().filter((o) => o.id !== selectedFormOrg.id),
    );
    pushAuditLog(
      "org.delete",
      "Admin Action",
      CURRENT_ADMIN_EMAIL,
      "platform_admin",
      null,
      "Active",
      { orgName: selectedFormOrg.name, previous_id: selectedFormOrg.id },
    );

    setIsDeleteOpen(false);
    setSelectedFormOrg(null);
    setDrawerOrgId(null);
    refreshData();
  };

  // Minimal toast shim — replace with your app's toast/sonner provider.
  function toast(message: string, _variant: "success" | "error" = "success") {
    // eslint-disable-next-line no-console
    console.log(message);
  }

  const activeDrawerOrg = orgs.find((o) => o.id === drawerOrgId);
  const activeDrawerUsers = activeDrawerOrg
    ? db.users.get().filter((u) => u.organizationId === activeDrawerOrg.id)
    : [];
  const activeDrawerBills = activeDrawerOrg
    ? db.subscriptions
        .get()
        .filter((s) => s.organizationId === activeDrawerOrg.id)
    : [];
  const activeDrawerLogs = activeDrawerOrg
    ? db.auditLogs.get().filter((l) => l.organization === activeDrawerOrg.name)
    : [];

  const hasActiveFilters =
    statusFilter !== "ALL" ||
    planFilter !== "ALL" ||
    regionFilter !== "ALL" ||
    !!searchQuery;
  // ---- Badge style helpers ----
  const planBadgeClass = (plan: Organization["plan"]) =>
    plan === "Enterprise"
      ? "bg-amber-50 text-amber-800 border-amber-200"
      : plan === "Growth"
        ? "bg-blue-50 text-blue-700 border-blue-200"
        : "bg-emerald-50 text-emerald-700 border-emerald-200";

  const statusDotClass = (status: Organization["status"]) =>
    status === "Active"
      ? "bg-emerald-500"
      : status === "Trial"
        ? "bg-blue-500"
        : status === "Pending"
          ? "bg-gray-400"
          : "bg-rose-500";

  const statusTextClass = (status: Organization["status"]) =>
    status === "Active"
      ? "text-emerald-700"
      : status === "Trial"
        ? "text-blue-700"
        : status === "Pending"
          ? "text-gray-500"
          : "text-rose-600";

  const totalMrr = filteredOrgs.reduce((sum, o) => sum + o.mrr, 0);
  const activeCount = filteredOrgs.filter((o) => o.status === "Active").length;

  return (
    <div className="min-h-screen bg-[#F4F1EC] p-6">
      <div className="max-w-[1400px] mx-auto space-y-5">
        {/* Page header */}
        <div className="flex items-center justify-between">
          <h1 className="text-[26px] font-semibold tracking-tight text-gray-900">
            Organizations
          </h1>
          <div className="flex items-center gap-2">
            <button
              onClick={openCreateDialog}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-gray-900 hover:bg-gray-800 text-white rounded-full text-xs font-semibold shadow-sm transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> New organization
            </button>
          </div>
        </div>

        {/* Metric pills */}
        <div className="flex flex-wrap items-center gap-3">
          <MetricPill
            label="Organizations"
            value={String(filteredOrgs.length)}
            dark
          />
          <MetricPill
            label="Active"
            value={String(activeCount)}
            accent="emerald"
          />
          <div className="flex items-center gap-2 bg-white rounded-full pl-4 pr-1.5 py-1.5 border border-gray-200/70">
            <span className="text-[11px] text-gray-400 font-medium">
              Total MRR
            </span>
            <span className="bg-amber-100 text-amber-900 text-xs font-bold px-3 py-1 rounded-full">
              ${totalMrr.toLocaleString()}
            </span>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <button className="flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-gray-700 bg-white px-3 py-2 rounded-full border border-gray-200/70">
              Directory <ChevronDown className="w-3 h-3" />
            </button>
            <button className="flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-gray-700 bg-white px-3 py-2 rounded-full border border-gray-200/70">
              Insights <ChevronDown className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Card containing toolbar + table */}
        <div className="bg-white rounded-3xl border border-gray-200/60 shadow-[0_1px_2px_rgba(0,0,0,0.04)] overflow-hidden">
          {/* Toolbar */}
          <div className="flex flex-wrap items-center gap-2 p-4 border-b border-gray-100">
            <ToolbarChip
              label="Status"
              value={statusFilter}
              onChange={setStatusFilter}
              options={[
                ["ALL", "All statuses"],
                ["Active", "Active"],
                ["Trial", "Trial"],
                ["Pending", "Pending"],
                ["Suspended", "Suspended"],
                ["Inactive", "Inactive"],
              ]}
            />
            <ToolbarChip
              label="Plan"
              value={planFilter}
              onChange={setPlanFilter}
              options={[
                ["ALL", "All plans"],
                ["Starter", "Starter"],
                ["Growth", "Growth"],
                ["Enterprise", "Enterprise"],
              ]}
            />
            <ToolbarChip
              label="Region"
              value={regionFilter}
              onChange={setRegionFilter}
              options={[
                ["ALL", "All regions"],
                ...REGIONS.map((r) => [r, r] as [string, string]),
              ]}
            />

            {hasActiveFilters && (
              <button
                onClick={() => {
                  setStatusFilter("ALL");
                  setPlanFilter("ALL");
                  setRegionFilter("ALL");
                  setSearchQuery("");
                }}
                className="text-xs font-medium text-amber-700 hover:text-amber-800 px-2"
              >
                Reset
              </button>
            )}

            <div className="relative ml-auto w-64">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-full text-xs text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-amber-300 focus:ring-2 focus:ring-amber-100 outline-none transition-colors"
              />
            </div>

            <button
              onClick={handleBulkExport}
              disabled={selectedOrgs.length === 0}
              className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed px-3.5 py-2 rounded-full border border-gray-200"
            >
              Export
            </button>
          </div>

          {/* Bulk toolbar */}
          {selectedOrgs.length > 0 && (
            <div className="flex items-center justify-between px-5 py-2.5 bg-amber-50 border-b border-amber-100">
              <span className="text-xs font-semibold text-amber-900">
                {selectedOrgs.length} selected
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleBulkSuspend}
                  className="px-3 py-1.5 bg-white hover:bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700 rounded-full"
                >
                  Suspend selected
                </button>
                <button
                  onClick={() => setSelectedOrgs([])}
                  className="text-xs text-amber-800 hover:text-amber-900 px-2 font-medium"
                >
                  Clear
                </button>
              </div>
            </div>
          )}

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-gray-400 text-[11px] font-semibold uppercase tracking-wide">
                  <th className="px-5 py-3 w-10">
                    <button
                      onClick={toggleSelectAll}
                      className="text-gray-300 hover:text-gray-500"
                    >
                      {selectedOrgs.length === filteredOrgs.length &&
                      filteredOrgs.length > 0 ? (
                        <CheckSquare className="w-4 h-4 text-amber-500" />
                      ) : (
                        <Square className="w-4 h-4" />
                      )}
                    </button>
                  </th>
                  <ColHeader label="Organization" />
                  <ColHeader label="Domain" />
                  <ColHeader label="Plan" />
                  <ColHeader label="Seats" />
                  <ColHeader label="MRR" />
                  <ColHeader label="Status" />
                  <ColHeader label="Region" />
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrgs.length === 0 ? (
                  <tr>
                    <td
                      colSpan={9}
                      className="px-5 py-16 text-center text-gray-400 text-sm"
                    >
                      No organizations match these filters.
                    </td>
                  </tr>
                ) : (
                  filteredOrgs.map((org, idx) => {
                    const isChecked = selectedOrgs.includes(org.id);
                    return (
                      <tr
                        key={org.id}
                        onClick={() => {
                          setDrawerOrgId(org.id);
                          setDrawerTab("overview");
                        }}
                        className={`cursor-pointer transition-colors border-t border-gray-100 group ${
                          isChecked
                            ? "bg-amber-50"
                            : idx % 2 === 1
                              ? "bg-gray-50/40 hover:bg-amber-50/50"
                              : "hover:bg-amber-50/50"
                        }`}
                      >
                        <td
                          className="px-5 py-3.5"
                          onClick={(e) => toggleSelect(org.id, e)}
                        >
                          {isChecked ? (
                            <CheckSquare className="w-4 h-4 text-amber-500" />
                          ) : (
                            <Square className="w-4 h-4 text-gray-300 group-hover:text-gray-400" />
                          )}
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-200 to-amber-400 text-amber-900 flex items-center justify-center font-bold text-xs flex-shrink-0">
                              {org.name.charAt(0)}
                            </div>
                            <span className="font-semibold text-gray-900 text-sm">
                              {org.name}
                            </span>
                          </div>
                        </td>
                        <td className="px-5 py-3.5 font-mono text-gray-500 text-[13px]">
                          {org.domain}
                        </td>
                        <td className="px-5 py-3.5">
                          <span
                            className={`inline-flex px-2.5 py-1 rounded-full border text-[11px] font-semibold ${planBadgeClass(org.plan)}`}
                          >
                            {org.plan}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-gray-700 text-[13px]">
                          {org.userCount}{" "}
                          <span className="text-gray-400">
                            / {org.seatLimit}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 font-semibold text-gray-900 text-[13px]">
                          ${org.mrr.toLocaleString()}
                        </td>
                        <td className="px-5 py-3.5">
                          <span
                            className={`inline-flex items-center gap-1.5 text-[12.5px] font-medium ${statusTextClass(org.status)}`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${statusDotClass(org.status)}`}
                            />
                            {org.status}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-gray-500 text-[13px]">
                          {org.region}
                        </td>
                        <td
                          className="px-5 py-3.5 text-right"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="inline-flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                            <RowActionButton
                              onClick={(e) => openEditDialog(org, e)}
                              label="Edit"
                            />
                            <RowActionButton
                              onClick={(e) => promptSuspendToggle(org, e)}
                              label={
                                org.status === "Suspended"
                                  ? "Activate"
                                  : "Suspend"
                              }
                              tone={
                                org.status === "Suspended" ? "emerald" : "amber"
                              }
                            />
                            <RowActionButton
                              onClick={(e) => promptConfirmDelete(org, e)}
                              label="Delete"
                              tone="rose"
                            />
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {/* Detail drawer */}
      {drawerOrgId && activeDrawerOrg && (
        <div className="fixed inset-y-0 right-0 w-full sm:max-w-xl bg-white shadow-2xl border-l border-gray-200 z-50 flex flex-col overflow-hidden">
          <div className="p-5 bg-[#F4F1EC] border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-amber-200 to-amber-400 text-amber-900 flex items-center justify-center font-bold text-base">
                {activeDrawerOrg.name.charAt(0)}
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900 truncate max-w-sm">
                  {activeDrawerOrg.name}
                </h3>
                <p className="text-[11px] font-mono text-gray-400">
                  {activeDrawerOrg.id}
                </p>
              </div>
            </div>
            <button
              onClick={() => setDrawerOrgId(null)}
              className="p-1.5 text-gray-400 hover:text-gray-600 border border-gray-200 rounded-full bg-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex border-b border-gray-200 text-xs font-medium text-gray-500 px-2">
            {(
              ["overview", "users", "billing", "activity", "settings"] as const
            ).map((tab) => (
              <button
                key={tab}
                onClick={() => setDrawerTab(tab)}
                className={`flex-1 py-3 text-center capitalize transition-colors relative ${
                  drawerTab === tab
                    ? "text-gray-900 font-semibold"
                    : "hover:text-gray-700"
                }`}
              >
                {tab}
                {drawerTab === tab && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-[3px] bg-amber-400 rounded-full" />
                )}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto p-5 space-y-5 text-xs text-gray-700">
            {drawerTab === "overview" && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <InfoTile
                    icon={Globe}
                    label="Domain"
                    value={activeDrawerOrg.domain}
                    mono
                  />
                  <InfoTile
                    icon={Building2}
                    label="Plan"
                    value={activeDrawerOrg.plan}
                  />
                  <InfoTile
                    icon={Mail}
                    label="Owner"
                    value={activeDrawerOrg.ownerEmail}
                    truncate
                  />
                  <InfoTile
                    icon={Users}
                    label="Seats"
                    value={`${activeDrawerOrg.userCount} / ${activeDrawerOrg.seatLimit}`}
                  />
                  <InfoTile
                    icon={MapPin}
                    label="Region"
                    value={activeDrawerOrg.region}
                  />
                  <InfoTile
                    icon={Activity}
                    label="Joined"
                    value={new Date(
                      activeDrawerOrg.joinedAt,
                    ).toLocaleDateString()}
                  />
                </div>

                <div className="border border-amber-200 bg-amber-50/70 rounded-2xl p-4 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <Activity className="w-3.5 h-3.5 text-amber-700" />
                    <h4 className="text-xs font-semibold text-amber-900">
                      Tenant health
                    </h4>
                  </div>
                  <p className="text-[11px] text-amber-800 leading-relaxed">
                    Based on usage, support load, and payment history, this
                    organization currently scores{" "}
                    <strong className="text-amber-950">
                      91 / 100 (Healthy)
                    </strong>
                    . No alerts flagged.
                  </p>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    onClick={() =>
                      onNavigate("Login as Tenant", activeDrawerOrg.id)
                    }
                    className="px-4 py-2.5 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-full text-xs flex items-center gap-1.5"
                  >
                    Impersonate org admin
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {drawerTab === "users" && (
              <div className="space-y-3">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">
                    Users at this organization
                  </h4>
                  <button
                    onClick={() => onNavigate("Global Users")}
                    className="text-[11px] font-semibold text-amber-700 hover:text-amber-800"
                  >
                    + Invite user
                  </button>
                </div>
                {activeDrawerUsers.length === 0 ? (
                  <EmptyRow text="No users yet for this organization." />
                ) : (
                  <div className="divide-y divide-gray-100 border border-gray-200 rounded-2xl overflow-hidden">
                    {activeDrawerUsers.map((user) => (
                      <div
                        key={user.id}
                        className="p-3.5 flex items-center justify-between"
                      >
                        <div>
                          <p className="font-medium text-gray-900">
                            {user.name}
                          </p>
                          <p className="text-[11px] text-gray-400 font-mono">
                            {user.email}
                          </p>
                        </div>
                        <span className="px-2.5 py-1 rounded-full bg-gray-100 text-[11px] text-gray-600 font-medium">
                          {user.role}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {drawerTab === "billing" && (
              <div className="space-y-3">
                <h4 className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">
                  Subscription
                </h4>
                {activeDrawerBills.length === 0 ? (
                  <EmptyRow text="No subscription on file." />
                ) : (
                  activeDrawerBills.map((sub) => (
                    <div
                      key={sub.id}
                      className="border border-gray-200 rounded-2xl p-4 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-gray-900">
                            {sub.plan} plan
                          </p>
                          <p className="text-[11px] text-gray-400 font-mono">
                            {sub.id}
                          </p>
                        </div>
                        <span
                          className={`px-2.5 py-1 rounded-full border text-[11px] font-medium ${
                            sub.status === "Active"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : "bg-rose-50 text-rose-700 border-rose-200"
                          }`}
                        >
                          {sub.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-[11px]">
                        <div>
                          <span className="text-gray-400">Amount</span>
                          <p className="font-medium text-gray-900">
                            ${sub.amount.toLocaleString()} ({sub.currency})
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-400">Billing cycle</span>
                          <p className="font-medium text-gray-900">
                            {sub.billingCycle}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-400">Card on file</span>
                          <p className="font-mono text-gray-900">
                            •••• {sub.paymentMethodLast4 || "—"}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-400">Renews</span>
                          <p className="font-medium text-gray-900">
                            {sub.renewalDate || "—"}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {drawerTab === "activity" && (
              <div className="space-y-3">
                <h4 className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">
                  Recent activity
                </h4>
                {activeDrawerLogs.length === 0 ? (
                  <EmptyRow text="No audit log entries for this organization." />
                ) : (
                  <div className="max-h-[360px] overflow-y-auto border border-gray-200 rounded-2xl divide-y divide-gray-100">
                    {activeDrawerLogs.map((log) => (
                      <div
                        key={log.id}
                        className="p-3.5 text-[11px] flex gap-3 items-start hover:bg-gray-50"
                      >
                        <span className="text-gray-400 font-mono shrink-0 pt-0.5">
                          {new Date(log.timestamp).toLocaleDateString()}
                        </span>
                        <div>
                          <p className="font-medium text-gray-900 font-mono">
                            {log.event}
                          </p>
                          <p className="text-gray-400 mt-0.5">by {log.actor}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {drawerTab === "settings" && (
              <div className="space-y-3">
                <h4 className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">
                  Feature flags
                </h4>
                <SettingToggle
                  title="White-label custom domain"
                  description="Bypass standard platform branding for this tenant."
                  enabled
                />
                <SettingToggle
                  title="AI ticket auto-categorization"
                  description="Automatically tag and route incoming support tickets."
                  enabled
                />
              </div>
            )}
          </div>

          <div className="p-4 bg-[#F4F1EC] border-t border-gray-200 flex items-center justify-between">
            <span className="text-[11px] text-gray-400">
              All actions are audit-logged
            </span>
            <button
              onClick={() => onNavigate("Subscriptions")}
              className="px-3.5 py-2 text-xs border border-gray-300 hover:bg-white text-gray-700 rounded-full font-medium transition-colors"
            >
              View subscription
            </button>
          </div>
        </div>
      )}
      {/* Create dialog */}
      {isCreateOpen && (
        <Modal onClose={() => setIsCreateOpen(false)}>
          <ModalHeader
            icon={Building2}
            title="New organization"
            onClose={() => setIsCreateOpen(false)}
          />
          <form onSubmit={handleCreateSubmit} className="p-5 space-y-4 text-xs">
            <Field label="Organization name" required>
              <input
                type="text"
                required
                placeholder="Acme Corp"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                className={inputClass}
              />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Domain" required>
                <input
                  type="text"
                  required
                  placeholder="acme.com"
                  value={formDomain}
                  onChange={(e) => setFormDomain(e.target.value)}
                  className={`${inputClass} font-mono`}
                />
              </Field>
              <Field label="Industry">
                <input
                  type="text"
                  placeholder="Technology"
                  value={formIndustry}
                  onChange={(e) => setFormIndustry(e.target.value)}
                  className={inputClass}
                />
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Plan">
                <select
                  value={formPlan}
                  onChange={(e) =>
                    setFormPlan(e.target.value as typeof formPlan)
                  }
                  className={inputClass}
                >
                  <option value="Starter">Starter — $99/mo</option>
                  <option value="Growth">Growth — $1,200/mo</option>
                  <option value="Enterprise">Enterprise — $3,500/mo</option>
                </select>
              </Field>
              <Field label="Seat limit">
                <input
                  type="number"
                  min={5}
                  value={formSeatLimit}
                  onChange={(e) => setFormSeatLimit(Number(e.target.value))}
                  className={inputClass}
                />
              </Field>
            </div>
            <Field label="Owner email" required>
              <input
                type="email"
                required
                placeholder="owner@acme.com"
                value={formOwnerEmail}
                onChange={(e) => setFormOwnerEmail(e.target.value)}
                className={`${inputClass} font-mono`}
              />
            </Field>
            <Field label="Password" required>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={formPassword}
                onChange={(e) => setFormPassword(e.target.value)}
                className={inputClass}
              />
            </Field>
            <Field label="Region">
              <select
                value={formRegion}
                onChange={(e) => setFormRegion(e.target.value)}
                className={inputClass}
              >
                {REGIONS.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </Field>
            <div className="flex justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setIsCreateOpen(false)}
                className="px-4 py-2.5 border border-gray-300 rounded-full font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2.5 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-full shadow-sm"
              >
                Create organization
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Edit dialog */}
      {isEditOpen && selectedFormOrg && (
        <Modal onClose={() => setIsEditOpen(false)}>
          <ModalHeader
            icon={Building2}
            title={`Edit \u2022 ${selectedFormOrg.name}`}
            onClose={() => setIsEditOpen(false)}
          />
          <form onSubmit={handleEditSubmit} className="p-5 space-y-4 text-xs">
            <Field label="Organization name">
              <input
                type="text"
                required
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                className={inputClass}
              />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Domain">
                <input
                  type="text"
                  required
                  value={formDomain}
                  onChange={(e) => setFormDomain(e.target.value)}
                  className={`${inputClass} font-mono`}
                />
              </Field>
              <Field label="Industry">
                <input
                  type="text"
                  value={formIndustry}
                  onChange={(e) => setFormIndustry(e.target.value)}
                  className={inputClass}
                />
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Plan">
                <select
                  value={formPlan}
                  onChange={(e) =>
                    setFormPlan(e.target.value as typeof formPlan)
                  }
                  className={inputClass}
                >
                  <option value="Starter">Starter — $99/mo</option>
                  <option value="Growth">Growth — $1,200/mo</option>
                  <option value="Enterprise">Enterprise — $3,500/mo</option>
                </select>
              </Field>
              <Field label="Seat limit">
                <input
                  type="number"
                  value={formSeatLimit}
                  onChange={(e) => setFormSeatLimit(Number(e.target.value))}
                  className={inputClass}
                />
              </Field>
            </div>
            <Field label="Owner email">
              <input
                type="email"
                required
                value={formOwnerEmail}
                onChange={(e) => setFormOwnerEmail(e.target.value)}
                className={`${inputClass} font-mono`}
              />
            </Field>
            <Field label="Region">
              <select
                value={formRegion}
                onChange={(e) => setFormRegion(e.target.value)}
                className={inputClass}
              >
                {REGIONS.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </Field>
            <div className="flex justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setIsEditOpen(false)}
                className="px-4 py-2.5 border border-gray-300 rounded-full font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2.5 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-full shadow-sm"
              >
                Save changes
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Suspend / reactivate confirm */}
      {isSuspendConfirmOpen && selectedFormOrg && (
        <Modal
          onClose={() => setIsSuspendConfirmOpen(false)}
          maxWidth="max-w-sm"
        >
          <div className="p-5">
            <div className="flex items-center gap-2.5 text-amber-600 mb-3">
              <ShieldAlert className="w-5 h-5 shrink-0" />
              <h4 className="text-sm font-semibold text-gray-900">
                {selectedFormOrg.status === "Suspended"
                  ? "Reactivate organization?"
                  : "Suspend organization?"}
              </h4>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed mb-4">
              {selectedFormOrg.status === "Suspended"
                ? `Reactivating ${selectedFormOrg.name} restores login access and API access immediately.`
                : `Suspending ${selectedFormOrg.name} locks out all of its admins and users immediately, and its API keys will start returning unauthorized errors.`}
            </p>
            <div className="flex justify-end gap-2.5">
              <button
                onClick={() => setIsSuspendConfirmOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-full font-medium text-gray-700 hover:bg-gray-50 text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleSuspendToggleConfirm}
                className="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white font-medium text-xs rounded-full"
              >
                {selectedFormOrg.status === "Suspended"
                  ? "Reactivate"
                  : "Suspend"}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete confirm */}
      {isDeleteOpen && selectedFormOrg && (
        <Modal onClose={() => setIsDeleteOpen(false)}>
          <div className="p-4 bg-rose-50 border-b border-rose-100 flex items-center justify-between text-rose-800">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide">
              <Trash2 className="w-4 h-4 text-rose-600" />
              Delete organization
            </div>
            <button
              onClick={() => setIsDeleteOpen(false)}
              className="text-rose-400 hover:text-rose-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="p-5 space-y-4 text-xs">
            <p className="text-gray-700 leading-relaxed">
              This permanently deletes{" "}
              <strong className="text-rose-700">{selectedFormOrg.name}</strong>{" "}
              and cannot be undone. This removes:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-gray-500 text-[11px]">
              <li>
                All employee records and historical data for this organization
              </li>
              <li>API keys, webhooks, and any active discounts</li>
              <li>Branding, SSO, and integration settings</li>
            </ul>
            <div className="bg-rose-50 border border-rose-100 p-3 rounded-2xl text-rose-800">
              Type{" "}
              <strong className="font-mono text-rose-950">
                {selectedFormOrg.name}
              </strong>{" "}
              to confirm:
            </div>
            <input
              type="text"
              placeholder="Type the organization name"
              value={deleteInputName}
              onChange={(e) => setDeleteInputName(e.target.value)}
              className="w-full bg-rose-50 border border-rose-200 text-rose-950 focus:bg-white focus:outline-none focus:ring-1 focus:ring-rose-300 rounded-full p-2.5 font-mono text-center text-xs"
            />
            <div className="flex justify-end gap-2.5 pt-1">
              <button
                onClick={() => setIsDeleteOpen(false)}
                className="px-4 py-2.5 border border-gray-300 rounded-full font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={deleteInputName !== selectedFormOrg.name}
                className={`px-4 py-2.5 rounded-full font-semibold text-white shadow-sm transition-colors ${
                  deleteInputName === selectedFormOrg.name
                    ? "bg-rose-600 hover:bg-rose-700"
                    : "bg-gray-300 text-gray-400 cursor-not-allowed"
                }`}
              >
                Delete permanently
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

const inputClass =
  "w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs text-gray-900 focus:bg-white focus:border-amber-300 focus:ring-2 focus:ring-amber-100 outline-none transition-colors";

// ---- Shared presentational helpers ----

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <label className="text-[10px] uppercase font-semibold tracking-wide text-gray-400">
        {label} {required && <span className="text-rose-500">*</span>}
      </label>
      {children}
    </div>
  );
}

function Modal({
  children,
  onClose,
  maxWidth = "max-w-md",
}: {
  children: React.ReactNode;
  onClose: () => void;
  maxWidth?: string;
}) {
  return (
    <div
      className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className={`bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-2xl w-full ${maxWidth}`}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

function ModalHeader({
  icon: Icon,
  title,
  onClose,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  onClose: () => void;
}) {
  return (
    <div className="p-5 bg-[#F4F1EC] border-b border-gray-200 flex items-center justify-between">
      <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
        <Icon className="w-4 h-4 text-amber-600" />
        {title}
      </h3>
      <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

function MetricPill({
  label,
  value,
  dark,
  accent,
}: {
  label: string;
  value: string;
  dark?: boolean;
  accent?: "emerald";
}) {
  if (dark) {
    return (
      <div className="flex items-center gap-2.5 bg-gray-900 rounded-full pl-4 pr-1.5 py-1.5">
        <span className="text-[11px] text-gray-300 font-medium">{label}</span>
        <span className="bg-white/15 text-white text-xs font-bold px-3 py-1 rounded-full">
          {value}
        </span>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-2.5 bg-white rounded-full pl-4 pr-1.5 py-1.5 border border-gray-200/70">
      <span className="text-[11px] text-gray-400 font-medium">{label}</span>
      <span
        className={`text-xs font-bold px-3 py-1 rounded-full ${
          accent === "emerald"
            ? "bg-emerald-100 text-emerald-800"
            : "bg-gray-100 text-gray-800"
        }`}
      >
        {value}
      </span>
    </div>
  );
}

function ToolbarChip({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: [string, string][];
}) {
  return (
    <div className="flex items-center gap-1.5 bg-gray-50 hover:bg-gray-100 px-3 py-2 rounded-full border border-gray-200 transition-colors">
      <span className="text-[11px] font-semibold text-gray-500">{label}</span>
      <div className="relative flex items-center">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="bg-transparent text-gray-800 text-xs py-0 pr-4 focus:outline-none font-medium appearance-none cursor-pointer"
        >
          {options.map(([val, lbl]) => (
            <option key={val} value={val}>
              {lbl}
            </option>
          ))}
        </select>
        <ChevronDown className="w-3 h-3 text-gray-400 absolute right-0 pointer-events-none" />
      </div>
    </div>
  );
}

function ColHeader({ label }: { label: string }) {
  return (
    <th className="px-5 py-3">
      <span className="inline-flex items-center gap-1 cursor-pointer hover:text-gray-600">
        {label}
        <ChevronDown className="w-2.5 h-2.5" />
      </span>
    </th>
  );
}

function RowActionButton({
  onClick,
  label,
  tone = "gray",
}: {
  onClick: (e: React.MouseEvent) => void;
  label: string;
  tone?: "gray" | "amber" | "emerald" | "rose";
}) {
  const toneClass = {
    gray: "text-gray-500 hover:bg-gray-100",
    amber: "text-amber-700 hover:bg-amber-50",
    emerald: "text-emerald-700 hover:bg-emerald-50",
    rose: "text-rose-600 hover:bg-rose-50",
  }[tone];
  return (
    <button
      onClick={onClick}
      className={`px-2.5 py-1 rounded-full text-[11px] font-semibold ${toneClass}`}
    >
      {label}
    </button>
  );
}

function InfoTile({
  icon: Icon,
  label,
  value,
  mono,
  truncate,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  mono?: boolean;
  truncate?: boolean;
}) {
  return (
    <div className="bg-gray-50 p-3.5 rounded-2xl border border-gray-100">
      <span className="text-gray-400 text-[10px] uppercase font-semibold tracking-wide">
        {label}
      </span>
      <p
        className={`text-gray-900 mt-1 flex items-center gap-1.5 font-medium ${mono ? "font-mono" : ""}`}
        title={truncate ? value : undefined}
      >
        <Icon className="w-3.5 h-3.5 text-gray-400 shrink-0" />
        <span className={truncate ? "truncate" : ""}>{value}</span>
      </p>
    </div>
  );
}

function EmptyRow({ text }: { text: string }) {
  return <p className="text-gray-400 text-center py-6">{text}</p>;
}

function SettingToggle({
  title,
  description,
  enabled,
}: {
  title: string;
  description: string;
  enabled: boolean;
}) {
  return (
    <div className="flex items-center justify-between p-3.5 border border-gray-200 rounded-2xl">
      <div>
        <p className="font-medium text-gray-900">{title}</p>
        <p className="text-[11px] text-gray-400">{description}</p>
      </div>
      <span
        className={`relative inline-flex items-center h-5 rounded-full w-9 ${enabled ? "bg-amber-400" : "bg-gray-300"}`}
      >
        <span
          className={`inline-block w-3.5 h-3.5 transform bg-white rounded-full transition-transform ${enabled ? "translate-x-5" : "translate-x-1"}`}
        />
      </span>
    </div>
  );
}
