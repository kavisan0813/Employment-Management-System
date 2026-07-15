import { Search, LayoutGrid, List, Users, X, ChevronDown } from "lucide-react";

interface EmployeeFiltersProps {
  search: string;
  setSearch: (s: string) => void;
  selectedDept: string;
  setSelectedDept: (d: string) => void;
  selectedTeam: string;
  setSelectedTeam: (t: string) => void;
  selectedDesignation: string;
  setSelectedDesignation: (d: string) => void;
  selectedLocation: string;
  setSelectedLocation: (l: string) => void;
  selectedStatus: string;
  setSelectedStatus: (s: string) => void;
  selectedTypes: string[];
  toggleType: (t: string) => void;
  showTypeDropdown: boolean;
  setShowTypeDropdown: (b: boolean) => void;
  view: "table" | "grid" | "team";
  setView: (v: "table" | "grid" | "team") => void;
  activeChips: Array<{ id: string; label: string; onClear: () => void }>;
  clearFilters: () => void;
  departments: string[];
  uniqueTeams: string[];
  uniqueDesignations: string[];
  uniqueLocations: string[];
  uniqueTypes: string[];
  searchInputRef: React.RefObject<HTMLInputElement>;
}

export default function EmployeeFilters({
  search,
  setSearch,
  selectedDept,
  setSelectedDept,
  selectedTeam,
  setSelectedTeam,
  selectedDesignation,
  setSelectedDesignation,
  selectedLocation,
  setSelectedLocation,
  selectedStatus,
  setSelectedStatus,
  selectedTypes,
  toggleType,
  showTypeDropdown,
  setShowTypeDropdown,
  view,
  setView,
  activeChips,
  clearFilters,
  departments,
  uniqueTeams,
  uniqueDesignations,
  uniqueLocations,
  uniqueTypes,
  searchInputRef,
}: EmployeeFiltersProps) {
  const FilterChip = ({
    value,
    options,
    onChange,
  }: {
    value: string;
    options: string[];
    onChange: (v: string) => void;
  }) => (
    <div className="relative group shrink-0">
      <select
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
        }}
        disabled={options.length <= 1}
        className="appearance-none pl-4 pr-9 py-2 rounded-xl text-[13px] font-medium outline-none cursor-pointer transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        style={{
          backgroundColor: "var(--background)",
          border: "1px solid var(--border)",
          color: "var(--foreground)",
        }}
      >
        {options.map((opt: string) => (
          <option
            key={opt}
            value={opt}
            style={{
              backgroundColor: "var(--card)",
              color: "var(--foreground)",
            }}
          >
            {opt}
          </option>
        ))}
      </select>
      <ChevronDown
        size={14}
        className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
        style={{ color: "var(--muted-foreground)" }}
      />
    </div>
  );

  return (
    <div
      className="sticky top-0 z-20 rounded-2xl p-4 mb-6 shadow-sm"
      style={{
        backgroundColor: "var(--card)",
        border: "1px solid var(--border)",
        backdropFilter: "blur(12px)",
      }}
    >
      <div className="flex flex-col gap-4">
        {/* Search & View Toggles */}
        <div className="flex items-center gap-4">
          <div
            className="flex items-center gap-3 flex-1 rounded-xl px-4 relative"
            style={{
              backgroundColor: "var(--background)",
              border: "1px solid var(--border)",
              height: "44px",
            }}
          >
            <Search size={18} color="var(--muted-foreground)" />
            <input
              ref={searchInputRef}
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
              }}
              placeholder="Search by name, email, employee ID..."
              style={{
                border: "none",
                outline: "none",
                background: "transparent",
                fontSize: "14px",
                color: "var(--foreground)",
                width: "100%",
                paddingRight: "28px",
              }}
            />
            <kbd
              className="absolute right-4 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-[10px] font-sans font-bold rounded border pointer-events-none select-none"
              style={{
                borderColor: "var(--border)",
                backgroundColor: "var(--card)",
                color: "var(--muted-foreground)",
              }}
            >
              /
            </kbd>
          </div>

          <div
            className="flex items-center gap-1 bg-background p-1 rounded-xl border shrink-0"
            style={{
              backgroundColor: "var(--background)",
              padding: "4px",
              borderRadius: "10px",
              border: "1px solid var(--border)",
            }}
          >
            <button
              onClick={() => setView("table")}
              className="p-1.5 rounded-lg transition-colors"
              style={{
                backgroundColor:
                  view === "table" ? "var(--secondary)" : "transparent",
                color:
                  view === "table"
                    ? "var(--primary)"
                    : "var(--muted-foreground)",
                border: "none",
              }}
              title="Table View"
            >
              <List size={18} />
            </button>
            <button
              onClick={() => setView("grid")}
              className="p-1.5 rounded-lg transition-colors"
              style={{
                backgroundColor:
                  view === "grid" ? "var(--secondary)" : "transparent",
                color:
                  view === "grid"
                    ? "var(--primary)"
                    : "var(--muted-foreground)",
                border: "none",
              }}
              title="Grid View"
            >
              <LayoutGrid size={18} />
            </button>
            <button
              onClick={() => setView("team")}
              className="p-1.5 rounded-lg transition-colors"
              style={{
                backgroundColor:
                  view === "team" ? "var(--secondary)" : "transparent",
                color:
                  view === "team"
                    ? "var(--primary)"
                    : "var(--muted-foreground)",
                border: "none",
              }}
              title="Team View"
            >
              <Users size={18} />
            </button>
          </div>
        </div>

        {/* Active Filter Chips */}
        {activeChips.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mt-1">
            <span className="text-[12px] font-bold text-muted-foreground mr-1">
              Active filters:
            </span>
            {activeChips.map((chip) => (
              <div
                key={chip.id}
                className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-semibold border transition-all hover:bg-secondary/80"
                style={{
                  backgroundColor: "var(--background)",
                  borderColor: "var(--border)",
                  color: "var(--foreground)",
                }}
              >
                <span>{chip.label}</span>
                <button
                  onClick={chip.onClear}
                  className="p-0.5 rounded-full hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors border-none bg-transparent"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
            <button
              onClick={clearFilters}
              className="text-[12px] font-bold text-red-500 hover:text-red-600 transition-colors ml-2 py-1 px-2 rounded-lg hover:bg-red-500/5 border-none bg-transparent cursor-pointer"
            >
              Clear all
            </button>
          </div>
        )}

        {/* Main Filters (Department, Team, Designation, Location, Type, Status) */}
        <div className="flex items-center justify-between">
          <div
            className="flex flex-wrap items-center gap-3 pb-1"
            style={{ overflow: "visible" }}
          >
            <FilterChip
              value={selectedDept}
              options={departments}
              onChange={setSelectedDept}
            />
            <FilterChip
              value={selectedTeam}
              options={uniqueTeams}
              onChange={setSelectedTeam}
            />
            <FilterChip
              value={selectedDesignation}
              options={uniqueDesignations}
              onChange={setSelectedDesignation}
            />
            <FilterChip
              value={selectedLocation}
              options={uniqueLocations}
              onChange={setSelectedLocation}
            />

            {/* Employment Type Multi-Select */}
            <div className="relative shrink-0">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowTypeDropdown(!showTypeDropdown);
                }}
                className="flex items-center gap-2 pl-4 pr-3 py-2 rounded-xl text-[13px] font-medium outline-none cursor-pointer transition-colors"
                style={{
                  backgroundColor: "var(--background)",
                  border: "1px solid var(--border)",
                  color: "var(--foreground)",
                }}
              >
                Emp. Type{" "}
                {selectedTypes.length > 0 && (
                  <span
                    className="ml-1 px-1.5 rounded-md text-[11px]"
                    style={{
                      backgroundColor: "var(--secondary)",
                      color: "var(--primary)",
                    }}
                  >
                    {selectedTypes.length}
                  </span>
                )}
                <ChevronDown
                  size={14}
                  style={{ color: "var(--muted-foreground)" }}
                />
              </button>
              {showTypeDropdown && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowTypeDropdown(false);
                    }}
                  ></div>
                  <div
                    className="absolute top-full left-0 mt-1 w-48 rounded-xl shadow-xl z-20 py-2"
                    style={{
                      backgroundColor: "var(--card)",
                      border: "1px solid var(--border)",
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {uniqueTypes.map((t) => (
                      <label
                        key={t}
                        className="flex items-center gap-3 px-4 py-2 cursor-pointer transition-colors"
                        style={{ color: "var(--foreground)" }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.backgroundColor =
                            "var(--background)")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.backgroundColor =
                            "transparent")
                        }
                      >
                        <input
                          type="checkbox"
                          checked={selectedTypes.includes(t)}
                          onChange={() => {
                            toggleType(t);
                          }}
                          className="rounded focus:ring-emerald-500"
                          style={{ accentColor: "var(--primary)" }}
                        />
                        <span style={{ fontSize: "13px" }}>{t}</span>
                      </label>
                    ))}
                  </div>
                </>
              )}
            </div>

            <div
              className="w-px h-6 mx-2 shrink-0"
              style={{ backgroundColor: "var(--border)" }}
            ></div>

            {/* Status Tabs */}
            <div
              className="flex items-center p-1 rounded-xl shrink-0"
              style={{
                backgroundColor: "var(--background)",
                border: "1px solid var(--border)",
              }}
            >
              {["All", "Active", "Inactive"].map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    setSelectedStatus(s === "All" ? "All Status" : s);
                  }}
                  className="px-4 py-1.5 rounded-lg text-[13px] font-medium transition-colors border-none bg-transparent cursor-pointer"
                  style={{
                    backgroundColor:
                      selectedStatus === s ||
                      (s === "All" && selectedStatus === "All Status")
                        ? "var(--card)"
                        : "transparent",
                    color:
                      selectedStatus === s ||
                      (s === "All" && selectedStatus === "All Status")
                        ? "var(--foreground)"
                        : "var(--muted-foreground)",
                    boxShadow:
                      selectedStatus === s ||
                      (s === "All" && selectedStatus === "All Status")
                        ? "0 2px 4px rgba(0,0,0,0.05)"
                        : "none",
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
