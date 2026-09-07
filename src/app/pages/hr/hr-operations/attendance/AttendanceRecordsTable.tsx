import React, { useState, useMemo, useEffect } from "react";
import { ArrowDownUp, ChevronLeft, ChevronRight, MoreVertical, Edit2, FileEdit, Trash2, MapPin } from "lucide-react";
import { AttendanceRecord } from "../../../../context/AttendanceContext";
import { employees } from "../../../../data/mockData";
import { AttendanceCorrectionModal } from "./AttendanceCorrectionModal";

interface AttendanceRecordsTableProps {
  records: AttendanceRecord[];
  canManageAttendance: boolean;
  onOpenEdit: (rec: AttendanceRecord) => void;
  onOpenDelete: (id: string) => void;
}

export function AttendanceRecordsTable({
  records,
  canManageAttendance,
  onOpenEdit,
  onOpenDelete,
}: AttendanceRecordsTableProps) {
  const [sortField, setSortField] = useState<string>("date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [activeRowMenu, setActiveRowMenu] = useState<string | null>(null);
  const [correctionRecord, setCorrectionRecord] = useState<AttendanceRecord | null>(null);

  const itemsPerPage = 8;

  // Close row menu on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (!(e.target as HTMLElement).closest(".relative")) {
        setActiveRowMenu(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const [prevRecords, setPrevRecords] = useState(records);
  if (records !== prevRecords) {
    setPrevRecords(records);
    setCurrentPage(1);
  }

  const sortedRecords = useMemo(() => {
    const list = [...records];
    list.sort((a, b) => {
      let aVal: any = a[sortField as keyof AttendanceRecord] || "";
      let bVal: any = b[sortField as keyof AttendanceRecord] || "";

      if (sortField === "date") {
        aVal = new Date(a.date).getTime();
        bVal = new Date(b.date).getTime();
      } else if (sortField === "hours") {
        aVal = parseFloat((a.hours || "0").replace("h", ".").replace("m", ""));
        bVal = parseFloat((b.hours || "0").replace("h", ".").replace("m", ""));
      }

      if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
    return list;
  }, [records, sortField, sortDirection]);

  const totalPages = Math.max(1, Math.ceil(sortedRecords.length / itemsPerPage));
  const currentRecords = sortedRecords.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Smart Pagination helper to prevent infinite page button overflow
  const paginationRange = useMemo(() => {
    const total = totalPages;
    const current = currentPage;
    if (total <= 7) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }
    if (current <= 4) {
      return [1, 2, 3, 4, 5, "...", total];
    }
    if (current >= total - 3) {
      return [1, "...", total - 4, total - 3, total - 2, total - 1, total];
    }
    return [1, "...", current - 1, current, current + 1, "...", total];
  }, [totalPages, currentPage]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Present":
        return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";
      case "Absent":
        return "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20";
      case "Late":
        return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20";
      case "Leave":
        return "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20";
      case "Holiday":
        return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20";
      default:
        return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
    }
  };

  return (
    <div
      className="rounded-2xl border bg-card shadow-sm overflow-hidden flex flex-col"
      style={{ borderColor: "var(--border)" }}
    >
      {/* Table Header */}
      <div
        className="p-5 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-neutral-50/50 dark:bg-zinc-800/20"
        style={{ borderColor: "var(--border)" }}
      >
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-6 rounded-full bg-[#00B87C]" />
          <div>
            <h3 className="text-base font-extrabold text-foreground">Detailed Attendance Records</h3>
            <p className="text-[11px] font-semibold text-muted-foreground">
              Sortable log registry for audit, regularization, and payroll sync
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-muted-foreground">
            Total {sortedRecords.length} records
          </span>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto scrollbar-thin">
        <table className="w-full text-left border-collapse min-w-[1050px]">
          <thead>
            <tr className="bg-neutral-50 dark:bg-zinc-800/50">
              <th
                onClick={() => handleSort("employeeName")}
                className="cursor-pointer px-5 py-3 text-[11px] font-black uppercase tracking-wider text-muted-foreground border-b hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                style={{ borderColor: "var(--border)" }}
              >
                <div className="flex items-center gap-1.5">
                  <span>Employee</span>
                  <ArrowDownUp size={12} className={sortField === "employeeName" ? "text-[#00B87C]" : "opacity-40"} />
                </div>
              </th>

              <th
                onClick={() => handleSort("department")}
                className="cursor-pointer px-4 py-3 text-[11px] font-black uppercase tracking-wider text-muted-foreground border-b hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                style={{ borderColor: "var(--border)" }}
              >
                <div className="flex items-center gap-1.5">
                  <span>Department</span>
                  <ArrowDownUp size={12} className={sortField === "department" ? "text-[#00B87C]" : "opacity-40"} />
                </div>
              </th>

              <th
                onClick={() => handleSort("date")}
                className="cursor-pointer px-4 py-3 text-[11px] font-black uppercase tracking-wider text-muted-foreground border-b hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                style={{ borderColor: "var(--border)" }}
              >
                <div className="flex items-center gap-1.5">
                  <span>Date</span>
                  <ArrowDownUp size={12} className={sortField === "date" ? "text-[#00B87C]" : "opacity-40"} />
                </div>
              </th>

              <th
                onClick={() => handleSort("status")}
                className="cursor-pointer px-4 py-3 text-[11px] font-black uppercase tracking-wider text-muted-foreground border-b hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                style={{ borderColor: "var(--border)" }}
              >
                <div className="flex items-center gap-1.5">
                  <span>Status</span>
                  <ArrowDownUp size={12} className={sortField === "status" ? "text-[#00B87C]" : "opacity-40"} />
                </div>
              </th>

              <th className="px-4 py-3 text-[11px] font-black uppercase tracking-wider text-muted-foreground border-b" style={{ borderColor: "var(--border)" }}>
                Punch In
              </th>

              <th className="px-4 py-3 text-[11px] font-black uppercase tracking-wider text-muted-foreground border-b" style={{ borderColor: "var(--border)" }}>
                Punch Out
              </th>

              <th
                onClick={() => handleSort("hours")}
                className="cursor-pointer px-4 py-3 text-[11px] font-black uppercase tracking-wider text-muted-foreground border-b text-center hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                style={{ borderColor: "var(--border)" }}
              >
                <div className="flex items-center justify-center gap-1.5">
                  <span>Hours</span>
                  <ArrowDownUp size={12} className={sortField === "hours" ? "text-[#00B87C]" : "opacity-40"} />
                </div>
              </th>

              <th className="px-4 py-3 text-[11px] font-black uppercase tracking-wider text-muted-foreground border-b" style={{ borderColor: "var(--border)" }}>
                Location
              </th>

              <th className="px-5 py-3 text-[11px] font-black uppercase tracking-wider text-muted-foreground border-b text-right" style={{ borderColor: "var(--border)" }}>
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {currentRecords.map((log) => {
              const emp = employees.find((e) => e.id === log.employeeId) || employees[0];
              return (
                <tr
                  key={log.id}
                  className="group hover:bg-neutral-50/80 dark:hover:bg-zinc-800/40 transition-colors border-b last:border-0"
                  style={{ borderColor: "var(--border)" }}
                >
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <img src={log.employeeAvatar || emp.avatar} alt="" className="w-8 h-8 rounded-full object-cover border" />
                      <div>
                        <p className="text-xs font-bold text-foreground">{log.employeeName}</p>
                        <p className="text-[9px] font-bold text-muted-foreground uppercase">{log.employeeId}</p>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-3 text-xs font-bold text-muted-foreground">
                    {log.department}
                  </td>

                  <td className="px-4 py-3 text-xs font-extrabold text-foreground">
                    {log.date}
                  </td>

                  <td className="px-4 py-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${getStatusBadge(log.status)}`}>
                      {log.status}
                    </span>
                  </td>

                  <td className="px-4 py-3 text-xs font-bold text-foreground">
                    {log.checkIn || "--:--"}
                  </td>

                  <td className="px-4 py-3 text-xs font-bold text-foreground">
                    {log.checkOut || "--:--"}
                  </td>

                  <td className="px-4 py-3 text-xs font-black text-[#00B87C] text-center">
                    {log.hours || "0h 00m"}
                  </td>

                  <td className="px-4 py-3 text-xs font-bold text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <MapPin size={11} className="text-muted-foreground" />
                      {log.location || "HQ Office"}
                    </span>
                  </td>

                  <td className="px-5 py-3 text-right relative">
                    <div className="flex items-center justify-end">
                      <div className="relative">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveRowMenu(activeRowMenu === log.id ? null : log.id);
                          }}
                          className="p-1.5 rounded-lg text-muted-foreground hover:bg-neutral-100 dark:hover:bg-zinc-800 transition-colors"
                          title="Actions Menu"
                        >
                          <MoreVertical size={16} />
                        </button>

                        {activeRowMenu === log.id && (
                          <div
                            className="absolute right-0 top-full mt-1 w-40 rounded-xl border bg-card shadow-xl z-[2200] py-1 text-left animate-in fade-in zoom-in-95 duration-100"
                            style={{ borderColor: "var(--border)" }}
                          >
                            <button
                              type="button"
                              onClick={() => {
                                setActiveRowMenu(null);
                                setCorrectionRecord(log);
                              }}
                              className="w-full flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-foreground hover:bg-neutral-100 dark:hover:bg-zinc-800"
                            >
                              <FileEdit size={13} className="text-amber-500" />
                              <span>Correct Record</span>
                            </button>

                            {canManageAttendance && (
                              <>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setActiveRowMenu(null);
                                    onOpenEdit(log);
                                  }}
                                  className="w-full flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-foreground hover:bg-neutral-100 dark:hover:bg-zinc-800"
                                >
                                  <Edit2 size={13} className="text-emerald-600" />
                                  <span>Edit Record</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => {
                                    setActiveRowMenu(null);
                                    onOpenDelete(log.id);
                                  }}
                                  className="w-full flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20"
                                >
                                  <Trash2 size={13} />
                                  <span>Delete Record</span>
                                </button>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Clean Pagination Footer */}
      <div
        className="p-4 border-t flex flex-col sm:flex-row items-center justify-between gap-3 bg-neutral-50/50 dark:bg-zinc-800/20"
        style={{ borderColor: "var(--border)" }}
      >
        <p className="text-[11px] font-bold text-muted-foreground whitespace-nowrap">
          Showing <span className="text-foreground">{(currentPage - 1) * itemsPerPage + 1}</span> to{" "}
          <span className="text-foreground">{Math.min(currentPage * itemsPerPage, sortedRecords.length)}</span> of{" "}
          <span className="text-foreground">{sortedRecords.length}</span> records
        </p>

        <div className="flex items-center gap-1.5 flex-wrap justify-end">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-1.5 rounded-xl border text-muted-foreground hover:bg-neutral-100 dark:hover:bg-zinc-800 disabled:opacity-40 transition-colors"
            style={{ borderColor: "var(--border)" }}
            title="Previous Page"
          >
            <ChevronLeft size={14} />
          </button>

          {paginationRange.map((page, idx) => {
            if (page === "...") {
              return (
                <span key={`ellipsis-${idx}`} className="px-1 text-xs font-bold text-muted-foreground select-none">
                  ...
                </span>
              );
            }
            const pageNum = page as number;
            return (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`w-7 h-7 rounded-xl text-xs font-bold transition-all flex items-center justify-center ${
                  currentPage === pageNum
                    ? "bg-[#00B87C] text-white shadow-sm"
                    : "border text-muted-foreground hover:bg-neutral-100 dark:hover:bg-zinc-800"
                }`}
                style={{ borderColor: currentPage === pageNum ? "#00B87C" : "var(--border)" }}
              >
                {pageNum}
              </button>
            );
          })}

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-1.5 rounded-xl border text-muted-foreground hover:bg-neutral-100 dark:hover:bg-zinc-800 disabled:opacity-40 transition-colors"
            style={{ borderColor: "var(--border)" }}
            title="Next Page"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* Attendance Correction Modal */}
      {correctionRecord && (
        <AttendanceCorrectionModal
          record={correctionRecord}
          onClose={() => setCorrectionRecord(null)}
          onSaveCorrection={(rec, details) => {
            console.log("Correction requested for", rec.id, details);
          }}
        />
      )}
    </div>
  );
}
