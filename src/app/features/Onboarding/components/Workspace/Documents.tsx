import React from "react";
import { CheckCircle2, Clock, HelpCircle, Upload, Eye, RefreshCw, AlertCircle } from "lucide-react";
import type { DocumentItem } from "../../types/onboarding.types";
import { XCircle } from "../shared/StatusBadge";
import { PermissionGate } from "../../../../shared/permission-engine/PermissionGate";
import { P } from "../../../../shared/permission-engine/permissions";

interface DocumentsProps {
  documents: DocumentItem[];
  uploadedDocs: number;
  handleViewDoc: (name: string) => void;
  handleRequestDoc: (name: string) => void;
  handleUploadClick: (docId: string, docName: string) => void;
  handleUploadDoc: () => void;
}

export function Documents({
  documents,
  uploadedDocs,
  handleViewDoc,
  handleRequestDoc,
  handleUploadClick,
  handleUploadDoc,
}: DocumentsProps) {
  const totalCount = documents.length || 1;
  const progressPercent = Math.round((uploadedDocs / totalCount) * 100);

  return (
    <div className="mx-6 mb-5 p-5 bg-muted/20 border border-border rounded-2xl">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.2em]">
          Required Documents & File Uploads
        </h4>
        <div className="flex items-center gap-3">
          <div className="flex-1 h-[6px] w-28 bg-muted/50 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-[#8B5CF6] transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="text-[11px] font-bold text-muted-foreground">
            {uploadedDocs} / {documents.length} uploaded ({progressPercent}%)
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-border text-[9px] font-semibold text-muted-foreground uppercase tracking-wider">
              <th className="pb-2 pr-4">Document</th>
              <th className="pb-2 pr-4">Size & Type</th>
              <th className="pb-2 pr-4">Status</th>
              <th className="pb-2 pr-4">Uploaded By</th>
              <th className="pb-2 pr-4">Date</th>
              <th className="pb-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {documents.map((doc) => (
              <tr key={doc.id} className="text-[12px]">
                <td className="py-3 pr-4 font-bold text-foreground">
                  <div>
                    <span>{doc.name}</span>
                    {doc.fileName && doc.fileName !== doc.name && (
                      <span className="block text-[10px] text-muted-foreground font-normal">
                        {doc.fileName}
                      </span>
                    )}
                  </div>
                </td>
                <td className="py-3 pr-4 text-muted-foreground font-medium">
                  {doc.fileSize ? (
                    <span className="inline-flex items-center gap-1 bg-muted px-2 py-0.5 rounded text-[10px] font-bold">
                      {doc.fileType || "FILE"} · {doc.fileSize}
                    </span>
                  ) : (
                    <span className="text-[11px] text-muted-foreground">—</span>
                  )}
                </td>
                <td className="py-3 pr-4">
                  <div className="flex flex-col gap-0.5">
                    <span
                      className={`inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider ${
                        doc.status === "uploaded"
                          ? "text-[#00B87C]"
                          : doc.status === "pending"
                            ? "text-[#F59E0B]"
                            : doc.status === "missing"
                              ? "text-[#EF4444]"
                              : "text-muted-foreground"
                      }`}
                    >
                      {doc.status === "uploaded" ? (
                        <CheckCircle2 size={12} />
                      ) : doc.status === "pending" ? (
                        <Clock size={12} />
                      ) : doc.status === "missing" ? (
                        <XCircle size={12} />
                      ) : (
                        <HelpCircle size={12} />
                      )}
                      {doc.status === "uploaded"
                        ? "Uploaded"
                        : doc.status === "pending"
                          ? "Pending"
                          : doc.status === "missing"
                            ? "Missing"
                            : "Optional"}
                    </span>
                    {doc.verificationStatus && (
                      <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
                        {doc.verificationStatus === "verified"
                          ? "✓ Verified"
                          : doc.verificationStatus === "rejected"
                            ? "✗ Rejected"
                            : "Awaiting Verification"}
                      </span>
                    )}
                  </div>
                </td>
                <td className="py-3 pr-4 text-muted-foreground">
                  {doc.uploadedBy || "—"}
                </td>
                <td className="py-3 pr-4 text-muted-foreground">
                  {doc.date || "—"}
                </td>
                <td className="py-3 text-right space-x-2">
                  {doc.status === "uploaded" ? (
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleViewDoc(doc.name)}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#00B87C] uppercase tracking-wider hover:underline cursor-pointer"
                      >
                        <Eye size={12} /> View
                      </button>
                      <button
                        onClick={() => handleUploadClick(doc.id, doc.name)}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#8B5CF6] uppercase tracking-wider hover:underline cursor-pointer"
                        title="Replace document"
                      >
                        <RefreshCw size={11} /> Replace
                      </button>
                    </div>
                  ) : doc.status === "pending" ? (
                    <button
                      onClick={() => handleRequestDoc(doc.name)}
                      className="text-[11px] font-semibold text-[#F59E0B] uppercase tracking-wider hover:underline cursor-pointer"
                    >
                      Request
                    </button>
                  ) : doc.status === "missing" ? (
                    <button
                      onClick={() => handleUploadClick(doc.id, doc.name)}
                      className="text-[11px] font-semibold text-[#EF4444] uppercase tracking-wider hover:underline cursor-pointer"
                    >
                      Upload
                    </button>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <PermissionGate requires={P.ONBOARDING_MANAGE}>
        <button
          onClick={handleUploadDoc}
          className="mt-4 flex items-center gap-2 px-4 py-2 rounded-xl border border-dashed border-border text-[11px] font-semibold text-muted-foreground uppercase tracking-wider hover:border-[#8B5CF6]/50 hover:text-[#8B5CF6] transition-all cursor-pointer"
        >
          <Upload size={14} /> Upload Document for Employee
        </button>
      </PermissionGate>
    </div>
  );
}
