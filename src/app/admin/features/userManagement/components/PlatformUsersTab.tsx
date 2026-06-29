import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router";
import useSWR from "swr";
import {
  Search,
  MoreVertical,
  ShieldAlert,
  UserX,
  KeyRound,
  LogOut,
  Info
} from "lucide-react";
import { fetchPlatformUsers, suspendOrganization, resetUserPassword, loginAsCompany, FetchUsersParams, PlatformUser } from "../services/userServices";
import { formatDistanceToNow } from "date-fns";

export function PlatformUsersTab() {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "25", 10);
  const role = searchParams.get("role") || "Company Admin";
  const org = searchParams.get("org") || "all";
  const query = searchParams.get("q") || "";

  const [searchInput, setSearchInput] = useState(query);
  
  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchInput.length >= 2 || searchInput.length === 0) {
        setSearchParams(prev => {
          if (searchInput) prev.set("q", searchInput);
          else prev.delete("q");
          prev.set("page", "1");
          return prev;
        }, { replace: true });
      }
    }, 300);
    return () => clearTimeout(handler);
  }, [searchInput, setSearchParams]);

  const fetcherParams: FetchUsersParams = { page, limit, search: query, role, organization: org };
  const { data, error, isLoading, mutate } = useSWR(
    ["platformUsers", page, limit, query, role, org], 
    () => fetchPlatformUsers(fetcherParams)
  );

  const [suspendingUser, setSuspendingUser] = useState<string | null>(null);
  const [resettingUser, setResettingUser] = useState<string | null>(null);
  const [loggingInUser, setLoggingInUser] = useState<string | null>(null);

  const [suspendDialog, setSuspendDialog] = useState<PlatformUser | null>(null);
  const [resetDialog, setResetDialog] = useState<PlatformUser | null>(null);
  const [loginDialog, setLoginDialog] = useState<PlatformUser | null>(null);
  const [toastMessage, setToastMessage] = useState<{ text: string, type: 'success' | 'info' } | null>(null);

  const showToast = (text: string, type: 'success' | 'info') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSuspend = async (user: PlatformUser) => {
    setSuspendingUser(user.id);
    await suspendOrganization(user.organization);
    mutate();
    setSuspendingUser(null);
    setSuspendDialog(null);
    showToast(`Organization status updated for ${user.organization}`, 'success');
  };

  const handleResetPassword = async (user: PlatformUser) => {
    setResettingUser(user.id);
    await resetUserPassword(user.id);
    setResettingUser(null);
    setResetDialog(null);
    showToast("Password reset email sent.", 'success');
  };

  const handleLoginAs = async (user: PlatformUser) => {
    setLoggingInUser(user.id);
    await loginAsCompany(user.organization);
    setLoggingInUser(null);
    setLoginDialog(null);
    showToast(`You are now logged in as ${user.organization}`, 'info');
  };

  return (
    <div className="space-y-6 relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className={`fixed bottom-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 ${
          toastMessage.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-blue-50 text-blue-800 border border-blue-200'
        }`}>
          <Info className="w-5 h-5" />
          <span className="font-medium text-sm">{toastMessage.text}</span>
        </div>
      )}

      {/* Privacy Notice */}
      <div className="bg-blue-50 text-blue-800 p-3 rounded-lg flex items-start gap-3 border border-blue-200">
        <Info className="w-5 h-5 flex-shrink-0 mt-0.5 text-blue-600" />
        <p className="text-sm font-medium">
          Only company admins are listed here. Individual employee records stay private and are not accessible by Super Admins.
        </p>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
          />
          {isLoading && searchInput.length >= 2 && (
             <span className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></span>
          )}
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <select 
            value={role}
            onChange={e => {
              setSearchParams(prev => {
                prev.set("role", e.target.value);
                prev.set("page", "1");
                return prev;
              });
            }}
            className="bg-white border border-gray-300 rounded-lg text-sm px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Roles</option>
            <option value="Company Admin">Company Admin</option>
          </select>
          <select 
            value={org}
            onChange={e => {
              setSearchParams(prev => {
                prev.set("org", e.target.value);
                prev.set("page", "1");
                return prev;
              });
            }}
            className="bg-white border border-gray-300 rounded-lg text-sm px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Organizations</option>
            <option value="Acme Corp">Acme Corp</option>
            <option value="TechFlow">TechFlow</option>
            <option value="Nexus HR">Nexus HR</option>
            <option value="Global Industries">Global Industries</option>
            <option value="Stark Resilient">Stark Resilient</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hidden md:block">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Company Admin</th>
              <th className="px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Organization</th>
              <th className="px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Total Employees</th>
              <th className="px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Last Active</th>
              <th className="px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-24"></div>
                        <div className="h-3 bg-gray-200 rounded w-32"></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-24"></div></td>
                  <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-12"></div></td>
                  <td className="px-6 py-4"><div className="h-6 bg-gray-200 rounded-full w-20"></div></td>
                  <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-24"></div></td>
                  <td className="px-6 py-4 text-right"><div className="h-8 w-8 bg-gray-200 rounded ml-auto"></div></td>
                </tr>
              ))
            ) : error ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center">
                  <div className="text-red-500 font-semibold mb-2">Failed to load users</div>
                  <button onClick={() => mutate()} className="text-sm text-indigo-600 hover:underline">Retry</button>
                </td>
              </tr>
            ) : data?.data.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-16 text-center text-gray-500">
                  <UserX className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="font-semibold text-gray-900">No users found</p>
                  <p className="text-sm">Try adjusting your search or filters.</p>
                </td>
              </tr>
            ) : (
              data?.data.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm">
                        {user.avatarInitials}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 text-sm">{user.name}</div>
                        <div className="text-gray-500 text-xs">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 font-medium">{user.organization}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{user.totalEmployees}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      user.status === 'Active' ? 'bg-green-100 text-green-800' :
                      user.status === 'Suspended' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {formatDistanceToNow(new Date(user.lastActive), { addSuffix: true })}
                  </td>
                  <td className="px-6 py-4 text-right relative group">
                    <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                    <div className="absolute right-8 top-10 w-48 bg-white rounded-lg shadow-lg border border-gray-200 hidden group-hover:block z-10 py-1">
                      <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                        <Info className="w-4 h-4" /> View Details
                      </button>
                      <button 
                        onClick={() => setSuspendDialog(user)}
                        disabled={suspendingUser === user.id}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                      >
                        <UserX className="w-4 h-4" /> 
                        {suspendingUser === user.id ? 'Suspending...' : user.status === 'Suspended' ? 'Activate' : 'Suspend'}
                      </button>
                      <button 
                        onClick={() => setResetDialog(user)}
                        disabled={resettingUser === user.id}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                      >
                        <KeyRound className="w-4 h-4" /> 
                        {resettingUser === user.id ? 'Resetting...' : 'Reset Password'}
                      </button>
                      <button 
                        onClick={() => setLoginDialog(user)}
                        disabled={loggingInUser === user.id}
                        className="w-full text-left px-4 py-2 text-sm text-indigo-600 hover:bg-indigo-50 flex items-center gap-2"
                      >
                        <LogOut className="w-4 h-4" /> 
                        {loggingInUser === user.id ? 'Logging in...' : 'Login as Company'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {/* Mobile Cards (Stacked) */}
      <div className="md:hidden space-y-4">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white p-4 rounded-xl border border-gray-200 animate-pulse">
              <div className="flex gap-3 items-center mb-3">
                 <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                 <div className="h-4 bg-gray-200 rounded w-32"></div>
              </div>
              <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </div>
          ))
        ) : error ? (
           <div className="bg-white p-6 rounded-xl border border-gray-200 text-center">
             <div className="text-red-500 font-semibold mb-2">Failed to load users</div>
             <button onClick={() => mutate()} className="text-sm text-indigo-600 hover:underline">Retry</button>
           </div>
        ) : data?.data.length === 0 ? (
          <div className="bg-white p-6 rounded-xl border border-gray-200 text-center">
             <p className="font-semibold text-gray-900">No users found</p>
          </div>
        ) : (
          data?.data.map((user) => (
             <div key={user.id} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm relative">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm">
                      {user.avatarInitials}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 text-sm">{user.name}</div>
                      <div className="text-gray-500 text-xs">{user.email}</div>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-y-2 text-sm">
                   <div className="text-gray-500">Organization:</div>
                   <div className="font-medium text-gray-900 text-right">{user.organization}</div>
                   <div className="text-gray-500">Status:</div>
                   <div className="text-right">
                     <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${
                        user.status === 'Active' ? 'bg-green-100 text-green-800' :
                        user.status === 'Suspended' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {user.status}
                      </span>
                   </div>
                   <div className="text-gray-500">Employees:</div>
                   <div className="text-right text-gray-700">{user.totalEmployees}</div>
                </div>
                <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between gap-2">
                   <button className="flex-1 text-center py-2 bg-gray-50 hover:bg-gray-100 rounded text-sm text-gray-700 font-medium">Details</button>
                   <button onClick={() => setSuspendDialog(user)} className="flex-1 text-center py-2 bg-red-50 hover:bg-red-100 rounded text-sm text-red-700 font-medium">Suspend</button>
                   <button onClick={() => handleLoginAs(user)} className="flex-1 text-center py-2 bg-indigo-50 hover:bg-indigo-100 rounded text-sm text-indigo-700 font-medium">Login As</button>
                </div>
             </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {data && data.total > 0 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Showing {(page - 1) * limit + 1} to {Math.min(page * limit, data.total)} of {data.total} users
          </div>
          <div className="flex items-center gap-2">
            <select 
              value={limit}
              onChange={e => {
                setSearchParams(prev => {
                  prev.set("limit", e.target.value);
                  prev.set("page", "1");
                  return prev;
                });
              }}
              className="border border-gray-300 rounded text-sm px-2 py-1 outline-none"
            >
              <option value="25">25 per page</option>
              <option value="50">50 per page</option>
              <option value="100">100 per page</option>
            </select>
            <div className="flex gap-1">
              <button 
                disabled={page === 1}
                onClick={() => setSearchParams(prev => { prev.set("page", (page - 1).toString()); return prev; })}
                className="px-3 py-1 rounded border border-gray-300 text-sm font-medium disabled:opacity-50 hover:bg-gray-50"
              >
                Prev
              </button>
              <button 
                disabled={page * limit >= data.total}
                onClick={() => setSearchParams(prev => { prev.set("page", (page + 1).toString()); return prev; })}
                className="px-3 py-1 rounded border border-gray-300 text-sm font-medium disabled:opacity-50 hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Suspend Confirmation Dialog */}
      {suspendDialog && (
        <div className="fixed inset-0 bg-gray-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl relative">
            <div className="flex items-center gap-3 text-red-600 mb-4">
              <ShieldAlert className="w-6 h-6" />
              <h2 className="text-lg font-bold">{suspendDialog.status === 'Suspended' ? 'Activate' : 'Suspend'} Organization?</h2>
            </div>
            <p className="text-sm text-gray-600 mb-6">
              {suspendDialog.status === 'Suspended' ? 
                `This will restore login access for all ${suspendDialog.totalEmployees} users in the organization ${suspendDialog.organization}. Are you sure you want to proceed?` :
                `This will block login access for all ${suspendDialog.totalEmployees} users in the organization ${suspendDialog.organization}. Data is retained for 90 days. Are you sure you want to proceed?`
              }
            </p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setSuspendDialog(null)}
                className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg"
              >
                Cancel
              </button>
              <button 
                onClick={() => handleSuspend(suspendDialog)}
                disabled={suspendingUser === suspendDialog.id}
                className="px-4 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg disabled:opacity-50"
              >
                {suspendingUser === suspendDialog.id ? 'Processing...' : (suspendDialog.status === 'Suspended' ? 'Activate Organization' : 'Suspend Organization')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reset Password Dialog */}
      {resetDialog && (
        <div className="fixed inset-0 bg-gray-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl relative">
            <div className="flex items-center gap-3 text-indigo-600 mb-4">
              <KeyRound className="w-6 h-6" />
              <h2 className="text-lg font-bold">Reset Password?</h2>
            </div>
            <p className="text-sm text-gray-600 mb-6">
              Send a temporary password reset link to <strong>{resetDialog.email}</strong>?
            </p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setResetDialog(null)}
                className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg"
              >
                Cancel
              </button>
              <button 
                onClick={() => handleResetPassword(resetDialog)}
                disabled={resettingUser === resetDialog.id}
                className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg disabled:opacity-50"
              >
                {resettingUser === resetDialog.id ? 'Sending...' : 'Send Reset Link'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Login As Dialog */}
      {loginDialog && (
        <div className="fixed inset-0 bg-gray-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl relative">
            <div className="flex items-center gap-3 text-indigo-600 mb-4">
              <LogOut className="w-6 h-6" />
              <h2 className="text-lg font-bold">Login As Company?</h2>
            </div>
            <p className="text-sm text-gray-600 mb-6">
              You are about to securely masquerade as <strong>{loginDialog.organization}</strong>. 
              All actions taken during this session will be audited under your administrative account.
            </p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setLoginDialog(null)}
                className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg"
              >
                Cancel
              </button>
              <button 
                onClick={() => handleLoginAs(loginDialog)}
                disabled={loggingInUser === loginDialog.id}
                className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg disabled:opacity-50"
              >
                {loggingInUser === loginDialog.id ? 'Logging in...' : 'Login Now'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
