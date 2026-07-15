import { useState } from "react";
import { useNavigate } from "react-router";
import { MoreVertical, ChevronDown, ChevronUp } from "lucide-react";
import { Employee } from "../types/employee.types";
import {
  HighlightText,
  statusConfig,
  deptColors,
} from "../utils/employee.utils";

interface EmployeeTableProps {
  paginated: Employee[];
  selectedRows: string[];
  hoveredRow: string | null;
  setHoveredRow: (id: string | null) => void;
  sortCol: string;
  sortDesc: boolean;
  onSort: (col: string) => void;
  toggleAllRows: () => void;
  toggleRowSelection: (id: string) => void;
  onEdit: (emp: Employee) => void;
  onConfirmDelete: (emp: Employee) => void;
  onDeactivate: (emp: Employee) => void;
  canEdit: (emp: Employee) => boolean;
  canDeactivate: (emp: Employee) => boolean;
  canDelete: (emp: Employee) => boolean;
  debouncedSearch: string;
}

const gridCols = "40px 2.5fr 1.5fr 1.2fr 1.2fr 1.5fr 1.2fr 1fr 1fr 40px";

export default function EmployeeTable({
  paginated,
  selectedRows,
  hoveredRow,
  setHoveredRow,
  sortCol,
  sortDesc,
  onSort,
  toggleAllRows,
  toggleRowSelection,
  onEdit,
  onConfirmDelete,
  onDeactivate,
  canEdit,
  canDeactivate,
  canDelete,
  debouncedSearch,
}: EmployeeTableProps) {
  const navigate = useNavigate();
  const [actionMenuRow, setActionMenuRow] = useState<string | null>(null);

  return (
    <div
      className="rounded-2xl overflow-x-auto shadow-sm"
      style={{
        backgroundColor: "var(--card)",
        border: "1px solid var(--border)",
      }}
    >
      <div
        style={{ minWidth: "1150px" }}
        onClick={() => setActionMenuRow(null)}
      >
        {/* Table Header */}
        <div
          className="grid items-center px-4 py-3 select-none"
          style={{
            backgroundColor: "var(--background)",
            borderBottom: "1px solid var(--border)",
            gridTemplateColumns: gridCols,
          }}
        >
          <div>
            <input
              type="checkbox"
              onChange={toggleAllRows}
              checked={
                selectedRows.length === paginated.length && paginated.length > 0
              }
              style={{
                accentColor: "var(--primary)",
                cursor: "pointer",
                width: "16px",
                height: "16px",
                borderRadius: "4px",
              }}
            />
          </div>
          {[
            { label: "Employee", key: "name" },
            { label: "Designation", key: "designation" },
            { label: "Department", key: "department" },
            { label: "Location", key: "location" },
            { label: "Email", key: "email" },
            { label: "Phone", key: "phone" },
            { label: "Status", key: "status" },
            { label: "Joined", key: "joinDate" },
          ].map((col) => (
            <div
              key={col.key}
              className="flex items-center gap-1 cursor-pointer hover:opacity-70 transition-opacity text-[11px] font-bold uppercase tracking-wider"
              style={{ color: "var(--muted-foreground)" }}
              onClick={() => onSort(col.key)}
            >
              {col.label}
              {sortCol === col.key &&
                (sortDesc ? (
                  <ChevronDown size={12} />
                ) : (
                  <ChevronUp size={12} />
                ))}
            </div>
          ))}
          <div
            className="text-[11px] font-bold uppercase tracking-wider text-right"
            style={{ color: "var(--muted-foreground)" }}
          >
            Actions
          </div>
        </div>

        {/* Table Rows */}
        {paginated.map((emp) => (
          <div
            key={emp.id}
            className="grid items-center px-4 transition-colors cursor-pointer"
            style={{
              height: "56px",
              borderBottom: "1px solid var(--border)",
              backgroundColor:
                hoveredRow === emp.id ? "var(--secondary)" : "transparent",
              gridTemplateColumns: gridCols,
            }}
            onMouseEnter={() => setHoveredRow(emp.id)}
            onMouseLeave={() => setHoveredRow(null)}
            onClick={() => navigate(`/employees/${emp.id}`)}
          >
            <div onClick={(e) => e.stopPropagation()}>
              <input
                type="checkbox"
                checked={selectedRows.includes(emp.id)}
                onChange={() => toggleRowSelection(emp.id)}
                style={{
                  accentColor: "var(--primary)",
                  cursor: "pointer",
                  width: "16px",
                  height: "16px",
                  borderRadius: "4px",
                }}
              />
            </div>
            {/* Avatar + Name + ID */}
            <div className="flex items-center gap-3 pr-2">
              <img
                src={emp.avatar || ""}
                className="w-9 h-9 rounded-full object-cover border"
                style={{ borderColor: "var(--border)" }}
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                  const fallback = document.createElement("div");
                  fallback.className =
                    "w-9 h-9 rounded-full flex items-center justify-center text-[12px] font-bold shrink-0";
                  fallback.style.backgroundColor = `${deptColors[emp.department] || "#6B7280"}20`;
                  fallback.style.color =
                    deptColors[emp.department] || "var(--foreground)";
                  fallback.textContent = emp.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2);
                  e.currentTarget.parentElement?.insertBefore(
                    fallback,
                    e.currentTarget,
                  );
                }}
              />
              <div className="min-w-0">
                <div
                  style={{
                    fontSize: "14px",
                    fontWeight: 700,
                    color: "var(--foreground)",
                    lineHeight: "1.2",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  <HighlightText text={emp.name} search={debouncedSearch} />
                </div>
                <div
                  style={{
                    fontSize: "12px",
                    color: "var(--muted-foreground)",
                  }}
                >
                  {emp.id}
                </div>
              </div>
            </div>
            {/* Designation */}
            <div
              style={{
                fontSize: "13px",
                color: "var(--foreground)",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                paddingRight: "8px",
              }}
              title={emp.designation}
            >
              <HighlightText text={emp.designation} search={debouncedSearch} />
            </div>
            {/* Department badge */}
            <div>
              <span
                className="px-2.5 py-1 rounded-full text-[11px] font-bold whitespace-nowrap"
                style={{
                  backgroundColor: `${deptColors[emp.department] || "#6B7280"}15`,
                  color: deptColors[emp.department] || "var(--foreground)",
                }}
              >
                {emp.department}
              </span>
            </div>
            {/* Location */}
            <div
              style={{
                fontSize: "13px",
                color: "var(--foreground)",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                paddingRight: "8px",
              }}
              title={emp.location}
            >
              {emp.location}
            </div>
            {/* Email */}
            <div
              style={{
                fontSize: "13px",
                color: "var(--muted-foreground)",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                paddingRight: "8px",
              }}
              title={emp.email}
            >
              {emp.email}
            </div>
            {/* Phone */}
            <div
              style={{
                fontSize: "13px",
                color: "var(--foreground)",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                paddingRight: "8px",
              }}
            >
              {emp.phone}
            </div>
            {/* Status */}
            <div>
              <span
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold w-fit whitespace-nowrap"
                style={{
                  backgroundColor: statusConfig[emp.status]?.bg,
                  color: statusConfig[emp.status]?.color,
                }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: statusConfig[emp.status]?.dot }}
                ></span>
                {emp.status}
              </span>
            </div>
            {/* Joined Date */}
            <div style={{ fontSize: "13px", color: "var(--foreground)" }}>
              {new Date(emp.joinDate).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </div>
            {/* Actions */}
            <div
              className="relative flex justify-end pr-2"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => {
                  setActionMenuRow(actionMenuRow === emp.id ? null : emp.id);
                }}
                className="p-1.5 rounded-lg transition-colors"
                style={{ color: "var(--muted-foreground)" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "var(--secondary)";
                  e.currentTarget.style.color = "var(--primary)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.color = "var(--muted-foreground)";
                }}
              >
                <MoreVertical size={16} />
              </button>
              {actionMenuRow === emp.id && (
                <div
                  className="absolute right-0 top-full mt-1 w-44 rounded-xl shadow-xl border z-30 py-1 text-left"
                  style={{
                    backgroundColor: "var(--card)",
                    borderColor: "var(--border)",
                  }}
                >
                  <button
                    className="w-full text-left px-4 py-2 text-[13px] font-medium transition-colors"
                    style={{
                      color: "var(--foreground)",
                      background: "transparent",
                      border: "none",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor =
                        "var(--background)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = "transparent")
                    }
                    onClick={() => navigate(`/employees/${emp.id}`)}
                  >
                    View Profile
                  </button>
                  {canEdit(emp) && (
                    <button
                      className="w-full text-left px-4 py-2 text-[13px] font-medium transition-colors"
                      style={{
                        color: "var(--foreground)",
                        background: "transparent",
                        border: "none",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor =
                          "var(--background)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = "transparent")
                      }
                      onClick={() => {
                        onEdit(emp);
                        setActionMenuRow(null);
                      }}
                    >
                      Edit Employee
                    </button>
                  )}
                  <button
                    className="w-full text-left px-4 py-2 text-[13px] font-medium transition-colors"
                    style={{
                      color: "var(--foreground)",
                      background: "transparent",
                      border: "none",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor =
                        "var(--background)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = "transparent")
                    }
                    onClick={() => window.open(`mailto:${emp.email}`)}
                  >
                    Send Message
                  </button>
                  {(canDeactivate(emp) || canDelete(emp)) && (
                    <>
                      <div
                        className="h-px my-1 w-full"
                        style={{ backgroundColor: "var(--border)" }}
                      ></div>
                      {canDeactivate(emp) && (
                        <button
                          className="w-full text-left px-4 py-2 text-[13px] font-medium text-red-500 transition-colors hover:bg-red-50"
                          style={{ background: "transparent", border: "none" }}
                          onClick={() => {
                            onDeactivate(emp);
                            setActionMenuRow(null);
                          }}
                        >
                          Deactivate
                        </button>
                      )}
                      {canDelete(emp) && (
                        <button
                          className="w-full text-left px-4 py-2 text-[13px] font-medium text-red-600 transition-colors hover:bg-red-50"
                          style={{ background: "transparent", border: "none" }}
                          onClick={() => {
                            onConfirmDelete(emp);
                            setActionMenuRow(null);
                          }}
                        >
                          Delete
                        </button>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
