/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Coins, Globe } from "lucide-react";
import { SystemConfig } from "../types/platformSettings.types";

interface Props {
  config: SystemConfig;
  setConfig: React.Dispatch<React.SetStateAction<SystemConfig>>;
  getFormattedCurrencyPreview: () => string;
}

export function CurrencySettingsView({
  config,
  setConfig,
  getFormattedCurrencyPreview,
}: Props) {
  const updateCurrency = (key: keyof SystemConfig["currency"], value: any) => {
    setConfig((prev) => ({
      ...prev,
      currency: { ...prev.currency, [key]: value },
    }));
  };

  const inputClass =
    "w-full text-sm p-2.5 border border-gray-200 rounded-lg outline-none focus:border-indigo-400 transition-colors";
  const labelClass =
    "text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block";

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Configuration Form */}
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className={labelClass}>Base Currency</label>
              <select
                value={config.currency.defaultCode}
                onChange={(e) => {
                  const symbols: Record<string, string> = {
                    INR: "₹",
                    USD: "$",
                    AED: "د.إ",
                    EUR: "€",
                    SGD: "S$",
                  };
                  setConfig((p) => ({
                    ...p,
                    currency: {
                      ...p.currency,
                      defaultCode: e.target.value,
                      symbol: symbols[e.target.value] || "$",
                    },
                  }));
                }}
                className={inputClass}
              >
                <option value="INR">INR (₹)</option>
                <option value="USD">USD ($)</option>
                <option value="AED">AED (د.إ)</option>
                <option value="EUR">EUR (€)</option>
                <option value="SGD">SGD (S$)</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className={labelClass}>Currency Symbol</label>
              <input
                type="text"
                value={config.currency.symbol}
                onChange={(e) => updateCurrency("symbol", e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className={labelClass}>Decimal Places</label>
              <select
                value={config.currency.decimalPlaces}
                onChange={(e) =>
                  updateCurrency("decimalPlaces", Number(e.target.value))
                }
                className={inputClass}
              >
                <option value={0}>0 (No decimals)</option>
                <option value={2}>2 (.00)</option>
                <option value={3}>3 (.000)</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className={labelClass}>Symbol Position</label>
              <select
                value={config.currency.symbolPosition}
                onChange={(e) =>
                  updateCurrency("symbolPosition", e.target.value)
                }
                className={inputClass}
              >
                <option value="before">Before Amount</option>
                <option value="after">After Amount</option>
              </select>
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 cursor-pointer">
            <input
              type="checkbox"
              checked={config.currency.autoConversion}
              onChange={(e) =>
                updateCurrency("autoConversion", e.target.checked)
              }
              className="rounded text-indigo-600 focus:ring-indigo-500"
            />
            Enable Dynamic Conversion
          </label>
        </div>

        {/* Right: Currency Sandbox */}
        <div className="bg-indigo-50/30 border border-indigo-100 rounded-2xl p-6 flex flex-col space-y-6">
          <h4 className="text-sm font-semibold text-indigo-900 flex items-center gap-2">
            <Coins className="w-4 h-4" /> Currency Sandbox
          </h4>

          <div className="space-y-4 bg-white p-5 rounded-xl border border-indigo-100 shadow-sm">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-gray-500 uppercase">
                Live Preview
              </span>
              <span className="font-mono text-indigo-700 text-xl font-bold">
                {getFormattedCurrencyPreview()}
              </span>
            </div>

            <div className="pt-4 border-t border-gray-100 flex justify-between items-center text-xs">
              <span className="font-semibold text-gray-500 uppercase">
                Auto-Conversion
              </span>
              <span
                className={`px-2 py-0.5 rounded-full font-bold uppercase text-[10px] ${config.currency.autoConversion ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-600"}`}
              >
                {config.currency.autoConversion ? "Active" : "Disabled"}
              </span>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-white rounded-xl border border-gray-100 text-xs text-gray-600">
            <Globe className="w-4 h-4 text-indigo-500 flex-shrink-0" />
            <p>
              <strong>Conversion Preview:</strong> A USD 100 base amount will
              render as <strong>{getFormattedCurrencyPreview()}</strong> based
              on current daily exchange index rates.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
