/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { db, pushAuditLog } from "../../../../admin/mockData";
import { Subscription } from "../../../../admin/types";
import { SubscriptionRecord, SubscriptionStats } from "../types/subscription.types";

const CURRENT_ADMIN = "admin@ems.io";

function mapToRecord(sub: Subscription, orgName?: string): SubscriptionRecord {
  return {
    id: sub.id,
    organizationId: sub.organizationId,
    organizationName: orgName || sub.organization,
    planTier: sub.plan,
    status: sub.status,
    billingCycle: sub.billingCycle,
    amount: sub.amount,
    currency: sub.currency,
    startDate: sub.startDate,
    renewalDate: sub.renewalDate,
    cancelledAt: sub.status === "Inactive" ? new Date().toISOString() : null,
    paymentMethodLast4: sub.paymentMethodLast4,
    failedPaymentCount: sub.failedPaymentCount,
    autoRenew: sub.status === "Active",
  };
}

export const SubscriptionService = {
  getAll(): SubscriptionRecord[] {
    const subs = db.subscriptions.get();
    const orgs = db.organizations.get();
    return subs.map((sub) => {
      const org = orgs.find((o) => o.id === sub.organizationId);
      return mapToRecord(sub, org?.name);
    });
  },

  getById(id: string): SubscriptionRecord | undefined {
    const subs = db.subscriptions.get();
    const sub = subs.find((s) => s.id === id);
    if (!sub) return undefined;
    const orgs = db.organizations.get();
    const org = orgs.find((o) => o.id === sub.organizationId);
    return mapToRecord(sub, org?.name);
  },

  getByOrgId(orgId: string): SubscriptionRecord | undefined {
    const subs = db.subscriptions.get();
    const sub = subs.find((s) => s.organizationId === orgId);
    if (!sub) return undefined;
    return mapToRecord(sub);
  },

  getStats(): SubscriptionStats {
    const subs = db.subscriptions.get();
    const active = subs.filter((s) => s.status === "Active");
    const totalRevenue = active.reduce((sum, s) => sum + s.amount, 0);
    const trials = subs.filter((s) => s.status === "Trial");
    const cancelled = subs.filter((s) => s.status === "Inactive");

    const now = new Date();
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    const renewals = subs.filter((s) => {
      if (!s.renewalDate) return false;
      const rDate = new Date(s.renewalDate);
      return rDate >= now && rDate <= monthEnd && s.status === "Active";
    });

    return {
      totalActive: active.length,
      totalRevenue,
      avgRevenuePerOrg: active.length > 0 ? totalRevenue / active.length : 0,
      churnRate: subs.length > 0 ? (cancelled.length / subs.length) * 100 : 0,
      trialConversionRate: trials.length > 0 ? 65 : 0, // mock conversion rate
      renewalsThisMonth: renewals.length,
    };
  },

  changePlan(subId: string, newPlan: "Starter" | "Growth" | "Enterprise", newAmount: number): void {
    const subs = db.subscriptions.get().map((s) =>
      s.id === subId ? { ...s, plan: newPlan, amount: newAmount } : s
    );
    db.subscriptions.save(subs);

    pushAuditLog(
      "subscription.plan_change",
      "Billing",
      CURRENT_ADMIN,
      "platform_admin",
      null,
      "Active",
      { subscriptionId: subId, newPlan, amount: String(newAmount) }
    );
  },

  cancelSubscription(subId: string): void {
    const subs = db.subscriptions.get().map((s) =>
      s.id === subId ? { ...s, status: "Inactive" as const, renewalDate: null } : s
    );
    db.subscriptions.save(subs);

    pushAuditLog(
      "subscription.cancel",
      "Billing",
      CURRENT_ADMIN,
      "platform_admin",
      null,
      "Active",
      { subscriptionId: subId }
    );
  },

  reactivateSubscription(subId: string): void {
    const renewalDate = new Date();
    renewalDate.setMonth(renewalDate.getMonth() + 1);

    const subs = db.subscriptions.get().map((s) =>
      s.id === subId
        ? { ...s, status: "Active" as const, renewalDate: renewalDate.toISOString().slice(0, 10) }
        : s
    );
    db.subscriptions.save(subs);

    pushAuditLog(
      "subscription.reactivate",
      "Billing",
      CURRENT_ADMIN,
      "platform_admin",
      null,
      "Active",
      { subscriptionId: subId }
    );
  },

  toggleBillingCycle(subId: string): void {
    const subs = db.subscriptions.get().map((s) =>
      s.id === subId
        ? { ...s, billingCycle: s.billingCycle === "Monthly" ? ("Annual" as const) : ("Monthly" as const) }
        : s
    );
    db.subscriptions.save(subs);
  },

  getRenewalsUpcoming(days: number = 30): SubscriptionRecord[] {
    const now = new Date();
    const cutoff = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
    const subs = db.subscriptions.get();
    const orgs = db.organizations.get();
    return subs
      .filter((s) => {
        if (!s.renewalDate || s.status !== "Active") return false;
        const rDate = new Date(s.renewalDate);
        return rDate >= now && rDate <= cutoff;
      })
      .map((sub) => {
        const org = orgs.find((o) => o.id === sub.organizationId);
        return mapToRecord(sub, org?.name);
      });
  },
};
