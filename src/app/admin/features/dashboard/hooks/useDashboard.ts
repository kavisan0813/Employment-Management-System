import { useState, useCallback } from "react";
import useSWR from "swr";
import { db } from "../../../mockData";
import { DashboardStatsCache, DailySnapshot } from "../../../types";

// Rate limit helper
let lastGlobalRefresh = 0;
const REFRESH_COOLDOWN_MS = 5 * 60 * 1000; // 5 minutes

export function useDashboard() {
  const [isRefreshing, setIsRefreshing] = useState(false);

  // 1. getDashboardSummary()
  // Fetch from mock DB cache
  const fetchSummary = async (): Promise<{
    current: DashboardStatsCache;
    growth: {
      signups_vs_last_month: number;
      mrr_vs_last_month: number;
    };
  }> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const stats = db.dashboardStats.get();
        // Calculate mock growth based on current values vs a simulated last month
        const growth = {
          signups_vs_last_month: stats.new_signups_this_month > 0 ? 15.2 : -5.4,
          mrr_vs_last_month: stats.mrr_total > 0 ? 12.5 : -2.1,
        };
        resolve({ current: stats, growth });
      }, 500); // Simulate network delay
    });
  };

  const {
    data: summaryData,
    error: summaryError,
    isLoading: summaryLoading,
    mutate: mutateSummary,
  } = useSWR("dashboardSummary", fetchSummary);

  // 2 & 3. getMRRTrend & getSignupTrend
  const fetchTrends = async (): Promise<DailySnapshot[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const snapshots = db.dailySnapshots.get();
        // Sort chronologically just in case
        resolve(
          snapshots.sort(
            (a, b) =>
              new Date(a.snapshot_date).getTime() -
              new Date(b.snapshot_date).getTime(),
          ),
        );
      }, 400);
    });
  };
  const { data: trendData } = useSWR("dashboardTrends", fetchTrends);

  // 4. getActiveInactiveBreakdown()
  const activeInactiveBreakdown = summaryData
    ? {
        active_using: summaryData.current.active_companies_count,
        active_not_using: summaryData.current.at_risk_companies_count,
        inactive: summaryData.current.inactive_companies_count,
        trial: summaryData.current.trial_companies,
      }
    : null;

  // 5. getRecentSignups(limit = 5)
  interface RecentSignup {
    org_id: string;
    name: string;
    plan_name: string;
    created_at: string;
    status: string;
  }
  const fetchRecentSignups = async () => {
    return new Promise<RecentSignup[]>((resolve) => {
      setTimeout(() => {
        const orgs = db.organizations.get();
        const sorted = orgs.sort(
          (a, b) =>
            new Date(b.joinedAt).getTime() - new Date(a.joinedAt).getTime(),
        );
        resolve(
          sorted.slice(0, 5).map((o) => ({
            org_id: o.id,
            name: o.name,
            plan_name: o.plan,
            created_at: o.joinedAt,
            status: o.status,
          })),
        );
      }, 300);
    });
  };
  const { data: recentSignups } = useSWR("recentSignups", fetchRecentSignups);

  // 6. getAtRiskCompanies(limit = 10)
  interface AtRiskCompany {
    org_id: string;
    name: string;
    plan_name: string;
    days_since_login: number | string;
  }
  const fetchAtRisk = async () => {
    return new Promise<AtRiskCompany[]>((resolve) => {
      setTimeout(() => {
        const orgs = db.organizations.get();
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const atRisk = orgs.filter(
          (o) =>
            o.status === "Active" &&
            (!o.lastActiveAt || new Date(o.lastActiveAt) < thirtyDaysAgo),
        );

        const sorted = atRisk.sort((a, b) => {
          const tA = a.lastActiveAt ? new Date(a.lastActiveAt).getTime() : 0;
          const tB = b.lastActiveAt ? new Date(b.lastActiveAt).getTime() : 0;
          return tA - tB; // oldest first
        });

        resolve(
          sorted.slice(0, 10).map((o) => ({
            org_id: o.id,
            name: o.name,
            plan_name: o.plan,
            days_since_login: o.lastActiveAt
              ? Math.floor(
                  (Date.now() - new Date(o.lastActiveAt).getTime()) /
                    (1000 * 60 * 60 * 24),
                )
              : "Never",
          })),
        );
      }, 300);
    });
  };
  const { data: atRiskCompanies } = useSWR("atRiskCompanies", fetchAtRisk);

  // 7. refreshDashboardCache()
  const refreshAll = useCallback(async () => {
    const now = Date.now();
    if (now - lastGlobalRefresh < REFRESH_COOLDOWN_MS) {
      // Prevent refreshing if rate limit not reached
      return;
    }

    setIsRefreshing(true);
    lastGlobalRefresh = now;

    // Simulate heavy aggregation query
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const orgs = db.organizations.get();

    // Calculate metrics exactly as requested
    const total_companies = orgs.length;
    let active_subscriptions = 0;
    let mrr_total = 0;
    let new_signups_this_month = 0;
    let new_signups_today = 0;
    let active_companies_count = 0;
    let at_risk_companies_count = 0;
    let inactive_companies_count = 0;
    let trial_companies = 0;
    let expired_companies = 0;
    let suspended_companies = 0;
    let total_employees_platform_wide = 0;

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    orgs.forEach((o) => {
      total_employees_platform_wide += o.userCount || 0;

      if (o.status === "Trial") trial_companies++;
      else if (o.status === "Expired") expired_companies++;
      else if (o.status === "Suspended") suspended_companies++;

      if (o.status === "Active") {
        active_subscriptions++;

        // Use 'monthly' assumption for MRR since 'billing_cycle' is not in standard mock data,
        // fallback to mapping logic: MRR is direct value.
        mrr_total += o.mrr || 0;

        const lastLogin = o.lastActiveAt ? new Date(o.lastActiveAt) : null;
        if (lastLogin && lastLogin >= thirtyDaysAgo) {
          active_companies_count++;
        } else {
          at_risk_companies_count++;
        }
      } else if (["Expired", "Suspended", "Inactive"].includes(o.status)) {
        inactive_companies_count++;
      }

      if (o.joinedAt) {
        const joined = new Date(o.joinedAt);
        if (joined >= startOfMonth) new_signups_this_month++;
        if (joined >= startOfToday) new_signups_today++;
      }
    });

    const newStats: DashboardStatsCache = {
      stat_id: "global-stats-1",
      total_companies,
      active_subscriptions,
      trial_companies,
      expired_companies,
      suspended_companies,
      mrr_total,
      arr_total: mrr_total * 12,
      new_signups_this_month,
      new_signups_today,
      active_companies_count,
      at_risk_companies_count,
      inactive_companies_count,
      total_employees_platform_wide,
      calculated_at: new Date().toISOString(),
    };

    db.dashboardStats.save(newStats);

    // Write Daily Snapshot (mock logic: only append if today not present)
    const snapshots = db.dailySnapshots.get();
    const todayStr = startOfToday.toISOString();
    if (!snapshots.find((s) => s.snapshot_date === todayStr)) {
      snapshots.push({
        snapshot_date: todayStr,
        total_companies,
        mrr_total,
        new_signups: new_signups_today,
        active_companies_count,
        total_employees: total_employees_platform_wide,
      });
      // Keep only last 6 for UI if needed, or let it grow.
      db.dailySnapshots.save(snapshots);
    }

    // Force re-fetches
    await mutateSummary();

    setIsRefreshing(false);
  }, [mutateSummary]);

  // 8. exportDashboardReport
  const exportReport = async (format: "pdf" | "csv") => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        if (!summaryData) return resolve();

        if (format === "csv") {
          const stats = summaryData.current;
          const csv = `Metric,Value\nTotal Companies,${stats.total_companies}\nActive Subscriptions,${stats.active_subscriptions}\nMRR,${stats.mrr_total}\nARR,${stats.arr_total}\nTotal Employees,${stats.total_employees_platform_wide}\n`;
          const blob = new Blob([csv], { type: "text/csv" });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `dashboard_export_${new Date().toISOString()}.${format}`;
          a.click();
        }
        resolve();
      }, 500);
    });
  };

  // Maps snapshot to just { month, mrr_value } or { month, signup_count }
  const mrrTrend = trendData?.map((s) => {
    const d = new Date(s.snapshot_date);
    return {
      month: d.toLocaleString("default", { month: "short" }),
      mrr_value: s.mrr_total,
    };
  });

  const signupTrend = trendData?.map((s) => {
    const d = new Date(s.snapshot_date);
    return {
      month: d.toLocaleString("default", { month: "short" }),
      signup_count: s.new_signups,
    };
  });

  return {
    summary: summaryData,
    mrrTrend,
    signupTrend,
    activeInactiveBreakdown,
    recentSignups,
    atRiskCompanies,
    isLoading: summaryLoading,
    isError: !!summaryError,
    refreshAll,
    exportReport,
    isRefreshing,
  };
}
