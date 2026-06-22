/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback } from "react";
import { SubscriptionRecord, SubscriptionStats } from "../types/subscription.types";
import { SubscriptionService } from "../services/subscription.service";
import { EntityStatus } from "../../../../admin/types";

export function useSubscriptions() {
  const [subscriptions, setSubscriptions] = useState<SubscriptionRecord[]>([]);
  const [stats, setStats] = useState<SubscriptionStats | null>(null);
  const [selectedSub, setSelectedSub] = useState<SubscriptionRecord | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | EntityStatus>("ALL");
  const [planFilter, setPlanFilter] = useState<"ALL" | "Starter" | "Growth" | "Enterprise">("ALL");
  const [cycleFilter, setCycleFilter] = useState<"ALL" | "Monthly" | "Annual">("ALL");

  const refresh = useCallback(() => {
    setSubscriptions(SubscriptionService.getAll());
    setStats(SubscriptionService.getStats());
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const filteredSubs = subscriptions.filter((sub) => {
    const matchesSearch =
      sub.organizationName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || sub.status === statusFilter;
    const matchesPlan = planFilter === "ALL" || sub.planTier === planFilter;
    const matchesCycle = cycleFilter === "ALL" || sub.billingCycle === cycleFilter;
    return matchesSearch && matchesStatus && matchesPlan && matchesCycle;
  });

  const openDrawer = (sub: SubscriptionRecord) => {
    setSelectedSub(sub);
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedSub(null);
  };

  const handleChangePlan = (subId: string, newPlan: "Starter" | "Growth" | "Enterprise", newAmount: number) => {
    SubscriptionService.changePlan(subId, newPlan, newAmount);
    refresh();
    closeDrawer();
  };

  const handleCancel = (subId: string) => {
    SubscriptionService.cancelSubscription(subId);
    refresh();
    closeDrawer();
  };

  const handleReactivate = (subId: string) => {
    SubscriptionService.reactivateSubscription(subId);
    refresh();
    closeDrawer();
  };

  const handleToggleCycle = (subId: string) => {
    SubscriptionService.toggleBillingCycle(subId);
    refresh();
  };

  return {
    subscriptions,
    filteredSubs,
    stats,
    selectedSub,
    isDrawerOpen,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    planFilter,
    setPlanFilter,
    cycleFilter,
    setCycleFilter,
    openDrawer,
    closeDrawer,
    handleChangePlan,
    handleCancel,
    handleReactivate,
    handleToggleCycle,
    refresh,
  };
}
