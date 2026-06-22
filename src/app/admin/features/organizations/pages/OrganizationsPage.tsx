/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Plus, Search, ChevronDown, ShieldAlert, Trash2, X } from "lucide-react";
import { OrganizationsViewProps } from "../types/organization.types";
import { useOrganizations } from "../hooks/useOrganizations";
import { OrganizationStatistics } from "../components/organizations/OrganizationStatistics";
import { OrganizationsTable } from "../components/organizations/OrganizationsTable";
import { OrganizationWizard } from "../components/organizations/OrganizationWizard";
import { OrganizationDrawer } from "../components/organizations/OrganizationDrawer";
import { db } from "../../../mockData";

// Simple modal presentational helper for confirm dialogs
function Modal({
  onClose,
  maxWidth = "max-w-md",
  children,
}: {
  onClose: () => void;
  maxWidth?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-xs">
      <div 
        className={`bg-white rounded-3xl w-full ${maxWidth} shadow-2xl border border-gray-100 overflow-hidden`}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
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
    <div className="flex items-center gap-1.5 bg-gray-50 hover:bg-gray-100 px-3 py-2 rounded-full border border-gray-200/70 transition-colors">
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

export function OrganizationsPage({
  initialSelectId = null,
  clearInitialSelectId = () => {},
  onNavigate = () => {},
}: OrganizationsViewProps) {
  const hook = useOrganizations(initialSelectId, clearInitialSelectId);

  const totalMrr = hook.filteredOrgs.reduce((sum, o) => sum + o.mrr, 0);
  const activeCount = hook.filteredOrgs.filter((o) => o.status === "Active").length;

  const activeDrawerOrg = hook.orgs.find((o) => o.id === hook.drawerOrgId);
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
    hook.statusFilter !== "ALL" ||
    hook.planFilter !== "ALL" ||
    hook.regionFilter !== "ALL" ||
    !!hook.searchQuery;

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
              type="button"
              onClick={hook.openCreateDialog}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-gray-900 hover:bg-gray-800 text-white rounded-full text-xs font-semibold shadow-sm transition-colors focus:outline-none"
            >
              <Plus className="w-3.5 h-3.5" /> New organization
            </button>
          </div>
        </div>

        {/* Metric pills / stats */}
        <OrganizationStatistics
          totalCount={hook.filteredOrgs.length}
          activeCount={activeCount}
          totalMRR={totalMrr}
        />

        {/* Card containing toolbar + table */}
        <div className="bg-white rounded-3xl border border-gray-200/60 shadow-[0_1px_2px_rgba(0,0,0,0.04)] overflow-hidden">
          {/* Toolbar */}
          <div className="flex flex-wrap items-center gap-2 p-4 border-b border-gray-100">
            <ToolbarChip
              label="Status"
              value={hook.statusFilter}
              onChange={hook.setStatusFilter}
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
              value={hook.planFilter}
              onChange={hook.setPlanFilter}
              options={[
                ["ALL", "All plans"],
                ["Starter", "Starter"],
                ["Growth", "Growth"],
                ["Enterprise", "Enterprise"],
              ]}
            />
            <ToolbarChip
              label="Region"
              value={hook.regionFilter}
              onChange={hook.setRegionFilter}
              options={[
                ["ALL", "All regions"],
                ["North America", "North America"],
                ["Europe", "Europe"],
                ["Asia Pacific", "Asia Pacific"],
                ["United Kingdom", "United Kingdom"],
                ["Latin America", "Latin America"],
              ]}
            />

            {/* Search Input */}
            <div className="relative flex items-center bg-gray-50 border border-gray-200/70 hover:border-gray-300 rounded-full px-3 py-1.5 focus-within:border-amber-400 focus-within:bg-white transition-all ml-auto w-64">
              <Search className="w-3.5 h-3.5 text-gray-400 mr-2 shrink-0" />
              <input
                type="text"
                placeholder="Search name or domain..."
                value={hook.searchQuery}
                onChange={(e) => hook.setSearchQuery(e.target.value)}
                className="bg-transparent border-none text-xs w-full focus:outline-none text-gray-800"
              />
              {hook.searchQuery && (
                <button
                  type="button"
                  onClick={() => hook.setSearchQuery("")}
                  className="text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={() => {
                  hook.setSearchQuery("");
                  hook.setStatusFilter("ALL");
                  hook.setPlanFilter("ALL");
                  hook.setRegionFilter("ALL");
                }}
                className="text-xs font-semibold text-amber-700 hover:text-amber-800 bg-amber-50 hover:bg-amber-100/70 px-3.5 py-2 rounded-full transition-colors focus:outline-none"
              >
                Clear all filters
              </button>
            )}
          </div>

          {/* Bulk Action Header Banner */}
          {hook.selectedOrgs.length > 0 && (
            <div className="bg-amber-50/50 border-b border-amber-100/50 px-4 py-3 flex items-center gap-3 animate-fade-in">
              <span className="text-[11px] font-semibold text-amber-800">
                {hook.selectedOrgs.length} tenant organization
                {hook.selectedOrgs.length === 1 ? "" : "s"} selected
              </span>
              <div className="h-4 w-px bg-amber-200" />
              <button
                type="button"
                onClick={hook.handleBulkSuspend}
                className="px-3.5 py-1.5 bg-white border border-amber-200 text-amber-900 rounded-full text-[11px] font-medium hover:bg-amber-50 hover:border-amber-300 transition-colors focus:outline-none"
              >
                Suspend selected
              </button>
              <button
                type="button"
                onClick={hook.handleBulkExport}
                className="px-3.5 py-1.5 bg-white border border-amber-200 text-amber-900 rounded-full text-[11px] font-medium hover:bg-amber-50 hover:border-amber-300 transition-colors focus:outline-none"
              >
                Export CSV
              </button>
              <button
                type="button"
                onClick={() => hook.setSelectedOrgs([])}
                className="text-[11px] font-medium text-amber-700 hover:text-amber-800 focus:outline-none ml-auto"
              >
                Deselect all
              </button>
            </div>
          )}

          {/* Table Container */}
          <OrganizationsTable
            orgs={hook.filteredOrgs}
            selectedOrgs={hook.selectedOrgs}
            toggleSelectAll={hook.toggleSelectAll}
            toggleSelect={hook.toggleSelect}
            onRowClick={hook.setDrawerOrgId}
            onEdit={hook.openEditDialog}
            onSuspend={hook.promptSuspendToggle}
            onDelete={hook.promptConfirmDelete}
          />
        </div>
      </div>

      {/* Detail Drawer */}
      <OrganizationDrawer
        isOpen={!!hook.drawerOrgId}
        org={activeDrawerOrg || null}
        users={activeDrawerUsers}
        subscriptions={activeDrawerBills}
        logs={activeDrawerLogs}
        tab={hook.drawerTab}
        setTab={hook.setDrawerTab}
        onClose={() => hook.setDrawerOrgId(null)}
        onNavigate={onNavigate}
      />

      {/* Creation Modal (Wizard) */}
      <OrganizationWizard
        isOpen={hook.isCreateOpen}
        onClose={() => hook.setIsCreateOpen(false)}
        onSubmit={hook.handleCreateSubmit}
        formName={hook.formName}
        setFormName={hook.setFormName}
        formDomain={hook.formDomain}
        setFormDomain={hook.setFormDomain}
        formPlan={hook.formPlan}
        setFormPlan={hook.setFormPlan}
        formRegion={hook.formRegion}
        setFormRegion={hook.setFormRegion}
        formOwnerEmail={hook.formOwnerEmail}
        setFormOwnerEmail={hook.setFormOwnerEmail}
        formSeatLimit={hook.formSeatLimit}
        setFormSeatLimit={hook.setFormSeatLimit}
        formIndustry={hook.formIndustry}
        setFormIndustry={hook.setFormIndustry}
        formPassword={hook.formPassword}
        setFormPassword={hook.setFormPassword}
      />

      {/* Edit Modal (Wizard) */}
      <OrganizationWizard
        isOpen={hook.isEditOpen}
        onClose={() => hook.setIsEditOpen(false)}
        onSubmit={hook.handleEditSubmit}
        formName={hook.formName}
        setFormName={hook.setFormName}
        formDomain={hook.formDomain}
        setFormDomain={hook.setFormDomain}
        formPlan={hook.formPlan}
        setFormPlan={hook.setFormPlan}
        formRegion={hook.formRegion}
        setFormRegion={hook.setFormRegion}
        formOwnerEmail={hook.formOwnerEmail}
        setFormOwnerEmail={hook.setFormOwnerEmail}
        formSeatLimit={hook.formSeatLimit}
        setFormSeatLimit={hook.setFormSeatLimit}
        formIndustry={hook.formIndustry}
        setFormIndustry={hook.setFormIndustry}
        isEditMode
      />

      {/* Suspend Confirmation Dialog */}
      {hook.isSuspendConfirmOpen && hook.selectedFormOrg && (
        <Modal onClose={() => hook.setIsSuspendConfirmOpen(false)} maxWidth="max-w-sm">
          <div className="p-5">
            <div className="flex items-center gap-2.5 text-amber-600 mb-3">
              <ShieldAlert className="w-5 h-5 shrink-0" />
              <h4 className="text-sm font-semibold text-gray-900">
                {hook.selectedFormOrg.status === "Suspended"
                  ? "Reactivate organization?"
                  : "Suspend organization?"}
              </h4>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed mb-4">
              {hook.selectedFormOrg.status === "Suspended"
                ? `Reactivating ${hook.selectedFormOrg.name} restores login access and API access immediately.`
                : `Suspending ${hook.selectedFormOrg.name} locks out all of its admins and users immediately, and its API keys will start returning unauthorized errors.`}
            </p>
            <div className="flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => hook.setIsSuspendConfirmOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-full font-medium text-gray-700 hover:bg-gray-50 text-xs focus:outline-none"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={hook.handleSuspendToggleConfirm}
                className="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white font-medium text-xs rounded-full focus:outline-none"
              >
                {hook.selectedFormOrg.status === "Suspended" ? "Reactivate" : "Suspend"}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete Confirmation Dialog */}
      {hook.isDeleteOpen && hook.selectedFormOrg && (
        <Modal onClose={() => hook.setIsDeleteOpen(false)}>
          <div className="p-4 bg-rose-50 border-b border-rose-100 flex items-center justify-between text-rose-800">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide">
              <Trash2 className="w-4 h-4 text-rose-600" />
              Delete organization
            </div>
            <button
              type="button"
              onClick={() => hook.setIsDeleteOpen(false)}
              className="text-rose-400 hover:text-rose-600 focus:outline-none"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="p-5 space-y-4 text-xs">
            <p className="text-gray-700 leading-relaxed">
              This permanently deletes{" "}
              <strong className="text-rose-700">{hook.selectedFormOrg.name}</strong>{" "}
              and cannot be undone. This removes:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-gray-500 text-[11px]">
              <li>All employee records and historical data for this organization</li>
              <li>API keys, webhooks, and any active discounts</li>
              <li>Branding, SSO, and integration settings</li>
            </ul>
            <div className="bg-rose-50 border border-rose-100 p-3 rounded-2xl text-rose-800">
              Type{" "}
              <strong className="font-mono text-rose-950">
                {hook.selectedFormOrg.name}
              </strong>{" "}
              to confirm:
            </div>
            <input
              type="text"
              placeholder="Type the organization name"
              value={hook.deleteInputName}
              onChange={(e) => hook.setDeleteInputName(e.target.value)}
              className="w-full bg-rose-50 border border-rose-200 text-rose-950 focus:bg-white focus:outline-none focus:ring-1 focus:ring-rose-300 rounded-full p-2.5 font-mono text-center text-xs"
            />
            <div className="flex justify-end gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => hook.setIsDeleteOpen(false)}
                className="px-4 py-2.5 border border-gray-300 rounded-full font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={hook.handleDeleteConfirm}
                disabled={hook.deleteInputName !== hook.selectedFormOrg.name}
                className={`px-4 py-2.5 rounded-full font-semibold text-white shadow-sm transition-colors focus:outline-none ${
                  hook.deleteInputName === hook.selectedFormOrg.name
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

export default OrganizationsPage;
