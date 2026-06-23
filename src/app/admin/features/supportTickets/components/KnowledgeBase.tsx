import React from "react";
import { BookOpen, Eye, ThumbsUp } from "lucide-react";
import type { KBArticle } from "../types/types";

export function KnowledgeBase({ kbArticles }: { kbArticles: KBArticle[] }) {
  return (
    <div className="space-y-5 animate-in fade-in zoom-in-95 duration-200">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Knowledge Base</h1>
        <p className="text-sm text-gray-500 mt-1">Self-service articles to help customers resolve common issues.</p>
      </div>

      <div className="space-y-3">
        {kbArticles.map(article => (
          <div key={article.id} className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs flex items-center justify-between hover:shadow-sm transition-shadow">
            <div className="flex items-center gap-4">
              <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900">{article.title}</h3>
                <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                  <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-600 text-[10px] font-bold">{article.category}</span>
                  <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {article.views.toLocaleString()} views</span>
                  <span className="flex items-center gap-1"><ThumbsUp className="w-3 h-3" /> {article.helpful.toLocaleString()} helpful</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${article.status === 'Published' ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                {article.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
