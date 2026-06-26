import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Package,
  Download,
  CheckCircle2,
  AlertCircle,
  RefreshCcw,
  ChevronRight,
  X,
  Laptop,
  Smartphone,
  Monitor,
  Printer,
  Search,
  Send,
  Calendar,
} from "lucide-react";
import { showToast } from "../../components/workflow/ToastNotification";

type AssetStatus =
  | "Assigned"
  | "Pending Return"
  | "Overdue"
  | "Available"
  | "Maintenance";

interface TeamAsset {
  id: string;
  assetId: string;
  name: string;
  category: string;
  serialNo: string;
  value: string;
  status: AssetStatus;
  assignedDate: string;
  condition: string;
  notes: string;
}

interface TeamMember {
  id: string;
  name: string;
  avatar: string;
  designation: string;
  department: string;
  assets: TeamAsset[];
}

interface PendingRequest {
  id: string;
  employeeName: string;
  employeeAvatar: string;
  assetType: string;
  assetCategory: string;
  reason: string;
  urgency: string;
  submittedDate: string;
}

const TEAM_DATA: TeamMember[] = [
  {
    id: "EMP-0142",
    name: "Arjun Mehta",
    avatar: "https://i.pravatar.cc/150?u=Arjun",
    designation: "Sr Developer",
    department: "Engineering",
    assets: [
      {
        id: "a1",
        assetId: "AST-001",
        name: "MacBook Pro M3",
        category: "Laptop",
        serialNo: "SN-MBP-00123",
        value: "₹1,99,900",
        status: "Assigned",
        assignedDate: "15 Jan 2025",
        condition: "Good",
        notes: "Primary development machine",
      },
      {
        id: "a2",
        assetId: "AST-008",
        name: 'Dell 27" Monitor',
        category: "Monitor",
        serialNo: "SN-MON-0045",
        value: "₹32,500",
        status: "Assigned",
        assignedDate: "15 Jan 2025",
        condition: "Good",
        notes: "External display",
      },
    ],
  },
  {
    id: "EMP-0145",
    name: "Sneha Rao",
    avatar: "https://i.pravatar.cc/150?u=Sneha",
    designation: "Frontend Dev",
    department: "Engineering",
    assets: [
      {
        id: "a3",
        assetId: "AST-002",
        name: "MacBook Pro M2",
        category: "Laptop",
        serialNo: "SN-MBP-00234",
        value: "₹1,49,900",
        status: "Assigned",
        assignedDate: "10 Feb 2025",
        condition: "Excellent",
        notes: "Frontend dev machine",
      },
      {
        id: "a4",
        assetId: "AST-015",
        name: "iPhone 15 Pro",
        category: "Smartphone",
        serialNo: "SN-IPH-0078",
        value: "₹1,34,900",
        status: "Assigned",
        assignedDate: "10 Feb 2025",
        condition: "Excellent",
        notes: "Mobile testing device",
      },
    ],
  },
  {
    id: "EMP-0148",
    name: "Dev Patel",
    avatar: "https://i.pravatar.cc/150?u=Dev",
    designation: "Junior Dev",
    department: "Engineering",
    assets: [
      {
        id: "a5",
        assetId: "AST-003",
        name: "Lenovo ThinkPad X1",
        category: "Laptop",
        serialNo: "SN-LEN-00567",
        value: "₹1,25,000",
        status: "Assigned",
        assignedDate: "01 Mar 2025",
        condition: "Fair",
        notes: "Needs upgrade soon",
      },
    ],
  },
  {
    id: "EMP-0150",
    name: "Leo Martinez",
    avatar: "https://i.pravatar.cc/150?u=Leo",
    designation: "Backend Dev",
    department: "Engineering",
    assets: [
      {
        id: "a6",
        assetId: "AST-004",
        name: "MacBook Pro M3 Max",
        category: "Laptop",
        serialNo: "SN-MBP-00345",
        value: "₹2,49,900",
        status: "Assigned",
        assignedDate: "20 Dec 2024",
        condition: "Excellent",
        notes: "High-performance machine",
      },
      {
        id: "a7",
        assetId: "AST-012",
        name: "Logitech MX Keys",
        category: "Accessories",
        serialNo: "SN-LOG-0023",
        value: "₹12,500",
        status: "Pending Return",
        assignedDate: "20 Dec 2024",
        condition: "Good",
        notes: "Resigned — pending collection",
      },
    ],
  },
  {
    id: "EMP-0152",
    name: "Aisha Khan",
    avatar: "https://i.pravatar.cc/150?u=Aisha",
    designation: "Sr Dev",
    department: "Engineering",
    assets: [
      {
        id: "a8",
        assetId: "AST-005",
        name: "MacBook Pro M3",
        category: "Laptop",
        serialNo: "SN-MBP-00456",
        value: "₹1,99,900",
        status: "Assigned",
        assignedDate: "05 Jan 2025",
        condition: "Excellent",
        notes: "Primary machine",
      },
      {
        id: "a9",
        assetId: "AST-010",
        name: 'Samsung 32" Monitor',
        category: "Monitor",
        serialNo: "SN-MON-0067",
        value: "₹45,000",
        status: "Assigned",
        assignedDate: "05 Jan 2025",
        condition: "Good",
        notes: "Ultrawide display",
      },
      {
        id: "a10",
        assetId: "AST-020",
        name: "HP LaserJet Printer",
        category: "Printer",
        serialNo: "SN-HP-0012",
        value: "₹28,000",
        status: "Assigned",
        assignedDate: "15 Jan 2025",
        condition: "Good",
        notes: "Shared team printer",
      },
    ],
  },
];

