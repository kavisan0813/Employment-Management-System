/**
 * Mock data for the EMS Dashboard.
 */

export const DASHBOARD_STATS = [
  { label: "Total Organizations", value: "1,284", trend: "+12%", trendUp: true, accent: "primary" },
  { label: "Active Users", value: "48,391", trend: "+8.3%", trendUp: true, accent: "success" },
  { label: "MRR", value: "$92,450", trend: "+5.1%", trendUp: true, accent: "info" },
  { label: "Open Tickets", value: "34", trend: "-18%", trendUp: false, accent: "warning" },
];

export const PLAN_DISTRIBUTION = [
  { name: "Enterprise", pct: 38, colorVar: "var(--chart-1)" },
  { name: "Growth", pct: 29, colorVar: "var(--chart-3)" },
  { name: "Starter", pct: 21, colorVar: "var(--chart-2)" },
  { name: "Trial", pct: 12, colorVar: "var(--chart-4)" },
];

export const RECENT_ACTIVITY = [
  { label: "Acme Corp upgraded to Enterprise", time: "2m ago", colorVar: "var(--chart-1)" },
  { label: "New org: Bright Labs registered", time: "14m ago", colorVar: "var(--chart-2)" },
  { label: "Orbit Systems payment failed", time: "1h ago", colorVar: "var(--chart-5)" },
  { label: "System health check passed", time: "2h ago", colorVar: "var(--chart-3)" },
  { label: "API rate limit increased for Nexus", time: "3h ago", colorVar: "var(--chart-4)" },
];

export const RECENT_ORGANIZATIONS = [
  { name: "Acme Corp", status: "Active", plan: "Enterprise", userCount: 1240, joinedAt: "Mar 12, 2024" },
  { name: "Bright Labs", status: "Trial", plan: "Starter", userCount: 88, joinedAt: "Jun 1, 2024" },
  { name: "Nexus Solutions", status: "Active", plan: "Growth", userCount: 430, joinedAt: "Jan 5, 2024" },
  { name: "Orbit Systems", status: "Pending", plan: "Growth", userCount: 215, joinedAt: "Jun 14, 2024" },
];
