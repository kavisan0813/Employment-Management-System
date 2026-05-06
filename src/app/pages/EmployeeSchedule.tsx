import { useState } from "react";
import {
  Clock,
  ChevronLeft,
  ChevronRight,
  ArrowLeftRight,
  MoreVertical,
  CheckCircle2,
  AlertCircle,
  X,
} from "lucide-react";
import { showToast } from "../components/workflow/ToastNotification";

/* ─────────────────────────────────────────────────────────────── */
/* Types                                                           */
/* ─────────────────────────────────────────────────────────────── */
interface Shift {
  id: string;
  date: string;
  day: string;
  type: "Morning" | "Evening" | "Night" | "Off Day";
  time: string;
  hours: string;
  location: string;
  department: string;
  manager: string;
}

interface ShiftRequest {
  id: string;
  type: "Swap" | "Time Change" | "Availability" | "Issue";
  currentShift: string;
  requestedShift: string;
  requestedDate: string;
  reason: string;
  status: "Pending" | "Approved" | "Rejected" | "Cancelled";
  managerComment?: string;
  createdAt: string;
}

/* ─────────────────────────────────────────────────────────────── */
/* Static Data                                                     */
/* ─────────────────────────────────────────────────────────────── */
const UPCOMING_SHIFTS: Shift[] = [
  {
    id: "S1",
    date: "Apr 06",
    day: "Mon",
    type: "Morning",
    time: "08:00 AM - 04:00 PM",
    hours: "8h",
    location: "Head Office, BLR",
    department: "Engineering",
    manager: "Suresh Kumar",
  },
  {
    id: "S2",
    date: "Apr 07",
    day: "Tue",
    type: "Morning",
    time: "08:00 AM - 04:00 PM",
    hours: "8h",
    location: "Head Office, BLR",
    department: "Engineering",
    manager: "Suresh Kumar",
  },
  {
    id: "S3",
    date: "Apr 08",
    day: "Wed",
    type: "Evening",
    time: "04:00 PM - 12:00 AM",
    hours: "8h",
    location: "Remote",
    department: "Engineering",
    manager: "Suresh Kumar",
  },
  {
    id: "S4",
    date: "Apr 09",
    day: "Thu",
    type: "Evening",
    time: "04:00 PM - 12:00 AM",
    hours: "8h",
    location: "Remote",
    department: "Engineering",
    manager: "Suresh Kumar",
  },
  {
    id: "S5",
    date: "Apr 10",
    day: "Fri",
    type: "Night",
    time: "12:00 AM - 08:00 AM",
    hours: "8h",
    location: "Head Office, BLR",
    department: "Engineering",
    manager: "Suresh Kumar",
  },
];

const INITIAL_REQUESTS: ShiftRequest[] = [
  {
    id: "REQ-001",
    type: "Swap",
    currentShift: "Apr 12 - Night",
    requestedShift: "Apr 12 - Morning",
    requestedDate: "Apr 12, 2026",
    reason: "Personal appointment in the evening.",
    status: "Pending",
    createdAt: "Apr 01, 2026",
  },
  {
    id: "REQ-002",
    type: "Time Change",
    currentShift: "08:00 AM - 04:00 PM",
    requestedShift: "09:00 AM - 05:00 PM",
    requestedDate: "Apr 05, 2026",
    reason: "Commute issues.",
    status: "Approved",
    managerComment: "Approved for this week only.",
    createdAt: "Mar 30, 2026",
  },
];

/* ─────────────────────────────────────────────────────────────── */
/* Shift Styling                                                  */
/* ─────────────────────────────────────────────────────────────── */
interface ShiftColor {
  bg: string;
  text: string;
  border: string;
}

const SHIFT_COLORS: Record<string, ShiftColor> = {
  Morning: {
    bg: "bg-emerald-500/10",
    text: "text-primary",
    border: "border-primary/20",
  },
  Evening: {
    bg: "bg-amber-500/10",
    text: "text-amber-600",
    border: "border-amber-500/20",
  },
  Night: {
    bg: "bg-purple-500/10",
    text: "text-purple-600",
    border: "border-purple-500/20",
  },
  "Off Day": {
    bg: "bg-secondary",
    text: "text-muted-foreground",
    border: "border-border",
  },
};

