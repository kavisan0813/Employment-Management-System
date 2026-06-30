import { useState, useMemo, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { useAuth } from "../../context/AuthContext";
import { useDebounce } from "../../hooks/useDebounce";
import {
  Search,
  Plus,
  ChevronDown,
  Trash2,
  ChevronLeft,
  ChevronRight,
  X,
  User,
  Mail,
  Briefcase,
  Calendar as CalendarIcon,
  IndianRupee,
  MoreVertical,
  MapPin,
  LayoutGrid,
  List,
  Users,
  Send,
  Download,
  UserCheck,
  Phone,
  Linkedin,
  ChevronUp,
  Ban,
} from "lucide-react";
import { useEmployees, Employee } from "../../context/AppContext";

const ROWS_PER_PAGE = 12;

const departments = [
  "All Departments",
  "Engineering",
  "Marketing",
  "Design",
  "Finance",
  "HR",
  "Product",
  "Sales",
  "Operations",
];
// const statuses = ["All Status", "Active", "Inactive", "On Leave"];

/* ─── Add Employee Modal ─────────────────── */
function AddEmployeeModal({
  onClose,
  onAdd,
}: {
  onClose: () => void;
  onAdd: (form: {
    name: string;
    email: string;
    department: string;
    designation: string;
    salary: string;
    joinDate: string;
  }) => void;
}) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    department: "Engineering",
    designation: "",
    salary: "",
    joinDate: new Date().toISOString().split("T")[0],
  });

  return (
    <div
      className="fixed inset-0 z-[2000] flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.45)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl overflow-hidden shadow-2xl"
        style={{
          backgroundColor: "var(--card)",
          border: "1px solid var(--border)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div
          className="flex items-center justify-between px-8 py-7"
          style={{
            borderBottom: "1px solid var(--border)",
            background: "var(--card)",
          }}
        >
          <div>
            <h3
              style={{
                color: "var(--foreground)",
                fontSize: "22px",
                fontWeight: 800,
                letterSpacing: "-0.5px",
              }}
            >
              Add New Employee
            </h3>
            <p
              style={{
                color: "var(--muted-foreground)",
                fontSize: "14px",
                marginTop: "2px",
              }}
            >
              Create a new employee profile in the system
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl transition-colors hover:bg-[rgba(0,0,0,0.05)]"
            style={{ color: "var(--muted-foreground)" }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div
          className="px-8 py-8 overflow-y-auto"
          style={{ maxHeight: "70vh" }}
        >
          <div className="grid grid-cols-2 gap-6">
            {/* Name */}
            <div className="col-span-2">
              <label
                style={{
                  color: "var(--foreground)",
                  fontSize: "14px",
                  fontWeight: 700,
                  display: "block",
                  marginBottom: "8px",
                  opacity: 0.9,
                }}
              >
                Full Name
              </label>
              <div className="relative">
                <User
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  className="w-full rounded-2xl pl-11 pr-4 py-3.5 text-sm outline-none transition-all focus:ring-2 focus:ring-emerald-500/20"
                  style={{
                    border: "1px solid var(--border)",
                    backgroundColor: "var(--background)",
                    color: "var(--foreground)",
                  }}
                  placeholder="e.g. John Doe"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
            </div>

            {/* Email */}
            <div className="col-span-2">
              <label
                style={{
                  color: "var(--foreground)",
                  fontSize: "14px",
                  fontWeight: 700,
                  display: "block",
                  marginBottom: "8px",
                  opacity: 0.9,
                }}
              >
                Email Address
              </label>
              <div className="relative">
                <Mail
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="email"
                  className="w-full rounded-2xl pl-11 pr-4 py-3.5 text-sm outline-none transition-all focus:ring-2 focus:ring-emerald-500/20"
                  style={{
                    border: "1px solid var(--border)",
                    backgroundColor: "var(--background)",
                    color: "var(--foreground)",
                  }}
                  placeholder="john.doe@company.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
            </div>

            {/* Department */}
            <div>
              <label
                style={{
                  color: "var(--foreground)",
                  fontSize: "14px",
                  fontWeight: 700,
                  display: "block",
                  marginBottom: "8px",
                  opacity: 0.9,
                }}
              >
                Department
              </label>
              <div className="relative">
                <Briefcase
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <select
                  className="w-full rounded-2xl pl-11 pr-4 py-3.5 text-sm outline-none appearance-none focus:ring-2 focus:ring-emerald-500/20"
                  style={{
                    border: "1px solid var(--border)",
                    backgroundColor: "var(--background)",
                    color: "var(--foreground)",
                  }}
                  value={form.department}
                  onChange={(e) =>
                    setForm({ ...form, department: e.target.value })
                  }
                >
                  {departments.slice(1).map((d) => (
                    <option
                      key={d}
                      style={{
                        backgroundColor: "var(--card)",
                        color: "var(--foreground)",
                      }}
                    >
                      {d}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={14}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
              </div>
            </div>

            {/* Designation */}
            <div>
              <label
                style={{
                  color: "var(--foreground)",
                  fontSize: "14px",
                  fontWeight: 700,
                  display: "block",
                  marginBottom: "8px",
                  opacity: 0.9,
                }}
              >
                Designation
              </label>
              <input
                className="w-full rounded-2xl px-4 py-3.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500/20"
                style={{
                  border: "1px solid var(--border)",
                  backgroundColor: "var(--background)",
                  color: "var(--foreground)",
                }}
                placeholder="e.g. Senior Developer"
                value={form.designation}
                onChange={(e) =>
                  setForm({ ...form, designation: e.target.value })
                }
              />
            </div>

            {/* Salary */}
            <div>
              <label
                style={{
                  color: "var(--foreground)",
                  fontSize: "14px",
                  fontWeight: 700,
                  display: "block",
                  marginBottom: "8px",
                  opacity: 0.9,
                }}
              >
                Annual Salary (₹)
              </label>
              <div className="relative">
                <IndianRupee
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="number"
                  className="w-full rounded-2xl pl-11 pr-4 py-3.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500/20"
                  style={{
                    border: "1px solid var(--border)",
                    backgroundColor: "var(--background)",
                    color: "var(--foreground)",
                  }}
                  placeholder="75000"
                  value={form.salary}
                  onChange={(e) => setForm({ ...form, salary: e.target.value })}
                />
              </div>
            </div>

            {/* Join Date */}
            <div>
              <label
                style={{
                  color: "var(--foreground)",
                  fontSize: "14px",
                  fontWeight: 700,
                  display: "block",
                  marginBottom: "8px",
                  opacity: 0.9,
                }}
              >
                Joining Date
              </label>
              <div className="relative">
                <CalendarIcon
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="date"
                  className="w-full rounded-2xl pl-11 pr-4 py-3.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500/20"
                  style={{
                    border: "1px solid var(--border)",
                    backgroundColor: "var(--background)",
                    color: "var(--foreground)",
                  }}
                  value={form.joinDate}
                  onChange={(e) =>
                    setForm({ ...form, joinDate: e.target.value })
                  }
                />
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div
          className="px-6 py-5 flex gap-3"
          style={{ borderTop: "1px solid var(--border)" }}
        >
          <button
            onClick={onClose}
            className="flex-1 py-3.5 rounded-2xl text-sm font-bold transition-all hover:bg-emerald-500/10"
            style={{
              backgroundColor: "var(--secondary)",
              color: "var(--primary)",
              border: "none",
            }}
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onAdd(form);
            }}
            className="flex-1 py-3.5 rounded-2xl text-sm font-bold text-white transition-all hover:opacity-90 active:scale-95"
            style={{
              background: "#10B981",
              border: "none",
            }}
          >
            Add Employee
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Edit Employee Modal ────────────────── */
function EditEmployeeModal({
  employee,
  onClose,
  onSave,
}: {
  employee: Employee;
  onClose: () => void;
  onSave: (
    id: string,
    form: {
      name: string;
      email: string;
      department: string;
      designation: string;
      salary: string;
      joinDate: string;
      status: string;
    },
  ) => void;
}) {
  const [form, setForm] = useState({
    name: employee.name,
    email: employee.email,
    department: employee.department,
    designation: employee.designation,
    salary: String(employee.salary),
    joinDate: employee.joinDate,
    status: employee.status,
  });

  return (
    <div
      className="fixed inset-0 z-[2000] flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.45)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl overflow-hidden shadow-2xl"
        style={{
          backgroundColor: "var(--card)",
          border: "1px solid var(--border)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-8 py-6"
          style={{
            borderBottom: "1px solid var(--border)",
            background: "linear-gradient(135deg,#ECFDF5 0%,#F0FDFA 100%)",
          }}
        >
          <div className="flex items-center gap-3">
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                overflow: "hidden",
                border: "2px solid #10B981",
                flexShrink: 0,
              }}
            >
              <img
                src={employee.avatar}
                alt={employee.name}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
            <div>
              <h3
                style={{
                  color: "#0F3047",
                  fontSize: "18px",
                  fontWeight: 800,
                  letterSpacing: "-0.4px",
                }}
              >
                Edit Employee
              </h3>
              <p
                style={{ color: "#6B8C7A", fontSize: "12px", marginTop: "1px" }}
              >
                {employee.id} · {employee.role}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl transition-colors"
            style={{ color: "var(--muted-foreground)" }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.backgroundColor =
                "var(--secondary)")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.backgroundColor =
                "transparent")
            }
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div
          className="px-8 py-6 overflow-y-auto"
          style={{ maxHeight: "65vh" }}
        >
          <div className="grid grid-cols-2 gap-5">
            {/* Name */}
            <div className="col-span-2">
              <label
                style={{
                  color: "#374151",
                  fontSize: "13px",
                  fontWeight: 700,
                  display: "block",
                  marginBottom: "6px",
                }}
              >
                Full Name
              </label>
              <div className="relative">
                <User
                  size={15}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  className="w-full rounded-xl pl-10 pr-4 py-3 text-sm outline-none"
                  style={{
                    border: "1px solid var(--border)",
                    backgroundColor: "var(--background)",
                    color: "var(--foreground)",
                  }}
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
            </div>

            {/* Email */}
            <div className="col-span-2">
              <label
                style={{
                  color: "#374151",
                  fontSize: "13px",
                  fontWeight: 700,
                  display: "block",
                  marginBottom: "6px",
                }}
              >
                Email Address
              </label>
              <div className="relative">
                <Mail
                  size={15}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="email"
                  className="w-full rounded-xl pl-10 pr-4 py-3 text-sm outline-none"
                  style={{
                    border: "1px solid var(--border)",
                    backgroundColor: "var(--background)",
                    color: "var(--foreground)",
                  }}
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
            </div>

            {/* Department */}
            <div>
              <label
                style={{
                  color: "#374151",
                  fontSize: "13px",
                  fontWeight: 700,
                  display: "block",
                  marginBottom: "6px",
                }}
              >
                Department
              </label>
              <div className="relative">
                <Briefcase
                  size={15}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <select
                  className="w-full rounded-xl pl-10 pr-4 py-3 text-sm outline-none appearance-none"
                  style={{
                    border: "1px solid var(--border)",
                    backgroundColor: "var(--background)",
                    color: "var(--foreground)",
                  }}
                  value={form.department}
                  onChange={(e) =>
                    setForm({ ...form, department: e.target.value })
                  }
                >
                  {departments.slice(1).map((d) => (
                    <option key={d}>{d}</option>
                  ))}
                </select>
                <ChevronDown
                  size={13}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
              </div>
            </div>

            {/* Status */}
            <div>
              <label
                style={{
                  color: "#374151",
                  fontSize: "13px",
                  fontWeight: 700,
                  display: "block",
                  marginBottom: "6px",
                }}
              >
                Status
              </label>
              <div className="relative">
                <select
                  className="w-full rounded-xl px-4 py-3 text-sm outline-none appearance-none"
                  style={{
                    border: "1px solid var(--border)",
                    backgroundColor: "var(--background)",
                    color: "var(--foreground)",
                  }}
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                >
                  {["Active", "Inactive", "On Leave"].map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
                <ChevronDown
                  size={13}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
              </div>
            </div>

            {/* Designation */}
            <div className="col-span-2">
              <label
                style={{
                  color: "#374151",
                  fontSize: "13px",
                  fontWeight: 700,
                  display: "block",
                  marginBottom: "6px",
                }}
              >
                Designation
              </label>
              <input
                className="w-full rounded-xl px-4 py-3 text-sm outline-none"
                style={{
                  border: "1px solid var(--border)",
                  backgroundColor: "var(--background)",
                  color: "var(--foreground)",
                }}
                value={form.designation}
                onChange={(e) =>
                  setForm({ ...form, designation: e.target.value })
                }
              />
            </div>

            <div>
              <label
                style={{
                  color: "#374151",
                  fontSize: "13px",
                  fontWeight: 700,
                  display: "block",
                  marginBottom: "6px",
                }}
              >
                Annual Salary (₹)
              </label>
              <div className="relative">
                <IndianRupee
                  size={15}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="number"
                  className="w-full rounded-xl pl-10 pr-4 py-3 text-sm outline-none"
                  style={{
                    border: "1px solid var(--border)",
                    backgroundColor: "var(--background)",
                    color: "var(--foreground)",
                  }}
                  value={form.salary}
                  onChange={(e) => setForm({ ...form, salary: e.target.value })}
                />
              </div>
            </div>

            {/* Join Date */}
            <div>
              <label
                style={{
                  color: "#374151",
                  fontSize: "13px",
                  fontWeight: 700,
                  display: "block",
                  marginBottom: "6px",
                }}
              >
                Joining Date
              </label>
              <div className="relative">
                <CalendarIcon
                  size={15}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="date"
                  className="w-full rounded-xl pl-10 pr-4 py-3 text-sm outline-none"
                  style={{
                    border: "1px solid var(--border)",
                    backgroundColor: "var(--background)",
                    color: "var(--foreground)",
                  }}
                  value={form.joinDate}
                  onChange={(e) =>
                    setForm({ ...form, joinDate: e.target.value })
                  }
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          className="px-6 py-5 flex gap-3"
          style={{ borderTop: "1px solid var(--border)" }}
        >
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl text-sm font-bold transition-all"
            style={{
              backgroundColor: "var(--secondary)",
              color: "var(--primary)",
              border: "none",
            }}
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onSave(employee.id, form);
            }}
            className="flex-1 py-3 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90"
            style={{
              background: "#10B981",
              border: "none",
              boxShadow: "0 4px 12px rgba(16,185,129,0.35)",
            }}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Delete Confirm Modal ───────────────── */
function DeleteConfirmModal({
  employee,
  onClose,
  onConfirm,
}: {
  employee: Employee;
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-[2000] flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl"
        style={{
          backgroundColor: "var(--card)",
          border: "1px solid var(--border)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Red header accent */}
        <div
          style={{
            height: "4px",
            background: "linear-gradient(90deg,#EF4444,#DC2626)",
          }}
        />

        <div className="px-7 py-7">
          {/* Warning icon */}
          <div
            className="flex items-center justify-center w-14 h-14 rounded-full mx-auto mb-5"
            style={{ backgroundColor: "rgba(239,68,68,0.1)" }}
          >
            <Trash2 size={24} color="#EF4444" />
          </div>

          <h3
            style={{
              color: "var(--foreground)",
              fontSize: "18px",
              fontWeight: 800,
              textAlign: "center",
              marginBottom: "8px",
            }}
          >
            Delete Employee
          </h3>
          <p
            style={{
              color: "var(--muted-foreground)",
              fontSize: "13px",
              textAlign: "center",
              lineHeight: 1.6,
            }}
          >
            Are you sure you want to delete{" "}
            <span style={{ color: "var(--foreground)", fontWeight: 700 }}>
              {employee.name}
            </span>
            ?
            <br />
            <span style={{ fontSize: "12px" }}>
              This action cannot be undone.
            </span>
          </p>

          {/* Employee preview card */}
          <div
            className="flex items-center gap-3 rounded-xl p-3 mt-5"
            style={{
              backgroundColor: "var(--background)",
              border: "1px solid var(--border)",
            }}
          >
            <div
              style={{
                width: "38px",
                height: "38px",
                borderRadius: "50%",
                overflow: "hidden",
                border: "2px solid rgba(239,68,68,0.3)",
                flexShrink: 0,
              }}
            >
              <img
                src={employee.avatar}
                alt={employee.name}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
            <div>
              <p
                style={{
                  color: "var(--foreground)",
                  fontSize: "13px",
                  fontWeight: 700,
                  margin: 0,
                }}
              >
                {employee.name}
              </p>
              <p
                style={{
                  color: "var(--muted-foreground)",
                  fontSize: "11px",
                  margin: 0,
                }}
              >
                {employee.designation} · {employee.department}
              </p>
            </div>
            <span
              className="ml-auto px-2.5 py-1 rounded-full text-[11px] font-bold"
              style={{
                backgroundColor:
                  employee.status === "Active"
                    ? "var(--secondary)"
                    : employee.status === "On Leave"
                      ? "rgba(245,158,11,0.1)"
                      : "rgba(239,68,68,0.1)",
                color:
                  employee.status === "Active"
                    ? "var(--primary)"
                    : employee.status === "On Leave"
                      ? "#F59E0B"
                      : "#EF4444",
              }}
            >
              {employee.status}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl text-sm font-bold transition-all"
            style={{
              backgroundColor: "var(--secondary)",
              color: "var(--foreground)",
              border: "none",
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.opacity = "0.8")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.opacity = "1")
            }
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-3 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90"
            style={{
              background: "linear-gradient(135deg,#EF4444,#DC2626)",
              border: "none",
              boxShadow: "0 4px 14px rgba(239,68,68,0.35)",
            }}
          >
            Yes, Delete
          </button>
        </div>
      </div>
    </div>
  );
}

interface HighlightTextProps {
  text: string;
  search: string;
}

function HighlightText({ text, search }: HighlightTextProps) {
  if (!search || !search.trim()) return <>{text}</>;
  const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`(${escapedSearch})`, "gi");
  const parts = text.split(regex);
  return (
    <>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <mark
            key={i}
            className="bg-yellow-200/60 dark:bg-yellow-500/30 text-yellow-950 dark:text-yellow-100 rounded-sm px-0.5"
            style={{
              backgroundColor: "rgba(253, 224, 71, 0.4)",
              color: "inherit",
            }}
          >
            {part}
          </mark>
        ) : (
          part
        ),
      )}
    </>
  );
}

/* ─── Bulk Import Modal ──────────────────────────────────── */
function BulkImportModal({
  onClose,
  onImport,
}: {
  onClose: () => void;
  onImport: (emps: any[]) => void;
}) {
  const [csvText, setCsvText] = useState("");
  const [parsedEmployees, setParsedEmployees] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleParse = () => {
    if (!csvText.trim()) {
      setError("Please paste CSV data first.");
      return;
    }
    const lines = csvText.trim().split("\n");
    if (lines.length < 2) {
      setError("CSV must include a header and at least one employee row.");
      return;
    }
    const header = lines[0].split(",").map((h) => h.trim().toLowerCase());
    const expectedHeaders = [
      "name",
      "email",
      "department",
      "designation",
      "salary",
      "joindate",
    ];
    const hasRequired = expectedHeaders.every((h) => header.includes(h));
    if (!hasRequired) {
      setError(
        "CSV headers must include: name, email, department, designation, salary, joindate",
      );
      return;
    }

    const emps: any[] = [];
    for (let i = 1; i < lines.length; i++) {
      if (!lines[i].trim()) continue;
      const values = lines[i].split(",").map((v) => v.trim());
      if (values.length !== header.length) {
        setError(`Row ${i + 1} has a mismatch in column count.`);
        return;
      }
      const emp: any = {};
      header.forEach((col, idx) => {
        if (col === "name") emp.name = values[idx];
        else if (col === "email") emp.email = values[idx];
        else if (col === "department") emp.department = values[idx];
        else if (col === "designation") emp.designation = values[idx];
        else if (col === "salary") emp.salary = Number(values[idx]) || 50000;
        else if (col === "joindate") emp.joinDate = values[idx];
      });
      emps.push(emp);
    }
    setParsedEmployees(emps);
    setError(null);
  };

  return (
    <div
      className="fixed inset-0 z-[2000] flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.45)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl"
        style={{
          backgroundColor: "var(--card)",
          border: "1px solid var(--border)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-8 py-6 border-b border-border">
          <div>
            <h3 className="text-lg font-black text-foreground">
              Bulk Import Employees
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Paste CSV formatted text to import multiple employees
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-secondary text-muted-foreground"
          >
            <X size={18} />
          </button>
        </div>

        <div className="px-8 py-6 space-y-4 max-h-[60vh] overflow-y-auto">
          {parsedEmployees.length === 0 ? (
            <div>
              <label className="block text-xs font-black uppercase tracking-wider mb-2 text-foreground">
                Paste CSV Data (Include Header)
              </label>
              <textarea
                rows={8}
                className="w-full rounded-xl p-4 text-xs font-mono border border-border bg-background text-foreground outline-none focus:ring-2 focus:ring-emerald-500/20"
                placeholder="name,email,department,designation,salary,joindate&#10;Arun Kumar,arun@nexushr.com,Engineering,Developer,90000,2024-03-01&#10;Priya Sharma,priya@nexushr.com,Product,Manager,120000,2023-05-15"
                value={csvText}
                onChange={(e) => setCsvText(e.target.value)}
              />
              <p className="text-[10px] text-muted-foreground mt-1">
                Headers should match: name, email, department, designation,
                salary, joindate
              </p>
              {error && (
                <p className="text-xs font-bold text-rose-500 mt-2">{error}</p>
              )}
              <button
                onClick={handleParse}
                className="mt-4 px-5 py-2.5 rounded-xl font-bold text-xs bg-primary text-white hover:opacity-90"
              >
                Parse Employees
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-xs font-bold text-emerald-600">
                Parsed {parsedEmployees.length} employees successfully.
              </p>
              <div className="border border-border rounded-xl overflow-hidden max-h-[250px] overflow-y-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-secondary text-muted-foreground">
                    <tr>
                      <th className="p-3 font-semibold">Name</th>
                      <th className="p-3 font-semibold">Department</th>
                      <th className="p-3 font-semibold">Designation</th>
                      <th className="p-3 font-semibold">Salary</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border bg-background text-foreground">
                    {parsedEmployees.map((emp, i) => (
                      <tr key={i}>
                        <td className="p-3 font-bold">{emp.name}</td>
                        <td className="p-3">{emp.department}</td>
                        <td className="p-3">{emp.designation}</td>
                        <td className="p-3">₹{emp.salary?.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setParsedEmployees([])}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold bg-secondary text-foreground hover:opacity-85"
                >
                  Clear & Edit
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="px-8 py-5 flex gap-3 border-t border-border bg-secondary/10">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-wider bg-secondary text-primary border-none"
          >
            Cancel
          </button>
          <button
            onClick={() => onImport(parsedEmployees)}
            disabled={parsedEmployees.length === 0}
            className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-wider text-white border-none ${parsedEmployees.length === 0 ? "bg-emerald-500/40 cursor-not-allowed" : "bg-emerald-500 hover:bg-emerald-600"}`}
          >
            Import Employees
          </button>
        </div>
      </div>
    </div>
  );
}

export function Employees() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    employeesList: employees,
    addEmployee,
    updateEmployee,
    deleteEmployee: removeEmployee,
    bulkImportEmployees,
  } = useEmployees();
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState(() => searchParams.get("search") || "");
  const debouncedSearch = useDebounce(search, 300);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement;
      if (
        activeEl &&
        (activeEl.tagName === "INPUT" ||
          activeEl.tagName === "TEXTAREA" ||
          activeEl.hasAttribute("contenteditable"))
      ) {
        return;
      }
      if (e.key === "/") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const [selectedDept, setSelectedDept] = useState("All Departments");
  const [selectedStatus, setSelectedStatus] = useState("All Status");
  const [selectedDesignation, setSelectedDesignation] =
    useState("All Designations");
  const [selectedLocation, setSelectedLocation] = useState("All Locations");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);

  const [view, setView] = useState<"table" | "grid" | "team">("table");
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [actionMenuRow, setActionMenuRow] = useState<string | null>(null);
  const [sortCol, setSortCol] = useState("name");
  const [sortDesc, setSortDesc] = useState(false);

  const [page, setPage] = useState(1);
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [editEmployee, setEditEmployee] = useState<
    (typeof employees)[0] | null
  >(null);
  const [deleteEmployee, setDeleteEmployee] = useState<
    (typeof employees)[0] | null
  >(null);

  // ─── ROLE BASED RESTRICTIONS ───
  const canManage = user?.role === "Super Admin" || user?.role === "HR Manager";
  const isManager = user?.role === "Manager";

  const uniqueDesignations = [
    "All Designations",
    ...Array.from(new Set(employees.map((e) => e.designation))),
  ];
  const uniqueLocations = [
    "All Locations",
    ...Array.from(new Set(employees.map((e) => e.location))),
  ];
  const uniqueTypes = Array.from(
    new Set(employees.map((e) => e.employmentType)),
  );

  const filtered = useMemo(() => {
    return employees.filter((emp) => {
      const matchSearch =
        debouncedSearch.trim() === "" ||
        emp.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        emp.id.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        emp.designation.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        emp.department.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        emp.email.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        emp.location.toLowerCase().includes(debouncedSearch.toLowerCase());

      const matchDept =
        selectedDept === "All Departments" || emp.department === selectedDept;

      const matchStatus =
        selectedStatus === "All Status" || emp.status === selectedStatus;

      const matchDesig =
        selectedDesignation === "All Designations" ||
        emp.designation === selectedDesignation;

      const matchLoc =
        selectedLocation === "All Locations" ||
        emp.location === selectedLocation;

      const matchType =
        selectedTypes.length === 0 ||
        selectedTypes.includes(emp.employmentType);

      return (
        matchSearch &&
        matchDept &&
        matchStatus &&
        matchDesig &&
        matchLoc &&
        matchType
      );
    });
  }, [
    debouncedSearch,
    selectedDept,
    selectedStatus,
    selectedDesignation,
    selectedLocation,
    selectedTypes,
  ]);

  // Sort
  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      let valA = (a as any)[sortCol];
      let valB = (b as any)[sortCol];
      if (typeof valA === "string") valA = valA.toLowerCase();
      if (typeof valB === "string") valB = valB.toLowerCase();
      if (valA < valB) return sortDesc ? 1 : -1;
      if (valA > valB) return sortDesc ? -1 : 1;
      return 0;
    });
  }, [filtered, sortCol, sortDesc]);

  const totalPages = useMemo(() => {
    return Math.ceil(sorted.length / ROWS_PER_PAGE);
  }, [sorted]);

  const paginated = useMemo(() => {
    return sorted.slice((page - 1) * ROWS_PER_PAGE, page * ROWS_PER_PAGE);
  }, [sorted, page]);

  const toggleRowSelection = (id: string) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id],
    );
  };
  const toggleAllRows = () => {
    if (selectedRows.length === paginated.length && paginated.length > 0) {
      setSelectedRows([]);
    } else {
      setSelectedRows(paginated.map((e) => e.id));
    }
  };
  const toggleType = (type: string) => {
    if (selectedTypes.includes(type)) {
      setSelectedTypes(selectedTypes.filter((t) => t !== type));
    } else {
      setSelectedTypes([...selectedTypes, type]);
    }
  };

  const clearFilters = () => {
    setSearch("");
    setSelectedDept("All Departments");
    setSelectedStatus("All Status");
    setSelectedDesignation("All Designations");
    setSelectedLocation("All Locations");
    setSelectedTypes([]);
    setPage(1);
  };

  const activeChips = useMemo(() => {
    const chips: { id: string; label: string; onClear: () => void }[] = [];
    if (search) {
      chips.push({
        id: "search",
        label: `Search: "${search}"`,
        onClear: () => setSearch(""),
      });
    }
    if (selectedDept !== "All Departments") {
      chips.push({
        id: "dept",
        label: selectedDept,
        onClear: () => setSelectedDept("All Departments"),
      });
    }
    if (selectedDesignation !== "All Designations") {
      chips.push({
        id: "designation",
        label: selectedDesignation,
        onClear: () => setSelectedDesignation("All Designations"),
      });
    }
    if (selectedLocation !== "All Locations") {
      chips.push({
        id: "location",
        label: selectedLocation,
        onClear: () => setSelectedLocation("All Locations"),
      });
    }
    if (selectedStatus !== "All Status") {
      chips.push({
        id: "status",
        label: selectedStatus,
        onClear: () => setSelectedStatus("All Status"),
      });
    }
    selectedTypes.forEach((type) => {
      chips.push({
        id: `type-${type}`,
        label: type,
        onClear: () =>
          setSelectedTypes((prev) => prev.filter((t) => t !== type)),
      });
    });
    return chips;
  }, [
    search,
    selectedDept,
    selectedDesignation,
    selectedLocation,
    selectedStatus,
    selectedTypes,
  ]);

  const handleSort = (col: string) => {
    if (sortCol === col) {
      setSortDesc(!sortDesc);
    } else {
      setSortCol(col);
      setSortDesc(false);
    }
  };

  const statusConfig: Record<
    string,
    { bg: string; color: string; dot: string }
  > = {
    Active: { bg: "rgba(16, 185, 129, 0.1)", color: "#10B981", dot: "#10B981" },
    Inactive: {
      bg: "rgba(107, 114, 128, 0.1)",
      color: "#6B7280",
      dot: "#6B7280",
    },
    "On Leave": {
      bg: "rgba(245, 158, 11, 0.1)",
      color: "#F59E0B",
      dot: "#F59E0B",
    },
  };

  const deptColors: Record<string, string> = {
    Engineering: "#3B82F6",
    HR: "#A855F7",
    Finance: "#10B981",
    Marketing: "#F59E0B",
    Design: "#EC4899",
    Sales: "#EF4444",
    Operations: "#0EA5E9",
    Product: "#14B8A6",
  };

  const FilterChip = ({
    value,
    options,
    onChange,
  }: {
    value: string;
    options: string[];
    onChange: (v: string) => void;
  }) => (
    <div className="relative group shrink-0">
      <select
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setPage(1);
        }}
        className="appearance-none pl-4 pr-9 py-2 rounded-xl text-[13px] font-medium outline-none cursor-pointer transition-colors"
        style={{
          backgroundColor: "var(--background)",
          border: "1px solid var(--border)",
          color: "var(--foreground)",
        }}
      >
        {options.map((opt: string) => (
          <option
            key={opt}
            value={opt}
            style={{
              backgroundColor: "var(--card)",
              color: "var(--foreground)",
            }}
          >
            {opt}
          </option>
        ))}
      </select>
      <ChevronDown
        size={14}
        className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
        style={{ color: "var(--muted-foreground)" }}
      />
    </div>
  );

  const gridCols = "40px 2.5fr 1.5fr 1.2fr 1.2fr 1.5fr 1.2fr 1fr 1fr 40px";

  return (
    <div
      className="w-full px-4 md:px-8 py-6 pb-10"
      onClick={() => setActionMenuRow(null)}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1 text-[12px] font-medium">
            <span
              style={{ color: "var(--primary)", cursor: "pointer" }}
              onClick={() => navigate("/")}
            >
              Dashboard
            </span>
            <ChevronRight
              size={12}
              style={{ color: "var(--muted-foreground)" }}
            />
            <span style={{ color: "var(--muted-foreground)" }}>Employees</span>
          </div>
          <h2
            style={{
              fontSize: "24px",
              fontWeight: 900,
              color: "var(--foreground)",
              margin: 0,
              letterSpacing: "-0.5px",
            }}
          >
            {isManager ? "My Team" : "Employee Directory"}
          </h2>
          <p
            style={{
              fontSize: "13px",
              color: "var(--muted-foreground)",
              margin: "2px 0 0",
            }}
          >
            {isManager
              ? "View and manage your direct reports"
              : `Managing ${filtered.length} total employees across ${departments.length - 1} departments`}
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {canManage && (
            <>
              <button
                onClick={() => setShowImportModal(true)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "10px 20px",
                  borderRadius: "12px",
                  backgroundColor: "var(--secondary)",
                  color: "var(--primary)",
                  border: "1px solid var(--border)",
                  fontSize: "14px",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                <Download size={18} style={{ transform: "rotate(180deg)" }} />
                Import Employees
              </button>
              <button
                onClick={() => setShowAddModal(true)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "10px 20px",
                  borderRadius: "12px",
                  backgroundColor: "#10B981",
                  color: "white",
                  border: "none",
                  fontSize: "14px",
                  fontWeight: 700,
                  cursor: "pointer",
                  boxShadow: "0 4px 12px rgba(16,185,129,0.25)",
                }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLButtonElement).style.opacity = "0.9")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLButtonElement).style.opacity = "1")
                }
              >
                <Plus size={18} />
                Add Employee
              </button>
            </>
          )}
        </div>
      </div>

      {/* Filters (Sticky) */}
      <div
        className="sticky top-0 z-20 rounded-2xl p-4 mb-6 shadow-sm"
        style={{
          backgroundColor: "var(--card)",
          border: "1px solid var(--border)",
          backdropFilter: "blur(12px)",
        }}
      >
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <div
              className="flex items-center gap-3 flex-1 rounded-xl px-4 relative"
              style={{
                backgroundColor: "var(--background)",
                border: "1px solid var(--border)",
                height: "44px",
              }}
            >
              <Search size={18} color="var(--muted-foreground)" />
              <input
                ref={searchInputRef}
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Search by name, email, employee ID..."
                style={{
                  border: "none",
                  outline: "none",
                  background: "transparent",
                  fontSize: "14px",
                  color: "var(--foreground)",
                  width: "100%",
                  paddingRight: "28px",
                }}
              />
              <kbd
                className="absolute right-4 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-[10px] font-sans font-bold rounded border pointer-events-none select-none"
                style={{
                  borderColor: "var(--border)",
                  backgroundColor: "var(--card)",
                  color: "var(--muted-foreground)",
                }}
              >
                /
              </kbd>
            </div>

            <div
              className="flex items-center gap-3"
              style={{
                borderLeft: "1px solid var(--border)",
                paddingLeft: "16px",
              }}
            >
              <span
                style={{
                  color: "var(--muted-foreground)",
                  fontSize: "13px",
                  fontWeight: 500,
                  whiteSpace: "nowrap",
                }}
              >
                Showing{" "}
                <span style={{ color: "var(--foreground)", fontWeight: 700 }}>
                  {filtered.length}
                </span>{" "}
                of{" "}
                <span style={{ color: "var(--foreground)", fontWeight: 700 }}>
                  {employees.length}
                </span>{" "}
                employees
              </span>
              <div
                className="flex items-center gap-1 ml-3"
                style={{
                  backgroundColor: "var(--background)",
                  padding: "4px",
                  borderRadius: "10px",
                  border: "1px solid var(--border)",
                }}
              >
                <button
                  onClick={() => setView("table")}
                  className="p-1.5 rounded-lg transition-colors"
                  style={{
                    backgroundColor:
                      view === "table" ? "var(--secondary)" : "transparent",
                    color:
                      view === "table"
                        ? "var(--primary)"
                        : "var(--muted-foreground)",
                  }}
                  title="Table View"
                >
                  <List size={18} />
                </button>
                <button
                  onClick={() => setView("grid")}
                  className="p-1.5 rounded-lg transition-colors"
                  style={{
                    backgroundColor:
                      view === "grid" ? "var(--secondary)" : "transparent",
                    color:
                      view === "grid"
                        ? "var(--primary)"
                        : "var(--muted-foreground)",
                  }}
                  title="Grid View"
                >
                  <LayoutGrid size={18} />
                </button>
                <button
                  onClick={() => setView("team")}
                  className="p-1.5 rounded-lg transition-colors"
                  style={{
                    backgroundColor:
                      view === "team" ? "var(--secondary)" : "transparent",
                    color:
                      view === "team"
                        ? "var(--primary)"
                        : "var(--muted-foreground)",
                  }}
                  title="Team View"
                >
                  <Users size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* Active filter chips */}
          {activeChips.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mt-1">
              <span className="text-[12px] font-bold text-muted-foreground mr-1">
                Active filters:
              </span>
              {activeChips.map((chip) => (
                <div
                  key={chip.id}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-semibold border transition-all hover:bg-secondary/80"
                  style={{
                    backgroundColor: "var(--background)",
                    borderColor: "var(--border)",
                    color: "var(--foreground)",
                  }}
                >
                  <span>{chip.label}</span>
                  <button
                    onClick={chip.onClear}
                    className="p-0.5 rounded-full hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
              <button
                onClick={clearFilters}
                className="text-[12px] font-bold text-red-500 hover:text-red-600 transition-colors ml-2 py-1 px-2 rounded-lg hover:bg-red-500/5"
              >
                Clear all
              </button>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div
              className="flex flex-wrap items-center gap-3 pb-1"
              style={{ overflow: "visible" }}
            >
              <FilterChip
                value={selectedDept}
                options={departments}
                onChange={setSelectedDept}
              />
              <FilterChip
                value={selectedDesignation}
                options={uniqueDesignations}
                onChange={setSelectedDesignation}
              />
              <FilterChip
                value={selectedLocation}
                options={uniqueLocations}
                onChange={setSelectedLocation}
              />

              {/* Employment Type Multi-Select */}
              <div className="relative shrink-0">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowTypeDropdown(!showTypeDropdown);
                  }}
                  className="flex items-center gap-2 appearance-none pl-4 pr-3 py-2 rounded-xl text-[13px] font-medium outline-none cursor-pointer transition-colors"
                  style={{
                    backgroundColor: "var(--background)",
                    border: "1px solid var(--border)",
                    color: "var(--foreground)",
                  }}
                >
                  Emp. Type{" "}
                  {selectedTypes.length > 0 && (
                    <span
                      className="ml-1 px-1.5 rounded-md text-[11px]"
                      style={{
                        backgroundColor: "var(--secondary)",
                        color: "var(--primary)",
                      }}
                    >
                      {selectedTypes.length}
                    </span>
                  )}
                  <ChevronDown
                    size={14}
                    style={{ color: "var(--muted-foreground)" }}
                  />
                </button>
                {showTypeDropdown && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowTypeDropdown(false);
                      }}
                    ></div>
                    <div
                      className="absolute top-full left-0 mt-1 w-48 rounded-xl shadow-xl z-20 py-2"
                      style={{
                        backgroundColor: "var(--card)",
                        border: "1px solid var(--border)",
                      }}
                      onClick={(e: React.MouseEvent) => e.stopPropagation()}
                      onMouseDown={(e: React.MouseEvent) => e.stopPropagation()}
                    >
                      {uniqueTypes.map((t) => (
                        <label
                          key={t}
                          className="flex items-center gap-3 px-4 py-2 cursor-pointer transition-colors"
                          style={{ color: "var(--foreground)" }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.backgroundColor =
                              "var(--background)")
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.backgroundColor =
                              "transparent")
                          }
                        >
                          <input
                            type="checkbox"
                            checked={selectedTypes.includes(t)}
                            onChange={() => {
                              toggleType(t);
                              setPage(1);
                            }}
                            className="rounded focus:ring-emerald-500"
                            style={{ accentColor: "var(--primary)" }}
                          />
                          <span style={{ fontSize: "13px" }}>{t}</span>
                        </label>
                      ))}
                    </div>
                  </>
                )}
              </div>

              <div
                className="w-px h-6 mx-2 shrink-0"
                style={{ backgroundColor: "var(--border)" }}
              ></div>

              <div
                className="flex items-center p-1 rounded-xl shrink-0"
                style={{
                  backgroundColor: "var(--background)",
                  border: "1px solid var(--border)",
                }}
              >
                {["All", "Active", "Inactive"].map((s) => (
                  <button
                    key={s}
                    onClick={() => {
                      setSelectedStatus(s === "All" ? "All Status" : s);
                      setPage(1);
                    }}
                    className="px-4 py-1.5 rounded-lg text-[13px] font-medium transition-colors"
                    style={{
                      backgroundColor:
                        selectedStatus === s ||
                        (s === "All" && selectedStatus === "All Status")
                          ? "var(--card)"
                          : "transparent",
                      color:
                        selectedStatus === s ||
                        (s === "All" && selectedStatus === "All Status")
                          ? "var(--foreground)"
                          : "var(--muted-foreground)",
                      boxShadow:
                        selectedStatus === s ||
                        (s === "All" && selectedStatus === "All Status")
                          ? "0 2px 4px rgba(0,0,0,0.05)"
                          : "none",
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedRows.length > 0 && (
        <div
          className="sticky z-30 flex items-center justify-between px-5 py-3 mb-4 rounded-xl shadow-md transition-all"
          style={{
            top: "140px",
            backgroundColor: "var(--card)",
            border: "1px solid var(--primary)",
          }}
        >
          <span
            style={{
              color: "var(--foreground)",
              fontWeight: 700,
              fontSize: "14px",
            }}
          >
            {selectedRows.length} employees selected
          </span>
          <div className="flex items-center gap-3">
            <button
              className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors hover:opacity-80 active:scale-95"
              style={{
                border: "1px solid var(--primary)",
                color: "var(--primary)",
                backgroundColor: "transparent",
                fontSize: "13px",
                fontWeight: 600,
              }}
            >
              <Send size={14} /> Send Email
            </button>
            <button
              className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors hover:opacity-80 active:scale-95"
              style={{
                border: "1px solid var(--primary)",
                color: "var(--primary)",
                backgroundColor: "transparent",
                fontSize: "13px",
                fontWeight: 600,
              }}
            >
              <Download size={14} /> Export
            </button>
            <button
              className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors hover:opacity-80 active:scale-95"
              style={{
                border: "1px solid var(--primary)",
                color: "var(--primary)",
                backgroundColor: "transparent",
                fontSize: "13px",
                fontWeight: 600,
              }}
            >
              <UserCheck size={14} /> Assign Manager
            </button>
            <button
              className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors hover:opacity-80 active:scale-95"
              style={{
                border: "1px solid #EF4444",
                color: "#EF4444",
                backgroundColor: "transparent",
                fontSize: "13px",
                fontWeight: 600,
              }}
            >
              <Ban size={14} /> Deactivate
            </button>
          </div>
        </div>
      )}

      {/* Main View */}
      {filtered.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center py-20 px-4 rounded-2xl border border-dashed text-center"
          style={{
            backgroundColor: "var(--card)",
            borderColor: "var(--border)",
          }}
        >
          <div
            className="flex items-center justify-center w-16 h-16 rounded-full mb-4"
            style={{ backgroundColor: "var(--secondary)" }}
          >
            <Search size={28} style={{ color: "var(--muted-foreground)" }} />
          </div>
          <h3
            className="text-[18px] font-black mb-1"
            style={{ color: "var(--foreground)" }}
          >
            No employees found
          </h3>
          <p
            className="text-[14px] max-w-sm mb-6"
            style={{ color: "var(--muted-foreground)", lineHeight: 1.6 }}
          >
            Try adjusting your search or filters to find what you're looking
            for.
          </p>
          <button
            onClick={clearFilters}
            className="px-5 py-2.5 rounded-xl font-bold text-sm text-white transition-all hover:opacity-90 active:scale-95 shadow-md"
            style={{
              backgroundColor: "#10B981",
              boxShadow: "0 4px 12px rgba(16,185,129,0.25)",
            }}
          >
            Clear all filters
          </button>
        </div>
      ) : view === "table" ? (
        <div
          className="rounded-2xl overflow-x-auto shadow-sm"
          style={{
            backgroundColor: "var(--card)",
            border: "1px solid var(--border)",
          }}
        >
          <div style={{ minWidth: "1150px" }}>
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
                    selectedRows.length === paginated.length &&
                    paginated.length > 0
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
                  onClick={() => handleSort(col.key)}
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
                  <HighlightText
                    text={emp.designation}
                    search={debouncedSearch}
                  />
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
                <div className="relative flex justify-end pr-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActionMenuRow(
                        actionMenuRow === emp.id ? null : emp.id,
                      );
                    }}
                    className="p-1.5 rounded-lg transition-colors"
                    style={{ color: "var(--muted-foreground)" }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor =
                        "var(--secondary)";
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
                      className="absolute right-0 top-full mt-1 w-44 rounded-xl shadow-xl border z-30 py-1"
                      style={{
                        backgroundColor: "var(--card)",
                        borderColor: "var(--border)",
                      }}
                    >
                      <button
                        className="w-full text-left px-4 py-2 text-[13px] font-medium transition-colors"
                        style={{ color: "var(--foreground)" }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.backgroundColor =
                            "var(--background)")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.backgroundColor =
                            "transparent")
                        }
                        onClick={() => navigate(`/employees/${emp.id}`)}
                      >
                        View Profile
                      </button>
                      {canManage && (
                        <button
                          className="w-full text-left px-4 py-2 text-[13px] font-medium transition-colors"
                          style={{ color: "var(--foreground)" }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.backgroundColor =
                              "var(--background)")
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.backgroundColor =
                              "transparent")
                          }
                          onClick={() => {
                            setEditEmployee(emp);
                            setActionMenuRow(null);
                          }}
                        >
                          Edit Employee
                        </button>
                      )}
                      <button
                        className="w-full text-left px-4 py-2 text-[13px] font-medium transition-colors"
                        style={{ color: "var(--foreground)" }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.backgroundColor =
                            "var(--background)")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.backgroundColor =
                            "transparent")
                        }
                        onClick={() => window.open(`mailto:${emp.email}`)}
                      >
                        Send Message
                      </button>
                      {canManage && (
                        <>
                          <div
                            className="h-px my-1 w-full"
                            style={{ backgroundColor: "var(--border)" }}
                          ></div>
                          <button
                            className="w-full text-left px-4 py-2 text-[13px] font-medium text-red-500 transition-colors hover:bg-red-50"
                            onClick={() => {
                              setDeleteEmployee(emp);
                              setActionMenuRow(null);
                            }}
                          >
                            Deactivate
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : view === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {paginated.map((emp) => (
            <div
              key={emp.id}
              className="relative group rounded-2xl p-5 transition-all duration-300 overflow-hidden cursor-pointer"
              style={{
                backgroundColor: "var(--card)",
                border: "1px solid var(--border)",
              }}
              onClick={() => navigate(`/employees/${emp.id}`)}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow =
                  "0 12px 24px -8px rgba(0,0,0,0.15)";
                e.currentTarget.style.borderColor = "var(--primary)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "none";
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.borderColor = "var(--border)";
              }}
            >
              <div className="absolute top-4 right-4 z-10">
                <span
                  className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-bold"
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
              <div className="flex flex-col items-center mt-2 mb-4 relative z-10">
                <img
                  src={emp.avatar || ""}
                  className="w-20 h-20 rounded-full object-cover border-[3px]"
                  style={{ borderColor: "var(--background)" }}
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                    const fallback = document.createElement("div");
                    fallback.className =
                      "w-20 h-20 rounded-full flex items-center justify-center text-[24px] font-bold shrink-0 border-[3px]";
                    fallback.style.borderColor = "var(--background)";
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
                <h3
                  className="mt-4 text-[16px] font-bold"
                  style={{ color: "var(--foreground)" }}
                >
                  <HighlightText text={emp.name} search={debouncedSearch} />
                </h3>
                <p
                  className="text-[13px] mb-3 text-center px-2"
                  style={{ color: "var(--muted-foreground)" }}
                >
                  <HighlightText
                    text={emp.designation}
                    search={debouncedSearch}
                  />
                </p>
                <span
                  className="px-2.5 py-1 rounded-full text-[11px] font-bold"
                  style={{
                    backgroundColor: `${deptColors[emp.department] || "#6B7280"}15`,
                    color: deptColors[emp.department] || "var(--foreground)",
                  }}
                >
                  {emp.department}
                </span>
              </div>

              <div
                className="flex items-center justify-center gap-1.5 mb-5 text-[12px] relative z-10"
                style={{ color: "var(--muted-foreground)" }}
              >
                <MapPin size={14} /> {emp.location}
              </div>

              <div
                className="flex items-center justify-center gap-3 pt-4 relative z-10"
                style={{ borderTop: "1px solid var(--border)" }}
              >
                <button
                  className="p-2.5 rounded-full transition-colors hover:scale-105 active:scale-95"
                  style={{
                    backgroundColor: "var(--background)",
                    color: "var(--muted-foreground)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "var(--secondary)";
                    e.currentTarget.style.color = "var(--primary)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "var(--background)";
                    e.currentTarget.style.color = "var(--muted-foreground)";
                  }}
                  title="Email"
                  onClick={() => window.open(`mailto:${emp.email}`)}
                >
                  <Mail size={16} />
                </button>
                <button
                  className="p-2.5 rounded-full transition-colors hover:scale-105 active:scale-95"
                  style={{
                    backgroundColor: "var(--background)",
                    color: "var(--muted-foreground)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "var(--secondary)";
                    e.currentTarget.style.color = "var(--primary)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "var(--background)";
                    e.currentTarget.style.color = "var(--muted-foreground)";
                  }}
                  title="Phone"
                >
                  <Phone size={16} />
                </button>
                <button
                  className="p-2.5 rounded-full transition-colors hover:scale-105 active:scale-95"
                  style={{
                    backgroundColor: "var(--background)",
                    color: "var(--muted-foreground)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "var(--secondary)";
                    e.currentTarget.style.color = "var(--primary)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "var(--background)";
                    e.currentTarget.style.color = "var(--muted-foreground)";
                  }}
                  title="LinkedIn"
                >
                  <Linkedin size={16} />
                </button>
              </div>

              {/* Expandable View Profile Button */}
              <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-all duration-300 ease-in-out">
                <div className="overflow-hidden">
                  <div className="pt-4">
                    <button
                      onClick={() => navigate(`/employees/${emp.id}`)}
                      className="w-full py-2.5 rounded-xl font-bold text-white shadow-md hover:opacity-90 active:scale-95 transition-all"
                      style={{ backgroundColor: "var(--primary)" }}
                    >
                      View Profile
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : view === "team" ? (
        <div className="flex flex-col gap-6">
          {Array.from(new Set(paginated.map((e) => e.department))).map(
            (dept) => (
              <div
                key={dept}
                className="rounded-2xl p-6 shadow-sm transition-colors"
                style={{
                  backgroundColor: "var(--card)",
                  border: "1px solid var(--border)",
                }}
              >
                <div className="flex items-center justify-between mb-5">
                  <h3
                    className="text-[18px] font-bold"
                    style={{ color: "var(--foreground)" }}
                  >
                    {dept} Team
                  </h3>
                  <span
                    className="px-3 py-1 rounded-full text-[12px] font-bold"
                    style={{
                      backgroundColor: `${deptColors[dept] || "#6B7280"}15`,
                      color: deptColors[dept] || "var(--foreground)",
                    }}
                  >
                    {paginated.filter((e) => e.department === dept).length}{" "}
                    Members
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {paginated
                    .filter((e) => e.department === dept)
                    .map((emp) => (
                      <div
                        key={emp.id}
                        className="flex items-center gap-3 p-3 rounded-xl transition-all duration-200 hover:-translate-y-[2px] hover:border-[#00B87C] hover:shadow-[0_0_15px_rgba(0,184,124,0.3)] cursor-pointer group"
                        style={{
                          border: "1px solid var(--border)",
                          backgroundColor: "var(--background)",
                        }}
                        onClick={() => navigate(`/employees/${emp.id}`)}
                      >
                        <img
                          src={emp.avatar || ""}
                          className="w-11 h-11 rounded-full object-cover border"
                          style={{ borderColor: "var(--border)" }}
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                            const fallback = document.createElement("div");
                            fallback.className =
                              "w-11 h-11 rounded-full flex items-center justify-center text-[12px] font-bold shrink-0";
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
                        <div className="flex-1 min-w-0">
                          <p
                            className="font-bold text-[14px] truncate transition-colors group-hover:text-emerald-600"
                            style={{ color: "var(--foreground)" }}
                          >
                            <HighlightText
                              text={emp.name}
                              search={debouncedSearch}
                            />
                          </p>
                          <p
                            className="text-[12px] truncate"
                            style={{ color: "var(--muted-foreground)" }}
                          >
                            <HighlightText
                              text={emp.designation}
                              search={debouncedSearch}
                            />
                          </p>
                        </div>
                        <div className="shrink-0 flex flex-col items-end gap-1.5">
                          <span
                            className="w-2.5 h-2.5 rounded-full inline-block"
                            style={{
                              backgroundColor: statusConfig[emp.status]?.dot,
                            }}
                            title={emp.status}
                          ></span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ),
          )}
        </div>
      ) : null}

      {/* Pagination */}
      {totalPages > 0 && (
        <div className="flex items-center justify-between mt-6 px-2">
          <p style={{ color: "var(--muted-foreground)", fontSize: "14px" }}>
            Showing{" "}
            <span style={{ color: "var(--foreground)", fontWeight: 700 }}>
              {filtered.length === 0 ? 0 : (page - 1) * ROWS_PER_PAGE + 1}–
              {Math.min(page * ROWS_PER_PAGE, filtered.length)}
            </span>{" "}
            of{" "}
            <span style={{ color: "var(--foreground)", fontWeight: 700 }}>
              {filtered.length}
            </span>{" "}
            employees
          </p>
          {totalPages > 1 && (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="flex items-center justify-center w-9 h-9 rounded-xl transition-colors"
                style={{
                  border: "1px solid var(--border)",
                  color:
                    page === 1
                      ? "var(--muted-foreground)"
                      : "var(--foreground)",
                  backgroundColor:
                    page === 1 ? "var(--background)" : "var(--card)",
                  cursor: page === 1 ? "not-allowed" : "pointer",
                  opacity: page === 1 ? 0.5 : 1,
                }}
              >
                <ChevronLeft size={16} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className="w-9 h-9 rounded-xl transition-colors"
                  style={{
                    border: page === p ? "none" : "1px solid var(--border)",
                    color: page === p ? "white" : "var(--foreground)",
                    backgroundColor:
                      page === p ? "var(--primary)" : "var(--card)",
                    fontSize: "13px",
                    fontWeight: page === p ? 700 : 500,
                    cursor: "pointer",
                    boxShadow:
                      page === p
                        ? "0 4px 10px rgba(16, 185, 129, 0.25)"
                        : "none",
                  }}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="flex items-center justify-center w-9 h-9 rounded-xl transition-colors"
                style={{
                  border: "1px solid var(--border)",
                  color:
                    page === totalPages
                      ? "var(--muted-foreground)"
                      : "var(--foreground)",
                  backgroundColor:
                    page === totalPages ? "var(--background)" : "var(--card)",
                  cursor: page === totalPages ? "not-allowed" : "pointer",
                  opacity: page === totalPages ? 0.5 : 1,
                }}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      )}

      {showAddModal && (
        <AddEmployeeModal
          onClose={() => setShowAddModal(false)}
          onAdd={(emp) => {
            addEmployee({ ...emp, salary: Number(emp.salary) } as any);
            setShowAddModal(false);
          }}
        />
      )}
      {showImportModal && (
        <BulkImportModal
          onClose={() => setShowImportModal(false)}
          onImport={(emps) => {
            bulkImportEmployees(emps);
            setShowImportModal(false);
          }}
        />
      )}
      {editEmployee && (
        <EditEmployeeModal
          employee={editEmployee}
          onClose={() => setEditEmployee(null)}
          onSave={(id, updated) => {
            updateEmployee(id, {
              ...updated,
              salary: updated.salary ? Number(updated.salary) : undefined,
            } as any);
            setEditEmployee(null);
          }}
        />
      )}
      {deleteEmployee && (
        <DeleteConfirmModal
          employee={deleteEmployee}
          onClose={() => setDeleteEmployee(null)}
          onConfirm={() => {
            removeEmployee(deleteEmployee.id);
            setDeleteEmployee(null);
          }}
        />
      )}
    </div>
  );
}
