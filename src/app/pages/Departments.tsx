import { Building2, Plus, Users, TrendingUp, MoreHorizontal } from "lucide-react";
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

export function Departments() {
  const [depts] = useState<Department[]>(departmentsData);

  return (
    <div style={{ maxWidth: "1360px" }}>
      {/* ── Page Header ── */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 style={{ color: "#022C22", fontSize: "24px", fontWeight: 800, letterSpacing: "-0.5px" }}>
            Departments
          </h2>
          <p style={{ color: "#6B7280", fontSize: "14px", marginTop: "4px" }}>
            Manage organizational structure
          </p>
        </div>
        <button
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
              backgroundColor: "white",
              border: "1px solid #D1FAE5",
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
                  backgroundColor: "#ECFDF5",
                  border: "1px solid #D1FAE5",
                }}
              >
                <Building2 size={24} color="#059669" />
              </div>
              <div
                className="flex items-center gap-1 rounded-full px-2.5 py-1"
                style={{ backgroundColor: "#F0FDF4", border: "1px solid #D1FAE5" }}
              >
                <TrendingUp size={12} color="#059669" />
                <span style={{ color: "#059669", fontSize: "12px", fontWeight: 700 }}>
                  +{dept.growth}
                </span>
              </div>
            </div>

            {/* Content: Name & Head */}
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <h3 style={{ color: "#022C22", fontSize: "18px", fontWeight: 800 }}>
                  {dept.name}
                </h3>
                <button 
                   className="p-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                   style={{ color: "#9CA3AF" }}
                >
                   <MoreHorizontal size={18} />
                </button>
              </div>
              <p style={{ color: "#6B7280", fontSize: "13px", marginTop: "2px" }}>
                Head: <span style={{ color: "#374151", fontWeight: 500 }}>{dept.head}</span>
              </p>
            </div>

            {/* Bottom Row: Stats */}
            <div
              className="flex items-center justify-between pt-5"
              style={{ borderTop: "1px dotted #D1FAE5" }}
            >
              <div className="flex items-center gap-2">
                <div
                  className="flex items-center justify-center rounded-lg"
                  style={{ width: "28px", height: "28px", backgroundColor: "#F0FDF4" }}
                >
                  <Users size={14} color="#059669" />
                </div>
                <p style={{ color: "#374151", fontSize: "14px", fontWeight: 600 }}>
                  {dept.employees} <span style={{ color: "#6B7280", fontWeight: 400, fontSize: "13px" }}>employees</span>
                </p>
              </div>
              <div>
                <p style={{ color: "#6B7280", fontSize: "13px" }}>
                  Budget: <span style={{ color: "#022C22", fontWeight: 700 }}>{dept.budget}</span>
                </p>
              </div>
            </div>
          </div>
        ))}

        {/* ── Add New Placeholder (Optional but looks nice) ── */}
        <div
          className="rounded-3xl p-6 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all border-2 border-dashed border-[#D1FAE5] hover:border-[#059669] hover:bg-[#F0FDF4]"
          style={{ minHeight: "220px" }}
        >
          <div
            className="flex items-center justify-center rounded-full"
            style={{
              width: "48px",
              height: "48px",
              backgroundColor: "#ECFDF5",
              color: "#059669"
            }}
          >
            <Plus size={24} />
          </div>
          <p style={{ color: "#059669", fontSize: "14px", fontWeight: 700 }}>
            Create Department
          </p>
        </div>
      </div>
    </div>
  );
}
