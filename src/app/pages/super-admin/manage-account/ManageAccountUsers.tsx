import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router";
import { useEmployees } from "../../../context/AppContext";
import {
  Search,
  Plus,
  Download,
  MoreHorizontal,
  Eye,
  Pencil,
  UserX,
  Mail,
  Trash2,
  Users,
  UserCheck,
  UserMinus,
  X,
} from "lucide-react";
import toast from "react-hot-toast";

/* ────── Merged User Type ────── */
interface MergedUser {
  id: string;
  name: string;
  email: string;
  initials: string;
  role: string;
  department: string;
  location: string;
  designation: string;
  joinedAt: string;
  employeeStatus: string;
  accountStatus: string;
  avatarUrl?: string;
}

/* ────── Top Navigation Tabs ────── */
const TOP_NAV_TABS = [
  { id: "all", label: "All", icon: Users },
  { id: "login_enabled", label: "Login Enabled", icon: UserCheck },
  { id: "login_disabled", label: "Login Disabled", icon: UserMinus },
  { id: "invited", label: "Invited", icon: Mail },
  { id: "deactivated", label: "Deactivated", icon: UserX },
  { id: "profiles", label: "All Profiles", icon: Users },
];

/* ────── Status Styles ────── */
const STATUS_STYLES: Record<
  string,
  { bg: string; color: string; dot: string }
> = {
  Active: { bg: "rgba(16,185,129,0.1)", color: "#10B981", dot: "#10B981" },
  "Pending Invite": {
    bg: "rgba(245,158,11,0.1)",
    color: "#F59E0B",
    dot: "#F59E0B",
  },
  Inactive: { bg: "rgba(107,114,128,0.1)", color: "#6B7280", dot: "#6B7280" },
  Pending: { bg: "rgba(245,158,11,0.1)", color: "#F59E0B", dot: "#F59E0B" },
  Suspended: { bg: "rgba(239,68,68,0.1)", color: "#EF4444", dot: "#EF4444" },
  Probation: { bg: "rgba(99,102,241,0.1)", color: "#6366F1", dot: "#6366F1" },
};

/* ────── User Service Layer (Business Logic) ────── */
const UserService = {
  updateUser: (updatedUser: Partial<MergedUser> & { id: string }) => {
    try {
      const raw = localStorage.getItem("nexus_registered_users");
      const users = raw ? JSON.parse(raw) : [];
      const index = users.findIndex(
        (u: { id: string }) => u.id === updatedUser.id,
      );
      if (index !== -1) {
        users[index] = { ...users[index], ...updatedUser };
      } else {
        users.push(updatedUser);
      }
      localStorage.setItem("nexus_registered_users", JSON.stringify(users));
      return true;
    } catch (e) {
      console.error("Failed to update user:", e);
      return false;
    }
  },

  deleteUser: (id: string) => {
    try {
      const raw = localStorage.getItem("nexus_registered_users");
      if (!raw) return true;
      const users = JSON.parse(raw).filter((u: { id: string }) => u.id !== id);
      localStorage.setItem("nexus_registered_users", JSON.stringify(users));
      return true;
    } catch (e) {
      console.error("Failed to delete user:", e);
      return false;
    }
  },

  deactivateUser: (id: string) => {
    return UserService.updateUser({
      id,
      accountStatus: "Inactive",
      employeeStatus: "Inactive",
    });
  },

  resendInvite: (id: string, email: string) => {
    console.log(`Invite resent to ${email}`);
    toast.success(`Invite resent to ${email}`);
    return UserService.updateUser({
      id,
      accountStatus: "Pending Invite",
      employeeStatus: "Pending Invite",
    });
  },

  viewUser: (id: string, navigate: (path: string) => void) => {
    navigate(`/admin/manage-account/users/${id}`);
  },

  editUser: (id: string, navigate: (path: string) => void) => {
    navigate(`/admin/manage-account/users/${id}/edit`);
  },
};

