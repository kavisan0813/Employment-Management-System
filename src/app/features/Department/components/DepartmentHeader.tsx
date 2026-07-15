import { Plus } from "lucide-react";

interface DepartmentHeaderProps {
  canCreate: boolean;
  onAddClick: () => void;
  onExportClick: () => void;
}

export function DepartmentHeader({
  canCreate,
  onAddClick,
  onExportClick,
}: DepartmentHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h2 className="text-2xl font-extrabold tracking-tight text-foreground">
          Departments
        </h2>
        <p className="text-xs font-medium text-muted-foreground mt-1">
          Manage organizational capacity boundaries efficiently.
        </p>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={onExportClick}
          className="flex items-center gap-2 rounded-xl px-4 py-2.5 transition-colors border border-border bg-card text-foreground hover:bg-secondary font-bold text-xs active:scale-95 shadow-sm"
        >
          Export Report
        </button>
        {canCreate && (
          <button
            onClick={onAddClick}
            className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-white transition-all bg-[#00B87C] hover:bg-[#00a36d] font-bold text-xs active:scale-95 shadow-sm"
          >
            <Plus size={18} />
            Add Department
          </button>
        )}
      </div>
    </div>
  );
}
