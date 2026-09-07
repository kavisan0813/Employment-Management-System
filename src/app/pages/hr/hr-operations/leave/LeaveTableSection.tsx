import React, { useState, useEffect, useRef } from "react";
import {
  FileText, ArrowUpDown, ChevronUp, ChevronDown, Check, X, Clock,
  MoreVertical, Eye, CheckCircle2, AlertTriangle, ShieldAlert
} from "lucide-react";
import { LeaveRequest, SortField, SortDirection } from "./types";

interface LeaveTableSectionProps {
  requests: LeaveRequest[];
  selectedIds: string[];
  onToggleSelectAll: () => void;
  onToggleSelectRow: (id: string) => void;
  onSelectRequest: (req: LeaveRequest) => void;
  onApprove: (id: string, stage: "manager" | "hr", remarks: string) => void;
  onReject: (id: string, stage: "manager" | "hr", remarks: string) => void;
  canApprove: boolean;
}

export function LeaveTableSection({
  requests,
  selectedIds,
  onToggleSelectAll,
  onToggleSelectRow,
  onSelectRequest,
  onApprove,
  onReject,
  canApprove,
}: LeaveTableSectionProps) {
  const [sortField, setSortField] = useState<SortField>("from");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Header checkbox reference for native indeterminate state
  const headerCheckboxRef = useRef<HTMLInputElement>(null);

  // Visible filtered IDs
  const visibleIds = requests.map((r) => r.id);
  const selectedIdSet = new Set(selectedIds);
  const selectedVisibleCount = visibleIds.filter((id) => selectedIdSet.has(id)).length;
  const isAllSelected = visibleIds.length > 0 && selectedVisibleCount === visibleIds.length;
  const isIndeterminate = selectedVisibleCount > 0 && selectedVisibleCount < visibleIds.length;

  // Set native DOM checkbox indeterminate property
  useEffect(() => {
    if (headerCheckboxRef.current) {
      headerCheckboxRef.current.indeterminate = isIndeterminate;
    }
  }, [isIndeterminate]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown size={12} className="opacity-40" />;
    }
    return sortDirection === "asc" ? (
      <ChevronUp size={13} className="text-[#00B87C] font-black" />
    ) : (
      <ChevronDown size={13} className="text-[#00B87C] font-black" />
    );
  };

  // Sort filtered requests based on active sortField and sortDirection BEFORE pagination
  const sortedRequests = [...requests].sort((a, b) => {
    let valA: any = a[sortField] || "";
    let valB: any = b[sortField] || "";

    if (sortField === "days") {
      valA = a.days;
      valB = b.days;
    } else if (sortField === "from") {
      valA = a.from;
      valB = b.from;
    }

    if (valA < valB) return sortDirection === "asc" ? -1 : 1;
    if (valA > valB) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  const totalPages = Math.ceil(sortedRequests.length / itemsPerPage) || 1;
  const paginatedRequests = sortedRequests.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="bg-card border border-border rounded-3xl p-5 md:p-6 shadow-sm space-y-4">
      {/* HEADER & BULK ACTION CONTROLS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-black text-foreground tracking-tight m-0">
            Detailed Leave Records
          </h3>
          <p className="text-xs font-semibold text-muted-foreground">
            Showing {paginatedRequests.length} of {requests.length} records matching active filters
          </p>
        </div>

        {selectedIds.length > 0 && (
          <div className="flex items-center gap-3 bg-[#00B87C]/10 border border-[#00B87C]/30 px-4 py-2 rounded-2xl">
            <span className="text-xs font-bold text-[#00B87C]">
              {selectedIds.length} item{selectedIds.length === 1 ? "" : "s"} selected
            </span>
            {canApprove && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    selectedIds.forEach((id) => {
                      const target = requests.find((r) => r.id === id);
                      if (target && target.status === "Pending") {
                        onApprove(id, "manager", "Bulk stage approved");
                      }
                    })
                  }
                  className="px-3 py-1 bg-[#00B87C] hover:bg-[#009966] text-white text-xs font-bold rounded-lg transition-all cursor-pointer shadow-xs"
                >
                  Bulk Approve
                </button>
                <button
                  onClick={() =>
                    selectedIds.forEach((id) => {
                      const target = requests.find((r) => r.id === id);
                      if (target && target.status === "Pending") {
                        onReject(id, "manager", "Bulk stage rejected");
                      }
                    })
                  }
                  className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg transition-all cursor-pointer shadow-xs"
                >
                  Bulk Reject
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* TABLE CONTAINER */}
      <div className="overflow-x-auto border border-border rounded-2xl">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-secondary/60 text-muted-foreground font-black text-[11px] uppercase tracking-widest border-b border-border">
              <th className="py-3 px-3 w-10 text-center">
                <input
                  ref={headerCheckboxRef}
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={onToggleSelectAll}
                  className="rounded border-border text-[#00B87C] focus:ring-[#00B87C] cursor-pointer"
                  title="Select all visible records"
                />
              </th>

              {/* Sortable: Employee */}
              <th
                onClick={() => handleSort("employee")}
                className="py-3 px-3 cursor-pointer hover:text-foreground transition-colors select-none"
              >
                <div className="flex items-center gap-1.5">
                  Employee
                  {renderSortIcon("employee")}
                </div>
              </th>

              {/* Sortable: Department */}
              <th
                onClick={() => handleSort("department")}
                className="py-3 px-3 cursor-pointer hover:text-foreground transition-colors select-none"
              >
                <div className="flex items-center gap-1.5">
                  Department
                  {renderSortIcon("department")}
                </div>
              </th>

              {/* Sortable: Team */}
              <th
                onClick={() => handleSort("team")}
                className="py-3 px-3 cursor-pointer hover:text-foreground transition-colors select-none"
              >
                <div className="flex items-center gap-1.5">
                  Team
                  {renderSortIcon("team")}
                </div>
              </th>

              {/* Sortable: Leave Type */}
              <th
                onClick={() => handleSort("type")}
                className="py-3 px-3 cursor-pointer hover:text-foreground transition-colors select-none"
              >
                <div className="flex items-center gap-1.5">
                  Leave Type
                  {renderSortIcon("type")}
                </div>
              </th>

              {/* Sortable: Start Date / Timeline */}
              <th
                onClick={() => handleSort("from")}
                className="py-3 px-3 cursor-pointer hover:text-foreground transition-colors select-none"
              >
                <div className="flex items-center gap-1.5">
                  Timeline
                  {renderSortIcon("from")}
                </div>
              </th>

              {/* Sortable: Days */}
              <th
                onClick={() => handleSort("days")}
                className="py-3 px-3 text-center cursor-pointer hover:text-foreground transition-colors select-none"
              >
                <div className="flex items-center justify-center gap-1.5">
                  Days
                  {renderSortIcon("days")}
                </div>
              </th>

              {/* Sortable: Status */}
              <th
                onClick={() => handleSort("status")}
                className="py-3 px-3 text-center cursor-pointer hover:text-foreground transition-colors select-none"
              >
                <div className="flex items-center justify-center gap-1.5">
                  Status
                  {renderSortIcon("status")}
                </div>
              </th>

              <th className="py-3 px-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {paginatedRequests.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-12 text-center text-muted-foreground font-semibold">
                  No leave records match the active filter criteria.
                </td>
              </tr>
            ) : (
              paginatedRequests.map((r) => {
                const isSelected = selectedIdSet.has(r.id);
                return (
                  <tr
                    key={r.id}
                    className={`hover:bg-[#00B87C]/[0.04] transition-colors font-medium ${
                      isSelected ? "bg-[#00B87C]/[0.08]" : ""
                    }`}
                  >
                    <td className="py-3 px-3 text-center">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => onToggleSelectRow(r.id)}
                        className="rounded border-border text-[#00B87C] focus:ring-[#00B87C] cursor-pointer"
                      />
                    </td>

                    {/* Employee */}
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs shrink-0 shadow-xs"
                          style={{ background: r.avatarColor || "#00B87C" }}
                        >
                          {r.initials}
                        </div>
                        <div>
                          <div className="font-bold text-foreground flex items-center gap-1.5">
                            {r.employee}
                            {r.criticalRole && (
                              <span className="w-2 h-2 rounded-full bg-rose-500" title="Critical Role" />
                            )}
                          </div>
                          <span className="text-[10px] text-muted-foreground">{r.id}</span>
                        </div>
                      </div>
                    </td>

                    {/* Department */}
                    <td className="py-3 px-3 font-semibold text-foreground">{r.department}</td>

                    {/* Team */}
                    <td className="py-3 px-3 font-semibold text-muted-foreground">{r.team}</td>

                    {/* Leave Type */}
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-secondary text-foreground">
                        {r.type}
                      </span>
                    </td>

                    {/* Timeline */}
                    <td className="py-3 px-3 font-bold text-foreground">
                      {r.from} – {r.to}
                    </td>

                    {/* Days */}
                    <td className="py-3 px-3 text-center font-black text-foreground">{r.days}d</td>

                    {/* Status */}
                    <td className="py-3 px-3 text-center">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                          r.status === "Approved"
                            ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                            : r.status === "Rejected"
                            ? "bg-rose-500/10 text-rose-600 border border-rose-500/20"
                            : "bg-amber-500/10 text-amber-600 border border-amber-500/20"
                        }`}
                      >
                        {r.status === "Pending" && r.currentStageRole
                          ? `Pending (${r.currentStageRole})`
                          : r.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => onSelectRequest(r)}
                          className="px-2.5 py-1 rounded-lg border border-border hover:bg-secondary text-xs font-bold text-foreground transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <Eye size={12} /> View Details
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div className="flex items-center justify-between pt-2">
        <span className="text-xs font-semibold text-muted-foreground">
          Page {currentPage} of {totalPages}
        </span>
        <div className="flex items-center gap-2">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            className="px-3 py-1 rounded-lg border border-border text-xs font-bold hover:bg-secondary disabled:opacity-40 cursor-pointer"
          >
            Previous
          </button>
          <button
            disabled={currentPage >= totalPages}
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            className="px-3 py-1 rounded-lg border border-border text-xs font-bold hover:bg-secondary disabled:opacity-40 cursor-pointer"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
