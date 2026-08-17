import { lazy, Suspense } from "react";

const FinanceAssetCostChartContent = lazy(
  () => import("./FinanceAssetCostChartContent")
);

export default function FinanceAssetCostChart(props: {
  ASSET_VALUE_BY_DEPT: unknown[];
  setSelectedDept: (dept: string) => void;
}) {
  return (
    <Suspense
      fallback={
        <div className="h-full w-full flex items-center justify-center text-sm text-muted-foreground">
          Loading chart...
        </div>
      }
    >
      <FinanceAssetCostChartContent {...props} />
    </Suspense>
  );
}
