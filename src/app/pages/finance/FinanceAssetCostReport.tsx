import { useState } from "react";
import { useNavigate } from "react-router";
import {
  BarChart3,
  Download,
  RotateCcw,
  ChevronDown,
  Search,
  Laptop,
  Smartphone,
  Monitor,
  Printer,
  Wifi,
  Watch,
  Car,
  Package,
  CheckCircle2,
  TrendingUp,
  AlertTriangle,
  ArrowLeft,
  IndianRupee,
  Calendar,
  Building2,
  Wrench,
  RefreshCw,
  X,
  Eye,
  PieChart,
  Shield,
  ExternalLink,
  TrendingDown,
} from "lucide-react";
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { motion, AnimatePresence } from "motion/react";
import { showToast } from "../../components/workflow/ToastNotification";

/* ─── Adjusted Mock Data to match user KPIs: ₹2.4Cr, ₹42L, ₹8L, 14 ─── */
const ASSET_COST_BY_CATEGORY = [
  {
    id: "cat1",
    category: "Laptops",
    count: 85,
    totalValue: 10800000,
    annualDepreciation: 1800000,
    bookValue: 9000000,
    icon: "Laptop",
    status: "Active",
  },
  {
    id: "cat2",
    category: "Smartphones",
    count: 52,
    totalValue: 2600000,
    annualDepreciation: 520000,
    bookValue: 2080000,
    icon: "Smartphone",
    status: "Active",
  },
  {
    id: "cat3",
    category: "Monitors",
    count: 40,
    totalValue: 1200000,
    annualDepreciation: 200000,
    bookValue: 1000000,
    icon: "Monitor",
    status: "Active",
  },
  {
    id: "cat4",
    category: "Printers",
    count: 15,
    totalValue: 600000,
    annualDepreciation: 100000,
    bookValue: 500000,
    icon: "Printer",
    status: "Depreciating",
  },
  {
    id: "cat5",
    category: "Servers & Networking",
    count: 28,
    totalValue: 4800000,
    annualDepreciation: 960000,
    bookValue: 3840000,
    icon: "Wifi",
    status: "Critical",
  },
  {
    id: "cat6",
    category: "Accessories",
    count: 95,
    totalValue: 900000,
    annualDepreciation: 180000,
    bookValue: 720000,
    icon: "Watch",
    status: "Active",
  },
  {
    id: "cat7",
    category: "Vehicles",
    count: 8,
    totalValue: 3100000,
    annualDepreciation: 440000,
    bookValue: 2660000,
    icon: "Car",
    status: "Depreciating",
  },
];

const DEPT_ASSET_DIST_DATA = [
  { department: "Engineering", value: 32, color: "#00B87C" },
  { department: "Sales", value: 20, color: "#8B5CF6" },
  { department: "Operations", value: 16, color: "#F59E0B" },
  { department: "Marketing", value: 13, color: "#3B82F6" },
  { department: "Finance", value: 9, color: "#EC4899" },
  { department: "HR", value: 7, color: "#EF4444" },
  { department: "Legal", value: 3, color: "#14B8A6" },
];

const ASSET_VALUE_BY_DEPT = [
  { department: "Engineering", total: 85, depreciated: 32, current: 53 },
  { department: "Sales", total: 42, depreciated: 15, current: 27 },
  { department: "Operations", total: 35, depreciated: 14, current: 21 },
  { department: "Marketing", total: 28, depreciated: 9, current: 19 },
  { department: "Finance", total: 22, depreciated: 8, current: 14 },
  { department: "HR", total: 15, depreciated: 5, current: 10 },
  { department: "Legal", total: 10, depreciated: 3, current: 7 },
];

const ASSET_DETAILS: Record<
  string,
  {
    items: {
      name: string;
      employee: string;
      dept: string;
      value: number;
      purchaseDate: string;
      lifeYears: number;
    }[];
  }
> = {
  cat1: {
    items: [
      {
        name: "MacBook Pro M4",
        employee: "Rahul Sharma",
        dept: "Engineering",
        value: 260000,
        purchaseDate: "Jan 2025",
        lifeYears: 5,
      },
      {
        name: "Dell XPS 16",
        employee: "Priya Patel",
        dept: "Design",
        value: 190000,
        purchaseDate: "Mar 2024",
        lifeYears: 4,
      },
      {
        name: "ThinkPad X1 Carbon",
        employee: "Amit Singh",
        dept: "Engineering",
        value: 220000,
        purchaseDate: "Jan 2024",
        lifeYears: 5,
      },
      {
        name: "HP EliteBook 840",
        employee: "Sneha Reddy",
        dept: "Marketing",
        value: 160000,
        purchaseDate: "Sep 2023",
        lifeYears: 4,
      },
      {
        name: "Surface Laptop 5",
        employee: "Vikram Mehta",
        dept: "Sales",
        value: 145000,
        purchaseDate: "Nov 2023",
        lifeYears: 4,
      },
    ],
  },
  cat2: {
    items: [
      {
        name: "iPhone 16 Pro",
        employee: "Ananya Gupta",
        dept: "Sales",
        value: 105000,
        purchaseDate: "Oct 2024",
        lifeYears: 3,
      },
      {
        name: "Samsung Galaxy S25",
        employee: "Rajesh Kumar",
        dept: "Operations",
        value: 95000,
        purchaseDate: "Feb 2025",
        lifeYears: 3,
      },
      {
        name: "Pixel 9 Pro",
        employee: "Neha Joshi",
        dept: "Marketing",
        value: 90000,
        purchaseDate: "Dec 2024",
        lifeYears: 3,
      },
    ],
  },
  cat3: {
    items: [
      {
        name: 'Dell UltraSharp 27"',
        employee: "Arun Nair",
        dept: "Engineering",
        value: 45000,
        purchaseDate: "Apr 2024",
        lifeYears: 5,
      },
      {
        name: 'LG 4K Monitor 32"',
        employee: "Deepa Iyer",
        dept: "Finance",
        value: 55000,
        purchaseDate: "Aug 2024",
        lifeYears: 5,
      },
    ],
  },
  cat4: {
    items: [
      {
        name: "HP LaserJet Pro",
        employee: "Common Area",
        dept: "Operations",
        value: 65000,
        purchaseDate: "Jan 2022",
        lifeYears: 5,
      },
      {
        name: "Canon imageRUNNER",
        employee: "Admin Pool",
        dept: "HR",
        value: 85000,
        purchaseDate: "Mar 2021",
        lifeYears: 5,
      },
    ],
  },
  cat5: {
    items: [
      {
        name: "Dell PowerEdge R750",
        employee: "IT Team",
        dept: "Engineering",
        value: 520000,
        purchaseDate: "Jan 2024",
        lifeYears: 6,
      },
      {
        name: "Cisco Switch Stack",
        employee: "IT Team",
        dept: "Engineering",
        value: 320000,
        purchaseDate: "Jun 2022",
        lifeYears: 6,
      },
      {
        name: "Synology NAS",
        employee: "IT Team",
        dept: "Engineering",
        value: 180000,
        purchaseDate: "Mar 2024",
        lifeYears: 5,
      },
    ],
  },
  cat6: {
    items: [
      {
        name: "Logitech MX Master 3S",
        employee: "Various",
        dept: "All",
        value: 12000,
        purchaseDate: "Jan 2024",
        lifeYears: 3,
      },
      {
        name: "Jabra Evolve2 65",
        employee: "Various",
        dept: "All",
        value: 18000,
        purchaseDate: "Feb 2024",
        lifeYears: 3,
      },
      {
        name: "Dell Dock WD19",
        employee: "Various",
        dept: "All",
        value: 22000,
        purchaseDate: "Mar 2024",
        lifeYears: 4,
      },
    ],
  },
  cat7: {
    items: [
      {
        name: "Toyota Innova Hycross",
        employee: "Executive Pool",
        dept: "Operations",
        value: 2800000,
        purchaseDate: "Jun 2024",
        lifeYears: 8,
      },
      {
        name: "Honda City Hybrid",
        employee: "Regional Sales",
        dept: "Sales",
        value: 1600000,
        purchaseDate: "Jan 2024",
        lifeYears: 7,
      },
    ],
  },
};

