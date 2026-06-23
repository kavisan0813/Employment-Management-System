/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Coins } from "lucide-react";
import { SystemConfig } from "../types/platformSettings.types";

interface Props {
  config: SystemConfig;
  setConfig: React.Dispatch<React.SetStateAction<SystemConfig>>;
  getFormattedCurrencyPreview: () => string;
}

export function CurrencySettingsView({
  config,
  setConfig,
  getFormattedCurrencyPreview
}: Props) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Base Currency Code</label>
              <select
                value={config.currency.defaultCode}
                onChange={e => {
                  const symbols: Record<string, string> = { INR: "₹", USD: "$", AED: "د.إ", EUR: "€", SGD: "S$" };
                  setConfig(p => ({
                    ...p,
                    currency: {
                      ...p.currency,
                      defaultCode: e.target.value,
                      symbol: symbols[e.target.value] || "$"
                    }
                  }));
                }}
                className="w-full text-xs font-semibold p-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white cursor-pointer"
              >
                <option value="INR">INR (Indian Rupee)</option>
                <option value="USD">USD (US Dollar)</option>
                <option value="AED">AED (UAE Dirham)</option>
                <option value="EUR">EUR (Euro)</option>
                <option value="SGD">SGD (Singapore Dollar)</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Currency Symbol</label>
              <input
                type="text"
                value={config.currency.symbol}
                onChange={e => setConfig(p => ({ ...p, currency: { ...p.currency, symbol: e.target.value } }))}
                className="w-full text-xs font-semibold p-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Decimal Places</label>
              <select
                value={config.currency.decimalPlaces}
                onChange={e => setConfig(p => ({ ...p, currency: { ...p.currency, decimalPlaces: Number(e.target.value) } }))}
                className="w-full text-xs font-semibold p-2.5 border border-gray-200 rounded-xl bg-white cursor-pointer"
              >
                <option value={0}>0 (No decimals)</option>
                <option value={2}>2 Decimals (.00)</option>
                <option value={3}>3 Decimals (.000)</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Symbol Position</label>
              <select
                value={config.currency.symbolPosition}
                onChange={e => setConfig(p => ({ ...p, currency: { ...p.currency, symbolPosition: e.target.value as any } }))}
                className="w-full text-xs font-semibold p-2.5 border border-gray-200 rounded-xl bg-white cursor-pointer"
              >
                <option value="before">Before Amount (e.g. ₹50,000)</option>
                <option value="after">After Amount (e.g. 50,000 INR)</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5 pt-2">
            <label className="flex items-center gap-2 text-xs font-bold text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={config.currency.autoConversion}
                onChange={e => setConfig(p => ({ ...p, currency: { ...p.currency, autoConversion: e.target.checked } }))}
                className="w-4 h-4 rounded accent-indigo-650"
              />
              Enable Dynamic Currency Conversion (Automated exchange rates)
            </label>
            <p className="text-[10px] text-gray-400 font-semibold pl-6">
              Converts foreign payroll indices and platform invoices into tenant base currencies automatically using global daily exchange indices.
            </p>
          </div>

        </div>

        <div className="bg-indigo-50/20 rounded-2xl p-5 border border-indigo-105 flex flex-col justify-between space-y-4">
          <div>
            <h4 className="text-xs font-extrabold text-indigo-950 uppercase tracking-wide flex items-center gap-1.5">
              <Coins className="w-4 h-4 text-indigo-650" />
              Currency Render Sandbox
            </h4>
            <p className="text-[10px] text-indigo-500 font-semibold mt-1">
              Evaluates how salary entries, invoicing schedules, and financial reports will display amounts on the screen:
            </p>
          </div>

          <div className="space-y-3 font-semibold text-xs bg-white border border-indigo-100/60 p-5 rounded-xl shadow-xs">
            <div className="flex justify-between items-center">
              <span className="text-gray-400 font-bold text-[10px] uppercase">Configured Code</span>
              <span className="text-indigo-900 font-extrabold">{config.currency.defaultCode} ({config.currency.symbol})</span>
            </div>
            <hr className="border-gray-100" />
            <div className="flex justify-between items-center">
              <span className="text-gray-400 font-bold text-[10px] uppercase">Format Style Sample</span>
              <span className="font-mono text-xl font-black text-indigo-950">{getFormattedCurrencyPreview()}</span>
            </div>
            <hr className="border-gray-100" />
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-gray-450 font-bold">Exchange Conversion status</span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${config.currency.autoConversion ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-gray-100 text-gray-600 border border-gray-150"}`}>
                {config.currency.autoConversion ? "Live Rates Active" : "Fixed Rates Only"}
              </span>
            </div>
          </div>

          <div className="p-3 bg-white border border-gray-150 rounded-xl space-y-1.5 text-[10px] text-gray-500 font-semibold">
            <div className="text-[9px] uppercase tracking-wider font-extrabold text-gray-450">Multi-country conversion preview</div>
            <div className="flex justify-between items-center">
              <span>Subscription standard plan:</span>
              <span className="font-mono font-bold text-gray-900">
                USD 100 &rarr; {config.currency.symbolPosition === "before" ? `${config.currency.symbol} ` : ""}{(100 * (config.currency.defaultCode === "INR" ? 83.5 : config.currency.defaultCode === "AED" ? 3.67 : 1.35)).toFixed(0)} {config.currency.symbolPosition === "after" ? config.currency.defaultCode : ""}
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
