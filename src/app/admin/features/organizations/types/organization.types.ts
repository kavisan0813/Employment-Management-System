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

export const PLAN_PRICING: Record<"Starter" | "Growth" | "Enterprise", number> = {
  Starter: 99,
  Growth: 1200,
  Enterprise: 3500,
};
