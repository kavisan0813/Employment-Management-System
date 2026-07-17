import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  FileText,
  Plus,
  X,
  Edit3,
  Copy,
  Trash2,
  Check,
  Info,
  Settings,
  FileCheck,
  Layers,
  Sparkles,
} from "lucide-react";
import type { Template } from "../types/onboarding.types";
import { showToast } from "../../../components/workflow/ToastNotification";

interface TemplateEditorModalProps {
  showTemplatesPanel: boolean;
  setShowTemplatesPanel: (v: boolean) => void;
  showTemplateEditor: boolean;
  setShowTemplateEditor: (v: boolean) => void;
  editingTemplate: string | null;
  setEditingTemplate: (v: string | null) => void;
  templates: Template[];
  departments: string[];
  taskOwners: string[];
  saveTemplate: (template: Template) => void;
}

const emptyTemplate = (): Template => ({
  id: "",
  name: "",
  code: `TPL-ONB-${Math.floor(1000 + Math.random() * 9000)}`,
  description: "",
  phases: 0,
  tasks: 0,
  dept: "",
  deptColor: "#00B87C",
  avgDays: "Not set",
  usageCount: 0,
  status: "draft",
  version: 1,
  designation: "",
  employmentType: "Full-time",
  experienceLevel: "Mid",
  branch: "Headquarters",
  company: "viyanHR Corp",
  effectiveFrom: new Date().toISOString().split("T")[0],
  effectiveTo: "",
  isDefault: false,
  sections: [
    {
      id: "company-process",
      name: "Company Process",
      tasks: [
        {
          id: "hr-verify",
          name: "Verify joining documents",
          owner: "HR Manager",
          dueDays: 1,
          priority: "High",
          mandatory: true,
          description: "Validate submitted identity documents.",
        },
        {
          id: "it-access",
          name: "Create email and system access",
          owner: "IT Manager",
          dueDays: 2,
          priority: "High",
          mandatory: true,
          description: "Provision standard employee access.",
        },
        {
          id: "finance-bank",
          name: "Verify bank details",
          owner: "Finance Manager",
          dueDays: 2,
          priority: "High",
          mandatory: true,
          description: "Confirm payroll bank information.",
        },
        {
          id: "admin-workspace",
          name: "Prepare workstation",
          owner: "Admin",
          dueDays: 2,
          priority: "Medium",
          mandatory: true,
          description: "Arrange access card and workspace.",
        },
        {
          id: "manager-plan",
          name: "Schedule first-week plan",
          owner: "Manager",
          dueDays: 3,
          priority: "Medium",
          mandatory: true,
          description: "Share team orientation plan.",
        },
      ],
    },
  ],
  documents: [
    {
      id: "aadhaar",
      name: "Aadhaar Card",
      mandatory: true,
      maxSize: 5,
      allowedTypes: [".pdf", ".jpg", ".png"],
      needVerification: true,
      visibleToEmployee: true,
    },
    {
      id: "pan",
      name: "PAN Card",
      mandatory: true,
      maxSize: 5,
      allowedTypes: [".pdf", ".jpg", ".png"],
      needVerification: true,
      visibleToEmployee: true,
    },
    {
      id: "photo",
      name: "Passport Photo",
      mandatory: true,
      maxSize: 2,
      allowedTypes: [".jpg", ".png"],
      needVerification: true,
      visibleToEmployee: true,
    },
  ],
  forms: [
    { id: "nda", name: "NDA Agreement", required: true },
    { id: "policy", name: "Company Policy Handbook", required: true },
    { id: "tax", name: "Form-12BB Tax Declaration", required: false },
  ],
  training: [
    { id: "welcome", name: "Welcome Video", required: false },
    { id: "posh", name: "POSH Compliance Course", required: true },
    { id: "it_sec", name: "Information Security Training", required: true },
  ],
  policies: [
    { id: "leave_p", name: "Annual Leave Policy", required: true },
    { id: "it_p", name: "IT Asset Protection Policy", required: true },
  ],
});

