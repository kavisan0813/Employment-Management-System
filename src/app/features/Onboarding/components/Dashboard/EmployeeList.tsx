import { Search, Calendar } from "lucide-react";
import type { NewHire } from "../../types/onboarding.types";
import { formatDate } from "../../utils/helpers";
import { ProgressRing } from "../shared/ProgressRing";
import { StatusDot } from "../shared/StatusBadge";
import { DepartmentBadge } from "../shared/DepartmentBadge";

interface EmployeeListProps {
  filteredList: NewHire[];
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
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
    <div className="w-full bg-card border border-border rounded-2xl shadow-sm overflow-hidden h-[calc(100vh-340px)] flex flex-col transition-all duration-300">
      <div className="px-5 py-4 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.2em]">
            Active Onboardings
          </h3>
          <span className="text-[11px] font-bold text-muted-foreground">
            {filteredList.length} employees
          </span>
        </div>
        <div className="relative mb-3 flex gap-4">
          <div className="relative flex-1">
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
      </div>
      <div className="flex-1 overflow-y-auto">
        <table className="w-full text-left border-collapse table-fixed">
          <thead className="bg-muted/30 sticky top-0 z-10">
            <tr>
              <th className="w-[25%] px-5 py-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider border-b border-border">Employee</th>
              <th className="w-[15%] px-5 py-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider border-b border-border">Joining Date</th>
              <th className="w-[15%] px-5 py-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider border-b border-border">Department</th>
              <th className="w-[20%] px-5 py-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider border-b border-border">Designation</th>
              <th className="w-[15%] px-5 py-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider border-b border-border">Reporting Manager</th>
              <th className="w-[10%] px-5 py-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider border-b border-border text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredList.map((nh) => (
              <tr
                key={nh.id}
                onClick={() => setSelectedId(nh.id)}
                className="cursor-pointer transition-all hover:bg-[#00B87C]/[0.04] group"
              >
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[11px] font-black shrink-0"
                      style={{ backgroundColor: nh.avatarColor }}
                    >
                      {nh.initials}
                    </div>
                    <div className="min-w-0">
                      <p className="text-[13px] font-bold text-foreground truncate group-hover:text-[#00B87C] transition-colors">{nh.name}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Calendar size={12} className="shrink-0" />
                    <span className="text-[12px] font-medium truncate">{formatDate(nh.joiningDate)}</span>
                  </div>
                </td>
                <td className="px-5 py-3">
                  <DepartmentBadge dept={nh.dept} color={nh.deptColor} />
                </td>
                <td className="px-5 py-3">
                  <p className="text-[12px] font-medium text-foreground truncate">{nh.role}</p>
                </td>
                <td className="px-5 py-3">
                  <p className="text-[12px] font-medium text-muted-foreground truncate">{nh.manager}</p>
                </td>
                <td className="px-5 py-3 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <ProgressRing percent={nh.progress} size={28} stroke={3} />
                    <StatusDot status={nh.status} />
                  </div>
                </td>
              </tr>
            ))}
            {filteredList.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-12 text-center">
                  <p className="text-[13px] text-muted-foreground">No employees found matching the criteria.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
