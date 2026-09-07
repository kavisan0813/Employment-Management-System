import { useState, useRef, useMemo, useCallback, useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../../../context/AuthContext";
import { useEmployees, EmployeeInput } from "../../../context/AppContext";
import { usePermissions } from "../../../shared/permission-engine/PermissionContext";
import { P } from "../../../shared/permission-engine/permissions";
import { PermissionGate } from "../../../shared/permission-engine/PermissionGate";
import { showToast } from "../../../components/workflow/ToastNotification";
import {
  ChevronLeft,
  UploadCloud,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Download,
  Trash2,
  RefreshCw,
  ArrowRight,
  ArrowLeft,
  Building,
  Users,
  ShieldCheck,
  Check,
  Info,
  SlidersHorizontal,
  FileText,
  Loader2,
} from "lucide-react";

/* ─── CANONICAL EMS EMPLOYEE FIELDS ─── */
interface EMSField {
  key: string;
  label: string;
  required: boolean;
  aliases: string[];
  description: string;
}

const EMS_EMPLOYEE_FIELDS: EMSField[] = [
  {
    key: "first_name",
    label: "First Name",
    required: true,
    aliases: ["first name", "firstname", "fname", "first"],
    description: "Employee's given first name",
  },
  {
    key: "last_name",
    label: "Last Name",
    required: true,
    aliases: ["last name", "lastname", "lname", "last", "surname"],
    description: "Employee's family surname",
  },
  {
    key: "email",
    label: "Email Address",
    required: true,
    aliases: ["email", "email address", "work email", "mail", "corporate email", "emailid"],
    description: "Unique corporate email address",
  },
  {
    key: "phone",
    label: "Contact / Phone",
    required: false,
    aliases: ["phone", "contact", "mobile", "phone number", "tel", "contact number", "mobile number"],
    description: "Primary contact phone number",
  },
  {
    key: "department",
    label: "Department",
    required: true,
    aliases: ["department", "dept", "team", "department name"],
    description: "Assigned department (e.g., Engineering, HR)",
  },
  {
    key: "designation",
    label: "Designation / Title",
    required: true,
    aliases: ["designation", "job title", "title", "position", "role title", "designation title"],
    description: "Employee job designation title",
  },
  {
    key: "salary",
    label: "Salary (Annual)",
    required: true,
    aliases: ["salary", "annual salary", "pay", "ctc", "gross salary", "annual ctc"],
    description: "Numeric gross salary amount",
  },
  {
    key: "joinDate",
    label: "Joining Date",
    required: true,
    aliases: ["joining date", "join date", "joindate", "start date", "doj", "date of joining"],
    description: "Date of joining in YYYY-MM-DD format",
  },
  {
    key: "location",
    label: "Branch / Location",
    required: false,
    aliases: ["location", "branch", "office", "work location", "city", "branch name", "office location"],
    description: "Office location or branch name",
  },
  {
    key: "employmentType",
    label: "Employment Type",
    required: false,
    aliases: ["employment type", "type", "job type", "work type"],
    description: "Full-time, Part-time, Contract, etc.",
  },
  {
    key: "role",
    label: "System Role",
    required: false,
    aliases: ["role", "system role", "user role"],
    description: "EMS system role (default: Employee)",
  },
];

/* ─── TYPES ─── */
export interface ValidatedRecord {
  rowNumber: number;
  rawRow: Record<string, string>;
  mappedData: {
    first_name: string;
    last_name: string;
    name: string;
    email: string;
    phone: string;
    department: string;
    designation: string;
    salary: number;
    joinDate: string;
    location: string;
    employmentType: string;
    role: string;
  };
  generatedId: string;
  status: "valid" | "invalid" | "duplicate";
  errors: Array<{ field: string; value: string; issue: string }>;
}

export function ManageAccountBulkImport() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { employeesList, bulkImportEmployees } = useEmployees();
  const { hasPermissionKey } = usePermissions();

  /* Permission Check */
  const canImport =
    hasPermissionKey(P.MANAGE_ACCOUNT_MANAGE) ||
    hasPermissionKey(P.EMPLOYEES_CREATE) ||
    hasPermissionKey(P.EMPLOYEES_MANAGE) ||
    hasPermissionKey(P.PLATFORM_ADMIN_FULL);

  /* Wizard Steps: 1: Upload, 2: Map, 3: Validate, 4: Review, 5: Progress, 6: Result */
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4 | 5 | 6>(1);

  /* File State */
  const [file, setFile] = useState<File | null>(null);
  const [fileHeaders, setFileHeaders] = useState<string[]>([]);
  const [parsedRows, setParsedRows] = useState<string[][]>([]);
  const [fileError, setFileError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  /* Field Mapping State */
  const [fieldMappings, setFieldMappings] = useState<Record<string, string>>({});

  /* Validation State */
  const [validatedRecords, setValidatedRecords] = useState<ValidatedRecord[]>([]);
  const [validationFilter, setValidationFilter] = useState<
    "all" | "valid" | "invalid" | "duplicate"
  >("all");

  /* Progress & Result State */
  const [importProgress, setImportProgress] = useState({
    processed: 0,
    total: 0,
    successCount: 0,
    failedCount: 0,
    percentage: 0,
  });

  const [importResults, setImportResults] = useState<{
    total: number;
    successCount: number;
    failedCount: number;
    skippedCount: number;
    importedRecords: ValidatedRecord[];
    failedRecords: ValidatedRecord[];
  } | null>(null);

  /* ─── STEP 1: PARSE CSV CONTENT ─── */
  const parseCSVText = (text: string) => {
    const lines = text
      .split(/\r\n|\n/)
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    if (lines.length < 2) {
      setFileError("File must contain a header row and at least one data row.");
      return null;
    }

    const parseLine = (line: string): string[] => {
      const result: string[] = [];
      let cur = "";
      let inQuotes = false;
      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if ((char === "," || char === "\t") && !inQuotes) {
          result.push(cur.trim().replace(/^"|"$/g, ""));
          cur = "";
        } else {
          cur += char;
        }
      }
      result.push(cur.trim().replace(/^"|"$/g, ""));
      return result;
    };

    const headers = parseLine(lines[0]);
    const rows = lines.slice(1).map(parseLine);

    if (rows.length > 500) {
      setFileError("Maximum bulk import limit is 500 records per file.");
      return null;
    }

    return { headers, rows };
  };

  /* Auto Field Mapping Algorithm */
  const generateAutoMappings = (headers: string[]) => {
    const mappings: Record<string, string> = {};
    const usedEMSFields = new Set<string>();

    headers.forEach((header) => {
      const cleanHeader = header.trim().toLowerCase();
      const matched = EMS_EMPLOYEE_FIELDS.find((f) => {
        if (usedEMSFields.has(f.key)) return false;
        return (
          f.key.toLowerCase() === cleanHeader ||
          f.label.toLowerCase() === cleanHeader ||
          f.aliases.some((alias) => alias.toLowerCase() === cleanHeader)
        );
      });

      if (matched) {
        mappings[header] = matched.key;
        usedEMSFields.add(matched.key);
      } else if (
        cleanHeader.includes("name") &&
        !cleanHeader.includes("first") &&
        !cleanHeader.includes("last") &&
        !usedEMSFields.has("first_name")
      ) {
        mappings[header] = "first_name";
        usedEMSFields.add("first_name");
      } else {
        mappings[header] = ""; // Unmapped
      }
    });

    return mappings;
  };

  /* File Selection Handler */
  const handleFileSelect = (selectedFile: File) => {
    setFileError(null);

    // Limit Checks
    if (selectedFile.size > 5 * 1024 * 1024) {
      setFileError("File size exceeds 5MB limit. Please upload a smaller file.");
      return;
    }

    const validExtensions = [".csv", ".tsv", ".txt"];
    const ext = selectedFile.name.substring(selectedFile.name.lastIndexOf(".")).toLowerCase();
    if (!validExtensions.includes(ext) && !selectedFile.type.includes("csv") && !selectedFile.type.includes("text")) {
      setFileError("Unsupported file format. Please upload a CSV or TSV file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      const parsed = parseCSVText(content);
      if (parsed) {
        setFile(selectedFile);
        setFileHeaders(parsed.headers);
        setParsedRows(parsed.rows);
        setFieldMappings(generateAutoMappings(parsed.headers));
      }
    };
    reader.readAsText(selectedFile);
  };

  /* Drag & Drop Handlers */
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = () => setIsDragging(false);
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  /* Sample Template Generator */
  const downloadSampleTemplate = () => {
    const headers = [
      "First Name",
      "Last Name",
      "Email Address",
      "Contact",
      "Department",
      "Designation",
      "Branch Location",
      "Employment Type",
      "Salary",
      "Joining Date",
      "Role",
    ];

    const sampleRows = [
      ["Arun", "Kumar", "arun.kumar@nexus-ems.com", "+91 98765 43210", "Engineering", "Senior Software Engineer", "HQ - Bangalore", "Full-time", "900000", "2024-03-01", "Employee"],
      ["Priya", "Sharma", "priya.sharma@nexus-ems.com", "+91 98765 43211", "Product", "Product Manager", "HQ - Bangalore", "Full-time", "1200000", "2023-05-15", "Employee"],
      ["Rahul", "Verma", "rahul.verma@nexus-ems.com", "+91 98765 43212", "Finance", "Financial Analyst", "Mumbai Branch", "Full-time", "750000", "2024-01-10", "Employee"],
      ["Sneha", "Patel", "sneha.patel@nexus-ems.com", "+91 98765 43213", "Human Resources", "HR Generalist", "Delhi Branch", "Full-time", "650000", "2024-02-01", "Employee"],
    ];

    const csvString = [headers.join(","), ...sampleRows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "nexus_ems_employee_import_template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  /* ─── STEP 2: EXECUTE ROW VALIDATION ─── */
  const runValidation = useCallback(() => {
    const existingEmails = new Set(
      employeesList.map((e) => (e.email || "").trim().toLowerCase())
    );
    const fileEmailsSeen = new Set<string>();

    const records: ValidatedRecord[] = parsedRows.map((row, idx) => {
      const rawRow: Record<string, string> = {};
      const mapped: Record<string, string> = {
        first_name: "",
        last_name: "",
        name: "",
        email: "",
        phone: "",
        department: "",
        designation: "",
        salary: "50000",
        joinDate: new Date().toISOString().split("T")[0],
        location: "HQ - Bangalore",
        employmentType: "Full-time",
        role: "Employee",
      };

      fileHeaders.forEach((header, colIdx) => {
        const val = row[colIdx] ? row[colIdx].trim() : "";
        rawRow[header] = val;
        const targetField = fieldMappings[header];
        if (targetField) {
          mapped[targetField] = val;
        }
      });

      // Construct name if first_name / last_name provided
      let fullName = mapped.name || "";
      if (mapped.first_name || mapped.last_name) {
        fullName = `${mapped.first_name} ${mapped.last_name}`.trim();
      }

      const errors: Array<{ field: string; value: string; issue: string }> = [];
      const emailVal = mapped.email.toLowerCase();

      // Required fields checks
      if (!fullName) {
        errors.push({ field: "Name", value: "", issue: "First or Last Name is required" });
      }
      if (!mapped.email) {
        errors.push({ field: "Email", value: "", issue: "Email Address is required" });
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mapped.email)) {
        errors.push({ field: "Email", value: mapped.email, issue: "Invalid email address format" });
      }
      if (!mapped.department) {
        errors.push({ field: "Department", value: "", issue: "Department is required" });
      }
      if (!mapped.designation) {
        errors.push({ field: "Designation", value: "", issue: "Designation title is required" });
      }
      if (!mapped.salary || isNaN(Number(mapped.salary)) || Number(mapped.salary) <= 0) {
        errors.push({ field: "Salary", value: mapped.salary, issue: "Salary must be a positive number" });
      }
      if (!mapped.joinDate) {
        errors.push({ field: "Join Date", value: "", issue: "Joining Date is required" });
      }

      // Duplicate Check
      let status: "valid" | "invalid" | "duplicate" = "valid";
      if (errors.length > 0) {
        status = "invalid";
      } else if (existingEmails.has(emailVal)) {
        status = "duplicate";
        errors.push({ field: "Email", value: mapped.email, issue: "Employee email already exists in system" });
      } else if (fileEmailsSeen.has(emailVal)) {
        status = "duplicate";
        errors.push({ field: "Email", value: mapped.email, issue: "Duplicate email entry within this import file" });
      } else {
        fileEmailsSeen.add(emailVal);
      }

      const genId = `EMP${String(employeesList.length + idx + 1).padStart(3, "0")}`;

      return {
        rowNumber: idx + 2,
        rawRow,
        mappedData: {
          first_name: mapped.first_name,
          last_name: mapped.last_name,
          name: fullName || "Unnamed Employee",
          email: mapped.email,
          phone: mapped.phone || "+91 98765 00000",
          department: mapped.department,
          designation: mapped.designation,
          salary: Number(mapped.salary) || 50000,
          joinDate: mapped.joinDate,
          location: mapped.location || "HQ - Bangalore",
          employmentType: mapped.employmentType || "Full-time",
          role: mapped.role || "Employee",
        },
        generatedId: genId,
        status,
        errors,
      };
    });

    setValidatedRecords(records);
  }, [parsedRows, fileHeaders, fieldMappings, employeesList]);

  /* Filtered Validation Records */
  const filteredRecords = useMemo(() => {
    if (validationFilter === "all") return validatedRecords;
    return validatedRecords.filter((r) => r.status === validationFilter);
  }, [validatedRecords, validationFilter]);

  /* Validation Summary Metrics */
  const valMetrics = useMemo(() => {
    const total = validatedRecords.length;
    const valid = validatedRecords.filter((r) => r.status === "valid").length;
    const invalid = validatedRecords.filter((r) => r.status === "invalid").length;
    const duplicate = validatedRecords.filter((r) => r.status === "duplicate").length;
    return { total, valid, invalid, duplicate };
  }, [validatedRecords]);

  /* Error Report Download */
  const downloadErrorReport = () => {
    const invalidRecs = validatedRecords.filter((r) => r.status !== "valid");
    if (invalidRecs.length === 0) return;

    const headers = ["Row #", "Employee Name", "Email", "Field", "Invalid Value", "Issue Reason"];
    const rows = invalidRecs.flatMap((r) =>
      r.errors.map((e) => [
        String(r.rowNumber),
        `"${r.mappedData.name}"`,
        `"${r.mappedData.email}"`,
        `"${e.field}"`,
        `"${e.value}"`,
        `"${e.issue}"`,
      ])
    );

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "employee_import_error_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  /* ─── STEP 5: EXECUTE BULK IMPORT ─── */
  useEffect(() => {
    if (currentStep !== 5) return;

    const validToImport = validatedRecords.filter((r) => r.status === "valid");
    if (validToImport.length === 0) return;

    setImportProgress({
      processed: 0,
      total: validToImport.length,
      successCount: 0,
      failedCount: 0,
      percentage: 0,
    });

    let current = 0;
    const importedList: ValidatedRecord[] = [];

    const interval = setInterval(() => {
      current++;
      const pct = Math.round((current / validToImport.length) * 100);
      importedList.push(validToImport[current - 1]);

      setImportProgress({
        processed: current,
        total: validToImport.length,
        successCount: current,
        failedCount: 0,
        percentage: pct,
      });

      if (current >= validToImport.length) {
        clearInterval(interval);

        // Save into AppContext
        const inputPayloads: EmployeeInput[] = validToImport.map((r) => ({
          name: r.mappedData.name,
          email: r.mappedData.email,
          phone: r.mappedData.phone,
          department: r.mappedData.department,
          designation: r.mappedData.designation,
          salary: r.mappedData.salary,
          joinDate: r.mappedData.joinDate,
          location: r.mappedData.location,
          employmentType: r.mappedData.employmentType,
          role: r.mappedData.role,
          status: "Active",
        }));

        bulkImportEmployees(inputPayloads);

        // Register Users in viyan_registered_users:v1
        try {
          const savedUsers = localStorage.getItem("viyan_registered_users:v1") || "[]";
          const usersList = JSON.parse(savedUsers);

          const newPlatformUsers = validToImport.map((r) => ({
            id: `user-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
            name: r.mappedData.name,
            email: r.mappedData.email,
            initials: r.mappedData.name
              .split(" ")
              .map((w) => w[0] || "")
              .join("")
              .toUpperCase(),
            role: r.mappedData.role || "Employee",
            status: "Pending Invite",
            joinedAt: new Date().toISOString(),
            mfaEnabled: false,
            lastLoginAt: "",
            organization: user?.organization || "NexusHR Org",
            organizationId: user?.organizationId || "org-1",
          }));

          localStorage.setItem(
            "viyan_registered_users:v1",
            JSON.stringify([...newPlatformUsers, ...usersList])
          );
        } catch (err) {
          console.error("Failed to register platform users", err);
        }

        const failedRecs = validatedRecords.filter((r) => r.status !== "valid");

        setImportResults({
          total: validatedRecords.length,
          successCount: validToImport.length,
          failedCount: failedRecs.filter((r) => r.status === "invalid").length,
          skippedCount: failedRecs.filter((r) => r.status === "duplicate").length,
          importedRecords: validToImport,
          failedRecords: failedRecs,
        });

        setCurrentStep(6);
        showToast(
          `Import Complete: ${validToImport.length} employees imported successfully.`,
          "success"
        );
      }
    }, 40);

    return () => {
      clearInterval(interval);
    };
  }, [currentStep, validatedRecords, bulkImportEmployees]);

  const handleExecuteImport = () => {
    if (!canImport) {
      showToast("Access Denied", "error", "You do not have permission to import employees.");
      return;
    }

    const validToImport = validatedRecords.filter((r) => r.status === "valid");
    if (validToImport.length === 0) {
      showToast("No Valid Records", "error", "There are no valid records available to import.");
      return;
    }

    setCurrentStep(5);
  };

  /* Reset Wizard */
  const handleResetImport = () => {
    setFile(null);
    setFileHeaders([]);
    setParsedRows([]);
    setFieldMappings({});
    setValidatedRecords([]);
    setImportResults(null);
    setCurrentStep(1);
  };

  if (!canImport) {
    return (
      <div className="w-full px-4 md:px-12 py-12 bg-background min-h-screen flex items-center justify-center">
        <div className="bg-card p-8 rounded-3xl border border-border shadow-xl max-w-md text-center">
          <XCircle size={48} className="text-rose-500 mx-auto mb-4" />
          <h2 className="text-xl font-black text-foreground mb-2">Access Restricted</h2>
          <p className="text-xs text-muted-foreground mb-6">
            You do not have the required permission (<code>employees:create</code> or <code>manage_account:manage</code>) to access Bulk Employee Import.
          </p>
          <button
            onClick={() => navigate("/admin/manage-account")}
            className="px-6 py-3 rounded-xl bg-primary text-white text-xs font-bold hover:opacity-90 transition-all cursor-pointer"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-4 md:px-12 py-8 bg-background min-h-screen text-foreground transition-colors duration-200">
      {/* ═══ TOP NAVIGATION HEADER ═══ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <button
            onClick={() => navigate("/admin/manage-account")}
            className="flex items-center gap-1.5 text-xs text-muted-foreground font-bold hover:text-foreground transition-colors mb-2 cursor-pointer"
          >
            <ChevronLeft size={16} /> Back to User Management
          </button>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-3">
            <FileSpreadsheet className="text-primary" size={28} />
            Bulk Import Employees
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Import, validate, and onboard multiple employee records into your organization directory.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={downloadSampleTemplate}
            className="px-4 py-2.5 rounded-xl border border-border bg-card hover:bg-secondary text-foreground text-xs font-bold flex items-center gap-2 transition-all shadow-sm cursor-pointer"
          >
            <Download size={15} className="text-primary" /> Download Sample CSV
          </button>
        </div>
      </div>

      {/* ═══ STEPPER PROGRESS BAR ═══ */}
      <div className="w-full max-w-5xl mx-auto mb-10">
        <div className="bg-card border border-border rounded-2xl p-4 shadow-sm">
          <div className="grid grid-cols-6 gap-2 text-center relative">
            {[
              { num: 1, label: "Upload" },
              { num: 2, label: "Map Fields" },
              { num: 3, label: "Validate" },
              { num: 4, label: "Review" },
              { num: 5, label: "Import" },
              { num: 6, label: "Complete" },
            ].map((step) => {
              const isActive = currentStep === step.num;
              const isPassed = currentStep > step.num;
              return (
                <div key={step.num} className="flex flex-col items-center gap-1.5 z-10">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                      isPassed
                        ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/20"
                        : isActive
                        ? "bg-primary text-white ring-4 ring-primary/20 shadow-md shadow-primary/20"
                        : "bg-secondary text-muted-foreground border border-border"
                    }`}
                  >
                    {isPassed ? <Check size={16} strokeWidth={3} /> : step.num}
                  </div>
                  <span
                    className={`text-[11px] font-bold truncate max-w-full ${
                      isActive ? "text-primary" : isPassed ? "text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ═══ MAIN STEP CONTAINER ═══ */}
      <div className="max-w-5xl mx-auto bg-card rounded-3xl border border-border shadow-xl overflow-hidden mb-12">
        {/* ── STEP 1: UPLOAD FILE ── */}
        {currentStep === 1 && (
          <div className="p-6 md:p-10 space-y-6">
            <div className="text-center max-w-lg mx-auto">
              <h2 className="text-xl font-extrabold text-foreground">Import Employees</h2>
              <p className="text-xs text-muted-foreground mt-1">
                Upload a CSV or TSV spreadsheet containing your organization's employee records.
              </p>
            </div>

            {/* Dropzone */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center cursor-pointer transition-all ${
                isDragging
                  ? "border-primary bg-primary/5 scale-[1.01]"
                  : "border-border hover:border-primary/50 hover:bg-secondary/40"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.tsv,.txt"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileSelect(e.target.files[0]);
                  }
                }}
              />
              <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
                <UploadCloud size={32} />
              </div>
              <h3 className="text-base font-black text-foreground mb-1">
                Drag and drop your spreadsheet file here
              </h3>
              <p className="text-xs text-muted-foreground mb-4">or click to browse files from your computer</p>
              <button
                type="button"
                className="px-6 py-2.5 rounded-xl bg-primary text-white text-xs font-bold shadow-md hover:opacity-90 transition-all pointer-events-none"
              >
                Browse File
              </button>
            </div>

            {/* File Format & Limits Info */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-secondary/50 border border-border flex items-center gap-3">
                <FileText className="text-primary shrink-0" size={20} />
                <div>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase block">Supported Formats</span>
                  <span className="text-xs font-black text-foreground">CSV, TSV, TXT</span>
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-secondary/50 border border-border flex items-center gap-3">
                <Users className="text-emerald-500 shrink-0" size={20} />
                <div>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase block">Record Limit</span>
                  <span className="text-xs font-black text-foreground">Up to 500 records</span>
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-secondary/50 border border-border flex items-center gap-3">
                <ShieldCheck className="text-purple-500 shrink-0" size={20} />
                <div>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase block">Max File Size</span>
                  <span className="text-xs font-black text-foreground">5 MB maximum</span>
                </div>
              </div>
            </div>

            {/* Selected File Details */}
            {file && !fileError && (
              <div className="p-5 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <FileSpreadsheet size={28} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <div>
                    <h4 className="text-xs font-black text-foreground">{file.name}</h4>
                    <p className="text-[11px] text-muted-foreground font-medium">
                      {(file.size / 1024).toFixed(1)} KB • {parsedRows.length} employee rows detected
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-1.5 rounded-lg border border-border bg-card text-xs font-bold text-foreground hover:bg-secondary transition-all cursor-pointer"
                  >
                    Replace
                  </button>
                  <button
                    onClick={() => {
                      setFile(null);
                      setParsedRows([]);
                      setFileHeaders([]);
                    }}
                    className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-500/10 transition-all cursor-pointer"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* File Error Notice */}
            {fileError && (
              <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 text-rose-600 dark:text-rose-400 text-xs font-bold flex items-center gap-3">
                <AlertTriangle size={18} className="shrink-0" />
                <span>{fileError}</span>
              </div>
            )}

            {/* Action Bar */}
            <div className="flex items-center justify-between pt-6 border-t border-border">
              <button
                onClick={() => navigate("/admin/manage-account")}
                className="px-6 py-3 rounded-xl border border-border text-muted-foreground hover:text-foreground text-xs font-bold transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                disabled={!file || fileHeaders.length === 0}
                onClick={() => setCurrentStep(2)}
                className={`px-6 py-3 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                  file && fileHeaders.length > 0
                    ? "bg-primary text-white shadow-md hover:opacity-90"
                    : "bg-primary/40 text-white/70 cursor-not-allowed"
                }`}
              >
                Continue to Field Mapping <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 2: MAP FIELDS ── */}
        {currentStep === 2 && (
          <div className="p-6 md:p-10 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-extrabold text-foreground">Map Field Columns</h2>
                <p className="text-xs text-muted-foreground mt-1">
                  Match the column headers from your file to the canonical EMS Employee fields.
                </p>
              </div>
              <button
                onClick={() => setFieldMappings(generateAutoMappings(fileHeaders))}
                className="px-3.5 py-2 rounded-xl border border-border bg-secondary hover:bg-secondary/80 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <RefreshCw size={14} /> Auto-Map Fields
              </button>
            </div>

            {/* Field Mapping Table */}
            <div className="border border-border rounded-2xl overflow-hidden shadow-sm">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-secondary text-muted-foreground font-black uppercase tracking-wider border-b border-border">
                  <tr>
                    <th className="p-4">File Column Header</th>
                    <th className="p-4">Sample Value (Row 1)</th>
                    <th className="p-4">EMS Employee Field</th>
                    <th className="p-4 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border bg-card text-foreground">
                  {fileHeaders.map((header) => {
                    const sampleVal = parsedRows[0]?.[fileHeaders.indexOf(header)] || "-";
                    const currentMapped = fieldMappings[header] || "";
                    const isMapped = !!currentMapped;
                    const targetFieldObj = EMS_EMPLOYEE_FIELDS.find((f) => f.key === currentMapped);

                    return (
                      <tr key={header} className="hover:bg-secondary/40 transition-colors">
                        <td className="p-4 font-extrabold text-foreground">{header}</td>
                        <td className="p-4 font-mono text-muted-foreground max-w-[200px] truncate">
                          {sampleVal}
                        </td>
                        <td className="p-4">
                          <select
                            value={currentMapped}
                            onChange={(e) =>
                              setFieldMappings((prev) => ({
                                ...prev,
                                [header]: e.target.value,
                              }))
                            }
                            className="w-full p-2.5 rounded-xl border border-border bg-background text-foreground font-bold text-xs outline-none focus:ring-2 focus:ring-primary/20"
                          >
                            <option value="">-- Do Not Import --</option>
                            {EMS_EMPLOYEE_FIELDS.map((field) => (
                              <option key={field.key} value={field.key}>
                                {field.label} {field.required ? "*" : ""}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="p-4 text-center">
                          {isMapped ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-[11px]">
                              <CheckCircle2 size={13} /> Mapped
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold text-[11px]">
                              <AlertTriangle size={13} /> Unmapped
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-between pt-6 border-t border-border">
              <button
                onClick={() => setCurrentStep(1)}
                className="px-6 py-3 rounded-xl border border-border text-muted-foreground hover:text-foreground text-xs font-bold flex items-center gap-2 transition-all cursor-pointer"
              >
                <ArrowLeft size={16} /> Back to Upload
              </button>
              <button
                onClick={() => {
                  runValidation();
                  setCurrentStep(3);
                }}
                className="px-6 py-3 rounded-xl bg-primary text-white text-xs font-bold flex items-center gap-2 shadow-md hover:opacity-90 transition-all cursor-pointer"
              >
                Run Data Validation <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 3: VALIDATE DATA ── */}
        {currentStep === 3 && (
          <div className="p-6 md:p-10 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-extrabold text-foreground">Data Validation Summary</h2>
                <p className="text-xs text-muted-foreground mt-1">
                  Inspect validated employee rows for missing fields, formatting errors, or email duplicates.
                </p>
              </div>
              <div className="flex items-center gap-2">
                {valMetrics.invalid + valMetrics.duplicate > 0 && (
                  <button
                    onClick={downloadErrorReport}
                    className="px-3.5 py-2 rounded-xl border border-rose-300 dark:border-rose-800 bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Download size={14} /> Download Error Report
                  </button>
                )}
              </div>
            </div>

            {/* Validation KPI Summary Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div
                onClick={() => setValidationFilter("all")}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  validationFilter === "all"
                    ? "bg-primary/10 border-primary ring-2 ring-primary/20"
                    : "bg-secondary/40 border-border hover:border-primary/40"
                }`}
              >
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                  Total Records
                </span>
                <span className="text-2xl font-black text-foreground">{valMetrics.total}</span>
              </div>
              <div
                onClick={() => setValidationFilter("valid")}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  validationFilter === "valid"
                    ? "bg-emerald-500/10 border-emerald-500 ring-2 ring-emerald-500/20"
                    : "bg-secondary/40 border-border hover:border-emerald-500/40"
                }`}
              >
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block">
                  Valid Records
                </span>
                <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{valMetrics.valid}</span>
              </div>
              <div
                onClick={() => setValidationFilter("invalid")}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  validationFilter === "invalid"
                    ? "bg-rose-500/10 border-rose-500 ring-2 ring-rose-500/20"
                    : "bg-secondary/40 border-border hover:border-rose-500/40"
                }`}
              >
                <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 block">
                  Invalid Records
                </span>
                <span className="text-2xl font-black text-rose-600 dark:text-rose-400">{valMetrics.invalid}</span>
              </div>
              <div
                onClick={() => setValidationFilter("duplicate")}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  validationFilter === "duplicate"
                    ? "bg-amber-500/10 border-amber-500 ring-2 ring-amber-500/20"
                    : "bg-secondary/40 border-border hover:border-amber-500/40"
                }`}
              >
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 block">
                  Duplicate Records
                </span>
                <span className="text-2xl font-black text-amber-600 dark:text-amber-400">{valMetrics.duplicate}</span>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-2 border-b border-border pb-3">
              {(["all", "valid", "invalid", "duplicate"] as const).map((filterKey) => (
                <button
                  key={filterKey}
                  onClick={() => setValidationFilter(filterKey)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    validationFilter === filterKey
                      ? "bg-primary text-white"
                      : "bg-secondary text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {filterKey} ({filterKey === "all" ? valMetrics.total : valMetrics[filterKey]})
                </button>
              ))}
            </div>

            {/* Detailed Validation Table */}
            <div className="border border-border rounded-2xl overflow-hidden shadow-sm max-h-[350px] overflow-y-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-secondary text-muted-foreground font-black uppercase tracking-wider sticky top-0 border-b border-border">
                  <tr>
                    <th className="p-3.5">Row #</th>
                    <th className="p-3.5">Employee Name</th>
                    <th className="p-3.5">Email</th>
                    <th className="p-3.5">Department</th>
                    <th className="p-3.5">Issue Details</th>
                    <th className="p-3.5 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border bg-card text-foreground">
                  {filteredRecords.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-muted-foreground font-semibold">
                        No records match the current filter.
                      </td>
                    </tr>
                  ) : (
                    filteredRecords.map((rec) => (
                      <tr key={rec.rowNumber} className="hover:bg-secondary/40 transition-colors">
                        <td className="p-3.5 font-mono text-muted-foreground">Row {rec.rowNumber}</td>
                        <td className="p-3.5 font-extrabold text-foreground">{rec.mappedData.name}</td>
                        <td className="p-3.5 text-muted-foreground">{rec.mappedData.email || "-"}</td>
                        <td className="p-3.5 font-semibold">{rec.mappedData.department || "-"}</td>
                        <td className="p-3.5">
                          {rec.errors.length === 0 ? (
                            <span className="text-emerald-600 dark:text-emerald-400 font-bold">Ready for import</span>
                          ) : (
                            <div className="space-y-0.5">
                              {rec.errors.map((err) => (
                                <p key={`${err.field}-${err.issue}`} className="text-rose-600 dark:text-rose-400 font-medium text-[11px]">
                                  • {err.field}: {err.issue}
                                </p>
                              ))}
                            </div>
                          )}
                        </td>
                        <td className="p-3.5 text-center">
                          {rec.status === "valid" && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-[11px]">
                              <CheckCircle2 size={13} /> Valid
                            </span>
                          )}
                          {rec.status === "invalid" && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 font-bold text-[11px]">
                              <XCircle size={13} /> Error
                            </span>
                          )}
                          {rec.status === "duplicate" && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold text-[11px]">
                              <AlertTriangle size={13} /> Duplicate
                            </span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-between pt-6 border-t border-border">
              <button
                onClick={() => setCurrentStep(2)}
                className="px-6 py-3 rounded-xl border border-border text-muted-foreground hover:text-foreground text-xs font-bold flex items-center gap-2 transition-all cursor-pointer"
              >
                <ArrowLeft size={16} /> Back to Mapping
              </button>
              <button
                disabled={valMetrics.valid === 0}
                onClick={() => setCurrentStep(4)}
                className={`px-6 py-3 rounded-xl text-xs font-bold flex items-center gap-2 shadow-md transition-all cursor-pointer ${
                  valMetrics.valid > 0
                    ? "bg-primary text-white hover:opacity-90"
                    : "bg-primary/40 text-white/70 cursor-not-allowed"
                }`}
              >
                Proceed to Review ({valMetrics.valid} Valid) <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 4: REVIEW IMPORT ── */}
        {currentStep === 4 && (
          <div className="p-6 md:p-10 space-y-6">
            <div>
              <h2 className="text-xl font-extrabold text-foreground">Review Import Summary</h2>
              <p className="text-xs text-muted-foreground mt-1">
                Verify employee dataset metrics and generated IDs prior to committing to directory.
              </p>
            </div>

            {/* Metrics Breakdown */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded-2xl bg-secondary/50 border border-border">
              <div>
                <span className="text-[10px] font-bold text-muted-foreground uppercase block">Total Employees</span>
                <span className="text-xl font-black text-foreground">{valMetrics.total}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase block">
                  New Employees
                </span>
                <span className="text-xl font-black text-emerald-600 dark:text-emerald-400">{valMetrics.valid}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase block">
                  Duplicates (Skipped)
                </span>
                <span className="text-xl font-black text-amber-600 dark:text-amber-400">{valMetrics.duplicate}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400 uppercase block">
                  Errors (Excluded)
                </span>
                <span className="text-xl font-black text-rose-600 dark:text-rose-400">{valMetrics.invalid}</span>
              </div>
            </div>

            {/* Warning Callout */}
            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 text-amber-800 dark:text-amber-300 text-xs font-semibold flex items-center gap-3">
              <Info size={20} className="shrink-0 text-amber-600 dark:text-amber-400" />
              <div>
                <p className="font-extrabold">Review the information before importing employees.</p>
                <p className="text-[11px] opacity-90">
                  Imported records will be assigned automatic Employee IDs (e.g. <code>EMP001</code>) and account activation invites will be issued.
                </p>
              </div>
            </div>

            {/* Employee Preview Table */}
            <div className="border border-border rounded-2xl overflow-hidden shadow-sm max-h-[300px] overflow-y-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-secondary text-muted-foreground font-black uppercase tracking-wider sticky top-0 border-b border-border">
                  <tr>
                    <th className="p-3.5">Generated ID</th>
                    <th className="p-3.5">Employee Name</th>
                    <th className="p-3.5">Email</th>
                    <th className="p-3.5">Department</th>
                    <th className="p-3.5">Designation</th>
                    <th className="p-3.5 text-right">Annual Salary</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border bg-card text-foreground">
                  {validatedRecords
                    .filter((r) => r.status === "valid")
                    .map((rec) => (
                      <tr key={rec.generatedId} className="hover:bg-secondary/40 transition-colors">
                        <td className="p-3.5 font-mono font-bold text-primary">{rec.generatedId}</td>
                        <td className="p-3.5 font-extrabold text-foreground">{rec.mappedData.name}</td>
                        <td className="p-3.5 text-muted-foreground">{rec.mappedData.email}</td>
                        <td className="p-3.5">{rec.mappedData.department}</td>
                        <td className="p-3.5 font-bold">{rec.mappedData.designation}</td>
                        <td className="p-3.5 text-right font-black text-foreground">
                          ₹{rec.mappedData.salary.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-between pt-6 border-t border-border">
              <button
                onClick={() => setCurrentStep(3)}
                className="px-6 py-3 rounded-xl border border-border text-muted-foreground hover:text-foreground text-xs font-bold flex items-center gap-2 transition-all cursor-pointer"
              >
                <ArrowLeft size={16} /> Back to Validation
              </button>
              <button
                onClick={handleExecuteImport}
                className="px-8 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-600/20 transition-all cursor-pointer"
              >
                <CheckCircle2 size={18} /> Confirm & Import {valMetrics.valid} Employees
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 5: IMPORT PROGRESS ── */}
        {currentStep === 5 && (
          <div className="p-12 md:p-16 text-center space-y-8 max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto animate-spin">
              <Loader2 size={36} />
            </div>
            <div>
              <h2 className="text-xl font-black text-foreground">Importing Employees...</h2>
              <p className="text-xs text-muted-foreground mt-1">
                Creating employee profiles, assigning IDs, and preparing user invitations.
              </p>
            </div>

            {/* Animated Progress Bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-muted-foreground">
                  Processing {importProgress.processed} of {importProgress.total} records
                </span>
                <span className="text-primary font-mono">{importProgress.percentage}%</span>
              </div>
              <div className="w-full h-3 rounded-full bg-secondary overflow-hidden border border-border">
                <div
                  className="h-full bg-primary transition-all duration-150 rounded-full"
                  style={{ width: `${importProgress.percentage}%` }}
                />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-secondary/50 border border-border text-xs text-muted-foreground font-semibold">
              Please keep this browser window open while the operation completes.
            </div>
          </div>
        )}

        {/* ── STEP 6: SUCCESS & RESULTS ── */}
        {currentStep === 6 && importResults && (
          <div className="p-6 md:p-10 space-y-6">
            <div className="text-center max-w-md mx-auto">
              {importResults.failedCount === 0 ? (
                <>
                  <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 size={36} />
                  </div>
                  <h2 className="text-2xl font-black text-foreground">Employees Imported Successfully</h2>
                  <p className="text-xs text-muted-foreground mt-1">
                    All employee records have been created in the organization directory.
                  </p>
                </>
              ) : (
                <>
                  <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto mb-4">
                    <AlertTriangle size={36} />
                  </div>
                  <h2 className="text-2xl font-black text-foreground">Import Completed with Warnings</h2>
                  <p className="text-xs text-muted-foreground mt-1">
                    {importResults.successCount} records imported successfully, but {importResults.failedCount + importResults.skippedCount} require attention.
                  </p>
                </>
              )}
            </div>

            {/* Results KPI Breakdown */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded-2xl bg-secondary/50 border border-border">
              <div className="p-3">
                <span className="text-[10px] font-bold text-muted-foreground uppercase block">Total Records</span>
                <span className="text-2xl font-black text-foreground">{importResults.total}</span>
              </div>
              <div className="p-3">
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase block">
                  ✓ Successful
                </span>
                <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                  {importResults.successCount}
                </span>
              </div>
              <div className="p-3">
                <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase block">
                  Skipped (Duplicates)
                </span>
                <span className="text-2xl font-black text-amber-600 dark:text-amber-400">
                  {importResults.skippedCount}
                </span>
              </div>
              <div className="p-3">
                <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400 uppercase block">
                  Failed (Errors)
                </span>
                <span className="text-2xl font-black text-rose-600 dark:text-rose-400">
                  {importResults.failedCount}
                </span>
              </div>
            </div>

            {/* Imported Employees List Preview */}
            <div className="space-y-3">
              <h3 className="text-sm font-extrabold text-foreground uppercase tracking-wider">
                Imported Employees ({importResults.successCount})
              </h3>
              <div className="border border-border rounded-2xl overflow-hidden shadow-sm max-h-[220px] overflow-y-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-secondary text-muted-foreground font-black uppercase tracking-wider sticky top-0 border-b border-border">
                    <tr>
                      <th className="p-3">Employee ID</th>
                      <th className="p-3">Name</th>
                      <th className="p-3">Email</th>
                      <th className="p-3">Department</th>
                      <th className="p-3 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border bg-card text-foreground">
                    {importResults.importedRecords.map((rec) => (
                      <tr key={rec.generatedId}>
                        <td className="p-3 font-mono font-bold text-primary">{rec.generatedId}</td>
                        <td className="p-3 font-extrabold text-foreground">{rec.mappedData.name}</td>
                        <td className="p-3 text-muted-foreground">{rec.mappedData.email}</td>
                        <td className="p-3">{rec.mappedData.department}</td>
                        <td className="p-3 text-right">
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-[10px]">
                            Active / Pending Invite
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-border">
              <div className="flex items-center gap-2">
                {importResults.failedCount + importResults.skippedCount > 0 && (
                  <button
                    onClick={downloadErrorReport}
                    className="px-4 py-2.5 rounded-xl border border-rose-300 dark:border-rose-800 bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Download size={14} /> Download Error Report
                  </button>
                )}
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleResetImport}
                  className="px-5 py-2.5 rounded-xl border border-border text-foreground hover:bg-secondary text-xs font-bold transition-all cursor-pointer"
                >
                  Import More Employees
                </button>
                <button
                  onClick={() => navigate("/employees")}
                  className="px-6 py-2.5 rounded-xl bg-primary text-white text-xs font-bold shadow-md hover:opacity-90 transition-all cursor-pointer"
                >
                  View Employee Directory
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
