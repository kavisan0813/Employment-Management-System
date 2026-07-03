import { useSettingsContext } from "../SettingsContext";
import {
  ChevronRight,
  Database,
  CheckCircle,
  RefreshCw,
  CloudUpload,
  Upload,
  AlertTriangle,
} from "lucide-react";

export function BackupRestoreSection() {
  const { extraConfig, showToast, updateExtraConfig } = useSettingsContext();

  const backupHistory = [
    {
      date: "Today, Apr 6 — 3:00 AM",
      size: "2.4 GB",
      type: "Auto",
      status: "Success",
    },
    {
      date: "Apr 5, 3:00 AM",
      size: "2.3 GB",
      type: "Auto",
      status: "Success",
    },
    {
      date: "Apr 4, 3:00 AM",
      size: "2.3 GB",
      type: "Auto",
      status: "Success",
    },
    {
      date: "Apr 3, 11:42 AM",
      size: "2.2 GB",
      type: "Manual",
      status: "Success",
    },
    {
      date: "Apr 2, 3:00 AM",
      size: "2.1 GB",
      type: "Auto",
      status: "Failed",
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
          Backup & Restore
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
            Backup & Restore
          </h2>
          <p style={{ fontSize: "13px", color: "#9CA3AF", marginTop: "2px" }}>
            Protect your data with automated backups
          </p>
        </div>
        <button
          onClick={() => showToast("Backup process initiated")}
          className="flex items-center gap-2"
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
          <CloudUpload size={16} />
          Run Backup Now
        </button>
      </div>

      {/* POLICY BLOCK 1: BACKUP STATUS */}
      <div
        className="p-5 rounded-xl mb-6 border flex justify-between items-center"
        style={{
          backgroundColor: "#F0FDF4",
          borderColor: "rgba(0,184,124,0.2)",
        }}
      >
        <div className="flex items-center gap-4 flex-1 justify-center border-r border-gray-200 pr-4">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-[#DCFCE7] text-[#00B87C]">
            <CheckCircle size={20} />
          </div>
          <div>
            <span className="block text-[11px] font-bold text-[#94A3B8] uppercase">
              LAST BACKUP
            </span>
            <span className="block text-[16px] font-bold text-[#111827]">
              Today, 3:00 AM
            </span>
            <span className="inline-block text-[11px] bg-[#DCFCE7] text-[#00B87C] font-bold px-2 py-0.5 rounded-full mt-1">
              Successful
            </span>
          </div>
        </div>
        <div className="flex items-center gap-4 flex-1 justify-center border-r border-gray-200 px-4">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-[#DCFCE7] text-[#00B87C]">
            <Database size={20} />
          </div>
          <div>
            <span className="block text-[11px] font-bold text-[#94A3B8] uppercase">
              BACKUP SIZE
            </span>
            <span className="block text-[16px] font-bold text-[#111827]">
              2.4 GB
            </span>
            <span className="inline-block text-[11px] bg-gray-100 text-gray-600 font-bold px-2 py-0.5 rounded-full mt-1">
              Compressed
            </span>
          </div>
        </div>
        <div className="flex items-center gap-4 flex-1 justify-center pl-4">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-[#DCFCE7] text-[#00B87C]">
            <RefreshCw size={20} />
          </div>
          <div>
            <span className="block text-[11px] font-bold text-[#94A3B8] uppercase">
              NEXT SCHEDULED
            </span>
            <span className="block text-[16px] font-bold text-[#111827]">
              Tomorrow, 3:00 AM
            </span>
            <span className="inline-block text-[11px] bg-[#FEF3C7] text-[#D97706] font-bold px-2 py-0.5 rounded-full mt-1">
              Scheduled
            </span>
          </div>
        </div>
      </div>

      {/* POLICY BLOCK 2: BACKUP SETTINGS */}
      <div
        className="p-4 rounded-xl mb-6 border"
        style={{ backgroundColor: "var(--card)", borderColor: "#E5E7EB" }}
      >
        <span className="block text-[11px] font-bold text-[#94A3B8] mb-3 uppercase">
          BACKUP SETTINGS
        </span>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-[11px] font-bold text-[#94A3B8] mb-1 uppercase">
              Backup Frequency
            </label>
            <select
              value={extraConfig.backupFrequency}
              onChange={(e) =>
                updateExtraConfig("backupFrequency", e.target.value)
              }
              className="w-full rounded-xl px-3 py-2.5 text-sm border bg-white dark:bg-neutral-800"
              style={{ borderColor: "#E5E7EB", color: "var(--foreground)" }}
            >
              <option>Daily</option>
              <option>Weekly</option>
              <option>Monthly</option>
              <option>Manual</option>
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-bold text-[#94A3B8] mb-1 uppercase">
              Backup Time
            </label>
            <input
              type="time"
              value={extraConfig.backupTime}
              onChange={(e) => updateExtraConfig("backupTime", e.target.value)}
              className="w-full rounded-xl px-3 py-2 text-sm border bg-white dark:bg-neutral-800"
              style={{ borderColor: "#E5E7EB", color: "var(--foreground)" }}
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-[#94A3B8] mb-1 uppercase">
              Retention Period (days)
            </label>
            <input
              type="number"
              value={extraConfig.retentionPeriod}
              onChange={(e) =>
                updateExtraConfig("retentionPeriod", e.target.value)
              }
              className="w-full rounded-xl px-3 py-2.5 text-sm border bg-white dark:bg-neutral-800"
              style={{ borderColor: "#E5E7EB", color: "var(--foreground)" }}
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-[#94A3B8] mb-1 uppercase">
              Storage Location
            </label>
            <select
              value={extraConfig.storageLocation}
              onChange={(e) =>
                updateExtraConfig("storageLocation", e.target.value)
              }
              className="w-full rounded-xl px-3 py-2.5 text-sm border bg-white dark:bg-neutral-800"
              style={{ borderColor: "#E5E7EB", color: "var(--foreground)" }}
            >
              <option>Google Drive</option>
              <option>AWS S3</option>
              <option>Azure</option>
              <option>Local</option>
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-bold text-[#94A3B8] mb-1 uppercase">
              Max Backup Copies
            </label>
            <input
              type="number"
              value={extraConfig.maxBackupCopies}
              onChange={(e) =>
                updateExtraConfig("maxBackupCopies", e.target.value)
              }
              className="w-full rounded-xl px-3 py-2.5 text-sm border bg-white dark:bg-neutral-800"
              style={{ borderColor: "#E5E7EB", color: "var(--foreground)" }}
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-[#94A3B8] mb-1 uppercase">
              Encryption
            </label>
            <select
              value={extraConfig.encryption}
              onChange={(e) => updateExtraConfig("encryption", e.target.value)}
              className="w-full rounded-xl px-3 py-2.5 text-sm border bg-white dark:bg-neutral-800"
              style={{ borderColor: "#E5E7EB", color: "var(--foreground)" }}
            >
              <option>AES-256</option>
              <option>None</option>
            </select>
          </div>
        </div>
        <div className="space-y-3">
          {[
            {
              key: "includeDocsInBackup",
              label: "Include Attached Documents in Backup",
            },
            { key: "compressBackup", label: "Compress Backup Files" },
            {
              key: "sendBackupReport",
              label: "Send Backup Report via Email",
            },
          ].map((item) => (
            <div key={item.key}>
              <div className="flex justify-between items-center">
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
              {item.key === "sendBackupReport" &&
                extraConfig.sendBackupReport && (
                  <input
                    type="email"
                    value={extraConfig.backupReportEmail}
                    onChange={(e) =>
                      updateExtraConfig("backupReportEmail", e.target.value)
                    }
                    className="mt-2 rounded-xl px-3 py-2 text-sm border w-full md:w-64 bg-white dark:bg-neutral-800"
                    style={{
                      borderColor: "#E5E7EB",
                      color: "var(--foreground)",
                    }}
                  />
                )}
            </div>
          ))}
        </div>
      </div>

      {/* POLICY BLOCK 3: BACKUP HISTORY */}
      <div
        className="p-4 rounded-xl mb-6 border"
        style={{ backgroundColor: "var(--card)", borderColor: "#E5E7EB" }}
      >
        <span className="block text-[11px] font-bold text-[#94A3B8] mb-3 uppercase">
          BACKUP HISTORY
        </span>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-gray-200">
                {["BACKUP DATE", "SIZE", "TYPE", "STATUS", "ACTION"].map(
                  (h) => (
                    <th
                      key={h}
                      className="py-3 px-4 text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider"
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {backupHistory.map((b, idx) => (
                <tr
                  key={idx}
                  className="border-b border-gray-100 hover:bg-[#00B87C]/[0.08] transition-all text-[13px]"
                >
                  <td className="py-3 px-4 font-medium text-gray-800 dark:text-gray-200">
                    {b.date}
                  </td>
                  <td className="py-3 px-4 text-gray-600">{b.size}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-block text-[11px] font-bold px-2 py-0.5 rounded-full ${b.type === "Auto" ? "bg-[#DCFCE7] text-[#00B87C]" : "bg-purple-100 text-purple-700"}`}
                    >
                      {b.type}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-block text-[11px] font-bold px-2 py-0.5 rounded-full ${b.status === "Success" ? "bg-[#DCFCE7] text-[#00B87C]" : "bg-red-500/10 text-red-500"}`}
                    >
                      {b.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 flex gap-2">
                    {b.status === "Success" ? (
                      <>
                        <button className="px-2 py-1 text-[11px] font-bold border border-gray-200 rounded-lg text-gray-700 bg-white hover:bg-[#00B87C]/[0.08] cursor-pointer">
                          Download
                        </button>
                        <button className="px-2 py-1 text-[11px] font-bold border border-[#D97706] rounded-lg text-[#D97706] bg-white hover:bg-amber-50 cursor-pointer">
                          Restore
                        </button>
                      </>
                    ) : (
                      <button className="px-2 py-1 text-[11px] font-bold border border-red-500 rounded-lg text-red-500 bg-white hover:bg-red-50 cursor-pointer">
                        Retry
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* POLICY BLOCK 4: RESTORE */}
      <div
        className="p-4 rounded-xl mb-6 border"
        style={{ backgroundColor: "#FEF3C7", borderColor: "#F59E0B" }}
      >
        <div className="flex items-center gap-3 mb-4">
          <AlertTriangle className="text-[#D97706]" size={24} />
          <span className="text-[13px] font-bold text-[#92400E]">
            Restoring will overwrite current data. This action cannot be undone.
          </span>
        </div>
        <button className="w-full py-3 border border-[#E5E7EB] bg-white hover:bg-[#00B87C]/[0.08] rounded-xl text-[13px] text-gray-700 font-semibold flex items-center justify-center gap-2 cursor-pointer">
          <Upload size={16} />
          Upload backup file (.zip or .sql)
        </button>
      </div>

      <div
        className="flex justify-end items-center pt-4 border-t"
        style={{ borderColor: "#F3F4F6" }}
      >
        <button
          onClick={() => showToast("Backup settings saved")}
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
