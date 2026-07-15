import { Mail, Phone, Linkedin, MapPin } from "lucide-react";
import { Employee } from "../types/employee.types";
import { HighlightText } from "../utils/employee.utils";
import { statusConfig, deptColors } from "../utils/employee.utils";

interface EmployeeGridProps {
  paginated: Employee[];
  debouncedSearch: string;
  onViewProfile: (id: string) => void;
}

export default function EmployeeGrid({
  paginated,
  debouncedSearch,
  onViewProfile,
}: EmployeeGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {paginated.map((emp) => (
        <div
          key={emp.id}
          className="relative group rounded-2xl p-5 transition-all cursor-pointer"
          style={{
            backgroundColor: "var(--card)",
            border: "1px solid var(--border)",
          }}
          onClick={() => onViewProfile(emp.id)}
        >
          <div className="absolute top-4 right-4">
            <span
              className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-bold"
              style={{
                backgroundColor: statusConfig[emp.status]?.bg,
                color: statusConfig[emp.status]?.color,
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: statusConfig[emp.status]?.dot }}
              ></span>
              {emp.status}
            </span>
          </div>

          <div className="flex flex-col items-center mt-2 mb-4">
            <img
              src={emp.avatar}
              className="w-20 h-20 rounded-full object-cover border-4"
              style={{ borderColor: "var(--background)" }}
              alt={emp.name}
            />
            <h3 className="mt-4 text-lg font-bold">
              <HighlightText text={emp.name} search={debouncedSearch} />
            </h3>
            <p className="text-sm text-center text-muted-foreground">
              <HighlightText text={emp.designation} search={debouncedSearch} />
            </p>
            <span
              className="px-3 py-1 rounded-full text-xs font-bold mt-2"
              style={{
                backgroundColor: `${deptColors[emp.department] || "#6B7280"}15`,
                color: deptColors[emp.department],
              }}
            >
              {emp.department}
            </span>
          </div>

          <div className="flex justify-center gap-1.5 mb-5 text-muted-foreground">
            <MapPin size={14} /> {emp.location}
          </div>

          <div className="flex justify-center gap-4 pt-4 border-t border-border">
            <button
              className="p-3 rounded-full hover:bg-secondary"
              onClick={(e) => {
                e.stopPropagation();
                window.open(`mailto:${emp.email}`);
              }}
            >
              <Mail size={18} />
            </button>
            <button className="p-3 rounded-full hover:bg-secondary">
              <Phone size={18} />
            </button>
            <button className="p-3 rounded-full hover:bg-secondary">
              <Linkedin size={18} />
            </button>
          </div>

          <div className="pt-4 opacity-0 group-hover:opacity-100 transition-all">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onViewProfile(emp.id);
              }}
              className="w-full py-3 rounded-xl font-bold text-white"
              style={{ backgroundColor: "var(--primary)" }}
            >
              View Profile
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
