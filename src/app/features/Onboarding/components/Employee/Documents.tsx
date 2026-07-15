import { useState } from "react";
import { CheckCircle2, Clock, Upload, Eye } from "lucide-react";
import { showToast } from "../../../../components/workflow/ToastNotification";

interface DocInfo {
  id: string;
  name: string;
  status: "uploaded" | "pending";
}

interface DocumentsProps {
  onToggle: (id: string, uploaded: boolean) => void;
}

export function Documents({ onToggle }: DocumentsProps) {
  const [docs, setDocs] = useState<DocInfo[]>([
    { id: "photo", name: "Passport Size Photo", status: "pending" },
    { id: "aadhaar", name: "Aadhaar Card copy", status: "uploaded" },
    { id: "pan", name: "PAN Card copy", status: "pending" },
    { id: "degree", name: "Degree Graduation Certificate", status: "uploaded" },
  ]);

  const handleUpload = (id: string) => {
    const updated = docs.map((doc) => {
      if (doc.id === id) {
        onToggle(id, true);
        showToast("Success", "success", `${doc.name} uploaded successfully.`);
        return { ...doc, status: "uploaded" as const };
      }
      return doc;
    });
    setDocs(updated);
  };

  return (
    <div className="p-6 bg-card border border-border rounded-3xl shadow-sm space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-border">
        <h4 className="text-[11px] font-black text-foreground uppercase tracking-[0.2em]">Required Documents</h4>
        <span className="text-[11px] font-bold text-muted-foreground">
          {docs.filter((d) => d.status === "uploaded").length} / {docs.length} Uploaded
        </span>
      </div>
      <div className="space-y-3">
        {docs.map((doc) => (
          <div
            key={doc.id}
            className="flex items-center justify-between p-4 rounded-2xl border border-border bg-muted/10 hover:bg-muted/20 transition-all gap-4"
          >
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-bold text-foreground truncate">{doc.name}</p>
              <div className="flex items-center gap-2 mt-1">
                <span
                  className={`inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider ${
                    doc.status === "uploaded" ? "text-[#00B87C]" : "text-[#F59E0B]"
                  }`}
                >
                  {doc.status === "uploaded" ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                  {doc.status === "uploaded" ? "Uploaded" : "Pending Action"}
                </span>
              </div>
            </div>

            <div className="shrink-0 flex items-center gap-2">
              {doc.status === "uploaded" ? (
                <button
                  onClick={() => showToast("Info", "info", `Viewing ${doc.name} copy.`)}
                  className="p-2 border border-border hover:bg-card text-muted-foreground hover:text-foreground rounded-xl transition-all"
                  title="View Document"
                >
                  <Eye size={14} />
                </button>
              ) : (
                <button
                  onClick={() => handleUpload(doc.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary text-white text-[11px] font-semibold uppercase tracking-wider hover:opacity-90 transition-all shadow-sm"
                >
                  <Upload size={12} /> Upload
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
