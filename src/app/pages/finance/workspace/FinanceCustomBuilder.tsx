import React, { useState, useMemo } from "react";
import {
  Database,
  Plus,
  CheckCircle2,
  X,
  GripVertical,
  Download,
  BarChartIcon,
  RefreshCw,
  Filter,
  Send,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from "recharts";
import { showToast } from "../../../components/workflow/ToastNotification";

// Constants & Types
const ALL_DIMENSIONS = [
  "Employee Name",
  "Department",
  "Location",
  "Band",
  "Joining Date",
  "Employee Type",
  "Branch",
];
const ALL_MEASURES = ["Basic", "Gross", "Net", "Deductions", "TDS", "PF"];
const AGGREGATIONS = ["SUM", "AVERAGE", "COUNT", "MIN", "MAX"];
const CHART_TYPES = [
  "Bar Chart",
  "Pie Chart",
  "Donut Chart",
  "Line Chart",
  "Area Chart",
  "Stacked Chart",
  "Horizontal Bar",
];
const CHART_COLORS = [
  "#00B87C",
  "#3B82F6",
  "#8B5CF6",
  "#F59E0B",
  "#EC4899",
  "#0EA5E9",
];

export interface ReportData {
  name: string;
  category: string;
  dims: string[];
  meas: string[];
}

export interface FinanceCustomBuilderProps {
  onSaveReport: (reportData: ReportData) => void;
  onExportTriggered: () => void;
  onEmailTriggered: () => void;
}

export function FinanceCustomBuilder({
  onSaveReport,
  onExportTriggered,
}: FinanceCustomBuilderProps) {
  // State: Selection
  const [selectedDims, setSelectedDims] = useState<string[]>([]);
  const [selectedMeas, setSelectedMeas] = useState<string[]>([]);
  const [measAggregations, setMeasAggregations] = useState<
    Record<string, string>
  >({});

  // State: Config
  const [groupBy, setGroupBy] = useState<string>("Department");
  const [chartType, setChartType] = useState<string>("Bar Chart");
  const [previewMode, setPreviewMode] = useState<"Table" | "Chart">("Table");
  const [isGenerated, setIsGenerated] = useState(false);

  // State: Filters
  const [filters, setFilters] = useState({
    dateRange: "This Month",
    department: "All",
    location: "All",
  });

  // State: Drag & Drop
  const [draggedItem, setDraggedItem] = useState<{
    type: "dim" | "meas";
    id: string;
  } | null>(null);

  // State: Modals
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [saveName, setSaveName] = useState("");
  const [saveCategory, setSaveCategory] = useState("Custom");
  const [saveVisibility, setSaveVisibility] = useState<
    "Private" | "Finance Team" | "Public"
  >("Finance Team");

  // Handlers
  const handleAddDim = (dim: string) => {
    if (!selectedDims.includes(dim)) {
      setSelectedDims([...selectedDims, dim]);
      setIsGenerated(false);
    }
  };

  const handleAddMeas = (meas: string) => {
    if (!selectedMeas.includes(meas)) {
      setSelectedMeas([...selectedMeas, meas]);
      setMeasAggregations((prev) => ({ ...prev, [meas]: "SUM" }));
      setIsGenerated(false);
    }
  };

  const handleRemoveDim = (dim: string) => {
    setSelectedDims(selectedDims.filter((d) => d !== dim));
    setIsGenerated(false);
  };

  const handleRemoveMeas = (meas: string) => {
    setSelectedMeas(selectedMeas.filter((m) => m !== meas));
    const newAggs = { ...measAggregations };
    delete newAggs[meas];
    setMeasAggregations(newAggs);
    setIsGenerated(false);
  };

  const handleGenerate = () => {
    if (selectedDims.length === 0 || selectedMeas.length === 0) {
      showToast(
        "Validation Error",
        "error",
        "Please select at least one dimension and one measure.",
      );
      return;
    }
    setIsGenerated(true);
    showToast(
      "Report Generated",
      "success",
      "Your custom report has been generated successfully.",
    );
  };

  const handleSaveSubmit = () => {
    if (!saveName.trim()) {
      showToast("Validation Error", "error", "Please provide a report name.");
      return;
    }
    onSaveReport({
      name: saveName,
      category: saveCategory,
      dims: selectedDims,
      meas: selectedMeas,
    });
    setShowSaveModal(false);
    showToast(
      "Report Saved",
      "success",
      `Report "${saveName}" saved to history.`,
    );
    setSaveName("");
  };

  const handleEmailSubmit = () => {
    setShowEmailModal(false);
    showToast(
      "Email Sent",
      "success",
      "Report has been successfully emailed to recipients.",
    );
  };

  // Drag and Drop (Simple array reordering)
  const handleDragStart = (
    e: React.DragEvent,
    type: "dim" | "meas",
    item: string,
  ) => {
    setDraggedItem({ type, id: item });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (
    e: React.DragEvent,
    type: "dim" | "meas",
    targetItem: string,
  ) => {
    e.preventDefault();
    if (
      !draggedItem ||
      draggedItem.type !== type ||
      draggedItem.id === targetItem
    )
      return;

    if (type === "dim") {
      const newList = [...selectedDims];
      const fromIndex = newList.indexOf(draggedItem.id);
      const toIndex = newList.indexOf(targetItem);
      newList.splice(fromIndex, 1);
      newList.splice(toIndex, 0, draggedItem.id);
      setSelectedDims(newList);
    } else {
      const newList = [...selectedMeas];
      const fromIndex = newList.indexOf(draggedItem.id);
      const toIndex = newList.indexOf(targetItem);
      newList.splice(fromIndex, 1);
      newList.splice(toIndex, 0, draggedItem.id);
      setSelectedMeas(newList);
    }
    setDraggedItem(null);
    setIsGenerated(false);
  };

  // Mock Data Generation
  const mockData = useMemo(() => {
    if (!isGenerated) return [];
    // Generate some stable mock data based on group by or dimensions
    const bases = [
      "Engineering",
      "Finance",
      "Sales",
      "HR",
      "Marketing",
      "Operations",
    ];
    return bases.map((base, idx) => {
      const obj: Record<string, string | number> = { id: idx, [groupBy]: base };
      // Add mock strings for dims
      selectedDims.forEach((dim) => {
        if (dim !== groupBy) obj[dim] = `${dim} ${idx + 1}`;
      });
      // Add mock numbers for measures
      selectedMeas.forEach((meas) => {
        const baseVal = (idx + 1) * 15000;
        obj[meas] =
          meas === "PF"
            ? baseVal * 0.1
            : meas === "TDS"
              ? baseVal * 0.2
              : baseVal;
      });
      return obj;
    });
  }, [
    isGenerated,
    selectedDims,
    selectedMeas,
    groupBy,
    measAggregations,
    filters,
  ]);

  // Render Left Panel Items
  const renderFieldItem = (
    name: string,
    isAdded: boolean,
    onAdd: () => void,
    colorClass: string,
  ) => (
    <div
      onClick={!isAdded ? onAdd : undefined}
      className={`group flex items-center justify-between p-3 rounded-xl border transition-all ${
        isAdded
          ? `bg-${colorClass}-500/10 border-${colorClass}-500/30 text-foreground cursor-default`
          : "bg-card border-border hover:border-primary/50 cursor-pointer"
      }`}
    >
      <span className="text-[13px] font-bold text-foreground">{name}</span>
      {isAdded ? (
        <span
          className={`flex items-center gap-1 text-[11px] font-bold uppercase tracking-widest text-${colorClass}-500`}
        >
          <CheckCircle2 size={14} /> Added
        </span>
      ) : (
        <button className="w-6 h-6 rounded-md flex items-center justify-center bg-muted/50 text-muted-foreground group-hover:bg-primary group-hover:text-white transition-colors">
          <Plus size={14} />
        </button>
      )}
    </div>
  );

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full min-h-[600px]">
      {/* Field Picker */}
      <div className="lg:w-[320px] bg-card border border-border rounded-[32px] p-6 shadow-sm flex flex-col">
        <h3 className="text-[14px] font-black text-foreground tracking-tight uppercase mb-6 flex items-center gap-2">
          <Database size={16} className="text-primary" />
          Field Picker
        </h3>
        <div className="flex-1 overflow-y-auto space-y-8 pr-2 custom-scrollbar">
          {/* Dimensions */}
          <div>
            <h4 className="text-[11px] font-black text-muted-foreground uppercase tracking-widest mb-3">
              Dimensions
            </h4>
            <div className="space-y-2">
              {ALL_DIMENSIONS.map((dim) =>
                renderFieldItem(
                  dim,
                  selectedDims.includes(dim),
                  () => handleAddDim(dim),
                  "blue",
                ),
              )}
            </div>
          </div>
          {/* Measures */}
          <div>
            <h4 className="text-[11px] font-black text-muted-foreground uppercase tracking-widest mb-3">
              Measures
            </h4>
            <div className="space-y-2">
              {ALL_MEASURES.map((meas) =>
                renderFieldItem(
                  meas,
                  selectedMeas.includes(meas),
                  () => handleAddMeas(meas),
                  "emerald",
                ),
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Canvas Area */}
      <div className="flex-1 bg-card border border-border rounded-[32px] overflow-hidden shadow-sm flex flex-col">
        {/* Top Controls / Filters */}
        <div className="p-4 border-b border-border bg-muted/10 flex flex-wrap gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-4 items-center">
            {/* Group By */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-black text-muted-foreground uppercase tracking-widest">
                Group By
              </span>
              <select
                value={groupBy}
                onChange={(e) => {
                  setGroupBy(e.target.value);
                  setIsGenerated(false);
                }}
                className="bg-card border border-border rounded-lg text-[13px] font-bold text-foreground px-3 py-1.5 focus:border-primary outline-none"
              >
                {ALL_DIMENSIONS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
            <div className="w-px h-6 bg-border mx-2"></div>
            {/* Basic Filters */}
            <div className="flex items-center gap-2">
              <Filter size={14} className="text-muted-foreground" />
              <select className="bg-card border border-border rounded-lg text-[13px] font-bold text-foreground px-3 py-1.5 outline-none">
                <option>This Month</option>
                <option>Last Month</option>
                <option>Q1 2026</option>
                <option>YTD</option>
              </select>
              <select className="bg-card border border-border rounded-lg text-[13px] font-bold text-foreground px-3 py-1.5 outline-none">
                <option>All Depts</option>
                <option>Finance</option>
                <option>Engineering</option>
              </select>
              <button
                onClick={() =>
                  setFilters({
                    dateRange: "This Month",
                    department: "All",
                    location: "All",
                  })
                }
                className="p-1.5 text-muted-foreground hover:text-foreground transition-colors"
                title="Reset Filters"
              >
                <RefreshCw size={14} />
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleGenerate}
              className="px-5 py-2 rounded-xl bg-primary text-white font-black text-[12px] uppercase tracking-widest hover:opacity-90 transition-all shadow-md"
            >
              Generate
            </button>
            <button
              onClick={() => setShowSaveModal(true)}
              className="px-4 py-2 rounded-xl border border-border text-foreground font-black text-[11px] uppercase tracking-widest hover:bg-muted transition-all"
            >
              Save Report
            </button>
            <button
              onClick={onExportTriggered}
              className="p-2 rounded-xl border border-border text-foreground hover:bg-muted transition-all"
              title="Download Options"
            >
              <Download size={18} />
            </button>
          </div>
        </div>

        {/* Selected Fields Area */}
        <div className="p-4 border-b border-border bg-card">
          <div className="mb-4">
            <h4 className="text-[11px] font-black text-muted-foreground uppercase tracking-widest mb-2">
              Selected Dimensions
            </h4>
            <div className="flex flex-wrap gap-2 min-h-[32px] p-2 rounded-xl border border-dashed border-border/50 bg-muted/5">
              {selectedDims.length === 0 && (
                <span className="text-[12px] text-muted-foreground/50 italic px-2">
                  Drag dimensions here...
                </span>
              )}
              {selectedDims.map((dim) => (
                <div
                  key={dim}
                  draggable
                  onDragStart={(e) => handleDragStart(e, "dim", dim)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, "dim", dim)}
                  className="flex items-center gap-1 bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 px-3 py-1.5 rounded-lg text-[13px] font-bold cursor-grab active:cursor-grabbing"
                >
                  <GripVertical size={14} className="opacity-50" />
                  {dim}
                  <button
                    onClick={() => handleRemoveDim(dim)}
                    className="ml-1 opacity-60 hover:opacity-100 hover:text-rose-500 transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-[11px] font-black text-muted-foreground uppercase tracking-widest mb-2">
              Selected Measures
            </h4>
            <div className="flex flex-wrap gap-2 min-h-[32px] p-2 rounded-xl border border-dashed border-border/50 bg-muted/5">
              {selectedMeas.length === 0 && (
                <span className="text-[12px] text-muted-foreground/50 italic px-2">
                  Drag measures here...
                </span>
              )}
              {selectedMeas.map((meas) => (
                <div
                  key={meas}
                  draggable
                  onDragStart={(e) => handleDragStart(e, "meas", meas)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, "meas", meas)}
                  className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 px-3 py-1.5 rounded-lg text-[13px] font-bold cursor-grab active:cursor-grabbing"
                >
                  <GripVertical size={14} className="opacity-50" />
                  {meas}
                  <select
                    value={measAggregations[meas]}
                    onChange={(e) => {
                      setMeasAggregations((prev) => ({
                        ...prev,
                        [meas]: e.target.value,
                      }));
                      setIsGenerated(false);
                    }}
                    className="bg-card/50 border border-emerald-500/30 rounded text-[10px] uppercase font-black px-1 ml-1 outline-none cursor-pointer"
                  >
                    {AGGREGATIONS.map((agg) => (
                      <option key={agg} value={agg}>
                        {agg}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => handleRemoveMeas(meas)}
                    className="ml-1 opacity-60 hover:opacity-100 hover:text-rose-500 transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Preview Tabs */}
        {!isGenerated &&
        selectedDims.length === 0 &&
        selectedMeas.length === 0 ? (
          <div className="flex-1 flex items-center justify-center p-12 bg-muted/5">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto opacity-50">
                <BarChartIcon size={40} className="text-muted-foreground" />
              </div>
              <div>
                <p className="text-[15px] font-black text-foreground tracking-tight uppercase">
                  Custom Builder Canvas
                </p>
                <p className="text-[12px] font-semibold text-muted-foreground mt-1">
                  Select fields from the left to start building your report.
                </p>
              </div>
            </div>
          </div>
        ) : !isGenerated ? (
          <div className="flex-1 flex items-center justify-center p-12 bg-muted/5">
            <div className="text-center">
              <p className="text-[14px] font-bold text-muted-foreground mb-4">
                You have unsaved changes to your report structure.
              </p>
              <button
                onClick={handleGenerate}
                className="px-6 py-2.5 rounded-xl bg-primary text-white font-black text-[13px] uppercase tracking-widest shadow-md hover:shadow-lg transition-all"
              >
                Generate Preview
              </button>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col bg-card">
            {/* Preview Tab Bar */}
            <div className="px-6 border-b border-border flex items-center justify-between">
              <div className="flex space-x-8">
                {(["Table", "Chart"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setPreviewMode(tab)}
                    className={`py-4 text-[13px] font-black uppercase tracking-widest relative ${
                      previewMode === tab
                        ? "text-primary"
                        : "text-muted-foreground hover:text-foreground"
                    } transition-colors`}
                  >
                    {tab} Preview
                    {previewMode === tab && (
                      <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-primary rounded-t-full" />
                    )}
                  </button>
                ))}
              </div>
              {previewMode === "Chart" && (
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-muted-foreground uppercase">
                    Type
                  </span>
                  <select
                    value={chartType}
                    onChange={(e) => setChartType(e.target.value)}
                    className="bg-muted/30 border border-border rounded-lg text-[12px] font-bold text-foreground px-2 py-1 outline-none"
                  >
                    {CHART_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Preview Content */}
            <div className="flex-1 p-6 overflow-y-auto">
              {previewMode === "Table" && (
                <div className="border border-border rounded-2xl overflow-hidden bg-card shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-border/50 bg-muted/20 text-[11px] font-black text-muted-foreground uppercase tracking-widest">
                          <th className="py-3 px-4">{groupBy}</th>
                          {selectedDims
                            .filter((d) => d !== groupBy)
                            .map((dim) => (
                              <th key={dim} className="py-3 px-4">
                                {dim}
                              </th>
                            ))}
                          {selectedMeas.map((meas) => (
                            <th key={meas} className="py-3 px-4 text-right">
                              {meas} ({measAggregations[meas]})
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {mockData.map((row, i) => (
                          <tr
                            key={i}
                            className="border-b border-border/50 hover:bg-muted/20 transition-colors group"
                          >
                            <td className="py-3 px-4 text-[13px] font-bold text-foreground">
                              {row[groupBy]}
                            </td>
                            {selectedDims
                              .filter((d) => d !== groupBy)
                              .map((dim) => (
                                <td
                                  key={dim}
                                  className="py-3 px-4 text-[13px] font-medium text-muted-foreground"
                                >
                                  {row[dim]}
                                </td>
                              ))}
                            {selectedMeas.map((meas) => (
                              <td
                                key={meas}
                                className="py-3 px-4 text-[13px] font-bold text-foreground text-right"
                              >
                                ₹{row[meas]?.toLocaleString()}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {/* Mock Pagination */}
                  <div className="px-4 py-3 border-t border-border flex items-center justify-between text-[12px] font-semibold text-muted-foreground">
                    <span>
                      Showing 1 to {mockData.length} of {mockData.length}{" "}
                      entries
                    </span>
                    <div className="flex gap-1">
                      <button
                        className="px-3 py-1 rounded-md border border-border hover:bg-muted disabled:opacity-50"
                        disabled
                      >
                        Prev
                      </button>
                      <button className="px-3 py-1 rounded-md border border-border bg-primary/10 text-primary">
                        1
                      </button>
                      <button
                        className="px-3 py-1 rounded-md border border-border hover:bg-muted disabled:opacity-50"
                        disabled
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {previewMode === "Chart" && (
                <div className="h-[400px] bg-card border border-border rounded-2xl p-6 shadow-sm">
                  <ResponsiveContainer width="100%" height="100%">
                    {chartType === "Bar Chart" ? (
                      <BarChart data={mockData}>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="rgba(255,255,255,0.06)"
                          vertical={false}
                        />
                        <XAxis
                          dataKey={groupBy}
                          tick={{ fill: "#9CA3AF", fontSize: 12 }}
                          axisLine={false}
                          tickLine={false}
                        />
                        <YAxis
                          tick={{ fill: "#9CA3AF", fontSize: 12 }}
                          axisLine={false}
                          tickLine={false}
                          tickFormatter={(v) => `₹${v / 1000}k`}
                        />
                        <Tooltip
                          cursor={{ fill: "rgba(255,255,255,0.05)" }}
                          contentStyle={{
                            backgroundColor: "#052E28",
                            border: "1px solid rgba(255,255,255,0.1)",
                            borderRadius: "12px",
                            color: "#fff",
                            fontWeight: "bold",
                          }}
                        />
                        <Legend
                          iconType="circle"
                          wrapperStyle={{
                            fontSize: "12px",
                            fontWeight: "bold",
                            paddingTop: "20px",
                          }}
                        />
                        {selectedMeas.map((meas, idx) => (
                          <Bar
                            key={meas}
                            dataKey={meas}
                            fill={CHART_COLORS[idx % CHART_COLORS.length]}
                            radius={[4, 4, 0, 0]}
                          />
                        ))}
                      </BarChart>
                    ) : chartType === "Line Chart" ? (
                      <LineChart data={mockData}>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="rgba(255,255,255,0.06)"
                          vertical={false}
                        />
                        <XAxis
                          dataKey={groupBy}
                          tick={{ fill: "#9CA3AF", fontSize: 12 }}
                          axisLine={false}
                          tickLine={false}
                        />
                        <YAxis
                          tick={{ fill: "#9CA3AF", fontSize: 12 }}
                          axisLine={false}
                          tickLine={false}
                          tickFormatter={(v) => `₹${v / 1000}k`}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#052E28",
                            border: "1px solid rgba(255,255,255,0.1)",
                            borderRadius: "12px",
                            color: "#fff",
                            fontWeight: "bold",
                          }}
                        />
                        <Legend
                          iconType="circle"
                          wrapperStyle={{
                            fontSize: "12px",
                            fontWeight: "bold",
                            paddingTop: "20px",
                          }}
                        />
                        {selectedMeas.map((meas, idx) => (
                          <Line
                            key={meas}
                            type="monotone"
                            dataKey={meas}
                            stroke={CHART_COLORS[idx % CHART_COLORS.length]}
                            strokeWidth={3}
                            dot={{ r: 4, strokeWidth: 2 }}
                            activeDot={{ r: 6 }}
                          />
                        ))}
                      </LineChart>
                    ) : chartType === "Area Chart" ? (
                      <AreaChart data={mockData}>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="rgba(255,255,255,0.06)"
                          vertical={false}
                        />
                        <XAxis
                          dataKey={groupBy}
                          tick={{ fill: "#9CA3AF", fontSize: 12 }}
                          axisLine={false}
                          tickLine={false}
                        />
                        <YAxis
                          tick={{ fill: "#9CA3AF", fontSize: 12 }}
                          axisLine={false}
                          tickLine={false}
                          tickFormatter={(v) => `₹${v / 1000}k`}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#052E28",
                            border: "1px solid rgba(255,255,255,0.1)",
                            borderRadius: "12px",
                            color: "#fff",
                            fontWeight: "bold",
                          }}
                        />
                        <Legend
                          iconType="circle"
                          wrapperStyle={{
                            fontSize: "12px",
                            fontWeight: "bold",
                            paddingTop: "20px",
                          }}
                        />
                        {selectedMeas.map((meas, idx) => (
                          <Area
                            key={meas}
                            type="monotone"
                            dataKey={meas}
                            fill={CHART_COLORS[idx % CHART_COLORS.length]}
                            stroke={CHART_COLORS[idx % CHART_COLORS.length]}
                            fillOpacity={0.2}
                            strokeWidth={2}
                          />
                        ))}
                      </AreaChart>
                    ) : chartType === "Pie Chart" ||
                      chartType === "Donut Chart" ? (
                      <PieChart>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#052E28",
                            border: "1px solid rgba(255,255,255,0.1)",
                            borderRadius: "12px",
                            color: "#fff",
                            fontWeight: "bold",
                          }}
                        />
                        <Legend
                          iconType="circle"
                          wrapperStyle={{
                            fontSize: "12px",
                            fontWeight: "bold",
                            paddingTop: "20px",
                          }}
                        />
                        <Pie
                          data={mockData}
                          dataKey={selectedMeas[0]}
                          nameKey={groupBy}
                          cx="50%"
                          cy="50%"
                          innerRadius={chartType === "Donut Chart" ? 80 : 0}
                          outerRadius={120}
                          paddingAngle={chartType === "Donut Chart" ? 5 : 0}
                          labelLine={false}
                          label={({ percent }) =>
                            `${(percent * 100).toFixed(0)}%`
                          }
                        >
                          {mockData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={CHART_COLORS[index % CHART_COLORS.length]}
                            />
                          ))}
                        </Pie>
                      </PieChart>
                    ) : (
                      // Fallback Bar for Horizontal and Stacked (can expand later)
                      <BarChart
                        data={mockData}
                        layout={
                          chartType === "Horizontal Bar"
                            ? "vertical"
                            : "horizontal"
                        }
                      >
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="rgba(255,255,255,0.06)"
                          horizontal={chartType !== "Horizontal Bar"}
                          vertical={chartType === "Horizontal Bar"}
                        />
                        {chartType === "Horizontal Bar" ? (
                          <>
                            <XAxis
                              type="number"
                              tick={{ fill: "#9CA3AF", fontSize: 12 }}
                              axisLine={false}
                              tickLine={false}
                            />
                            <YAxis
                              type="category"
                              dataKey={groupBy}
                              tick={{ fill: "#9CA3AF", fontSize: 12 }}
                              axisLine={false}
                              tickLine={false}
                            />
                          </>
                        ) : (
                          <>
                            <XAxis
                              dataKey={groupBy}
                              tick={{ fill: "#9CA3AF", fontSize: 12 }}
                              axisLine={false}
                              tickLine={false}
                            />
                            <YAxis
                              tick={{ fill: "#9CA3AF", fontSize: 12 }}
                              axisLine={false}
                              tickLine={false}
                            />
                          </>
                        )}
                        <Tooltip
                          cursor={{ fill: "rgba(255,255,255,0.05)" }}
                          contentStyle={{
                            backgroundColor: "#052E28",
                            border: "1px solid rgba(255,255,255,0.1)",
                            borderRadius: "12px",
                            color: "#fff",
                            fontWeight: "bold",
                          }}
                        />
                        <Legend
                          iconType="circle"
                          wrapperStyle={{
                            fontSize: "12px",
                            fontWeight: "bold",
                            paddingTop: "20px",
                          }}
                        />
                        {selectedMeas.map((meas, idx) => (
                          <Bar
                            key={meas}
                            dataKey={meas}
                            fill={CHART_COLORS[idx % CHART_COLORS.length]}
                            stackId={
                              chartType === "Stacked Chart" ? "a" : undefined
                            }
                            radius={
                              chartType === "Horizontal Bar"
                                ? [0, 4, 4, 0]
                                : [4, 4, 0, 0]
                            }
                          />
                        ))}
                      </BarChart>
                    )}
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Save Report Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-card w-full max-w-md rounded-[32px] border border-border shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h3 className="text-[16px] font-black text-foreground uppercase tracking-widest">
                Save Custom Report
              </h3>
              <button
                onClick={() => setShowSaveModal(false)}
                className="p-2 rounded-xl text-muted-foreground hover:bg-muted transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            <div className="p-6 overflow-y-auto space-y-5">
              <div className="space-y-2">
                <label className="text-[11px] font-black text-muted-foreground uppercase tracking-widest">
                  Report Name
                </label>
                <input
                  type="text"
                  value={saveName}
                  onChange={(e) => setSaveName(e.target.value)}
                  placeholder="e.g. Q1 Overhead Analysis"
                  className="w-full bg-muted/20 border border-border rounded-xl px-4 py-2.5 text-[13px] font-bold text-foreground outline-none focus:border-primary transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-black text-muted-foreground uppercase tracking-widest">
                  Category
                </label>
                <select
                  value={saveCategory}
                  onChange={(e) => setSaveCategory(e.target.value)}
                  className="w-full bg-muted/20 border border-border rounded-xl px-4 py-2.5 text-[13px] font-bold text-foreground outline-none focus:border-primary transition-colors"
                >
                  <option value="Payroll">Payroll</option>
                  <option value="Expense">Expense</option>
                  <option value="Asset">Asset</option>
                  <option value="Tax">Tax</option>
                  <option value="Custom">Custom</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-black text-muted-foreground uppercase tracking-widest">
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Briefly describe this report..."
                  className="w-full bg-muted/20 border border-border rounded-xl px-4 py-2.5 text-[13px] font-medium text-foreground outline-none focus:border-primary transition-colors resize-none"
                ></textarea>
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-black text-muted-foreground uppercase tracking-widest">
                  Visibility
                </label>
                <div className="flex gap-4">
                  {(["Private", "Finance Team", "Public"] as const).map(
                    (vis) => (
                      <label
                        key={vis}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <input
                          type="radio"
                          name="visibility"
                          checked={saveVisibility === vis}
                          onChange={() => setSaveVisibility(vis)}
                          className="accent-primary"
                        />
                        <span className="text-[13px] font-bold text-foreground">
                          {vis}
                        </span>
                      </label>
                    ),
                  )}
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-border flex justify-end gap-3 bg-muted/10">
              <button
                onClick={() => setShowSaveModal(false)}
                className="px-5 py-2.5 rounded-xl border border-border text-foreground font-black text-[12px] uppercase tracking-widest hover:bg-muted transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveSubmit}
                className="px-5 py-2.5 rounded-xl bg-primary text-white font-black text-[12px] uppercase tracking-widest hover:opacity-90 transition-all shadow-md"
              >
                Save Report
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Email Report Modal */}
      {showEmailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-card w-full max-w-md rounded-[32px] border border-border shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h3 className="text-[16px] font-black text-foreground uppercase tracking-widest">
                Email Report
              </h3>
              <button
                onClick={() => setShowEmailModal(false)}
                className="p-2 rounded-xl text-muted-foreground hover:bg-muted transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            <div className="p-6 overflow-y-auto space-y-5">
              <div className="space-y-2">
                <label className="text-[11px] font-black text-muted-foreground uppercase tracking-widest">
                  Recipient
                </label>
                <input
                  type="email"
                  placeholder="john@example.com"
                  className="w-full bg-muted/20 border border-border rounded-xl px-4 py-2.5 text-[13px] font-bold text-foreground outline-none focus:border-primary transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-black text-muted-foreground uppercase tracking-widest">
                  CC
                </label>
                <input
                  type="email"
                  placeholder="jane@example.com"
                  className="w-full bg-muted/20 border border-border rounded-xl px-4 py-2.5 text-[13px] font-bold text-foreground outline-none focus:border-primary transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-black text-muted-foreground uppercase tracking-widest">
                  Subject
                </label>
                <input
                  type="text"
                  defaultValue="Custom Report Data"
                  className="w-full bg-muted/20 border border-border rounded-xl px-4 py-2.5 text-[13px] font-bold text-foreground outline-none focus:border-primary transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-black text-muted-foreground uppercase tracking-widest">
                  Message
                </label>
                <textarea
                  rows={3}
                  defaultValue="Please find the attached custom report data."
                  className="w-full bg-muted/20 border border-border rounded-xl px-4 py-2.5 text-[13px] font-medium text-foreground outline-none focus:border-primary transition-colors resize-none"
                ></textarea>
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-black text-muted-foreground uppercase tracking-widest">
                  Attachment Type
                </label>
                <select className="w-full bg-muted/20 border border-border rounded-xl px-4 py-2.5 text-[13px] font-bold text-foreground outline-none focus:border-primary transition-colors">
                  <option>PDF Document (.pdf)</option>
                  <option>Excel Spreadsheet (.xlsx)</option>
                  <option>CSV Data (.csv)</option>
                </select>
              </div>
            </div>
            <div className="p-6 border-t border-border flex justify-end gap-3 bg-muted/10">
              <button
                onClick={() => setShowEmailModal(false)}
                className="px-5 py-2.5 rounded-xl border border-border text-foreground font-black text-[12px] uppercase tracking-widest hover:bg-muted transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleEmailSubmit}
                className="px-5 py-2.5 rounded-xl bg-[#00B87C] text-white font-black text-[12px] uppercase tracking-widest hover:opacity-90 transition-all shadow-md flex items-center gap-2"
              >
                <Send size={14} /> Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
