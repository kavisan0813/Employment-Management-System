import { AnimatePresence, motion } from "motion/react";
import { FileText, X, Plus, Edit3 } from "lucide-react";
import { TEMPLATES } from "../constants/templates";
import { DepartmentBadge } from "../components/shared/DepartmentBadge";
import { showToast } from "../../../components/workflow/ToastNotification";

interface TemplateEditorModalProps {
  /* Slide panel */
  showTemplatesPanel: boolean;
  setShowTemplatesPanel: (v: boolean) => void;
  /* Editor modal */
  showTemplateEditor: boolean;
  setShowTemplateEditor: (v: boolean) => void;
  editingTemplate: string | null;
  setEditingTemplate: (v: string | null) => void;
}

export function TemplateEditorModal({
  showTemplatesPanel, setShowTemplatesPanel,
  showTemplateEditor, setShowTemplateEditor,
  editingTemplate, setEditingTemplate,
}: TemplateEditorModalProps) {
  return (
    <>
      {/* ─── TEMPLATES SLIDE PANEL ─── */}
      <AnimatePresence>
        {showTemplatesPanel && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 z-50"
            onClick={() => setShowTemplatesPanel(false)}
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              onClick={(e) => e.stopPropagation()}
              className="absolute right-0 top-0 bottom-0 w-full max-w-[480px] bg-card border-l border-border shadow-2xl overflow-y-auto"
            >
              <div className="px-6 py-5 border-b border-border flex items-center justify-between sticky top-0 bg-card z-10">
                <div className="flex items-center gap-3">
                  <FileText size={20} className="text-[#00B87C]" />
                  <h2 className="text-lg font-black text-foreground">Onboarding Templates</h2>
                </div>
                <button onClick={() => setShowTemplatesPanel(false)} className="w-10 h-10 rounded-xl border border-border flex items-center justify-center hover:bg-muted transition-all">
                  <X size={18} />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <button
                  onClick={() => { setShowTemplatesPanel(false); setShowTemplateEditor(true); setEditingTemplate(null); }}
                  className="w-full py-3 rounded-xl bg-[#00B87C] text-white text-[12px] font-semibold uppercase tracking-wider hover:opacity-90 transition-all shadow-md"
                >
                  + Create Template
                </button>
                {TEMPLATES.map((tpl) => (
                  <div key={tpl.id} className="p-5 bg-card border border-border rounded-2xl shadow-sm hover:-translate-y-[2px] hover:border-[#00B87C] hover:shadow-[0_0_15px_rgba(0,184,124,0.3)] transition-all">
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="text-[14px] font-bold text-foreground">{tpl.name}</h4>
                      <div className="flex items-center gap-2">
                        <DepartmentBadge dept={tpl.dept} color={tpl.deptColor} />
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${tpl.avgDays !== "—" ? "bg-[#00B87C]/10 text-[#00B87C] border border-[#00B87C]/20" : "bg-muted/50 text-muted-foreground border border-border"}`}>
                          {tpl.avgDays !== "—" ? "Active" : "Draft"}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-[11px] font-bold text-muted-foreground mb-3">
                      <span>{tpl.phases} phases</span>
                      <span className="w-1 h-1 rounded-full bg-muted-foreground/40" />
                      <span>{tpl.tasks} tasks</span>
                      <span className="w-1 h-1 rounded-full bg-muted-foreground/40" />
                      Avg {tpl.avgDays}
                    </div>
                    <p className="text-[11px] font-bold text-muted-foreground mb-3">Used for {tpl.usageCount} employees</p>
                    <button
                      onClick={() => { setEditingTemplate(tpl.id); setShowTemplateEditor(true); setShowTemplatesPanel(false); }}
                      className="w-full py-2.5 rounded-xl border border-border text-[11px] font-black text-foreground uppercase tracking-widest hover:bg-muted/50 transition-all"
                    >
                      Edit Template
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── TEMPLATE EDITOR MODAL ─── */}
      <AnimatePresence>
        {showTemplateEditor && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
            onClick={() => setShowTemplateEditor(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-card border border-border rounded-[32px] w-full max-w-2xl max-h-[85vh] overflow-hidden shadow-2xl"
            >
              <div className="px-8 py-6 border-b border-border flex items-center justify-between">
                <h2 className="text-lg font-black text-foreground">{editingTemplate ? "Edit Template" : "Create New Template"}</h2>
                <button onClick={() => setShowTemplateEditor(false)} className="w-10 h-10 rounded-xl border border-border flex items-center justify-center hover:bg-muted transition-all">
                  <X size={18} />
                </button>
              </div>
              <div className="px-8 py-6 space-y-5 overflow-y-auto max-h-[60vh]">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">Template Name</label>
                    <input type="text" placeholder="e.g. Engineering Onboarding" className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-[12px] font-bold outline-none focus:ring-2 focus:ring-[#00B87C]/20 transition-all" />
                  </div>
                  <div>
                    <label className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">Department</label>
                    <select className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-[12px] font-bold outline-none">
                      <option>All Departments</option><option>Engineering</option><option>Sales</option><option>Finance</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">Status</label>
                    <select className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-[12px] font-bold outline-none">
                      <option>Draft</option><option>Published</option>
                    </select>
                  </div>
                </div>
                <div>
                  <h4 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-3">Phases & Tasks</h4>
                  <div className="space-y-3">
                    {["Pre-Joining", "Day 1", "Week 1", "Month 1", "Completion"].map((phase, i) => (
                      <div key={i} className="p-4 rounded-2xl border border-border bg-muted/10">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-[12px] font-black text-foreground">{phase}</span>
                            <span className="text-[11px] text-muted-foreground">({i === 0 ? 6 : i === 1 ? 7 : i === 2 ? 8 : i === 3 ? 7 : 0} tasks)</span>
                          </div>
                          <button className="text-[11px] font-semibold text-[#EF4444] uppercase tracking-wider hover:underline">Remove</button>
                        </div>
                        <div className="space-y-1.5">
                          {["Welcome email", "Offer letter", "Background check"].slice(0, 3).map((t, j) => (
                            <div key={j} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-card border border-border">
                              <Edit3 size={12} className="text-muted-foreground shrink-0" />
                              <span className="text-[11px] font-bold text-foreground flex-1">{t}</span>
                              <select className="text-[9px] border-none bg-transparent font-bold text-muted-foreground outline-none">
                                <option>HR</option><option>IT</option><option>Manager</option><option>Finance</option>
                              </select>
                            </div>
                          ))}
                        </div>
                        <button className="mt-2 text-[11px] font-semibold text-[#00B87C] uppercase tracking-wider flex items-center gap-1 hover:underline">
                          <Plus size={12} /> Add Task
                        </button>
                      </div>
                    ))}
                    <button className="w-full py-3 rounded-2xl border-2 border-dashed border-border text-[11px] font-semibold text-muted-foreground uppercase tracking-wider hover:border-[#00B87C]/50 hover:text-[#00B87C] transition-all">
                      <Plus size={14} className="inline mr-1" /> Add Phase
                    </button>
                  </div>
                </div>
              </div>
              <div className="px-8 py-4 border-t border-border flex items-center justify-between">
                <button onClick={() => setShowTemplateEditor(false)} className="px-5 py-2.5 rounded-xl border border-border text-[11px] font-semibold uppercase tracking-wider hover:bg-muted transition-all">Cancel</button>
                <div className="flex items-center gap-3">
                  <button onClick={() => { showToast("Saved as Draft", "success"); setShowTemplateEditor(false); }} className="px-5 py-2.5 rounded-xl border border-border text-[11px] font-semibold uppercase tracking-wider hover:bg-muted transition-all">Save as Draft</button>
                  <button onClick={() => { showToast("Template Published", "success", "Onboarding template has been published."); setShowTemplateEditor(false); }} className="px-5 py-2.5 rounded-xl bg-[#00B87C] text-white text-[11px] font-semibold uppercase tracking-wider hover:opacity-90 transition-all shadow-md">Publish</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
