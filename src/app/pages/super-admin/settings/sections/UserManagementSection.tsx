import { useSettingsContext } from "../SettingsContext";
import { useAuth } from "../../../../context/AuthContext";
import { ChevronRight } from "lucide-react";
import {
  ReactElement,
  JSXElementConstructor,
  ReactNode,
  ReactPortal,
  Key,
} from "react";

export function UserManagementSection() {
  const { user } = useAuth();
  const isHR = user?.role === "HR Manager";

  const {
    SectionTitle,
    getRoleStyles,
    getStatusStyles,
    setActiveModal,
    setEditForm,
    setInviteForm,
    setReactivateConfirm,
    setSelectedUser,
    setUsersList,
    showToast,
    usersList,
  } = useSettingsContext();

  const pendingInvites = [
    {
      email: "priya.new@nexushr.com",
      role: "HR Manager",
      roleColor: "#10B981",
      roleBg: "rgba(16, 185, 129, 0.1)",
      sent: "Sent Apr 1",
    },
    {
      email: "leo.m@nexushr.com",
      role: "Manager",
      roleColor: "#F59E0B",
      roleBg: "rgba(245, 158, 11, 0.1)",
      sent: "Sent Mar 28",
    },
    {
      email: "sarah.k@nexushr.com",
      role: "Finance",
      roleColor: "#0EA5E9",
      roleBg: "rgba(14, 165, 233, 0.1)",
      sent: "Sent Mar 25",
    },
  ];

  return (
    <div>
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-4 text-[12px] font-medium">
        <span style={{ color: "var(--muted-foreground)" }}>Settings</span>
        <ChevronRight size={12} style={{ color: "var(--muted-foreground)" }} />
        <span style={{ color: "#00B87C" }}>User Management</span>
      </div>

      {/* Content Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2
            style={{
              fontSize: "18px",
              fontWeight: 700,
              color: "var(--foreground)",
              margin: 0,
            }}
          >
            User Management
          </h2>
          <p
            style={{
              fontSize: "13px",
              color: "var(--muted-foreground)",
              marginTop: "2px",
            }}
          >
            Manage system access and user accounts
          </p>
        </div>
        <button
          onClick={() => {
            setInviteForm({
              name: "",
              email: "",
              role: "Employee",
              dept: "Engineering",
              location: "",
              sendEmail: true,
              tempPassword: "",
              notes: "",
            });
            setActiveModal("invite_user");
          }}
          style={{
            backgroundColor: "#00B87C",
            color: "white",
            border: "none",
            borderRadius: "10px",
            padding: "8px 16px",
            fontSize: "13px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          + Invite User
        </button>
      </div>

      {/* Filter Bar */}
      <div
        className="p-4 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4 mb-6"
        style={{
          backgroundColor: "var(--card)",
          border: "1px solid var(--border)",
        }}
      >
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <input
            type="text"
            placeholder="Search users by name or email..."
            className="rounded-xl px-4 py-2 text-sm outline-none border w-64 transition-all"
            style={{
              backgroundColor: "var(--input-background)",
              borderColor: "var(--border)",
              color: "var(--foreground)",
            }}
          />
          <select
            className="rounded-xl px-3 py-2 text-sm outline-none border transition-all"
            style={{
              backgroundColor: "var(--input-background)",
              borderColor: "var(--border)",
              color: "var(--foreground)",
            }}
          >
            <option value="All Roles">All Roles</option>
            <option value="Super Admin">Super Admin</option>
            <option value="HR Manager">HR Manager</option>
            <option value="Manager">Manager</option>
            <option value="Finance">Finance</option>
            <option value="Employee">Employee</option>
          </select>
          <select
            className="rounded-xl px-3 py-2 text-sm outline-none border transition-all"
            style={{
              backgroundColor: "var(--input-background)",
              borderColor: "var(--border)",
              color: "var(--foreground)",
            }}
          >
            <option value="All Status">All Status</option>
            <option value="Active">Active</option>
            <option value="Pending Invite">Pending Invite</option>
            <option value="Inactive">Inactive</option>
            <option value="Suspended">Suspended</option>
          </select>
          <select
            className="rounded-xl px-3 py-2 text-sm outline-none border transition-all"
            style={{
              backgroundColor: "var(--input-background)",
              borderColor: "var(--border)",
              color: "var(--foreground)",
            }}
          >
            <option value="All Departments">All Departments</option>
            <option value="HR">HR</option>
            <option value="Engineering">Engineering</option>
            <option value="Finance">Finance</option>
            <option value="Sales">Sales</option>
            <option value="Marketing">Marketing</option>
          </select>
        </div>
        <span style={{ fontSize: "13px", color: "#6B7280" }}>
          Showing {usersList.length} users
        </span>
      </div>

      {/* Section: SYSTEM USERS */}
      <SectionTitle title="System Users" />
      <div
        className="overflow-x-auto mb-8"
        style={{ maxWidth: "100%", overflowX: "auto" }}
      >
        <table className="w-full border-collapse" style={{ minWidth: "600px" }}>
          <thead>
            <tr
              style={{
                borderBottom: "1px solid var(--border)",
                textAlign: "left",
              }}
            >
              {[
                "USER",
                "ROLE",
                "DEPARTMENT",
                "LAST LOGIN",
                "STATUS",
                "ACTION",
              ].map((h) => (
                <th
                  key={h}
                  style={{
                    padding: "12px 16px",
                    fontSize: "10px",
                    fontWeight: 700,
                    color: "var(--muted-foreground)",
                    letterSpacing: "0.5px",
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {usersList.map(
              (
                u: {
                  role:
                    | string
                    | number
                    | boolean
                    | ReactElement<any, string | JSXElementConstructor<any>>
                    | Iterable<ReactNode>
                    | ReactPortal
                    | Iterable<ReactNode>
                    | null
                    | undefined;
                  status:
                    | string
                    | number
                    | boolean
                    | ReactElement<any, string | JSXElementConstructor<any>>
                    | Iterable<ReactNode>
                    | null
                    | undefined;
                  avatarBg: any;
                  initials:
                    | string
                    | number
                    | boolean
                    | ReactElement<any, string | JSXElementConstructor<any>>
                    | Iterable<ReactNode>
                    | ReactPortal
                    | Iterable<ReactNode>
                    | null
                    | undefined;
                  name:
                    | string
                    | number
                    | boolean
                    | ReactElement<any, string | JSXElementConstructor<any>>
                    | Iterable<ReactNode>
                    | ReactPortal
                    | Iterable<ReactNode>
                    | null
                    | undefined;
                  email:
                    | string
                    | number
                    | boolean
                    | ReactElement<any, string | JSXElementConstructor<any>>
                    | Iterable<ReactNode>
                    | ReactPortal
                    | Iterable<ReactNode>
                    | null
                    | undefined;
                  dept:
                    | string
                    | number
                    | boolean
                    | ReactElement<any, string | JSXElementConstructor<any>>
                    | Iterable<ReactNode>
                    | ReactPortal
                    | Iterable<ReactNode>
                    | null
                    | undefined;
                  lastLogin:
                    | string
                    | number
                    | boolean
                    | ReactElement<any, string | JSXElementConstructor<any>>
                    | Iterable<ReactNode>
                    | ReactPortal
                    | Iterable<ReactNode>
                    | null
                    | undefined;
                  location: any;
                },
                idx: Key | null | undefined,
              ) => {
                const roleStyle = getRoleStyles(u.role);
                const statusStyle = getStatusStyles(u.status);
                return (
                  <tr
                    key={idx}
                    style={{
                      borderBottom: "1px solid var(--border)",
                      height: "56px",
                    }}
                    className="hover:bg-[var(--muted)] transition-all"
                  >
                    <td style={{ padding: "12px 16px" }}>
                      <div className="flex items-center gap-3">
                        <div
                          className="w-[30px] h-[30px] rounded-full flex items-center justify-center text-white font-bold text-xs flex-shrink-0"
                          style={{ backgroundColor: u.avatarBg }}
                        >
                          {u.initials}
                        </div>
                        <div>
                          <span
                            style={{
                              display: "block",
                              fontSize: "14px",
                              fontWeight: 700,
                              color: "var(--foreground)",
                            }}
                          >
                            {u.name}
                          </span>
                          <span
                            style={{
                              display: "block",
                              fontSize: "11px",
                              color: "var(--muted-foreground)",
                            }}
                          >
                            {u.email}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <span
                        style={{
                          backgroundColor: roleStyle.bg,
                          color: roleStyle.color,
                          padding: "4px 10px",
                          borderRadius: "12px",
                          fontSize: "11px",
                          fontWeight: 700,
                        }}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td
                      style={{
                        padding: "12px 16px",
                        fontSize: "13px",
                        color: "var(--foreground)",
                      }}
                    >
                      {u.dept}
                    </td>
                    <td
                      style={{
                        padding: "12px 16px",
                        fontSize: "13px",
                        color: "var(--muted-foreground)",
                      }}
                    >
                      {u.lastLogin}
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <span
                        style={{
                          backgroundColor: statusStyle.bg,
                          color: statusStyle.color,
                          padding: "4px 10px",
                          borderRadius: "12px",
                          fontSize: "11px",
                          fontWeight: 700,
                        }}
                      >
                        {u.status}
                      </span>
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <div className="flex items-center gap-2">
                        {u.status === "Pending Invite" && (
                          <>
                            <button
                              onClick={() =>
                                showToast("Invitation sent successfully")
                              }
                              style={{
                                backgroundColor: "transparent",
                                border: "1px solid #00B87C",
                                borderRadius: "8px",
                                padding: "4px 10px",
                                fontSize: "12px",
                                fontWeight: 600,
                                color: "#00B87C",
                                cursor: "pointer",
                              }}
                            >
                              Resend
                            </button>
                            <button
                              onClick={() => {
                                setUsersList(
                                  usersList.filter(
                                    (user: { email: any }) =>
                                      user.email !== u.email,
                                  ),
                                );
                                showToast("Invitation cancelled successfully");
                              }}
                              style={{
                                backgroundColor: "transparent",
                                border: "1px solid #EF4444",
                                borderRadius: "8px",
                                padding: "4px 10px",
                                fontSize: "12px",
                                fontWeight: 600,
                                color: "#EF4444",
                                cursor: "pointer",
                              }}
                            >
                              Cancel
                            </button>
                          </>
                        )}
                        {u.status === "Active" && (
                          <>
                            <button
                              onClick={() => {
                                setSelectedUser(u);
                                setEditForm({
                                  name: u.name,
                                  email: u.email,
                                  role: u.role,
                                  dept: u.dept,
                                  location: u.location || "",
                                  status: u.status,
                                  permissions: "",
                                });
                                setActiveModal("edit_user");
                              }}
                              style={{
                                backgroundColor: "transparent",
                                border: "1px solid var(--border)",
                                borderRadius: "8px",
                                padding: "4px 10px",
                                fontSize: "12px",
                                fontWeight: 600,
                                color: "var(--foreground)",
                                cursor: "pointer",
                              }}
                            >
                              Edit
                            </button>
                            {isHR ? (
                              <button
                                onClick={() =>
                                  showToast(
                                    "Password reset link sent to user's email.",
                                    "success",
                                  )
                                }
                                style={{
                                  backgroundColor: "transparent",
                                  border: "1px solid #3B82F6",
                                  borderRadius: "8px",
                                  padding: "4px 10px",
                                  fontSize: "12px",
                                  fontWeight: 600,
                                  color: "#3B82F6",
                                  cursor: "pointer",
                                }}
                              >
                                Reset Password
                              </button>
                            ) : (
                              <button
                                onClick={() => {
                                  setSelectedUser(u);
                                  setActiveModal("deactivate_user");
                                }}
                                style={{
                                  backgroundColor: "transparent",
                                  border: "1px solid #EF4444",
                                  borderRadius: "8px",
                                  padding: "4px 10px",
                                  fontSize: "12px",
                                  fontWeight: 600,
                                  color: "#EF4444",
                                  cursor: "pointer",
                                }}
                              >
                                Deactivate
                              </button>
                            )}
                          </>
                        )}
                        {(u.status === "Inactive" ||
                          u.status === "Suspended") && (
                          <>
                            <button
                              onClick={() => {
                                setSelectedUser(u);
                                setEditForm({
                                  name: u.name,
                                  email: u.email,
                                  role: u.role,
                                  dept: u.dept,
                                  location: u.location || "",
                                  status: u.status,
                                  permissions: "",
                                });
                                setActiveModal("edit_user");
                              }}
                              style={{
                                backgroundColor: "transparent",
                                border: "1px solid var(--border)",
                                borderRadius: "8px",
                                padding: "4px 10px",
                                fontSize: "12px",
                                fontWeight: 600,
                                color: "var(--foreground)",
                                cursor: "pointer",
                              }}
                            >
                              Edit
                            </button>
                            {isHR ? (
                              <button
                                onClick={() =>
                                  showToast(
                                    "Password reset link sent to user's email.",
                                    "success",
                                  )
                                }
                                style={{
                                  backgroundColor: "transparent",
                                  border: "1px solid #3B82F6",
                                  borderRadius: "8px",
                                  padding: "4px 10px",
                                  fontSize: "12px",
                                  fontWeight: 600,
                                  color: "#3B82F6",
                                  cursor: "pointer",
                                }}
                              >
                                Reset Password
                              </button>
                            ) : (
                              <button
                                onClick={() => {
                                  setSelectedUser(u);
                                  setReactivateConfirm({
                                    sendEmail: true,
                                    confirmDetails: false,
                                  });
                                  setActiveModal("reactivate_user");
                                }}
                                style={{
                                  backgroundColor: "transparent",
                                  border: "1px solid #00B87C",
                                  borderRadius: "8px",
                                  padding: "4px 10px",
                                  fontSize: "12px",
                                  fontWeight: 600,
                                  color: "#00B87C",
                                  cursor: "pointer",
                                }}
                              >
                                Reactivate
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              },
            )}
          </tbody>
        </table>
      </div>

      {/* Section: INVITE PENDING */}
      <SectionTitle title="Invite Pending" />
      <div
        className="p-6 rounded-xl mb-6 space-y-4"
        style={{
          backgroundColor: "var(--card)",
          border: "1px solid var(--border)",
          borderLeft: "4px solid #00B87C",
        }}
      >
        {pendingInvites.map((p, idx) => (
          <div key={idx} className="flex justify-between items-center py-2">
            <div className="flex items-center gap-4">
              <span
                style={{
                  fontSize: "14px",
                  color: "var(--foreground)",
                  fontWeight: 600,
                }}
              >
                {p.email}
              </span>
              <span
                style={{
                  backgroundColor: p.roleBg,
                  color: p.roleColor,
                  padding: "4px 10px",
                  borderRadius: "12px",
                  fontSize: "11px",
                  fontWeight: 700,
                }}
              >
                {p.role}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span
                style={{ fontSize: "12px", color: "var(--muted-foreground)" }}
              >
                {p.sent}
              </span>
              <button
                onClick={() =>
                  showToast("Invitation credentials resubmitted successfully")
                }
                style={{
                  backgroundColor: "transparent",
                  border: "none",
                  color: "#00B87C",
                  fontSize: "13px",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Resend
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Save Bar */}
      <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-[var(--border)]">
        <button
          onClick={() => showToast("Changes saved successfully")}
          style={{
            backgroundColor: "#00B87C",
            color: "white",
            border: "none",
            borderRadius: "10px",
            padding: "10px 20px",
            fontSize: "14px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}
