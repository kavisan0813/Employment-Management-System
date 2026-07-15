import { useState, useMemo, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { useAuth } from "../../context/AuthContext";
import { useDebounce } from "../../hooks/useDebounce";
import { useEmployees, Employee } from "../../context/AppContext";
import { departments } from "./utils/employee.utils";
import {
  P,
  usePermissions,
  ROLE_IDS,
  RoleAssignment,
} from "../../shared/permission-engine";

import EmployeeHeader from "./components/EmployeeHeader";
import EmployeeFilters from "./components/EmployeeFilters";
import EmployeeTable from "./components/EmployeeTable";
import EmployeeGrid from "./components/EmployeeGrid";
import EmployeeTeam from "./components/EmployeeTeam";
import { EmployeeModals } from "./components/EmployeeModals";
import { useEmployeeModals } from "./hooks/useEmployeeModals";
import {
  Send,
  Download,
  UserCheck,
  Ban,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { showToast } from "../../components/workflow/ToastNotification";

const ROWS_PER_PAGE = 12;

function resolveHighestScope(
  assignments: RoleAssignment[],
): "organization" | "department" | "team" | "self" {
  const active = assignments.filter((a) => a.isActive);
  const scopes = active.map((a) => a.scopeType);
  if (scopes.includes("organization")) return "organization";
  if (scopes.includes("department")) return "department";
  if (scopes.includes("team")) return "team";
  return "self";
}

export function Employees() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    employeesList: employees,
    updateEmployee,
    deleteEmployee: removeEmployee,
    bulkImportEmployees,
  } = useEmployees();
  const { hasPermissionKey, roleAssignments } = usePermissions();

  // Find matching employee details for the logged-in user
  const currentEmp = useMemo(() => {
    if (!employees || !user) return null;
    return employees.find(
      (e) =>
        e.email.toLowerCase() === user.email.toLowerCase() ||
        e.name.toLowerCase() === user.name.toLowerCase(),
    );
  }, [employees, user]);

  const scope = useMemo(() => {
    return resolveHighestScope(roleAssignments);
  }, [roleAssignments]);

  // Scoped list of employees based on resolved scope from permission engine
  const scopedEmployees = useMemo(() => {
    if (!employees) return [];

    if (scope === "organization") {
      return employees;
    }

    if (scope === "department") {
      const dept = currentEmp?.department || "";
      if (!dept) return [];
      return employees.filter(
        (e) => e.department.toLowerCase() === dept.toLowerCase(),
      );
    }

    if (scope === "team") {
      const team = currentEmp?.team || "";
      if (!team) return [];
      return employees.filter(
        (e) => e.team && e.team.toLowerCase() === team.toLowerCase(),
      );
    }

    if (scope === "self") {
      const team = currentEmp?.team || "";
      return employees.filter(
        (e) =>
          e.email.toLowerCase() === user?.email?.toLowerCase() ||
          (team && e.team && e.team.toLowerCase() === team.toLowerCase()),
      );
    }

    return [];
  }, [employees, scope, currentEmp, user]);

  const allowedDepartments = useMemo(() => {
    if (scope === "organization") {
      return departments;
    }
    const dept = currentEmp?.department || "Engineering";
    return [dept];
  }, [scope, currentEmp]);

  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState(() => searchParams.get("search") || "");
  const debouncedSearch = useDebounce(search, 300);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut listener
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

  const [selectedDept, setSelectedDept] = useState(() => {
    if (scope === "organization") return "All Departments";
    return currentEmp?.department || "Engineering";
  });
  const [selectedTeam, setSelectedTeam] = useState(() => {
    if (scope === "team" || scope === "self")
      return currentEmp?.team || "Frontend";
    return "All Teams";
  });
  const [selectedStatus, setSelectedStatus] = useState("All Status");
  const [selectedDesignation, setSelectedDesignation] =
    useState("All Designations");
  const [selectedLocation, setSelectedLocation] = useState("All Locations");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [view, setView] = useState<"table" | "grid" | "team">("table");
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [sortCol, setSortCol] = useState("name");
  const [sortDesc, setSortDesc] = useState(false);
  const [page, setPage] = useState(1);
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);

  const {
    showImportModal,
    setShowImportModal,
    editEmployee,
    setEditEmployee,
    deleteEmployee,
    setDeleteEmployee,
  } = useEmployeeModals();

  const canManage =
    hasPermissionKey(P.EMPLOYEES_MANAGE) ||
    hasPermissionKey(P.EMPLOYEES_FULL) ||
    hasPermissionKey(P.EMPLOYEES_CREATE);

  // Helpers to get unique lists for filters
  const uniqueTeams = useMemo(() => {
    if (scope === "team" || scope === "self") {
      return [currentEmp?.team || "Frontend"];
    }

    const employeesInDept =
      selectedDept === "All Departments"
        ? scopedEmployees
        : scopedEmployees.filter((e) => e.department === selectedDept);

    return [
      "All Teams",
      ...Array.from(
        new Set(
          employeesInDept.filter((e) => e.team).map((e) => e.team as string),
        ),
      ),
    ];
  }, [scopedEmployees, selectedDept, scope, currentEmp]);

  const canEdit = (emp: Employee) => {
    // Super Admin / HR Manager can edit anyone
    if (
      hasPermissionKey(P.EMPLOYEES_MANAGE) ||
      hasPermissionKey(P.EMPLOYEES_FULL)
    )
      return true;
    // Employee can edit self
    if (emp.email.toLowerCase() === user?.email?.toLowerCase()) return true;

    // Check if the current user has a Manager role assignment
    const hasManagerRole = roleAssignments.some(
      (a) => a.roleId === ROLE_IDS.DEPT_MANAGER && a.isActive,
    );
    if (hasManagerRole) return true;

    // Manager can edit department members (department scope fallback)
    if (scope === "department") {
      const dept = currentEmp?.department || "";
      return !!(dept && emp.department.toLowerCase() === dept.toLowerCase());
    }
    // Team Lead can edit team members
    if (scope === "team") {
      const team = currentEmp?.team || "";
      return !!(
        team &&
        emp.team &&
        emp.team.toLowerCase() === team.toLowerCase()
      );
    }
    return false;
  };

  const canDeactivate = () => {
    // Super Admin / HR Manager can deactivate
    return (
      hasPermissionKey(P.EMPLOYEES_MANAGE) || hasPermissionKey(P.EMPLOYEES_FULL)
    );
  };

  const canDelete = () => {
    // Super Admin only (Legacy delete constraint)
    return user?.role === "Super Admin";
  };

  const uniqueDesignations = useMemo(() => {
    return [
      "All Designations",
      ...Array.from(new Set(scopedEmployees.map((e) => e.designation))),
    ];
  }, [scopedEmployees]);

  const uniqueLocations = useMemo(() => {
    return [
      "All Locations",
      ...Array.from(new Set(scopedEmployees.map((e) => e.location))),
    ];
  }, [scopedEmployees]);

  const uniqueTypes = useMemo(() => {
    return Array.from(new Set(scopedEmployees.map((e) => e.employmentType)));
  }, [scopedEmployees]);

  // Filtering Logic
  const filtered = useMemo(() => {
    return (scopedEmployees || []).filter((emp) => {
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

      const matchTeam =
        selectedTeam === "All Teams" || emp.team === selectedTeam;

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
        matchTeam &&
        matchStatus &&
        matchDesig &&
        matchLoc &&
        matchType
      );
    });
  }, [
    scopedEmployees,
    debouncedSearch,
    selectedDept,
    selectedTeam,
    selectedStatus,
    selectedDesignation,
    selectedLocation,
    selectedTypes,
  ]);

  // Sorting Logic
  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      const valA = a[sortCol as keyof Employee];
      const valB = b[sortCol as keyof Employee];
      const normA =
        valA === undefined || valA === null
          ? ""
          : typeof valA === "string"
            ? valA.toLowerCase()
            : valA;
      const normB =
        valB === undefined || valB === null
          ? ""
          : typeof valB === "string"
            ? valB.toLowerCase()
            : valB;
      if (typeof normA === "number" && typeof normB === "number") {
        if (normA < normB) return sortDesc ? 1 : -1;
        if (normA > normB) return sortDesc ? -1 : 1;
      } else {
        const strA = String(normA);
        const strB = String(normB);
        if (strA < strB) return sortDesc ? 1 : -1;
        if (strA > strB) return sortDesc ? -1 : 1;
      }
      return 0;
    });
  }, [filtered, sortCol, sortDesc]);

  const totalPages = useMemo(() => {
    return Math.ceil(sorted.length / ROWS_PER_PAGE);
  }, [sorted]);

  const paginated = useMemo(() => {
    return sorted.slice((page - 1) * ROWS_PER_PAGE, page * ROWS_PER_PAGE);
  }, [sorted, page]);

  // Handlers
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
    setPage(1);
  };

  const handleSort = (col: string) => {
    if (sortCol === col) {
      setSortDesc(!sortDesc);
    } else {
      setSortCol(col);
      setSortDesc(false);
    }
  };

  const clearFilters = () => {
    setSearch("");
    setSelectedDept("All Departments");
    setSelectedTeam("All Teams");
    setSelectedStatus("All Status");
    setSelectedDesignation("All Designations");
    setSelectedLocation("All Locations");
    setSelectedTypes([]);
    setPage(1);
  };

  const handleDeactivate = (emp: Employee) => {
    if (
      hasPermissionKey(P.EMPLOYEES_MANAGE) ||
      hasPermissionKey(P.EMPLOYEES_FULL)
    ) {
      updateEmployee(emp.id, {
        ...emp,
        status: "Inactive",
      });
      showToast(
        "Employee Deactivated",
        "success",
        `${emp.name} has been deactivated.`,
      );
    } else {
      setDeleteEmployee(emp);
    }
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
        onClear: () => {
          setSelectedDept("All Departments");
          setPage(1);
        },
      });
    }
    if (selectedTeam !== "All Teams") {
      chips.push({
        id: "team",
        label: selectedTeam,
        onClear: () => {
          setSelectedTeam("All Teams");
          setPage(1);
        },
      });
    }
    if (selectedDesignation !== "All Designations") {
      chips.push({
        id: "designation",
        label: selectedDesignation,
        onClear: () => {
          setSelectedDesignation("All Designations");
          setPage(1);
        },
      });
    }
    if (selectedLocation !== "All Locations") {
      chips.push({
        id: "location",
        label: selectedLocation,
        onClear: () => {
          setSelectedLocation("All Locations");
          setPage(1);
        },
      });
    }
    if (selectedStatus !== "All Status") {
      chips.push({
        id: "status",
        label: selectedStatus,
        onClear: () => {
          setSelectedStatus("All Status");
          setPage(1);
        },
      });
    }
    selectedTypes.forEach((type) => {
      chips.push({
        id: `type-${type}`,
        label: type,
        onClear: () => {
          setSelectedTypes((prev) => prev.filter((t) => t !== type));
          setPage(1);
        },
      });
    });
    return chips;
  }, [
    search,
    selectedDept,
    selectedTeam,
    selectedDesignation,
    selectedLocation,
    selectedStatus,
    selectedTypes,
  ]);

  return (
    <div
      className="w-full px-4 md:px-8 py-6 pb-10"
      onClick={() => setSelectedRows([])}
    >
      <EmployeeHeader
        scope={scope}
        filteredCount={filtered.length}
        canManage={canManage}
        onAdd={() => navigate("/employees/add")}
        onImport={() => setShowImportModal(true)}
      />

      <EmployeeFilters
        search={search}
        setSearch={(val) => {
          setSearch(val);
          setPage(1);
        }}
        selectedDept={selectedDept}
        setSelectedDept={(val) => {
          setSelectedDept(val);
          setPage(1);
        }}
        selectedTeam={selectedTeam}
        setSelectedTeam={(val) => {
          setSelectedTeam(val);
          setPage(1);
        }}
        selectedDesignation={selectedDesignation}
        setSelectedDesignation={(val) => {
          setSelectedDesignation(val);
          setPage(1);
        }}
        selectedLocation={selectedLocation}
        setSelectedLocation={(val) => {
          setSelectedLocation(val);
          setPage(1);
        }}
        selectedStatus={selectedStatus}
        setSelectedStatus={(val) => {
          setSelectedStatus(val);
          setPage(1);
        }}
        selectedTypes={selectedTypes}
        toggleType={toggleType}
        showTypeDropdown={showTypeDropdown}
        setShowTypeDropdown={setShowTypeDropdown}
        view={view}
        setView={setView}
        activeChips={activeChips}
        clearFilters={clearFilters}
        departments={allowedDepartments}
        uniqueTeams={uniqueTeams}
        uniqueDesignations={uniqueDesignations}
        uniqueLocations={uniqueLocations}
        uniqueTypes={uniqueTypes}
        searchInputRef={searchInputRef}
      />

      {/* Bulk Actions */}
      {selectedRows.length > 0 && (
        <div
          className="sticky z-30 flex items-center justify-between px-5 py-3 mb-4 rounded-xl shadow-md transition-all"
          style={{
            top: "140px",
            backgroundColor: "var(--card)",
            border: "1px solid var(--primary)",
          }}
          onClick={(e) => e.stopPropagation()}
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
          className="flex flex-col items-center justify-center py-20 px-4 rounded-2xl border border-dashed text-center animate-in fade-in"
          style={{
            backgroundColor: "var(--card)",
            borderColor: "var(--border)",
          }}
        >
          <div
            className="flex items-center justify-center w-16 h-16 rounded-full mb-4"
            style={{ backgroundColor: "var(--secondary)" }}
          >
            <Ban size={28} style={{ color: "var(--muted-foreground)" }} />
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
            className="px-5 py-2.5 rounded-xl font-bold text-sm text-white transition-all hover:opacity-90 active:scale-95 shadow-md border-none cursor-pointer"
            style={{
              backgroundColor: "#10B981",
              boxShadow: "0 4px 12px rgba(16,185,129,0.25)",
            }}
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <>
          {view === "table" && (
            <EmployeeTable
              paginated={paginated}
              selectedRows={selectedRows}
              hoveredRow={hoveredRow}
              setHoveredRow={setHoveredRow}
              sortCol={sortCol}
              sortDesc={sortDesc}
              onSort={handleSort}
              toggleAllRows={toggleAllRows}
              toggleRowSelection={toggleRowSelection}
              onEdit={setEditEmployee}
              onConfirmDelete={setDeleteEmployee}
              onDeactivate={handleDeactivate}
              canEdit={canEdit}
              canDeactivate={canDeactivate}
              canDelete={canDelete}
              debouncedSearch={debouncedSearch}
            />
          )}

          {view === "grid" && (
            <EmployeeGrid
              paginated={paginated}
              debouncedSearch={debouncedSearch}
              onViewProfile={(id) => navigate(`/employees/${id}`)}
            />
          )}

          {view === "team" && (
            <EmployeeTeam
              paginated={paginated}
              debouncedSearch={debouncedSearch}
              onViewProfile={(id) => navigate(`/employees/${id}`)}
            />
          )}

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
                    className="flex items-center justify-center w-9 h-9 rounded-xl transition-colors border bg-card"
                    style={{
                      borderColor: "var(--border)",
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
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (p) => (
                      <button
                        key={p}
                        onClick={() => setPage(p)}
                        className="w-9 h-9 rounded-xl transition-colors border"
                        style={{
                          borderColor: page === p ? "none" : "var(--border)",
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
                    ),
                  )}
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="flex items-center justify-center w-9 h-9 rounded-xl transition-colors border bg-card"
                    style={{
                      borderColor: "var(--border)",
                      color:
                        page === totalPages
                          ? "var(--muted-foreground)"
                          : "var(--foreground)",
                      backgroundColor:
                        page === totalPages
                          ? "var(--background)"
                          : "var(--card)",
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
        </>
      )}

      <EmployeeModals
        showImportModal={showImportModal}
        editEmployee={editEmployee}
        deleteEmployee={deleteEmployee}
        onCloseImport={() => setShowImportModal(false)}
        onCloseEdit={() => setEditEmployee(null)}
        onCloseDelete={() => setDeleteEmployee(null)}
        onImport={(emps) => {
          if (bulkImportEmployees) bulkImportEmployees(emps);
          setShowImportModal(false);
        }}
        onSaveEdit={(id, form) => {
          if (updateEmployee) {
            updateEmployee(id, {
              ...form,
              salary: Number(form.salary),
              status: form.status as Employee["status"],
            });
          }
          setEditEmployee(null);
        }}
        onConfirmDelete={() => {
          if (deleteEmployee && removeEmployee) {
            removeEmployee(deleteEmployee.id);
            setDeleteEmployee(null);
          }
        }}
      />
    </div>
  );
}
