import React from "react";
import { ExitType } from "../types/offboarding.types";
import {
  User,
  Laptop,
  Briefcase,
  ShieldCheck,
} from "lucide-react";

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
