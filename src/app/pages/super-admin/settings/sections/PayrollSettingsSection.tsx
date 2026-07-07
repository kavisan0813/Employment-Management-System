import { useSettingsContext, type SalaryComponent } from "../SettingsContext";
import {
  FolderTree,
  ChevronRight,
  Calendar,
  DollarSign,
  ArrowRight,
} from "lucide-react";

export function PayrollSettingsSection() {
  const {
    SectionTitle,
    handleResetPayroll,
    payrollCutoff,
    payrollCycle,
    payrollPayout,
    prAutoEmail,
    prComponentsCount,
    prEsiRate,
    prGrossStructure,
    prHalfDayCalc,
    prLastUpdatedBy,
    prLastUpdatedTime,
    prLopEnabled,
    prNextRun,
    prOtPay,
    prPayslipLogo,
    prPayslipTemplate,
    prPfRate,
    prTaxMode,
    salaryComponentsList,
    setActiveModal,
  } = useSettingsContext();

  return (
    <div>
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-4 text-[12px] font-medium">
        <span style={{ color: "var(--muted-foreground)" }}>Settings</span>
        <ChevronRight size={12} style={{ color: "var(--muted-foreground)" }} />
        <span style={{ color: "#00B87C" }}>Payroll Settings</span>
      </div>

      {/* Content Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2
            style={{
              fontSize: "18px",
              fontWeight: 700,
              color: "var(--foreground)",
              margin: 0,
            }}
          >
            Payroll Configuration
          </h2>
          <p
            style={{
              fontSize: "13px",
              color: "var(--muted-foreground)",
              marginTop: "2px",
            }}
          >
            Version 3.1 • Last saved {prLastUpdatedTime} by {prLastUpdatedBy}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleResetPayroll}
            style={{
              backgroundColor: "transparent",
              border: "1px solid var(--border)",
              borderRadius: "10px",
              padding: "8px 16px",
              fontSize: "13px",
              fontWeight: 600,
              color: "var(--foreground)",
              cursor: "pointer",
            }}
          >
            Reset to Default
          </button>
          <button
            onClick={() => setActiveModal("edit_payroll")}
            style={{
              backgroundColor: "#00B87C",
              color: "white",
              border: "none",
              borderRadius: "10px",
              padding: "8px 16px",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Edit Settings
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          {
            label: "Payroll Cycle",
            value: payrollCycle,
            icon: <Calendar size={20} />,
            color: "#00B87C",
            bg: "rgba(0, 184, 124, 0.1)",
          },
          {
            label: "Default Gross Structure",
            value: prGrossStructure,
            icon: <DollarSign size={20} />,
            color: "#0EA5E9",
            bg: "rgba(14, 165, 233, 0.1)",
          },
          {
            label: "Active Salary Components",
            value: `${prComponentsCount} Earnings + 5 Deductions`,
            icon: <FolderTree size={20} />,
            color: "#F59E0B",
            bg: "rgba(245, 158, 11, 0.1)",
          },
          {
            label: "Next Payroll Run",
            value: prNextRun,
            icon: <ArrowRight size={20} />,
            color: "#8B5CF6",
            bg: "rgba(139, 92, 246, 0.1)",
          },
        ].map((card, idx) => (
          <div
            key={idx}
            className="p-4 rounded-2xl flex items-center justify-between shadow-sm"
            style={{
              backgroundColor: "var(--card)",
              border: "1px solid var(--border)",
            }}
          >
            <div>
              <p
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  color: "var(--muted-foreground)",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  margin: 0,
                }}
              >
                {card.label}
              </p>
              <p
                style={{
                  fontSize: "16px",
                  fontWeight: 800,
                  color: "var(--foreground)",
                  marginTop: "4px",
                  marginBottom: 0,
                }}
              >
                {card.value}
              </p>
            </div>
            <div
              style={{
                padding: "10px",
                borderRadius: "12px",
                backgroundColor: card.bg,
                color: card.color,
              }}
            >
              {card.icon}
            </div>
          </div>
        ))}
      </div>

      {/* SECTION 1: SALARY COMPONENTS */}
      <SectionTitle title="1. Salary Components" />
      <div className="overflow-x-auto rounded-2xl border border-[var(--border)] shadow-sm mb-6">
        <table className="w-full border-collapse" style={{ minWidth: "800px" }}>
          <thead>
            <tr
              style={{
                borderBottom: "1px solid var(--border)",
                textAlign: "left",
                backgroundColor: "var(--muted)",
              }}
            >
              {[
                "COMPONENT NAME",
                "TYPE",
                "CALCULATION TYPE",
                "VALUE / AMOUNT",
                "TAXABLE",
              ].map((h) => (
                <th
                  key={h}
                  style={{
                    padding: "12px 16px",
                    fontSize: "10px",
                    fontWeight: 700,
                    color: "var(--muted-foreground)",
                    letterSpacing: "0.5px",
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {salaryComponentsList.map((c: SalaryComponent, idx: number) => (
              <tr
                key={idx}
                style={{
                  borderBottom: "1px solid #F3F4F6",
                  height: "56px",
                }}
                className="hover:bg-[#00B87C]/[0.08] transition-all"
              >
                <td
                  style={{
                    padding: "12px 16px",
                    fontSize: "14px",
                    fontWeight: 700,
                    color: "var(--foreground)",
                  }}
                >
                  {c.name}
                </td>
                <td style={{ padding: "12px 16px" }}>
                  <span
                    style={{
                      backgroundColor:
                        c.type === "Earning"
                          ? "rgba(0, 184, 124, 0.1)"
                          : "rgba(245, 158, 11, 0.1)",
                      color: c.type === "Earning" ? "#00B87C" : "#F59E0B",
                      padding: "4px 10px",
                      borderRadius: "12px",
                      fontSize: "11px",
                      fontWeight: 700,
                    }}
                  >
                    {c.type}
                  </span>
                </td>
                <td
                  style={{
                    padding: "12px 16px",
                    fontSize: "13px",
                    color: "var(--muted-foreground)",
                  }}
                >
                  {c.amountType}
                </td>
                <td
                  style={{
                    padding: "12px 16px",
                    fontSize: "13px",
                    color: "var(--foreground)",
                    fontWeight: 600,
                  }}
                >
                  {c.value}
                </td>
                <td style={{ padding: "12px 16px" }}>
                  <span
                    style={{
                      backgroundColor: c.taxable
                        ? "rgba(239, 68, 68, 0.1)"
                        : "rgba(107, 114, 128, 0.1)",
                      color: c.taxable ? "#EF4444" : "#6B7280",
                      padding: "2px 8px",
                      borderRadius: "6px",
                      fontSize: "11px",
                      fontWeight: 600,
                    }}
                  >
                    {c.taxable ? "Taxable" : "Exempt"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* SECTION 3: PAYROLL CYCLE */}
        <div
          className="p-6 rounded-2xl border"
          style={{
            backgroundColor: "var(--card)",
            borderColor: "var(--border)",
          }}
        >
          <SectionTitle title="3. Payroll Cycle Rules" />
          <div
            className="mt-4 space-y-3 text-sm"
            style={{ color: "var(--foreground)" }}
          >
            <div className="flex justify-between">
              <span>Pay Frequency</span>
              <span className="font-bold">{payrollCycle}</span>
            </div>
            <div className="flex justify-between">
              <span>Cutoff Date</span>
              <span className="font-bold">{payrollCutoff}th of month</span>
            </div>
            <div className="flex justify-between">
              <span>Payout Date</span>
              <span className="font-bold">{payrollPayout} of next month</span>
            </div>
          </div>
        </div>

        {/* SECTION 4: ATTENDANCE RULES */}
        <div
          className="p-6 rounded-2xl border"
          style={{
            backgroundColor: "var(--card)",
            borderColor: "var(--border)",
          }}
        >
          <SectionTitle title="4. Attendance Rules" />
          <div
            className="mt-4 space-y-3 text-sm"
            style={{ color: "var(--foreground)" }}
          >
            <div className="flex justify-between">
              <span>LOP Deduction</span>
              <span className="font-bold">
                {prLopEnabled ? "Enabled" : "Disabled"}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Overtime Pay</span>
              <span className="font-bold">
                {prOtPay ? "Enabled" : "Disabled"}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Half-day trigger</span>
              <span className="font-bold">{prHalfDayCalc}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* SECTION 5: PAYSLIP SETTINGS */}
        <div
          className="p-6 rounded-2xl border"
          style={{
            backgroundColor: "var(--card)",
            borderColor: "var(--border)",
          }}
        >
          <SectionTitle title="5. Payslip Settings" />
          <div
            className="mt-4 space-y-3 text-sm"
            style={{ color: "var(--foreground)" }}
          >
            <div className="flex justify-between">
              <span>Payslip Template</span>
              <span className="font-bold">{prPayslipTemplate}</span>
            </div>
            <div className="flex justify-between">
              <span>Auto Email to Staff</span>
              <span className="font-bold">{prAutoEmail ? "Yes" : "No"}</span>
            </div>
            <div className="flex justify-between">
              <span>Company Logo on Slip</span>
              <span className="font-bold">{prPayslipLogo ? "Yes" : "No"}</span>
            </div>
          </div>
        </div>

        {/* SECTION 6: COMPLIANCE */}
        <div
          className="p-6 rounded-2xl border"
          style={{
            backgroundColor: "var(--card)",
            borderColor: "var(--border)",
          }}
        >
          <SectionTitle title="6. Compliance" />
          <div
            className="mt-4 space-y-3 text-sm"
            style={{ color: "var(--foreground)" }}
          >
            <div className="flex justify-between">
              <span>PF Contribution</span>
              <span className="font-bold">{prPfRate}</span>
            </div>
            <div className="flex justify-between">
              <span>ESI Contribution</span>
              <span className="font-bold">{prEsiRate}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax Calculation Mode</span>
              <span className="font-bold">{prTaxMode}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
