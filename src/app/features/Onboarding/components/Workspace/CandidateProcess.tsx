import { useState, useEffect } from "react";
import { Check, Circle, CheckCircle2, XCircle, FileText, FileCheck, ThumbsUp, ThumbsDown } from "lucide-react";
import { showToast } from "../../../../components/workflow/ToastNotification";

interface CandidateProcessProps {
  employeeId: string;
  employeeName: string;
  employeeProgress: number;
}

export function CandidateProcess({ employeeId, employeeName }: CandidateProcessProps) {
  const [queue, setQueue] = useState<any[]>(() => JSON.parse(localStorage.getItem("viyan_onboarding_queue") || "[]"));
  const [docs, setDocs] = useState<any[]>(() => JSON.parse(localStorage.getItem("viyan_onboarding_documents") || "[]"));
  const [templates, setTemplates] = useState<any[]>(() => JSON.parse(localStorage.getItem("viyan_onboarding_templates") || "[]"));

  useEffect(() => {
    const sync = () => {
      setQueue(JSON.parse(localStorage.getItem("viyan_onboarding_queue") || "[]"));
      setDocs(JSON.parse(localStorage.getItem("viyan_onboarding_documents") || "[]"));
      setTemplates(JSON.parse(localStorage.getItem("viyan_onboarding_templates") || "[]"));
    };
    window.addEventListener("viyan:onboarding-updated", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("viyan:onboarding-updated", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const employee = queue.find((nh) => nh.id === employeeId);
  const matchedTemplate = templates.find((t) => t.id === employee?.assignedTemplateId);

  // Load candidate profile state
  const resolvedEmail = employee?.email || `${employeeName.toLowerCase().replace(/\s+/g, ".")}@viyanhr.com`;
  const profileData = JSON.parse(localStorage.getItem(`viyan_candidate_profile_${resolvedEmail}`) || "{}");
  const taskState = profileData.taskState || {};

  const personalItems = [
    { id: "addr", label: "Address Details", completed: !!taskState.addr },
    { id: "emg", label: "Emergency Contact", completed: !!taskState.emg },
    { id: "bank", label: "Bank Account Details", completed: !!taskState.bank },
    { id: "nominee", label: "Nominee Information", completed: !!taskState.nominee },
  ];

  const templateForms = matchedTemplate?.forms || [];
  const completedForms = employee?.completedForms || [];

  const employeeDocs = docs.filter((d) => d.id.startsWith(`doc-${employeeId}-`));

  // HR verification actions
  const handleVerifySection = (section: "personal" | "forms", verified: boolean) => {
    const updatedQueue = queue.map((nh) => {
      if (nh.id !== employeeId) return nh;
      if (section === "personal") {
        return { ...nh, personalDetailsVerified: verified };
      } else {
        return { ...nh, formsVerified: verified };
      }
    });
    setQueue(updatedQueue);
    localStorage.setItem("viyan_onboarding_queue", JSON.stringify(updatedQueue));
    showToast(
      verified ? "Section Verified" : "Verification Reset",
      "success",
      `The candidate's ${section === "personal" ? "personal details" : "forms & signatures"} section has been ${verified ? "verified" : "reset"}.`
    );
    window.dispatchEvent(new Event("viyan:onboarding-updated"));
  };

  const handleVerifyDocument = (docId: string, status: "verified" | "rejected") => {
    const updatedDocs = docs.map((d) =>
      d.id === docId
        ? { ...d, verificationStatus: status }
        : d
    );
    setDocs(updatedDocs);
    localStorage.setItem("viyan_onboarding_documents", JSON.stringify(updatedDocs));
    showToast(
      status === "verified" ? "Document Approved" : "Document Rejected",
      status === "verified" ? "success" : "error",
      `Document verification status updated successfully.`
    );
    window.dispatchEvent(new Event("viyan:onboarding-updated"));
  };

  // Calculate overall candidate completion progress
  const allPersonalDone = personalItems.filter((i) => i.completed).length;
  const allFormsDone = templateForms.filter((f: any) => completedForms.includes(f.id)).length;
  const allDocsUploaded = employeeDocs.filter((d) => d.status === "uploaded").length;

  const totalTasks = personalItems.length + templateForms.length + employeeDocs.length;
  const completedTasks = allPersonalDone + allFormsDone + allDocsUploaded;
  const progressPct = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="px-6 py-6 space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-border">
        <div>
          <h4 className="text-[12px] font-black text-muted-foreground uppercase tracking-widest">
            Candidate Portal Review
          </h4>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            Review and verify candidate-submitted setup data, signed forms, and uploads
          </p>
        </div>
        <div className="text-right">
          <span className="text-[13px] font-black text-[#00B87C] block">{progressPct}% Setup Complete</span>
          <span className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wider">
            Linked to: {matchedTemplate?.name || "No Template"}
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-[#00B87C] rounded-full transition-all duration-500"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          {/* PERSONAL DETAILS SECTION */}
          <div className="p-5 bg-card border border-border rounded-2xl shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-border/60">
              <div>
                <h5 className="text-[13px] font-black text-foreground uppercase tracking-wider">Personal Details</h5>
                <span className="text-[10px] text-muted-foreground font-semibold">
                  {allPersonalDone} / {personalItems.length} Filled
                </span>
              </div>
              <div>
                {employee?.personalDetailsVerified ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-[#00B87C] border border-[#00B87C]/20 text-[10px] font-black uppercase tracking-wider">
                    <CheckCircle2 size={12} /> Verified by HR
                  </span>
                ) : allPersonalDone === personalItems.length ? (
                  <button
                    onClick={() => handleVerifySection("personal", true)}
                    className="px-3 py-1 rounded-xl bg-[#00B87C] text-white text-[10px] font-black uppercase tracking-wider hover:opacity-90 transition-all cursor-pointer"
                  >
                    Approve & Verify
                  </button>
                ) : (
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider bg-muted px-2 py-0.5 rounded">
                    Awaiting Candidate
                  </span>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {personalItems.map((item) => (
                <div
                  key={item.id}
                  className={`flex items-center justify-between p-3 rounded-xl border ${
                    item.completed ? "bg-muted/30 border-border" : "bg-card border-border border-dashed opacity-60"
                  }`}
                >
                  <span className="text-[12px] font-bold text-foreground">{item.label}</span>
                  {item.completed ? (
                    <CheckCircle2 size={16} className="text-[#00B87C]" />
                  ) : (
                    <Circle size={16} className="text-muted-foreground/30" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* FORMS & SIGNATURES SECTION */}
          <div className="p-5 bg-card border border-border rounded-2xl shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-border/60">
              <div>
                <h5 className="text-[13px] font-black text-foreground uppercase tracking-wider">Forms & Signatures</h5>
                <span className="text-[10px] text-muted-foreground font-semibold">
                  {allFormsDone} / {templateForms.length} Signed
                </span>
              </div>
              <div>
                {employee?.formsVerified ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-[#00B87C] border border-[#00B87C]/20 text-[10px] font-black uppercase tracking-wider">
                    <CheckCircle2 size={12} /> Verified by HR
                  </span>
                ) : allFormsDone === templateForms.length && templateForms.length > 0 ? (
                  <button
                    onClick={() => handleVerifySection("forms", true)}
                    className="px-3 py-1 rounded-xl bg-[#00B87C] text-white text-[10px] font-black uppercase tracking-wider hover:opacity-90 transition-all cursor-pointer"
                  >
                    Approve & Verify
                  </button>
                ) : (
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider bg-muted px-2 py-0.5 rounded">
                    Awaiting Candidate
                  </span>
                )}
              </div>
            </div>
            <div className="space-y-2">
              {templateForms.map((form: any) => {
                const complete = completedForms.includes(form.id);
                return (
                  <div
                    key={form.id}
                    className={`flex items-center justify-between p-3 rounded-xl border ${
                      complete ? "bg-muted/30 border-border" : "bg-card border-dashed border-border opacity-60"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <FileText size={16} className="text-[#F59E0B]" />
                      <span className="text-[12px] font-bold text-foreground">{form.name}</span>
                    </div>
                    {complete ? (
                      <span className="text-[11px] font-black text-[#00B87C] uppercase tracking-wider">✓ Signed</span>
                    ) : (
                      <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Pending</span>
                    )}
                  </div>
                );
              })}
              {templateForms.length === 0 && (
                <p className="text-xs text-muted-foreground italic text-center py-2">No required forms configured.</p>
              )}
            </div>
          </div>
        </div>

        {/* DOCUMENTS & UPLOADS SECTION */}
        <div className="p-5 bg-card border border-border rounded-2xl shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-border/60">
            <div>
              <h5 className="text-[13px] font-black text-foreground uppercase tracking-wider">Uploaded Documents</h5>
              <span className="text-[10px] text-muted-foreground font-semibold">
                {employeeDocs.filter((d) => d.verificationStatus === "verified").length} / {employeeDocs.length} Verified
              </span>
            </div>
          </div>
          <div className="divide-y divide-border/60">
            {employeeDocs.map((doc) => {
              const isUploaded = doc.status === "uploaded";
              const isVerified = doc.verificationStatus === "verified";
              const isRejected = doc.verificationStatus === "rejected";

              return (
                <div key={doc.id} className="py-4 flex items-center justify-between first:pt-0 last:pb-0 gap-4 flex-wrap">
                  <div>
                    <strong className="text-[12px] text-foreground block">{doc.name}</strong>
                    <span className="text-[10px] text-muted-foreground font-semibold uppercase">
                      Mandatory: {doc.mandatory ? "Yes" : "No"} · Max {doc.maxSize || 5}MB
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    {/* Badge */}
                    {isVerified ? (
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-[#00B87C] border border-[#00B87C]/20 text-[9px] font-black uppercase tracking-wider">
                        Approved ✓
                      </span>
                    ) : isRejected ? (
                      <span className="px-2.5 py-0.5 rounded-full bg-red-50 text-red-500 border border-red-500/20 text-[9px] font-black uppercase tracking-wider">
                        Rejected ✗
                      </span>
                    ) : isUploaded ? (
                      <span className="px-2.5 py-0.5 rounded-full bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/20 text-[9px] font-black uppercase tracking-wider">
                        Uploaded
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full bg-muted text-muted-foreground text-[9px] font-black uppercase tracking-wider">
                        Pending
                      </span>
                    )}

                    {/* HR Actions */}
                    {isUploaded && !isVerified && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleVerifyDocument(doc.id, "verified")}
                          title="Approve Document"
                          className="p-1.5 rounded-lg bg-emerald-500/10 text-[#00B87C] hover:bg-emerald-500/20 transition-all cursor-pointer"
                        >
                          <ThumbsUp size={13} />
                        </button>
                        <button
                          onClick={() => handleVerifyDocument(doc.id, "rejected")}
                          title="Reject Document"
                          className="p-1.5 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-all cursor-pointer"
                        >
                          <ThumbsDown size={13} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            {employeeDocs.length === 0 && (
              <p className="text-xs text-muted-foreground italic text-center py-6">No required document uploads configured.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
