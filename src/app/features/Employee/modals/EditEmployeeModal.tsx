import React, { useState } from "react";
import {
  X,
  User,
  Mail,
  Briefcase,
  Calendar as CalendarIcon,
  IndianRupee,
  ChevronDown,
} from "lucide-react";
import { Employee } from "../types/employee.types";
import { departments } from "../utils/employee.utils";

export function EditEmployeeModal({
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
                  onChange={(e) =>
                    setForm({
                      ...form,
                      status: e.target.value as
                        | "Active"
                        | "On Leave"
                        | "Inactive",
                    })
                  }
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
