import React from "react";
import { useRolesPermissions } from "./useRolesPermissions";
import { ChevronRight, Plus, ChevronDown, Lock } from "lucide-react";

export function RolesPermissionsPage() {
  const {
    expandedGroups,
    openCreateRoleModal,
    openEditRoleModal,
    permissionGroups,
    permissions,
    rolesList,
    setActiveModal,
    setExpandedGroups,
    toggleCell,
    activeModal,
    isSubmitting,
    roleForm,
    setRoleForm,
    handleRoleSubmit,
    confirmEditRole,
    selectedRoleForEdit,
  } = useRolesPermissions();

  return (
    <div>
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-4 text-[12px] font-medium">
        <span style={{ color: "var(--primary)", cursor: "pointer" }}>
          Common Pages
        </span>
        <ChevronRight size={12} style={{ color: "var(--muted-foreground)" }} />
        <span style={{ color: "var(--muted-foreground)" }}>
          Roles & Permissions
        </span>
      </div>

      {/* Header row */}
      <div className="flex justify-between items-center mb-6">
        <h2
          style={{
            color: "var(--foreground)",
            fontSize: "18px",
            fontWeight: 800,
          }}
        >
          Roles & Permissions
        </h2>
        <button
          onClick={openCreateRoleModal}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-white transition-all hover:opacity-90"
          style={{
            backgroundColor: "#00B87C",
            fontSize: "13px",
            fontWeight: 700,
            border: "none",
            cursor: "pointer",
            boxShadow: "0 4px 12px rgba(0,184,124,0.2)",
          }}
        >
          <Plus size={16} /> Create Role
        </button>
      </div>

      {/* Table */}
      <div
        className="overflow-x-auto mb-8"
        style={{ borderBottom: "1px solid var(--border)" }}
      >
        <table
          className="w-full border-collapse text-left"
          style={{ minWidth: "600px" }}
        >
          <thead>
            <tr style={{ borderBottom: "1px solid var(--border)" }}>
              <th
                className="pb-3"
                style={{
                  fontSize: "11px",
                  color: "var(--muted-foreground)",
                  textTransform: "uppercase",
                  fontWeight: 700,
                }}
              >
                Role Name
              </th>
              <th
                className="pb-3"
                style={{
                  fontSize: "11px",
                  color: "var(--muted-foreground)",
                  textTransform: "uppercase",
                  fontWeight: 700,
                }}
              >
                Members
              </th>
              <th
                className="pb-3"
                style={{
                  fontSize: "11px",
                  color: "var(--muted-foreground)",
                  textTransform: "uppercase",
                  fontWeight: 700,
                }}
              >
                Created
              </th>
              <th
                className="pb-3"
                style={{
                  fontSize: "11px",
                  color: "var(--muted-foreground)",
                  textTransform: "uppercase",
                  fontWeight: 700,
                }}
              >
                Modified
              </th>
              <th
                className="pb-3 text-right"
                style={{
                  fontSize: "11px",
                  color: "var(--muted-foreground)",
                  textTransform: "uppercase",
                  fontWeight: 700,
                }}
              >
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {rolesList.map(
              (role: {
                id: string;
                name: string;
                members: number;
                created: string;
                modified: string;
                isDefault: boolean;
                color: string;
              }) => (
                <tr
                  key={role.id}
                  style={{
                    borderBottom: "1px solid var(--border)",
                    height: "56px",
                  }}
                  className="hover:bg-[var(--muted)] transition-colors"
                >
                  <td>
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold"
                        style={{ backgroundColor: role.color }}
                      >
                        {role.name.charAt(0)}
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          style={{
                            fontSize: "14px",
                            fontWeight: 700,
                            color: "var(--foreground)",
                          }}
                        >
                          {role.name}
                        </span>
                        {role.isDefault && (
                          <span
                            className="px-2 py-0.5 rounded text-[11px] font-semibold"
                            style={{
                              backgroundColor: "var(--muted)",
                              color: "var(--muted-foreground)",
                            }}
                          >
                            Default
                          </span>
                        )}
                        {role.isDefault && (
                          <Lock
                            size={12}
                            style={{ color: "var(--muted-foreground)" }}
                          />
                        )}
                      </div>
                    </div>
                  </td>
                  <td style={{ fontSize: "13px", color: "var(--foreground)" }}>
                    {role.members}
                  </td>
                  <td
                    style={{
                      fontSize: "13px",
                      color: "var(--muted-foreground)",
                    }}
                  >
                    {role.created}
                  </td>
                  <td
                    style={{
                      fontSize: "13px",
                      color: "var(--muted-foreground)",
                    }}
                  >
                    {role.modified}
                  </td>
                  <td>
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEditRoleModal(role)}
                        className="px-3 py-1 rounded-lg text-[12px] font-semibold transition-all"
                        style={{
                          border: "1px solid #00B87C",
                          color: "#00B87C",
                          backgroundColor: "transparent",
                          cursor: "pointer",
                        }}
                        onMouseEnter={(e) => {
                          (
                            e.currentTarget as HTMLButtonElement
                          ).style.backgroundColor = "#00B87C";
                          (e.currentTarget as HTMLButtonElement).style.color =
                            "white";
                        }}
                        onMouseLeave={(e) => {
                          (
                            e.currentTarget as HTMLButtonElement
                          ).style.backgroundColor = "transparent";
                          (e.currentTarget as HTMLButtonElement).style.color =
                            "#00B87C";
                        }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setActiveModal("delete_role")}
                        className="px-3 py-1 rounded-lg text-[12px] font-semibold transition-all"
                        style={{
                          border: "1px solid #EF4444",
                          color: "#EF4444",
                          backgroundColor: "transparent",
                          cursor: "pointer",
                          opacity: role.isDefault ? 0.4 : 1,
                        }}
                        disabled={role.isDefault}
                        onMouseEnter={(e) => {
                          if (!role.isDefault) {
                            (
                              e.currentTarget as HTMLButtonElement
                            ).style.backgroundColor = "#EF4444";
                            (e.currentTarget as HTMLButtonElement).style.color =
                              "white";
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!role.isDefault) {
                            (
                              e.currentTarget as HTMLButtonElement
                            ).style.backgroundColor = "transparent";
                            (e.currentTarget as HTMLButtonElement).style.color =
                              "#EF4444";
                          }
                        }}
                      >
                        Delete
                      </button>
                      <ChevronRight
                        onClick={() => openEditRoleModal(role)}
                        size={16}
                        style={{
                          color: "var(--muted-foreground)",
                          cursor: "pointer",
                        }}
                        className="hover:text-[var(--primary)] transition-colors"
                      />
                    </div>
                  </td>
                </tr>
              ),
            )}
          </tbody>
        </table>
      </div>

      {/* Permission Matrix */}
      <div className="mt-6">
        <h3
          style={{
            color: "var(--foreground)",
            fontSize: "16px",
            fontWeight: 700,
            marginBottom: "16px",
          }}
        >
          Module Permissions
        </h3>
        <div className="overflow-x-auto">
          <table
            className="w-full border-collapse text-left"
            style={{ minWidth: "600px" }}
          >
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)" }}>
                <th
                  className="pb-3"
                  style={{
                    fontSize: "11px",
                    color: "var(--muted-foreground)",
                    textTransform: "uppercase",
                    fontWeight: 700,
                    width: "200px",
                  }}
                >
                  Module Name
                </th>
                {rolesList.map(
                  (role: {
                    id: string;
                    name: string;
                    members: number;
                    created: string;
                    modified: string;
                    isDefault: boolean;
                    color: string;
                  }) => (
                    <th
                      key={role.id}
                      className="pb-3 text-center"
                      style={{
                        fontSize: "11px",
                        color: "var(--muted-foreground)",
                        textTransform: "uppercase",
                        fontWeight: 700,
                      }}
                    >
                      {role.name}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {permissionGroups.map(
                (group: {
                  id: string;
                  name: string;
                  modules: { id: string; name: string }[];
                }) => (
                  <React.Fragment key={group.id}>
                    {/* Group Header Row */}
                    <tr
                      style={{
                        backgroundColor: "var(--secondary)",
                        height: "40px",
                      }}
                      className="cursor-pointer select-none"
                      onClick={() =>
                        setExpandedGroups((prev) => ({
                          ...prev,
                          [group.id]: !prev[group.id as keyof typeof prev],
                        }))
                      }
                    >
                      <td
                        colSpan={6}
                        className="px-3 font-bold text-[12px] text-var(--foreground)"
                      >
                        <div className="flex items-center gap-2">
                          {expandedGroups[
                            group.id as keyof typeof expandedGroups
                          ] ? (
                            <ChevronDown size={14} />
                          ) : (
                            <ChevronRight size={14} />
                          )}
                          {group.name}
                        </div>
                      </td>
                    </tr>

                    {/* Module Rows */}
                    {expandedGroups[group.id as keyof typeof expandedGroups] &&
                      group.modules.map((mod) => (
                        <tr
                          key={mod.id}
                          style={{
                            borderBottom: "1px solid var(--border)",
                            height: "48px",
                          }}
                          className="hover:bg-[var(--muted)] transition-colors"
                        >
                          <td className="pl-8 text-[13px] font-medium text-var(--foreground)">
                            {mod.name}
                          </td>
                          {rolesList.map((role: { id: string }) => {
                            const cellState = permissions[mod.id][role.id];
                            return (
                              <td key={role.id} className="text-center">
                                <div
                                  onClick={() => toggleCell(mod.id, role.id)}
                                  className="inline-flex items-center justify-center rounded-lg cursor-pointer select-none transition-all"
                                  style={{
                                    width: "80px",
                                    height: "32px",
                                    fontSize: "12px",
                                    fontWeight: 700,
                                    backgroundColor:
                                      cellState === "full"
                                        ? "rgba(0, 184, 124, 0.1)"
                                        : cellState === "view"
                                          ? "rgba(14, 165, 233, 0.1)"
                                          : "var(--muted)",
                                    color:
                                      cellState === "full"
                                        ? "#00B87C"
                                        : cellState === "view"
                                          ? "#0EA5E9"
                                          : "var(--muted-foreground)",
                                  }}
                                >
                                  {cellState === "full"
                                    ? "Full"
                                    : cellState === "view"
                                      ? "View"
                                      : "—"}
                                </div>
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                  </React.Fragment>
                ),
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODALS */}
      {activeModal === "create_role" || activeModal === "edit_role" ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-2xl p-6 shadow-2xl border border-[var(--border)] relative bg-[var(--background)]">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">
                {activeModal === "create_role" ? "Create Role" : "Edit Role"}
              </h2>
              <button onClick={() => setActiveModal(null)} className="text-[var(--muted-foreground)] hover:text-[var(--foreground)]">
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Role Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-md bg-transparent text-[var(--foreground)]"
                  value={roleForm.name}
                  onChange={(e) => setRoleForm({ ...roleForm, name: e.target.value })}
                  placeholder="e.g. IT Administrator"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  className="w-full px-3 py-2 border rounded-md bg-transparent text-[var(--foreground)]"
                  value={roleForm.description}
                  onChange={(e) => setRoleForm({ ...roleForm, description: e.target.value })}
                  placeholder="Brief description of this role's responsibilities"
                  rows={3}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-8">
              <button
                className="px-4 py-2 border rounded-md text-[var(--foreground)] hover:bg-[var(--muted)]"
                onClick={() => setActiveModal(null)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-[var(--primary)] text-white rounded-md hover:opacity-90 disabled:opacity-50"
                onClick={handleRoleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving..." : (activeModal === "create_role" ? "Create Role" : "Update Role")}
              </button>
            </div>
          </div>
        </div>
      ) : activeModal === "confirm_edit_role" ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl p-6 shadow-2xl border border-[var(--border)] relative bg-[var(--background)]">
            <h2 className="text-xl font-bold mb-4 text-center">Confirm Changes</h2>
            <p className="text-[var(--muted-foreground)] text-center mb-6">
              Are you sure you want to update the permissions for {selectedRoleForEdit?.name}? This may affect users currently assigned to this role.
            </p>
            <div className="flex justify-center gap-3">
              <button
                className="px-4 py-2 border rounded-md text-[var(--foreground)] hover:bg-[var(--muted)]"
                onClick={() => setActiveModal("edit_role")}
              >
                Go Back
              </button>
              <button
                className="px-4 py-2 bg-[var(--primary)] text-white rounded-md hover:opacity-90 disabled:opacity-50"
                onClick={confirmEditRole}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Updating..." : "Confirm Update"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
