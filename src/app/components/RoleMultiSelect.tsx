import React from "react";
import { AlertCircle, Loader2, Check } from "lucide-react";

export interface RoleOption {
  value: string;
  label: string;
  alwaysOn?: boolean;
}

interface RoleMultiSelectProps {
  options: RoleOption[];
  selectedIds: string[];
  onChange: (ids: string[]) => void;
  loading?: boolean;
  error?: string;
  emptyStateText?: string;
}

export function RoleMultiSelect({
  options,
  selectedIds,
  onChange,
  loading = false,
  error,
  emptyStateText = "No assignable roles found.",
}: RoleMultiSelectProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center p-6 border border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
        <Loader2 className="w-5 h-5 animate-spin text-[var(--primary)] mr-2" />
        <span className="text-sm font-medium text-slate-500">Loading assignable roles...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-start gap-3 p-4 border border-rose-100 rounded-2xl bg-rose-50/30 text-rose-600">
        <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
        <div>
          <h5 className="text-sm font-bold">Failed to load roles</h5>
          <p className="text-xs text-rose-500 mt-0.5">{error}</p>
        </div>
      </div>
    );
  }

  if (options.length === 0) {
    return (
      <div className="p-4 border border-dashed border-slate-200 rounded-2xl bg-slate-50/50 text-center">
        <p className="text-xs text-slate-400 font-medium leading-relaxed">{emptyStateText}</p>
      </div>
    );
  }

  const handleToggle = (value: string, alwaysOn?: boolean) => {
    // If the option is alwaysOn and currently selected, don't allow toggling off if it's the only role
    if (alwaysOn && selectedIds.includes(value) && selectedIds.length === 1) {
      return;
    }

    const isSelected = selectedIds.includes(value);
    let newSelected: string[];
    if (isSelected) {
      newSelected = selectedIds.filter((id) => id !== value);
    } else {
      newSelected = [...selectedIds, value];
    }
    onChange(newSelected);
  };

  return (
    <div className="space-y-3">
      {options.map((option) => {
        const isChecked = selectedIds.includes(option.value);
        const isDisabled = option.alwaysOn && isChecked && selectedIds.length === 1;

        return (
          <div
            key={option.value}
            onClick={() => !isDisabled && handleToggle(option.value, option.alwaysOn)}
            className={`group flex items-center justify-between rounded-2xl border-2 px-4 py-3.5 cursor-pointer select-none transition-all duration-200 ${
              isChecked
                ? "border-[var(--primary)] bg-emerald-50/10 shadow-sm"
                : "border-slate-200 hover:border-slate-300 hover:bg-slate-50/30"
            } ${isDisabled ? "cursor-not-allowed opacity-80" : ""}`}
          >
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-slate-300 text-[var(--primary)] focus:ring-0 cursor-pointer disabled:cursor-not-allowed"
                checked={isChecked}
                disabled={isDisabled}
                onChange={() => {}} // Controlled in onClick container
              />
              <div>
                <span className="text-sm font-bold text-slate-800 transition-colors group-hover:text-slate-900">
                  {option.label}
                </span>
                {option.alwaysOn && (
                  <span className="ml-2 inline-flex items-center rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-600">
                    Required
                  </span>
                )}
              </div>
            </div>
            {isChecked && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--primary)] text-white">
                <Check className="h-3 w-3 stroke-[3]" />
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
