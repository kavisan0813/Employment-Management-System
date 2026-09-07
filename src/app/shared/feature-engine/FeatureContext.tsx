/**
 * ─────────────────────────────────────────────────────────────────
 *  FEATURE CONTEXT & CENTRAL FEATURE ENGINE
 *
 *  Single canonical evaluator for feature availability, subscription
 *  plan entitlement, organization overrides, and effective access.
 * ─────────────────────────────────────────────────────────────────
 */

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  useEffect,
  type ReactNode,
} from "react";
import { useAuth } from "../../context/AuthContext";
import { usePermissions } from "../permission-engine/PermissionContext";
import { subscribeFeatureState } from "./featureEvents";
import {
  FEATURE_REGISTRY,
  FEATURE_KEYS,
  planMeetsRequirement,
  type FeatureKey,
  type SubscriptionPlan,
} from "./featureRegistry";
import { db } from "../../admin/mockData";
import type { FeatureFlag, Organization, Subscription } from "../../admin/types";

export type EffectiveAccessLevel = "UNAVAILABLE" | "READ" | "EDIT" | "EDITABLE";

interface FeatureContextValue {
  /** Active organization ID */
  organizationId: string;
  /** Effective subscription plan for current organization */
  subscriptionPlan: SubscriptionPlan;
  /** Check if a feature is enabled and allowed for current org/subscription */
  isFeatureEnabled: (featureKey: string) => boolean;
  /** Calculate single effective access level (UNAVAILABLE | READ | EDIT) */
  getEffectiveAccess: (
    featureKey: string,
    permissionKey?: string,
  ) => EffectiveAccessLevel;
  /** Force refresh feature engine state from store */
  refreshFeatureState: () => void;
}

const FeatureContext = createContext<FeatureContextValue | undefined>(
  undefined,
);

