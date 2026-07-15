import { Plus, Download } from "lucide-react";

interface EmployeeHeaderProps {
  scope: "organization" | "department" | "team" | "self";
  filteredCount: number;
  canManage: boolean;
  onAdd: () => void;
  onImport: () => void;
}

export default function EmployeeHeader({
  scope,
  filteredCount,
  canManage,
  onAdd,
  onImport,
}: EmployeeHeaderProps) {
  let title = "Employee Directory";
  let subtitle = `Managing ${filteredCount} total employees`;

  if (scope === "department") {
    title = "My Department";
    subtitle = "View and manage employees in your assigned department";
  } else if (scope === "team") {
    title = "My Team";
    subtitle = "View and manage your direct reports";
  } else if (scope === "self") {
    title = "My Profile & Team";
    subtitle = "View your profile and your assigned team members";
  }

  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h2 className="text-3xl font-black tracking-tight" style={{ color: "var(--foreground)" }}>
          {title}
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          {subtitle}
        </p>
      </div>

      {canManage && (
        <div className="flex items-center gap-3">
          <button
            onClick={onImport}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl border font-semibold"
            style={{ backgroundColor: "var(--secondary)", color: "var(--primary)" }}
          >
            <Download size={18} style={{ transform: "rotate(180deg)" }} />
            Import Employees
          </button>

          <button
            onClick={onAdd}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-white shadow-lg"
            style={{ backgroundColor: "#10B981" }}
          >
            <Plus size={20} />
            Add Employee
          </button>
        </div>
      )}
    </div>
  );
}