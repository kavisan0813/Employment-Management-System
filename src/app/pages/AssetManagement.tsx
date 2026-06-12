import React, { useState } from "react";
import {
  Package,
  Download,
  Plus,
  CheckCircle2,
  RefreshCcw,
  AlertCircle,
  IndianRupee,
  Wrench,
  Search,
  ChevronDown,
  RotateCcw,
  Laptop,
  Smartphone,
  Monitor,
  Car,
  ChevronRight,
  X,
  UploadCloud,
  FileText,
  Calendar,
  MoreVertical,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
  PieChart,
  Pie
} from "recharts";

// Interfaces
interface Asset {
  id: string;
  name: string;
  assetId: string;
  category: "Laptop" | "Smartphone" | "Monitor" | "Vehicle" | "Other";
  serialNo: string;
  assignedTo: string | null;
  assignedToResigned: boolean;
  department: string | null;
  value: number;
  assignedDate: string | null;
  status:
    | "Assigned"
    | "Pending Return"
    | "Overdue"
    | "Available"
    | "Maintenance";
}

const MOCK_ASSETS: Asset[] = [
  {
    id: "1",
    name: "Dell XPS 15 (2024)",
    assetId: "AST-0421",
    category: "Laptop",
    serialNo: "SN-DL2024-421",
    assignedTo: "Arjun Mehta",
    assignedToResigned: false,
    department: "Engineering",
    value: 120000,
    assignedDate: "Mar 15, 2021",
    status: "Assigned",
  },
  {
    id: "2",
    name: "iPhone 14 Pro",
    assetId: "AST-0422",
    category: "Smartphone",
    serialNo: "SN-IP14-088",
    assignedTo: "Priya Sharma",
    assignedToResigned: false,
    department: "Product",
    value: 80000,
    assignedDate: "Jun 10, 2023",
    status: "Assigned",
  },
  {
    id: "3",
    name: "Dell Latitude 7420",
    assetId: "AST-0423",
    category: "Laptop",
    serialNo: "SN-DL-399",
    assignedTo: "James Carter",
    assignedToResigned: true,
    department: "Finance",
    value: 95000,
    assignedDate: "Jan 5, 2022",
    status: "Pending Return",
  },
  {
    id: "4",
    name: "MacBook Pro M2",
    assetId: "AST-0424",
    category: "Laptop",
    serialNo: "SN-MB-201",
    assignedTo: "Ravi Kumar",
    assignedToResigned: true,
    department: "Marketing",
    value: 150000,
    assignedDate: "Apr 1, 2023",
    status: "Overdue",
  },
  {
    id: "5",
    name: "LG 4K 27inch",
    assetId: "AST-0425",
    category: "Monitor",
    serialNo: "SN-LG-542",
    assignedTo: null,
    assignedToResigned: false,
    department: null,
    value: 35000,
    assignedDate: null,
    status: "Available",
  },
  {
    id: "6",
    name: "Honda City (MH01-AB-1234)",
    assetId: "AST-0426",
    category: "Vehicle",
    serialNo: "VH-2021-001",
    assignedTo: "Fleet Dept",
    assignedToResigned: false,
    department: "Operations",
    value: 850000,
    assignedDate: "Sep 12, 2021",
    status: "Maintenance",
  },
];