const PENDING_REQUESTS: PendingRequest[] = [
  {
    id: "req-1",
    employeeName: "Dev Patel",
    employeeAvatar: "https://i.pravatar.cc/150?u=Dev",
    assetType: "External Monitor",
    assetCategory: "Monitor",
    reason:
      "Need additional screen for development work. Current single monitor setup is affecting productivity.",
    urgency: "High",
    submittedDate: "2 days ago",
  },
  {
    id: "req-2",
    employeeName: "Sneha Rao",
    employeeAvatar: "https://i.pravatar.cc/150?u=Sneha",
    assetType: "Noise-Cancelling Headphones",
    assetCategory: "Accessories",
    reason: "Open office environment is too noisy for focused coding sessions.",
    urgency: "Medium",
    submittedDate: "5 days ago",
  },
];

function getCategoryIcon(category: string, size: number = 18) {
  switch (category) {
    case "Laptop":
      return <Laptop size={size} />;
    case "Smartphone":
      return <Smartphone size={size} />;
    case "Monitor":
      return <Monitor size={size} />;
    case "Printer":
      return <Printer size={size} />;
    default:
      return <Package size={size} />;
  }
}

function getCategoryColor(category: string): {
  bg: string;
  text: string;
  border: string;
} {
  switch (category) {
    case "Laptop":
      return { bg: "#DCFCE7", text: "#00B87C", border: "#A7F3D0" };
    case "Smartphone":
      return { bg: "#EDE9FE", text: "#8B5CF6", border: "#DDD6FE" };
    case "Monitor":
      return { bg: "#E0F2FE", text: "#0EA5E9", border: "#BAE6FD" };
    case "Printer":
      return { bg: "#FEF3C7", text: "#F59E0B", border: "#FDE68A" };
    case "Accessories":
      return { bg: "#FCE7F3", text: "#EC4899", border: "#FBCFE8" };
    default:
      return { bg: "#F3F4F6", text: "#6B7280", border: "#E5E7EB" };
  }
}

function getStatusBadge(status: AssetStatus) {
  switch (status) {
    case "Assigned":
      return (
        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#DCFCE7] text-[#00B87C] border border-[#A7F3D0]">
          <CheckCircle2 size={12} strokeWidth={3} />
          <span className="text-[11px] font-bold uppercase tracking-wider">
            Assigned
          </span>
        </div>
      );
    case "Pending Return":
      return (
        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#FEF3C7] text-[#D97706] border border-[#FDE68A]">
          <RefreshCcw size={12} strokeWidth={3} />
          <span className="text-[11px] font-bold uppercase tracking-wider">
            Pending Return
          </span>
        </div>
      );
    case "Overdue":
      return (
        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#FEE2E2] text-[#DC2626] border border-[#FECACA]">
          <AlertCircle size={12} strokeWidth={3} />
          <span className="text-[11px] font-bold uppercase tracking-wider">
            Overdue
          </span>
        </div>
      );
    default:
      return (
        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border">
          <Package size={12} strokeWidth={3} />
          <span className="text-[11px] font-bold uppercase tracking-wider">
            {status}
          </span>
        </div>
      );
  }
}

