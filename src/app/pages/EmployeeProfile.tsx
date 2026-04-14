import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Pencil,
  Download,
  User,
  FileText,
  CalendarCheck,
  DollarSign,
  TrendingUp,
  Building2,
  Clock,
  AlertCircle,
} from "lucide-react";
import { employees, performanceData } from "../data/mockData";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const tabs = [
  { id: "personal", label: "Personal Info", icon: User },
  { id: "documents", label: "Documents", icon: FileText },
  { id: "attendance", label: "Attendance", icon: CalendarCheck },
  { id: "payroll", label: "Payroll", icon: DollarSign },
  { id: "performance", label: "Performance", icon: TrendingUp },
];

const statusConfig: Record<string, { bg: string; color: string }> = {
  Active: { bg: "#F0FDF4", color: "#16A34A" },
  Inactive: { bg: "#FEF2F2", color: "#DC2626" },
  "On Leave": { bg: "#FFFBEB", color: "#D97706" },
};

export function EmployeeProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("personal");

  const employee = employees.find((e) => e.id === id) || employees[0];
  const status = statusConfig[employee.status] || statusConfig.Active;

  const infoField = (label: string, value: string, icon?: any) => (
    <div
      key={label}
      className="flex items-start gap-3 p-4 rounded-xl"
      style={{ backgroundColor: "#F8FAFC", border: "1px solid #E2E8F0" }}
    >
      {icon && (
        <div
          className="flex items-center justify-center rounded-lg mt-0.5 shrink-0"
          style={{ width: "28px", height: "28px", backgroundColor: "#EFF6FF" }}
        >
          {icon}
        </div>
      )}
      <div>
        <p style={{ color: "#94A3B8", fontSize: "11px", fontWeight: 600, letterSpacing: "0.4px", textTransform: "uppercase" }}>
          {label}
        </p>
        <p style={{ color: "#1E293B", fontSize: "14px", fontWeight: 500, marginTop: "2px" }}>
          {value}
        </p>
      </div>
    </div>
  );

  return (
    <div style={{ maxWidth: "1360px" }}>
      {/* Back button */}
      <button
        onClick={() => navigate("/employees")}
        className="flex items-center gap-2 mb-5 rounded-xl px-3 py-2 transition-colors"
        style={{ color: "#64748B", fontSize: "13px", fontWeight: 500 }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#F1F5F9";
          (e.currentTarget as HTMLButtonElement).style.color = "#0F172A";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
          (e.currentTarget as HTMLButtonElement).style.color = "#64748B";
        }}
      >
        <ArrowLeft size={15} />
        Back to Employee Directory
      </button>

      <div className="flex gap-5">
        {/* Left Panel */}
        <div
          className="rounded-2xl p-6 flex flex-col"
          style={{
            width: "280px",
            minWidth: "280px",
            backgroundColor: "white",
            border: "1px solid #E2E8F0",
            boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
          }}
        >
          {/* Avatar */}
          <div className="flex flex-col items-center text-center">
            <div className="relative">
              <img
                src={employee.avatar}
                alt={employee.name}
                className="rounded-full object-cover"
                style={{
                  width: "96px",
                  height: "96px",
                  border: "3px solid white",
                  boxShadow: "0 0 0 3px #3B82F630",
                }}
                onError={(e) => {
                  const el = e.currentTarget;
                  el.style.display = "none";
                }}
              />
              <div
                className="absolute bottom-1 right-1 w-4 h-4 rounded-full"
                style={{
                  backgroundColor: employee.status === "Active" ? "#22C55E" : "#F59E0B",
                  border: "2px solid white",
                }}
              />
            </div>
            <h2 style={{ color: "#0F172A", fontSize: "17px", fontWeight: 700, marginTop: "12px" }}>
              {employee.name}
            </h2>
            <p style={{ color: "#64748B", fontSize: "13px", marginTop: "2px" }}>{employee.designation}</p>
            <span
              className="mt-2 px-3 py-1 rounded-full"
              style={{
                backgroundColor: status.bg,
                color: status.color,
                fontSize: "12px",
                fontWeight: 700,
              }}
            >
              {employee.status}
            </span>
          </div>

          {/* Divider */}
          <div style={{ height: "1px", backgroundColor: "#E2E8F0", margin: "20px 0" }} />

          {/* Info */}
          <div className="space-y-3 flex-1">
            <div className="flex items-center gap-3">
              <div
                className="flex items-center justify-center rounded-lg shrink-0"
                style={{ width: "30px", height: "30px", backgroundColor: "#EFF6FF" }}
              >
                <Building2 size={14} color="#3B82F6" />
              </div>
              <div>
                <p style={{ color: "#94A3B8", fontSize: "11px" }}>Department</p>
                <p style={{ color: "#1E293B", fontSize: "13px", fontWeight: 600 }}>{employee.department}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div
                className="flex items-center justify-center rounded-lg shrink-0"
                style={{ width: "30px", height: "30px", backgroundColor: "#EFF6FF" }}
              >
                <Mail size={14} color="#3B82F6" />
              </div>
              <div>
                <p style={{ color: "#94A3B8", fontSize: "11px" }}>Email</p>
                <p style={{ color: "#1E293B", fontSize: "12px", fontWeight: 500, wordBreak: "break-all" }}>
                  {employee.email}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div
                className="flex items-center justify-center rounded-lg shrink-0"
                style={{ width: "30px", height: "30px", backgroundColor: "#EFF6FF" }}
              >
                <Phone size={14} color="#3B82F6" />
              </div>
              <div>
                <p style={{ color: "#94A3B8", fontSize: "11px" }}>Phone</p>
                <p style={{ color: "#1E293B", fontSize: "13px", fontWeight: 500 }}>{employee.phone}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div
                className="flex items-center justify-center rounded-lg shrink-0"
                style={{ width: "30px", height: "30px", backgroundColor: "#EFF6FF" }}
              >
                <MapPin size={14} color="#3B82F6" />
              </div>
              <div>
                <p style={{ color: "#94A3B8", fontSize: "11px" }}>Location</p>
                <p style={{ color: "#1E293B", fontSize: "13px", fontWeight: 500 }}>{employee.location}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div
                className="flex items-center justify-center rounded-lg shrink-0"
                style={{ width: "30px", height: "30px", backgroundColor: "#EFF6FF" }}
              >
                <Calendar size={14} color="#3B82F6" />
              </div>
              <div>
                <p style={{ color: "#94A3B8", fontSize: "11px" }}>Joined</p>
                <p style={{ color: "#1E293B", fontSize: "13px", fontWeight: 500 }}>
                  {new Date(employee.joinDate).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div
                className="flex items-center justify-center rounded-lg shrink-0"
                style={{ width: "30px", height: "30px", backgroundColor: "#EFF6FF" }}
              >
                <Clock size={14} color="#3B82F6" />
              </div>
              <div>
                <p style={{ color: "#94A3B8", fontSize: "11px" }}>Employment Type</p>
                <p style={{ color: "#1E293B", fontSize: "13px", fontWeight: 500 }}>{employee.employmentType}</p>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div style={{ height: "1px", backgroundColor: "#E2E8F0", margin: "20px 0" }} />

          {/* Performance score */}
          <div
            className="rounded-xl p-4"
            style={{ backgroundColor: "#F8FAFC", border: "1px solid #E2E8F0" }}
          >
            <div className="flex items-center justify-between mb-2">
              <span style={{ color: "#64748B", fontSize: "12px", fontWeight: 500 }}>Performance Score</span>
              <span style={{ color: "#3B82F6", fontSize: "16px", fontWeight: 800 }}>
                {employee.performance}%
              </span>
            </div>
            <div
              className="rounded-full overflow-hidden"
              style={{ height: "6px", backgroundColor: "#E2E8F0" }}
            >
              <div
                className="rounded-full"
                style={{
                  height: "100%",
                  width: `${employee.performance}%`,
                  background: "linear-gradient(90deg, #3B82F6, #8B5CF6)",
                }}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 mt-4">
            <button
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl transition-opacity hover:opacity-90"
              style={{
                background: "linear-gradient(135deg, #3B82F6, #1D4ED8)",
                color: "white",
                fontSize: "13px",
                fontWeight: 600,
                boxShadow: "0 4px 12px rgba(59,130,246,0.3)",
              }}
            >
              <Pencil size={13} />
              Edit Profile
            </button>
            <button
              className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl transition-colors"
              style={{
                border: "1px solid #E2E8F0",
                color: "#475569",
                fontSize: "13px",
                backgroundColor: "white",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#F8FAFC";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = "white";
              }}
            >
              <Download size={13} />
            </button>
          </div>
        </div>

        {/* Right Panel */}
        <div className="flex-1 min-w-0">
          {/* Employee ID Banner */}
          <div
            className="rounded-2xl p-4 mb-4 flex items-center gap-4"
            style={{
              background: "linear-gradient(135deg, #0F172A, #1E293B)",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <div
              className="flex items-center justify-center rounded-xl shrink-0"
              style={{ width: "44px", height: "44px", backgroundColor: "rgba(59,130,246,0.15)", border: "1px solid rgba(59,130,246,0.2)" }}
            >
              <span style={{ color: "#3B82F6", fontSize: "11px", fontWeight: 800 }}>ID</span>
            </div>
            {[
              { label: "Employee ID", value: employee.id },
              { label: "Manager", value: employee.manager },
              { label: "Employment", value: employee.employmentType },
              { label: "Annual Salary", value: `$${employee.salary.toLocaleString()}` },
            ].map((item) => (
              <div key={item.label} className="flex-1">
                <p style={{ color: "#475569", fontSize: "11px" }}>{item.label}</p>
                <p style={{ color: "white", fontSize: "13px", fontWeight: 700 }}>{item.value}</p>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div
            className="rounded-2xl overflow-hidden"
            style={{
              backgroundColor: "white",
              border: "1px solid #E2E8F0",
              boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
            }}
          >
            {/* Tab Headers */}
            <div
              className="flex"
              style={{ borderBottom: "1px solid #E2E8F0", backgroundColor: "#F8FAFC" }}
            >
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="flex items-center gap-2 px-5 py-4 transition-colors"
                  style={{
                    color: activeTab === tab.id ? "#3B82F6" : "#64748B",
                    borderBottom: activeTab === tab.id ? "2px solid #3B82F6" : "2px solid transparent",
                    backgroundColor: activeTab === tab.id ? "white" : "transparent",
                    fontSize: "13px",
                    fontWeight: activeTab === tab.id ? 700 : 500,
                    marginBottom: "-1px",
                    whiteSpace: "nowrap",
                  }}
                >
                  <tab.icon size={14} />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {activeTab === "personal" && (
                <div>
                  <h4 style={{ color: "#0F172A", fontSize: "14px", fontWeight: 700, marginBottom: "16px" }}>
                    Personal Information
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    {infoField(
                      "Full Name",
                      employee.name,
                      <User size={14} color="#3B82F6" />
                    )}
                    {infoField(
                      "Date of Birth",
                      new Date(employee.dob).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
                      <Calendar size={14} color="#3B82F6" />
                    )}
                    {infoField(
                      "Gender",
                      employee.gender,
                      <User size={14} color="#3B82F6" />
                    )}
                    {infoField(
                      "Phone Number",
                      employee.phone,
                      <Phone size={14} color="#3B82F6" />
                    )}
                    <div className="col-span-2">
                      {infoField(
                        "Home Address",
                        employee.address,
                        <MapPin size={14} color="#3B82F6" />
                      )}
                    </div>
                    <div className="col-span-2">
                      {infoField(
                        "Emergency Contact",
                        employee.emergencyContact,
                        <AlertCircle size={14} color="#3B82F6" />
                      )}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "documents" && (
                <div>
                  <h4 style={{ color: "#0F172A", fontSize: "14px", fontWeight: 700, marginBottom: "16px" }}>
                    Documents
                  </h4>
                  <div className="space-y-3">
                    {[
                      { name: "Employment Contract.pdf", size: "2.4 MB", date: employee.joinDate, type: "PDF" },
                      { name: "NDA Agreement.pdf", size: "1.1 MB", date: employee.joinDate, type: "PDF" },
                      { name: "ID Verification.jpg", size: "840 KB", date: "2023-01-10", type: "IMG" },
                      { name: "Tax Form W-4.pdf", size: "560 KB", date: "2024-01-01", type: "PDF" },
                    ].map((doc) => (
                      <div
                        key={doc.name}
                        className="flex items-center justify-between p-4 rounded-xl"
                        style={{ border: "1px solid #E2E8F0", backgroundColor: "#F8FAFC" }}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="flex items-center justify-center rounded-lg"
                            style={{
                              width: "36px",
                              height: "36px",
                              backgroundColor: doc.type === "PDF" ? "#FEF2F2" : "#EFF6FF",
                            }}
                          >
                            <FileText size={16} color={doc.type === "PDF" ? "#EF4444" : "#3B82F6"} />
                          </div>
                          <div>
                            <p style={{ color: "#1E293B", fontSize: "13px", fontWeight: 600 }}>{doc.name}</p>
                            <p style={{ color: "#94A3B8", fontSize: "11px" }}>
                              {doc.size} • Uploaded {new Date(doc.date).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <button
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors"
                          style={{
                            color: "#3B82F6",
                            backgroundColor: "#EFF6FF",
                            fontSize: "12px",
                            fontWeight: 600,
                          }}
                        >
                          <Download size={12} />
                          Download
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "attendance" && (
                <div>
                  <h4 style={{ color: "#0F172A", fontSize: "14px", fontWeight: 700, marginBottom: "16px" }}>
                    Attendance Summary — April 2026
                  </h4>
                  <div className="grid grid-cols-4 gap-3 mb-5">
                    {[
                      { label: "Working Days", value: "22", color: "#3B82F6" },
                      { label: "Present", value: "18", color: "#22C55E" },
                      { label: "Absent", value: "2", color: "#EF4444" },
                      { label: "Leaves", value: "2", color: "#F59E0B" },
                    ].map((s) => (
                      <div
                        key={s.label}
                        className="rounded-xl p-4 text-center"
                        style={{ border: "1px solid #E2E8F0", backgroundColor: "#F8FAFC" }}
                      >
                        <p style={{ color: s.color, fontSize: "22px", fontWeight: 800 }}>{s.value}</p>
                        <p style={{ color: "#64748B", fontSize: "11px", marginTop: "2px" }}>{s.label}</p>
                      </div>
                    ))}
                  </div>
                  <p style={{ color: "#94A3B8", fontSize: "12px", textAlign: "center" }}>
                    Detailed attendance log available in the Attendance module.
                  </p>
                </div>
              )}

              {activeTab === "payroll" && (
                <div>
                  <h4 style={{ color: "#0F172A", fontSize: "14px", fontWeight: 700, marginBottom: "16px" }}>
                    Payroll Summary — March 2026
                  </h4>
                  <div className="grid grid-cols-3 gap-3 mb-5">
                    {[
                      { label: "Gross Salary", value: `$${employee.grossSalary?.toLocaleString() || "N/A"}`, color: "#3B82F6", bg: "#EFF6FF" },
                      { label: "Deductions", value: `$${employee.deductions?.toLocaleString() || "N/A"}`, color: "#EF4444", bg: "#FEF2F2" },
                      { label: "Net Pay", value: `$${employee.netPay?.toLocaleString() || "N/A"}`, color: "#22C55E", bg: "#F0FDF4" },
                    ].map((s) => (
                      <div
                        key={s.label}
                        className="rounded-xl p-4 text-center"
                        style={{ border: `1px solid ${s.color}20`, backgroundColor: s.bg }}
                      >
                        <p style={{ color: s.color, fontSize: "20px", fontWeight: 800 }}>{s.value}</p>
                        <p style={{ color: "#64748B", fontSize: "11px", marginTop: "2px" }}>{s.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "performance" && (
                <div>
                  <h4 style={{ color: "#0F172A", fontSize: "14px", fontWeight: 700, marginBottom: "16px" }}>
                    Performance Trend
                  </h4>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={performanceData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                      <XAxis dataKey="name" tick={{ fill: "#94A3B8", fontSize: 11 }} axisLine={false} tickLine={false} />
                      <YAxis domain={[70, 100]} tick={{ fill: "#94A3B8", fontSize: 11 }} axisLine={false} tickLine={false} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#0F172A",
                          border: "1px solid rgba(255,255,255,0.1)",
                          borderRadius: "10px",
                          color: "white",
                          fontSize: "12px",
                        }}
                      />
                      <Line
                        key="line-score"
                        type="monotone"
                        dataKey="score"
                        stroke="#3B82F6"
                        strokeWidth={3}
                        dot={{ fill: "#3B82F6", r: 5 }}
                        activeDot={{ r: 7, fill: "#3B82F6" }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                  <div
                    className="mt-4 rounded-xl p-4 flex items-center justify-between"
                    style={{ backgroundColor: "#F8FAFC", border: "1px solid #E2E8F0" }}
                  >
                    <div>
                      <p style={{ color: "#94A3B8", fontSize: "12px" }}>Current Score</p>
                      <p style={{ color: "#3B82F6", fontSize: "22px", fontWeight: 800 }}>{employee.performance}%</p>
                    </div>
                    <div>
                      <p style={{ color: "#94A3B8", fontSize: "12px" }}>Rating</p>
                      <p style={{ color: "#22C55E", fontSize: "14px", fontWeight: 700 }}>
                        {employee.performance >= 90 ? "⭐ Excellent" : employee.performance >= 80 ? "✅ Good" : "📈 Improving"}
                      </p>
                    </div>
                    <div>
                      <p style={{ color: "#94A3B8", fontSize: "12px" }}>YoY Change</p>
                      <p style={{ color: "#22C55E", fontSize: "14px", fontWeight: 700 }}>+14%</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}