import { useState, useMemo, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../../../context/AuthContext";
import { useEmployees } from "../../../context/AppContext";
import { usePermissions } from "../../../shared/permission-engine/PermissionContext";
import { P } from "../../../shared/permission-engine/permissions";
import { PermissionGate } from "../../../shared/permission-engine/PermissionGate";
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
  Filter,
  Check,
  Building,
  MapPin,
  Briefcase,
  Rocket,
  ShieldCheck,
  Phone,
  Calendar,
  AlertTriangle,
  Info,
  ShieldAlert,
} from "lucide-react";
import toast from "react-hot-toast";

/* ────── MERGED USER MODEL ────── */
export interface MergedUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  initials: string;
  role: string;
  department: string;
  location: string;
  designation: string;
  employmentType: string;
  joinedAt: string;
  employeeStatus: string;
  accountStatus: string;
  organizationId: string;
  organizationName: string;
  avatarUrl?: string;
}

/* ────── TOP NAV TABS ────── */
const TOP_NAV_TABS = [
  { id: "all", label: "All Users", icon: Users },
  { id: "login_enabled", label: "Active Login", icon: UserCheck },
  { id: "invited", label: "Pending Invite", icon: Mail },
  { id: "deactivated", label: "Deactivated", icon: UserX },
];

/* ────── STATUS PILL COMPONENT ────── */
function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, { bg: string; text: string; dot: string }> = {
    Active: {
      bg: "bg-emerald-500/10 dark:bg-emerald-500/20",
      text: "text-emerald-600 dark:text-emerald-400",
      dot: "bg-emerald-500",
    },
    "Pending Invite": {
      bg: "bg-amber-500/10 dark:bg-amber-500/20",
      text: "text-amber-600 dark:text-amber-400",
      dot: "bg-amber-500",
    },
    Inactive: {
      bg: "bg-slate-500/10 dark:bg-slate-500/20",
      text: "text-slate-600 dark:text-slate-400",
      dot: "bg-slate-500",
    },
    Suspended: {
      bg: "bg-rose-500/10 dark:bg-rose-500/20",
      text: "text-rose-600 dark:text-rose-400",
      dot: "bg-rose-500",
    },
    Probation: {
      bg: "bg-purple-500/10 dark:bg-purple-500/20",
      text: "text-purple-600 dark:text-purple-400",
      dot: "bg-purple-500",
    },
  };

  const style = styles[status] || styles["Active"];

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${style.bg} ${style.text}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
      {status}
    </span>
  );
}

