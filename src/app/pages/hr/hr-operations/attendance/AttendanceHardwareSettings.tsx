import React, { useState, useEffect, useReducer, useRef } from "react";
import { Cpu, Plus, Wifi, WifiOff, RefreshCw, CheckCircle2, AlertCircle, AlertTriangle, Settings, Activity, Server, Shield, Trash2, Edit2, Play } from "lucide-react";
import { AttendanceDevice, HardwareLog, AttendanceHardwareAdapter } from "./hardwareService";

interface AttendanceHardwareSettingsProps {
  onClose?: () => void;
}

interface HardwareFormState {
  selectedDevice: AttendanceDevice | null;
  showAddModal: boolean;
  deviceName: string;
  deviceType: AttendanceDevice["type"];
  deviceId: string;
  location: string;
  ipAddress: string;
  port: number;
  apiEndpoint: string;
  syncInterval: number;
}

type HardwareFormAction =
  | { type: "OPEN_ADD" }
  | { type: "OPEN_EDIT"; device: AttendanceDevice }
  | { type: "CLOSE_MODAL" }
  | { type: "SET_FIELD"; field: keyof HardwareFormState; value: any };

const initialHardwareFormState: HardwareFormState = {
  selectedDevice: null,
  showAddModal: false,
  deviceName: "",
  deviceType: "Biometric",
  deviceId: "",
  location: "HQ Office",
  ipAddress: "192.168.1.150",
  port: 8080,
  apiEndpoint: "/api/v1/biometric/logs",
  syncInterval: 5,
};

function hardwareFormReducer(state: HardwareFormState, action: HardwareFormAction): HardwareFormState {
  switch (action.type) {
    case "OPEN_ADD":
      return {
        ...initialHardwareFormState,
        deviceId: `DEV-${Date.now().toString().substring(7)}`,
        showAddModal: true,
      };
    case "OPEN_EDIT":
      return {
        selectedDevice: action.device,
        showAddModal: true,
        deviceName: action.device.name,
        deviceType: action.device.type,
        deviceId: action.device.deviceId,
        location: action.device.location,
        ipAddress: action.device.ipAddress,
        port: action.device.port,
        apiEndpoint: action.device.apiEndpoint,
        syncInterval: action.device.syncInterval,
      };
    case "CLOSE_MODAL":
      return { ...state, showAddModal: false };
    case "SET_FIELD":
      return { ...state, [action.field]: action.value };
    default:
      return state;
  }
}

