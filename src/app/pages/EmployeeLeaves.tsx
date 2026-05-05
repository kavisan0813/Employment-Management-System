import { useState, useMemo } from "react";
import {
  Calendar as CalendarIcon,
  Plus,
  ChevronLeft,
  ChevronRight,
  X,
  Paperclip,
  AlertCircle,
  CalendarX,
  Clock,
  CheckCircle2,
  FileText,
  User,
  MoreVertical,
  History,
  Info
} from "lucide-react";
import { showToast } from "../components/workflow/ToastNotification";
import { StatusBadge } from "../components/workflow/StatusBadge";
import { motion, AnimatePresence } from "framer-motion";

const TABS = ["My Requests", "History", "Policy"];

const LEAVE_TYPES = [
  { id: "CL", name: "Casual Leave", total: 12, used: 6, color: "var(--primary)", bg: "var(--secondary)" },
  { id: "EL", name: "Earned Leave", total: 24, used: 18, color: "var(--primary)", bg: "var(--secondary)" },
  { id: "SL", name: "Sick Leave", total: 12, used: 8, color: "#14B8A6", bg: "rgba(20, 184, 166, 0.1)" },
  { id: "CO", name: "Comp Off", total: 5, used: 2, color: "#8B5CF6", bg: "rgba(139, 92, 246, 0.1)" },
];

