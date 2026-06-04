import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import {
  CalendarX,
  Plus,
  X,
  CalendarDays,
  FileText,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  AlertCircle,
  MoreVertical,
  CheckCircle2,
  Calendar,
  Info,
  Clock,
  Users,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { showToast } from "../components/workflow/ToastNotification";
import { StatusBadge } from "../components/workflow/StatusBadge";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";

const TABS = ["My Requests", "History", "Policy"];

const LEAVE_TYPES = [
  {
    id: "CL",
    name: "Casual Leave",
    total: 12,
    used: 6,
    color: "var(--primary)",
    bg: "var(--secondary)",
  },
  {
    id: "EL",
    name: "Earned Leave",
    total: 24,
    used: 18,
    color: "var(--primary)",
    bg: "var(--secondary)",
  },
  {
    id: "SL",
    name: "Sick Leave",
    total: 12,
    used: 8,
    color: "#14B8A6",
    bg: "rgba(20, 184, 166, 0.1)",
  },
  {
    id: "CO",
    name: "Comp Off",
    total: 5,
    used: 2,
    color: "#8B5CF6",
    bg: "rgba(139, 92, 246, 0.1)",
  },
];

interface LeaveRecord {
  id: string;
  type: LeaveType;
  typeFull: string;
  from: string;
  to: string;
  days: number;
  reason: string;
  status: ApprovalStatus;
  appliedOn: string;
  approvedBy?: string;
  startsIn?: string;
}

export function EmployeeLeaves() {
  const navigate = useNavigate();
  const location = useLocation();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { user } = useAuth();
  
  const [activeTab, setActiveTab] = useState<LeaveTab>("My Requests");
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState<string | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());

  // Initialize from navigation state if present
  useEffect(() => {
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab as LeaveTab);
    }
    if (location.state?.openApplyModal) {
      setIsApplyModalOpen(true);
      // Clear state so it doesn't reopen on refresh
      navigate(location.pathname, { replace: true });
    }
  }, [location, navigate]);

  // Mock Data
  const pendingRequests: LeaveRecord[] = [
    {
      id: "LR-1002",
      type: "SL",
      typeFull: "Sick Leave",
      from: "Apr 18, 2026",
      to: "Apr 20, 2026",
      days: 3,
      reason: "Viral fever, resting at home",
      status: "Pending",
      appliedOn: "Apr 17, 2026",
    }
  ];

  const approvedLeaves: LeaveRecord[] = [
    {
      id: "LR-0945",
      type: "EL",
      typeFull: "Earned Leave",
      from: "May 10, 2026",
      to: "May 14, 2026",
      days: 5,
      reason: "Family trip",
      status: "Approved",
      appliedOn: "Apr 05, 2026",
      approvedBy: "Ryan Park",
      startsIn: "Starts in 12 days",
    }
  ];

  const historyLeaves: LeaveRecord[] = [
    {
      id: "LR-0812",
      type: "CL",
      typeFull: "Casual Leave",
      from: "Mar 12, 2026",
      to: "Mar 12, 2026",
      days: 1,
      reason: "Personal errands",
      status: "Approved",
      appliedOn: "Mar 08, 2026",
    },
    {
      id: "LR-0790",
      type: "CO",
      typeFull: "Comp Off",
      from: "Feb 20, 2026",
      to: "Feb 21, 2026",
      days: 2,
      reason: "Rest after weekend deployment",
      status: "Approved",
      appliedOn: "Feb 18, 2026",
    },
    {
      id: "LR-0705",
      type: "EL",
      typeFull: "Earned Leave",
      from: "Jan 05, 2026",
      to: "Jan 10, 2026",
      days: 6,
      reason: "Winter vacation",
      status: "Approved",
      appliedOn: "Dec 15, 2025",
    }
  ];

  const handleCancelRequest = (id: string) => {
    // In a real app this would call an API
    console.log("Canceling request", id);
    setShowCancelConfirm(null);
  };

  return (
    <div className="w-full px-4 md:px-8 py-6 pb-10 space-y-6 animate-in fade-in duration-500">
      
      {/* ═══════ PAGE HEADER ═══════ */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-[10px] bg-[#FEF3C7] flex items-center justify-center text-[#F59E0B]">
            <CalendarX size={22} />
          </div>
          <div>
            <h1 className="text-[26px] font-bold text-foreground tracking-tight m-0 leading-tight">My Leaves</h1>
            <p className="text-[13px] text-[#6B7280]">Manage your leave requests and balance</p>
          </div>
          <div>
            <h1 className="text-[26px] font-black text-foreground tracking-tight m-0 leading-tight">My Leaves</h1>
            <p className="text-[13px] font-bold text-muted-foreground mt-1">Leave balance, requests and history</p>
          </div>
        </div>
        <div>
          <button 
            onClick={() => setIsApplyModalOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-[#00B87C] text-white font-black text-[12px] uppercase tracking-widest hover:bg-[#009966] transition-all shadow-lg shadow-[#00B87C]/20 flex items-center gap-2"
          >
            <Plus size={16} /> Apply Leave
          </button>
        </div>
      </div>

      {/* ═══════ LEAVE BALANCE CARDS ═══════ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="bg-card border border-border rounded-2xl p-5 shadow-sm group hover:border-[#00B87C]/30 transition-all">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl bg-[#DCFCE7] flex items-center justify-center text-[#00B87C]">
              <Calendar size={18} />
            </div>
            <span className="text-[11px] font-black text-muted-foreground uppercase tracking-widest">CASUAL LEAVE</span>
          </div>
          <div className="flex items-end gap-2">
            <span className="text-[32px] font-black tracking-tight text-[#00B87C] leading-none">6</span>
            <span className="text-[16px] font-bold text-muted-foreground mb-1">/ 12 days</span>
          </div>
          <div className="mt-4">
            <div className="h-1.5 w-full bg-[#F3F4F6] dark:bg-zinc-800 rounded-full overflow-hidden">
              <div className="h-full bg-[#00B87C] rounded-full" style={{ width: "50%" }} />
            </div>
            <p className="text-[12px] font-bold text-muted-foreground mt-2">6 days used this year</p>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-card border border-border rounded-2xl p-5 shadow-sm group hover:border-[#00B87C]/30 transition-all">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl bg-[#DCFCE7] flex items-center justify-center text-[#00B87C]">
              <CalendarDays size={18} />
            </div>
            <span className="text-[11px] font-black text-muted-foreground uppercase tracking-widest">EARNED LEAVE</span>
          </div>
          <div className="flex items-end gap-2">
            <span className="text-[32px] font-black tracking-tight text-[#00B87C] leading-none">18</span>
            <span className="text-[16px] font-bold text-muted-foreground mb-1">/ 24 days</span>
          </div>
          <div className="mt-4">
            <div className="h-1.5 w-full bg-[#F3F4F6] dark:bg-zinc-800 rounded-full overflow-hidden">
              <div className="h-full bg-[#00B87C] rounded-full" style={{ width: "75%" }} />
            </div>
            <p className="text-[12px] font-bold text-muted-foreground mt-2">6 days used this year</p>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-card border border-border rounded-2xl p-5 shadow-sm group hover:border-[#0EA5E9]/30 transition-all">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl bg-sky-500/10 flex items-center justify-center text-[#0EA5E9] font-black text-xs">
              SL
            </div>
            <span className="text-[11px] font-black text-muted-foreground uppercase tracking-widest">SICK LEAVE</span>
          </div>
          <div className="flex items-end gap-2">
            <span className="text-[32px] font-black tracking-tight text-[#0EA5E9] leading-none">8</span>
            <span className="text-[16px] font-bold text-muted-foreground mb-1">/ 12 days</span>
          </div>
          <div className="mt-4">
            <div className="h-1.5 w-full bg-[#F3F4F6] dark:bg-zinc-800 rounded-full overflow-hidden">
              <div className="h-full bg-[#0EA5E9] rounded-full" style={{ width: "66%" }} />
            </div>
            <p className="text-[12px] font-bold text-muted-foreground mt-2">4 days used this year</p>
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-card border border-border rounded-2xl p-5 shadow-sm group hover:border-[#8B5CF6]/30 transition-all">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl bg-violet-500/10 flex items-center justify-center text-[#8B5CF6] font-black text-xs">
              CO
            </div>
            <span className="text-[11px] font-black text-muted-foreground uppercase tracking-widest">COMP OFF</span>
          </div>
          <div className="flex items-end gap-2">
            <span className="text-[32px] font-black tracking-tight text-[#8B5CF6] leading-none">2</span>
            <span className="text-[16px] font-bold text-muted-foreground mb-1">/ 5 days</span>
          </div>
          <div className="mt-4">
            <div className="h-1.5 w-full bg-[#F3F4F6] dark:bg-zinc-800 rounded-full overflow-hidden">
              <div className="h-full bg-[#8B5CF6] rounded-full" style={{ width: "40%" }} />
            </div>
            <p className="text-[12px] font-bold text-muted-foreground mt-2">3 days used this year</p>
          </div>
        </div>
      </div>

      {/* ═══════ MAIN CONTENT AREA ═══════ */}
      <div className="bg-card border border-border rounded-[32px] p-2 md:p-6 shadow-sm min-h-[500px]">
        
        {/* TABS */}
        <div className="flex items-center gap-6 border-b border-border px-4 mb-6 overflow-x-auto no-scrollbar">
          {(["My Requests", "Calendar", "History", "Policy"] as LeaveTab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 text-[13px] font-bold uppercase tracking-widest transition-all relative whitespace-nowrap ${
                activeTab === tab ? "text-[#00B87C]" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab}
              {activeTab === tab && (
                <motion.div 
                  layoutId="activeLeaveTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#00B87C]"
                />
              )}
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
                      <th className="px-6 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                        Request ID
                      </th>
                      <th className="px-6 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                        Leave Type
                      </th>
                      <th className="px-6 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                        Duration
                      </th>
                      <th className="px-6 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                        Days
                      </th>
                      <th className="px-6 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                        Status
                      </th>
                      <th className="px-6 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest text-right">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {requests.map((req, i) => (
                      <tr
                        key={i}
                        className="hover:bg-secondary/50 transition-colors cursor-pointer"
                        onClick={() => setSelectedRequest(req)}
                      >
                        <td className="px-6 py-4 text-[13px] font-black text-foreground">
                          {req.id}
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2.5 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest border border-primary/20">
                            {req.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 flex flex-col">
                          <span className="text-[13px] font-bold text-foreground">
                            {new Date(req.from).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })}{" "}
                            –{" "}
                            {new Date(req.to).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                          <span className="text-[11px] text-muted-foreground">
                            Applied {req.appliedOn}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-[13px] font-black text-foreground">
                          {req.days} days
                        </td>
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
  const { t } = useTranslation();
  return (
    <div className="bg-card rounded-[24px] border border-border shadow-sm p-12 text-center">
      <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
        <History size={32} className="text-muted-foreground" />
      </div>
      <h3 className="text-lg font-black text-foreground">{t("leaveHistory")}</h3>
      <p className="text-[14px] font-medium text-muted-foreground max-w-sm mx-auto mt-2">
        Historical leave records will be archived here after the current
        financial year ends.
      </p>
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
        <div
          key={i}
          className="bg-card rounded-[24px] p-8 border border-border shadow-sm hover:border-primary transition-all group"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-secondary">
              <p.icon size={24} style={{ color: p.color }} />
            </div>
          )}
        </div>
      </div>

      {/* ═══════ APPLY LEAVE MODAL ═══════ */}
      <AnimatePresence>
        {isApplyModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsApplyModalOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-[480px] bg-card border border-border rounded-2xl shadow-2xl flex flex-col"
            >
              {/* Header */}
              <div className="p-6 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#FEF3C7] flex items-center justify-center text-[#F59E0B]">
                    <CalendarX size={20} />
                  </div>
                  <h2 className="text-[18px] font-black text-foreground tracking-tight">Apply for Leave</h2>
                </div>
                <button onClick={() => setIsApplyModalOpen(false)} className="p-2 rounded-xl hover:bg-muted text-muted-foreground">
                  <X size={20} />
                </button>
              </div>

              {/* Form Body */}
              <div className="p-6 space-y-6 overflow-y-auto max-h-[70vh]">
                
                {/* Leave Type Selector */}
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-muted-foreground uppercase tracking-widest ml-1">Leave Type</label>
                  <div className="flex gap-2 p-1 rounded-xl bg-muted border border-border">
                    {["CL", "EL", "SL", "CO"].map((type) => (
                      <button 
                        key={type}
                        className={`flex-1 py-2 rounded-lg text-[12px] font-bold uppercase tracking-widest transition-all ${
                          type === "CL" ? "bg-[#00B87C] text-white shadow-sm" : "text-muted-foreground hover:bg-card/50"
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Dates */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-muted-foreground uppercase tracking-widest ml-1">From Date</label>
                    <input type="date" className="w-full px-4 py-3 rounded-2xl bg-muted/30 border border-border focus:border-[#00B87C] outline-none text-[13px] font-bold text-foreground" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-muted-foreground uppercase tracking-widest ml-1">To Date</label>
                    <input type="date" className="w-full px-4 py-3 rounded-2xl bg-muted/30 border border-border focus:border-[#00B87C] outline-none text-[13px] font-bold text-foreground" />
                  </div>
                </div>

                {/* Auto Duration & Balance */}
                <div className="bg-[#F0FDF4] border border-[#00B87C]/30 rounded-xl p-4 flex flex-col items-center justify-center text-center dark:bg-[#00B87C]/5">
                  <span className="text-[18px] font-black text-[#00B87C]">3 Working Days</span>
                  <span className="text-[11px] font-bold text-muted-foreground">Excludes weekends & holidays</span>
                  <div className="mt-3 pt-3 border-t border-[#00B87C]/20 w-full text-[12px] font-bold text-[#00B87C]">
                    CL Balance: 6 days → <span className="font-black">After this: 3 days remaining</span>
                  </div>
                </div>

                {/* Team Overlap */}
                <div className="flex items-start gap-3 p-3 rounded-xl bg-[#F0FDF4] border border-[#00B87C]/30 dark:bg-[#00B87C]/5">
                  <div className="mt-0.5 text-[#00B87C]"><Users size={16} /></div>
                  <div>
                    <p className="text-[12px] font-black text-[#00B87C]">No team members on leave in this period</p>
                    <p className="text-[11px] font-bold text-muted-foreground mt-0.5">Your coverage looks good.</p>
                  </div>
                </div>

                {/* Reason */}
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-muted-foreground uppercase tracking-widest ml-1">Reason (Optional)</label>
                  <textarea 
                    placeholder="Brief reason for your leave..." 
                    className="w-full h-20 px-4 py-3 rounded-2xl bg-muted/30 border border-border focus:border-[#00B87C] outline-none text-[13px] font-bold text-foreground resize-none"
                  />
                </div>

                {/* Toggles */}
                <div className="flex items-center justify-between p-1">
                  <span className="text-[13px] font-bold text-foreground">Notify Manager</span>
                  <div className="w-10 h-6 rounded-full bg-[#00B87C] relative cursor-pointer">
                    <div className="absolute right-1 top-1 bottom-1 w-4 bg-white rounded-full shadow-sm" />
                  </div>
                </div>

              </div>

              {/* Footer */}
              <div className="p-6 border-t border-border bg-muted/20 flex items-center justify-between gap-4">
                <button 
                  onClick={() => setIsApplyModalOpen(false)}
                  className="px-6 py-3 text-[12px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    alert("Leave request submitted!");
                    setIsApplyModalOpen(false);
                  }}
                  className="flex-1 px-6 py-3 rounded-2xl bg-[#00B87C] text-white text-[12px] font-bold uppercase tracking-widest hover:bg-[#009966] transition-all shadow-lg shadow-[#00B87C]/20"
                >
                  Submit Request
                </button>
              </div>

            </motion.div>
          </div>

          <div className="space-y-3">
            <label className="text-[11px] font-black text-muted-foreground uppercase tracking-widest">
              Reason
            </label>
            <p className="text-[14px] font-medium text-foreground bg-secondary/50 p-6 rounded-2xl border border-border leading-relaxed italic">
              "{request.reason}"
            </p>
          </div>

          <div className="space-y-4">
            <label className="text-[11px] font-black text-muted-foreground uppercase tracking-widest">
              Approval Timeline
            </label>
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
                status={request.status === "Pending" ? "current" : "completed"}
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
          <button className="flex-1 py-4 bg-background border border-border rounded-2xl text-[13px] font-black text-rose-500 hover:bg-rose-50 transition-all">
            Cancel Request
          </button>
          <button className="flex-1 py-4 bg-background border border-border rounded-2xl text-[13px] font-black text-foreground hover:bg-secondary transition-all">
            Download Receipt
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function DetailItem({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <p className="text-[11px] font-black text-muted-foreground uppercase tracking-widest">
        {label}
      </p>
      <div className="text-[14px] font-bold text-foreground">{value}</div>
    </div>
  );
}

function TimelineItem({
  icon,
  title,
  subtitle,
  status,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  status: "completed" | "current" | "upcoming";
}) {
  const getTimelineColor = (s: "completed" | "current" | "upcoming"): string => {
    switch (s) {
      case "completed": return "bg-primary text-white border-primary";
      case "current": return "bg-amber-500 text-white border-amber-500 animate-pulse";
      case "upcoming": return "bg-secondary text-muted-foreground border-border";
      default: return "bg-secondary text-muted-foreground border-border";
    }
  };

  return (
    <div className="flex gap-4 relative z-10">
      <div
        className={`w-6 h-6 rounded-full flex items-center justify-center border ${getTimelineColor(status)} shadow-sm`}
      >
        {icon}
      </div>
      <div>
        <h4
          className={`text-[13px] font-black ${status === "upcoming" ? "text-muted-foreground" : "text-foreground"}`}
        >
          {title}
        </h4>
        <p className="text-[11px] font-medium text-muted-foreground">
          {subtitle}
        </p>
      </div>
    </div>
  );
}
