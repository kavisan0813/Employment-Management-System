/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  AreaChart, Search, Download, Calendar, Activity, 
  ArrowUpRight, Server, Database, TrendingUp, Cpu, Network 
} from "lucide-react";

export default function ReportsView() {
  const [timeframe, setTimeframe] = useState<"7d" | "30d" | "90d" | "1y">("30d");

  // Chart coordinate generators for customized crisp SVG vector pathways
  // MRR Trend Coordinates
  const mrrDataPoints: { [t: string]: { label: string; val: number; pct: number }[] } = {
    "7d": [
      { label: "Jun 14", val: 82000, pct: 15 },
      { label: "Jun 15", val: 82100, pct: 20 },
      { label: "Jun 16", val: 82400, pct: 30 },
      { label: "Jun 17", val: 82900, pct: 45 },
      { label: "Jun 18", val: 83500, pct: 60 },
      { label: "Jun 19", val: 84000, pct: 80 },
      { label: "Jun 20", val: 84790, pct: 100 }
    ],
    "30d": [
      { label: "May 22", val: 74000, pct: 10 },
      { label: "May 29", val: 76500, pct: 25 },
      { label: "Jun 05", val: 79000, pct: 45 },
      { label: "Jun 12", val: 81200, pct: 65 },
      { label: "Jun 20", val: 84790, pct: 100 }
    ],
    "90d": [
      { label: "Mar 20", val: 59000, pct: 5 },
      { label: "Apr 20", val: 68000, pct: 35 },
      { label: "May 20", val: 75200, pct: 70 },
      { label: "Jun 20", val: 84790, pct: 100 }
    ],
    "1y": [
      { label: "Jun 25", val: 32000, pct: 0 },
      { label: "Sep 25", val: 45000, pct: 25 },
      { label: "Dec 25", val: 56000, pct: 50 },
      { label: "Mar 26", val: 69000, pct: 75 },
      { label: "Jun 26", val: 84790, pct: 100 }
    ]
  };

  const points = mrrDataPoints[timeframe];
  
  // Create an SVG path for the MRR trend chart
  const width = 600;
  const height = 180;
  const paddingY = 20;
  const startX = 40;
  const endX = 560;

  // Map values to coordinates
  const minVal = Math.min(...points.map(p => p.val)) * 0.95;
  const maxVal = Math.max(...points.map(p => p.val)) * 1.05;

  const svgPoints = points.map((p, idx) => {
    const x = startX + (idx / (points.length - 1)) * (endX - startX);
    const y = height - paddingY - ((p.val - minVal) / (maxVal - minVal)) * (height - 2 * paddingY);
    return { x, y, label: p.label, val: p.val };
  });

  // SVG Area path segment
  const linePath = svgPoints.reduce((acc, curr, idx) => {
    return acc + `${idx === 0 ? "M" : "L"} ${curr.x} ${curr.y}`;
  }, "");

  const areaPath = linePath + ` L ${svgPoints[svgPoints.length - 1].x} ${height - paddingY} L ${svgPoints[0].x} ${height - paddingY} Z`;

  // API Call Load coordinate generators
  const apiLoadPoints = [45, 52, 47, 60, 68, 75, 50, 42, 60, 85, 92, 70, 65, 80, 95, 110, 85, 75, 90, 105, 120, 115, 134, 142];
  const maxLoad = Math.max(...apiLoadPoints) * 1.1;
  const loadPath = apiLoadPoints.reduce((acc, val, idx) => {
    const x = 30 + (idx / (apiLoadPoints.length - 1)) * 540;
    const y = 140 - (val / maxLoad) * 110;
    return acc + `${idx === 0 ? "M" : "L"} ${x} ${y}`;
  }, "");

  const downloadReportRawCsv = () => {
    alert("Exporting relational SaaS billing metrics, database storage summaries, and SLA histories to a local CSV file...");
  };

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-gray-100 gap-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-gray-950 flex items-center gap-2">
            <AreaChart className="w-5 h-5 text-indigo-500" />
            Platform Diagnostics & Analytics
          </h1>
          <p className="text-xs text-gray-400">Evaluate overall recurring revenue pools, API latency levels, and active workspace nodes.</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={downloadReportRawCsv}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-semibold cursor-pointer border"
          >
            <Download className="w-4 h-4" /> Export Raw CSV
          </button>
        </div>
      </div>

      {/* Date Range selectors */}
      <div className="flex justify-between items-center bg-white p-3 rounded-xl border border-gray-200 shadow-2xs">
        <span className="text-xs font-semibold text-gray-500">Query Window Timeline</span>
        <div className="inline-flex rounded-lg border border-gray-200 p-0.5 bg-gray-50 text-xs">
          {(["7d", "30d", "90d", "1y"] as const).map(t => (
            <button
              key={t}
              onClick={() => setTimeframe(t)}
              className={`px-3 py-1 rounded-md cursor-pointer font-bold transition-all uppercase text-[10px] ${
                timeframe === t ? "bg-white text-gray-900 shadow-3xs border border-gray-150" : "text-gray-500 hover:text-gray-950"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* MRR GROWTH PLOT */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs space-y-4">
          <div>
            <span className="text-gray-400 text-[10px] uppercase font-bold tracking-widest block">Licensing MRR progression</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-xl font-extrabold text-gray-950">$84,790 USD</span>
              <span className="text-xs font-semibold text-emerald-600 flex items-center">
                <ArrowUpRight className="w-3.5 h-3.5" /> +18.4%
              </span>
            </div>
          </div>

          {/* Crisp Custom SVG Line-Area chart */}
          <div className="border border-gray-100 rounded-lg p-2 bg-gray-50/50">
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
              {/* Grid horizontal guidelines */}
              <line x1={startX} y1={paddingY} x2={endX} y2={paddingY} stroke="#f1f5f9" strokeWidth={1} />
              <line x1={startX} y1={height/2} x2={endX} y2={height/2} stroke="#f1f5f9" strokeWidth={1} />
              <line x1={startX} y1={height - paddingY} x2={endX} y2={height - paddingY} stroke="#e2e8f0" strokeWidth={1.5} />

              {/* Shaded Area */}
              <path d={areaPath} fill="url(#indigoGrad)" opacity={0.12} />
              
              {/* Vibrant Trend plot line */}
              <path d={linePath} fill="none" stroke="#6366f1" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />

              {/* Data points markers */}
              {svgPoints.map((pt, index) => (
                <g key={index} className="group cursor-pointer">
                  <circle cx={pt.x} cy={pt.y} r={4} fill="#6366f1" stroke="#ffffff" strokeWidth={1.5} />
                  <text
                    x={pt.x}
                    y={height - 2}
                    textAnchor="middle"
                    fill="#94a3b8"
                    fontSize={9}
                    fontFamily="monospace"
                  >
                    {pt.label}
                  </text>
                  <text
                    x={pt.x}
                    y={pt.y - 8}
                    textAnchor="middle"
                    fill="#1e293b"
                    fontSize={9}
                    fontWeight="bold"
                    fontFamily="monospace"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ${Math.round(pt.val/1000)}k
                  </text>
                </g>
              ))}

              <defs>
                <linearGradient id="indigoGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#ffffff" stopOpacity={0} />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>

        {/* API CALL VOLUMES THROUGHPUT */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs space-y-4">
          <div>
            <span className="text-gray-400 text-[10px] uppercase font-bold tracking-widest block">API Throughput rate (24h)</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-xl font-extrabold text-gray-950">142,390 calls</span>
              <span className="text-xs font-semibold text-indigo-650">Avg Latency: 42ms</span>
            </div>
          </div>

          <div className="border border-gray-100 rounded-lg p-2 bg-gray-50/50">
            <svg viewBox="0 0 600 150" className="w-full h-auto">
              {/* Guidelines */}
              <line x1={30} y1={30} x2={570} y2={30} stroke="#f1f5f9" strokeWidth={1} />
              <line x1={30} y1={85} x2={570} y2={85} stroke="#f1f5f9" strokeWidth={1} />
              <line x1={30} y1={140} x2={570} y2={140} stroke="#e2e8f0" strokeWidth={1.5} />

              {/* API Load path */}
              <path d={loadPath} fill="none" stroke="#2563eb" strokeWidth={2} strokeLinecap="round" />

              {/* Time stamps */}
              <text x={30} y={148} fill="#94a3b8" fontSize={9} fontFamily="monospace">00:00</text>
              <text x={300} y={148} textAnchor="middle" fill="#94a3b8" fontSize={9} fontFamily="monospace">12:00</text>
              <text x={570} y={148} textAnchor="end" fill="#94a3b8" fontSize={9} fontFamily="monospace">23:00</text>
            </svg>
          </div>
        </div>

      </div>

      {/* PLATFORM SLAS WELLNESS MATRIX */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-xs space-y-5">
        <h3 className="text-sm font-bold text-gray-950 flex items-center gap-2">
          <Server className="w-5 h-5 text-indigo-505" />
          Infrastructure Health Ledger
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border border-gray-200 rounded-lg p-4 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest block">Core Database records</span>
              <Database className="w-4 h-4 text-gray-400" />
            </div>
            <p className="text-sm font-bold text-gray-900">4,392,028 Rows</p>
            <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
              <div className="bg-primary-600 h-full w-[43%]" />
            </div>
            <span className="text-[10px] text-gray-400">43.2GB / 100GB (SSD Instance Allocation)</span>
          </div>

          <div className="border border-gray-200 rounded-lg p-4 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest block">Workspace Nodes Active</span>
              <Cpu className="w-4 h-4 text-emerald-500 animate-pulse" />
            </div>
            <p className="text-sm font-bold text-gray-900">12 / 12 Nodes</p>
            <span className="text-[10px] text-emerald-650 bg-emerald-50 px-2 py-0.5 rounded font-semibold inline-block">
              SLA Compliance Guarantee: 99.998%
            </span>
          </div>

          <div className="border border-gray-200 rounded-lg p-4 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest block">Webhook Queue Latency</span>
              <Network className="w-4 h-4 text-gray-400" />
            </div>
            <p className="text-sm font-bold text-gray-900">1.2 seconds latency</p>
            <span className="text-[10px] text-gray-400 font-medium">0 In Queue Overload State (Healthy)</span>
          </div>
        </div>
      </div>

    </div>
  );
}