/* ────── USER SERVICE LAYER ────── */
const UserService = {
  updateUser: (updatedUser: Partial<MergedUser> & { id: string }) => {
    try {
      const raw = localStorage.getItem("viyan_registered_users:v1");
      const users = raw ? JSON.parse(raw) : [];
      const index = users.findIndex((u: { id: string }) => u.id === updatedUser.id);
      if (index !== -1) {
        users[index] = { ...users[index], ...updatedUser };
      } else {
        users.push(updatedUser);
      }
      localStorage.setItem("viyan_registered_users:v1", JSON.stringify(users));
      return true;
    } catch (e) {
      console.error("Failed to update user:", e);
      return false;
    }
  },
  deleteUser: (id: string) => {
    try {
      const raw = localStorage.getItem("viyan_registered_users:v1");
      if (!raw) return true;
      const users = JSON.parse(raw).filter((u: { id: string }) => u.id !== id);
      localStorage.setItem("viyan_registered_users:v1", JSON.stringify(users));
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
  activateUser: (id: string) => {
    return UserService.updateUser({
      id,
      accountStatus: "Active",
      employeeStatus: "Active",
    });
  },
  resendInvite: (id: string, email: string) => {
    toast.success(`Invitation link re-generated for ${email}`);
    return UserService.updateUser({
      id,
      accountStatus: "Pending Invite",
      employeeStatus: "Pending Invite",
    });
  },
};

export function ManageAccountUsers() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { employeesList, deleteEmployee, updateEmployee } = useEmployees();
  const { hasPermissionKey } = usePermissions();

  /* ─── Active Organization Context ─── */
  const activeOrgId = user?.organizationId || "org-1";
  const activeOrgName = user?.organization || "NexusHR Org";

  /* ─── Permission Check ─── */
  const canManageAccount =
    hasPermissionKey(P.MANAGE_ACCOUNT_MANAGE) ||
    hasPermissionKey(P.EMPLOYEES_MANAGE) ||
    hasPermissionKey(P.EMPLOYEES_CREATE) ||
    hasPermissionKey(P.PLATFORM_ADMIN_FULL);

  /* ─── State ─── */
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [sidebarFilter, setSidebarFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("All");
  const [locationFilter, setLocationFilter] = useState("All");
  const [roleFilter, setRoleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [employmentTypeFilter, setEmploymentTypeFilter] = useState("All");
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [actionMenuId, setActionMenuId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const perPage = 15;

  /* Modals */
  const [viewingUser, setViewingUser] = useState<MergedUser | null>(null);
  const [editingUser, setEditingUser] = useState<MergedUser | null>(null);
  const [deactivatingUser, setDeactivatingUser] = useState<MergedUser | null>(null);
  const [deletingUser, setDeletingUser] = useState<MergedUser | null>(null);
  const [showBulkResendModal, setShowBulkResendModal] = useState(false);

  // Indeterminate Checkbox Ref
  const selectAllCheckboxRef = useRef<HTMLInputElement>(null);

  // Close action menu on outside click
  useEffect(() => {
    const handler = () => setActionMenuId(null);
    window.addEventListener("click", handler);
    return () => window.removeEventListener("click", handler);
  }, []);

  // Clear Selection when Filters or Page Changes to prevent leaky bulk actions
  useEffect(() => {
    setSelectedRows([]);
  }, [sidebarFilter, search, deptFilter, locationFilter, roleFilter, statusFilter, employmentTypeFilter]);

  /* ────── Merge Data ────── */
  const allUsers: MergedUser[] = useMemo(() => {
    const fromContext: MergedUser[] = employeesList.map((emp) => ({
      id: emp.id,
      name: emp.name,
      email: emp.email,
      phone: emp.phone || "+91 98765 00000",
      initials: emp.name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2),
      role: emp.role || "Employee",
      department: emp.department || "Engineering",
      location: emp.location || "HQ - Bangalore",
      designation: emp.designation || "Team Member",
      employmentType: emp.employmentType || "Full-time",
      joinedAt: emp.joinDate || new Date().toISOString().split("T")[0],
      employeeStatus: emp.status || "Active",
      accountStatus: emp.status === "Pending Invite" ? "Pending Invite" : "Active",
      organizationId: activeOrgId,
      organizationName: activeOrgName,
    }));

    try {
      const raw = localStorage.getItem("viyan_registered_users:v1");
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<MergedUser & { status: string }>[];
        const contextEmails = new Set(fromContext.map((u) => u.email.toLowerCase()));

        parsed.forEach((u) => {
          if (u.email && !contextEmails.has(u.email.toLowerCase())) {
            fromContext.push({
              id: u.id || `reg-${Math.random().toString(36).slice(2)}`,
              name: u.name || "Unknown User",
              email: u.email,
              phone: u.phone || "+91 98765 00000",
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
              department: u.department || "General",
              location: u.location || "HQ - Bangalore",
              designation: u.designation || "Member",
              employmentType: u.employmentType || "Full-time",
              joinedAt: u.joinedAt ? u.joinedAt.split("T")[0] : new Date().toISOString().split("T")[0],
              employeeStatus: u.status || "Active",
              accountStatus: u.status || "Active",
              organizationId: activeOrgId,
              organizationName: activeOrgName,
            });
          }
        });
      }
    } catch (e) {
      console.error("Error reading registered users:", e);
    }
    return fromContext;
  }, [employeesList, refreshTrigger, activeOrgId, activeOrgName]);

  /* ────── Filter Options ────── */
  const departments = useMemo(() => {
    const set = new Set(allUsers.map((u) => u.department).filter((d) => d && d !== "—"));
    return ["All", ...Array.from(set).sort()];
  }, [allUsers]);

  const locations = useMemo(() => {
    const set = new Set(allUsers.map((u) => u.location).filter((l) => l && l !== "—"));
    return ["All", ...Array.from(set).sort()];
  }, [allUsers]);

  const roles = useMemo(() => {
    const set = new Set(allUsers.flatMap((u) => (u.role ? [u.role] : [])));
    return ["All", ...Array.from(set).sort()];
  }, [allUsers]);

  const employmentTypes = useMemo(() => {
    const set = new Set(allUsers.flatMap((u) => (u.employmentType ? [u.employmentType] : [])));
    return ["All", ...Array.from(set).sort()];
  }, [allUsers]);

  /* ────── Filter Logic ────── */
  const filtered = useMemo(() => {
    let list = [...allUsers];

    // Tab Filters
    if (sidebarFilter === "login_enabled") list = list.filter((u) => u.accountStatus === "Active");
    else if (sidebarFilter === "invited") list = list.filter((u) => u.accountStatus === "Pending Invite");
    else if (sidebarFilter === "deactivated") list = list.filter((u) => u.accountStatus === "Inactive");

    // Search Query (Name, Email, ID, Phone)
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (u) =>
          u.name.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          u.id.toLowerCase().includes(q) ||
          u.phone.toLowerCase().includes(q)
      );
    }

    // Dropdown Filters
    if (deptFilter !== "All") list = list.filter((u) => u.department === deptFilter);
    if (locationFilter !== "All") list = list.filter((u) => u.location === locationFilter);
    if (roleFilter !== "All") list = list.filter((u) => u.role === roleFilter);
    if (statusFilter !== "All") list = list.filter((u) => u.accountStatus === statusFilter);
    if (employmentTypeFilter !== "All") list = list.filter((u) => u.employmentType === employmentTypeFilter);

    return list;
  }, [allUsers, sidebarFilter, search, deptFilter, locationFilter, roleFilter, statusFilter, employmentTypeFilter]);

  /* Pagination */
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paged = filtered.slice((page - 1) * perPage, page * perPage);
  const selectedRowsSet = new Set(selectedRows);

  /* Indeterminate Checkbox State Handling */
  const allPagedSelected = paged.length > 0 && paged.every((u) => selectedRowsSet.has(u.id));
  const somePagedSelected = paged.some((u) => selectedRowsSet.has(u.id)) && !allPagedSelected;

  useEffect(() => {
    if (selectAllCheckboxRef.current) {
      selectAllCheckboxRef.current.indeterminate = somePagedSelected;
    }
  }, [somePagedSelected]);

  /* Selection Handlers */
  const toggleRow = (id: string) => {
    setSelectedRows((prev) => (prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]));
  };

  const toggleAllPaged = () => {
    if (allPagedSelected) {
      const pagedIds = new Set(paged.map((u) => u.id));
      setSelectedRows((prev) => prev.filter((id) => !pagedIds.has(id)));
    } else {
      const pagedIds = paged.map((u) => u.id);
      setSelectedRows((prev) => Array.from(new Set([...prev, ...pagedIds])));
    }
  };

  /* ────── BULK ACTIONS ────── */
  const handleConfirmBulkResend = () => {
    if (!canManageAccount) return;
    let resentCount = 0;
    let skippedCount = 0;

    selectedRows.forEach((id) => {
      const targetUser = allUsers.find((u) => u.id === id);
      if (targetUser) {
        if (targetUser.accountStatus === "Pending Invite" || targetUser.accountStatus === "Inactive") {
          UserService.resendInvite(id, targetUser.email);
          resentCount++;
        } else {
          skippedCount++;
        }
      }
    });

    toast.success(`${resentCount} invitations re-generated. ${skippedCount} skipped (already active).`);
    setShowBulkResendModal(false);
    setSelectedRows([]);
    setRefreshTrigger((t) => t + 1);
  };

  const handleBulkDeactivate = () => {
    if (!canManageAccount) return;
    selectedRows.forEach((id) => {
      UserService.deactivateUser(id);
    });
    toast.success(`Deactivated ${selectedRows.length} users.`);
    setSelectedRows([]);
    setRefreshTrigger((t) => t + 1);
  };

  const handleBulkOnboarding = () => {
    toast.success(`Navigating to onboarding flow for selected users.`);
    navigate("/onboarding");
  };

  /* ────── INDIVIDUAL USER ACTIONS ────── */
  const handleConfirmDeactivateSingle = () => {
    if (!canManageAccount || !deactivatingUser) return;
    UserService.deactivateUser(deactivatingUser.id);
    updateEmployee(deactivatingUser.id, { status: "Inactive" });
    toast.success(`${deactivatingUser.name} has been deactivated.`);
    setDeactivatingUser(null);
    setRefreshTrigger((t) => t + 1);
  };

  const handleActivate = (user: MergedUser) => {
    if (!canManageAccount) return;
    UserService.activateUser(user.id);
    updateEmployee(user.id, { status: "Active" });
    toast.success(`${user.name} account is now active.`);
    setRefreshTrigger((t) => t + 1);
  };

  const handleResendSingleInvite = (user: MergedUser) => {
    if (!canManageAccount) return;
    UserService.resendInvite(user.id, user.email);
    setRefreshTrigger((t) => t + 1);
  };

  const handleDeleteUserConfirm = () => {
    if (!canManageAccount || !deletingUser) return;
    UserService.deleteUser(deletingUser.id);
    deleteEmployee(deletingUser.id);
    toast.success(`${deletingUser.name} account permanently deleted.`);
    setDeletingUser(null);
    setRefreshTrigger((t) => t + 1);
  };

  const handleSaveEditUser = () => {
    if (!editingUser || !canManageAccount) return;
    UserService.updateUser(editingUser);
    updateEmployee(editingUser.id, {
      role: editingUser.role,
      department: editingUser.department,
      location: editingUser.location,
      designation: editingUser.designation,
      employmentType: editingUser.employmentType,
      status: editingUser.accountStatus as any,
    });
    toast.success(`Updated ${editingUser.name}'s account.`);
    setEditingUser(null);
    setRefreshTrigger((t) => t + 1);
  };

  return (
    <div className="w-full min-h-[calc(100vh-64px)] bg-background text-foreground transition-colors duration-200">
      <div className="px-4 sm:px-8 py-8">
        {/* ═══ HEADER ═══ */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                User Directory & Accounts
              </h1>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary">
                {allUsers.length} total users
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1.5">
              <Building size={14} className="text-primary" /> Active Tenant: <strong className="text-foreground">{activeOrgName}</strong>
            </p>
          </div>

          <PermissionGate requires={P.MANAGE_ACCOUNT_MANAGE}>
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate("/admin/manage-account/import")}
                className="px-4 py-2.5 rounded-xl border border-border bg-card hover:bg-secondary text-foreground text-xs font-bold flex items-center gap-2 transition-all shadow-sm cursor-pointer"
              >
                <Download size={15} className="text-primary rotate-180" /> Bulk Import
              </button>
              <button
                onClick={() => navigate("/admin/manage-account/add")}
                className="px-4 py-2.5 rounded-xl bg-primary text-white text-xs font-bold flex items-center gap-2 transition-all shadow-md shadow-primary/20 hover:opacity-90 cursor-pointer"
              >
                <Plus size={16} /> Add User
              </button>
            </div>
          </PermissionGate>
        </div>

        {/* ═══ TOP NAVIGATION TABS ═══ */}
        <div className="w-full border-b border-border mb-6 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-2 pb-2">
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
                  className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    isActive
                      ? "bg-primary text-white shadow-md shadow-primary/20"
                      : "bg-secondary/50 text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* ═══ SEARCH & FILTERS BAR ═══ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 mb-4">
          {/* Search Input */}
          <div className="lg:col-span-2 relative">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search name, email, ID, phone..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-card text-foreground font-semibold text-xs outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          {/* Department Filter */}
          <select
            value={deptFilter}
            onChange={(e) => {
              setDeptFilter(e.target.value);
              setPage(1);
            }}
            className="w-full p-2.5 rounded-xl border border-border bg-card text-foreground font-semibold text-xs outline-none focus:ring-2 focus:ring-primary/20"
          >
            {departments.map((d) => (
              <option key={d} value={d}>
                {d === "All" ? "All Departments" : d}
              </option>
            ))}
          </select>

          {/* Location Filter */}
          <select
            value={locationFilter}
            onChange={(e) => {
              setLocationFilter(e.target.value);
              setPage(1);
            }}
            className="w-full p-2.5 rounded-xl border border-border bg-card text-foreground font-semibold text-xs outline-none focus:ring-2 focus:ring-primary/20"
          >
            {locations.map((l) => (
              <option key={l} value={l}>
                {l === "All" ? "All Locations" : l}
              </option>
            ))}
          </select>

          {/* Role Filter */}
          <select
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value);
              setPage(1);
            }}
            className="w-full p-2.5 rounded-xl border border-border bg-card text-foreground font-semibold text-xs outline-none focus:ring-2 focus:ring-primary/20"
          >
            {roles.map((r) => (
              <option key={r} value={r}>
                {r === "All" ? "All System Roles" : r}
              </option>
            ))}
          </select>

          {/* Employment Type Filter */}
          <select
            value={employmentTypeFilter}
            onChange={(e) => {
              setEmploymentTypeFilter(e.target.value);
              setPage(1);
            }}
            className="w-full p-2.5 rounded-xl border border-border bg-card text-foreground font-semibold text-xs outline-none focus:ring-2 focus:ring-primary/20"
          >
            {employmentTypes.map((t) => (
              <option key={t} value={t}>
                {t === "All" ? "All Employment Types" : t}
              </option>
            ))}
          </select>
        </div>

        {/* Active Filter Badges */}
        {(deptFilter !== "All" ||
          locationFilter !== "All" ||
          roleFilter !== "All" ||
          statusFilter !== "All" ||
          employmentTypeFilter !== "All" ||
          search.trim()) && (
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Active Filters:</span>
            {search.trim() && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary text-foreground text-xs font-bold border border-border">
                "{search}"
                <button onClick={() => setSearch("")} className="hover:text-rose-500">
                  <X size={12} />
                </button>
              </span>
            )}
            {deptFilter !== "All" && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary text-foreground text-xs font-bold border border-border">
                Dept: {deptFilter}
                <button onClick={() => setDeptFilter("All")} className="hover:text-rose-500">
                  <X size={12} />
                </button>
              </span>
            )}
            {locationFilter !== "All" && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary text-foreground text-xs font-bold border border-border">
                Location: {locationFilter}
                <button onClick={() => setLocationFilter("All")} className="hover:text-rose-500">
                  <X size={12} />
                </button>
              </span>
            )}
            {roleFilter !== "All" && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary text-foreground text-xs font-bold border border-border">
                Role: {roleFilter}
                <button onClick={() => setRoleFilter("All")} className="hover:text-rose-500">
                  <X size={12} />
                </button>
              </span>
            )}
            <button
              onClick={() => {
                setSearch("");
                setDeptFilter("All");
                setLocationFilter("All");
                setRoleFilter("All");
                setStatusFilter("All");
                setEmploymentTypeFilter("All");
              }}
              className="text-xs font-bold text-rose-500 hover:underline ml-2 cursor-pointer"
            >
              Clear All Filters
            </button>
          </div>
        )}

        {/* ═══ USERS TABLE ═══ */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-secondary text-muted-foreground font-black uppercase tracking-wider border-b border-border">
                <tr>
                  <th className="p-4 w-10 text-center">
                    <input
                      ref={selectAllCheckboxRef}
                      type="checkbox"
                      checked={allPagedSelected}
                      onChange={toggleAllPaged}
                      className="accent-primary cursor-pointer w-4 h-4 rounded"
                    />
                  </th>
                  <th className="p-4">User Info</th>
                  <th className="p-4">Employee ID</th>
                  <th className="p-4">System Role</th>
                  <th className="p-4">Department & Location</th>
                  <th className="p-4">Joining Date</th>
                  <th className="p-4">Account Status</th>
                  <th className="p-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-card text-foreground">
                {paged.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-12 text-center text-muted-foreground font-semibold">
                      No users match your specified filters or search query.
                    </td>
                  </tr>
                ) : (
                  paged.map((u) => {
                    const isSelected = selectedRowsSet.has(u.id);
                    return (
                      <tr
                        key={u.id}
                        className={`transition-colors hover:bg-secondary/40 ${
                          isSelected ? "bg-primary/5" : ""
                        }`}
                      >
                        <td className="p-4 text-center">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleRow(u.id)}
                            className="accent-primary cursor-pointer w-4 h-4 rounded"
                          />
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-primary/10 text-primary font-black flex items-center justify-center text-xs shrink-0">
                              {u.initials}
                            </div>
                            <div>
                              <p className="font-extrabold text-foreground text-xs leading-tight">{u.name}</p>
                              <p className="text-[11px] text-muted-foreground font-medium">{u.email}</p>
                              <p className="text-[10px] text-muted-foreground font-mono">{u.phone}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 font-mono font-bold text-primary">{u.id}</td>
                        <td className="p-4 font-extrabold text-foreground">{u.role}</td>
                        <td className="p-4">
                          <p className="font-bold text-foreground">{u.department}</p>
                          <p className="text-[11px] text-muted-foreground">{u.location}</p>
                        </td>
                        <td className="p-4 text-muted-foreground font-medium">
                          {u.joinedAt ? new Date(u.joinedAt).toLocaleDateString("en-IN") : "—"}
                        </td>
                        <td className="p-4">
                          <StatusBadge status={u.accountStatus} />
                        </td>
                        <td className="p-4 text-center relative">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setActionMenuId(actionMenuId === u.id ? null : u.id);
                            }}
                            className="p-2 rounded-xl hover:bg-secondary text-muted-foreground transition-colors cursor-pointer"
                          >
                            <MoreHorizontal size={16} />
                          </button>

                          {/* Action Dropdown */}
                          {actionMenuId === u.id && (
                            <div
                              onClick={(e) => e.stopPropagation()}
                              className="absolute right-6 top-10 w-44 bg-card border border-border rounded-xl shadow-xl z-50 py-1.5 text-left"
                            >
                              <button
                                onClick={() => {
                                  setActionMenuId(null);
                                  setViewingUser(u);
                                }}
                                className="w-full px-4 py-2 text-xs font-bold text-foreground hover:bg-secondary flex items-center gap-2 cursor-pointer"
                              >
                                <Eye size={14} className="text-primary" /> View Details
                              </button>

                              <PermissionGate requires={P.MANAGE_ACCOUNT_MANAGE}>
                                <button
                                  onClick={() => {
                                    setActionMenuId(null);
                                    setEditingUser(u);
                                  }}
                                  className="w-full px-4 py-2 text-xs font-bold text-foreground hover:bg-secondary flex items-center gap-2 cursor-pointer"
                                >
                                  <Pencil size={14} className="text-blue-500" /> Edit Profile
                                </button>

                                {u.accountStatus === "Active" ? (
                                  <button
                                    onClick={() => {
                                      setActionMenuId(null);
                                      setDeactivatingUser(u);
                                    }}
                                    className="w-full px-4 py-2 text-xs font-bold text-amber-600 hover:bg-secondary flex items-center gap-2 cursor-pointer"
                                  >
                                    <UserX size={14} /> Deactivate
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => {
                                      setActionMenuId(null);
                                      handleActivate(u);
                                    }}
                                    className="w-full px-4 py-2 text-xs font-bold text-emerald-600 hover:bg-secondary flex items-center gap-2 cursor-pointer"
                                  >
                                    <UserCheck size={14} /> Activate
                                  </button>
                                )}

                                <button
                                  onClick={() => {
                                    setActionMenuId(null);
                                    handleResendSingleInvite(u);
                                  }}
                                  className="w-full px-4 py-2 text-xs font-bold text-primary hover:bg-secondary flex items-center gap-2 cursor-pointer"
                                >
                                  <Mail size={14} /> Resend Invite
                                </button>

                                <button
                                  onClick={() => {
                                    setActionMenuId(null);
                                    navigate("/onboarding", {
                                      state: { employeeId: u.id, employeeName: u.name },
                                    });
                                  }}
                                  className="w-full px-4 py-2 text-xs font-bold text-purple-600 hover:bg-secondary flex items-center gap-2 cursor-pointer"
                                >
                                  <Rocket size={14} /> Start Onboarding
                                </button>

                                <button
                                  onClick={() => {
                                    setActionMenuId(null);
                                    setDeletingUser(u);
                                  }}
                                  className="w-full px-4 py-2 text-xs font-bold text-rose-600 hover:bg-secondary flex items-center gap-2 cursor-pointer"
                                >
                                  <Trash2 size={14} /> Delete User
                                </button>
                              </PermissionGate>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* ═══ PAGINATION ═══ */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between p-4 border-t border-border bg-secondary/20 text-xs font-bold text-muted-foreground">
              <span>
                Showing {(page - 1) * perPage + 1}–{Math.min(page * perPage, filtered.length)} of {filtered.length}
              </span>
              <div className="flex items-center gap-2">
                <button
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="px-3.5 py-1.5 rounded-lg border border-border bg-card text-foreground hover:bg-secondary disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  Previous
                </button>
                <span className="px-2">Page {page} of {totalPages}</span>
                <button
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="px-3.5 py-1.5 rounded-lg border border-border bg-card text-foreground hover:bg-secondary disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ═══ FLOATING BULK ACTIONS TOOLBAR ═══ */}
      {selectedRows.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-card border-2 border-primary rounded-2xl shadow-2xl z-50 p-4 flex items-center gap-4 text-xs font-bold text-foreground">
          <span className="bg-primary/10 text-primary px-3 py-1 rounded-full font-black">
            {selectedRows.length} users selected
          </span>

          <PermissionGate requires={P.MANAGE_ACCOUNT_MANAGE}>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowBulkResendModal(true)}
                className="px-3.5 py-2 rounded-xl bg-primary text-white hover:opacity-90 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Mail size={14} /> Resend Invites
              </button>
              <button
                onClick={handleBulkDeactivate}
                className="px-3.5 py-2 rounded-xl bg-amber-500 text-white hover:opacity-90 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <UserX size={14} /> Deactivate
              </button>
              <button
                onClick={handleBulkOnboarding}
                className="px-3.5 py-2 rounded-xl bg-purple-600 text-white hover:opacity-90 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Rocket size={14} /> Onboarding
              </button>
            </div>
          </PermissionGate>

          <button
            onClick={() => setSelectedRows([])}
            className="px-3 py-2 rounded-xl border border-border bg-secondary hover:bg-secondary/80 text-muted-foreground hover:text-foreground transition-all cursor-pointer"
          >
            Clear Selection
          </button>
        </div>
      )}

      {/* ═══ VIEW USER MODAL ═══ */}
      {viewingUser && (
        <div className="fixed inset-0 z-[3000] bg-black/50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 text-primary font-black flex items-center justify-center text-sm">
                  {viewingUser.initials}
                </div>
                <div>
                  <h3 className="text-lg font-black text-foreground">{viewingUser.name}</h3>
                  <p className="text-xs text-muted-foreground">{viewingUser.email}</p>
                </div>
              </div>
              <button onClick={() => setViewingUser(null)} className="p-2 rounded-xl hover:bg-secondary text-muted-foreground">
                <X size={18} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-[10px] font-bold text-muted-foreground uppercase block">Employee ID</span>
                <span className="font-mono font-bold text-primary">{viewingUser.id}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-muted-foreground uppercase block">System Role</span>
                <span className="font-bold text-foreground">{viewingUser.role}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-muted-foreground uppercase block">Department</span>
                <span className="font-bold text-foreground">{viewingUser.department}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-muted-foreground uppercase block">Location</span>
                <span className="font-bold text-foreground">{viewingUser.location}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-muted-foreground uppercase block">Contact Phone</span>
                <span className="font-mono text-foreground">{viewingUser.phone}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-muted-foreground uppercase block">Tenant Context</span>
                <span className="font-bold text-foreground">{viewingUser.organizationName}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-muted-foreground uppercase block">Account Status</span>
                <StatusBadge status={viewingUser.accountStatus} />
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-border">
              <button
                onClick={() => setViewingUser(null)}
                className="px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-bold hover:opacity-90"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══ EDIT USER MODAL ═══ */}
      {editingUser && (
        <div className="fixed inset-0 z-[3000] bg-black/50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <h3 className="text-lg font-black text-foreground">Edit User Profile & Role</h3>
              <button onClick={() => setEditingUser(null)} className="p-2 rounded-xl hover:bg-secondary text-muted-foreground">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold uppercase text-[10px] text-muted-foreground mb-1">Full Name</label>
                <input
                  type="text"
                  className="w-full p-3 rounded-xl border border-border bg-background text-foreground font-bold"
                  value={editingUser.name}
                  onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                />
              </div>

              <div>
                <label className="block font-bold uppercase text-[10px] text-muted-foreground mb-1">System Role</label>
                <select
                  className="w-full p-3 rounded-xl border border-border bg-background text-foreground font-bold"
                  value={editingUser.role}
                  onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                >
                  <option value="Employee">Employee</option>
                  <option value="Manager">Manager</option>
                  <option value="HR Manager">HR Manager</option>
                  <option value="Finance">Finance</option>
                  <option value="Super Admin">Super Admin</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold uppercase text-[10px] text-muted-foreground mb-1">Department</label>
                  <input
                    type="text"
                    className="w-full p-3 rounded-xl border border-border bg-background text-foreground font-bold"
                    value={editingUser.department}
                    onChange={(e) => setEditingUser({ ...editingUser, department: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block font-bold uppercase text-[10px] text-muted-foreground mb-1">Location</label>
                  <input
                    type="text"
                    className="w-full p-3 rounded-xl border border-border bg-background text-foreground font-bold"
                    value={editingUser.location}
                    onChange={(e) => setEditingUser({ ...editingUser, location: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
              <button
                onClick={() => setEditingUser(null)}
                className="px-4 py-2.5 rounded-xl border border-border bg-card text-foreground text-xs font-bold hover:bg-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEditUser}
                className="px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-bold hover:opacity-90"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══ DEACTIVATE CONFIRMATION MODAL ═══ */}
      {deactivatingUser && (
        <div className="fixed inset-0 z-[3000] bg-black/50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-6 text-center">
            <div className="w-14 h-14 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto">
              <UserX size={32} />
            </div>
            <div>
              <h3 className="text-lg font-black text-foreground">Deactivate User Account</h3>
              <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                Deactivating <strong>{deactivatingUser.name}</strong> will temporarily disable system login credentials. Their employee record and historical data will be preserved.
              </p>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setDeactivatingUser(null)}
                className="flex-1 py-3 rounded-xl border border-border bg-card text-foreground text-xs font-bold hover:bg-secondary cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDeactivateSingle}
                className="flex-1 py-3 rounded-xl bg-amber-500 text-white text-xs font-bold hover:bg-amber-600 shadow-md cursor-pointer"
              >
                Deactivate Account
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══ DELETE CONFIRMATION MODAL ═══ */}
      {deletingUser && (
        <div className="fixed inset-0 z-[3000] bg-black/50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-6 text-center">
            <div className="w-14 h-14 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto">
              <ShieldAlert size={32} />
            </div>
            <div>
              <h3 className="text-lg font-black text-foreground">Confirm Permanent Delete</h3>
              <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                Are you sure you want to permanently delete <strong>{deletingUser.name}</strong>? This removes account access and employee directory association.
              </p>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setDeletingUser(null)}
                className="flex-1 py-3 rounded-xl border border-border bg-card text-foreground text-xs font-bold hover:bg-secondary cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteUserConfirm}
                className="flex-1 py-3 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 shadow-md cursor-pointer"
              >
                Permanently Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══ BULK RESEND CONFIRMATION MODAL ═══ */}
      {showBulkResendModal && (
        <div className="fixed inset-0 z-[3000] bg-black/50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-6 text-center">
            <div className="w-14 h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto">
              <Mail size={32} />
            </div>
            <div>
              <h3 className="text-lg font-black text-foreground">Bulk Resend Invitations</h3>
              <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                Re-generate and issue invitation links for {selectedRows.length} selected users. Active users will be skipped automatically.
              </p>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setShowBulkResendModal(false)}
                className="flex-1 py-3 rounded-xl border border-border bg-card text-foreground text-xs font-bold hover:bg-secondary cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmBulkResend}
                className="flex-1 py-3 rounded-xl bg-primary text-white text-xs font-bold hover:opacity-90 shadow-md cursor-pointer"
              >
                Send Invites
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
