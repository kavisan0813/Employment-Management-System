/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Organization } from "../../../types";
import { OrganizationService } from "../services/organization.service";
import { DrawerTab } from "../types/organization.types";

export function useOrganizations(initialSelectId: string | null, clearInitialSelectId: () => void) {
  const [orgs, setOrgs] = useState<Organization[]>([]);
  const [selectedOrgs, setSelectedOrgs] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [planFilter, setPlanFilter] = useState("ALL");
  const [regionFilter, setRegionFilter] = useState("ALL");

  const [drawerOrgId, setDrawerOrgId] = useState<string | null>(null);
  const [drawerTab, setDrawerTab] = useState<DrawerTab>("overview");

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isSuspendConfirmOpen, setIsSuspendConfirmOpen] = useState(false);

  const [selectedFormOrg, setSelectedFormOrg] = useState<Organization | null>(null);
  const [formName, setFormName] = useState("");
  const [formDomain, setFormDomain] = useState("");
  const [formPlan, setFormPlan] = useState<"Starter" | "Growth" | "Enterprise">("Starter");
  const [formRegion, setFormRegion] = useState("North America");
  const [formOwnerEmail, setFormOwnerEmail] = useState("");
  const [formSeatLimit, setFormSeatLimit] = useState(50);
  const [formIndustry, setFormIndustry] = useState("Technology");
  const [formPassword, setFormPassword] = useState("");
  const [deleteInputName, setDeleteInputName] = useState("");

  const refreshData = () => {
    setOrgs(OrganizationService.getOrganizations());
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
        : filteredOrgs.map((o) => o.id)
    );
  };

  const toggleSelect = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedOrgs((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

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
      alert("Name, domain, owner email, and password are required.");
      return;
    }
    OrganizationService.createOrganization({
      name: formName,
      domain: formDomain,
      plan: formPlan,
      region: formRegion,
      ownerEmail: formOwnerEmail,
      seatLimit: formSeatLimit,
      industry: formIndustry,
      password: formPassword,
    });
    setIsCreateOpen(false);
    refreshData();
  };

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
    OrganizationService.updateOrganization(selectedFormOrg.id, {
      name: formName,
      domain: formDomain,
      plan: formPlan,
      region: formRegion,
      ownerEmail: formOwnerEmail,
      seatLimit: formSeatLimit,
      industry: formIndustry,
    });
    setIsEditOpen(false);
    refreshData();
  };

  const promptSuspendToggle = (org: Organization, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedFormOrg(org);
    setIsSuspendConfirmOpen(true);
  };

  const handleSuspendToggleConfirm = () => {
    if (!selectedFormOrg) return;
    OrganizationService.toggleSuspend(selectedFormOrg);
    setIsSuspendConfirmOpen(false);
    refreshData();
  };

  const promptConfirmDelete = (org: Organization, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedFormOrg(org);
    setDeleteInputName("");
    setIsDeleteOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (!selectedFormOrg || deleteInputName !== selectedFormOrg.name) return;
    OrganizationService.deleteOrganization(selectedFormOrg.id, selectedFormOrg.name);
    setIsDeleteOpen(false);
    setSelectedFormOrg(null);
    setDrawerOrgId(null);
    refreshData();
  };

  const handleBulkSuspend = () => {
    OrganizationService.bulkSuspend(selectedOrgs);
    setSelectedOrgs([]);
    refreshData();
    if (drawerOrgId && selectedOrgs.includes(drawerOrgId)) setDrawerOrgId(null);
  };

  const handleBulkExport = () => {
    const targets = orgs.filter((o) => selectedOrgs.includes(o.id));
    const header = "ID,Name,Domain,Plan,Status,Users,MRR,Region,JoinedAt\n";
    const rows = targets
      .map(
        (t) =>
          `${t.id},"${t.name}",${t.domain},${t.plan},${t.status},${t.userCount},${t.mrr},"${t.region}",${t.joinedAt}`
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

  return {
    orgs,
    selectedOrgs,
    setSelectedOrgs,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    planFilter,
    setPlanFilter,
    regionFilter,
    setRegionFilter,
    drawerOrgId,
    setDrawerOrgId,
    drawerTab,
    setDrawerTab,
    filteredOrgs,
    toggleSelectAll,
    toggleSelect,
    isCreateOpen,
    setIsCreateOpen,
    openCreateDialog,
    handleCreateSubmit,
    isEditOpen,
    setIsEditOpen,
    openEditDialog,
    handleEditSubmit,
    isSuspendConfirmOpen,
    setIsSuspendConfirmOpen,
    promptSuspendToggle,
    handleSuspendToggleConfirm,
    isDeleteOpen,
    setIsDeleteOpen,
    promptConfirmDelete,
    handleDeleteConfirm,
    handleBulkSuspend,
    handleBulkExport,
    formName,
    setFormName,
    formDomain,
    setFormDomain,
    formPlan,
    setFormPlan,
    formRegion,
    setFormRegion,
    formOwnerEmail,
    setFormOwnerEmail,
    formSeatLimit,
    setFormSeatLimit,
    formIndustry,
    setFormIndustry,
    formPassword,
    setFormPassword,
    deleteInputName,
    setDeleteInputName,
    selectedFormOrg,
  };
}
