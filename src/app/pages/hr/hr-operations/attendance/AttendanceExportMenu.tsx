import React, { useState, useRef, useEffect } from "react";
import { Download, FileText, FileSpreadsheet, Printer, ChevronDown, Check } from "lucide-react";
import { AttendanceRecord } from "../../../../context/AttendanceContext";
import { usePermissions } from "../../../../shared/permission-engine/PermissionContext";
import { P } from "../../../../shared/permission-engine/permissions";

interface AttendanceExportMenuProps {
  records: AttendanceRecord[];
  monthName: string;
  year: number;
  selectedDept: string;
  selectedEmpName: string;
  selectedLocation: string;
  selectedStatus: string;
  selectedShift: string;
}

export function AttendanceExportMenu({
  records,
  monthName,
  year,
  selectedDept,
  selectedEmpName,
  selectedLocation,
  selectedStatus,
  selectedShift,
}: AttendanceExportMenuProps) {
  const { hasPermissionKey } = usePermissions();
  const canExport = hasPermissionKey(P.ATTENDANCE_VIEW) || hasPermissionKey(P.ATTENDANCE_FULL);

  const [isOpen, setIsOpen] = useState(false);
  const [exporting, setExporting] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getFilteredHeadersAndRows = () => {
    const headers = [
      "ID",
      "Employee Name",
      "Employee ID",
      "Department",
      "Date",
      "Status",
      "Check In",
      "Check Out",
      "Working Hours",
      "Notes",
    ];

    const rows = records.map((r) => [
      r.id,
      `"${r.employeeName.replace(/"/g, '""')}"`,
      r.employeeId,
      `"${r.department.replace(/"/g, '""')}"`,
      r.date,
      r.status,
      r.checkIn || "--:--",
      r.checkOut || "--:--",
      r.hours || "0h 00m",
      `"${(r.notes || "").replace(/"/g, '""')}"`,
    ]);

    return { headers, rows };
  };

  const handleExportCSV = () => {
    setExporting("CSV");
    setTimeout(() => {
      const { headers, rows } = getFilteredHeadersAndRows();
      const csvContent =
        "data:text/csv;charset=utf-8," +
        [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute(
        "download",
        `Attendance_Report_${monthName}_${year}_${selectedDept.replace(/\s+/g, "_")}.csv`
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setExporting(null);
      setIsOpen(false);
    }, 400);
  };

  const handleExportExcel = () => {
    setExporting("Excel");
    setTimeout(() => {
      const { headers, rows } = getFilteredHeadersAndRows();
      // Tab-delimited format for native Excel opening
      const excelContent =
        "\uFEFF" +
        [headers.join("\t"), ...rows.map((e) => e.join("\t").replace(/"/g, ""))].join("\n");

      const blob = new Blob([excelContent], { type: "application/vnd.ms-excel;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `Attendance_Report_${monthName}_${year}_${selectedDept.replace(/\s+/g, "_")}.xls`
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setExporting(null);
      setIsOpen(false);
    }, 400);
  };

  const handleExportPDF = () => {
    setExporting("PDF");
    setTimeout(() => {
      const printWindow = window.open("", "_blank");
      if (!printWindow) return;

      const { headers, rows } = getFilteredHeadersAndRows();

      const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Attendance Report - ${monthName} ${year}</title>
          <style>
            body { font-family: system-ui, -apple-system, sans-serif; padding: 24px; color: #1e293b; }
            h1 { font-size: 20px; font-weight: 800; margin-bottom: 4px; color: #0f172a; }
            .meta { font-size: 12px; color: #64748b; margin-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; font-size: 11px; margin-top: 16px; }
            th { background: #f8fafc; text-align: left; padding: 8px 10px; border-bottom: 2px solid #e2e8f0; font-weight: 700; text-transform: uppercase; color: #475569; }
            td { padding: 8px 10px; border-bottom: 1px solid #e2e8f0; }
            tr:nth-child(even) { background: #f8fafc; }
            .badge { display: inline-block; padding: 2px 6px; border-radius: 4px; font-weight: 700; font-size: 10px; }
            .badge-present { background: #d1fae5; color: #047857; }
            .badge-absent { background: #ffe4e6; color: #be123c; }
            .badge-late { background: #fef3c7; color: #b45309; }
            .badge-leave { background: #f3e8ff; color: #6b21a8; }
            @media print {
              body { padding: 0; }
              @page { size: landscape; margin: 1cm; }
            }
          </style>
        </head>
        <body>
          <h1>NexusHR EMS — Attendance Management Report</h1>
          <div class="meta">
            Period: <strong>${monthName} ${year}</strong> |
            Department: <strong>${selectedDept}</strong> |
            Employee: <strong>${selectedEmpName}</strong> |
            Location: <strong>${selectedLocation}</strong> |
            Status: <strong>${selectedStatus}</strong> |
            Shift: <strong>${selectedShift}</strong> |
            Total Records: <strong>${records.length}</strong>
          </div>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Employee</th>
                <th>Dept</th>
                <th>Status</th>
                <th>Punch In</th>
                <th>Punch Out</th>
                <th>Hours</th>
              </tr>
            </thead>
            <tbody>
              ${records
                .map(
                  (r) => `
                <tr>
                  <td>${r.date}</td>
                  <td><strong>${r.employeeName}</strong> (${r.employeeId})</td>
                  <td>${r.department}</td>
                  <td><span class="badge badge-${r.status.toLowerCase()}">${r.status}</span></td>
                  <td>${r.checkIn || "--:--"}</td>
                  <td>${r.checkOut || "--:--"}</td>
                  <td><strong>${r.hours}</strong></td>
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>
          <script>
            window.onload = () => { window.print(); };
          </script>
        </body>
        </html>
      `;

      printWindow.document.write(html);
      printWindow.document.close();
      setExporting(null);
      setIsOpen(false);
    }, 400);
  };

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3.5 h-10 rounded-xl border bg-card text-foreground hover:bg-neutral-50 dark:hover:bg-zinc-800 shadow-sm transition-all text-xs font-bold active:scale-95"
        style={{ borderColor: "var(--border)" }}
      >
        <Download size={15} className="text-[#00B87C]" />
        <span>Export</span>
        <ChevronDown size={14} className={`text-muted-foreground transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div
          className="absolute right-0 top-[calc(100%+8px)] w-48 rounded-2xl border bg-card shadow-2xl z-[2200] py-1.5 overflow-hidden animate-in fade-in zoom-in-95 duration-150"
          style={{ borderColor: "var(--border)" }}
        >
          <div className="px-3 py-1.5 border-b mb-1" style={{ borderColor: "var(--border)" }}>
            <p className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">Export Active Filter</p>
            <p className="text-[11px] font-bold text-foreground truncate">{records.length} records selected</p>
          </div>

          <button
            onClick={handleExportCSV}
            disabled={exporting !== null}
            className="w-full flex items-center justify-between px-3.5 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-neutral-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <FileText size={15} className="text-emerald-600 dark:text-emerald-400" />
              <span>Export CSV</span>
            </div>
            {exporting === "CSV" && <span className="text-[10px] text-emerald-500 font-bold animate-pulse">Saving...</span>}
          </button>

          <button
            onClick={handleExportExcel}
            disabled={exporting !== null}
            className="w-full flex items-center justify-between px-3.5 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-neutral-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <FileSpreadsheet size={15} className="text-blue-600 dark:text-blue-400" />
              <span>Export Excel (.xls)</span>
            </div>
            {exporting === "Excel" && <span className="text-[10px] text-blue-500 font-bold animate-pulse">Saving...</span>}
          </button>

          <button
            onClick={handleExportPDF}
            disabled={exporting !== null}
            className="w-full flex items-center justify-between px-3.5 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-neutral-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <Printer size={15} className="text-purple-600 dark:text-purple-400" />
              <span>Print / Save PDF</span>
            </div>
            {exporting === "PDF" && <span className="text-[10px] text-purple-500 font-bold animate-pulse">Preparing...</span>}
          </button>
        </div>
      )}
    </div>
  );
}