export function TemplateEditorModal(props: TemplateEditorModalProps) {
  const { templates, departments, taskOwners, editingTemplate, saveTemplate } =
    props;

  const [draft, setDraft] = useState<Template>(emptyTemplate);
  const [activeTab, setActiveTab] = useState<"info" | "candidate" | "company">(
    "info",
  );

  // Local helper states for adding custom items dynamically
  const [customDocName, setCustomDocName] = useState("");
  const [customDocMandatory, setCustomDocMandatory] = useState(true);
  const [customDocSize, setCustomDocSize] = useState(5);

  const [customTaskName, setCustomTaskName] = useState("");
  const [customTaskOwner, setCustomTaskOwner] = useState("HR Manager");
  const [customTaskDue, setCustomTaskDue] = useState(3);
  const [customTaskPriority, setCustomTaskPriority] = useState("Medium");
  const [customTaskMandatory, setCustomTaskMandatory] = useState(true);
  const [customTaskDesc, setCustomTaskDesc] = useState("");

  const [customFormName, setCustomFormName] = useState("");
  const [customTrainingName, setCustomTrainingName] = useState("");
  const [customPolicyName, setCustomPolicyName] = useState("");

  useEffect(() => {
    if (taskOwners && taskOwners.length > 0) {
      setCustomTaskOwner((prev) =>
        taskOwners.includes(prev) ? prev : taskOwners[0],
      );
    }
  }, [taskOwners]);

  useEffect(() => {
    if (props.showTemplateEditor) {
      const found = templates.find((tpl) => tpl.id === editingTemplate);
      if (found) {
        // Flatten all tasks from all sections into a single section "company-process"
        const allTasks = (found.sections || []).flatMap((sec) => sec.tasks);
        setDraft({
          ...found,
          sections: [
            {
              id: "company-process",
              name: "Company Process",
              tasks: allTasks,
            },
          ],
        });
      } else {
        setDraft(emptyTemplate());
      }
      setActiveTab("info");
    }
  }, [editingTemplate, templates, props.showTemplateEditor]);

  // Section/Phase task additions
  const addCompanyTask = (sectionId: string) => {
    if (!customTaskName.trim()) {
      showToast("Task name empty", "error", "Please type a task name first.");
      return;
    }
    setDraft((current) => ({
      ...current,
      sections: (current.sections || []).map((sec) =>
        sec.id === sectionId
          ? {
              ...sec,
              tasks: [
                ...sec.tasks,
                {
                  id: `task-${Date.now()}`,
                  name: customTaskName.trim(),
                  owner: customTaskOwner,
                  dueDays: customTaskDue,
                  priority: customTaskPriority,
                  mandatory: customTaskMandatory,
                  description: customTaskDesc.trim(),
                },
              ],
            }
          : sec,
      ),
    }));
    setCustomTaskName("");
    setCustomTaskDesc("");
  };

  const removeCompanyTask = (sectionId: string, taskId: string) => {
    setDraft((current) => ({
      ...current,
      sections: (current.sections || []).map((sec) =>
        sec.id === sectionId
          ? { ...sec, tasks: sec.tasks.filter((t) => t.id !== taskId) }
          : sec,
      ),
    }));
  };

  // Document management
  const addDocumentRule = () => {
    if (!customDocName.trim()) return;
    const newDoc = {
      id: `doc-${Date.now()}`,
      name: customDocName.trim(),
      mandatory: customDocMandatory,
      maxSize: customDocSize,
      allowedTypes: [".pdf", ".jpg", ".png"],
      needVerification: true,
      visibleToEmployee: true,
    };
    setDraft((current) => ({
      ...current,
      documents: [...(current.documents || []), newDoc],
    }));
    setCustomDocName("");
  };

  const removeDocumentRule = (id: string) => {
    setDraft((current) => ({
      ...current,
      documents: (current.documents || []).filter((d) => d.id !== id),
    }));
  };

  // Forms management
  const addFormRule = () => {
    if (!customFormName.trim()) return;
    setDraft((current) => ({
      ...current,
      forms: [
        ...(current.forms || []),
        {
          id: `form-${Date.now()}`,
          name: customFormName.trim(),
          required: true,
        },
      ],
    }));
    setCustomFormName("");
  };

  const toggleFormRequired = (id: string) => {
    setDraft((current) => ({
      ...current,
      forms: (current.forms || []).map((f) =>
        f.id === id ? { ...f, required: !f.required } : f,
      ),
    }));
  };

  const removeFormRule = (id: string) => {
    setDraft((current) => ({
      ...current,
      forms: (current.forms || []).filter((f) => f.id !== id),
    }));
  };

  // Training management
  const addTrainingRule = () => {
    if (!customTrainingName.trim()) return;
    setDraft((current) => ({
      ...current,
      training: [
        ...(current.training || []),
        {
          id: `train-${Date.now()}`,
          name: customTrainingName.trim(),
          required: true,
        },
      ],
    }));
    setCustomTrainingName("");
  };

  const removeTrainingRule = (id: string) => {
    setDraft((current) => ({
      ...current,
      training: (current.training || []).filter((t) => t.id !== id),
    }));
  };

  // Policies management
  const addPolicyRule = () => {
    if (!customPolicyName.trim()) return;
    setDraft((current) => ({
      ...current,
      policies: [
        ...(current.policies || []),
        {
          id: `policy-${Date.now()}`,
          name: customPolicyName.trim(),
          required: true,
        },
      ],
    }));
    setCustomPolicyName("");
  };

  const removePolicyRule = (id: string) => {
    setDraft((current) => ({
      ...current,
      policies: (current.policies || []).filter((p) => p.id !== id),
    }));
  };

  const submitTemplate = (status: "draft" | "active") => {
    if (!draft.name.trim() || !draft.dept) {
      showToast(
        "Template details required",
        "error",
        "Enter a template name and select a department.",
      );
      return;
    }
    const companyTasksCount = (draft.sections || []).reduce(
      (sum, sec) => sum + sec.tasks.length,
      0,
    );
    const docTasksCount = (draft.documents || []).length;
    const formTasksCount = (draft.forms || []).length;
    const trainingTasksCount = (draft.training || []).length;
    const totalTasksCount =
      companyTasksCount + docTasksCount + formTasksCount + trainingTasksCount;

    saveTemplate({
      ...draft,
      status,
      phases: (draft.sections || []).length,
      tasks: totalTasksCount,
    });
    props.setShowTemplateEditor(false);
  };

  return (
    <>
      {/* Templates Slider Panel */}
      <AnimatePresence>
        {props.showTemplatesPanel && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
            onClick={() => props.setShowTemplatesPanel(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="absolute right-0 top-0 h-full w-full max-w-[480px] overflow-y-auto border-l border-border bg-card p-6 shadow-2xl flex flex-col"
              onClick={(event) => event.stopPropagation()}
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
            >
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Layers className="text-[#00B87C]" />
                  <h2 className="text-lg font-black text-foreground">
                    Onboarding Templates
                  </h2>
                </div>
                <button
                  onClick={() => props.setShowTemplatesPanel(false)}
                  className="p-2 hover:bg-muted rounded-xl transition-all"
                >
                  <X size={18} />
                </button>
              </div>

              <button
                onClick={() => {
                  props.setEditingTemplate(null);
                  props.setShowTemplateEditor(true);
                  props.setShowTemplatesPanel(false);
                }}
                className="mb-6 w-full rounded-xl bg-[#00B87C] py-3.5 text-xs font-black uppercase tracking-wider text-white hover:opacity-90 shadow-md transition-all cursor-pointer"
              >
                + Create Template
              </button>

              <div className="flex-1 space-y-4">
                {templates.length === 0 ? (
                  <div className="rounded-3xl border-2 border-dashed border-border p-8 text-center flex flex-col items-center justify-center min-h-[250px]">
                    <FileText
                      size={36}
                      className="text-muted-foreground mb-4"
                    />
                    <h3 className="font-bold text-foreground">
                      No Onboarding Templates Found
                    </h3>
                    <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                      Create your first onboarding template to begin assigning
                      onboarding workflows.
                    </p>
                  </div>
                ) : (
                  templates.map((template) => (
                    <div
                      key={template.id}
                      className="p-5 rounded-2xl border border-border bg-card/60 space-y-3 shadow-sm hover:border-[#00B87C] transition-all"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <strong className="text-[14px] font-extrabold text-foreground">
                            {template.name}
                          </strong>
                          <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mt-0.5">
                            Code: {template.code}
                          </p>
                        </div>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border ${
                            template.status === "active"
                              ? "bg-[#E8F8F0] text-[#00B87C] border-[#00B87C]/20"
                              : "bg-muted text-muted-foreground border-border"
                          }`}
                        >
                          {template.status}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-[11px] font-bold text-muted-foreground">
                        <span>{template.dept}</span>
                        <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
                        <span>v{template.version || 1}</span>
                        <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
                        <span>{template.tasks} tasks</span>
                      </div>

                      <div className="pt-2 border-t border-border flex gap-3">
                        <button
                          className="text-[11px] font-black uppercase tracking-wider text-[#00B87C] hover:underline"
                          onClick={() => {
                            props.setEditingTemplate(template.id);
                            props.setShowTemplateEditor(true);
                            props.setShowTemplatesPanel(false);
                          }}
                        >
                          Edit
                        </button>
                        <button
                          className="text-[11px] font-black uppercase tracking-wider text-muted-foreground hover:underline"
                          onClick={() => {
                            // Call duplicates
                          }}
                        >
                          Duplicate
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Template Editor Modal */}
      <AnimatePresence>
        {props.showTemplateEditor && (
          <motion.div
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/55 backdrop-blur-sm p-4"
            onClick={() => props.setShowTemplateEditor(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-[36px] bg-card border border-border shadow-2xl flex flex-col"
              onClick={(event) => event.stopPropagation()}
              initial={{ scale: 0.97, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.97, y: 15 }}
            >
              {/* Header */}
              <div className="px-8 py-6 border-b border-border flex justify-between items-center shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#00B87C]/10 flex items-center justify-center">
                    <Sparkles className="text-[#00B87C]" size={20} />
                  </div>
                  <div>
                    <h2 className="text-[18px] font-black text-foreground tracking-tight">
                      {editingTemplate ? "Edit" : "Create"} Onboarding Template
                    </h2>
                    <p className="text-[11px] font-bold text-muted-foreground">
                      Configure assignments and checklists dynamically for
                      employees
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => props.setShowTemplateEditor(false)}
                  className="p-2 hover:bg-muted rounded-xl transition-all"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Tab Header */}
              <div className="px-8 border-b border-border bg-muted/5 flex gap-2 shrink-0">
                {(
                  [
                    { key: "info", label: "1. Scope & Rules", icon: Settings },
                    {
                      key: "candidate",
                      label: "2. Candidate Process",
                      icon: FileCheck,
                    },
                    {
                      key: "company",
                      label: "3. Company Process",
                      icon: Layers,
                    },
                  ] as const
                ).map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
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

              {/* Body Content */}
              <div className="flex-1 overflow-y-auto p-8 space-y-6">
                {/* ─── TAB 1: INFO & SCOPE ─── */}
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
                          placeholder="e.g. Engineering Onboarding Default"
                          className="w-full rounded-xl border border-border bg-background px-4 py-3 text-xs font-bold outline-none focus:ring-2 focus:ring-[#00B87C]/20 focus:border-[#00B87C] transition-all"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-black text-muted-foreground uppercase tracking-wider block mb-1.5">
                          Template Code
                        </label>
                        <input
                          value={draft.code}
                          disabled
                          placeholder="Auto-generated code"
                          className="w-full rounded-xl border border-border bg-muted/20 px-4 py-3 text-xs font-bold outline-none text-muted-foreground cursor-not-allowed"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                      <div>
                        <label className="text-[10px] font-black text-muted-foreground uppercase tracking-wider block mb-1.5">
                          Department Scope *
                        </label>
                        <select
                          value={draft.dept}
                          onChange={(e) =>
                            setDraft({ ...draft, dept: e.target.value })
                          }
                          className="w-full rounded-xl border border-border bg-background px-4 py-3 text-xs font-bold outline-none focus:ring-2 focus:ring-[#00B87C]/20 focus:border-[#00B87C] transition-all"
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
                          Designation Scope (Optional)
                        </label>
                        <input
                          value={draft.designation || ""}
                          onChange={(e) =>
                            setDraft({ ...draft, designation: e.target.value })
                          }
                          placeholder="e.g. Software Engineer"
                          className="w-full rounded-xl border border-border bg-background px-4 py-3 text-xs font-bold outline-none focus:ring-2 focus:ring-[#00B87C]/20 focus:border-[#00B87C] transition-all"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-black text-muted-foreground uppercase tracking-wider block mb-1.5">
                          Employment Type
                        </label>
                        <select
                          value={draft.employmentType || "Full-time"}
                          onChange={(e) =>
                            setDraft({
                              ...draft,
                              employmentType: e.target.value,
                            })
                          }
                          className="w-full rounded-xl border border-border bg-background px-4 py-3 text-xs font-bold outline-none focus:ring-2 focus:ring-[#00B87C]/20 focus:border-[#00B87C] transition-all"
                        >
                          <option value="Full-time">Full-time</option>
                          <option value="Part-time">Part-time</option>
                          <option value="Contract">Contract</option>
                          <option value="Intern">Intern</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="text-[10px] font-black text-muted-foreground uppercase tracking-wider block mb-1.5">
                          Branch / Location
                        </label>
                        <input
                          value={draft.branch || ""}
                          onChange={(e) =>
                            setDraft({ ...draft, branch: e.target.value })
                          }
                          placeholder="e.g. Headquarters"
                          className="w-full rounded-xl border border-border bg-background px-4 py-3 text-xs font-bold outline-none focus:ring-2 focus:ring-[#00B87C]/20 focus:border-[#00B87C] transition-all"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-black text-muted-foreground uppercase tracking-wider block mb-1.5">
                          Effective Dates (From - To)
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="date"
                            value={draft.effectiveFrom || ""}
                            onChange={(e) =>
                              setDraft({
                                ...draft,
                                effectiveFrom: e.target.value,
                              })
                            }
                            className="w-1/2 rounded-xl border border-border bg-background px-3 py-2 text-xs font-bold outline-none focus:border-[#00B87C]"
                          />
                          <input
                            type="date"
                            value={draft.effectiveTo || ""}
                            onChange={(e) =>
                              setDraft({
                                ...draft,
                                effectiveTo: e.target.value,
                              })
                            }
                            className="w-1/2 rounded-xl border border-border bg-background px-3 py-2 text-xs font-bold outline-none focus:border-[#00B87C]"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-black text-muted-foreground uppercase tracking-wider block mb-1.5">
                        Description
                      </label>
                      <textarea
                        value={draft.description || ""}
                        onChange={(e) =>
                          setDraft({ ...draft, description: e.target.value })
                        }
                        placeholder="Provide details about this template's workflow scope..."
                        rows={3}
                        className="w-full rounded-xl border border-border bg-background px-4 py-3 text-xs font-medium outline-none focus:border-[#00B87C] resize-none"
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
                            If enabled, new employees in this department who
                            don't match any custom filters will automatically
                            receive this template.
                          </p>
                        </div>
                      </label>
                    </div>
                  </div>
                )}

                {/* ─── TAB 2: CANDIDATE PROCESS ─── */}
                {activeTab === "candidate" && (
                  <div className="space-y-6">
                    {/* Required Documents Setup */}
                    <div>
                      <h4 className="text-[11px] font-black text-[#00B87C] uppercase tracking-wider mb-3 pb-1.5 border-b border-[#00B87C]/20">
                        Required Documents Checklist
                      </h4>
                      <div className="space-y-2 mb-4">
                        {(draft.documents || []).map((doc, idx) => (
                          <div
                            key={doc.id || idx}
                            className="flex items-center justify-between p-3.5 bg-muted/20 border rounded-2xl"
                          >
                            <div>
                              <strong className="text-xs text-foreground">
                                {doc.name}
                              </strong>
                              <p className="text-[10px] text-muted-foreground font-semibold">
                                {doc.mandatory ? "Mandatory" : "Optional"} · Max
                                Size: {doc.maxSize}MB · Verification: Required
                              </p>
                            </div>
                            <button
                              onClick={() => removeDocumentRule(doc.id)}
                              className="p-1.5 hover:bg-red-500/10 text-red-500 rounded-lg transition-all"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        ))}
                      </div>

                      {/* Add custom doc inline form */}
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-muted/10 p-4 rounded-2xl border">
                        <div className="col-span-1 md:col-span-2">
                          <input
                            value={customDocName}
                            onChange={(e) => setCustomDocName(e.target.value)}
                            placeholder="Add custom required document (e.g. Degree Certificate)..."
                            className="w-full rounded-xl border border-border bg-card px-3 py-2 text-xs font-bold outline-none"
                          />
                        </div>
                        <div>
                          <select
                            value={customDocSize}
                            onChange={(e) =>
                              setCustomDocSize(Number(e.target.value))
                            }
                            className="w-full rounded-xl border border-border bg-card px-3 py-2 text-xs font-bold outline-none"
                          >
                            <option value={2}>Max 2MB</option>
                            <option value={5}>Max 5MB</option>
                            <option value={10}>Max 10MB</option>
                          </select>
                        </div>
                        <button
                          type="button"
                          onClick={addDocumentRule}
                          className="w-full bg-[#00B87C] text-white py-2 text-xs font-black uppercase rounded-xl"
                        >
                          Add Doc
                        </button>
                      </div>
                    </div>

                    {/* Forms Selection */}
                    <div>
                      <h4 className="text-[11px] font-black text-[#00B87C] uppercase tracking-wider mb-3 pb-1.5 border-b border-[#00B87C]/20">
                        Required Forms / Agreements
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                        {(draft.forms || []).map((form) => (
                          <div
                            key={form.id}
                            className="flex items-center justify-between p-3 border rounded-xl bg-card"
                          >
                            <span className="text-xs font-bold text-foreground">
                              {form.name}
                            </span>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => toggleFormRequired(form.id)}
                                className={`px-2 py-0.5 text-[9px] font-black uppercase tracking-wider rounded border ${
                                  form.required
                                    ? "bg-emerald-50 text-[#00B87C] border-[#00B87C]/20"
                                    : "bg-muted text-muted-foreground border-border"
                                }`}
                              >
                                {form.required ? "Required" : "Optional"}
                              </button>
                              <button
                                onClick={() => removeFormRule(form.id)}
                                className="text-red-500 hover:bg-red-500/10 p-1 rounded-lg"
                              >
                                <X size={12} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <input
                          value={customFormName}
                          onChange={(e) => setCustomFormName(e.target.value)}
                          placeholder="Add new digital agreement (e.g. Code of Ethics)..."
                          className="flex-1 rounded-xl border border-border bg-background px-3 py-2 text-xs font-bold outline-none"
                        />
                        <button
                          onClick={addFormRule}
                          className="bg-[#00B87C] text-white px-4 text-xs font-bold uppercase tracking-wider rounded-xl"
                        >
                          Add Form
                        </button>
                      </div>
                    </div>

                    {/* Training & Policies */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-[11px] font-black text-[#00B87C] uppercase tracking-wider mb-3 pb-1.5 border-b border-[#00B87C]/20">
                          Mandatory Training Courses
                        </h4>
                        <div className="space-y-2 mb-3">
                          {(draft.training || []).map((t) => (
                            <div
                              key={t.id}
                              className="flex items-center justify-between p-2.5 border rounded-xl bg-card"
                            >
                              <span className="text-xs font-bold text-foreground">
                                {t.name}
                              </span>
                              <button
                                onClick={() => removeTrainingRule(t.id)}
                                className="text-red-500"
                              >
                                <X size={12} />
                              </button>
                            </div>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <input
                            value={customTrainingName}
                            onChange={(e) =>
                              setCustomTrainingName(e.target.value)
                            }
                            placeholder="Add training course..."
                            className="flex-1 rounded-xl border border-border bg-background px-2.5 py-2 text-xs font-bold outline-none"
                          />
                          <button
                            onClick={addTrainingRule}
                            className="bg-[#00B87C] text-white px-3 text-xs font-bold rounded-xl"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-[11px] font-black text-[#00B87C] uppercase tracking-wider mb-3 pb-1.5 border-b border-[#00B87C]/20">
                          Company Policies to Review
                        </h4>
                        <div className="space-y-2 mb-3">
                          {(draft.policies || []).map((p) => (
                            <div
                              key={p.id}
                              className="flex items-center justify-between p-2.5 border rounded-xl bg-card"
                            >
                              <span className="text-xs font-bold text-foreground">
                                {p.name}
                              </span>
                              <button
                                onClick={() => removePolicyRule(p.id)}
                                className="text-red-500"
                              >
                                <X size={12} />
                              </button>
                            </div>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <input
                            value={customPolicyName}
                            onChange={(e) =>
                              setCustomPolicyName(e.target.value)
                            }
                            placeholder="Add policy document..."
                            className="flex-1 rounded-xl border border-border bg-background px-2.5 py-2 text-xs font-bold outline-none"
                          />
                          <button
                            onClick={addPolicyRule}
                            className="bg-[#00B87C] text-white px-3 text-xs font-bold rounded-xl"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ─── TAB 3: COMPANY PROCESS ─── */}
                {activeTab === "company" && (
                  <div className="space-y-6">
                    <p className="text-xs text-muted-foreground leading-normal font-semibold">
                      Configure the tasks for this onboarding template. These
                      tasks will automatically route to the assigned role,
                      department, or user once onboarding is launched.
                    </p>

                    <div className="space-y-4">
                      {/* Flat Task List */}
                      <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                        {(() => {
                          const companySection = draft.sections?.[0];
                          if (
                            !companySection ||
                            companySection.tasks.length === 0
                          ) {
                            return (
                              <div className="p-8 text-center border border-dashed rounded-3xl bg-muted/5">
                                <p className="text-xs text-muted-foreground italic font-semibold">
                                  No company tasks added yet. Use the form below
                                  to add a task.
                                </p>
                              </div>
                            );
                          }
                          return companySection.tasks.map((task) => (
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
                                    {task.priority} Priority
                                  </span>
                                  {task.mandatory && (
                                    <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-emerald-50 text-[#00B87C] border border-[#00B87C]/15">
                                      Mandatory
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
                                    Assigned To:{" "}
                                    <span className="text-foreground">
                                      {task.owner}
                                    </span>
                                  </span>
                                  <span>
                                    Due In:{" "}
                                    <span className="text-foreground">
                                      {task.dueDays} Days
                                    </span>
                                  </span>
                                </div>
                              </div>
                              <button
                                onClick={() =>
                                  removeCompanyTask(companySection.id, task.id)
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
                            Add Company Process Task
                          </h5>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-wider block mb-1.5">
                              Task Name *
                            </label>
                            <input
                              value={customTaskName}
                              onChange={(e) =>
                                setCustomTaskName(e.target.value)
                              }
                              placeholder="e.g. Create Corporate Slack Account"
                              className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-xs font-bold outline-none focus:border-[#00B87C]"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-wider block mb-1.5">
                              Assigned To *
                            </label>
                            <select
                              value={customTaskOwner}
                              onChange={(e) =>
                                setCustomTaskOwner(e.target.value)
                              }
                              className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-xs font-bold outline-none focus:border-[#00B87C]"
                            >
                              {taskOwners.map((owner) => (
                                <option key={owner} value={owner}>
                                  {owner}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="text-[10px] font-black text-muted-foreground uppercase tracking-wider block mb-1.5">
                            Description / Instructions (Optional)
                          </label>
                          <textarea
                            value={customTaskDesc}
                            onChange={(e) => setCustomTaskDesc(e.target.value)}
                            placeholder="Add clear instructions, notes, or dependencies for this task..."
                            rows={2}
                            className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-xs font-medium outline-none focus:border-[#00B87C] resize-none"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
                          <div>
                            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-wider block mb-1.5">
                              Due In (Days)
                            </label>
                            <input
                              type="number"
                              value={customTaskDue}
                              onChange={(e) =>
                                setCustomTaskDue(Number(e.target.value))
                              }
                              min={1}
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
                                setCustomTaskPriority(e.target.value)
                              }
                              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs font-bold outline-none focus:border-[#00B87C]"
                            >
                              <option value="Low">Low Priority</option>
                              <option value="Medium">Medium Priority</option>
                              <option value="High">High Priority</option>
                            </select>
                          </div>
                          <div className="flex items-center justify-between gap-4 h-9">
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={customTaskMandatory}
                                onChange={(e) =>
                                  setCustomTaskMandatory(e.target.checked)
                                }
                                className="h-4 w-4 rounded border border-border text-[#00B87C] focus:ring-[#00B87C]"
                              />
                              <span className="text-xs font-black text-foreground uppercase tracking-wider">
                                Mandatory
                              </span>
                            </label>
                            <button
                              type="button"
                              onClick={() =>
                                addCompanyTask(
                                  draft.sections?.[0]?.id || "company-process",
                                )
                              }
                              className="bg-[#00B87C] text-white px-5 py-2 text-xs font-black uppercase rounded-xl shadow-sm hover:opacity-90 transition-all shrink-0"
                            >
                              Add Task
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="px-8 py-5 border-t border-border flex items-center justify-between shrink-0 bg-muted/5">
                <button
                  onClick={() => props.setShowTemplateEditor(false)}
                  className="px-5 py-2.5 rounded-xl border border-border text-[11px] font-black text-foreground uppercase tracking-widest hover:bg-muted"
                >
                  Cancel
                </button>
                <div className="flex gap-3">
                  <button
                    onClick={() => submitTemplate("draft")}
                    className="px-5 py-2.5 rounded-xl border border-border text-foreground text-[11px] font-black uppercase tracking-widest hover:bg-muted"
                  >
                    Save Draft
                  </button>
                  <button
                    onClick={() => submitTemplate("active")}
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
    </>
  );
}
