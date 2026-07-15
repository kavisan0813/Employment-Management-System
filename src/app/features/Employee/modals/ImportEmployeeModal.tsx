import { useState } from "react";
import { X } from "lucide-react";
import { EmployeeInput } from "../types/employee.types";

export function ImportEmployeeModal({
  onClose,
  onImport,
}: {
  onClose: () => void;
  onImport: (emps: EmployeeInput[]) => void;
}) {
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
    const hasRequired = expectedHeaders.every((h) => header.includes(h));
    if (!hasRequired) {
      setError(
        "CSV headers must include: name, email, department, designation, salary, joindate",
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
      style={{ backgroundColor: "rgba(0,0,0,0.45)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl"
        style={{
          backgroundColor: "var(--card)",
          border: "1px solid var(--border)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-8 py-6 border-b border-border">
          <div>
            <h3 className="text-lg font-black text-foreground">
              Bulk Import Employees
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Paste CSV formatted text to import multiple employees
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-secondary text-muted-foreground"
          >
            <X size={18} />
          </button>
        </div>

        <div className="px-8 py-6 space-y-4 max-h-[60vh] overflow-y-auto">
          {parsedEmployees.length === 0 ? (
            <div>
              <label className="block text-xs font-black uppercase tracking-wider mb-2 text-foreground">
                Paste CSV Data (Include Header)
              </label>
              <textarea
                rows={8}
                className="w-full rounded-xl p-4 text-xs font-mono border border-border bg-background text-foreground outline-none focus:ring-2 focus:ring-emerald-500/20"
                placeholder="name,email,department,designation,salary,joindate&#10;Arun Kumar,arun@viyanhr.com,Engineering,Developer,90000,2024-03-01&#10;Priya Sharma,priya@viyanhr.com,Product,Manager,120000,2023-05-15"
                value={csvText}
                onChange={(e) => setCsvText(e.target.value)}
              />
              <p className="text-[10px] text-muted-foreground mt-1">
                Headers should match: name, email, department, designation,
                salary, joindate
              </p>
              {error && (
                <p className="text-xs font-bold text-rose-500 mt-2">{error}</p>
              )}
              <button
                onClick={handleParse}
                className="mt-4 px-5 py-2.5 rounded-xl font-bold text-xs bg-primary text-white hover:opacity-90"
              >
                Parse Employees
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-xs font-bold text-emerald-600">
                Parsed {parsedEmployees.length} employees successfully.
              </p>
              <div className="border border-border rounded-xl overflow-hidden max-h-[250px] overflow-y-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-secondary text-muted-foreground">
                    <tr>
                      <th className="p-3 font-semibold">Name</th>
                      <th className="p-3 font-semibold">Department</th>
                      <th className="p-3 font-semibold">Designation</th>
                      <th className="p-3 font-semibold">Salary</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border bg-background text-foreground">
                    {parsedEmployees.map((emp, i) => (
                      <tr key={i}>
                        <td className="p-3 font-bold">{emp.name}</td>
                        <td className="p-3">{emp.department}</td>
                        <td className="p-3">{emp.designation}</td>
                        <td className="p-3">₹{emp.salary?.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setParsedEmployees([])}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold bg-secondary text-foreground hover:opacity-85"
                >
                  Clear & Edit
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="px-8 py-5 flex gap-3 border-t border-border bg-secondary/10">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-wider bg-secondary text-primary border-none"
          >
            Cancel
          </button>
          <button
            onClick={() => onImport(parsedEmployees)}
            disabled={parsedEmployees.length === 0}
            className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-wider text-white border-none ${parsedEmployees.length === 0 ? "bg-emerald-500/40 cursor-not-allowed" : "bg-emerald-500 hover:bg-emerald-600"}`}
          >
            Import Employees
          </button>
        </div>
      </div>
    </div>
  );
}
