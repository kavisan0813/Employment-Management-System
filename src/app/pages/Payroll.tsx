import { useState, useEffect } from "react";
import { Download, Play, ChevronDown, X, CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import { payrollEmployees } from "../data/mockData";

const months = [
  "January 2026", "February 2026", "March 2026", "April 2026",
];

/* ─── Run Payroll Modal ─────────────────── */
function RunPayrollModal({ onClose, month }: { onClose: () => void; month: string }) {
  const [step, setStep] = useState<"confirm" | "processing" | "success">("confirm");
  const totalNet = payrollEmployees.reduce((s, e) => s + e.net, 0);

  useEffect(() => {
    if (step === "processing") {
      const timer = setTimeout(() => setStep("success"), 3000);
      return () => clearTimeout(timer);
    }
  }, [step]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.45)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl overflow-hidden shadow-2xl"
        style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {step === "confirm" && (
          <>
            <div className="px-8 py-8">
              <div className="flex items-center justify-between mb-6">
                <div
                  className="w-14 h-14 rounded-[20px] flex items-center justify-center"
                  style={{ backgroundColor: "#F0FDF4" }}
                >
                  <Play size={28} color="#10B981" fill="#10B981" />
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-xl transition-colors hover:bg-gray-100"
                  style={{ color: "#9CA3AF" }}
                >
                  <X size={20} />
                </button>
              </div>

              <h3 style={{ color: "#111827", fontSize: "24px", fontWeight: 800, letterSpacing: "-0.5px" }}>
                Process Payroll
              </h3>
              <p style={{ color: "#6B7280", fontSize: "15px", marginTop: "4px" }}>
                You are about to run the payroll for <span style={{ color: "#111827", fontWeight: 700 }}>{month}</span>.
              </p>

              <div
                className="mt-8 rounded-3xl p-6"
                style={{ backgroundColor: "#F9FAFB", border: "1px solid #E5E7EB" }}
              >
                <div className="flex items-center justify-between mb-4 pb-4" style={{ borderBottom: "1px solid #E5E7EB" }}>
                  <span style={{ color: "#6B7280", fontSize: "14px" }}>Total Employees</span>
                  <span style={{ color: "#111827", fontSize: "15px", fontWeight: 700 }}>{payrollEmployees.length}</span>
                </div>
                <div className="flex items-center justify-between mb-4 pb-4" style={{ borderBottom: "1px solid #E5E7EB" }}>
                  <span style={{ color: "#6B7280", fontSize: "14px" }}>Gross Payout</span>
                  <span style={{ color: "#111827", fontSize: "15px", fontWeight: 700 }}>
                    ₹{payrollEmployees.reduce((s, e) => s + e.gross, 0).toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span style={{ color: "#6B7280", fontSize: "14px" }}>Net Disbursement</span>
                  <span style={{ color: "#10B981", fontSize: "22px", fontWeight: 900 }}>
                    ₹{totalNet.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="mt-8 flex items-start gap-3 p-5 rounded-2xl" style={{ backgroundColor: "#FFFBEB", border: "1px solid #FEF3C7" }}>
                <AlertCircle size={20} color="#D97706" className="shrink-0" />
                <p style={{ color: "#92400E", fontSize: "13px", lineHeight: "1.6" }}>
                  Disbursement will be initiated immediately. Please ensure all tax deductions and bonuses are reviewed before confirming.
                </p>
              </div>
            </div>

            <div className="px-8 py-6 flex gap-4" style={{ borderTop: "1px solid #F3F4F6", background: "white" }}>
              <button
                onClick={onClose}
                className="flex-1 py-4 rounded-2xl text-sm font-bold transition-all hover:bg-[#ECFDF5]"
                style={{ backgroundColor: "#F0FDF4", color: "#059669", border: "none" }}
              >
                Cancel
              </button>
              <button
                onClick={() => setStep("processing")}
                className="flex-1 py-4 rounded-2xl text-sm font-bold text-white transition-all hover:opacity-90 shadow-lg"
                style={{ background: "#10B981", boxShadow: "0 6px 20px rgba(16, 185, 129, 0.25)", border: "none" }}
              >
                Confirm & Disburse
              </button>
            </div>
          </>
        )}

        {step === "processing" && (
          <div className="p-12 flex flex-col items-center justify-center text-center">
            <div className="relative mb-8">
              <div className="w-20 h-20 rounded-full border-4 border-[var(--secondary)] flex items-center justify-center">
                <Loader2 size={40} color="var(--primary)" className="animate-spin" />
              </div>
            </div>
            <h3 style={{ color: "var(--foreground)", fontSize: "20px", fontWeight: 800 }}>Processing Payroll...</h3>
            <p style={{ color: "var(--muted-foreground)", fontSize: "14px", marginTop: "8px", maxWidth: "240px" }}>
              Securely calculating disbursements and initiating bank transfers.
            </p>
          </div>
        )}

        {step === "success" && (
          <div className="p-12 flex flex-col items-center justify-center text-center scale-up">
            <div
              className="w-20 h-20 rounded-full mb-8 flex items-center justify-center"
              style={{ backgroundColor: "var(--secondary)" }}
            >
              <CheckCircle2 size={48} color="var(--primary)" />
            </div>
            <h3 style={{ color: "var(--foreground)", fontSize: "24px", fontWeight: 900, letterSpacing: "-0.5px" }}>
              Success!
            </h3>
            <p style={{ color: "var(--muted-foreground)", fontSize: "15px", marginTop: "8px" }}>
              Payroll for <span style={{ color: "var(--foreground)", fontWeight: 700 }}>{month}</span> has been processed successfully.
            </p>
            <button
              onClick={onClose}
              className="mt-10 w-full py-4 rounded-2xl text-sm font-bold text-white transition-all shadow-xl"
              style={{ background: "var(--primary)" }}
            >
              Back to Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export function Payroll() {
  const [selectedMonth, setSelectedMonth] = useState("April 2026");
  const [showMonthDropdown, setShowMonthDropdown] = useState(false);
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  const [showRunModal, setShowRunModal] = useState(false);

  const totalGross = payrollEmployees.reduce((s, e) => s + e.gross, 0);
  const totalDeductions = payrollEmployees.reduce((s, e) => s + e.deductions, 0);
  const totalNet = payrollEmployees.reduce((s, e) => s + e.net, 0);

  return (
    <div style={{ maxWidth: "1360px" }}>
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-6">
        {/* Month Selector */}
        <div className="relative">
          <button
            onClick={() => setShowMonthDropdown(!showMonthDropdown)}
            className="flex items-center gap-3 rounded-xl px-4 py-2.5 transition-colors shadow-sm"
            style={{
              backgroundColor: "var(--card)",
              border: "1px solid var(--border)",
              color: "var(--foreground)",
              fontSize: "14px",
              fontWeight: 700,
            }}
          >
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: "var(--primary)" }}
            />
            {selectedMonth}
            <ChevronDown
              size={14}
              color="var(--muted-foreground)"
              style={{ transform: showMonthDropdown ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}
            />
          </button>
          {showMonthDropdown && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowMonthDropdown(false)} />
              <div
                className="absolute top-full left-0 mt-1 rounded-xl overflow-hidden z-20 shadow-xl"
                style={{
                  minWidth: "180px",
                  backgroundColor: "var(--card)",
                  border: "1px solid var(--border)",
                }}
              >
                {months.map((m) => (
                  <button
                    key={m}
                    onClick={() => { setSelectedMonth(m); setShowMonthDropdown(false); }}
                    className="w-full px-4 py-2.5 text-left transition-colors"
                    style={{
                      fontSize: "13px",
                      color: selectedMonth === m ? "var(--primary)" : "var(--foreground)",
                      backgroundColor: selectedMonth === m ? "var(--secondary)" : "transparent",
                      fontWeight: selectedMonth === m ? 700 : 400,
                      border: "none",
                      cursor: "pointer"
                    }}
                    onMouseEnter={(e) => {
                      if (selectedMonth !== m)
                        (e.currentTarget as HTMLButtonElement).style.backgroundColor = "var(--background)";
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
          onClick={() => setShowRunModal(true)}
          className="flex items-center gap-2.5 rounded-xl px-6 py-2.5 transition-all hover:opacity-90 active:scale-95 shadow-lg shadow-emerald-500/20"
          style={{
            background: "linear-gradient(135deg, #059669, #047857)",
            color: "white",
            fontSize: "14px",
            fontWeight: 700,
            border: "none",
            cursor: "pointer",
          }}
        >
          <Play size={15} fill="white" />
          Run Payroll
        </button>
      </div>

      <div className="grid grid-cols-3 gap-5 mb-6">
        {[
          {
            label: "Total Gross Salary",
            value: `₹${totalGross.toLocaleString()}`,
            sub: `${payrollEmployees.length} employees`,
            color: "var(--primary)",
            bg: "var(--secondary)",
            border: "var(--border)",
            icon: "💰",
          },
          {
            label: "Total Deductions",
            value: `₹${totalDeductions.toLocaleString()}`,
            sub: "Tax, PF & Insurance",
            color: "#EF4444",
            bg: "rgba(239, 68, 68, 0.1)",
            border: "rgba(239, 68, 68, 0.2)",
            icon: "📉",
          },
          {
            label: "Net Payout",
            value: `₹${totalNet.toLocaleString()}`,
            sub: "After all deductions",
            color: "#22C55E",
            bg: "rgba(34, 197, 94, 0.1)",
            border: "rgba(34, 197, 94, 0.2)",
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
                <p style={{ color: "var(--muted-foreground)", fontSize: "12px", fontWeight: 500, marginBottom: "6px" }}>
                  {card.label}
                </p>
                <p style={{ color: card.color, fontSize: "28px", fontWeight: 800, letterSpacing: "-0.5px" }}>
                  {card.value}
                </p>
                <p style={{ color: "var(--muted-foreground)", fontSize: "12px", marginTop: "4px" }}>{card.sub}</p>
              </div>
              <span style={{ fontSize: "28px" }}>{card.icon}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Payroll Table */}
      <div
        className="rounded-2xl overflow-hidden shadow-sm"
        style={{
          backgroundColor: "var(--card)",
          border: "1px solid var(--border)",
        }}
      >
        <div
          className="px-6 py-4 flex items-center justify-between"
          style={{ borderBottom: "1px solid var(--border)" }}
        >
          <div>
            <h3 style={{ color: "var(--foreground)", fontSize: "15px", fontWeight: 700 }}>
              Payroll Details — {selectedMonth}
            </h3>
            <p style={{ color: "var(--muted-foreground)", fontSize: "12px", marginTop: "2px" }}>
              {payrollEmployees.filter((e) => e.status === "Paid").length} paid ·{" "}
              {payrollEmployees.filter((e) => e.status === "Pending").length} pending
            </p>
          </div>
          <button
            onClick={() => {
              const headers = ["Name", "Designation", "Department", "Gross", "Deductions", "Net Pay", "Status"];
              const rows = payrollEmployees.map(e => [e.name, e.designation, e.department, e.gross, e.deductions, e.net, e.status]);
              const csv = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
              const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = `payroll_${selectedMonth.replace(" ", "_").toLowerCase()}.csv`;
              a.click();
              URL.revokeObjectURL(url);
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl transition-colors"
            style={{
              border: "1px solid var(--border)",
              color: "var(--foreground)",
              fontSize: "13px",
              fontWeight: 600,
              backgroundColor: "var(--background)",
              cursor: "pointer"
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = "var(--secondary)";
              (e.currentTarget as HTMLButtonElement).style.color = "var(--primary)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = "var(--background)";
              (e.currentTarget as HTMLButtonElement).style.color = "var(--foreground)";
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
            backgroundColor: "var(--secondary)",
            borderBottom: "1px solid var(--border)",
            gridTemplateColumns: "2.5fr 1.2fr 1fr 1fr 1fr 1fr 1fr",
          }}
        >
          {["Employee", "Department", "Gross", "Deductions", "Net Pay", "Status", "Payslip"].map((col) => (
            <span
              key={col}
              style={{
                color: "var(--foreground)",
                opacity: 0.8,
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
              borderBottom: i < payrollEmployees.length - 1 ? "1px solid var(--border)" : "none",
              backgroundColor:
                hoveredRow === emp.id ? "var(--secondary)" : i % 2 === 0 ? "var(--card)" : "var(--background)",
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
                style={{ width: "36px", height: "36px", border: "2px solid var(--border)" }}
              />
              <div>
                <p style={{ color: "var(--foreground)", fontSize: "13px", fontWeight: 600 }}>{emp.name}</p>
                <p style={{ color: "var(--muted-foreground)", fontSize: "11px" }}>{emp.designation}</p>
              </div>
            </div>

            {/* Department */}
            <span style={{ color: "var(--foreground)", fontSize: "13px", opacity: 0.9 }}>{emp.department}</span>

            {/* Gross */}
            <span style={{ color: "var(--foreground)", fontSize: "13px", fontWeight: 600 }}>
              ₹{emp.gross.toLocaleString()}
            </span>

            {/* Deductions */}
            <span style={{ color: "#EF4444", fontSize: "13px", fontWeight: 500 }}>
              -₹{emp.deductions.toLocaleString()}
            </span>

            {/* Net Pay */}
            <span style={{ color: "#10B981", fontSize: "13px", fontWeight: 700 }}>
              ₹{emp.net.toLocaleString()}
            </span>

            {/* Status */}
            <span
              className="px-2.5 py-1 rounded-full"
              style={{
                backgroundColor: emp.status === "Paid" ? "rgba(16, 185, 129, 0.1)" : "rgba(245, 158, 11, 0.1)",
                color: emp.status === "Paid" ? "#10B981" : "#F59E0B",
                fontSize: "11px",
                fontWeight: 700,
                width: "fit-content",
              }}
            >
              {emp.status === "Paid" ? "✓ Paid" : "⏳ Pending"}
            </span>

            {/* Download Payslip */}
            <button
              onClick={() => {
                const w = window.open("", "_blank");
                if (!w) return;
                w.document.write(`
                  <html><head><title>Payslip - ${emp.name}</title>
                  <style>
                    body{font-family:system-ui,sans-serif;padding:40px;color:#1a1a1a;max-width:600px;margin:0 auto}
                    .header{display:flex;justify-content:space-between;align-items:center;border-bottom:3px solid #059669;padding-bottom:16px;margin-bottom:24px}
                    .logo{color:#059669;font-size:22px;font-weight:900}
                    .month{color:#6b7280;font-size:13px}
                    .emp{margin-bottom:24px}
                    .emp h2{margin:0;font-size:18px}
                    .emp p{color:#6b7280;margin:2px 0;font-size:13px}
                    table{width:100%;border-collapse:collapse;margin-bottom:24px}
                    th{text-align:left;padding:10px;background:#f0fdf4;color:#059669;font-size:11px;text-transform:uppercase;letter-spacing:0.5px}
                    td{padding:10px;border-bottom:1px solid #e5e7eb;font-size:13px}
                    .total td{font-weight:800;border-top:2px solid #059669;border-bottom:none}
                    .net{color:#059669;font-size:18px;font-weight:900}
                    .badge{display:inline-block;padding:4px 12px;border-radius:20px;font-size:11px;font-weight:700}
                    .paid{background:#ecfdf5;color:#059669}
                    .pending{background:#fffbeb;color:#f59e0b}
                    .footer{margin-top:32px;padding-top:16px;border-top:1px solid #e5e7eb;color:#9ca3af;font-size:11px;text-align:center}
                  </style></head><body>
                  <div class="header"><span class="logo">EMS</span><span class="month">${selectedMonth}</span></div>
                  <div class="emp"><h2>${emp.name}</h2><p>${emp.designation}</p><p>${emp.department}</p></div>
                  <table>
                    <tr><th>Component</th><th style="text-align:right">Amount</th></tr>
                    <tr><td>Basic Salary</td><td style="text-align:right">₹${Math.round(emp.gross * 0.6).toLocaleString()}</td></tr>
                    <tr><td>HRA</td><td style="text-align:right">₹${Math.round(emp.gross * 0.2).toLocaleString()}</td></tr>
                    <tr><td>Other Allowances</td><td style="text-align:right">₹${Math.round(emp.gross * 0.2).toLocaleString()}</td></tr>
                    <tr><td><strong>Gross Salary</strong></td><td style="text-align:right"><strong>₹${emp.gross.toLocaleString()}</strong></td></tr>
                    <tr><td style="color:#ef4444">Tax Deduction</td><td style="text-align:right;color:#ef4444">-₹${Math.round(emp.deductions * 0.5).toLocaleString()}</td></tr>
                    <tr><td style="color:#ef4444">PF Contribution</td><td style="text-align:right;color:#ef4444">-₹${Math.round(emp.deductions * 0.3).toLocaleString()}</td></tr>
                    <tr><td style="color:#ef4444">Insurance</td><td style="text-align:right;color:#ef4444">-₹${Math.round(emp.deductions * 0.2).toLocaleString()}</td></tr>
                    <tr class="total"><td>Net Pay</td><td style="text-align:right" class="net">₹${emp.net.toLocaleString()}</td></tr>
                  </table>
                  <p>Status: <span class="badge ${emp.status === "Paid" ? "paid" : "pending"}">${emp.status === "Paid" ? "✓ Paid" : "⏳ Pending"}</span></p>
                  <div class="footer">This is a system-generated payslip. For queries, contact HR.</div>
                  </body></html>
                `);
                w.document.close();
                w.print();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors"
              style={{
                border: "1px solid var(--border)",
                color: "var(--foreground)",
                fontSize: "11px",
                fontWeight: 600,
                backgroundColor: "var(--card)",
                width: "fit-content",
                cursor: "pointer"
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = "var(--secondary)";
                (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--primary)";
                (e.currentTarget as HTMLButtonElement).style.color = "var(--primary)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = "var(--card)";
                (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border)";
                (e.currentTarget as HTMLButtonElement).style.color = "var(--foreground)";
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
            borderTop: "2px solid var(--border)",
            backgroundColor: "var(--secondary)",
          }}
        >
          <span style={{ color: "var(--foreground)", fontSize: "13px", fontWeight: 700 }}>
            Total ({payrollEmployees.length} employees)
          </span>
          <span />
          <span style={{ color: "var(--foreground)", fontSize: "13px", fontWeight: 800 }}>
            ₹{totalGross.toLocaleString()}
          </span>
          <span style={{ color: "#EF4444", fontSize: "13px", fontWeight: 700 }}>
            -₹{totalDeductions.toLocaleString()}
          </span>
          <span style={{ color: "#10B981", fontSize: "13px", fontWeight: 800 }}>
            ₹{totalNet.toLocaleString()}
          </span>
          <span />
          <span />
        </div>
      </div>

      {showRunModal && <RunPayrollModal onClose={() => setShowRunModal(false)} month={selectedMonth} />}
    </div>
  );
}