export function EmployeeLeaves() {
  const [activeTab, setActiveTab] = useState("My Requests");
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [requests, setRequests] = useState([
    { id: "LR-1024", type: "CL", from: "2026-04-18", to: "2026-04-20", days: 3, reason: "Family event in hometown", status: "Pending", appliedOn: "Apr 12, 2026" },
    { id: "LR-1018", type: "EL", from: "2026-05-10", to: "2026-05-15", days: 6, reason: "Annual vacation", status: "Approved", appliedOn: "Apr 05, 2026" },
  ]);

  const handleApplyLeave = (newLeave: any) => {
    const leaveEntry = {
      id: `LR-${Math.floor(1000 + Math.random() * 9000)}`,
      ...newLeave,
      status: "Pending",
      appliedOn: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
    };
    setRequests([leaveEntry, ...requests]);
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-700 max-w-[1400px] mx-auto pb-10">

      {/* ─── Page Header ─────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-4">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-[12px] bg-amber-500/10 flex items-center justify-center shadow-sm border border-amber-500/20">
            <CalendarX size={22} className="text-amber-500" />
          </div>
          <div>
            <h1 className="text-[26px] font-black text-foreground leading-none mb-1">My Leaves</h1>
            <p className="text-[13px] font-bold text-muted-foreground">Manage your absences and track balance</p>
          </div>
        </div>
        <button
          onClick={() => setShowApplyModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold transition-all bg-primary text-white shadow-lg shadow-emerald-500/20 hover:opacity-95 active:scale-[0.98]"
        >
          <Plus size={18} /> Apply Leave
        </button>
      </div>

      {/* ─── Leave Balance Cards ──────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {LEAVE_TYPES.map((type, i) => (
          <div key={i} className="bg-card p-6 rounded-[24px] border border-border shadow-sm flex flex-col items-center group hover:border-primary transition-all duration-300">
            <div className="w-full flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center border border-border shadow-inner" style={{ backgroundColor: type.bg }}>
                <span className="text-[14px] font-black" style={{ color: type.color }}>{type.id}</span>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest leading-none mb-1">{type.name}</p>
                <div className="flex items-center gap-1 justify-end">
                  <span className="text-[20px] font-black text-foreground">{type.total - type.used}</span>
                  <span className="text-[12px] font-bold text-muted-foreground">/ {type.total}</span>
                </div>
              </div>
            </div>

            <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden mt-2">
              <div 
                className="h-full rounded-full transition-all duration-1000" 
                style={{ 
                  backgroundColor: type.color, 
                  width: `${((type.total - type.used) / type.total) * 100}%` 
                }}
              />
            </div>
            <div className="w-full flex justify-between mt-2">
              <span className="text-[10px] font-bold text-muted-foreground">REMAINING</span>
              <span className="text-[10px] font-bold text-muted-foreground">{((type.total - type.used) / type.total * 100).toFixed(0)}%</span>
            </div>
          </div>
        ))}
      </div>

      {/* ─── Tab Bar ─────────────────────────────────────────────── */}
      <div className="bg-card rounded-[16px] border border-border shadow-sm p-1 flex items-center gap-1 w-fit">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-8 py-3 rounded-[12px] text-[14px] transition-all whitespace-nowrap ${activeTab === tab
              ? "bg-primary text-white font-black shadow-md shadow-primary/20"
              : "text-muted-foreground font-bold hover:bg-secondary"
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ─── Tab Content ──────────────────────────────────────────── */}
      <div className="min-h-[400px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === "My Requests" && (
              <div className="bg-card rounded-[24px] border border-border shadow-sm overflow-hidden">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-secondary/30">
                      <th className="px-6 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Request ID</th>
                      <th className="px-6 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Leave Type</th>
                      <th className="px-6 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Duration</th>
                      <th className="px-6 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Days</th>
                      <th className="px-6 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Status</th>
                      <th className="px-6 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {requests.map((req, i) => (
                      <tr 
                        key={i} 
                        className="hover:bg-secondary/50 transition-colors cursor-pointer"
                        onClick={() => setSelectedRequest(req)}
                      >
                        <td className="px-6 py-4 text-[13px] font-black text-foreground">{req.id}</td>
                        <td className="px-6 py-4">
                          <span className="px-2.5 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest border border-primary/20">{req.type}</span>
                        </td>
                        <td className="px-6 py-4 flex flex-col">
                          <span className="text-[13px] font-bold text-foreground">{new Date(req.from).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – {new Date(req.to).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                          <span className="text-[11px] text-muted-foreground">Applied {req.appliedOn}</span>
                        </td>
                        <td className="px-6 py-4 text-[13px] font-black text-foreground">{req.days} days</td>
                        <td className="px-6 py-4">
                          <StatusBadge status={req.status} />
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button className="p-2 hover:bg-card rounded-lg transition-colors text-muted-foreground">
                            <MoreVertical size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {activeTab === "History" && <HistoryTab />}
            {activeTab === "Policy" && <PolicyTab />}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ─── Modals & Drawers ─────────────────────────────────────── */}
      <ApplyLeaveModal 
        isOpen={showApplyModal} 
        onClose={() => setShowApplyModal(false)} 
        onSubmit={handleApplyLeave}
      />

      <LeaveDetailDrawer 
        request={selectedRequest} 
        onClose={() => setSelectedRequest(null)} 
      />

    </div>
  );
}

/* ─── Components ─────────────────────────────────────────────────── */

function HistoryTab() {
  return (
    <div className="bg-card rounded-[24px] border border-border shadow-sm p-12 text-center">
      <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
        <History size={32} className="text-muted-foreground" />
      </div>
      <h3 className="text-lg font-black text-foreground">Leave History</h3>
      <p className="text-[14px] font-medium text-muted-foreground max-w-sm mx-auto mt-2">Historical leave records will be archived here after the current financial year ends.</p>
    </div>
  );
}

function PolicyTab() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {[
        { title: "Annual Leave Policy", icon: Info, color: "var(--primary)" },
        { title: "Medical Leave Policy", icon: Info, color: "#14B8A6" },
      ].map((p, i) => (
        <div key={i} className="bg-card rounded-[24px] p-8 border border-border shadow-sm hover:border-primary transition-all group">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-secondary">
              <p.icon size={24} style={{ color: p.color }} />
            </div>
            <h4 className="text-[16px] font-black text-foreground">{p.title}</h4>
          </div>
          <p className="text-[13px] font-medium text-muted-foreground leading-relaxed mb-6">
            Employees are eligible for 24 days of annual leave per year, accrued at 2 days per month. Leave must be applied at least 7 days in advance for durations exceeding 3 days.
          </p>
          <button className="text-[12px] font-black text-primary uppercase tracking-widest hover:underline">Download PDF</button>
        </div>
      ))}
    </div>
  );
}

