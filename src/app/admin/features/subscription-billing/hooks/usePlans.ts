/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback } from "react";
import { Plan } from "../types/plan.types";
import { PlanService } from "../services/plan.service";

export function usePlans() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "ALL" | "Active" | "Inactive"
  >("ALL");

  const refresh = useCallback(() => {
    setPlans(PlanService.getAll());
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const filteredPlans = plans.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const openCreate = () => {
    setSelectedPlan(null);
    setIsEditing(false);
    setIsFormOpen(true);
  };

  const openEdit = (plan: Plan) => {
    setSelectedPlan(plan);
    setIsEditing(true);
    setIsFormOpen(true);
  };

  const handleSave = (data: Partial<Plan>) => {
    if (isEditing && selectedPlan) {
      PlanService.update(selectedPlan.id, data);
    } else {
      PlanService.create(data);
    }
    setIsFormOpen(false);
    refresh();
  };

  const handleToggleStatus = (id: string) => {
    PlanService.toggleStatus(id);
    refresh();
  };

  const revenueByTier = PlanService.getRevenueByTier();

  return {
    plans,
    filteredPlans,
    selectedPlan,
    isFormOpen,
    setIsFormOpen,
    isEditing,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    openCreate,
    openEdit,
    handleSave,
    handleToggleStatus,
    revenueByTier,
    refresh,
  };
}
