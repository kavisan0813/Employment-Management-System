export const formatCurrency = (val: number) => {
  if (val >= 100000) return `₹${(val / 100000).toFixed(1)}L`;
  if (val >= 1000) return `₹${val.toLocaleString("en-IN")}`;
  return `₹${val}`;
};
