import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  X,
  Plus,
  Trash2,
  Settings,
  Layers,
  Sparkles,
  ShieldCheck,
  FileCheck,
  HelpCircle,
} from "lucide-react";
import type { OffboardingTemplate } from "../types/offboarding.types";
import { showToast } from "../../../components/workflow/ToastNotification";

interface OffboardingTemplateEditorModalProps {
  showTemplateEditor: boolean;
  setShowTemplateEditor: (v: boolean) => void;
  editingTemplate: string | null;
  templates: OffboardingTemplate[];
  departments: string[];
  saveTemplate: (template: OffboardingTemplate) => void;
}

const emptyTemplate = (): OffboardingTemplate => ({
  id: "",
  name: "",
  code: `TPL-OFF-${Math.floor(1000 + Math.random() * 9000)}`,
  description: "",
  department: "",
  status: "draft",
  version: 1,
  isDefault: false,
  clearances: [
    {
      id: "Manager",
      dept: "Manager",
      person: "Reporting Manager",
      tasks: [
        {
          id: "manager-handover",
          name: "Approve project handover",
          owner: "Manager",
          isMandatory: true,
        },
      ],
    },
    {
      id: "IT",
      dept: "IT",
      person: "IT Team Support",
      tasks: [
        {
          id: "it-access",
          name: "Revoke access and recover devices",
          owner: "IT",
          isMandatory: true,
        },
      ],
    },
    {
      id: "Finance",
      dept: "Finance",
      person: "Finance Manager",
      tasks: [
        {
          id: "finance-ff",
          name: "Verify final settlement",
          owner: "Finance",
          isMandatory: true,
        },
      ],
    },
    {
      id: "HR",
      dept: "HR",
      person: "HR Manager",
      tasks: [
        {
          id: "hr-interview",
          name: "Complete exit interview",
          owner: "HR",
          isMandatory: true,
        },
      ],
    },
    {
      id: "Admin",
      dept: "Admin",
      person: "Admin Lead",
      tasks: [
        {
          id: "admin-card",
          name: "Confirm access-card return",
          owner: "Admin",
          isMandatory: true,
        },
      ],
    },
  ],
  assets: [
    {
      id: "laptop",
      name: "Company Laptop",
      category: "Hardware",
      mandatory: true,
    },
    {
      id: "access_card",
      name: "Office Access Card",
      category: "Security",
      mandatory: true,
    },
  ],
  documents: [
    { id: "resignation", name: "Resignation Letter", mandatory: true },
    { id: "exit_form", name: "Exit Interview Form", mandatory: true },
    { id: "relieving", name: "Relieving Letter", mandatory: false },
  ],
  exitInterviewRequired: true,
  exitInterviewQuestionnaire: [
    "What is your primary reason for leaving?",
    "How would you rate the overall management culture?",
    "What could we have done to keep you with the company?",
  ],
  knowledgeTransferChecklist: [
    "Document credentials & login keys",
    "Identify handover buddy and schedule handover session",
    "Commit all local code and push to remote branches",
  ],
  settlementChecklist: [
    "Verify final salary calculation",
    "Calculate notice recovery or leave encashment",
    "Check loan balance and recovery adjustment",
  ],
  customTasks: [
    {
      id: "exit-declaration",
      name: "Submit exit declaration",
      owner: "Employee",
      dueDays: 2,
      priority: "High",
      mandatory: true,
    },
  ],
});

