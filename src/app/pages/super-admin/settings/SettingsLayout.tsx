import React, { useState, useContext } from "react";
import * as Icons from "lucide-react";
import { useNavigate } from "react-router";
import { SettingsContext } from "./settings-context";
import { ROLE_NAVIGATION } from "./config/sectionAccess";
import { CanonicalModuleLink } from "./components/CanonicalModuleLink";
import { SettingsOverview } from "./sections/SettingsOverview";
import { OrganizationSection } from "./sections/OrganizationSection";
import { AppearanceBrandingSection } from "./sections/AppearanceBrandingSection";
import { PoliciesSection } from "./sections/PoliciesSection";
import { ApprovalWorkflowsCombinedSection } from "./sections/ApprovalWorkflowsCombinedSection";
import { RolesPermissionsSection } from "./sections/RolesPermissionsSection";
import { FeatureManagementSection } from "./sections/FeatureManagementSection";
import { NotificationPreferencesSection } from "./sections/NotificationPreferencesSection";
import { SecuritySessionsSection } from "./sections/SecuritySessionsSection";
import { IntegrationsSection } from "./sections/IntegrationsSection";
import { AuditLogsCombinedSection } from "./sections/AuditLogsCombinedSection";
import { SettingsModals } from "./sections/SettingsModals";
import { SettingsToast } from "./sections/SettingsToast";
// Employee Sections
import { EmployeeSecuritySection } from "./sections/EmployeeSecuritySection";
import { EmployeePrivacySection } from "./sections/EmployeePrivacySection";
import { EmployeeNotificationsSection } from "./sections/EmployeeNotificationsSection";
import { EmployeeAppearanceSection } from "./sections/EmployeeAppearanceSection";
import { EmployeeLanguageRegionSection } from "./sections/EmployeeLanguageRegionSection";
import { ConnectedDevicesSection } from "./sections/ConnectedDevicesSection";
import { DataDownloadsSection } from "./sections/DataDownloadsSection";
import { HelpFAQSection } from "./sections/HelpFAQSection";
import { ContactSupportSection } from "./sections/ContactSupportSection";

interface SettingsLayoutProps {
  role: "Super Admin" | "HR Manager" | "Employee";
}

