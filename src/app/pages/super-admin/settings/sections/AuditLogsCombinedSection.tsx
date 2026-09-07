import React, { useState } from "react";
import { AuditLogsSection } from "./AuditLogsSection";
import { BackupRestoreSection } from "./BackupRestoreSection";
import { DataImportExportSection } from "./DataImportExportSection";
import { usePermissions } from "../../../../shared/permission-engine/PermissionContext";
import { P } from "../../../../shared/permission-engine/permissions";

export function AuditLogsCombinedSection() {
  const { hasPermissionKey } = usePermissions();
  const isPlatformAdmin = hasPermissionKey(P.PLATFORM_ADMIN_FULL);
  const [activeTab, setActiveTab] = useState<"logs" | "backup" | "import_export">("logs");

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div>
        <h2 className="text-lg font-bold text-foreground">
          Audit Trail & Data Governance
        </h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          Inspect system activity audit logs, automated database backups, and data import/export history.
        </p>
      </div>

      {/* HORIZONTAL TABS */}
      <div className="flex items-center gap-2 border-b border-border pb-3">
        <button
          type="button"
          onClick={() => setActiveTab("logs")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === "logs"
              ? "bg-[#00B87C] text-white shadow-xs"
              : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
        >
          Audit Logs
        </button>
        {isPlatformAdmin && (
          <button
            type="button"
            onClick={() => setActiveTab("backup")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "backup"
                ? "bg-[#00B87C] text-white shadow-xs"
                : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            Backup & Restore
          </button>
        )}
        <button
          type="button"
          onClick={() => setActiveTab("import_export")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === "import_export"
              ? "bg-[#00B87C] text-white shadow-xs"
              : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
        >
          Data Import / Export
        </button>
      </div>

      {/* TAB CONTENT */}
      <div>
        {activeTab === "logs" && <AuditLogsSection />}
        {activeTab === "backup" && isPlatformAdmin && <BackupRestoreSection />}
        {activeTab === "import_export" && <DataImportExportSection />}
      </div>
    </div>
  );
}

