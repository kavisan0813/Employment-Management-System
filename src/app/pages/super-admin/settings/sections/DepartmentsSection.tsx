import React from "react";
import { useSettingsContext } from "../SettingsContext";
import {
  Building2,
  ChevronRight,
  CheckCircle,
  UserMinus,
  Users,
} from "lucide-react";

export function DepartmentsSection() {
  const {
    SectionTitle,
    allowSubDepts,
    budgetThreshold,
    budgetTracking,
    deptSearchQuery,
    deptSortBy,
    deptStatusFilter,
    deptsList,
    requireCostCenter,
    setActiveModal,
    setAllowSubDepts,
    setBudgetThreshold,
    setBudgetTracking,
    setDeptForm,
    setDeptSearchQuery,
    setDeptSortBy,
    setDeptStatusFilter,
    setRequireCostCenter,
    setSelectedDept,
    showToast,
  } = useSettingsContext();

  // Filter and sort logic
  const filteredDepts = deptsList.filter((d) => {
    const matchesSearch =
      d.name.toLowerCase().includes(deptSearchQuery.toLowerCase()) ||
      d.code.toLowerCase().includes(deptSearchQuery.toLowerCase());

    const matchesStatus =
      deptStatusFilter === "All Status" || d.status === deptStatusFilter;

    return matchesSearch && matchesStatus;
  });

  if (deptSortBy === "Name") {
    filteredDepts.sort((a, b) => a.name.localeCompare(b.name));
  } else if (deptSortBy === "Employees") {
    filteredDepts.sort((a, b) => b.empCount - a.empCount);
  } else if (deptSortBy === "Created Date") {
    filteredDepts.sort(
      (a, b) =>
        new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime(),
    );
  }

  return (
    <div>
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-4 text-[12px] font-medium">
        <span style={{ color: "var(--muted-foreground)" }}>Settings</span>
        <ChevronRight
          size={12}
          style={{ color: "var(--muted-foreground)" }}
        />
        <span style={{ color: "#00B87C" }}>Departments</span>
      </div>

      {/* Content Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2
            style={{
              fontSize: "18px",
              fontWeight: 700,
              color: "var(--foreground)",
              margin: 0,
            }}
          >
            Department Configuration
          </h2>
          <p
            style={{
              fontSize: "13px",
              color: "var(--muted-foreground)",
              marginTop: "2px",
            }}
          >
            Manage corporate departments and structural definitions
          </p>
        </div>
        <button
          onClick={() => {
            setDeptForm({
              name: "",
              code: "",
              head: "",
              status: "Active",
              budget: "",
              description: "",
            });
            setSelectedDept(null);
            setActiveModal("add_department");
          }}
          style={{
            backgroundColor: "#00B87C",
            color: "white",
            border: "none",
            borderRadius: "10px",
            padding: "8px 16px",
            fontSize: "13px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          + Add Department
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          {
            label: "Total Departments",
            value: deptsList.length,
            icon: <Building2 size={20} />,
            color: "#00B87C",
            bg: "rgba(0, 184, 124, 0.1)",
          },
          {
            label: "Active Departments",
            value: deptsList.filter((d) => d.status === "Active").length,
            icon: <CheckCircle size={20} />,
            color: "#0EA5E9",
            bg: "rgba(14, 165, 233, 0.1)",
          },
          {
            label: "Employees Assigned",
            value: deptsList.reduce((acc, curr) => acc + curr.empCount, 0),
            icon: <Users size={20} />,
            color: "#F59E0B",
            bg: "rgba(245, 158, 11, 0.1)",
          },
          {
            label: "Without Head",
            value: deptsList.filter((d) => !d.head).length,
            icon: <UserMinus size={20} />,
            color: "#EF4444",
            bg: "rgba(239, 68, 68, 0.1)",
          },
        ].map((card, idx) => (
          <div
            key={idx}
            className="p-4 rounded-2xl flex items-center justify-between shadow-sm"
            style={{
              backgroundColor: "var(--card)",
              border: "1px solid var(--border)",
            }}
          >
            <div>
              <p
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  color: "var(--muted-foreground)",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  margin: 0,
                }}
              >
                {card.label}
              </p>
              <p
                style={{
                  fontSize: "22px",
                  fontWeight: 800,
                  color: "var(--foreground)",
                  marginTop: "4px",
                  marginBottom: 0,
                }}
              >
                {card.value}
              </p>
            </div>
            <div
              style={{
                padding: "10px",
                borderRadius: "12px",
                backgroundColor: card.bg,
                color: card.color,
              }}
            >
              {card.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Filter Bar */}
      <div
        className="p-4 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4 mb-6"
        style={{
          backgroundColor: "var(--card)",
          border: "1px solid var(--border)",
        }}
      >
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <input
            type="text"
            placeholder="Search departments..."
            value={deptSearchQuery}
            onChange={(e) => setDeptSearchQuery(e.target.value)}
            className="rounded-xl px-4 py-2 text-sm outline-none border w-64 transition-all"
            style={{
              backgroundColor: "var(--input-background)",
              borderColor: "var(--border)",
              color: "var(--foreground)",
            }}
          />
          <select
            value={deptStatusFilter}
            onChange={(e) => setDeptStatusFilter(e.target.value)}
            className="rounded-xl px-3 py-2 text-sm outline-none border transition-all"
            style={{
              backgroundColor: "var(--input-background)",
              borderColor: "var(--border)",
              color: "var(--foreground)",
            }}
          >
            <option value="All Status">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
          <select
            value={deptSortBy}
            onChange={(e) => setDeptSortBy(e.target.value)}
            className="rounded-xl px-3 py-2 text-sm outline-none border transition-all"
            style={{
              backgroundColor: "var(--input-background)",
              borderColor: "var(--border)",
              color: "var(--foreground)",
            }}
          >
            <option value="Name">Sort by Name</option>
            <option value="Employees">Sort by Employees</option>
            <option value="Created Date">Sort by Date</option>
          </select>
        </div>
        <span style={{ fontSize: "13px", color: "var(--muted-foreground)" }}>
          Showing {filteredDepts.length} departments
        </span>
      </div>

      {/* Section: DEPARTMENTS TABLE */}
      <div className="overflow-x-auto mb-6 rounded-2xl border border-[var(--border)] shadow-sm">
        <table
          className="w-full border-collapse"
          style={{ minWidth: "800px" }}
        >
          <thead>
            <tr
              style={{
                borderBottom: "1px solid var(--border)",
                textAlign: "left",
                backgroundColor: "var(--muted)",
              }}
            >
              {[
                "DEPARTMENT",
                "CODE",
                "HEAD",
                "EMPLOYEES",
                "BUDGET",
                "STATUS",
                "CREATED",
                "ACTION",
              ].map((h) => (
                <th
                  key={h}
                  style={{
                    padding: "12px 16px",
                    fontSize: "10px",
                    fontWeight: 700,
                    color: "var(--muted-foreground)",
                    letterSpacing: "0.5px",
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredDepts.map((d, idx) => (
              <tr
                key={idx}
                style={{
                  borderBottom: "1px solid var(--border)",
                  height: "56px",
                }}
                className="hover:bg-[var(--muted)] transition-all"
              >
                <td style={{ padding: "12px 16px" }}>
                  <div
                    className="font-bold text-sm"
                    style={{ color: "var(--foreground)" }}
                  >
                    {d.name}
                  </div>
                  {d.description && (
                    <div
                      style={{
                        fontSize: "11px",
                        color: "var(--muted-foreground)",
                      }}
                    >
                      {d.description}
                    </div>
                  )}
                </td>
                <td
                  style={{
                    padding: "12px 16px",
                    fontSize: "13px",
                    fontWeight: 600,
                    color: "var(--muted-foreground)",
                  }}
                >
                  <span
                    className="px-2 py-1 rounded-lg text-xs font-bold"
                    style={{
                      backgroundColor: "var(--muted)",
                      color: "var(--foreground)",
                      border: "1px solid var(--border)",
                    }}
                  >
                    {d.code}
                  </span>
                </td>
                <td
                  style={{
                    padding: "12px 16px",
                    fontSize: "13px",
                    color: "var(--foreground)",
                  }}
                >
                  {d.head || (
                    <span
                      style={{
                        color: "var(--muted-foreground)",
                        fontStyle: "italic",
                      }}
                    >
                      No Head Assigned
                    </span>
                  )}
                </td>
                <td style={{ padding: "12px 16px" }}>
                  <span
                    style={{
                      backgroundColor: "rgba(0, 184, 124, 0.1)",
                      color: "#00B87C",
                      padding: "4px 10px",
                      borderRadius: "12px",
                      fontSize: "11px",
                      fontWeight: 700,
                    }}
                  >
                    {d.empCount} Employees
                  </span>
                </td>
                <td
                  style={{
                    padding: "12px 16px",
                    fontSize: "13px",
                    color: "var(--foreground)",
                  }}
                >
                  {d.budget || "—"}
                </td>
                <td style={{ padding: "12px 16px" }}>
                  <span
                    style={{
                      backgroundColor:
                        d.status === "Active"
                          ? "rgba(0, 184, 124, 0.1)"
                          : "rgba(107, 114, 128, 0.1)",
                      color: d.status === "Active" ? "#00B87C" : "#6B7280",
                      padding: "4px 10px",
                      borderRadius: "12px",
                      fontSize: "11px",
                      fontWeight: 700,
                    }}
                  >
                    {d.status}
                  </span>
                </td>
                <td
                  style={{
                    padding: "12px 16px",
                    fontSize: "12px",
                    color: "var(--muted-foreground)",
                  }}
                >
                  {d.createdDate}
                </td>
                <td style={{ padding: "12px 16px" }}>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setSelectedDept(d);
                        setActiveModal("view_department");
                      }}
                      style={{
                        backgroundColor: "transparent",
                        border: "1px solid var(--border)",
                        borderRadius: "8px",
                        padding: "4px 10px",
                        fontSize: "12px",
                        fontWeight: 600,
                        color: "var(--foreground)",
                        cursor: "pointer",
                      }}
                    >
                      View
                    </button>
                    <button
                      onClick={() => {
                        setSelectedDept(d);
                        setDeptForm({
                          name: d.name,
                          code: d.code,
                          head: d.head,
                          status: d.status,
                          budget: d.budget || "",
                          description: d.description || "",
                        });
                        setActiveModal("edit_department");
                      }}
                      style={{
                        backgroundColor: "transparent",
                        border: "1px solid #00B87C",
                        borderRadius: "8px",
                        padding: "4px 10px",
                        fontSize: "12px",
                        fontWeight: 600,
                        color: "#00B87C",
                        cursor: "pointer",
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        setSelectedDept(d);
                        setActiveModal("delete_department");
                      }}
                      style={{
                        backgroundColor: "transparent",
                        border: "1px solid #EF4444",
                        borderRadius: "8px",
                        padding: "4px 10px",
                        fontSize: "12px",
                        fontWeight: 600,
                        color: "#EF4444",
                        cursor: "pointer",
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Section: DEPARTMENT HIERARCHY SETTINGS */}
      <SectionTitle title="Department Hierarchy Settings" />
      <div className="space-y-4 mb-6">
        {[
          {
            label: "Allow Sub-departments",
            state: allowSubDepts,
            setter: setAllowSubDepts,
          },
          {
            label: "Require Cost Center Code",
            state: requireCostCenter,
            setter: setRequireCostCenter,
          },
          {
            label: "Enable Budget Tracking per Department",
            state: budgetTracking,
            setter: setBudgetTracking,
          },
        ].map((row, idx) => (
          <div key={idx} className="flex justify-between items-center py-2">
            <span
              style={{
                fontSize: "13px",
                color: "var(--foreground)",
                fontWeight: 500,
              }}
            >
              {row.label}
            </span>
            <button
              onClick={() => row.setter(!row.state)}
              style={{
                width: "36px",
                height: "20px",
                borderRadius: "20px",
                backgroundColor: row.state
                  ? "#00B87C"
                  : "var(--switch-background)",
                position: "relative",
                transition: "all 0.2s",
                cursor: "pointer",
                border: "none",
              }}
            >
              <span
                style={{
                  position: "absolute",
                  top: "2px",
                  left: row.state ? "18px" : "2px",
                  width: "16px",
                  height: "16px",
                  borderRadius: "50%",
                  backgroundColor: "white",
                  transition: "all 0.2s",
                }}
              />
            </button>
          </div>
        ))}
        <div className="flex justify-between items-center py-2">
          <span
            style={{
              fontSize: "13px",
              color: "var(--foreground)",
              fontWeight: 500,
            }}
          >
            Alert at Budget Threshold (%)
          </span>
          <input
            type="text"
            value={budgetThreshold}
            onChange={(e) => setBudgetThreshold(e.target.value)}
            className="rounded-xl px-3 py-2 text-sm outline-none border w-20 text-center"
            style={{
              backgroundColor: "var(--input-background)",
              borderColor: "var(--border)",
              color: "var(--foreground)",
            }}
          />
        </div>
      </div>

      {/* SAVE BAR */}
      <div
        className="flex justify-end items-center pt-4 mt-6"
        style={{ borderTop: "1px solid var(--border)" }}
      >
        <button
          onClick={() => showToast("Department hierarchies locked")}
          style={{
            backgroundColor: "#00B87C",
            color: "white",
            border: "none",
            borderRadius: "10px",
            padding: "8px 20px",
            fontSize: "13px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}
