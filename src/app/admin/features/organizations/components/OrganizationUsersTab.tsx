import React, { useMemo } from "react";
import { Users, Shield } from "lucide-react";
import { db } from "../../../mockData";
import { Organization } from "../../../types";

interface OrganizationUsersTabProps {
  org: Organization;
}

export function OrganizationUsersTab({ org }: OrganizationUsersTabProps) {
  // Fetch users from mock data
  const allUsers = useMemo(() => db.users.get(), []);
  
  const orgUsers = useMemo(() => {
    return allUsers.filter((u) => u.organizationId === org.id);
  }, [allUsers, org.id]);

  // Group by role
  const groupedUsers = useMemo(() => {
    const groups: Record<string, typeof orgUsers> = {};
    orgUsers.forEach((u) => {
      const role = u.role || "Employee";
      if (!groups[role]) {
        groups[role] = [];
      }
      groups[role].push(u);
    });
    return groups;
  }, [orgUsers]);

  if (orgUsers.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-8 text-center mt-6 shadow-sm">
        <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-gray-900">No Users Found</h3>
        <p className="text-sm text-gray-500 mt-1 font-semibold">
          This organization does not currently have any assigned users.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
      {Object.entries(groupedUsers).map(([role, users]) => (
        <div key={role} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm flex flex-col hover:border-indigo-300 hover:shadow-md transition-all cursor-default group">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 leading-tight">{role}</h3>
              <p className="text-sm text-gray-500 font-semibold mt-0.5">Role Group</p>
            </div>
          </div>
          <div className="mt-auto pt-4 border-t border-gray-100 flex items-end justify-between">
             <div>
                <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Total Assigned</div>
                <div className="flex items-baseline gap-1.5">
                   <div className="text-3xl font-black text-gray-900">{users.length}</div>
                   <div className="text-sm font-bold text-gray-500">{users.length === 1 ? 'User' : 'Users'}</div>
                </div>
             </div>
             <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center">
               <Users className="w-5 h-5 text-gray-400" />
             </div>
          </div>
        </div>
      ))}
    </div>
  );
}
