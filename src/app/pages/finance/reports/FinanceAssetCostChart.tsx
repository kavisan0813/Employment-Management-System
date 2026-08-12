import React from "react";
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function FinanceAssetCostChart({
  ASSET_VALUE_BY_DEPT,
  setSelectedDept,
}: {
  ASSET_VALUE_BY_DEPT: unknown[];
  setSelectedDept: (dept: string) => void;
}) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsBarChart
        data={ASSET_VALUE_BY_DEPT}
        layout="vertical"
        margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
        onClick={(
          data: any /* eslint-disable-line @typescript-eslint/no-explicit-any */,
        ) => {
          if (data?.activeLabel) {
            setSelectedDept(data.activeLabel);
          }
        }}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          horizontal={false}
          stroke="var(--border)"
        />
        <XAxis
          type="number"
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 11, fontWeight: 700, fill: "#94A3B8" }}
        />
        <YAxis
          dataKey="department"
          type="category"
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 11, fontWeight: 700, fill: "#94A3B8" }}
          width={80}
        />
        <Tooltip
          cursor={{ fill: "rgba(139,92,246,0.05)" }}
          contentStyle={{
            backgroundColor: "#0F3047",
            border: "none",
            borderRadius: "12px",
            color: "white",
          }}
          formatter={(value: number, name: string) => [
            `₹${value}L`,
            name === "depreciated" ? "Depreciated" : "Book Value",
          ]}
        />
        <Bar
          dataKey="depreciated"
          name="depreciated"
          fill="#8B5CF6"
          radius={[0, 4, 4, 0]}
          barSize={16}
          cursor="pointer"
          onClick={(data) =>
            data?.department && setSelectedDept(data.department)
          }
        />
        <Bar
          dataKey="current"
          name="current"
          fill="#00B87C"
          radius={[0, 4, 4, 0]}
          barSize={16}
          cursor="pointer"
          onClick={(data) =>
            data?.department && setSelectedDept(data.department)
          }
        />
      </RechartsBarChart>
    </ResponsiveContainer>
  );
}
