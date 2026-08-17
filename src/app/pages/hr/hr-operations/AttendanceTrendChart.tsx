import { lazy, Suspense } from "react";

const AttendanceTrendChartContent = lazy(
  () => import("./AttendanceTrendChartContent")
);

export default function AttendanceTrendChart(props: {
  monthlyTrendData: unknown[];
}) {
  return (
    <Suspense
      fallback={
        <div className="h-full w-full flex items-center justify-center text-sm text-muted-foreground">
          Loading chart...
        </div>
      }
    >
      <AttendanceTrendChartContent {...props} />
    </Suspense>
  );
}
