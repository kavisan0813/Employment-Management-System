import { Building2, Plus, Users, TrendingUp, MoreHorizontal, X, User, DollarSign, Layout } from "lucide-react";
import { useState } from "react";

/* ─── Types ─────────────────────────────── */
interface Department {
  id: string;
  name: string;
  head: string;
  employees: number;
  budget: string;
  growth: number;
}

/* ─── Mock Data (matches image) ─────────── */
const departmentsData: Department[] = [
  {
    id: "DEPT001",
    name: "Engineering",
    head: "Suresh Iyer",
    employees: 820,
    budget: "₹1.2Cr",
    growth: 18,
  },
  {
    id: "DEPT002",
    name: "Sales",
    head: "Vikram Singh",
    employees: 540,
    budget: "₹85L",
    growth: 12,
  },
  {
    id: "DEPT003",
    name: "Marketing",
    head: "Sneha Patel",
    employees: 310,
    budget: "₹60L",
    growth: 8,
  },
  {
    id: "DEPT004",
    name: "HR",
    head: "Meera Thomas",
    employees: 180,
    budget: "₹40L",
    growth: 5,
  },
  {
    id: "DEPT005",
    name: "Finance",
    head: "Ananya Das",
    employees: 240,
    budget: "₹55L",
    growth: 6,
  },
  {
    id: "DEPT006",
    name: "Operations",
    head: "Priya Nair",
    employees: 757,
    budget: "₹95L",
    growth: 14,
  },
];

