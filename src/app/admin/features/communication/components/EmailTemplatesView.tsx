/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Edit3, Sparkles, BookOpen } from "lucide-react";
import {
  CommunicationState,
  EmailTemplate,
} from "../types/communication.types";

interface EmailTemplatesViewProps {
  state: CommunicationState;
  handleSaveEmailTemplate: (template: EmailTemplate) => void;
}

export function EmailTemplatesView({
  state,
  handleSaveEmailTemplate,
}: EmailTemplatesViewProps) {
  const [selectedId, setSelectedId] = useState(
    state.emailTemplates[0]?.id || "",
  );
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [category, setCategory] =
    useState<EmailTemplate["category"]>("Authentication");
  const [version, setVersion] = useState("1.0.0");
  const [templateName, setTemplateName] = useState("");

  const currentTemplate = state.emailTemplates.find((t) => t.id === selectedId);

  // Sync state when template selection changes
  useEffect(() => {
    if (currentTemplate) {
      setSubject(currentTemplate.subject);
      setBody(currentTemplate.body);
      setCategory(currentTemplate.category);
      setVersion(currentTemplate.version);
      setTemplateName(currentTemplate.template_name);
    }
  }, [selectedId, currentTemplate]);

  // Variables mapping dictionary for the real-time preview panel
  const mockVariables: Record<string, string> = {
    "{{name}}": "Pradeep Kumar",
    "{{organization}}": "Acme Software Enterprise Ltd",
    "{{expiry_date}}": "July 10, 2026",
    "{{employee_id}}": "EMP-992381",
  };

  const getMappedPreview = (text: string) => {
    let output = text;
    Object.entries(mockVariables).forEach(([variable, value]) => {
      // Escape special regex characters in variable names
      const escapedVar = variable.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      output = output.replace(new RegExp(escapedVar, "g"), value);
    });
    return output;
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !body.trim()) {
      alert("Subject and Body fields are required.");
      return;
    }
    handleSaveEmailTemplate({
      id: selectedId,
      template_name: templateName,
      subject,
      body,
      category,
      version,
    });
  };

  return (
    <div className="space-y-6">
      {/* Template selector tabs */}
      <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row gap-4 items-center justify-between">
        <span className="text-xs font-semibold uppercase text-gray-500 tracking-wider">
          Select Mail Notification Template
        </span>
        <select
          value={selectedId}
          onChange={(e) => setSelectedId(e.target.value)}
          className="w-full sm:w-80 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs font-bold text-gray-900 focus:outline-indigo-500 cursor-pointer font-mono"
        >
          {state.emailTemplates.map((temp) => (
            <option key={temp.id} value={temp.id}>
              {temp.template_name} ({temp.version})
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Editor Form */}
        <form
          onSubmit={handleFormSubmit}
          className="lg:col-span-7 bg-white border border-gray-200 rounded-2xl p-5 shadow-xs space-y-4"
        >
          <div className="flex justify-between items-center pb-2 border-b border-gray-100">
            <h4 className="text-xs font-semibold uppercase text-gray-500 tracking-wider flex items-center gap-1.5">
              <Edit3 className="w-4 h-4 text-indigo-500" /> Template Structure
              Editor
            </h4>
            <span className="text-[10px] font-extrabold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded border border-indigo-100 font-mono">
              Category: {category}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">
                Template Name
              </label>
              <input
                type="text"
                required
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs font-bold text-gray-900 focus:outline-indigo-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">
                Version Release Label
              </label>
              <input
                type="text"
                required
                value={version}
                onChange={(e) => setVersion(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs font-bold text-gray-900 focus:outline-indigo-500 font-mono"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">
              Email Subject Line
            </label>
            <input
              type="text"
              required
              placeholder="Enter subject header..."
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full bg-gray-50 border border-gray-205 rounded-lg px-3 py-2 text-xs font-bold text-gray-900 focus:outline-indigo-500"
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">
                Email Body (Plaintext/HTML)
              </label>
              <span className="text-[9px] font-extrabold text-gray-400 bg-gray-50 px-2 py-0.5 rounded font-mono">
                UTF-8 Encoding
              </span>
            </div>
            <textarea
              required
              rows={8}
              placeholder="Compose email template layout..."
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="w-full bg-gray-50 border border-gray-205 rounded-lg px-3 py-2 text-xs font-medium text-gray-900 focus:outline-indigo-500 font-mono leading-relaxed"
            />
          </div>

          <div className="flex justify-end pt-1">
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-650 hover:bg-indigo-750 text-white rounded-xl text-xs font-bold cursor-pointer border-none transition-all shadow-sm"
            >
              Commit Template Settings
            </button>
          </div>
        </form>

        {/* Live Preview Panel & Glossary */}
        <div className="lg:col-span-5 space-y-6">
          {/* Glossary helper */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs space-y-3">
            <h4 className="text-xs font-semibold uppercase text-gray-500 tracking-wider flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-indigo-500" /> Supported
              Template Variable Glossary
            </h4>
            <div className="grid grid-cols-2 gap-2 text-[10px] font-semibold">
              <div className="bg-gray-50 p-2 rounded-lg border border-gray-150">
                <span className="text-indigo-650 font-mono font-bold block mb-0.5">
                  {"{{name}}"}
                </span>
                <span className="text-gray-500">Employee/Admin name</span>
              </div>
              <div className="bg-gray-50 p-2 rounded-lg border border-gray-150">
                <span className="text-indigo-650 font-mono font-bold block mb-0.5">
                  {"{{organization}}"}
                </span>
                <span className="text-gray-500">Workspace Tenant Name</span>
              </div>
              <div className="bg-gray-50 p-2 rounded-lg border border-gray-150">
                <span className="text-indigo-650 font-mono font-bold block mb-0.5">
                  {"{{expiry_date}}"}
                </span>
                <span className="text-gray-500">Renewal countdown date</span>
              </div>
              <div className="bg-gray-50 p-2 rounded-lg border border-gray-150">
                <span className="text-indigo-650 font-mono font-bold block mb-0.5">
                  {"{{employee_id}}"}
                </span>
                <span className="text-gray-500">
                  Unique user registration id
                </span>
              </div>
            </div>
          </div>

          {/* Dynamic Preview Container */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs space-y-4">
            <h4 className="text-xs font-semibold uppercase text-indigo-700 tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" /> Live Variables Mapping Preview
            </h4>

            <div className="border border-gray-200 rounded-xl p-4 bg-gray-50/50 space-y-3">
              <div className="pb-2 border-b border-gray-200">
                <span className="text-[10px] font-extrabold text-gray-400 uppercase block mb-1">
                  Subject Output Header
                </span>
                <div className="text-xs font-bold text-gray-900">
                  {getMappedPreview(subject) || "No subject configured"}
                </div>
              </div>
              <div>
                <span className="text-[10px] font-extrabold text-gray-400 uppercase block mb-1">
                  Body Text Output
                </span>
                <div className="text-[11px] text-gray-700 leading-relaxed whitespace-pre-wrap font-medium font-sans">
                  {getMappedPreview(body) || "No body text configured"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