export function ManageAccountUsers() {
  const navigate = useNavigate();
  const { employeesList } = useEmployees();
  const [refreshTrigger] = useState(0);
  const [sidebarFilter, setSidebarFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("All");
  const [roleFilter, setRoleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [actionMenuId, setActionMenuId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const perPage = 15;

  // Close action menu on outside click
  useEffect(() => {
    const handler = () => setActionMenuId(null);
    window.addEventListener("click", handler);
    return () => window.removeEventListener("click", handler);
  }, []);

  /* ────── Merge Data ────── */
  const allUsers: MergedUser[] = useMemo(() => {
    const fromContext: MergedUser[] = employeesList.map((emp) => ({
      id: emp.id,
      name: emp.name,
      email: emp.email,
      initials: emp.name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2),
      role: emp.role || "Employee",
      department: emp.department || "—",
      location: emp.location || "—",
      designation: emp.designation || "—",
      joinedAt: emp.joinDate || new Date().toISOString().split("T")[0],
      employeeStatus: emp.status || "Active",
      accountStatus:
        emp.status === "Pending Invite" ? "Pending Invite" : "Active",
    }));

    try {
      const raw = localStorage.getItem("nexus_registered_users");
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<
          MergedUser & { status: string }
        >[];
        const contextEmails = new Set(
          fromContext.map((u) => u.email.toLowerCase()),
        );
        parsed.forEach((u) => {
          if (u.email && !contextEmails.has(u.email.toLowerCase())) {
            fromContext.push({
              id: u.id || `reg-${Math.random().toString(36).slice(2)}`,
              name: u.name || "Unknown",
              email: u.email,
              initials: (
                u.initials ||
                u.name
                  ?.split(" ")
                  .map((w: string) => w[0])
                  .join("") ||
                "U"
              )
                .toUpperCase()
                .slice(0, 2),
              role: u.role || "Employee",
              department: "—",
              location: "—",
              designation: "—",
              joinedAt: u.joinedAt
                ? u.joinedAt.split("T")[0]
                : new Date().toISOString().split("T")[0],
              employeeStatus: u.status || "Active",
              accountStatus: u.status || "Active",
            });
          }
        });
      }
    } catch (e) {
      console.error("Error reading registered users:", e);
    }
    return fromContext;
  }, [employeesList, refreshTrigger]);

  /* ────── Filter Options ────── */
  const departments = useMemo(() => {
    const set = new Set(allUsers.map((u) => u.department));
    return [
      "All",
      ...Array.from(set)
        .filter((d) => d !== "—")
        .sort(),
    ];
  }, [allUsers]);

  const roles = useMemo(() => {
    const set = new Set(allUsers.map((u) => u.role));
    return ["All", ...Array.from(set).sort()];
  }, [allUsers]);

  /* ────── Main Filter Logic ────── */
  const filtered = useMemo(() => {
    let list = [...allUsers];

    if (sidebarFilter === "login_enabled")
      list = list.filter((u) => u.accountStatus === "Active");
    else if (sidebarFilter === "login_disabled")
      list = list.filter(
        (u) =>
          u.accountStatus === "Inactive" || u.accountStatus === "Suspended",
      );
    else if (sidebarFilter === "invited")
      list = list.filter(
        (u) =>
          u.accountStatus === "Pending Invite" || u.accountStatus === "Pending",
      );
    else if (sidebarFilter === "deactivated")
      list = list.filter((u) => u.accountStatus === "Inactive");

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (u) =>
          u.name.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          u.id.toLowerCase().includes(q),
      );
    }

    if (deptFilter !== "All")
      list = list.filter((u) => u.department === deptFilter);
    if (roleFilter !== "All") list = list.filter((u) => u.role === roleFilter);
    if (statusFilter !== "All")
      list = list.filter((u) => u.accountStatus === statusFilter);

    return list;
  }, [allUsers, sidebarFilter, search, deptFilter, roleFilter, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paged = filtered.slice((page - 1) * perPage, page * perPage);

  const toggleRow = (id: string) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id],
    );
  };

  const toggleAll = () => {
    if (selectedRows.length === paged.length) setSelectedRows([]);
    else setSelectedRows(paged.map((u) => u.id));
  };

  const getStatusPill = (status: string) => {
    const s = STATUS_STYLES[status] || STATUS_STYLES["Active"];
    return (
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "5px",
          padding: "4px 10px",
          borderRadius: "20px",
          fontSize: "11px",
          fontWeight: 700,
          backgroundColor: s.bg,
          color: s.color,
        }}
      >
        <span
          style={{
            width: "6px",
            height: "6px",
            borderRadius: "50%",
            backgroundColor: s.dot,
          }}
        />
        {status}
      </span>
    );
  };
  return (
    <div
      style={{
        display: "flex",
        minHeight: "calc(100vh - 64px)",
        backgroundColor: "#f9fafb",
      }}
    >
      {/* ═══════ MAIN CONTENT ═══════ */}
      <div style={{ flex: 1, padding: "24px 32px", overflowY: "auto" }}>
        {/* ─── Header ─── */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "24px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <h1
              style={{
                fontSize: "24px",
                fontWeight: 800,
                color: "#111827",
                margin: 0,
              }}
            >
              Users
            </h1>
            <span
              style={{
                padding: "3px 10px",
                borderRadius: "20px",
                fontSize: "12px",
                fontWeight: 700,
                backgroundColor: "#eef2ff",
                color: "var(--primary)",
              }}
            >
              {allUsers.length} users
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <button
              onClick={() => navigate("/admin/manage-account/import")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "9px 18px",
                borderRadius: "10px",
                backgroundColor: "transparent",
                color: "var(--primary)",
                border: "1.5px solid var(--primary)",
                fontSize: "13px",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              <Download size={15} style={{ transform: "rotate(180deg)" }} />
              Bulk Import
            </button>
            <button
              onClick={() => navigate("/admin/manage-account/add")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "9px 18px",
                borderRadius: "10px",
                backgroundColor: "var(--primary)",
                color: "#ffffff",
                border: "none",
                fontSize: "13px",
                fontWeight: 700,
                cursor: "pointer",
                boxShadow: "0 2px 8px rgba(79,70,229,0.25)",
              }}
            >
              <Plus size={15} />
              Add User
            </button>
          </div>
        </div>

        {/* ─── Top Navigation Bar ─── */}
        <div className="w-full overflow-hidden mb-6">
          <div className="flex items-center gap-1 p-1 overflow-x-auto no-scrollbar scroll-smooth">
            {TOP_NAV_TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = sidebarFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setSidebarFilter(tab.id);
                    setPage(1);
                  }}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                    isActive
                      ? "bg-emerald-600 text-white shadow-sm"
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* ─── Search + Filter Bar ─── */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "16px",
            flexWrap: "wrap",
          }}
        >
          {/* Search */}
          <div
            style={{
              position: "relative",
              flex: "1 1 260px",
              maxWidth: "340px",
            }}
          >
            <Search
              size={15}
              style={{
                position: "absolute",
                left: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "#9ca3af",
              }}
            />
            <input
              type="text"
              placeholder="Search by name, email or ID…"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              style={{
                width: "100%",
                padding: "9px 12px 9px 36px",
                fontSize: "13px",
                border: "1px solid #e5e7eb",
                borderRadius: "10px",
                outline: "none",
                backgroundColor: "#ffffff",
                color: "#111827",
              }}
            />
          </div>

          {/* Department filter */}
          <select
            value={deptFilter}
            onChange={(e) => {
              setDeptFilter(e.target.value);
              setPage(1);
            }}
            style={{
              padding: "9px 12px",
              fontSize: "13px",
              border: "1px solid #e5e7eb",
              borderRadius: "10px",
              backgroundColor: "#ffffff",
              color: "#374151",
              cursor: "pointer",
              fontWeight: 500,
            }}
          >
            {departments.map((d) => (
              <option key={d} value={d}>
                {d === "All" ? "All Departments" : d}
              </option>
            ))}
          </select>

          {/* Role filter */}
          <select
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value);
              setPage(1);
            }}
            style={{
              padding: "9px 12px",
              fontSize: "13px",
              border: "1px solid #e5e7eb",
              borderRadius: "10px",
              backgroundColor: "#ffffff",
              color: "#374151",
              cursor: "pointer",
              fontWeight: 500,
            }}
          >
            {roles.map((r) => (
              <option key={r} value={r}>
                {r === "All" ? "All Roles" : r}
              </option>
            ))}
          </select>

          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            style={{
              padding: "9px 12px",
              fontSize: "13px",
              border: "1px solid #e5e7eb",
              borderRadius: "10px",
              backgroundColor: "#ffffff",
              color: "#374151",
              cursor: "pointer",
              fontWeight: 500,
            }}
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Pending Invite">Pending Invite</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        {/* ─── Active filters ─── */}
        {(deptFilter !== "All" ||
          roleFilter !== "All" ||
          statusFilter !== "All" ||
          search.trim()) && (
          <div
            style={{
              display: "flex",
              gap: "8px",
              marginBottom: "16px",
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            <span
              style={{ fontSize: "12px", fontWeight: 700, color: "#9ca3af" }}
            >
              Active filters:
            </span>
            {search.trim() && (
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                  padding: "3px 10px",
                  borderRadius: "16px",
                  fontSize: "11px",
                  fontWeight: 600,
                  backgroundColor: "#f3f4f6",
                  color: "#374151",
                  border: "1px solid #e5e7eb",
                }}
              >
                "{search}"
                <button
                  onClick={() => setSearch("")}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: 0,
                    display: "flex",
                  }}
                >
                  <X size={12} color="#9ca3af" />
                </button>
              </span>
            )}
            {deptFilter !== "All" && (
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                  padding: "3px 10px",
                  borderRadius: "16px",
                  fontSize: "11px",
                  fontWeight: 600,
                  backgroundColor: "#f3f4f6",
                  color: "#374151",
                  border: "1px solid #e5e7eb",
                }}
              >
                {deptFilter}
                <button
                  onClick={() => setDeptFilter("All")}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: 0,
                    display: "flex",
                  }}
                >
                  <X size={12} color="#9ca3af" />
                </button>
              </span>
            )}
            {roleFilter !== "All" && (
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                  padding: "3px 10px",
                  borderRadius: "16px",
                  fontSize: "11px",
                  fontWeight: 600,
                  backgroundColor: "#f3f4f6",
                  color: "#374151",
                  border: "1px solid #e5e7eb",
                }}
              >
                {roleFilter}
                <button
                  onClick={() => setRoleFilter("All")}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: 0,
                    display: "flex",
                  }}
                >
                  <X size={12} color="#9ca3af" />
                </button>
              </span>
            )}
            {statusFilter !== "All" && (
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                  padding: "3px 10px",
                  borderRadius: "16px",
                  fontSize: "11px",
                  fontWeight: 600,
                  backgroundColor: "#f3f4f6",
                  color: "#374151",
                  border: "1px solid #e5e7eb",
                }}
              >
                {statusFilter}
                <button
                  onClick={() => setStatusFilter("All")}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: 0,
                    display: "flex",
                  }}
                >
                  <X size={12} color="#9ca3af" />
                </button>
              </span>
            )}
            <button
              onClick={() => {
                setSearch("");
                setDeptFilter("All");
                setRoleFilter("All");
                setStatusFilter("All");
              }}
              style={{
                fontSize: "11px",
                fontWeight: 700,
                color: "#ef4444",
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
            >
              Clear all
            </button>
          </div>
        )}

        {/* ─── Users Table ─── */}
        <div
          style={{
            backgroundColor: "#ffffff",
            border: "1px solid #e5e7eb",
            borderRadius: "14px",
            overflow: "hidden",
          }}
        >
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "13px",
            }}
          >
            <thead>
              <tr
                style={{
                  backgroundColor: "#f9fafb",
                  borderBottom: "1px solid #e5e7eb",
                }}
              >
                <th
                  style={{
                    padding: "12px 16px",
                    width: "40px",
                    textAlign: "center",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={
                      selectedRows.length === paged.length && paged.length > 0
                    }
                    onChange={toggleAll}
                    style={{ accentColor: "var(--primary)", cursor: "pointer" }}
                  />
                </th>
                <th
                  style={{
                    padding: "12px 16px",
                    textAlign: "left",
                    fontWeight: 700,
                    color: "#6b7280",
                    fontSize: "11px",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  Basic Information
                </th>
                <th
                  style={{
                    padding: "12px 16px",
                    textAlign: "left",
                    fontWeight: 700,
                    color: "#6b7280",
                    fontSize: "11px",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  Date of Joining
                </th>
                <th
                  style={{
                    padding: "12px 16px",
                    textAlign: "left",
                    fontWeight: 700,
                    color: "#6b7280",
                    fontSize: "11px",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  Role
                </th>
                <th
                  style={{
                    padding: "12px 16px",
                    textAlign: "left",
                    fontWeight: 700,
                    color: "#6b7280",
                    fontSize: "11px",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  Department
                </th>
                <th
                  style={{
                    padding: "12px 16px",
                    textAlign: "left",
                    fontWeight: 700,
                    color: "#6b7280",
                    fontSize: "11px",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  Location
                </th>
                <th
                  style={{
                    padding: "12px 16px",
                    textAlign: "left",
                    fontWeight: 700,
                    color: "#6b7280",
                    fontSize: "11px",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  Employee Status
                </th>
                <th
                  style={{
                    padding: "12px 16px",
                    textAlign: "left",
                    fontWeight: 700,
                    color: "#6b7280",
                    fontSize: "11px",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  Account Status
                </th>
                <th
                  style={{
                    padding: "12px 16px",
                    width: "50px",
                    textAlign: "center",
                    fontWeight: 700,
                    color: "#6b7280",
                    fontSize: "11px",
                  }}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {paged.length === 0 ? (
                <tr>
                  <td
                    colSpan={9}
                    style={{
                      textAlign: "center",
                      padding: "48px 16px",
                      color: "#9ca3af",
                      fontSize: "14px",
                      fontWeight: 500,
                    }}
                  >
                    No users found matching your filters.
                  </td>
                </tr>
              ) : (
                paged.map((u) => (
                  <tr
                    key={u.id}
                    style={{
                      borderBottom: "1px solid #f3f4f6",
                      backgroundColor: selectedRows.includes(u.id)
                        ? "#f5f3ff"
                        : undefined,
                      transition: "background-color 0.1s",
                    }}
                    onMouseEnter={(e) => {
                      if (!selectedRows.includes(u.id))
                        (
                          e.currentTarget as HTMLTableRowElement
                        ).style.backgroundColor = "#fafafa";
                    }}
                    onMouseLeave={(e) => {
                      if (!selectedRows.includes(u.id))
                        (
                          e.currentTarget as HTMLTableRowElement
                        ).style.backgroundColor = "";
                    }}
                  >
                    {/* Checkbox */}
                    <td style={{ padding: "12px 16px", textAlign: "center" }}>
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(u.id)}
                        onChange={() => toggleRow(u.id)}
                        style={{ accentColor: "var(--primary)", cursor: "pointer" }}
                      />
                    </td>
                    {/* Avatar + Name + Email */}
                    <td style={{ padding: "12px 16px" }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                        }}
                      >
                        <div
                          style={{
                            width: "34px",
                            height: "34px",
                            borderRadius: "50%",
                            backgroundColor: "#eef2ff",
                            color: "var(--primary)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontWeight: 800,
                            fontSize: "11px",
                            flexShrink: 0,
                          }}
                        >
                          {u.initials}
                        </div>
                        <div>
                          <div
                            style={{
                              fontWeight: 700,
                              color: "#111827",
                              fontSize: "13px",
                            }}
                          >
                            {u.name}
                          </div>
                          <div
                            style={{
                              color: "#9ca3af",
                              fontSize: "11px",
                              fontWeight: 500,
                            }}
                          >
                            {u.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    {/* Date of Joining */}
                    <td
                      style={{
                        padding: "12px 16px",
                        color: "#6b7280",
                        fontWeight: 500,
                      }}
                    >
                      {u.joinedAt
                        ? new Date(u.joinedAt).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })
                        : "—"}
                    </td>
                    {/* Role */}
                    <td
                      style={{
                        padding: "12px 16px",
                        color: "#374151",
                        fontWeight: 600,
                      }}
                    >
                      {u.role}
                    </td>
                    {/* Department */}
                    <td
                      style={{
                        padding: "12px 16px",
                        color: "#6b7280",
                        fontWeight: 500,
                      }}
                    >
                      {u.department}
                    </td>
                    {/* Location */}
                    <td
                      style={{
                        padding: "12px 16px",
                        color: "#6b7280",
                        fontWeight: 500,
                      }}
                    >
                      {u.location}
                    </td>
                    {/* Employee Status */}
                    <td style={{ padding: "12px 16px" }}>
                      {getStatusPill(u.employeeStatus)}
                    </td>
                    {/* Account Status */}
                    <td style={{ padding: "12px 16px" }}>
                      {getStatusPill(u.accountStatus)}
                    </td>
                    {/* Actions */}
                    <td
                      style={{
                        padding: "12px 16px",
                        textAlign: "center",
                        position: "relative",
                      }}
                    >
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActionMenuId(actionMenuId === u.id ? null : u.id);
                        }}
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          padding: "4px",
                          borderRadius: "6px",
                          color: "#9ca3af",
                        }}
                      >
                        <MoreHorizontal size={16} />
                      </button>
                      {actionMenuId === u.id && (
                        <div
                          onClick={(e) => e.stopPropagation()}
                          style={{
                            position: "absolute",
                            right: "16px",
                            top: "100%",
                            width: "160px",
                            backgroundColor: "#ffffff",
                            border: "1px solid #e5e7eb",
                            borderRadius: "10px",
                            boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
                            zIndex: 50,
                            padding: "4px 0",
                          }}
                        >
                          {[
                            { icon: Eye, label: "View", color: "#374151" },
                            { icon: Pencil, label: "Edit", color: "#374151" },
                            {
                              icon: UserX,
                              label: "Deactivate",
                              color: "#f59e0b",
                            },
                            {
                              icon: Mail,
                              label: "Resend Invite",
                              color: "var(--primary)",
                            },
                            { icon: Trash2, label: "Delete", color: "#ef4444" },
                          ].map((action) => (
                            <button
                              key={action.label}
                              onClick={() => setActionMenuId(null)}
                              style={{
                                width: "100%",
                                textAlign: "left",
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                                padding: "8px 14px",
                                fontSize: "12px",
                                fontWeight: 600,
                                color: action.color,
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                              }}
                              onMouseEnter={(e) =>
                                (e.currentTarget.style.backgroundColor =
                                  "#f9fafb")
                              }
                              onMouseLeave={(e) =>
                                (e.currentTarget.style.backgroundColor = "")
                              }
                            >
                              <action.icon size={14} />
                              {action.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* ─── Pagination ─── */}
          {totalPages > 1 && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "12px 16px",
                borderTop: "1px solid #f3f4f6",
                fontSize: "12px",
                color: "#6b7280",
              }}
            >
              <span style={{ fontWeight: 600 }}>
                Showing {(page - 1) * perPage + 1}–
                {Math.min(page * perPage, filtered.length)} of {filtered.length}
              </span>
              <div style={{ display: "flex", gap: "4px" }}>
                <button
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                  style={{
                    padding: "6px 12px",
                    borderRadius: "8px",
                    border: "1px solid #e5e7eb",
                    backgroundColor: "#ffffff",
                    cursor: page === 1 ? "not-allowed" : "pointer",
                    opacity: page === 1 ? 0.5 : 1,
                    fontSize: "12px",
                    fontWeight: 600,
                  }}
                >
                  Previous
                </button>
                <button
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  style={{
                    padding: "6px 12px",
                    borderRadius: "8px",
                    border: "1px solid #e5e7eb",
                    backgroundColor: "#ffffff",
                    cursor: page === totalPages ? "not-allowed" : "pointer",
                    opacity: page === totalPages ? 0.5 : 1,
                    fontSize: "12px",
                    fontWeight: 600,
                  }}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ─── Bulk selection bar ─── */}
        {selectedRows.length > 0 && (
          <div
            style={{
              position: "fixed",
              bottom: "24px",
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              alignItems: "center",
              gap: "16px",
              padding: "12px 24px",
              backgroundColor: "#ffffff",
              border: "1.5px solid var(--primary)",
              borderRadius: "14px",
              boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
              zIndex: 40,
              fontSize: "13px",
              fontWeight: 700,
              color: "#111827",
            }}
          >
            <span>{selectedRows.length} selected</span>
            <button
              onClick={() => setSelectedRows([])}
              style={{
                padding: "6px 16px",
                borderRadius: "8px",
                border: "1px solid #e5e7eb",
                backgroundColor: "#f9fafb",
                cursor: "pointer",
                fontSize: "12px",
                fontWeight: 600,
                color: "#6b7280",
              }}
            >
              Clear
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