/* ─── Add Department Modal ──────────────── */
function AddDepartmentModal({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({
    name: "",
    head: "",
    budget: "",
    description: "",
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
          className="flex items-center justify-between px-8 py-7"
          style={{ borderBottom: "1px solid #F3F4F6" }}
        >
          <div>
            <h3 style={{ color: "#111827", fontSize: "20px", fontWeight: 800, letterSpacing: "-0.5px" }}>
              Create Department
            </h3>
            <p style={{ color: "#6B7280", fontSize: "14px", marginTop: "2px" }}>
              Define a new organizational unit
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2.5 rounded-2xl transition-colors hover:bg-gray-100"
            style={{ color: "#9CA3AF" }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="px-8 py-8 space-y-6">
          {/* Dept Name */}
          <div>
            <label style={{ color: "#374151", fontSize: "14px", fontWeight: 700, display: "block", marginBottom: "8px" }}>
              Department Name
            </label>
            <div className="relative">
              <Layout size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                className="w-full rounded-2xl pl-11 pr-4 py-3.5 text-sm outline-none transition-all"
                style={{
                  border: "1px solid #E5E7EB",
                  backgroundColor: "#F9FAFB",
                  color: "#111827",
                }}
                placeholder="e.g. Design Tech"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
          </div>

          {/* Dept Head */}
          <div>
            <label style={{ color: "#374151", fontSize: "14px", fontWeight: 700, display: "block", marginBottom: "8px" }}>
              Department Head
            </label>
            <div className="relative">
              <User size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                className="w-full rounded-2xl pl-11 pr-4 py-3.5 text-sm outline-none transition-all"
                style={{
                  border: "1px solid #E5E7EB",
                  backgroundColor: "#F9FAFB",
                  color: "#111827",
                }}
                placeholder="Select an employee..."
                value={form.head}
                onChange={(e) => setForm({ ...form, head: e.target.value })}
              />
            </div>
          </div>

          {/* Budget */}
          <div>
            <label style={{ color: "#374151", fontSize: "14px", fontWeight: 700, display: "block", marginBottom: "8px" }}>
              Allocated Budget (Annual)
            </label>
            <div className="relative">
              <DollarSign size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                className="w-full rounded-2xl pl-11 pr-4 py-3.5 text-sm outline-none transition-all"
                style={{
                  border: "1px solid #E5E7EB",
                  backgroundColor: "#F9FAFB",
                  color: "#111827",
                }}
                placeholder="e.g. $50,000"
                value={form.budget}
                onChange={(e) => setForm({ ...form, budget: e.target.value })}
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label style={{ color: "#374151", fontSize: "14px", fontWeight: 700, display: "block", marginBottom: "8px" }}>
              Description
            </label>
            <textarea
              rows={3}
              className="w-full rounded-2xl px-4 py-3.5 text-sm outline-none transition-all resize-none"
              style={{
                border: "1px solid #E5E7EB",
                backgroundColor: "#F9FAFB",
                color: "#111827",
              }}
              placeholder="Describe the department's core responsibilities..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>
        </div>

        {/* Footer */}
        <div
          className="px-8 py-6 flex gap-4"
          style={{ borderTop: "1px solid #F3F4F6", background: "white" }}
        >
          <button
            onClick={onClose}
            className="flex-1 py-4 rounded-2xl text-sm font-bold transition-all hover:bg-[#ECFDF5]"
            style={{ backgroundColor: "#F0FDF4", color: "#059669", border: "none" }}
          >
            Cancel
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-4 rounded-2xl text-sm font-bold text-white transition-all hover:opacity-90 active:scale-95 shadow-lg"
            style={{
              background: "#10B981",
              boxShadow: "0 6px 20px rgba(16, 185, 129, 0.25)",
              border: "none"
            }}
          >
            Create Department
          </button>
        </div>
      </div>
    </div>
  );
}

export function Departments() {
  const [depts] = useState<Department[]>(departmentsData);
  const [showAddModal, setShowAddModal] = useState(false);

  return (
    <div style={{ maxWidth: "1360px" }}>
      {/* ── Page Header ── */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 style={{ color: "var(--foreground)", fontSize: "24px", fontWeight: 800, letterSpacing: "-0.5px" }}>
            Departments
          </h2>
          <p style={{ color: "var(--muted-foreground)", fontSize: "14px", marginTop: "4px" }}>
            Manage organizational structure
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-white transition-all hover:opacity-90 active:scale-95"
          style={{
            background: "linear-gradient(135deg, #059669, #047857)",
            fontSize: "14px",
            fontWeight: 700,
            boxShadow: "0 4px 12px rgba(5,150,105,0.3)",
          }}
        >
          <Plus size={18} />
          Add Department
        </button>
      </div>

      {/* ── Department Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {depts.map((dept) => (
          <div
            key={dept.id}
            className="group relative rounded-3xl p-6 transition-all duration-300 hover:scale-[1.02]"
            style={{
              backgroundColor: "var(--card)",
              border: "1px solid var(--border)",
              boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 10px 40px rgba(0,0,0,0.02)",
            }}
          >
            {/* Top Row: Icon & Growth */}
            <div className="flex items-start justify-between mb-6">
              <div
                className="flex items-center justify-center rounded-2xl"
                style={{
                  width: "52px",
                  height: "52px",
                  backgroundColor: "var(--secondary)",
                  border: "1px solid var(--border)",
                }}
              >
                <Building2 size={24} color="var(--primary)" />
              </div>
              <div
                className="flex items-center gap-1 rounded-full px-2.5 py-1"
                style={{ backgroundColor: "var(--secondary)", border: "1px solid var(--border)" }}
              >
                <TrendingUp size={12} color="var(--primary)" />
                <span style={{ color: "var(--primary)", fontSize: "12px", fontWeight: 700 }}>
                  +{dept.growth}
                </span>
              </div>
            </div>

            {/* Content: Name & Head */}
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <h3 style={{ color: "var(--foreground)", fontSize: "18px", fontWeight: 800 }}>
                  {dept.name}
                </h3>
                <button
                  className="p-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ color: "var(--muted-foreground)" }}
                >
                  <MoreHorizontal size={18} />
                </button>
              </div>
              <p style={{ color: "var(--muted-foreground)", fontSize: "13px", marginTop: "2px" }}>
                Head: <span style={{ color: "var(--foreground)", fontWeight: 500 }}>{dept.head}</span>
              </p>
            </div>

            {/* Bottom Row: Stats */}
            <div
              className="flex items-center justify-between pt-5"
              style={{ borderTop: "1px dotted var(--border)" }}
            >
              <div className="flex items-center gap-2">
                <div
                  className="flex items-center justify-center rounded-lg"
                  style={{ width: "28px", height: "28px", backgroundColor: "var(--secondary)" }}
                >
                  <Users size={14} color="var(--primary)" />
                </div>
                <p style={{ color: "var(--foreground)", fontSize: "14px", fontWeight: 600 }}>
                  {dept.employees} <span style={{ color: "var(--muted-foreground)", fontWeight: 400, fontSize: "13px" }}>employees</span>
                </p>
              </div>
              <div>
                <p style={{ color: "var(--muted-foreground)", fontSize: "13px" }}>
                  Budget: <span style={{ color: "var(--foreground)", fontWeight: 700 }}>{dept.budget}</span>
                </p>
              </div>
            </div>
          </div>
        ))}

        {/* ── Add New Placeholder (Optional but looks nice) ── */}
        <div
          onClick={() => setShowAddModal(true)}
          className="rounded-3xl p-6 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all border-2 border-dashed border-var(--border) hover:border-var(--primary) hover:bg-var(--secondary)"
          style={{ minHeight: "220px", borderColor: "var(--border)" }}
        >
          <div
            className="flex items-center justify-center rounded-full"
            style={{
              width: "48px",
              height: "48px",
              backgroundColor: "var(--secondary)",
              color: "var(--primary)"
            }}
          >
            <Plus size={24} />
          </div>
          <p style={{ color: "var(--primary)", fontSize: "14px", fontWeight: 700 }}>
            Create Department
          </p>
        </div>
      </div>

      {showAddModal && <AddDepartmentModal onClose={() => setShowAddModal(false)} />}
    </div>
  );
}
