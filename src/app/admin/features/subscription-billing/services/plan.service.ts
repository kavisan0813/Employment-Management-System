/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Plan, PlanTier, DEFAULT_PLAN_FEATURES } from "../types/plan.types";

const SEED_PLANS: Plan[] = [
  {
    id: "plan-starter",
    name: "Starter",
    tier: "Starter",
    description: "Perfect for small teams getting started with HR management.",
    monthlyPrice: 99,
    annualPrice: 990,
    currency: "USD",
    features: DEFAULT_PLAN_FEATURES.Starter,
    maxUsers: 25,
    maxStorage: "5 GB",
    status: "Active",
    subscriberCount: 3,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2026-06-01T00:00:00Z",
  },
  {
    id: "plan-growth",
    name: "Growth",
    tier: "Growth",
    description: "For growing companies that need advanced HR workflows and payroll.",
    monthlyPrice: 1200,
    annualPrice: 12000,
    currency: "USD",
    features: DEFAULT_PLAN_FEATURES.Growth,
    maxUsers: 250,
    maxStorage: "50 GB",
    status: "Active",
    subscriberCount: 2,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2026-06-01T00:00:00Z",
  },
  {
    id: "plan-enterprise",
    name: "Enterprise",
    tier: "Enterprise",
    description: "Full-featured solution for large enterprises with unlimited capabilities.",
    monthlyPrice: 3500,
    annualPrice: 35000,
    currency: "USD",
    features: DEFAULT_PLAN_FEATURES.Enterprise,
    maxUsers: 99999,
    maxStorage: "Unlimited",
    status: "Active",
    subscriberCount: 5,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2026-06-01T00:00:00Z",
  },
];

function getPlansStore(): Plan[] {
  try {
    const item = localStorage.getItem("ems_billing_plans");
    return item ? JSON.parse(item) : SEED_PLANS;
  } catch {
    return SEED_PLANS;
  }
}

function savePlansStore(plans: Plan[]) {
  localStorage.setItem("ems_billing_plans", JSON.stringify(plans));
}

export const PlanService = {
  getAll(): Plan[] {
    return getPlansStore();
  },

  getByTier(tier: PlanTier): Plan | undefined {
    return getPlansStore().find((p) => p.tier === tier);
  },

  getById(id: string): Plan | undefined {
    return getPlansStore().find((p) => p.id === id);
  },

  create(data: Partial<Plan>): Plan {
    const plans = getPlansStore();
    const newPlan: Plan = {
      id: `plan-${Date.now()}`,
      name: data.name || "",
      tier: data.tier || "Starter",
      description: data.description || "",
      monthlyPrice: data.monthlyPrice || 0,
      annualPrice: data.annualPrice || 0,
      currency: data.currency || "USD",
      features: data.features || DEFAULT_PLAN_FEATURES[data.tier || "Starter"],
      maxUsers: data.maxUsers || 10,
      maxStorage: data.maxStorage || "5 GB",
      status: "Active",
      subscriberCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    savePlansStore([newPlan, ...plans]);
    return newPlan;
  },

  update(id: string, data: Partial<Plan>): void {
    const plans = getPlansStore().map((p) =>
      p.id === id ? { ...p, ...data, updatedAt: new Date().toISOString() } : p
    );
    savePlansStore(plans);
  },

  toggleStatus(id: string): void {
    const plans = getPlansStore().map((p) =>
      p.id === id
        ? { ...p, status: p.status === "Active" ? ("Inactive" as const) : ("Active" as const) }
        : p
    );
    savePlansStore(plans);
  },

  getRevenueByTier(): { tier: PlanTier; revenue: number; count: number }[] {
    const plans = getPlansStore();
    return plans
      .filter((p) => p.status === "Active")
      .map((p) => ({
        tier: p.tier,
        revenue: p.monthlyPrice * p.subscriberCount,
        count: p.subscriberCount,
      }));
  },
};
