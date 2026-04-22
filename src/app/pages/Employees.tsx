import { useState } from "react";
import { useNavigate } from "react-router";
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
  Ban
} from "lucide-react";
import { employees } from "../data/mockData";

const ROWS_PER_PAGE = 12;

const departments = ["All Departments", "Engineering", "Marketing", "Design", "Finance", "HR", "Product", "Sales", "Operations"];
// const statuses = ["All Status", "Active", "Inactive", "On Leave"];

/* ─── Add Employee Modal ─────────────────── */
function AddEmployeeModal({ onClose }: { onClose: () => void }) {
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.45)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl overflow-hidden shadow-2xl"
        style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div
          className="flex items-center justify-between px-8 py-7"
          style={{ borderBottom: "1px solid var(--border)", background: "var(--card)" }}
        >
          <div>
            <h3 style={{ color: "var(--foreground)", fontSize: "22px", fontWeight: 800, letterSpacing: "-0.5px" }}>
              Add New Employee
            </h3>
            <p style={{ color: "var(--muted-foreground)", fontSize: "14px", marginTop: "2px" }}>
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
        <div className="px-8 py-8 overflow-y-auto" style={{ maxHeight: "70vh" }}>
          <div className="grid grid-cols-2 gap-6">
            {/* Name */}
            <div className="col-span-2">
              <label style={{ color: "var(--foreground)", fontSize: "14px", fontWeight: 700, display: "block", marginBottom: "8px", opacity: 0.9 }}>
                Full Name
              </label>
              <div className="relative">
                <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
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
              <label style={{ color: "var(--foreground)", fontSize: "14px", fontWeight: 700, display: "block", marginBottom: "8px", opacity: 0.9 }}>
                Email Address
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
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
              <label style={{ color: "var(--foreground)", fontSize: "14px", fontWeight: 700, display: "block", marginBottom: "8px", opacity: 0.9 }}>
                Department
              </label>
              <div className="relative">
                <Briefcase size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <select
                  className="w-full rounded-2xl pl-11 pr-4 py-3.5 text-sm outline-none appearance-none focus:ring-2 focus:ring-emerald-500/20"
                  style={{
                    border: "1px solid var(--border)",
                    backgroundColor: "var(--background)",
                    color: "var(--foreground)",
                  }}
                  value={form.department}
                  onChange={(e) => setForm({ ...form, department: e.target.value })}
                >
                  {departments.slice(1).map((d) => (
                    <option key={d} style={{ backgroundColor: "var(--card)", color: "var(--foreground)" }}>{d}</option>
                  ))}
                </select>
                <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Designation */}
            <div>
              <label style={{ color: "var(--foreground)", fontSize: "14px", fontWeight: 700, display: "block", marginBottom: "8px", opacity: 0.9 }}>
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
                onChange={(e) => setForm({ ...form, designation: e.target.value })}
              />
            </div>

            {/* Salary */}
            <div>
              <label style={{ color: "var(--foreground)", fontSize: "14px", fontWeight: 700, display: "block", marginBottom: "8px", opacity: 0.9 }}>
                Annual Salary (₹)
              </label>
              <div className="relative">
                <IndianRupee size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
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
              <label style={{ color: "var(--foreground)", fontSize: "14px", fontWeight: 700, display: "block", marginBottom: "8px", opacity: 0.9 }}>
                Joining Date
              </label>
              <div className="relative">
                <CalendarIcon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="date"
                  className="w-full rounded-2xl pl-11 pr-4 py-3.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500/20"
                  style={{
                    border: "1px solid var(--border)",
                    backgroundColor: "var(--background)",
                    color: "var(--foreground)",
                  }}
                  value={form.joinDate}
                  onChange={(e) => setForm({ ...form, joinDate: e.target.value })}
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
            style={{ backgroundColor: "var(--secondary)", color: "var(--primary)", border: "none" }}
          >
            Cancel
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-3.5 rounded-2xl text-sm font-bold text-white transition-all hover:opacity-90 active:scale-95"
            style={{
              background: "#10B981",
              border: "none"
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
function EditEmployeeModal({ employee, onClose }: { employee: typeof import("../data/mockData").employees[0]; onClose: () => void }) {
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.45)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl overflow-hidden shadow-2xl"
        style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-8 py-6"
          style={{ borderBottom: "1px solid var(--border)", background: "linear-gradient(135deg,#ECFDF5 0%,#F0FDFA 100%)" }}
        >
          <div className="flex items-center gap-3">
            <div
              style={{ width: "40px", height: "40px", borderRadius: "50%", overflow: "hidden", border: "2px solid #10B981", flexShrink: 0 }}
            >
              <img src={employee.avatar} alt={employee.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
            <div>
              <h3 style={{ color: "#0F3047", fontSize: "18px", fontWeight: 800, letterSpacing: "-0.4px" }}>Edit Employee</h3>
              <p style={{ color: "#6B8C7A", fontSize: "12px", marginTop: "1px" }}>{employee.id} · {employee.role}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl transition-colors"
            style={{ color: "var(--muted-foreground)" }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.backgroundColor = "var(--secondary)")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent")}
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="px-8 py-6 overflow-y-auto" style={{ maxHeight: "65vh" }}>
          <div className="grid grid-cols-2 gap-5">
            {/* Name */}
            <div className="col-span-2">
              <label style={{ color: "#374151", fontSize: "13px", fontWeight: 700, display: "block", marginBottom: "6px" }}>Full Name</label>
              <div className="relative">
                <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  className="w-full rounded-xl pl-10 pr-4 py-3 text-sm outline-none"
                  style={{ border: "1px solid var(--border)", backgroundColor: "var(--background)", color: "var(--foreground)" }}
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
            </div>

            {/* Email */}
            <div className="col-span-2">
              <label style={{ color: "#374151", fontSize: "13px", fontWeight: 700, display: "block", marginBottom: "6px" }}>Email Address</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  className="w-full rounded-xl pl-10 pr-4 py-3 text-sm outline-none"
                  style={{ border: "1px solid var(--border)", backgroundColor: "var(--background)", color: "var(--foreground)" }}
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
            </div>

            {/* Department */}
            <div>
              <label style={{ color: "#374151", fontSize: "13px", fontWeight: 700, display: "block", marginBottom: "6px" }}>Department</label>
              <div className="relative">
                <Briefcase size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <select
                  className="w-full rounded-xl pl-10 pr-4 py-3 text-sm outline-none appearance-none"
                  style={{ border: "1px solid var(--border)", backgroundColor: "var(--background)", color: "var(--foreground)" }}
                  value={form.department}
                  onChange={(e) => setForm({ ...form, department: e.target.value })}
                >
                  {departments.slice(1).map((d) => <option key={d}>{d}</option>)}
                </select>
                <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Status */}
            <div>
              <label style={{ color: "#374151", fontSize: "13px", fontWeight: 700, display: "block", marginBottom: "6px" }}>Status</label>
              <div className="relative">
                <select
                  className="w-full rounded-xl px-4 py-3 text-sm outline-none appearance-none"
                  style={{ border: "1px solid var(--border)", backgroundColor: "var(--background)", color: "var(--foreground)" }}
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                >
                  {["Active", "Inactive", "On Leave"].map((s) => <option key={s}>{s}</option>)}
                </select>
                <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Designation */}
            <div className="col-span-2">
              <label style={{ color: "#374151", fontSize: "13px", fontWeight: 700, display: "block", marginBottom: "6px" }}>Designation</label>
              <input
                className="w-full rounded-xl px-4 py-3 text-sm outline-none"
                style={{ border: "1px solid var(--border)", backgroundColor: "var(--background)", color: "var(--foreground)" }}
                value={form.designation}
                onChange={(e) => setForm({ ...form, designation: e.target.value })}
              />
            </div>

            <div>
              <label style={{ color: "#374151", fontSize: "13px", fontWeight: 700, display: "block", marginBottom: "6px" }}>Annual Salary (₹)</label>
              <div className="relative">
                <IndianRupee size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="number"
                  className="w-full rounded-xl pl-10 pr-4 py-3 text-sm outline-none"
                  style={{ border: "1px solid var(--border)", backgroundColor: "var(--background)", color: "var(--foreground)" }}
                  value={form.salary}
                  onChange={(e) => setForm({ ...form, salary: e.target.value })}
                />
              </div>
            </div>

            {/* Join Date */}
            <div>
              <label style={{ color: "#374151", fontSize: "13px", fontWeight: 700, display: "block", marginBottom: "6px" }}>Joining Date</label>
              <div className="relative">
                <CalendarIcon size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="date"
                  className="w-full rounded-xl pl-10 pr-4 py-3 text-sm outline-none"
                  style={{ border: "1px solid var(--border)", backgroundColor: "var(--background)", color: "var(--foreground)" }}
                  value={form.joinDate}
                  onChange={(e) => setForm({ ...form, joinDate: e.target.value })}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-5 flex gap-3" style={{ borderTop: "1px solid var(--border)" }}>
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl text-sm font-bold transition-all"
            style={{ backgroundColor: "var(--secondary)", color: "var(--primary)", border: "none" }}
          >
            Cancel
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90"
            style={{ background: "#10B981", border: "none", boxShadow: "0 4px 12px rgba(16,185,129,0.35)" }}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Delete Confirm Modal ───────────────── */
function DeleteConfirmModal({ employee, onClose }: { employee: typeof import("../data/mockData").employees[0]; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl"
        style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Red header accent */}
        <div style={{ height: "4px", background: "linear-gradient(90deg,#EF4444,#DC2626)" }} />

        <div className="px-7 py-7">
          {/* Warning icon */}
          <div
            className="flex items-center justify-center w-14 h-14 rounded-full mx-auto mb-5"
            style={{ backgroundColor: "rgba(239,68,68,0.1)" }}
          >
            <Trash2 size={24} color="#EF4444" />
          </div>

          <h3 style={{ color: "var(--foreground)", fontSize: "18px", fontWeight: 800, textAlign: "center", marginBottom: "8px" }}>
            Delete Employee
          </h3>
          <p style={{ color: "var(--muted-foreground)", fontSize: "13px", textAlign: "center", lineHeight: 1.6 }}>
            Are you sure you want to delete{" "}
            <span style={{ color: "var(--foreground)", fontWeight: 700 }}>{employee.name}</span>?
            <br />
            <span style={{ fontSize: "12px" }}>This action cannot be undone.</span>
          </p>

          {/* Employee preview card */}
          <div
            className="flex items-center gap-3 rounded-xl p-3 mt-5"
            style={{ backgroundColor: "var(--background)", border: "1px solid var(--border)" }}
          >
            <div style={{ width: "38px", height: "38px", borderRadius: "50%", overflow: "hidden", border: "2px solid rgba(239,68,68,0.3)", flexShrink: 0 }}>
              <img src={employee.avatar} alt={employee.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
            <div>
              <p style={{ color: "var(--foreground)", fontSize: "13px", fontWeight: 700, margin: 0 }}>{employee.name}</p>
              <p style={{ color: "var(--muted-foreground)", fontSize: "11px", margin: 0 }}>{employee.designation} · {employee.department}</p>
            </div>
            <span
              className="ml-auto px-2.5 py-1 rounded-full text-[10px] font-bold"
              style={{
                backgroundColor: employee.status === "Active" ? "var(--secondary)" : employee.status === "On Leave" ? "rgba(245,158,11,0.1)" : "rgba(239,68,68,0.1)",
                color: employee.status === "Active" ? "var(--primary)" : employee.status === "On Leave" ? "#F59E0B" : "#EF4444",
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
            style={{ backgroundColor: "var(--secondary)", color: "var(--foreground)", border: "none" }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.opacity = "0.8")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.opacity = "1")}
          >
            Cancel
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90"
            style={{ background: "linear-gradient(135deg,#EF4444,#DC2626)", border: "none", boxShadow: "0 4px 14px rgba(239,68,68,0.35)" }}
          >
            Yes, Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export function Employees() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [selectedDept, setSelectedDept] = useState("All Departments");
  const [selectedStatus, setSelectedStatus] = useState("All Status");
  const [selectedDesignation, setSelectedDesignation] = useState("All Designations");
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
  const [editEmployee, setEditEmployee] = useState<typeof employees[0] | null>(null);
  const [deleteEmployee, setDeleteEmployee] = useState<typeof employees[0] | null>(null);

  const uniqueDesignations = ["All Designations", ...Array.from(new Set(employees.map((e) => e.designation)))];
  const uniqueLocations = ["All Locations", ...Array.from(new Set(employees.map((e) => e.location)))];
  const uniqueTypes = Array.from(new Set(employees.map((e) => e.employmentType)));

  const filtered = employees.filter((emp) => {
    const matchSearch =
      emp.name.toLowerCase().includes(search.toLowerCase()) ||
      emp.id.toLowerCase().includes(search.toLowerCase()) ||
      emp.email.toLowerCase().includes(search.toLowerCase());
    const matchDept = selectedDept === "All Departments" || emp.department === selectedDept;
    const matchStatus = selectedStatus === "All Status" || emp.status === selectedStatus;
    const matchDesig = selectedDesignation === "All Designations" || emp.designation === selectedDesignation;
    const matchLoc = selectedLocation === "All Locations" || emp.location === selectedLocation;
    const matchType = selectedTypes.length === 0 || selectedTypes.includes(emp.employmentType);
    return matchSearch && matchDept && matchStatus && matchDesig && matchLoc && matchType;
  });

  // Sort
  const sorted = [...filtered].sort((a, b) => {
     let valA = (a as Record<string, string | number>)[sortCol];
     let valB = (b as Record<string, string | number>)[sortCol];
     if (typeof valA === "string") valA = valA.toLowerCase();
     if (typeof valB === "string") valB = valB.toLowerCase();
     if (valA < valB) return sortDesc ? 1 : -1;
     if (valA > valB) return sortDesc ? -1 : 1;
     return 0;
  });

  const totalPages = Math.ceil(sorted.length / ROWS_PER_PAGE);
  const paginated = sorted.slice((page - 1) * ROWS_PER_PAGE, page * ROWS_PER_PAGE);

  const toggleRowSelection = (id: string) => {
    setSelectedRows((prev) => prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]);
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
        setSelectedTypes(selectedTypes.filter(t => t !== type));
     } else {
        setSelectedTypes([...selectedTypes, type]);
     }
  };

  const handleSort = (col: string) => {
     if (sortCol === col) {
        setSortDesc(!sortDesc);
     } else {
        setSortCol(col);
        setSortDesc(false);
     }
  };

  const statusConfig: Record<string, { bg: string; color: string; dot: string }> = {
    Active: { bg: "rgba(16, 185, 129, 0.1)", color: "#10B981", dot: "#10B981" },
    Inactive: { bg: "rgba(107, 114, 128, 0.1)", color: "#6B7280", dot: "#6B7280" },
    "On Leave": { bg: "rgba(245, 158, 11, 0.1)", color: "#F59E0B", dot: "#F59E0B" },
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

  const FilterChip = ({ value, options, onChange }: { value: string, options: string[], onChange: (v: string) => void }) => (
    <div className="relative group shrink-0">
      <select
        value={value}
        onChange={(e) => { onChange(e.target.value); setPage(1); }}
        className="appearance-none pl-4 pr-9 py-2 rounded-xl text-[13px] font-medium outline-none cursor-pointer transition-colors"
        style={{ backgroundColor: "var(--background)", border: "1px solid var(--border)", color: "var(--foreground)" }}
      >
        {options.map((opt: string) => (
          <option key={opt} value={opt} style={{ backgroundColor: "var(--card)", color: "var(--foreground)" }}>{opt}</option>
        ))}
      </select>
      <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "var(--muted-foreground)" }} />
    </div>
  );

  const gridCols = "40px 2.5fr 1.5fr 1.2fr 1.2fr 1.5fr 1.2fr 1fr 1fr 40px";

  return (
    <div style={{ maxWidth: "1400px", margin: "0 auto", paddingBottom: "40px" }} onClick={() => setActionMenuRow(null)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1 text-[12px] font-medium">
            <span style={{ color: "var(--primary)", cursor: "pointer" }} onClick={() => navigate("/")}>Dashboard</span>
            <ChevronRight size={12} style={{ color: "var(--muted-foreground)" }} />
            <span style={{ color: "var(--muted-foreground)" }}>Employees</span>
          </div>
          <h1 style={{ color: "var(--foreground)", fontSize: "28px", fontWeight: 800, letterSpacing: "-0.5px" }}>
            Employees
          </h1>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 rounded-xl px-5 transition-all hover:opacity-90 active:scale-95"
          style={{
            height: "44px",
            backgroundColor: "var(--primary)",
            color: "white",
            fontSize: "14px",
            fontWeight: 600,
            boxShadow: "0 4px 12px rgba(16, 185, 129, 0.25)",
            border: "none",
            cursor: "pointer"
          }}
        >
          <Plus size={18} />
          Add Employee
        </button>
      </div>

      {/* Filters (Sticky) */}
      <div
        className="sticky top-0 z-20 rounded-2xl p-4 mb-6 shadow-sm"
        style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", backdropFilter: "blur(12px)" }}
      >
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <div
              className="flex items-center gap-3 flex-1 rounded-xl px-4"
              style={{ backgroundColor: "var(--background)", border: "1px solid var(--border)", height: "44px" }}
            >
              <Search size={18} color="var(--muted-foreground)" />
              <input
                type="text"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                placeholder="Search by name, email, employee ID..."
                style={{ border: "none", outline: "none", background: "transparent", fontSize: "14px", color: "var(--foreground)", width: "100%" }}
              />
            </div>
            
            <div className="flex items-center gap-3" style={{ borderLeft: "1px solid var(--border)", paddingLeft: "16px" }}>
              <span style={{ color: "var(--muted-foreground)", fontSize: "13px", fontWeight: 500, whiteSpace: "nowrap" }}>
                Showing <span style={{ color: "var(--foreground)", fontWeight: 700 }}>{filtered.length}</span> employees
              </span>
              <div className="flex items-center gap-1 ml-3" style={{ backgroundColor: "var(--background)", padding: "4px", borderRadius: "10px", border: "1px solid var(--border)" }}>
                <button
                  onClick={() => setView("table")}
                  className="p-1.5 rounded-lg transition-colors"
                  style={{
                    backgroundColor: view === "table" ? "var(--secondary)" : "transparent",
                    color: view === "table" ? "var(--primary)" : "var(--muted-foreground)",
                  }}
                  title="Table View"
                >
                  <List size={18} />
                </button>
                <button
                  onClick={() => setView("grid")}
                  className="p-1.5 rounded-lg transition-colors"
                  style={{
                    backgroundColor: view === "grid" ? "var(--secondary)" : "transparent",
                    color: view === "grid" ? "var(--primary)" : "var(--muted-foreground)",
                  }}
                  title="Grid View"
                >
                  <LayoutGrid size={18} />
                </button>
                <button
                  onClick={() => setView("team")}
                  className="p-1.5 rounded-lg transition-colors"
                  style={{
                    backgroundColor: view === "team" ? "var(--secondary)" : "transparent",
                    color: view === "team" ? "var(--primary)" : "var(--muted-foreground)",
                  }}
                  title="Team View"
                >
                  <Users size={18} />
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
             <div className="flex items-center gap-3 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
                <FilterChip value={selectedDept} options={departments} onChange={setSelectedDept} />
                <FilterChip value={selectedDesignation} options={uniqueDesignations} onChange={setSelectedDesignation} />
                <FilterChip value={selectedLocation} options={uniqueLocations} onChange={setSelectedLocation} />
                
                {/* Employment Type Multi-Select */}
                <div className="relative shrink-0">
                  <button
                     onClick={(e) => { e.stopPropagation(); setShowTypeDropdown(!showTypeDropdown); }}
                     className="flex items-center gap-2 appearance-none pl-4 pr-3 py-2 rounded-xl text-[13px] font-medium outline-none cursor-pointer transition-colors"
                     style={{ backgroundColor: "var(--background)", border: "1px solid var(--border)", color: "var(--foreground)" }}
                  >
                     Emp. Type {selectedTypes.length > 0 && <span className="ml-1 px-1.5 rounded-md text-[11px]" style={{ backgroundColor: "var(--secondary)", color: "var(--primary)" }}>{selectedTypes.length}</span>}
                     <ChevronDown size={14} style={{ color: "var(--muted-foreground)" }} />
                  </button>
                  {showTypeDropdown && (
                     <>
                        <div className="fixed inset-0 z-10" onClick={(e) => { e.stopPropagation(); setShowTypeDropdown(false); }}></div>
                        <div className="absolute top-full left-0 mt-1 w-48 rounded-xl shadow-xl z-20 py-2" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }} onClick={(e) => e.stopPropagation()}>
                           {uniqueTypes.map(t => (
                              <label key={t} className="flex items-center gap-3 px-4 py-2 cursor-pointer transition-colors" style={{ color: "var(--foreground)" }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "var(--background)"} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}>
                                 <input type="checkbox" checked={selectedTypes.includes(t)} onChange={() => { toggleType(t); setPage(1); }} className="rounded focus:ring-emerald-500" style={{ accentColor: "var(--primary)" }} />
                                 <span style={{ fontSize: "13px" }}>{t}</span>
                              </label>
                           ))}
                        </div>
                     </>
                  )}
                </div>
                
                <div className="w-px h-6 mx-2 shrink-0" style={{ backgroundColor: "var(--border)" }}></div>
                
                <div className="flex items-center p-1 rounded-xl shrink-0" style={{ backgroundColor: "var(--background)", border: "1px solid var(--border)" }}>
                   {["All", "Active", "Inactive"].map(s => (
                      <button
                         key={s}
                         onClick={() => { setSelectedStatus(s === "All" ? "All Status" : s); setPage(1); }}
                         className="px-4 py-1.5 rounded-lg text-[13px] font-medium transition-colors"
                         style={{
                            backgroundColor: (selectedStatus === s || (s === "All" && selectedStatus === "All Status")) ? "var(--card)" : "transparent",
                            color: (selectedStatus === s || (s === "All" && selectedStatus === "All Status")) ? "var(--foreground)" : "var(--muted-foreground)",
                            boxShadow: (selectedStatus === s || (s === "All" && selectedStatus === "All Status")) ? "0 2px 4px rgba(0,0,0,0.05)" : "none",
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
          style={{ top: "140px", backgroundColor: "var(--card)", border: "1px solid var(--primary)" }}
        >
          <span style={{ color: "var(--foreground)", fontWeight: 700, fontSize: "14px" }}>
            {selectedRows.length} employees selected
          </span>
          <div className="flex items-center gap-3">
             <button className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors hover:opacity-80 active:scale-95" style={{ border: "1px solid var(--primary)", color: "var(--primary)", backgroundColor: "transparent", fontSize: "13px", fontWeight: 600 }}>
               <Send size={14} /> Send Email
             </button>
             <button className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors hover:opacity-80 active:scale-95" style={{ border: "1px solid var(--primary)", color: "var(--primary)", backgroundColor: "transparent", fontSize: "13px", fontWeight: 600 }}>
               <Download size={14} /> Export
             </button>
             <button className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors hover:opacity-80 active:scale-95" style={{ border: "1px solid var(--primary)", color: "var(--primary)", backgroundColor: "transparent", fontSize: "13px", fontWeight: 600 }}>
               <UserCheck size={14} /> Assign Manager
             </button>
             <button className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors hover:opacity-80 active:scale-95" style={{ border: "1px solid #EF4444", color: "#EF4444", backgroundColor: "transparent", fontSize: "13px", fontWeight: 600 }}>
               <Ban size={14} /> Deactivate
             </button>
          </div>
        </div>
      )}

      {/* Main View */}
      {view === "table" ? (
        <div className="rounded-2xl overflow-x-auto shadow-sm" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}>
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
                    checked={selectedRows.length === paginated.length && paginated.length > 0}
                    style={{ accentColor: "var(--primary)", cursor: "pointer", width: "16px", height: "16px", borderRadius: "4px" }}
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
                 { label: "Joined", key: "joinDate" }
              ].map(col => (
                 <div 
                    key={col.key} 
                    className="flex items-center gap-1 cursor-pointer hover:opacity-70 transition-opacity text-[11px] font-bold uppercase tracking-wider" 
                    style={{ color: "var(--muted-foreground)" }}
                    onClick={() => handleSort(col.key)}
                 >
                    {col.label}
                    {sortCol === col.key && (
                       sortDesc ? <ChevronDown size={12} /> : <ChevronUp size={12} />
                    )}
                 </div>
              ))}
              <div className="text-[11px] font-bold uppercase tracking-wider text-right" style={{ color: "var(--muted-foreground)" }}>Actions</div>
           </div>

           {/* Table Rows */}
           {paginated.map(emp => (
              <div
                 key={emp.id}
                 className="grid items-center px-4 transition-colors"
                 style={{
                    height: "56px",
                    borderBottom: "1px solid var(--border)",
                    backgroundColor: hoveredRow === emp.id ? "var(--secondary)" : "transparent",
                    gridTemplateColumns: gridCols,
                 }}
                 onMouseEnter={() => setHoveredRow(emp.id)}
                 onMouseLeave={() => setHoveredRow(null)}
              >
                 <div>
                    <input 
                       type="checkbox" 
                       checked={selectedRows.includes(emp.id)} 
                       onChange={() => toggleRowSelection(emp.id)}
                       style={{ accentColor: "var(--primary)", cursor: "pointer", width: "16px", height: "16px", borderRadius: "4px" }}
                    />
                 </div>
                 {/* Avatar + Name + ID */}
                 <div className="flex items-center gap-3 pr-2">
                    <img src={emp.avatar || ""} className="w-9 h-9 rounded-full object-cover border" style={{ borderColor: "var(--border)" }} 
                       onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          const fallback = document.createElement('div');
                          fallback.className = 'w-9 h-9 rounded-full flex items-center justify-center text-[12px] font-bold shrink-0';
                          fallback.style.backgroundColor = `${deptColors[emp.department] || '#6B7280'}20`;
                          fallback.style.color = deptColors[emp.department] || "var(--foreground)";
                          fallback.textContent = emp.name.split(' ').map(n=>n[0]).join('').slice(0,2);
                          e.currentTarget.parentElement?.insertBefore(fallback, e.currentTarget);
                       }}
                    />
                    <div className="min-w-0">
                       <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--foreground)", lineHeight: "1.2", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{emp.name}</div>
                       <div style={{ fontSize: "12px", color: "var(--muted-foreground)" }}>{emp.id}</div>
                    </div>
                 </div>
                 {/* Designation */}
                 <div style={{ fontSize: "13px", color: "var(--foreground)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", paddingRight: "8px" }} title={emp.designation}>{emp.designation}</div>
                 {/* Department badge */}
                 <div>
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-bold whitespace-nowrap" style={{ backgroundColor: `${deptColors[emp.department] || '#6B7280'}15`, color: deptColors[emp.department] || "var(--foreground)" }}>
                       {emp.department}
                    </span>
                 </div>
                 {/* Location */}
                 <div style={{ fontSize: "13px", color: "var(--foreground)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", paddingRight: "8px" }} title={emp.location}>{emp.location}</div>
                 {/* Email */}
                 <div style={{ fontSize: "13px", color: "var(--muted-foreground)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", paddingRight: "8px" }} title={emp.email}>{emp.email}</div>
                 {/* Phone */}
                 <div style={{ fontSize: "13px", color: "var(--foreground)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", paddingRight: "8px" }}>{emp.phone}</div>
                 {/* Status */}
                 <div>
                    <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold w-fit whitespace-nowrap" style={{ backgroundColor: statusConfig[emp.status]?.bg, color: statusConfig[emp.status]?.color }}>
                       <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: statusConfig[emp.status]?.dot }}></span>
                       {emp.status}
                    </span>
                 </div>
                 {/* Joined Date */}
                 <div style={{ fontSize: "13px", color: "var(--foreground)" }}>{new Date(emp.joinDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</div>
                 {/* Actions */}
                 <div className="relative flex justify-end pr-2">
                    <button 
                       onClick={(e) => { e.stopPropagation(); setActionMenuRow(actionMenuRow === emp.id ? null : emp.id); }} 
                       className="p-1.5 rounded-lg transition-colors" 
                       style={{ color: "var(--muted-foreground)" }}
                       onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "var(--secondary)"; e.currentTarget.style.color = "var(--primary)"; }}
                       onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "var(--muted-foreground)"; }}
                    >
                       <MoreVertical size={16} />
                    </button>
                    {actionMenuRow === emp.id && (
                       <div className="absolute right-0 top-full mt-1 w-44 rounded-xl shadow-xl border z-30 py-1" style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}>
                          <button className="w-full text-left px-4 py-2 text-[13px] font-medium transition-colors" style={{ color: "var(--foreground)" }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "var(--background)"} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"} onClick={() => navigate(`/employees/${emp.id}`)}>View Profile</button>
                          <button className="w-full text-left px-4 py-2 text-[13px] font-medium transition-colors" style={{ color: "var(--foreground)" }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "var(--background)"} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"} onClick={() => { setEditEmployee(emp); setActionMenuRow(null); }}>Edit Employee</button>
                          <button className="w-full text-left px-4 py-2 text-[13px] font-medium transition-colors" style={{ color: "var(--foreground)" }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "var(--background)"} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"} onClick={() => window.open(`mailto:${emp.email}`)}>Send Message</button>
                          <div className="h-px my-1 w-full" style={{ backgroundColor: "var(--border)" }}></div>
                          <button className="w-full text-left px-4 py-2 text-[13px] font-medium text-red-500 transition-colors hover:bg-red-50" onClick={() => { setDeleteEmployee(emp); setActionMenuRow(null); }}>Deactivate</button>
                       </div>
                    )}
                 </div>
              </div>
           ))}
           {filtered.length === 0 && (
             <div className="py-16 text-center w-full">
               <p style={{ color: "var(--muted-foreground)", fontSize: "14px" }}>No employees found matching your filters.</p>
             </div>
           )}
          </div>
        </div>
      ) : view === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
           {paginated.map(emp => (
              <div 
                 key={emp.id} 
                 className="relative group rounded-2xl p-5 transition-all duration-300 overflow-hidden"
                 style={{ 
                    backgroundColor: "var(--card)", 
                    border: "1px solid var(--border)",
                 }}
                 onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.boxShadow = "0 12px 24px -8px rgba(0,0,0,0.15)";
                    e.currentTarget.style.borderColor = "var(--primary)";
                 }}
                 onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "none";
                    e.currentTarget.style.boxShadow = "none";
                    e.currentTarget.style.borderColor = "var(--border)";
                 }}
              >
                 <div className="absolute top-4 right-4 z-10">
                    <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ backgroundColor: statusConfig[emp.status]?.bg, color: statusConfig[emp.status]?.color }}>
                       <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: statusConfig[emp.status]?.dot }}></span>
                       {emp.status}
                    </span>
                 </div>
                 <div className="flex flex-col items-center mt-2 mb-4 relative z-10">
                    <img src={emp.avatar || ""} className="w-20 h-20 rounded-full object-cover border-[3px]" style={{ borderColor: "var(--background)" }} 
                       onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          const fallback = document.createElement('div');
                          fallback.className = 'w-20 h-20 rounded-full flex items-center justify-center text-[24px] font-bold shrink-0 border-[3px]';
                          fallback.style.borderColor = 'var(--background)';
                          fallback.style.backgroundColor = `${deptColors[emp.department] || '#6B7280'}20`;
                          fallback.style.color = deptColors[emp.department] || "var(--foreground)";
                          fallback.textContent = emp.name.split(' ').map(n=>n[0]).join('').slice(0,2);
                          e.currentTarget.parentElement?.insertBefore(fallback, e.currentTarget);
                       }}
                    />
                    <h3 className="mt-4 text-[16px] font-bold" style={{ color: "var(--foreground)" }}>{emp.name}</h3>
                    <p className="text-[13px] mb-3 text-center px-2" style={{ color: "var(--muted-foreground)" }}>{emp.designation}</p>
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-bold" style={{ backgroundColor: `${deptColors[emp.department] || '#6B7280'}15`, color: deptColors[emp.department] || "var(--foreground)" }}>
                       {emp.department}
                    </span>
                 </div>
                 
                 <div className="flex items-center justify-center gap-1.5 mb-5 text-[12px] relative z-10" style={{ color: "var(--muted-foreground)" }}>
                    <MapPin size={14} /> {emp.location}
                 </div>
                 
                 <div className="flex items-center justify-center gap-3 pt-4 relative z-10" style={{ borderTop: "1px solid var(--border)" }}>
                    <button className="p-2.5 rounded-full transition-colors hover:scale-105 active:scale-95" style={{ backgroundColor: "var(--background)", color: "var(--muted-foreground)" }} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "var(--secondary)"; e.currentTarget.style.color = "var(--primary)"; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "var(--background)"; e.currentTarget.style.color = "var(--muted-foreground)"; }} title="Email" onClick={() => window.open(`mailto:${emp.email}`)}><Mail size={16} /></button>
                    <button className="p-2.5 rounded-full transition-colors hover:scale-105 active:scale-95" style={{ backgroundColor: "var(--background)", color: "var(--muted-foreground)" }} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "var(--secondary)"; e.currentTarget.style.color = "var(--primary)"; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "var(--background)"; e.currentTarget.style.color = "var(--muted-foreground)"; }} title="Phone"><Phone size={16} /></button>
                    <button className="p-2.5 rounded-full transition-colors hover:scale-105 active:scale-95" style={{ backgroundColor: "var(--background)", color: "var(--muted-foreground)" }} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "var(--secondary)"; e.currentTarget.style.color = "var(--primary)"; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "var(--background)"; e.currentTarget.style.color = "var(--muted-foreground)"; }} title="LinkedIn"><Linkedin size={16} /></button>
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
           {filtered.length === 0 && (
             <div className="col-span-full py-16 text-center">
               <p style={{ color: "var(--muted-foreground)", fontSize: "14px" }}>No employees found matching your filters.</p>
             </div>
           )}
        </div>
      ) : view === "team" ? (
        <div className="flex flex-col gap-6">
          {Array.from(new Set(paginated.map(e => e.department))).map(dept => (
            <div key={dept} className="rounded-2xl p-6 shadow-sm transition-colors" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}>
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-[18px] font-bold" style={{ color: "var(--foreground)" }}>{dept} Team</h3>
                <span className="px-3 py-1 rounded-full text-[12px] font-bold" style={{ backgroundColor: `${deptColors[dept] || '#6B7280'}15`, color: deptColors[dept] || "var(--foreground)" }}>
                  {paginated.filter(e => e.department === dept).length} Members
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {paginated.filter(e => e.department === dept).map(emp => (
                  <div key={emp.id} className="flex items-center gap-3 p-3 rounded-xl transition-all duration-200 hover:shadow-md cursor-pointer group" style={{ border: "1px solid var(--border)", backgroundColor: "var(--background)" }} onClick={() => navigate(`/employees/${emp.id}`)}>
                    <img src={emp.avatar || ""} className="w-11 h-11 rounded-full object-cover border" style={{ borderColor: "var(--border)" }} 
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        const fallback = document.createElement('div');
                        fallback.className = 'w-11 h-11 rounded-full flex items-center justify-center text-[12px] font-bold shrink-0';
                        fallback.style.backgroundColor = `${deptColors[emp.department] || '#6B7280'}20`;
                        fallback.style.color = deptColors[emp.department] || "var(--foreground)";
                        fallback.textContent = emp.name.split(' ').map(n=>n[0]).join('').slice(0,2);
                        e.currentTarget.parentElement?.insertBefore(fallback, e.currentTarget);
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-[14px] truncate transition-colors group-hover:text-emerald-600" style={{ color: "var(--foreground)" }}>{emp.name}</p>
                      <p className="text-[12px] truncate" style={{ color: "var(--muted-foreground)" }}>{emp.designation}</p>
                    </div>
                    <div className="shrink-0 flex flex-col items-end gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: statusConfig[emp.status]?.dot }} title={emp.status}></span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="py-16 text-center w-full rounded-2xl" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}>
              <p style={{ color: "var(--muted-foreground)", fontSize: "14px" }}>No employees found matching your filters.</p>
            </div>
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
            <span style={{ color: "var(--foreground)", fontWeight: 700 }}>{filtered.length}</span> employees
          </p>
          {totalPages > 1 && (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="flex items-center justify-center w-9 h-9 rounded-xl transition-colors"
                style={{
                  border: "1px solid var(--border)",
                  color: page === 1 ? "var(--muted-foreground)" : "var(--foreground)",
                  backgroundColor: page === 1 ? "var(--background)" : "var(--card)",
                  cursor: page === 1 ? "not-allowed" : "pointer",
                  opacity: page === 1 ? 0.5 : 1
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
                    backgroundColor: page === p ? "var(--primary)" : "var(--card)",
                    fontSize: "13px",
                    fontWeight: page === p ? 700 : 500,
                    cursor: "pointer",
                    boxShadow: page === p ? "0 4px 10px rgba(16, 185, 129, 0.25)" : "none"
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
                  color: page === totalPages ? "var(--muted-foreground)" : "var(--foreground)",
                  backgroundColor: page === totalPages ? "var(--background)" : "var(--card)",
                  cursor: page === totalPages ? "not-allowed" : "pointer",
                  opacity: page === totalPages ? 0.5 : 1
                }}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      )}

      {showAddModal && <AddEmployeeModal onClose={() => setShowAddModal(false)} />}
      {editEmployee && <EditEmployeeModal employee={editEmployee} onClose={() => setEditEmployee(null)} />}
      {deleteEmployee && <DeleteConfirmModal employee={deleteEmployee} onClose={() => setDeleteEmployee(null)} />}
    </div>
  );
}
