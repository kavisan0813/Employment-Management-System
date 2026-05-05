import { useState } from "react";
import {
  FileText,
  Search,
  ChevronRight,
  Filter,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { StatusBadge } from "../components/workflow/StatusBadge";

interface HRRequest {
  id: string;
  type: string;
  subject: string;
  submittedDate: string;
  status: "Approved" | "Pending" | "Rejected";
  priority: "Low" | "Medium" | "High";
  description: string;
}

const MOCK_REQUESTS: HRRequest[] = [
  {
    id: "REQ-2026-001",
    type: "Profile Update",
    subject: "Change of Mobile Number",
    submittedDate: "2026-04-10",
    status: "Pending",
    priority: "Medium",
    description: "Updating my primary contact number to +91 98765 43210."
  },
  {
    id: "REQ-2026-002",
    type: "Address Change",
    subject: "Permanent Address Update",
    submittedDate: "2026-03-25",
    status: "Approved",
    priority: "Low",
    description: "Moved to a new apartment in Velachery."
  },
  {
    id: "REQ-2026-003",
    type: "Bank Details",
    subject: "Salary Account Update",
    submittedDate: "2026-03-15",
    status: "Rejected",
    priority: "High",
    description: "Requesting to change salary disbursement to my HDFC account."
  }
];

export default function EmployeeHRRequests() {
  const [requests] = useState<HRRequest[]>(MOCK_REQUESTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRequest, setSelectedRequest] = useState<HRRequest | null>(null);

  const filteredRequests = requests.filter(req => 
    req.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    req.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-700 max-w-[1400px] mx-auto pb-10">
      {/* ─── Page Header ─────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-[12px] bg-secondary flex items-center justify-center shadow-sm">
            <FileText size={22} className="text-primary" />
          </div>
          <div>
            <h1 className="text-[26px] font-black text-foreground leading-none">My HR Requests</h1>
            <p className="text-[13px] font-bold text-muted-foreground mt-1.5">Track and manage your administrative requests</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" size={18} />
            <input 
              type="text" 
              placeholder="Search requests..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-card border border-border rounded-xl pl-11 pr-4 py-2.5 text-[14px] font-bold focus:outline-none focus:border-primary transition-all w-[280px] shadow-sm"
            />
          </div>
          <button className="p-2.5 rounded-xl border border-border bg-card text-muted-foreground hover:text-primary hover:border-primary transition-all shadow-sm active:scale-95">
            <Filter size={20} />
          </button>
        </div>
      </div>

      {/* ─── Stats Row ────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "TOTAL REQUESTS", value: "12", icon: FileText, color: "var(--primary)", bg: "var(--secondary)" },
          { label: "PENDING", value: "3", icon: Clock, color: "#F59E0B", bg: "#F59E0B15" },
          { label: "APPROVED", value: "8", icon: CheckCircle2, color: "#10B981", bg: "#10B98115" },
          { label: "REJECTED", value: "1", icon: XCircle, color: "#EF4444", bg: "#EF444415" },
        ].map(stat => (
          <div key={stat.label} className="bg-card p-6 rounded-[24px] border border-border shadow-sm flex items-center gap-5">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner" style={{ backgroundColor: stat.bg }}>
              <stat.icon size={24} style={{ color: stat.color }} />
            </div>
            <div>
              <p className="text-[11px] font-black text-muted-foreground uppercase tracking-widest mb-0.5">{stat.label}</p>
              <p className="text-[28px] font-black" style={{ color: stat.color }}>{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ─── Requests Table ──────────────────────────────────────── */}
      <div className="bg-card rounded-[24px] border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-secondary/30">
                <th className="px-6 py-5 text-[11px] font-black text-muted-foreground uppercase tracking-widest">Request Details</th>
                <th className="px-6 py-5 text-[11px] font-black text-muted-foreground uppercase tracking-widest">Type</th>
                <th className="px-6 py-5 text-[11px] font-black text-muted-foreground uppercase tracking-widest text-center">Priority</th>
                <th className="px-6 py-5 text-[11px] font-black text-muted-foreground uppercase tracking-widest">Submitted Date</th>
                <th className="px-6 py-5 text-[11px] font-black text-muted-foreground uppercase tracking-widest">Status</th>
                <th className="px-6 py-5 text-[11px] font-black text-muted-foreground uppercase tracking-widest text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredRequests.map((req) => (
                <tr 
                  key={req.id} 
                  className="hover:bg-secondary/20 transition-colors group cursor-pointer"
                  onClick={() => setSelectedRequest(req)}
                >
                  <td className="px-6 py-5">
                    <div>
                      <p className="text-[14px] font-black text-foreground group-hover:text-primary transition-colors">{req.subject}</p>
                      <p className="text-[12px] font-bold text-muted-foreground">{req.id}</p>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="px-3 py-1 rounded-lg bg-secondary text-primary text-[11px] font-black uppercase tracking-wider border border-primary/10">
                      {req.type}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <span className={`text-[12px] font-black ${
                      req.priority === 'High' ? 'text-rose-500' : 
                      req.priority === 'Medium' ? 'text-amber-500' : 
                      'text-emerald-500'
                    }`}>
                      {req.priority}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar size={14} />
                      <span className="text-[13px] font-bold">{req.submittedDate}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <StatusBadge status={req.status} />
                  </td>
                  <td className="px-6 py-5 text-right">
                    <button className="p-2 rounded-lg hover:bg-primary/10 text-muted-foreground group-hover:text-primary transition-all">
                      <ChevronRight size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ─── Detail Modal ────────────────────────────────────────── */}
      <AnimatePresence>
        {selectedRequest && (
          <RequestDetailModal 
            request={selectedRequest} 
            onClose={() => setSelectedRequest(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function RequestDetailModal({ request, onClose }: { request: HRRequest, onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[3000] flex items-center justify-end">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-background/60 backdrop-blur-sm"
      />
      <motion.div 
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="relative bg-card w-full max-w-[500px] h-full shadow-2xl border-l border-border flex flex-col"
      >
        <div className="p-6 border-b border-border flex items-center justify-between bg-white dark:bg-card">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
              <FileText size={20} />
            </div>
            <div>
              <h3 className="text-[16px] font-black text-foreground">Request Details</h3>
              <p className="text-[11px] font-bold text-muted-foreground">{request.id}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-secondary rounded-xl text-muted-foreground transition-colors">
            <AlertCircle size={20} />
          </button>
        </div>

        <div className="p-8 overflow-y-auto custom-scrollbar flex-1 space-y-8">
          <div className="flex items-center justify-between p-4 rounded-2xl bg-secondary/30 border border-border">
            <div>
              <p className="text-[11px] font-black text-muted-foreground uppercase tracking-widest mb-1">Status</p>
              <StatusBadge status={request.status} />
            </div>
            <div className="text-right">
              <p className="text-[11px] font-black text-muted-foreground uppercase tracking-widest mb-1">Priority</p>
              <p className={`text-[14px] font-black ${
                request.priority === 'High' ? 'text-rose-500' : 
                request.priority === 'Medium' ? 'text-amber-500' : 
                'text-emerald-500'
              }`}>{request.priority}</p>
            </div>
          </div>

          <div className="space-y-6">
            <section>
              <p className="text-[11px] font-black text-muted-foreground uppercase tracking-widest mb-3">Request Overview</p>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-border/50">
                  <span className="text-[13px] font-bold text-muted-foreground">Type</span>
                  <span className="text-[14px] font-black text-foreground">{request.type}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-border/50">
                  <span className="text-[13px] font-bold text-muted-foreground">Subject</span>
                  <span className="text-[14px] font-black text-foreground">{request.subject}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-border/50">
                  <span className="text-[13px] font-bold text-muted-foreground">Date Submitted</span>
                  <span className="text-[14px] font-black text-foreground">{request.submittedDate}</span>
                </div>
              </div>
            </section>

            <section>
              <p className="text-[11px] font-black text-muted-foreground uppercase tracking-widest mb-3">Message / Description</p>
              <div className="p-5 rounded-2xl bg-background border border-border leading-relaxed text-[14px] font-medium text-foreground/80">
                {request.description}
              </div>
            </section>

            <section>
              <p className="text-[11px] font-black text-muted-foreground uppercase tracking-widest mb-3">Timeline</p>
              <div className="space-y-6 ml-3">
                <div className="relative pl-8 border-l-2 border-primary/20 pb-1">
                  <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-primary border-4 border-card"></div>
                  <p className="text-[13px] font-black text-foreground">Submitted</p>
                  <p className="text-[11px] font-bold text-muted-foreground">April 10, 2026 · 10:45 AM</p>
                </div>
                <div className="relative pl-8 border-l-2 border-primary/20 pb-1 opacity-50">
                  <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-border border-4 border-card"></div>
                  <p className="text-[13px] font-black text-foreground">Under Review by HR</p>
                  <p className="text-[11px] font-bold text-muted-foreground">Pending Action</p>
                </div>
              </div>
            </section>
          </div>
        </div>

        <div className="p-6 border-t border-border bg-white dark:bg-card flex gap-3">
          <button onClick={onClose} className="flex-1 py-3.5 rounded-xl border border-border text-[13px] font-black text-muted-foreground hover:bg-secondary transition-all">
            Close
          </button>
          <button className="flex-1 py-3.5 rounded-xl bg-primary text-white text-[13px] font-black shadow-lg shadow-emerald-500/20 hover:opacity-95 transition-all">
            Notify HR Again
          </button>
        </div>
      </motion.div>
    </div>
  );
}
