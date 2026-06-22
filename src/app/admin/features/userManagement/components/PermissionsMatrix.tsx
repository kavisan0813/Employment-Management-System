import React from "react";
import { Lock } from "lucide-react";

export function PermissionsMatrix() {
  const modules = [
    {
      name: "Employee Management",
      view: true,
      create: true,
      edit: true,
      delete: false,
      approve: false,
    },
    {
      name: "Attendance",
      view: true,
      create: true,
      edit: true,
      delete: false,
      approve: true,
    },
    {
      name: "Leave Management",
      view: true,
      create: true,
      edit: false,
      delete: false,
      approve: true,
    },
    {
      name: "Payroll",
      view: true,
      create: false,
      edit: false,
      delete: false,
      approve: false,
    },
    {
      name: "Reports",
      view: true,
      create: false,
      edit: false,
      delete: false,
      approve: false,
    },
  ];

  return (
    <div className="space-y-4 animate-in fade-in zoom-in-95 duration-200">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Lock className="w-5 h-5 text-indigo-600" /> Permissions Matrix
          </h2>
          <p className="text-xs text-gray-500">
            Define granular access control across the HRMS modules.
          </p>
        </div>
        <div className="flex gap-2">
          <select className="text-xs bg-white border border-gray-200 rounded-lg px-3 py-1.5 outline-none font-medium text-gray-700">
            <option>Role: HR Manager</option>
            <option>Role: Manager</option>
            <option>Role: Employee</option>
          </select>
          <button className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors cursor-pointer">
            Save Matrix
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-xs">
        <table className="w-full text-center border-collapse text-xs">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 font-medium uppercase tracking-wider text-[10px]">
              <th className="px-4 py-3 text-left">Module / Feature</th>
              <th className="px-4 py-3">View</th>
              <th className="px-4 py-3">Create</th>
              <th className="px-4 py-3">Edit</th>
              <th className="px-4 py-3">Delete</th>
              <th className="px-4 py-3">Approve</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {modules.map((m) => (
              <tr
                key={m.name}
                className="hover:bg-gray-50/70 transition-colors"
              >
                <td className="px-4 py-3 font-semibold text-gray-900 text-left">
                  {m.name}
                </td>
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    defaultChecked={m.view}
                    className="accent-indigo-600 cursor-pointer"
                  />
                </td>
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    defaultChecked={m.create}
                    className="accent-indigo-600 cursor-pointer"
                  />
                </td>
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    defaultChecked={m.edit}
                    className="accent-indigo-600 cursor-pointer"
                  />
                </td>
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    defaultChecked={m.delete}
                    className="accent-indigo-600 cursor-pointer"
                  />
                </td>
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    defaultChecked={m.approve}
                    className="accent-indigo-600 cursor-pointer"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
