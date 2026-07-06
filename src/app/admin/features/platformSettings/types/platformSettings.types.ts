/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface GeneralSettings {
  appName: string;
  companyName: string;
  website: string;
  supportEmail: string;
  supportPhone: string;
  sessionTimeout: number;
  passwordExpiryDays: number;
  maxLoginAttempts: number;
  defaultEmployeeStatus: "Active" | "Pending" | "Onboarding";
}

export interface BrandingSettings {
  primaryColor: string;
  secondaryColor: string;
  buttonColor: string;
  welcomeText: string;
  tagline: string;
  logoUrl: string;
  faviconUrl: string;
  whiteLabelEnabled: boolean;
  emailHeaderLogo: string;
  emailFooterText: string;
}

export interface LocalizationSettings {
  defaultLanguage: string;
  supportedLanguages: string[];
  dateFormat: "DD/MM/YYYY" | "MM/DD/YYYY" | "DD.MM.YYYY";
  numberFormat: "India" | "International";
  calendarFormat: "Gregorian" | "Islamic" | "Fiscal Calendar";
}

export interface CurrencySettings {
  defaultCode: string;
  symbol: string;
  decimalPlaces: number;
  symbolPosition: "before" | "after";
  autoConversion: boolean;
}

export interface TimezoneSettings {
  defaultTimezone: string;
  supportedTimezones: string[];
  useLocalTimeForPunches: boolean;
}

export interface StorageSettings {
  maxUploadSizeMb: number;
}

export interface SystemConfig {
  general: GeneralSettings;
  branding: BrandingSettings;
  localization: LocalizationSettings;
  currency: CurrencySettings;
  timezone: TimezoneSettings;
  storage: StorageSettings;
}

