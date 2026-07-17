import { useState } from "react";
import { useEmployees } from "../../context/AppContext";
import { useDepartments } from "./hooks/useDepartments";
import { Department } from "./types/department.types";
import { useDepartmentPermissions } from "./hooks/useDepartmentPermissions";
import { useDepartmentModals } from "./hooks/useDepartmentModals";
import { DepartmentHeader } from "./components/DepartmentHeader";
import { DepartmentStats } from "./components/DepartmentStats";
import { DepartmentFilters } from "./components/DepartmentFilters";
import { DepartmentGrid } from "./components/DepartmentGrid";
import { DepartmentTable } from "./components/DepartmentTable";
import { DepartmentFormModal } from "./modals/DepartmentFormModal";
import { AssignHeadModal } from "./modals/AssignHeadModal";
import { ViewEmployeesModal } from "./modals/ViewEmployeesModal";
import { DeleteDepartmentModal } from "./modals/DeleteDepartmentModal";
import { DepartmentDetailModal } from "./modals/DepartmentDetailModal";
import { showToast } from "../../components/workflow/ToastNotification";

export function DepartmentPage() {
  const { employeesList } = useEmployees();
  const {
    departmentsList,
    addDepartment,
    updateDepartment,
    deleteDepartment,
    assignHead,
  } = useDepartments();

  const handleToggleStatus = (dept: Department) => {
    const newStatus = dept.status === "Active" ? "Inactive" : "Active";
    updateDepartment(dept.id, { status: newStatus });
  };

  const { canCreate, canEdit, canDelete, shouldShowFinance, isDeptVisible } =
    useDepartmentPermissions();

  const {
    showAddModal,
    setShowAddModal,
    editDept,
    setEditDept,
    selectedDept,
    setSelectedDept,
    deleteConfirmDept,
    setDeleteConfirmDept,
    assignHeadDept,
    setAssignHeadDept,
    viewEmployeesDept,
    setViewEmployeesDept,
    showExportModal,
    setShowExportModal,
  } = useDepartmentModals();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "All" | "Active" | "Inactive"
  >("All");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  // Export report logic
  const handleExportCSV = () => {
    const visibleDepts = filteredDepartments;
    const header = "ID,Name,Code,Head,Status,Employees,Budget,Utilization\n";
    const rows = visibleDepts
      .map(
        (d) =>
          `"${d.id}","${d.name}","${d.code}","${d.head}","${d.status}",${d.employees},"${d.budgetAmount}","${d.budgetUsedPct}%"`,
      )
      .join("\n");

    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Departments_Report.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setShowExportModal(false);
    showToast("Report Exported", "success", "CSV downloaded successfully.");
  };

  // Filter list of departments based on scope & user criteria
  const filteredDepartments = departmentsList.filter((dept) => {
    // 1. Scope visibility check
    if (!isDeptVisible(dept)) return false;

    // 2. Search query filter
    const matchesSearch =
      dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dept.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dept.head.toLowerCase().includes(searchTerm.toLowerCase());

    // 3. Status filter
    const matchesStatus =
      statusFilter === "All" || dept.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="w-full px-4 md:px-8 py-6 pb-20">
      {/* Page Header */}
      <DepartmentHeader
        canCreate={canCreate}
        onAddClick={() => setShowAddModal(true)}
        onExportClick={() => setShowExportModal(true)}
      />

      {/* KPI Stats section */}
      <DepartmentStats
        departments={filteredDepartments}
        showFinance={shouldShowFinance}
      />

      {/* Filter and View mode controls */}
      <DepartmentFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      {/* List Layouts */}
      {viewMode === "grid" ? (
        <DepartmentGrid
          departments={filteredDepartments}
          canManage={canEdit}
          canDelete={canDelete}
          showFinance={shouldShowFinance}
          onViewClick={setSelectedDept}
          onEditClick={setEditDept}
          onDeleteClick={setDeleteConfirmDept}
          onAssignHeadClick={setAssignHeadDept}
          onAddClick={() => setShowAddModal(true)}
        />
      ) : (
        <DepartmentTable
          departments={filteredDepartments}
          canManage={canEdit}
          canDelete={canDelete}
          showFinance={shouldShowFinance}
          onViewClick={setSelectedDept}
          onEditClick={setEditDept}
          onDeleteClick={setDeleteConfirmDept}
          onAssignHeadClick={setAssignHeadDept}
        />
      )}

      {/* --- Overlay Modals --- */}
      {showAddModal && (
        <DepartmentFormModal
          employeesList={employeesList}
          onClose={() => setShowAddModal(false)}
          onSave={addDepartment}
        />
      )}

      {editDept && (
        <DepartmentFormModal
          dept={editDept}
          employeesList={employeesList}
          onClose={() => setEditDept(null)}
          onSave={(updated) => updateDepartment(editDept.id, updated)}
        />
      )}

      {selectedDept && (
        <DepartmentDetailModal
          dept={selectedDept}
          showFinance={shouldShowFinance}
          onClose={() => setSelectedDept(null)}
          onEdit={setEditDept}
          onDelete={setDeleteConfirmDept}
          onToggleStatus={handleToggleStatus}
          canEdit={canEdit}
          canDelete={canDelete}
        />
      )}

      {assignHeadDept && (
        <AssignHeadModal
          dept={assignHeadDept}
          employeesList={employeesList}
          onClose={() => setAssignHeadDept(null)}
          onAssign={(id, headName, reason) => assignHead(id, headName, reason)}
        />
      )}

      {viewEmployeesDept && (
        <ViewEmployeesModal
          dept={viewEmployeesDept}
          employeesList={employeesList}
          onClose={() => setViewEmployeesDept(null)}
        />
      )}

      {deleteConfirmDept && (
        <DeleteDepartmentModal
          dept={deleteConfirmDept}
          onClose={() => setDeleteConfirmDept(null)}
          onDelete={deleteDepartment}
        />
      )}

      {/* Export Confirmation modal */}
      {showExportModal && (
        <div
          className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setShowExportModal(false)}
        >
          <div
            className="w-full max-w-sm rounded-2xl bg-card shadow-xl border border-border p-6 animate-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100 mb-1">
              Export Department Report
            </h3>
            <p className="text-xs text-muted-foreground mb-6">
              Download current visible department roster and configurations to
              CSV.
            </p>
            <div className="flex gap-3">
              <button
                className="w-full py-2.5 rounded-xl text-xs font-extrabold text-slate-600 dark:text-slate-300 bg-neutral-100 dark:bg-zinc-800 hover:bg-neutral-200 transition-colors"
                onClick={() => setShowExportModal(false)}
              >
                Cancel
              </button>
              <button
                className="w-full py-2.5 rounded-xl text-xs font-extrabold text-white bg-primary hover:opacity-90 shadow-sm transition-all"
                onClick={handleExportCSV}
              >
                Export
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default DepartmentPage;
