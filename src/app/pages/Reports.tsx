import { useState } from "react";
import { Download, FileText, TrendingUp, Users, DollarSign, Calendar, ArrowLeft, Search, ChevronDown, Star, Check, X, AlertTriangle } from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, Legend,
} from "recharts";

/* ─── Shared data ─── */
const headcountTrend = [
  { month: "Oct", count: 228 }, { month: "Nov", count: 233 }, { month: "Dec", count: 235 },
  { month: "Jan", count: 237 }, { month: "Feb", count: 241 }, { month: "Mar", count: 244 }, { month: "Apr", count: 248 },
];

const reports = [
  { title: "Headcount Report", desc: "Full employee roster with details", icon: Users, color: "#059669", bg: "#ECFDF5", generated: "Today", size: "248 records" },
  { title: "Payroll Summary", desc: "Monthly payroll breakdown", icon: DollarSign, color: "#22C55E", bg: "#F0FDF4", generated: "Apr 1, 2026", size: "8 pages" },
  { title: "Attendance Report", desc: "Monthly attendance logs", icon: Calendar, color: "#F59E0B", bg: "#FFFBEB", generated: "Apr 1, 2026", size: "30 days" },
  { title: "Performance Review", desc: "Q1 2026 performance scores", icon: TrendingUp, color: "#14B8A6", bg: "#F0FDFA", generated: "Mar 31, 2026", size: "248 reviews" },
  { title: "Recruitment Pipeline", desc: "Hiring funnel & candidate stats", icon: FileText, color: "#0EA5E9", bg: "#F0F9FF", generated: "Apr 5, 2026", size: "12 candidates" },
  { title: "Turnover Analysis", desc: "Employee retention metrics", icon: Users, color: "#EF4444", bg: "#FEF2F2", generated: "Mar 31, 2026", size: "Annual" },
];

/* ─── Shared components ─── */
function KpiCard({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="rounded-xl px-5 py-4 shadow-sm" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}>
      <p style={{ color: "var(--muted-foreground)", fontSize: "12px", fontWeight: 500 }}>{label}</p>
      <p style={{ color, fontSize: "24px", fontWeight: 800, marginTop: "2px" }}>{value}</p>
    </div>
  );
}

function ReportHeader({ title, subtitle, onBack, onExportPDF, onExportCSV }: { title: string; subtitle: string; onBack: () => void; onExportPDF?: () => void; onExportCSV?: () => void }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-4">
        <button onClick={onBack} className="p-2 rounded-xl transition-colors hover:bg-gray-100" style={{ backgroundColor: "var(--secondary)", color: "var(--primary)" }}>
          <ArrowLeft size={18} />
        </button>
        <div>
          <h2 style={{ color: "var(--foreground)", fontSize: "20px", fontWeight: 800 }}>{title}</h2>
          <p style={{ color: "var(--muted-foreground)", fontSize: "13px" }}>{subtitle}</p>
        </div>
      </div>
      <div className="flex gap-2">
        <button onClick={onExportPDF} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:bg-emerald-50" style={{ backgroundColor: "var(--secondary)", color: "var(--primary)", border: "1px solid var(--border)" }}>
          <Download size={14} /> Export PDF
        </button>
        <button onClick={onExportCSV} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 shadow-sm" style={{ background: "var(--primary)" }}>
          <Download size={14} /> Export Excel
        </button>
      </div>
    </div>
  );
}

const EMERALD_SHADES = ["#059669", "#10B981", "#34D399", "#6EE7B7", "#A7F3D0", "#14B8A6"];

/* ══════════════════════════════════════════════ */
/* 1. HEADCOUNT REPORT                           */
/* ══════════════════════════════════════════════ */
const hcEmployees = [
  { name: "Karan Shah", id: "EMP001", dept: "Engineering", role: "Frontend Dev", location: "Remote", joinDate: "Jan 15, 2024", status: "Active", type: "Full-time", initials: "KS" },
  { name: "Pooja Gupta", id: "EMP002", dept: "Design", role: "UX Designer", location: "Hybrid", joinDate: "Mar 10, 2024", status: "Active", type: "Full-time", initials: "PG" },
  { name: "Tanisha Joshi", id: "EMP003", dept: "Engineering", role: "DevOps Eng.", location: "On-site", joinDate: "Jun 5, 2023", status: "Active", type: "Full-time", initials: "TJ" },
  { name: "Nisha Mishra", id: "EMP004", dept: "Marketing", role: "Product Mgr", location: "Remote", joinDate: "Sep 20, 2023", status: "On Leave", type: "Full-time", initials: "NM" },
  { name: "Siddharth R.", id: "EMP005", dept: "Engineering", role: "Backend Dev", location: "Remote", joinDate: "Feb 1, 2024", status: "Active", type: "Full-time", initials: "SR" },
  { name: "Rohan Verma", id: "EMP006", dept: "Engineering", role: "ML Engineer", location: "Remote", joinDate: "Aug 12, 2023", status: "Active", type: "Contract", initials: "RV" },
  { name: "Aarav Kumar", id: "EMP007", dept: "Sales", role: "Data Analyst", location: "On-site", joinDate: "Nov 3, 2023", status: "Active", type: "Full-time", initials: "AK" },
  { name: "Meera Patel", id: "EMP008", dept: "HR", role: "HR Manager", location: "Hybrid", joinDate: "Apr 18, 2022", status: "Active", type: "Full-time", initials: "MP" },
];
const hcDeptBreakdown = [
  { name: "Engineering", value: 98 }, { name: "Design", value: 32 }, { name: "Marketing", value: 28 },
  { name: "Sales", value: 35 }, { name: "HR", value: 22 }, { name: "Finance", value: 33 },
];