export function FeatureProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const { hasPermissionKey } = usePermissions();

  const [tick, setTick] = useState(0);

  const refreshFeatureState = useCallback(() => {
    setTick((prev) => prev + 1);
  }, []);

  useEffect(() => {
    return subscribeFeatureState(refreshFeatureState);
  }, [refreshFeatureState]);

  // Determine active organization ID
  const organizationId = useMemo(() => {
    return user?.organizationId || "org-1";
  }, [user]);

  // Resolve current organization and subscription plan
  const subscriptionPlan = useMemo<SubscriptionPlan>(() => {
    // Re-evaluate on tick
    void tick;
    try {
      const subs: Subscription[] = db.subscriptions.get();
      const activeSub = subs.find(
        (s) => s.organizationId === organizationId && s.status === "Active",
      );
      if (activeSub?.plan) {
        return activeSub.plan as SubscriptionPlan;
      }

      const orgs: Organization[] = db.organizations.get();
      const currentOrg = orgs.find((o) => o.id === organizationId);
      if (currentOrg?.plan) {
        if (currentOrg.plan === "Trial" || currentOrg.plan === "Basic") {
          return "Starter";
        }
        if (currentOrg.plan === "Professional") {
          return "Growth";
        }
        return currentOrg.plan as SubscriptionPlan;
      }
    } catch {
      // Fallback default
    }
    return "Enterprise";
  }, [organizationId, tick]);

  // Core feature evaluator
  const isFeatureEnabled = useCallback(
    (featureKey: string): boolean => {
      void tick;
      const def = FEATURE_REGISTRY[featureKey as FeatureKey];
      if (!def) {
        // If unknown feature key, default to enabled to prevent breaking UI
        return true;
      }

      // Step 1: Subscription entitlement check
      if (!planMeetsRequirement(subscriptionPlan, def.minimumPlan)) {
        return false;
      }

      // Step 2: System Feature Flag check in db.featureFlags
      try {
        const flags: FeatureFlag[] = db.featureFlags.get();
        const matchingFlag = flags.find((f) => f.key === featureKey);

        if (matchingFlag) {
          // If flag is explicitly inactive (archived/disabled globally)
          if (matchingFlag.status === "Inactive") {
            return false;
          }

          // If flag has plan restrictions
          if (
            matchingFlag.enabledPlans &&
            matchingFlag.enabledPlans.length > 0 &&
            !matchingFlag.enabledPlans.includes(subscriptionPlan)
          ) {
            return false;
          }

          // If org override list is specified and current org is explicitly excluded
          if (
            matchingFlag.enabledOrgIds &&
            matchingFlag.enabledOrgIds.length > 0 &&
            !matchingFlag.enabledOrgIds.includes(organizationId)
          ) {
            return false;
          }
        }
      } catch {
        // Fallback to default state
      }

      // Step 3: Organization featureOverrides & enabledModules check
      try {
        const orgs: Organization[] = db.organizations.get();
        const currentOrg = orgs.find((o) => o.id === organizationId);
        if (currentOrg) {
          // Direct organization feature override (takes precedence if defined)
          if (
            currentOrg.featureOverrides &&
            typeof currentOrg.featureOverrides[featureKey] === "boolean"
          ) {
            return currentOrg.featureOverrides[featureKey];
          }

          // Backward compatibility check for enabledModules list
          if (currentOrg.enabledModules && currentOrg.enabledModules.length > 0) {
            const moduleNameMap: Record<string, string> = {
              [FEATURE_KEYS.EMPLOYEES]: "Employee Management",
              [FEATURE_KEYS.ATTENDANCE]: "Attendance",
              [FEATURE_KEYS.LEAVE]: "Leave Management",
              [FEATURE_KEYS.PAYROLL]: "Payroll",
              [FEATURE_KEYS.RECRUITMENT]: "Recruitment",
              [FEATURE_KEYS.PERFORMANCE]: "Performance",
              [FEATURE_KEYS.ASSETS]: "Assets",
              [FEATURE_KEYS.TRAINING]: "Training",
            };
            const mappedName = moduleNameMap[featureKey];
            if (mappedName && !currentOrg.enabledModules.includes(mappedName)) {
              return false;
            }
          }
        }
      } catch {
        // Fallback
      }

      return def.defaultEnabled;
    },
    [subscriptionPlan, organizationId, tick],
  );

  // Effective access evaluator
  const getEffectiveAccess = useCallback(
    (featureKey: string, permissionKey?: string): EffectiveAccessLevel => {
      // 1. Feature check
      if (!isFeatureEnabled(featureKey)) {
        return "UNAVAILABLE";
      }

      // 2. Permission check
      if (permissionKey && !hasPermissionKey(permissionKey)) {
        return "UNAVAILABLE";
      }

      // 3. Permission level check for EDIT vs READ
      if (permissionKey) {
        const isManage =
          permissionKey.endsWith(".manage") ||
          permissionKey.endsWith(".full") ||
          permissionKey.endsWith(".create") ||
          permissionKey.endsWith(".edit") ||
          permissionKey.endsWith(".delete") ||
          permissionKey.endsWith(".approve");
        if (isManage) {
          return "EDITABLE";
        }
      }

      return "READ";
    },
    [isFeatureEnabled, hasPermissionKey],
  );

  const value = useMemo<FeatureContextValue>(
    () => ({
      organizationId,
      subscriptionPlan,
      isFeatureEnabled,
      getEffectiveAccess,
      refreshFeatureState,
    }),
    [
      organizationId,
      subscriptionPlan,
      isFeatureEnabled,
      getEffectiveAccess,
      refreshFeatureState,
    ],
  );

  return (
    <FeatureContext.Provider value={value}>{children}</FeatureContext.Provider>
  );
}

export function useFeature(): FeatureContextValue {
  const context = useContext(FeatureContext);
  if (context === undefined) {
    throw new Error("useFeature must be used within a FeatureProvider");
  }
  return context;
}
