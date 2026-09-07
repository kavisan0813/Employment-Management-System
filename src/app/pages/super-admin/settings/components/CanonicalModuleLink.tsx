import React from "react";
import { useNavigate } from "react-router";
import * as Icons from "lucide-react";

interface CanonicalModuleLinkProps {
  title: string;
  description: string;
  iconName: string;
  buttonLabel: string;
  targetPath: string;
}

export const CanonicalModuleLink: React.FC<CanonicalModuleLinkProps> = ({
  title,
  description,
  iconName,
  buttonLabel,
  targetPath,
}) => {
  const navigate = useNavigate();
  const IconComp = Icons[iconName as keyof typeof Icons] || Icons.ExternalLink;
  const Icon = IconComp as React.ComponentType<{ size?: number; className?: string }>;

  return (
    <div className="p-6 rounded-2xl border bg-card border-border shadow-xs hover:border-[#00B87C]/30 transition-all space-y-4">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-[#00B87C]/10 text-[#00B87C] flex items-center justify-center flex-shrink-0">
          <Icon size={24} />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-foreground">{title}</h3>
            <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-[#00B87C]/10 text-[#00B87C] uppercase tracking-wider">
              Canonical Module
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1 leading-relaxed max-w-xl">
            {description}
          </p>
        </div>
      </div>
      <div className="flex justify-end pt-2">
        <button
          type="button"
          onClick={() => navigate(targetPath)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#00B87C] hover:bg-[#00B87C]/90 text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-xs active:scale-[0.98]"
        >
          <span>{buttonLabel}</span>
          <Icons.ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
};
