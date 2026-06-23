/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { EntityStatus } from "../../../../admin/types";
import { PlanTier, BillingCycle } from "./plan.types";

export interface SubscriptionRecord {
  id: string;
  organizationId: string;
  organizationName: string;
  planTier: PlanTier;
  status: EntityStatus;
  billingCycle: BillingCycle;
  amount: number;
  currency: string;
  startDate: string;
  renewalDate: string | null;
  cancelledAt: string | null;
  paymentMethodLast4: string | null;
  failedPaymentCount: number;
  autoRenew: boolean;
}

export type SubscriptionStatusFilter = "ALL" | EntityStatus;

export interface SubscriptionStats {
  totalActive: number;
  totalRevenue: number;
  avgRevenuePerOrg: number;
  churnRate: number;
  trialConversionRate: number;
  renewalsThisMonth: number;
}