export function ApplyLeaveModal({ isOpen, onClose, onSubmit }: { isOpen: boolean; onClose: () => void; onSubmit: (data: any) => void }) {
  const [formData, setFormData] = useState({
    type: "CL",
    from: "",
    to: "",
    reason: "",
    attachment: null as File | null
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const calculateDays = useMemo(() => {
    if (!formData.from || !formData.to) return 0;
    const start = new Date(formData.from);
    const end = new Date(formData.to);
    if (end < start) return 0;
    
    let count = 0;
    const curDate = new Date(start);
    while (curDate <= end) {
      const dayOfWeek = curDate.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) count++;
      curDate.setDate(curDate.getDate() + 1);
    }
    return count;
  }, [formData.from, formData.to]);

  const handleSubmit = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.from) newErrors.from = "Start date is required";
    if (!formData.to) newErrors.to = "End date is required";
    if (!formData.reason) newErrors.reason = "Reason is required";
    if (new Date(formData.to) < new Date(formData.from)) newErrors.to = "End date cannot be before start date";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit({
      type: formData.type,
      from: formData.from,
      to: formData.to,
      days: calculateDays,
      reason: formData.reason
    });

    showToast("Request Submitted", "success", "Your leave request is pending approval.");
    onClose();
    setFormData({ type: "CL", from: "", to: "", reason: "", attachment: null });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-background/60 backdrop-blur-sm" />
      <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative bg-card w-full max-w-[500px] rounded-[32px] shadow-2xl overflow-hidden flex flex-col border border-border">
        
        <div className="p-6 border-b border-border flex items-center justify-between bg-secondary/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
              <CalendarIcon size={20} />
            </div>
            <h3 className="text-[18px] font-black text-foreground">Apply Leave</h3>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-card rounded-xl transition-colors text-muted-foreground"><X size={20} /></button>
        </div>

        <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto no-scrollbar">
          
          <div className="space-y-2">
            <label className="text-[11px] font-black text-muted-foreground uppercase tracking-widest ml-1">Leave Type</label>
            <div className="grid grid-cols-4 gap-2">
              {["CL", "EL", "SL", "CO"].map(t => (
                <button 
                  key={t}
                  onClick={() => setFormData({ ...formData, type: t })}
                  className={`py-3 rounded-xl text-[13px] font-black transition-all border ${formData.type === t ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' : 'bg-background text-muted-foreground border-border hover:border-primary/40'}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[11px] font-black text-muted-foreground uppercase tracking-widest ml-1">From Date</label>
              <input 
                type="date" 
                value={formData.from}
                onChange={(e) => setFormData({ ...formData, from: e.target.value })}
                className={`w-full bg-background border rounded-2xl px-5 py-3 text-[14px] font-bold text-foreground focus:outline-none focus:border-primary transition-all shadow-inner ${errors.from ? 'border-rose-500' : 'border-border'}`}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-black text-muted-foreground uppercase tracking-widest ml-1">To Date</label>
              <input 
                type="date" 
                value={formData.to}
                onChange={(e) => setFormData({ ...formData, to: e.target.value })}
                className={`w-full bg-background border rounded-2xl px-5 py-3 text-[14px] font-bold text-foreground focus:outline-none focus:border-primary transition-all shadow-inner ${errors.to ? 'border-rose-500' : 'border-border'}`}
              />
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-primary/5 rounded-2xl border border-primary/20">
            <div className="flex items-center gap-3">
              <Clock size={18} className="text-primary" />
              <span className="text-[14px] font-black text-primary">{calculateDays} Working Days</span>
            </div>
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Excl. Weekends</span>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-black text-muted-foreground uppercase tracking-widest ml-1">Reason</label>
            <textarea 
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              placeholder="Why are you taking this leave?" 
              className={`w-full bg-background border rounded-2xl px-5 py-4 text-[14px] font-bold text-foreground focus:outline-none focus:border-primary transition-all h-28 resize-none shadow-inner ${errors.reason ? 'border-rose-500' : 'border-border'}`}
            />
          </div>

          <div className="flex items-center justify-between p-4 border-2 border-dashed border-border rounded-2xl group hover:border-primary/40 cursor-pointer transition-all">
            <div className="flex items-center gap-3">
              <Paperclip size={18} className="text-muted-foreground group-hover:text-primary transition-colors" />
              <span className="text-[13px] font-bold text-muted-foreground">Attach Document (Optional)</span>
            </div>
            <span className="text-[11px] font-bold text-muted-foreground/40">PDF, JPG</span>
          </div>
        </div>

        <div className="p-6 bg-secondary/30 flex items-center gap-4 border-t border-border">
          <button onClick={onClose} className="flex-1 py-4 text-[13px] font-black text-muted-foreground hover:text-foreground transition-colors uppercase tracking-widest">Cancel</button>
          <button 
            onClick={handleSubmit}
            className="flex-[2] py-4 bg-primary text-white rounded-2xl text-[14px] font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:opacity-95 transition-all"
          >
            Submit Leave Request
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function LeaveDetailDrawer({ request, onClose }: { request: any; onClose: () => void }) {
  if (!request) return null;

  return (
    <div className="fixed inset-0 z-[2000] flex justify-end">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-background/60 backdrop-blur-sm" />
      <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 25, stiffness: 200 }} className="relative bg-card w-full max-w-[450px] h-full shadow-2xl border-l border-border flex flex-col">
        <div className="p-8 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              <FileText size={24} />
            </div>
            <div>
              <h3 className="text-lg font-black text-foreground">{request.id}</h3>
              <p className="text-[12px] font-bold text-muted-foreground">Applied on {request.appliedOn}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-secondary rounded-xl transition-colors"><X size={24} /></button>
        </div>

        <div className="p-8 space-y-8 overflow-y-auto no-scrollbar flex-1">
          <div className="grid grid-cols-2 gap-6">
            <DetailItem label="Leave Type" value={request.type} />
            <DetailItem label="Status" value={<StatusBadge status={request.status} />} />
            <DetailItem label="From Date" value={new Date(request.from).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} />
            <DetailItem label="To Date" value={new Date(request.to).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} />
            <DetailItem label="Total Days" value={`${request.days} Working Days`} />
          </div>

          <div className="space-y-3">
            <label className="text-[11px] font-black text-muted-foreground uppercase tracking-widest">Reason</label>
            <p className="text-[14px] font-medium text-foreground bg-secondary/50 p-6 rounded-2xl border border-border leading-relaxed italic">
              "{request.reason}"
            </p>
          </div>

          <div className="space-y-4">
            <label className="text-[11px] font-black text-muted-foreground uppercase tracking-widest">Approval Timeline</label>
            <div className="space-y-6 relative ml-2">
              <div className="absolute top-0 bottom-0 left-3 w-[1px] bg-border"></div>
              
              <TimelineItem 
                icon={<Plus size={14} />} 
                title="Leave Applied" 
                subtitle={`by Priya Sharma on ${request.appliedOn}`} 
                status="completed" 
              />
              <TimelineItem 
                icon={<User size={14} />} 
                title="Manager Review" 
                subtitle="Awaiting review from Sameer Khanna" 
                status={request.status === 'Pending' ? 'current' : 'completed'} 
              />
              <TimelineItem 
                icon={<CheckCircle2 size={14} />} 
                title="Final Approval" 
                subtitle="HR Department validation" 
                status="upcoming" 
              />
            </div>
          </div>
        </div>

        <div className="p-8 bg-secondary/30 border-t border-border flex gap-4">
          <button className="flex-1 py-4 bg-background border border-border rounded-2xl text-[13px] font-black text-rose-500 hover:bg-rose-50 transition-all">Cancel Request</button>
          <button className="flex-1 py-4 bg-background border border-border rounded-2xl text-[13px] font-black text-foreground hover:bg-secondary transition-all">Download Receipt</button>
        </div>
      </motion.div>
    </div>
  );
}

function DetailItem({ label, value }: { label: string; value: any }) {
  return (
    <div className="space-y-1">
      <p className="text-[11px] font-black text-muted-foreground uppercase tracking-widest">{label}</p>
      <div className="text-[14px] font-bold text-foreground">{value}</div>
    </div>
  );
}

function TimelineItem({ icon, title, subtitle, status }: { icon: any; title: string; subtitle: string; status: 'completed' | 'current' | 'upcoming' }) {
  const colors = {
    completed: "bg-primary text-white border-primary",
    current: "bg-amber-500 text-white border-amber-500 animate-pulse",
    upcoming: "bg-secondary text-muted-foreground border-border"
  };

  return (
    <div className="flex gap-4 relative z-10">
      <div className={`w-6 h-6 rounded-full flex items-center justify-center border ${colors[status]} shadow-sm`}>
        {icon}
      </div>
      <div>
        <h4 className={`text-[13px] font-black ${status === 'upcoming' ? 'text-muted-foreground' : 'text-foreground'}`}>{title}</h4>
        <p className="text-[11px] font-medium text-muted-foreground">{subtitle}</p>
      </div>
    </div>
  );
}
