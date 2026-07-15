import { Plus, Send, Download, CheckCircle2 } from "lucide-react";

interface ActionToolbarProps {
  inlineTaskOpen: boolean;
  setInlineTaskOpen: (open: boolean) => void;
  setShowReminderModal: (show: boolean) => void;
  handleDownloadReport: () => void;
  handleMarkPhaseComplete: () => void;
}

export function ActionToolbar({
  inlineTaskOpen, setInlineTaskOpen,
  setShowReminderModal, handleDownloadReport, handleMarkPhaseComplete,
}: ActionToolbarProps) {
  return (
    <div className="sticky bottom-0 px-6 py-4 border-t border-border bg-card/95 backdrop-blur-sm flex flex-wrap items-center justify-between gap-3">
      <button
        onClick={() => setInlineTaskOpen(!inlineTaskOpen)}
        className="text-[12px] font-black text-[#00B87C] uppercase tracking-widest flex items-center gap-1.5 hover:underline"
      >
        <Plus size={14} /> Add Task
      </button>
      <div className="flex items-center gap-3">
        <button
          onClick={() => setShowReminderModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border text-[11px] font-black text-foreground uppercase tracking-widest hover:bg-muted/50 transition-all"
        >
          <Send size={14} /> Send Reminder
        </button>
        <button
          onClick={handleDownloadReport}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border text-[11px] font-black text-foreground uppercase tracking-widest hover:bg-muted/50 transition-all"
        >
          <Download size={14} /> Download Report
        </button>
        <button
          onClick={handleMarkPhaseComplete}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#00B87C] text-white text-[11px] font-semibold uppercase tracking-wider hover:opacity-90 transition-all shadow-md"
        >
          <CheckCircle2 size={14} /> Mark Phase Complete
        </button>
      </div>
    </div>
  );
}
