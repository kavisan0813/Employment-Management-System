import React, { useState, useRef, useEffect } from "react";
import { Settings, Shield, Clock, Calendar as CalendarIcon, MapPin, Layers, Cpu, Save, Plus, Trash2, CheckCircle2, AlertCircle, X } from "lucide-react";
import { AttendanceHardwareSettings } from "./AttendanceHardwareSettings";
import { AttendanceService } from "./attendanceService";
import { useAuth } from "../../../../context/AuthContext";
import { usePermissions } from "../../../../shared/permission-engine/PermissionContext";
import { P } from "../../../../shared/permission-engine/permissions";

interface AttendanceSuperAdminSettingsProps {
  onClose: () => void;
}

export function AttendanceSuperAdminSettings({ onClose }: AttendanceSuperAdminSettingsProps) {
  const { user } = useAuth();
  const { hasPermissionKey } = usePermissions();
  const canConfigure = hasPermissionKey(P.ATTENDANCE_FULL);
  const dialogRef = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const el = dialogRef.current;
    if (!el) return;
    el.showModal();
    return () => el.close();
  }, []);

  const [activeSection, setActiveSection] = useState<"rules" | "weekend" | "holidays" | "status" | "locations" | "shifts" | "hardware">("rules");

  // Load tenant settings via AttendanceService
  const initialSettings = AttendanceService.getSuperAdminSettings(user?.organizationId);

  // Policy States
  const [workingHours, setWorkingHours] = useState(initialSettings.workingHours);
  const [gracePeriod, setGracePeriod] = useState(initialSettings.gracePeriod);
  const [lateThreshold, setLateThreshold] = useState(initialSettings.lateThreshold);
  const [earlyCheckoutThreshold, setEarlyCheckoutThreshold] = useState(initialSettings.earlyCheckoutThreshold);
  const [halfDayThreshold, setHalfDayThreshold] = useState(initialSettings.halfDayThreshold);
  const [minWorkingHours, setMinWorkingHours] = useState(initialSettings.minWorkingHours);

  // Weekend States
  const [satOff, setSatOff] = useState(initialSettings.satOff);
  const [sunOff, setSunOff] = useState(initialSettings.sunOff);

  // Holidays & Shifts
  const [holidays, setHolidays] = useState(initialSettings.holidays);
  const [newHolidayName, setNewHolidayName] = useState("");
  const [newHolidayDate, setNewHolidayDate] = useState("");
  const [deleteHolidayConfirmId, setDeleteHolidayConfirmId] = useState<string | null>(null);

  const [shifts, setShifts] = useState(initialSettings.shifts);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleAddHoliday = () => {
    if (!newHolidayName || !newHolidayDate) return;
    const newHol = {
      id: Date.now().toString(),
      name: newHolidayName,
      date: newHolidayDate,
      type: "Festival",
    };
    setHolidays([...holidays, newHol]);
    setNewHolidayName("");
    setNewHolidayDate("");
  };

  const handleDeleteHolidayConfirm = () => {
    if (!deleteHolidayConfirmId) return;
    setHolidays(holidays.filter((h) => h.id !== deleteHolidayConfirmId));
    setDeleteHolidayConfirmId(null);
  };

  const handleSaveSettings = () => {
    AttendanceService.saveSuperAdminSettings(
      {
        workingHours,
        gracePeriod,
        lateThreshold,
        earlyCheckoutThreshold,
        halfDayThreshold,
        minWorkingHours,
        satOff,
        sunOff,
        holidays,
        shifts,
      },
      user?.organizationId
    );

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <dialog
      ref={dialogRef}
      id="superadmin-attendance-dialog"
      onClose={onClose}
      className="w-full max-w-4xl rounded-2xl bg-card border shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col h-[85vh] backdrop:bg-black/50 backdrop:backdrop-blur-sm"
      style={{ borderColor: "var(--border)" }}
    >
        {/* Header */}
        <div className="p-5 border-b flex items-center justify-between bg-neutral-50 dark:bg-zinc-800/40" style={{ borderColor: "var(--border)" }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#00B87C]/10 text-[#00B87C] border border-[#00B87C]/20 flex items-center justify-center font-bold">
              <Shield size={22} />
            </div>
            <div>
              <h3 id="superadmin-modal-title" className="text-base font-extrabold text-foreground flex items-center gap-2">
                <span>Super Admin — Attendance Configuration & Rules</span>
                <span className="text-[10px] font-black uppercase tracking-wider text-[#00B87C] bg-[#00B87C]/10 px-2 py-0.5 rounded-full">
                  Super Admin Only
                </span>
              </h3>
              <p className="text-[11px] font-semibold text-muted-foreground">
                Configure attendance thresholds, grace periods, weekend schedules, holiday lists & hardware devices
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-xl border text-xs font-bold text-muted-foreground hover:bg-neutral-100 dark:hover:bg-zinc-800"
            style={{ borderColor: "var(--border)" }}
          >
            Close
          </button>
        </div>

        {/* Content Body Layout with Sidebar */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Navigation Sidebar */}
          <div className="w-full md:w-56 p-3 border-r bg-neutral-50/50 dark:bg-zinc-900/20 space-y-1 overflow-y-auto" style={{ borderColor: "var(--border)" }}>
            <p className="px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Sections</p>

            <button
              onClick={() => setActiveSection("rules")}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                activeSection === "rules" ? "bg-[#00B87C] text-white shadow-sm" : "text-muted-foreground hover:text-foreground hover:bg-card"
              }`}
            >
              <Clock size={15} />
              <span>A. Attendance Rules</span>
            </button>

            <button
              onClick={() => setActiveSection("weekend")}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                activeSection === "weekend" ? "bg-[#00B87C] text-white shadow-sm" : "text-muted-foreground hover:text-foreground hover:bg-card"
              }`}
            >
              <CalendarIcon size={15} />
              <span>B. Weekend Config</span>
            </button>

            <button
              onClick={() => setActiveSection("holidays")}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                activeSection === "holidays" ? "bg-[#00B87C] text-white shadow-sm" : "text-muted-foreground hover:text-foreground hover:bg-card"
              }`}
            >
              <CalendarIcon size={15} />
              <span>C. Holiday Config</span>
            </button>

            <button
              onClick={() => setActiveSection("status")}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                activeSection === "status" ? "bg-[#00B87C] text-white shadow-sm" : "text-muted-foreground hover:text-foreground hover:bg-card"
              }`}
            >
              <Layers size={15} />
              <span>D. Status Config</span>
            </button>

            <button
              onClick={() => setActiveSection("locations")}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                activeSection === "locations" ? "bg-[#00B87C] text-white shadow-sm" : "text-muted-foreground hover:text-foreground hover:bg-card"
              }`}
            >
              <MapPin size={15} />
              <span>E. Locations Config</span>
            </button>

            <button
              onClick={() => setActiveSection("shifts")}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                activeSection === "shifts" ? "bg-[#00B87C] text-white shadow-sm" : "text-muted-foreground hover:text-foreground hover:bg-card"
              }`}
            >
              <Clock size={15} />
              <span>F. Shift Config</span>
            </button>

            <button
              onClick={() => setActiveSection("hardware")}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                activeSection === "hardware" ? "bg-[#00B87C] text-white shadow-sm" : "text-muted-foreground hover:text-foreground hover:bg-card"
              }`}
            >
              <Cpu size={15} />
              <span>G. Hardware Devices</span>
            </button>
          </div>

          {/* Section Main View */}
          <div className="flex-1 p-6 overflow-y-auto space-y-6">
            {savedSuccess && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 size={16} />
                <span>Attendance policy settings saved successfully!</span>
              </div>
            )}

            {/* Section A: Attendance Rules */}
            {activeSection === "rules" && (
              <div className="space-y-4">
                <h4 className="text-sm font-extrabold text-foreground">A. Attendance Policy Rules</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-muted-foreground uppercase mb-1">Standard Working Hours / Day</label>
                    <input
                      type="number"
                      value={workingHours}
                      onChange={(e) => setWorkingHours(parseFloat(e.target.value))}
                      className="w-full px-3.5 py-2 text-xs font-bold rounded-xl border bg-card outline-none"
                      style={{ borderColor: "var(--border)" }}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-muted-foreground uppercase mb-1">Punch In Grace Period (mins)</label>
                    <input
                      type="number"
                      value={gracePeriod}
                      onChange={(e) => setGracePeriod(parseInt(e.target.value))}
                      className="w-full px-3.5 py-2 text-xs font-bold rounded-xl border bg-card outline-none"
                      style={{ borderColor: "var(--border)" }}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-muted-foreground uppercase mb-1">Late Threshold (mins)</label>
                    <input
                      type="number"
                      value={lateThreshold}
                      onChange={(e) => setLateThreshold(parseInt(e.target.value))}
                      className="w-full px-3.5 py-2 text-xs font-bold rounded-xl border bg-card outline-none"
                      style={{ borderColor: "var(--border)" }}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-muted-foreground uppercase mb-1">Half-Day Threshold (hours)</label>
                    <input
                      type="number"
                      value={halfDayThreshold}
                      onChange={(e) => setHalfDayThreshold(parseFloat(e.target.value))}
                      className="w-full px-3.5 py-2 text-xs font-bold rounded-xl border bg-card outline-none"
                      style={{ borderColor: "var(--border)" }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Section B: Weekend Config */}
            {activeSection === "weekend" && (
              <div className="space-y-4">
                <h4 className="text-sm font-extrabold text-foreground">B. Weekend Schedule Configuration</h4>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 p-3 rounded-xl border bg-card cursor-pointer" style={{ borderColor: "var(--border)" }}>
                    <input type="checkbox" checked={satOff} onChange={(e) => setSatOff(e.target.checked)} className="w-4 h-4 rounded text-[#00B87C]" />
                    <span className="text-xs font-bold text-foreground">Saturday is Weekly Off</span>
                  </label>

                  <label className="flex items-center gap-3 p-3 rounded-xl border bg-card cursor-pointer" style={{ borderColor: "var(--border)" }}>
                    <input type="checkbox" checked={sunOff} onChange={(e) => setSunOff(e.target.checked)} className="w-4 h-4 rounded text-[#00B87C]" />
                    <span className="text-xs font-bold text-foreground">Sunday is Weekly Off</span>
                  </label>
                </div>
              </div>
            )}

            {/* Section C: Holiday Config */}
            {activeSection === "holidays" && (
              <div className="space-y-4">
                <h4 className="text-sm font-extrabold text-foreground">C. Festival & Public Holiday Configuration</h4>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Holiday Name (e.g. New Year)"
                    value={newHolidayName}
                    onChange={(e) => setNewHolidayName(e.target.value)}
                    className="flex-1 px-3 py-2 text-xs font-bold rounded-xl border bg-card outline-none"
                    style={{ borderColor: "var(--border)" }}
                  />
                  <input
                    type="date"
                    value={newHolidayDate}
                    onChange={(e) => setNewHolidayDate(e.target.value)}
                    className="w-36 px-3 py-2 text-xs font-bold rounded-xl border bg-card outline-none"
                    style={{ borderColor: "var(--border)" }}
                  />
                  <button
                    type="button"
                    onClick={handleAddHoliday}
                    className="px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-[#00B87C] hover:bg-[#00a36d]"
                  >
                    Add
                  </button>
                </div>

                <div className="space-y-2">
                  {holidays.map((h) => (
                    <div key={h.id} className="p-3 rounded-xl border bg-card flex items-center justify-between" style={{ borderColor: "var(--border)" }}>
                      <div>
                        <p className="text-xs font-extrabold text-foreground">{h.name}</p>
                        <p className="text-[10px] font-bold text-muted-foreground">{h.date} • {h.type} Holiday</p>
                      </div>
                      <button onClick={() => setDeleteHolidayConfirmId(h.id)} className="p-1 text-rose-500 hover:bg-rose-50 rounded-lg">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Holiday Deletion Confirmation Modal */}
            {deleteHolidayConfirmId && (
              <div className="fixed inset-0 z-[3000] flex items-center justify-center bg-black/50 p-4 animate-in fade-in">
                <div className="w-full max-w-md rounded-2xl bg-card border p-6 shadow-2xl space-y-4" style={{ borderColor: "var(--border)" }}>
                  <div className="flex items-center gap-3 text-rose-500 font-extrabold text-sm">
                    <AlertCircle size={20} />
                    Confirm Holiday Deletion
                  </div>
                  <p className="text-xs text-muted-foreground font-medium">
                    Are you sure you want to delete this holiday configuration? This will affect working day and KPI calculations for active periods.
                  </p>
                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      onClick={() => setDeleteHolidayConfirmId(null)}
                      className="px-4 py-2 text-xs font-bold rounded-xl border bg-muted/20 hover:bg-muted/40"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleDeleteHolidayConfirm}
                      className="px-4 py-2 text-xs font-bold rounded-xl bg-rose-600 hover:bg-rose-700 text-white shadow-sm"
                    >
                      Delete Holiday
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Section D: Status Config */}
            {activeSection === "status" && (
              <div className="space-y-4">
                <h4 className="text-sm font-extrabold text-foreground">D. Attendance Status Types</h4>
                <div className="grid grid-cols-2 gap-3">
                  {["Present", "Absent", "Late", "Half Day", "Leave", "Holiday", "Work From Home"].map((s) => (
                    <div key={s} className="p-3 rounded-xl border bg-card text-xs font-extrabold text-foreground" style={{ borderColor: "var(--border)" }}>
                      ● {s}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Section E: Location Config */}
            {activeSection === "locations" && (
              <div className="space-y-4">
                <h4 className="text-sm font-extrabold text-foreground">E. Location Configuration</h4>
                <div className="space-y-2">
                  {["HQ Office (Primary)", "Branch Office", "Remote Work"].map((loc) => (
                    <div key={loc} className="p-3 rounded-xl border bg-card text-xs font-extrabold text-foreground flex items-center justify-between" style={{ borderColor: "var(--border)" }}>
                      <span>{loc}</span>
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full">Active</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Section F: Shift Config */}
            {activeSection === "shifts" && (
              <div className="space-y-4">
                <h4 className="text-sm font-extrabold text-foreground">F. Shift Schedules Configuration</h4>
                <div className="space-y-2">
                  {shifts.map((sh) => (
                    <div key={sh.id} className="p-3 rounded-xl border bg-card text-xs font-bold text-foreground flex items-center justify-between" style={{ borderColor: "var(--border)" }}>
                      <div>
                        <p className="font-extrabold">{sh.name}</p>
                        <p className="text-[10px] text-muted-foreground">{sh.start} - {sh.end} (Grace: {sh.grace}m)</p>
                      </div>
                      <span className="text-[10px] font-bold text-[#00B87C] bg-[#00B87C]/10 px-2 py-0.5 rounded-full">Configured</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Section G: Hardware Devices Integration Component */}
            {activeSection === "hardware" && (
              <AttendanceHardwareSettings />
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-neutral-50 dark:bg-zinc-800/40 border-t flex items-center justify-between" style={{ borderColor: "var(--border)" }}>
          <p className="text-xs font-bold text-muted-foreground">Changes take effect immediately across all employee portals.</p>
          <button
            onClick={handleSaveSettings}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-xs font-extrabold bg-[#00B87C] hover:bg-[#00a36d] shadow-sm active:scale-95 transition-all"
          >
            <Save size={15} />
            <span>Save Configuration</span>
          </button>
        </div>
    </dialog>
  );
}
