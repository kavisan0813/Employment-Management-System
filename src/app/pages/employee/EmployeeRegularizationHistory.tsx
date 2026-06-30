import { useState } from "react";
import {
  ChevronLeft,
  Search,
  Filter,
  Eye,
  Calendar,
  Clock,
  X,
  FileText,
} from "lucide-react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { StatusBadge } from "../../components/workflow/StatusBadge";

interface RegularizationRequest {
  id: string;
  date: string;
  type: string;
  checkIn: string;
  checkOut: string;
  reason: string;
  manager: string;
  status: "Pending" | "Approved" | "Rejected";
  appliedOn: string;
  approvalDate?: string;
  rejectionReason?: string;
}

const MOCK_HISTORY: RegularizationRequest[] = [
  {
    id: "REG-001",
    date: "10 Apr 2026",
    type: "Missed Check-out",
    checkIn: "08:52 AM",
    checkOut: "06:05 PM",
    reason: "Forgot to punch out before leaving",
    manager: "Arjun Reddy",
    status: "Pending",
    appliedOn: "10 Apr 2026",
  },
  {
    id: "REG-002",
    date: "12 Apr 2026",
    type: "On-site / Client Visit",
    checkIn: "09:00 AM",
    checkOut: "06:00 PM",
    reason: "Client meeting at HCL Tech Park",
    manager: "Arjun Reddy",
    status: "Approved",
    appliedOn: "12 Apr 2026",
    approvalDate: "13 Apr 2026",
  },
  {
    id: "REG-003",
    date: "05 Apr 2026",
    type: "Full Day Correction",
    checkIn: "09:05 AM",
    checkOut: "06:15 PM",
    reason: "Biometric scanner failure",
    manager: "Arjun Reddy",
    status: "Rejected",
    appliedOn: "06 Apr 2026",
    rejectionReason: "Insufficient proof provided",
  },
];

