import React from "react";

export function Label({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div className="w-1.5 h-5 bg-primary rounded-full shrink-0" />
      <h3 className="text-[12px] font-semibold text-[#94A3B8] uppercase tracking-wider">
        {children}
      </h3>
    </div>
  );
}
