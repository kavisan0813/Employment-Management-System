import React from "react";
import { Star, MessageCircle } from "lucide-react";
import type { Feedback } from "../types/types";

export function FeedbackManagement({ feedback }: { feedback: Feedback[] }) {
  const categoryColor = (c: string) => {
    if (c === "Product") return "bg-blue-50 text-blue-700";
    if (c === "Support") return "bg-emerald-50 text-emerald-700";
    if (c === "Training") return "bg-purple-50 text-purple-700";
    return "bg-amber-50 text-amber-700";
  };

  return (
    <div className="space-y-5 animate-in fade-in zoom-in-95 duration-200">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Feedback Management</h1>
        <p className="text-sm text-gray-500 mt-1">Customer feedback, ratings, and Net Promoter Score tracking.</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <th className="px-5 py-3">Rating</th>
              <th className="px-5 py-3">Comment</th>
              <th className="px-5 py-3">Category</th>
              <th className="px-5 py-3">User</th>
              <th className="px-5 py-3">Organization</th>
              <th className="px-5 py-3">NPS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {feedback.map(fb => (
              <tr key={fb.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-5 py-4">
                  <div className="flex gap-0.5">
                    {[1,2,3,4,5].map(s => (
                      <Star key={s} className={`w-3.5 h-3.5 ${s <= fb.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`} />
                    ))}
                  </div>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-start gap-2 max-w-xs">
                    <MessageCircle className="w-3.5 h-3.5 text-gray-300 mt-0.5 shrink-0" />
                    <p className="text-xs text-gray-700 line-clamp-2">{fb.comment}</p>
                  </div>
                </td>
                <td className="px-5 py-4"><span className={`px-2 py-0.5 rounded text-[10px] font-bold ${categoryColor(fb.category)}`}>{fb.category}</span></td>
                <td className="px-5 py-4 text-gray-600 font-medium text-xs">{fb.user}</td>
                <td className="px-5 py-4 text-gray-600 text-xs">{fb.organization}</td>
                <td className="px-5 py-4">
                  {fb.npsScore !== null ? (
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${fb.npsScore >= 9 ? 'bg-emerald-50 text-emerald-700' : fb.npsScore >= 7 ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-700'}`}>
                      {fb.npsScore}/10
                    </span>
                  ) : <span className="text-gray-300 text-xs">—</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
