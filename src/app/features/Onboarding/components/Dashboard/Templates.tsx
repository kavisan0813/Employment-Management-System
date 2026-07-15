import { MoreVertical, Edit3, Copy, Trash2 } from "lucide-react";
import { motion } from "motion/react";
import type { Template } from "../../types/onboarding.types";
import { TEMPLATES } from "../../constants/templates";
import { DepartmentBadge } from "../shared/DepartmentBadge";

interface TemplatesProps {
  showTemplateMenu: string | null;
  setShowTemplateMenu: (id: string | null) => void;
  setEditingTemplate: (id: string | null) => void;
  setShowTemplateEditor: (show: boolean) => void;
  handleDuplicateTemplate: (id: string) => void;
  handleDeleteTemplate: (id: string) => void;
}

export function Templates({
  showTemplateMenu, setShowTemplateMenu,
  setEditingTemplate, setShowTemplateEditor,
  handleDuplicateTemplate, handleDeleteTemplate,
}: TemplatesProps) {
  return (
    <motion.div
      key="templates"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-card border border-border rounded-[32px] p-6 shadow-sm"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-[15px] font-black text-foreground tracking-tight uppercase">
          Onboarding Templates
        </h3>
        <button
          onClick={() => { setShowTemplateEditor(true); setEditingTemplate(null); }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#00B87C] text-white text-[11px] font-semibold uppercase tracking-wider hover:opacity-90 transition-all shadow-md"
        >
          + Create Template
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {TEMPLATES.map((tpl) => (
          <div
            key={tpl.id}
            className="relative p-5 bg-card border border-border rounded-2xl shadow-sm hover:-translate-y-[2px] hover:border-[#00B87C] hover:shadow-[0_0_15px_rgba(0,184,124,0.3)] transition-all"
          >
            <div className="flex items-start justify-between mb-3">
              <h4 className="text-[14px] font-bold text-foreground">{tpl.name}</h4>
              <div className="relative">
                <button
                  onClick={() => setShowTemplateMenu(showTemplateMenu === tpl.id ? null : tpl.id)}
                  className="p-1 hover:bg-muted rounded-lg transition-all"
                >
                  <MoreVertical size={16} className="text-muted-foreground" />
                </button>
                {showTemplateMenu === tpl.id && (
                  <div className="absolute right-0 top-8 w-40 bg-card border border-border rounded-xl shadow-xl z-20 overflow-hidden">
                    {[
                      { icon: Edit3, label: "Edit", action: () => { setEditingTemplate(tpl.id); setShowTemplateEditor(true); setShowTemplateMenu(null); } },
                      { icon: Copy, label: "Duplicate", action: () => handleDuplicateTemplate(tpl.id) },
                      { icon: Trash2, label: "Delete", action: () => handleDeleteTemplate(tpl.id) },
                    ].map((item, i) => (
                      <button
                        key={i}
                        onClick={item.action}
                        className="w-full text-left px-4 py-2.5 text-[12px] font-bold text-foreground hover:bg-muted flex items-center gap-2 transition-all"
                      >
                        <item.icon size={14} />
                        {item.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3 mb-3 text-[11px] font-bold text-muted-foreground">
              <span>{tpl.phases} phases</span>
              <span className="w-1 h-1 rounded-full bg-muted-foreground/40" />
              <span>{tpl.tasks} tasks</span>
              <span className="w-1 h-1 rounded-full bg-muted-foreground/40" />
              <span>Avg {tpl.avgDays}</span>
            </div>
            <div className="mb-3">
              <DepartmentBadge dept={tpl.dept} color={tpl.deptColor} />
            </div>
            <p className="text-[11px] font-bold text-muted-foreground mb-4">
              Used for {tpl.usageCount} employees
            </p>
            <button
              onClick={() => { setEditingTemplate(tpl.id); setShowTemplateEditor(true); }}
              className="w-full py-2 rounded-xl border border-border text-[11px] font-black text-foreground uppercase tracking-widest hover:bg-muted/50 transition-all"
            >
              Edit Template
            </button>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
