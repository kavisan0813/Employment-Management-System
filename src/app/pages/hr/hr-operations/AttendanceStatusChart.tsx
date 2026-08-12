import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

export default function AttendanceStatusChart({
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
}