export function SettingsLayout({ role }: SettingsLayoutProps) {
  const navigate = useNavigate();
  const isEmployee = role === "Employee";
  const context = useContext(SettingsContext);
  if (!isEmployee && !context) {
    throw new Error("SettingsContext must be used within SettingsProvider");
  }

  // Local state for Employee active section
  const [empActiveSection, setEmpActiveSection] = useState("emp_security");
  const [, setEmpModal] = useState<string | null>(null);

  // Read state from context (for Admin/HR) or local (for Employee)
  const activeSubTab = isEmployee ? empActiveSection : (context!.activeSubTab || "overview");
  const setActiveSubTab = isEmployee ? setEmpActiveSection : context!.setActiveSubTab;
  const [localSearch, setLocalSearch] = useState("");
  const sidebarSearch = isEmployee ? localSearch : context!.sidebarSearch;
  const setSidebarSearch = isEmployee ? setLocalSearch : context!.setSidebarSearch;
  const [localCollapsed, setLocalCollapsed] = useState<string[]>([]);
  const collapsedCategories = isEmployee ? localCollapsed : context!.collapsedCategories;
  const setCollapsedCategories = isEmployee ? setLocalCollapsed : context!.setCollapsedCategories;
  const [localSidebarOpen, setLocalSidebarOpen] = useState(false);
  const isSidebarOpen = isEmployee ? localSidebarOpen : context!.isSidebarOpen;
  const setIsSidebarOpen = isEmployee ? setLocalSidebarOpen : context!.setIsSidebarOpen;

  const navigation = ROLE_NAVIGATION[role] || [];
  const collapsedCategoriesSet = new Set(collapsedCategories);

  // Filter navigation items by search
  const filteredNavigation = navigation
    .map((category) => {
      const filteredItems = category.items.filter((item) =>
        item.label.toLowerCase().includes(sidebarSearch.toLowerCase())
      );
      return {
        ...category,
        items: filteredItems,
      };
    })
    .filter((category) => category.items.length > 0);

  // SECTION MAP
  const renderSectionContent = () => {
    // Enforcement check for RBAC for non-employee roles
    if (!isEmployee && activeSubTab !== "overview") {
      const allowedSectionKeys = [
        "overview",
        "organization",
        "company",
        "locations",
        "appearance",
        "policies",
        "leave_policy",
        "workflows",
        "leave_approvals",
        "shift_swaps",
        "roles",
        "user_management",
        "features",
        "notifications",
        "email_templates",
        "notification_rules",
        "sms",
        "security",
        "integrations",
        "connected_apps",
        "api",
        "webhooks",
        "audit_logs",
        "backup",
        "import_export",
        "departments",
        "attendance_policy",
        "schedules",
        "holidays",
        "payroll_settings",
      ];
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
      case "overview":
        return (
          <SettingsOverview
            onSelectCategory={(id) => setActiveSubTab(id)}
            policyCount={context?.policiesList?.length || 12}
            rolesCount={context?.rolesList?.length || 5}
          />
        );

      // Redesigned Top-Level Platform Settings
      case "organization":
      case "company":
      case "locations":
        return <OrganizationSection />;

      case "appearance":
        return <AppearanceBrandingSection />;

      case "policies":
      case "leave_policy":
        return <PoliciesSection />;

      case "workflows":
      case "leave_approvals":
      case "shift_swaps":
        return <ApprovalWorkflowsCombinedSection />;

      case "roles":
      case "user_management":
        return <RolesPermissionsSection />;

      case "features":
        return <FeatureManagementSection />;

      case "notifications":
      case "email_templates":
      case "notification_rules":
      case "sms":
        return <NotificationPreferencesSection />;

      case "security":
        return <SecuritySessionsSection />;

      case "integrations":
      case "connected_apps":
      case "api":
      case "webhooks":
        return <IntegrationsSection />;

      case "audit_logs":
      case "backup":
      case "import_export":
        return <AuditLogsCombinedSection />;

      // Canonical Shortcuts for Domain Settings
      case "departments":
        return (
          <CanonicalModuleLink
            title="Department Management"
            description="Department hierarchy, team structure, and organizational unit configurations are managed in the primary Organization module."
            iconName="FolderTree"
            buttonLabel="Open Department Management"
            targetPath="/departments"
          />
        );

      case "attendance_policy":
      case "schedules":
      case "holidays":
        return (
          <CanonicalModuleLink
            title="Attendance Rules & Work Schedules"
            description="Check-in grace periods, work schedules, rosters, and holiday calendars are managed within Attendance Management."
            iconName="ClipboardCheck"
            buttonLabel="Go to Attendance Management"
            targetPath="/hr/attendance"
          />
        );

      case "payroll_settings":
        return (
          <CanonicalModuleLink
            title="Payroll Configuration & Settings"
            description="Payroll execution rules, salary components, tax regimes, and payslip templates are managed from Payroll Settings."
            iconName="IndianRupee"
            buttonLabel="Go to Payroll Settings"
            targetPath="/finance/payroll"
          />
        );

      // Employee View Sections
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
        return <ContactSupportSection onModal={setEmpModal} navigate={() => {}} />;

      default:
        return (
          <SettingsOverview
            onSelectCategory={(id) => setActiveSubTab(id)}
            policyCount={context?.policiesList?.length || 12}
            rolesCount={context?.rolesList?.length || 5}
          />
        );
    }
  };

  const GearIcon = Icons.Settings;

  return (
    <div className="w-full px-4 md:px-8 py-6 pb-10 flex flex-col min-h-[calc(100vh-80px)]">
      {!isEmployee && <SettingsModals />}
      {!isEmployee && <SettingsToast />}

      {/* PAGE HEADER */}
      <div className="sticky top-0 bg-background flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 mb-6 border-b border-border z-30">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-[#00B87C]/10 text-[#00B87C] flex items-center justify-center flex-shrink-0">
            <GearIcon size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight">
              {isEmployee ? "Settings" : "System Settings"}
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              {isEmployee
                ? "Manage your account preferences and security"
                : "Manage organization-wide configuration, access, policies and integrations."}
            </p>
          </div>
        </div>

        {/* TOP SEARCH BAR */}
        {!isEmployee && (
          <div className="relative w-full sm:w-80">
            <Icons.Search size={14} className="absolute left-3.5 top-3 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search settings..."
              value={sidebarSearch}
              onChange={(e) => {
                setSidebarSearch(e.target.value);
                if (e.target.value && activeSubTab === "overview") {
                  // Keep search active
                }
              }}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-border bg-input-background text-foreground outline-none focus:border-[#00B87C] transition-all"
            />
          </div>
        )}
      </div>

      {/* BREADCRUMB & OVERVIEW SHORTCUT */}
      {!isEmployee && activeSubTab !== "overview" && (
        <div className="flex items-center justify-between gap-2 mb-4 text-xs font-medium">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveSubTab("overview")}
              className="text-muted-foreground hover:text-[#00B87C] cursor-pointer transition-colors"
            >
              System Settings
            </button>
            <Icons.ChevronRight size={12} className="text-muted-foreground" />
            <span className="text-[#00B87C] font-bold capitalize">
              {activeSubTab.replace("_", " ")}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setActiveSubTab("overview")}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border bg-card text-foreground hover:bg-muted text-xs font-semibold cursor-pointer transition-all"
          >
            <Icons.ArrowLeft size={12} />
            <span>Settings Overview</span>
          </button>
        </div>
      )}

      {/* MOBILE DRAWER TOGGLE */}
      <button
        type="button"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="md:hidden flex items-center gap-2 mb-4 px-4 py-2 rounded-xl cursor-pointer transition-all border select-none bg-card border-border text-foreground"
      >
        <GearIcon size={16} className="text-[#00B87C]" />
        <span className="text-xs font-bold">
          {isSidebarOpen ? "Close Navigation" : "Settings Navigation"}
        </span>
      </button>

      {/* 2-COLUMN LAYOUT */}
      <div className="flex flex-col md:flex-row gap-6 flex-1 items-start relative">
        {/* LEFT COLUMN (Sub-nav) */}
        <div
          className={`w-full md:w-[240px] flex-shrink-0 bg-card rounded-2xl p-4 border border-border sticky top-24 max-h-[calc(100vh-140px)] overflow-y-auto z-20 transition-all duration-300 ${
            isSidebarOpen ? "block" : "hidden md:block"
          }`}
        >
          {/* OVERVIEW DIRECT BUTTON */}
          {!isEmployee && (
            <button
              type="button"
              onClick={() => {
                setActiveSubTab("overview");
                setIsSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 mb-4 rounded-xl font-bold text-xs transition-all cursor-pointer select-none text-left ${
                activeSubTab === "overview"
                  ? "bg-[#00B87C] text-white shadow-xs"
                  : "bg-muted/50 text-foreground hover:bg-muted"
              }`}
            >
              <Icons.LayoutGrid size={15} />
              <span>Settings Overview</span>
            </button>
          )}

          {filteredNavigation.map((category, idx) => {
            const isCollapsed = collapsedCategoriesSet.has(category.title);
            return (
              <div key={category.title} className={idx > 0 ? "mt-4" : ""}>
                <div
                  className="flex items-center justify-between cursor-pointer select-none mb-2 px-1"
                  onClick={() => {
                    setCollapsedCategories(
                      isCollapsed
                        ? collapsedCategories.filter((t: string) => t !== category.title)
                        : [...collapsedCategories, category.title]
                    );
                  }}
                >
                  <span className="text-[10px] font-bold text-muted-foreground tracking-wider uppercase">
                    {category.title}
                  </span>
                  <Icons.ChevronDown
                    size={12}
                    className={`text-muted-foreground transition-transform duration-200 ${
                      isCollapsed ? "rotate-[-90deg]" : ""
                    }`}
                  />
                </div>

                {!isCollapsed && (
                  <div className="flex flex-col gap-1">
                    {category.items.map((item) => {
                      const active = activeSubTab === item.id;
                      const IconComp = Icons[item.iconName as keyof typeof Icons];
                      const Icon =
                        typeof IconComp === "function" ||
                        (IconComp && typeof IconComp === "object" && "$$typeof" in IconComp)
                          ? (IconComp as React.ComponentType<{ size?: number; style?: React.CSSProperties }>)
                          : Icons.HelpCircle;

                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => {
                            setActiveSubTab(item.id);
                            setIsSidebarOpen(false);
                          }}
                          className={`flex items-center gap-3 px-3 transition-all cursor-pointer select-none text-left w-full h-9 rounded-xl text-xs font-semibold ${
                            active
                              ? "bg-[#00B87C] text-white shadow-xs"
                              : "text-foreground hover:bg-muted/60"
                          }`}
                        >
                          <Icon size={14} className={active ? "text-white" : "text-muted-foreground"} />
                          <span>{item.label}</span>
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
        <div className="w-full flex-1 bg-card rounded-2xl p-6 border border-border min-h-[calc(100vh-200px)] overflow-y-auto">
          {renderSectionContent()}
        </div>
      </div>
    </div>
  );
}
