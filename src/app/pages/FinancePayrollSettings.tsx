import { useState } from "react";
import { Settings, Plus, ChevronDown } from "lucide-react";

type NavItem = {
  id: string;
  label: string;
  section: "PAYROLL" | "STATUTORY" | "PROCESSING";
};

const NAV_ITEMS: NavItem[] = [
  { id: "pay-cycle", label: "Pay Cycle", section: "PAYROLL" },
  { id: "salary-components", label: "Salary Components", section: "PAYROLL" },
  { id: "bands-grades", label: "Salary Bands & Grades", section: "PAYROLL" },
  { id: "pf", label: "Provident Fund (PF)", section: "STATUTORY" },
  { id: "tds", label: "Tax (TDS) Settings", section: "STATUTORY" },
  { id: "prof-tax", label: "Professional Tax", section: "STATUTORY" },
  { id: "esi", label: "ESI Settings", section: "STATUTORY" },
  { id: "gratuity", label: "Gratuity", section: "STATUTORY" },
  { id: "calendar", label: "Payroll Calendar", section: "PROCESSING" },
  { id: "bank", label: "Bank Integration", section: "PROCESSING" },
  { id: "payslip", label: "Payslip Template", section: "PROCESSING" },
];

export function FinancePayrollSettings() {
  const [activeTab, setActiveTab] = useState("pay-cycle");
  const [toggles, setToggles] = useState({
    tds: true,
    pf: true,
    profTax: true,
    esi: false,
    gratuity: true,
    labourFund: false,
  });

  const toggleSwitch = (key: keyof typeof toggles) => {
    setToggles((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="w-full px-4 md:px-8 py-6 pb-24 space-y-6 animate-in fade-in duration-500">
      {/* PAGE HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-[10px] bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
            <Settings size={22} className="text-emerald-600" />
          </div>
          <div>
            <h1 className="text-[26px] font-bold text-foreground tracking-tight">
              Payroll Settings
            </h1>
            <p className="text-[13px] text-[#6B7280]">
              Configure pay cycles, components, and statutory compliance
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-6 items-start">
        {/* LEFT SUB-NAV */}
        <aside className="bg-card border border-border rounded-2xl p-2 shadow-sm space-y-4">
          <NavSection
            title="PAYROLL"
            items={NAV_ITEMS.filter((i) => i.section === "PAYROLL")}
            activeId={activeTab}
            onSelect={setActiveTab}
          />
          <NavSection
            title="STATUTORY"
            items={NAV_ITEMS.filter((i) => i.section === "STATUTORY")}
            activeId={activeTab}
            onSelect={setActiveTab}
          />
          <NavSection
            title="PROCESSING"
            items={NAV_ITEMS.filter((i) => i.section === "PROCESSING")}
            activeId={activeTab}
            onSelect={setActiveTab}
          />
        </aside>

        {/* CONTENT AREA */}
        <div className="space-y-6">
          {/* PAY CYCLE CONFIGURATION */}
          <section className="bg-card border border-border rounded-[32px] overflow-hidden shadow-sm">
            <div className="px-6 py-4 bg-emerald-500/5 border-b border-border flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <h2 className="text-[11px] font-black text-emerald-700 uppercase tracking-widest">
                Pay Cycle Configuration
              </h2>
            </div>

            <div className="p-8 space-y-8">
              <div className="bg-[#F0FDF4] dark:bg-emerald-500/5 rounded-2xl p-6 border border-emerald-500/10 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                <Field label="Pay Frequency" value="Monthly" type="select" />
                <Field label="Pay Day" value="28" type="number" />
                <Field label="Payroll Lock Date" value="20" type="number" />
                <Field label="Currency" value="INR (₹)" type="select" />
                <Field
                  label="Pay Slip Generation"
                  value="Auto on Pay Day"
                  type="select"
                />
                <Field
                  label="Bank Transfer Mode"
                  value="NEFT/RTGS"
                  type="select"
                />
              </div>
            </div>
          </section>

          {/* SALARY COMPONENTS */}
          <section className="bg-card border border-border rounded-[32px] overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <h2 className="text-[11px] font-black text-muted-foreground uppercase tracking-widest">
                  Salary Components
                </h2>
              </div>
              <button className="text-[11px] font-black text-emerald-600 uppercase tracking-widest flex items-center gap-1.5 hover:underline transition-all">
                <Plus size={14} /> Add Component
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-muted/30 border-b border-border">
                  <tr>
                    <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-wider text-[#94A3B8]">
                      Component
                    </th>
                    <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-wider text-[#94A3B8]">
                      Type
                    </th>
                    <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-wider text-[#94A3B8]">
                      Calculation
                    </th>
                    <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-wider text-[#94A3B8]">
                      Taxable
                    </th>
                    <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-wider text-[#94A3B8] text-center">
                      PF Applicable
                    </th>
                    <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-wider text-[#94A3B8] text-right">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <ComponentRow
                    name="Basic Salary"
                    type="Fixed"
                    calc="50% of CTC"
                    taxable="Yes"
                    pf="Yes"
                  />
                  <ComponentRow
                    name="HRA"
                    type="Fixed"
                    calc="40% of Basic"
                    taxable="Partial"
                    pf="No"
                  />
                  <ComponentRow
                    name="Conveyance"
                    type="Fixed"
                    calc="₹1,600/month"
                    taxable="No"
                    pf="No"
                  />
                  <ComponentRow
                    name="Medical Allowance"
                    type="Fixed"
                    calc="₹1,250/month"
                    taxable="Partial"
                    pf="No"
                  />
                  <ComponentRow
                    name="Performance Bonus"
                    type="Variable"
                    calc="% of Basic"
                    taxable="Yes"
                    pf="No"
                  />
                  <ComponentRow
                    name="Special Allowance"
                    type="Variable"
                    calc="Balance of CTC"
                    taxable="Yes"
                    pf="No"
                  />
                </tbody>
              </table>
            </div>
          </section>

          {/* STATUTORY DEDUCTIONS */}
          <section className="bg-card border border-border rounded-[32px] overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-border flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <h2 className="text-[11px] font-black text-muted-foreground uppercase tracking-widest">
                Statutory Deductions
              </h2>
            </div>
            <div className="p-4 divide-y divide-border">
              <ToggleRow
                label="Auto-calculate TDS"
                desc="Based on investment declaration and tax slabs"
                enabled={toggles.tds}
                onToggle={() => toggleSwitch("tds")}
              />
              <ToggleRow
                label="Provident Fund (PF)"
                desc="12% Employee + 12% Employer contribution"
                enabled={toggles.pf}
                onToggle={() => toggleSwitch("pf")}
              />
              <ToggleRow
                label="Professional Tax"
                desc="State-wise monthly deduction based on income"
                enabled={toggles.profTax}
                onToggle={() => toggleSwitch("profTax")}
              />
              <ToggleRow
                label="ESI (Employee State Insurance)"
                desc="Mandatory for employees with gross monthly < ₹21,000"
                enabled={toggles.esi}
                onToggle={() => toggleSwitch("esi")}
              />
              <ToggleRow
                label="Gratuity Provisioning"
                desc="Accrue gratuity liability monthly for eligible staff"
                enabled={toggles.gratuity}
                onToggle={() => toggleSwitch("gratuity")}
              />
              <ToggleRow
                label="Labour Welfare Fund"
                desc="Half-yearly statutory contribution"
                enabled={toggles.labourFund}
                onToggle={() => toggleSwitch("labourFund")}
              />
            </div>
          </section>

          {/* SAVE BAR */}
          <div className="flex items-center justify-between bg-card border border-border p-4 rounded-2xl shadow-sm">
            <button className="px-6 py-3 text-xs font-black text-muted-foreground hover:text-foreground uppercase tracking-widest transition-all">
              Reset to Defaults
            </button>
            <button className="px-8 py-3 bg-[#00B87C] text-white text-xs font-black uppercase tracking-[2px] rounded-xl hover:shadow-[0_8px_20px_rgba(0,184,124,0.3)] hover:-translate-y-0.5 transition-all active:scale-95 shadow-lg shadow-emerald-500/20">
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── COMPONENTS ────────────────────────── */

function NavSection({
  title,
  items,
  activeId,
  onSelect,
}: {
  title: string;
  items: NavItem[];
  activeId: string;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="space-y-1">
      <p className="px-4 py-2 text-[11px] font-semibold text-muted-foreground uppercase tracking-widest opacity-60">
        {title}
      </p>
      {items.map((item) => (
        <button
          key={item.id}
          onClick={() => onSelect(item.id)}
          className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-[13px] font-bold transition-all ${
            activeId === item.id
              ? "bg-emerald-500/10 text-emerald-600"
              : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
          }`}
        >
          {item.label}
          {activeId === item.id && (
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
          )}
        </button>
      ))}
    </div>
  );
}

function Field({
  label,
  value,
  type,
}: {
  label: string;
  value: string;
  type: "select" | "number";
}) {
  return (
    <div className="space-y-2 group">
      <label className="text-[11px] font-black text-muted-foreground uppercase tracking-widest group-focus-within:text-emerald-600 transition-colors">
        {label}
      </label>
      <div className="relative">
        <input
          type={type === "number" ? "number" : "text"}
          defaultValue={value}
          readOnly={type === "select"}
          className="w-full bg-card border border-border group-focus-within:border-emerald-500/50 rounded-xl px-4 py-3 text-sm font-bold text-foreground outline-none transition-all shadow-sm group-focus-within:ring-4 group-focus-within:ring-emerald-500/5 cursor-pointer"
        />
        {type === "select" && (
          <ChevronDown
            size={14}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
        )}
      </div>
    </div>
  );
}

function ComponentRow({
  name,
  type,
  calc,
  taxable,
  pf,
}: {
  name: string;
  type: "Fixed" | "Variable";
  calc: string;
  taxable: string;
  pf: string;
}) {
  return (
    <tr className="hover:bg-muted/10 transition-colors group">
      <td className="px-6 py-4 text-sm font-black text-foreground">{name}</td>
      <td className="px-6 py-4">
        <span
          className={`px-2 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-widest border ${
            type === "Fixed"
              ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600"
              : "bg-purple-500/10 border-purple-500/20 text-purple-600"
          }`}
        >
          {type}
        </span>
      </td>
      <td className="px-6 py-4 text-sm font-bold text-muted-foreground">
        {calc}
      </td>
      <td className="px-6 py-4">
        <span
          className={`text-[11px] font-bold uppercase tracking-widest ${
            taxable === "Yes"
              ? "text-red-500"
              : taxable === "No"
                ? "text-slate-400"
                : "text-amber-500"
          }`}
        >
          {taxable}
        </span>
      </td>
      <td className="px-6 py-4 text-center">
        <span
          className={`text-[11px] font-bold uppercase tracking-widest ${
            pf === "Yes" ? "text-emerald-500" : "text-slate-400 opacity-60"
          }`}
        >
          {pf}
        </span>
      </td>
      <td className="px-6 py-4 text-right">
        <button className="text-[11px] font-black text-emerald-600 uppercase tracking-widest hover:underline">
          Edit
        </button>
      </td>
    </tr>
  );
}

function ToggleRow({
  label,
  desc,
  enabled,
  onToggle,
}: {
  label: string;
  desc: string;
  enabled: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex items-center justify-between py-5 group">
      <div>
        <p className="text-[14px] font-black text-foreground tracking-tight group-hover:text-emerald-600 transition-colors">
          {label}
        </p>
        <p className="text-[12px] font-medium text-muted-foreground opacity-80">
          {desc}
        </p>
      </div>
      <button
        onClick={onToggle}
        className={`w-12 h-6 rounded-full transition-all duration-300 flex items-center px-1 ${
          enabled
            ? "bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.3)]"
            : "bg-slate-200 dark:bg-slate-800"
        }`}
      >
        <div
          className={`w-4 h-4 rounded-full bg-white shadow-md transition-all duration-300 ${
            enabled ? "translate-x-6" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}
