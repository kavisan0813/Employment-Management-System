import { Trash2 } from "lucide-react";
import { Employee } from "../types/employee.types";

export function DeleteEmployeeModal({
  employee,
  onClose,
  onConfirm,
}: {
  employee: Employee;
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-[2000] flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl"
        style={{
          backgroundColor: "var(--card)",
          border: "1px solid var(--border)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Red header accent */}
        <div
          style={{
            height: "4px",
            background: "linear-gradient(90deg,#EF4444,#DC2626)",
          }}
        />

        <div className="px-7 py-7">
          {/* Warning icon */}
          <div
            className="flex items-center justify-center w-14 h-14 rounded-full mx-auto mb-5"
            style={{ backgroundColor: "rgba(239,68,68,0.1)" }}
          >
            <Trash2 size={24} color="#EF4444" />
          </div>

          <h3
            style={{
              color: "var(--foreground)",
              fontSize: "18px",
              fontWeight: 800,
              textAlign: "center",
              marginBottom: "8px",
            }}
          >
            Delete Employee
          </h3>
          <p
            style={{
              color: "var(--muted-foreground)",
              fontSize: "13px",
              textAlign: "center",
              lineHeight: 1.6,
            }}
          >
            Are you sure you want to delete{" "}
            <span style={{ color: "var(--foreground)", fontWeight: 700 }}>
              {employee.name}
            </span>
            ?
            <br />
            <span style={{ fontSize: "12px" }}>
              This action cannot be undone.
            </span>
          </p>

          {/* Employee preview card */}
          <div
            className="flex items-center gap-3 rounded-xl p-3 mt-5"
            style={{
              backgroundColor: "var(--background)",
              border: "1px solid var(--border)",
            }}
          >
            <div
              style={{
                width: "38px",
                height: "38px",
                borderRadius: "50%",
                overflow: "hidden",
                border: "2px solid rgba(239,68,68,0.3)",
                flexShrink: 0,
              }}
            >
              <img
                src={employee.avatar}
                alt={employee.name}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
            <div>
              <p
                style={{
                  color: "var(--foreground)",
                  fontSize: "13px",
                  fontWeight: 700,
                  margin: 0,
                }}
              >
                {employee.name}
              </p>
              <p
                style={{
                  color: "var(--muted-foreground)",
                  fontSize: "11px",
                  margin: 0,
                }}
              >
                {employee.designation} · {employee.department}
              </p>
            </div>
            <span
              className="ml-auto px-2.5 py-1 rounded-full text-[11px] font-bold"
              style={{
                backgroundColor:
                  employee.status === "Active"
                    ? "var(--secondary)"
                    : employee.status === "On Leave"
                      ? "rgba(245,158,11,0.1)"
                      : "rgba(239,68,68,0.1)",
                color:
                  employee.status === "Active"
                    ? "var(--primary)"
                    : employee.status === "On Leave"
                      ? "#F59E0B"
                      : "#EF4444",
              }}
            >
              {employee.status}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl text-sm font-bold transition-all"
            style={{
              backgroundColor: "var(--secondary)",
              color: "var(--foreground)",
              border: "none",
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.opacity = "0.8")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.opacity = "1")
            }
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-3 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90"
            style={{
              background: "linear-gradient(135deg,#EF4444,#DC2626)",
              border: "none",
              boxShadow: "0 4px 14px rgba(239,68,68,0.35)",
            }}
          >
            Yes, Delete
          </button>
        </div>
      </div>
    </div>
  );
}
