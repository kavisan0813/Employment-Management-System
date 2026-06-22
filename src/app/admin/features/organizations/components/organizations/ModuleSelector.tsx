/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";

interface ModuleSelectorProps {
  title: string;
  description: string;
  enabled: boolean;
  onToggle?: (enabled: boolean) => void;
}

export function ModuleSelector({
  title,
  description,
  enabled,
  onToggle,
}: ModuleSelectorProps) {
  return (
    <div className="flex items-center justify-between p-3.5 border border-gray-250 rounded-2xl">
      <div>
        <p className="font-medium text-gray-900">{title}</p>
        <p className="text-[11px] text-gray-400">{description}</p>
      </div>
      <button
        type="button"
        onClick={() => onToggle && onToggle(!enabled)}
        className={`relative inline-flex items-center h-5 rounded-full w-9 transition-colors focus:outline-none ${enabled ? "bg-amber-400" : "bg-gray-300"}`}
      >
        <span
          className={`inline-block w-3.5 h-3.5 transform bg-white rounded-full transition-transform ${enabled ? "translate-x-5" : "translate-x-1"}`}
        />
      </button>
    </div>
  );
}

export default ModuleSelector;
