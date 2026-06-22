/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type PlanTier = "Starter" | "Growth" | "Enterprise";
export type BillingCycle = "Monthly" | "Annual";

export interface PlanFeature {
  name: string;
  included: boolean;
  limit?: string;
}

export interface Plan {
  id: string;
  name: string;
  tier: PlanTier;
  description: string;
  monthlyPrice: number;
  annualPrice: number;
  currency: string;
  features: PlanFeature[];
  maxUsers: number;
  maxStorage: string;
  status: "Active" | "Inactive";
  subscriberCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface PlanFormData {
  name: string;
  tier: PlanTier;
  description: string;
  monthlyPrice: number;
  annualPrice: number;
  maxUsers: number;
  maxStorage: string;
}

export const PLAN_COLORS: Record<PlanTier, string> = {
  Starter: "#6366f1",
  Growth: "#f59e0b",
  Enterprise: "#10b981",
};

export const DEFAULT_PLAN_FEATURES: Record<PlanTier, PlanFeature[]> = {
  Starter: [
    { name: "Employee Management", included: true, limit: "Up to 25" },
    { name: "Attendance Tracking", included: true },
    { name: "Leave Management", included: true },
    { name: "Payroll", included: false },
    { name: "AI Features", included: false },
    { name: "Custom Branding", included: false },
    { name: "API Access", included: false },
    { name: "Priority Support", included: false },
  ],
  Growth: [
    { name: "Employee Management", included: true, limit: "Up to 250" },
    { name: "Attendance Tracking", included: true },
    { name: "Leave Management", included: true },
    { name: "Payroll", included: true },
    { name: "AI Features", included: true, limit: "Basic" },
    { name: "Custom Branding", included: true },
    { name: "API Access", included: false },
    { name: "Priority Support", included: false },
  ],
  Enterprise: [
    { name: "Employee Management", included: true, limit: "Unlimited" },
    { name: "Attendance Tracking", included: true },
    { name: "Leave Management", included: true },
    { name: "Payroll", included: true },
    { name: "AI Features", included: true, limit: "Advanced" },
    { name: "Custom Branding", included: true },
    { name: "API Access", included: true },
    { name: "Priority Support", included: true },
  ],
};
