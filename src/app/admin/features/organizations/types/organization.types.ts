/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface OrganizationsViewProps {
  initialSelectId?: string | null;
  clearInitialSelectId?: () => void;
  onNavigate?: (view: string, targetId?: string) => void;
}

export type DrawerTab = "overview" | "users" | "billing" | "activity" | "settings";

export const REGIONS = [
  "North America",
  "Europe",
  "Asia Pacific",
  "United Kingdom",
  "Latin America",
];

export const PLAN_PRICING: Record<string, number> = {
  Trial: 0,
  Starter: 99,
  Basic: 99,
  Growth: 1200,
  Professional: 299,
  Enterprise: 3500,
};
