/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Server, Send, Terminal } from "lucide-react";
import { SystemConfig } from "../types/platformSettings.types";
import { platformSettingsService } from "../services/platformSettings.service";

interface Props {
  config: SystemConfig;
  setConfig: React.Dispatch<React.SetStateAction<SystemConfig>>;
  triggerAlert: (msg: string, type?: "success" | "info" | "error") => void;
}

export function EmailSettingsView({ config, setConfig, triggerAlert }: Props) {
  const [selectedTemplate, setSelectedTemplate] = useState<
    "welcome" | "billingFailed"
  >("welcome");

  // SMTP Test Terminal simulation log trace
  const [smtpTesting, setSmtpTesting] = useState(false);
  const [smtpLogs, setSmtpLogs] = useState<string[]>([]);

  const runSmtpTest = async () => {
    setSmtpTesting(true);
    setSmtpLogs([]);
    try {
      const logs = await platformSettingsService.simulateSmtpHandshake(
        config.email.smtpHost,
        config.email.smtpPort,
        config.email.smtpUser,
        config.email.senderEmail,
      );

      // Simulate real-time printing logs
      let currentLogIndex = 0;
      const interval = setInterval(() => {
        if (currentLogIndex < logs.length) {
          setSmtpLogs((prev) => [...prev, logs[currentLogIndex]]);
          currentLogIndex++;
        } else {
          clearInterval(interval);
          setSmtpTesting(false);
          triggerAlert(
            "SMTP configuration verification completed. Outbound mail channel is active!",
            "success",
          );
        }
      }, 450);
    } catch (err) {
      setSmtpTesting(false);
      console.log("SMTP connection handshake failed.", err);
    }
  };

  return (
    <div className="space-y-6">
      {/* SMTP Server Configuration Form */}
      <div className="bg-gray-50/50 p-5 border border-gray-150 rounded-2xl space-y-4">
        <h3 className="text-xs font-extrabold text-gray-905 uppercase tracking-wider flex items-center gap-1.5">
          <Server className="w-4 h-4 text-indigo-650" />
          SMTP Outbound Delivery Server (SMTP)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-semibold text-gray-700">
          <div className="space-y-1">
            <span className="text-[10px] text-gray-400 block font-bold">
              SMTP HOST *
            </span>
            <input
              type="text"
              value={config.email.smtpHost}
              onChange={(e) =>
                setConfig((p) => ({
                  ...p,
                  email: { ...p.email, smtpHost: e.target.value },
                }))
              }
              className="w-full p-2.5 bg-white border border-gray-200 rounded-xl"
            />
          </div>
          <div className="space-y-1">
            <span className="text-[10px] text-gray-400 block font-bold">
              SMTP PORT *
            </span>
            <input
              type="number"
              value={config.email.smtpPort}
              onChange={(e) =>
                setConfig((p) => ({
                  ...p,
                  email: { ...p.email, smtpPort: Number(e.target.value) },
                }))
              }
              className="w-full p-2.5 bg-white border border-gray-200 rounded-xl"
            />
          </div>
          <div className="space-y-1">
            <span className="text-[10px] text-gray-400 block font-bold">
              SMTP USERNAME *
            </span>
            <input
              type="text"
              value={config.email.smtpUser}
              onChange={(e) =>
                setConfig((p) => ({
                  ...p,
                  email: { ...p.email, smtpUser: e.target.value },
                }))
              }
              className="w-full p-2.5 bg-white border border-gray-200 rounded-xl"
            />
          </div>
          <div className="space-y-1">
            <span className="text-[10px] text-gray-400 block font-bold">
              SMTP PASSWORD *
            </span>
            <input
              type="password"
              value={config.email.smtpPass}
              onChange={(e) =>
                setConfig((p) => ({
                  ...p,
                  email: { ...p.email, smtpPass: e.target.value },
                }))
              }
              className="w-full p-2.5 bg-white border border-gray-200 rounded-xl"
            />
          </div>
          <div className="space-y-1">
            <span className="text-[10px] text-gray-400 block font-bold">
              DEFAULT SENDER ADDRESS *
            </span>
            <input
              type="email"
              value={config.email.senderEmail}
              onChange={(e) =>
                setConfig((p) => ({
                  ...p,
                  email: { ...p.email, senderEmail: e.target.value },
                }))
              }
              className="w-full p-2.5 bg-white border border-gray-200 rounded-xl"
            />
          </div>
          <div className="flex items-end">
            <button
              type="button"
              onClick={runSmtpTest}
              disabled={smtpTesting}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer shadow-sm disabled:opacity-55"
            >
              <Send className="w-3.5 h-3.5" />
              {smtpTesting ? "Connecting..." : "Test Connection"}
            </button>
          </div>
        </div>

        {/* SMTP Test Connection Log Terminal widget */}
        {smtpLogs.length > 0 && (
          <div className="space-y-1.5">
            <div className="text-[9px] uppercase tracking-wider font-extrabold text-gray-400 flex items-center gap-1">
              <Terminal className="w-3 h-3 text-indigo-500" />
              SMTP Socket Negotiation Log Console
            </div>
            <div className="bg-gray-900 border border-gray-950 rounded-xl p-4 font-mono text-[10px] text-teal-400 leading-relaxed max-h-48 overflow-y-auto space-y-1 shadow-inner">
              {smtpLogs.map((log, idx) => (
                <div
                  key={idx}
                  className={
                    log.includes("SUCCESS")
                      ? "text-emerald-400 font-extrabold"
                      : ""
                  }
                >
                  {log}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <hr className="border-gray-155" />

      {/* Transactional Template Editors and Visual Dispatch previews */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-3 font-semibold text-xs text-gray-700">
          <div className="flex justify-between items-center">
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
              Transactional Email Templates
            </span>
            <div className="flex gap-1.5">
              <button
                type="button"
                onClick={() => setSelectedTemplate("welcome")}
                className={`px-2.5 py-1 rounded text-[10px] font-bold cursor-pointer transition-all ${selectedTemplate === "welcome" ? "bg-indigo-650 text-white" : "bg-gray-100 hover:bg-gray-250 text-gray-750"}`}
              >
                Welcome
              </button>
              <button
                type="button"
                onClick={() => setSelectedTemplate("billingFailed")}
                className={`px-2.5 py-1 rounded text-[10px] font-bold cursor-pointer transition-all ${selectedTemplate === "billingFailed" ? "bg-indigo-650 text-white" : "bg-gray-100 hover:bg-gray-250 text-gray-755"}`}
              >
                Billing Failed
              </button>
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] text-gray-400 block font-bold">
              EMAIL SUBJECT HEADER
            </span>
            <input
              type="text"
              value={config.email.templates[selectedTemplate].subject}
              onChange={(e) => {
                const val = e.target.value;
                setConfig((p) => ({
                  ...p,
                  email: {
                    ...p.email,
                    templates: {
                      ...p.email.templates,
                      [selectedTemplate]: {
                        ...p.email.templates[selectedTemplate],
                        subject: val,
                      },
                    },
                  },
                }));
              }}
              className="w-full p-2.5 border border-gray-200 rounded-xl"
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center mb-1">
              <span className="text-[10px] text-gray-400 block font-bold">
                TEMPLATE BODY (MARKDOWN / TEXT)
              </span>
              <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wide">
                Placeholders: {"{{user_name}}"}, {"{{org_name}}"}
              </span>
            </div>
            <textarea
              value={config.email.templates[selectedTemplate].body}
              onChange={(e) => {
                const val = e.target.value;
                setConfig((p) => ({
                  ...p,
                  email: {
                    ...p.email,
                    templates: {
                      ...p.email.templates,
                      [selectedTemplate]: {
                        ...p.email.templates[selectedTemplate],
                        body: val,
                      },
                    },
                  },
                }));
              }}
              rows={6}
              className="w-full p-3 font-mono text-[11px] leading-relaxed border border-gray-200 rounded-xl bg-gray-50 focus:bg-white"
            />
          </div>
        </div>

        {/* Email Visual Preview box */}
        <div className="bg-gray-55/50 border border-gray-150 rounded-2xl p-5 flex flex-col justify-between space-y-4">
          <div>
            <span className="text-[10px] uppercase font-extrabold tracking-wider text-gray-400 block">
              Mock Email Dispatch Previewer
            </span>
            <p className="text-[9px] text-gray-450 font-semibold mt-0.5">
              Parsed content layout rendering client-side details:
            </p>
          </div>

          <div className="border border-gray-205 rounded-xl overflow-hidden flex-1 flex flex-col bg-white shadow-xs">
            <div className="p-3 bg-gray-50 border-b border-gray-150 text-[10px] text-gray-500 font-bold space-y-1">
              <div>
                From:{" "}
                <span className="text-gray-905">
                  {config.general.appName} Platform Delivery &lt;
                  {config.email.senderEmail}&gt;
                </span>
              </div>
              <div className="truncate">
                Subject:{" "}
                <span className="text-gray-905">
                  {config.email.templates[selectedTemplate].subject.replace(
                    "{{org_name}}",
                    "Acme Corporation",
                  )}
                </span>
              </div>
            </div>

            {/* Visual Email Template Header and Footer branding */}
            <div className="flex-1 p-4 flex flex-col justify-between min-h-48 text-[11px] leading-relaxed text-gray-700 bg-white">
              <div className="space-y-4">
                <div className="text-indigo-650 font-black tracking-wider text-[10px] uppercase pb-2 border-b border-gray-100">
                  {config.branding.emailHeaderLogo}
                </div>
                <div className="whitespace-pre-wrap font-medium">
                  {config.email.templates[selectedTemplate].body
                    .replace("{{user_name}}", "Pradeep Kumar")
                    .replace("{{org_name}}", "Acme Corporation")}
                </div>
              </div>
              <div className="pt-4 border-t border-gray-100 text-[9px] text-gray-400 font-bold flex justify-between items-center mt-4">
                <span>{config.branding.emailFooterText}</span>
                <span>System auto message</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
