import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import {
  Building2,
  Users,
  IndianRupee,
  UserPlus,
  AlertTriangle,
  RefreshCcw,
  Download,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  ChevronRight,
  UserCheck,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { useDashboard } from "./hooks/useDashboard";
import "../../../styles/DashboardView.css";

export default function DashboardView() {
  const navigate = useNavigate();
  const {
    summary,
    mrrTrend,
    signupTrend,
    activeInactiveBreakdown,
    recentSignups,
    atRiskCompanies,
    isLoading,
    isError,
    refreshAll,
    exportReport,
    isRefreshing,
  } = useDashboard();

  const [isARR, setIsARR] = useState(false);
  const [minsAgo, setMinsAgo] = useState(0);

  // Update "mins ago" counter based on cached timestamp
  useEffect(() => {
    if (!summary?.current?.calculated_at) return;
    const calcDate = new Date(summary.current.calculated_at).getTime();

    const updateTime = () => {
      setMinsAgo(Math.floor((Date.now() - calcDate) / 60000));
    };

    updateTime();
    const timer = setInterval(updateTime, 60000);
    return () => clearInterval(timer);
  }, [summary?.current?.calculated_at]);

  const handleRefresh = async () => {
    await refreshAll();
  };

  const handleExport = async (format: "pdf" | "csv") => {
    await exportReport(format);
  };

  const handleNavigateToOrgs = (p0: string) => {
    navigate("/platform-admin/organizations");
  };

  if (isLoading && !summary) {
    return (
      <div className="p-8 space-y-6">
        <div className="h-12 w-1/3 bg-gray-200 animate-pulse rounded-lg"></div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-32 bg-gray-200 animate-pulse rounded-xl"
            ></div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-96 bg-gray-200 animate-pulse rounded-xl"></div>
          <div className="h-96 bg-gray-200 animate-pulse rounded-xl"></div>
        </div>
      </div>
    );
  }

  if (isError || !summary) {
    return (
      <div className="p-8 text-center bg-white rounded-xl shadow-sm border border-gray-200">
        <AlertTriangle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900">
          Failed to load dashboard data
        </h2>
        <p className="text-gray-500 font-medium mt-2">
          There was an issue connecting to the caching service.
        </p>
        <button
          onClick={handleRefresh}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold cursor-pointer"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Formatting helpers
  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val);
  const formatNumber = (val: number) =>
    new Intl.NumberFormat("en-IN").format(val);

  // Growth calculations
  const signupsGrowth = summary.growth.signups_vs_last_month;
  const mrrGrowth = summary.growth.mrr_vs_last_month;
  const activeSubsPercent = summary.current.total_companies
    ? (
        (summary.current.active_subscriptions /
          summary.current.total_companies) *
        100
      ).toFixed(1)
    : 0;
  const avgEmployees = summary.current.total_companies
    ? Math.round(
        summary.current.total_employees_platform_wide /
          summary.current.total_companies,
      )
    : 0;

  // Pie chart colors
  const PIE_COLORS = {
    "Active & Using": "#10b981", // emerald-500
    "Active (At Risk)": "#f59e0b", // amber-500
    Inactive: "#ef4444", // red-500
    Trial: "#3b82f6", // blue-500
  };

  const pieData = activeInactiveBreakdown
    ? [
        { name: "Active & Using", value: activeInactiveBreakdown.active_using },
        {
          name: "Active (At Risk)",
          value: activeInactiveBreakdown.active_not_using,
        },
        { name: "Inactive", value: activeInactiveBreakdown.inactive },
        { name: "Trial", value: activeInactiveBreakdown.trial },
      ].filter((d) => d.value > 0)
    : [];

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="px-6 py-5 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/50">
        <div>
          <h1 className="text-lg font-bold tracking-tight text-gray-900 flex items-center gap-2">
            Platform Overview
          </h1>
          <div className="flex items-center gap-2 text-sm text-gray-500 mt-1 font-semibold">
            <Clock className="w-4 h-4" />
            Last updated:{" "}
            {minsAgo === 0 ? "Just now" : `${minsAgo} minutes ago`}
            {isRefreshing && (
              <span className="text-indigo-600 animate-pulse ml-2 font-bold">
                Refreshing...
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center cursor-pointer gap-2 px-4 py-2 text-sm font-bold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <RefreshCcw
              className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`}
            />{" "}
            Refresh
          </button>
          <div className="relative group">
            <button className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white bg-indigo-600 border border-transparent rounded-lg hover:bg-indigo-700 transition-colors shadow-sm">
              <Download className="w-4 h-4" /> Export Report
            </button>
            <div className="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 py-1">
              <button
                onClick={() => handleExport("pdf")}
                className="cursor-pointer w-full text-left px-4 py-2 text-sm font-bold text-gray-700 hover:bg-gray-50 hover:text-indigo-600 border-none bg-transparent"
              >
                As PDF
              </button>
              <button
                onClick={() => handleExport("csv")}
                className="cursor-pointer w-full text-left px-4 py-2 text-sm font-bold text-gray-700 hover:bg-gray-50 hover:text-indigo-600 border-none bg-transparent"
              >
                As CSV
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ROW 1: METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Companies */}
        <div className="db-card p-5 rounded-xl shadow-sm flex flex-col justify-between transition-shadow bg-blue-50/30 border-blue-100">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Total
            </span>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-black text-gray-900 tracking-tight">
              {formatNumber(summary.current.total_companies)}
            </h3>
            <p className="text-sm font-semibold text-emerald-600 mt-1 flex items-center gap-1">
              <ArrowUpRight className="w-4 h-4" />{" "}
              {formatNumber(summary.current.new_signups_this_month)} this month
            </p>
          </div>
        </div>

        {/* Active Subscriptions */}
        <div className="db-card p-5 rounded-xl shadow-sm flex flex-col justify-between transition-shadow bg-emerald-50/30 border-emerald-100">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <UserCheck className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Active
            </span>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-black text-gray-900 tracking-tight">
              {formatNumber(summary.current.active_subscriptions)}
            </h3>
            <p className="text-sm font-semibold text-gray-500 mt-1">
              {activeSubsPercent}% of total companies
            </p>
          </div>
        </div>

        {/* Revenue */}
        <div className="db-card p-5 rounded-xl shadow-sm flex flex-col justify-between transition-shadow group relative overflow-hidden bg-indigo-50/30 border-indigo-100">
          <div className="flex items-center justify-between relative z-10">
            <div
              className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center cursor-pointer"
              onClick={() => setIsARR(!isARR)}
              title="Toggle MRR/ARR"
            >
              <IndianRupee className="w-5 h-5" />
            </div>
            <div
              className="flex bg-gray-100 p-0.5 rounded-md cursor-pointer"
              onClick={() => setIsARR(!isARR)}
            >
              <span
                className={`px-2 py-0.5 text-[10px] font-bold rounded-sm uppercase ${!isARR ? "bg-white text-indigo-700 shadow-sm" : "text-gray-500"}`}
              >
                MRR
              </span>
              <span
                className={`px-2 py-0.5 text-[10px] font-bold rounded-sm uppercase ${isARR ? "bg-white text-indigo-700 shadow-sm" : "text-gray-500"}`}
              >
                ARR
              </span>
            </div>
          </div>
          <div className="mt-4 relative z-10">
            <h3 className="text-3xl font-black text-gray-900 tracking-tight">
              {formatCurrency(
                isARR ? summary.current.arr_total : summary.current.mrr_total,
              )}
            </h3>
            <p
              className={`text-sm font-bold mt-1 flex items-center gap-1 ${mrrGrowth >= 0 ? "text-emerald-600" : "text-rose-600"}`}
            >
              {mrrGrowth >= 0 ? (
                <ArrowUpRight className="w-4 h-4" />
              ) : (
                <ArrowDownRight className="w-4 h-4" />
              )}
              {Math.abs(mrrGrowth).toFixed(1)}% vs last month
            </p>
          </div>
        </div>

        {/* New Signups */}
        <div className="db-card p-5 rounded-xl shadow-sm flex flex-col justify-between transition-shadow bg-purple-50/30 border-purple-100">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <UserPlus className="w-5 h-5" />
            </div>
            {signupTrend && signupTrend.length > 0 && (
              <div className="h-8 w-24">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={signupTrend.slice(-4)}>
                    <Line
                      type="monotone"
                      dataKey="signup_count"
                      stroke="#9333ea"
                      strokeWidth={2}
                      dot={false}
                      isAnimationActive={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-black text-gray-900 tracking-tight">
              {formatNumber(summary.current.new_signups_this_month)}
            </h3>
            <p
              className={`text-sm font-bold mt-1 flex items-center gap-1 ${signupsGrowth >= 0 ? "text-emerald-600" : "text-rose-600"}`}
            >
              {signupsGrowth >= 0 ? (
                <ArrowUpRight className="w-4 h-4" />
              ) : (
                <ArrowDownRight className="w-4 h-4" />
              )}
              {Math.abs(signupsGrowth).toFixed(1)}% vs last month
            </p>
          </div>
        </div>

        {/* Total Employees */}
        <div className="db-card p-5 rounded-xl shadow-sm flex flex-col justify-between transition-shadow bg-cyan-50/30 border-cyan-100">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-lg bg-cyan-50 text-cyan-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Users
            </span>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-black text-gray-900 tracking-tight">
              {formatNumber(summary.current.total_employees_platform_wide)}
            </h3>
            <p className="text-sm font-semibold text-gray-500 mt-1">
              Avg {formatNumber(avgEmployees)} / company
            </p>
          </div>
        </div>
      </div>

      {/* ROW 2: CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* MRR Trend */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-xs font-semibold">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                Revenue Trend (MRR)
              </h3>
              <p className="text-sm text-gray-500 font-semibold mt-1">
                Platform monthly recurring revenue over last 6 months
              </p>
            </div>
          </div>
          <div className="h-72 w-full">
            {mrrTrend && (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={mrrTrend}
                  margin={{ top: 5, right: 10, left: 20, bottom: 5 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#f3f4f6"
                  />
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#6b7280", fontSize: 12, fontWeight: 600 }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#6b7280", fontSize: 12, fontWeight: 600 }}
                    tickFormatter={(val) => `₹${(val / 1000).toFixed(0)}k`}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "8px",
                      border: "none",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                    }}
                    formatter={(value: number) => [
                      formatCurrency(value),
                      "MRR",
                    ]}
                  />
                  <Line
                    type="monotone"
                    dataKey="mrr_value"
                    stroke="#4f46e5"
                    strokeWidth={3}
                    dot={{
                      r: 4,
                      fill: "#4f46e5",
                      strokeWidth: 2,
                      stroke: "#fff",
                    }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Active vs Inactive Breakdown */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-xs font-semibold">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                Company Health Breakdown
              </h3>
              <p className="text-sm text-gray-500 font-semibold mt-1">
                Usage status across all registered organizations
              </p>
            </div>
          </div>
          <div className="h-72 w-full flex items-center justify-center">
            {pieData.length > 0 && (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                    onClick={() => handleNavigateToOrgs()}
                    className="cursor-pointer outline-none"
                  >
                    {pieData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={PIE_COLORS[entry.name as keyof typeof PIE_COLORS]}
                        className="hover:opacity-80 transition-opacity outline-none"
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      borderRadius: "8px",
                      border: "none",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                      fontWeight: "bold",
                    }}
                    formatter={(value: number) => [
                      formatNumber(value),
                      "Companies",
                    ]}
                  />
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    iconType="circle"
                    wrapperStyle={{
                      fontSize: "13px",
                      fontWeight: 600,
                      color: "#4b5563",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* ROW 3: LISTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Signups */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-xs overflow-hidden flex flex-col font-semibold">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-white">
            <div>
              <h3 className="text-base font-bold text-gray-900">
                Recent Signups
              </h3>
              <p className="text-xs text-gray-500 mt-1 font-semibold">
                Latest companies to join the platform
              </p>
            </div>
            <button
              onClick={() => handleNavigateToOrgs()}
              className="cursor-pointer text-sm font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 border-none bg-transparent"
            >
              View all <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="flex-1 p-0 overflow-auto">
            <table className="w-full text-left">
              <thead className="bg-white border-b border-gray-100">
                <tr>
                  <th className="px-5 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Company
                  </th>
                  <th className="px-5 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Plan
                  </th>
                  <th className="px-5 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">
                    Joined
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentSignups?.map((org: any) => (
                  <tr
                    key={org.org_id}
                    className="hover:bg-gray-50/50 transition-colors cursor-pointer"
                    onClick={() => handleNavigateToOrgs()}
                  >
                    <td className="px-5 py-3.5">
                      <div className="font-bold text-gray-900 text-sm">
                        {org.name}
                      </div>
                      <div className="text-xs font-semibold text-gray-500 mt-0.5">
                        {org.status}
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
                        {org.plan_name}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right text-sm font-semibold text-gray-600">
                      {new Date(org.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                  </tr>
                ))}
                {!recentSignups?.length && (
                  <tr>
                    <td
                      colSpan={3}
                      className="p-8 text-center text-gray-500 font-semibold"
                    >
                      No recent signups
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Companies At Risk */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-xs overflow-hidden flex flex-col font-semibold">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-white">
            <div>
              <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-600" /> Companies
                at Risk
              </h3>
              <p className="text-xs text-gray-500 mt-1 font-semibold">
                Active subscriptions with no login in 30+ days
              </p>
            </div>
            <button
              onClick={() => handleNavigateToOrgs("at_risk")}
              className="cursor-pointer text-sm font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 border-none bg-transparent"
            >
              View all <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="flex-1 p-0 overflow-auto">
            <table className="w-full text-left">
              <thead className="bg-white border-b border-gray-100">
                <tr>
                  <th className="px-5 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Company
                  </th>
                  <th className="px-5 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Plan
                  </th>
                  <th className="px-5 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">
                    Last Login
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {atRiskCompanies?.map((org: any) => (
                  <tr
                    key={org.org_id}
                    className="hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => handleNavigateToOrgs()}
                  >
                    <td className="px-5 py-3.5">
                      <div className="font-bold text-gray-900 text-sm">
                        {org.name}
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-xs font-bold text-gray-600">
                        {org.plan_name}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
                        {org.days_since_login}{" "}
                        {org.days_since_login === "Never" ? "" : "days ago"}
                      </span>
                    </td>
                  </tr>
                ))}
                {!atRiskCompanies?.length && (
                  <tr>
                    <td
                      colSpan={3}
                      className="p-8 text-center text-emerald-600 font-bold"
                    >
                      No companies at risk!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
