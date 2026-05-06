import { useState } from "react";
import {
  ArrowLeft,
  HelpCircle,
  Send,
  Paperclip,
  MessageSquare,
  Clock,
  ChevronRight,
} from "lucide-react";
import { useNavigate } from "react-router";
import { showToast } from "../components/workflow/ToastNotification";
import { StatusBadge } from "../components/workflow/StatusBadge";

export function ExpenseSupport() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const tickets = [
    {
      id: "TKT-1002",
      subject: "Reimbursement delay for EXP-001",
      status: "In Progress",
      date: "2026-04-28",
    },
    {
      id: "TKT-0985",
      subject: "Issue uploading travel receipt",
      status: "Resolved",
      date: "2026-04-25",
    },
    {
      id: "TKT-0942",
      subject: "Query regarding medical limit",
      status: "Resolved",
      date: "2026-04-20",
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      showToast(
        "Request Submitted",
        "success",
        "Your support ticket has been created successfully.",
      );
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <div className="w-full px-4 md:px-8 py-6 pb-20 flex flex-col gap-6 animate-in fade-in duration-700">
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
        >
          <ArrowLeft size={20} className="text-slate-600" />
        </button>
        <div>
          <h1 className="text-3xl font-black text-[#111827] tracking-tight">
            Expense Support
          </h1>
          <p className="text-slate-500 font-medium">
            Need help? Raise a ticket and track your support requests.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* NEW TICKET FORM */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <HelpCircle size={20} color="white" />
              </div>
              <div>
                <h3 className="text-xl font-black text-[#111827]">
                  Raise Support Ticket
                </h3>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
                  Submit your query to the HR team
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[13px] font-black text-slate-700 uppercase tracking-wider ml-1">
                    Select Claim
                  </label>
                  <select className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-emerald-500/20 outline-none appearance-none">
                    <option>General Support</option>
                    <option>EXP-2026-001 - Travel</option>
                    <option>EXP-2026-003 - Food</option>
                    <option>EXP-2026-005 - Medical</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[13px] font-black text-slate-700 uppercase tracking-wider ml-1">
                    Issue Type
                  </label>
                  <select className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-emerald-500/20 outline-none appearance-none">
                    <option>Payment Delay</option>
                    <option>Category Limit Query</option>
                    <option>Upload Error</option>
                    <option>Policy Clarification</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[13px] font-black text-slate-700 uppercase tracking-wider ml-1">
                  Your Message
                </label>
                <textarea
                  rows={5}
                  placeholder="Describe your issue in detail..."
                  className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl text-sm font-medium focus:ring-2 focus:ring-emerald-500/20 outline-none resize-none"
                ></textarea>
              </div>

              <div className="p-8 border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center text-center group hover:border-emerald-500 transition-colors cursor-pointer">
                <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center mb-4 group-hover:bg-emerald-50 group-hover:text-emerald-500 transition-colors">
                  <Paperclip size={20} />
                </div>
                <p className="text-sm font-bold text-slate-600 mb-1">
                  Attach supporting documents
                </p>
                <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest">
                  Max size 5MB (JPG, PNG, PDF)
                </p>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-5 bg-emerald-500 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg shadow-emerald-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-70 disabled:scale-100 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  "Sending..."
                ) : (
                  <>
                    Submit Request <Send size={18} />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* TICKET HISTORY */}
        <div className="space-y-8">
          <div className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm">
            <h3 className="text-xl font-black text-[#111827] mb-6">
              Recent Tickets
            </h3>
            <div className="space-y-6">
              {tickets.map((t, i) => (
                <div
                  key={i}
                  className="flex flex-col gap-3 p-5 bg-slate-50/50 rounded-2xl border border-slate-100 hover:border-emerald-200 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-black text-emerald-600 uppercase tracking-widest">
                      {t.id}
                    </span>
                    <StatusBadge status={t.status} />
                  </div>
                  <h4 className="text-[13px] font-bold text-[#111827] group-hover:text-emerald-500 transition-colors line-clamp-1">
                    {t.subject}
                  </h4>
                  <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400">
                    <Clock size={12} />
                    <span>{t.date}</span>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-8 py-4 text-emerald-500 font-black text-xs uppercase tracking-widest hover:underline flex items-center justify-center gap-2">
              View All Tickets <ChevronRight size={14} />
            </button>
          </div>

          <div className="bg-indigo-600 rounded-[32px] p-8 text-white shadow-xl shadow-indigo-600/20 relative overflow-hidden group">
            <MessageSquare
              size={100}
              className="absolute -right-6 -bottom-6 text-white opacity-10 group-hover:rotate-12 transition-transform duration-700"
            />
            <h3 className="text-xl font-black mb-2">Live Chat</h3>
            <p className="text-indigo-50/80 text-sm font-medium mb-6 leading-relaxed">
              Need instant help? Chat with our HR bot or a live agent now.
            </p>
            <button className="w-full py-4 bg-white text-indigo-600 rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-black/5 hover:scale-[1.02] transition-all">
              Start Conversation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