function HeadcountReport({ onBack }: { onBack: () => void }) {
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [locationFilter, setLocationFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const perPage = 8;

  const departments = ["All", ...Array.from(new Set(hcEmployees.map(e => e.dept)))];
  const statuses = ["All", ...Array.from(new Set(hcEmployees.map(e => e.status)))];
  const locations = ["All", ...Array.from(new Set(hcEmployees.map(e => e.location)))];

  const filtered = hcEmployees.filter(emp => {
    const matchSearch = search === "" ||
      emp.name.toLowerCase().includes(search.toLowerCase()) ||
      emp.id.toLowerCase().includes(search.toLowerCase()) ||
      emp.role.toLowerCase().includes(search.toLowerCase());
    const matchDept = deptFilter === "All" || emp.dept === deptFilter;
    const matchStatus = statusFilter === "All" || emp.status === statusFilter;
    const matchLocation = locationFilter === "All" || emp.location === locationFilter;
    return matchSearch && matchDept && matchStatus && matchLocation;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paginated = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);

  const handleExportCSV = () => {
    const headers = ["Name", "ID", "Department", "Role", "Location", "Join Date", "Status", "Type"];
    const rows = filtered.map(e => [e.name, e.id, e.dept, e.role, e.location, e.joinDate, e.status, e.type]);
    const csv = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "headcount_report.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportPDF = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    const rows = filtered.map(e =>
      `<tr><td style="padding:8px;border-bottom:1px solid #eee">${e.name}</td><td style="padding:8px;border-bottom:1px solid #eee">${e.id}</td><td style="padding:8px;border-bottom:1px solid #eee">${e.dept}</td><td style="padding:8px;border-bottom:1px solid #eee">${e.role}</td><td style="padding:8px;border-bottom:1px solid #eee">${e.location}</td><td style="padding:8px;border-bottom:1px solid #eee">${e.joinDate}</td><td style="padding:8px;border-bottom:1px solid #eee">${e.status}</td><td style="padding:8px;border-bottom:1px solid #eee">${e.type}</td></tr>`
    ).join("");
    printWindow.document.write(`
      <html><head><title>Headcount Report</title><style>body{font-family:system-ui,sans-serif;padding:40px;color:#1a1a1a}h1{color:#059669;margin-bottom:4px}p{color:#6b7280;margin-bottom:24px}table{width:100%;border-collapse:collapse}th{text-align:left;padding:10px 8px;background:#f0fdf4;color:#059669;font-size:11px;text-transform:uppercase;letter-spacing:0.5px;border-bottom:2px solid #059669}</style></head>
      <body><h1>Headcount Report</h1><p>${filtered.length} records · Generated ${new Date().toLocaleDateString()}</p>
      <table><thead><tr><th>Name</th><th>ID</th><th>Department</th><th>Role</th><th>Location</th><th>Join Date</th><th>Status</th><th>Type</th></tr></thead><tbody>${rows}</tbody></table></body></html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 5) { for (let i = 1; i <= totalPages; i++) pages.push(i); }
    else {
      pages.push(1);
      if (currentPage > 3) pages.push("...");
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) pages.push(i);
      if (currentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  const toggleDropdown = (name: string) => {
    setOpenDropdown(prev => prev === name ? null : name);
  };

  const filterConfigs = [
    { name: "Department", value: deptFilter, options: departments, setter: setDeptFilter },
    { name: "Status", value: statusFilter, options: statuses, setter: setStatusFilter },
    { name: "Location", value: locationFilter, options: locations, setter: setLocationFilter },
  ];

  return (
    <div>
      {/* Header with Export Buttons */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 rounded-xl transition-colors" style={{ backgroundColor: "var(--secondary)", color: "var(--primary)" }}>
            <ArrowLeft size={18} />
          </button>
          <div>
            <h2 style={{ color: "var(--foreground)", fontSize: "20px", fontWeight: 800 }}>Headcount Report</h2>
            <p style={{ color: "var(--muted-foreground)", fontSize: "13px" }}>{filtered.length} records · Generated Today</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={handleExportPDF} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all" style={{ backgroundColor: "var(--secondary)", color: "var(--primary)", border: "1px solid var(--border)" }}>
            <Download size={14} /> Export PDF
          </button>
          <button onClick={handleExportCSV} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all" style={{ background: "var(--primary)" }}>
            <Download size={14} /> Export Excel
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <KpiCard label="Total Employees" value={String(hcEmployees.length)} color="#059669" />
        <KpiCard label="Active" value={String(hcEmployees.filter(e => e.status === "Active").length)} color="#22C55E" />
        <KpiCard label="On Leave" value={String(hcEmployees.filter(e => e.status === "On Leave").length)} color="#F59E0B" />
        <KpiCard label="Inactive" value={String(hcEmployees.filter(e => e.status === "Inactive").length)} color="#EF4444" />
      </div>

      <div className="grid grid-cols-3 gap-5">
        {/* Table Section */}
        <div className="col-span-2 rounded-2xl shadow-sm overflow-hidden" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}>
          {/* Search + Filter Bar */}
          <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "1px solid var(--border)" }}>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--muted-foreground)" }} />
              <input
                className="rounded-xl pl-9 pr-4 py-2 text-sm outline-none"
                style={{ border: "1px solid var(--border)", backgroundColor: "var(--background)", color: "var(--foreground)", width: "240px" }}
                placeholder="Search employees..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              />
            </div>
            <div className="flex gap-2">
              {filterConfigs.map(fc => (
                <div key={fc.name} className="relative">
                  <button
                    onClick={() => toggleDropdown(fc.name)}
                    className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold"
                    style={{
                      border: fc.value !== "All" ? "1px solid var(--primary)" : "1px solid var(--border)",
                      color: fc.value !== "All" ? "var(--primary)" : "var(--muted-foreground)",
                      backgroundColor: fc.value !== "All" ? "var(--secondary)" : "var(--background)",
                    }}
                  >
                    {fc.value !== "All" ? fc.value : fc.name} <ChevronDown size={12} style={{ transform: openDropdown === fc.name ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
                  </button>
                  {openDropdown === fc.name && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setOpenDropdown(null)} />
                      <div className="absolute right-0 top-full mt-1 z-20 rounded-xl shadow-xl overflow-hidden" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", minWidth: "140px" }}>
                        {fc.options.map(opt => (
                          <button
                            key={opt}
                            onClick={() => { fc.setter(opt); setOpenDropdown(null); setCurrentPage(1); }}
                            className="w-full text-left px-4 py-2.5 text-xs font-medium transition-colors"
                            style={{
                              color: opt === fc.value ? "var(--primary)" : "var(--foreground)",
                              backgroundColor: opt === fc.value ? "var(--secondary)" : "transparent",
                            }}
                            onMouseEnter={(e) => { if (opt !== fc.value) (e.currentTarget as HTMLElement).style.backgroundColor = "var(--secondary)"; }}
                            onMouseLeave={(e) => { if (opt !== fc.value) (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"; }}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border)" }}>
                  {["Employee", "ID", "Department", "Role", "Location", "Join Date", "Status", "Type"].map(h => (
                    <th key={h} className="px-4 py-3 text-left font-semibold" style={{ color: "var(--muted-foreground)", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.5px" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginated.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-12 text-center">
                      <p style={{ color: "var(--muted-foreground)", fontSize: "14px" }}>No employees match your filters</p>
                      <button onClick={() => { setSearch(""); setDeptFilter("All"); setStatusFilter("All"); setLocationFilter("All"); }} className="mt-2 text-xs font-semibold" style={{ color: "var(--primary)" }}>Clear all filters</button>
                    </td>
                  </tr>
                ) : (
                  paginated.map((emp, i) => (
                    <tr key={emp.id} style={{ borderBottom: "1px solid var(--border)", backgroundColor: i % 2 === 0 ? "var(--card)" : "var(--background)" }}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[10px] font-bold" style={{ background: EMERALD_SHADES[i % 6] }}>{emp.initials}</div>
                          <span style={{ color: "var(--foreground)", fontWeight: 600 }}>{emp.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3"><span className="px-2 py-0.5 rounded-md text-xs font-semibold" style={{ backgroundColor: "var(--secondary)", color: "var(--primary)" }}>{emp.id}</span></td>
                      <td className="px-4 py-3" style={{ color: "var(--foreground)" }}>{emp.dept}</td>
                      <td className="px-4 py-3" style={{ color: "var(--muted-foreground)" }}>{emp.role}</td>
                      <td className="px-4 py-3" style={{ color: "var(--muted-foreground)" }}>{emp.location}</td>
                      <td className="px-4 py-3" style={{ color: "var(--muted-foreground)" }}>{emp.joinDate}</td>
                      <td className="px-4 py-3">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold" style={{
                          backgroundColor: emp.status === "Active" ? "#ECFDF5" : emp.status === "On Leave" ? "#FFFBEB" : "#FEF2F2",
                          color: emp.status === "Active" ? "#059669" : emp.status === "On Leave" ? "#F59E0B" : "#EF4444",
                        }}>{emp.status}</span>
                      </td>
                      <td className="px-4 py-3" style={{ color: "var(--muted-foreground)", fontSize: "12px" }}>{emp.type}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between px-5 py-3" style={{ borderTop: "1px solid var(--border)" }}>
            <span style={{ color: "var(--muted-foreground)", fontSize: "12px" }}>
              Showing {filtered.length === 0 ? 0 : (currentPage - 1) * perPage + 1}-{Math.min(currentPage * perPage, filtered.length)} of {filtered.length}
            </span>
            <div className="flex gap-1">
              {getPageNumbers().map((p, i) => (
                <button
                  key={i}
                  className="w-8 h-8 rounded-lg text-xs font-semibold transition-colors"
                  style={{
                    backgroundColor: p === currentPage ? "var(--primary)" : "transparent",
                    color: p === currentPage ? "white" : "var(--muted-foreground)",
                    cursor: typeof p === "number" ? "pointer" : "default",
                  }}
                  onClick={() => { if (typeof p === "number") setCurrentPage(p); }}
                  disabled={typeof p !== "number"}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Department Breakdown Sidebar */}
        <div className="rounded-2xl p-6 shadow-sm" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}>
          <h4 style={{ color: "var(--foreground)", fontSize: "14px", fontWeight: 700, marginBottom: "16px" }}>Department Breakdown</h4>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={hcDeptBreakdown} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                {hcDeptBreakdown.map((_, i) => <Cell key={i} fill={EMERALD_SHADES[i]} />)}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: "#064E3B", border: "none", borderRadius: "10px", color: "white", fontSize: "12px" }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-4">
            {hcDeptBreakdown.map((d, i) => (
              <div key={d.name} className="flex items-center justify-between cursor-pointer rounded-lg px-2 py-1 transition-colors"
                onClick={() => { setDeptFilter(deptFilter === d.name ? "All" : d.name); setCurrentPage(1); }}
                style={{ backgroundColor: deptFilter === d.name ? "var(--secondary)" : "transparent" }}
              >
                <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: EMERALD_SHADES[i] }} /><span style={{ color: deptFilter === d.name ? "var(--primary)" : "var(--muted-foreground)", fontSize: "12px", fontWeight: deptFilter === d.name ? 700 : 400 }}>{d.name}</span></div>
                <span style={{ color: "var(--foreground)", fontSize: "12px", fontWeight: 700 }}>{d.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════ */
/* 2. PAYROLL SUMMARY                            */
/* ══════════════════════════════════════════════ */
const payrollTrend = [
  { month: "Nov", gross: 82000, net: 68000 }, { month: "Dec", gross: 83500, net: 69200 },
  { month: "Jan", gross: 84200, net: 69800 }, { month: "Feb", gross: 85100, net: 70500 },
  { month: "Mar", gross: 85800, net: 71000 }, { month: "Apr", gross: 86584, net: 71700 },
];
const payrollEmployees = [
  { name: "Karan Shah", dept: "Engineering", basic: 7500, allowances: 1200, deductions: 1850, net: 6850, status: "Paid" },
  { name: "Pooja Gupta", dept: "Design", basic: 6800, allowances: 1000, deductions: 1650, net: 6150, status: "Paid" },
  { name: "Tanisha Joshi", dept: "Engineering", basic: 8200, allowances: 1500, deductions: 2100, net: 7600, status: "Paid" },
  { name: "Nisha Mishra", dept: "Marketing", basic: 7000, allowances: 1100, deductions: 1700, net: 6400, status: "Pending" },
  { name: "Siddharth R.", dept: "Engineering", basic: 7800, allowances: 1300, deductions: 1900, net: 7200, status: "Paid" },
  { name: "Rohan Verma", dept: "Engineering", basic: 9000, allowances: 1800, deductions: 2300, net: 8500, status: "Paid" },
];
const deductionBreakdown = [{ name: "Tax", value: 45 }, { name: "PF", value: 30 }, { name: "Insurance", value: 25 }];

function PayrollSummary({ onBack }: { onBack: () => void }) {
  const handleExportCSV = () => {
    const headers = ["Employee", "Department", "Basic Salary", "Allowances", "Deductions", "Net Pay", "Status"];
    const rows = payrollEmployees.map(e => [e.name, e.dept, e.basic, e.allowances, e.deductions, e.net, e.status]);
    const csv = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "payroll_summary.csv";
    a.click();
    URL.revokeObjectURL(url);
  };
  const handleExportPDF = () => {
    const w = window.open("", "_blank");
    if (!w) return;
    const rows = payrollEmployees.map(e => `<tr><td style="padding:8px;border-bottom:1px solid #eee">${e.name}</td><td style="padding:8px;border-bottom:1px solid #eee">${e.dept}</td><td style="padding:8px;border-bottom:1px solid #eee">₹${e.basic.toLocaleString()}</td><td style="padding:8px;border-bottom:1px solid #eee">₹${e.allowances.toLocaleString()}</td><td style="padding:8px;border-bottom:1px solid #eee">₹${e.deductions.toLocaleString()}</td><td style="padding:8px;border-bottom:1px solid #eee">₹${e.net.toLocaleString()}</td><td style="padding:8px;border-bottom:1px solid #eee">${e.status}</td></tr>`).join("");
    w.document.write(`<html><head><title>Payroll Summary</title><style>body{font-family:system-ui,sans-serif;padding:40px;color:#1a1a1a}h1{color:#059669;margin-bottom:4px}p{color:#6b7280;margin-bottom:24px}table{width:100%;border-collapse:collapse}th{text-align:left;padding:10px 8px;background:#f0fdf4;color:#059669;font-size:11px;text-transform:uppercase;border-bottom:2px solid #059669}</style></head><body><h1>Payroll Summary</h1><p>April 2026</p><table><thead><tr><th>Employee</th><th>Department</th><th>Basic</th><th>Allowances</th><th>Deductions</th><th>Net Pay</th><th>Status</th></tr></thead><tbody>${rows}</tbody></table></body></html>`);
    w.document.close(); w.print();
  };
  return (
    <div>
      <ReportHeader title="Payroll Summary — April 2026" subtitle="Monthly payroll breakdown" onBack={onBack} onExportPDF={handleExportPDF} onExportCSV={handleExportCSV} />
      <div className="grid grid-cols-3 gap-4 mb-6">
        <KpiCard label="Total Gross Payout" value="₹86,584" color="#059669" />
        <KpiCard label="Total Deductions" value="₹14,884" color="#F59E0B" />
        <KpiCard label="Net Disbursed" value="₹71,700" color="#22C55E" />
      </div>
      <div className="grid grid-cols-3 gap-5 mb-6">
        <div className="col-span-2 rounded-2xl p-6 shadow-sm" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}>
          <h4 style={{ color: "var(--foreground)", fontSize: "14px", fontWeight: 700, marginBottom: "16px" }}>Monthly Payroll Trend</h4>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={payrollTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="month" tick={{ fill: "#6B7280", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#6B7280", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ backgroundColor: "#064E3B", border: "none", borderRadius: "10px", color: "white", fontSize: "12px" }} />
              <Bar dataKey="gross" fill="#059669" radius={[6, 6, 0, 0]} name="Gross" />
              <Bar dataKey="net" fill="#34D399" radius={[6, 6, 0, 0]} name="Net" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="rounded-2xl p-6 shadow-sm" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}>
          <h4 style={{ color: "var(--foreground)", fontSize: "14px", fontWeight: 700, marginBottom: "16px" }}>Deduction Breakdown</h4>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={deductionBreakdown} cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={4} dataKey="value">
                {deductionBreakdown.map((_, i) => <Cell key={i} fill={EMERALD_SHADES[i]} />)}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: "#064E3B", border: "none", borderRadius: "10px", color: "white", fontSize: "12px" }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-3">
            {deductionBreakdown.map((d, i) => (
              <div key={d.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: EMERALD_SHADES[i] }} /><span style={{ color: "var(--muted-foreground)", fontSize: "12px" }}>{d.name}</span></div>
                <span style={{ color: "var(--foreground)", fontSize: "12px", fontWeight: 700 }}>{d.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="rounded-2xl shadow-sm overflow-hidden" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}>
        <table className="w-full text-sm">
          <thead><tr style={{ borderBottom: "1px solid var(--border)" }}>
            {["Employee", "Department", "Basic Salary", "Allowances", "Deductions", "Net Pay", "Status", ""].map(h => (
              <th key={h} className="px-4 py-3 text-left font-semibold" style={{ color: "var(--muted-foreground)", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.5px" }}>{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {payrollEmployees.map((emp, i) => (
              <tr key={i} style={{ borderBottom: "1px solid var(--border)", backgroundColor: i % 2 === 0 ? "var(--card)" : "var(--background)" }}>
                <td className="px-4 py-3" style={{ color: "var(--foreground)", fontWeight: 600 }}>{emp.name}</td>
                <td className="px-4 py-3" style={{ color: "var(--muted-foreground)" }}>{emp.dept}</td>
                <td className="px-4 py-3" style={{ color: "var(--foreground)" }}>₹{emp.basic.toLocaleString()}</td>
                <td className="px-4 py-3" style={{ color: "#22C55E" }}>+₹{emp.allowances.toLocaleString()}</td>
                <td className="px-4 py-3" style={{ color: "#EF4444" }}>-₹{emp.deductions.toLocaleString()}</td>
                <td className="px-4 py-3" style={{ color: "var(--foreground)", fontWeight: 700 }}>₹{emp.net.toLocaleString()}</td>
                <td className="px-4 py-3"><span className="px-2.5 py-1 rounded-full text-[10px] font-bold" style={{ backgroundColor: emp.status === "Paid" ? "#ECFDF5" : "#FFFBEB", color: emp.status === "Paid" ? "#059669" : "#F59E0B" }}>{emp.status}</span></td>
                <td className="px-4 py-3"><button onClick={() => {
                  const w = window.open("", "_blank");
                  if (!w) return;
                  w.document.write(`<html><head><title>Payslip - ${emp.name}</title></head><body style="font-family:system-ui,sans-serif;padding:40px;color:#1a1a1a;max-width:600px;margin:0 auto"><h1 style="color:#059669;margin-bottom:4px">Payslip</h1><p style="color:#6b7280;margin-bottom:32px">Employee: <strong style="color:#111827">${emp.name}</strong></p><table style="width:100%;border-collapse:collapse"><tr style="border-bottom:1px solid #e5e7eb"><td style="padding:12px 0;font-size:14px">Gross Payout</td><td style="text-align:right;font-weight:600;font-size:14px">₹${(emp.basic + emp.allowances).toLocaleString()}</td></tr><tr style="border-bottom:1px solid #e5e7eb"><td style="padding:12px 0;color:#ef4444;font-size:14px">Total Deductions</td><td style="text-align:right;color:#ef4444;font-weight:600;font-size:14px">-₹${emp.deductions.toLocaleString()}</td></tr><tr style="border-top:2px solid #059669"><td style="padding:16px 0;font-weight:800;font-size:16px">Net Pay</td><td style="text-align:right;color:#059669;font-size:22px;font-weight:900">₹${emp.net.toLocaleString()}</td></tr></table><p style="margin-top:32px;font-size:12px;color:#9ca3af;text-align:center">This is a system-generated payslip.</p></body></html>`);
                  w.document.close(); w.print();
                }} className="text-xs font-semibold hover:underline" style={{ color: "var(--primary)" }}>Download</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════ */
/* 3. ATTENDANCE REPORT                          */
/* ══════════════════════════════════════════════ */
const attendanceData = [
  { name: "Karan Shah", total: 22, present: 20, absent: 1, late: 1, leave: 0, pct: 91 },
  { name: "Pooja Gupta", total: 22, present: 21, absent: 0, late: 1, leave: 0, pct: 95 },
  { name: "Tanisha Joshi", total: 22, present: 22, absent: 0, late: 0, leave: 0, pct: 100 },
  { name: "Nisha Mishra", total: 22, present: 18, absent: 2, late: 0, leave: 2, pct: 82 },
  { name: "Siddharth R.", total: 22, present: 19, absent: 1, late: 2, leave: 0, pct: 86 },
  { name: "Rohan Verma", total: 22, present: 21, absent: 0, late: 0, leave: 1, pct: 95 },
];
const deptAttendance = [
  { dept: "Engineering", pct: 94 }, { dept: "Design", pct: 91 }, { dept: "Marketing", pct: 87 },
  { dept: "Sales", pct: 89 }, { dept: "HR", pct: 96 }, { dept: "Finance", pct: 92 },
];

function AttendanceReport({ onBack }: { onBack: () => void }) {
  const handleExportCSV = () => {
    const headers = ["Employee", "Total Days", "Present", "Absent", "Late", "Leave", "Attendance %"];
    const rows = attendanceData.map(e => [e.name, e.total, e.present, e.absent, e.late, e.leave, `${e.pct}%`]);
    const csv = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "attendance_report.csv";
    a.click();
    URL.revokeObjectURL(url);
  };
  const handleExportPDF = () => {
    const w = window.open("", "_blank");
    if (!w) return;
    const rows = attendanceData.map(e => `<tr><td style="padding:8px;border-bottom:1px solid #eee">${e.name}</td><td style="padding:8px;border-bottom:1px solid #eee">${e.total}</td><td style="padding:8px;border-bottom:1px solid #eee">${e.present}</td><td style="padding:8px;border-bottom:1px solid #eee">${e.absent}</td><td style="padding:8px;border-bottom:1px solid #eee">${e.late}</td><td style="padding:8px;border-bottom:1px solid #eee">${e.leave}</td><td style="padding:8px;border-bottom:1px solid #eee">${e.pct}%</td></tr>`).join("");
    w.document.write(`<html><head><title>Attendance Report</title><style>body{font-family:system-ui,sans-serif;padding:40px;color:#1a1a1a}h1{color:#059669;margin-bottom:4px}p{color:#6b7280;margin-bottom:24px}table{width:100%;border-collapse:collapse}th{text-align:left;padding:10px 8px;background:#f0fdf4;color:#059669;font-size:11px;text-transform:uppercase;border-bottom:2px solid #059669}</style></head><body><h1>Attendance Report</h1><p>April 2026</p><table><thead><tr><th>Employee</th><th>Total Days</th><th>Present</th><th>Absent</th><th>Late</th><th>Leave</th><th>Attendance %</th></tr></thead><tbody>${rows}</tbody></table></body></html>`);
    w.document.close(); w.print();
  };
  const days = Array.from({ length: 30 }, (_, i) => ({ day: i + 1, pct: Math.floor(Math.random() * 30) + 70 }));
  return (
    <div>
      <ReportHeader title="Attendance Report — April 2026" subtitle="Monthly attendance logs" onBack={onBack} onExportPDF={handleExportPDF} onExportCSV={handleExportCSV} />
      <div className="grid grid-cols-4 gap-4 mb-6">
        <KpiCard label="Present Days" value="20.2" color="#059669" />
        <KpiCard label="Absent Days" value="0.8" color="#EF4444" />
        <KpiCard label="Late Arrivals" value="1.2" color="#F59E0B" />
        <KpiCard label="Avg Work Hours" value="8.4h" color="#14B8A6" />
      </div>
      <div className="grid grid-cols-3 gap-5 mb-6">
        <div className="col-span-2 rounded-2xl p-6 shadow-sm" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}>
          <h4 style={{ color: "var(--foreground)", fontSize: "14px", fontWeight: 700, marginBottom: "16px" }}>Attendance Heatmap — April 2026</h4>
          <div className="grid grid-cols-10 gap-1.5">
            {days.map(d => (
              <div key={d.day} className="rounded-lg flex items-center justify-center" style={{ aspectRatio: "1", backgroundColor: `rgba(5, 150, 105, ${d.pct / 100})`, minHeight: "32px" }} title={`Day ${d.day}: ${d.pct}%`}>
                <span style={{ color: d.pct > 85 ? "white" : "var(--foreground)", fontSize: "10px", fontWeight: 600 }}>{d.day}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2 mt-3"><span style={{ color: "var(--muted-foreground)", fontSize: "10px" }}>Low</span><div className="flex gap-0.5">{[0.3, 0.5, 0.7, 0.85, 1].map((o, i) => <div key={i} className="w-5 h-3 rounded" style={{ backgroundColor: `rgba(5, 150, 105, ${o})` }} />)}</div><span style={{ color: "var(--muted-foreground)", fontSize: "10px" }}>High</span></div>
        </div>
        <div className="rounded-2xl p-6 shadow-sm" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}>
          <h4 style={{ color: "var(--foreground)", fontSize: "14px", fontWeight: 700, marginBottom: "16px" }}>Department Attendance</h4>
          <div className="space-y-4">
            {deptAttendance.map(d => (
              <div key={d.dept}>
                <div className="flex items-center justify-between mb-1"><span style={{ color: "var(--muted-foreground)", fontSize: "12px" }}>{d.dept}</span><span style={{ color: "var(--foreground)", fontSize: "12px", fontWeight: 700 }}>{d.pct}%</span></div>
                <div className="rounded-full overflow-hidden" style={{ height: "6px", backgroundColor: "var(--secondary)" }}><div className="rounded-full h-full" style={{ width: `${d.pct}%`, backgroundColor: "#059669" }} /></div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="rounded-2xl shadow-sm overflow-hidden" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}>
        <table className="w-full text-sm">
          <thead><tr style={{ borderBottom: "1px solid var(--border)" }}>
            {["Employee", "Total Days", "Present", "Absent", "Late", "Leave", "Attendance %"].map(h => (
              <th key={h} className="px-4 py-3 text-left font-semibold" style={{ color: "var(--muted-foreground)", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.5px" }}>{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {attendanceData.map((emp, i) => (
              <tr key={i} style={{ borderBottom: "1px solid var(--border)", backgroundColor: i % 2 === 0 ? "var(--card)" : "var(--background)" }}>
                <td className="px-4 py-3" style={{ color: "var(--foreground)", fontWeight: 600 }}>{emp.name}</td>
                <td className="px-4 py-3" style={{ color: "var(--muted-foreground)" }}>{emp.total}</td>
                <td className="px-4 py-3" style={{ color: "#059669", fontWeight: 600 }}>{emp.present}</td>
                <td className="px-4 py-3" style={{ color: "#EF4444", fontWeight: 600 }}>{emp.absent}</td>
                <td className="px-4 py-3" style={{ color: "#F59E0B", fontWeight: 600 }}>{emp.late}</td>
                <td className="px-4 py-3" style={{ color: "#14B8A6" }}>{emp.leave}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 rounded-full overflow-hidden" style={{ height: "6px", backgroundColor: "var(--secondary)" }}><div className="rounded-full h-full" style={{ width: `${emp.pct}%`, backgroundColor: emp.pct >= 90 ? "#059669" : emp.pct >= 80 ? "#F59E0B" : "#EF4444" }} /></div>
                    <span style={{ color: "var(--foreground)", fontSize: "12px", fontWeight: 700, minWidth: "32px" }}>{emp.pct}%</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════ */
/* 4. PERFORMANCE REVIEW                         */
/* ══════════════════════════════════════════════ */
const scoreDistribution = [
  { range: "1.0-1.9", count: 3 }, { range: "2.0-2.9", count: 12 }, { range: "3.0-3.9", count: 85 },
  { range: "4.0-4.4", count: 108 }, { range: "4.5-5.0", count: 40 },
];
const perfEmployees = [
  { name: "Tanisha Joshi", dept: "Engineering", manager: "Raj Sharma", score: 4.8, goals: 96, status: "Completed", date: "Mar 28, 2026" },
  { name: "Karan Shah", dept: "Engineering", manager: "Raj Sharma", score: 4.5, goals: 92, status: "Completed", date: "Mar 27, 2026" },
  { name: "Pooja Gupta", dept: "Design", manager: "Anita Roy", score: 4.3, goals: 88, status: "Completed", date: "Mar 25, 2026" },
  { name: "Rohan Verma", dept: "Engineering", manager: "Raj Sharma", score: 3.9, goals: 80, status: "Completed", date: "Mar 30, 2026" },
  { name: "Nisha Mishra", dept: "Marketing", manager: "Vikram S.", score: 3.5, goals: 72, status: "Pending", date: "—" },
  { name: "Siddharth R.", dept: "Engineering", manager: "Raj Sharma", score: 4.1, goals: 85, status: "Completed", date: "Mar 29, 2026" },
];
const topPerformers = [
  { name: "Tanisha Joshi", score: 4.8, initials: "TJ" }, { name: "Karan Shah", score: 4.5, initials: "KS" },
  { name: "Pooja Gupta", score: 4.3, initials: "PG" }, { name: "Meera Patel", score: 4.2, initials: "MP" },
  { name: "Siddharth R.", score: 4.1, initials: "SR" },
];
const deptScores = [
  { dept: "Engineering", avg: 4.2 }, { dept: "Design", avg: 4.0 }, { dept: "HR", avg: 3.9 },
  { dept: "Sales", avg: 3.7 }, { dept: "Marketing", avg: 3.5 }, { dept: "Finance", avg: 3.8 },
];

function PerformanceReview({ onBack }: { onBack: () => void }) {
  const handleExportCSV = () => {
    const headers = ["Employee", "Department", "Manager", "Score", "Goals %", "Status", "Date"];
    const rows = perfEmployees.map(e => [e.name, e.dept, e.manager, e.score, `${e.goals}%`, e.status, e.date]);
    const csv = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "performance_report.csv";
    a.click();
    URL.revokeObjectURL(url);
  };
  const handleExportPDF = () => {
    const w = window.open("", "_blank");
    if (!w) return;
    const rows = perfEmployees.map(e => `<tr><td style="padding:8px;border-bottom:1px solid #eee">${e.name}</td><td style="padding:8px;border-bottom:1px solid #eee">${e.dept}</td><td style="padding:8px;border-bottom:1px solid #eee">${e.manager}</td><td style="padding:8px;border-bottom:1px solid #eee">${e.score}</td><td style="padding:8px;border-bottom:1px solid #eee">${e.goals}%</td><td style="padding:8px;border-bottom:1px solid #eee">${e.status}</td><td style="padding:8px;border-bottom:1px solid #eee">${e.date}</td></tr>`).join("");
    w.document.write(`<html><head><title>Performance Review</title><style>body{font-family:system-ui,sans-serif;padding:40px;color:#1a1a1a}h1{color:#059669;margin-bottom:4px}p{color:#6b7280;margin-bottom:24px}table{width:100%;border-collapse:collapse}th{text-align:left;padding:10px 8px;background:#f0fdf4;color:#059669;font-size:11px;text-transform:uppercase;border-bottom:2px solid #059669}</style></head><body><h1>Performance Review</h1><p>Q1 2026</p><table><thead><tr><th>Employee</th><th>Department</th><th>Manager</th><th>Score</th><th>Goals %</th><th>Status</th><th>Last Review</th></tr></thead><tbody>${rows}</tbody></table></body></html>`);
    w.document.close(); w.print();
  };
  return (
    <div>
      <ReportHeader title="Performance Review — Q1 2026" subtitle="248 reviews" onBack={onBack} onExportPDF={handleExportPDF} onExportCSV={handleExportCSV} />
      <div className="grid grid-cols-4 gap-4 mb-6">
        <KpiCard label="Avg Score" value="3.9" color="#059669" />
        <KpiCard label="Top Performers (≥4.5)" value="40" color="#22C55E" />
        <KpiCard label="Needs Improvement (≤2)" value="15" color="#EF4444" />
        <KpiCard label="Reviews Pending" value="23" color="#F59E0B" />
      </div>
      <div className="grid grid-cols-3 gap-5 mb-6">
        <div className="col-span-2 rounded-2xl p-6 shadow-sm" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}>
          <h4 style={{ color: "var(--foreground)", fontSize: "14px", fontWeight: 700, marginBottom: "16px" }}>Score Distribution</h4>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={scoreDistribution}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="range" tick={{ fill: "#6B7280", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#6B7280", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ backgroundColor: "#064E3B", border: "none", borderRadius: "10px", color: "white", fontSize: "12px" }} />
              <Bar dataKey="count" fill="#059669" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="rounded-2xl p-6 shadow-sm" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}>
          <h4 style={{ color: "var(--foreground)", fontSize: "14px", fontWeight: 700, marginBottom: "16px" }}>Top Performers</h4>
          <div className="space-y-3">
            {topPerformers.map((p, i) => (
              <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl" style={{ backgroundColor: i === 0 ? "var(--secondary)" : "transparent" }}>
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-[10px] font-bold" style={{ background: EMERALD_SHADES[i] }}>{p.initials}</div>
                <div className="flex-1"><p style={{ color: "var(--foreground)", fontSize: "13px", fontWeight: 600 }}>{p.name}</p></div>
                <div className="flex items-center gap-1"><Star size={12} fill="#F59E0B" color="#F59E0B" /><span style={{ color: "var(--foreground)", fontSize: "13px", fontWeight: 700 }}>{p.score}</span></div>
              </div>
            ))}
          </div>
          <h4 style={{ color: "var(--foreground)", fontSize: "14px", fontWeight: 700, margin: "20px 0 12px" }}>Dept Avg Scores</h4>
          <div className="space-y-3">
            {deptScores.map(d => (
              <div key={d.dept}>
                <div className="flex items-center justify-between mb-1"><span style={{ color: "var(--muted-foreground)", fontSize: "12px" }}>{d.dept}</span><span style={{ color: "var(--foreground)", fontSize: "12px", fontWeight: 700 }}>{d.avg}</span></div>
                <div className="rounded-full overflow-hidden" style={{ height: "5px", backgroundColor: "var(--secondary)" }}><div className="rounded-full h-full" style={{ width: `${(d.avg / 5) * 100}%`, backgroundColor: "#059669" }} /></div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="rounded-2xl shadow-sm overflow-hidden" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}>
        <table className="w-full text-sm">
          <thead><tr style={{ borderBottom: "1px solid var(--border)" }}>
            {["Employee", "Department", "Manager", "Score", "Goal Completion", "Status", "Last Review"].map(h => (
              <th key={h} className="px-4 py-3 text-left font-semibold" style={{ color: "var(--muted-foreground)", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.5px" }}>{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {perfEmployees.map((emp, i) => (
              <tr key={i} style={{ borderBottom: "1px solid var(--border)", backgroundColor: i % 2 === 0 ? "var(--card)" : "var(--background)" }}>
                <td className="px-4 py-3" style={{ color: "var(--foreground)", fontWeight: 600 }}>{emp.name}</td>
                <td className="px-4 py-3" style={{ color: "var(--muted-foreground)" }}>{emp.dept}</td>
                <td className="px-4 py-3" style={{ color: "var(--muted-foreground)" }}>{emp.manager}</td>
                <td className="px-4 py-3"><div className="flex items-center gap-1">{[1,2,3,4,5].map(s => <Star key={s} size={11} fill={s <= Math.round(emp.score) ? "#F59E0B" : "transparent"} color={s <= Math.round(emp.score) ? "#F59E0B" : "#D1D5DB"} />)}<span style={{ color: "var(--foreground)", fontSize: "12px", fontWeight: 700, marginLeft: "4px" }}>{emp.score}</span></div></td>
                <td className="px-4 py-3"><div className="flex items-center gap-2"><div className="flex-1 rounded-full overflow-hidden" style={{ height: "5px", backgroundColor: "var(--secondary)" }}><div className="rounded-full h-full" style={{ width: `${emp.goals}%`, backgroundColor: "#059669" }} /></div><span style={{ fontSize: "11px", fontWeight: 600, color: "var(--foreground)" }}>{emp.goals}%</span></div></td>
                <td className="px-4 py-3"><span className="px-2.5 py-1 rounded-full text-[10px] font-bold" style={{ backgroundColor: emp.status === "Completed" ? "#ECFDF5" : "#FFFBEB", color: emp.status === "Completed" ? "#059669" : "#F59E0B" }}>{emp.status}</span></td>
                <td className="px-4 py-3" style={{ color: "var(--muted-foreground)", fontSize: "12px" }}>{emp.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════ */
/* 5. RECRUITMENT PIPELINE REPORT                */
/* ══════════════════════════════════════════════ */
const funnelData = [
  { stage: "Applied", count: 120, conv: "100%" }, { stage: "Screening", count: 68, conv: "57%" },
  { stage: "Interview", count: 35, conv: "51%" }, { stage: "Offer", count: 14, conv: "40%" }, { stage: "Hired", count: 8, conv: "57%" },
];
const recruitCandidates = [
  { name: "Karan Shah", role: "Frontend Dev", source: "LinkedIn", stage: "Hired", applied: "Feb 10", updated: "Mar 28" },
  { name: "Pooja Gupta", role: "UX Designer", source: "Referral", stage: "Offer", applied: "Mar 1", updated: "Apr 2" },
  { name: "Tanisha Joshi", role: "DevOps Eng.", source: "LinkedIn", stage: "Interview", applied: "Mar 15", updated: "Apr 4" },
  { name: "Nisha Mishra", role: "Product Mgr", source: "Job Portal", stage: "Screening", applied: "Mar 20", updated: "Apr 3" },
  { name: "Siddharth R.", role: "Backend Dev", source: "Referral", stage: "Interview", applied: "Mar 12", updated: "Apr 1" },
  { name: "Rohan Verma", role: "ML Engineer", source: "LinkedIn", stage: "Applied", applied: "Apr 1", updated: "Apr 1" },
];
const sourceBreakdown = [{ name: "LinkedIn", value: 45 }, { name: "Referral", value: 28 }, { name: "Job Portal", value: 18 }, { name: "Other", value: 9 }];

function RecruitmentPipeline({ onBack }: { onBack: () => void }) {
  const handleExportCSV = () => {
    const headers = ["Candidate", "Role Applied", "Source", "Stage", "Applied Date", "Last Updated"];
    const rows = recruitCandidates.map(e => [e.name, e.role, e.source, e.stage, e.applied, e.updated]);
    const csv = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "recruitment_report.csv";
    a.click();
    URL.revokeObjectURL(url);
  };
  const handleExportPDF = () => {
    const w = window.open("", "_blank");
    if (!w) return;
    const rows = recruitCandidates.map(e => `<tr><td style="padding:8px;border-bottom:1px solid #eee">${e.name}</td><td style="padding:8px;border-bottom:1px solid #eee">${e.role}</td><td style="padding:8px;border-bottom:1px solid #eee">${e.source}</td><td style="padding:8px;border-bottom:1px solid #eee">${e.stage}</td><td style="padding:8px;border-bottom:1px solid #eee">${e.applied}</td><td style="padding:8px;border-bottom:1px solid #eee">${e.updated}</td></tr>`).join("");
    w.document.write(`<html><head><title>Recruitment Pipeline Report</title><style>body{font-family:system-ui,sans-serif;padding:40px;color:#1a1a1a}h1{color:#059669;margin-bottom:4px}p{color:#6b7280;margin-bottom:24px}table{width:100%;border-collapse:collapse}th{text-align:left;padding:10px 8px;background:#f0fdf4;color:#059669;font-size:11px;text-transform:uppercase;border-bottom:2px solid #059669}</style></head><body><h1>Recruitment Pipeline Report</h1><p>12 candidates · Apr 5, 2026</p><table><thead><tr><th>Candidate</th><th>Role Applied</th><th>Source</th><th>Stage</th><th>Applied</th><th>Updated</th></tr></thead><tbody>${rows}</tbody></table></body></html>`);
    w.document.close(); w.print();
  };
  const stageColor: Record<string, { bg: string; color: string }> = { Applied: { bg: "#ECFDF5", color: "#059669" }, Screening: { bg: "#FFFBEB", color: "#F59E0B" }, Interview: { bg: "#F0FDFA", color: "#14B8A6" }, Offer: { bg: "#F0F9FF", color: "#0EA5E9" }, Hired: { bg: "#ECFDF5", color: "#22C55E" } };
  return (
    <div>
      <ReportHeader title="Recruitment Pipeline Report" subtitle="12 candidates · Apr 5, 2026" onBack={onBack} onExportPDF={handleExportPDF} onExportCSV={handleExportCSV} />
      <div className="grid grid-cols-4 gap-4 mb-6">
        <KpiCard label="Total Applicants" value="120" color="#059669" />
        <KpiCard label="Interviews Scheduled" value="35" color="#14B8A6" />
        <KpiCard label="Offers Sent" value="14" color="#0EA5E9" />
        <KpiCard label="Hired This Month" value="8" color="#22C55E" />
      </div>
      <div className="grid grid-cols-3 gap-5 mb-6">
        <div className="col-span-2 rounded-2xl p-6 shadow-sm" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}>
          <h4 style={{ color: "var(--foreground)", fontSize: "14px", fontWeight: 700, marginBottom: "20px" }}>Hiring Funnel</h4>
          <div className="space-y-3">
            {funnelData.map((f, i) => (
              <div key={f.stage} className="flex items-center gap-4">
                <span style={{ color: "var(--muted-foreground)", fontSize: "12px", fontWeight: 600, width: "80px" }}>{f.stage}</span>
                <div className="flex-1 relative" style={{ height: "32px" }}>
                  <div className="absolute inset-0 rounded-lg" style={{ width: `${(f.count / 120) * 100}%`, backgroundColor: EMERALD_SHADES[i], opacity: 0.85 }} />
                  <div className="absolute inset-0 flex items-center px-3">
                    <span style={{ color: "white", fontSize: "12px", fontWeight: 700, textShadow: "0 1px 2px rgba(0,0,0,0.2)" }}>{f.count}</span>
                  </div>
                </div>
                <span style={{ color: "var(--muted-foreground)", fontSize: "11px", fontWeight: 600, width: "40px" }}>{f.conv}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-5">
          <div className="rounded-2xl p-6 shadow-sm" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}>
            <h4 style={{ color: "var(--foreground)", fontSize: "14px", fontWeight: 700, marginBottom: "12px" }}>Source Breakdown</h4>
            <ResponsiveContainer width="100%" height={130}>
              <PieChart><Pie data={sourceBreakdown} cx="50%" cy="50%" innerRadius={35} outerRadius={55} paddingAngle={3} dataKey="value">{sourceBreakdown.map((_, i) => <Cell key={i} fill={EMERALD_SHADES[i]} />)}</Pie><Tooltip contentStyle={{ backgroundColor: "#064E3B", border: "none", borderRadius: "10px", color: "white", fontSize: "12px" }} /></PieChart>
            </ResponsiveContainer>
            <div className="space-y-1.5 mt-2">{sourceBreakdown.map((s, i) => (<div key={s.name} className="flex items-center justify-between"><div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full" style={{ backgroundColor: EMERALD_SHADES[i] }} /><span style={{ color: "var(--muted-foreground)", fontSize: "11px" }}>{s.name}</span></div><span style={{ color: "var(--foreground)", fontSize: "11px", fontWeight: 700 }}>{s.value}%</span></div>))}</div>
          </div>
          <div className="rounded-2xl p-5 shadow-sm" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}>
            <p style={{ color: "var(--muted-foreground)", fontSize: "11px" }}>Avg. Time-to-Hire</p>
            <p style={{ color: "var(--primary)", fontSize: "28px", fontWeight: 900 }}>18 <span style={{ fontSize: "14px", fontWeight: 600 }}>days</span></p>
          </div>
        </div>
      </div>
      <div className="rounded-2xl shadow-sm overflow-hidden" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}>
        <table className="w-full text-sm">
          <thead><tr style={{ borderBottom: "1px solid var(--border)" }}>
            {["Candidate", "Role Applied", "Source", "Stage", "Applied Date", "Last Updated"].map(h => (
              <th key={h} className="px-4 py-3 text-left font-semibold" style={{ color: "var(--muted-foreground)", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.5px" }}>{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {recruitCandidates.map((c, i) => (
              <tr key={i} style={{ borderBottom: "1px solid var(--border)", backgroundColor: i % 2 === 0 ? "var(--card)" : "var(--background)" }}>
                <td className="px-4 py-3" style={{ color: "var(--foreground)", fontWeight: 600 }}>{c.name}</td>
                <td className="px-4 py-3" style={{ color: "var(--muted-foreground)" }}>{c.role}</td>
                <td className="px-4 py-3" style={{ color: "var(--muted-foreground)" }}>{c.source}</td>
                <td className="px-4 py-3"><span className="px-2.5 py-1 rounded-full text-[10px] font-bold" style={{ backgroundColor: stageColor[c.stage]?.bg, color: stageColor[c.stage]?.color }}>{c.stage}</span></td>
                <td className="px-4 py-3" style={{ color: "var(--muted-foreground)" }}>{c.applied}</td>
                <td className="px-4 py-3" style={{ color: "var(--muted-foreground)" }}>{c.updated}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════ */
/* 6. TURNOVER ANALYSIS                          */
/* ══════════════════════════════════════════════ */
const turnoverTrend = [
  { month: "May", rate: 3.8 }, { month: "Jun", rate: 4.2 }, { month: "Jul", rate: 3.5 },
  { month: "Aug", rate: 3.1 }, { month: "Sep", rate: 4.0 }, { month: "Oct", rate: 3.6 },
  { month: "Nov", rate: 3.3 }, { month: "Dec", rate: 4.5 }, { month: "Jan", rate: 3.9 },
  { month: "Feb", rate: 3.7 }, { month: "Mar", rate: 4.1 }, { month: "Apr", rate: 3.2 },
];
const turnoverByDept = [
  { dept: "Engineering", count: 5 }, { dept: "Design", count: 2 }, { dept: "Marketing", count: 4 },
  { dept: "Sales", count: 6 }, { dept: "HR", count: 1 }, { dept: "Finance", count: 3 },
];
const exitReasons = [{ name: "Better Opportunity", value: 40 }, { name: "Relocation", value: 22 }, { name: "Personal", value: 20 }, { name: "Performance", value: 18 }];
const exitedEmployees = [
  { name: "Arun Mehta", dept: "Sales", role: "Sales Exec", tenure: "1.8 yrs", exit: "Mar 15, 2026", reason: "Better Opportunity", interview: true },
  { name: "Priya Nair", dept: "Marketing", role: "Content Lead", tenure: "2.5 yrs", exit: "Feb 28, 2026", reason: "Relocation", interview: true },
  { name: "Deepak Rao", dept: "Engineering", role: "Sr. Developer", tenure: "4.1 yrs", exit: "Jan 20, 2026", reason: "Better Opportunity", interview: false },
  { name: "Sunita Das", dept: "Finance", role: "Accountant", tenure: "3.0 yrs", exit: "Mar 5, 2026", reason: "Personal", interview: true },
  { name: "Vikash Tiwari", dept: "Sales", role: "BDE", tenure: "0.9 yrs", exit: "Feb 10, 2026", reason: "Performance", interview: false },
];
const flightRisks = [
  { name: "Raj Sharma", dept: "Engineering", tenure: "0.6 yrs", score: 2.1, risk: "High" },
  { name: "Anita Desai", dept: "Design", tenure: "1.1 yrs", score: 2.8, risk: "Medium" },
  { name: "Kiran Patel", dept: "Sales", tenure: "0.4 yrs", score: 2.4, risk: "High" },
];

function TurnoverAnalysis({ onBack }: { onBack: () => void }) {
  const handleExportCSV = () => {
    const headers = ["Employee", "Department", "Role", "Tenure", "Exit Date", "Reason", "Exit Interview"];
    const rows = exitedEmployees.map(e => [e.name, e.dept, e.role, e.tenure, e.exit, e.reason, e.interview ? "Yes" : "No"]);
    const csv = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "turnover_report.csv";
    a.click();
    URL.revokeObjectURL(url);
  };
  const handleExportPDF = () => {
    const w = window.open("", "_blank");
    if (!w) return;
    const rows = exitedEmployees.map(e => `<tr><td style="padding:8px;border-bottom:1px solid #eee">${e.name}</td><td style="padding:8px;border-bottom:1px solid #eee">${e.dept}</td><td style="padding:8px;border-bottom:1px solid #eee">${e.role}</td><td style="padding:8px;border-bottom:1px solid #eee">${e.tenure}</td><td style="padding:8px;border-bottom:1px solid #eee">${e.exit}</td><td style="padding:8px;border-bottom:1px solid #eee">${e.reason}</td><td style="padding:8px;border-bottom:1px solid #eee">${e.interview ? "Yes" : "No"}</td></tr>`).join("");
    w.document.write(`<html><head><title>Turnover Analysis Report</title><style>body{font-family:system-ui,sans-serif;padding:40px;color:#1a1a1a}h1{color:#059669;margin-bottom:4px}p{color:#6b7280;margin-bottom:24px}table{width:100%;border-collapse:collapse}th{text-align:left;padding:10px 8px;background:#f0fdf4;color:#059669;font-size:11px;text-transform:uppercase;border-bottom:2px solid #059669}</style></head><body><h1>Turnover Analysis Report</h1><p>Mar 31, 2026</p><table><thead><tr><th>Employee</th><th>Department</th><th>Role</th><th>Tenure</th><th>Exit Date</th><th>Reason</th><th>Interviewed</th></tr></thead><tbody>${rows}</tbody></table></body></html>`);
    w.document.close(); w.print();
  };
  return (
    <div>
      <ReportHeader title="Turnover Analysis — Annual" subtitle="Mar 31, 2026" onBack={onBack} onExportPDF={handleExportPDF} onExportCSV={handleExportCSV} />
      <div className="grid grid-cols-3 gap-4 mb-6">
        <KpiCard label="Turnover Rate" value="4.1%" color="#EF4444" />
        <KpiCard label="Avg Tenure" value="3.2 yrs" color="#059669" />
        <KpiCard label="Retention Rate" value="96.8%" color="#22C55E" />
      </div>
      <div className="grid grid-cols-3 gap-5 mb-6">
        <div className="col-span-2 rounded-2xl p-6 shadow-sm" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}>
          <h4 style={{ color: "var(--foreground)", fontSize: "14px", fontWeight: 700, marginBottom: "16px" }}>Monthly Turnover Trend</h4>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={turnoverTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="month" tick={{ fill: "#6B7280", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#6B7280", fontSize: 11 }} axisLine={false} tickLine={false} domain={[2, 5]} />
              <Tooltip contentStyle={{ backgroundColor: "#064E3B", border: "none", borderRadius: "10px", color: "white", fontSize: "12px" }} />
              <Line type="monotone" dataKey="rate" stroke="#059669" strokeWidth={3} dot={{ fill: "#059669", r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="space-y-5">
          <div className="rounded-2xl p-6 shadow-sm" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}>
            <h4 style={{ color: "var(--foreground)", fontSize: "14px", fontWeight: 700, marginBottom: "12px" }}>Exit Reasons</h4>
            <ResponsiveContainer width="100%" height={120}>
              <PieChart><Pie data={exitReasons} cx="50%" cy="50%" innerRadius={30} outerRadius={50} paddingAngle={3} dataKey="value">{exitReasons.map((_, i) => <Cell key={i} fill={EMERALD_SHADES[i]} />)}</Pie><Tooltip contentStyle={{ backgroundColor: "#064E3B", border: "none", borderRadius: "10px", color: "white", fontSize: "12px" }} /></PieChart>
            </ResponsiveContainer>
            <div className="space-y-1.5 mt-2">{exitReasons.map((r, i) => (<div key={r.name} className="flex items-center justify-between"><div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full" style={{ backgroundColor: EMERALD_SHADES[i] }} /><span style={{ color: "var(--muted-foreground)", fontSize: "11px" }}>{r.name}</span></div><span style={{ color: "var(--foreground)", fontSize: "11px", fontWeight: 700 }}>{r.value}%</span></div>))}</div>
          </div>
          <div className="rounded-2xl p-5 shadow-sm" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}>
            <h4 style={{ color: "var(--foreground)", fontSize: "13px", fontWeight: 700, marginBottom: "10px" }}>
              <span className="flex items-center gap-2"><AlertTriangle size={14} color="#EF4444" /> Flight Risk</span>
            </h4>
            <div className="space-y-2.5">
              {flightRisks.map((r, i) => (
                <div key={i} className="flex items-center justify-between p-2 rounded-lg" style={{ backgroundColor: r.risk === "High" ? "rgba(239,68,68,0.05)" : "rgba(245,158,11,0.05)" }}>
                  <div><p style={{ color: "var(--foreground)", fontSize: "12px", fontWeight: 600 }}>{r.name}</p><p style={{ color: "var(--muted-foreground)", fontSize: "10px" }}>{r.dept} · {r.tenure}</p></div>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-bold" style={{ backgroundColor: r.risk === "High" ? "#FEF2F2" : "#FFFBEB", color: r.risk === "High" ? "#EF4444" : "#F59E0B" }}>{r.risk}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-5 mb-6">
        <div className="col-span-2 rounded-2xl shadow-sm overflow-hidden" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}>
          <table className="w-full text-sm">
            <thead><tr style={{ borderBottom: "1px solid var(--border)" }}>
              {["Employee", "Department", "Role", "Tenure", "Exit Date", "Reason", "Exit Interview"].map(h => (
                <th key={h} className="px-4 py-3 text-left font-semibold" style={{ color: "var(--muted-foreground)", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.5px" }}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {exitedEmployees.map((emp, i) => (
                <tr key={i} style={{ borderBottom: "1px solid var(--border)", backgroundColor: i % 2 === 0 ? "var(--card)" : "var(--background)" }}>
                  <td className="px-4 py-3" style={{ color: "var(--foreground)", fontWeight: 600 }}>{emp.name}</td>
                  <td className="px-4 py-3" style={{ color: "var(--muted-foreground)" }}>{emp.dept}</td>
                  <td className="px-4 py-3" style={{ color: "var(--muted-foreground)" }}>{emp.role}</td>
                  <td className="px-4 py-3" style={{ color: "var(--foreground)" }}>{emp.tenure}</td>
                  <td className="px-4 py-3" style={{ color: "var(--muted-foreground)" }}>{emp.exit}</td>
                  <td className="px-4 py-3" style={{ color: "var(--muted-foreground)" }}>{emp.reason}</td>
                  <td className="px-4 py-3">{emp.interview ? <Check size={16} color="#059669" /> : <X size={16} color="#EF4444" />}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="rounded-2xl p-6 shadow-sm" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}>
          <h4 style={{ color: "var(--foreground)", fontSize: "14px", fontWeight: 700, marginBottom: "16px" }}>Turnover by Department</h4>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={turnoverByDept} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
              <XAxis type="number" tick={{ fill: "#6B7280", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis dataKey="dept" type="category" tick={{ fill: "#6B7280", fontSize: 11 }} axisLine={false} tickLine={false} width={85} />
              <Tooltip contentStyle={{ backgroundColor: "#064E3B", border: "none", borderRadius: "10px", color: "white", fontSize: "12px" }} />
              <Bar dataKey="count" fill="#059669" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════ */
/* MAIN REPORTS PAGE                             */
/* ══════════════════════════════════════════════ */
export function Reports() {
  const [activeReport, setActiveReport] = useState<string | null>(null);

  if (activeReport === "Headcount Report") return <HeadcountReport onBack={() => setActiveReport(null)} />;
  if (activeReport === "Payroll Summary") return <PayrollSummary onBack={() => setActiveReport(null)} />;
  if (activeReport === "Attendance Report") return <AttendanceReport onBack={() => setActiveReport(null)} />;
  if (activeReport === "Performance Review") return <PerformanceReview onBack={() => setActiveReport(null)} />;
  if (activeReport === "Recruitment Pipeline") return <RecruitmentPipeline onBack={() => setActiveReport(null)} />;
  if (activeReport === "Turnover Analysis") return <TurnoverAnalysis onBack={() => setActiveReport(null)} />;

  return (
    <div style={{ maxWidth: "1360px" }}>
      {/* KPI */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Employees", value: "248", color: "#059669" },
          { label: "Monthly Payroll", value: "₹86,584", color: "#22C55E" },
          { label: "Attendance Rate", value: "88.3%", color: "#F59E0B" },
          { label: "Turnover Rate", value: "3.2%", color: "#EF4444" },
        ].map((s, i) => (
          <KpiCard key={i} label={s.label} value={s.value} color={s.color} />
        ))}
      </div>

      <div className="grid grid-cols-3 gap-5 mb-6">
        {/* Headcount Trend Chart */}
        <div className="col-span-2 rounded-2xl p-6 shadow-sm" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}>
          <h3 style={{ color: "var(--foreground)", fontSize: "15px", fontWeight: 700, marginBottom: "4px" }}>Headcount Growth Trend</h3>
          <p style={{ color: "var(--muted-foreground)", fontSize: "12px", marginBottom: "20px" }}>Oct 2025 — Apr 2026</p>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={headcountTrend}>
              <defs>
                <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="month" tick={{ fill: "#6B7280", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis domain={[220, 255]} tick={{ fill: "#6B7280", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ backgroundColor: "#064E3B", border: "none", borderRadius: "10px", color: "white", fontSize: "12px" }} />
              <Area type="monotone" dataKey="count" stroke="#059669" strokeWidth={3} fill="url(#areaGrad)" dot={{ fill: "#059669", r: 4 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Quick Stats */}
        <div className="rounded-2xl p-6 shadow-sm" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}>
          <h3 style={{ color: "var(--foreground)", fontSize: "15px", fontWeight: 700, marginBottom: "16px" }}>Key Metrics</h3>
          <div className="space-y-4">
            {[
              { label: "Avg. Tenure", value: "3.2 years", bar: 64, color: "#059669" },
              { label: "Avg. Salary", value: "₹94,200", bar: 72, color: "#22C55E" },
              { label: "Training Hours", value: "48 hrs/yr", bar: 48, color: "#14B8A6" },
              { label: "Retention Rate", value: "96.8%", bar: 97, color: "#F59E0B" },
            ].map((m, i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-1">
                  <span style={{ color: "#6B7280", fontSize: "12px" }}>{m.label}</span>
                  <span style={{ color: "#022C22", fontSize: "13px", fontWeight: 700 }}>{m.value}</span>
                </div>
                <div className="rounded-full overflow-hidden" style={{ height: "5px", backgroundColor: "#D1FAE5" }}>
                  <div className="rounded-full" style={{ width: `${m.bar}%`, height: "100%", backgroundColor: m.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reports Grid */}
      <div className="rounded-2xl p-6 shadow-sm" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}>
        <h3 style={{ color: "var(--foreground)", fontSize: "15px", fontWeight: 700, marginBottom: "16px" }}>Available Reports</h3>
        <div className="grid grid-cols-3 gap-4">
          {reports.map((report, i) => (
            <div
              key={i}
              className="rounded-xl p-4 flex items-start justify-between transition-all cursor-pointer border border-border bg-background"
              onClick={() => setActiveReport(report.title)}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = "var(--primary)";
                (e.currentTarget as HTMLDivElement).style.backgroundColor = "var(--secondary)";
                (e.currentTarget as HTMLDivElement).style.boxShadow = "0 4px 12px rgba(0,0,0,0.06)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = "var(--border)";
                (e.currentTarget as HTMLDivElement).style.backgroundColor = "var(--background)";
                (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
              }}
            >
              <div className="flex items-start gap-3 flex-1">
                <div className="flex items-center justify-center rounded-xl shrink-0" style={{ width: "36px", height: "36px", backgroundColor: report.bg }}>
                  <report.icon size={16} color={report.color} />
                </div>
                <div>
                  <p style={{ color: "#022C22", fontSize: "13px", fontWeight: 700 }}>{report.title}</p>
                  <p style={{ color: "#6B7280", fontSize: "11px", marginTop: "1px" }}>{report.desc}</p>
                  <p style={{ color: "#CBD5E1", fontSize: "10px", marginTop: "4px" }}>{report.size} · {report.generated}</p>
                </div>
              </div>
              <button className="p-2 rounded-lg transition-colors shrink-0" style={{ color: "#6B7280" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#ECFDF5"; (e.currentTarget as HTMLButtonElement).style.color = "#059669"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent"; (e.currentTarget as HTMLButtonElement).style.color = "#6B7280"; }}
              >
                <Download size={15} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
