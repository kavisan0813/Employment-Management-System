import { Search, LayoutGrid, List } from "lucide-react";

interface DepartmentFiltersProps {
  searchTerm: string;
  onSearchChange: (val: string) => void;
  statusFilter: "All" | "Active" | "Inactive";
  onStatusChange: (val: "All" | "Active" | "Inactive") => void;
  viewMode: "grid" | "table";
  onViewModeChange: (val: "grid" | "table") => void;
}

export function DepartmentFilters({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusChange,
  viewMode,
  onViewModeChange,
}: DepartmentFiltersProps) {
  return (
    <div className="bg-card p-4 rounded-2xl border border-border shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center mb-8">
      <div className="relative flex-1 w-full">
        <Search
          size={16}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
        <input
          type="text"
          placeholder="Search by name, head, or code..."
          className="w-full pl-11 pr-4 py-2 text-xs rounded-xl border border-border bg-background text-foreground focus:ring-2 focus:ring-[#00B87C]/20 outline-none font-bold"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <div className="flex items-center gap-3 w-full md:w-auto justify-end">
        <select
          className="px-4 py-2 text-xs rounded-xl border border-border bg-background text-foreground focus:ring-2 focus:ring-[#00B87C]/20 outline-none font-bold cursor-pointer appearance-none"
          value={statusFilter}
          onChange={(e) =>
            onStatusChange(e.target.value as "All" | "Active" | "Inactive")
          }
        >
          <option value="All">All Statuses</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>

        <div className="flex items-center bg-background border border-border rounded-xl p-1 gap-1">
          <button
            onClick={() => onViewModeChange("grid")}
            className="p-1.5 rounded-lg transition-colors"
            style={{
              backgroundColor: viewMode === "grid" ? "var(--secondary)" : "transparent",
              color: viewMode === "grid" ? "var(--primary)" : "var(--muted-foreground)",
            }}
            title="Grid View"
          >
            <LayoutGrid size={18} />
          </button>

          <button
            onClick={() => onViewModeChange("table")}
            className="p-1.5 rounded-lg transition-colors"
            style={{
              backgroundColor: viewMode === "table" ? "var(--secondary)" : "transparent",
              color: viewMode === "table" ? "var(--primary)" : "var(--muted-foreground)",
            }}
            title="Table View"
          >
            <List size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
