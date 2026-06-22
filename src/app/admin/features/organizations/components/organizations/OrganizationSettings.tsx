/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { ModuleSelector } from "./ModuleSelector";

export function OrganizationSettings() {
  return (
    <div className="space-y-3">
      <h4 className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">
        Feature flags
      </h4>
      <ModuleSelector
        title="White-label custom domain"
        description="Bypass standard platform branding for this tenant."
        enabled
      />
      <ModuleSelector
        title="AI ticket auto-categorization"
        description="Automatically tag and route incoming support tickets."
        enabled
      />
    </div>
  );
}

export default OrganizationSettings;
