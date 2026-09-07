import React, { useState } from "react";
import { Star, MessageCircle, Search, Filter, ShieldCheck, CheckCircle2, User, Building } from "lucide-react";
import type { Feedback, FeedbackCategory, FeedbackStatus } from "../types/types";
import { useSupportTickets } from "../hooks/useSupportTickets";
import { usePermission } from "../../../../shared/permission-engine/usePermission";

export function FeedbackManagement({
  hook,
}: {
  hook: ReturnType<typeof useSupportTickets>;
}) {
  const { feedback, actions } = hook;
  const isSuperAdmin = usePermission("platform", "manage"); // Super Admin authorization check

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");
  const [selectedFeedbackId, setSelectedFeedbackId] = useState<string | null>(
    feedback.length > 0 ? feedback[0].id : null,
  );

  const [responseInput, setResponseInput] = useState("");
  const [statusInput, setStatusInput] = useState<FeedbackStatus>("New");

  const filteredFeedback = feedback.filter((fb) => {
    const matchSearch =
      fb.comment.toLowerCase().includes(search.toLowerCase()) ||
      fb.user.toLowerCase().includes(search.toLowerCase()) ||
      fb.organization.toLowerCase().includes(search.toLowerCase());
    const matchCategory =
      categoryFilter === "ALL" || fb.category === categoryFilter;
    return matchSearch && matchCategory;
  });

  const selectedFeedback = feedback.find((f) => f.id === selectedFeedbackId) || null;

  // Set response input when selected feedback changes
  React.useEffect(() => {
    if (selectedFeedback) {
      setResponseInput(selectedFeedback.adminResponse || "");
      setStatusInput(selectedFeedback.status || "New");
    }
  }, [selectedFeedbackId]);

  const handleRateSuperAdmin = (rating: 1 | 2 | 3 | 4 | 5) => {
    if (!selectedFeedback) return;
    if (!isSuperAdmin) {
      alert("Only Super Admin users can rate feedback.");
      return;
    }
    actions.rateFeedbackAsSuperAdmin(selectedFeedback.id, rating);
  };

  const handleSaveResponse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFeedback) return;
    actions.updateFeedbackResponse(selectedFeedback.id, {
      status: statusInput,
      adminResponse: responseInput.trim() || null,
    });
  };

  const categoryColor = (c: string) => {
    if (c === "Product") return "bg-blue-50 text-blue-700 border-blue-200";
    if (c === "Support") return "bg-emerald-50 text-emerald-700 border-emerald-200";
    if (c === "Training") return "bg-purple-50 text-purple-700 border-purple-200";
    return "bg-amber-50 text-amber-700 border-amber-200";
  };

  return (
    <div className="bg-slate-50/50 rounded-2xl shadow-sm border border-gray-100 min-h-[650px] overflow-hidden flex flex-col font-semibold animate-in fade-in zoom-in-95 duration-200">
      {/* Workspace Header */}
      <div className="px-6 py-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white">
        <div>
          <h1 className="text-lg font-bold tracking-tight text-gray-900 flex items-center gap-2">
            <Star className="w-5 h-5 text-indigo-600" />
            Feedback Management & Super Admin Rating
          </h1>
          <p className="text-sm text-gray-500 mt-1 font-semibold">
            Review customer feedback, evaluate ratings, and submit Super Admin ratings.
          </p>
        </div>
      </div>

      {/* Main Split Master-Detail Layout */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        {/* Left Sidebar / Feedback List */}
        <div className="lg:col-span-5 border-r border-gray-200 bg-white flex flex-col h-full overflow-hidden">
          {/* Sidebar Search & Filters */}
          <div className="p-4 border-b border-gray-100 space-y-3 bg-gray-50/50">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search feedback by comment, user, org..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-xl pl-9 pr-3 py-2 text-xs outline-none focus:border-indigo-500 font-medium"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-gray-400" />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold outline-none flex-1"
              >
                <option value="ALL">All Categories</option>
                <option value="Product">Product</option>
                <option value="Support">Support</option>
                <option value="Training">Training</option>
                <option value="UI">UI</option>
              </select>
            </div>
          </div>

          {/* Feedback List Items */}
          <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
            {filteredFeedback.map((fb: Feedback) => {
              const isSelected = fb.id === selectedFeedbackId;
              return (
                <div
                  key={fb.id}
                  onClick={() => setSelectedFeedbackId(fb.id)}
                  className={`p-4 transition-colors cursor-pointer ${
                    isSelected
                      ? "bg-indigo-50/60 border-l-4 border-indigo-600"
                      : "hover:bg-gray-50/80"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-gray-900 truncate max-w-[160px]">
                      {fb.user}
                    </span>
                    <span className="text-[10px] text-gray-400 font-mono">
                      {new Date(fb.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-2 mb-2">
                    <p className="text-xs text-gray-500 font-semibold truncate max-w-[180px]">
                      {fb.organization}
                    </p>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold border ${categoryColor(fb.category)}`}
                    >
                      {fb.category}
                    </span>
                  </div>

                  <p className="text-xs text-gray-700 line-clamp-2 leading-relaxed mb-2 font-medium">
                    "{fb.comment}"
                  </p>

                  <div className="flex items-center justify-between pt-1 border-t border-gray-100/60">
                    <div className="flex items-center gap-1" title={`User Rating: ${fb.rating}/5`}>
                      <span className="text-[10px] text-gray-400 font-bold mr-1">User:</span>
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`w-3 h-3 ${s <= fb.rating ? "fill-amber-400 text-amber-400" : "text-gray-200"}`}
                        />
                      ))}
                    </div>

                    {fb.superAdminRating && (
                      <div className="flex items-center gap-1 bg-purple-50 px-1.5 py-0.5 rounded border border-purple-100" title={`Admin Rating: ${fb.superAdminRating}/5`}>
                        <ShieldCheck className="w-3 h-3 text-purple-600" />
                        <span className="text-[10px] font-bold text-purple-700">{fb.superAdminRating}★</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {filteredFeedback.length === 0 && (
              <div className="p-8 text-center text-gray-400 text-xs font-semibold">
                No feedback records found.
              </div>
            )}
          </div>
        </div>

        {/* Right Detail View */}
        <div className="lg:col-span-7 bg-slate-50/30 flex flex-col h-full overflow-y-auto">
          {selectedFeedback ? (
            <div className="p-6 space-y-6">
              {/* Detail Header */}
              <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-gray-100">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-gray-400 uppercase">
                      FEEDBACK #{selectedFeedback.id}
                    </span>
                    <h2 className="text-base font-bold text-gray-900 flex items-center gap-2 mt-0.5">
                      <User className="w-4 h-4 text-indigo-600" />
                      {selectedFeedback.user}
                    </h2>
                  </div>
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-bold border self-start sm:self-auto ${categoryColor(selectedFeedback.category)}`}
                  >
                    {selectedFeedback.category}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Building className="w-4 h-4 text-gray-400" />
                    <div>
                      <span className="text-gray-400 font-normal block text-[10px]">Organization</span>
                      <span className="font-bold text-gray-900">{selectedFeedback.organization}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <MessageCircle className="w-4 h-4 text-gray-400" />
                    <div>
                      <span className="text-gray-400 font-normal block text-[10px]">Submitted Date</span>
                      <span className="font-bold text-gray-900">{new Date(selectedFeedback.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                {/* Ratings Overview */}
                <div className="bg-gray-50/70 p-4 rounded-xl border border-gray-100 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Customer Rating</span>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`w-4 h-4 ${s <= selectedFeedback.rating ? "fill-amber-400 text-amber-400" : "text-gray-200"}`}
                        />
                      ))}
                      <span className="text-xs font-bold text-gray-700 ml-1.5">{selectedFeedback.rating} / 5</span>
                    </div>
                  </div>

                  {selectedFeedback.npsScore !== null && (
                    <div>
                      <span className="text-[10px] font-bold text-gray-400 uppercase block mb-1">NPS Score</span>
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                          selectedFeedback.npsScore >= 9
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : selectedFeedback.npsScore >= 7
                              ? "bg-amber-50 text-amber-700 border border-amber-200"
                              : "bg-red-50 text-red-700 border border-red-200"
                        }`}
                      >
                        {selectedFeedback.npsScore} / 10
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Feedback Message */}
              <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-2">
                <span className="text-xs font-bold text-gray-400 uppercase">Customer Feedback Comment</span>
                <p className="text-sm text-gray-800 leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100 font-medium">
                  "{selectedFeedback.comment}"
                </p>
              </div>

              {/* Super Admin Rating Section */}
              <div className="bg-white p-5 rounded-2xl border border-indigo-100 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-indigo-700">
                    <ShieldCheck className="w-5 h-5" />
                    <h3 className="text-sm font-bold">Super Admin Rating</h3>
                  </div>
                  {selectedFeedback.superAdminRating ? (
                    <span className="text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200 px-2.5 py-1 rounded-full">
                      Rated: {selectedFeedback.superAdminRating} / 5 Stars
                    </span>
                  ) : (
                    <span className="text-xs text-gray-400 italic">Not rated by Super Admin</span>
                  )}
                </div>

                <p className="text-xs text-gray-500 font-medium">
                  Rate this feedback internally to guide support & product priority.
                </p>

                <div className="flex items-center gap-2 pt-1">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const isSelectedStar = selectedFeedback.superAdminRating === star;
                    return (
                      <button
                        key={star}
                        type="button"
                        onClick={() => handleRateSuperAdmin(star as 1 | 2 | 3 | 4 | 5)}
                        className={`p-2 rounded-xl border transition-all cursor-pointer flex items-center gap-1.5 text-xs font-bold ${
                          isSelectedStar
                            ? "bg-purple-600 text-white border-purple-600 shadow-sm"
                            : "bg-gray-50 hover:bg-purple-50 border-gray-200 text-gray-700 hover:border-purple-300"
                        }`}
                      >
                        <Star className={`w-4 h-4 ${isSelectedStar ? "fill-white text-white" : "text-amber-400"}`} />
                        <span>{star}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Admin Response & Status Form */}
              <form onSubmit={handleSaveResponse} className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-4">
                <h3 className="text-sm font-bold text-gray-900">Admin Action & Internal Notes</h3>
                
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      value={statusInput}
                      onChange={(e) => setStatusInput(e.target.value as FeedbackStatus)}
                      className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold outline-none focus:border-indigo-500"
                    >
                      <option value="New">New</option>
                      <option value="Under Review">Under Review</option>
                      <option value="Actioned">Actioned</option>
                      <option value="Archived">Archived</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Admin Response / Resolution Notes
                    </label>
                    <textarea
                      rows={3}
                      value={responseInput}
                      onChange={(e) => setResponseInput(e.target.value)}
                      placeholder="Add admin notes or response to customer..."
                      className="w-full bg-white border border-gray-200 rounded-xl p-3 text-xs outline-none focus:border-indigo-500 font-medium"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" /> Save Response & Status
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="p-12 text-center text-gray-400 text-sm font-semibold">
              Select a feedback item from the sidebar to view details.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
