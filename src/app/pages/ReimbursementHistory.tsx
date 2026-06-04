import { useState } from "react";
import {
  IndianRupee,
  Calendar,
  Search,
  Download,
  ArrowLeft,
  History,
  CreditCard,
  Filter,
} from "lucide-react";
import { useNavigate } from "react-router";
import { StatusBadge } from "../components/workflow/StatusBadge";

export function ReimbursementHistory() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const history = [
    {
      id: "EXP-2026-001",
      category: "Travel",
      amount: 1845,
      approvedDate: "2026-04-26",
      paidDate: "2026-04-28",
      method: "Bank Transfer",
      status: "Paid",
    },
    {
      id: "EXP-2026-003",
      category: "Food",
      amount: 450,
      approvedDate: "2026-04-25",
      paidDate: "2026-04-27",
      method: "Corporate Card",
      status: "Paid",
    },
    {
      id: "EXP-2026-005",
      category: "Medical",
      amount: 12500,
      approvedDate: "2026-04-22",
      paidDate: "2026-04-25",
      method: "Bank Transfer",
      status: "Paid",
    },
    {
      id: "EXP-2026-008",
      category: "Travel",
      amount: 3200,
      approvedDate: "2026-04-20",
      paidDate: "Processing",
      method: "Pending",
      status: "Processing",
    },
  ];

  return (
    <div className="w-full px-4 md:px-8 py-6 pb-20 flex flex-col gap-6 animate-in fade-in duration-700">
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-[#00B87C]/[0.08] rounded-xl transition-colors"
        >
          <ArrowLeft size={20} className="text-slate-600" />
        </button>
        <div>
          <h1 className="text-[26px] font-bold text-[#111827]">
            Reimbursement History
          </h1>
          <p className="text-slate-500 font-medium">
            Track your processed payments and disbursement status.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center mb-4">
            <IndianRupee size={20} className="text-emerald-500" />
          </div>
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest mb-1">
            Total Paid
          </p>
          <p className="text-2xl font-black text-[#111827]">₹14,795</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center mb-4">
            <History size={20} className="text-amber-500" />
          </div>
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest mb-1">
            Pending Payment
          </p>
          <p className="text-2xl font-black text-[#111827]">₹3,200</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center mb-4">
            <Calendar size={20} className="text-indigo-500" />
          </div>
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest mb-1">
            This Month Paid
          </p>
          <p className="text-2xl font-black text-[#111827]">₹2,295</p>
        </div>
      </div>

      <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search by Claim ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-emerald-500/20 outline-none"
            />
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-3 bg-slate-50 text-slate-600 rounded-2xl text-sm font-bold hover:bg-[#00B87C]/[0.08] transition-all border border-slate-100">
              <Filter size={18} /> Filter
            </button>
            <button className="flex items-center gap-2 px-4 py-3 bg-white text-slate-700 border border-slate-200 rounded-2xl text-sm font-bold hover:bg-[#00B87C]/[0.08] transition-all">
              <Download size={18} /> Export
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-8 py-4 text-[11px] font-semibold text-slate-400 uppercase tracking-widest">
                  Claim ID
                </th>
                <th className="px-8 py-4 text-[11px] font-semibold text-slate-400 uppercase tracking-widest">
                  Category
                </th>
                <th className="px-8 py-4 text-[11px] font-semibold text-slate-400 uppercase tracking-widest">
                  Amount
                </th>
                <th className="px-8 py-4 text-[11px] font-semibold text-slate-400 uppercase tracking-widest">
                  Approved Date
                </th>
                <th className="px-8 py-4 text-[11px] font-semibold text-slate-400 uppercase tracking-widest">
                  Paid Date
                </th>
                <th className="px-8 py-4 text-[11px] font-semibold text-slate-400 uppercase tracking-widest">
                  Payment Method
                </th>
                <th className="px-8 py-4 text-[11px] font-semibold text-slate-400 uppercase tracking-widest">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {history.map((item, i) => (
                <tr
                  key={i}
                  className="group hover:bg-[#00B87C]/[0.08]/50 transition-colors"
                >
                  <td className="px-8 py-5">
                    <span className="text-[13px] font-black text-emerald-600">
                      #{item.id}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <span className="text-[13px] font-bold text-[#111827]">
                      {item.category}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <span className="text-[14px] font-black text-[#111827]">
                      ₹{item.amount.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-[12px] font-bold text-slate-500">
                    {item.approvedDate}
                  </td>
                  <td className="px-8 py-5 text-[12px] font-bold text-slate-500">
                    {item.paidDate}
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2">
                      <CreditCard size={14} className="text-slate-400" />
                      <span className="text-[12px] font-bold text-slate-600">
                        {item.method}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <StatusBadge status={item.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
