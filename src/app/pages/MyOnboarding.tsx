import { useState } from "react";
import { useNavigate } from "react-router";
import {
  Sprout, CheckCircle2, Clock, Calendar, Download,
  Upload, X, ChevronDown,
  Circle, User,
  Edit3, Monitor,
  Check,
  Play, CreditCard,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { showToast } from "../components/workflow/ToastNotification";

/* ─── Types ─── */
type ModalType = "form" | "upload" | "esign" | "video" | "schedule" | "bank-form" | null;
type FormType = "it-setup" | "bank-account";

interface Task {
  id: string; title: string; owner: string; due: string; status: "done" | "in-progress" | "pending" | "overdue";
  actionLabel?: string; actionType?: "form" | "upload" | "esign" | "video" | "schedule" | "view-team" | "calendar" | "link";
}
interface Phase {
  id: string; name: string; status: "completed" | "in-progress" | "upcoming"; date: string; tasks: Task[];
}
interface Contact {
  name: string; role: string; email: string; avatar: string; color: string; action: string; actionType: string;
}
interface QuickLink {
  icon: string; label: string; desc: string; action: string;
}
interface DocItem {
  name: string; status: "uploaded" | "pending" | "required";
}

/* ─── Mock Data ─── */
const TODAYS_TASKS: Task[] = [
  { id: "tt1", title: "Complete laptop setup form", owner: "IT Team", due: "Due Today", status: "pending", actionLabel: "Fill Form", actionType: "form" },
  { id: "tt2", title: "Upload Passport Photo", owner: "HR", due: "Due Today", status: "pending", actionLabel: "Upload", actionType: "upload" },
  { id: "tt3", title: "Sign NDA Agreement", owner: "HR", due: "Due Today", status: "pending", actionLabel: "Sign Now", actionType: "esign" },
  { id: "tt4", title: "Watch company culture video", owner: "HR", due: "Due Today", status: "pending", actionLabel: "Watch", actionType: "video" },
  { id: "tt5", title: "Schedule 1:1 with Suresh Iyer", owner: "Manager", due: "Due Apr 10", status: "pending", actionLabel: "Schedule", actionType: "schedule" },
];

const PHASES: Phase[] = [
  { id: "p1", name: "Pre-Joining", status: "completed", date: "Completed Apr 5", tasks: [
    { id: "pj1", title: "Welcome email received", owner: "HR", due: "Apr 1", status: "done" },
    { id: "pj2", title: "Offer letter signed", owner: "Employee", due: "Apr 2", status: "done" },
    { id: "pj3", title: "Background verification", owner: "HR", due: "Apr 3", status: "done" },
    { id: "pj4", title: "Documents submitted", owner: "Employee", due: "Apr 3", status: "done" },
    { id: "pj5", title: "IT equipment ordered", owner: "IT", due: "Apr 4", status: "done" },
  ]},
  { id: "p2", name: "Day 1", status: "in-progress", date: "Today — Apr 8, 2026", tasks: [
    { id: "d1", title: "System credentials received", owner: "IT", due: "Apr 7", status: "done" },
    { id: "d2", title: "Email account setup", owner: "IT", due: "Apr 7", status: "done" },
    { id: "d3", title: "Laptop setup & configuration", owner: "IT", due: "Apr 8", status: "in-progress", actionLabel: "IT Working", actionType: "link" },
    { id: "d4", title: "Upload Passport Photo", owner: "HR", due: "Due Today", status: "pending", actionLabel: "Upload", actionType: "upload" },
    { id: "d5", title: "Sign NDA Agreement", owner: "HR", due: "Due Today", status: "pending", actionLabel: "Sign", actionType: "esign" },
    { id: "d6", title: "Attend welcome meeting", owner: "HR", due: "Apr 8, 2PM", status: "pending", actionLabel: "Add to Calendar", actionType: "calendar" },
    { id: "d7", title: "Meet your team", owner: "Manager", due: "Apr 8", status: "pending", actionLabel: "View Team", actionType: "view-team" },
  ]},
  { id: "p3", name: "Week 1", status: "upcoming", date: "Apr 9–14, 2026", tasks: [
    { id: "w1", title: "Department orientation", owner: "HR", due: "Apr 9", status: "pending" },
    { id: "w2", title: "System access setup", owner: "IT", due: "Apr 9", status: "pending" },
    { id: "w3", title: "NDA & policy signing", owner: "HR", due: "Apr 10", status: "pending" },
    { id: "w4", title: "HR policy training", owner: "HR", due: "Apr 11", status: "pending" },
    { id: "w5", title: "1:1 with manager", owner: "Manager", due: "Apr 10", status: "pending" },
    { id: "w6", title: "Stakeholder intros", owner: "Manager", due: "Apr 11", status: "pending" },
    { id: "w7", title: "Insurance enrollment", owner: "Finance", due: "Apr 12", status: "pending" },
  ]},
  { id: "p4", name: "Month 1", status: "upcoming", date: "Apr 8 – May 8, 2026", tasks: [
    { id: "m1", title: "Role-specific training", owner: "Manager", due: "Apr 22", status: "pending" },
    { id: "m2", title: "Company culture session", owner: "HR", due: "Apr 15", status: "pending" },
    { id: "m3", title: "E-learning modules", owner: "HR", due: "Apr 30", status: "pending" },
    { id: "m4", title: "Set FY goals", owner: "Manager", due: "Apr 20", status: "pending" },
    { id: "m5", title: "Performance check-in", owner: "Manager", due: "May 1", status: "pending" },
    { id: "m6", title: "Buddy program enrollment", owner: "HR", due: "Apr 15", status: "pending" },
    { id: "m7", title: "30-day feedback form", owner: "HR", due: "May 8", status: "pending" },
  ]},
  { id: "p5", name: "Complete", status: "upcoming", date: "Est. May 8, 2026", tasks: [] },
];

const CONTACTS: Contact[] = [
  { name: "Ryan Park", role: "HR Owner", email: "ryan@nexushr.com", avatar: "RP", color: "#00B87C", action: "Message", actionType: "message" },
  { name: "Suresh Iyer", role: "Your Manager", email: "suresh@nexushr.com", avatar: "SI", color: "#8B5CF6", action: "Message", actionType: "message" },
  { name: "Arjun Mehta", role: "Your Buddy", email: "arjun@nexushr.com", avatar: "AM", color: "#F59E0B", action: "Say Hi 👋", actionType: "message" },
  { name: "IT Team", role: "IT Support", email: "it@nexushr.com", avatar: "IT", color: "#0EA5E9", action: "Raise Ticket", actionType: "ticket" },
];

const QUICK_LINKS: QuickLink[] = [
  { icon: "📖", label: "Employee Handbook", desc: "Company policies & guidelines", action: "handbook" },
  { icon: "🏢", label: "Office Map", desc: "Floor plan & desk locations", action: "map" },
  { icon: "💻", label: "IT Setup Guide", desc: "Device & access setup steps", action: "it-guide" },
  { icon: "🍽", label: "Cafeteria Menu", desc: "Weekly meals & timings", action: "cafeteria" },
  { icon: "🚌", label: "Transport Guide", desc: "Shuttle routes & schedules", action: "transport" },
  { icon: "📞", label: "Emergency Contacts", desc: "Important phone numbers", action: "emergency" },
];

const DOCUMENTS: DocItem[] = [
  { name: "Aadhar Card", status: "uploaded" },
  { name: "PAN Card", status: "uploaded" },
  { name: "Degree Certificate", status: "uploaded" },
  { name: "Passport Photo", status: "pending" },
  { name: "Bank Account Details", status: "pending" },
  { name: "Experience Letter", status: "required" },
  { name: "Medical Certificate", status: "required" },
  { name: "NDA Signed Copy", status: "required" },
];

/* ─── Task Status Icon ─── */
const TaskIcon = ({ status }: { status: string }) => {
  if (status === "done") return <CheckCircle2 size={18} className="text-primary shrink-0" />;
  if (status === "in-progress") return <Clock size={18} className="text-amber-500 shrink-0" />;
  if (status === "overdue") return <XCircle size={18} className="text-destructive shrink-0" />;
  if (status === "completed") return <CheckCircle2 size={18} className="text-primary shrink-0" />;
  return <Circle size={18} className="text-muted-foreground/40 shrink-0" />;
};

const XCircle = ({ size, className }: { size: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" />
  </svg>
);

const progressCircle = (pct: number, size: number = 72, strokeWidth: number = 6) => {
  const r = (size / 2) - (strokeWidth / 2);
  const circumference = 2 * Math.PI * r;
  const offset = circumference * (1 - pct / 100);
  return (
    <svg width={size} height={size} className="transform -rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" className="stroke-muted" strokeWidth={strokeWidth} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" className="stroke-primary" strokeWidth={strokeWidth} strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" />
    </svg>
  );
};

/* ─── Main Component ─── */
export function MyOnboarding() {
  const navigate = useNavigate();
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [formType, setFormType] = useState<FormType>("it-setup");
  const [expandedPhase, setExpandedPhase] = useState("p2");
  const [esignStep, setEsignStep] = useState<"draw" | "type" | "upload">("draw");
  const [esignAgreed, setEsignAgreed] = useState(false);
  const [esignSignature, setEsignSignature] = useState("");
  const [videoWatched, setVideoWatched] = useState(false);
  const [calendarModal, setCalendarModal] = useState(false);
  const [selectedBankAccType, setSelectedBankAccType] = useState("Savings");

  const doneToday = TODAYS_TASKS.filter(t => t.status === "done").length;
  const totalToday = TODAYS_TASKS.length;
  const doneDocs = DOCUMENTS.filter(d => d.status === "uploaded").length;
  const totalDocs = DOCUMENTS.length;
  const totalAllTasks = PHASES.reduce((s, p) => s + p.tasks.length, 0);
  const doneAllTasks = PHASES.reduce((s, p) => s + p.tasks.filter(t => t.status === "done").length, 0);
  const progressPct = Math.round((doneAllTasks / totalAllTasks) * 100);

  const handleAction = (actionType: string) => {
    if (actionType === "form") { setFormType("it-setup"); setActiveModal("form"); }
    else if (actionType === "bank-form") { setFormType("bank-account"); setActiveModal("form"); }
    else if (actionType === "upload") setActiveModal("upload");
    else if (actionType === "esign") setActiveModal("esign");
    else if (actionType === "video") setActiveModal("video");
    else if (actionType === "schedule") setCalendarModal(true);
    else if (actionType === "view-team") { showToast("Opening Team Directory", "info"); navigate("/employees"); }
    else if (actionType === "calendar") showToast("Added to Calendar", "success", "Event added to your Google Calendar.");
    else if (actionType === "link") showToast("Info", "info", "IT team is working on this.");
    else if (actionType === "message") showToast("Message Composed", "success", "Message sent successfully.");
    else if (actionType === "ticket") { showToast("Opening Support", "info"); navigate("/support"); }
    else if (actionType === "handbook" || actionType === "it-guide") showToast("Opening PDF", "info", "Document will open in a new tab.");
    else if (actionType === "map" || actionType === "transport") showToast("Opening Map", "info", "Interactive map loading...");
    else if (actionType === "cafeteria") showToast("Cafeteria Menu", "info", "Today's special: Biryani 🍛");
    else if (actionType === "emergency") showToast("Emergency Contacts", "info", "Security: 100, Medical: 102, Fire: 101");
  };

  const getDayChip = () => {
    const today = new Date();
    const start = new Date("2026-04-06");
    const diff = Math.floor((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    return `Day ${Math.max(1, Math.min(diff, 30))} of Onboarding`;
  };

  return (
    <div className="w-full px-4 md:px-8 py-6 pb-10 space-y-6 animate-in fade-in duration-500 bg-background">
      {/* PAGE HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
            <Sprout size={24} className="text-primary" />
          </div>
          <div>
            <h1 className="text-[26px] font-black text-foreground tracking-tight">My Onboarding</h1>
            <p className="text-[13px] font-semibold text-muted-foreground">Welcome to NexusHR! Your onboarding journey starts here.</p>
          </div>
        </div>
        <button onClick={() => { showToast("Downloading Guide", "success", "Onboarding guide PDF downloaded."); }} className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border text-foreground font-black text-[12px] uppercase tracking-widest hover:bg-muted/50 transition-all">
          <Download size={16} /> Download Guide
        </button>
      </div>

      {/* WELCOME BANNER */}
      <div className="relative bg-card border border-border rounded-[32px] p-6 shadow-sm overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-primary/[0.08] to-transparent pointer-events-none" />
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="flex-1 space-y-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl animate-bounce inline-block">👋</span>
                <h2 className="text-[22px] font-black text-foreground tracking-tight">Welcome to NexusHR, Priya! 🎉</h2>
              </div>
              <p className="text-[14px] text-muted-foreground mt-1">We're so excited to have you join the Engineering team.</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/10 text-teal-500 text-[11px] font-black"><Calendar size={12} /> Your Journey: Apr 8 – May 8, 2026 (30 days)</div>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-[12px] text-muted-foreground">
              <div className="flex items-center gap-2"><div className="w-6 h-6 rounded-full bg-[#8B5CF6] flex items-center justify-center text-white text-[8px] font-black">SI</div>Manager: Suresh Iyer</div>
              <div className="flex items-center gap-2"><div className="w-6 h-6 rounded-full bg-[#00B87C] flex items-center justify-center text-white text-[8px] font-black">RP</div>HR Owner: Ryan Park</div>
              <div className="flex items-center gap-2"><div className="w-6 h-6 rounded-full bg-[#F59E0B] flex items-center justify-center text-white text-[8px] font-black">AM</div>Buddy: Arjun Mehta</div>
            </div>
          </div>
          <div className="flex flex-col items-center shrink-0">
            <div className="relative w-[72px] h-[72px]">
              {progressCircle(progressPct, 72, 6)}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-[20px] font-black text-primary">{progressPct}%</span>
                <span className="text-[10px] text-muted-foreground -mt-1">Complete</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* TODAY'S TASKS */}
      <div className="bg-card border border-border rounded-[32px] p-6 shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <h3 className="text-[11px] font-black text-foreground uppercase tracking-[0.2em]">Today's Tasks</h3>
            <span className="px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-500 text-[9px] font-black uppercase tracking-wider">{getDayChip()}</span>
          </div>
          <span className="text-[11px] font-bold text-muted-foreground">{doneToday}/{totalToday} done</span>
        </div>
        <div className="space-y-1">
          {TODAYS_TASKS.map(task => (
            <div key={task.id} className="flex items-center justify-between py-3 px-4 rounded-2xl hover:bg-muted transition-all cursor-pointer group" style={{ minHeight: "56px" }}>
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <TaskIcon status={task.status} />
                <div className="min-w-0 flex-1">
                  <p className={`text-[13px] font-bold ${task.status === "done" ? "text-muted-foreground line-through" : "text-foreground"}`}>{task.title}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] text-muted-foreground flex items-center gap-1"><User size={10} /> {task.owner}</span>
                    <span className="w-1 h-1 rounded-full bg-border" />
                    <span className={`text-[10px] font-bold ${task.due === "Due Today" ? "text-amber-500" : "text-muted-foreground"}`}>{task.due}</span>
                  </div>
                </div>
              </div>
              {task.actionLabel && task.actionType && (
                <button onClick={(e) => { e.stopPropagation(); handleAction(task.actionType!); }} className={`shrink-0 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${task.actionType === "esign" || task.actionType === "form" || task.actionType === "upload" ? "bg-primary text-white hover:opacity-90 shadow-sm" : "border border-border text-foreground hover:bg-muted/50"}`}>
                  {task.actionLabel}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* MY ONBOARDING JOURNEY */}
      <div className="bg-card border border-border rounded-[32px] p-6 shadow-sm">
        <h3 className="text-[11px] font-black text-foreground uppercase tracking-[0.2em] mb-6">My Onboarding Journey</h3>

        {/* Horizontal Stepper */}
        <div className="flex items-center justify-between mb-8 px-2">
          {PHASES.map((phase, i) => (
            <div key={phase.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${phase.status === "completed" ? "bg-primary border-primary" : phase.status === "in-progress" ? "border-teal-500 bg-card" : "border-border bg-card"}`}>
                  {phase.status === "completed" ? <Check size={16} className="text-white" /> : phase.status === "in-progress" ? <div className="w-3 h-3 rounded-full bg-teal-500 animate-pulse" /> : <div className="w-3 h-3 rounded-full bg-muted-foreground/30" />}
                </div>
                <span className={`text-[10px] font-black mt-1.5 text-center ${phase.status === "completed" ? "text-primary" : phase.status === "in-progress" ? "text-teal-500" : "text-muted-foreground"}`}>{phase.name}</span>
              </div>
              {i < PHASES.length - 1 && (
                <div className={`flex-1 h-[2px] mx-2 ${phase.status === "completed" ? "bg-primary" : "border-t-2 border-dashed border-border"}`} />
              )}
            </div>
          ))}
        </div>

        {/* Phase Accordions */}
        <div className="space-y-3">
          {PHASES.map(phase => {
            const done = phase.tasks.filter(t => t.status === "done").length;
            const total = phase.tasks.length;
            const isExpanded = expandedPhase === phase.id;
            const isMuted = phase.status === "upcoming";
            return (
              <div key={phase.id} className={`rounded-2xl border transition-all ${isExpanded ? "border-primary/30 bg-muted/40" : "border-border"} ${isMuted && !isExpanded ? "opacity-60" : ""}`}>
                <button onClick={() => setExpandedPhase(isExpanded ? "" : phase.id)} className="w-full flex items-center justify-between px-5 py-4 text-left">
                  <div className="flex items-center gap-3">
                    <TaskIcon status={phase.status} />
                    <div>
                      <h4 className={`text-[14px] font-bold ${phase.status === "completed" ? "text-primary" : phase.status === "in-progress" ? "text-teal-500" : "text-muted-foreground"}`}>{phase.name}</h4>
                      <p className="text-[11px] text-muted-foreground">{phase.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {total > 0 && <span className="text-[11px] font-bold text-muted-foreground">{done}/{total} done</span>}
                    <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${phase.status === "completed" ? "bg-primary/10 text-primary" : phase.status === "in-progress" ? "bg-teal-500/10 text-teal-500" : "bg-muted text-muted-foreground"}`}>
                      {phase.status === "completed" ? "Completed" : phase.status === "in-progress" ? "In Progress" : phase.tasks.length > 0 ? `${phase.tasks.length} tasks` : "Upcoming"}
                    </span>
                    <ChevronDown size={16} className={`text-muted-foreground transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                  </div>
                </button>
                {isExpanded && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="px-5 pb-4 space-y-1">
                    {phase.tasks.length > 0 ? phase.tasks.map(task => (
                      <div key={task.id} className="flex items-center justify-between py-2 px-3 rounded-xl hover:bg-muted/30 transition-all group">
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <TaskIcon status={task.status} />
                          <div className="min-w-0 flex-1">
                            <span className={`text-[12px] font-bold ${task.status === "done" ? "text-muted-foreground line-through" : "text-foreground"}`}>{task.title}</span>
                            <span className="text-[10px] text-muted-foreground ml-2">({task.owner})</span>
                          </div>
                        </div>
                        {task.actionLabel && task.actionType && (
                          <button onClick={() => handleAction(task.actionType!)} className="text-[10px] font-black text-primary uppercase tracking-wider hover:underline shrink-0">{task.actionLabel}</button>
                        )}
                      </div>
                    )) : (
                      <div className="py-3 px-3 text-center">
                        <p className="text-[12px] text-muted-foreground">Phase will begin once previous phase is completed.</p>
                      </div>
                    )}
                  </motion.div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* YOUR ONBOARDING TEAM */}
      <div className="bg-card border border-border rounded-[32px] p-6 shadow-sm">
        <h3 className="text-[11px] font-black text-foreground uppercase tracking-[0.2em] mb-5">Your Onboarding Team</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {CONTACTS.map(contact => (
            <div key={contact.email} className="p-4 bg-card border border-border rounded-2xl hover:shadow-md transition-all group">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-[12px] font-black" style={{ backgroundColor: contact.color }}>{contact.avatar}</div>
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-bold text-foreground truncate">{contact.name}</p>
                  <p className="text-[11px] text-muted-foreground">{contact.role}</p>
                </div>
              </div>
              <p className="text-[11px] text-muted-foreground mb-3 truncate">{contact.email}</p>
              <button onClick={() => handleAction(contact.actionType)} className={`w-full py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${contact.actionType === "ticket" ? "border border-border text-foreground hover:bg-muted/50" : "bg-primary text-white hover:opacity-90 shadow-sm"}`}>
                {contact.action}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* QUICK LINKS */}
      <div className="bg-card border border-border rounded-[32px] p-6 shadow-sm">
        <h3 className="text-[11px] font-black text-foreground uppercase tracking-[0.2em] mb-5">Helpful Links</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {QUICK_LINKS.map(link => (
            <button key={link.label} onClick={() => handleAction(link.action)} className="p-4 bg-card border border-border rounded-2xl hover:shadow-md hover:border-primary/30 transition-all text-left group">
              <span className="text-2xl mb-2 block">{link.icon}</span>
              <p className="text-[12px] font-bold text-foreground group-hover:text-primary transition-colors">{link.label}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">{link.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* MY DOCUMENTS */}
      <div className="bg-card border border-border rounded-[32px] p-6 shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-[11px] font-black text-foreground uppercase tracking-[0.2em]">My Documents</h3>
            <p className="text-[11px] text-muted-foreground mt-0.5">{doneDocs}/{totalDocs} Uploaded</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-32 h-[6px] bg-muted rounded-full overflow-hidden"><div className="h-full rounded-full bg-primary" style={{ width: `${(doneDocs / totalDocs) * 100}%` }} /></div>
            <span className="text-[11px] font-bold text-primary">{Math.round((doneDocs / totalDocs) * 100)}%</span>
          </div>
        </div>
        <div className="space-y-2">
          {DOCUMENTS.map(doc => (
            <div key={doc.name} className="flex items-center justify-between py-2.5 px-4 rounded-xl hover:bg-muted/20 transition-all">
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${doc.status === "uploaded" ? "bg-primary" : doc.status === "pending" ? "bg-amber-500" : "bg-destructive"}`} />
                <span className="text-[13px] font-bold text-foreground">{doc.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-[10px] font-black uppercase tracking-wider ${doc.status === "uploaded" ? "text-primary" : doc.status === "pending" ? "text-amber-500" : "text-destructive"}`}>
                  {doc.status === "uploaded" ? "Uploaded" : doc.status === "pending" ? "Pending" : "Required"}
                </span>
                {doc.status !== "uploaded" && (
                  <button onClick={() => setActiveModal("upload")} className="px-3 py-1.5 rounded-lg bg-primary text-white text-[9px] font-black uppercase tracking-wider hover:opacity-90 transition-all">Upload +</button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── FORM MODAL (IT Setup / Bank Account) ─── */}
      <AnimatePresence>{activeModal === "form" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setActiveModal(null)}>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} onClick={e => e.stopPropagation()} className="bg-card border border-border rounded-[32px] w-full max-w-[480px] max-h-[90vh] overflow-hidden shadow-2xl">
            <div className="px-6 py-5 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${formType === "bank-account" ? "bg-primary/10" : "bg-sky-500/10"}`}>
                  {formType === "bank-account" ? <CreditCard size={20} className="text-primary" /> : <Monitor size={20} className="text-sky-500" />}
                </div>
                <h2 className="text-lg font-black text-foreground">{formType === "bank-account" ? "Bank Account Setup" : "IT Setup Form"}</h2>
              </div>
              <button onClick={() => setActiveModal(null)} className="w-10 h-10 rounded-xl border border-border flex items-center justify-center hover:bg-muted transition-all"><X size={18} /></button>
            </div>
            <div className="px-6 py-5 space-y-4 max-h-[55vh] overflow-y-auto">
              {formType === "it-setup" ? (
                <>
                  <div><label className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-1.5 block">Preferred Laptop OS</label>
                    <div className="flex gap-2">{["Windows", "macOS", "Linux"].map(os => <button key={os} className="px-4 py-2 rounded-xl border border-border text-[11px] font-black uppercase tracking-wider hover:bg-primary hover:text-white hover:border-primary transition-all">{os}</button>)}</div>
                  </div>
                  <div><label className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-1.5 block">Monitor Required?</label>
                    <div className="flex gap-2">{["Yes, 1 Monitor", "Yes, 2 Monitors", "No"].map(m => <button key={m} className="px-4 py-2 rounded-xl border border-border text-[11px] font-black uppercase tracking-wider hover:bg-primary hover:text-white hover:border-primary transition-all">{m}</button>)}</div>
                  </div>
                  <div><label className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-1.5 block">Special Equipment / Requirements</label>
                    <textarea className="w-full px-4 py-3 rounded-2xl border border-border bg-background text-[12px] font-bold outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none" rows={3} placeholder="Any additional equipment or setup needs..." />
                  </div>
                </>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2"><label className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-1.5 block">Account Holder Name</label>
                      <input type="text" placeholder="Priya Sharma" className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-[12px] font-bold outline-none focus:ring-2 focus:ring-primary/20 transition-all" />
                    </div>
                    <div><label className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-1.5 block">Bank Name</label>
                      <input type="text" placeholder="e.g. HDFC Bank" className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-[12px] font-bold outline-none focus:ring-2 focus:ring-primary/20 transition-all" />
                    </div>
                    <div><label className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-1.5 block">Account Number</label>
                      <input type="text" placeholder="Enter account number" className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-[12px] font-bold outline-none focus:ring-2 focus:ring-primary/20 transition-all" />
                    </div>
                    <div><label className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-1.5 block">IFSC Code</label>
                      <input type="text" placeholder="e.g. HDFC0001234" className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-[12px] font-bold outline-none focus:ring-2 focus:ring-primary/20 transition-all" />
                    </div>
                    <div><label className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-1.5 block">Branch</label>
                      <input type="text" placeholder="Branch name" className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-[12px] font-bold outline-none focus:ring-2 focus:ring-primary/20 transition-all" />
                    </div>
                  </div>
                  <div><label className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-1.5 block">Account Type</label>
                    <div className="flex gap-2">{
                      ["Savings", "Current"].map(type => (
                        <button key={type} onClick={() => setSelectedBankAccType(type)} className={`px-5 py-2 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all ${selectedBankAccType === type ? "bg-primary text-white shadow-sm" : "border border-border hover:bg-muted/50"}`}>{type}</button>
                      ))
                    }</div>
                  </div>
                  <div><label className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-1.5 block">Upload Passbook / Cheque</label>
                    <div className="border-2 border-dashed border-border rounded-2xl p-6 text-center hover:border-primary/40 transition-all cursor-pointer">
                      <Upload size={24} className="mx-auto text-muted-foreground/60 mb-2" />
                      <p className="text-[11px] font-bold text-foreground">Drop file here or click to browse</p>
                      <p className="text-[10px] text-muted-foreground">PDF, JPG, PNG — Max 5MB</p>
                    </div>
                  </div>
                </>
              )}
            </div>
            <div className="px-6 py-4 border-t border-border flex items-center justify-end gap-3">
              <button onClick={() => setActiveModal(null)} className="px-5 py-2.5 rounded-xl border border-border text-[11px] font-black uppercase tracking-widest hover:bg-muted transition-all">Cancel</button>
              <button onClick={() => { showToast(formType === "bank-account" ? "Bank Details Saved" : "Form Submitted", "success", formType === "bank-account" ? "Your bank account details have been submitted for verification." : "Your IT setup preferences have been submitted."); setActiveModal(null); }} className="px-5 py-2.5 rounded-xl bg-primary text-white text-[11px] font-black uppercase tracking-widest hover:opacity-90 transition-all shadow-md">{formType === "bank-account" ? "Save & Submit" : "Submit"}</button>
            </div>
          </motion.div>
        </motion.div>
      )}</AnimatePresence>

      {/* ─── UPLOAD MODAL ─── */}
      <AnimatePresence>{activeModal === "upload" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setActiveModal(null)}>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} onClick={e => e.stopPropagation()} className="bg-card border border-border rounded-[32px] w-full max-w-md overflow-hidden shadow-2xl">
            <div className="px-6 py-5 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center"><Upload size={20} className="text-violet-500" /></div><h2 className="text-lg font-black text-foreground">Upload Document</h2></div>
              <button onClick={() => setActiveModal(null)} className="w-10 h-10 rounded-xl border border-border flex items-center justify-center hover:bg-muted transition-all"><X size={18} /></button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div className="border-2 border-dashed border-border rounded-2xl p-8 text-center hover:border-violet-500/40 transition-all cursor-pointer">
                <Upload size={32} className="mx-auto text-muted-foreground/60 mb-3" />
                <p className="text-[13px] font-bold text-foreground">Drop files here or click to browse</p>
                <p className="text-[11px] text-muted-foreground mt-1">PDF, JPG, PNG — Max 10MB</p>
              </div>
              <div><label className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-1.5 block">Document Type</label>
                <select className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-[12px] font-bold outline-none">
                  <option>Passport Photo</option><option>Bank Account Details</option><option>Experience Letter</option><option>Medical Certificate</option><option>Other</option>
                </select>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-border flex items-center justify-end gap-3">
              <button onClick={() => setActiveModal(null)} className="px-5 py-2.5 rounded-xl border border-border text-[11px] font-black uppercase tracking-widest hover:bg-muted transition-all">Cancel</button>
              <button onClick={() => { showToast("Uploaded", "success", "Document uploaded successfully."); setActiveModal(null); }} className="px-5 py-2.5 rounded-xl bg-violet-500 text-white text-[11px] font-black uppercase tracking-widest hover:opacity-90 transition-all shadow-md">Upload</button>
            </div>
          </motion.div>
        </motion.div>
      )}</AnimatePresence>

      {/* ─── E-SIGNATURE MODAL ─── */}
      <AnimatePresence>{activeModal === "esign" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setActiveModal(null)}>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} onClick={e => e.stopPropagation()} className="bg-card border border-border rounded-[32px] w-full max-w-[540px] max-h-[90vh] overflow-hidden shadow-2xl">
            <div className="px-6 py-5 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center"><Edit3 size={20} className="text-primary" /></div><h2 className="text-lg font-black text-foreground">Sign NDA Agreement</h2></div>
              <button onClick={() => setActiveModal(null)} className="w-10 h-10 rounded-xl border border-border flex items-center justify-center hover:bg-muted transition-all"><X size={18} /></button>
            </div>
            <div className="px-6 py-5 space-y-4 max-h-[50vh] overflow-y-auto">
              <div className="p-4 rounded-2xl bg-muted border border-border text-[11px] text-muted-foreground leading-relaxed max-h-40 overflow-y-auto">
                <p className="font-bold text-foreground mb-2">NON-DISCLOSURE AGREEMENT</p>
                <p>This NDA is entered into between NexusHR Technologies and the undersigned employee... The employee agrees not to disclose any confidential information including trade secrets, customer data, financial information, business strategies, technical data, and any proprietary information gained during employment. This agreement shall remain in effect for the duration of employment and for a period of 3 years thereafter. Any breach of this agreement may result in legal action including but not limited to injunctive relief and damages.</p>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={esignAgreed} onChange={e => setEsignAgreed(e.target.checked)} className="w-4 h-4 rounded border-border accent-primary" />
                <span className="text-[12px] font-bold text-foreground">I have read and agree to the terms of this NDA</span>
              </label>
              <div>
                <label className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-2 block">Your Signature</label>
                <div className="flex gap-2 mb-3">
                  {(["draw", "type", "upload"] as const).map(tab => (
                    <button key={tab} onClick={() => setEsignStep(tab)} className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${esignStep === tab ? "bg-primary text-white" : "bg-muted text-muted-foreground"}`}>
                      {tab === "draw" ? "Draw" : tab === "type" ? "Type" : "Upload"}
                    </button>
                  ))}
                </div>
                {esignStep === "draw" && (
                  <div className="border-2 border-border rounded-2xl h-32 flex items-center justify-center bg-card cursor-crosshair relative">
                    <p className="text-[11px] text-muted-foreground">✍️ Draw your signature here</p>
                    <canvas className="absolute inset-0 w-full h-full rounded-2xl" />
                  </div>
                )}
                {esignStep === "type" && <input type="text" placeholder="Type your full name" value={esignSignature} onChange={e => setEsignSignature(e.target.value)} className="w-full px-4 py-3 rounded-2xl border border-border bg-card text-[20px] font-['Brush_Script_MT',cursive] outline-none focus:ring-2 focus:ring-primary/20 transition-all" />}
                {esignStep === "upload" && (
                  <div className="border-2 border-dashed border-border rounded-2xl p-6 text-center hover:border-primary/40 transition-all cursor-pointer">
                    <Upload size={24} className="mx-auto text-muted-foreground/60 mb-2" />
                    <p className="text-[11px] font-bold text-foreground">Upload signature image</p>
                    <p className="text-[10px] text-muted-foreground">PNG with transparent background preferred</p>
                  </div>
                )}
              </div>
            </div>
            <div className="px-6 py-4 border-t border-border flex items-center justify-end gap-3">
              <button onClick={() => setActiveModal(null)} className="px-5 py-2.5 rounded-xl border border-border text-[11px] font-black uppercase tracking-widest hover:bg-muted transition-all">Cancel</button>
              <button disabled={!esignAgreed || (!esignSignature && esignStep === "type")} onClick={() => { showToast("NDA Signed Successfully!", "success", "Your NDA has been digitally signed and recorded."); setActiveModal(null); }} className="px-5 py-2.5 rounded-xl bg-primary text-white text-[11px] font-black uppercase tracking-widest hover:opacity-90 transition-all shadow-md disabled:opacity-40">Sign & Submit</button>
            </div>
          </motion.div>
        </motion.div>
      )}</AnimatePresence>

      {/* ─── VIDEO PLAYER MODAL ─── */}
      <AnimatePresence>{activeModal === "video" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setActiveModal(null)}>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} onClick={e => e.stopPropagation()} className="bg-card border border-border rounded-[32px] w-full max-w-[600px] overflow-hidden shadow-2xl">
            <div className="aspect-video bg-gray-900 flex items-center justify-center relative">
              {!videoWatched ? (
                <button onClick={() => { setVideoWatched(true); showToast("Playing", "info", "Welcome video is now playing."); }} className="w-16 h-16 rounded-full bg-card/20 backdrop-blur flex items-center justify-center hover:bg-card/30 transition-all"><Play size={28} className="text-white ml-1" /></button>
              ) : (
                <div className="text-center text-white"><CheckCircle2 size={40} className="mx-auto mb-2 text-primary" /><p className="text-[14px] font-bold">Now Playing...</p><p className="text-[12px] text-muted-foreground mt-1">Watch at least 80% to mark complete</p></div>
              )}
            </div>
            <div className="px-6 py-4">
              <h4 className="text-[14px] font-bold text-foreground">Welcome to NexusHR — Company Culture & Values</h4>
              <div className="flex items-center gap-3 mt-1 text-[11px] text-muted-foreground"><Clock size={12} /> 4:32 min<span className="w-1 h-1 rounded-full bg-border" />HR Team</div>
              {videoWatched && (
                <button onClick={() => { showToast("Marked as Watched", "success", "Video marked as completed — 100% watched."); setActiveModal(null); }} className="mt-3 w-full py-2.5 rounded-xl bg-primary text-white text-[11px] font-black uppercase tracking-widest hover:opacity-90 transition-all">Mark as Watched</button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}</AnimatePresence>

      {/* ─── SCHEDULE/CALENDAR MODAL ─── */}
      <AnimatePresence>{calendarModal && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setCalendarModal(false)}>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} onClick={e => e.stopPropagation()} className="bg-card border border-border rounded-[32px] w-full max-w-md overflow-hidden shadow-2xl">
            <div className="px-6 py-5 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-sky-500/10 flex items-center justify-center"><Calendar size={20} className="text-sky-500" /></div><h2 className="text-lg font-black text-foreground">Schedule 1:1 with Suresh Iyer</h2></div>
              <button onClick={() => setCalendarModal(false)} className="w-10 h-10 rounded-xl border border-border flex items-center justify-center hover:bg-muted transition-all"><X size={18} /></button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div><label className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-1.5 block">Date</label><input type="date" className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-[12px] font-bold outline-none focus:ring-2 focus:ring-primary/20 transition-all" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-1.5 block">Start Time</label><input type="time" defaultValue="10:00" className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-[12px] font-bold outline-none focus:ring-2 focus:ring-primary/20 transition-all" /></div>
                <div><label className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-1.5 block">Duration</label><select className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-[12px] font-bold outline-none"><option>30 min</option><option>45 min</option><option selected>1 hour</option></select></div>
              </div>
              <div><label className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-1.5 block">Agenda (optional)</label><textarea className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-[12px] font-bold outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none" rows={2} placeholder="What would you like to discuss?" /></div>
            </div>
            <div className="px-6 py-4 border-t border-border flex items-center justify-end gap-3">
              <button onClick={() => setCalendarModal(false)} className="px-5 py-2.5 rounded-xl border border-border text-[11px] font-black uppercase tracking-widest hover:bg-muted transition-all">Cancel</button>
              <button onClick={() => { showToast("Meeting Scheduled", "success", "1:1 with Suresh Iyer has been scheduled. Calendar invite sent."); setCalendarModal(false); }} className="px-5 py-2.5 rounded-xl bg-sky-500 text-white text-[11px] font-black uppercase tracking-widest hover:opacity-90 transition-all shadow-md">Schedule Meeting</button>
            </div>
          </motion.div>
        </motion.div>
      )}</AnimatePresence>
    </div>
  );
}
