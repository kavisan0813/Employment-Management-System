import React from "react";
import { useSettingsContext } from "../SettingsContext";
import {
  ChevronRight,
  Calendar,
} from "lucide-react";

export function LanguageRegionSection() {
  const {
    appDateFormat,
    appLanguage,
    appTimezone,
    country,
    currency,
    extraConfig,
    setAppDateFormat,
    setAppLanguage,
    setAppTimezone,
    setCountry,
    showToast,
    updateExtraConfig,
  } = useSettingsContext();

  return (
    <div>
      <div className="flex items-center gap-2 mb-4 text-[12px] font-medium">
        <span style={{ color: "#9CA3AF" }}>Settings</span>
        <ChevronRight size={12} style={{ color: "#9CA3AF" }} />
        <span style={{ color: "#9CA3AF" }}>System Preferences</span>
        <ChevronRight size={12} style={{ color: "#9CA3AF" }} />
        <span style={{ color: "#00B87C", fontWeight: 700 }}>
          Language & Region
        </span>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h2
          style={{
            fontSize: "18px",
            fontWeight: 700,
            color: "#111827",
            margin: 0,
          }}
        >
          Language & Region
        </h2>
        <button
          onClick={() => showToast("Locale preferences saved")}
          style={{
            backgroundColor: "#00B87C",
            color: "white",
            border: "none",
            borderRadius: "10px",
            padding: "8px 20px",
            fontSize: "13px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Save Changes
        </button>
      </div>

      {/* POLICY BLOCK 1: LANGUAGE */}
      <div
        className="p-4 rounded-xl mb-6 border"
        style={{ backgroundColor: "var(--card)", borderColor: "#E5E7EB" }}
      >
        <span className="block text-[11px] font-bold text-[#94A3B8] mb-3 uppercase">
          LANGUAGE
        </span>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-[11px] font-bold text-[#94A3B8] mb-1 uppercase">
              System Language
            </label>
            <select
              value={appLanguage}
              onChange={(e) => setAppLanguage(e.target.value)}
              className="w-full rounded-xl px-3 py-2.5 text-sm border bg-white dark:bg-neutral-800"
              style={{ borderColor: "#E5E7EB", color: "var(--foreground)" }}
            >
              <option value="en">English (US)</option>
              <option value="en-uk">English (UK)</option>
              <option value="hi">Hindi</option>
              <option value="ta">Tamil</option>
              <option value="te">Telugu</option>
              <option value="fr">French</option>
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-bold text-[#94A3B8] mb-1 uppercase">
              Secondary Language
            </label>
            <select
              value={extraConfig.secondaryLanguage}
              onChange={(e) =>
                updateExtraConfig("secondaryLanguage", e.target.value)
              }
              className="w-full rounded-xl px-3 py-2.5 text-sm border bg-white dark:bg-neutral-800"
              style={{ borderColor: "#E5E7EB", color: "var(--foreground)" }}
            >
              <option>English (US)</option>
              <option>Hindi</option>
              <option>Tamil</option>
              <option>Telugu</option>
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-bold text-[#94A3B8] mb-1 uppercase">
              Employee Portal Language
            </label>
            <select
              value={extraConfig.employeePortalLanguage}
              onChange={(e) =>
                updateExtraConfig("employeePortalLanguage", e.target.value)
              }
              className="w-full rounded-xl px-3 py-2.5 text-sm border bg-white dark:bg-neutral-800"
              style={{ borderColor: "#E5E7EB", color: "var(--foreground)" }}
            >
              <option>Follow System</option>
              <option>English (US)</option>
              <option>Hindi</option>
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-bold text-[#94A3B8] mb-1 uppercase">
              Email Language
            </label>
            <select
              value={extraConfig.emailLanguage}
              onChange={(e) =>
                updateExtraConfig("emailLanguage", e.target.value)
              }
              className="w-full rounded-xl px-3 py-2.5 text-sm border bg-white dark:bg-neutral-800"
              style={{ borderColor: "#E5E7EB", color: "var(--foreground)" }}
            >
              <option>English (US)</option>
              <option>English (UK)</option>
              <option>Hindi</option>
            </select>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div>
            <span className="text-[13px] font-medium text-gray-800 dark:text-gray-200 block">
              Allow Employees to Set Their Own Language
            </span>
            <span className="text-[11px] text-[#94A3B8]">
              Each employee can choose their preferred UI language
            </span>
          </div>
          <button
            onClick={() =>
              updateExtraConfig(
                "allowEmployeeLanguage",
                !extraConfig.allowEmployeeLanguage,
              )
            }
            style={{
              width: "36px",
              height: "20px",
              borderRadius: "20px",
              backgroundColor: extraConfig.allowEmployeeLanguage
                ? "#00B87C"
                : "#E5E7EB",
              position: "relative",
              transition: "all 0.2s",
              cursor: "pointer",
              border: "none",
            }}
          >
            <span
              style={{
                position: "absolute",
                top: "2px",
                left: extraConfig.allowEmployeeLanguage ? "18px" : "2px",
                width: "16px",
                height: "16px",
                borderRadius: "50%",
                backgroundColor: "white",
                transition: "all 0.2s",
              }}
            />
          </button>
        </div>
      </div>

      {/* POLICY BLOCK 2: DATE, TIME & NUMBERS */}
      <div
        className="p-4 rounded-xl mb-6 border"
        style={{ backgroundColor: "var(--card)", borderColor: "#E5E7EB" }}
      >
        <span className="block text-[11px] font-bold text-[#94A3B8] mb-3 uppercase">
          DATE, TIME & NUMBERS
        </span>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-bold text-[#94A3B8] mb-1 uppercase">
              Date Format
            </label>
            <select
              value={appDateFormat}
              onChange={(e) => setAppDateFormat(e.target.value)}
              className="w-full rounded-xl px-3 py-2.5 text-sm border bg-white dark:bg-neutral-800"
              style={{ borderColor: "#E5E7EB", color: "var(--foreground)" }}
            >
              <option value="DD-MM-YYYY">DD-MM-YYYY</option>
              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-bold text-[#94A3B8] mb-1 uppercase">
              Time Format
            </label>
            <select
              value={extraConfig.timeFormat}
              onChange={(e) =>
                updateExtraConfig("timeFormat", e.target.value)
              }
              className="w-full rounded-xl px-3 py-2.5 text-sm border bg-white dark:bg-neutral-800"
              style={{ borderColor: "#E5E7EB", color: "var(--foreground)" }}
            >
              <option>12-hour (AM/PM)</option>
              <option>24-hour</option>
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-bold text-[#94A3B8] mb-1 uppercase">
              Week Starts On
            </label>
            <select
              value={extraConfig.weekStartsOn}
              onChange={(e) =>
                updateExtraConfig("weekStartsOn", e.target.value)
              }
              className="w-full rounded-xl px-3 py-2.5 text-sm border bg-white dark:bg-neutral-800"
              style={{ borderColor: "#E5E7EB", color: "var(--foreground)" }}
            >
              <option>Monday</option>
              <option>Sunday</option>
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-bold text-[#94A3B8] mb-1 uppercase">
              Fiscal Year Start
            </label>
            <select
              value={extraConfig.fiscalYearStart}
              onChange={(e) =>
                updateExtraConfig("fiscalYearStart", e.target.value)
              }
              className="w-full rounded-xl px-3 py-2.5 text-sm border bg-white dark:bg-neutral-800"
              style={{ borderColor: "#E5E7EB", color: "var(--foreground)" }}
            >
              <option>April 1</option>
              <option>January 1</option>
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-bold text-[#94A3B8] mb-1 uppercase">
              Number Format
            </label>
            <select
              value={extraConfig.numberFormat}
              onChange={(e) =>
                updateExtraConfig("numberFormat", e.target.value)
              }
              className="w-full rounded-xl px-3 py-2.5 text-sm border bg-white dark:bg-neutral-800"
              style={{ borderColor: "#E5E7EB", color: "var(--foreground)" }}
            >
              <option>1,00,000 (Indian)</option>
              <option>100,000 (International)</option>
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-bold text-[#94A3B8] mb-1 uppercase">
              Decimal Separator
            </label>
            <select
              value={extraConfig.decimalSeparator}
              onChange={(e) =>
                updateExtraConfig("decimalSeparator", e.target.value)
              }
              className="w-full rounded-xl px-3 py-2.5 text-sm border bg-white dark:bg-neutral-800"
              style={{ borderColor: "#E5E7EB", color: "var(--foreground)" }}
            >
              <option>Dot (1,000.00)</option>
              <option>Comma (1.000,00)</option>
            </select>
          </div>
        </div>
      </div>

      {/* POLICY BLOCK 3: TIMEZONE & CURRENCY */}
      <div
        className="p-4 rounded-xl mb-6 border"
        style={{ backgroundColor: "var(--card)", borderColor: "#E5E7EB" }}
      >
        <span className="block text-[11px] font-bold text-[#94A3B8] mb-3 uppercase">
          TIMEZONE & CURRENCY
        </span>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-[11px] font-bold text-[#94A3B8] mb-1 uppercase">
              Default Timezone
            </label>
            <select
              value={appTimezone}
              onChange={(e) => setAppTimezone(e.target.value)}
              className="w-full rounded-xl px-3 py-2.5 text-sm border bg-white dark:bg-neutral-800"
              style={{ borderColor: "#E5E7EB", color: "var(--foreground)" }}
            >
              <option value="IST">Asia/Kolkata (IST UTC+5:30)</option>
              <option value="UTC">UTC</option>
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-bold text-[#94A3B8] mb-1 uppercase">
              Currency Symbol
            </label>
            <select
              value={extraConfig.currencySymbol}
              onChange={(e) =>
                updateExtraConfig("currencySymbol", e.target.value)
              }
              className="w-full rounded-xl px-3 py-2.5 text-sm border bg-white dark:bg-neutral-800"
              style={{ borderColor: "#E5E7EB", color: "var(--foreground)" }}
            >
              <option>₹ — Indian Rupee (INR)</option>
              <option>$ — US Dollar (USD)</option>
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-bold text-[#94A3B8] mb-1 uppercase">
              Currency Position
            </label>
            <select
              value={extraConfig.currencyPosition}
              onChange={(e) =>
                updateExtraConfig("currencyPosition", e.target.value)
              }
              className="w-full rounded-xl px-3 py-2.5 text-sm border bg-white dark:bg-neutral-800"
              style={{ borderColor: "#E5E7EB", color: "var(--foreground)" }}
            >
              <option>Before Amount (₹1,00,000)</option>
              <option>After Amount (1,00,000 ₹)</option>
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-bold text-[#94A3B8] mb-1 uppercase">
              Salary Display Format
            </label>
            <select
              value={extraConfig.salaryDisplayFormat}
              onChange={(e) =>
                updateExtraConfig("salaryDisplayFormat", e.target.value)
              }
              className="w-full rounded-xl px-3 py-2.5 text-sm border bg-white dark:bg-neutral-800"
              style={{ borderColor: "#E5E7EB", color: "var(--foreground)" }}
            >
              <option>In Lakhs (₹12L)</option>
              <option>Full Amount (₹1,200,000)</option>
            </select>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div>
            <span className="text-[13px] font-medium text-gray-800 dark:text-gray-200 block">
              Show Currency Conversion for International Employees
            </span>
            <span className="text-[11px] text-[#94A3B8]">
              Display equivalent amount in employee's local currency
            </span>
          </div>
          <button
            onClick={() =>
              updateExtraConfig(
                "showCurrencyConversion",
                !extraConfig.showCurrencyConversion,
              )
            }
            style={{
              width: "36px",
              height: "20px",
              borderRadius: "20px",
              backgroundColor: extraConfig.showCurrencyConversion
                ? "#00B87C"
                : "#E5E7EB",
              position: "relative",
              transition: "all 0.2s",
              cursor: "pointer",
              border: "none",
            }}
          >
            <span
              style={{
                position: "absolute",
                top: "2px",
                left: extraConfig.showCurrencyConversion ? "18px" : "2px",
                width: "16px",
                height: "16px",
                borderRadius: "50%",
                backgroundColor: "white",
                transition: "all 0.2s",
              }}
            />
          </button>
        </div>
      </div>

      {/* POLICY BLOCK 4: REGIONAL COMPLIANCE */}
      <div
        className="p-4 rounded-xl mb-6 border"
        style={{ backgroundColor: "var(--card)", borderColor: "#E5E7EB" }}
      >
        <span className="block text-[11px] font-bold text-[#94A3B8] mb-3 uppercase">
          REGIONAL COMPLIANCE
        </span>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-[11px] font-bold text-[#94A3B8] mb-1 uppercase">
              Country
            </label>
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full rounded-xl px-3 py-2.5 text-sm border bg-white dark:bg-neutral-800"
              style={{ borderColor: "#E5E7EB", color: "var(--foreground)" }}
            >
              <option value="India">India</option>
              <option value="USA">USA</option>
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-bold text-[#94A3B8] mb-1 uppercase">
              State / Province
            </label>
            <select
              value={extraConfig.state}
              onChange={(e) => updateExtraConfig("state", e.target.value)}
              className="w-full rounded-xl px-3 py-2.5 text-sm border bg-white dark:bg-neutral-800"
              style={{ borderColor: "#E5E7EB", color: "var(--foreground)" }}
            >
              <option>Karnataka</option>
              <option>Maharashtra</option>
              <option>Tamil Nadu</option>
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-bold text-[#94A3B8] mb-1 uppercase">
              Applicable Labor Law
            </label>
            <input
              type="text"
              readOnly
              value={extraConfig.applicableLaborLaw}
              className="w-full rounded-xl px-3 py-2.5 text-sm border bg-gray-100 dark:bg-neutral-800 text-[#94A3B8]"
              style={{ borderColor: "#E5E7EB" }}
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-[#94A3B8] mb-1 uppercase">
              Tax Regime
            </label>
            <select
              value={extraConfig.taxRegime}
              onChange={(e) => updateExtraConfig("taxRegime", e.target.value)}
              className="w-full rounded-xl px-3 py-2.5 text-sm border bg-white dark:bg-neutral-800"
              style={{ borderColor: "#E5E7EB", color: "var(--foreground)" }}
            >
              <option>New Tax Regime</option>
              <option>Old Tax Regime</option>
            </select>
          </div>
        </div>
        <div className="space-y-3">
          {[
            { key: "applyLabourLaw", label: "Apply Indian Labour Law Rules" },
            {
              key: "pfEsiCompliance",
              label: "PF/ESI Compliance Auto-checks",
            },
            {
              key: "showRegionalHoliday",
              label: "Show Regional Holiday Calendar by Default",
            },
          ].map((item) => (
            <div key={item.key} className="flex justify-between items-center">
              <span className="text-[13px] font-medium text-gray-800 dark:text-gray-200">
                {item.label}
              </span>
              <button
                onClick={() =>
                  updateExtraConfig(
                    item.key,
                    !extraConfig[item.key as keyof typeof extraConfig],
                  )
                }
                style={{
                  width: "36px",
                  height: "20px",
                  borderRadius: "20px",
                  backgroundColor: extraConfig[
                    item.key as keyof typeof extraConfig
                  ]
                    ? "#00B87C"
                    : "#E5E7EB",
                  position: "relative",
                  transition: "all 0.2s",
                  cursor: "pointer",
                  border: "none",
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    top: "2px",
                    left: extraConfig[item.key as keyof typeof extraConfig]
                      ? "18px"
                      : "2px",
                    width: "16px",
                    height: "16px",
                    borderRadius: "50%",
                    backgroundColor: "white",
                    transition: "all 0.2s",
                  }}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* SAVE BAR */}
      <div
        className="flex justify-end items-center gap-4 pt-4 border-t"
        style={{ borderColor: "#F3F4F6" }}
      >
        <button
          onClick={() => showToast("Settings reset to default", "error")}
          style={{
            backgroundColor: "transparent",
            color: "#9CA3AF",
            border: "none",
            fontSize: "13px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Reset
        </button>
        <button
          onClick={() => showToast("Locale preferences saved")}
          style={{
            backgroundColor: "#00B87C",
            color: "white",
            border: "none",
            borderRadius: "10px",
            padding: "8px 20px",
            fontSize: "13px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}
