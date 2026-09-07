import React, { useState } from "react";
import { CompanyProfileSection } from "./CompanyProfileSection";
import { LocationsSection } from "./LocationsSection";
import { CanonicalModuleLink } from "../components/CanonicalModuleLink";

export function OrganizationSection() {
  const [activeTab, setActiveTab] = useState<"profile" | "locations">("profile");

  return (
    <div className="space-y-6">
      {/* CANONICAL MODULE SHORTCUT */}
      <CanonicalModuleLink
        title="Department Management"
        description="Department hierarchy, team structure, and organizational unit configurations are managed in the primary Organization module."
        iconName="FolderTree"
        buttonLabel="Open Department Management"
        targetPath="/departments"
      />

      {/* SUB-TABS */}
      <div className="flex items-center gap-2 border-b border-border pb-3">
        <button
          type="button"
          onClick={() => setActiveTab("profile")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === "profile"
              ? "bg-[#00B87C] text-white shadow-xs"
              : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
        >
          Company Profile & Localization
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("locations")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === "locations"
              ? "bg-[#00B87C] text-white shadow-xs"
              : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
        >
          Site Locations
        </button>
      </div>

      {/* TAB CONTENT */}
      <div>
        {activeTab === "profile" ? <CompanyProfileSection /> : <LocationsSection />}
      </div>
    </div>
  );
}
