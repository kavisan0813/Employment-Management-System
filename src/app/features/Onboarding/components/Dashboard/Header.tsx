import { useNavigate } from "react-router";
import { ArrowLeft, UserPlus, FileText, Plus } from "lucide-react";

interface HeaderProps {
  onOpenTemplates: () => void;
  onNewOnboarding: () => void;
}

export function Header({ onOpenTemplates, onNewOnboarding }: HeaderProps) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-xl border border-border flex items-center justify-center hover:bg-muted transition-all shrink-0"
        >
          <ArrowLeft size={20} className="text-muted-foreground" />
        </button>
        <div className="w-11 h-11 rounded-xl bg-[#DCFCE7] flex items-center justify-center border border-[#00B87C]/20">
          <UserPlus size={24} className="text-[#00B87C]" />
        </div>
        <div>
          <h1 className="text-[26px] font-black text-foreground tracking-tight">
            Onboarding
          </h1>
          <p className="text-[13px] font-semibold text-muted-foreground">
            Manage new hire onboarding journeys
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenTemplates}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border text-foreground font-black text-[12px] uppercase tracking-widest hover:bg-muted/50 transition-all"
        >
          <FileText size={16} /> Templates
        </button>
        <button
          onClick={onNewOnboarding}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#00B87C] text-white font-black text-[12px] uppercase tracking-widest hover:opacity-90 transition-all shadow-lg shadow-[#00B87C]/20"
        >
          <Plus size={16} /> New Onboarding
        </button>
      </div>
    </div>
  );
}
