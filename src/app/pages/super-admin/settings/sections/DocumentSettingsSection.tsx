import React from "react";
import { useSettingsContext } from "../SettingsContext";
import {
  ChevronRight,
  Download,
  Upload,
} from "lucide-react";

export function DocumentSettingsSection() {
  const {
    extraConfig,
    showToast,
    updateExtraConfig,
  } = useSettingsContext();

  const categories = [
    {
      name: "Identity Documents",
      desc: "Aadhar, PAN, Passport",
      req: "3 required",
      expiry: "30 days before",
    },
    {
      name: "Employment Documents",
      desc: "Offer letter, NDA, Contract",
      req: "2 required",
      expiry: "No expiry",
    },
    {
      name: "Educational Certificates",
      desc: "Degree, Transcripts",
      req: "1 required",
      expiry: "No expiry",
    },
    {
      name: "Professional Certifications",
      desc: "AWS, PMP, CFA etc.",
      req: "Optional",
      expiry: "60 days before",
    },
    {
      name: "Medical Records",
      desc: "Insurance, fitness certificate",
      req: "Optional",
      expiry: "30 days before",
    },
    {
      name: "Bank Documents",
      desc: "Cancelled cheque, passbook",
      req: "1 required",
      expiry: "No expiry",
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-2 mb-4 text-[12px] font-medium">
        <span style={{ color: "#9CA3AF" }}>Settings</span>
        <ChevronRight size={12} style={{ color: "#9CA3AF" }} />
        <span style={{ color: "#9CA3AF" }}>Module Settings</span>
        <ChevronRight size={12} style={{ color: "#9CA3AF" }} />
        <span style={{ color: "#00B87C", fontWeight: 700 }}>
          Document Settings
        </span>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div>
          <h2
            style={{
              fontSize: "18px",
              fontWeight: 700,
              color: "#111827",
              margin: 0,
            }}
          >
            Document Settings
          </h2>
          <p style={{ fontSize: "13px", color: "#9CA3AF", marginTop: "2px" }}>
            Configure document storage, access and expiry rules
          </p>
        </div>
        <button
          onClick={() => showToast("Document settings saved")}
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
          Save Settings
        </button>
      </div>

      {/* POLICY BLOCK 1: STORAGE CONFIGURATION */}
      <div
        className="p-4 rounded-xl mb-6 border"
        style={{ backgroundColor: "var(--card)", borderColor: "#E5E7EB" }}
      >
        <span className="block text-[11px] font-bold text-[#94A3B8] mb-3 uppercase">
          STORAGE CONFIGURATION
        </span>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-[11px] font-bold text-[#94A3B8] mb-1 uppercase">
              Storage Provider
            </label>
            <select
              value={extraConfig.docStorageProvider}
              onChange={(e) =>
                updateExtraConfig("docStorageProvider", e.target.value)
              }
              className="w-full rounded-xl px-3 py-2.5 text-sm border bg-white dark:bg-neutral-800"
              style={{ borderColor: "#E5E7EB", color: "var(--foreground)" }}
            >
              <option>AWS S3</option>
              <option>Google Drive</option>
              <option>Azure Blob</option>
              <option>Local</option>
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-bold text-[#94A3B8] mb-1 uppercase">
              Max File Size (MB)
            </label>
            <input
              type="number"
              value={extraConfig.docMaxFileSize}
              onChange={(e) =>
                updateExtraConfig("docMaxFileSize", e.target.value)
              }
              className="w-full rounded-xl px-3 py-2.5 text-sm border bg-white dark:bg-neutral-800"
              style={{ borderColor: "#E5E7EB", color: "var(--foreground)" }}
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-[#94A3B8] mb-1 uppercase">
              Total Storage Quota (GB)
            </label>
            <input
              type="number"
              value={extraConfig.docTotalQuota}
              onChange={(e) =>
                updateExtraConfig("docTotalQuota", e.target.value)
              }
              className="w-full rounded-xl px-3 py-2.5 text-sm border bg-white dark:bg-neutral-800"
              style={{ borderColor: "#E5E7EB", color: "var(--foreground)" }}
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-[#94A3B8] mb-1 uppercase">
              Accepted File Types
            </label>
            <input
              type="text"
              value={extraConfig.docAcceptedTypes}
              onChange={(e) =>
                updateExtraConfig("docAcceptedTypes", e.target.value)
              }
              className="w-full rounded-xl px-3 py-2.5 text-sm border bg-white dark:bg-neutral-800"
              style={{ borderColor: "#E5E7EB", color: "var(--foreground)" }}
            />
          </div>
        </div>
        <div className="mb-4">
          <div className="flex justify-between text-[12px] text-gray-600 mb-1">
            <span>Storage Used</span>
            <span className="font-bold">142 GB of 500 GB</span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-[#00B87C]" style={{ width: "28.4%" }} />
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-[13px] font-medium text-gray-800 dark:text-gray-200">
            Backup to Secondary Storage
          </span>
          <button
            onClick={() =>
              updateExtraConfig(
                "docBackupSecondary",
                !extraConfig.docBackupSecondary,
              )
            }
            style={{
              width: "36px",
              height: "20px",
              borderRadius: "20px",
              backgroundColor: extraConfig.docBackupSecondary
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
                left: extraConfig.docBackupSecondary ? "18px" : "2px",
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

      {/* POLICY BLOCK 2: DOCUMENT CATEGORIES */}
      <span className="block text-[11px] font-bold text-[#94A3B8] mb-3 uppercase">
        DOCUMENT CATEGORIES
      </span>
      <div
        className="p-4 rounded-xl mb-6 border"
        style={{ backgroundColor: "var(--card)", borderColor: "#E5E7EB" }}
      >
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-gray-200">
                {[
                  "CATEGORY",
                  "DESCRIPTION",
                  "REQUIRED DOCS",
                  "EXPIRY ALERT",
                  "ACTION",
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
              {categories.map((c, idx) => (
                <tr
                  key={idx}
                  className="border-b border-gray-100 hover:bg-[#00B87C]/[0.08] transition-all text-[13px]"
                >
                  <td className="py-3 px-4 font-bold text-gray-800 dark:text-gray-200">
                    {c.name}
                  </td>
                  <td className="py-3 px-4 text-gray-600">{c.desc}</td>
                  <td className="py-3 px-4 text-gray-600">{c.req}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-block text-[11px] font-bold px-2 py-0.5 rounded-full ${c.expiry === "No expiry" ? "bg-[#DCFCE7] text-[#00B87C]" : "bg-amber-500/10 text-amber-500"}`}
                    >
                      {c.expiry}
                    </span>
                  </td>
                  <td className="py-3 px-4 flex gap-2">
                    <button className="px-2 py-1 text-[11px] font-bold border border-gray-200 rounded-lg text-gray-700 bg-white hover:bg-[#00B87C]/[0.08] cursor-pointer">
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-3 text-[13px] text-[#00B87C] font-bold cursor-pointer">
          + Add Category
        </div>
      </div>

      {/* POLICY BLOCK 3: ACCESS & PERMISSIONS */}
      <div
        className="p-4 rounded-xl mb-6 border"
        style={{ backgroundColor: "var(--card)", borderColor: "#E5E7EB" }}
      >
        <span className="block text-[11px] font-bold text-[#94A3B8] mb-3 uppercase">
          ACCESS & PERMISSIONS
        </span>
        <div className="space-y-3">
          {[
            {
              key: "docEmpUpload",
              label: "Employees Can Upload Their Own Documents",
            },
            {
              key: "docRequireHrVerify",
              label: "Documents Require HR Verification",
              desc: "Uploaded docs are marked pending until HR reviews them",
            },
            {
              key: "docExpiryTracking",
              label: "Enable Document Expiry Tracking",
            },
            {
              key: "docEmpDownload",
              label: "Allow Document Download by Employee",
            },
            {
              key: "docWatermark",
              label: "Watermark Downloaded Documents",
              desc: "Add employee name and date watermark on downloaded files",
            },
            {
              key: "docAutoDeleteRejected",
              label: "Auto-Delete Rejected Documents",
            },
          ].map((item) => (
            <div key={item.key} className="flex justify-between items-center">
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
      </div>

      {/* POLICY BLOCK 4: EXPIRY NOTIFICATIONS */}
      <div
        className="p-4 rounded-xl mb-6 border"
        style={{ backgroundColor: "var(--card)", borderColor: "#E5E7EB" }}
      >
        <span className="block text-[11px] font-bold text-[#94A3B8] mb-3 uppercase">
          EXPIRY NOTIFICATIONS
        </span>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-[11px] font-bold text-[#94A3B8] mb-1 uppercase">
              First Alert (days before)
            </label>
            <input
              type="number"
              value={extraConfig.docExpiryAlert1}
              onChange={(e) =>
                updateExtraConfig("docExpiryAlert1", e.target.value)
              }
              className="w-full rounded-xl px-3 py-2.5 text-sm border bg-white dark:bg-neutral-800"
              style={{ borderColor: "#E5E7EB", color: "var(--foreground)" }}
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-[#94A3B8] mb-1 uppercase">
              Second Alert (days before)
            </label>
            <input
              type="number"
              value={extraConfig.docExpiryAlert2}
              onChange={(e) =>
                updateExtraConfig("docExpiryAlert2", e.target.value)
              }
              className="w-full rounded-xl px-3 py-2.5 text-sm border bg-white dark:bg-neutral-800"
              style={{ borderColor: "#E5E7EB", color: "var(--foreground)" }}
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-[#94A3B8] mb-1 uppercase">
              Final Alert (days before)
            </label>
            <input
              type="number"
              value={extraConfig.docExpiryAlert3}
              onChange={(e) =>
                updateExtraConfig("docExpiryAlert3", e.target.value)
              }
              className="w-full rounded-xl px-3 py-2.5 text-sm border bg-white dark:bg-neutral-800"
              style={{ borderColor: "#E5E7EB", color: "var(--foreground)" }}
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-[#94A3B8] mb-1 uppercase">
              Notify
            </label>
            <select
              value={extraConfig.docExpiryNotify}
              onChange={(e) =>
                updateExtraConfig("docExpiryNotify", e.target.value)
              }
              className="w-full rounded-xl px-3 py-2.5 text-sm border bg-white dark:bg-neutral-800"
              style={{ borderColor: "#E5E7EB", color: "var(--foreground)" }}
            >
              <option>Employee + HR Manager</option>
              <option>Employee Only</option>
              <option>HR Manager Only</option>
            </select>
          </div>
        </div>
        <div className="space-y-3">
          {[
            {
              key: "docBlockCriticalExpired",
              label: "Block Employee Actions if Critical Doc Expired",
            },
            {
              key: "docAutoNotifyRejection",
              label: "Auto-notify on Document Rejection",
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

      <div
        className="flex justify-end items-center pt-4 border-t"
        style={{ borderColor: "#F3F4F6" }}
      >
        <button
          onClick={() => showToast("Document settings saved")}
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
          Save Settings
        </button>
      </div>
    </div>
  );
}
