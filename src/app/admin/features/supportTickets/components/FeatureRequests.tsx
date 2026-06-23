import React from "react";
import { ThumbsUp, Lightbulb, Rocket, CheckCircle2 } from "lucide-react";
import type { FeatureRequest } from "../types/types";

export function FeatureRequests({ featureRequests, actions }: { featureRequests: FeatureRequest[], actions: any }) {
  const statusColor = (s: string) => {
    if (s === "New") return "bg-blue-50 text-blue-700 border-blue-200";
    if (s === "Under Review") return "bg-purple-50 text-purple-700 border-purple-200";
    if (s === "Approved") return "bg-emerald-50 text-emerald-700 border-emerald-200";
    if (s === "Rejected") return "bg-red-50 text-red-700 border-red-200";
    return "bg-indigo-50 text-indigo-700 border-indigo-200";
  };

  const stageIcon = (stage: string | null) => {
    if (!stage) return null;
    if (stage === "Released") return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />;
    return <Rocket className="w-3.5 h-3.5 text-indigo-500" />;
  };

  return (
    <div className="space-y-5 animate-in fade-in zoom-in-95 duration-200">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Feature Requests</h1>
        <p className="text-sm text-gray-500 mt-1">Customer-requested features with voting and roadmap tracking.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {featureRequests.sort((a, b) => b.votes - a.votes).map(fr => (
          <div key={fr.id} className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs hover:shadow-sm transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
                  <Lightbulb className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-mono text-[10px] font-bold text-gray-400">{fr.requestId}</span>
                  <h3 className="text-sm font-bold text-gray-900 mt-0.5">{fr.featureName}</h3>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">{fr.description}</p>
                </div>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border whitespace-nowrap ${statusColor(fr.status)}`}>{fr.status}</span>
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
              <button onClick={() => actions.voteForFeature(fr.id)} className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl text-xs font-bold text-gray-700 cursor-pointer transition-colors">
                <ThumbsUp className="w-3.5 h-3.5" /> {fr.votes}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
