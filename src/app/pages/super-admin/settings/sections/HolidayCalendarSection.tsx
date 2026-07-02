import React from "react";
import { useSettingsContext } from "../SettingsContext";
import {
  MapPin,
  CalendarDays,
  PartyPopper,
  Star,
  ChevronRight,
  Calendar,
} from "lucide-react";

export function HolidayCalendarSection() {
  const {
    SectionTitle,
    holAutoMark,
    holLocFilter,
    holMonthFilter,
    holOptional,
    holRegionSpecific,
    holSearchQuery,
    holStatusFilter,
    holTypeFilter,
    holYearFilter,
    holidayViewMode,
    holidaysList,
    setActiveModal,
    setHolAutoMark,
    setHolLocFilter,
    setHolMonthFilter,
    setHolOptional,
    setHolRegionSpecific,
    setHolSearchQuery,
    setHolStatusFilter,
    setHolTypeFilter,
    setHolYearFilter,
    setHolidayForm,
    setHolidayViewMode,
    setHolidaysList,
    setSelectedHoliday,
    showToast,
  } = useSettingsContext();

  const filteredHols = holidaysList.filter((h) => {
    const matchesSearch = h.name
      .toLowerCase()
      .includes(holSearchQuery.toLowerCase());
    const matchesYear =
      holYearFilter === "All" || h.date.startsWith(holYearFilter);
    const matchesMonth =
      holMonthFilter === "All" ||
      new Date(h.date).getMonth() + 1 === parseInt(holMonthFilter);
    const matchesType = holTypeFilter === "All" || h.type === holTypeFilter;
    const matchesLoc = holLocFilter === "All" || h.location === holLocFilter;
    const matchesStatus =
      holStatusFilter === "All" || h.status === holStatusFilter;
    return (
      matchesSearch &&
      matchesYear &&
      matchesMonth &&
      matchesType &&
      matchesLoc &&
      matchesStatus
    );
  });

  return (
    <div>
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-4 text-[12px] font-medium">
        <span style={{ color: "var(--muted-foreground)" }}>Settings</span>
        <ChevronRight
          size={12}
          style={{ color: "var(--muted-foreground)" }}
        />
        <span style={{ color: "#00B87C" }}>Holidays</span>
      </div>

      {/* Content Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2
            style={{
              fontSize: "18px",
              fontWeight: 700,
              color: "var(--foreground)",
              margin: 0,
            }}
          >
            Holiday Management
          </h2>
          <p
            style={{
              fontSize: "13px",
              color: "var(--muted-foreground)",
              marginTop: "2px",
            }}
          >
            Manage global and regional business milestones
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => {
              const mockIndiaTemplate: HolidayRecord[] = [
                {
                  name: "Gandhi Jayanti",
                  date: "2026-10-02",
                  day: "Friday",
                  type: "National",
                  location: "All Locations",
                  dept: "All",
                  recurring: true,
                  status: "Active",
                  description: "Mahatma Gandhi Birthday",
                },
                {
                  name: "New Year's Day",
                  date: "2026-01-01",
                  day: "Thursday",
                  type: "Festival",
                  location: "All Locations",
                  dept: "All",
                  recurring: false,
                  status: "Active",
                  description: "New Year",
                },
              ];
              setHolidaysList([...holidaysList, ...mockIndiaTemplate]);
              showToast(
                "Indian holidays template imported successfully",
                "success",
              );
            }}
            className="px-4 py-2 text-sm font-bold rounded-xl border cursor-pointer transition-all"
            style={{
              backgroundColor: "transparent",
              borderColor: "var(--border)",
              color: "var(--foreground)",
            }}
          >
            Import Holidays
          </button>
          <button
            onClick={() => {
              setHolidayForm({
                name: "",
                date: "2026-01-01",
                type: "National",
                location: "All Locations",
                dept: "All",
                recurring: true,
                status: "Active",
                description: "",
              });
              setSelectedHoliday(null);
              setActiveModal("add_holiday");
            }}
            style={{
              backgroundColor: "#00B87C",
              color: "white",
              border: "none",
              borderRadius: "10px",
              padding: "8px 16px",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            + Add Holiday
          </button>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          {
            label: "Total Holidays",
            value: holidaysList.length,
            icon: <PartyPopper size={20} />,
            color: "#00B87C",
            bg: "rgba(0, 184, 124, 0.1)",
          },
          {
            label: "Upcoming Holidays",
            value: holidaysList.filter((h) => new Date(h.date) >= new Date())
              .length,
            icon: <CalendarDays size={20} />,
            color: "#0EA5E9",
            bg: "rgba(14, 165, 233, 0.1)",
          },
          {
            label: "Optional Holidays",
            value: holidaysList.filter((h) => h.type === "Optional").length,
            icon: <Star size={20} />,
            color: "#F59E0B",
            bg: "rgba(245, 158, 11, 0.1)",
          },
          {
            label: "Regional Holidays",
            value: holidaysList.filter((h) => h.type === "Regional").length,
            icon: <MapPin size={20} />,
            color: "#8B5CF6",
            bg: "rgba(139, 92, 246, 0.1)",
          },
        ].map((card, idx) => (
          <div
            key={idx}
            className="p-4 rounded-2xl flex items-center justify-between shadow-sm"
            style={{
              backgroundColor: "var(--card)",
              border: "1px solid var(--border)",
            }}
          >
            <div>
              <p
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  color: "var(--muted-foreground)",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  margin: 0,
                }}
              >
                {card.label}
              </p>
              <p
                style={{
                  fontSize: "22px",
                  fontWeight: 800,
                  color: "var(--foreground)",
                  marginTop: "4px",
                  marginBottom: 0,
                }}
              >
                {card.value}
              </p>
            </div>
            <div
              style={{
                padding: "10px",
                borderRadius: "12px",
                backgroundColor: card.bg,
                color: card.color,
              }}
            >
              {card.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Filter Bar */}
      <div
        className="p-4 rounded-xl flex flex-wrap items-center gap-3 mb-6"
        style={{
          backgroundColor: "var(--card)",
          border: "1px solid var(--border)",
        }}
      >
        <input
          type="text"
          placeholder="Search by name..."
          value={holSearchQuery}
          onChange={(e) => setHolSearchQuery(e.target.value)}
          className="rounded-xl px-4 py-2 text-sm outline-none border w-60 transition-all"
          style={{
            backgroundColor: "var(--input-background)",
            borderColor: "var(--border)",
            color: "var(--foreground)",
          }}
        />
        <select
          value={holYearFilter}
          onChange={(e) => setHolYearFilter(e.target.value)}
          className="rounded-xl px-3 py-2 text-sm outline-none border transition-all"
          style={{
            backgroundColor: "var(--input-background)",
            borderColor: "var(--border)",
            color: "var(--foreground)",
          }}
        >
          <option value="All">All Years</option>
          <option value="2025">2025</option>
          <option value="2026">2026</option>
        </select>
        <select
          value={holMonthFilter}
          onChange={(e) => setHolMonthFilter(e.target.value)}
          className="rounded-xl px-3 py-2 text-sm outline-none border transition-all"
          style={{
            backgroundColor: "var(--input-background)",
            borderColor: "var(--border)",
            color: "var(--foreground)",
          }}
        >
          <option value="All">All Months</option>
          {[
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
          ].map((m, i) => (
            <option key={m} value={i + 1}>
              {m}
            </option>
          ))}
        </select>
        <select
          value={holTypeFilter}
          onChange={(e) => setHolTypeFilter(e.target.value)}
          className="rounded-xl px-3 py-2 text-sm outline-none border transition-all"
          style={{
            backgroundColor: "var(--input-background)",
            borderColor: "var(--border)",
            color: "var(--foreground)",
          }}
        >
          <option value="All">All Types</option>
          <option value="National">National</option>
          <option value="Company">Company</option>
          <option value="Optional">Optional</option>
          <option value="Regional">Regional</option>
          <option value="Festival">Festival</option>
        </select>
        <select
          value={holLocFilter}
          onChange={(e) => setHolLocFilter(e.target.value)}
          className="rounded-xl px-3 py-2 text-sm outline-none border transition-all"
          style={{
            backgroundColor: "var(--input-background)",
            borderColor: "var(--border)",
            color: "var(--foreground)",
          }}
        >
          <option value="All">All Locations</option>
          <option value="All Locations">Global</option>
          <option value="Bengaluru HQ">Bengaluru HQ</option>
          <option value="Mumbai Branch">Mumbai Branch</option>
          <option value="Delhi Warehouse">Delhi Warehouse</option>
        </select>
        <select
          value={holStatusFilter}
          onChange={(e) => setHolStatusFilter(e.target.value)}
          className="rounded-xl px-3 py-2 text-sm outline-none border transition-all"
          style={{
            backgroundColor: "var(--input-background)",
            borderColor: "var(--border)",
            color: "var(--foreground)",
          }}
        >
          <option value="All">All Status</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>

        <div
          className="flex border rounded-xl overflow-hidden"
          style={{ borderColor: "var(--border)" }}
        >
          <button
            onClick={() => setHolidayViewMode("List")}
            className={`px-4 py-2 text-xs font-bold ${holidayViewMode === "List" ? "text-white bg-[#00B87C]" : "bg-transparent text-[var(--foreground)]"} cursor-pointer transition-all`}
          >
            List
          </button>
          <button
            onClick={() => setHolidayViewMode("Calendar")}
            className={`px-4 py-2 text-xs font-bold ${holidayViewMode === "Calendar" ? "text-white bg-[#00B87C]" : "bg-transparent text-[var(--foreground)]"} cursor-pointer transition-all`}
          >
            Calendar
          </button>
        </div>
      </div>

      {holidayViewMode === "List" ? (
        <div className="overflow-x-auto rounded-2xl border border-[var(--border)] shadow-sm mb-6">
          <table
            className="w-full border-collapse"
            style={{ minWidth: "1000px" }}
          >
            <thead>
              <tr
                style={{
                  borderBottom: "1px solid var(--border)",
                  textAlign: "left",
                  backgroundColor: "var(--muted)",
                }}
              >
                {[
                  "HOLIDAY",
                  "DATE",
                  "DAY",
                  "TYPE",
                  "APPLICABLE TO",
                  "DEPARTMENT",
                  "RECURRING",
                  "STATUS",
                  "ACTION",
                ].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: "12px 16px",
                      fontSize: "10px",
                      fontWeight: 700,
                      color: "var(--muted-foreground)",
                      letterSpacing: "0.5px",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredHols.map((h, idx) => (
                <tr
                  key={idx}
                  style={{
                    borderBottom: "1px solid var(--border)",
                    height: "56px",
                  }}
                  className="hover:bg-[var(--muted)] transition-all"
                >
                  <td
                    style={{
                      padding: "12px 16px",
                      fontSize: "14px",
                      fontWeight: 700,
                      color: "var(--foreground)",
                    }}
                  >
                    {h.name}
                  </td>
                  <td
                    style={{
                      padding: "12px 16px",
                      fontSize: "13px",
                      color: "var(--foreground)",
                    }}
                  >
                    {h.date}
                  </td>
                  <td
                    style={{
                      padding: "12px 16px",
                      fontSize: "13px",
                      color: "var(--muted-foreground)",
                    }}
                  >
                    {h.day}
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <span
                      style={{
                        backgroundColor:
                          h.type === "National"
                            ? "rgba(0, 184, 124, 0.1)"
                            : h.type === "Optional"
                              ? "rgba(245, 158, 11, 0.1)"
                              : "rgba(14, 165, 233, 0.1)",
                        color:
                          h.type === "National"
                            ? "#00B87C"
                            : h.type === "Optional"
                              ? "#F59E0B"
                              : "#0EA5E9",
                        padding: "4px 10px",
                        borderRadius: "12px",
                        fontSize: "11px",
                        fontWeight: 700,
                      }}
                    >
                      {h.type}
                    </span>
                  </td>
                  <td
                    style={{
                      padding: "12px 16px",
                      fontSize: "13px",
                      color: "var(--foreground)",
                    }}
                  >
                    {h.location}
                  </td>
                  <td
                    style={{
                      padding: "12px 16px",
                      fontSize: "13px",
                      color: "var(--foreground)",
                    }}
                  >
                    {h.dept}
                  </td>
                  <td
                    style={{
                      padding: "12px 16px",
                      fontSize: "13px",
                      color: "var(--foreground)",
                    }}
                  >
                    {h.recurring ? "Yearly" : "One-time"}
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <span
                      style={{
                        backgroundColor:
                          h.status === "Active"
                            ? "rgba(0, 184, 124, 0.1)"
                            : "rgba(107, 114, 128, 0.1)",
                        color: h.status === "Active" ? "#00B87C" : "#6B7280",
                        padding: "4px 10px",
                        borderRadius: "12px",
                        fontSize: "11px",
                        fontWeight: 700,
                      }}
                    >
                      {h.status}
                    </span>
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedHoliday(h);
                          setHolidayForm({
                            name: h.name,
                            date: h.date,
                            type: h.type,
                            location: h.location,
                            dept: h.dept,
                            recurring: h.recurring,
                            status: h.status,
                            description: h.description,
                          });
                          setActiveModal("edit_holiday");
                        }}
                        style={{
                          backgroundColor: "transparent",
                          border: "1px solid #00B87C",
                          borderRadius: "8px",
                          padding: "4px 10px",
                          fontSize: "12px",
                          fontWeight: 600,
                          color: "#00B87C",
                          cursor: "pointer",
                        }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          setSelectedHoliday(h);
                          setActiveModal("delete_holiday");
                        }}
                        style={{
                          backgroundColor: "transparent",
                          border: "1px solid #EF4444",
                          borderRadius: "8px",
                          padding: "4px 10px",
                          fontSize: "12px",
                          fontWeight: 600,
                          color: "#EF4444",
                          cursor: "pointer",
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div
          className="p-4 rounded-2xl border border-[var(--border)] shadow-sm mb-6"
          style={{ backgroundColor: "var(--card)" }}
        >
          <div className="grid grid-cols-7 gap-2 text-center mb-4">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
              <div
                key={d}
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  color: "var(--muted-foreground)",
                  textTransform: "uppercase",
                }}
              >
                {d}
              </div>
            ))}
          </div>
          <div
            className="grid grid-cols-7 gap-2"
            style={{ minHeight: "200px" }}
          >
            {filteredHols.map((h, i) => (
              <div
                key={i}
                onClick={() => {
                  setSelectedHoliday(h);
                  setActiveModal("view_holiday");
                }}
                className="p-2 rounded-xl border flex flex-col justify-between hover:border-[#00B87C] cursor-pointer transition-all"
                style={{
                  backgroundColor: "var(--muted)",
                  borderColor: "var(--border)",
                  minHeight: "80px",
                }}
              >
                <span
                  className="font-bold text-xs"
                  style={{ color: "var(--foreground)" }}
                >
                  {h.date.split("-")[2]}
                </span>
                <span
                  className="text-[11px] font-semibold truncate mt-1 px-1 py-0.5 rounded"
                  style={{
                    backgroundColor: "rgba(0, 184, 124, 0.1)",
                    color: "#00B87C",
                  }}
                >
                  {h.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Section: HOLIDAY SETTINGS */}
      <SectionTitle title="Holiday Settings" />
      <div className="space-y-4 mb-6">
        {[
          {
            label: "Auto-mark holidays in Attendance",
            state: holAutoMark,
            setter: setHolAutoMark,
          },
          {
            label: "Include Optional/Restricted Holidays",
            state: holOptional,
            setter: setHolOptional,
          },
          {
            label: "Region-specific Holiday Calendars",
            state: holRegionSpecific,
            setter: setHolRegionSpecific,
          },
        ].map((row, idx) => (
          <div key={idx} className="flex justify-between items-center py-2">
            <span
              style={{
                fontSize: "13px",
                color: "var(--foreground)",
                fontWeight: 500,
              }}
            >
              {row.label}
            </span>
            <button
              onClick={() => row.setter(!row.state)}
              style={{
                width: "36px",
                height: "20px",
                borderRadius: "20px",
                backgroundColor: row.state
                  ? "#00B87C"
                  : "var(--switch-background)",
                position: "relative",
                transition: "all 0.2s",
                cursor: "pointer",
                border: "none",
              }}
            >
              <span
                style={{
                  position: "absolute",
                  top: "2px",
                  left: row.state ? "18px" : "2px",
                  width: "16px",
                  height: "16px",
                  borderRadius: "50%",
                  backgroundColor: "white",
                  transition: "all 0.2s",
                }}
              />
            </button>
          </div>
        ))}
      </div>

      {/* SAVE BAR */}
      <div
        className="flex justify-end items-center pt-4 mt-6"
        style={{ borderTop: "1px solid var(--border)" }}
      >
        <button
          onClick={() => showToast("Holiday schedule modified successfully")}
          style={{
            backgroundColor: "#00B87C",
            color: "white",
            border: "none",
            borderRadius: "10px",
            padding: "8px 20px",
            fontSize: "13px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}
