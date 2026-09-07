import React from "react";
import { AppearanceSection } from "./AppearanceSection";
import { CanonicalModuleLink } from "../components/CanonicalModuleLink";

export function AppearanceBrandingSection() {
  return (
    <div className="space-y-6">
      {/* APPEARANCE CONTROLS */}
      <AppearanceSection />

      {/* CANONICAL MODULE SHORTCUT */}
      <CanonicalModuleLink
        title="Payslip Branding & Templates"
        description="Customize payslip template formatting, company logo placement, financial headers, and print layouts in Payroll Settings."
        iconName="FileText"
        buttonLabel="Manage Payslip Template"
        targetPath="/finance/payroll"
      />
    </div>
  );
}
