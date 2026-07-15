import { Employee } from "../types/employee.types";
import { HighlightText } from "../utils/employee.utils";
import { statusConfig, deptColors } from "../utils/employee.utils";

interface EmployeeTeamProps {
  paginated: Employee[];
  debouncedSearch: string;
  onViewProfile: (id: string) => void;
}

export default function EmployeeTeam({
  paginated,
  debouncedSearch,
  onViewProfile,
}: EmployeeTeamProps) {
  const departments = Array.from(new Set(paginated.map((e) => e.department)));

  return (
    <div className="flex flex-col gap-6">
      {departments.map((dept) => (
        <div
          key={dept}
          className="rounded-2xl p-6"
          style={{
            backgroundColor: "var(--card)",
            border: "1px solid var(--border)",
          }}
        >
          <div className="flex justify-between mb-5">
            <h3 className="text-xl font-bold">{dept} Team</h3>
            <span
              className="px-3 py-1 rounded-full text-xs font-bold"
              style={{ backgroundColor: `${deptColors[dept] || "#6B7280"}15` }}
            >
              {paginated.filter((e) => e.department === dept).length} Members
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {paginated
              .filter((e) => e.department === dept)
              .map((emp) => (
                <div
                  key={emp.id}
                  className="flex items-center gap-3 p-4 rounded-xl hover:border-emerald-500 cursor-pointer transition-all"
                  style={{
                    border: "1px solid var(--border)",
                    backgroundColor: "var(--background)",
                  }}
                  onClick={() => onViewProfile(emp.id)}
                >
                  <img
                    src={emp.avatar}
                    className="w-11 h-11 rounded-full"
                    alt={emp.name}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold truncate">
                      <HighlightText text={emp.name} search={debouncedSearch} />
                    </p>
                    <p className="text-sm text-muted-foreground truncate">
                      <HighlightText
                        text={emp.designation}
                        search={debouncedSearch}
                      />
                    </p>
                  </div>
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: statusConfig[emp.status]?.dot }}
                  />
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}
