/**
 * Generates a smooth, deterministic sample series for placeholder charts.
 * Deterministic (no Math.random) so snapshots/builds stay stable until real
 * analytics data is wired in.
 */
export function generateSeries(points: number, base: number, amplitude: number) {
  return Array.from({ length: points }, (_, i) => ({
    x: `D${i + 1}`,
    y: Math.round(base + amplitude * Math.sin(i / 2.3) + (amplitude / 3) * Math.sin(i / 0.9)),
  }));
}
