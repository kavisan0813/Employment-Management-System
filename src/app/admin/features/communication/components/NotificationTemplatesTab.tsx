import { useState, useEffect } from "react";
import useSWR from "swr";
import {
  Mail,
  MessageCircle,
  AlertTriangle,
  RotateCcw,
  Save,
  TestTube,
  History,
  Globe,
  Code,
} from "lucide-react";
import { communicationService } from "../services/communication.service";
import {
  TemplateCategory,
  TemplateVersionHistory,
} from "../types/communication.types";
import { format } from "date-fns";

export function NotificationTemplatesTab({
  showToast,
}: {
  showToast: (
    text: string,
    type: "success" | "error" | "info" | "warning",
  ) => void;
}) {
  const [category, setCategory] = useState<TemplateCategory>("welcome");
  const [activeTemplateId, setActiveTemplateId] = useState<string | null>(null);

  const { data: templates, mutate: mutateTemplates } = useSWR(
    ["templates", category],
    () => communicationService.getTemplatesByCategory(category),
  );

  const activeTemplate =
    templates?.find((t) => t.template_id === activeTemplateId) ||
    templates?.[0];

  useEffect(() => {
    if (templates && templates.length > 0 && !activeTemplateId) {
      setActiveTemplateId(templates[0].template_id);
    }
  }, [templates, activeTemplateId]);

  const [subjectLine, setSubjectLine] = useState("");
  const [bodyHtml, setBodyHtml] = useState("");
  const [bodyText, setBodyText] = useState("");

  // Sync state when active template changes
  useEffect(() => {
    if (activeTemplate) {
      setSubjectLine(activeTemplate.subject_line);
      setBodyHtml(activeTemplate.body_html);
      setBodyText(activeTemplate.body_text);
    }
  }, [activeTemplate]);

  const [isSaving, setIsSaving] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [historyData, setHistoryData] = useState<TemplateVersionHistory[]>([]);

  const hasChanges =
    activeTemplate &&
    (subjectLine !== activeTemplate.subject_line ||
      bodyHtml !== activeTemplate.body_html ||
      bodyText !== activeTemplate.body_text);

  const handleSave = async () => {
    if (!activeTemplate) return;
    setIsSaving(true);
    try {
      const validation = communicationService.validateTemplateVariables(
        bodyHtml,
        activeTemplate.available_variables,
      );
      if (!validation.valid) {
        showToast(
          `Invalid variables used: ${validation.invalidVars.join(", ")}`,
          "error",
        );
        setIsSaving(false);
        return;
      }

      await communicationService.updateTemplate(activeTemplate.template_id, {
        subjectLine,
        bodyHtml,
        bodyText,
      });
      showToast("Template saved successfully", "success");
      mutateTemplates();
    } catch (err) {
      showToast("Failed to save template", "error");
      console.log(err);
    } finally {
      setIsSaving(false);
    }
  };

  const loadHistory = async () => {
    if (!activeTemplate) return;
    try {
      const hist = await communicationService.getTemplateVersionHistory(
        activeTemplate.template_id,
      );
      setHistoryData(hist);
      setIsHistoryOpen(true);
    } catch (err) {
      showToast("Failed to load history", "error");
      console.log(err);
    }
  };

  const handleRevert = async (versionId: string) => {
    if (
      !activeTemplate ||
      !window.confirm("Restore this version? Unsaved changes will be lost.")
    )
      return;
    try {
      await communicationService.revertToVersion(
        activeTemplate.template_id,
        versionId,
      );
      showToast("Template restored", "success");
      setIsHistoryOpen(false);
      mutateTemplates();
    } catch (err) {
      showToast("Failed to restore", "error");
      console.log(err);
    }
  };

  const handleResetToDefault = async () => {
    if (
      !activeTemplate ||
      !window.confirm(
        "Reset to factory defaults? All custom edits will be lost.",
      )
    )
      return;
    try {
      await communicationService.resetTemplateToDefault(
        activeTemplate.template_id,
      );
      showToast("Reset to default", "success");
      mutateTemplates();
    } catch (err) {
      showToast("Failed to reset", "error");
      console.log(err);
    }
  };

  const insertVariable = (variable: string) => {
    setBodyHtml((prev) => prev + `{{${variable}}}`);
  };

  const categories: { id: TemplateCategory; label: string }[] = [
    { id: "welcome", label: "Welcome Email" },
    { id: "password_reset", label: "Password Reset" },
    { id: "subscription_expiring", label: "Subscription Expiring" },
    { id: "payment_failed", label: "Payment Failed" },
    { id: "plan_changed", label: "Plan Changed" },
    { id: "account_suspended", label: "Account Suspended" },
  ];

  const validation = activeTemplate
    ? communicationService.validateTemplateVariables(
        bodyHtml,
        activeTemplate.available_variables,
      )
    : { valid: true, invalidVars: [] };

  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* LEFT SIDEBAR: Categories */}
      <div className="w-full md:w-64 flex-shrink-0 border-r border-gray-200 pr-4">
        <h3 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wider">
          Categories
        </h3>
        <div className="space-y-1">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setCategory(cat.id);
                setActiveTemplateId(null);
              }}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${category === cat.id ? "bg-indigo-50 text-indigo-700" : "text-gray-600 hover:bg-gray-100"}`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* RIGHT SIDE: Editor & Preview */}
      <div className="flex-1 min-w-0 flex flex-col">
        {!activeTemplate ? (
          <div className="p-12 text-center text-gray-500">
            Loading template...
          </div>
        ) : (
          <>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {activeTemplate.template_name}
                </h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded font-medium border border-gray-200 uppercase flex items-center gap-1">
                    <Globe className="w-3 h-3" /> {activeTemplate.language_code}
                  </span>
                  <span className="text-xs text-gray-500">
                    v{activeTemplate.version_number}
                  </span>
                  {activeTemplate.channel === "email" ? (
                    <Mail className="w-4 h-4 text-blue-500" />
                  ) : (
                    <MessageCircle className="w-4 h-4 text-emerald-500" />
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={loadHistory}
                  className="px-3 py-1.5 text-xs font-semibold text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg flex items-center gap-1 shadow-sm"
                >
                  <History className="w-4 h-4" /> History
                </button>
                <button
                  onClick={handleResetToDefault}
                  className="px-3 py-1.5 text-xs font-semibold text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg flex items-center gap-1 shadow-sm"
                >
                  <RotateCcw className="w-4 h-4" /> Reset
                </button>
                <button
                  disabled={!hasChanges || isSaving}
                  onClick={handleSave}
                  className="px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg flex items-center gap-1 shadow-sm disabled:opacity-50"
                >
                  <Save className="w-4 h-4" /> {isSaving ? "Saving..." : "Save"}
                </button>
              </div>
            </div>

            {!activeTemplate.is_active && (
              <div className="bg-amber-50 text-amber-800 p-3 rounded-lg border border-amber-200 text-sm flex items-center gap-2 mb-4 font-medium">
                <AlertTriangle className="w-4 h-4 shrink-0" /> This template is
                disabled. System will use the default template instead.
              </div>
            )}

            {!validation.valid && (
              <div className="bg-red-50 text-red-800 p-3 rounded-lg border border-red-200 text-sm flex items-center gap-2 mb-4 font-medium">
                <AlertTriangle className="w-4 h-4 shrink-0" /> Invalid variables
                detected: {validation.invalidVars.join(", ")}
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* EDITOR PANE */}
              <div className="flex flex-col gap-4">
                {activeTemplate.channel === "email" && (
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                      Subject Line
                    </label>
                    <input
                      type="text"
                      value={subjectLine}
                      onChange={(e) => setSubjectLine(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                    />
                  </div>
                )}
                <div className="flex-1 flex flex-col min-h-[300px]">
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    HTML Body
                  </label>
                  <textarea
                    value={bodyHtml}
                    onChange={(e) => setBodyHtml(e.target.value)}
                    className="w-full flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                    placeholder="<h1>Hello</h1>"
                  />
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-2 flex items-center gap-1">
                    <Code className="w-4 h-4" /> Available Variables
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {activeTemplate.available_variables.map((v) => (
                      <button
                        key={v}
                        onClick={() => insertVariable(v)}
                        className="bg-white border border-gray-300 text-gray-700 hover:border-indigo-500 hover:text-indigo-600 px-2 py-1 rounded text-xs font-mono shadow-sm transition-colors"
                      >
                        {`{{${v}}}`}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* PREVIEW PANE */}
              <div className="flex flex-col bg-gray-50 border border-gray-200 rounded-xl overflow-hidden">
                <div className="px-4 py-2 bg-gray-100 border-b border-gray-200 text-xs font-bold text-gray-600 uppercase flex justify-between items-center">
                  Live Preview
                  <button className="text-indigo-600 hover:text-indigo-800 flex items-center gap-1">
                    <TestTube className="w-3 h-3" /> Send Test
                  </button>
                </div>
                <div
                  className="p-4 flex-1 bg-white overflow-y-auto prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{
                    __html:
                      bodyHtml ||
                      '<p class="text-gray-400 italic">Empty body...</p>',
                  }}
                />
              </div>
            </div>
          </>
        )}
      </div>

      {/* VERSION HISTORY MODAL */}
      {isHistoryOpen && (
        <div className="fixed inset-0 bg-gray-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-3xl max-h-[80vh] flex flex-col shadow-xl">
            <div className="p-5 border-b border-gray-200 flex justify-between items-center bg-gray-50 rounded-t-xl">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <History className="w-5 h-5 text-indigo-600" /> Version History
              </h2>
              <button
                onClick={() => setIsHistoryOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                Close
              </button>
            </div>
            <div className="p-0 overflow-y-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b border-gray-200 sticky top-0">
                  <tr>
                    <th className="px-6 py-3 text-xs font-semibold text-gray-600 uppercase">
                      Date
                    </th>
                    <th className="px-6 py-3 text-xs font-semibold text-gray-600 uppercase">
                      Editor
                    </th>
                    <th className="px-6 py-3 text-xs font-semibold text-gray-600 uppercase text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {historyData.map((hist) => (
                    <tr key={hist.version_id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                        {format(new Date(hist.edited_at), "MMM d, yyyy HH:mm")}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {hist.edited_by}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleRevert(hist.version_id)}
                          className="text-indigo-600 hover:text-indigo-800 text-sm font-semibold flex items-center justify-end gap-1 w-full"
                        >
                          <RotateCcw className="w-4 h-4" /> Restore
                        </button>
                      </td>
                    </tr>
                  ))}
                  {historyData.length === 0 && (
                    <tr>
                      <td colSpan={3} className="p-8 text-center text-gray-500">
                        No version history found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
