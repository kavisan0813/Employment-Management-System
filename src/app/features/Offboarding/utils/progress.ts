export const progressColor = (pct: number) => {
  if (pct >= 80) return { bar: "#00B87C", text: "#00B87C" };
  if (pct >= 40) return { bar: "#F59E0B", text: "#F59E0B" };
  return { bar: "#EF4444", text: "#EF4444" };
};
