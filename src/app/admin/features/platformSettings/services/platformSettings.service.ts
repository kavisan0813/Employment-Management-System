/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { SystemConfig } from "../types/platformSettings.types";

export const DEFAULT_CONFIG: SystemConfig = {
  general: {
    appName: "EMS Pro",
    companyName: "ABC Software Pvt Ltd",
    website: "emspro.com",
    supportEmail: "support@emspro.com",
    supportPhone: "+91 9876543210",
    sessionTimeout: 30,
    passwordExpiryDays: 90,
    maxLoginAttempts: 5,
    defaultEmployeeStatus: "Active",
  },
  branding: {
    primaryColor: "#4f46e5",
    secondaryColor: "#ffffff",
    buttonColor: "#10b981",
    welcomeText: "Welcome to EMS Pro Dashboard",
    tagline: "The Consolidated Enterprise HRMS Solution",
    logoUrl: "",
    faviconUrl: "",
    whiteLabelEnabled: false,
    emailHeaderLogo: "EMS Pro Logo",
    emailFooterText: "Powered by EMS Pro",
  },
  localization: {
    defaultLanguage: "English",
    supportedLanguages: ["English", "Tamil"],
    dateFormat: "DD/MM/YYYY",
    numberFormat: "India",
    calendarFormat: "Gregorian",
  },
  currency: {
    defaultCode: "INR",
    symbol: "₹",
    decimalPlaces: 2,
    symbolPosition: "before",
    autoConversion: true,
  },
  timezone: {
    defaultTimezone: "Asia/Kolkata",
    supportedTimezones: [
      "Asia/Kolkata",
      "Asia/Dubai",
      "America/New_York",
      "Europe/London",
    ],
    useLocalTimeForPunches: true,
  },
  storage: {
    maxUploadSizeMb: 50,
  },
};

const STORAGE_KEY = "platform_system_configuration";

export const platformSettingsService = {
  loadSettings(): SystemConfig {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...DEFAULT_CONFIG,
          ...parsed,
          general: { ...DEFAULT_CONFIG.general, ...parsed.general },
          branding: { ...DEFAULT_CONFIG.branding, ...parsed.branding },
          localization: {
            ...DEFAULT_CONFIG.localization,
            ...parsed.localization,
          },
          currency: { ...DEFAULT_CONFIG.currency, ...parsed.currency },
          timezone: { ...DEFAULT_CONFIG.timezone, ...parsed.timezone },
          storage: { ...DEFAULT_CONFIG.storage, ...parsed.storage },
        };
      }
    } catch (e) {
      console.error("Failed to load settings from storage", e);
    }
    return DEFAULT_CONFIG;
  },

  saveSettings(config: SystemConfig): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  },

  simulateSmtpHandshake(
    host: string,
    port: number,
    user: string,
    sender: string,
  ): Promise<string[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const logs = [
          `[${new Date().toLocaleTimeString()}] Connecting to SMTP Server ${host}:${port}...`,
          `[${new Date().toLocaleTimeString()}] Connection established successfully. Sending EHLO client handshake...`,
          `[${new Date().toLocaleTimeString()}] EHLO received. Negotiating TLS encryption keys...`,
          `[${new Date().toLocaleTimeString()}] TLS secured with AES-256 cipher. Authenticating user '${user}'...`,
          `[${new Date().toLocaleTimeString()}] Authentication status: SUCCESS. Preparing test email transaction details...`,
          `[${new Date().toLocaleTimeString()}] Sender envelope verified: <${sender}>`,
          `[${new Date().toLocaleTimeString()}] Sending payload transaction... Deliverable accepted by downstream SMTP server gateway!`,
          `[${new Date().toLocaleTimeString()}] Message ID assigned: <ems-smtp-test-${Date.now()}@emspro.com>`,
          `[${new Date().toLocaleTimeString()}] Connection terminated gracefully.`,
        ];
        resolve(logs);
      }, 3000);
    });
  },
};
