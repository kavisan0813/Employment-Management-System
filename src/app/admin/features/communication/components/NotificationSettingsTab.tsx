import React, { useState } from "react";
import useSWR from "swr";
import {
  Settings,
  ShieldAlert,
  Lock,
  Unlock,
  Mail,
  MonitorSmartphone,
  AlertTriangle,
  MessageCircle,
  Save,
} from "lucide-react";
import { communicationService } from "../services/communication.service";
import {
  PlatformNotificationPolicy,
  MinimumRequiredChannel,
  AnnouncementChannel,
} from "../types/communication.types";

export function NotificationSettingsTab({
  showToast,
}: {
  showToast: (
    text: string,
    type: "success" | "error" | "info" | "warning",
  ) => void;
}) {
  const {
    data: policies,
    error,
    isLoading,
    mutate,
  } = useSWR("policies", () =>
    communicationService.getPlatformNotificationPolicies(),
  );

  const [editingPolicy, setEditingPolicy] =
    useState<PlatformNotificationPolicy | null>(null);
  const [isMandatory, setIsMandatory] = useState(false);
  const [minChannel, setMinChannel] = useState<MinimumRequiredChannel>("none");
  const [defaultChannels, setDefaultChannels] = useState<AnnouncementChannel[]>(
    [],
  );
  const [isSaving, setIsSaving] = useState(false);

  const [confirmDialog, setConfirmDialog] = useState<boolean>(false);

  const handleEdit = (policy: PlatformNotificationPolicy) => {
    setEditingPolicy(policy);
    setIsMandatory(policy.is_mandatory);
    setMinChannel(policy.minimum_required_channel);
    setDefaultChannels([...policy.default_channels]);
  };

  const handleChannelToggle = (ch: AnnouncementChannel) => {
    if (defaultChannels.includes(ch)) {
      setDefaultChannels(defaultChannels.filter((c) => c !== ch));
    } else {
      setDefaultChannels([...defaultChannels, ch]);
    }
  };

  const handleSave = async (forceConfirm = false) => {
    if (!editingPolicy) return;

    if (isMandatory && minChannel === "none") {
      showToast(
        "Mandatory policies must have a minimum required channel",
        "error",
      );
      return;
    }

    if (defaultChannels.length === 0) {
      showToast("Must select at least one default channel", "error");
      return;
    }

    if (!editingPolicy.is_mandatory && isMandatory && !forceConfirm) {
      // Need confirmation
      setConfirmDialog(true);
      return;
    }

    setIsSaving(true);
    try {
      await communicationService.updatePlatformPolicy(
        editingPolicy.notification_type,
        {
          isMandatory,
          minimumRequiredChannel: minChannel,
          defaultChannels,
        },
      );
      showToast("Policy updated successfully", "success");
      setEditingPolicy(null);
      setConfirmDialog(false);
      mutate();
    } catch (err) {
      showToast("Failed to update policy", "error");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-6 py-3 text-xs font-semibold text-gray-600 uppercase">
                Notification Type
              </th>
              <th className="px-6 py-3 text-xs font-semibold text-gray-600 uppercase">
                Mandatory Status
              </th>
              <th className="px-6 py-3 text-xs font-semibold text-gray-600 uppercase">
                Min Required Channel
              </th>
              <th className="px-6 py-3 text-xs font-semibold text-gray-600 uppercase">
                Default Channels
              </th>
              <th className="px-6 py-3 text-xs font-semibold text-gray-600 uppercase text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {isLoading ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-red-500">
                  Failed to load
                </td>
              </tr>
            ) : (
              policies?.map((policy) => (
                <tr key={policy.notification_type} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-gray-900 text-sm">
                      {policy.name}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {policy.description}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {policy.is_mandatory ? (
                      <span className="inline-flex items-center gap-1 bg-rose-50 text-rose-700 px-2 py-0.5 rounded text-xs font-bold border border-rose-200">
                        <Lock className="w-3 h-3" /> Mandatory
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded text-xs font-bold border border-emerald-200">
                        <Unlock className="w-3 h-3" /> Optional
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 capitalize">
                    {policy.is_mandatory ? (
                      policy.minimum_required_channel.replace("_", "-")
                    ) : (
                      <span className="text-gray-400 italic">N/A</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      {policy.default_channels.includes("in_app") && (
                        <span title="In-App">
                          <MonitorSmartphone className="w-4 h-4 text-indigo-600" />
                        </span>
                      )}
                      {policy.default_channels.includes("email") && (
                        <span title="Email">
                          <Mail className="w-4 h-4 text-blue-600" />
                        </span>
                      )}
                      {policy.default_channels.includes("sms") && (
                        <span title="SMS">
                          <MessageCircle className="w-4 h-4 text-emerald-600" />
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleEdit(policy)}
                      className="text-indigo-600 hover:text-indigo-800 text-sm font-semibold flex items-center justify-end gap-1 w-full"
                    >
                      <Settings className="w-4 h-4" /> Configure
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* EDIT MODAL */}
      {editingPolicy && !confirmDialog && (
        <div className="fixed inset-0 bg-gray-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-md shadow-xl flex flex-col">
            <div className="p-5 border-b border-gray-200 flex justify-between items-center bg-gray-50 rounded-t-xl">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Settings className="w-5 h-5 text-indigo-600" /> Configure
                Policy
              </h2>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <h3 className="font-bold text-gray-900">
                  {editingPolicy.name}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {editingPolicy.description}
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-sm font-bold text-gray-800 flex items-center gap-2">
                    {isMandatory ? (
                      <Lock className="w-4 h-4 text-rose-600" />
                    ) : (
                      <Unlock className="w-4 h-4 text-emerald-600" />
                    )}
                    Enforce as Mandatory
                  </span>
                  <div
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isMandatory ? "bg-indigo-600" : "bg-gray-200"}`}
                  >
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={isMandatory}
                      onChange={(e) => setIsMandatory(e.target.checked)}
                    />
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${isMandatory ? "translate-x-6" : "translate-x-1"}`}
                    />
                  </div>
                </label>
                {isMandatory && (
                  <p className="text-xs text-rose-600 mt-2 font-medium">
                    Organizations will not be able to fully disable this
                    notification type. They can still choose how they receive
                    it.
                  </p>
                )}
              </div>

              {isMandatory && (
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Minimum Required Channel
                  </label>
                  <select
                    value={minChannel}
                    onChange={(e) =>
                      setMinChannel(e.target.value as MinimumRequiredChannel)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none"
                  >
                    <option value="none" disabled>
                      Select channel...
                    </option>
                    <option value="email">Email</option>
                    <option value="in_app">In-App Notification</option>
                  </select>
                </div>
              )}

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Default Channels for New Orgs
                </label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={defaultChannels.includes("in_app")}
                      onChange={() => handleChannelToggle("in_app")}
                    />
                    <span className="text-sm flex items-center gap-1">
                      <MonitorSmartphone className="w-4 h-4 text-gray-500" />{" "}
                      In-App
                    </span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={defaultChannels.includes("email")}
                      onChange={() => handleChannelToggle("email")}
                    />
                    <span className="text-sm flex items-center gap-1">
                      <Mail className="w-4 h-4 text-gray-500" /> Email
                    </span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={defaultChannels.includes("sms")}
                      onChange={() => handleChannelToggle("sms")}
                    />
                    <span className="text-sm flex items-center gap-1">
                      <MessageCircle className="w-4 h-4 text-gray-500" /> SMS
                      Text Message
                    </span>
                  </label>
                </div>
              </div>
            </div>
            <div className="p-5 border-t border-gray-200 bg-gray-50 flex justify-end gap-3 rounded-b-xl">
              <button
                onClick={() => setEditingPolicy(null)}
                className="px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSave(false)}
                className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg flex items-center gap-2"
              >
                <Save className="w-4 h-4" /> Save Policy
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRMATION DIALOG FOR MANDATORY */}
      {confirmDialog && (
        <div className="fixed inset-0 bg-gray-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-md shadow-xl flex flex-col relative overflow-hidden">
            <div className="bg-rose-600 p-5 text-white flex items-center gap-3">
              <ShieldAlert className="w-6 h-6" />
              <div>
                <h2 className="text-lg font-bold leading-tight">
                  Enforce Mandatory Policy
                </h2>
              </div>
            </div>
            <div className="p-6">
              <p className="text-sm text-gray-700 font-medium leading-relaxed">
                You are about to make <strong>{editingPolicy?.name}</strong> a
                mandatory notification. This will force-enable{" "}
                <strong className="uppercase">
                  {minChannel.replace("_", "-")}
                </strong>{" "}
                delivery for all 1,240 organizations that might currently have
                this disabled.
              </p>
              <p className="text-sm text-rose-600 font-bold mt-4">
                Are you absolutely sure you want to proceed?
              </p>
            </div>
            <div className="p-5 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
              <button
                onClick={() => setConfirmDialog(false)}
                className="px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSave(true)}
                disabled={isSaving}
                className="px-5 py-2 text-sm font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-md disabled:opacity-50"
              >
                {isSaving ? "Applying..." : "Yes, Enforce Policy"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
