import { lazy, Suspense } from "react";

const AttendanceStatusChartContent = lazy(
  () => import("./AttendanceStatusChartContent")
);

export default function AttendanceStatusChart(props: {
  statusDistribution: any[];
}) {
  return (
    <Suspense
      fallback={
        <div className="h-full w-full flex items-center justify-center text-sm text-muted-foreground">
          Loading chart...
        </div>
      }
    >
      <AttendanceStatusChartContent {...props} />
    </Suspense>
  );
}
