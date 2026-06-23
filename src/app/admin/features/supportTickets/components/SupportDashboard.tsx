import React from "react";
import { BarChart3, Clock, AlertTriangle, Star, ThumbsUp, Ticket } from "lucide-react";

export function SupportDashboard({ stats }: { stats: any }) {
  const cards = [
    { label: "Open Tickets", value: stats.open, icon: Ticket, color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-100" },
    { label: "Resolved", value: stats.resolved, icon: BarChart3, color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100" },
    { label: "SLA Breached", value: stats.slaBreached, icon: AlertTriangle, color: "text-red-600", bg: "bg-red-50", border: "border-red-100" },
    { label: "Critical Open", value: stats.criticalOpen, icon: Clock, color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-100" },
    { label: "Avg CSAT", value: `${stats.avgRating.toFixed(1)} / 5`, icon: Star, color: "text-purple-600", bg: "bg-purple-50", border: "border-purple-100" },
    { label: "Avg NPS", value: stats.avgNPS.toFixed(1), icon: ThumbsUp, color: "text-indigo-600", bg: "bg-indigo-50", border: "border-indigo-100" },
  ];

  return (
    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Support Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Real-time overview of support operations and customer satisfaction.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {cards.map(c => (
          <div key={c.label} className={`${c.bg} rounded-2xl p-5 border ${c.border} transition-all hover:scale-[1.02]`}>
            <div className="flex items-center justify-between mb-3">
              <c.icon className={`w-5 h-5 ${c.color}`} />
              <span className={`text-[10px] font-bold uppercase tracking-wider ${c.color}`}>{c.label}</span>
            </div>
            <p className={`text-3xl font-extrabold ${c.color}`}>{c.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs">
          <h3 className="text-sm font-bold text-gray-900 mb-4">Ticket Volume Summary</h3>
          <div className="space-y-3">
            {[
              { label: "Total Tickets", value: stats.totalTickets, pct: 100 },
              { label: "Open / In Progress", value: stats.open, pct: stats.totalTickets ? Math.round(stats.open / stats.totalTickets * 100) : 0 },
              { label: "Resolved / Closed", value: stats.resolved, pct: stats.totalTickets ? Math.round(stats.resolved / stats.totalTickets * 100) : 0 },
            ].map(r => (
              <div key={r.label}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-medium text-gray-700">{r.label}</span>
                  <span className="font-bold text-gray-900">{r.value} ({r.pct}%)</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 rounded-full transition-all duration-700" style={{ width: `${r.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs">
          <h3 className="text-sm font-bold text-gray-900 mb-4">Customer Satisfaction</h3>
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="text-5xl font-black text-amber-500">{stats.avgRating.toFixed(1)}</div>
              <div className="flex justify-center mt-2 gap-0.5">
                {[1,2,3,4,5].map(s => (
                  <Star key={s} className={`w-4 h-4 ${s <= Math.round(stats.avgRating) ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`} />
                ))}
              </div>
              <p className="text-[10px] font-bold text-gray-400 uppercase mt-2">Average Rating</p>
            </div>
            <div className="flex-1 space-y-2">
              {[5,4,3,2,1].map(star => {
                const count = stats.totalFeedback > 0 ? Math.round(Math.random() * 5) : 0;
                return (
                  <div key={star} className="flex items-center gap-2 text-xs">
                    <span className="w-8 text-right font-medium text-gray-500">{star}★</span>
                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-400 rounded-full" style={{ width: `${count * 20}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
