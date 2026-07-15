import React from "react";

interface InfoBarProps {
  activeExitsCount: number;
  pendingFFCount: number;
}

export const InfoBar: React.FC<InfoBarProps> = ({
  activeExitsCount,
  pendingFFCount,
}) => {
  return (
    <div className="bg-card border border-border rounded-2xl p-4 flex flex-wrap items-center gap-6 shadow-sm">
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-[#EF4444]" />
        <span className="text-[12px] font-bold text-foreground">
          {activeExitsCount} active exits in progress
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-amber-500" />
        <span className="text-[12px] font-bold text-foreground">
          {pendingFFCount} final settlements pending Finance clearance
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-teal-500" />
        <span className="text-[12px] font-bold text-foreground">
          1 exit completing this week — James Carter (Apr 10)
        </span>
      </div>
    </div>
  );
};
