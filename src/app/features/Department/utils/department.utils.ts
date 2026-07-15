export function formatCurrency(amount: number): string {
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(2)}Cr`;
  }
  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(2)}L`;
  }
  return `₹${amount.toLocaleString("en-IN")}`;
}

export function parseBudgetAmount(budgetStr: string): number {
  const clean = budgetStr.replace(/[^\d.]/g, "");
  const val = parseFloat(clean);
  if (isNaN(val)) return 0;
  if (budgetStr.includes("Cr")) {
    return val * 10000000;
  }
  if (budgetStr.includes("L")) {
    return val * 100000;
  }
  return val;
}
