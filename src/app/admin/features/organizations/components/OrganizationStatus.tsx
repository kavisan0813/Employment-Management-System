import { Organization } from "../../../types";
import { ShieldAlert, Play, Pause, Activity } from "lucide-react";

export function OrganizationStatus({
  org,
  hook,
}: {
  org: Organization;
  hook: {
    actions: {
      updateStatus: (id: string, status: Organization["status"]) => void;
    };
  };
}) {
  const handleSuspend = () => {
    if (
      confirm(
        "Are you sure you want to suspend this organization? They will lose access immediately.",
      )
    ) {
      hook.actions.updateStatus(org.id, "Suspended");
    }
  };

  const handleActivate = () => {
    hook.actions.updateStatus(org.id, "Active");
  };

  return (
    <div className="bg-slate-50/50 rounded-2xl shadow-sm border border-gray-100 min-h-[600px] overflow-hidden flex flex-col font-medium animate-in fade-in zoom-in-95 duration-200">
      {/* Navigation Header */}
      <div className="px-6 py-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold tracking-tight text-gray-900 flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-indigo-600" />
            Organization Status
          </h1>
          <p className="text-sm text-gray-500 mt-1 font-semibold">
            Manage tenant access and view status history.
          </p>
        </div>
      </div>

      <div className="p-6 flex-1 overflow-y-auto flex flex-col gap-6">
        <div className="max-w-4xl space-y-6">
          <div
            className={`rounded-2xl border p-6 flex items-start gap-4 ${
              org.status === "Active"
                ? "bg-emerald-50 border-emerald-200"
                : org.status === "Suspended"
                  ? "bg-red-50 border-red-200"
                  : "bg-amber-50 border-amber-200"
            }`}
          >
            <div
              className={`p-3 rounded-xl ${
                org.status === "Active"
                  ? "bg-emerald-100 text-emerald-600"
                  : org.status === "Suspended"
                    ? "bg-red-100 text-red-600"
                    : "bg-amber-100 text-amber-600"
              }`}
            >
              {org.status === "Active" ? (
                <Activity className="w-6 h-6" />
              ) : (
                <ShieldAlert className="w-6 h-6" />
              )}
            </div>
            <div className="flex-1">
              <h2
                className={`text-lg font-bold ${
                  org.status === "Active"
                    ? "text-emerald-900"
                    : org.status === "Suspended"
                      ? "text-red-900"
                      : "text-amber-900"
                }`}
              >
                Current Status: {org.status}
              </h2>
              <p
                className={`text-sm mt-1 font-medium ${
                  org.status === "Active"
                    ? "text-emerald-700"
                    : org.status === "Suspended"
                      ? "text-red-700"
                      : "text-amber-700"
                }`}
              >
                {org.status === "Active"
                  ? "This organization has full access to the HRMS platform and all configured modules."
                  : org.status === "Suspended"
                    ? "Access has been revoked. Users cannot log in or access any APIs."
                    : "This organization is currently on a Trial or Expired plan."}
              </p>

              <div className="mt-6 flex gap-3">
                {org.status !== "Active" && (
                  <button
                    onClick={handleActivate}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm transition-colors cursor-pointer shadow-sm"
                  >
                    <Play className="w-4 h-4 fill-current" /> Activate
                    Organization
                  </button>
                )}
                {org.status !== "Suspended" && (
                  <button
                    onClick={handleSuspend}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-sm transition-colors cursor-pointer shadow-sm"
                  >
                    <Pause className="w-4 h-4 fill-current" /> Suspend
                    Organization
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
              <h3 className="font-bold text-gray-900 text-sm">
                Status History Audit Trail
              </h3>
            </div>
            <div className="p-6">
              <div className="relative border-l-2 border-gray-100 ml-3 space-y-8">
                <div className="relative pl-6">
                  <div className="absolute -left-[9px] w-4 h-4 rounded-full bg-emerald-500 ring-4 ring-white" />
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-gray-900">
                        Organization Created & Activated
                      </h4>
                      <p className="text-xs text-gray-500 mt-1">
                        Tenant was provisioned and assigned the {org.plan} plan.
                      </p>
                    </div>
                    <div className="text-xs font-medium text-gray-400 bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-100">
                      {new Date(org.joinedAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                {org.status === "Suspended" && (
                  <div className="relative pl-6">
                    <div className="absolute -left-[9px] w-4 h-4 rounded-full bg-red-500 ring-4 ring-white" />
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="text-sm font-bold text-gray-900">
                          Organization Suspended
                        </h4>
                        <p className="text-xs text-gray-500 mt-1">
                          Admin Action: Suspended by platform_admin.
                        </p>
                      </div>
                      <div className="text-xs font-medium text-gray-400 bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-100">
                        Just now
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
