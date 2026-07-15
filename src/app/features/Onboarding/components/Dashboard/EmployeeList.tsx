import { Search, Calendar } from "lucide-react";
import type { NewHire } from "../../types/onboarding.types";
import { formatDate } from "../../utils/helpers";
import { ProgressRing } from "../shared/ProgressRing";
import { StatusDot } from "../shared/StatusBadge";
import { DepartmentBadge } from "../shared/DepartmentBadge";

interface EmployeeListProps {
  filteredList: NewHire[];
  selectedId: string;
  setSelectedId: (id: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  filterPill: "all" | "week" | "month";
  setFilterPill: (f: "all" | "week" | "month") => void;
}

export function EmployeeList({
  filteredList, selectedId, setSelectedId,
  searchQuery, setSearchQuery, filterPill, setFilterPill,
}: EmployeeListProps) {
  return (
    <div className="w-full lg:w-[35%] bg-card border border-border rounded-2xl shadow-sm overflow-hidden h-[calc(100vh-340px)] flex flex-col">
      <div className="px-5 py-4 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.2em]">
            Active Onboardings
          </h3>
          <span className="text-[11px] font-bold text-muted-foreground">
            {filteredList.length} employees
          </span>
        </div>
        <div className="relative mb-3">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search new hires..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-muted/50 text-foreground text-[12px] font-bold outline-none focus:ring-2 focus:ring-[#00B87C]/20 transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          {([
            { key: "all" as const, label: "All" },
            { key: "week" as const, label: "This Week" },
            { key: "month" as const, label: "This Month" },
          ]).map((p) => (
            <button
              key={p.key}
              onClick={() => setFilterPill(p.key)}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold uppercase tracking-wider transition-all ${filterPill === p.key ? "bg-[#00B87C] text-white" : "bg-muted/50 text-muted-foreground hover:text-foreground"}`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto divide-y divide-border">
        {filteredList.map((nh) => (
          <div
            key={nh.id}
            onClick={() => setSelectedId(nh.id)}
            className={`flex items-center gap-3 px-5 py-[14px] cursor-pointer transition-all hover:bg-[#00B87C]/[0.08] ${selectedId === nh.id ? "bg-[#00B87C]/[0.08] border-l-[3px] border-[#00B87C]" : "border-l-[3px] border-transparent"}`}
          >
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-white text-[11px] font-black shrink-0"
              style={{ backgroundColor: nh.avatarColor }}
            >
              {nh.initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-bold text-foreground truncate">{nh.name}</p>
              <p className="text-[11px] text-muted-foreground truncate">{nh.role}</p>
              <div className="flex items-center gap-2 mt-1">
                <Calendar size={10} className="text-muted-foreground shrink-0" />
                <span className="text-[11px] text-muted-foreground">Joining: {formatDate(nh.joiningDate)}</span>
                <DepartmentBadge dept={nh.dept} color={nh.deptColor} />
              </div>
            </div>
            <div className="flex flex-col items-center gap-1 shrink-0">
              <ProgressRing percent={nh.progress} size={32} stroke={3} />
              <StatusDot status={nh.status} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
