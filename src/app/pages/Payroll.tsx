import { useState } from "react";
import { Download, Play, ChevronDown } from "lucide-react";
import { payrollEmployees } from "../data/mockData";

const months = [
  "January 2026", "February 2026", "March 2026", "April 2026",
];

export function Payroll() {
  const [selectedMonth, setSelectedMonth] = useState("April 2026");
  const [showMonthDropdown, setShowMonthDropdown] = useState(false);
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  const [runningPayroll, setRunningPayroll] = useState(false);

  const totalGross = payrollEmployees.reduce((s, e) => s + e.gross, 0);
  const totalDeductions = payrollEmployees.reduce((s, e) => s + e.deductions, 0);
  const totalNet = payrollEmployees.reduce((s, e) => s + e.net, 0);

  const handleRunPayroll = () => {
    setRunningPayroll(true);
    setTimeout(() => setRunningPayroll(false), 2000);
  };

  return (
    <div style={{ maxWidth: "1360px" }}>
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-6">
        {/* Month Selector */}
        <div className="relative">
          <button
            onClick={() => setShowMonthDropdown(!showMonthDropdown)}
            className="flex items-center gap-3 rounded-xl px-4 py-2.5 transition-colors"
            style={{
              backgroundColor: "white",
              border: "1px solid #E2E8F0",
              color: "#0F172A",
              fontSize: "14px",
              fontWeight: 700,
              boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
            }}
          >
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: "#3B82F6" }}
            />
            {selectedMonth}
            <ChevronDown
              size={14}
              color="#94A3B8"
              style={{ transform: showMonthDropdown ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}
            />
          </button>
          {showMonthDropdown && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowMonthDropdown(false)} />
              <div
                className="absolute top-full left-0 mt-1 rounded-xl overflow-hidden z-20"
                style={{
                  minWidth: "180px",
                  backgroundColor: "white",
                  border: "1px solid #E2E8F0",
                  boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
                }}
              >
                {months.map((m) => (
                  <button
                    key={m}
                    onClick={() => { setSelectedMonth(m); setShowMonthDropdown(false); }}
                    className="w-full px-4 py-2.5 text-left transition-colors"
                    style={{
                      fontSize: "13px",
                      color: selectedMonth === m ? "#3B82F6" : "#475569",
                      backgroundColor: selectedMonth === m ? "#EFF6FF" : "transparent",
                      fontWeight: selectedMonth === m ? 700 : 400,
                    }}
                    onMouseEnter={(e) => {
                      if (selectedMonth !== m)
                        (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#F8FAFC";
                    }}
                    onMouseLeave={(e) => {
                      if (selectedMonth !== m)
                        (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
                    }}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Run Payroll CTA */}
        <button
          onClick={handleRunPayroll}
          className="flex items-center gap-2.5 rounded-xl px-6 py-2.5 transition-all hover:opacity-90 active:scale-95"
          style={{
            background: runningPayroll
              ? "linear-gradient(135deg, #22C55E, #16A34A)"
              : "linear-gradient(135deg, #3B82F6, #1D4ED8)",
            color: "white",
            fontSize: "14px",
            fontWeight: 700,
            boxShadow: "0 4px 14px rgba(59, 130, 246, 0.4)",
            transition: "all 0.3s",
          }}
        >
          <Play size={15} fill="white" />
          {runningPayroll ? "Processing..." : "Run Payroll"}
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-5 mb-6">
        {[
          {
            label: "Total Gross Salary",
            value: `$${totalGross.toLocaleString()}`,
            sub: `${payrollEmployees.length} employees`,
            color: "#3B82F6",
            bg: "linear-gradient(135deg, #EFF6FF, #DBEAFE)",
            border: "#BFDBFE",
            icon: "💰",
          },
          {
            label: "Total Deductions",
            value: `$${totalDeductions.toLocaleString()}`,
            sub: "Tax, PF & Insurance",
            color: "#EF4444",
            bg: "linear-gradient(135deg, #FEF2F2, #FEE2E2)",
            border: "#FECACA",
            icon: "📉",
          },
          {
            label: "Net Payout",
            value: `$${totalNet.toLocaleString()}`,
            sub: "After all deductions",
            color: "#22C55E",
            bg: "linear-gradient(135deg, #F0FDF4, #DCFCE7)",
            border: "#BBF7D0",
            icon: "✅",
          },
        ].map((card, i) => (
          <div
            key={i}
            className="rounded-2xl p-6"
            style={{
              background: card.bg,
              border: `1px solid ${card.border}`,
              boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
            }}
          >
            <div className="flex items-start justify-between">
              <div>
                <p style={{ color: "#64748B", fontSize: "12px", fontWeight: 500, marginBottom: "6px" }}>
                  {card.label}
                </p>
                <p style={{ color: card.color, fontSize: "28px", fontWeight: 800, letterSpacing: "-0.5px" }}>
                  {card.value}
                </p>
                <p style={{ color: "#94A3B8", fontSize: "12px", marginTop: "4px" }}>{card.sub}</p>
              </div>
              <span style={{ fontSize: "28px" }}>{card.icon}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Payroll Table */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{
          backgroundColor: "white",
          border: "1px solid #E2E8F0",
          boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
        }}
      >
        <div
          className="px-6 py-4 flex items-center justify-between"
          style={{ borderBottom: "1px solid #E2E8F0" }}
        >
          <div>
            <h3 style={{ color: "#0F172A", fontSize: "15px", fontWeight: 700 }}>
              Payroll Details — {selectedMonth}
            </h3>
            <p style={{ color: "#94A3B8", fontSize: "12px", marginTop: "2px" }}>
              {payrollEmployees.filter((e) => e.status === "Paid").length} paid ·{" "}
              {payrollEmployees.filter((e) => e.status === "Pending").length} pending
            </p>
          </div>
          <button
            className="flex items-center gap-2 px-4 py-2 rounded-xl transition-colors"
            style={{
              border: "1px solid #E2E8F0",
              color: "#475569",
              fontSize: "13px",
              fontWeight: 600,
              backgroundColor: "#F8FAFC",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#EFF6FF";
              (e.currentTarget as HTMLButtonElement).style.color = "#3B82F6";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#F8FAFC";
              (e.currentTarget as HTMLButtonElement).style.color = "#475569";
            }}
          >
            <Download size={14} />
            Export CSV
          </button>
        </div>

        {/* Table Header */}
        <div
          className="grid px-6 py-3"
          style={{
            backgroundColor: "#F8FAFC",
            borderBottom: "1px solid #E2E8F0",
            gridTemplateColumns: "2.5fr 1.2fr 1fr 1fr 1fr 1fr 1fr",
          }}
        >
          {["Employee", "Department", "Gross", "Deductions", "Net Pay", "Status", "Payslip"].map((col) => (
            <span
              key={col}
              style={{
                color: "#64748B",
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.5px",
                textTransform: "uppercase",
              }}
            >
              {col}
            </span>
          ))}
        </div>

        {/* Table Rows */}
        {payrollEmployees.map((emp, i) => (
          <div
            key={emp.id}
            className="grid px-6 py-4 items-center transition-colors"
            style={{
              gridTemplateColumns: "2.5fr 1.2fr 1fr 1fr 1fr 1fr 1fr",
              borderBottom: i < payrollEmployees.length - 1 ? "1px solid #F1F5F9" : "none",
              backgroundColor:
                hoveredRow === emp.id ? "#EFF6FF" : i % 2 === 0 ? "white" : "#FAFBFD",
            }}
            onMouseEnter={() => setHoveredRow(emp.id)}
            onMouseLeave={() => setHoveredRow(null)}
          >
            {/* Employee */}
            <div className="flex items-center gap-3">
              <img
                src={emp.avatar}
                alt={emp.name}
                className="rounded-full object-cover shrink-0"
                style={{ width: "36px", height: "36px", border: "2px solid #E2E8F0" }}
              />
              <div>
                <p style={{ color: "#0F172A", fontSize: "13px", fontWeight: 600 }}>{emp.name}</p>
                <p style={{ color: "#94A3B8", fontSize: "11px" }}>{emp.designation}</p>
              </div>
            </div>

            {/* Department */}
            <span style={{ color: "#475569", fontSize: "13px" }}>{emp.department}</span>

            {/* Gross */}
            <span style={{ color: "#0F172A", fontSize: "13px", fontWeight: 600 }}>
              ${emp.gross.toLocaleString()}
            </span>

            {/* Deductions */}
            <span style={{ color: "#EF4444", fontSize: "13px", fontWeight: 500 }}>
              -${emp.deductions.toLocaleString()}
            </span>

            {/* Net Pay */}
            <span style={{ color: "#22C55E", fontSize: "13px", fontWeight: 700 }}>
              ${emp.net.toLocaleString()}
            </span>

            {/* Status */}
            <span
              className="px-2.5 py-1 rounded-full"
              style={{
                backgroundColor: emp.status === "Paid" ? "#F0FDF4" : "#FFFBEB",
                color: emp.status === "Paid" ? "#16A34A" : "#D97706",
                fontSize: "11px",
                fontWeight: 700,
                width: "fit-content",
              }}
            >
              {emp.status === "Paid" ? "✓ Paid" : "⏳ Pending"}
            </span>

            {/* Download Payslip */}
            <button
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors"
              style={{
                border: "1px solid #E2E8F0",
                color: "#475569",
                fontSize: "11px",
                fontWeight: 600,
                backgroundColor: "white",
                width: "fit-content",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#EFF6FF";
                (e.currentTarget as HTMLButtonElement).style.borderColor = "#BFDBFE";
                (e.currentTarget as HTMLButtonElement).style.color = "#3B82F6";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = "white";
                (e.currentTarget as HTMLButtonElement).style.borderColor = "#E2E8F0";
                (e.currentTarget as HTMLButtonElement).style.color = "#475569";
              }}
            >
              <Download size={12} />
              Payslip
            </button>
          </div>
        ))}

        {/* Total Row */}
        <div
          className="grid px-6 py-4"
          style={{
            gridTemplateColumns: "2.5fr 1.2fr 1fr 1fr 1fr 1fr 1fr",
            borderTop: "2px solid #E2E8F0",
            backgroundColor: "#F8FAFC",
          }}
        >
          <span style={{ color: "#0F172A", fontSize: "13px", fontWeight: 700 }}>
            Total ({payrollEmployees.length} employees)
          </span>
          <span />
          <span style={{ color: "#0F172A", fontSize: "13px", fontWeight: 800 }}>
            ${totalGross.toLocaleString()}
          </span>
          <span style={{ color: "#EF4444", fontSize: "13px", fontWeight: 700 }}>
            -${totalDeductions.toLocaleString()}
          </span>
          <span style={{ color: "#22C55E", fontSize: "13px", fontWeight: 800 }}>
            ${totalNet.toLocaleString()}
          </span>
          <span />
          <span />
        </div>
      </div>
    </div>
  );
}
