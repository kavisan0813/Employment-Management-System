import { useSettingsContext } from "../SettingsContext";
import { Mail, Smartphone, ChevronRight } from "lucide-react";

export function CompanyProfileSection() {
  const {
    SectionTitle,
    companyEmail,
    companyName,
    country,
    currency,
    dateFormat,
    financialYear,
    foundedYear,
    industry,
    legalName,
    registeredAddress,
    setActiveModal,
    setCompanyEmail,
    setCompanyName,
    setCountry,
    setCurrency,
    setDateFormat,
    setFinancialYear,
    setFoundedYear,
    setIndustry,
    setLegalName,
    setRegisteredAddress,
    setSupportPhone,
    setTimezone,
    showToast,
    supportPhone,
    timezone,
  } = useSettingsContext();

  return (
    <div>
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-4 text-[12px] font-medium">
        <span style={{ color: "var(--muted-foreground)" }}>Settings</span>
        <ChevronRight size={12} style={{ color: "var(--muted-foreground)" }} />
        <span style={{ color: "#00B87C" }}>Company Profile</span>
      </div>

      {/* Content Header */}
      <div className="flex justify-between items-center mb-6">
        <h2
          style={{
            fontSize: "18px",
            fontWeight: 700,
            color: "var(--foreground)",
          }}
        >
          Company Profile
        </h2>
        <button
          onClick={() => showToast("Corporate profile definitions recorded")}
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
          Save Changes
        </button>
      </div>

      {/* Section: BASIC INFORMATION */}
      <SectionTitle title="Basic Information" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label
            style={{
              display: "block",
              fontSize: "11px",
              fontWeight: 700,
              color: "var(--muted-foreground)",
              textTransform: "uppercase",
              marginBottom: "6px",
            }}
          >
            Company Name
          </label>
          <input
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all"
            style={{
              backgroundColor: "var(--input-background)",
              borderColor: "var(--border)",
              color: "var(--foreground)",
            }}
          />
        </div>
        <div>
          <label
            style={{
              display: "block",
              fontSize: "11px",
              fontWeight: 700,
              color: "var(--muted-foreground)",
              textTransform: "uppercase",
              marginBottom: "6px",
            }}
          >
            Legal Entity Name
          </label>
          <input
            type="text"
            value={legalName}
            onChange={(e) => setLegalName(e.target.value)}
            className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all"
            style={{
              backgroundColor: "var(--input-background)",
              borderColor: "var(--border)",
              color: "var(--foreground)",
            }}
          />
        </div>
        <div>
          <label
            style={{
              display: "block",
              fontSize: "11px",
              fontWeight: 700,
              color: "var(--muted-foreground)",
              textTransform: "uppercase",
              marginBottom: "6px",
            }}
          >
            Industry
          </label>
          <select
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
            className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all"
            style={{
              backgroundColor: "var(--input-background)",
              borderColor: "var(--border)",
              color: "var(--foreground)",
            }}
          >
            <option value="Technology">Technology</option>
            <option value="Finance">Finance</option>
            <option value="Healthcare">Healthcare</option>
            <option value="Education">Education</option>
          </select>
        </div>
        <div>
          <label
            style={{
              display: "block",
              fontSize: "11px",
              fontWeight: 700,
              color: "var(--muted-foreground)",
              textTransform: "uppercase",
              marginBottom: "6px",
            }}
          >
            Founded Year
          </label>
          <input
            type="text"
            value={foundedYear}
            onChange={(e) => setFoundedYear(e.target.value)}
            className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all"
            style={{
              backgroundColor: "var(--input-background)",
              borderColor: "var(--border)",
              color: "var(--foreground)",
            }}
          />
        </div>
        <div>
          <label
            style={{
              display: "block",
              fontSize: "11px",
              fontWeight: 700,
              color: "var(--muted-foreground)",
              textTransform: "uppercase",
              marginBottom: "6px",
            }}
          >
            Company Email
          </label>
          <div className="relative">
            <Mail
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2"
              style={{ color: "var(--muted-foreground)" }}
            />
            <input
              type="email"
              value={companyEmail}
              onChange={(e) => setCompanyEmail(e.target.value)}
              className="w-full rounded-xl pl-9 pr-3 py-2.5 text-sm outline-none border transition-all"
              style={{
                backgroundColor: "var(--input-background)",
                borderColor: "var(--border)",
                color: "var(--foreground)",
              }}
            />
          </div>
        </div>
        <div>
          <label
            style={{
              display: "block",
              fontSize: "11px",
              fontWeight: 700,
              color: "var(--muted-foreground)",
              textTransform: "uppercase",
              marginBottom: "6px",
            }}
          >
            Support Phone
          </label>
          <div className="relative">
            <Smartphone
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2"
              style={{ color: "var(--muted-foreground)" }}
            />
            <input
              type="text"
              value={supportPhone}
              onChange={(e) => setSupportPhone(e.target.value)}
              className="w-full rounded-xl pl-9 pr-3 py-2.5 text-sm outline-none border transition-all"
              style={{
                backgroundColor: "var(--input-background)",
                borderColor: "var(--border)",
                color: "var(--foreground)",
              }}
            />
          </div>
        </div>
      </div>

      {/* Section: ADDRESS & REGION */}
      <SectionTitle title="Address & Region" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="md:col-span-2">
          <label
            style={{
              display: "block",
              fontSize: "11px",
              fontWeight: 700,
              color: "var(--muted-foreground)",
              textTransform: "uppercase",
              marginBottom: "6px",
            }}
          >
            Registered Address
          </label>
          <input
            type="text"
            value={registeredAddress}
            onChange={(e) => setRegisteredAddress(e.target.value)}
            className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all"
            style={{
              backgroundColor: "var(--input-background)",
              borderColor: "var(--border)",
              color: "var(--foreground)",
            }}
          />
        </div>
        <div>
          <label
            style={{
              display: "block",
              fontSize: "11px",
              fontWeight: 700,
              color: "var(--muted-foreground)",
              textTransform: "uppercase",
              marginBottom: "6px",
            }}
          >
            Country
          </label>
          <select
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all"
            style={{
              backgroundColor: "var(--input-background)",
              borderColor: "var(--border)",
              color: "var(--foreground)",
            }}
          >
            <option value="India">India</option>
            <option value="USA">USA</option>
            <option value="UK">UK</option>
            <option value="UAE">UAE</option>
          </select>
        </div>
        <div>
          <label
            style={{
              display: "block",
              fontSize: "11px",
              fontWeight: 700,
              color: "var(--muted-foreground)",
              textTransform: "uppercase",
              marginBottom: "6px",
            }}
          >
            Timezone
          </label>
          <select
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
            className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all"
            style={{
              backgroundColor: "var(--input-background)",
              borderColor: "var(--border)",
              color: "var(--foreground)",
            }}
          >
            <option value="IST (UTC+5:30)">IST (UTC+5:30)</option>
            <option value="EST (UTC-5:00)">EST (UTC-5:00)</option>
            <option value="GMT (UTC+0:00)">GMT (UTC+0:00)</option>
          </select>
        </div>
        <div>
          <label
            style={{
              display: "block",
              fontSize: "11px",
              fontWeight: 700,
              color: "var(--muted-foreground)",
              textTransform: "uppercase",
              marginBottom: "6px",
            }}
          >
            Financial Year Start
          </label>
          <select
            value={financialYear}
            onChange={(e) => setFinancialYear(e.target.value)}
            className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all"
            style={{
              backgroundColor: "var(--input-background)",
              borderColor: "var(--border)",
              color: "var(--foreground)",
            }}
          >
            <option value="April 1">April 1</option>
            <option value="January 1">January 1</option>
          </select>
        </div>
        <div>
          <label
            style={{
              display: "block",
              fontSize: "11px",
              fontWeight: 700,
              color: "var(--muted-foreground)",
              textTransform: "uppercase",
              marginBottom: "6px",
            }}
          >
            Currency
          </label>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all"
            style={{
              backgroundColor: "var(--input-background)",
              borderColor: "var(--border)",
              color: "var(--foreground)",
            }}
          >
            <option value="INR (₹)">INR (₹)</option>
            <option value="USD ($)">USD ($)</option>
            <option value="EUR (€)">EUR (€)</option>
          </select>
        </div>
        <div>
          <label
            style={{
              display: "block",
              fontSize: "11px",
              fontWeight: 700,
              color: "var(--muted-foreground)",
              textTransform: "uppercase",
              marginBottom: "6px",
            }}
          >
            Date Format
          </label>
          <select
            value={dateFormat}
            onChange={(e) => setDateFormat(e.target.value)}
            className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all"
            style={{
              backgroundColor: "var(--input-background)",
              borderColor: "var(--border)",
              color: "var(--foreground)",
            }}
          >
            <option value="DD-MM-YYYY">DD-MM-YYYY</option>
            <option value="MM/DD/YYYY">MM/DD/YYYY</option>
            <option value="YYYY-MM-DD">YYYY-MM-DD</option>
          </select>
        </div>
      </div>

      {/* Section: BRANDING */}
      <SectionTitle title="Branding" />
      <div
        style={{
          backgroundColor: "var(--secondary)",
          border: "1px solid var(--border)",
          borderRadius: "0.75rem",
          padding: "16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "24px",
        }}
      >
        <div className="flex items-center gap-4">
          <div
            style={{
              width: "60px",
              height: "60px",
              backgroundColor: "#00B87C",
              borderRadius: "0.75rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: "24px",
              fontWeight: 800,
            }}
          >
            N
          </div>
          <div>
            <p
              style={{
                fontSize: "13px",
                fontWeight: 700,
                color: "var(--foreground)",
              }}
            >
              Company Logo
            </p>
            <p style={{ fontSize: "12px", color: "var(--muted-foreground)" }}>
              PNG or SVG, max 2MB, min 200×200px
            </p>
          </div>
        </div>
        <button
          onClick={() => showToast("Upload logo handler mapped")}
          style={{
            backgroundColor: "var(--card)",
            border: "1px solid var(--border)",
            borderRadius: "10px",
            padding: "6px 14px",
            fontSize: "13px",
            fontWeight: 600,
            color: "var(--foreground)",
            cursor: "pointer",
          }}
        >
          Upload Logo
        </button>
      </div>

      {/* SAVE BAR */}
      <div
        className="flex justify-end items-center gap-4 pt-4 mt-6"
        style={{ borderTop: "1px solid var(--border)" }}
      >
        <button
          onClick={() => setActiveModal("reset_defaults")}
          style={{
            backgroundColor: "transparent",
            border: "none",
            color: "var(--muted-foreground)",
            fontSize: "13px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Reset to Defaults
        </button>
        <button
          onClick={() => showToast("Corporate profile definitions recorded")}
          style={{
            backgroundColor: "#00B87C",
            color: "white",
            border: "none",
            borderRadius: "12px",
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
