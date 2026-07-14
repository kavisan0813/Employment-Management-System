import React, { useState } from "react";
import * as Icons from "lucide-react";
import { useSettingsContext } from "./SettingsContext";
import { ROLE_NAVIGATION } from "./config/sectionAccess";
import {
  CompanyProfileSection,
  DepartmentsSection,
  LocationsSection,
  WorkSchedulesSection,
  HolidayCalendarSection,
  AttendancePolicySection,
  LeavePolicySection,
  PayrollSettingsSection,
  PerformanceSettingsSection,
  UserManagementSection,
  SecuritySettingsSection,
  AuditLogsSection,
  ConnectedAppsSection,
  ApiSettingsSection,
  WebhooksSection,
  EmailTemplatesSection,
  NotificationRulesSection,
  SmsSettingsSection,
  AppearanceSection,
  LanguageRegionSection,
  BackupRestoreSection,
  DataImportExportSection,
  ApprovalWorkflowsSection,
  LeaveApprovalsSection,
  ShiftSwapRulesSection,
  DocumentSettingsSection,
  TrainingSettingsSection,
  OnboardingSettingsSection,
  SettingsModals,
  SettingsToast,
  // Employee Sections
  EmployeeSecuritySection,
  EmployeePrivacySection,
  EmployeeNotificationsSection,
  EmployeeAppearanceSection,
  EmployeeLanguageRegionSection,
  ConnectedDevicesSection,
  DataDownloadsSection,
  HelpFAQSection,
  ContactSupportSection,
} from "./sections";

interface SettingsLayoutProps {
  role: "Super Admin" | "HR Manager" | "Employee";
}

