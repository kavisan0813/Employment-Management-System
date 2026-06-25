/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import {
  CommunicationState,
  Announcement,
  EmailTemplate,
  SmsTemplate,
  CommunicationSettings,
} from "../types/communication.types";
import { communicationService } from "../services/communication.service";
import { pushAuditLog } from "../../../mockData";

const CURRENT_ADMIN_EMAIL = "admin@ems.io";

export function useCommunication() {
  const [state, setState] = useState<CommunicationState>(() =>
    communicationService.loadData(),
  );
  const [activeTab, setActiveTab] = useState<
    | "dashboard"
    | "announcements"
    | "emailTemplates"
    | "smsTemplates"
    | "pushNotifications"
    | "broadcast"
    | "history"
    | "reports"
    | "settings"
  >("dashboard");

  // Alert State
  const [showAlert, setShowAlert] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");
  const [alertType, setAlertType] = useState<
    "success" | "info" | "error" | "warning"
  >("success");

  // Announcements form
  const [annTitle, setAnnTitle] = useState("");
  const [annContent, setAnnContent] = useState("");
  const [annPriority, setAnnPriority] =
    useState<Announcement["priority"]>("Medium");
  const [annTarget, setAnnTarget] = useState("Everyone");
  const [annDisplay, setAnnDisplay] = useState("Dashboard Banner");

  // Email Template Form
  const [editingEmailId, setEditingEmailId] = useState<string>("temp-email-1");
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");

  // SMS Template Form
  const [editingSmsId, setEditingSmsId] = useState<string>("temp-sms-1");
  const [smsMessage, setSmsMessage] = useState("");

  // Push Notifications Template Form
  const [pushTitle, setPushTitle] = useState("");
  const [pushMessage, setPushMessage] = useState("");
  const [pushRedirect, setPushRedirect] = useState("/features");
  const [pushTargetChannels, setPushTargetChannels] = useState<string[]>([
    "Android",
    "iOS",
    "Web",
  ]);

  // Broadcast wizard state
  const [bcStep, setBcStep] = useState<number>(1);
  const [bcTitle, setBcTitle] = useState("");
  const [bcCampaign, setBcCampaign] = useState("");
  const [bcAudience, setBcAudience] = useState("Everyone");
  const [bcChannels, setBcChannels] = useState<string[]>(["Email"]);
  const [bcMessageText, setBcMessageText] = useState("");

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

  // Create announcement action
  const handleCreateAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!annTitle.trim() || !annContent.trim()) {
      triggerAlert("Title and Description fields are required.", "error");
      return;
    }
    const newState = communicationService.addAnnouncement(state, {
      title: annTitle,
      content: annContent,
      priority: annPriority,
      targetAudience: annTarget,
      displayOption: annDisplay,
      status: "Active",
    });
    setState(newState);
    setAnnTitle("");
    setAnnContent("");
    triggerAlert(
      "Global Platform Announcement launched successfully.",
      "success",
    );
    pushAuditLog(
      "announcement.created",
      "Admin Action",
      CURRENT_ADMIN_EMAIL,
      "platform_admin",
      null,
      "Active",
      { title: annTitle, priority: annPriority, target: annTarget },
    );
  };

  const handleToggleAnnouncement = (id: string) => {
    const newState = communicationService.toggleAnnouncement(state, id);
    setState(newState);
    const target = newState.announcements.find((a) => a.id === id);
    triggerAlert(
      `Announcement status set to ${target?.status.toUpperCase()}`,
      "info",
    );
  };

  const handleDeleteAnnouncement = (id: string) => {
    const newState = communicationService.deleteAnnouncement(state, id);
    setState(newState);
    triggerAlert("Announcement removed from database.", "warning");
  };

  // Save email template changes
  const handleSaveEmailTemplate = (template: EmailTemplate) => {
    const newState = communicationService.saveEmailTemplate(state, template);
    setState(newState);
    triggerAlert(
      "Email notification template successfully committed.",
      "success",
    );
    pushAuditLog(
      "email_template.updated",
      "Admin Action",
      CURRENT_ADMIN_EMAIL,
      "platform_admin",
      null,
      "Active",
      { template_name: template.template_name, category: template.category },
    );
  };

  // Save SMS template changes
  const handleSaveSmsTemplate = (template: SmsTemplate) => {
    const newState = communicationService.saveSmsTemplate(state, template);
    setState(newState);
    triggerAlert("SMS message template updated successfully.", "success");
    pushAuditLog(
      "sms_template.updated",
      "Admin Action",
      CURRENT_ADMIN_EMAIL,
      "platform_admin",
      null,
      "Active",
      { template_name: template.template_name },
    );
  };

  // Send campaign broadcast
  const handleSendBroadcast = () => {
    if (!bcTitle.trim() || !bcCampaign.trim() || !bcMessageText.trim()) {
      triggerAlert("Please complete all required campaign values.", "error");
      return;
    }
    if (bcChannels.length === 0) {
      triggerAlert(
        "Select at least one outbound communication delivery channel.",
        "error",
      );
      return;
    }

    const result = communicationService.sendBroadcastCampaign(
      state,
      bcTitle,
      bcCampaign,
      bcAudience,
      bcChannels,
      bcMessageText,
    );

    setState(result.state);
    setBcStep(1);
    setBcTitle("");
    setBcCampaign("");
    setBcMessageText("");
    triggerAlert(result.logMsg, "success");

    pushAuditLog(
      "broadcast.dispatched",
      "Admin Action",
      CURRENT_ADMIN_EMAIL,
      "platform_admin",
      null,
      "Active",
      {
        campaign: bcCampaign,
        audience: bcAudience,
        channels: bcChannels.join(", "),
      },
    );
  };

  // Save gateway settings
  const handleSaveSettings = (settings: CommunicationSettings) => {
    const newState = communicationService.updateSettings(state, settings);
    setState(newState);
    triggerAlert(
      "Global mail SMTP and SMS Gateway integrations updated.",
      "success",
    );
    pushAuditLog(
      "communication_settings.updated",
      "Admin Action",
      CURRENT_ADMIN_EMAIL,
      "platform_admin",
      null,
      "Active",
      { gateway: settings.smsGateway },
    );
  };

  return {
    state,
    activeTab,
    setActiveTab,
    showAlert,
    alertMsg,
    alertType,
    annTitle,
    setAnnTitle,
    annContent,
    setAnnContent,
    annPriority,
    setAnnPriority,
    annTarget,
    setAnnTarget,
    annDisplay,
    setAnnDisplay,
    editingEmailId,
    setEditingEmailId,
    emailSubject,
    setEmailSubject,
    emailBody,
    setEmailBody,
    editingSmsId,
    setEditingSmsId,
    smsMessage,
    setSmsMessage,
    pushTitle,
    setPushTitle,
    pushMessage,
    setPushMessage,
    pushRedirect,
    setPushRedirect,
    pushTargetChannels,
    setPushTargetChannels,
    bcStep,
    setBcStep,
    bcTitle,
    setBcTitle,
    bcCampaign,
    setBcCampaign,
    bcAudience,
    setBcAudience,
    bcChannels,
    setBcChannels,
    bcMessageText,
    setBcMessageText,
    triggerAlert,
    handleCreateAnnouncement,
    handleToggleAnnouncement,
    handleDeleteAnnouncement,
    handleSaveEmailTemplate,
    handleSaveSmsTemplate,
    handleSendBroadcast,
    handleSaveSettings,
  };
}
