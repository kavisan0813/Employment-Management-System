import React from "react";
import { useSettingsContext } from "../SettingsContext";
import {
  Building2,
  MapPin,
  ChevronRight,
  CheckCircle,
  Users,
} from "lucide-react";

export function LocationsSection() {
  const {
    SectionTitle,
    allowRemoteWork,
    country,
    defaultLocCountry,
    geofenceRadius,
    gpsAttendance,
    locSearchQuery,
    locSortBy,
    locStatusFilter,
    locTypeFilter,
    locationsList,
    regionHolidays,
    requireGeofence,
    setActiveModal,
    setAllowRemoteWork,
    setDefaultLocCountry,
    setGeofenceRadius,
    setGpsAttendance,
    setLocForm,
    setLocSearchQuery,
    setLocSortBy,
    setLocStatusFilter,
    setLocTypeFilter,
    setRegionHolidays,
    setRequireGeofence,
    setSelectedLoc,
    showToast,
    timezone,
  } = useSettingsContext();

  // Filter and Sort Logic
  const filteredLocs = locationsList.filter((l) => {
    const matchesSearch =
      l.name.toLowerCase().includes(locSearchQuery.toLowerCase()) ||
      l.code.toLowerCase().includes(locSearchQuery.toLowerCase()) ||
      l.city.toLowerCase().includes(locSearchQuery.toLowerCase());

    const matchesStatus =
      locStatusFilter === "All" || l.status === locStatusFilter;
    const matchesType = locTypeFilter === "All" || l.type === locTypeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  if (locSortBy === "Name") {
    filteredLocs.sort((a, b) => a.name.localeCompare(b.name));
  } else if (locSortBy === "City") {
    filteredLocs.sort((a, b) => a.city.localeCompare(b.city));
  } else if (locSortBy === "Employees") {
    filteredLocs.sort((a, b) => b.empCount - a.empCount);
  }

  return (
    <div>
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-4 text-[12px] font-medium">
        <span style={{ color: "var(--muted-foreground)" }}>Settings</span>
        <ChevronRight
          size={12}
          style={{ color: "var(--muted-foreground)" }}
        />
        <span style={{ color: "#00B87C" }}>Locations</span>
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
            Location Management
          </h2>
          <p
            style={{
              fontSize: "13px",
              color: "var(--muted-foreground)",
              marginTop: "2px",
            }}
          >
            Track geographical assets and structural deployment centers
          </p>
        </div>
        <button
          onClick={() => {
            setLocForm({
              name: "",
              code: "",
              type: "Branch",
              address: "",
              city: "",
              state: "",
              country: "",
              pincode: "",
              manager: "",
              timezone: "IST (UTC+5:30)",
              status: "Active",
              notes: "",
            });
            setSelectedLoc(null);
            setActiveModal("add_location");
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
          + Add Location
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          {
            label: "Total Locations",
            value: locationsList.length,
            icon: <MapPin size={20} />,
            color: "#00B87C",
            bg: "rgba(0, 184, 124, 0.1)",
          },
          {
            label: "Active Locations",
            value: locationsList.filter((l) => l.status === "Active").length,
            icon: <CheckCircle size={20} />,
            color: "#0EA5E9",
            bg: "rgba(14, 165, 233, 0.1)",
          },
          {
            label: "Employees Assigned",
            value: locationsList.reduce(
              (acc, curr) => acc + curr.empCount,
              0,
            ),
            icon: <Users size={20} />,
            color: "#F59E0B",
            bg: "rgba(245, 158, 11, 0.1)",
          },
          {
            label: "Branches & Offices",
            value: locationsList.filter(
              (l) => l.type === "Head Office" || l.type === "Branch",
            ).length,
            icon: <Building2 size={20} />,
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
        className="p-4 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4 mb-6"
        style={{
          backgroundColor: "var(--card)",
          border: "1px solid var(--border)",
        }}
      >
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <input
            type="text"
            placeholder="Search by name, code, city..."
            value={locSearchQuery}
            onChange={(e) => setLocSearchQuery(e.target.value)}
            className="rounded-xl px-4 py-2 text-sm outline-none border w-64 transition-all"
            style={{
              backgroundColor: "var(--input-background)",
              borderColor: "var(--border)",
              color: "var(--foreground)",
            }}
          />
          <select
            value={locStatusFilter}
            onChange={(e) => setLocStatusFilter(e.target.value)}
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
            <option value="Partial">Partial</option>
          </select>
          <select
            value={locTypeFilter}
            onChange={(e) => setLocTypeFilter(e.target.value)}
            className="rounded-xl px-3 py-2 text-sm outline-none border transition-all"
            style={{
              backgroundColor: "var(--input-background)",
              borderColor: "var(--border)",
              color: "var(--foreground)",
            }}
          >
            <option value="All">All Types</option>
            <option value="Head Office">Head Office</option>
            <option value="Branch">Branch</option>
            <option value="Warehouse">Warehouse</option>
            <option value="Remote">Remote</option>
          </select>
          <select
            value={locSortBy}
            onChange={(e) => setLocSortBy(e.target.value)}
            className="rounded-xl px-3 py-2 text-sm outline-none border transition-all"
            style={{
              backgroundColor: "var(--input-background)",
              borderColor: "var(--border)",
              color: "var(--foreground)",
            }}
          >
            <option value="Name">Sort by Name</option>
            <option value="City">Sort by City</option>
            <option value="Employees">Sort by Employees</option>
          </select>
        </div>
        <span style={{ fontSize: "13px", color: "var(--muted-foreground)" }}>
          Showing {filteredLocs.length} locations
        </span>
      </div>

      {/* Locations Table */}
      <div className="overflow-x-auto mb-6 rounded-2xl border border-[var(--border)] shadow-sm">
        <table
          className="w-full border-collapse"
          style={{ minWidth: "900px" }}
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
                "LOCATION",
                "CODE",
                "TYPE",
                "CITY/STATE",
                "MANAGER",
                "EMPLOYEES",
                "TIMEZONE",
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
            {filteredLocs.map((l, idx) => (
              <tr
                key={idx}
                style={{
                  borderBottom: "1px solid var(--border)",
                  height: "56px",
                }}
                className="hover:bg-[var(--muted)] transition-all"
              >
                <td style={{ padding: "12px 16px" }}>
                  <div
                    className="font-bold text-sm"
                    style={{ color: "var(--foreground)" }}
                  >
                    {l.name}
                  </div>
                  <div
                    style={{
                      fontSize: "11px",
                      color: "var(--muted-foreground)",
                    }}
                  >
                    {l.address}
                  </div>
                </td>
                <td
                  style={{
                    padding: "12px 16px",
                    fontSize: "13px",
                    fontWeight: 600,
                    color: "var(--muted-foreground)",
                  }}
                >
                  <span
                    className="px-2 py-1 rounded-lg text-xs font-bold"
                    style={{
                      backgroundColor: "var(--muted)",
                      color: "var(--foreground)",
                      border: "1px solid var(--border)",
                    }}
                  >
                    {l.code}
                  </span>
                </td>
                <td
                  style={{
                    padding: "12px 16px",
                    fontSize: "13px",
                    color: "var(--foreground)",
                  }}
                >
                  {l.type}
                </td>
                <td
                  style={{
                    padding: "12px 16px",
                    fontSize: "13px",
                    color: "var(--foreground)",
                  }}
                >
                  {l.city}, {l.state}
                </td>
                <td
                  style={{
                    padding: "12px 16px",
                    fontSize: "13px",
                    color: "var(--foreground)",
                  }}
                >
                  {l.manager || (
                    <span
                      style={{
                        color: "var(--muted-foreground)",
                        fontStyle: "italic",
                      }}
                    >
                      Unassigned
                    </span>
                  )}
                </td>
                <td style={{ padding: "12px 16px" }}>
                  <span
                    style={{
                      backgroundColor: "rgba(0, 184, 124, 0.1)",
                      color: "#00B87C",
                      padding: "4px 10px",
                      borderRadius: "12px",
                      fontSize: "11px",
                      fontWeight: 700,
                    }}
                  >
                    {l.empCount} Employees
                  </span>
                </td>
                <td
                  style={{
                    padding: "12px 16px",
                    fontSize: "12px",
                    color: "var(--foreground)",
                  }}
                >
                  {l.timezone}
                </td>
                <td style={{ padding: "12px 16px" }}>
                  <span
                    style={{
                      backgroundColor:
                        l.status === "Active"
                          ? "rgba(0, 184, 124, 0.1)"
                          : l.status === "Partial"
                            ? "rgba(245, 158, 11, 0.1)"
                            : "rgba(107, 114, 128, 0.1)",
                      color:
                        l.status === "Active"
                          ? "#00B87C"
                          : l.status === "Partial"
                            ? "#F59E0B"
                            : "#6B7280",
                      padding: "4px 10px",
                      borderRadius: "12px",
                      fontSize: "11px",
                      fontWeight: 700,
                    }}
                  >
                    {l.status}
                  </span>
                </td>
                <td style={{ padding: "12px 16px" }}>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setSelectedLoc(l);
                        setActiveModal("view_location");
                      }}
                      style={{
                        backgroundColor: "transparent",
                        border: "1px solid var(--border)",
                        borderRadius: "8px",
                        padding: "4px 10px",
                        fontSize: "12px",
                        fontWeight: 600,
                        color: "var(--foreground)",
                        cursor: "pointer",
                      }}
                    >
                      View
                    </button>
                    <button
                      onClick={() => {
                        setSelectedLoc(l);
                        setLocForm({
                          name: l.name,
                          code: l.code,
                          type: l.type,
                          address: l.address,
                          city: l.city,
                          state: l.state,
                          country: l.country,
                          pincode: l.pincode,
                          manager: l.manager,
                          timezone: l.timezone,
                          status: l.status,
                          notes: l.notes || "",
                        });
                        setActiveModal("edit_location");
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
                        setSelectedLoc(l);
                        setActiveModal("delete_location");
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

      {/* Section: LOCATION RULES */}
      <SectionTitle title="Location Rules" />
      <div className="space-y-4 mb-6">
        {[
          {
            label: "Enable Location-based Attendance (GPS)",
            state: gpsAttendance,
            setter: setGpsAttendance,
          },
          {
            label: "Allow Remote Work Marking",
            state: allowRemoteWork,
            setter: setAllowRemoteWork,
          },
          {
            label: "Require Geofence Verification",
            state: requireGeofence,
            setter: setRequireGeofence,
          },
          {
            label: "Region-specific Holiday Calendars",
            state: regionHolidays,
            setter: setRegionHolidays,
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label
            style={{
              display: "block",
              fontSize: "11px",
              fontWeight: 700,
              color: "var(--muted-foreground)",
              textTransform: "uppercase",
              marginBottom: "6px",
            }}
          >
            Geofence Radius (meters)
          </label>
          <input
            type="text"
            value={geofenceRadius}
            onChange={(e) => setGeofenceRadius(e.target.value)}
            className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all"
            style={{
              backgroundColor: "var(--input-background)",
              borderColor: "var(--border)",
              color: "var(--foreground)",
            }}
          />
        </div>
        <div>
          <label
            style={{
              display: "block",
              fontSize: "11px",
              fontWeight: 700,
              color: "var(--muted-foreground)",
              textTransform: "uppercase",
              marginBottom: "6px",
            }}
          >
            Default Country
          </label>
          <select
            value={defaultLocCountry}
            onChange={(e) => setDefaultLocCountry(e.target.value)}
            className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all"
            style={{
              backgroundColor: "var(--input-background)",
              borderColor: "var(--border)",
              color: "var(--foreground)",
            }}
          >
            <option value="India">India</option>
            <option value="USA">USA</option>
            <option value="UK">UK</option>
          </select>
        </div>
      </div>

      {/* SAVE BAR */}
      <div
        className="flex justify-end items-center pt-4 mt-6"
        style={{ borderTop: "1px solid var(--border)" }}
      >
        <button
          onClick={() => showToast("Site constraints adjusted")}
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
