import { useState } from "react";
import { X, Plus, Trash2 } from "lucide-react";
import { Department, ChangeRecord } from "../types/department.types";
import { useAuth } from "../../../context/AuthContext";
import { Employee } from "../../Employee/types/employee.types";

interface DepartmentFormModalProps {
  dept?: Department | null;
  employeesList: Employee[];
  onClose: () => void;
  onSave: (d: Department) => void;
}

export function DepartmentFormModal({
  dept,
  employeesList,
  onClose,
  onSave,
}: DepartmentFormModalProps) {
  const { user } = useAuth();
  const [form, setForm] = useState({
    name: dept?.name || "",
    code: dept?.code || "",
    head: dept?.head || "",
    description: dept?.description || "",
    parentDepartment: dept?.parentDepartment || "None",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [teams, setTeams] = useState<{ name: string; lead: string }[]>(
    dept?.teams || [],
  );
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
    }

    if (!form.name.trim()) newErrors.name = "Department name is required.";
    if (!form.code.trim()) newErrors.code = "Department code is required.";
    if (!form.head.trim()) newErrors.head = "Department head is required.";

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

    if (dept) {
      if (dept.head !== form.head) {
        newChangeRecords.push({
          id: Math.random().toString(),
          changedBy: {
            name: user?.name || "Admin",
            role: user?.role || "Admin",
          },
          newValue: `Head: ${form.head}`,
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
      status: dept?.status || "Active",
      employees: dept?.employees || 0,
      activeEmployees: dept?.activeEmployees || 0,
      onLeaveEmployees: dept?.onLeaveEmployees || 0,
      growth: dept?.growth || 0,
      description: form.description,
      createdDate:
        dept?.createdDate ||
        new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
      lastUpdated: now,
      parentDepartment: form.parentDepartment,
      teams: teams
        .map((t) => ({ name: t.name.trim(), lead: t.lead.trim() }))
        .filter((t) => t.name),
      changeHistory: [...(dept?.changeHistory || []), ...newChangeRecords]
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/50"
      onClick={onClose}
    >
      <div
        className="w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 bg-white dark:bg-card"
        style={{ border: "1px solid var(--border)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-border bg-white dark:bg-card">
          <div>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">
              {dept ? "Edit Department" : "Create Department"}
            </h3>
            <p className="text-sm font-medium text-slate-500 mt-1">
              Manage organizational boundaries and budgets
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
                {employeesList?.map((emp: Employee) => (
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

          {/* Sub-teams Section */}
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

            <div className="border border-border rounded-xl overflow-hidden bg-white dark:bg-zinc-900">
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
                      <td
                        colSpan={3}
                        className="px-6 py-8 text-center text-sm text-slate-500"
                      >
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
                            onChange={(e) =>
                              updateTeamName(index, e.target.value)
                            }
                            placeholder="e.g. Frontend Team"
                            maxLength={50}
                            className={`w-full rounded-lg px-3 py-2 text-sm border ${
                              teamErrors[index]
                                ? "border-red-500"
                                : "border-border"
                            } bg-background text-foreground outline-none focus:ring-2 focus:ring-[#00B87C]/20 font-medium transition-all`}
                          />
                        </td>
                        <td className="px-6 py-3">
                          <div className="flex items-center gap-2 border border-border rounded-lg bg-background px-3 py-1.5 focus-within:ring-2 focus-within:ring-[#00B87C]/20">
                            {team.lead && (
                              <img
                                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                                  team.lead,
                                )}&background=f0fdf4&color=16a34a`}
                                alt={team.lead}
                                className="w-6 h-6 rounded-full"
                              />
                            )}
                            <select
                              value={team.lead}
                              onChange={(e) =>
                                updateTeamLead(index, e.target.value)
                              }
                              className="w-full text-sm bg-transparent outline-none text-foreground font-medium"
                            >
                              <option value="">Select Lead...</option>
                              {employeesList?.map((emp: Employee) => (
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
                  placeholder="e.g., Updated budget limits"
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

          {/* Change History if editing */}
          {dept && dept.changeHistory && dept.changeHistory.length > 0 && (
            <div className="border-t border-border pt-8 mt-8">
              <div className="mb-4">
                <h4 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                  CHANGE HISTORY
                </h4>
                <p className="text-xs font-medium text-slate-500 mt-1">
                  Track all changes made to this department.
                </p>
              </div>

              <div className="border border-border rounded-xl max-h-[200px] overflow-y-auto">
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
                    {dept.changeHistory.map((record) => (
                      <tr key={record.id} className="bg-white dark:bg-card">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <img
                              src={
                                record.changedBy.avatar ||
                                `https://ui-avatars.com/api/?name=${encodeURIComponent(record.changedBy.name)}&background=f0fdf4&color=16a34a`
                              }
                              alt={record.changedBy.name}
                              className="w-8 h-8 rounded-full"
                            />
                            <div>
                              <p className="text-xs font-bold text-slate-900 dark:text-slate-100">
                                {record.changedBy.name}
                              </p>
                              <p className="text-[10px] text-slate-500">
                                {record.changedBy.role}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-xs font-medium text-slate-700 dark:text-slate-300">
                          {record.newValue}
                        </td>
                        <td className="px-4 py-3 text-xs font-medium text-slate-700 dark:text-slate-300 whitespace-pre-line">
                          {record.date.replace(", ", "\n")}
                        </td>
                        <td className="px-4 py-3 text-xs font-medium text-slate-700 dark:text-slate-300">
                          {record.comment}
                        </td>
                      </tr>
                    ))}
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
