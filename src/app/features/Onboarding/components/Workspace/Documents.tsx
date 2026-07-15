import { CheckCircle2, Clock, HelpCircle, Upload } from "lucide-react";
import type { DocumentItem } from "../../types/onboarding.types";
import { XCircle } from "../shared/StatusBadge";

interface DocumentsProps {
  documents: DocumentItem[];
  uploadedDocs: number;
  handleViewDoc: (name: string) => void;
  handleRequestDoc: (name: string) => void;
  handleUploadClick: (docId: string, docName: string) => void;
  handleUploadDoc: () => void;
}

export function Documents({
  documents, uploadedDocs,
  handleViewDoc, handleRequestDoc, handleUploadClick, handleUploadDoc,
}: DocumentsProps) {
  return (
    <div className="mx-6 mb-5 p-5 bg-muted/20 border border-border rounded-2xl">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.2em]">
          Required Documents
        </h4>
        <div className="flex items-center gap-3">
          <div className="flex-1 h-[6px] w-24 bg-muted/50 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-[#8B5CF6]"
              style={{ width: `${(uploadedDocs / documents.length) * 100}%` }}
            />
          </div>
          <span className="text-[11px] font-bold text-muted-foreground">
            {uploadedDocs} / {documents.length} uploaded
          </span>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-border text-[9px] font-semibold text-muted-foreground uppercase tracking-wider">
              <th className="pb-2 pr-4">Document</th>
              <th className="pb-2 pr-4">Status</th>
              <th className="pb-2 pr-4">Uploaded By</th>
              <th className="pb-2 pr-4">Date</th>
              <th className="pb-2 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {documents.map((doc) => (
              <tr key={doc.id} className="text-[12px]">
                <td className="py-2.5 pr-4 font-bold text-foreground">{doc.name}</td>
                <td className="py-2.5 pr-4">
                  <span
                    className={`inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider ${doc.status === "uploaded" ? "text-[#00B87C]" : doc.status === "pending" ? "text-[#F59E0B]" : doc.status === "missing" ? "text-[#EF4444]" : "text-muted-foreground"}`}
                  >
                    {doc.status === "uploaded" ? <CheckCircle2 size={12} /> : doc.status === "pending" ? <Clock size={12} /> : doc.status === "missing" ? <XCircle size={12} /> : <HelpCircle size={12} />}
                    {doc.status === "uploaded" ? "Uploaded" : doc.status === "pending" ? "Pending" : doc.status === "missing" ? "Missing" : "Optional"}
                  </span>
                </td>
                <td className="py-2.5 pr-4 text-muted-foreground">{doc.uploadedBy || "—"}</td>
                <td className="py-2.5 pr-4 text-muted-foreground">{doc.date || "—"}</td>
                <td className="py-2.5 text-right">
                  {doc.status === "uploaded" ? (
                    <button onClick={() => handleViewDoc(doc.name)} className="text-[11px] font-semibold text-[#00B87C] uppercase tracking-wider hover:underline">View</button>
                  ) : doc.status === "pending" ? (
                    <button onClick={() => handleRequestDoc(doc.name)} className="text-[11px] font-semibold text-[#F59E0B] uppercase tracking-wider hover:underline">Request</button>
                  ) : doc.status === "missing" ? (
                    <button onClick={() => handleUploadClick(doc.id, doc.name)} className="text-[11px] font-semibold text-[#EF4444] uppercase tracking-wider hover:underline">Upload</button>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button
        onClick={handleUploadDoc}
        className="mt-4 flex items-center gap-2 px-4 py-2 rounded-xl border border-dashed border-border text-[11px] font-semibold text-muted-foreground uppercase tracking-wider hover:border-[#00B87C]/50 hover:text-[#00B87C] transition-all"
      >
        <Upload size={14} /> Upload Document for Employee
      </button>
    </div>
  );
}
