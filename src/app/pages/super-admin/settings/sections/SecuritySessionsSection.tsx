import React from "react";
import { SecuritySettingsSection } from "./SecuritySettingsSection";
import * as Icons from "lucide-react";

export function SecuritySessionsSection() {
  return (
    <div className="space-y-6">
      {/* BACKEND SESSION & TOKEN POLICY NOTICE */}
      <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200 flex items-start gap-3">
        <Icons.ShieldAlert size={20} className="text-amber-600 flex-shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs">
          <div className="font-bold">
            BACKEND AUTH / SESSION MANAGEMENT REQUIRED
          </div>
          <p className="text-amber-800 dark:text-amber-300/90 leading-relaxed">
            JWT refresh token expiration, active token revocation, and session secret rotation are enforced at the backend authentication provider layer. Frontend controls govern idle timeout thresholds, MFA enforcement policies, and password complexity rules.
          </p>
        </div>
      </div>

      {/* SECURITY CONTROLS */}
      <SecuritySettingsSection />
    </div>
  );
}
