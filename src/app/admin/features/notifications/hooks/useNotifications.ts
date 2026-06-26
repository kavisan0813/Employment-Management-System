/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import {
  NotificationState,
  NotificationTemplate,
  NotificationSettings,
} from "../types/notifications.types";
import { notificationsService } from "../services/notifications.service";
import { pushAuditLog } from "../../../mockData";

const CURRENT_ADMIN_EMAIL = "admin@ems.io";

export function useNotifications() {
  const [state, setState] = useState<NotificationState>(() =>
    notificationsService.loadData(),
  );
  const [activeTab, setActiveTab] = useState<
    | "dashboard"
    | "system"
    | "expiry"
    | "failedPayments"
    | "security"
    | "templates"
    | "channels"
    | "history"
    | "settings"
  >("dashboard");

  const [showAlert, setShowAlert] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");
  const [alertType, setAlertType] = useState<
    "success" | "info" | "error" | "warning"
  >("success");

  // Filter and search variables
  const [searchQuery, setSearchQuery] = useState("");
  const [severityFilter, setSeverityFilter] = useState<string>("all");

  const triggerAlert = (
    msg: string,
    type: "success" | "info" | "error" | "warning" = "success",
  ) => {
    setAlertMsg(msg);
    setAlertType(type);
    setShowAlert(true);
    setTimeout(() => {
      setShowAlert(false);
    }, 4500);
  };

  const handleRetryPayment = async (id: string) => {
    triggerAlert(
      "Connecting to Razorpay gateway to re-attempt collection...",
      "info",
    );
    const result = await notificationsService.retryPayment(state, id);
    if (result.success) {
      setState(result.state);
      triggerAlert(result.logs, "success");
      pushAuditLog(
        "payment.retried",
        "Billing",
        CURRENT_ADMIN_EMAIL,
        "platform_admin",
        null,
        "Active",
        { payment_id: id },
      );
    }
  };

  const handleSendReminder = async (id: string) => {
    triggerAlert("Generating and dispatching alerts...", "info");
    const result = await notificationsService.sendRenewalReminder(state, id);
    if (result.success) {
      setState(result.state);
      triggerAlert(
        "SLA Expiry Reminders dispatched successfully to tenant admins via Email and SMS.",
        "success",
      );
      pushAuditLog(
        "tenant.reminded",
        "Admin Action",
        CURRENT_ADMIN_EMAIL,
        "platform_admin",
        null,
        "Active",
        { alert_id: id },
      );
    }
  };

  const handleAcknowledgeAlert = (id: string) => {
    const newState = notificationsService.acknowledgeSystemAlert(state, id);
    setState(newState);
    triggerAlert("Platform System Alert acknowledged and closed.", "success");
  };

  const handleSecurityAction = (id: string, action: "warned" | "locked") => {
    const newState = notificationsService.takeSecurityAction(state, id, action);
    setState(newState);
    triggerAlert(
      `Security action taken: User forced to ${action.toUpperCase()}`,
      "warning",
    );
    pushAuditLog(
      `security.action_${action}`,
      "Security",
      CURRENT_ADMIN_EMAIL,
      "platform_admin",
      null,
      "Active",
      { alert_id: id },
    );
  };

  const handleSaveSettings = (newSettings: NotificationSettings) => {
    const newState = {
      ...state,
      settings: newSettings,
    };
    setState(newState);
    notificationsService.saveData(newState);
    triggerAlert(
      "Global alert dispatch channels saved successfully.",
      "success",
    );
    pushAuditLog(
      "notification_settings.updated",
      "Admin Action",
      CURRENT_ADMIN_EMAIL,
      "platform_admin",
      null,
      "Active",
      {},
    );
  };

  const handleSaveTemplate = (updatedTemplate: NotificationTemplate) => {
    const updatedTemplates = state.templates.map((t) => {
      if (t.id === updatedTemplate.id) {
        return updatedTemplate;
      }
      return t;
    });

    const newState = {
      ...state,
      templates: updatedTemplates,
    };
    setState(newState);
    notificationsService.saveData(newState);
    triggerAlert(
      `Template '${updatedTemplate.type.toUpperCase()}' committed successfully.`,
      "success",
    );
    pushAuditLog(
      `notification_template.${updatedTemplate.type}_updated`,
      "Admin Action",
      CURRENT_ADMIN_EMAIL,
      "platform_admin",
      null,
      "Active",
      {},
    );
  };

  return {
    state,
    setState,
    activeTab,
    setActiveTab,
    showAlert,
    alertMsg,
    alertType,
    searchQuery,
    setSearchQuery,
    severityFilter,
    setSeverityFilter,
    triggerAlert,
    handleRetryPayment,
    handleSendReminder,
    handleAcknowledgeAlert,
    handleSecurityAction,
    handleSaveSettings,
    handleSaveTemplate,
  };
}
