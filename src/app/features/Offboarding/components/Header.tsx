import React from "react";
import { LogOut, Download, Plus } from "lucide-react";

interface HeaderProps {
  onExport: () => void;
  onInitiateExit: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onExport, onInitiateExit }) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
      <div className="flex items-center gap-4">
        <div className="w-11 h-11 rounded-[10px] bg-[#FEE2E2] dark:bg-red-500/10 flex items-center justify-center shadow-inner border border-red-100 dark:border-red-500/20">
          <LogOut size={22} className="text-[#EF4444]" />
        </div>
        <div>
          <h1 className="text-[26px] font-black text-foreground tracking-tight">
            Offboarding / Exit Management
          </h1>
          <p className="text-[13px] font-semibold text-muted-foreground">
            Manage employee exits, clearances and F&F settlements
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={onExport}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border text-foreground font-black text-[12px] uppercase tracking-widest hover:bg-muted/50 transition-all"
        >
          <Download size={18} />
          Export
        </button>
        <button
          onClick={onInitiateExit}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#00B87C] text-white font-black text-[12px] uppercase tracking-widest hover:opacity-90 transition-all shadow-lg shadow-[#00B87C]/20"
        >
          <Plus size={18} />
          Initiate Exit
        </button>
      </div>
    </div>
  );
};