const DEPT_DETAILS: Record<
  string,
  { headCount: number; totalAssets: number; totalValue: number; avgAge: number }
> = {
  Engineering: {
    headCount: 180,
    totalAssets: 320,
    totalValue: 10800000,
    avgAge: 2.4,
  },
  Sales: { headCount: 95, totalAssets: 140, totalValue: 4200000, avgAge: 1.8 },
  Operations: {
    headCount: 72,
    totalAssets: 110,
    totalValue: 3500000,
    avgAge: 3.2,
  },
  Marketing: {
    headCount: 48,
    totalAssets: 85,
    totalValue: 2800000,
    avgAge: 2.1,
  },
  Finance: { headCount: 35, totalAssets: 60, totalValue: 2200000, avgAge: 2.6 },
  HR: { headCount: 28, totalAssets: 45, totalValue: 1500000, avgAge: 3.5 },
  Legal: { headCount: 15, totalAssets: 25, totalValue: 1000000, avgAge: 4.1 },
};

type KPIModalType =
  | "totalValue"
  | "depreciation"
  | "maintenance"
  | "replacement"
  | null;

/* ─── Helpers ─── */
const formatCurrency = (val: number) => {
  if (val >= 10000000) return `₹${(val / 10000000).toFixed(1)}Cr`;
  if (val >= 100000) return `₹${(val / 100000).toFixed(1)}L`;
  if (val >= 1000) return `₹${(val / 1000).toFixed(1)}K`;
  return `₹${val}`;
};

const formatNumber = (val: number) => val.toLocaleString("en-IN");

const getCategoryIcon = (iconName: string, size: number = 16) => {
  switch (iconName) {
    case "Laptop":
      return <Laptop size={size} />;
    case "Smartphone":
      return <Smartphone size={size} />;
    case "Monitor":
      return <Monitor size={size} />;
    case "Printer":
      return <Printer size={size} />;
    case "Wifi":
      return <Wifi size={size} />;
    case "Watch":
      return <Watch size={size} />;
    case "Car":
      return <Car size={size} />;
    default:
      return <Package size={size} />;
  }
};

const getCatColor = (iconName: string) => {
  switch (iconName) {
    case "Laptop":
      return "bg-[#DCFCE7] dark:bg-emerald-500/10 text-[#00B87C] dark:text-emerald-400 border-[#A7F3D0] dark:border-emerald-500/20";
    case "Smartphone":
      return "bg-[#EDE9FE] dark:bg-purple-500/10 text-[#8B5CF6] dark:text-purple-400 border-[#DDD6FE] dark:border-purple-500/20";
    case "Monitor":
      return "bg-[#E0F2FE] dark:bg-sky-500/10 text-[#0EA5E9] dark:text-sky-400 border-[#BAE6FD] dark:border-sky-500/20";
    case "Printer":
      return "bg-[#FEF3C7] dark:bg-amber-500/10 text-[#F59E0B] dark:text-amber-400 border-[#FDE68A] dark:border-amber-500/20";
    case "Wifi":
      return "bg-[#CCFBF1] dark:bg-teal-500/10 text-[#14B8A6] dark:text-teal-400 border-[#99F6E4] dark:border-teal-500/20";
    case "Watch":
      return "bg-[#FCE7F3] dark:bg-pink-500/10 text-[#EC4899] dark:text-pink-400 border-[#FBCFE8] dark:border-pink-500/20";
    case "Car":
      return "bg-[#FEE2E2] dark:bg-rose-500/10 text-[#EF4444] dark:text-rose-400 border-[#FECACA] dark:border-rose-500/20";
    default:
      return "bg-[#F3F4F6] dark:bg-gray-500/10 text-[#6B7280] dark:text-gray-400 border-[#E5E7EB] dark:border-gray-500/20";
  }
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case "Active":
      return (
        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#DCFCE7] dark:bg-emerald-500/10 text-[#00B87C] dark:text-emerald-400 border border-[#A7F3D0] dark:border-emerald-500/20">
          <CheckCircle2 size={12} strokeWidth={3} />
          <span className="text-[11px] font-black uppercase tracking-wider">
            Active
          </span>
        </div>
      );
    case "Depreciating":
      return (
        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#FEF3C7] dark:bg-amber-500/10 text-[#D97706] dark:text-amber-400 border border-[#FDE68A] dark:border-amber-500/20">
          <TrendingUp size={12} strokeWidth={3} />
          <span className="text-[11px] font-black uppercase tracking-wider">
            Depreciating
          </span>
        </div>
      );
    case "Critical":
      return (
        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#FEE2E2] dark:bg-rose-500/10 text-[#DC2626] dark:text-rose-400 border border-[#FECACA] dark:border-rose-500/20">
          <AlertTriangle size={12} strokeWidth={3} />
          <span className="text-[11px] font-black uppercase tracking-wider">
            Critical
          </span>
        </div>
      );
    default:
      return (
        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border">
          <Package size={12} strokeWidth={3} />
          <span className="text-[11px] font-black uppercase tracking-wider">
            {status}
          </span>
        </div>
      );
  }
};

