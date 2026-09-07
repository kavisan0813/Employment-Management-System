import React, { useState } from "react";
import { ThumbsUp, Lightbulb, Rocket, CheckCircle2, Search } from "lucide-react";
import type { FeatureRequest } from "../types/types";
import { useSupportTickets } from "../hooks/useSupportTickets";

export function FeatureRequests({
  featureRequests,
  actions,
}: {
  featureRequests: FeatureRequest[];
  actions: ReturnType<typeof useSupportTickets>["actions"];
}) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const filtered = featureRequests.filter((fr) => {
    const matchSearch =
      fr.featureName.toLowerCase().includes(search.toLowerCase()) ||
      fr.description.toLowerCase().includes(search.toLowerCase()) ||
      fr.organization.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "ALL" || fr.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const statusColor = (s: string) => {
    if (s === "New") return "bg-blue-50 text-blue-700 border-blue-200";
    if (s === "Under Review")
      return "bg-purple-50 text-purple-700 border-purple-200";
    if (s === "Approved")
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    if (s === "Rejected") return "bg-red-50 text-red-700 border-red-200";
    return "bg-indigo-50 text-indigo-700 border-indigo-200";
  };

  const stageIcon = (stage: string | null) => {
    if (!stage) return null;
    if (stage === "Released")
      return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />;
    return <Rocket className="w-3.5 h-3.5 text-indigo-500" />;
  };

  return (
    <div className="bg-slate-50/50 rounded-2xl shadow-sm border border-gray-100 min-h-[600px] overflow-hidden flex flex-col font-semibold animate-in fade-in zoom-in-95 duration-200">
      {/* Navigation Header */}
      <div className="px-6 py-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold tracking-tight text-gray-900 flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-indigo-600" />
            Feature Update Requests
          </h1>
          <p className="text-sm text-gray-500 mt-1 font-semibold">
            Customer feature update requests, vote counts, and roadmap tracking.
          </p>
        </div>
      </div>

      <div className="p-6 flex-1 overflow-y-auto flex flex-col gap-6">
        {/* Filters */}
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search feature update requests..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm outline-none focus:border-indigo-500 font-medium"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm font-medium outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="New">New</option>
            <option value="Under Review">Under Review</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
            <option value="Released">Released</option>
          </select>
        </div>

        {/* Request Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...filtered]
            .sort((a, b) => b.votes - a.votes)
            .map((fr) => (
              <div
                key={fr.id}
                className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs hover:shadow-sm transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
                      <Lightbulb className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="font-mono text-[10px] font-bold text-gray-400">
                        {fr.requestId}
                      </span>
                      <h3 className="text-sm font-bold text-gray-900 mt-0.5">
                        {fr.featureName}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                        {fr.description}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold border whitespace-nowrap ${statusColor(fr.status)}`}
                  >
                    {fr.status}
                  </span>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>{fr.organization}</span>
                    {fr.roadmapStage && (
                      <span className="flex items-center gap-1 px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-bold">
                        {stageIcon(fr.roadmapStage)} {fr.roadmapStage}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => actions.voteForFeature(fr.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl text-xs font-bold text-gray-700 cursor-pointer transition-colors"
                  >
                    <ThumbsUp className="w-3.5 h-3.5" /> {fr.votes}
                  </button>
                </div>
              </div>
            ))}

          {filtered.length === 0 && (
            <div className="col-span-full py-12 text-center text-gray-400 bg-white rounded-2xl border border-gray-200">
              No feature update requests match your filter criteria.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
