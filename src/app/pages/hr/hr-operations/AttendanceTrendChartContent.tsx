import React, { Suspense } from "react";

const AttendanceTrendChart = React.lazy(() =>
  import("recharts").then((mod) => {
    const {
      LineChart,
      Line,
      XAxis,
      YAxis,
      Tooltip: RechartsTooltip,
      ResponsiveContainer,
    } = mod;

    return {
      default: function ChartComponent({
        monthlyTrendData,
      }: {
        monthlyTrendData: unknown[];
      }) {
        return (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={monthlyTrendData}
              margin={{ top: 5, right: 5, left: -25, bottom: 0 }}
            >
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{
                  fontSize: 10,
                  fontWeight: 700,
                  fill: "var(--muted-foreground)",
                }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{
                  fontSize: 10,
                  fontWeight: 700,
                  fill: "var(--muted-foreground)",
                }}
                domain={[80, 100]}
              />
              <RechartsTooltip
                contentStyle={{
                  backgroundColor: "var(--card)",
                  borderColor: "var(--border)",
                  borderRadius: "10px",
                  fontSize: "11px",
                  fontWeight: "bold",
                }}
              />
              <Line
                type="monotone"
                dataKey="attendance"
                stroke="var(--primary)"
                strokeWidth={3}
                dot={{
                  r: 4,
                  fill: "var(--primary)",
                  strokeWidth: 2,
                  stroke: "white",
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        );
      },
    };
  })
);

export default function AttendanceTrendChartContent({
  monthlyTrendData,
}: {
  monthlyTrendData: unknown[];
}) {
  return (
    <Suspense fallback={null}>
      <AttendanceTrendChart monthlyTrendData={monthlyTrendData} />
    </Suspense>
  );
}