/* ─────────────────────────────────────────────────────────────── */
/* Components                                                      */
/* ─────────────────────────────────────────────────────────────── */

interface ShiftOverviewProps {
  label: string;
  value: string | number;
  subValue: string;
  trend?: string;
  trendColor?: "amber" | "teal";
}

function PersonalShiftOverviewCard({
  label,
  value,
  subValue,
  trend,
  trendColor,
}: ShiftOverviewProps) {
  return (
    <div className="bg-card p-6 rounded-[24px] border border-border shadow-sm flex flex-col justify-between h-full">
      <div>
        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">
          {label}
        </p>
        <p className="text-[32px] font-black text-foreground leading-none">
          {value}
        </p>
      </div>
      <div className="flex items-center justify-between mt-4">
        <span className="text-[13px] font-bold text-muted-foreground">
          {subValue}
        </span>
        {trend && (
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-black border ${
              trendColor === "amber"
                ? "bg-amber-500/10 text-amber-600 border-amber-500/20"
                : "bg-emerald-500/10 text-primary border-primary/20"
            }`}
          >
            {trend}
          </span>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────── */
/* UI Components                                                  */
/* ─────────────────────────────────────────────────────────────── */
const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  icon: Icon,
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  icon?: React.ElementType;
}) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div
        className="absolute inset-0 bg-slate-950/40 backdrop-blur-[2px]"
        onClick={onClose}
      />
      <div className="relative bg-card w-full max-w-[480px] rounded-[24px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-border flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-border flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            {Icon && (
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                <Icon size={20} className="text-primary" />
              </div>
            )}
            <h3 className="text-[18px] font-black text-foreground">{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-secondary rounded-xl text-muted-foreground transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-6 overflow-y-auto custom-scrollbar">{children}</div>
      </div>
    </div>
  );
};

const StatusBadge = ({ status }: { status: ShiftRequest["status"] }) => {
  const styles = {
    Pending: "bg-amber-500/10 text-amber-600 border-amber-500/20",
    Approved: "bg-emerald-500/10 text-primary border-primary/20",
    Rejected: "bg-red-500/10 text-red-600 border-red-500/20",
    Cancelled: "bg-secondary text-muted-foreground border-border",
  };
  return (
    <span
      className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${styles[status]}`}
    >
      {status}
    </span>
  );
};

/* ─────────────────────────────────────────────────────────────── */
/* Main Page Component                                             */
/* ─────────────────────────────────────────────────────────────── */
export function EmployeeSchedule() {
  const [view, setView] = useState<"Week" | "Month" | "Day">("Week");
  const [currentPage, setCurrentPage] = useState<"calendar" | "requests">(
    "calendar",
  );

  // Modal States
  const [showSwapModal, setShowSwapModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showTimeChangeModal, setShowTimeChangeModal] = useState(false);
  const [showAvailabilityModal, setShowAvailabilityModal] = useState(false);
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [showRequestDetail, setShowRequestDetail] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  // Selection States
  const [selectedShift, setSelectedShift] = useState<Shift | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<ShiftRequest | null>(
    null,
  );
  const [requestToCancel, setRequestToCancel] = useState<ShiftRequest | null>(
    null,
  );
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // Data State
  const [requests, setRequests] = useState<ShiftRequest[]>(INITIAL_REQUESTS);

  const handleRequestSwap = (shift?: Shift) => {
    if (shift) setSelectedShift(shift);
    setShowSwapModal(true);
  };

  const handleViewDetails = (shift: Shift) => {
    setSelectedShift(shift);
    setShowDetailsModal(true);
  };

  const renderRequests = () => {
    return (
      <div className="space-y-6 animate-in slide-in-from-right duration-500">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setCurrentPage("calendar")}
              className="p-2 rounded-xl hover:bg-secondary transition-colors"
            >
              <ChevronLeft size={20} className="text-primary" />
            </button>
            <h2 className="text-[26px] font-black text-foreground">
              My Shift Requests
            </h2>
          </div>
          <button
            onClick={() => handleRequestSwap()}
            className="px-5 py-2.5 bg-primary text-white text-[13px] font-black rounded-xl shadow-lg shadow-emerald-500/20 hover:opacity-90 active:scale-[0.98] transition-all"
          >
            + New Request
          </button>
        </div>

        <div className="bg-card rounded-[24px] border border-border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-secondary">
                  <th className="px-6 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest border-b border-border">
                    REQUEST ID
                  </th>
                  <th className="px-6 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest border-b border-border">
                    TYPE
                  </th>
                  <th className="px-6 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest border-b border-border">
                    DATE
                  </th>
                  <th className="px-6 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest border-b border-border">
                    STATUS
                  </th>
                  <th className="px-6 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest border-b border-border text-right">
                    ACTIONS
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {requests.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-16 h-16 rounded-3xl bg-secondary flex items-center justify-center text-muted-foreground/40">
                          <AlertCircle size={32} />
                        </div>
                        <p className="text-[14px] font-black text-muted-foreground">
                          No shift requests found
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  requests.map((req) => (
                    <tr
                      key={req.id}
                      className="hover:bg-secondary/30 transition-colors"
                    >
                      <td className="px-6 py-5">
                        <span className="text-[13px] font-black text-foreground">
                          {req.id}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex flex-col">
                          <span className="text-[14px] font-black text-foreground">
                            {req.type}
                          </span>
                          <span className="text-[11px] font-bold text-muted-foreground">
                            {req.currentShift} → {req.requestedShift}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className="text-[13px] font-bold text-muted-foreground">
                          {req.requestedDate}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <StatusBadge status={req.status} />
                      </td>
                      <td className="px-6 py-5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              setSelectedRequest(req);
                              setShowRequestDetail(true);
                            }}
                            className="px-4 py-2 text-[12px] font-black text-primary hover:bg-emerald-500/10 rounded-lg transition-all"
                          >
                            View
                          </button>
                          {req.status === "Pending" && (
                            <button
                              onClick={() => {
                                setRequestToCancel(req);
                                setShowCancelModal(true);
                              }}
                              className="px-4 py-2 text-[12px] font-black text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                            >
                              Cancel
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const renderCalendar = () => {
    return (
      <div className="flex flex-col gap-8 animate-in fade-in duration-700">
        {/* ─── Page Header ─────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-[12px] bg-emerald-500/10 flex items-center justify-center shadow-sm flex-shrink-0">
              <Clock size={22} className="text-primary" />
            </div>
            <h1 className="text-[26px] font-black text-foreground leading-none">
              My Schedule
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentPage("requests")}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold transition-all border border-border bg-card text-foreground hover:bg-secondary active:scale-[0.98] whitespace-nowrap"
            >
              📋 View History
            </button>
            <button
              onClick={() => handleRequestSwap()}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold transition-all border border-primary text-primary hover:bg-emerald-500/10 active:scale-[0.98] whitespace-nowrap"
            >
              ↔ Request Swap
            </button>
          </div>
        </div>

        {/* ─── Date Navigator + View Toggles ─────────────────────────── */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 p-1 bg-card border border-border rounded-xl shadow-sm">
            <button className="p-2 hover:bg-secondary rounded-lg text-muted-foreground transition-all">
              <ChevronLeft size={18} />
            </button>
            <div className="px-4 py-1.5 text-[14px] font-black text-foreground">
              Apr 6 – Apr 12, 2026
            </div>
            <button className="p-2 hover:bg-secondary rounded-lg text-muted-foreground transition-all">
              <ChevronRight size={18} />
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button className="px-5 py-2 bg-card border border-border text-primary text-[13px] font-black rounded-xl hover:bg-secondary transition-all">
              Today
            </button>
            <div className="flex items-center p-1 bg-card border border-border rounded-xl shadow-sm">
              {["Week", "Month", "Day"].map((v) => (
                <button
                  key={v}
                  onClick={() => setView(v as "Week" | "Month" | "Day")}
                  className={`px-4 py-1.5 rounded-lg text-[13px] font-black transition-all ${view === v ? "bg-emerald-500/10 text-primary" : "text-muted-foreground hover:text-foreground"}`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ─── Personal Shift Overview Cards ────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <PersonalShiftOverviewCard
            label="THIS WEEK SHIFTS"
            value="5"
            subValue="40h scheduled"
          />
          <PersonalShiftOverviewCard
            label="OVERTIME"
            value="2h"
            subValue="above 40h"
            trend="+1.5h"
            trendColor="amber"
          />
          <PersonalShiftOverviewCard
            label="NEXT DAY OFF"
            value="Saturday"
            subValue="Apr 11, 2026"
          />
          <PersonalShiftOverviewCard
            label="SHIFT SWAPS"
            value={requests.filter((r) => r.status === "Pending").length}
            subValue="pending review"
            trend="New"
            trendColor="teal"
          />
        </div>

        {/* ─── My Weekly Schedule Grid ──────────────────────────────── */}
        <div className="space-y-4">
          <h3 className="text-[12px] font-black text-muted-foreground uppercase tracking-widest">
            MY WEEKLY SCHEDULE
          </h3>
          <div className="bg-card rounded-[24px] border border-border shadow-sm overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-secondary">
                  <th className="px-6 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest border-b border-border min-w-[200px]">
                    EMPLOYEE
                  </th>
                  {[
                    "MON 06",
                    "TUE 07",
                    "WED 08",
                    "THU 09",
                    "FRI 10",
                    "SAT 11",
                    "SUN 12",
                  ].map((day) => (
                    <th
                      key={day}
                      className="px-4 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest border-b border-border text-center"
                    >
                      {day}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="hover:bg-secondary/30 transition-colors">
                  <td className="px-6 py-5 border-b border-border">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white text-[12px] font-black border-2 border-card shadow-sm">
                        PS
                      </div>
                      <div>
                        <p className="text-[14px] font-black text-foreground">
                          Priya Sharma
                        </p>
                        <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                          Engineering
                        </p>
                      </div>
                    </div>
                  </td>
                  {UPCOMING_SHIFTS.map((shift, idx) => {
                    const conf =
                      SHIFT_COLORS[shift.type] || SHIFT_COLORS["Morning"];
                    return (
                      <td key={idx} className="p-2 border-b border-border">
                        <div
                          onClick={() => handleViewDetails(shift)}
                          className={`h-full min-h-[60px] rounded-xl p-2 flex flex-col items-center justify-center gap-1 border-t-4 shadow-sm group cursor-pointer transition-all hover:scale-[1.02] ${conf.bg} ${conf.border}`}
                        >
                          <p
                            className={`text-[11px] font-black uppercase tracking-wider ${conf.text}`}
                          >
                            {shift.type}
                          </p>
                          <p className="text-[10px] font-bold text-muted-foreground">
                            {shift.hours}
                          </p>
                        </div>
                      </td>
                    );
                  })}
                  <td className="p-2 border-b border-border">
                    <div
                      onClick={() => {
                        setSelectedShift({
                          id: "OFF",
                          date: "Apr 11",
                          day: "SAT",
                          type: "Off Day",
                          time: "N/A",
                          hours: "0h",
                          location: "N/A",
                          department: "Engineering",
                          manager: "Suresh Kumar",
                        });
                        setShowDetailsModal(true);
                      }}
                      className="h-full min-h-[60px] rounded-xl bg-secondary flex items-center justify-center border border-dashed border-border cursor-pointer hover:bg-secondary/80 transition-all"
                    >
                      <span className="text-[10px] font-black text-muted-foreground uppercase">
                        Off Day
                      </span>
                    </div>
                  </td>
                  <td className="p-2 border-b border-border">
                    <div className="h-full min-h-[60px] rounded-xl bg-secondary flex items-center justify-center border border-dashed border-border cursor-not-allowed">
                      <span className="text-[10px] font-black text-muted-foreground uppercase">
                        Off Day
                      </span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* ─── Upcoming Shifts List ─────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-[12px] font-black text-muted-foreground uppercase tracking-widest">
              UPCOMING SHIFTS
            </h3>
            <div className="space-y-3">
              {UPCOMING_SHIFTS.map((shift, index) => {
                const conf = SHIFT_COLORS[shift.type];
                const isLastTwo = index >= UPCOMING_SHIFTS.length - 2;
                return (
                  <div
                    key={shift.id}
                    className="bg-card p-5 rounded-[20px] border border-border shadow-sm flex items-center justify-between group hover:shadow-md transition-all relative"
                  >
                    <div
                      className="flex items-center gap-4 cursor-pointer"
                      onClick={() => handleViewDetails(shift)}
                    >
                      <div
                        className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center border ${conf.bg} ${conf.border} shadow-sm transition-transform group-hover:scale-105`}
                      >
                        <span className={`text-[14px] font-black ${conf.text}`}>
                          {shift.date.split(" ")[1]}
                        </span>
                        <span className="text-[10px] font-black text-muted-foreground uppercase">
                          {shift.date.split(" ")[0]}
                        </span>
                      </div>
                      <div>
                        <h4 className="text-[15px] font-black text-foreground">
                          {shift.type} Shift
                        </h4>
                        <p className="text-[12px] font-bold text-muted-foreground">
                          {shift.time} · {shift.hours}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border bg-emerald-500/10 text-primary border-primary/20`}
                      >
                        Confirmed
                      </span>
                      <div className="relative">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveMenuId(
                              activeMenuId === shift.id ? null : shift.id,
                            );
                          }}
                          className="p-2 text-muted-foreground/30 hover:text-foreground transition-colors rounded-lg hover:bg-secondary"
                        >
                          <MoreVertical size={18} />
                        </button>

                        {activeMenuId === shift.id && (
                          <div
                            className={`absolute right-0 ${isLastTwo ? "bottom-full mb-2" : "mt-2"} w-48 bg-card border border-border rounded-2xl shadow-2xl z-50 py-2 animate-in fade-in ${isLastTwo ? "slide-in-from-bottom-2" : "slide-in-from-top-2"} duration-200`}
                          >
                            {[
                              {
                                label: "View Details",
                                onClick: () => handleViewDetails(shift),
                              },
                              {
                                label: "Request Shift Swap",
                                onClick: () => handleRequestSwap(shift),
                              },
                              {
                                label: "Request Time Change",
                                onClick: () => {
                                  setSelectedShift(shift);
                                  setShowTimeChangeModal(true);
                                },
                              },
                              {
                                label: "Mark Availability",
                                onClick: () => setShowAvailabilityModal(true),
                              },
                              {
                                label: "Report Issue",
                                onClick: () => setShowIssueModal(true),
                              },
                            ].map((item, i) => (
                              <button
                                key={i}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  item.onClick();
                                  setActiveMenuId(null);
                                }}
                                className="w-full text-left px-4 py-2.5 text-[13px] font-bold text-foreground hover:bg-secondary transition-all"
                              >
                                {item.label}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-[12px] font-black text-muted-foreground uppercase tracking-widest">
              SHIFT NOTES
            </h3>
            <div className="bg-card p-6 rounded-[24px] border border-border shadow-sm space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-primary">
                  <CheckCircle2 size={20} />
                </div>
                <div>
                  <h5 className="text-[14px] font-black text-foreground">
                    Available Swaps
                  </h5>
                  <p className="text-[12px] font-bold text-muted-foreground">
                    2 colleagues looking to swap
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                  <AlertCircle size={20} />
                </div>
                <div>
                  <h5 className="text-[14px] font-black text-foreground">
                    Pending Requests
                  </h5>
                  <p className="text-[12px] font-bold text-muted-foreground">
                    {requests.filter((r) => r.status === "Pending").length}{" "}
                    request awaiting manager
                  </p>
                </div>
              </div>
              <button
                onClick={() => setCurrentPage("requests")}
                className="w-full py-3 bg-secondary text-primary text-[13px] font-black rounded-xl border border-primary/20 hover:bg-emerald-500/10 transition-all"
              >
                View My Requests
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full px-4 md:px-8 py-6 pb-20 overflow-hidden">
      {currentPage === "calendar" ? renderCalendar() : renderRequests()}

      {/* ─── Shift Details Modal ────────────────────────────────────── */}
      <Modal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        title="Shift Details"
        icon={Clock}
      >
        {selectedShift && (
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-secondary rounded-2xl border border-border">
              <div>
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                  Shift Type
                </p>
                <p className="text-[16px] font-black text-foreground">
                  {selectedShift.type} Shift
                </p>
              </div>
              <StatusBadge status="Approved" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl border border-border">
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">
                  Date
                </p>
                <p className="text-[14px] font-bold text-foreground">
                  {selectedShift.date}, 2026
                </p>
              </div>
              <div className="p-4 rounded-2xl border border-border">
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">
                  Duration
                </p>
                <p className="text-[14px] font-bold text-foreground">
                  {selectedShift.hours}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {[
                { label: "Timing", value: selectedShift.time },
                { label: "Location", value: selectedShift.location },
                { label: "Department", value: selectedShift.department },
                { label: "Reporting Manager", value: selectedShift.manager },
              ].map((item, i) => (
                <div key={i} className="flex justify-between items-center py-1">
                  <span className="text-[13px] font-bold text-muted-foreground">
                    {item.label}
                  </span>
                  <span className="text-[13px] font-black text-foreground">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>

            <div className="p-4 bg-amber-500/5 rounded-2xl border border-amber-500/10">
              <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-1">
                Notes
              </p>
              <p className="text-[12px] font-bold text-amber-700/70 italic">
                "Please ensure to clock in at least 10 minutes before the shift
                starts for the morning briefing."
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowDetailsModal(false)}
                className="flex-1 py-3.5 rounded-xl font-black text-[13px] bg-secondary text-foreground hover:bg-border transition-all"
              >
                Close
              </button>
              {selectedShift.type !== "Off Day" && (
                <button
                  onClick={() => {
                    setShowDetailsModal(false);
                    handleRequestSwap(selectedShift);
                  }}
                  className="flex-1 py-3.5 rounded-xl font-black text-[13px] bg-primary text-white shadow-lg shadow-emerald-500/20 hover:opacity-90 transition-all"
                >
                  Request Swap
                </button>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* ─── Swap Request Modal ────────────────────────────────────── */}
      <Modal
        isOpen={showSwapModal}
        onClose={() => setShowSwapModal(false)}
        title="Request Shift Swap"
        icon={ArrowLeftRight}
      >
        <div className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
              Your Current Shift
            </label>
            <input
              type="text"
              readOnly
              value={
                selectedShift
                  ? `${selectedShift.date} - ${selectedShift.type}`
                  : "Apr 06 - Morning Shift"
              }
              className="w-full px-4 py-3 bg-secondary border border-border rounded-xl text-[13px] font-bold text-muted-foreground outline-none cursor-not-allowed"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
              Swap With Employee
            </label>
            <select className="w-full px-4 py-3 bg-secondary border border-border rounded-xl text-[13px] font-bold text-foreground outline-none">
              <option value="">Select Employee</option>
              <option>Arjun Mehta</option>
              <option>Sara Khan</option>
              <option>Rohan Das</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
              Preferred Shift Date
            </label>
            <input
              type="date"
              className="w-full px-4 py-3 bg-secondary border border-border rounded-xl text-[13px] font-bold text-foreground outline-none"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
              Reason for Swap
            </label>
            <textarea
              rows={3}
              placeholder="Enter reason for swap..."
              className="w-full px-4 py-3 bg-secondary border border-border rounded-xl text-[13px] font-bold text-foreground outline-none resize-none"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button
              onClick={() => setShowSwapModal(false)}
              className="flex-1 py-3.5 rounded-xl font-black text-[13px] bg-secondary text-foreground hover:bg-border transition-all"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                const newReq: ShiftRequest = {
                  id: `REQ-${Math.floor(Math.random() * 1000)}`,
                  type: "Swap",
                  currentShift: selectedShift
                    ? `${selectedShift.date} - ${selectedShift.type}`
                    : "Apr 06 - Morning",
                  requestedShift: "Proposed Swap",
                  requestedDate: "Apr 12, 2026",
                  reason: "Personal reasons",
                  status: "Pending",
                  createdAt: "Today",
                };
                setRequests([newReq, ...requests]);
                showToast(
                  "Swap Requested",
                  "success",
                  "Your swap request has been sent for approval.",
                );
                setShowSwapModal(false);
              }}
              className="flex-1 py-3.5 rounded-xl font-black text-[13px] bg-primary text-white shadow-lg shadow-emerald-500/20 hover:opacity-90 transition-all"
            >
              Submit Request
            </button>
          </div>
        </div>
      </Modal>

      {/* ─── Time Change Request Modal ──────────────────────────────── */}
      <Modal
        isOpen={showTimeChangeModal}
        onClose={() => setShowTimeChangeModal(false)}
        title="Request Time Change"
        icon={Clock}
      >
        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                Current Start
              </label>
              <input
                type="text"
                readOnly
                value="08:00 AM"
                className="w-full px-4 py-3 bg-secondary border border-border rounded-xl text-[13px] font-bold text-muted-foreground outline-none cursor-not-allowed"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                Current End
              </label>
              <input
                type="text"
                readOnly
                value="04:00 PM"
                className="w-full px-4 py-3 bg-secondary border border-border rounded-xl text-[13px] font-bold text-muted-foreground outline-none cursor-not-allowed"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                Requested Start
              </label>
              <input
                type="time"
                className="w-full px-4 py-3 bg-secondary border border-border rounded-xl text-[13px] font-bold text-foreground outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                Requested End
              </label>
              <input
                type="time"
                className="w-full px-4 py-3 bg-secondary border border-border rounded-xl text-[13px] font-bold text-foreground outline-none"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
              Reason
            </label>
            <textarea
              rows={3}
              placeholder="Why do you need this change?"
              className="w-full px-4 py-3 bg-secondary border border-border rounded-xl text-[13px] font-bold text-foreground outline-none resize-none"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button
              onClick={() => setShowTimeChangeModal(false)}
              className="flex-1 py-3.5 rounded-xl font-black text-[13px] bg-secondary text-foreground hover:bg-border transition-all"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                showToast(
                  "Request Submitted",
                  "success",
                  "Time change request sent to manager.",
                );
                setShowTimeChangeModal(false);
              }}
              className="flex-1 py-3.5 rounded-xl font-black text-[13px] bg-primary text-white shadow-lg shadow-emerald-500/20 hover:opacity-90 transition-all"
            >
              Submit Request
            </button>
          </div>
        </div>
      </Modal>

      {/* ─── Availability Modal ─────────────────────────────────────── */}
      <Modal
        isOpen={showAvailabilityModal}
        onClose={() => setShowAvailabilityModal(false)}
        title="Mark Availability"
        icon={CheckCircle2}
      >
        <div className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
              Select Date
            </label>
            <input
              type="date"
              className="w-full px-4 py-3 bg-secondary border border-border rounded-xl text-[13px] font-bold text-foreground outline-none"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
              Status
            </label>
            <div className="grid grid-cols-3 gap-2">
              {["Available", "Not Available", "Preferred"].map((s) => (
                <button
                  key={s}
                  className="py-2.5 px-2 rounded-xl border border-border text-[11px] font-black text-muted-foreground hover:bg-secondary hover:text-primary transition-all active:scale-95"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
              Notes
            </label>
            <textarea
              rows={3}
              placeholder="Additional notes about your availability..."
              className="w-full px-4 py-3 bg-secondary border border-border rounded-xl text-[13px] font-bold text-foreground outline-none resize-none"
            />
          </div>
          <button
            onClick={() => {
              showToast(
                "Availability Saved",
                "success",
                "Your availability has been updated.",
              );
              setShowAvailabilityModal(false);
            }}
            className="w-full py-4 bg-primary text-white text-[14px] font-black rounded-2xl shadow-xl shadow-emerald-500/20 hover:opacity-95 transition-all mt-2"
          >
            Save Availability
          </button>
        </div>
      </Modal>

      {/* ─── Report Issue Modal ─────────────────────────────────────── */}
      <Modal
        isOpen={showIssueModal}
        onClose={() => setShowIssueModal(false)}
        title="Report Schedule Issue"
        icon={AlertCircle}
      >
        <div className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
              Issue Type
            </label>
            <select className="w-full px-4 py-3 bg-secondary border border-border rounded-xl text-[13px] font-bold text-foreground outline-none">
              <option>Wrong Shift Assigned</option>
              <option>Timing Mismatch</option>
              <option>Location Discrepancy</option>
              <option>Other</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
              Description
            </label>
            <textarea
              rows={4}
              placeholder="Please describe the issue in detail..."
              className="w-full px-4 py-3 bg-secondary border border-border rounded-xl text-[13px] font-bold text-foreground outline-none resize-none"
            />
          </div>
          <button
            onClick={() => {
              showToast(
                "Issue Reported",
                "success",
                "Your schedule issue has been reported.",
              );
              setShowIssueModal(false);
            }}
            className="w-full py-4 bg-red-500 text-white text-[14px] font-black rounded-2xl shadow-xl shadow-red-500/20 hover:opacity-95 transition-all mt-2"
          >
            Submit Issue
          </button>
        </div>
      </Modal>

      {/* ─── Request Details Modal ─────────────────────────────────── */}
      <Modal
        isOpen={showRequestDetail}
        onClose={() => setShowRequestDetail(false)}
        title="Shift Request Details"
        icon={Clock}
      >
        {selectedRequest && (
          <div className="space-y-6">
            <div className="p-4 bg-secondary rounded-2xl border border-border flex justify-between items-center">
              <div>
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">
                  Request Type
                </p>
                <p className="text-[16px] font-black text-foreground">
                  {selectedRequest.type} Request
                </p>
              </div>
              <StatusBadge status={selectedRequest.status} />
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">
                    Current
                  </p>
                  <p className="text-[13px] font-bold text-foreground">
                    {selectedRequest.currentShift}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">
                    Requested
                  </p>
                  <p className="text-[13px] font-bold text-primary">
                    {selectedRequest.requestedShift}
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">
                  Reason
                </p>
                <p className="text-[13px] font-bold text-foreground/80">
                  {selectedRequest.reason}
                </p>
              </div>

              {selectedRequest.managerComment && (
                <div className="p-4 bg-emerald-500/5 rounded-2xl border border-emerald-500/10">
                  <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">
                    Manager Comment
                  </p>
                  <p className="text-[13px] font-bold text-primary/80 italic">
                    "{selectedRequest.managerComment}"
                  </p>
                </div>
              )}

              <div className="pt-4">
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-4">
                  Timeline
                </p>
                <div className="relative pl-6 space-y-6">
                  <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-border" />
                  {[
                    { label: "Submitted", status: "completed", date: selectedRequest.createdAt },
                    { label: "Manager Review", status: selectedRequest.status === "Pending" ? "active" : "completed", date: "In Progress" },
                    { label: selectedRequest.status, status: selectedRequest.status === "Pending" ? "upcoming" : "completed", date: "Final Action" },
                  ].map((step, i) => (
                    <div key={i} className="relative flex items-center gap-3">
                      <div
                        className={`absolute -left-[23px] w-4 h-4 rounded-full border-2 bg-card z-10 ${step.status === "completed" ? "border-primary bg-primary" : step.status === "active" ? "border-primary" : "border-border"}`}
                      />
                      <div className="flex flex-col">
                        <span className="text-[13px] font-black text-foreground">
                          {step.label}
                        </span>
                        <span className="text-[11px] font-bold text-muted-foreground">
                          {step.date}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={() => setShowRequestDetail(false)}
                className="flex-1 py-3.5 rounded-xl font-black text-[13px] bg-secondary text-foreground hover:bg-border transition-all"
              >
                Close
              </button>
              {selectedRequest.status === "Pending" && (
                <button
                  onClick={() => {
                    setRequestToCancel(selectedRequest);
                    setShowCancelModal(true);
                  }}
                  className="flex-1 py-3.5 rounded-xl font-black text-[13px] bg-red-500 text-white hover:opacity-90 transition-all"
                >
                  Cancel Request
                </button>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* ─── Cancel Confirmation Modal ─────────────────────────────── */}
      <Modal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        title="Cancel Request"
        icon={AlertCircle}
      >
        <div className="space-y-6 text-center">
          <div className="w-16 h-16 rounded-3xl bg-red-500/10 flex items-center justify-center text-red-500 mx-auto">
            <AlertCircle size={32} />
          </div>
          <div className="space-y-2">
            <h4 className="text-[18px] font-black text-foreground">
              Are you sure?
            </h4>
            <p className="text-[14px] font-bold text-muted-foreground leading-relaxed px-4">
              You are about to cancel this shift request. This action cannot be
              undone.
            </p>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={() => setShowCancelModal(false)}
              className="flex-1 py-3.5 rounded-xl font-black text-[13px] bg-secondary text-foreground hover:bg-border transition-all"
            >
              No, Keep It
            </button>
            <button
              onClick={() => {
                if (requestToCancel) {
                  setRequests((prev) =>
                    prev.map((r) =>
                      r.id === requestToCancel.id
                        ? { ...r, status: "Cancelled" }
                        : r,
                    ),
                  );
                  showToast(
                    "Request Cancelled",
                    "info",
                    "Your request has been cancelled.",
                  );
                }
                setShowCancelModal(false);
                setShowRequestDetail(false);
              }}
              className="flex-1 py-3.5 rounded-xl font-black text-[13px] bg-red-500 text-white shadow-lg shadow-red-500/20 hover:opacity-90 transition-all"
            >
              Yes, Cancel Request
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
