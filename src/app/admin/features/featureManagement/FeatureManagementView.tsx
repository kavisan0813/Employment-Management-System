import React, { useState, useEffect } from "react";
import {
  ToggleLeft,
  Plus,
  Search,
  Settings,
  X,
  Play,
  Pause,
  AlertCircle,
} from "lucide-react";
import { db } from "../../mockData";
import { FeatureFlag } from "../../types";
import { toast } from "sonner";

export default function FeatureManagementView() {
  const [flags, setFlags] = useState<FeatureFlag[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form State
  const [newFlag, setNewFlag] = useState({
    key: "",
    name: "",
    description: "",
    category: "Core" as "Core" | "Beta" | "Experimental" | "Deprecated",
    status: "Active" as "Active" | "Inactive",
    defaultState: true,
    rolloutPct: 100,
  });

  // Load flags
  useEffect(() => {
    setFlags(db.featureFlags.get());
  }, []);

  const handleToggleStatus = (id: string) => {
    const updatedFlags = flags.map((flag) => {
      if (flag.id === id) {
        const nextStatus: "Active" | "Inactive" =
          flag.status === "Active" ? "Inactive" : "Active";
        toast.success(
          `Feature Flag "${flag.name}" status updated to ${nextStatus}.`,
        );
        return {
          ...flag,
          status: nextStatus,
          updatedAt: new Date().toISOString(),
        };
      }
      return flag;
    });

    setFlags(updatedFlags);
    db.featureFlags.save(updatedFlags);
  };

  const handleAddFlagSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newFlag.key || !newFlag.name) {
      toast.error("Please enter both key and name.");
      return;
    }

    // Verify key uniqueness
    const keyExists = flags.some(
      (f) => f.key.toLowerCase() === newFlag.key.toLowerCase(),
    );
    if (keyExists) {
      toast.error(`Feature Flag key "${newFlag.key}" already exists.`);
      return;
    }

    const createdFlag: FeatureFlag = {
      id: `flag-${Date.now()}`,
      key: newFlag.key.replace(/\s+/g, "_").toLowerCase(),
      name: newFlag.name,
      description: newFlag.description,
      category: newFlag.category,
      status: newFlag.status,
      defaultState: newFlag.defaultState,
      rolloutPct: Number(newFlag.rolloutPct),
      enabledPlans: ["Enterprise"],
      enabledOrgIds: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updatedList = [createdFlag, ...flags];
    setFlags(updatedList);
    db.featureFlags.save(updatedList);
    setIsAddModalOpen(false);

    // Reset Form
    setNewFlag({
      key: "",
      name: "",
      description: "",
      category: "Core",
      status: "Active",
      defaultState: true,
      rolloutPct: 100,
    });

    toast.success(`Feature Flag "${createdFlag.name}" successfully created.`);
  };

  // Filters logic
  const filteredFlags = flags.filter((flag) => {
    const matchesSearch =
      flag.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      flag.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
      flag.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      categoryFilter === "ALL" || flag.category === categoryFilter;
    const matchesStatus =
      statusFilter === "ALL" || flag.status === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const categories = Array.from(new Set(flags.map((f) => f.category)));

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-1.5 py-4 font-medium">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between pb-5 border-b border-gray-200 gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 flex items-center gap-2">
            <ToggleLeft className="w-6 h-6 text-indigo-600" />
            Feature Flag Policies
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Configure system capabilities, beta access, and live rollout
            percentages across organizations.
          </p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-bold shadow-sm transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add Feature Flag
        </button>
      </div>

      {/* Filters Bar */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative flex items-center bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 flex-1 min-w-[200px] w-full">
          <Search className="w-4 h-4 text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Search feature keys, names, or descriptions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-none text-sm w-full focus:outline-none text-gray-800"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-white border border-gray-200 text-sm rounded-lg px-3 py-2 outline-none font-medium text-gray-700 cursor-pointer w-full md:w-auto"
          >
            <option value="ALL">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-white border border-gray-200 text-sm rounded-lg px-3 py-2 outline-none font-medium text-gray-700 cursor-pointer w-full md:w-auto"
          >
            <option value="ALL">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFlags.map((flag) => {
          const isActive = flag.status === "Active";
          return (
            <div
              key={flag.id}
              className={`bg-white rounded-2xl border p-5 flex flex-col justify-between shadow-xs transition-all relative ${
                isActive
                  ? "border-gray-200 hover:border-indigo-300 hover:shadow-md"
                  : "border-gray-150 bg-gray-50/30 opacity-80"
              }`}
            >
              <div>
                {/* Badge Category & Status */}
                <div className="flex items-center justify-between mb-3.5">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider ${
                      flag.category === "Core"
                        ? "bg-blue-50 text-blue-700 border border-blue-100"
                        : flag.category === "Beta"
                          ? "bg-purple-50 text-purple-700 border border-purple-100"
                          : flag.category === "Experimental"
                            ? "bg-amber-50 text-amber-700 border border-amber-100"
                            : "bg-gray-50 text-gray-600 border border-gray-150"
                    }`}
                  >
                    {flag.category}
                  </span>

                  <button
                    onClick={() => handleToggleStatus(flag.id)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer border ${
                      isActive
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                        : "bg-gray-100 text-gray-500 border-gray-300 hover:bg-gray-200"
                    }`}
                  >
                    {isActive ? (
                      <Play className="w-3 h-3 fill-current" />
                    ) : (
                      <Pause className="w-3 h-3 fill-current" />
                    )}
                    {flag.status}
                  </button>
                </div>

                <h3 className="text-base font-bold text-gray-900 leading-tight">
                  {flag.name}
                </h3>
                <code className="text-xs text-gray-400 block mt-1 select-all font-mono">
                  {flag.key}
                </code>
                <p className="text-sm text-gray-600 mt-2.5 leading-relaxed min-h-[48px] line-clamp-3">
                  {flag.description}
                </p>
              </div>

              {/* Advanced configuration metadata */}
              <div className="border-t border-gray-100 mt-5 pt-4 flex flex-col gap-2">
                <div className="flex items-center justify-between text-xs text-gray-500 font-semibold">
                  <span>Default State:</span>
                  <span className="text-gray-900 font-bold">
                    {flag.defaultState ? "ON" : "OFF"}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500 font-semibold">
                  <span>Rollout Target:</span>
                  <span className="text-gray-900 font-bold">
                    {flag.rolloutPct}%
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500 font-semibold">
                  <span>Plans Locked:</span>
                  <span className="text-gray-700 truncate max-w-[150px]">
                    {flag.enabledPlans.join(", ") || "None"}
                  </span>
                </div>
              </div>
            </div>
          );
        })}

        {filteredFlags.length === 0 && (
          <div className="col-span-full bg-white rounded-2xl border border-gray-200 py-16 text-center text-gray-500 flex flex-col items-center justify-center gap-3">
            <AlertCircle className="w-8 h-8 text-gray-400" />
            <p className="text-sm">
              No feature flags found matching your filter criteria.
            </p>
          </div>
        )}
      </div>

      {/* Add Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-200 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-gray-150">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Settings className="w-5 h-5 text-indigo-600" />
                Create Feature Policy
              </h2>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddFlagSubmit} className="space-y-4 pt-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Feature Key (Unique ID)
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. intelligent_resume_matching"
                  value={newFlag.key}
                  onChange={(e) =>
                    setNewFlag({ ...newFlag, key: e.target.value })
                  }
                  className="w-full border border-gray-200 rounded-lg p-2.5 text-sm bg-gray-50 outline-none focus:bg-white focus:border-indigo-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Name Label
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AI Resume Matching v2"
                  value={newFlag.name}
                  onChange={(e) =>
                    setNewFlag({ ...newFlag, name: e.target.value })
                  }
                  className="w-full border border-gray-200 rounded-lg p-2.5 text-sm bg-gray-50 outline-none focus:bg-white focus:border-indigo-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Category
                </label>
                <select
                  value={newFlag.category}
                  onChange={(e) =>
                    setNewFlag({
                      ...newFlag,
                      category: e.target.value as
                        | "Core"
                        | "Beta"
                        | "Experimental"
                        | "Deprecated",
                    })
                  }
                  className="w-full border border-gray-200 rounded-lg p-2.5 text-sm bg-gray-50 outline-none focus:bg-white focus:border-indigo-500 transition-colors cursor-pointer font-semibold"
                >
                  <option value="Core">Core</option>
                  <option value="Beta">Beta</option>
                  <option value="Experimental">Experimental</option>
                  <option value="Deprecated">Deprecated</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Description
                </label>
                <textarea
                  placeholder="Summarize what capabilities this feature flag enables..."
                  value={newFlag.description}
                  onChange={(e) =>
                    setNewFlag({ ...newFlag, description: e.target.value })
                  }
                  className="w-full border border-gray-200 rounded-lg p-2.5 text-sm bg-gray-50 outline-none focus:bg-white focus:border-indigo-500 transition-colors min-h-[80px]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Rollout Percentage
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={newFlag.rolloutPct}
                    onChange={(e) =>
                      setNewFlag({
                        ...newFlag,
                        rolloutPct: Number(e.target.value),
                      })
                    }
                    className="w-full border border-gray-200 rounded-lg p-2.5 text-sm bg-gray-50 outline-none focus:bg-white focus:border-indigo-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Initial Status
                  </label>
                  <select
                    value={newFlag.status}
                    onChange={(e) =>
                      setNewFlag({ ...newFlag, status: e.target.value as any })
                    }
                    className="w-full border border-gray-200 rounded-lg p-2.5 text-sm bg-gray-50 outline-none focus:bg-white focus:border-indigo-500 transition-colors cursor-pointer font-semibold"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="defaultState"
                  checked={newFlag.defaultState}
                  onChange={(e) =>
                    setNewFlag({ ...newFlag, defaultState: e.target.checked })
                  }
                  className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer border-gray-300"
                />
                <label
                  htmlFor="defaultState"
                  className="text-xs font-bold text-gray-700 select-none cursor-pointer"
                >
                  Default Enabled (State value defaults to True)
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 border-t border-gray-150 pt-4 mt-6">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 border border-gray-200 text-gray-700 rounded-lg text-sm font-bold hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-bold transition-colors cursor-pointer shadow-sm"
                >
                  Create Policy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
