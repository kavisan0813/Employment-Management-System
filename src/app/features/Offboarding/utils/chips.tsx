import React from "react";
import { ExitType, ClearanceStatus } from "../types/offboarding.types";
import { Check, Clock, X, User, Laptop, Briefcase, ShieldCheck } from "lucide-react";

export const getClearanceIcon = (iconName: string): React.ElementType => {
  switch (iconName) {
    case "User":
      return User;
    case "Laptop":
      return Laptop;
    case "Briefcase":
      return Briefcase;
    case "ShieldCheck":
      return ShieldCheck;
    default:
      return User;
  }
};

export const exitTypeChip = (type: ExitType) => {
  switch (type) {
    case "Resignation":
      return (
        <span className="inline-flex px-2 py-0.5 rounded-full bg-[#DCFCE7] text-[#00B87C] border border-[#A7F3D0] text-[11px] font-semibold uppercase tracking-wider">
          Resignation
        </span>
      );
    case "Termination":
      return (
        <span className="inline-flex px-2 py-0.5 rounded-full bg-[#FEE2E2] text-[#DC2626] border border-[#FECACA] text-[11px] font-semibold uppercase tracking-wider">
          Termination
        </span>
      );
    case "Retirement":
      return (
        <span className="inline-flex px-2 py-0.5 rounded-full bg-[#CCFBF1] text-[#0D9488] border border-[#99F6E4] text-[11px] font-semibold uppercase tracking-wider">
          Retirement
        </span>
      );
    default:
      return (
        <span className="inline-flex px-2 py-0.5 rounded-full bg-[#EDE9FE] text-[#7C3AED] border border-[#DDD6FE] text-[11px] font-semibold uppercase tracking-wider">
          {type}
        </span>
      );
  }
};

export const clearanceChip = (status: ClearanceStatus) => {
  switch (status) {
    case "cleared":
      return (
        <span className="text-[11px] font-black text-[#00B87C] flex items-center gap-1">
          <Check size={12} /> Done
        </span>
      );
    case "pending":
      return (
        <span className="text-[11px] font-black text-amber-500 flex items-center gap-1">
          <Clock size={12} /> Pending
        </span>
      );
    case "not_started":
      return (
        <span className="text-[11px] font-semibold text-[#94A3B8] flex items-center gap-1">
          <X size={12} /> Not Started
        </span>
      );
  }
};
