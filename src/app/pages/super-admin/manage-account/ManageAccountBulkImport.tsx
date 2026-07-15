import { useState } from "react";
import { useNavigate } from "react-router";
import { useEmployees, EmployeeInput } from "../../../context/AppContext";
import { showToast } from "../../../components/workflow/ToastNotification";
import { ChevronLeft, FileSpreadsheet, Check, Info } from "lucide-react";

export function ManageAccountBulkImport() {
  const navigate = useNavigate();
  const { bulkImportEmployees } = useEmployees();
  const [csvText, setCsvText] = useState("");
  const [parsedEmployees, setParsedEmployees] = useState<
    Partial<EmployeeInput>[]
  >([]);
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

    const emps: Partial<EmployeeInput>[] = [];
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
      emps.push(emp);
    }
    setParsedEmployees(emps);
    setError(null);
  };

  const handleImport = () => {
    if (parsedEmployees.length === 0) return;

    bulkImportEmployees(parsedEmployees as EmployeeInput[]);

    try {
      const savedUsers = localStorage.getItem("viyan_registered_users") || "[]";
      const usersList = JSON.parse(savedUsers);

      const newPlatformUsers = parsedEmployees.map((emp) => {
        const name = (emp.name || "").trim();
        const email = (emp.email || "").trim();
        const initials = name
          ? name
              .split(" ")
              .map((w: string) => w[0] || "")
              .join("")
              .toUpperCase()
          : "";
        return {
          id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          name,
          email,
          initials,
          role: "Employee",
          status: "Pending Invite",
          joinedAt: new Date().toISOString(),
          mfaEnabled: false,
          lastLoginAt: "",
          organization: "viyanHR Org",
          organizationId: "org-1",
        };
      });

      localStorage.setItem(
        "viyan_registered_users",
        JSON.stringify([...newPlatformUsers, ...usersList]),
      );
    } catch (err) {
      console.error("Failed to register platform logins in bulk", err);
    }

    showToast(
      `Successfully imported ${parsedEmployees.length} employees.`,
      "success",
    );
    navigate("/admin/manage-account");
  };

  return (
    <div className="w-full px-4 md:px-12 py-8 bg-[#F8F9FD] min-h-screen">
      {/* Back */}
      <button
        onClick={() => navigate("/admin/manage-account")}
        className="flex items-center gap-1.5 text-xs text-slate-500 font-bold hover:text-slate-800 transition-colors mb-6"
      >
        <ChevronLeft size={16} /> Back to Users
      </button>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
          Bulk Import
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Import multiple employees at once using CSV data
        </p>
      </div>

      <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-100/50 overflow-hidden mb-12">
        <div className="p-8 md:p-12">
          {parsedEmployees.length === 0 ? (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-black text-slate-800 mb-2 flex items-center gap-2">
                  <FileSpreadsheet
                    className="text-[var(--primary)]"
                    size={22}
                  />{" "}
                  Paste CSV Data
                </h2>
                <p className="text-xs text-slate-400 mb-6 font-semibold">
                  Copy your spreadsheet data with headers and paste below.
                </p>
                <textarea
                  rows={8}
                  className="w-full rounded-2xl p-4 text-xs font-mono border border-slate-200 bg-[#F5F6F8] text-slate-800 outline-none focus:ring-2 focus:ring-emerald-500/20"
                  placeholder={
                    "name,email,department,designation,salary,joindate\nArun Kumar,arun@viyanhr.com,Engineering,Developer,90000,2024-03-01\nPriya Sharma,priya@viyanhr.com,Product,Manager,120000,2023-05-15"
                  }
                  value={csvText}
                  onChange={(e) => setCsvText(e.target.value)}
                />
              </div>

              <div className="p-4 bg-emerald-50/30 rounded-2xl flex items-start gap-3">
                <Info
                  className="text-[var(--primary)] shrink-0 mt-0.5"
                  size={16}
                />
                <div className="text-xs text-emerald-900/60 leading-relaxed font-semibold">
                  <p className="font-extrabold">CSV Header Format:</p>
                  <p className="mt-1">
                    Headers must match:{" "}
                    <code className="bg-emerald-100/50 px-1 py-0.5 rounded text-emerald-900">
                      name
                    </code>
                    ,{" "}
                    <code className="bg-emerald-100/50 px-1 py-0.5 rounded text-emerald-900">
                      email
                    </code>
                    ,{" "}
                    <code className="bg-emerald-100/50 px-1 py-0.5 rounded text-emerald-900">
                      department
                    </code>
                    ,{" "}
                    <code className="bg-emerald-100/50 px-1 py-0.5 rounded text-emerald-900">
                      designation
                    </code>
                    ,{" "}
                    <code className="bg-emerald-100/50 px-1 py-0.5 rounded text-emerald-900">
                      salary
                    </code>
                    ,{" "}
                    <code className="bg-emerald-100/50 px-1 py-0.5 rounded text-emerald-900">
                      joindate
                    </code>
                  </p>
                </div>
              </div>

              {error && (
                <div className="p-4 bg-rose-50 rounded-2xl border border-rose-100 text-rose-600 text-xs font-bold">
                  {error}
                </div>
              )}

              <div className="flex justify-end pt-6 border-t border-slate-100">
                <button
                  onClick={handleParse}
                  className="px-6 py-3.5 bg-[var(--primary)] text-white rounded-xl text-sm font-bold flex items-center gap-1.5 transition-all hover:opacity-90 active:scale-95 shadow-md shadow-emerald-100"
                >
                  Parse Employees
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-emerald-600 text-base flex items-center gap-1.5">
                  <Check size={18} strokeWidth={3} /> Parsed{" "}
                  {parsedEmployees.length} employees
                </h3>
                <button
                  onClick={() => setParsedEmployees([])}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-500 rounded-xl text-xs font-bold transition-all"
                >
                  Clear & Edit
                </button>
              </div>

              <div className="border border-slate-100 rounded-2xl overflow-hidden shadow-sm max-h-[300px] overflow-y-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-[#FAFBFD] text-slate-500 border-b border-slate-100">
                    <tr>
                      <th className="p-3.5 font-bold">Name</th>
                      <th className="p-3.5 font-bold">Email</th>
                      <th className="p-3.5 font-bold">Department</th>
                      <th className="p-3.5 font-bold">Designation</th>
                      <th className="p-3.5 font-bold text-right">Salary</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white text-slate-700">
                    {parsedEmployees.map((emp, i) => (
                      <tr key={i} className="hover:bg-slate-50/50">
                        <td className="p-3.5 font-extrabold text-slate-800">
                          {emp.name}
                        </td>
                        <td className="p-3.5 font-medium">{emp.email}</td>
                        <td className="p-3.5">{emp.department}</td>
                        <td className="p-3.5 font-bold">{emp.designation}</td>
                        <td className="p-3.5 text-right font-black text-slate-900">
                          ₹{emp.salary?.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
                <button
                  onClick={() => setParsedEmployees([])}
                  className="px-6 py-3.5 border border-slate-200 text-slate-500 hover:bg-slate-50 rounded-xl text-sm font-bold transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleImport}
                  className="px-6 py-3.5 bg-[var(--primary)] text-white rounded-xl text-sm font-bold transition-all hover:opacity-90 active:scale-95 shadow-md shadow-emerald-100"
                >
                  Import Employees
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
