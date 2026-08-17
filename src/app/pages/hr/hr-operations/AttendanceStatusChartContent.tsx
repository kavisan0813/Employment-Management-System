import React, { Suspense } from "react";

const AttendanceStatusChart = React.lazy(() =>
  import("recharts").then((mod) => {
    const { PieChart, Pie, Cell, ResponsiveContainer } = mod;

    return {
      default: function ChartComponent({
        statusDistribution,
      }: {
        statusDistribution: any[];
      }) {
        return (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={statusDistribution}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {statusDistribution.map((entry) => (
                  <Cell key={`cell-${entry.color}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        );
      },
    };
  })
);

export default function AttendanceStatusChartContent({
  statusDistribution,
}: {
  statusDistribution: any[];
}) {
  return (
    <Suspense fallback={null}>
      <AttendanceStatusChart statusDistribution={statusDistribution} />
    </Suspense>
  );
}
