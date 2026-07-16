import { useEffect, useState } from "react";
import { Clock, MessageSquare, UserRound } from "lucide-react";
import { RequestDetails } from "./RequestDetails";
import type { ResignationRequest } from "./requestTypes";
import { useAuth } from "../../../context/AuthContext";
import { showToast } from "../../../components/workflow/ToastNotification";
import { createOffboardingRecord, persistOffboardingRecord } from "../services/offboardingWorkflow";

export function RequestsTab({ onCountChange }: { onCountChange?: (count: number) => void }) {
  const { user } = useAuth();
  const [requests, setRequests] = useState<ResignationRequest[]>(() => { try { return JSON.parse(localStorage.getItem("viyan_resignation_requests") || "[]"); } catch { return []; } });
  const [selected, setSelected] = useState<ResignationRequest | null>(null);
  useEffect(() => { localStorage.setItem("viyan_resignation_requests", JSON.stringify(requests)); onCountChange?.(requests.filter((request) => request.status.startsWith("pending")).length); }, [requests, onCountChange]);
  const stamp = () => ({ date: new Date().toLocaleDateString("en-US", { dateStyle: "medium" }), time: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }) });
  const update = (id: string, change: (request: ResignationRequest) => ResignationRequest) => setRequests((items) => items.map((request) => request.id === id ? change(request) : request));
  const approve = (id: string, role: string, payload?: any) => update(id, (request) => {
    const by = user?.name || role; const roleName = user?.role || role; const occurredAt = stamp();
    if (role === "Manager") return { ...request, status: "pending_hr", timeline: [...request.timeline, { id: `ev-${Date.now()}`, action: "Manager Approved", performedBy: by, role: roleName, ...occurredAt, comments: payload?.comments || "Approved and forwarded to HR." }] };
    const approved = { ...request, status: "approved" as const, lwd: payload?.lwd || request.lwd, noticePeriod: payload?.noticePeriod || request.noticePeriod, timeline: [...request.timeline, { id: `ev-${Date.now()}`, action: "HR Approved", performedBy: by, role: roleName, ...occurredAt, comments: payload?.comments || "Approved. Offboarding created automatically." }] };
    persistOffboardingRecord(createOffboardingRecord({
      name: request.employeeName, designation: request.designation, department: request.department,
      type: "Resignation", lwd: approved.lwd, noticePeriodDays: parseInt(approved.noticePeriod) || 30,
      reason: request.reason, createdBy: by, manager: request.manager, resignationDate: request.resignationDate,
      documents: [{ name: "Resignation Letter", status: "uploaded", source: "employee_exit" }],
    }));
    return approved;
  });
  const reject = (id: string, role: string, comments: string) => update(id, (request) => ({ ...request, status: "rejected", timeline: [...request.timeline, { id: `ev-${Date.now()}`, action: `${role} Rejected`, performedBy: user?.name || role, role: user?.role || role, ...stamp(), comments }] }));
  const discuss = (id: string, role: string, comments: string) => update(id, (request) => ({ ...request, timeline: [...request.timeline, { id: `ev-${Date.now()}`, action: "Discussion Initiated", performedBy: user?.name || role, role: user?.role || role, ...stamp(), comments }] }));
  const sendBack = (id: string, comments: string) => update(id, (request) => ({ ...request, status: "pending_manager", timeline: [...request.timeline, { id: `ev-${Date.now()}`, action: "Sent Back to Manager", performedBy: user?.name || "HR", role: user?.role || "HR", ...stamp(), comments }] }));
  return <><div className="grid grid-cols-1 lg:grid-cols-2 gap-5">{requests.map((request) => <button key={request.id} onClick={() => setSelected(request)} className="text-left rounded-2xl border border-border bg-card p-5 shadow-sm hover:border-[#00B87C]/60 hover:shadow-md transition-all"><div className="flex justify-between gap-3"><div className="flex gap-3"><div className="w-10 h-10 rounded-full bg-[#EDE9FE] text-[#8B5CF6] flex items-center justify-center font-black">{request.employeeName.split(" ").map((part) => part[0]).join("")}</div><div><h3 className="font-black">{request.employeeName}</h3><p className="text-xs text-muted-foreground">{request.designation} · {request.department}</p></div></div><span className="h-fit rounded-full bg-muted px-2.5 py-1 text-[10px] font-bold uppercase">{request.status.replace("_", " ")}</span></div><div className="mt-5 grid grid-cols-2 gap-3 text-xs"><p className="flex gap-1.5 text-muted-foreground"><Clock size={14}/> LWD: {request.lwd}</p><p className="flex gap-1.5 text-muted-foreground"><UserRound size={14}/> {request.manager}</p></div><div className="mt-4 pt-4 border-t border-border flex items-center justify-between text-xs font-bold text-[#00B87C]"><span>{request.status.startsWith("pending") ? "Review request" : "View workflow"}</span><MessageSquare size={15}/></div></button>)}</div>{selected && <div className="fixed inset-0 z-[200] bg-black/40 p-4 flex justify-end" onClick={() => setSelected(null)}><div className="w-full max-w-xl" onClick={(event) => event.stopPropagation()}><RequestDetails request={requests.find((request) => request.id === selected.id) || selected} onApprove={(...args) => { approve(...args); showToast("Request approved", "success", "Workflow updated."); }} onReject={(...args) => { reject(...args); showToast("Request rejected", "error", "Workflow updated."); }} onRequestDiscussion={(...args) => { discuss(...args); showToast("Discussion requested", "success", "Timeline updated."); }} onSendBack={sendBack}/></div></div>}</>;
}
