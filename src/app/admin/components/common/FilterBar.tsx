import React from "react";
import { Search, ChevronDown, Plus } from "lucide-react";
import { cn } from "@/app/admin/lib/utils";

interface FilterBarProps {
  placeholder?: string;
  searchQuery?: string;
  onSearchChange?: (val: string) => void;
  filters?: string[];
  onFilterClick?: (filter: string) => void;
  actionLabel?: string;
  addLabel?: string;
  onActionClick?: () => void;
  className?: string;
}

export function FilterBar({
  placeholder = "Search...",
  searchQuery = "",
  onSearchChange,
  filters = ["Status", "Plan", "Region"],
  onFilterClick,
  actionLabel,
  addLabel,
  onActionClick,
  className
}: FilterBarProps) {
  const displayLabel = actionLabel || addLabel;

  return (
    <div
      className={cn(
        "flex flex-col gap-3 md:flex-row md:items-center justify-between pb-4 mb-4 border-b border-border/20",
        className
      )}
    >
      <div className="flex flex-1 flex-col gap-2.5 sm:flex-row sm:items-center">
        {/* Search Input */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/80 pointer-events-none" />
          <input
            type="text"
            placeholder={placeholder}
            value={searchQuery}
            onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
            className="w-full rounded-lg border border-border/60 bg-card py-2 pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground outline-none transition-all focus:border-primary/50 focus:ring-2 focus:ring-primary/10 dark:bg-card/30"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-2">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => onFilterClick && onFilterClick(filter)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border/60 bg-card px-3 py-2 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-all dark:bg-card/30"
            >
              {filter}
              <ChevronDown className="h-3.5 w-3.5 opacity-60" />
            </button>
          ))}
        </div>
      </div>

      {/* Optional action button */}
      {displayLabel && (
        <button
          onClick={onActionClick}
          className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-primary hover:bg-primary/95 text-primary-foreground font-medium text-xs sm:text-sm px-4 py-2 transition-all shadow-sm shadow-primary/20 hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
        >
          <Plus className="h-4 w-4 shrink-0" />
          {displayLabel}
        </button>
      )}
    </div>
  );
}
export default FilterBar;
