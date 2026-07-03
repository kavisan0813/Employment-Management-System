import { useState } from "react";
import { useSettingsContext } from "../SettingsContext";
import {
  ClipboardCheck,
  TreePalm,
  IndianRupee,
  ChevronRight,
  Download,
  CheckCircle,
  UserPlus,
  CloudUpload,
  Eye,
} from "lucide-react";

export function DataImportExportSection() {
  const { extraConfig, showToast, updateExtraConfig } = useSettingsContext();

  const [activeTab, setActiveTab] = useState("import");
  const [selectedType, setSelectedType] = useState("employees");

  const importHistory = [
    {
      name: "employees_march.xlsx",
      type: "Employees",
      records: "142 added, 3 failed",
      status: "Success",
      by: "Ryan Park",
      date: "Apr 1, 2026",
    },
    {
      name: "attendance_q1.csv",
      type: "Attendance",
      records: "4,860 records",
      status: "Success",
      by: "Meera Thomas",
      date: "Mar 31",
    },
    {
      name: "leave_balances.xlsx",
      type: "Leave",
      records: "248 updated",
      status: "Success",
      by: "Ryan Park",
      date: "Apr 1",
    },
    {
      name: "payroll_feb.csv",
      type: "Payroll",
      records: "12 errors",
      status: "Failed",
      by: "Suresh Iyer",
      date: "Mar 5",
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-2 mb-4 text-[12px] font-medium">
        <span style={{ color: "#9CA3AF" }}>Settings</span>
        <ChevronRight size={12} style={{ color: "#9CA3AF" }} />
        <span style={{ color: "#9CA3AF" }}>System Preferences</span>
        <ChevronRight size={12} style={{ color: "#9CA3AF" }} />
        <span style={{ color: "#00B87C", fontWeight: 700 }}>
          Data Import / Export
        </span>
      </div>

      <div className="mb-6">
        <h2
          style={{
            fontSize: "18px",
            fontWeight: 700,
            color: "#111827",
            margin: 0,
          }}
        >
          Data Import / Export
        </h2>
        <p style={{ fontSize: "13px", color: "#9CA3AF", marginTop: "2px" }}>
          Bulk manage employee and HR data
        </p>
      </div>

      {/* TABS */}
      <div className="flex gap-6 border-b border-gray-200 mb-6">
        {[
          { id: "import", label: "Import Data" },
          { id: "export", label: "Export Data" },
          { id: "import_history", label: "Import History" },
          { id: "export_history", label: "Export History" },
        ].map((tab) => {
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="pb-3 font-bold text-[13px] border-b-2 bg-transparent cursor-pointer transition-all"
              style={{
                borderColor: active ? "#00B87C" : "transparent",
                color: active ? "#00B87C" : "#6B7280",
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {activeTab === "import" && (
        <div>
          {/* POLICY BLOCK 1: SELECT DATA TYPE */}
          <span className="block text-[11px] font-bold text-[#94A3B8] mb-3 uppercase">
            SELECT DATA TYPE
          </span>
          <div className="grid grid-cols-4 gap-4 mb-6">
            {[
              {
                id: "employees",
                label: "Employees",
                desc: "Bulk add or update",
                icon: UserPlus,
              },
              {
                id: "attendance",
                label: "Attendance",
                desc: "Upload records",
                icon: ClipboardCheck,
              },
              {
                id: "payroll",
                label: "Payroll",
                desc: "Salary & deduction",
                icon: IndianRupee,
              },
              {
                id: "leave",
                label: "Leave Balances",
                desc: "Opening balances",
                icon: TreePalm,
              },
            ].map((t) => {
              const selected = selectedType === t.id;
              const Icon = t.icon;
              return (
                <div
                  key={t.id}
                  onClick={() => setSelectedType(t.id)}
                  className="p-4 rounded-xl border cursor-pointer relative transition-all hover:-translate-y-[2px] hover:border-[#00B87C] hover:shadow-[0_0_15px_rgba(0,184,124,0.3)] text-center flex flex-col items-center"
                  style={{
                    backgroundColor: selected ? "#DCFCE7" : "var(--card)",
                    borderColor: selected ? "#00B87C" : "#E5E7EB",
                    borderWidth: selected ? "2px" : "1px",
                  }}
                >
                  {selected && (
                    <CheckCircle
                      size={16}
                      className="text-[#00B87C] absolute top-2 right-2"
                    />
                  )}
                  <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[rgba(0,184,124,0.1)] mb-2 text-[#00B87C]">
                    <Icon size={20} />
                  </div>
                  <span className="block font-bold text-[13px] text-[#111827]">
                    {t.label}
                  </span>
                  <span className="block text-[11px] text-[#94A3B8] mt-1">
                    {t.desc}
                  </span>
                </div>
              );
            })}
          </div>

          {/* POLICY BLOCK 2: UPLOAD FILE */}
          <div
            className="p-6 rounded-xl border-2 border-dashed text-center mb-6"
            style={{ backgroundColor: "#F9FAFB", borderColor: "#E5E7EB" }}
          >
            <CloudUpload size={32} className="text-[#00B87C] mx-auto mb-2" />
            <span className="block font-bold text-[14px] text-[#374151]">
              Drag & drop your CSV or Excel file here
            </span>
            <span className="text-[13px] text-[#00B87C] cursor-pointer font-medium">
              or Browse
            </span>
            <span className="block text-[12px] text-[#94A3B8] mt-2">
              Accepted formats: .CSV, .XLSX — max 10MB
            </span>
          </div>

          {/* POLICY BLOCK 3: IMPORT OPTIONS */}
          <div
            className="p-4 rounded-xl mb-6 border"
            style={{ backgroundColor: "var(--card)", borderColor: "#E5E7EB" }}
          >
            <span className="block text-[11px] font-bold text-[#94A3B8] mb-3 uppercase">
              IMPORT OPTIONS
            </span>
            <div className="space-y-3 mb-4">
              {[
                {
                  key: "importSkipDuplicates",
                  label: "Skip Duplicate Records",
                  desc: "Existing records with same ID will be ignored",
                },
                {
                  key: "importUpdateExisting",
                  label: "Update Existing Records",
                  desc: "Overwrite matching records with new data",
                },
                {
                  key: "importSendWelcome",
                  label: "Send Welcome Email to New Employees",
                  desc: "",
                },
                {
                  key: "importValidate",
                  label: "Validate Before Import (Dry Run)",
                  desc: "Preview errors without making changes",
                },
              ].map((item) => (
                <div
                  key={item.key}
                  className="flex justify-between items-center"
                >
                  <div>
                    <span className="text-[13px] font-medium text-gray-800 dark:text-gray-200 block">
                      {item.label}
                    </span>
                    {item.desc && (
                      <span className="text-[11px] text-[#94A3B8]">
                        {item.desc}
                      </span>
                    )}
                  </div>
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
            <div className="flex items-center gap-2 text-[13px] text-[#00B87C] font-medium cursor-pointer">
              <Download size={16} />
              Download Sample Template
            </div>
          </div>

          <button
            onClick={() => showToast("Import started")}
            className="w-full py-3 border-none bg-[#00B87C] text-white font-bold rounded-xl cursor-pointer"
          >
            Start Import
          </button>
        </div>
      )}

      {activeTab === "export" && (
        <div>
          {/* POLICY BLOCK 1: SELECT DATA TO EXPORT */}
          <div
            className="p-4 rounded-xl mb-6 border"
            style={{ backgroundColor: "var(--card)", borderColor: "#E5E7EB" }}
          >
            <span className="block text-[11px] font-bold text-[#94A3B8] mb-3 uppercase">
              SELECT DATA TO EXPORT
            </span>
            <div className="grid grid-cols-2 gap-3">
              {[
                { key: "exportEmployeeData", label: "Employee Master Data" },
                { key: "exportAttendance", label: "Attendance Records" },
                { key: "exportLeave", label: "Leave Records" },
                { key: "exportPayroll", label: "Payroll Data" },
                { key: "exportPerformance", label: "Performance Reviews" },
                { key: "exportDocs", label: "Documents & Attachments" },
                { key: "exportAuditLogs", label: "Audit Logs" },
              ].map((item) => (
                <label
                  key={item.key}
                  className="flex items-center gap-3 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={
                      extraConfig[
                        item.key as keyof typeof extraConfig
                      ] as boolean
                    }
                    onChange={(e) =>
                      updateExtraConfig(item.key, e.target.checked)
                    }
                    className="w-4 h-4 rounded text-[#00B87C] focus:ring-[#00B87C] border-gray-300"
                  />
                  <span className="text-[13px] text-gray-800 dark:text-gray-200">
                    {item.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* POLICY BLOCK 2: EXPORT SETTINGS */}
          <div
            className="p-4 rounded-xl mb-6 border"
            style={{ backgroundColor: "var(--card)", borderColor: "#E5E7EB" }}
          >
            <span className="block text-[11px] font-bold text-[#94A3B8] mb-3 uppercase">
              EXPORT SETTINGS
            </span>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-[11px] font-bold text-[#94A3B8] mb-1 uppercase">
                  Export Format
                </label>
                <select
                  value={extraConfig.exportFormat}
                  onChange={(e) =>
                    updateExtraConfig("exportFormat", e.target.value)
                  }
                  className="w-full rounded-xl px-3 py-2.5 text-sm border bg-white dark:bg-neutral-800"
                  style={{
                    borderColor: "#E5E7EB",
                    color: "var(--foreground)",
                  }}
                >
                  <option>Excel (.xlsx)</option>
                  <option>CSV (.csv)</option>
                  <option>PDF (.pdf)</option>
                  <option>JSON (.json)</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-[#94A3B8] mb-1 uppercase">
                  Date Range
                </label>
                <input
                  type="text"
                  value={extraConfig.exportDateRange}
                  onChange={(e) =>
                    updateExtraConfig("exportDateRange", e.target.value)
                  }
                  className="w-full rounded-xl px-3 py-2.5 text-sm border bg-white dark:bg-neutral-800"
                  style={{
                    borderColor: "#E5E7EB",
                    color: "var(--foreground)",
                  }}
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-[#94A3B8] mb-1 uppercase">
                  Department Filter
                </label>
                <select
                  value={extraConfig.exportDeptFilter}
                  onChange={(e) =>
                    updateExtraConfig("exportDeptFilter", e.target.value)
                  }
                  className="w-full rounded-xl px-3 py-2.5 text-sm border bg-white dark:bg-neutral-800"
                  style={{
                    borderColor: "#E5E7EB",
                    color: "var(--foreground)",
                  }}
                >
                  <option>All Departments</option>
                  <option>Engineering</option>
                  <option>HR</option>
                </select>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[13px] font-medium text-gray-800 dark:text-gray-200 block">
                    Include Inactive Employees
                  </span>
                </div>
                <button
                  onClick={() =>
                    updateExtraConfig(
                      "exportIncludeInactive",
                      !extraConfig.exportIncludeInactive,
                    )
                  }
                  style={{
                    width: "36px",
                    height: "20px",
                    borderRadius: "20px",
                    backgroundColor: extraConfig.exportIncludeInactive
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
                      left: extraConfig.exportIncludeInactive ? "18px" : "2px",
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
            <button
              onClick={() => showToast("Export initiated")}
              className="w-full py-3 border-none bg-[#00B87C] text-white font-bold rounded-xl cursor-pointer"
            >
              Export Now
            </button>
          </div>
        </div>
      )}

      {activeTab === "import_history" && (
        <div
          className="p-4 rounded-xl border"
          style={{ backgroundColor: "var(--card)", borderColor: "#E5E7EB" }}
        >
          <span className="block text-[11px] font-bold text-[#94A3B8] mb-3 uppercase">
            IMPORT HISTORY
          </span>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-gray-200">
                  {[
                    "FILE NAME",
                    "DATA TYPE",
                    "RECORDS",
                    "STATUS",
                    "IMPORTED BY",
                    "DATE",
                  ].map((h) => (
                    <th
                      key={h}
                      className="py-3 px-4 text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {importHistory.map((h, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-gray-100 hover:bg-[#00B87C]/[0.08] transition-all text-[13px]"
                  >
                    <td className="py-3 px-4 font-medium text-gray-800 dark:text-gray-200">
                      {h.name}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block text-[11px] font-bold px-2 py-0.5 rounded-full ${h.type === "Employees" ? "bg-[#DCFCE7] text-[#00B87C]" : h.type === "Attendance" ? "bg-teal-100 text-teal-700" : h.type === "Leave" ? "bg-amber-500/10 text-amber-500" : "bg-purple-100 text-purple-700"}`}
                      >
                        {h.type}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      {h.records}
                      {h.status === "Failed" && (
                        <span className="text-red-500 cursor-pointer ml-2 underline flex items-center gap-1">
                          <Eye size={12} />
                          View Errors
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block text-[11px] font-bold px-2 py-0.5 rounded-full ${h.status === "Success" ? "bg-[#DCFCE7] text-[#00B87C]" : "bg-red-500/10 text-red-500"}`}
                      >
                        {h.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{h.by}</td>
                    <td className="py-3 px-4 text-gray-600">{h.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
