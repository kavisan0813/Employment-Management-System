import React, { useState } from "react";
import { X, Package, Check, AlertCircle } from "lucide-react";
import { Plan, PlanTier, DEFAULT_PLAN_FEATURES } from "../types/plan.types";

interface PlanFormProps {
  plan: Plan | null;
  isEditing: boolean;
  onSave: (data: Partial<Plan>) => void;
  onClose: () => void;
}

const inputClass =
  "w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-xs text-gray-900 focus:bg-white focus:border-indigo-400 focus:ring-1 focus:ring-indigo-100 outline-none transition-colors";

export function PlanForm({ plan, isEditing, onSave, onClose }: PlanFormProps) {
  const [name, setName] = useState(plan?.name || "");
  const [tier, setTier] = useState<PlanTier>(plan?.tier || "Starter");
  const [description, setDescription] = useState(plan?.description || "");
  const [monthlyPrice, setMonthlyPrice] = useState(plan?.monthlyPrice || 0);
  const [annualPrice, setAnnualPrice] = useState(plan?.annualPrice || 0);
  const [maxUsers, setMaxUsers] = useState(plan?.maxUsers || 10);
  const [maxStorage, setMaxStorage] = useState(plan?.maxStorage || "5 GB");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Plan name is required.");
      return;
    }
    if (monthlyPrice <= 0) {
      setError("Monthly price must be greater than 0.");
      return;
    }
    setError("");
    onSave({
      name,
      tier,
      description,
      monthlyPrice,
      annualPrice: annualPrice || monthlyPrice * 10,
      maxUsers,
      maxStorage,
      features: DEFAULT_PLAN_FEATURES[tier],
    });
  };

  return (
    <div
      className="fixed inset-0 bg-gray-900/40 backdrop-blur-xs flex items-center  justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-2xl w-full max-w-lg"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between font-semibold">
          <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
            <Package className="w-4 h-4 text-indigo-600" />
            {isEditing ? `Edit Plan • ${plan?.name}` : "Create New Plan"}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          {error && (
            <div className="flex items-center gap-2 bg-rose-50 border border-rose-200 rounded-lg p-2.5 text-rose-700 text-[11px]">
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-semibold tracking-wide text-gray-400">
                Plan name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Business Pro"
                className={inputClass}
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-semibold tracking-wide text-gray-400">
                Tier
              </label>
              <select
                value={tier}
                onChange={(e) => setTier(e.target.value as PlanTier)}
                className={inputClass}
              >
                <option value="Starter">Starter</option>
                <option value="Growth">Growth</option>
                <option value="Enterprise">Enterprise</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase font-semibold tracking-wide text-gray-400">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the plan features and ideal customer..."
              rows={2}
              className={`${inputClass} resize-none`}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-semibold tracking-wide text-gray-400">
                Monthly price (USD) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                min={0}
                value={monthlyPrice}
                onChange={(e) => setMonthlyPrice(Number(e.target.value))}
                className={inputClass}
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-semibold tracking-wide text-gray-400">
                Annual price (USD)
              </label>
              <input
                type="number"
                min={0}
                value={annualPrice}
                onChange={(e) => setAnnualPrice(Number(e.target.value))}
                placeholder="Auto: monthly × 10"
                className={inputClass}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-semibold tracking-wide text-gray-400">
                Max users
              </label>
              <input
                type="number"
                min={1}
                value={maxUsers}
                onChange={(e) => setMaxUsers(Number(e.target.value))}
                className={inputClass}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-semibold tracking-wide text-gray-400">
                Max storage
              </label>
              <input
                type="text"
                value={maxStorage}
                onChange={(e) => setMaxStorage(e.target.value)}
                placeholder="e.g. 50 GB"
                className={inputClass}
              />
            </div>
          </div>

          {/* Feature preview */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 space-y-1.5">
            <span className="text-[10px] uppercase font-semibold tracking-wide text-gray-400">
              Included Features ({tier})
            </span>
            <div className="grid grid-cols-2 gap-1">
              {DEFAULT_PLAN_FEATURES[tier].map((feat) => (
                <div
                  key={feat.name}
                  className="flex items-center gap-1.5 text-[11px]"
                >
                  {feat.included ? (
                    <Check className="w-3 h-3 text-emerald-500" />
                  ) : (
                    <X className="w-3 h-3 text-gray-300" />
                  )}
                  <span
                    className={
                      feat.included ? "text-gray-700" : "text-gray-400"
                    }
                  >
                    {feat.name}
                    {feat.limit && (
                      <span className="text-gray-400 ml-1">({feat.limit})</span>
                    )}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-sm cursor-pointer"
            >
              {isEditing ? "Save Changes" : "Create Plan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PlanForm;
