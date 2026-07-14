import {
  Building2,
  Plus,
  Users,
  TrendingUp,
  X,
  User,
  MoreVertical as MoreIcon,
  Search,
  AlertTriangle,
  LayoutGrid,
  List,
  CheckCircle2,
  Calendar,
  ChevronRight,
  Code,
  Database,
  ShieldCheck,
  Rocket,
  Palette,
  Cloud,
  Lock,
  BarChart,
  Network,
  AlignLeft,
  Clock,
  MapPin,
  BookOpen,
  UserPlus,
  DollarSign,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { useEmployees } from "../../../context/AppContext";
import { showToast } from "../../../components/workflow/ToastNotification";
import { PermissionGate, usePermissionKey, P } from "../../../shared/permission-engine";
import { useAuth } from "../../../context/AuthContext";

export interface ChangeRecord {
  id: string;
  changedBy: {
    name: string;
    avatar?: string;
    role?: string;
  };
  newValue: string;
  date: string;
  comment: string;
}

interface Department {
  id: string;
  name: string;
  code: string;
  head: string;
  status: "Active" | "Inactive";
  employees: number;
  activeEmployees: number;
  onLeaveEmployees: number;
  growth: number;
  description?: string;
  createdDate?: string;
  lastUpdated?: string;
  parentDepartment?: string;
  teams?: { name: string; lead: string }[];
  changeHistory?: ChangeRecord[];
}

/* ─── Enhanced Mock Data ─────────────────── */
const initialDeptsData: Department[] = [
  {
    id: "DEPT001",
    name: "Engineering",
    code: "ENG",
    head: "Suresh Iyer",
    status: "Active",
    employees: 820,
    activeEmployees: 805,
    onLeaveEmployees: 15,
    growth: 18,
    description: "Core technology development and infrastructure scaling.",
    createdDate: "Jan 15, 2023",
    lastUpdated: "Apr 20, 2026",
    parentDepartment: "None",
    teams: [
      { name: "Database Team", lead: "Arun Kumar" },
      { name: "Backend Team", lead: "Priya Nair" },
    ],
  },
  {
    id: "DEPT002",
    name: "Sales",
    code: "SLS",
    head: "Vikram Singh",
    status: "Active",
    employees: 540,
    activeEmployees: 532,
    onLeaveEmployees: 8,
    growth: 12,
    description: "Revenue acquisition and client relationship onboarding.",
    createdDate: "Mar 10, 2023",
    lastUpdated: "Apr 18, 2026",
    parentDepartment: "None",
  },
  {
    id: "DEPT003",
    name: "Marketing",
    code: "MKT",
    head: "Sneha Patel",
    status: "Active",
    employees: 310,
    activeEmployees: 300,
    onLeaveEmployees: 10,
    growth: 8,
    description:
      "Product placement, digital campaigns, and branding initiatives.",
    createdDate: "Feb 20, 2023",
    lastUpdated: "Mar 15, 2026",
    parentDepartment: "None",
  },
  {
    id: "DEPT004",
    name: "HR",
    code: "HR",
    head: "Meera Thomas",
    status: "Active",
    employees: 180,
    activeEmployees: 176,
    onLeaveEmployees: 4,
    growth: 5,
    description:
      "Talent scouting, organizational benefits, and policy rollout.",
    createdDate: "Jan 05, 2023",
    lastUpdated: "Feb 28, 2026",
    parentDepartment: "None",
  },
  {
    id: "DEPT005",
    name: "Finance",
    code: "FIN",
    head: "Ananya Das",
    status: "Active",
    employees: 240,
    activeEmployees: 238,
    onLeaveEmployees: 2,
    growth: 6,
    description:
      "Corporate audits, payroll compliance, and bookkeeping operations.",
    createdDate: "Jun 01, 2023",
    lastUpdated: "Apr 10, 2026",
    parentDepartment: "None",
  },
  {
    id: "DEPT006",
    name: "Operations",
    code: "OPS",
    head: "Priya Nair",
    status: "Inactive",
    employees: 757,
    activeEmployees: 740,
    onLeaveEmployees: 17,
    growth: 14,
    description:
      "Logistics fulfillment, quality checks, and supply parameters.",
    createdDate: "May 12, 2023",
    lastUpdated: "Dec 15, 2025",
    parentDepartment: "None",
  },
];

/* ─── Add / Edit Modal ───────────────────── */
function DepartmentFormModal({
  dept,
  onClose,
  onSave,
}: {
  dept?: Department | null;
  onClose: () => void;
  onSave: (d: Department) => void;
}) {
  const { user } = useAuth();
  const [form, setForm] = useState({
    name: dept?.name || "",
    code: dept?.code || "",
    head: dept?.head || "",
    status: dept?.status || "Active",
    description: dept?.description || "",
    parentDepartment: dept?.parentDepartment || "None",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [teams, setTeams] = useState<{name: string, lead: string}[]>(dept?.teams || []);
  const [teamErrors, setTeamErrors] = useState<Record<number, string>>({});
  const [reason, setReason] = useState("");

  const suggestedTeams = [
    "Frontend Team",
    "Backend Team",
    "QA Team",
    "DevOps Team",
    "UI/UX Team",
    "Cloud Team",
    "Security Team",
    "Database Team",
    "Data Engineering",
    "AI/ML Team",
    "Platform Team",
    "Support Team",
  ];

  const { employeesList: employees } = useEmployees();

  const addTeam = () => setTeams([...teams, { name: "", lead: "" }]);

  const removeTeam = (index: number) => {
    const newTeams = [...teams];
    newTeams.splice(index, 1);
    setTeams(newTeams);
    const newTeamErrors = { ...teamErrors };
    delete newTeamErrors[index];
    setTeamErrors(newTeamErrors);
  };

  const updateTeamName = (index: number, value: string) => {
    const newTeams = [...teams];
    newTeams[index].name = value;
    setTeams(newTeams);
  };

  const updateTeamLead = (index: number, value: string) => {
    const newTeams = [...teams];
    newTeams[index].lead = value;
    setTeams(newTeams);
  };

  const handleSave = () => {
    const newErrors: Record<string, string> = {};

    if (dept && !reason.trim()) {
      newErrors.reason = "A comment is required before allowing the update.";
    } else if (!dept) {
      if (!form.name.trim()) newErrors.name = "Department name is required.";
      if (!form.code.trim()) newErrors.code = "Department code is required.";
      if (!form.head.trim()) newErrors.head = "Department head is required.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const newChangeRecords: ChangeRecord[] = [];
    const now = new Date().toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    if (dept && reason.trim()) {
      if (dept.head !== form.head) {
        newChangeRecords.push({
          id: Math.random().toString(),
          changedBy: {
            name: user?.name || "Admin",
           role: user?.role || "Admin",
          },
          newValue: form.head,
          date: now,
          comment: reason,
        });
      }

      teams.forEach((t) => {
        const originalTeam = dept.teams?.find((dt) => dt.name === t.name);
        if (originalTeam && originalTeam.lead !== t.lead) {
          newChangeRecords.push({
            id: Math.random().toString(),
            changedBy: {
              name: user?.name || "Admin",
              role: user?.role || "Admin",
            },
            newValue: t.lead,
            date: now,
            comment: reason,
          });
        }
      });

      if (newChangeRecords.length === 0) {
        newChangeRecords.push({
          id: Math.random().toString(),
          changedBy: {
            name: user?.name || "Admin",
        role: user?.role || "Admin",
          },
          newValue: "Department Details Updated",
          date: now,
          comment: reason,
        });
      }
    }


    onSave({
      id: dept?.id || `DEPT00${Math.floor(Math.random() * 100)}`,
      name: form.name,
      code: form.code.toUpperCase(),
      head: form.head,
      status: form.status as "Active" | "Inactive",
      employees: dept?.employees || 0,
      activeEmployees: dept?.activeEmployees || 0,
      onLeaveEmployees: dept?.onLeaveEmployees || 0,
      growth: dept?.growth || 0,
      description: form.description,
      createdDate: dept?.createdDate || "Apr 27, 2026",
      lastUpdated: now || "Apr 27, 2026",
      parentDepartment: form.parentDepartment,
      teams: teams.map(t => ({ name: t.name.trim(), lead: t.lead.trim() })).filter(t => t.name),
      changeHistory: [...(dept?.changeHistory || []), ...newChangeRecords],
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[2000] flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.45)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 bg-white dark:bg-card"
        style={{
          border: "1px solid var(--border)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-border bg-white dark:bg-card">
          <div>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">
              {dept ? "Edit Department" : "Create Department"}
            </h3>
            <p className="text-sm font-medium text-slate-500 mt-1">
              Manage organizational boundaries
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-neutral-100 dark:hover:bg-zinc-800 text-muted-foreground transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="px-8 py-8 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
          {/* Details Section */}
          <div className="grid grid-cols-2 gap-x-8 gap-y-6">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                DEPARTMENT NAME <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className="w-full rounded-xl px-4 py-3 text-sm border border-emerald-100 bg-emerald-50/30 text-foreground outline-none focus:ring-2 focus:ring-[#00B87C]/20 font-semibold"
                placeholder="Engineering"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              {errors.name && (
                <span className="text-[11px] font-bold text-rose-600 mt-1 block">
                  {errors.name}
                </span>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                DEPARTMENT CODE <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className="w-full rounded-xl px-4 py-3 text-sm border border-emerald-100 bg-emerald-50/30 text-foreground outline-none focus:ring-2 focus:ring-[#00B87C]/20 font-semibold uppercase"
                placeholder="ENG"
                value={form.code}
                maxLength={4}
                onChange={(e) => setForm({ ...form, code: e.target.value })}
              />
              {errors.code && (
                <span className="text-[11px] font-bold text-rose-600 mt-1 block">
                  {errors.code}
                </span>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                DEPARTMENT HEAD <span className="text-red-500">*</span>
              </label>
              <select
                className="w-full rounded-xl px-4 py-3 text-sm border border-emerald-100 bg-emerald-50/30 text-foreground outline-none focus:ring-2 focus:ring-[#00B87C]/20 font-semibold"
                value={form.head}
                onChange={(e) => setForm({ ...form, head: e.target.value })}
              >
                <option value="">Select Head...</option>
                {employees?.map((emp: any) => (
                  <option key={emp.id} value={emp.name}>
                    {emp.name}
                  </option>
                ))}
              </select>
              {errors.head && (
                <span className="text-[11px] font-bold text-rose-600 mt-1 block">
                  {errors.head}
                </span>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                PARENT DEPARTMENT
              </label>
              <select
                className="w-full rounded-xl px-4 py-3 text-sm border border-emerald-100 bg-emerald-50/30 text-foreground outline-none focus:ring-2 focus:ring-[#00B87C]/20 font-semibold"
                value={form.parentDepartment}
                onChange={(e) =>
                  setForm({ ...form, parentDepartment: e.target.value })
                }
              >
                <option value="None">None</option>
                <option value="HR">HR</option>
                <option value="Engineering">Engineering</option>
                <option value="Finance">Finance</option>
                <option value="Sales">Sales</option>
                <option value="Marketing">Marketing</option>
                <option value="Operations">Operations</option>
              </select>
            </div>

            <div className="col-span-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                DESCRIPTION
              </label>
              <textarea
                rows={3}
                className="w-full rounded-xl px-4 py-3 text-sm border border-emerald-100 bg-emerald-50/30 text-foreground outline-none focus:ring-2 focus:ring-[#00B87C]/20 resize-none font-medium leading-relaxed"
                placeholder="Core technology development and infrastructure scaling."
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />
            </div>
          </div>

          <div className="border-t border-border pt-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                  TEAMS
                </h4>
                <p className="text-xs font-medium text-slate-500 mt-1">
                  Create one or more teams that belong to this department.
                </p>
              </div>
              <button
                onClick={addTeam}
                className="flex items-center gap-2 text-sm font-semibold text-[#00B87C] border border-[#00B87C] hover:bg-emerald-50 px-4 py-2 rounded-lg transition-all"
              >
                <Plus size={16} /> Add Team
              </button>
            </div>

            <div className="border border-border rounded-xl overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-neutral-50 dark:bg-zinc-800/40 border-b border-border">
                    <th className="px-6 py-3 text-[10px] font-black text-slate-500 uppercase tracking-wider w-1/2">
                      TEAM NAME
                    </th>
                    <th className="px-6 py-3 text-[10px] font-black text-slate-500 uppercase tracking-wider">
                      TEAM LEAD
                    </th>
                    <th className="px-6 py-3 text-[10px] font-black text-slate-500 uppercase tracking-wider text-center w-24">
                      ACTIONS
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {teams.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="px-6 py-8 text-center text-sm text-slate-500">
                        No teams added yet. Click "Add Team" to get started.
                      </td>
                    </tr>
                  ) : (
                    teams.map((team, index) => (
                      <tr key={index} className="bg-white dark:bg-card">
                        <td className="px-6 py-3 relative">
                          <input
                            type="text"
                            list="suggested-teams"
                            value={team.name}
                            onChange={(e) => updateTeamName(index, e.target.value)}
                            placeholder="e.g. Frontend Team"
                            maxLength={50}
                            className={`w-full rounded-lg px-3 py-2 text-sm border ${teamErrors[index] ? "border-red-500" : "border-border"} bg-background text-foreground outline-none focus:ring-2 focus:ring-[#00B87C]/20 font-medium transition-all`}
                          />
                          {teamErrors[index] && (
                            <span className="absolute bottom-1 left-6 text-[10px] text-red-500 font-bold">
                              {teamErrors[index]}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-3">
                          <div className="flex items-center gap-2 border border-border rounded-lg bg-background px-3 py-1.5 focus-within:ring-2 focus-within:ring-[#00B87C]/20">
                            {team.lead && (
                              <img
                                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(team.lead)}&background=f0fdf4&color=16a34a`}
                                alt={team.lead}
                                className="w-6 h-6 rounded-full"
                              />
                            )}
                            <select
                              value={team.lead}
                              onChange={(e) => updateTeamLead(index, e.target.value)}
                              className="w-full text-sm bg-transparent outline-none text-foreground font-medium"
                            >
                              <option value="">Select Lead...</option>
                              {employees?.map((emp: any) => (
                                <option key={emp.id} value={emp.name}>
                                  {emp.name}
                                </option>
                              ))}
                            </select>
                          </div>
                        </td>
                        <td className="px-6 py-3 text-center">
                          <button
                            onClick={() => removeTeam(index)}
                            className="w-8 h-8 inline-flex items-center justify-center rounded-lg bg-red-50 text-red-500 hover:bg-red-100 hover:scale-105 active:scale-95 transition-all"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
              <datalist id="suggested-teams">
                {suggestedTeams.map((t) => (
                  <option key={t} value={t} />
                ))}
              </datalist>
            </div>

            {dept && (
              <div className="mt-6">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                  COMMENT <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={2}
                  className="w-full rounded-xl px-4 py-3 text-sm border border-emerald-100 bg-emerald-50/30 text-foreground outline-none focus:ring-2 focus:ring-[#00B87C]/20 resize-none font-medium leading-relaxed"
                  placeholder="e.g., Updated head as per new org structure"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                />
                {errors.reason && (
                  <span className="text-[11px] font-bold text-rose-600 mt-1 block">
                    {errors.reason}
                  </span>
                )}
              </div>
            )}
          </div>

          {dept && (
            <div className="border-t border-border pt-8 mt-8">
              <div className="mb-4">
                <h4 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                  CHANGE HISTORY
                </h4>
                <p className="text-xs font-medium text-slate-500 mt-1">
                  Track all changes made to this department.
                </p>
              </div>

              <div className="border border-border rounded-xl max-h-[300px] overflow-y-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-neutral-50 dark:bg-zinc-800/40 border-b border-border">
                      <th className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase tracking-wider">
                        CHANGED BY
                      </th>
                      <th className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase tracking-wider">
                        NEW VALUE
                      </th>
                      <th className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase tracking-wider">
                        CHANGED ON
                      </th>
                      <th className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase tracking-wider">
                        COMMENT
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {dept.changeHistory && dept.changeHistory.length > 0 ? (
                      dept.changeHistory.map((record) => (
                        <tr key={record.id} className="bg-white dark:bg-card">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <img
                                src={record.changedBy.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(record.changedBy.name)}&background=f0fdf4&color=16a34a`}
                                alt={record.changedBy.name}
                                className="w-8 h-8 rounded-full"
                              />
                              <div>
                                <p className="text-xs font-bold text-slate-900 dark:text-slate-100">{record.changedBy.name}</p>
                                <p className="text-[10px] text-slate-500">{record.changedBy.role}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-xs font-medium text-slate-700 dark:text-slate-300">{record.newValue}</td>
                          <td className="px-4 py-3 text-xs font-medium text-slate-700 dark:text-slate-300 whitespace-pre-line">{record.date.replace(", ", "\n")}</td>
                          <td className="px-4 py-3 text-xs font-medium text-slate-700 dark:text-slate-300">{record.comment}</td>
                        </tr>
                      ))
                    ) : (
                      <tr className="bg-white dark:bg-card">
                        <td colSpan={4} className="px-4 py-8 text-center text-sm text-slate-500">
                          No changes have been recorded yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-8 py-5 flex items-center justify-center gap-4 border-t border-border bg-neutral-50 dark:bg-zinc-800/40">
          <button
            onClick={onClose}
            className="w-48 py-3 rounded-lg text-sm font-bold text-slate-700 bg-white border border-slate-200 shadow-sm hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="w-48 py-3 rounded-lg text-sm font-bold text-white bg-[#00B87C] hover:bg-[#00a36d] shadow-sm transition-all active:scale-95"
          >
            {dept ? "Update Department" : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Detail View Modal ──────────────────── */
function DepartmentDetailModal({
  dept,
  onClose,
}: {
  dept: Department;
  onClose: () => void;
}) {
  const navigate = useNavigate();

  const getTeamsForDepartment = (deptName: string) => {
    const defaultTeams = [
      {
        name: `${deptName} Operations`,
        lead: "Alex Johnson",
        count: 45,
        icon: Network,
        color: "text-blue-500",
        bg: "bg-blue-50",
      },
      {
        name: `${deptName} Strategy`,
        lead: "Sam Smith",
        count: 20,
        icon: TrendingUp,
        color: "text-purple-500",
        bg: "bg-purple-50",
      },
      {
        name: `${deptName} Support`,
        lead: "Chris Lee",
        count: 85,
        icon: Users,
        color: "text-green-500",
        bg: "bg-green-50",
      },
    ];

    switch (deptName.toLowerCase()) {
      case "engineering":
        return [
          {
            name: "Frontend Team",
            lead: "Priya Sharma",
            count: 120,
            icon: Code,
            color: "text-blue-500",
            bg: "bg-blue-50",
          },
          {
            name: "Backend Team",
            lead: "Rahul Verma",
            count: 180,
            icon: Database,
            color: "text-orange-500",
            bg: "bg-orange-50",
          },
          {
            name: "QA Team",
            lead: "Arjun Patel",
            count: 95,
            icon: ShieldCheck,
            color: "text-purple-500",
            bg: "bg-purple-50",
          },
          {
            name: "DevOps Team",
            lead: "Karthik Raj",
            count: 60,
            icon: Rocket,
            color: "text-blue-600",
            bg: "bg-blue-100",
          },
          {
            name: "UI/UX Team",
            lead: "Anitha R",
            count: 45,
            icon: Palette,
            color: "text-pink-500",
            bg: "bg-pink-50",
          },
          {
            name: "Cloud Infrastructure Team",
            lead: "Naveen Kumar",
            count: 80,
            icon: Cloud,
            color: "text-cyan-500",
            bg: "bg-cyan-50",
          },
          {
            name: "Security Team",
            lead: "Deepak Singh",
            count: 40,
            icon: Lock,
            color: "text-amber-500",
            bg: "bg-amber-50",
          },
          {
            name: "Data Engineering Team",
            lead: "Meena Joseph",
            count: 200,
            icon: BarChart,
            color: "text-indigo-500",
            bg: "bg-indigo-50",
          },
        ];
      case "sales":
        return [
          {
            name: "Inbound Sales",
            lead: "John Doe",
            count: 50,
            icon: Network,
            color: "text-green-500",
            bg: "bg-green-50",
          },
          {
            name: "Outbound Sales",
            lead: "Jane Smith",
            count: 70,
            icon: Rocket,
            color: "text-orange-500",
            bg: "bg-orange-50",
          },
          {
            name: "Enterprise Sales",
            lead: "Michael Scott",
            count: 30,
            icon: Building2,
            color: "text-blue-500",
            bg: "bg-blue-50",
          },
          {
            name: "Account Management",
            lead: "Jim Halpert",
            count: 40,
            icon: Users,
            color: "text-purple-500",
            bg: "bg-purple-50",
          },
          {
            name: "Sales Enablement",
            lead: "Pam Beesly",
            count: 15,
            icon: BookOpen,
            color: "text-pink-500",
            bg: "bg-pink-50",
          },
        ];
      case "marketing":
        return [
          {
            name: "SEO & Content",
            lead: "Alice Wonderland",
            count: 25,
            icon: Search,
            color: "text-cyan-500",
            bg: "bg-cyan-50",
          },
          {
            name: "Performance Marketing",
            lead: "Bob Builder",
            count: 35,
            icon: TrendingUp,
            color: "text-rose-500",
            bg: "bg-rose-50",
          },
          {
            name: "Brand & Comms",
            lead: "Charlie Chaplin",
            count: 20,
            icon: Palette,
            color: "text-fuchsia-500",
            bg: "bg-fuchsia-50",
          },
          {
            name: "Product Marketing",
            lead: "Diana Prince",
            count: 30,
            icon: Rocket,
            color: "text-amber-500",
            bg: "bg-amber-50",
          },
        ];
      case "human resources":
      case "hr":
        return [
          {
            name: "Talent Acquisition",
            lead: "Sarah Connor",
            count: 15,
            icon: UserPlus,
            color: "text-emerald-500",
            bg: "bg-emerald-50",
          },
          {
            name: "Employee Relations",
            lead: "John Wick",
            count: 10,
            icon: Users,
            color: "text-blue-500",
            bg: "bg-blue-50",
          },
          {
            name: "Learning & Dev",
            lead: "Tony Stark",
            count: 25,
            icon: BookOpen,
            color: "text-indigo-500",
            bg: "bg-indigo-50",
          },
          {
            name: "Payroll & Benefits",
            lead: "Bruce Wayne",
            count: 12,
            icon: DollarSign,
            color: "text-green-500",
            bg: "bg-green-50",
          },
        ];
      default:
        return defaultTeams;
    }
  };

  const teams =
    dept.teams && dept.teams.length > 0
      ? dept.teams.map((t: any) => ({
          name: typeof t === "string" ? t : (t?.name || "Unknown"),
          lead: typeof t === "string" ? "TBD" : (t?.lead || "TBD"),
          count: 0,
          icon: Users,
          color: "text-[#00B87C]",
          bg: "bg-[#00B87C]/10",
        }))
      : getTeamsForDepartment(dept.name);

  return (
    <div
      className="fixed inset-0 z-[2000] flex justify-end p-0 bg-black/40 backdrop-blur-[2px] transition-opacity"
      onClick={onClose}
    >
      <div
        className="w-full sm:w-[750px] h-full max-h-screen bg-white rounded-l-[10px] shadow-2xl flex flex-col animate-in slide-in-from-right duration-300 overflow-hidden"
        style={{ fontFamily: "'Inter', sans-serif" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-gray-100 flex-shrink-0 bg-white">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl flex items-center justify-center bg-[#10B981]/10 text-[#10B981]">
              <Building2 size={28} />
            </div>
            <div>
              <h3 className="text-[32px] font-bold text-gray-900 leading-tight flex items-center gap-3">
                {dept.name}
                <span className="text-[14px] font-bold text-gray-500 bg-gray-100 px-3 py-1 rounded-full uppercase tracking-wider">
                  {dept.code}
                </span>
              </h3>
              <p className="text-[16px] font-medium text-gray-500 mt-1">
                Department Intelligence Summary
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 text-gray-400 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-4 bg-white">
          {/* SECTION 1: KPI Cards */}
          <div className="grid grid-cols-3 gap-6 mb-5">
            <div className="p-6 rounded-[16px] border border-gray-100 bg-[#10B981]/5 shadow-[0_4px_20px_-4px_rgba(16,185,129,0.1)] hover:-translate-y-1 transition-transform cursor-default relative overflow-hidden group">
              <div className="flex flex-col gap-2 relative z-10">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#10B981]/20 flex items-center justify-center text-[#10B981]">
                    <Users size={16} />
                  </div>
                  <span className="text-[14px] font-bold text-gray-600 uppercase tracking-widest">
                    Staff
                  </span>
                </div>
                <div className="text-[36px] font-extrabold text-gray-900 mt-2">
                  {dept.employees}
                </div>
              </div>
            </div>
            <div className="p-6 rounded-[16px] border border-gray-100 bg-[#10B981]/5 shadow-[0_4px_20px_-4px_rgba(16,185,129,0.1)] hover:-translate-y-1 transition-transform cursor-default relative overflow-hidden">
              <div className="flex flex-col gap-2 relative z-10">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#10B981]/20 flex items-center justify-center text-[#10B981]">
                    <CheckCircle2 size={16} />
                  </div>
                  <span className="text-[14px] font-bold text-gray-600 uppercase tracking-widest">
                    Active
                  </span>
                </div>
                <div className="text-[36px] font-extrabold text-[#10B981] mt-2">
                  {dept.activeEmployees}
                </div>
              </div>
            </div>
            <div className="p-6 rounded-[16px] border border-gray-100 bg-[#EF4444]/5 shadow-[0_4px_20px_-4px_rgba(239,68,68,0.1)] hover:-translate-y-1 transition-transform cursor-default relative overflow-hidden">
              <div className="flex flex-col gap-2 relative z-10">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#EF4444]/10 flex items-center justify-center text-[#EF4444]">
                    <Calendar size={16} />
                  </div>
                  <span className="text-[14px] font-bold text-gray-600 uppercase tracking-widest">
                    On Leave
                  </span>
                </div>
                <div className="text-[36px] font-extrabold text-[#EF4444] mt-2">
                  {dept.onLeaveEmployees}
                </div>
              </div>
            </div>
          </div>

          <hr className="border-gray-100 mb-8" />

          {/* SECTION 2: Department Information */}
          <div className="grid grid-cols-2 gap-12 mb-5">
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 flex-shrink-0">
                  <User size={20} />
                </div>
                <div>
                  <p className="text-[12px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                    Department Head
                  </p>
                  <p className="text-[16px] font-bold text-gray-900">
                    {dept.head}
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 flex-shrink-0">
                  <Network size={20} />
                </div>
                <div>
                  <p className="text-[12px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                    Parent Department
                  </p>
                  <p className="text-[16px] font-bold text-gray-900">
                    {dept.parentDepartment || "None"}
                  </p>
                </div>
              </div>

            </div>

            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-500 flex-shrink-0">
                  <AlignLeft size={20} />
                </div>
                <div>
                  <p className="text-[12px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                    Description
                  </p>
                  <p className="text-[16px] font-medium text-gray-700 leading-relaxed">
                    {dept.description ||
                      "Core technology development and infrastructure scaling."}
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-500 flex-shrink-0">
                  <Calendar size={20} />
                </div>
                <div>
                  <p className="text-[12px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                    Created Date
                  </p>
                  <p className="text-[16px] font-bold text-gray-900">
                    {dept.createdDate}
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-500 flex-shrink-0">
                  <Clock size={20} />
                </div>
                <div>
                  <p className="text-[12px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                    Last Updated
                  </p>
                  <p className="text-[16px] font-bold text-gray-900">
                    {dept.lastUpdated}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <hr className="border-gray-100 mb-8" />

          {/* SECTION 3: Teams */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-[20px] font-bold text-gray-900 flex items-center gap-2">
                Teams
                <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-[14px]">
                  ({teams.length})
                </span>
              </h4>
            </div>

            <div className="space-y-3 pb-8">
              {teams.map((team, idx) => {
                const Icon = team.icon;
                return (
                  <div
                    key={idx}
                    onClick={() => {
                      onClose();
                      navigate(
                        `/employees?department=${encodeURIComponent(dept.name)}&team=${encodeURIComponent(team.name)}`,
                      );
                    }}
                    className="flex items-center justify-between p-4 rounded-[16px] border border-gray-100 bg-white hover:border-[#10B981]/30 hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)] hover:-translate-y-0.5 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center ${team.bg} ${team.color}`}
                      >
                        <Icon size={20} />
                      </div>
                      <div>
                        <p className="text-[16px] font-bold text-gray-900 group-hover:text-[#10B981] transition-colors">
                          {team.name}
                        </p>
                        <p className="text-[14px] text-gray-500 font-medium mt-0.5">
                          Lead:{" "}
                          <span className="text-gray-700">{team.lead}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-8">
                      <div className="text-right">
                        <p className="text-[16px] font-bold text-gray-900">
                          {team.count}
                        </p>
                        <p className="text-[12px] font-medium text-gray-500 uppercase tracking-wider">
                          Employees
                        </p>
                      </div>
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 group-hover:text-[#10B981] group-hover:translate-x-1 transition-all">
                        <ChevronRight size={20} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-4 border-t border-gray-100 bg-gray-50 flex justify-end flex-shrink-0">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-[12px] text-[14px] font-bold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 hover:text-gray-900 transition-colors shadow-sm"
          >
            Close Panel
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Main Departments Page ──────────────── */
export function Departments() {
  const { employeesList } = useEmployees();
  const [depts, setDepts] = useState<Department[]>(initialDeptsData);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "All" | "Active" | "Inactive"
  >("All");
  const [sortBy, setSortBy] = useState<"Employees" | "Budget" | "Name">(
    "Employees",
  );

  const [selectedDept, setSelectedDept] = useState<Department | null>(null);
  const [editDept, setEditDept] = useState<Department | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [deleteConfirmDept, setDeleteConfirmDept] = useState<Department | null>(
    null,
  );
  const [assignHeadDept, setAssignHeadDept] = useState<Department | null>(null);
  const [viewEmployeesDept, setViewEmployeesDept] = useState<Department | null>(
    null,
  );
  const [headInput, setHeadInput] = useState("");
  const [showMenu, setShowMenu] = useState<string | null>(null);

  const canManage = usePermissionKey(P.DEPARTMENTS_MANAGE);

  // Move Dept states
  const [moveDept, setMoveDept] = useState<Department | null>(null);
  const [newParentInput, setNewParentInput] = useState("None");

  // Export Report states
  const [showExportModal, setShowExportModal] = useState(false);
  const [reportType, setReportType] = useState("Employee List");
  const [reportFormat, setReportFormat] = useState("CSV");

  const [view, setView] = useState<"grid" | "list" | "table">("grid");

  const handleExportReport = () => {
    let content: string;
    if (reportType === "Employee List") {
      content =
        `Employee ID,Name,Department,Role,Status,Location\n` +
        employeesList
          .map(
            (e) =>
              `${e.id},${e.name},${e.department},${e.role},${e.status},${e.location}`,
          )
          .join("\n");
    } else if (reportType === "Analytics Report") {
      content =
        `Department Code,Department Name,Total Employees,Active,On Leave,Growth\n` +
        depts
          .map(
            (d) =>
              `${d.code},${d.name},${d.employees},${d.activeEmployees},${d.onLeaveEmployees},${d.growth}%`,
          )
          .join("\n");
    }

    const mimeType =
      reportFormat === "CSV"
        ? "text/csv"
        : reportFormat === "Excel"
          ? "application/vnd.ms-excel"
          : "text/plain";
    const ext = reportFormat.toLowerCase();
    const blob = new Blob([], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${reportType.replace(/\s+/g, "_")}_Export.${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setShowExportModal(false);
  };

  const handleSave = (newDept: Department) => {
    if (editDept) {
      setDepts((prev) => prev.map((d) => (d.id === newDept.id ? newDept : d)));
      setEditDept(null);
    } else {
      setDepts((prev) => [...prev, newDept]);
    }
  };

  // Filter / Sort application
  const filteredDepts = depts
    .filter((d) => {
      const matchesSearch =
        d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.head.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.code.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "All" || d.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === "Employees") return b.employees - a.employees;
      return a.name.localeCompare(b.name);
    });

  return (
    <div className="w-full px-4 md:px-8 py-6 pb-10">
      {showMenu && (
        <div 
          className="fixed inset-0 z-20"
          onClick={() => setShowMenu(null)}
        />
      )}
      {/* ── Page Header ── */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-foreground">
            Departments
          </h2>
          <p className="text-xs font-medium text-muted-foreground mt-1">
            Manage organizational capacity boundaries efficiently.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowExportModal(true)}
            className="flex items-center gap-2 rounded-xl px-4 py-2.5 transition-colors border border-border bg-card text-foreground hover:bg-secondary font-bold text-xs active:scale-95 shadow-sm"
          >
            Export Report
          </button>
          <PermissionGate permissionKey={P.DEPARTMENTS_MANAGE}>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-white transition-all bg-[#00B87C] hover:bg-[#00a36d] font-bold text-xs active:scale-95 shadow-sm"
            >
              <Plus size={18} />
              Add Department
            </button>
          </PermissionGate>
        </div>
      </div>

      {/* ── Filters Section ── */}
      <div className="bg-card p-4 rounded-2xl border border-border shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center mb-8">
        <div className="relative flex-1 w-full">
          <Search
            size={16}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <input
            type="text"
            placeholder="Search by name, head, or code..."
            className="w-full pl-11 pr-4 py-2 text-xs rounded-xl border border-border bg-background text-foreground focus:ring-2 focus:ring-[#00B87C]/20 outline-none font-bold"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            className="px-4 py-2 text-xs rounded-xl border border-border bg-background text-foreground focus:ring-2 focus:ring-[#00B87C]/20 outline-none font-bold cursor-pointer appearance-none"
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value as "All" | "Active" | "Inactive")
            }
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>


          <div className="flex items-center bg-background border border-border rounded-xl p-1 gap-1">
            <button
              onClick={() => setView("grid")}
              className="p-1.5 rounded-lg transition-colors"
              style={{
                backgroundColor:
                  view === "grid" ? "var(--secondary)" : "transparent",
                color:
                  view === "grid"
                    ? "var(--primary)"
                    : "var(--muted-foreground)",
              }}
              title="Grid View"
            >
              <LayoutGrid size={18} />
            </button>

            <button
              onClick={() => setView("table")}
              className="p-1.5 rounded-lg transition-colors"
              style={{
                backgroundColor:
                  view === "table" ? "var(--secondary)" : "transparent",
                color:
                  view === "table"
                    ? "var(--primary)"
                    : "var(--muted-foreground)",
              }}
              title="Table View"
            >
              <List size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* ── Department Views ── */}
      {view === "grid" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDepts.map((dept) => {
            return (
              <div
                key={dept.id}
                className="bg-card rounded-2xl border border-border p-5 shadow-sm hover:-translate-y-[2px] hover:border-[#00B87C] hover:shadow-[0_0_15px_rgba(0,184,124,0.3)] transition-all relative flex flex-col justify-between group"
              >
                {/* Status / Actions */}
                <div className="absolute top-4 right-4 flex items-center gap-2">
                  <span
                    className={`px-2 py-0.5 text-[9px] font-black rounded-full border uppercase tracking-wider ${dept.status === "Active" ? "bg-[#E6F4EA] text-[#00B87C] border-[#00B87C]/20" : "bg-slate-100 text-slate-400 border-border"}`}
                  >
                    {dept.status}
                  </span>

                  <div className="relative">
                    <button
                      className="w-7 h-7 flex items-center justify-center rounded-lg text-muted-foreground hover:bg-neutral-100 dark:hover:bg-zinc-800 hover:text-foreground transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowMenu(showMenu === dept.id ? null : dept.id);
                      }}
                    >
                      <MoreIcon size={16} />
                    </button>

                    {showMenu === dept.id && (
                      <div className="absolute right-0 mt-1 w-40 bg-white dark:bg-zinc-800 border border-border rounded-xl shadow-lg z-30 py-1 animate-in fade-in slide-in-from-top-1">
                        {[
                          "View Department",
                          ...(canManage ? ["Edit Department"] : []),
                          ...(canManage ? ["Delete Department"] : []),
                        ].map((action) => (
                          <button
                            key={action}
                            className={`w-full text-left px-4 py-2 text-xs font-bold ${action === "Delete Department" ? "text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20" : "text-slate-700 dark:text-slate-300 hover:bg-neutral-50 dark:hover:bg-zinc-700/40"}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowMenu(null);
                              if (action === "View Department")
                                setSelectedDept(dept);
                              if (action === "Edit Department")
                                setEditDept(dept);
                              if (action === "Delete Department")
                                setDeleteConfirmDept(dept);
                            }}
                          >
                            {action}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div
                  onClick={() => setSelectedDept(dept)}
                  className="cursor-pointer"
                >
                  {/* Dept Title */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-secondary">
                      <Building2 size={20} color="var(--primary)" />
                    </div>
                    <div>
                      <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                        {dept.name}
                      </h3>
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide flex items-center gap-2">
                        {dept.code}
                      </p>
                    </div>
                  </div>

                  {/* Stats Sub */}
                  <div className="grid grid-cols-3 gap-2 mb-4 text-center bg-neutral-50 dark:bg-zinc-800/40 p-2 rounded-xl border border-border">
                    <div>
                      <span className="text-[8px] font-black text-slate-400 uppercase tracking-wider block">
                        Total
                      </span>
                      <span className="text-xs font-extrabold text-foreground">
                        {dept.employees}
                      </span>
                    </div>
                    <div>
                      <span className="text-[8px] font-black text-slate-400 uppercase tracking-wider block">
                        Active
                      </span>
                      <span className="text-xs font-extrabold text-emerald-600">
                        {dept.activeEmployees}
                      </span>
                    </div>
                    <div>
                      <span className="text-[8px] font-black text-slate-400 uppercase tracking-wider block">
                        Leave
                      </span>
                      <span className="text-xs font-extrabold text-rose-500">
                        {dept.onLeaveEmployees}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <div
                    className="flex items-center gap-1 text-xs font-bold text-slate-600 dark:text-slate-300 cursor-pointer hover:text-primary transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      setAssignHeadDept(dept);
                      setHeadInput(dept.head);
                    }}
                  >
                    <User size={14} className="text-slate-400" />
                    <span>{dept.head}</span>
                  </div>

                  <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-secondary text-[11px] font-bold">
                    <TrendingUp size={12} color="var(--primary)" />
                    <span color="var(--primary)">+{dept.growth}%</span>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Create Department Option Card */}
          {canManage && (
            <div
              onClick={() => setShowAddModal(true)}
              className="rounded-2xl p-6 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all border-2 border-dashed border-border hover:border-[#00B87C] hover:bg-emerald-50/10"
              style={{ minHeight: "180px" }}
            >
              <div className="flex items-center justify-center rounded-full w-10 h-10 bg-secondary text-[#00B87C]">
                <Plus size={20} />
              </div>
              <p className="text-xs font-extrabold text-[#00B87C]">
                Create Department
              </p>
            </div>
          )}
        </div>
      )}

      {view === "table" && (
        <div className="bg-card rounded-2xl border border-border shadow-sm">
          <div className="w-full" style={{ overflowX: "visible" }}>
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-neutral-50 dark:bg-zinc-800/40 border-b border-border">
                  <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-wider">
                    Head
                  </th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-wider text-right">
                    Employees
                  </th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-wider text-center">
                    Teams
                  </th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-wider text-right">
                    Growth
                  </th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-wider text-center">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredDepts.map((dept) => (
                  <tr
                    key={dept.id}
                    className="hover:bg-neutral-50 dark:hover:bg-zinc-800/20 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div
                        className="flex items-center gap-3 cursor-pointer"
                        onClick={() => setSelectedDept(dept)}
                      >
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-secondary flex-shrink-0">
                          <Building2 size={16} color="var(--primary)" />
                        </div>
                        <div>
                          <p className="text-sm font-extrabold text-foreground">
                            {dept.name}
                          </p>
                          <p className="text-[10px] font-bold text-muted-foreground uppercase">
                            {dept.code}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-xs font-bold text-foreground">
                        <User size={14} className="text-muted-foreground" />
                        {dept.head}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-0.5 text-[9px] font-black rounded-full border uppercase tracking-wider ${dept.status === "Active" ? "bg-[#E6F4EA] text-[#00B87C] border-[#00B87C]/20" : "bg-slate-100 text-slate-400 border-border"}`}
                      >
                        {dept.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="text-xs font-extrabold text-foreground">
                        {dept.employees}
                      </div>
                      <div className="text-[10px] font-bold text-emerald-600">
                        {dept.activeEmployees} Active
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="text-xs font-extrabold text-foreground">
                        {dept.teams?.length || 0}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1 text-[11px] font-bold text-primary">
                        <TrendingUp size={12} />+{dept.growth}%
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="relative inline-block text-left">
                        <button
                          className="p-1.5 rounded-lg text-muted-foreground hover:bg-neutral-200 dark:hover:bg-zinc-700 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowMenu(showMenu === dept.id ? null : dept.id);
                          }}
                        >
                          <MoreIcon size={16} />
                        </button>
                        {showMenu === dept.id && (
                          <div className="absolute right-full top-0 mr-2 w-40 bg-white dark:bg-zinc-800 border border-border rounded-xl shadow-lg z-30 py-1 animate-in fade-in slide-in-from-right-2">
                            {[
                              "View Department",
                              ...(canManage ? ["Edit Department"] : []),
                              ...(canManage ? ["Delete Department"] : []),
                            ].map((action) => (
                              <button
                                key={action}
                                className={`w-full text-left px-4 py-2 text-xs font-bold ${action === "Delete Department" ? "text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20" : "text-slate-700 dark:text-slate-300 hover:bg-neutral-50 dark:hover:bg-zinc-700/40"}`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setShowMenu(null);
                                  if (action === "View Department")
                                    setSelectedDept(dept);
                                  if (action === "Edit Department")
                                    setEditDept(dept);
                                  if (action === "Delete Department")
                                    setDeleteConfirmDept(dept);
                                }}
                              >
                                {action}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Confirmation Modal for Deletion */}
      {deleteConfirmDept && (
        <div
          className="fixed inset-0 z-[2000] flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="w-full max-w-sm rounded-2xl bg-card shadow-xl border border-border p-6 text-center animate-in fade-in zoom-in-95">
            <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-950/40 text-rose-600 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle size={24} />
            </div>
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-slate-100 mb-2">
              Delete Department?
            </h3>
            <p className="text-xs text-muted-foreground mb-5">
              Are you sure you want to remove the{" "}
              <span className="font-black text-slate-800 dark:text-slate-200">
                "{deleteConfirmDept.name}"
              </span>{" "}
              workspace unit? This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                className="w-full py-2 text-xs font-extrabold text-slate-600 dark:text-slate-300 bg-neutral-100 dark:bg-zinc-800 rounded-xl hover:bg-neutral-200 transition-colors"
                onClick={() => setDeleteConfirmDept(null)}
              >
                Cancel
              </button>
              <button
                className="w-full py-2 text-xs font-extrabold text-white bg-rose-600 rounded-xl hover:bg-rose-700 shadow-sm transition-colors active:scale-95"
                onClick={() => {
                  setDepts((prev) =>
                    prev.filter((d) => d.id !== deleteConfirmDept.id),
                  );
                  setDeleteConfirmDept(null);
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Assign Head Modal */}
      {assignHeadDept && (
        <div
          className="fixed inset-0 z-[2000] flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div
            className="w-full max-w-sm rounded-2xl bg-card shadow-xl border border-border p-6 animate-in fade-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100 mb-1">
              Assign Head
            </h3>
            <p className="text-xs text-muted-foreground mb-4">
              Update the management lead for{" "}
              <span className="font-black text-slate-800 dark:text-slate-200">
                "{assignHeadDept.name}"
              </span>
              .
            </p>

            {/* Select Head */}
            <div className="mb-4">
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wide mb-1.5">
                Select Head
              </label>
              <div className="relative">
                <User
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <select
                  className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl border border-border bg-background text-foreground outline-none focus:ring-2 focus:ring-[#00B87C]/20 font-bold appearance-none"
                  value={headInput}
                  onChange={(e) => setHeadInput(e.target.value)}
                >
                  <option value="">-- Select Eligible Employee --</option>
                  {employeesList
                    .filter(
                      (emp) =>
                        emp.department === assignHeadDept.name &&
                        emp.status === "Active" &&
                        (emp.role.includes("Manager") ||
                          emp.role.includes("Head") ||
                          emp.role.includes("Lead") ||
                          emp.designation.includes("Manager") ||
                          emp.designation.includes("Head") ||
                          emp.designation.includes("Lead") ||
                          emp.designation.includes("Director")),
                    )
                    .map((emp) => (
                      <option key={emp.id} value={emp.name}>
                        {emp.name} ({emp.designation})
                      </option>
                    ))}
                </select>
              </div>
            </div>

            {/* Effective Date */}
            <div className="mb-4">
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wide mb-1.5">
                Effective Date (Optional)
              </label>
              <input
                type="date"
                className="w-full px-4 py-2.5 text-xs rounded-xl border border-border bg-background text-foreground outline-none focus:ring-2 focus:ring-[#00B87C]/20 font-bold"
              />
            </div>

            {/* Assignment Reason */}
            <div className="mb-6">
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wide mb-1.5">
                Reason (Optional)
              </label>
              <textarea
                rows={2}
                placeholder="E.g., Promotion, Restructuring..."
                className="w-full px-4 py-2.5 text-xs rounded-xl border border-border bg-background text-foreground outline-none focus:ring-2 focus:ring-[#00B87C]/20 font-bold resize-none"
              />
            </div>

            <div className="flex gap-3">
              <button
                className="w-full py-2 text-xs font-extrabold text-slate-600 dark:text-slate-300 bg-neutral-100 dark:bg-zinc-800 rounded-xl hover:bg-neutral-200 transition-colors"
                onClick={() => {
                  setAssignHeadDept(null);
                  setHeadInput("");
                }}
              >
                Cancel
              </button>
              <button
                className="w-full py-2 text-xs font-extrabold text-white bg-[#00B87C] rounded-xl hover:bg-[#00a36d] shadow-sm transition-colors"
                onClick={() => {
                  if (headInput.trim()) {
                    setDepts((prev) =>
                      prev.map((d) =>
                        d.id === assignHeadDept.id
                          ? { ...d, head: headInput.trim() }
                          : d,
                      ),
                    );
                    showToast(
                      `Notification sent to ${headInput} & HR.`,
                      "success",
                    );
                    showToast(
                      `Audit Log: ${headInput} assigned as head of ${assignHeadDept.name}`,
                      "info",
                    );
                  }
                  setAssignHeadDept(null);
                  setHeadInput("");
                }}
              >
                Assign Head
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Employees Modal */}
      {viewEmployeesDept && (
        <div
          className="fixed inset-0 z-[2000] flex justify-end p-4 sm:p-0"
          style={{ backgroundColor: "rgba(0,0,0,0.45)" }}
          onClick={() => setViewEmployeesDept(null)}
        >
          <div
            className="w-full sm:w-[450px] h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300 bg-card"
            style={{ borderLeft: "1px solid var(--border)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-5 border-b border-border bg-neutral-50 dark:bg-zinc-800/40 flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-secondary">
                  <Users size={20} color="var(--primary)" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-foreground">
                    {viewEmployeesDept.name} Team
                  </h3>
                  <p className="text-xs font-medium text-muted-foreground mt-0.5">
                    {viewEmployeesDept.employees} total employees listed
                  </p>
                </div>
              </div>
              <button
                onClick={() => setViewEmployeesDept(null)}
                className="p-2 rounded-xl hover:bg-neutral-200 dark:hover:bg-zinc-700 text-muted-foreground"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-3 bg-neutral-50 dark:bg-zinc-900">
              {[
                {
                  name: "Rohan Sharma",
                  role: "Lead Engineer",
                  status: "Active",
                  email: "rohan.s@nexus.com",
                },
                {
                  name: "Aarti Gupta",
                  role: "Staff Dev",
                  status: "Active",
                  email: "aarti.g@nexus.com",
                },
                {
                  name: "Vijay Kumar",
                  role: "QA Analyst",
                  status: "On Leave",
                  email: "vijay.k@nexus.com",
                },
                {
                  name: "Divya S.",
                  role: "Frontend Dev",
                  status: "Active",
                  email: "divya.s@nexus.com",
                },
                {
                  name: "Rahul M.",
                  role: "DevOps Lead",
                  status: "Active",
                  email: "rahul.m@nexus.com",
                },
              ].map((emp, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 bg-white dark:bg-zinc-800 rounded-2xl border border-border shadow-sm hover:-translate-y-[2px] hover:border-[#00B87C] hover:shadow-[0_0_15px_rgba(0,184,124,0.3)] transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#00B87C]/10 text-[#00B87C] flex items-center justify-center text-xs font-black">
                      {emp.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        {emp.name}
                      </p>
                      <p className="text-[11px] text-muted-foreground font-medium">
                        {emp.role} • {emp.email}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider ${emp.status === "Active" ? "bg-[#E6F4EA] text-[#00B87C]" : "bg-amber-50 text-amber-600"}`}
                  >
                    {emp.status}
                  </span>
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-border bg-neutral-50 dark:bg-zinc-800/40 flex justify-end flex-shrink-0">
              <button
                onClick={() => setViewEmployeesDept(null)}
                className="px-5 py-2.5 rounded-xl text-xs font-extrabold text-slate-600 dark:text-slate-300 bg-neutral-100 dark:bg-zinc-800 hover:bg-neutral-200 transition-colors"
              >
                Close Roster
              </button>
            </div>
          </div>
        </div>
      )}

      {showAddModal && (
        <DepartmentFormModal
          onClose={() => setShowAddModal(false)}
          onSave={handleSave}
        />
      )}
      {editDept && (
        <DepartmentFormModal
          dept={editDept}
          onClose={() => setEditDept(null)}
          onSave={handleSave}
        />
      )}
      {selectedDept && (
        <DepartmentDetailModal
          dept={selectedDept}
          onClose={() => setSelectedDept(null)}
        />
      )}
      
      {deleteConfirmDept && (
        <div
          className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setDeleteConfirmDept(null)}
        >
          <div
            className="w-full max-w-sm rounded-2xl bg-card shadow-xl border border-border p-6 animate-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-full bg-rose-50 flex items-center justify-center mb-4 mx-auto">
              <Trash2 size={24} className="text-rose-500" />
            </div>
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-slate-100 mb-2 text-center">
              Delete Department
            </h3>
            <p className="text-sm text-muted-foreground mb-6 text-center">
              Are you sure you want to delete <strong>{deleteConfirmDept.name}</strong>? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                className="w-full py-2.5 rounded-xl text-xs font-extrabold text-slate-600 dark:text-slate-300 bg-neutral-100 dark:bg-zinc-800 hover:bg-neutral-200 transition-colors"
                onClick={() => setDeleteConfirmDept(null)}
              >
                Cancel
              </button>
              <button
                className="w-full py-2.5 rounded-xl text-xs font-extrabold text-white bg-rose-500 hover:bg-rose-600 shadow-sm transition-all"
                onClick={() => {
                  setDepts((prev) => prev.filter((d) => d.id !== deleteConfirmDept.id));
                  setDeleteConfirmDept(null);
                  showToast("Department Deleted", "success", `${deleteConfirmDept.name} has been deleted.`);
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {moveDept && (
        <div
          className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setMoveDept(null)}
        >
          <div
            className="w-full max-w-sm rounded-2xl bg-card shadow-xl border border-border p-6 animate-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100 mb-1">
              Move Department
            </h3>
            <p className="text-xs text-muted-foreground mb-4">
              Change the parent unit for <strong>"{moveDept.name}"</strong>.
            </p>
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-[11px] font-black text-muted-foreground uppercase tracking-widest mb-1.5">
                  Current Parent
                </label>
                <input
                  type="text"
                  value={moveDept.parentDepartment || "None"}
                  disabled
                  className="w-full px-4 py-2.5 rounded-xl bg-secondary border border-border text-muted-foreground text-[14px] cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-[11px] font-black text-muted-foreground uppercase tracking-widest mb-1.5">
                  New Parent
                </label>
                <div className="relative">
                  <select
                    value={newParentInput}
                    onChange={(e) => setNewParentInput(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl outline-none bg-background border border-border text-foreground text-[14px] focus:border-primary appearance-none font-bold"
                  >
                    <option value="None">None</option>
                    {depts
                      .filter((d) => d.id !== moveDept.id)
                      .map((d) => (
                        <option key={d.id} value={d.name}>
                          {d.name}
                        </option>
                      ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                className="w-full py-2.5 rounded-xl text-xs font-extrabold text-slate-600 dark:text-slate-300 bg-neutral-100 dark:bg-zinc-800 hover:bg-neutral-200 transition-colors"
                onClick={() => setMoveDept(null)}
              >
                Cancel
              </button>
              <button
                className="w-full py-2.5 rounded-xl text-xs font-extrabold text-white bg-primary hover:opacity-90 shadow-sm transition-all"
                onClick={() => {
                  setDepts((prev) =>
                    prev.map((d) =>
                      d.id === moveDept.id
                        ? { ...d, parentDepartment: newParentInput }
                        : d,
                    ),
                  );
                  setMoveDept(null);
                }}
              >
                Confirm Move
              </button>
            </div>
          </div>
        </div>
      )}

      {showExportModal && (
        <div
          className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setShowExportModal(false)}
        >
          <div
            className="w-full max-w-sm rounded-2xl bg-card shadow-xl border border-border p-6 animate-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100 mb-1">
              Export Department Report
            </h3>
            <p className="text-xs text-muted-foreground mb-4">
              Download current department configurations and lists.
            </p>
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-[11px] font-black text-muted-foreground uppercase tracking-widest mb-1.5">
                  Report Type
                </label>
                <select
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl outline-none bg-background border border-border text-foreground text-[14px] focus:border-primary appearance-none font-bold"
                >
                  <option>Employee List</option>
                  <option>Analytics Report</option>
                  <option>Budget Report</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-black text-muted-foreground uppercase tracking-widest mb-1.5">
                  Format
                </label>
                <select
                  value={reportFormat}
                  onChange={(e) => setReportFormat(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl outline-none bg-background border border-border text-foreground text-[14px] focus:border-primary appearance-none font-bold"
                >
                  <option>CSV</option>
                  <option>Excel</option>
                  <option>PDF</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                className="w-full py-2.5 rounded-xl text-xs font-extrabold text-slate-600 dark:text-slate-300 bg-neutral-100 dark:bg-zinc-800 hover:bg-neutral-200 transition-colors"
                onClick={() => setShowExportModal(false)}
              >
                Cancel
              </button>
              <button
                className="w-full py-2.5 rounded-xl text-xs font-extrabold text-white bg-primary hover:opacity-90 shadow-sm transition-all"
                onClick={handleExportReport}
              >
                Export
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
