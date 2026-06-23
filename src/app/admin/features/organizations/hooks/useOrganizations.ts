import { useState, useEffect, useMemo } from "react";
import { Organization } from "../../../types";
import { OrganizationService } from "../services/organization.service";

export function useOrganizations() {
  const [orgs, setOrgs] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [planFilter, setPlanFilter] = useState("ALL");
  const [industryFilter, setIndustryFilter] = useState("ALL");

  const [activeOrgId, setActiveOrgId] = useState<string | null>(null);

  const loadData = () => {
    setLoading(true);
    setOrgs(OrganizationService.getOrganizations());
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredOrgs = useMemo(() => {
    return orgs.filter((o) => {
      const matchSearch =
        o.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.domain.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (o.ownerEmail && o.ownerEmail.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (o.code && o.code.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchStatus = statusFilter === "ALL" || o.status === statusFilter;
      const matchPlan = planFilter === "ALL" || o.plan === planFilter;
      const matchIndustry = industryFilter === "ALL" || o.industry === industryFilter;

      return matchSearch && matchStatus && matchPlan && matchIndustry;
    });
  }, [orgs, searchQuery, statusFilter, planFilter, industryFilter]);

  const activeOrg = useMemo(() => orgs.find((o) => o.id === activeOrgId) || null, [orgs, activeOrgId]);

  return {
    orgs,
    filteredOrgs,
    loading,
    activeOrgId,
    setActiveOrgId,
    activeOrg,
    filters: {
      searchQuery,
      setSearchQuery,
      statusFilter,
      setStatusFilter,
      planFilter,
      setPlanFilter,
      industryFilter,
      setIndustryFilter,
    },
    actions: {
      loadData,
      updateStatus: (id: string, status: Organization["status"]) => {
        OrganizationService.updateOrganizationStatus(id, status);
        loadData();
      },
      updatePlan: (id: string, plan: Organization["plan"]) => {
        OrganizationService.updateSubscriptionPlan(id, plan);
        loadData();
      }
    },
  };
}
