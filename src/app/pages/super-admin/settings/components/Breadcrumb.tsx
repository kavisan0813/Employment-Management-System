import React from "react";
import { ChevronRight } from "lucide-react";

export function Breadcrumb({ active }: { active: string }) {
  return (
    <div className="flex items-center gap-2 mb-6 text-[12px] font-bold">
      <span className="text-muted-foreground/60">Settings</span>
      <ChevronRight size={12} className="text-muted-foreground/40" />
      <span className="text-primary">{active}</span>
    </div>
  );
}