export function OffboardingTemplateEditorModal({
  showTemplateEditor,
  setShowTemplateEditor,
  editingTemplate,
  templates,
  departments,
  saveTemplate,
}: OffboardingTemplateEditorModalProps) {
  const [draft, setDraft] = useState<OffboardingTemplate>(emptyTemplate);
  const [activeTab, setActiveTab] = useState<
    "info" | "clearances" | "assets" | "process"
  >("info");

  // Input helpers
  const [customTaskName, setCustomTaskName] = useState("");
  const [customTaskOwner, setCustomTaskOwner] = useState("IT Manager");
  const [customTaskDue, setCustomTaskDue] = useState(3);
  const [customTaskPriority, setCustomTaskPriority] = useState<
    "High" | "Medium" | "Low"
  >("Medium");
  const [customTaskMandatory, setCustomTaskMandatory] = useState(true);
  const [customTaskApproval, setCustomTaskApproval] = useState(true);
  const [customTaskDesc, setCustomTaskDesc] = useState("");

  const [customAssetName, setCustomAssetName] = useState("");
  const [customAssetCategory, setCustomAssetCategory] = useState("Hardware");
  const [customAssetMandatory, setCustomAssetMandatory] = useState(true);

  const [customDocName, setCustomDocName] = useState("");
  const [customDocMandatory, setCustomDocMandatory] = useState(true);

  const [customQuestion, setCustomQuestion] = useState("");
  const [customKtItem, setCustomKtItem] = useState("");

  useEffect(() => {
    if (showTemplateEditor) {
      const found = templates.find((tpl) => tpl.id === editingTemplate);
      if (found) {
        // Ensure clearances has all 5 sections if they are missing
        const requiredDepts = ["Manager", "IT", "Finance", "HR", "Admin"];
        const existingClearances = found.clearances || [];
        const filledClearances = requiredDepts.map((deptName) => {
          const match = existingClearances.find(
            (c) => c.dept === deptName || c.id === deptName,
          );
          if (match) return match;
          const defaultPerson =
            deptName === "Manager"
              ? "Reporting Manager"
              : deptName === "IT"
                ? "IT Team Support"
                : deptName === "Finance"
                  ? "Finance Manager"
                  : deptName === "HR"
                    ? "HR Manager"
                    : "Admin Lead";
          return {
            id: deptName,
            dept: deptName,
            person: defaultPerson,
            tasks: [],
          };
        });
        setDraft({
          ...found,
          clearances: filledClearances,
        });
      } else {
        setDraft(emptyTemplate());
      }
      setActiveTab("info");
    }
  }, [editingTemplate, templates, showTemplateEditor]);

  // Clearance task helpers
  const addClearanceTask = (deptId: string) => {
    if (!customTaskName.trim()) return;
    setDraft((current) => ({
      ...current,
      clearances: (current.clearances || []).map((c) =>
        c.id === deptId
          ? {
              ...c,
              tasks: [
                ...c.tasks,
                {
                  id: `task-${Date.now()}`,
                  name: customTaskName.trim(),
                  owner: deptId,
                  isMandatory: customTaskMandatory,
                  description: customTaskDesc.trim(),
                  dueBeforeLWD: customTaskDue,
                  priority: customTaskPriority,
                  requiresApproval: customTaskApproval,
                },
              ],
            }
          : c,
      ),
    }));
    setCustomTaskName("");
    setCustomTaskDesc("");
  };

  const removeClearanceTask = (deptId: string, taskId: string) => {
    setDraft((current) => ({
      ...current,
      clearances: (current.clearances || []).map((c) =>
        c.id === deptId
          ? { ...c, tasks: c.tasks.filter((t) => t.id !== taskId) }
          : c,
      ),
    }));
  };

  // Asset helpers
  const addAssetRule = () => {
    if (!customAssetName.trim()) return;
    setDraft((current) => ({
      ...current,
      assets: [
        ...(current.assets || []),
        {
          id: `asset-${Date.now()}`,
          name: customAssetName.trim(),
          category: customAssetCategory,
          mandatory: customAssetMandatory,
        },
      ],
    }));
    setCustomAssetName("");
  };

  const removeAssetRule = (id: string) => {
    setDraft((current) => ({
      ...current,
      assets: (current.assets || []).filter((a) => a.id !== id),
    }));
  };

  // Document helpers
  const addDocumentRule = () => {
    if (!customDocName.trim()) return;
    setDraft((current) => ({
      ...current,
      documents: [
        ...(current.documents || []),
        {
          id: `doc-${Date.now()}`,
          name: customDocName.trim(),
          mandatory: customDocMandatory,
        },
      ],
    }));
    setCustomDocName("");
  };

  const removeDocumentRule = (id: string) => {
    setDraft((current) => ({
      ...current,
      documents: (current.documents || []).filter((d) => d.id !== id),
    }));
  };

  // Questionnaire / KT helpers
  const addQuestion = () => {
    if (!customQuestion.trim()) return;
    setDraft((current) => ({
      ...current,
      exitInterviewQuestionnaire: [
        ...(current.exitInterviewQuestionnaire || []),
        customQuestion.trim(),
      ],
    }));
    setCustomQuestion("");
  };

  const removeQuestion = (idx: number) => {
    setDraft((current) => ({
      ...current,
      exitInterviewQuestionnaire: (
        current.exitInterviewQuestionnaire || []
      ).filter((_, i) => i !== idx),
    }));
  };

  const addKtItem = () => {
    if (!customKtItem.trim()) return;
    setDraft((current) => ({
      ...current,
      knowledgeTransferChecklist: [
        ...(current.knowledgeTransferChecklist || []),
        customKtItem.trim(),
      ],
    }));
    setCustomKtItem("");
  };

  const removeKtItem = (idx: number) => {
    setDraft((current) => ({
      ...current,
      knowledgeTransferChecklist: (
        current.knowledgeTransferChecklist || []
      ).filter((_, i) => i !== idx),
    }));
  };

  const submit = (status: "draft" | "active") => {
    if (!draft.name.trim() || !draft.department) {
      showToast(
        "Validation Error",
        "error",
        "Please provide a template name and select a department.",
      );
      return;
    }
    saveTemplate({
      ...draft,
      status,
    });
    setShowTemplateEditor(false);
  };

  return (
    <AnimatePresence>
      {showTemplateEditor && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
          onClick={() => setShowTemplateEditor(false)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-[36px] bg-card border border-border shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.96, y: 15 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.96, y: 15 }}
          >
            {/* Header */}
            <div className="px-8 py-6 border-b border-border flex justify-between items-center shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#00B87C]/10 flex items-center justify-center">
                  <Sparkles className="text-[#00B87C]" size={20} />
                </div>
                <div>
                  <h2 className="text-[18px] font-black text-foreground tracking-tight">
                    {editingTemplate ? "Edit" : "Create"} Offboarding Template
                  </h2>
                  <p className="text-[11px] font-bold text-muted-foreground">
                    Define exit clearances, asset returns, exit interviews, and
                    documentation checklists
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowTemplateEditor(false)}
                className="p-2 hover:bg-muted rounded-xl transition-all text-muted-foreground hover:text-foreground"
              >
                <X size={18} />
              </button>
            </div>

            {/* Tabs */}
            <div className="px-8 border-b border-border bg-muted/5 flex gap-2 shrink-0">
              {[
                { key: "info", label: "1. Info & Filters", icon: Settings },
                {
                  key: "clearances",
                  label: "2. Clearances Tasks",
                  icon: ShieldCheck,
                },
                { key: "assets", label: "3. Assets & Docs", icon: FileCheck },
                {
                  key: "process",
                  label: "4. KT & Exit Interview",
                  icon: HelpCircle,
                },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`px-5 py-4 text-[11px] font-black uppercase tracking-wider border-b-2 flex items-center gap-2 transition-all cursor-pointer ${
                    activeTab === tab.key
                      ? "border-[#00B87C] text-[#00B87C]"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <tab.icon size={13} />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Scrollable Form Body */}
            <div className="flex-1 overflow-y-auto p-8 space-y-6">
              {/* TAB 1: INFO */}
              {activeTab === "info" && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="text-[10px] font-black text-muted-foreground uppercase tracking-wider block mb-1.5">
                        Template Name *
                      </label>
                      <input
                        value={draft.name}
                        onChange={(e) =>
                          setDraft({ ...draft, name: e.target.value })
                        }
                        placeholder="e.g. Engineering Exit template"
                        className="w-full rounded-xl border border-border bg-background px-4 py-3 text-xs font-bold outline-none focus:border-[#00B87C]"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-muted-foreground uppercase tracking-wider block mb-1.5">
                        Template Code
                      </label>
                      <input
                        value={draft.code}
                        disabled
                        className="w-full rounded-xl border border-border bg-muted/20 px-4 py-3 text-xs font-bold outline-none text-muted-foreground cursor-not-allowed"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="text-[10px] font-black text-muted-foreground uppercase tracking-wider block mb-1.5">
                        Department *
                      </label>
                      <select
                        value={draft.department}
                        onChange={(e) =>
                          setDraft({ ...draft, department: e.target.value })
                        }
                        className="w-full rounded-xl border border-[#00B87C]/20 bg-background px-4 py-3 text-xs font-bold outline-none"
                      >
                        <option value="">Select department...</option>
                        {departments.map((dept) => (
                          <option key={dept} value={dept}>
                            {dept}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-muted-foreground uppercase tracking-wider block mb-1.5">
                        Status
                      </label>
                      <select
                        value={draft.status}
                        onChange={(e) =>
                          setDraft({ ...draft, status: e.target.value as any })
                        }
                        className="w-full rounded-xl border border-border bg-background px-4 py-3 text-xs font-bold outline-none"
                      >
                        <option value="draft">Draft</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-wider block mb-1.5">
                      Description
                    </label>
                    <textarea
                      value={draft.description}
                      onChange={(e) =>
                        setDraft({ ...draft, description: e.target.value })
                      }
                      placeholder="e.g. Standard offboarding sequence containing KT, hardware collection, and F&F calculations..."
                      rows={3}
                      className="w-full rounded-xl border border-border bg-background px-4 py-3 text-xs font-medium outline-none resize-none"
                    />
                  </div>

                  <div className="flex flex-col gap-2 p-4 rounded-2xl bg-muted/30 border">
                    <label className="flex items-center gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={draft.isDefault || false}
                        onChange={(e) =>
                          setDraft({ ...draft, isDefault: e.target.checked })
                        }
                        className="h-4.5 w-4.5 rounded border-border text-[#00B87C] focus:ring-[#00B87C]"
                      />
                      <div className="space-y-0.5">
                        <span className="text-xs font-black text-foreground">
                          Set as Default Template
                        </span>
                        <p className="text-[10px] text-muted-foreground font-semibold">
                          If checked, all exiting employees from this department
                          will use this template workflow by default.
                        </p>
                      </div>
                    </label>
                  </div>
                </div>
              )}

              {/* TAB 2: CLEARANCES */}
              {activeTab === "clearances" && (
                <div className="space-y-6">
                  <p className="text-xs text-muted-foreground font-semibold leading-relaxed">
                    Configure offboarding clearance tasks. Tasks will
                    automatically be routed to the assigned department owners
                    before the Last Working Day.
                  </p>

                  <div className="space-y-4">
                    {/* Flat Clearance Tasks List */}
                    <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                      {(() => {
                        const allClearanceTasks = (
                          draft.clearances || []
                        ).flatMap((c) =>
                          c.tasks.map((t) => ({
                            ...t,
                            deptId: c.id,
                            deptName: c.dept,
                          })),
                        );
                        if (allClearanceTasks.length === 0) {
                          return (
                            <div className="p-8 text-center border border-dashed rounded-3xl bg-muted/5">
                              <p className="text-xs text-muted-foreground italic font-semibold">
                                No clearance tasks configured. Add one below.
                              </p>
                            </div>
                          );
                        }
                        return allClearanceTasks.map((task) => (
                          <div
                            key={task.id}
                            className="flex items-center justify-between p-4 border border-border rounded-2xl bg-card shadow-sm hover:border-[#00B87C]/30 transition-all"
                          >
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <strong className="text-xs font-black text-foreground">
                                  {task.name}
                                </strong>
                                <span
                                  className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase border ${
                                    task.priority === "High"
                                      ? "bg-red-50 text-red-500 border-red-500/15"
                                      : task.priority === "Medium"
                                        ? "bg-amber-50 text-amber-500 border-amber-500/15"
                                        : "bg-blue-50 text-blue-500 border-blue-500/15"
                                  }`}
                                >
                                  {task.priority || "Medium"} Priority
                                </span>
                                {task.isMandatory && (
                                  <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-emerald-50 text-[#00B87C] border border-[#00B87C]/15">
                                    Mandatory
                                  </span>
                                )}
                                {task.requiresApproval && (
                                  <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-purple-50 text-purple-600 border border-purple-500/15">
                                    Requires Approval
                                  </span>
                                )}
                              </div>
                              {task.description && (
                                <p className="text-xs text-muted-foreground font-semibold">
                                  {task.description}
                                </p>
                              )}
                              <div className="flex gap-4 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                                <span>
                                  Assign To:{" "}
                                  <span className="text-foreground">
                                    {task.owner === "IT"
                                      ? "IT Manager"
                                      : task.owner === "HR"
                                        ? "HR Manager"
                                        : task.owner === "Finance"
                                          ? "Finance Manager"
                                          : task.owner === "Manager"
                                            ? "Reporting Manager"
                                            : "Admin"}
                                  </span>
                                </span>
                                <span>
                                  Due:{" "}
                                  <span className="text-foreground">
                                    {task.dueBeforeLWD || 3} Days before LWD
                                  </span>
                                </span>
                              </div>
                            </div>
                            <button
                              onClick={() =>
                                removeClearanceTask(task.deptId, task.id)
                              }
                              className="p-2 hover:bg-red-500/10 text-red-500 rounded-xl transition-all"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        ));
                      })()}
                    </div>

                    {/* Add Task Form */}
                    <div className="bg-card border border-border p-6 rounded-3xl space-y-4 shadow-sm">
                      <div className="flex items-center gap-2 border-b pb-2 border-border/60">
                        <Plus className="text-[#00B87C]" size={16} />
                        <h5 className="text-xs font-black uppercase text-foreground tracking-wider">
                          Add Clearance Task
                        </h5>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-[10px] font-black text-muted-foreground uppercase tracking-wider block mb-1.5">
                            Task Name *
                          </label>
                          <input
                            value={customTaskName}
                            onChange={(e) => setCustomTaskName(e.target.value)}
                            placeholder="e.g. Recover Company Laptop"
                            className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-xs font-bold outline-none focus:border-[#00B87C]"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-black text-muted-foreground uppercase tracking-wider block mb-1.5">
                            Assign To *
                          </label>
                          <select
                            value={customTaskOwner}
                            onChange={(e) => setCustomTaskOwner(e.target.value)}
                            className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-xs font-bold outline-none focus:border-[#00B87C]"
                          >
                            <option value="IT Manager">IT Manager</option>
                            <option value="Finance Manager">
                              Finance Manager
                            </option>
                            <option value="HR Manager">HR Manager</option>
                            <option value="Reporting Manager">
                              Reporting Manager
                            </option>
                            <option value="Admin">Admin</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] font-black text-muted-foreground uppercase tracking-wider block mb-1.5">
                          Description (Optional)
                        </label>
                        <textarea
                          value={customTaskDesc}
                          onChange={(e) => setCustomTaskDesc(e.target.value)}
                          placeholder="Collect laptop, charger, and return receipt..."
                          rows={2}
                          className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-xs font-medium outline-none focus:border-[#00B87C] resize-none"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
                        <div>
                          <label className="text-[10px] font-black text-muted-foreground uppercase tracking-wider block mb-1.5">
                            Due Before LWD (Days)
                          </label>
                          <input
                            type="number"
                            value={customTaskDue}
                            onChange={(e) =>
                              setCustomTaskDue(Number(e.target.value))
                            }
                            min={0}
                            className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs font-bold outline-none focus:border-[#00B87C]"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-black text-muted-foreground uppercase tracking-wider block mb-1.5">
                            Priority
                          </label>
                          <select
                            value={customTaskPriority}
                            onChange={(e) =>
                              setCustomTaskPriority(e.target.value as any)
                            }
                            className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs font-bold outline-none focus:border-[#00B87C]"
                          >
                            <option value="Low">Low Priority</option>
                            <option value="Medium">Medium Priority</option>
                            <option value="High">High Priority</option>
                          </select>
                        </div>
                        <div className="flex items-center justify-between gap-4 h-9">
                          <div className="flex gap-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={customTaskMandatory}
                                onChange={(e) =>
                                  setCustomTaskMandatory(e.target.checked)
                                }
                                className="h-4 w-4 rounded border border-border text-[#00B87C] focus:ring-[#00B87C]"
                              />
                              <span className="text-[10px] font-black text-foreground uppercase tracking-wider">
                                Mandatory
                              </span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={customTaskApproval}
                                onChange={(e) =>
                                  setCustomTaskApproval(e.target.checked)
                                }
                                className="h-4 w-4 rounded border border-border text-[#00B87C] focus:ring-[#00B87C]"
                              />
                              <span className="text-[10px] font-black text-foreground uppercase tracking-wider">
                                Approval Required
                              </span>
                            </label>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              const mapRoleToOwner = (role: string): string => {
                                if (role === "IT Manager") return "IT";
                                if (role === "Finance Manager")
                                  return "Finance";
                                if (role === "HR Manager") return "HR";
                                if (role === "Reporting Manager")
                                  return "Manager";
                                return "Admin";
                              };
                              addClearanceTask(mapRoleToOwner(customTaskOwner));
                            }}
                            className="bg-[#00B87C] text-white px-5 py-2 text-xs font-black uppercase rounded-xl shadow-sm hover:opacity-90 transition-all shrink-0 cursor-pointer"
                          >
                            Add Task
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: ASSETS & DOCUMENTS */}
              {activeTab === "assets" && (
                <div className="space-y-6">
                  {/* Asset Recovery */}
                  <div>
                    <h4 className="text-[11px] font-black text-[#00B87C] uppercase tracking-wider mb-3 pb-1.5 border-b border-[#00B87C]/20">
                      Asset Recovery Setup
                    </h4>
                    <div className="space-y-2 mb-4">
                      {(draft.assets || []).map((asset) => (
                        <div
                          key={asset.id}
                          className="flex items-center justify-between p-3.5 bg-muted/20 border rounded-2xl"
                        >
                          <div>
                            <strong className="text-xs text-foreground">
                              {asset.name}
                            </strong>
                            <p className="text-[10px] text-muted-foreground font-semibold">
                              Category: {asset.category} · Return:{" "}
                              {asset.mandatory ? "Mandatory" : "Optional"}
                            </p>
                          </div>
                          <button
                            onClick={() => removeAssetRule(asset.id)}
                            className="p-1.5 hover:bg-red-500/10 text-red-500 rounded-lg transition-all"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-muted/10 p-4 rounded-2xl border">
                      <div>
                        <input
                          value={customAssetName}
                          onChange={(e) => setCustomAssetName(e.target.value)}
                          placeholder="Asset (e.g. Dell Monitor)..."
                          className="w-full rounded-xl border border-border bg-card px-3 py-2 text-xs font-bold outline-none"
                        />
                      </div>
                      <div>
                        <select
                          value={customAssetCategory}
                          onChange={(e) =>
                            setCustomAssetCategory(e.target.value)
                          }
                          className="w-full rounded-xl border border-border bg-card px-3 py-2 text-xs font-bold outline-none"
                        >
                          <option value="Hardware">
                            Hardware (Laptop, Monitor)
                          </option>
                          <option value="Security">
                            Security (Access card, Keys)
                          </option>
                          <option value="Accounts">
                            Software accounts (Jira, Git)
                          </option>
                        </select>
                      </div>
                      <button
                        onClick={addAssetRule}
                        className="bg-[#00B87C] text-white py-2 text-xs font-black uppercase rounded-xl"
                      >
                        Add Asset
                      </button>
                    </div>
                  </div>

                  {/* Documents Collection */}
                  <div>
                    <h4 className="text-[11px] font-black text-[#00B87C] uppercase tracking-wider mb-3 pb-1.5 border-b border-[#00B87C]/20">
                      Exit Documents Checklist
                    </h4>
                    <div className="space-y-2 mb-4">
                      {(draft.documents || []).map((doc) => (
                        <div
                          key={doc.id}
                          className="flex items-center justify-between p-3 border rounded-xl bg-card"
                        >
                          <span className="text-xs font-bold text-foreground">
                            {doc.name}
                          </span>
                          <div className="flex items-center gap-3">
                            <span className="text-[10px] text-muted-foreground font-semibold">
                              {doc.mandatory ? "Mandatory" : "Optional"}
                            </span>
                            <button
                              onClick={() => removeDocumentRule(doc.id)}
                              className="text-red-500"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      <input
                        value={customDocName}
                        onChange={(e) => setCustomDocName(e.target.value)}
                        placeholder="Add required exit document (e.g. Settlement Clearance Cert)..."
                        className="flex-1 rounded-xl border border-border bg-background px-3 py-2 text-xs font-bold outline-none"
                      />
                      <button
                        onClick={addDocumentRule}
                        className="bg-[#00B87C] text-white px-4 text-xs font-bold uppercase rounded-xl"
                      >
                        Add Doc
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: KT & INTERVIEW */}
              {activeTab === "process" && (
                <div className="space-y-6">
                  {/* KT checklist */}
                  <div>
                    <h4 className="text-[11px] font-black text-[#00B87C] uppercase tracking-wider mb-3 pb-1.5 border-b border-[#00B87C]/20">
                      Knowledge Transfer tasks
                    </h4>
                    <div className="space-y-2 mb-3">
                      {(draft.knowledgeTransferChecklist || []).map(
                        (item, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between p-2.5 border rounded-xl bg-card"
                          >
                            <span className="text-xs font-bold text-foreground">
                              {item}
                            </span>
                            <button
                              onClick={() => removeKtItem(idx)}
                              className="text-red-500"
                            >
                              <X size={12} />
                            </button>
                          </div>
                        ),
                      )}
                    </div>
                    <div className="flex gap-2">
                      <input
                        value={customKtItem}
                        onChange={(e) => setCustomKtItem(e.target.value)}
                        placeholder="Add KT tasks (e.g. handover client repository credentials)..."
                        className="flex-1 rounded-xl border border-border bg-background px-3 py-2 text-xs font-bold outline-none"
                      />
                      <button
                        onClick={addKtItem}
                        className="bg-[#00B87C] text-white px-3 text-xs font-bold rounded-xl"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Exit Interview questionnaire */}
                  <div>
                    <div className="flex items-center justify-between border-b border-[#00B87C]/20 pb-1.5 mb-3">
                      <h4 className="text-[11px] font-black text-[#00B87C] uppercase tracking-wider">
                        Exit Interview Questionnaire
                      </h4>
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={draft.exitInterviewRequired}
                          onChange={(e) =>
                            setDraft({
                              ...draft,
                              exitInterviewRequired: e.target.checked,
                            })
                          }
                          className="h-3.5 w-3.5 rounded border-border"
                        />
                        <span className="text-[10px] font-bold text-foreground">
                          Interview Required
                        </span>
                      </label>
                    </div>

                    <div className="space-y-2 mb-3">
                      {(draft.exitInterviewQuestionnaire || []).map(
                        (item, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between p-2.5 border rounded-xl bg-card"
                          >
                            <span className="text-xs font-bold text-foreground">
                              {item}
                            </span>
                            <button
                              onClick={() => removeQuestion(idx)}
                              className="text-red-500"
                            >
                              <X size={12} />
                            </button>
                          </div>
                        ),
                      )}
                    </div>
                    <div className="flex gap-2">
                      <input
                        value={customQuestion}
                        onChange={(e) => setCustomQuestion(e.target.value)}
                        placeholder="Add interview feedback question..."
                        className="flex-1 rounded-xl border border-border bg-background px-3 py-2 text-xs font-bold outline-none"
                      />
                      <button
                        onClick={addQuestion}
                        className="bg-[#00B87C] text-white px-3 text-xs font-bold rounded-xl"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-8 py-5 border-t border-border flex items-center justify-between shrink-0 bg-muted/5">
              <button
                onClick={() => setShowTemplateEditor(false)}
                className="px-5 py-2.5 rounded-xl border border-border text-[11px] font-black text-foreground uppercase tracking-widest hover:bg-muted"
              >
                Cancel
              </button>
              <div className="flex gap-3">
                <button
                  onClick={() => submit("draft")}
                  className="px-5 py-2.5 rounded-xl border border-border text-foreground text-[11px] font-black uppercase tracking-widest hover:bg-muted"
                >
                  Save Draft
                </button>
                <button
                  onClick={() => submit("active")}
                  className="px-6 py-2.5 rounded-xl bg-[#00B87C] text-white text-[11px] font-black uppercase tracking-widest hover:opacity-90 transition-all shadow-md"
                >
                  Activate Template
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
