import { useNavigate } from "react-router";
import {
  ArrowLeft,
  ShieldCheck,
  FileText,
  CheckCircle2,
  MapPin,
  Utensils,
  Fuel,
  Home,
  HeartPulse,
} from "lucide-react";

export function ExpensePolicy() {
  const navigate = useNavigate();

  const policies = [
    {
      category: "Travel",
      limit: "Economy Class / Actuals",
      receipt: "Required",
      approval: "Required",
      icon: MapPin,
      color: "#3B82F6",
      bg: "rgba(59,130,246,0.1)",
    },
    {
      category: "Food & Meals",
      limit: "₹800 / day",
      receipt: "Not Required (<₹200)",
      approval: "Auto-approved",
      icon: Utensils,
      color: "#F59E0B",
      bg: "rgba(245,158,11,0.1)",
    },
    {
      category: "Fuel & Conveyance",
      limit: "₹12 / km",
      receipt: "Log Required",
      approval: "Required",
      icon: Fuel,
      color: "#10B981",
      bg: "rgba(16,185,129,0.1)",
    },
    {
      category: "Accommodation",
      limit: "₹4,500 / night",
      receipt: "Required",
      approval: "Pre-approval Req",
      icon: Home,
      color: "#8B5CF6",
      bg: "rgba(139,92,246,0.1)",
    },
    {
      category: "Medical",
      limit: "₹15,000 / year",
      receipt: "Required",
      approval: "HR Approval Req",
      icon: HeartPulse,
      color: "#EF4444",
      bg: "rgba(239,68,68,0.1)",
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
            Expense Policy
          </h1>
          <p className="text-slate-500 font-medium">
            Review company guidelines and reimbursement limits.
          </p>
        </div>
      </div>

      <div className="bg-emerald-600 rounded-[32px] p-8 text-white mb-10 shadow-xl shadow-emerald-600/20 relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <ShieldCheck size={24} className="text-emerald-200" />
            <h2 className="text-2xl font-black">Policy Compliance</h2>
          </div>
          <p className="max-w-2xl text-emerald-50 font-medium leading-relaxed opacity-90">
            NexusHR promotes a culture of trust and transparency. All expenses
            must be incurred for business purposes and supported by valid
            documentation where required.
          </p>
        </div>
        <div className="absolute right-0 bottom-0 opacity-10 translate-x-1/4 translate-y-1/4">
          <FileText size={240} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-10">
        {policies.map((p, i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-[28px] border border-slate-100 shadow-sm hover:-translate-y-[2px] hover:border-[#00B87C] hover:shadow-[0_0_15px_rgba(0,184,124,0.3)] transition-all group"
          >
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110"
              style={{ backgroundColor: p.bg }}
            >
              <p.icon size={22} style={{ color: p.color }} />
            </div>
            <h3 className="text-[15px] font-black text-[#111827] mb-2">
              {p.category}
            </h3>
            <p className="text-lg font-black text-emerald-600 mb-1">
              {p.limit}
            </p>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
              Max Limit
            </p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-50">
          <h3 className="text-xl font-black text-[#111827]">
            Category Details
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-8 py-4 text-[11px] font-semibold text-slate-400 uppercase tracking-widest">
                  Category
                </th>
                <th className="px-8 py-4 text-[11px] font-semibold text-slate-400 uppercase tracking-widest">
                  Limit
                </th>
                <th className="px-8 py-4 text-[11px] font-semibold text-slate-400 uppercase tracking-widest">
                  Receipt Required
                </th>
                <th className="px-8 py-4 text-[11px] font-semibold text-slate-400 uppercase tracking-widest">
                  Approval Required
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {policies.map((p, i) => (
                <tr
                  key={i}
                  className="group hover:bg-[#00B87C]/[0.08]/50 transition-colors"
                >
                  <td className="px-8 py-5 flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: p.bg }}
                    >
                      <p.icon size={14} style={{ color: p.color }} />
                    </div>
                    <span className="text-[13px] font-bold text-[#111827]">
                      {p.category}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <span className="text-[13px] font-black text-slate-700">
                      {p.limit}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2">
                      <CheckCircle2
                        size={14}
                        className={
                          p.receipt === "Required"
                            ? "text-emerald-500"
                            : "text-slate-300"
                        }
                      />
                      <span className="text-[12px] font-bold text-slate-600">
                        {p.receipt}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-[12px] font-bold text-slate-500">
                    {p.approval}
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
