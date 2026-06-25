/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import { useState } from "react";
import { SystemConfig } from "../types/platformSettings.types";
import { platformSettingsService } from "../services/platformSettings.service";
import { pushAuditLog } from "../../../mockData";

const CURRENT_ADMIN_EMAIL = "admin@ems.io";

export function usePlatformSettings() {
  const [config, setConfig] = useState<SystemConfig>(() =>
    platformSettingsService.loadSettings(),
  );
  const [activeTab, setActiveTab] = useState<keyof SystemConfig>("general");
  const [showAlert, setShowAlert] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");
  const [alertType, setAlertType] = useState<"success" | "info" | "error">(
    "success",
  );

  const triggerAlert = (
    msg: string,
    type: "success" | "info" | "error" = "success",
  ) => {
    setAlertMsg(msg);
    setAlertType(type);
    setShowAlert(true);
    setTimeout(() => {
      setShowAlert(false);
    }, 4500);
  };

  const handleSave = (section: keyof SystemConfig) => {
    try {
      platformSettingsService.saveSettings(config);

      pushAuditLog(
        `platform_settings.${section}_updated`,
        "Admin Action",
        CURRENT_ADMIN_EMAIL,
        "platform_admin",
        null,
        "Active",
        { updated_fields: Object.keys(config[section]).join(",") },
      );

      triggerAlert(
        `System Configuration: ${section.toUpperCase()} settings saved successfully.`,
        "success",
      );
    } catch (err) {
      console.log("Failed to save settings.", err);
    }
  };

  // Regional/Localization Format Parsers for Previews
  const getFormattedDatePreview = () => {
    const d = new Date();
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();

    if (config.localization.dateFormat === "MM/DD/YYYY") {
      return `${month}/${day}/${year}`;
    }
    if (config.localization.dateFormat === "DD.MM.YYYY") {
      return `${day}.${month}.${year}`;
    }
    return `${day}/${month}/${year}`;
  };

  const getFormattedNumberPreview = () => {
    if (config.localization.numberFormat === "India") {
      return "₹ 1,50,000.00";
    }
    return "$150,050.00";
  };

  const getFormattedCurrencyPreview = () => {
    const symbol = config.currency.symbol;
    const amount = (123456.789).toFixed(config.currency.decimalPlaces);

    let formattedAmount = amount;
    if (config.localization.numberFormat === "India") {
      const parts = amount.split(".");
      let lastThree = parts[0].substring(parts[0].length - 3);
      const otherParts = parts[0].substring(0, parts[0].length - 3);
      if (otherParts !== "") {
        lastThree = "," + lastThree;
      }
      const res = otherParts.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
      formattedAmount = parts.length > 1 ? res + "." + parts[1] : res;
    } else {
      formattedAmount = Number(amount).toLocaleString("en-US", {
        minimumFractionDigits: config.currency.decimalPlaces,
        maximumFractionDigits: config.currency.decimalPlaces,
      });
    }

    if (config.currency.symbolPosition === "before") {
      return `${symbol} ${formattedAmount}`;
    }
    return `${formattedAmount} ${config.currency.defaultCode}`;
  };

  return {
    config,
    setConfig,
    activeTab,
    setActiveTab,
    showAlert,
    alertMsg,
    alertType,
    triggerAlert,
    handleSave,
    getFormattedDatePreview,
    getFormattedNumberPreview,
    getFormattedCurrencyPreview,
  };
}
