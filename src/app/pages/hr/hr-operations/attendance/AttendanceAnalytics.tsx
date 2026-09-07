import React, { useState, Suspense } from "react";
import { TrendingUp, Building2, MapPin, PieChart as PieIcon, Layers } from "lucide-react";
import AttendanceTrendChartContent from "../AttendanceTrendChartContent";
import AttendanceStatusChartContent from "../AttendanceStatusChartContent";

interface AttendanceAnalyticsProps {
  selectedDept: string;
  selectedLocation: string;
  selectedMonth: number;
  selectedYear: number;
}

export function AttendanceAnalytics({
  selectedDept,
  selectedLocation,
  selectedMonth,
  selectedYear,
}: AttendanceAnalyticsProps) {
  const [trendMetric, setTrendMetric] = useState<"Present" | "Absent" | "Late" | "Leave">("Present");

  // Trend Data for selected month preview
  const monthlyTrendData = [
    { month: "Jan", attendance: trendMetric === "Present" ? 94 : trendMetric === "Absent" ? 3 : trendMetric === "Late" ? 5 : 4 },
    { month: "Feb", attendance: trendMetric === "Present" ? 92 : trendMetric === "Absent" ? 4 : trendMetric === "Late" ? 6 : 5 },
    { month: "Mar", attendance: trendMetric === "Present" ? 96 : trendMetric === "Absent" ? 2 : trendMetric === "Late" ? 4 : 3 },
    { month: "Apr", attendance: trendMetric === "Present" ? 95 : trendMetric === "Absent" ? 3 : trendMetric === "Late" ? 5 : 4 },
    { month: "May", attendance: trendMetric === "Present" ? 97 : trendMetric === "Absent" ? 2 : trendMetric === "Late" ? 3 : 2 },
    { month: "Jun", attendance: trendMetric === "Present" ? 93 : trendMetric === "Absent" ? 4 : trendMetric === "Late" ? 7 : 4 },
  ];

  // Status Distribution Data
  const statusDistribution = [
    { name: "Present", value: 85, color: "#10B981" },
    { name: "Absent", value: 5, color: "#EF4444" },
    { name: "Late", value: 6, color: "#F59E0B" },
    { name: "Leave", value: 4, color: "#A78BFA" },
    { name: "Holiday", value: 2, color: "#14B8A6" },
  ];

  // Department Attendance Analysis (Requirement #16)
  const departmentData = [
    { name: "Engineering", percentage: 96, employees: 42, present: 40, absent: 1, late: 1 },
    { name: "Marketing", percentage: 92, employees: 18, present: 16, absent: 1, late: 1 },
    { name: "Finance", percentage: 95, employees: 15, present: 14, absent: 0, late: 1 },
    { name: "HR", percentage: 98, employees: 10, present: 10, absent: 0, late: 0 },
    { name: "Sales", percentage: 89, employees: 25, present: 22, absent: 2, late: 1 },
  ].filter((d) => selectedDept === "All Departments" || d.name === selectedDept);

  // Location-Based Attendance Analysis (Requirement #17)
  const locationData = [
    { location: "HQ Office", employees: 65, present: 62, absent: 2, late: 1, percentage: 95.4 },
    { location: "Branch Office", employees: 30, present: 27, absent: 2, late: 1, percentage: 90.0 },
    { location: "Remote", employees: 15, present: 14, absent: 1, late: 0, percentage: 93.3 },
  ].filter((l) => selectedLocation === "All Locations" || l.location === selectedLocation);

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2">
        <div className="w-2.5 h-6 rounded-full bg-[#00B87C]" />
        <div>
          <h3 className="text-base font-extrabold text-foreground">Attendance Analytics & Insights</h3>
          <p className="text-[11px] font-semibold text-muted-foreground">
            Monthly trends, status breakdown, department analysis and location distribution
          </p>
        </div>
      </div>

      {/* Grid Row 1: Trends & Status Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Attendance Trends Chart (2 Columns) */}
        <div
          className="lg:col-span-2 rounded-2xl border bg-card shadow-sm p-5 flex flex-col justify-between"
          style={{ borderColor: "var(--border)" }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <h4 className="text-sm font-extrabold text-foreground flex items-center gap-2">
                <TrendingUp size={16} className="text-[#00B87C]" />
                <span>Attendance Trends</span>
              </h4>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-0.5">
                Selected metric performance over months
              </p>
            </div>

            {/* Metric Selector Tabs */}
            <div className="flex items-center gap-1 p-1 bg-neutral-100 dark:bg-zinc-800/60 rounded-xl">
              {(["Present", "Absent", "Late", "Leave"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setTrendMetric(m)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold transition-all ${
                    trendMetric === m
                      ? "bg-card text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {m} %
                </button>
              ))}
            </div>
          </div>

          <div className="h-[220px] w-full">
            <Suspense
              fallback={
                <div className="w-full h-full flex items-center justify-center">
                  <div className="w-6 h-6 border-2 border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
                </div>
              }
            >
              <AttendanceTrendChartContent monthlyTrendData={monthlyTrendData} />
            </Suspense>
          </div>
        </div>

        {/* Status Distribution (1 Column) */}
        <div
          className="rounded-2xl border bg-card shadow-sm p-5 flex flex-col justify-between"
          style={{ borderColor: "var(--border)" }}
        >
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-extrabold text-foreground flex items-center gap-2">
              <PieIcon size={16} className="text-[#00B87C]" />
              <span>Status Distribution</span>
            </h4>
            <span className="text-[10px] font-extrabold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full">
              Overall 95%
            </span>
          </div>

          <div className="h-[180px] w-full relative flex items-center justify-center">
            <Suspense fallback={null}>
              <AttendanceStatusChartContent statusDistribution={statusDistribution} />
            </Suspense>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <p className="text-xl font-black text-foreground">85%</p>
              <p className="text-[8px] font-bold text-muted-foreground uppercase">Present</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-2 border-t" style={{ borderColor: "var(--border)" }}>
            {statusDistribution.slice(0, 3).map((item) => (
              <div key={item.name} className="text-center">
                <div className="flex items-center justify-center gap-1 text-[10px] font-bold text-muted-foreground">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                  <span>{item.name}</span>
                </div>
                <p className="text-xs font-black text-foreground mt-0.5">{item.value}%</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Grid Row 2: Department & Location Attendance Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Department Attendance (Requirement #16) */}
        <div
          className="rounded-2xl border bg-card shadow-sm p-5 space-y-4"
          style={{ borderColor: "var(--border)" }}
        >
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-extrabold text-foreground flex items-center gap-2">
              <Building2 size={16} className="text-[#00B87C]" />
              <span>Department Attendance</span>
            </h4>
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              {departmentData.length} Departments
            </span>
          </div>

          <div className="space-y-3">
            {departmentData.map((dept) => (
              <div key={dept.name} className="space-y-1">
                <div className="flex justify-between text-xs font-extrabold">
                  <span className="text-foreground">{dept.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-muted-foreground">({dept.present}/{dept.employees} present)</span>
                    <span className="text-[#00B87C]">{dept.percentage}%</span>
                  </div>
                </div>

                <div className="h-2 w-full bg-neutral-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#00B87C] rounded-full transition-all duration-300"
                    style={{ width: `${dept.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Location Attendance (Requirement #17) */}
        <div
          className="rounded-2xl border bg-card shadow-sm p-5 space-y-4"
          style={{ borderColor: "var(--border)" }}
        >
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-extrabold text-foreground flex items-center gap-2">
              <MapPin size={16} className="text-[#00B87C]" />
              <span>Location Attendance</span>
            </h4>
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              {locationData.length} Active Locations
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {locationData.map((loc) => (
              <div
                key={loc.location}
                className="p-3.5 rounded-xl border bg-neutral-50/50 dark:bg-zinc-800/30 space-y-2"
                style={{ borderColor: "var(--border)" }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-foreground truncate">{loc.location}</span>
                  <span className="text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                    {loc.percentage}%
                  </span>
                </div>

                <div className="grid grid-cols-3 text-center gap-1 pt-1 border-t" style={{ borderColor: "var(--border)" }}>
                  <div>
                    <p className="text-[9px] font-bold text-muted-foreground uppercase">Staff</p>
                    <p className="text-xs font-black text-foreground">{loc.employees}</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-bold text-emerald-600 uppercase">Present</p>
                    <p className="text-xs font-black text-emerald-600">{loc.present}</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-bold text-amber-600 uppercase">Late</p>
                    <p className="text-xs font-black text-amber-600">{loc.late}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