export function AttendanceHardwareSettings({ onClose }: AttendanceHardwareSettingsProps) {
  const [devices, setDevices] = useState<AttendanceDevice[]>([]);
  const [logs, setLogs] = useState<HardwareLog[]>([]);
  const [activeTab, setActiveTab] = useState<"devices" | "logs">("devices");
  const [testingId, setTestingId] = useState<string | null>(null);
  const [syncingId, setSyncingId] = useState<string | null>(null);
  const [statusFeedback, setStatusFeedback] = useState<{ id: string; msg: string; type: "success" | "error" } | null>(null);

  // Form & Modal Reducer State
  const [formState, dispatchForm] = useReducer(hardwareFormReducer, initialHardwareFormState);
  const { selectedDevice, showAddModal, deviceName, deviceType, deviceId, location, ipAddress, port, apiEndpoint, syncInterval } = formState;
  const deviceDialogRef = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const el = deviceDialogRef.current;
    if (!el) return;
    if (showAddModal) el.showModal();
    else el.close();
  }, [showAddModal]);

  useEffect(() => {
    setDevices(AttendanceHardwareAdapter.getDevices());
    setLogs(AttendanceHardwareAdapter.getLogs());
  }, []);

  const handleOpenAdd = () => {
    dispatchForm({ type: "OPEN_ADD" });
  };

  const handleOpenEdit = (dev: AttendanceDevice) => {
    dispatchForm({ type: "OPEN_EDIT", device: dev });
  };

  const handleSaveDevice = (e: React.FormEvent) => {
    e.preventDefault();
    let updated: AttendanceDevice[];
    if (selectedDevice) {
      updated = devices.map((d) =>
        d.id === selectedDevice.id
          ? {
              ...d,
              name: deviceName,
              type: deviceType,
              deviceId,
              location,
              ipAddress,
              port,
              apiEndpoint,
              syncInterval,
            }
          : d
      );
    } else {
      const newDev: AttendanceDevice = {
        id: `DEV-${Date.now()}`,
        name: deviceName || "New Biometric Terminal",
        type: deviceType,
        deviceId: deviceId || `BIO-${Date.now().toString().substring(8)}`,
        location,
        ipAddress,
        port,
        apiEndpoint,
        syncInterval,
        status: "Connected",
        lastSync: "Just now",
        recordCountToday: 0,
      };
      updated = [newDev, ...devices];
    }

    setDevices(updated);
    AttendanceHardwareAdapter.saveDevices(updated);
    dispatchForm({ type: "CLOSE_MODAL" });
  };

  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const handleDeleteDeviceConfirm = () => {
    if (!deleteConfirmId) return;
    const updated = devices.filter((d) => d.id !== deleteConfirmId);
    setDevices(updated);
    AttendanceHardwareAdapter.saveDevices(updated);
    setDeleteConfirmId(null);
  };

  const handleTestConnection = async (dev: AttendanceDevice) => {
    setTestingId(dev.id);
    setStatusFeedback(null);
    const res = await AttendanceHardwareAdapter.testConnection(dev);
    setTestingId(null);
    setStatusFeedback({
      id: dev.id,
      msg: res.message,
      type: res.success ? "success" : "error",
    });
  };

  const handleSyncNow = async (dev: AttendanceDevice) => {
    setSyncingId(dev.id);
    setStatusFeedback(null);
    const res = await AttendanceHardwareAdapter.syncDevice(dev);
    setSyncingId(null);
    if (res.success) {
      const updated = devices.map((d) =>
        d.id === dev.id
          ? { ...d, lastSync: "Just now", recordCountToday: d.recordCountToday + res.newPunches }
          : d
      );
      setDevices(updated);
      AttendanceHardwareAdapter.saveDevices(updated);
      setLogs(AttendanceHardwareAdapter.getLogs());
    }
    setStatusFeedback({
      id: dev.id,
      msg: res.message,
      type: res.success ? "success" : "error",
    });
  };

  const toggleDeviceStatus = (dev: AttendanceDevice) => {
    const nextStatus: AttendanceDevice["status"] = dev.status === "Disabled" ? "Connected" : "Disabled";
    const updated = devices.map((d) => (d.id === dev.id ? { ...d, status: nextStatus } : d));
    setDevices(updated);
    AttendanceHardwareAdapter.saveDevices(updated);
  };

  return (
    <div className="space-y-5">
      {/* Header Banner */}
      <div
        className="p-5 rounded-2xl border bg-[#00B87C]/5 border-[#00B87C]/20 flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#00B87C] text-white flex items-center justify-center font-bold">
            <Cpu size={22} />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-foreground flex items-center gap-2">
              <span>Attendance Hardware / Device Integration</span>
              <span className="text-[10px] font-black uppercase tracking-wider text-[#00B87C] bg-[#00B87C]/10 px-2 py-0.5 rounded-full border border-[#00B87C]/20">
                R&D Architecture
              </span>
            </h3>
            <p className="text-[11px] font-semibold text-muted-foreground">
              Configure biometric terminals, RFID gates, facial recognition SDKs & IoT sync adapters
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-2 px-3.5 h-9 bg-[#00B87C] text-white text-xs font-extrabold rounded-xl hover:bg-[#00a36d] shadow-sm transition-all active:scale-95"
          >
            <Plus size={15} />
            <span>Add Device</span>
          </button>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex items-center justify-between border-b pb-1" style={{ borderColor: "var(--border)" }}>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab("devices")}
            className={`px-4 py-2 text-xs font-extrabold rounded-xl transition-all ${
              activeTab === "devices"
                ? "bg-[#00B87C] text-white shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-neutral-100 dark:hover:bg-zinc-800"
            }`}
          >
            Configured Devices ({devices.length})
          </button>
          <button
            onClick={() => setActiveTab("logs")}
            className={`px-4 py-2 text-xs font-extrabold rounded-xl transition-all ${
              activeTab === "logs"
                ? "bg-[#00B87C] text-white shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-neutral-100 dark:hover:bg-zinc-800"
            }`}
          >
            Sync & Hardware Logs ({logs.length})
          </button>
        </div>

        <span className="text-[10px] font-bold text-muted-foreground hidden sm:inline">
          Sync Interval Standard: 5 Mins
        </span>
      </div>

      {/* Tab 1: Configured Devices */}
      {activeTab === "devices" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {devices.map((dev) => (
            <div
              key={dev.id}
              className="p-5 rounded-2xl border bg-card shadow-sm space-y-4 hover:border-[#00B87C] transition-all"
              style={{ borderColor: "var(--border)" }}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-neutral-100 dark:bg-zinc-800 flex items-center justify-center text-foreground font-bold">
                    <Server size={18} />
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-foreground leading-tight">{dev.name}</h4>
                    <p className="text-[10px] font-bold text-muted-foreground">
                      ID: <span className="text-foreground">{dev.deviceId}</span> • Type: <span className="text-[#00B87C]">{dev.type}</span>
                    </p>
                  </div>
                </div>

                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${
                    dev.status === "Connected"
                      ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                      : dev.status === "Disabled"
                      ? "bg-neutral-200 dark:bg-zinc-700 text-muted-foreground border-transparent"
                      : "bg-rose-500/10 text-rose-600 border-rose-500/20"
                  }`}
                >
                  {dev.status}
                </span>
              </div>

              {/* IP / Host / Endpoint Details */}
              <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-neutral-50 dark:bg-zinc-800/30 text-[11px]">
                <div>
                  <p className="text-[9px] font-bold uppercase text-muted-foreground">IP Host & Port</p>
                  <p className="font-extrabold text-foreground">{dev.ipAddress}:{dev.port}</p>
                </div>
                <div>
                  <p className="text-[9px] font-bold uppercase text-muted-foreground">Location</p>
                  <p className="font-extrabold text-foreground">{dev.location}</p>
                </div>
                <div>
                  <p className="text-[9px] font-bold uppercase text-muted-foreground">API Endpoint</p>
                  <p className="font-bold text-muted-foreground truncate">{dev.apiEndpoint}</p>
                </div>
                <div>
                  <p className="text-[9px] font-bold uppercase text-muted-foreground">Sync Interval</p>
                  <p className="font-extrabold text-[#00B87C]">Every {dev.syncInterval}m ({dev.lastSync})</p>
                </div>
              </div>

              {statusFeedback && statusFeedback.id === dev.id && (
                <div
                  className={`p-2.5 rounded-xl text-xs font-bold ${
                    statusFeedback.type === "success"
                      ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                      : "bg-rose-500/10 text-rose-600 border border-rose-500/20"
                  }`}
                >
                  {statusFeedback.msg}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-2 border-t" style={{ borderColor: "var(--border)" }}>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleTestConnection(dev)}
                    disabled={testingId === dev.id}
                    className="px-3 py-1.5 rounded-lg border text-xs font-bold text-foreground bg-card hover:bg-neutral-100 dark:hover:bg-zinc-800 transition-colors disabled:opacity-50"
                    style={{ borderColor: "var(--border)" }}
                  >
                    {testingId === dev.id ? "Pinging..." : "Test Connection"}
                  </button>

                  <button
                    onClick={() => handleSyncNow(dev)}
                    disabled={syncingId === dev.id}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-[#00B87C] hover:bg-[#00a36d] transition-colors disabled:opacity-50 flex items-center gap-1"
                  >
                    <RefreshCw size={12} className={syncingId === dev.id ? "animate-spin" : ""} />
                    <span>Sync Now</span>
                  </button>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => toggleDeviceStatus(dev)}
                    className="p-1.5 rounded-lg text-muted-foreground hover:bg-neutral-100 dark:hover:bg-zinc-800"
                    title={dev.status === "Disabled" ? "Enable Device" : "Disable Device"}
                  >
                    {dev.status === "Disabled" ? <WifiOff size={16} /> : <Wifi size={16} className="text-emerald-500" />}
                  </button>

                  <button
                    onClick={() => handleOpenEdit(dev)}
                    className="p-1.5 rounded-lg text-muted-foreground hover:bg-neutral-100 dark:hover:bg-zinc-800"
                    title="Edit Configuration"
                  >
                    <Edit2 size={16} />
                  </button>

                  <button
                    onClick={() => setDeleteConfirmId(dev.id)}
                    className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20"
                    title="Delete Device"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: Sync & Hardware Logs */}
      {activeTab === "logs" && (
        <div className="rounded-2xl border bg-card shadow-sm p-4 space-y-3" style={{ borderColor: "var(--border)" }}>
          <h4 className="text-xs font-black uppercase tracking-wider text-muted-foreground">Recent Hardware Sync Activity</h4>
          <div className="space-y-2">
            {logs.map((log) => (
              <div
                key={log.id}
                className="p-3 rounded-xl border bg-neutral-50/50 dark:bg-zinc-800/30 flex items-center justify-between gap-3 text-xs"
                style={{ borderColor: "var(--border)" }}
              >
                <div className="flex items-center gap-2.5">
                  <Activity size={15} className={log.type === "ERROR" ? "text-rose-500" : "text-[#00B87C]"} />
                  <div>
                    <p className="font-bold text-foreground">{log.deviceName} — <span className="text-muted-foreground">{log.message}</span></p>
                    <p className="text-[10px] font-semibold text-muted-foreground">{log.timestamp}</p>
                  </div>
                </div>
                <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold ${log.type === "ERROR" ? "bg-rose-500/10 text-rose-600" : "bg-emerald-500/10 text-emerald-600"}`}>
                  {log.type}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal for Add/Edit Device */}
      <dialog
        ref={deviceDialogRef}
        id="device-dialog"
        onClose={() => dispatchForm({ type: "CLOSE_MODAL" })}
        className="w-full max-w-lg rounded-2xl bg-card border shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 backdrop:bg-black/50 backdrop:backdrop-blur-sm"
        style={{ borderColor: "var(--border)" }}
      >
            <div className="p-5 border-b flex items-center justify-between bg-neutral-50 dark:bg-zinc-800/40" style={{ borderColor: "var(--border)" }}>
              <h3 id="device-modal-title" className="text-base font-extrabold text-foreground">
                {selectedDevice ? "Edit Hardware Device" : "Add Hardware Device"}
              </h3>
              <button onClick={() => dispatchForm({ type: "CLOSE_MODAL" })} className="p-1.5 rounded-xl hover:bg-neutral-200 dark:hover:bg-zinc-700 text-muted-foreground">
                <Trash2 size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveDevice} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-foreground uppercase tracking-wide mb-1">Device Name *</label>
                <input type="text" required value={deviceName} onChange={(e) => dispatchForm({ type: "SET_FIELD", field: "deviceName", value: e.target.value })} placeholder="e.g. HQ Main Entrance Biometric" className="w-full px-3.5 py-2 text-xs font-bold rounded-xl border bg-card outline-none" style={{ borderColor: "var(--border)" }} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-foreground uppercase tracking-wide mb-1">Device Type *</label>
                  <select value={deviceType} onChange={(e) => dispatchForm({ type: "SET_FIELD", field: "deviceType", value: e.target.value as any })} className="w-full px-3 py-2 text-xs font-bold rounded-xl border bg-card outline-none" style={{ borderColor: "var(--border)" }}>
                    <option value="Biometric">Biometric</option>
                    <option value="Fingerprint">Fingerprint</option>
                    <option value="Face Recognition">Face Recognition</option>
                    <option value="RFID">RFID</option>
                    <option value="Access Control">Access Control</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-foreground uppercase tracking-wide mb-1">Device ID *</label>
                  <input type="text" required value={deviceId} onChange={(e) => dispatchForm({ type: "SET_FIELD", field: "deviceId", value: e.target.value })} className="w-full px-3.5 py-2 text-xs font-bold rounded-xl border bg-card outline-none" style={{ borderColor: "var(--border)" }} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-foreground uppercase tracking-wide mb-1">IP / Host *</label>
                  <input type="text" required value={ipAddress} onChange={(e) => dispatchForm({ type: "SET_FIELD", field: "ipAddress", value: e.target.value })} className="w-full px-3.5 py-2 text-xs font-bold rounded-xl border bg-card outline-none" style={{ borderColor: "var(--border)" }} />
                </div>

                <div>
                  <label className="block text-xs font-bold text-foreground uppercase tracking-wide mb-1">Port *</label>
                  <input type="number" required value={port} onChange={(e) => dispatchForm({ type: "SET_FIELD", field: "port", value: parseInt(e.target.value) })} className="w-full px-3.5 py-2 text-xs font-bold rounded-xl border bg-card outline-none" style={{ borderColor: "var(--border)" }} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-foreground uppercase tracking-wide mb-1">API Endpoint</label>
                  <input type="text" value={apiEndpoint} onChange={(e) => dispatchForm({ type: "SET_FIELD", field: "apiEndpoint", value: e.target.value })} className="w-full px-3.5 py-2 text-xs font-bold rounded-xl border bg-card outline-none" style={{ borderColor: "var(--border)" }} />
                </div>

                <div>
                  <label className="block text-xs font-bold text-foreground uppercase tracking-wide mb-1">Sync Interval (mins)</label>
                  <input type="number" value={syncInterval} onChange={(e) => dispatchForm({ type: "SET_FIELD", field: "syncInterval", value: parseInt(e.target.value) })} className="w-full px-3.5 py-2 text-xs font-bold rounded-xl border bg-card outline-none" style={{ borderColor: "var(--border)" }} />
                </div>
              </div>

              <div className="pt-3 border-t flex gap-3" style={{ borderColor: "var(--border)" }}>
                <button type="button" onClick={() => dispatchForm({ type: "CLOSE_MODAL" })} className="flex-1 py-2.5 rounded-xl border text-xs font-bold text-muted-foreground hover:bg-neutral-100" style={{ borderColor: "var(--border)" }}>Cancel</button>
                <button type="submit" className="flex-1 py-2.5 rounded-xl text-white text-xs font-bold bg-[#00B87C] hover:bg-[#00a36d]">Save Hardware Device</button>
              </div>
            </form>
      </dialog>

      {/* Confirmation Modal for Device Removal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-[3000] flex items-center justify-center bg-black/50 p-4 animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl bg-card border p-6 shadow-2xl space-y-4" style={{ borderColor: "var(--border)" }}>
            <div className="flex items-center gap-3 text-rose-500 font-extrabold text-sm">
              <AlertTriangle size={20} />
              Confirm Device Removal
            </div>
            <p className="text-xs text-muted-foreground font-medium">
              Are you sure you want to delete this attendance hardware device configuration? Raw punch synchronization from this terminal IP host will be halted.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 text-xs font-bold rounded-xl border bg-muted/20 hover:bg-muted/40"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteDeviceConfirm}
                className="px-4 py-2 text-xs font-bold rounded-xl bg-rose-600 hover:bg-rose-700 text-white shadow-sm"
              >
                Delete Device
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