export default function EmployeeRegularizationHistory() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedRequest, setSelectedRequest] =
    useState<RegularizationRequest | null>(null);

  const filteredRequests = MOCK_HISTORY.filter((req) => {
    const matchesSearch =
      req.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.reason.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "All" || req.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-700 w-full px-4 md:px-8 py-6 pb-10">
      {/* ─── Header ─────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/attendance")}
            className="w-10 h-10 rounded-xl bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-all shadow-sm"
          >
            <ChevronLeft size={20} />
          </button>
          <div>
            <h1 className="text-[26px] font-black text-foreground leading-none">
              Regularization History
            </h1>
            <p className="text-[13px] font-bold text-muted-foreground mt-1.5">
              View and track all your regularization requests
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary"
              size={18}
            />
            <input
              type="text"
              placeholder="Search requests..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-card border border-border rounded-xl pl-11 pr-4 py-2.5 text-[14px] font-bold focus:outline-none focus:border-primary transition-all w-[240px] shadow-sm"
            />
          </div>
          <div className="flex items-center gap-2 p-1.5 bg-card rounded-xl border border-border shadow-sm">
            <Filter size={18} className="ml-2 text-muted-foreground" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent text-[13px] font-black text-foreground focus:outline-none px-2 pr-4"
            >
              <option value="All">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* ─── Summary Cards ────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            label: "Total Requests",
            value: "12",
            color: "var(--foreground)",
            bg: "bg-card",
          },
          { label: "Pending", value: "3", color: "#F59E0B", bg: "bg-card" },
          {
            label: "Approved",
            value: "8",
            color: "var(--primary)",
            bg: "bg-card",
          },
          {
            label: "Rejected",
            value: "1",
            color: "var(--destructive)",
            bg: "bg-card",
          },
        ].map((card, i) => (
          <div
            key={i}
            className="p-6 rounded-2xl border border-border bg-card shadow-sm flex flex-col items-center justify-center text-center group hover:border-primary transition-colors"
          >
            <p
              className="text-[32px] font-black mb-1"
              style={{ color: card.color }}
            >
              {card.value}
            </p>
            <p className="text-[11px] font-black text-muted-foreground uppercase tracking-widest">
              {card.label}
            </p>
          </div>
        ))}
      </div>

      {/* ─── Table ────────────────────────────────────────────────── */}
      <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-secondary/30 border-b border-border">
              <th className="px-6 py-5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Date & Type
              </th>
              <th className="px-6 py-5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Times
              </th>
              <th className="px-6 py-5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Reason
              </th>
              <th className="px-6 py-5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Manager
              </th>
              <th className="px-6 py-5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Status
              </th>
              <th className="px-6 py-5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground text-right">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredRequests.map((req) => (
              <tr
                key={req.id}
                className="hover:bg-secondary/20 transition-colors group"
              >
                <td className="px-6 py-5">
                  <div className="flex flex-col">
                    <span className="text-[14px] font-black text-foreground group-hover:text-primary transition-colors">
                      {req.date}
                    </span>
                    <span className="text-[12px] font-bold text-muted-foreground">
                      {req.type}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                      <Clock size={12} />
                      <span className="text-[12px] font-black">
                        {req.checkIn}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-500">
                      <Clock size={12} />
                      <span className="text-[12px] font-bold">
                        {req.checkOut}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <p className="text-[13px] font-medium text-foreground/80 max-w-[200px] truncate">
                    {req.reason}
                  </p>
                  <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mt-1">
                    Applied: {req.appliedOn}
                  </p>
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-black text-[11px]">
                      AR
                    </div>
                    <span className="text-[13px] font-black text-foreground">
                      {req.manager}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <StatusBadge status={req.status} />
                </td>
                <td className="px-6 py-5 text-right">
                  <button
                    onClick={() => setSelectedRequest(req)}
                    className="p-2 rounded-xl bg-primary/5 text-primary hover:bg-primary hover:text-white transition-all shadow-sm"
                  >
                    <Eye size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ─── Detail Popup ─────────────────────────────────────────── */}
      <AnimatePresence>
        {selectedRequest && (
          <RequestDetailPopup
            request={selectedRequest}
            onClose={() => setSelectedRequest(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function RequestDetailPopup({
  request,
  onClose,
}: {
  request: RegularizationRequest;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[3000] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-background/40"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative bg-card w-full max-w-[500px] rounded-[32px] shadow-2xl overflow-hidden flex flex-col border border-border"
      >
        <div className="p-6 border-b border-border flex items-center justify-between bg-secondary/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
              <FileText size={20} />
            </div>
            <div>
              <h3 className="text-[18px] font-black text-foreground uppercase tracking-tight">
                Request Details
              </h3>
              <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
                {request.id}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-card rounded-xl transition-colors text-muted-foreground"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
          <div className="flex items-center justify-between p-4 rounded-2xl bg-secondary/30 border border-border">
            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-black text-muted-foreground uppercase tracking-widest">
                Current Status
              </span>
              <StatusBadge status={request.status} />
            </div>
            <div className="flex flex-col gap-1 items-end">
              <span className="text-[11px] font-black text-muted-foreground uppercase tracking-widest">
                Requested On
              </span>
              <span className="text-[14px] font-black text-foreground">
                {request.appliedOn}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-1">
              <p className="text-[11px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                <Calendar size={12} className="text-primary" /> Regularization
                Date
              </p>
              <p className="text-[15px] font-black text-foreground">
                {request.date}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-[11px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                <Filter size={12} className="text-primary" /> Request Type
              </p>
              <p className="text-[15px] font-black text-foreground">
                {request.type}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-[11px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                <Clock size={12} className="text-emerald-500" /> Requested In
              </p>
              <p className="text-[15px] font-black text-emerald-600 dark:text-emerald-400">
                {request.checkIn}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-[11px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                <Clock size={12} className="text-slate-400" /> Requested Out
              </p>
              <p className="text-[15px] font-black text-foreground">
                {request.checkOut}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-[11px] font-black text-muted-foreground uppercase tracking-widest">
              Reason for Regularization
            </p>
            <div className="p-4 rounded-2xl bg-background border border-border text-[14px] font-medium text-foreground/80 leading-relaxed italic">
              "{request.reason}"
            </div>
          </div>

          <div className="flex items-center gap-4 py-4 border-t border-border">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-black text-sm">
              AR
            </div>
            <div className="flex-1">
              <p className="text-[11px] font-black text-muted-foreground uppercase tracking-widest">
                Reporting Manager
              </p>
              <p className="text-[14px] font-black text-foreground">
                {request.manager}
              </p>
            </div>
            {request.status === "Approved" && (
              <div className="text-right">
                <p className="text-[11px] font-black text-muted-foreground uppercase tracking-widest">
                  Approved Date
                </p>
                <p className="text-[14px] font-black text-primary">
                  {request.approvalDate}
                </p>
              </div>
            )}
          </div>

          {request.status === "Rejected" && (
            <div className="p-4 rounded-2xl bg-rose-500/5 border border-rose-500/20">
              <p className="text-[11px] font-black text-rose-500 uppercase tracking-widest mb-1">
                Rejection Reason
              </p>
              <p className="text-[13px] font-bold text-rose-600 dark:text-rose-400">
                {request.rejectionReason}
              </p>
            </div>
          )}
        </div>

        <div className="p-6 bg-secondary/30 border-t border-border">
          <button
            onClick={onClose}
            className="w-full py-4 bg-primary text-white rounded-2xl text-[14px] font-semibold uppercase tracking-wider shadow-xl shadow-primary/20 hover:opacity-95 transition-all"
          >
            Close Details
          </button>
        </div>
      </motion.div>
    </div>
  );
}