export function AssetManagement() {
  const [activeTab, setActiveTab] = useState("All Assets");
  const [searchQuery, setSearchQuery] = useState("");
  const [assets, setAssets] = useState<Asset[]>(MOCK_ASSETS);

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isRecoverModalOpen, setIsRecoverModalOpen] = useState(false);
  const [isEscalationModalOpen, setIsEscalationModalOpen] = useState(false);

  // Selected Asset for Modals
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);

  // Detail Slide Panel State
  const [isDetailPanelOpen, setIsDetailPanelOpen] = useState(false);
  const [detailTab, setDetailTab] = useState("Details");

  // Form States
  const [recoverCondition, setRecoverCondition] = useState("Excellent");
  const [assignCondition, setAssignCondition] = useState("New");

  // Filter Dropdown States
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [deptFilter, setDeptFilter] = useState<string>("All");
  const [statusFilter, setStatusFilter] = useState<string>("All");

  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [deptDropdownOpen, setDeptDropdownOpen] = useState(false);
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);

  // Add Asset Form States
  const [newAssetName, setNewAssetName] = useState("");
  const [newAssetCategory, setNewAssetCategory] = useState<"Laptop" | "Smartphone" | "Monitor" | "Vehicle" | "Other">("Laptop");
  const [newAssetSerialNo, setNewAssetSerialNo] = useState("");
  const [newAssetBrand, setNewAssetBrand] = useState("");
  const [newAssetValue, setNewAssetValue] = useState("");
  const [newAssetPurchaseDate, setNewAssetPurchaseDate] = useState("");
  const [newAssetWarrantyExpiry, setNewAssetWarrantyExpiry] = useState("");
  const [newAssetVendor, setNewAssetVendor] = useState("");
  const [newAssetLocation, setNewAssetLocation] = useState("");
  const [newAssetNotes, setNewAssetNotes] = useState("");
  const [newAssetAssignEmployee, setNewAssetAssignEmployee] = useState("");
  const [newAssetAssignDate, setNewAssetAssignDate] = useState(new Date().toISOString().split('T')[0]);

  // Assign Asset Form States
  const [assignEmployee, setAssignEmployee] = useState("");
  const [assignDept, setAssignDept] = useState("Engineering");
  const [assignDate, setAssignDate] = useState(new Date().toISOString().split('T')[0]);
  const [expectedReturnDate, setExpectedReturnDate] = useState("");
  const [assignNotes, setAssignNotes] = useState("");

  // Recover Asset Form States
  const [recoverDate, setRecoverDate] = useState(new Date().toISOString().split('T')[0]);
  const [recoverNotes, setRecoverNotes] = useState("");
  const [damageDescription, setDamageDescription] = useState("");
  const [repairCostEstimate, setRepairCostEstimate] = useState("");
  const [deductFromEmployee, setDeductFromEmployee] = useState(false);
  const [policeReportNumber, setPoliceReportNumber] = useState("");
  const [firAttached, setFirAttached] = useState(false);
  const [replacementRequired, setReplacementRequired] = useState(true);

  // Dynamic Asset Log States (assetId -> logs array)
  const [maintenanceLogs, setMaintenanceLogs] = useState<Record<string, Array<{title: string, cost: number, desc: string, date: string, status: string}>>>({
    "AST-0421": [
      { title: "Battery Replacement", cost: 4500, desc: "Replaced swollen battery with OEM part.", date: "Sep 10, 2022", status: "Completed" }
    ]
  });
  const [assetDocuments, setAssetDocuments] = useState<Record<string, Array<{name: string, size: string, date: string}>>>({
    "AST-0421": [
      { name: "Purchase_Invoice_2021.pdf", size: "1.2 MB", date: "Jan 10, 2021" },
      { name: "Warranty_Card_Dell.pdf", size: "850 KB", date: "Jan 10, 2021" }
    ]
  });

  // Maintenance form inputs
  const [newMaintenanceTitle, setNewMaintenanceTitle] = useState("");
  const [newMaintenanceCost, setNewMaintenanceCost] = useState("");
  const [newMaintenanceDesc, setNewMaintenanceDesc] = useState("");
  const [isAddingLog, setIsAddingLog] = useState(false);

  const tabs = ["All Assets", "Assigned", "Available", "Pending Return", "Maintenance", "Reports"];

  const filteredAssets = assets.filter((asset) => {
    if (activeTab !== "All Assets" && activeTab !== "Reports") {
      if (activeTab === "Assigned" && asset.status !== "Assigned") return false;
      if (activeTab === "Available" && asset.status !== "Available") return false;
      if (activeTab === "Pending Return" && asset.status !== "Pending Return" && asset.status !== "Overdue") return false;
      if (activeTab === "Maintenance" && asset.status !== "Maintenance") return false;
    }

    if (categoryFilter !== "All" && asset.category !== categoryFilter) return false;

    if (deptFilter !== "All" && asset.department !== deptFilter) return false;

    if (statusFilter !== "All" && asset.status !== statusFilter) return false;
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        asset.name.toLowerCase().includes(query) ||
        asset.serialNo.toLowerCase().includes(query) ||
        asset.assetId.toLowerCase().includes(query) ||
        (asset.assignedTo && asset.assignedTo.toLowerCase().includes(query))
      );
    }

    return true;
  });

  const getCategoryIcon = (category: string, size = 16) => {
    switch (category) {
      case "Laptop":
        return <Laptop size={size} />;
      case "Smartphone":
        return <Smartphone size={size} />;
      case "Monitor":
        return <Monitor size={size} />;
      case "Vehicle":
        return <Car size={size} />;
      default:
        return <Package size={size} />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Laptop":
        return { bg: "#CCFBF1", text: "#0F766E", border: "#99F6E4" };
      case "Smartphone":
        return { bg: "#FEF3C7", text: "#D97706", border: "#FDE68A" };
      case "Monitor":
        return { bg: "#E0F2FE", text: "#0369A1", border: "#BAE6FD" };
      case "Vehicle":
        return { bg: "#F3E8FF", text: "#7E22CE", border: "#E9D5FF" };
      default:
        return { bg: "#F3F4F6", text: "#4B5563", border: "#E5E7EB" };
    }
  };

  const openAssignModal = (asset: Asset) => {
    setSelectedAsset(asset);
    setAssignCondition("New");
    setIsAssignModalOpen(true);
  };

  const openRecoverModal = (asset: Asset) => {
    setSelectedAsset(asset);
    setRecoverCondition("Excellent");
    setIsRecoverModalOpen(true);
  };

  const openEscalationModal = (asset: Asset) => {
    setSelectedAsset(asset);
    setIsEscalationModalOpen(true);
  };

  const openDetailPanel = (asset: Asset) => {
    setSelectedAsset(asset);
    setDetailTab("Details");
    setIsDetailPanelOpen(true);
  };

  const handleExport = () => {
    toast.success("Exporting assets to CSV...");
    setTimeout(() => {
      toast.success("Export complete");
    }, 1500);
  };

  const handleAddAsset = (e: React.FormEvent) => {
    e.preventDefault();
    const nextIdVal = 421 + assets.length;
    const nextAssetId = `AST-0${nextIdVal}`;
    const newVal = parseFloat(newAssetValue) || 0;

    const newAsset: Asset = {
      id: String(assets.length + 1),
      name: newAssetName || "New Company Asset",
      assetId: nextAssetId,
      category: newAssetCategory,
      serialNo: newAssetSerialNo || `SN-MOCK-${nextIdVal}`,
      assignedTo: newAssetAssignEmployee || null,
      assignedToResigned: false,
      department: newAssetAssignEmployee ? "Engineering" : null,
      value: newVal,
      assignedDate: newAssetAssignEmployee ? newAssetAssignDate : null,
      status: newAssetAssignEmployee ? "Assigned" : "Available",
    };

    setAssets([...assets, newAsset]);
    setIsAddModalOpen(false);
    toast.success(`Asset ${nextAssetId} added successfully`);
    
    // Clear states
    setNewAssetName("");
    setNewAssetCategory("Laptop");
    setNewAssetSerialNo("");
    setNewAssetBrand("");
    setNewAssetValue("");
    setNewAssetPurchaseDate("");
    setNewAssetWarrantyExpiry("");
    setNewAssetVendor("");
    setNewAssetLocation("");
    setNewAssetNotes("");
    setNewAssetAssignEmployee("");
  };

  const handleAssignAsset = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAssignModalOpen(false);
    toast.success(
      `Asset assigned successfully to employee. Notification sent.`,
    );

    if (selectedAsset) {
      setAssets(assets.map(a => 
        a.id === selectedAsset.id 
          ? { 
              ...a, 
              status: "Assigned", 
              assignedTo: assignEmployee || "New Employee", 
              department: assignDept || "Engineering", 
              assignedDate: assignDate || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
            } 
          : a
      ));
    }

    // Reset fields
    setAssignEmployee("");
    setAssignDept("Engineering");
    setAssignDate(new Date().toISOString().split('T')[0]);
    setExpectedReturnDate("");
    setAssignNotes("");
  };

  const handleRecoverAsset = (e: React.FormEvent) => {
    e.preventDefault();
    setIsRecoverModalOpen(false);
    toast.success(`Asset recovered successfully.`);

    if (selectedAsset) {
      const isDamaged = recoverCondition === "Damaged";
      const isLost = recoverCondition === "Lost";
      const newStatus = isDamaged ? "Maintenance" : (isLost ? "Maintenance" : "Available");

      setAssets(assets.map(a => 
        a.id === selectedAsset.id 
          ? { 
              ...a, 
              status: newStatus as Asset["status"], 
              assignedTo: null, 
              department: null, 
              assignedDate: null, 
              assignedToResigned: false 
            } 
          : a
      ));
    }

    if (isDetailPanelOpen) {
      setIsDetailPanelOpen(false);
    }

    // Reset fields
    setRecoverDate(new Date().toISOString().split('T')[0]);
    setRecoverNotes("");
    setDamageDescription("");
    setRepairCostEstimate("");
    setDeductFromEmployee(false);
    setPoliceReportNumber("");
    setFirAttached(false);
    setReplacementRequired(true);
  };

  // Dynamic stats calculation
  const totalAssetsCount = 1284 + (assets.length - 6);
  const assignedCount = 1198 + (assets.filter(a => a.status === "Assigned").length - 2);
  const pendingReturnCount = 23 + (assets.filter(a => a.status === "Pending Return").length - 1);
  const overdueCount = 4 + (assets.filter(a => a.status === "Overdue").length - 1);
  const maintenanceCount = 12 + (assets.filter(a => a.status === "Maintenance").length - 1);
  
  const totalValueSum = assets.reduce((sum, a) => sum + a.value, 0);
  const orgTotalValue = (2.4 + (totalValueSum - 1330000) / 10000000).toFixed(2);

  // Reports dashboard computations
  const categoryCounts = assets.reduce((acc, a) => {
    acc[a.category] = (acc[a.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const categoryChartData = Object.entries(categoryCounts).map(([name, value]) => ({
    name,
    value
  }));

  const deptValues = assets.reduce((acc, a) => {
    const dept = a.department || "Unassigned";
    acc[dept] = (acc[dept] || 0) + a.value;
    return acc;
  }, {} as Record<string, number>);
  const deptChartData = Object.entries(deptValues).map(([name, value]) => ({
    name,
    value: Math.round(value)
  }));

  const statusCounts = assets.reduce((acc, a) => {
    acc[a.status] = (acc[a.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const statusChartData = Object.entries(statusCounts).map(([name, value]) => ({
    name,
    value
  }));

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Page Header */}
      <div className="px-8 pt-8 pb-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-[10px] bg-[#E0F2FE] flex items-center justify-center border border-[#BAE6FD]">
              <Package size={22} className="text-[#0EA5E9]" />
            </div>
            <div>
              <h1 className="text-[26px] font-bold text-foreground tracking-tight leading-none mb-1">
                Asset Management
              </h1>
              <p className="text-[13px] text-muted-foreground font-medium">
                Assign, track and recover company assets
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 bg-card border border-border text-foreground rounded-xl font-semibold text-[13px] hover:bg-muted transition-colors shadow-sm"
            >
              <Download size={16} />
              Export
            </button>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[#00B87C] text-white rounded-xl font-bold text-[13px] hover:bg-[#009665] transition-all shadow-sm hover:shadow active:scale-[0.98]"
            >
              <Plus size={16} strokeWidth={3} />
              Add Asset
            </button>
          </div>
        </div>

        {/* Info Bar */}
        <div className="bg-secondary border border-[#A7F3D0] rounded-xl px-4 py-2.5 flex items-center gap-6 mb-6">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#10B981]" />
            <span className="text-[13px] font-medium text-[#065F46]">
              <strong className="font-bold text-[#047857]">{totalAssetsCount.toLocaleString('en-IN')}</strong> assets tracked across organization
            </span>
          </div>
          <div className="w-px h-4 bg-[#6EE7B7]" />
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#F59E0B]" />
            <span className="text-[13px] font-medium text-[#92400E]">
              <strong className="font-bold text-[#B45309]">{pendingReturnCount}</strong> assets pending return
            </span>
          </div>
          <div className="w-px h-4 bg-[#6EE7B7]" />
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#EF4444]" />
            <span className="text-[13px] font-medium text-[#991B1B]">
              <strong className="font-bold text-[#B91C1C]">{overdueCount}</strong> assets overdue recovery — exit employees
            </span>
          </div>
        </div>

        {/* KPI Cards Row */}
        <div className="grid grid-cols-6 gap-4 mb-8">
          {[
            {
              icon: Package,
              label: "TOTAL ASSETS",
              value: totalAssetsCount.toLocaleString('en-IN'),
              subtext: "Across all categories",
              bg: "#E0F2FE",
              color: "#0EA5E9",
              valColor: "#0EA5E9",
            },
            {
              icon: CheckCircle2,
              label: "ASSIGNED",
              value: assignedCount.toLocaleString('en-IN'),
              subtext: `to ${assignedCount.toLocaleString('en-IN')} employees`,
              bg: "#DCFCE7",
              color: "#00B87C",
              valColor: "#00B87C",
            },
            {
              icon: RefreshCcw,
              label: "PENDING RETURN",
              value: pendingReturnCount.toString(),
              subtext: "from exiting employees",
              bg: "#FEF3C7",
              color: "#F59E0B",
              valColor: "#F59E0B",
            },
            {
              icon: AlertCircle,
              label: "OVERDUE RECOVERY",
              value: overdueCount.toString(),
              subtext: "assets not returned",
              bg: "#FEE2E2",
              color: "#EF4444",
              valColor: "#EF4444",
            },
            {
              icon: IndianRupee,
              label: "TOTAL ASSET VALUE",
              value: `₹${orgTotalValue}Cr`,
              subtext: "book value FY 2025-26",
              bg: "#EDE9FE",
              color: "#8B5CF6",
              valColor: "#8B5CF6",
            },
            {
              icon: Wrench,
              label: "IN MAINTENANCE",
              value: maintenanceCount.toString(),
              subtext: "sent for repair/service",
              bg: "#F3F4F6",
              color: "#6B7280",
              valColor: "#4B5563",
            },
          ].map((kpi, idx) => (
            <div 
              key={idx} 
              onClick={() => {
                if (kpi.label === "TOTAL ASSETS") {
                  setActiveTab("All Assets");
                  setCategoryFilter("All");
                  setDeptFilter("All");
                  setStatusFilter("All");
                } else if (kpi.label === "ASSIGNED") {
                  setActiveTab("Assigned");
                  setStatusFilter("All");
                } else if (kpi.label === "PENDING RETURN") {
                  setActiveTab("Pending Return");
                  setStatusFilter("Pending Return");
                } else if (kpi.label === "OVERDUE RECOVERY") {
                  setActiveTab("Pending Return");
                  setStatusFilter("Overdue");
                } else if (kpi.label === "TOTAL ASSET VALUE") {
                  setActiveTab("Reports");
                } else if (kpi.label === "IN MAINTENANCE") {
                  setActiveTab("Maintenance");
                  setStatusFilter("All");
                }
              }}
              className="bg-card rounded-2xl p-4 border border-border shadow-[0_2px_10px_rgba(0,0,0,0.02)] cursor-pointer hover:shadow-md hover:border-[#00B87C]/30 transition-all group active:scale-[0.98]"
            >
              <div className="flex items-start justify-between mb-3">
                <div 
                  className="w-9 h-9 rounded-[10px] flex items-center justify-center group-hover:scale-110 transition-transform"
                  style={{ backgroundColor: kpi.bg, color: kpi.color }}
                >
                  <kpi.icon size={20} />
                </div>
              </div>
              <p className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-1">
                {kpi.label}
              </p>
              <p className="text-[28px] font-black mb-1 group-hover:text-[#00B87C] transition-colors" style={{ color: kpi.valColor }}>
                {kpi.value}
              </p>
              <p className="text-[12px] font-bold text-[#6B7280]">
                {kpi.subtext}
              </p>
            </div>
          ))}
        </div>


        {/* Tabs */}
        <div className="flex items-center gap-6 border-b border-border mb-6">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 text-[14px] font-bold transition-all relative ${
                activeTab === tab
                  ? "text-[#00B87C]"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab}
              {activeTab === tab && (
                <motion.div
                  layoutId="asset-tab-indicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#00B87C] rounded-t-full"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 mb-6">
          <div className="relative flex-1 max-w-[320px]">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              size={16}
            />
            <input
              type="text"
              placeholder="Search asset name, serial number, employee..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-input-background border border-border rounded-xl text-[13px] font-medium focus:outline-none focus:ring-2 focus:ring-[#00B87C]/20 focus:border-[#00B87C] transition-all"
            />
          </div>
          
          {/* Category Filter */}
          <div className="relative">
            <button 
              onClick={() => {
                setCategoryDropdownOpen(!categoryDropdownOpen);
                setDeptDropdownOpen(false);
                setStatusDropdownOpen(false);
              }}
              className={`flex items-center gap-2 px-3 py-2 border rounded-xl text-[13px] font-semibold transition-all cursor-pointer ${
                categoryFilter !== "All"
                  ? "bg-[#00B87C]/10 border-[#00B87C] text-[#00B87C]"
                  : "bg-card border-border text-foreground hover:bg-muted"
              }`}
            >
              Category{categoryFilter !== "All" ? `: ${categoryFilter}` : ""} <ChevronDown size={14} className={categoryFilter !== "All" ? "text-[#00B87C]" : "text-muted-foreground"} />
            </button>
            {categoryDropdownOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setCategoryDropdownOpen(false)} />
                <div className="absolute left-0 mt-1.5 w-48 bg-card border border-border rounded-xl shadow-lg z-50 py-1.5 overflow-hidden">
                  {["All", "Laptop", "Smartphone", "Monitor", "Vehicle", "Other"].map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => {
                        setCategoryFilter(cat);
                        setCategoryDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-[13px] font-semibold hover:bg-muted transition-colors flex items-center justify-between cursor-pointer ${
                        categoryFilter === cat ? "text-[#00B87C] bg-[#00B87C]/5" : "text-foreground"
                      }`}
                    >
                      {cat}
                      {categoryFilter === cat && <div className="w-1.5 h-1.5 rounded-full bg-[#00B87C]" />}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Department Filter */}
          <div className="relative">
            <button 
              onClick={() => {
                setDeptDropdownOpen(!deptDropdownOpen);
                setCategoryDropdownOpen(false);
                setStatusDropdownOpen(false);
              }}
              className={`flex items-center gap-2 px-3 py-2 border rounded-xl text-[13px] font-semibold transition-all cursor-pointer ${
                deptFilter !== "All"
                  ? "bg-[#00B87C]/10 border-[#00B87C] text-[#00B87C]"
                  : "bg-card border-border text-foreground hover:bg-muted"
              }`}
            >
              Department{deptFilter !== "All" ? `: ${deptFilter}` : ""} <ChevronDown size={14} className={deptFilter !== "All" ? "text-[#00B87C]" : "text-muted-foreground"} />
            </button>
            {deptDropdownOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setDeptDropdownOpen(false)} />
                <div className="absolute left-0 mt-1.5 w-48 bg-card border border-border rounded-xl shadow-lg z-50 py-1.5 overflow-hidden">
                  {["All", "Engineering", "Product", "Finance", "Marketing", "Operations"].map((dept) => (
                    <button
                      key={dept}
                      type="button"
                      onClick={() => {
                        setDeptFilter(dept);
                        setDeptDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-[13px] font-semibold hover:bg-muted transition-colors flex items-center justify-between cursor-pointer ${
                        deptFilter === dept ? "text-[#00B87C] bg-[#00B87C]/5" : "text-foreground"
                      }`}
                    >
                      {dept}
                      {deptFilter === dept && <div className="w-1.5 h-1.5 rounded-full bg-[#00B87C]" />}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Status Filter */}
          <div className="relative">
            <button 
              onClick={() => {
                setStatusDropdownOpen(!statusDropdownOpen);
                setCategoryDropdownOpen(false);
                setDeptDropdownOpen(false);
              }}
              className={`flex items-center gap-2 px-3 py-2 border rounded-xl text-[13px] font-semibold transition-all cursor-pointer ${
                statusFilter !== "All"
                  ? "bg-[#00B87C]/10 border-[#00B87C] text-[#00B87C]"
                  : "bg-card border-border text-foreground hover:bg-muted"
              }`}
            >
              Status{statusFilter !== "All" ? `: ${statusFilter}` : ""} <ChevronDown size={14} className={statusFilter !== "All" ? "text-[#00B87C]" : "text-muted-foreground"} />
            </button>
            {statusDropdownOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setStatusDropdownOpen(false)} />
                <div className="absolute left-0 mt-1.5 w-48 bg-card border border-border rounded-xl shadow-lg z-50 py-1.5 overflow-hidden">
                  {["All", "Assigned", "Available", "Pending Return", "Overdue", "Maintenance"].map((stat) => (
                    <button
                      key={stat}
                      type="button"
                      onClick={() => {
                        setStatusFilter(stat);
                        setStatusDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-[13px] font-semibold hover:bg-muted transition-colors flex items-center justify-between cursor-pointer ${
                        statusFilter === stat ? "text-[#00B87C] bg-[#00B87C]/5" : "text-foreground"
                      }`}
                    >
                      {stat}
                      {statusFilter === stat && <div className="w-1.5 h-1.5 rounded-full bg-[#00B87C]" />}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
          
          <div className="w-px h-6 bg-border mx-1" />
          
          <button 
            onClick={() => {
              setSearchQuery("");
              setCategoryFilter("All");
              setDeptFilter("All");
              setStatusFilter("All");
              setActiveTab("All Assets");
            }}
            className="flex items-center gap-2 px-3 py-2 text-muted-foreground hover:text-foreground rounded-xl text-[13px] font-semibold hover:bg-muted cursor-pointer"
          >
            <RotateCcw size={14} />
            Reset
          </button>

          <div className="ml-auto text-[13px] font-bold text-muted-foreground">
            Showing {filteredAssets.length} assets
          </div>
        </div>

        {/* Asset Table */}
        {activeTab === "Reports" ? (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Reports Dashboard Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Category Distribution Chart */}
              <div className="bg-card p-6 border border-border rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
                <h3 className="text-[12px] font-black text-foreground uppercase tracking-wider mb-6">Asset Category Distribution</h3>
                <div className="h-[260px] flex items-center justify-center">
                  {categoryChartData.length === 0 ? (
                    <span className="text-muted-foreground font-semibold text-[13px]">No data available</span>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={categoryChartData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={90}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {categoryChartData.map((entry, index) => {
                            const colors = ["#0EA5E9", "#00B87C", "#F59E0B", "#EF4444", "#8B5CF6"];
                            return <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />;
                          })}
                        </Pie>
                        <Tooltip formatter={(value) => [`${value} assets`, "Count"]} />
                        <Legend verticalAlign="bottom" height={36} iconType="circle" />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>

              {/* Department Valuation Chart */}
              <div className="bg-card p-6 border border-border rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
                <h3 className="text-[12px] font-black text-foreground uppercase tracking-wider mb-6">Asset Valuation by Department</h3>
                <div className="h-[260px]">
                  {deptChartData.length === 0 ? (
                    <div className="h-full flex items-center justify-center">
                      <span className="text-muted-foreground font-semibold text-[13px]">No data available</span>
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={deptChartData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} stroke="var(--border)" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 600, fill: "var(--muted-foreground)" }} />
                        <YAxis axisLine={false} tickLine={false} tickFormatter={(value) => `₹${value/1000}k`} tick={{ fontSize: 11, fontWeight: 600, fill: "var(--muted-foreground)" }} />
                        <Tooltip formatter={(value) => [`₹${Number(value).toLocaleString('en-IN')}`, "Total Value"]} />
                        <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                          {deptChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill="#8B5CF6" />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>

              {/* Status Breakdown Chart */}
              <div className="bg-card p-6 border border-border rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
                <h3 className="text-[12px] font-black text-foreground uppercase tracking-wider mb-6">Asset Status Breakdown</h3>
                <div className="h-[260px]">
                  {statusChartData.length === 0 ? (
                    <div className="h-full flex items-center justify-center">
                      <span className="text-muted-foreground font-semibold text-[13px]">No data available</span>
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={statusChartData} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} opacity={0.1} stroke="var(--border)" />
                        <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 600, fill: "var(--muted-foreground)" }} />
                        <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} width={100} tick={{ fontSize: 11, fontWeight: 600, fill: "var(--muted-foreground)" }} />
                        <Tooltip formatter={(value) => [`${value} assets`, "Count"]} />
                        <Bar dataKey="value" radius={[0, 8, 8, 0]}>
                          {statusChartData.map((entry, index) => {
                            const statusColors: Record<string, string> = {
                              "Assigned": "#00B87C",
                              "Pending Return": "#F59E0B",
                              "Overdue": "#EF4444",
                              "Available": "#94A3B8",
                              "Maintenance": "#0EA5E9"
                            };
                            return <Cell key={`cell-${index}`} fill={statusColors[entry.name] || "#6B7280"} />;
                          })}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>

              {/* Financial & Depreciation Summary Card */}
              <div className="bg-card p-6 border border-border rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col justify-between">
                <div>
                  <h3 className="text-[12px] font-black text-foreground uppercase tracking-wider mb-6">Financial Summary & Depreciation</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3.5 bg-muted rounded-xl border border-border/50">
                      <div>
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Total Book Value</span>
                        <span className="text-[20px] font-black text-[#00B87C]">₹{(totalValueSum).toLocaleString('en-IN')}</span>
                      </div>
                      <span className="text-[11px] font-bold text-muted-foreground">Original cost basis</span>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 bg-muted rounded-xl border border-border/50">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Avg Asset Value</span>
                        <span className="text-[15px] font-black text-foreground">₹{assets.length === 0 ? 0 : Math.round(totalValueSum / assets.length).toLocaleString('en-IN')}</span>
                      </div>
                      <div className="p-3 bg-muted rounded-xl border border-border/50">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Depreciated Value (-18%)</span>
                        <span className="text-[15px] font-black text-foreground">₹{Math.round(totalValueSum * 0.82).toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {assets.length > 0 && (
                  <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider block">Highest Value Asset</span>
                      <span className="text-[13px] font-bold text-foreground truncate max-w-[200px] block">
                        {assets.reduce((max, a) => a.value > max.value ? a : max, assets[0]).name}
                      </span>
                    </div>
                    <span className="text-[14px] font-black text-foreground">
                      ₹{assets.reduce((max, a) => a.value > max.value ? a : max, assets[0]).value.toLocaleString('en-IN')}
                    </span>
                  </div>
                )}
              </div>

            </div>
          </div>
        ) : (
          <div className="bg-card border border-border rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] overflow-hidden">
            <div className="px-6 py-4 border-b border-border bg-muted/50">
              <h3 className="text-[11px] font-semibold text-[#94A3B8] tracking-wider">ALL ASSETS</h3>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-border bg-[#F9FAFB] dark:bg-white/5">
                    <th className="px-6 py-3 text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider whitespace-nowrap">Asset</th>
                    <th className="px-6 py-3 text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider whitespace-nowrap">Category</th>
                    <th className="px-6 py-3 text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider whitespace-nowrap">Serial No.</th>
                    <th className="px-6 py-3 text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider whitespace-nowrap">Assigned To</th>
                    <th className="px-6 py-3 text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider whitespace-nowrap">Dept</th>
                    <th className="px-6 py-3 text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider whitespace-nowrap">Value</th>
                    <th className="px-6 py-3 text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider whitespace-nowrap">Assigned Date</th>
                    <th className="px-6 py-3 text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider whitespace-nowrap">Status</th>
                    <th className="px-6 py-3 text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider whitespace-nowrap">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAssets.map((asset) => {
                    const catColor = getCategoryColor(asset.category);
                    return (
                      <tr 
                        key={asset.id} 
                        className={`group hover:bg-[#00B87C]/[0.08] transition-colors border-b border-border last:border-0 h-14`}
                      >
                        <td className="px-6 py-3 cursor-pointer" onClick={() => openDetailPanel(asset)}>
                          <div className="flex items-center gap-3">
                            <div 
                              className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border"
                              style={{ backgroundColor: catColor.bg, color: catColor.text, borderColor: catColor.border }}
                            >
                              {getCategoryIcon(asset.category, 16)}
                            </div>
                            <div>
                              <p className="text-[13px] font-bold text-foreground group-hover:text-[#00B87C] transition-colors">
                                {asset.name}
                              </p>
                              <p className="text-[11px] font-medium text-muted-foreground">
                                Asset ID: {asset.assetId}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-3 cursor-pointer" onClick={() => openDetailPanel(asset)}>
                          <div 
                            className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold border"
                            style={{ backgroundColor: catColor.bg, color: catColor.text, borderColor: catColor.border }}
                          >
                            {asset.category}
                          </div>
                        </td>
                        <td className="px-6 py-3 cursor-pointer" onClick={() => openDetailPanel(asset)}>
                          <span className="font-mono text-[12px] font-semibold text-muted-foreground">
                            {asset.serialNo}
                          </span>
                        </td>
                        <td className="px-6 py-3 cursor-pointer" onClick={() => openDetailPanel(asset)}>
                          {asset.assignedTo ? (
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-full bg-[#E0F2FE] flex items-center justify-center text-[#0369A1] text-[11px] font-bold shrink-0">
                                {asset.assignedTo.split(' ').map(n => n[0]).join('')}
                              </div>
                              <span className={`text-[12px] font-bold ${asset.assignedToResigned ? "text-red-500" : "text-foreground"}`}>
                                {asset.assignedTo} {asset.assignedToResigned && "(Resigned)"}
                              </span>
                            </div>
                          ) : (
                            <span className="text-[12px] font-bold text-muted-foreground">—</span>
                          )}
                        </td>
                        <td className="px-6 py-3 cursor-pointer" onClick={() => openDetailPanel(asset)}>
                          <span className="text-[12px] font-bold text-muted-foreground">
                            {asset.department || "—"}
                          </span>
                        </td>
                        <td className="px-6 py-3 cursor-pointer" onClick={() => openDetailPanel(asset)}>
                          <span className="text-[12px] font-bold text-foreground">
                            ₹{asset.value.toLocaleString('en-IN')}
                          </span>
                        </td>
                        <td className="px-6 py-3 cursor-pointer" onClick={() => openDetailPanel(asset)}>
                          <span className="text-[12px] font-bold text-muted-foreground">
                            {asset.assignedDate || "—"}
                          </span>
                        </td>
                        <td className="px-6 py-3 cursor-pointer" onClick={() => openDetailPanel(asset)}>
                          {asset.status === "Assigned" && (
                            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#DCFCE7] text-[#00B87C] border border-[#A7F3D0]">
                              <CheckCircle2 size={12} strokeWidth={3} />
                              <span className="text-[11px] font-semibold uppercase tracking-wider">Assigned</span>
                            </div>
                          )}
                          {asset.status === "Pending Return" && (
                            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#FEF3C7] text-[#D97706] border border-[#FDE68A]">
                              <RefreshCcw size={12} strokeWidth={3} />
                              <span className="text-[11px] font-semibold uppercase tracking-wider">Pending Return</span>
                            </div>
                          )}
                          {asset.status === "Overdue" && (
                            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#FEE2E2] text-[#DC2626] border border-[#FECACA]">
                              <AlertCircle size={12} strokeWidth={3} />
                              <span className="text-[11px] font-semibold uppercase tracking-wider">Overdue</span>
                            </div>
                          )}
                          {asset.status === "Available" && (
                            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border">
                              <Package size={12} strokeWidth={3} />
                              <span className="text-[11px] font-semibold uppercase tracking-wider">Available</span>
                            </div>
                          )}
                          {asset.status === "Maintenance" && (
                            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#CCFBF1] text-[#0F766E] border border-[#99F6E4]">
                              <Wrench size={12} strokeWidth={3} />
                              <span className="text-[11px] font-semibold uppercase tracking-wider">In Maintenance</span>
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-3">
                          <div className="flex items-center gap-2">
                            {asset.status === "Assigned" && (
                              <>
                                <button 
                                  onClick={() => openDetailPanel(asset)}
                                  className="text-[12px] font-bold text-muted-foreground hover:text-foreground px-2 py-1 flex items-center gap-1"
                                >
                                  View <ChevronRight size={14} />
                                </button>
                                <button 
                                  onClick={() => openRecoverModal(asset)}
                                  className="px-3 py-1 bg-card border border-border text-foreground rounded-lg text-[11px] font-bold hover:bg-muted"
                                >
                                  Recover
                                </button>
                              </>
                            )}
                            {asset.status === "Pending Return" && (
                              <button 
                                onClick={() => toast.success(`Reminder sent to ${asset.assignedTo}`)}
                                className="px-3 py-1.5 bg-[#FEF3C7] text-[#B45309] rounded-lg text-[11px] font-black tracking-wide flex items-center gap-1 hover:bg-[#FDE68A]"
                              >
                                Send Reminder <ChevronRight size={14} />
                              </button>
                            )}
                            {asset.status === "Overdue" && (
                              <button 
                                onClick={() => openEscalationModal(asset)}
                                className="px-3 py-1.5 bg-[#FEE2E2] text-[#B91C1C] rounded-lg text-[11px] font-black tracking-wide flex items-center gap-1 hover:bg-[#FECACA]"
                              >
                                Escalate <ChevronRight size={14} />
                              </button>
                            )}
                            {asset.status === "Available" && (
                              <button 
                                onClick={() => openAssignModal(asset)}
                                className="px-3 py-1.5 bg-[#DCFCE7] text-[#00B87C] rounded-lg text-[11px] font-black tracking-wide flex items-center gap-1 hover:bg-[#D1FAE5]"
                              >
                                Assign <Plus size={14} strokeWidth={3} />
                              </button>
                            )}
                            {asset.status === "Maintenance" && (
                              <button 
                                onClick={() => openDetailPanel(asset)}
                                className="text-[12px] font-bold text-muted-foreground hover:text-foreground px-2 py-1 flex items-center gap-1"
                              >
                                View <ChevronRight size={14} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {filteredAssets.length === 0 && (
                    <tr>
                      <td colSpan={9} className="px-6 py-12 text-center text-muted-foreground font-medium">
                        No assets found matching your criteria
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>

      {/* --- Add Asset Modal --- */}
      <AnimatePresence>
        {isAddModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[2000]"
              onClick={() => setIsAddModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[520px] bg-card rounded-2xl shadow-2xl z-[2001] max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-border flex items-center justify-between sticky top-0 bg-card/90 backdrop-blur z-10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#E0F2FE] text-[#0EA5E9] flex items-center justify-center">
                    <Package size={20} />
                  </div>
                  <h2 className="text-[18px] font-bold text-foreground">
                    Add New Asset
                  </h2>
                </div>
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleAddAsset} className="p-6">
                <div className="grid grid-cols-2 gap-5 mb-6">
                  <div className="col-span-2">
                    <label className="block text-[11px] font-semibold text-[#94A3B8] tracking-wider mb-2">ASSET NAME</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Dell XPS 15 (2024)" 
                      value={newAssetName}
                      onChange={(e) => setNewAssetName(e.target.value)}
                      className="w-full px-3 py-2.5 bg-input-background border border-border rounded-xl text-[13px] font-medium focus:ring-2 focus:ring-[#00B87C]/20 focus:border-[#00B87C] outline-none" 
                      required 
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-[#94A3B8] tracking-wider mb-2">CATEGORY</label>
                    <select 
                      value={newAssetCategory}
                      onChange={(e) => setNewAssetCategory(e.target.value as Asset["category"])}
                      className="w-full px-3 py-2.5 bg-input-background border border-border rounded-xl text-[13px] font-medium focus:ring-2 focus:ring-[#00B87C]/20 focus:border-[#00B87C] outline-none appearance-none" 
                      required
                    >
                      <option value="Laptop">Laptop</option>
                      <option value="Smartphone">Smartphone</option>
                      <option value="Monitor">Monitor</option>
                      <option value="Vehicle">Vehicle</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-[#94A3B8] tracking-wider mb-2">SERIAL NUMBER</label>
                    <input 
                      type="text" 
                      placeholder="e.g. SN-XYZ-123" 
                      value={newAssetSerialNo}
                      onChange={(e) => setNewAssetSerialNo(e.target.value)}
                      className="w-full px-3 py-2.5 bg-input-background border border-border rounded-xl text-[13px] font-mono focus:ring-2 focus:ring-[#00B87C]/20 focus:border-[#00B87C] outline-none" 
                      required 
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-[#94A3B8] tracking-wider mb-2">BRAND / MODEL</label>
                    <input 
                      type="text" 
                      value={newAssetBrand}
                      onChange={(e) => setNewAssetBrand(e.target.value)}
                      className="w-full px-3 py-2.5 bg-input-background border border-border rounded-xl text-[13px] font-medium focus:ring-2 focus:ring-[#00B87C]/20 focus:border-[#00B87C] outline-none" 
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-[#94A3B8] tracking-wider mb-2">PURCHASE DATE</label>
                    <input 
                      type="date" 
                      value={newAssetPurchaseDate}
                      onChange={(e) => setNewAssetPurchaseDate(e.target.value)}
                      className="w-full px-3 py-2.5 bg-input-background border border-border rounded-xl text-[13px] font-medium focus:ring-2 focus:ring-[#00B87C]/20 focus:border-[#00B87C] outline-none" 
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-[#94A3B8] tracking-wider mb-2">PURCHASE VALUE (₹)</label>
                    <input 
                      type="number" 
                      placeholder="0.00" 
                      value={newAssetValue}
                      onChange={(e) => setNewAssetValue(e.target.value)}
                      className="w-full px-3 py-2.5 bg-input-background border border-border rounded-xl text-[13px] font-medium focus:ring-2 focus:ring-[#00B87C]/20 focus:border-[#00B87C] outline-none" 
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-[#94A3B8] tracking-wider mb-2">WARRANTY EXPIRY</label>
                    <input 
                      type="date" 
                      value={newAssetWarrantyExpiry}
                      onChange={(e) => setNewAssetWarrantyExpiry(e.target.value)}
                      className="w-full px-3 py-2.5 bg-input-background border border-border rounded-xl text-[13px] font-medium focus:ring-2 focus:ring-[#00B87C]/20 focus:border-[#00B87C] outline-none" 
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-[#94A3B8] tracking-wider mb-2">VENDOR / SUPPLIER</label>
                    <input 
                      type="text" 
                      value={newAssetVendor}
                      onChange={(e) => setNewAssetVendor(e.target.value)}
                      className="w-full px-3 py-2.5 bg-input-background border border-border rounded-xl text-[13px] font-medium focus:ring-2 focus:ring-[#00B87C]/20 focus:border-[#00B87C] outline-none" 
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-[#94A3B8] tracking-wider mb-2">LOCATION / WAREHOUSE</label>
                    <input 
                      type="text" 
                      value={newAssetLocation}
                      onChange={(e) => setNewAssetLocation(e.target.value)}
                      className="w-full px-3 py-2.5 bg-input-background border border-border rounded-xl text-[13px] font-medium focus:ring-2 focus:ring-[#00B87C]/20 focus:border-[#00B87C] outline-none" 
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-[11px] font-semibold text-[#94A3B8] tracking-wider mb-2">Asset Tag / ID</label>
                    <input 
                      type="text" 
                      placeholder="AST-XXXX" 
                      value={`AST-0${421 + assets.length}`}
                      disabled 
                      className="w-full px-3 py-2.5 bg-muted border border-border rounded-xl text-[13px] font-mono text-muted-foreground cursor-not-allowed" 
                    />
                  </div>
                </div>

                <div className="border-t border-border pt-6 mb-6">
                  <h3 className="text-[11px] font-semibold text-[#94A3B8] tracking-wider mb-4 uppercase">
                    Assign To Employee (Optional)
                  </h3>
                  <div className="grid grid-cols-2 gap-5">
                    <div className="col-span-2 relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                      <input 
                        type="text" 
                        placeholder="Search employee name or ID..." 
                        value={newAssetAssignEmployee}
                        onChange={(e) => setNewAssetAssignEmployee(e.target.value)}
                        className="w-full pl-9 pr-3 py-2.5 bg-input-background border border-border rounded-xl text-[13px] font-medium focus:ring-2 focus:ring-[#00B87C]/20 focus:border-[#00B87C] outline-none" 
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-[#94A3B8] tracking-wider mb-2">ASSIGN DATE</label>
                      <input 
                        type="date" 
                        value={newAssetAssignDate}
                        onChange={(e) => setNewAssetAssignDate(e.target.value)}
                        className="w-full px-3 py-2.5 bg-input-background border border-border rounded-xl text-[13px] font-medium focus:ring-2 focus:ring-[#00B87C]/20 focus:border-[#00B87C] outline-none" 
                      />
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-[11px] font-semibold text-[#94A3B8] tracking-wider mb-2">NOTES / DESCRIPTION</label>
                  <textarea 
                    rows={3} 
                    value={newAssetNotes}
                    onChange={(e) => setNewAssetNotes(e.target.value)}
                    className="w-full px-3 py-2.5 bg-input-background border border-border rounded-xl text-[13px] font-medium focus:ring-2 focus:ring-[#00B87C]/20 focus:border-[#00B87C] outline-none resize-none"
                  ></textarea>
                </div>

                <div className="mb-8">
                  <label className="block text-[11px] font-semibold text-[#94A3B8] tracking-wider mb-2">
                    ATTACH INVOICE / RECEIPT
                  </label>
                  <div className="border-2 border-dashed border-[#A7F3D0] bg-secondary rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-accent transition-colors">
                    <UploadCloud size={24} className="text-[#00B87C] mb-2" />
                    <p className="text-[13px] font-semibold text-[#065F46]">
                      Drag invoice here or Browse
                    </p>
                    <p className="text-[11px] font-medium text-[#047857]/70 mt-1">
                      PDF, JPG, PNG (Max 5MB)
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 sticky bottom-0 bg-card pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-4 py-2 text-[13px] font-bold text-muted-foreground hover:text-foreground"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="px-4 py-2 bg-card border border-border text-foreground rounded-xl text-[13px] font-bold hover:bg-muted shadow-sm"
                  >
                    Save as Draft
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#00B87C] text-white rounded-xl text-[13px] font-bold hover:bg-[#009665] shadow-sm"
                  >
                    Add Asset
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* --- Assign Asset Modal --- */}
      <AnimatePresence>
        {isAssignModalOpen && selectedAsset && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[2000]"
              onClick={() => setIsAssignModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[460px] bg-card rounded-2xl shadow-2xl z-[2001]"
            >
              <div className="p-6 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#DCFCE7] text-[#00B87C] flex items-center justify-center">
                    <CheckCircle2 size={20} />
                  </div>
                  <div>
                    <h2 className="text-[18px] font-bold text-foreground">
                      Assign Asset
                    </h2>
                    <p className="text-[12px] font-medium text-muted-foreground">
                      {selectedAsset.name}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsAssignModalOpen(false)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:bg-muted"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleAssignAsset} className="p-6">
                {/* Asset Preview */}
                <div className="bg-muted border border-border rounded-xl p-4 flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-lg bg-card border border-border flex items-center justify-center">
                    {getCategoryIcon(selectedAsset.category, 24)}
                  </div>
                  <div className="flex-1">
                    <p className="text-[14px] font-bold text-foreground">
                      {selectedAsset.name}
                    </p>
                    <p className="text-[12px] font-mono text-muted-foreground">
                      {selectedAsset.serialNo}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[11px] font-bold text-muted-foreground">
                      VALUE
                    </p>
                    <p className="text-[13px] font-bold text-foreground">
                      ₹{selectedAsset.value.toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-[11px] font-semibold text-[#94A3B8] tracking-wider mb-2">
                    ASSIGN TO
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                    <input 
                      type="text" 
                      placeholder="Search employee name or ID..." 
                      value={assignEmployee}
                      onChange={(e) => setAssignEmployee(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 bg-input-background border border-border rounded-xl text-[13px] font-medium focus:ring-2 focus:ring-[#00B87C]/20 focus:border-[#00B87C] outline-none" 
                      required 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-5 mb-6">
                  <div>
                    <label className="block text-[11px] font-semibold text-[#94A3B8] tracking-wider mb-2">ASSIGN DATE</label>
                    <input 
                      type="date" 
                      value={assignDate}
                      onChange={(e) => setAssignDate(e.target.value)}
                      className="w-full px-3 py-2.5 bg-input-background border border-border rounded-xl text-[13px] font-medium focus:ring-2 focus:ring-[#00B87C]/20 focus:border-[#00B87C] outline-none" 
                      required 
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-[#94A3B8] tracking-wider mb-2">EXPECTED RETURN (OPTIONAL)</label>
                    <input 
                      type="date" 
                      value={expectedReturnDate}
                      onChange={(e) => setExpectedReturnDate(e.target.value)}
                      className="w-full px-3 py-2.5 bg-input-background border border-border rounded-xl text-[13px] font-medium focus:ring-2 focus:ring-[#00B87C]/20 focus:border-[#00B87C] outline-none" 
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-[11px] font-semibold text-[#94A3B8] tracking-wider mb-2">
                    CONDITION AT ASSIGN
                  </label>
                  <div className="flex bg-muted p-1 rounded-xl">
                    {["New", "Good", "Fair", "Refurbished"].map((cond) => (
                      <button
                        key={cond}
                        type="button"
                        onClick={() => setAssignCondition(cond)}
                        className={`flex-1 py-1.5 text-[12px] font-bold rounded-lg transition-all ${
                          assignCondition === cond
                            ? "bg-[#00B87C] text-white shadow-sm"
                            : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                        }`}
                      >
                        {cond}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-[11px] font-semibold text-[#94A3B8] tracking-wider mb-2">NOTES</label>
                  <textarea 
                    rows={2} 
                    value={assignNotes}
                    onChange={(e) => setAssignNotes(e.target.value)}
                    className="w-full px-3 py-2.5 bg-input-background border border-border rounded-xl text-[13px] font-medium focus:ring-2 focus:ring-[#00B87C]/20 focus:border-[#00B87C] outline-none resize-none"
                  ></textarea>
                </div>

                <div className="flex items-center justify-between mb-8 p-3 border border-[#A7F3D0] bg-secondary rounded-xl">
                  <div>
                    <p className="text-[13px] font-bold text-[#065F46]">
                      Notify Employee
                    </p>
                    <p className="text-[11px] font-medium text-[#047857]/80">
                      Send email notification with asset details
                    </p>
                  </div>
                  <div className="relative inline-block w-10 h-6">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="peer sr-only"
                    />
                    <div className="w-10 h-6 bg-switch-background peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00B87C]"></div>
                  </div>
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsAssignModalOpen(false)}
                    className="px-4 py-2 text-[13px] font-bold text-muted-foreground hover:text-foreground"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#00B87C] text-white rounded-xl text-[13px] font-bold hover:bg-[#009665] shadow-sm"
                  >
                    Assign Asset
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* --- Recover Asset Modal --- */}
      <AnimatePresence>
        {isRecoverModalOpen && selectedAsset && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[2000]"
              onClick={() => setIsRecoverModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[460px] bg-card rounded-2xl shadow-2xl z-[2001] max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-border flex items-center justify-between sticky top-0 bg-card/90 backdrop-blur z-10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#FEF3C7] text-[#F59E0B] flex items-center justify-center">
                    <RefreshCcw size={20} />
                  </div>
                  <div>
                    <h2 className="text-[18px] font-bold text-foreground">
                      Recover Asset
                    </h2>
                    <p className="text-[12px] font-medium text-muted-foreground">
                      {selectedAsset.name}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsRecoverModalOpen(false)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:bg-muted"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleRecoverAsset} className="p-6">
                {/* Employee Preview */}
                <div className="bg-muted border border-border rounded-xl p-4 flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-[#E0F2FE] flex items-center justify-center text-[#0369A1] font-bold text-lg">
                    {selectedAsset.assignedTo
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("") || "—"}
                  </div>
                  <div className="flex-1">
                    <p className="text-[14px] font-bold text-foreground">
                      {selectedAsset.assignedTo || "—"}
                    </p>
                    <p className="text-[12px] font-medium text-muted-foreground">
                      {selectedAsset.department || "—"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[11px] font-bold text-muted-foreground">
                      ASSIGNED SINCE
                    </p>
                    <p className="text-[12px] font-bold text-foreground">
                      {selectedAsset.assignedDate
                        ?.split(" ")
                        .slice(0, 2)
                        .join(" ")}
                    </p>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-[11px] font-semibold text-[#94A3B8] tracking-wider mb-2">
                    CONDITION ON RETURN
                  </label>
                  <div className="flex bg-muted p-1 rounded-xl">
                    {["Excellent", "Good", "Damaged", "Lost"].map((cond) => (
                      <button
                        key={cond}
                        type="button"
                        onClick={() => setRecoverCondition(cond)}
                        className={`flex-1 py-1.5 text-[12px] font-bold rounded-lg transition-all ${
                          recoverCondition === cond
                            ? cond === "Damaged" || cond === "Lost"
                              ? "bg-[#EF4444] text-white"
                              : "bg-[#00B87C] text-white shadow-sm"
                            : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                        }`}
                      >
                        {cond}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-[11px] font-semibold text-[#94A3B8] tracking-wider mb-2">ACTUAL RETURN DATE</label>
                  <input 
                    type="date" 
                    value={recoverDate}
                    onChange={(e) => setRecoverDate(e.target.value)}
                    className="w-full px-3 py-2.5 bg-input-background border border-border rounded-xl text-[13px] font-medium focus:ring-2 focus:ring-[#00B87C]/20 focus:border-[#00B87C] outline-none" 
                    required 
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-[11px] font-semibold text-[#94A3B8] tracking-wider mb-2">
                    RECOVERY NOTES{" "}
                    {["Damaged", "Lost"].includes(recoverCondition) && (
                      <span className="text-red-500">*</span>
                    )}
                  </label>
                  <textarea 
                    rows={2} 
                    value={recoverNotes}
                    onChange={(e) => setRecoverNotes(e.target.value)}
                    required={["Damaged", "Lost"].includes(recoverCondition)}
                    className="w-full px-3 py-2.5 bg-input-background border border-border rounded-xl text-[13px] font-medium focus:ring-2 focus:ring-[#00B87C]/20 focus:border-[#00B87C] outline-none resize-none"
                  ></textarea>
                </div>

                {recoverCondition === "Damaged" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="space-y-6 mb-6 p-4 bg-[#FEF2F2] border border-[#FECACA] rounded-xl"
                  >
                    <div>
                      <label className="block text-[11px] font-black text-[#991B1B] tracking-wider mb-2">DAMAGE DESCRIPTION</label>
                      <textarea 
                        rows={2} 
                        value={damageDescription}
                        onChange={(e) => setDamageDescription(e.target.value)}
                        className="w-full px-3 py-2 bg-input-background border border-[#FECACA] rounded-xl text-[13px] font-medium focus:outline-none focus:border-[#EF4444]" 
                        required
                      ></textarea>
                    </div>
                    <div>
                      <label className="block text-[11px] font-black text-[#991B1B] tracking-wider mb-2">REPAIR COST ESTIMATE (₹)</label>
                      <input 
                        type="number" 
                        placeholder="0.00" 
                        value={repairCostEstimate}
                        onChange={(e) => setRepairCostEstimate(e.target.value)}
                        className="w-full px-3 py-2 bg-input-background border border-[#FECACA] rounded-xl text-[13px] font-medium focus:outline-none focus:border-[#EF4444]" 
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-[13px] font-bold text-[#991B1B]">
                        Deduct from Employee
                      </p>
                      <div className="relative inline-block w-10 h-6">
                        <input 
                          type="checkbox" 
                          checked={deductFromEmployee}
                          onChange={(e) => setDeductFromEmployee(e.target.checked)}
                          className="peer sr-only" 
                        />
                        <div className="w-10 h-6 bg-[#FECACA] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#EF4444]"></div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {recoverCondition === "Lost" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="space-y-6 mb-6 p-4 bg-[#FEF2F2] border border-[#FECACA] rounded-xl"
                  >
                    <div>
                      <label className="block text-[11px] font-black text-[#991B1B] tracking-wider mb-2">POLICE REPORT NUMBER (OPTIONAL)</label>
                      <input 
                        type="text" 
                        value={policeReportNumber}
                        onChange={(e) => setPoliceReportNumber(e.target.value)}
                        className="w-full px-3 py-2 bg-input-background border border-[#FECACA] rounded-xl text-[13px] font-medium focus:outline-none focus:border-[#EF4444]" 
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <input 
                        type="checkbox" 
                        id="fir-attached" 
                        checked={firAttached}
                        onChange={(e) => setFirAttached(e.target.checked)}
                        className="rounded text-[#EF4444] focus:ring-[#EF4444]" 
                      />
                      <label htmlFor="fir-attached" className="text-[13px] font-bold text-[#991B1B]">FIR Attached</label>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-[13px] font-bold text-[#991B1B]">
                        Replacement Required
                      </p>
                      <div className="relative inline-block w-10 h-6">
                        <input 
                          type="checkbox" 
                          checked={replacementRequired}
                          onChange={(e) => setReplacementRequired(e.target.checked)}
                          className="peer sr-only" 
                        />
                        <div className="w-10 h-6 bg-[#FECACA] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#EF4444]"></div>
                      </div>
                    </div>
                  </motion.div>
                )}


                <div className="flex items-center justify-between mb-8 p-3 border border-border bg-muted rounded-xl">
                  <div>
                    <p className="text-[13px] font-bold text-foreground">
                      Notify Finance for Reconciliation
                    </p>
                  </div>
                  <div className="relative inline-block w-10 h-6">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="peer sr-only"
                    />
                    <div className="w-10 h-6 bg-switch-background peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00B87C]"></div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 sticky bottom-0 bg-card pt-2">
                  <button
                    type="button"
                    onClick={() => setIsRecoverModalOpen(false)}
                    className="px-4 py-2 text-[13px] font-bold text-muted-foreground hover:text-foreground"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#00B87C] text-white rounded-xl text-[13px] font-bold hover:bg-[#009665] shadow-sm"
                  >
                    Confirm Recovery
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* --- Escalation Modal --- */}
      <AnimatePresence>
        {isEscalationModalOpen && selectedAsset && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[2000]"
              onClick={() => setIsEscalationModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[400px] bg-card rounded-2xl shadow-2xl z-[2001] p-6 text-center"
            >
              <div className="w-16 h-16 rounded-full bg-[#FEE2E2] flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-[0_0_0_4px_rgba(254,226,226,0.5)]">
                <AlertCircle
                  size={28}
                  className="text-[#EF4444]"
                  strokeWidth={2.5}
                />
              </div>
              <h2 className="text-[20px] font-bold text-foreground mb-2">
                Escalate Overdue Asset
              </h2>
              <p className="text-[13px] font-medium text-muted-foreground mb-6">
                This will involve HR and Finance for recovering the{" "}
                <strong>{selectedAsset.name}</strong> from{" "}
                <strong>{selectedAsset.assignedTo}</strong>.
              </p>

              <textarea
                rows={3}
                placeholder="Add escalation notes (optional)..."
                className="w-full px-3 py-2 bg-muted border border-border rounded-xl text-[13px] font-medium focus:outline-none focus:ring-2 focus:ring-[#EF4444]/20 focus:border-[#EF4444] mb-6 resize-none"
              ></textarea>

              <div className="flex gap-3">
                <button
                  onClick={() => setIsEscalationModalOpen(false)}
                  className="flex-1 py-2.5 bg-card border border-border text-foreground rounded-xl text-[13px] font-bold hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setIsEscalationModalOpen(false);
                    toast.success("Asset escalated to HR and Finance");
                  }}
                  className="flex-1 py-2.5 bg-[#EF4444] text-white rounded-xl text-[13px] font-bold hover:bg-[#DC2626] transition-colors shadow-sm"
                >
                  Confirm Escalate
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* --- Asset Detail Slide Panel --- */}
      <AnimatePresence>
        {isDetailPanelOpen && selectedAsset && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[1500]"
              onClick={() => setIsDetailPanelOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-[420px] bg-card shadow-[-10px_0_40px_rgba(0,0,0,0.1)] z-[1501] flex flex-col"
            >
              <div className="flex items-center justify-between p-6 border-b border-border shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-muted-foreground">
                    {getCategoryIcon(selectedAsset.category, 20)}
                  </div>
                  <div>
                    <h2 className="text-[18px] font-bold text-foreground leading-tight">
                      {selectedAsset.name}
                    </h2>
                    <p className="text-[12px] font-mono text-muted-foreground">
                      {selectedAsset.assetId}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsDetailPanelOpen(false)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Status Banner */}
              <div
                className={`px-6 py-3 shrink-0 flex items-center justify-between ${
                  selectedAsset.status === "Assigned"
                    ? "bg-[#ECFDF5] border-b border-[#A7F3D0]"
                    : selectedAsset.status === "Pending Return"
                      ? "bg-[#FEF3C7] border-b border-[#FDE68A]"
                      : selectedAsset.status === "Overdue"
                        ? "bg-[#FEF2F2] border-b border-[#FECACA]"
                        : selectedAsset.status === "Available"
                          ? "bg-muted border-b border-border"
                          : "bg-[#F0FDFA] border-b border-[#CCFBF1]"
                }`}
              >
                <div className="flex items-center gap-2">
                  {selectedAsset.status === "Assigned" && (
                    <CheckCircle2 size={16} className="text-[#059669]" />
                  )}
                  {selectedAsset.status === "Pending Return" && (
                    <RefreshCcw size={16} className="text-[#D97706]" />
                  )}
                  {selectedAsset.status === "Overdue" && (
                    <AlertCircle size={16} className="text-[#DC2626]" />
                  )}
                  {selectedAsset.status === "Available" && (
                    <Package size={16} className="text-muted-foreground" />
                  )}
                  {selectedAsset.status === "Maintenance" && (
                    <Wrench size={16} className="text-[#0F766E]" />
                  )}
                  <span
                    className={`text-[13px] font-bold uppercase tracking-wider ${
                      selectedAsset.status === "Assigned"
                        ? "text-[#065F46]"
                        : selectedAsset.status === "Pending Return"
                          ? "text-[#92400E]"
                          : selectedAsset.status === "Overdue"
                            ? "text-[#991B1B]"
                            : selectedAsset.status === "Available"
                              ? "text-muted-foreground"
                              : "text-[#115E59]"
                    }`}
                  >
                    {selectedAsset.status}
                  </span>
                </div>
                {selectedAsset.assignedTo && (
                  <span
                    className={`text-[12px] font-semibold ${
                      selectedAsset.status === "Overdue"
                        ? "text-[#DC2626]"
                        : selectedAsset.status === "Pending Return"
                          ? "text-[#D97706]"
                          : "text-[#059669]"
                    }`}
                  >
                    To {selectedAsset.assignedTo}
                  </span>
                )}
              </div>

              {/* Panel Tabs */}
              <div className="flex items-center border-b border-border shrink-0">
                {[
                  "Details",
                  "Assignment History",
                  "Maintenance",
                  "Documents",
                ].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setDetailTab(tab)}
                    className={`flex-1 py-3 text-[11px] font-black uppercase tracking-wider transition-colors border-b-2 ${
                      detailTab === tab
                        ? "border-[#00B87C] text-[#00B87C]"
                        : "border-transparent text-muted-foreground hover:text-muted-foreground"
                    }`}
                  >
                    {tab.split(" ")[0]}
                  </button>
                ))}
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-6 bg-muted">
                {detailTab === "Details" && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-card p-4 rounded-xl border border-border shadow-sm">
                        <p className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-1">
                          Current Value
                        </p>
                        <p className="text-[18px] font-black text-foreground">
                          ₹98,000
                        </p>
                        <p className="text-[11px] font-bold text-[#DC2626]">
                          -18% depr.
                        </p>
                      </div>
                      <div className="bg-card p-4 rounded-xl border border-border shadow-sm">
                        <p className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-1">
                          Days Assigned
                        </p>
                        <p className="text-[18px] font-black text-foreground">
                          312{" "}
                          <span className="text-[12px] text-muted-foreground font-bold">
                            days
                          </span>
                        </p>
                        <p className="text-[11px] font-bold text-muted-foreground">
                          Since Mar 2021
                        </p>
                      </div>
                    </div>

                    <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
                      {[
                        {
                          label: "Serial No",
                          value: selectedAsset.serialNo,
                          isMono: true,
                        },
                        {
                          label: "Brand",
                          value: selectedAsset.name.split(" ")[0],
                        },
                        { label: "Category", value: selectedAsset.category },
                        { label: "Purchase Date", value: "Jan 10, 2021" },
                        {
                          label: "Purchase Value",
                          value: `₹${selectedAsset.value.toLocaleString("en-IN")}`,
                        },
                        {
                          label: "Warranty Expiry",
                          value: "Jan 10, 2024 (Expired)",
                        },
                        { label: "Vendor", value: "TechCorp India Pvt Ltd" },
                        { label: "Location", value: "Mumbai HQ" },
                      ].map((item, i) => (
                        <div
                          key={i}
                          className={`flex items-center justify-between p-3 ${i !== 0 ? "border-t border-muted" : ""}`}
                        >
                          <span className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider">
                            {item.label}
                          </span>
                          <span
                            className={`text-[13px] font-bold text-foreground ${item.isMono ? "font-mono" : ""}`}
                          >
                            {item.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {detailTab === "Assignment History" && (
                  <div className="relative pl-4 space-y-6">
                    <div className="absolute left-[23px] top-2 bottom-2 w-px bg-border" />

                    {[
                      {
                        emp: "Arjun Mehta",
                        dept: "Engineering",
                        from: "Mar 15, 2021",
                        to: "Present",
                        cond: "Good",
                      },
                      {
                        emp: "Kiran Patel",
                        dept: "Product",
                        from: "Feb 10, 2020",
                        to: "Feb 28, 2021",
                        cond: "Excellent",
                      },
                    ].map((history, i) => (
                      <div
                        key={i}
                        className="relative z-10 flex items-start gap-4"
                      >
                        <div
                          className={`w-3 h-3 rounded-full mt-1.5 ring-4 ring-background ${i === 0 ? "bg-[#00B87C]" : "bg-muted"}`}
                        />
                        <div className="flex-1 bg-card border border-border rounded-xl p-4 shadow-sm">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <p className="text-[14px] font-bold text-foreground">
                                {history.emp}
                              </p>
                              <p className="text-[12px] font-medium text-muted-foreground">
                                {history.dept}
                              </p>
                            </div>
                            <span className="text-[11px] font-bold text-muted-foreground bg-muted px-2 py-1 rounded border border-border">
                              {history.cond}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-[12px] font-semibold text-muted-foreground mt-3 pt-3 border-t border-muted">
                            <Calendar
                              size={14}
                              className="text-muted-foreground"
                            />
                            {history.from} — {history.to}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {detailTab === "Maintenance" && (
                  <div>
                    {!isAddingLog ? (
                      <button 
                        onClick={() => setIsAddingLog(true)}
                        className="w-full mb-4 py-2.5 border-2 border-dashed border-[#00B87C]/30 text-[#00B87C] rounded-xl text-[13px] font-bold hover:bg-[#00B87C]/5 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Plus size={16} strokeWidth={3} />
                        Log Maintenance
                      </button>
                    ) : (
                      <form 
                        onSubmit={(e) => {
                          e.preventDefault();
                          const currentLogs = maintenanceLogs[selectedAsset.assetId] || [];
                          const costVal = parseFloat(newMaintenanceCost) || 0;
                          const newLog = {
                            title: newMaintenanceTitle || "General Service",
                            cost: costVal,
                            desc: newMaintenanceDesc || "Routine maintenance",
                            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                            status: "Completed"
                          };
                          setMaintenanceLogs({
                            ...maintenanceLogs,
                            [selectedAsset.assetId]: [newLog, ...currentLogs]
                          });
                          setIsAddingLog(false);
                          setNewMaintenanceTitle("");
                          setNewMaintenanceCost("");
                          setNewMaintenanceDesc("");
                          toast.success("Maintenance log added successfully");
                        }} 
                        className="bg-card border border-border rounded-xl p-4 mb-4 space-y-3"
                      >
                        <h4 className="text-[12px] font-bold text-foreground">Log New Maintenance</h4>
                        <div>
                          <label className="block text-[9px] font-bold text-muted-foreground uppercase mb-1">Service Title</label>
                          <input 
                            type="text" 
                            required 
                            placeholder="e.g. Screen Replacement" 
                            value={newMaintenanceTitle}
                            onChange={(e) => setNewMaintenanceTitle(e.target.value)}
                            className="w-full px-2 py-1.5 bg-input-background border border-border rounded-lg text-[12px] outline-none focus:ring-1 focus:ring-[#00B87C]" 
                          />
                        </div>
                        <div>
                          <label className="block text-[9px] font-bold text-muted-foreground uppercase mb-1">Cost (₹)</label>
                          <input 
                            type="number" 
                            required 
                            placeholder="e.g. 5000" 
                            value={newMaintenanceCost}
                            onChange={(e) => setNewMaintenanceCost(e.target.value)}
                            className="w-full px-2 py-1.5 bg-input-background border border-border rounded-lg text-[12px] outline-none focus:ring-1 focus:ring-[#00B87C]" 
                          />
                        </div>
                        <div>
                          <label className="block text-[9px] font-bold text-muted-foreground uppercase mb-1">Description</label>
                          <textarea 
                            rows={2} 
                            placeholder="Describe the service details..." 
                            value={newMaintenanceDesc}
                            onChange={(e) => setNewMaintenanceDesc(e.target.value)}
                            className="w-full px-2 py-1.5 bg-input-background border border-border rounded-lg text-[12px] outline-none resize-none focus:ring-1 focus:ring-[#00B87C]"
                          ></textarea>
                        </div>
                        <div className="flex gap-2 justify-end">
                          <button 
                            type="button" 
                            onClick={() => setIsAddingLog(false)}
                            className="px-3 py-1.5 text-[11px] font-bold text-muted-foreground hover:text-foreground cursor-pointer"
                          >
                            Cancel
                          </button>
                          <button 
                            type="submit" 
                            className="px-3 py-1.5 bg-[#00B87C] text-white text-[11px] font-bold rounded-lg hover:bg-[#009665] cursor-pointer"
                          >
                            Save Log
                          </button>
                        </div>
                      </form>
                    )}
                    
                    <div className="space-y-3">
                      {(maintenanceLogs[selectedAsset.assetId] || []).length === 0 ? (
                        <p className="text-center text-[12px] text-muted-foreground font-semibold py-4">No maintenance logs found</p>
                      ) : (
                        (maintenanceLogs[selectedAsset.assetId] || []).map((log, index) => (
                          <div key={index} className="bg-card border border-border rounded-xl p-4 shadow-sm">
                            <div className="flex justify-between items-start mb-2">
                              <p className="text-[13px] font-bold text-foreground">{log.title}</p>
                              <span className="text-[12px] font-bold text-foreground">₹{log.cost.toLocaleString('en-IN')}</span>
                            </div>
                            <p className="text-[12px] font-medium text-muted-foreground mb-3">{log.desc}</p>
                            <div className="flex items-center justify-between text-[11px] font-bold">
                              <span className="text-muted-foreground">{log.date}</span>
                              <span className="text-[#059669] bg-secondary px-2 py-0.5 rounded">{log.status}</span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}

                {detailTab === "Documents" && (
                  <div className="space-y-3">
                    <button 
                      onClick={() => {
                        const fileNames = [
                          "Equipment_Insurance_2026.pdf",
                          "User_Acceptance_Signoff.pdf",
                          "Asset_Disposal_Form.pdf",
                          "Vendor_Receipt_Oct.pdf"
                        ];
                        const randomName = fileNames[Math.floor(Math.random() * fileNames.length)];
                        const currentDocs = assetDocuments[selectedAsset.assetId] || [];
                        const isDuplicate = currentDocs.some(d => d.name === randomName);
                        if (isDuplicate) {
                          toast.error("Document already uploaded");
                          return;
                        }
                        const newDoc = {
                          name: randomName,
                          size: `${(Math.random() * 2 + 0.5).toFixed(1)} MB`,
                          date: new Date().toLocaleDateString('en-CA')
                        };
                        setAssetDocuments({
                          ...assetDocuments,
                          [selectedAsset.assetId]: [newDoc, ...currentDocs]
                        });
                        toast.success(`Uploaded ${randomName} successfully`);
                      }}
                      className="w-full mb-2 py-2.5 bg-card border border-border text-foreground rounded-xl text-[13px] font-bold hover:bg-muted shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <UploadCloud size={16} />
                      Upload Document
                    </button>
                    
                    {(assetDocuments[selectedAsset.assetId] || []).length === 0 ? (
                      <p className="text-center text-[12px] text-muted-foreground font-semibold py-4">No documents uploaded</p>
                    ) : (
                      (assetDocuments[selectedAsset.assetId] || []).map((doc, index) => (
                        <div key={index} className="bg-card border border-border rounded-xl p-3 flex items-center gap-3 shadow-sm hover:border-[#00B87C]/30 cursor-pointer group transition-colors">
                          <div className="w-10 h-10 rounded-lg bg-[#E0F2FE] text-[#0EA5E9] flex items-center justify-center shrink-0 group-hover:bg-[#0EA5E9] group-hover:text-white transition-colors">
                            <FileText size={18} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[13px] font-bold text-foreground truncate">{doc.name}</p>
                            <p className="text-[11px] font-medium text-muted-foreground">Added {doc.date} • {doc.size}</p>
                          </div>
                          <MoreVertical size={16} className="text-muted-foreground" />
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>

              {/* Panel Footer */}
              <div className="p-6 border-t border-border bg-card shrink-0 grid grid-cols-2 gap-3">
                {selectedAsset.status === "Assigned" && (
                  <>
                    <button
                      onClick={() => openRecoverModal(selectedAsset)}
                      className="py-2.5 bg-[#FEF3C7] text-[#B45309] rounded-xl text-[13px] font-bold hover:bg-[#FDE68A] transition-colors"
                    >
                      Recover Asset
                    </button>
                    <button
                      onClick={() => {
                        toast.success("Transfer modal opened");
                      }}
                      className="py-2.5 bg-card border border-border text-foreground rounded-xl text-[13px] font-bold hover:bg-muted transition-colors"
                    >
                      Transfer Asset
                    </button>
                  </>
                )}
                {selectedAsset.status === "Available" && (
                  <button
                    onClick={() => openAssignModal(selectedAsset)}
                    className="col-span-2 py-2.5 bg-[#00B87C] text-white rounded-xl text-[13px] font-bold hover:bg-[#009665] transition-colors shadow-sm"
                  >
                    Assign Asset
                  </button>
                )}
                {["Pending Return", "Overdue", "Maintenance"].includes(
                  selectedAsset.status,
                ) && (
                  <>
                    <button className="py-2.5 bg-card border border-border text-foreground rounded-xl text-[13px] font-bold hover:bg-muted transition-colors">
                      Edit Asset
                    </button>
                    <button className="py-2.5 bg-card border border-border text-foreground rounded-xl text-[13px] font-bold hover:bg-muted transition-colors flex items-center justify-center gap-2">
                      <Download size={14} /> Download Report
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