export function ManagerTeamAssets() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAsset, setSelectedAsset] = useState<{
    member: TeamMember;
    asset: TeamAsset;
  } | null>(null);
  const [pendingRequests, setPendingRequests] = useState(PENDING_REQUESTS);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestType, setRequestType] = useState("");
  const [requestReason, setRequestReason] = useState("");
  const [requestUrgency, setRequestUrgency] = useState("Medium");

  const allAssets = TEAM_DATA.flatMap((member) =>
    member.assets.map((asset) => ({ ...asset, member })),
  );

  const filteredAssets = allAssets.filter((item) => {
    const q = searchQuery.toLowerCase();
    return (
      item.name.toLowerCase().includes(q) ||
      item.member.name.toLowerCase().includes(q) ||
      item.serialNo.toLowerCase().includes(q) ||
      item.assetId.toLowerCase().includes(q)
    );
  });

  const handleExport = () => {
    const headers = [
      "Asset ID",
      "Asset Name",
      "Category",
      "Serial No",
      "Value",
      "Status",
      "Assigned Date",
      "Condition",
      "Employee ID",
      "Employee Name",
      "Notes",
    ];
    const rows = filteredAssets.map((item) =>
      [
        item.assetId,
        `"${item.name}"`,
        `"${item.category}"`,
        `"${item.serialNo}"`,
        `"${item.value}"`,
        item.status,
        `"${item.assignedDate}"`,
        `"${item.condition}"`,
        item.member.id,
        `"${item.member.name}"`,
        `"${item.notes || ""}"`,
      ].join(","),
    );
    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "team_assets_export.csv";
    a.click();
    URL.revokeObjectURL(url);
    showToast("Exported!", "success", "Team assets report downloaded as CSV.");
  };

  const totalValue = TEAM_DATA.reduce(
    (sum, m) =>
      sum +
      m.assets.reduce((s, a) => {
        const num = parseFloat(a.value.replace(/[₹,]/g, ""));
        return s + (isNaN(num) ? 0 : num);
      }, 0),
    0,
  );

  const formatValue = (val: number) => {
    if (val >= 100000) return `₹${(val / 100000).toFixed(1)}L`;
    if (val >= 1000) return `₹${(val / 1000).toFixed(1)}K`;
    return `₹${val}`;
  };

  const membersWithAssets = TEAM_DATA.filter((m) => m.assets.length > 0).length;
  const pendingReturnCount = allAssets.filter(
    (a) => a.status === "Pending Return",
  ).length;
  const assetCount = allAssets.length;

  const handleApproveRequest = (id: string) => {
    setPendingRequests((prev) => prev.filter((r) => r.id !== id));
  };

  const handleRejectRequest = (id: string) => {
    setPendingRequests((prev) => prev.filter((r) => r.id !== id));
  };

  const handleTeamRequest = () => {
    setShowRequestModal(true);
  };

  const submitTeamRequest = () => {
    setShowRequestModal(false);
    setRequestType("");
    setRequestReason("");
    setRequestUrgency("Medium");
  };

  return (
    <div className="p-8 max-w-[1600px] mx-auto min-h-screen">
      {/* PAGE HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-[10px] bg-[#E0F2FE] flex items-center justify-center text-[#0EA5E9] shadow-sm border border-[#0EA5E9]/10">
            <Package size={22} />
          </div>
          <div>
            <h1 className="text-[26px] font-bold text-foreground tracking-tight">
              Team Assets
            </h1>
            <p className="text-[13px] text-[#6B7280] flex items-center gap-2">
              Engineering team asset overview
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleTeamRequest}
            className="px-5 py-2.5 rounded-xl border border-border bg-card text-sm font-bold text-foreground hover:bg-secondary transition-all shadow-sm flex items-center gap-2"
          >
            <Package size={16} />
            Request for Team
          </button>
          <button
            onClick={handleExport}
            className="px-5 py-2.5 rounded-xl border border-border bg-card text-sm font-bold text-foreground hover:bg-secondary transition-all shadow-sm flex items-center gap-2"
          >
            <Download size={16} />
            Export
          </button>
        </div>
      </div>

      {/* INFO BAR */}
      <div className="flex flex-wrap items-center gap-6 mb-6 px-5 py-3 bg-card border border-border rounded-2xl shadow-sm">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#00B87C]" />
          <span className="text-[13px] font-bold text-foreground">
            {membersWithAssets} team members have assets
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#F59E0B]" />
          <span className="text-[13px] font-bold text-foreground">
            {pendingReturnCount} pending return
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#0EA5E9]" />
          <span className="text-[13px] font-bold text-foreground">
            {pendingRequests.length} asset request
            {pendingRequests.length !== 1 ? "s" : ""} pending
          </span>
        </div>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
          <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-3">
            Team Assets
          </p>
          <div className="flex items-end gap-3">
            <p className="text-[28px] font-bold text-[#0EA5E9] leading-none">
              {assetCount}
            </p>
            <p className="text-[13px] font-bold text-[#0EA5E9]/70 mb-1">
              total assets
            </p>
          </div>
        </div>
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
          <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-3">
            Total Value
          </p>
          <div className="flex items-end gap-3">
            <p className="text-[28px] font-bold text-[#8B5CF6] leading-none">
              {formatValue(totalValue)}
            </p>
            <p className="text-[13px] font-bold text-[#8B5CF6]/70 mb-1">
              total worth
            </p>
          </div>
        </div>
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
          <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-3">
            Pending Requests
          </p>
          <div className="flex items-end gap-3">
            <p className="text-[28px] font-bold text-[#F59E0B] leading-none">
              {pendingRequests.length}
            </p>
            <p className="text-[13px] font-bold text-[#F59E0B]/70 mb-1">
              awaiting review
            </p>
          </div>
        </div>
      </div>

      {/* SEARCH BAR */}
      <div className="mb-6">
        <div className="relative w-full sm:w-96">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
            size={18}
          />
          <input
            type="text"
            placeholder="Search by asset, employee, or serial..."
            className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-border bg-card text-sm font-medium focus:ring-2 focus:ring-[#00B87C]/20 outline-none transition-all shadow-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* TEAM ASSETS TABLE */}
      <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden mb-8">
        <div className="px-6 py-4 border-b border-border bg-secondary/10">
          <h3 className="text-[11px] font-bold text-muted-foreground uppercase tracking-[0.2em]">
            Team Assets Inventory
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-secondary/20">
                <th className="px-6 py-4 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                  Employee
                </th>
                <th className="px-6 py-4 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                  Asset Name
                </th>
                <th className="px-6 py-4 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-4 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                  Serial No
                </th>
                <th className="px-6 py-4 text-[11px] font-bold text-muted-foreground uppercase tracking-wider text-right">
                  Value
                </th>
                <th className="px-6 py-4 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-[11px] font-bold text-muted-foreground uppercase tracking-wider text-right">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredAssets.map((item) => {
                const catColor = getCategoryColor(item.category);
                return (
                  <tr
                    key={item.id}
                    className="hover:bg-[#00B87C]/[0.08] transition-colors h-16 group"
                  >
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl overflow-hidden shrink-0 border border-border">
                          <img
                            src={item.member.avatar}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[14px] font-bold text-foreground truncate">
                            {item.member.name}
                          </p>
                          <p className="text-[11px] font-bold text-muted-foreground">
                            #{item.member.id}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-3">
                      <div
                        className="flex items-center gap-3 cursor-pointer"
                        onClick={() =>
                          setSelectedAsset({ member: item.member, asset: item })
                        }
                      >
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border"
                          style={{
                            backgroundColor: catColor.bg,
                            color: catColor.text,
                            borderColor: catColor.border,
                          }}
                        >
                          {getCategoryIcon(item.category, 16)}
                        </div>
                        <div>
                          <p className="text-[13px] font-bold text-foreground group-hover:text-[#00B87C] transition-colors">
                            {item.name}
                          </p>
                          <p className="text-[11px] font-medium text-muted-foreground">
                            {item.assetId}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-3">
                      <span className="text-[13px] font-bold text-muted-foreground">
                        {item.category}
                      </span>
                    </td>
                    <td className="px-6 py-3">
                      <span className="text-[13px] font-mono font-bold text-foreground">
                        {item.serialNo}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-right">
                      <span className="text-[13px] font-bold text-foreground">
                        {item.value}
                      </span>
                    </td>
                    <td className="px-6 py-3">{getStatusBadge(item.status)}</td>
                    <td className="px-6 py-3 text-right">
                      <button
                        onClick={() =>
                          setSelectedAsset({ member: item.member, asset: item })
                        }
                        className="text-[11px] font-bold text-[#00B87C] uppercase tracking-wider flex items-center gap-1 ml-auto hover:gap-2 transition-all"
                      >
                        View <ChevronRight size={14} />
                      </button>
                    </td>
                  </tr>
                );
              })}
              {filteredAssets.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Package size={32} className="text-muted-foreground/40" />
                      <p className="text-sm font-bold text-muted-foreground">
                        No assets found matching your search
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* PENDING ASSET REQUESTS SECTION */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold text-foreground">
              Pending Asset Requests
            </h2>
            <p className="text-[13px] font-bold text-muted-foreground mt-1">
              Review and approve team asset requests
            </p>
          </div>
        </div>

        {pendingRequests.length === 0 ? (
          <div className="bg-card border border-dashed border-border rounded-2xl p-10 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-500 mb-4">
              <CheckCircle2 size={32} />
            </div>
            <h3 className="text-lg font-bold text-foreground">
              All caught up!
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              There are no pending asset requests to review.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            {pendingRequests.map((req) => (
              <div
                key={req.id}
                className="bg-card border border-border rounded-xl p-5 shadow-sm border-l-4 border-l-[#0EA5E9] flex flex-col hover:-translate-y-[2px] hover:border-[#00B87C] hover:shadow-[0_0_15px_rgba(0,184,124,0.3)] transition-shadow"
              >
                {/* Top Row */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={req.employeeAvatar}
                      alt={req.employeeName}
                      className="w-9 h-9 rounded-full border border-border object-cover"
                    />
                    <div>
                      <p className="text-[14px] font-bold text-foreground">
                        {req.employeeName}
                      </p>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-[#E0F2FE] text-[#0EA5E9] border border-[#BAE6FD]">
                        <Package size={10} /> {req.assetType}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider ${
                        req.urgency === "High"
                          ? "bg-red-50 text-red-600 border border-red-200"
                          : "bg-amber-50 text-amber-600 border border-amber-200"
                      }`}
                    >
                      {req.urgency}
                    </span>
                    <span className="text-xs font-semibold text-muted-foreground">
                      {req.submittedDate}
                    </span>
                  </div>
                </div>

                {/* Reason */}
                <div className="mb-4 bg-secondary/50 p-3 rounded-lg border border-border/50 flex-1">
                  <p className="text-sm text-muted-foreground italic flex items-start gap-2">
                    <span className="font-serif text-xl leading-none text-muted-foreground/40">
                      "
                    </span>
                    {req.reason}
                    <span className="font-serif text-xl leading-none text-muted-foreground/40 translate-y-2">
                      "
                    </span>
                  </p>
                </div>

                {/* Actions */}
                <div className="mt-auto pt-4 border-t border-border flex items-center justify-end gap-3">
                  <button
                    onClick={() => handleRejectRequest(req.id)}
                    className="px-5 py-2 text-sm font-bold text-rose-600 bg-white dark:bg-zinc-900 border border-rose-200 dark:border-rose-900/50 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors active:scale-95"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => handleApproveRequest(req.id)}
                    className="px-5 py-2 text-sm font-bold text-white bg-[#00B87C] rounded-xl hover:bg-[#00a36d] shadow-sm transition-colors active:scale-95"
                  >
                    Approve
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ASSET DETAIL SLIDE-OUT PANEL */}
      <AnimatePresence>
        {selectedAsset && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedAsset(null)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[2100]"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-screen w-full max-w-[420px] bg-card border-l border-border z-[2200] shadow-2xl flex flex-col"
            >
              {/* Header */}
              <div className="p-6 border-b border-border flex items-center justify-between">
                <h2 className="text-base font-bold text-foreground uppercase tracking-wider">
                  Asset Details
                </h2>
                <button
                  onClick={() => setSelectedAsset(null)}
                  className="p-2 rounded-xl hover:bg-secondary text-muted-foreground transition-all"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Asset Icon */}
              <div className="p-8 pb-0 text-center flex flex-col items-center">
                <div
                  className="w-20 h-20 rounded-2xl flex items-center justify-center border-4 border-[#00B87C]/10 mb-4"
                  style={{
                    backgroundColor: getCategoryColor(
                      selectedAsset.asset.category,
                    ).bg,
                    color: getCategoryColor(selectedAsset.asset.category).text,
                    borderColor: getCategoryColor(selectedAsset.asset.category)
                      .border,
                  }}
                >
                  {getCategoryIcon(selectedAsset.asset.category, 36)}
                </div>
                <h3 className="text-xl font-bold text-foreground">
                  {selectedAsset.asset.name}
                </h3>
                <p className="text-sm font-bold text-[#00B87C] uppercase tracking-wider mt-1">
                  {selectedAsset.asset.assetId}
                </p>
                <div className="flex items-center gap-3 mt-4 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                  <span>{selectedAsset.asset.category}</span>
                  <span className="w-1 h-1 rounded-full bg-border" />
                  <span>{selectedAsset.member.department}</span>
                </div>
                <div className="mt-4">
                  {getStatusBadge(selectedAsset.asset.status)}
                </div>
              </div>

              {/* Assignee Info */}
              <div className="px-6 mt-6">
                <div className="bg-secondary/30 border border-border rounded-2xl p-4 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl overflow-hidden border border-border">
                    <img
                      src={selectedAsset.member.avatar}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground">
                      Assigned to
                    </p>
                    <p className="text-[13px] font-bold text-muted-foreground">
                      {selectedAsset.member.name}
                    </p>
                    <p className="text-[11px] font-medium text-muted-foreground">
                      {selectedAsset.member.designation}
                    </p>
                  </div>
                </div>
              </div>

              {/* Details */}
              <div className="flex-1 overflow-y-auto p-6 no-scrollbar">
                <div className="space-y-5">
                  <div className="grid grid-cols-2 gap-y-5 gap-x-4">
                    <div>
                      <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
                        Serial Number
                      </p>
                      <p className="text-sm font-mono font-bold text-foreground">
                        {selectedAsset.asset.serialNo}
                      </p>
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
                        Value
                      </p>
                      <p className="text-sm font-bold text-foreground">
                        {selectedAsset.asset.value}
                      </p>
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
                        Assigned Since
                      </p>
                      <p className="text-sm font-bold text-foreground">
                        {selectedAsset.asset.assignedDate}
                      </p>
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
                        Condition
                      </p>
                      <p className="text-sm font-bold text-foreground">
                        {selectedAsset.asset.condition}
                      </p>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-secondary/30 border border-border">
                    <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-2">
                      Notes
                    </p>
                    <p className="text-sm font-bold text-foreground">
                      {selectedAsset.asset.notes}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-[11px] font-bold text-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                      <Calendar size={14} className="text-[#00B87C]" />{" "}
                      Assignment Timeline
                    </h4>
                    <div className="space-y-4 ml-2 border-l border-border pl-4">
                      <div className="relative">
                        <div className="absolute -left-[21px] top-1 w-2 h-2 rounded-full bg-[#00B87C] ring-4 ring-card" />
                        <p className="text-xs font-bold text-foreground">
                          Assigned to {selectedAsset.member.name}
                        </p>
                        <p className="text-[11px] text-muted-foreground mt-0.5">
                          {selectedAsset.asset.assignedDate}
                        </p>
                      </div>
                      <div className="relative">
                        <div className="absolute -left-[21px] top-1 w-2 h-2 rounded-full bg-muted-foreground/30 ring-4 ring-card" />
                        <p className="text-xs font-bold text-muted-foreground">
                          Previous: IT Department
                        </p>
                        <p className="text-[11px] text-muted-foreground mt-0.5">
                          15 Dec 2024 — 14 Jan 2025
                        </p>
                      </div>
                      <div className="relative">
                        <div className="absolute -left-[21px] top-1 w-2 h-2 rounded-full bg-muted-foreground/30 ring-4 ring-card" />
                        <p className="text-xs font-bold text-muted-foreground">
                          Procured
                        </p>
                        <p className="text-[11px] text-muted-foreground mt-0.5">
                          01 Dec 2024
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-border bg-secondary/5">
                <button
                  onClick={() => setSelectedAsset(null)}
                  className="w-full py-3.5 rounded-2xl bg-[#00B87C] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-lg shadow-[#00B87C]/20"
                >
                  Close Details <X size={16} />
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* REQUEST FOR TEAM MODAL */}
      <AnimatePresence>
        {showRequestModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowRequestModal(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[2000]"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-0 z-[2000] flex items-center justify-center p-4 pointer-events-none"
            >
              <motion.div
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-[480px] bg-card rounded-[32px] shadow-2xl border border-border overflow-hidden pointer-events-auto"
              >
                {/* Header */}
                <div className="px-6 py-5 border-b border-border flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-[10px] bg-[#E0F2FE] flex items-center justify-center text-[#0EA5E9]">
                      <Package size={20} />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-foreground">
                        Request Asset for Team
                      </h3>
                      <p className="text-[11px] font-bold text-muted-foreground">
                        Submit a new asset request
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowRequestModal(false)}
                    className="p-2 rounded-xl hover:bg-secondary text-muted-foreground transition-all"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-5">
                  <div>
                    <label className="block text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-2">
                      Asset Type
                    </label>
                    <select
                      value={requestType}
                      onChange={(e) => setRequestType(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm font-bold outline-none focus:ring-2 focus:ring-[#00B87C]/20 transition-all"
                    >
                      <option value="">Select asset type...</option>
                      <option value="Laptop">Laptop</option>
                      <option value="Monitor">Monitor</option>
                      <option value="Smartphone">Smartphone</option>
                      <option value="Printer">Printer</option>
                      <option value="Accessories">Accessories</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-2">
                      Urgency
                    </label>
                    <div className="flex gap-2">
                      {["Low", "Medium", "High"].map((u) => (
                        <button
                          key={u}
                          onClick={() => setRequestUrgency(u)}
                          className={`px-4 py-2 text-xs font-bold rounded-xl border transition-all ${
                            requestUrgency === u
                              ? u === "High"
                                ? "bg-red-50 text-red-600 border-red-200"
                                : u === "Medium"
                                  ? "bg-amber-50 text-amber-600 border-amber-200"
                                  : "bg-blue-50 text-blue-600 border-blue-200"
                              : "bg-background text-muted-foreground border-border hover:bg-secondary"
                          }`}
                        >
                          {u}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-2">
                      Reason for Request
                    </label>
                    <textarea
                      value={requestReason}
                      onChange={(e) => setRequestReason(e.target.value)}
                      placeholder="Explain why this asset is needed..."
                      className="w-full h-28 p-3 text-sm bg-background border border-border rounded-xl focus:ring-2 focus:ring-[#00B87C]/20 outline-none resize-none"
                    />
                  </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-border bg-secondary/5 flex items-center justify-end gap-3">
                  <button
                    onClick={() => setShowRequestModal(false)}
                    className="px-5 py-2.5 text-sm font-bold text-muted-foreground border border-border bg-background rounded-xl hover:bg-secondary transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={submitTeamRequest}
                    disabled={!requestType || !requestReason}
                    className="px-6 py-2.5 text-sm font-bold text-white bg-[#00B87C] rounded-xl hover:bg-[#00a36d] shadow-lg shadow-emerald-500/20 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send size={16} className="inline mr-1.5" />
                    Submit Request
                  </button>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