export function FinanceAssetCostReport() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<string>("category");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedDept, setSelectedDept] = useState<string | null>(null);
  const [activeKPIModal, setActiveKPIModal] = useState<KPIModalType>(null);
  const [exportLoading, setExportLoading] = useState<"pdf" | "csv" | null>(
    null,
  );
  const [selectedFY, setSelectedFY] = useState("FY 2025-26");
  const [selectedCatFilter, setSelectedCatFilter] = useState("All Categories");
  const [showFYDropdown, setShowFYDropdown] = useState(false);
  const [showCatDropdown, setShowCatDropdown] = useState(false);

  const totalAssetValue = ASSET_COST_BY_CATEGORY.reduce(
    (s, c) => s + c.totalValue,
    0,
  );
  const totalDepreciation = ASSET_COST_BY_CATEGORY.reduce(
    (s, c) => s + c.annualDepreciation,
    0,
  );
  const totalMaintenance = 800000;
  const replacementDue = 14;

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDir((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("asc");
    }
  };

  const filteredData = [...ASSET_COST_BY_CATEGORY]
    .filter((c) => c.category.toLowerCase().includes(searchQuery.toLowerCase()))
    .filter(
      (c) =>
        selectedCatFilter === "All Categories" ||
        c.category === selectedCatFilter,
    )
    .sort((a, b) => {
      let cmp: number;
      switch (sortField) {
        case "category":
          cmp = a.category.localeCompare(b.category);
          break;
        case "count":
          cmp = a.count - b.count;
          break;
        case "totalValue":
          cmp = a.totalValue - b.totalValue;
          break;
        case "annualDepreciation":
          cmp = a.annualDepreciation - b.annualDepreciation;
          break;
        case "bookValue":
          cmp = a.bookValue - b.bookValue;
          break;
        case "status":
          cmp = a.status.localeCompare(b.status);
          break;
        default:
          cmp = 0;
      }
      return sortDir === "asc" ? cmp : -cmp;
    });

  const SortIcon = ({ field }: { field: string }) => (
    <span className="inline-flex flex-col items-center leading-none ml-1 -mt-0.5">
      <ChevronDown
        size={8}
        className={`-mb-0.5 ${sortField === field && sortDir === "asc" ? "text-[#00B87C]" : "text-muted-foreground/40"}`}
        style={{ transform: "scaleY(-1)" }}
      />
      <ChevronDown
        size={8}
        className={`${sortField === field && sortDir === "desc" ? "text-[#00B87C]" : "text-muted-foreground/40"}`}
      />
    </span>
  );

  const selectedCategoryData = selectedCategory
    ? ASSET_COST_BY_CATEGORY.find((c) => c.id === selectedCategory)
    : null;
  const selectedDetails = selectedCategory
    ? ASSET_DETAILS[selectedCategory]
    : null;
  const selectedDeptData = selectedDept ? DEPT_DETAILS[selectedDept] : null;

  const handleExportPDF = async () => {
    setExportLoading("pdf");
    showToast("Preparing PDF", "info", "Generating Asset Cost Report...");
    await new Promise((r) => setTimeout(r, 800));
    const reportTitle = "Asset Cost Report - NexusHR EMS";
    const content = [
      reportTitle,
      "Asset Valuation and Depreciation Overview",
      `Generated: ${new Date().toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}`,
      "",
      "KPI Summary",
      `  Total Asset Value: ${formatCurrency(totalAssetValue)}`,
      `  Annual Depreciation: ${formatCurrency(totalDepreciation)}`,
      `  Maintenance Cost: ${formatCurrency(totalMaintenance)}`,
      `  Replacement Due: ${replacementDue} assets`,
      "",
      "Asset Cost Breakdown by Category",
      ...ASSET_COST_BY_CATEGORY.map(
        (c) =>
          `  ${c.category} | Count: ${c.count} | Value: ${formatCurrency(c.totalValue)} | Depreciation: ${formatCurrency(c.annualDepreciation)} | Book Value: ${formatCurrency(c.bookValue)} | Status: ${c.status}`,
      ),
      "",
      "Department-wise Asset Values",
      ...ASSET_VALUE_BY_DEPT.map(
        (d) =>
          `  ${d.department} | Total: ₹${d.total}L | Depreciated: ₹${d.depreciated}L | Current: ₹${d.current}L`,
      ),
      "",
      "--- End of Report ---",
    ].join("\n");
    const blob = new Blob([content], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Asset_Cost_Report_${new Date().toISOString().split("T")[0]}.pdf`;
    a.click();
    URL.revokeObjectURL(url);
    setExportLoading(null);
    showToast(
      "Export Complete",
      "success",
      "PDF report downloaded successfully.",
    );
  };

  const handleExportCSV = async () => {
    setExportLoading("csv");
    showToast("Preparing CSV", "info", "Generating Asset Cost Data...");
    await new Promise((r) => setTimeout(r, 600));
    const headers =
      "Category,Count,Total Value,Annual Depreciation,Book Value,Status";
    const rows = ASSET_COST_BY_CATEGORY.map(
      (c) =>
        `"${c.category}",${c.count},${c.totalValue},${c.annualDepreciation},${c.bookValue},"${c.status}"`,
    );
    const csv = [headers, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Asset_Cost_Report_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    setExportLoading(null);
    showToast(
      "Export Complete",
      "success",
      "CSV report downloaded successfully.",
    );
  };

  const KPI_MODAL_CONTENT: Record<
    NonNullable<KPIModalType>,
    {
      title: string;
      icon: React.ElementType;
      color: string;
      bg: string;
      data: { label: string; value: string; color: string }[];
    }
  > = {
    totalValue: {
      title: "Total Asset Value Breakdown",
      icon: IndianRupee,
      color: "#8B5CF6",
      bg: "#EDE9FE",
      data: [
        {
          label: "IT Equipment",
          value: formatCurrency(
            ASSET_COST_BY_CATEGORY.filter((c) =>
              [
                "Laptops",
                "Monitors",
                "Printers",
                "Servers & Networking",
              ].includes(c.category),
            ).reduce((s, c) => s + c.totalValue, 0),
          ),
          color: "#8B5CF6",
        },
        {
          label: "Mobile Devices",
          value: formatCurrency(
            ASSET_COST_BY_CATEGORY.find((c) => c.category === "Smartphones")
              ?.totalValue || 0,
          ),
          color: "#0EA5E9",
        },
        {
          label: "Accessories",
          value: formatCurrency(
            ASSET_COST_BY_CATEGORY.find((c) => c.category === "Accessories")
              ?.totalValue || 0,
          ),
          color: "#F59E0B",
        },
        {
          label: "Vehicles",
          value: formatCurrency(
            ASSET_COST_BY_CATEGORY.find((c) => c.category === "Vehicles")
              ?.totalValue || 0,
          ),
          color: "#EF4444",
        },
      ],
    },
    depreciation: {
      title: "Annual Depreciation Breakdown",
      icon: TrendingUp,
      color: "#EF4444",
      bg: "#FEE2E2",
      data: [
        {
          label: "Straight Line Depreciation",
          value: formatCurrency(totalDepreciation * 0.75),
          color: "#EF4444",
        },
        {
          label: "Diminishing Balance",
          value: formatCurrency(totalDepreciation * 0.15),
          color: "#F59E0B",
        },
        {
          label: "Immediate Write-off",
          value: formatCurrency(totalDepreciation * 0.1),
          color: "#8B5CF6",
        },
      ],
    },
    maintenance: {
      title: "Maintenance Cost YTD",
      icon: Wrench,
      color: "#F59E0B",
      bg: "#FEF3C7",
      data: [
        {
          label: "Hardware Repairs",
          value: formatCurrency(380000),
          color: "#F59E0B",
        },
        {
          label: "Software Licenses",
          value: formatCurrency(250000),
          color: "#8B5CF6",
        },
        {
          label: "Vendor Support",
          value: formatCurrency(170000),
          color: "#0EA5E9",
        },
      ],
    },
    replacement: {
      title: "Assets Due for Replacement",
      icon: RefreshCw,
      color: "#F97316",
      bg: "#FFF7ED",
      data: [
        {
          label: "Past Useful Life (Critical)",
          value: "5 assets",
          color: "#EF4444",
        },
        { label: "Nearing End of Life", value: "9 assets", color: "#F59E0B" },
        {
          label: "Recommended Budget",
          value: formatCurrency(6500000),
          color: "#8B5CF6",
        },
      ],
    },
  };

  return (
    <div className="w-full px-4 md:px-8 py-6 pb-10 space-y-8 animate-in fade-in duration-500 min-h-screen bg-background">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() =>
              navigate("/reports", { state: { activeTab: "Asset Reports" } })
            }
            className="w-10 h-10 rounded-xl border border-border flex items-center justify-center hover:bg-muted transition-all shrink-0"
          >
            <ArrowLeft size={20} className="text-muted-foreground" />
          </button>
          <div className="w-11 h-11 rounded-[10px] bg-[#EDE9FE] dark:bg-purple-500/10 flex items-center justify-center shadow-inner border border-purple-100 dark:border-purple-500/20">
            <BarChart3
              size={22}
              className="text-[#8B5CF6] dark:text-purple-400"
            />
          </div>
          <div>
            <h1 className="text-[26px] font-black text-foreground tracking-tight">
              Asset Cost Report
            </h1>
            <p className="text-[13px] font-semibold text-muted-foreground">
              Asset valuation and depreciation overview
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleExportPDF}
            disabled={exportLoading === "pdf"}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border text-foreground font-black text-[12px] uppercase tracking-widest hover:bg-muted/50 transition-all disabled:opacity-50"
          >
            {exportLoading === "pdf" ? (
              <div className="w-4 h-4 border-2 border-muted-foreground/30 border-t-muted-foreground rounded-full animate-spin" />
            ) : (
              <Download size={18} />
            )}
            Export PDF
          </button>
          <button
            onClick={handleExportCSV}
            disabled={exportLoading === "csv"}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border text-foreground font-black text-[12px] uppercase tracking-widest hover:bg-muted/50 transition-all disabled:opacity-50"
          >
            {exportLoading === "csv" ? (
              <div className="w-4 h-4 border-2 border-muted-foreground/30 border-t-muted-foreground rounded-full animate-spin" />
            ) : (
              <Download size={18} />
            )}
            Export CSV
          </button>
        </div>
      </div>

      {/* VIEW ONLY BANNER */}
      <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-[#EDE9FE]/60 dark:bg-purple-500/10 border border-[#8B5CF6]/20 dark:border-purple-500/20">
        <div className="w-8 h-8 rounded-lg bg-[#EDE9FE] dark:bg-purple-500/20 flex items-center justify-center shrink-0">
          <Eye size={16} className="text-[#8B5CF6] dark:text-purple-400" />
        </div>
        <div className="flex-1">
          <p className="text-[12px] font-black text-[#7C3AED] dark:text-purple-400 uppercase tracking-wider flex items-center gap-2">
            View Only Mode
            <span className="text-[11px] font-bold text-muted-foreground normal-case tracking-normal">
              — Finance role has read-only access to asset cost data
            </span>
          </p>
        </div>
        <div className="px-3 py-1 rounded-full bg-[#8B5CF6]/10 border border-[#8B5CF6]/30 dark:border-purple-500/30">
          <span className="text-[11px] font-semibold text-[#8B5CF6] dark:text-purple-400 uppercase tracking-widest">
            Finance
          </span>
        </div>
      </div>

      {/* DATA TIMESTAMP */}
      <div className="flex items-center justify-end">
        <span className="text-[12px] font-bold text-muted-foreground italic flex items-center gap-2">
          <Calendar size={14} />
          Data as of Jun 2, 2026
        </span>
      </div>

      {/* KPI CARDS — all clickable */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0 }}
          onClick={() => setActiveKPIModal("totalValue")}
          className="bg-card border border-border rounded-2xl p-5 shadow-sm hover:-translate-y-[2px] hover:border-[#00B87C] hover:shadow-[0_0_15px_rgba(0,184,124,0.3)] hover:border-purple-300 hover:-translate-y-0.5 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-3">
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[1.5px]">
              Total Asset Value
            </p>
            <div className="w-8 h-8 rounded-lg bg-[#EDE9FE] dark:bg-purple-500/10 flex items-center justify-center">
              <IndianRupee
                size={16}
                className="text-[#8B5CF6] dark:text-purple-400"
              />
            </div>
          </div>
          <h3 className="text-2xl font-black text-[#8B5CF6] tracking-tighter">
            {formatCurrency(totalAssetValue)}
          </h3>
          <div className="flex items-center gap-1.5 mt-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6]" />
            <span className="text-[11px] font-bold text-muted-foreground">
              Across all categories
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          onClick={() => setActiveKPIModal("depreciation")}
          className="bg-card border border-border rounded-2xl p-5 shadow-sm hover:-translate-y-[2px] hover:border-[#00B87C] hover:shadow-[0_0_15px_rgba(0,184,124,0.3)] hover:border-rose-300 hover:-translate-y-0.5 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-3">
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[1.5px]">
              Annual Depreciation
            </p>
            <div className="w-8 h-8 rounded-lg bg-[#FEE2E2] dark:bg-rose-500/10 flex items-center justify-center">
              <TrendingDown
                size={16}
                className="text-[#EF4444] dark:text-rose-400"
              />
            </div>
          </div>
          <h3 className="text-2xl font-black text-rose-500 tracking-tighter">
            {formatCurrency(totalDepreciation)}
          </h3>
          <div className="flex items-center gap-1.5 mt-2">
            <div className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            <span className="text-[11px] font-bold text-muted-foreground">
              {formatNumber(
                Math.round((totalDepreciation / totalAssetValue) * 100),
              )}
              % of total value
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          onClick={() => setActiveKPIModal("maintenance")}
          className="bg-card border border-border rounded-2xl p-5 shadow-sm hover:-translate-y-[2px] hover:border-[#00B87C] hover:shadow-[0_0_15px_rgba(0,184,124,0.3)] hover:border-amber-300 hover:-translate-y-0.5 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-3">
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[1.5px]">
              Maintenance Cost
            </p>
            <div className="w-8 h-8 rounded-lg bg-[#FEF3C7] dark:bg-amber-500/10 flex items-center justify-center">
              <Wrench
                size={16}
                className="text-[#F59E0B] dark:text-amber-400"
              />
            </div>
          </div>
          <h3 className="text-2xl font-black text-amber-500 tracking-tighter">
            {formatCurrency(totalMaintenance)}
          </h3>
          <div className="flex items-center gap-1.5 mt-2">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            <span className="text-[11px] font-bold text-muted-foreground">
              YTD spend on repairs
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          onClick={() => setActiveKPIModal("replacement")}
          className="bg-card border border-border rounded-2xl p-5 shadow-sm hover:-translate-y-[2px] hover:border-[#00B87C] hover:shadow-[0_0_15px_rgba(0,184,124,0.3)] hover:border-orange-300 hover:-translate-y-0.5 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-3">
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[1.5px]">
              Replacement Due
            </p>
            <div className="w-8 h-8 rounded-lg bg-[#FFF7ED] dark:bg-orange-500/10 flex items-center justify-center">
              <RefreshCw
                size={16}
                className="text-[#F97316] dark:text-orange-400"
              />
            </div>
          </div>
          <h3 className="text-2xl font-black text-orange-500 tracking-tighter">
            {replacementDue}
          </h3>
          <div className="flex items-center gap-1.5 mt-2">
            <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
            <span className="text-[11px] font-bold text-muted-foreground">
              Assets past useful life
            </span>
          </div>
        </motion.div>
      </div>

      {/* SEARCH & FILTER BAR */}
      <div className="bg-card border border-border rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          {/* Fiscal Year Filter */}
          <div className="relative">
            <button
              onClick={() => {
                setShowFYDropdown(!showFYDropdown);
                setShowCatDropdown(false);
              }}
              className="flex items-center gap-2.5 px-4 py-2.5 bg-card border border-border rounded-xl text-[12px] font-bold text-foreground hover:border-[#8B5CF6]/50 transition-all shadow-sm"
            >
              <Calendar size={14} className="text-muted-foreground" />
              {selectedFY}
              <ChevronDown size={14} className="text-muted-foreground ml-1" />
            </button>
            {showFYDropdown && (
              <div className="absolute top-full left-0 mt-2 w-48 bg-card border border-border rounded-2xl shadow-xl z-20 overflow-hidden">
                {["FY 2025-26", "FY 2024-25", "FY 2023-24"].map((fy) => (
                  <button
                    key={fy}
                    onClick={() => {
                      setSelectedFY(fy);
                      setShowFYDropdown(false);
                    }}
                    className={`w-full text-left px-4 py-3 text-[12px] font-bold transition-all hover:bg-muted flex items-center gap-2 ${
                      selectedFY === fy
                        ? "text-[#8B5CF6] dark:text-purple-400 bg-[#EDE9FE]/30 dark:bg-purple-500/10"
                        : "text-foreground"
                    }`}
                  >
                    <Calendar
                      size={14}
                      className={
                        selectedFY === fy
                          ? "text-[#8B5CF6]"
                          : "text-muted-foreground"
                      }
                    />
                    {fy}
                    {selectedFY === fy && (
                      <CheckCircle2
                        size={14}
                        className="ml-auto text-[#8B5CF6]"
                      />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Category Filter */}
          <div className="relative">
            <button
              onClick={() => {
                setShowCatDropdown(!showCatDropdown);
                setShowFYDropdown(false);
              }}
              className="flex items-center gap-2.5 px-4 py-2.5 bg-card border border-border rounded-xl text-[12px] font-bold text-foreground hover:border-[#8B5CF6]/50 transition-all shadow-sm"
            >
              <Package size={14} className="text-muted-foreground" />
              {selectedCatFilter}
              <ChevronDown size={14} className="text-muted-foreground ml-1" />
            </button>
            {showCatDropdown && (
              <div className="absolute top-full left-0 mt-2 w-56 bg-card border border-border rounded-2xl shadow-xl z-20 overflow-hidden">
                {[
                  "All Categories",
                  ...ASSET_COST_BY_CATEGORY.map((c) => c.category),
                ].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setSelectedCatFilter(cat);
                      setShowCatDropdown(false);
                    }}
                    className={`w-full text-left px-4 py-3 text-[12px] font-bold transition-all hover:bg-muted flex items-center gap-2 ${
                      selectedCatFilter === cat
                        ? "text-[#8B5CF6] dark:text-purple-400 bg-[#EDE9FE]/30 dark:bg-purple-500/10"
                        : "text-foreground"
                    }`}
                  >
                    <Package
                      size={14}
                      className={
                        selectedCatFilter === cat
                          ? "text-[#8B5CF6]"
                          : "text-muted-foreground"
                      }
                    />
                    {cat}
                    {selectedCatFilter === cat && (
                      <CheckCircle2
                        size={14}
                        className="ml-auto text-[#8B5CF6]"
                      />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="w-px h-8 bg-border" />

          <div className="relative w-full sm:w-64">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
              size={16}
            />
            <input
              type="text"
              placeholder="Search asset category..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-background text-[12px] font-bold outline-none focus:ring-2 focus:ring-[#8B5CF6]/20 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedCatFilter("All Categories");
            }}
            className="flex items-center gap-2 px-4 py-2.5 text-xs font-black text-muted-foreground hover:text-foreground transition-all uppercase tracking-widest"
          >
            <RotateCcw size={16} />
            Reset
          </button>
        </div>
        <div className="flex items-center gap-2 text-[12px] font-bold text-muted-foreground italic">
          <Shield size={14} />
          View Only — No modifications allowed
        </div>
      </div>

      {/* Click outside to close dropdowns */}
      {(showFYDropdown || showCatDropdown) && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => {
            setShowFYDropdown(false);
            setShowCatDropdown(false);
          }}
        />
      )}

      {/* ASSET COST TABLE */}
      <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-border bg-secondary/10 flex items-center justify-between">
          <h3 className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.2em]">
            Asset Cost Breakdown by Category
          </h3>
          <span className="text-[11px] font-bold text-muted-foreground">
            {filteredData.length} categories
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-secondary/20">
                <th
                  className="px-6 py-4 text-[11px] font-semibold text-muted-foreground uppercase tracking-widest cursor-pointer select-none"
                  onClick={() => handleSort("category")}
                >
                  <div className="flex items-center">
                    Category <SortIcon field="category" />
                  </div>
                </th>
                <th
                  className="px-6 py-4 text-[11px] font-semibold text-muted-foreground uppercase tracking-widest text-right cursor-pointer select-none"
                  onClick={() => handleSort("count")}
                >
                  <div className="flex items-center justify-end">
                    Count <SortIcon field="count" />
                  </div>
                </th>
                <th
                  className="px-6 py-4 text-[11px] font-semibold text-muted-foreground uppercase tracking-widest text-right cursor-pointer select-none"
                  onClick={() => handleSort("totalValue")}
                >
                  <div className="flex items-center justify-end">
                    Total Value <SortIcon field="totalValue" />
                  </div>
                </th>
                <th
                  className="px-6 py-4 text-[11px] font-semibold text-muted-foreground uppercase tracking-widest text-right cursor-pointer select-none"
                  onClick={() => handleSort("annualDepreciation")}
                >
                  <div className="flex items-center justify-end">
                    Annual Depreciation <SortIcon field="annualDepreciation" />
                  </div>
                </th>
                <th
                  className="px-6 py-4 text-[11px] font-semibold text-muted-foreground uppercase tracking-widest text-right cursor-pointer select-none"
                  onClick={() => handleSort("bookValue")}
                >
                  <div className="flex items-center justify-end">
                    Book Value <SortIcon field="bookValue" />
                  </div>
                </th>
                <th
                  className="px-6 py-4 text-[11px] font-semibold text-muted-foreground uppercase tracking-widest text-center cursor-pointer select-none"
                  onClick={() => handleSort("status")}
                >
                  <div className="flex items-center justify-center">
                    Status <SortIcon field="status" />
                  </div>
                </th>
                <th className="px-6 py-4 text-[11px] font-semibold text-muted-foreground uppercase tracking-widest text-center">
                  Details
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredData.map((row, idx) => {
                const catColor = getCatColor(row.icon);

                return (
                  <motion.tr
                    key={row.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: idx * 0.03 }}
                    onClick={() => setSelectedCategory(row.id)}
                    className="hover:bg-secondary/30 transition-colors h-16 group cursor-pointer"
                  >
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${catColor}`}
                        >
                          {getCategoryIcon(row.icon, 16)}
                        </div>
                        <span className="text-[13px] font-bold text-foreground">
                          {row.category}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-3 text-right">
                      <span className="text-[13px] font-black text-foreground">
                        {formatNumber(row.count)}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-right">
                      <span className="text-[13px] font-black text-foreground">
                        {formatCurrency(row.totalValue)}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-right">
                      <span className="text-[13px] font-black text-rose-500">
                        {formatCurrency(row.annualDepreciation)}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-right">
                      <span className="text-[13px] font-black text-[#00B87C]">
                        {formatCurrency(row.bookValue)}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-center">
                      {getStatusBadge(row.status)}
                    </td>
                    <td className="px-6 py-3 text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedCategory(row.id);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-[#EDE9FE] dark:bg-purple-500/10 text-[#8B5CF6] dark:text-purple-400 text-[11px] font-semibold uppercase tracking-wider hover:bg-[#DDD6FE] dark:hover:bg-purple-500/20 transition-all flex items-center gap-1.5 mx-auto"
                      >
                        <Eye size={12} />
                        View
                      </button>
                    </td>
                  </motion.tr>
                );
              })}
              {filteredData.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Package size={32} className="text-muted-foreground/40" />
                      <p className="text-sm font-bold text-muted-foreground">
                        No categories found matching your search
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
            {filteredData.length > 0 && (
              <tfoot className="bg-[#EDE9FE]/20 dark:bg-purple-500/5 border-t-2 border-[#8B5CF6]/20 dark:border-purple-500/20">
                <tr>
                  <td className="px-6 py-4">
                    <span className="text-[13px] font-black text-[#8B5CF6] uppercase tracking-wider">
                      Total
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-[13px] font-black text-foreground">
                      {formatNumber(
                        filteredData.reduce((s, r) => s + r.count, 0),
                      )}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-[13px] font-black text-[#8B5CF6]">
                      {formatCurrency(
                        filteredData.reduce((s, r) => s + r.totalValue, 0),
                      )}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-[13px] font-black text-rose-500">
                      {formatCurrency(
                        filteredData.reduce(
                          (s, r) => s + r.annualDepreciation,
                          0,
                        ),
                      )}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-[13px] font-black text-[#00B87C]">
                      {formatCurrency(
                        filteredData.reduce((s, r) => s + r.bookValue, 0),
                      )}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-[11px] font-bold text-muted-foreground">
                      {filteredData.length} categories
                    </span>
                  </td>
                  <td className="px-6 py-4" />
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>

      {/* QUICK STATS ROW */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-card border border-border rounded-2xl shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#EDE9FE] dark:bg-purple-500/10 flex items-center justify-center shrink-0">
              <Package
                size={16}
                className="text-[#8B5CF6] dark:text-purple-400"
              />
            </div>
            <div>
              <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">
                Total Categories
              </p>
              <p className="text-base font-black text-foreground">
                {ASSET_COST_BY_CATEGORY.length}
              </p>
            </div>
          </div>
        </div>
        <div className="p-4 bg-card border border-border rounded-2xl shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#DCFCE7] dark:bg-[#00B87C]/10 flex items-center justify-center shrink-0">
              <CheckCircle2 size={16} className="text-[#00B87C]" />
            </div>
            <div>
              <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">
                Active Categories
              </p>
              <p className="text-base font-black text-foreground">
                {
                  ASSET_COST_BY_CATEGORY.filter((c) => c.status === "Active")
                    .length
                }
              </p>
            </div>
          </div>
        </div>
        <div className="p-4 bg-card border border-border rounded-2xl shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#FEF3C7] dark:bg-amber-500/10 flex items-center justify-center shrink-0">
              <TrendingUp
                size={16}
                className="text-[#F59E0B] dark:text-amber-400"
              />
            </div>
            <div>
              <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">
                Avg Depreciation Rate
              </p>
              <p className="text-base font-black text-foreground">
                {Math.round((totalDepreciation / totalAssetValue) * 100)}%
              </p>
            </div>
          </div>
        </div>
        <div className="p-4 bg-card border border-border rounded-2xl shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#FEE2E2] dark:bg-rose-500/10 flex items-center justify-center shrink-0">
              <AlertTriangle
                size={16}
                className="text-[#EF4444] dark:text-rose-400"
              />
            </div>
            <div>
              <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">
                Departments Served
              </p>
              <p className="text-base font-black text-foreground">
                {ASSET_VALUE_BY_DEPT.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CHARTS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Dept Asset Cost Distribution - Clickable bars */}
        <div className="p-6 bg-card border border-border rounded-[32px] shadow-sm flex flex-col h-full">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-[13px] font-black text-foreground tracking-tight uppercase">
                Dept Asset Cost Distribution
              </h3>
              <p className="text-[11px] font-bold text-muted-foreground mt-1">
                Click bars to view department details
              </p>
            </div>
            <button
              onClick={() => {
                const total = ASSET_VALUE_BY_DEPT.reduce(
                  (s, d) => s + d.total,
                  0,
                );
                const data = ASSET_VALUE_BY_DEPT.map((d) => ({
                  name: d.department,
                  value: Math.round((d.total / total) * 100),
                }));
                alert(
                  `Department Distribution:\n${data.map((d) => `${d.name}: ${d.value}%`).join("\n")}`,
                );
              }}
              className="p-2 rounded-xl hover:bg-[#EDE9FE] dark:hover:bg-purple-500/10 transition-all text-[#8B5CF6] dark:text-purple-400"
              title="View distribution summary"
            >
              <PieChart size={18} />
            </button>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-4 flex-wrap">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-[#00B87C]" />
                <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                  Asset Value
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-[#8B5CF6]" />
                <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                  Depreciation
                </span>
              </div>
            </div>
            <div className="space-y-4">
              {ASSET_VALUE_BY_DEPT.map((dept) => {
                const maxVal = Math.max(
                  ...ASSET_VALUE_BY_DEPT.map((d) => d.total),
                );
                const totalPct = (dept.total / maxVal) * 100;
                const depPct = (dept.depreciated / maxVal) * 100;
                return (
                  <div
                    key={dept.department}
                    onClick={() => setSelectedDept(dept.department)}
                    className="flex items-center gap-4 cursor-pointer group hover:bg-muted/30 rounded-lg px-2 py-1 transition-all"
                  >
                    <span className="w-24 text-[11px] font-bold text-muted-foreground shrink-0 text-right group-hover:text-foreground transition-colors">
                      {dept.department}
                    </span>
                    <div className="flex-1 flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-3 bg-secondary rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${totalPct}%` }}
                            transition={{ duration: 0.8, delay: 0.1 }}
                            className="h-full bg-[#00B87C] rounded-full group-hover:opacity-80 transition-opacity"
                          />
                        </div>
                        <span className="text-[11px] font-semibold text-foreground w-16 text-right">
                          ₹{dept.total}L
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${depPct}%` }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="h-full bg-[#8B5CF6] rounded-full group-hover:opacity-80 transition-opacity"
                          />
                        </div>
                        <span className="text-[11px] font-bold text-muted-foreground w-16 text-right">
                          ₹{dept.depreciated}L
                        </span>
                      </div>
                    </div>
                    <ExternalLink
                      size={12}
                      className="text-muted-foreground/0 group-hover:text-muted-foreground/60 transition-all shrink-0"
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Book Value vs Depreciation - Bar Chart with clickable bars */}
        <div className="p-6 bg-card border border-border rounded-[32px] shadow-sm flex flex-col h-full">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-[13px] font-black text-foreground tracking-tight uppercase">
                Book Value vs Depreciation
              </h3>
              <p className="text-[11px] font-bold text-muted-foreground mt-1">
                Current value and accumulated depreciation
              </p>
            </div>
            <div className="flex items-center gap-2 text-[11px] font-bold text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-sm bg-[#00B87C]" />
                Book Value
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-sm bg-[#8B5CF6]" />
                Depreciated
              </div>
            </div>
          </div>
          <div className="flex-1 w-full h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsBarChart
                data={ASSET_VALUE_BY_DEPT}
                layout="vertical"
                margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                onClick={(data) => {
                  if (data?.activeLabel) {
                    setSelectedDept(data.activeLabel);
                  }
                }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  horizontal={false}
                  stroke="var(--border)"
                />
                <XAxis
                  type="number"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fontWeight: 700, fill: "#94A3B8" }}
                />
                <YAxis
                  dataKey="department"
                  type="category"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fontWeight: 700, fill: "#94A3B8" }}
                  width={80}
                />
                <Tooltip
                  cursor={{ fill: "rgba(139,92,246,0.05)" }}
                  contentStyle={{
                    backgroundColor: "#0F3047",
                    border: "none",
                    borderRadius: "12px",
                    color: "white",
                  }}
                  formatter={(value: number, name: string) => [
                    `₹${value}L`,
                    name === "depreciated" ? "Depreciated" : "Book Value",
                  ]}
                />
                <Bar
                  dataKey="depreciated"
                  name="depreciated"
                  fill="#8B5CF6"
                  radius={[0, 4, 4, 0]}
                  barSize={16}
                  cursor="pointer"
                  onClick={(data) =>
                    data?.department && setSelectedDept(data.department)
                  }
                />
                <Bar
                  dataKey="current"
                  name="current"
                  fill="#00B87C"
                  radius={[0, 4, 4, 0]}
                  barSize={16}
                  cursor="pointer"
                  onClick={(data) =>
                    data?.department && setSelectedDept(data.department)
                  }
                />
              </RechartsBarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ─── KPI DETAIL MODAL ─── */}
      <AnimatePresence>
        {activeKPIModal &&
          (() => {
            const modal = KPI_MODAL_CONTENT[activeKPIModal];
            const Icon = modal.icon;
            return (
              <motion.div
                key="kpi-modal"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                onClick={() => setActiveKPIModal(null)}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  transition={{ duration: 0.2 }}
                  onClick={(e) => e.stopPropagation()}
                  className="bg-card border border-border rounded-[32px] w-full max-w-lg max-h-[85vh] overflow-hidden shadow-2xl"
                >
                  <div className="px-8 py-6 border-b border-border flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div
                        className="w-12 h-12 rounded-2xl flex items-center justify-center border-2"
                        style={{
                          backgroundColor: modal.bg,
                          color: modal.color,
                          borderColor: `${modal.color}40`,
                        }}
                      >
                        <Icon size={24} />
                      </div>
                      <div>
                        <h2 className="text-lg font-black text-foreground tracking-tight">
                          {modal.title}
                        </h2>
                        <p className="text-[12px] font-semibold text-muted-foreground">
                          Detailed breakdown
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setActiveKPIModal(null)}
                      className="w-10 h-10 rounded-xl border border-border flex items-center justify-center hover:bg-muted transition-all text-muted-foreground hover:text-foreground"
                    >
                      <X size={18} />
                    </button>
                  </div>
                  <div className="px-8 py-6 space-y-4">
                    {modal.data.map((item, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.2, delay: idx * 0.05 }}
                        className="flex items-center justify-between p-4 rounded-2xl bg-muted/20 border border-border hover:bg-secondary/30 transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="w-2.5 h-2.5 rounded-full shrink-0"
                            style={{ backgroundColor: item.color }}
                          />
                          <span className="text-[13px] font-bold text-foreground">
                            {item.label}
                          </span>
                        </div>
                        <span
                          className="text-[13px] font-black"
                          style={{ color: item.color }}
                        >
                          {item.value}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                  <div className="px-8 py-4 border-t border-border flex items-center justify-between">
                    <p className="text-[11px] font-bold text-muted-foreground">
                      View Only — Read-only data
                    </p>
                    <button
                      onClick={() => {
                        setActiveKPIModal(null);
                        if (activeKPIModal === "replacement") {
                          navigate("/asset-management");
                        }
                      }}
                      className="px-5 py-2 rounded-xl bg-[#8B5CF6] text-white text-[11px] font-bold uppercase tracking-widest hover:bg-[#7C3AED] transition-all shadow-lg shadow-purple-500/20"
                    >
                      {activeKPIModal === "replacement"
                        ? "View Asset Management"
                        : "Close"}
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            );
          })()}
      </AnimatePresence>

      {/* ─── CATEGORY DETAIL MODAL ─── */}
      <AnimatePresence>
        {selectedCategory && selectedCategoryData && selectedDetails && (
          <motion.div
            key="category-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedCategory(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-card border border-border rounded-[32px] w-full max-w-3xl max-h-[85vh] overflow-hidden shadow-2xl"
            >
              <div className="px-8 py-6 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {(() => {
                    const catColor = getCatColor(selectedCategoryData.icon);
                    return (
                      <div
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center border-2 ${catColor}`}
                      >
                        {getCategoryIcon(selectedCategoryData.icon, 24)}
                      </div>
                    );
                  })()}
                  <div>
                    <h2 className="text-lg font-black text-foreground tracking-tight">
                      {selectedCategoryData.category}
                    </h2>
                    <p className="text-[12px] font-semibold text-muted-foreground">
                      {selectedCategoryData.count} assets assigned
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedCategory(null)}
                  className="w-10 h-10 rounded-xl border border-border flex items-center justify-center hover:bg-muted transition-all text-muted-foreground hover:text-foreground"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="px-8 py-4 bg-secondary/10 border-b border-border flex items-center gap-8">
                <div>
                  <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">
                    Total Value
                  </p>
                  <p className="text-sm font-black text-foreground">
                    {formatCurrency(selectedCategoryData.totalValue)}
                  </p>
                </div>
                <div>
                  <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">
                    Annual Depreciation
                  </p>
                  <p className="text-sm font-black text-rose-500">
                    {formatCurrency(selectedCategoryData.annualDepreciation)}
                  </p>
                </div>
                <div>
                  <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">
                    Book Value
                  </p>
                  <p className="text-sm font-black text-[#00B87C]">
                    {formatCurrency(selectedCategoryData.bookValue)}
                  </p>
                </div>
                <div>
                  <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">
                    Status
                  </p>
                  <div className="mt-0.5">
                    {getStatusBadge(selectedCategoryData.status)}
                  </div>
                </div>
              </div>

              <div className="px-8 py-4 overflow-y-auto max-h-[400px]">
                <h4 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest mb-4">
                  Assigned Assets
                </h4>
                <div className="space-y-3">
                  {selectedDetails.items.map((item, idx) => (
                    <div
                      key={idx}
                      onClick={() => {
                        setSelectedCategory(null);
                        navigate("/asset-management");
                      }}
                      className="flex items-center justify-between p-4 rounded-2xl bg-muted/20 border border-border hover:bg-secondary/30 hover:border-[#8B5CF6]/30 transition-all cursor-pointer group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-[#EDE9FE] dark:bg-purple-500/10 flex items-center justify-center group-hover:scale-105 transition-transform">
                          <Package
                            size={18}
                            className="text-[#8B5CF6] dark:text-purple-400"
                          />
                        </div>
                        <div>
                          <p className="text-[13px] font-bold text-foreground">
                            {item.name}
                          </p>
                          <p className="text-[11px] font-medium text-muted-foreground flex items-center gap-2 mt-0.5">
                            <span>{item.employee}</span>
                            <span className="w-1 h-1 rounded-full bg-muted-foreground/40" />
                            <span>{item.dept}</span>
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-[13px] font-black text-foreground">
                          {formatCurrency(item.value)}
                        </p>
                        <p className="text-[11px] font-bold text-muted-foreground">
                          Since {item.purchaseDate}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="px-8 py-4 border-t border-border flex items-center justify-between">
                <p className="text-[11px] font-bold text-muted-foreground flex items-center gap-2">
                  <Eye size={12} />
                  View Only — No modifications allowed
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory(null);
                    navigate("/asset-management");
                  }}
                  className="px-5 py-2 rounded-xl bg-[#8B5CF6] text-white text-[11px] font-bold uppercase tracking-widest hover:bg-[#7C3AED] transition-all shadow-lg shadow-purple-500/20"
                >
                  View All Assets
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── DEPARTMENT DETAIL MODAL ─── */}
      <AnimatePresence>
        {selectedDept && selectedDeptData && (
          <motion.div
            key="dept-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedDept(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-card border border-border rounded-[32px] w-full max-w-lg max-h-[85vh] overflow-hidden shadow-2xl"
            >
              <div className="px-8 py-6 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#EDE9FE] dark:bg-purple-500/10 flex items-center justify-center border-2 border-purple-200 dark:border-purple-500/20">
                    <Building2
                      size={24}
                      className="text-[#8B5CF6] dark:text-purple-400"
                    />
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-foreground tracking-tight">
                      {selectedDept}
                    </h2>
                    <p className="text-[12px] font-semibold text-muted-foreground">
                      Department Asset Overview
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedDept(null)}
                  className="w-10 h-10 rounded-xl border border-border flex items-center justify-center hover:bg-muted transition-all text-muted-foreground hover:text-foreground"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="px-8 py-6 space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-muted/20 border border-border">
                    <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-1">
                      Head Count
                    </p>
                    <p className="text-xl font-black text-foreground">
                      {formatNumber(selectedDeptData.headCount)}
                    </p>
                  </div>
                  <div className="p-4 rounded-2xl bg-muted/20 border border-border">
                    <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-1">
                      Total Assets
                    </p>
                    <p className="text-xl font-black text-foreground">
                      {formatNumber(selectedDeptData.totalAssets)}
                    </p>
                  </div>
                  <div className="p-4 rounded-2xl bg-[#EDE9FE]/30 dark:bg-purple-500/10 border border-[#8B5CF6]/20 dark:border-purple-500/20">
                    <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-1">
                      Total Asset Value
                    </p>
                    <p className="text-xl font-black text-[#8B5CF6] dark:text-purple-400">
                      {formatCurrency(selectedDeptData.totalValue)}
                    </p>
                  </div>
                  <div className="p-4 rounded-2xl bg-muted/20 border border-border">
                    <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-1">
                      Avg Asset Age
                    </p>
                    <p className="text-xl font-black text-amber-500">
                      {selectedDeptData.avgAge} yrs
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl border border-border bg-muted/10">
                  <h4 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest mb-3">
                    Assets per Employee
                  </h4>
                  <div className="flex items-center gap-4">
                    <div className="flex-1 h-3 bg-secondary rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{
                          width: `${Math.min((selectedDeptData.totalAssets / selectedDeptData.headCount) * 10, 100)}%`,
                        }}
                        transition={{ duration: 0.8 }}
                        className="h-full rounded-full"
                        style={{
                          backgroundColor:
                            DEPT_ASSET_DIST_DATA.find(
                              (d) => d.department === selectedDept,
                            )?.color || "#8B5CF6",
                        }}
                      />
                    </div>
                    <span className="text-[11px] font-black text-foreground shrink-0">
                      {(
                        selectedDeptData.totalAssets /
                        selectedDeptData.headCount
                      ).toFixed(1)}{" "}
                      per person
                    </span>
                  </div>
                </div>
              </div>

              <div className="px-8 py-4 border-t border-border flex items-center justify-between">
                <p className="text-[11px] font-bold text-muted-foreground flex items-center gap-2">
                  <Eye size={12} />
                  View Only
                </p>
                <button
                  onClick={() => {
                    setSelectedDept(null);
                    navigate("/departments");
                  }}
                  className="px-5 py-2 rounded-xl bg-[#8B5CF6] text-white text-[11px] font-bold uppercase tracking-widest hover:bg-[#7C3AED] transition-all shadow-lg shadow-purple-500/20"
                >
                  View Department
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
