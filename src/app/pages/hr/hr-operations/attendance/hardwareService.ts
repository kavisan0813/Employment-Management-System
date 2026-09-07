export interface AttendanceDevice {
  id: string;
  name: string;
  type: "Biometric" | "Fingerprint" | "Face Recognition" | "RFID" | "Access Control";
  deviceId: string;
  location: string;
  ipAddress: string;
  port: number;
  apiEndpoint: string;
  syncInterval: number; // minutes
  status: "Connected" | "Disconnected" | "Syncing" | "Error" | "Disabled";
  lastSync: string;
  recordCountToday: number;
}

export interface HardwareLog {
  id: string;
  deviceId: string;
  deviceName: string;
  timestamp: string;
  type: "SYNC" | "CONNECT" | "ERROR" | "INFO";
  message: string;
}

const INITIAL_DEVICES: AttendanceDevice[] = [
  {
    id: "DEV-101",
    name: "HQ Main Entrance Biometric",
    type: "Biometric",
    deviceId: "BIO-HQ-01",
    location: "HQ Office",
    ipAddress: "192.168.1.120",
    port: 8080,
    apiEndpoint: "/api/v1/biometric/logs",
    syncInterval: 5,
    status: "Connected",
    lastSync: "2 mins ago",
    recordCountToday: 342,
  },
  {
    id: "DEV-102",
    name: "Engineering Turnstile Face ID",
    type: "Face Recognition",
    deviceId: "FACE-ENG-02",
    location: "HQ Office",
    ipAddress: "192.168.1.125",
    port: 8443,
    apiEndpoint: "/api/v1/facerecog/events",
    syncInterval: 3,
    status: "Connected",
    lastSync: "Just now",
    recordCountToday: 189,
  },
  {
    id: "DEV-103",
    name: "Branch Office RFID Gate",
    type: "RFID",
    deviceId: "RFID-BR-01",
    location: "Branch Office",
    ipAddress: "10.0.4.15",
    port: 9000,
    apiEndpoint: "/rfid/access/logs",
    syncInterval: 15,
    status: "Disconnected",
    lastSync: "2 hours ago",
    recordCountToday: 95,
  },
  {
    id: "DEV-104",
    name: "Server Room Access Control",
    type: "Access Control",
    deviceId: "ACC-SRV-01",
    location: "HQ Office",
    ipAddress: "192.168.1.200",
    port: 443,
    apiEndpoint: "/security/door/logs",
    syncInterval: 10,
    status: "Connected",
    lastSync: "10 mins ago",
    recordCountToday: 48,
  },
];

const INITIAL_LOGS: HardwareLog[] = [
  {
    id: "LOG-501",
    deviceId: "DEV-101",
    deviceName: "HQ Main Entrance Biometric",
    timestamp: "2026-04-10 09:15:22",
    type: "SYNC",
    message: "Successfully synchronized 45 punch-in events.",
  },
  {
    id: "LOG-502",
    deviceId: "DEV-102",
    deviceName: "Engineering Turnstile Face ID",
    timestamp: "2026-04-10 09:12:05",
    type: "SYNC",
    message: "Facial feature match sync completed for 28 employees.",
  },
  {
    id: "LOG-503",
    deviceId: "DEV-103",
    deviceName: "Branch Office RFID Gate",
    timestamp: "2026-04-10 07:30:00",
    type: "ERROR",
    message: "Connection timeout on 10.0.4.15:9000. Retrying in 15 mins.",
  },
];

export class AttendanceHardwareAdapter {
  private static STORAGE_KEY = "nexus_attendance_devices:v1";
  private static LOGS_KEY = "nexus_hardware_logs:v1";

  public static getDevices(): AttendanceDevice[] {
    const data = localStorage.getItem(this.STORAGE_KEY);
    if (data) {
      try {
        return JSON.parse(data);
      } catch (e) {
        console.error("Failed to parse device config", e);
      }
    }
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(INITIAL_DEVICES));
    return INITIAL_DEVICES;
  }

  public static saveDevices(devices: AttendanceDevice[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(devices));
  }

  public static getLogs(): HardwareLog[] {
    const data = localStorage.getItem(this.LOGS_KEY);
    if (data) {
      try {
        return JSON.parse(data);
      } catch (e) {
        console.error("Failed to parse hardware logs", e);
      }
    }
    localStorage.setItem(this.LOGS_KEY, JSON.stringify(INITIAL_LOGS));
    return INITIAL_LOGS;
  }

  public static addLog(log: Omit<HardwareLog, "id">): void {
    const logs = this.getLogs();
    const newLog: HardwareLog = {
      ...log,
      id: `LOG-${Date.now()}`,
    };
    const updated = [newLog, ...logs.slice(0, 49)];
    localStorage.setItem(this.LOGS_KEY, JSON.stringify(updated));
  }

  public static async testConnection(device: AttendanceDevice): Promise<{ success: boolean; latency: number; message: string }> {
    // Simulated hardware network ping & handshake
    await new Promise((res) => setTimeout(res, 800));
    if (device.status === "Disabled") {
      return { success: false, latency: 0, message: "Device is currently disabled." };
    }
    if (device.status === "Disconnected" || device.ipAddress.startsWith("10.0.4")) {
      return { success: false, latency: 0, message: `Host ${device.ipAddress}:${device.port} unreachable.` };
    }
    const latency = Math.floor(Math.random() * 25) + 12;
    return {
      success: true,
      latency,
      message: `Connection successful (${latency}ms). Firmware v3.4.2 active. API Endpoint ${device.apiEndpoint} responsive.`,
    };
  }

  public static async syncDevice(device: AttendanceDevice): Promise<{ success: boolean; newPunches: number; message: string }> {
    await new Promise((res) => setTimeout(res, 1200));
    if (device.status === "Disabled" || device.status === "Disconnected") {
      return { success: false, newPunches: 0, message: "Device is offline or disabled." };
    }
    const newPunches = Math.floor(Math.random() * 12) + 1;
    this.addLog({
      deviceId: device.id,
      deviceName: device.name,
      timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
      type: "SYNC",
      message: `Manual sync completed. Ingested ${newPunches} new raw biometric punches.`,
    });
    return {
      success: true,
      newPunches,
      message: `Synced ${newPunches} punch records from ${device.name}.`,
    };
  }
}