export function SettingsLayout({ role }: SettingsLayoutProps) {
  // If Employee, we use local state for simplicity and self-containment
  const isEmployee = role === "Employee";

  const context = isEmployee ? null : useSettingsContext();

  // Local state for Employee active section
  const [empActiveSection, setEmpActiveSection] = useState("emp_security");
  const [, setEmpModal] = useState<string | null>(null);

  // Read state from context (for Admin/HR) or local (for Employee)
  const activeSubTab = isEmployee ? empActiveSection : context!.activeSubTab;
  const setActiveSubTab = isEmployee
    ? setEmpActiveSection
    : context!.setActiveSubTab;

  const [localSearch, setLocalSearch] = useState("");
  const sidebarSearch = isEmployee ? localSearch : context!.sidebarSearch;
  const setSidebarSearch = isEmployee
    ? setLocalSearch
    : context!.setSidebarSearch;

  const [localCollapsed, setLocalCollapsed] = useState<string[]>([]);
  const collapsedCategories = isEmployee
    ? localCollapsed
    : context!.collapsedCategories;
  const setCollapsedCategories = isEmployee
    ? setLocalCollapsed
    : context!.setCollapsedCategories;

  const [localSidebarOpen, setLocalSidebarOpen] = useState(false);
  const isSidebarOpen = isEmployee ? localSidebarOpen : context!.isSidebarOpen;
  const setIsSidebarOpen = isEmployee
    ? setLocalSidebarOpen
    : context!.setIsSidebarOpen;

  const navigation = ROLE_NAVIGATION[role] || [];

  // Filter navigation items by search
  const filteredNavigation = navigation
    .map((category) => {
      const filteredItems = category.items.filter((item) =>
        item.label.toLowerCase().includes(sidebarSearch.toLowerCase()),
      );
      return { ...category, items: filteredItems };
    })
    .filter((category) => category.items.length > 0);

  // SECTION MAP
  const renderSectionContent = () => {
    // Enforcement check for RBAC (prevent URL queries bypass)
    if (!isEmployee) {
      const allowedSectionKeys = navigation.flatMap((c) =>
        c.items.map((i) => i.id),
      );
      if (!allowedSectionKeys.includes(activeSubTab)) {
        return (
          <div className="flex flex-col items-center justify-center py-20 px-8 text-center bg-card rounded-3xl border border-border">
            <div className="w-16 h-16 rounded-full bg-rose-500/10 flex items-center justify-center mb-4">
              <Icons.ShieldAlert size={32} className="text-rose-500" />
            </div>
            <h3 className="text-lg font-black text-foreground mb-2">
              Access Restricted
            </h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              You do not have permission to view this settings section. If you
              believe this is an error, please contact your administrator.
            </p>
          </div>
        );
      }
    }

    switch (activeSubTab) {
      // System Sections
      case "company":
        return <CompanyProfileSection />;
      case "departments":
        return <DepartmentsSection />;
      case "locations":
        return <LocationsSection />;
      case "schedules":
        return <WorkSchedulesSection />;
      case "holidays":
        return <HolidayCalendarSection />;
      case "attendance_policy":
        return <AttendancePolicySection />;
      case "leave_policy":
        return <LeavePolicySection />;
      case "payroll_settings":
        return <PayrollSettingsSection />;
      case "performance_settings":
        return <PerformanceSettingsSection />;
      case "user_management":
        return <UserManagementSection />;

      case "security":
        return <SecuritySettingsSection />;
      case "audit_logs":
        return <AuditLogsSection />;
      case "connected_apps":
        return <ConnectedAppsSection />;
      case "api":
        return <ApiSettingsSection />;
      case "webhooks":
        return <WebhooksSection />;
      case "email_templates":
        return <EmailTemplatesSection />;
      case "notification_rules":
        return <NotificationRulesSection />;
      case "sms":
        return <SmsSettingsSection />;
      case "appearance":
        return <AppearanceSection />;
      case "language":
        return <LanguageRegionSection />;
      case "backup":
        return <BackupRestoreSection />;
      case "import_export":
        return <DataImportExportSection />;
      case "workflows":
        return <ApprovalWorkflowsSection />;
      case "leave_approvals":
        return <LeaveApprovalsSection />;
      case "shift_swaps":
        return <ShiftSwapRulesSection />;
      case "docs":
        return <DocumentSettingsSection />;
      case "training":
        return <TrainingSettingsSection />;
      case "onboarding":
        return <OnboardingSettingsSection />;

      // Employee Sections
      case "emp_security":
        return <EmployeeSecuritySection />;
      case "emp_privacy":
        return <EmployeePrivacySection onModal={setEmpModal} />;
      case "emp_notifications":
        return <EmployeeNotificationsSection onModal={setEmpModal} />;
      case "emp_appearance":
        return <EmployeeAppearanceSection />;
      case "emp_language":
        return <EmployeeLanguageRegionSection onModal={setEmpModal} />;
      case "emp_devices":
        return <ConnectedDevicesSection onModal={setEmpModal} />;
      case "emp_data":
        return <DataDownloadsSection onModal={setEmpModal} />;
      case "emp_help":
        return <HelpFAQSection navigate={() => {}} />;
      case "emp_contact":
        return (
          <ContactSupportSection onModal={setEmpModal} navigate={() => {}} />
        );

      default:
        return <div>Section not found: {activeSubTab}</div>;
    }
  };

  const GearIcon = Icons.Settings;

  return (
    <div
      className="w-full px-4 md:px-8 py-6 pb-10"
      style={{
        height: "calc(100vh - 80px)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {!isEmployee && <SettingsModals />}
      {!isEmployee && <SettingsToast />}

      {/* PAGE HEADER */}
      <div
        className="sticky top-0 bg-[var(--background)] flex items-center gap-4 py-4 mb-6 border-b border-[var(--border)]"
        style={{ zIndex: 60 }}
      >
        <div
          style={{
            width: "44px",
            height: "44px",
            borderRadius: "10px",
            backgroundColor: isEmployee ? "var(--secondary)" : "#DCFCE7",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: isEmployee ? "var(--primary)" : "#00B87C",
          }}
        >
          <GearIcon size={24} />
        </div>
        <div>
          <h1
            style={{
              fontSize: "26px",
              fontWeight: 700,
              color: "var(--foreground)",
              letterSpacing: "-0.5px",
              margin: 0,
            }}
          >
            {isEmployee ? "Settings" : "System Settings"}
          </h1>
          <p
            style={{
              fontSize: "13px",
              color: "#9CA3AF",
              marginTop: "2px",
              margin: 0,
            }}
          >
            {isEmployee
              ? "Manage your account preferences and security"
              : "System configuration and preferences"}
          </p>
        </div>
      </div>

      {/* MOBILE DRAWER TOGGLE */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="md:hidden flex items-center gap-2 mb-4 px-4 py-2 rounded-xl cursor-pointer transition-all border select-none"
        style={{
          backgroundColor: "var(--card)",
          borderColor: "var(--border)",
          color: "var(--foreground)",
        }}
      >
        <GearIcon size={16} className="text-[#00B87C]" />
        <span style={{ fontSize: "13px", fontWeight: 600 }}>
          {isSidebarOpen ? "Close Menu" : "Settings Menu"}
        </span>
      </button>

      {/* 2-COLUMN LAYOUT */}
      <div className="flex flex-col md:flex-row gap-6 flex-1 overflow-hidden relative">
        {/* LEFT COLUMN (Sub-nav) */}
        <div
          style={{
            width: "220px",
            backgroundColor: "var(--card)",
            borderRadius: "1rem",
            padding: "16px",
            border: "1px solid var(--border)",
            position: "sticky",
            top: "10px",
            maxHeight: "calc(100vh - 180px)",
            overflowY: "auto",
            alignSelf: "flex-start",
            zIndex: 40,
          }}
          className={`w-full md:w-[220px] flex-shrink-0 transition-all duration-300 ${
            isSidebarOpen ? "block" : "hidden md:block"
          }`}
        >
          {/* Search Settings Input */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search settings..."
              value={sidebarSearch}
              onChange={(e) => setSidebarSearch(e.target.value)}
              className="w-full rounded-xl px-3 py-2 text-xs outline-none border transition-all"
              style={{
                backgroundColor: "var(--input-background)",
                borderColor: "var(--border)",
                color: "var(--foreground)",
              }}
            />
          </div>

          {filteredNavigation.map((category, idx) => {
            const isCollapsed = collapsedCategories.includes(category.title);
            return (
              <div key={category.title} className={idx > 0 ? "mt-4" : ""}>
                <div
                  className="flex items-center justify-between cursor-pointer select-none mb-2"
                  onClick={() => {
                    setCollapsedCategories(
                      isCollapsed
                        ? collapsedCategories.filter(
                            (t: string) => t !== category.title,
                          )
                        : [...collapsedCategories, category.title],
                    );
                  }}
                >
                  <span
                    style={{
                      fontSize: "10px",
                      fontWeight: 700,
                      color: "#9CA3AF",
                      letterSpacing: "0.5px",
                      textTransform: "uppercase",
                    }}
                  >
                    {category.title}
                  </span>
                  <Icons.ChevronDown
                    size={12}
                    className={`text-[#94A3B8] transition-transform duration-200 ${
                      isCollapsed ? "rotate-[-90deg]" : ""
                    }`}
                  />
                </div>

                {!isCollapsed && (
                  <div className="flex flex-col gap-1">
                    {category.items.map((item) => {
                      const active = activeSubTab === item.id;
                      const IconComp =
                        Icons[item.iconName as keyof typeof Icons];
                      const Icon =
                        typeof IconComp === "function" ||
                        (IconComp &&
                          typeof IconComp === "object" &&
                          "$$typeof" in IconComp)
                          ? (IconComp as React.ComponentType<{
                              size?: number;
                              style?: React.CSSProperties;
                            }>)
                          : Icons.HelpCircle;
                      return (
                        <button
                          key={item.id}
                          onClick={() => {
                            setActiveSubTab(item.id);
                            setIsSidebarOpen(false);
                          }}
                          className="flex items-center gap-3 px-3 transition-all cursor-pointer select-none text-left"
                          style={{
                            backgroundColor: active ? "#00B87C" : "transparent",
                            color: active ? "white" : "var(--foreground)",
                            border: "none",
                            width: "100%",
                            height: "40px",
                            borderRadius: active ? "10px" : "8px",
                            fontFamily: "Inter, sans-serif",
                          }}
                        >
                          <Icon
                            size={14}
                            style={{
                              color: active
                                ? "white"
                                : "var(--muted-foreground)",
                            }}
                          />
                          <span
                            style={{
                              fontSize: "13px",
                              fontWeight: active ? 700 : 500,
                            }}
                          >
                            {item.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* RIGHT COLUMN (Content) */}
        <div
          style={{
            flex: 1,
            backgroundColor: "var(--card)",
            borderRadius: "1rem",
            padding: "24px",
            border: "1px solid var(--border)",
            height: "calc(100vh - 180px)",
            overflowY: "auto",
          }}
          className="w-full"
        >
          {renderSectionContent()}
        </div>
      </div>
    </div>
  );
}
