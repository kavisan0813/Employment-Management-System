import { useState } from "react";
import { useNavigate } from "react-router";
import { X, ExternalLink, FileSpreadsheet, Sparkles } from "lucide-react";
import { EmployeeInput } from "../types/employee.types";

export function ImportEmployeeModal({
  onClose,
  onImport,
}: {
  onClose: () => void;
  onImport: (emps: EmployeeInput[]) => void;
}) {
  const navigate = useNavigate();
  const [csvText, setCsvText] = useState("");
  const [parsedEmployees, setParsedEmployees] = useState<EmployeeInput[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleParse = () => {
    if (!csvText.trim()) {
      setError("Please paste CSV data first.");
      return;
    }
    const lines = csvText.trim().split("\n");
    if (lines.length < 2) {
      setError("CSV must include a header and at least one employee row.");
      return;
    }
    const header = lines[0].split(",").map((h) => h.trim().toLowerCase());
    const expectedHeaders = [
      "name",
      "email",
      "department",
      "designation",
      "salary",
      "joindate",
    ];
    const hasRequired = (() => {
      const headerSet = new Set(header);
      return expectedHeaders.every((h) => headerSet.has(h));
    })();
    if (!hasRequired) {
      setError(
        "CSV headers must include: name, email, department, designation, salary, joindate"
      );
      return;
    }

    const emps: EmployeeInput[] = [];
    for (let i = 1; i < lines.length; i++) {
      if (!lines[i].trim()) continue;
      const values = lines[i].split(",").map((v) => v.trim());
      if (values.length !== header.length) {
        setError(`Row ${i + 1} has a mismatch in column count.`);
        return;
      }
      const emp: Partial<EmployeeInput> = {};
      header.forEach((col, idx) => {
        if (col === "name") emp.name = values[idx];
        else if (col === "email") emp.email = values[idx];
        else if (col === "department") emp.department = values[idx];
        else if (col === "designation") emp.designation = values[idx];
        else if (col === "salary") emp.salary = Number(values[idx]) || 50000;
        else if (col === "joindate") emp.joinDate = values[idx];
      });
      emps.push(emp as EmployeeInput);
    }
    setParsedEmployees(emps);
    setError(null);
  };

  return (
    <div
      className="fixed inset-0 z-[2000] flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.55)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl transition-all"
        style={{
          backgroundColor: "var(--card)",
          border: "1px solid var(--border)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <FileSpreadsheet size={20} />
            </div>
            <div>
              <h3 className="text-base font-black text-foreground">
                Bulk Import Employees
              </h3>
              <p className="text-xs text-muted-foreground">
                Paste CSV data or use the full 6-step guided wizard
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-secondary text-muted-foreground transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Banner to Full Import Wizard */}
        <div className="p-4 mx-6 mt-5 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Sparkles className="text-primary shrink-0" size={18} />
            <div>
              <p className="text-xs font-black text-foreground">Guided 6-Step Import Wizard</p>
              <p className="text-[11px] text-muted-foreground">Includes drag & drop, field mapping & validation reports</p>
            </div>
          </div>
          <button
            onClick={() => {
              onClose();
              navigate("/admin/manage-account/import");
            }}
            className="px-3.5 py-1.5 rounded-xl bg-primary text-white text-xs font-bold flex items-center gap-1 hover:opacity-90 transition-all shrink-0 cursor-pointer shadow-sm"
          >
            Open Wizard <ExternalLink size={13} />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-4 space-y-4 max-h-[55vh] overflow-y-auto">
          {parsedEmployees.length === 0 ? (
            <div>
              <label className="block text-xs font-black uppercase tracking-wider mb-2 text-foreground">
                Quick Paste CSV Data (Include Header)
              </label>
              <textarea
                rows={6}
                className="w-full rounded-2xl p-3.5 text-xs font-mono border border-border bg-background text-foreground outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="name,email,department,designation,salary,joindate&#10;Arun Kumar,arun@viyanhr.com,Engineering,Developer,90000,2024-03-01&#10;Priya Sharma,priya@viyanhr.com,Product,Manager,120000,2023-05-15"
                value={csvText}
                onChange={(e) => setCsvText(e.target.value)}
              />
              <p className="text-[10px] text-muted-foreground mt-1.5 font-medium">
                Headers must match: <code>name, email, department, designation, salary, joindate</code>
              </p>
              {error && (
                <p className="text-xs font-bold text-rose-500 mt-2">{error}</p>
              )}
              <button
                onClick={handleParse}
                className="mt-3 px-4 py-2 rounded-xl font-bold text-xs bg-secondary text-foreground border border-border hover:bg-secondary/80 transition-all cursor-pointer"
              >
                Parse CSV Records
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                ✓ Parsed {parsedEmployees.length} employees successfully.
              </p>
              <div className="border border-border rounded-xl overflow-hidden max-h-[200px] overflow-y-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-secondary text-muted-foreground font-bold">
                    <tr>
                      <th className="p-2.5">Name</th>
                      <th className="p-2.5">Department</th>
                      <th className="p-2.5">Designation</th>
                      <th className="p-2.5 text-right">Salary</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border bg-card text-foreground">
                    {parsedEmployees.map((emp) => (
                      <tr key={emp.name}>
                        <td className="p-2.5 font-bold">{emp.name}</td>
                        <td className="p-2.5">{emp.department}</td>
                        <td className="p-2.5">{emp.designation}</td>
                        <td className="p-2.5 text-right font-mono">₹{emp.salary?.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <button
                onClick={() => setParsedEmployees([])}
                className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-secondary text-muted-foreground hover:text-foreground cursor-pointer"
              >
                Clear & Edit
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 flex gap-3 border-t border-border bg-secondary/20">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl text-xs font-bold border border-border bg-card text-foreground hover:bg-secondary transition-all cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={() => onImport(parsedEmployees)}
            disabled={parsedEmployees.length === 0}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold text-white transition-all shadow-md cursor-pointer ${
              parsedEmployees.length === 0
                ? "bg-primary/40 cursor-not-allowed"
                : "bg-primary hover:opacity-90"
            }`}
          >
            Import Employees ({parsedEmployees.length})
          </button>
        </div>
      </div>
    </div>
  );
}
