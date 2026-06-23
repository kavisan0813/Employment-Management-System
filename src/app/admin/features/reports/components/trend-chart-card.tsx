import React from "react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";

interface TrendChartCardProps {
  title: string;
  data: any[];
  colorVar: string;
}

export function TrendChartCard({ title, data, colorVar }: TrendChartCardProps) {
  const gradientId = `grad-${title.replace(/\s+/g, "-").toLowerCase()}`;

  return (
    <div className="rounded-xl border border-border/40 bg-card px-6 py-5 shadow-sm dark:bg-card/40 dark:backdrop-blur-md">
      <div className="mb-4 text-sm font-semibold tracking-wide uppercase text-foreground">
        {title}
      </div>
      <div className="h-36">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 4, right: 4, left: 4, bottom: 0 }}>
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={colorVar} stopOpacity={0.28} />
                <stop offset="100%" stopColor={colorVar} stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="x" hide />
            <Tooltip
              contentStyle={{
                background: "var(--popover)",
                border: "1px solid var(--border)",
                borderRadius: 8,
                fontSize: 12,
              }}
              labelStyle={{ color: "var(--muted-foreground)" }}
            />
            <Area
              type="monotone"
              dataKey="y"
              stroke={colorVar}
              strokeWidth={2}
              fill={`url(#${gradientId})`}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
export default TrendChartCard;
