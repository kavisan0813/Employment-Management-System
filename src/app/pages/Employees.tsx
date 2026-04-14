import { useState } from "react";
import { useNavigate } from "react-router";
import {
  Search,
  Plus,
  ChevronDown,
  Eye,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Filter,
} from "lucide-react";
import { employees } from "../data/mockData";

const ROWS_PER_PAGE = 8;

const departments = ["All Departments", "Engineering", "Marketing", "Design", "Finance", "HR", "Product", "Sales", "Operations"];
const statuses = ["All Status", "Active", "Inactive", "On Leave"];

export function Employees() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [selectedDept, setSelectedDept] = useState("All Departments");
  const [selectedStatus, setSelectedStatus] = useState("All Status");
  const [page, setPage] = useState(1);
  const [showDeptDropdown, setShowDeptDropdown] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);

  const filtered = employees.filter((emp) => {
    const matchSearch =
      emp.name.toLowerCase().includes(search.toLowerCase()) ||
      emp.id.toLowerCase().includes(search.toLowerCase()) ||
      emp.email.toLowerCase().includes(search.toLowerCase());
    const matchDept = selectedDept === "All Departments" || emp.department === selectedDept;
    const matchStatus = selectedStatus === "All Status" || emp.status === selectedStatus;
    return matchSearch && matchDept && matchStatus;
  });

  const totalPages = Math.ceil(filtered.length / ROWS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ROWS_PER_PAGE, page * ROWS_PER_PAGE);

  const statusConfig: Record<string, { bg: string; color: string }> = {
    Active: { bg: "#F0FDF4", color: "#16A34A" },
    Inactive: { bg: "#FEF2F2", color: "#DC2626" },
    "On Leave": { bg: "#FFFBEB", color: "#D97706" },
  };

  return (
    <div style={{ maxWidth: "1360px" }}>
      {/* Header Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Employees", value: employees.length, color: "#3B82F6" },
          { label: "Active", value: employees.filter((e) => e.status === "Active").length, color: "#22C55E" },
          { label: "On Leave", value: employees.filter((e) => e.status === "On Leave").length, color: "#F59E0B" },
          { label: "Inactive", value: employees.filter((e) => e.status === "Inactive").length, color: "#EF4444" },
        ].map((stat, i) => (
          <div
            key={i}
            className="rounded-xl px-4 py-3 flex items-center justify-between"
            style={{
              backgroundColor: "white",
              border: "1px solid #E2E8F0",
              boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
            }}
          >
            <span style={{ color: "#64748B", fontSize: "13px" }}>{stat.label}</span>
            <span style={{ color: stat.color, fontSize: "20px", fontWeight: 800 }}>{stat.value}</span>
          </div>
        ))}
      </div>

      {/* Filter Bar */}
      <div
        className="rounded-2xl p-5 mb-5"
        style={{
          backgroundColor: "white",
          border: "1px solid #E2E8F0",
          boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
        }}
      >
        <div className="flex items-center gap-3">
          {/* Search */}
          <div
            className="flex items-center gap-2.5 flex-1 rounded-xl px-4"
            style={{
              backgroundColor: "#F8FAFC",
              border: "1px solid #E2E8F0",
              height: "40px",
            }}
          >
            <Search size={15} color="#94A3B8" />
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search by name, ID, or email..."
              style={{
                border: "none",
                outline: "none",
                background: "transparent",
                fontSize: "13px",
                color: "#475569",
                width: "100%",
              }}
            />
          </div>

          {/* Department Dropdown */}
          <div className="relative">
            <button
              onClick={() => { setShowDeptDropdown(!showDeptDropdown); setShowStatusDropdown(false); }}
              className="flex items-center gap-2 rounded-xl px-4 transition-colors"
              style={{
                height: "40px",
                backgroundColor: "#F8FAFC",
                border: "1px solid #E2E8F0",
                color: "#475569",
                fontSize: "13px",
                fontWeight: 500,
                whiteSpace: "nowrap",
              }}
            >
              <Filter size={13} color="#94A3B8" />
              {selectedDept}
              <ChevronDown size={13} color="#94A3B8" />
            </button>
            {showDeptDropdown && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowDeptDropdown(false)} />
                <div
                  className="absolute top-full left-0 mt-1 rounded-xl overflow-hidden z-20"
                  style={{
                    minWidth: "180px",
                    backgroundColor: "white",
                    border: "1px solid #E2E8F0",
                    boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
                  }}
                >
                  {departments.map((dept) => (
                    <button
                      key={dept}
                      onClick={() => { setSelectedDept(dept); setShowDeptDropdown(false); setPage(1); }}
                      className="w-full px-4 py-2.5 text-left transition-colors"
                      style={{
                        fontSize: "13px",
                        color: selectedDept === dept ? "#3B82F6" : "#475569",
                        backgroundColor: selectedDept === dept ? "#EFF6FF" : "transparent",
                        fontWeight: selectedDept === dept ? 600 : 400,
                      }}
                      onMouseEnter={(e) => {
                        if (selectedDept !== dept)
                          (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#F8FAFC";
                      }}
                      onMouseLeave={(e) => {
                        if (selectedDept !== dept)
                          (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
                      }}
                    >
                      {dept}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Status Dropdown */}
          <div className="relative">
            <button
              onClick={() => { setShowStatusDropdown(!showStatusDropdown); setShowDeptDropdown(false); }}
              className="flex items-center gap-2 rounded-xl px-4 transition-colors"
              style={{
                height: "40px",
                backgroundColor: "#F8FAFC",
                border: "1px solid #E2E8F0",
                color: "#475569",
                fontSize: "13px",
                fontWeight: 500,
                whiteSpace: "nowrap",
              }}
            >
              {selectedStatus}
              <ChevronDown size={13} color="#94A3B8" />
            </button>
            {showStatusDropdown && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowStatusDropdown(false)} />
                <div
                  className="absolute top-full left-0 mt-1 rounded-xl overflow-hidden z-20"
                  style={{
                    minWidth: "150px",
                    backgroundColor: "white",
                    border: "1px solid #E2E8F0",
                    boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
                  }}
                >
                  {statuses.map((status) => (
                    <button
                      key={status}
                      onClick={() => { setSelectedStatus(status); setShowStatusDropdown(false); setPage(1); }}
                      className="w-full px-4 py-2.5 text-left transition-colors"
                      style={{
                        fontSize: "13px",
                        color: selectedStatus === status ? "#3B82F6" : "#475569",
                        backgroundColor: selectedStatus === status ? "#EFF6FF" : "transparent",
                        fontWeight: selectedStatus === status ? 600 : 400,
                      }}
                      onMouseEnter={(e) => {
                        if (selectedStatus !== status)
                          (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#F8FAFC";
                      }}
                      onMouseLeave={(e) => {
                        if (selectedStatus !== status)
                          (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
                      }}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Add Employee Button */}
          <button
            className="flex items-center gap-2 rounded-xl px-5 transition-all hover:opacity-90"
            style={{
              height: "40px",
              background: "linear-gradient(135deg, #3B82F6, #1D4ED8)",
              color: "white",
              fontSize: "13px",
              fontWeight: 600,
              boxShadow: "0 4px 12px rgba(59, 130, 246, 0.35)",
              whiteSpace: "nowrap",
            }}
          >
            <Plus size={15} />
            Add Employee
          </button>
        </div>
      </div>

      {/* Table */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{
          backgroundColor: "white",
          border: "1px solid #E2E8F0",
          boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
        }}
      >
        {/* Table Header */}
        <div
          className="grid px-6 py-3"
          style={{
            backgroundColor: "#F8FAFC",
            borderBottom: "1px solid #E2E8F0",
            gridTemplateColumns: "2.5fr 1fr 1.2fr 1.5fr 1fr 1fr",
          }}
        >
          {["Employee", "ID", "Department", "Designation", "Status", "Actions"].map((col) => (
            <span
              key={col}
              style={{
                color: "#64748B",
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.5px",
                textTransform: "uppercase",
              }}
            >
              {col}
            </span>
          ))}
        </div>

        {/* Table Rows */}
        {paginated.map((emp, i) => (
          <div
            key={emp.id}
            className="grid px-6 py-3.5 items-center cursor-pointer transition-colors"
            style={{
              gridTemplateColumns: "2.5fr 1fr 1.2fr 1.5fr 1fr 1fr",
              borderBottom: i < paginated.length - 1 ? "1px solid #F1F5F9" : "none",
              backgroundColor:
                hoveredRow === emp.id
                  ? "#EFF6FF"
                  : i % 2 === 0
                  ? "white"
                  : "#FAFBFD",
              transition: "background-color 0.15s",
            }}
            onMouseEnter={() => setHoveredRow(emp.id)}
            onMouseLeave={() => setHoveredRow(null)}
          >
            {/* Employee */}
            <div className="flex items-center gap-3">
              <img
                src={emp.avatar}
                alt={emp.name}
                className="rounded-full object-cover shrink-0"
                style={{ width: "36px", height: "36px", border: "2px solid #E2E8F0" }}
                onError={(e) => {
                  const el = e.currentTarget;
                  el.style.display = "none";
                  const parent = el.parentElement;
                  if (parent) {
                    const fallback = document.createElement("div");
                    fallback.style.cssText = `width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,#3B82F6,#8B5CF6);display:flex;align-items:center;justify-content:center;color:white;font-size:13px;font-weight:700;flex-shrink:0;`;
                    fallback.textContent = emp.name.split(" ").map((n) => n[0]).join("").slice(0, 2);
                    parent.insertBefore(fallback, el);
                  }
                }}
              />
              <div>
                <p style={{ color: "#0F172A", fontSize: "13px", fontWeight: 600 }}>{emp.name}</p>
                <p style={{ color: "#94A3B8", fontSize: "11px" }}>{emp.email}</p>
              </div>
            </div>

            {/* ID */}
            <span
              className="px-2 py-1 rounded-lg"
              style={{
                color: "#475569",
                fontSize: "12px",
                fontWeight: 600,
                backgroundColor: "#F1F5F9",
                width: "fit-content",
              }}
            >
              {emp.id}
            </span>

            {/* Department */}
            <span style={{ color: "#475569", fontSize: "13px" }}>{emp.department}</span>

            {/* Designation */}
            <span style={{ color: "#475569", fontSize: "13px" }}>{emp.designation}</span>

            {/* Status Badge */}
            <span
              className="px-2.5 py-1 rounded-full"
              style={{
                backgroundColor: statusConfig[emp.status]?.bg || "#F1F5F9",
                color: statusConfig[emp.status]?.color || "#475569",
                fontSize: "11px",
                fontWeight: 700,
                width: "fit-content",
              }}
            >
              {emp.status}
            </span>

            {/* Actions */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => navigate(`/employees/${emp.id}`)}
                className="p-2 rounded-lg transition-colors"
                title="View"
                style={{ color: "#94A3B8" }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#EFF6FF";
                  (e.currentTarget as HTMLButtonElement).style.color = "#3B82F6";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
                  (e.currentTarget as HTMLButtonElement).style.color = "#94A3B8";
                }}
              >
                <Eye size={15} />
              </button>
              <button
                className="p-2 rounded-lg transition-colors"
                title="Edit"
                style={{ color: "#94A3B8" }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#F0FDF4";
                  (e.currentTarget as HTMLButtonElement).style.color = "#22C55E";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
                  (e.currentTarget as HTMLButtonElement).style.color = "#94A3B8";
                }}
              >
                <Pencil size={15} />
              </button>
              <button
                className="p-2 rounded-lg transition-colors"
                title="Delete"
                style={{ color: "#94A3B8" }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#FEF2F2";
                  (e.currentTarget as HTMLButtonElement).style.color = "#EF4444";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
                  (e.currentTarget as HTMLButtonElement).style.color = "#94A3B8";
                }}
              >
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="py-16 text-center">
            <p style={{ color: "#94A3B8", fontSize: "14px" }}>No employees found matching your filters.</p>
          </div>
        )}

        {/* Pagination */}
        <div
          className="flex items-center justify-between px-6 py-4"
          style={{ borderTop: "1px solid #E2E8F0" }}
        >
          <p style={{ color: "#94A3B8", fontSize: "13px" }}>
            Showing{" "}
            <span style={{ color: "#475569", fontWeight: 600 }}>
              {(page - 1) * ROWS_PER_PAGE + 1}–
              {Math.min(page * ROWS_PER_PAGE, filtered.length)}
            </span>{" "}
            of{" "}
            <span style={{ color: "#475569", fontWeight: 600 }}>{filtered.length}</span> employees
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="flex items-center justify-center w-8 h-8 rounded-lg transition-colors"
              style={{
                border: "1px solid #E2E8F0",
                color: page === 1 ? "#CBD5E1" : "#475569",
                backgroundColor: page === 1 ? "#F8FAFC" : "white",
                cursor: page === 1 ? "not-allowed" : "pointer",
              }}
            >
              <ChevronLeft size={14} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className="w-8 h-8 rounded-lg transition-colors"
                style={{
                  border: "1px solid",
                  borderColor: page === p ? "#3B82F6" : "#E2E8F0",
                  color: page === p ? "white" : "#475569",
                  backgroundColor: page === p ? "#3B82F6" : "white",
                  fontSize: "13px",
                  fontWeight: page === p ? 700 : 400,
                  cursor: "pointer",
                }}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="flex items-center justify-center w-8 h-8 rounded-lg transition-colors"
              style={{
                border: "1px solid #E2E8F0",
                color: page === totalPages ? "#CBD5E1" : "#475569",
                backgroundColor: page === totalPages ? "#F8FAFC" : "white",
                cursor: page === totalPages ? "not-allowed" : "pointer",
              }}
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
