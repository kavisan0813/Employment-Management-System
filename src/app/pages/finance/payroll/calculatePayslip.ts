/**
 * Payroll Engine — Pure Calculation Functions & Statutory Rule Evaluator
 *
 * PURE FUNCTIONS — deterministic calculations for salary structure,
 * LOP, overtime, incentives, statutory PF/ESI/PT/TDS rules, and gratuity.
 */

import type {
  SalaryStructure,
  Payslip,
  PayslipEarnings,
  PayslipDeductions,
  EmployerContributions,
  PayrollSettingsState,
} from "./payroll.types";

/* ═══════════════════════════════════════════════════════════════════
 * FORMULA EVALUATOR (Safe, non-eval)
 * ═══════════════════════════════════════════════════════════════════ */

/**
 * Safely evaluates salary component formula without using eval().
 * Supports expressions such as:
 * - "40% of Basic"
 * - "10% of Gross"
 * - "Basic * 0.4"
 * - "Basic + HRA"
 * - "15% of CTC"
 */
export function evaluateFormula(
  formula: string,
  context: Record<string, number>,
): number {
  if (!formula || typeof formula !== "string") return 0;
  const trimmed = formula.trim();
  if (!trimmed) return 0;

  // Handle "X% of Y" pattern e.g. "40% of Basic", "10% of Gross"
  const pctOfMatch = trimmed.match(/^(\d+(?:\.\d+)?)%\s+of\s+(.+)$/i);
  if (pctOfMatch) {
    const pct = parseFloat(pctOfMatch[1]);
    const targetKey = pctOfMatch[2].trim();
    const baseValue = lookupContextValue(targetKey, context);
    return Math.round((pct / 100) * baseValue);
  }

  // Replace variable identifiers with numerical values from context
  let sanitized = trimmed;
  const keys = Object.keys(context).sort((a, b) => b.length - a.length);
  for (const key of keys) {
    const val = context[key] ?? 0;
    const regex = new RegExp(`\\b${escapeRegExp(key)}\\b`, "gi");
    sanitized = sanitized.replace(regex, String(val));
  }

  // Convert remaining percentage patterns (e.g. "40%") to fraction (40/100)
  sanitized = sanitized.replace(/(\d+(?:\.\d+)?)%/g, "($1/100)");

  return safeMathEval(sanitized);
}

function lookupContextValue(key: string, context: Record<string, number>): number {
  const lowerKey = key.toLowerCase();
  for (const [k, v] of Object.entries(context)) {
    if (k.toLowerCase() === lowerKey) return v;
  }
  return 0;
}

function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function safeMathEval(expr: string): number {
  try {
    if (!expr || typeof expr !== "string") return 0;
    // Only allow digits, decimals, +, -, *, /, (, ), spaces
    if (/[^0-9\.\+\-\*\/\(\)\s]/.test(expr)) {
      return 0;
    }

    let pos = 0;

    const skipWhitespace = () => {
      while (pos < expr.length && /\s/.test(expr[pos])) {
        pos++;
      }
    };

    const parseFactor = (): number => {
      skipWhitespace();
      if (pos >= expr.length) return 0;

      if (expr[pos] === "+") {
        pos++;
        return parseFactor();
      }
      if (expr[pos] === "-") {
        pos++;
        return -parseFactor();
      }

      if (expr[pos] === "(") {
        pos++;
        const val = parseExpression();
        skipWhitespace();
        if (pos < expr.length && expr[pos] === ")") {
          pos++;
        }
        return val;
      }

      const start = pos;
      while (pos < expr.length && /[0-9\.]/.test(expr[pos])) {
        pos++;
      }

      if (start === pos) return 0;

      const val = parseFloat(expr.slice(start, pos));
      return isNaN(val) ? 0 : val;
    };

    const parseTerm = (): number => {
      let left = parseFactor();
      while (true) {
        skipWhitespace();
        if (pos >= expr.length) break;
        const op = expr[pos];
        if (op === "*" || op === "/") {
          pos++;
          const right = parseFactor();
          if (op === "*") {
            left = left * right;
          } else {
            left = right !== 0 ? left / right : 0;
          }
        } else {
          break;
        }
      }
      return left;
    };

    const parseExpression = (): number => {
      let left = parseTerm();
      while (true) {
        skipWhitespace();
        if (pos >= expr.length) break;
        const op = expr[pos];
        if (op === "+" || op === "-") {
          pos++;
          const right = parseTerm();
          if (op === "+") {
            left = left + right;
          } else {
            left = left - right;
          }
        } else {
          break;
        }
      }
      return left;
    };

    const result = parseExpression();
    skipWhitespace();
    if (pos < expr.length) {
      return 0;
    }

    if (typeof result === "number" && !isNaN(result) && isFinite(result)) {
      return Math.round(result);
    }
  } catch (e) {
    console.warn("Payroll formula evaluation warning:", expr, e);
  }
  return 0;
}

/* ═══════════════════════════════════════════════════════════════════
 * HELPER: Professional Tax (PT)
 * ═══════════════════════════════════════════════════════════════════ */

const DEFAULT_PT_SLABS: Record<string, { min: number; max: number; amount: number }[]> = {
  Maharashtra: [
    { min: 0, max: 7500, amount: 0 },
    { min: 7501, max: 10000, amount: 175 },
    { min: 10001, max: Infinity, amount: 200 },
  ],
  Karnataka: [
    { min: 0, max: 25000, amount: 0 },
    { min: 25001, max: Infinity, amount: 200 },
  ],
  "Tamil Nadu": [
    { min: 0, max: 21000, amount: 0 },
    { min: 21001, max: 30000, amount: 135 },
    { min: 30001, max: 45000, amount: 315 },
    { min: 45001, max: 60000, amount: 690 },
    { min: 60001, max: Infinity, amount: 1025 },
  ],
};

export function getProfessionalTax(
  monthlyGross: number,
  state: string,
  customSlabs?: { state: string; minSalary: number; maxSalary: number; amount: number }[],
): number {
  if (customSlabs && customSlabs.length > 0) {
    const matchingStateSlabs = customSlabs.filter(
      (s) => s.state.toLowerCase() === state.toLowerCase(),
    );
    if (matchingStateSlabs.length > 0) {
      for (const slab of matchingStateSlabs) {
        if (monthlyGross >= slab.minSalary && monthlyGross <= slab.maxSalary) {
          return slab.amount;
        }
      }
    }
  }

  const defaultSlabs = DEFAULT_PT_SLABS[state];
  if (!defaultSlabs) {
    return monthlyGross > 15000 ? 200 : 0;
  }
  for (const slab of defaultSlabs) {
    if (monthlyGross >= slab.min && monthlyGross <= slab.max) {
      return slab.amount;
    }
  }
  return 200;
}

/* ═══════════════════════════════════════════════════════════════════
 * HELPER: TDS (Income Tax)
 * ═══════════════════════════════════════════════════════════════════ */

const NEW_REGIME_SLABS = [
  { min: 0, max: 300000, rate: 0 },
  { min: 300001, max: 700000, rate: 0.05 },
  { min: 700001, max: 1000000, rate: 0.1 },
  { min: 1000001, max: 1200000, rate: 0.15 },
  { min: 1200001, max: 1500000, rate: 0.2 },
  { min: 1500001, max: Infinity, rate: 0.3 },
];

const OLD_REGIME_SLABS = [
  { min: 0, max: 250000, rate: 0 },
  { min: 250001, max: 500000, rate: 0.05 },
  { min: 500001, max: 1000000, rate: 0.2 },
  { min: 1000001, max: Infinity, rate: 0.3 },
];

export function estimateTDS(
  annualCTC: number,
  regime: "oldRegime" | "newRegime" = "newRegime",
): number {
  const stdDeduction = regime === "newRegime" ? 75000 : 50000;
  const taxableIncome = Math.max(0, annualCTC - stdDeduction);

  if (taxableIncome <= 0) return 0;

  const slabs = regime === "newRegime" ? NEW_REGIME_SLABS : OLD_REGIME_SLABS;
  let annualTax = 0;
  for (const slab of slabs) {
    if (taxableIncome > slab.min) {
      const taxableInSlab = Math.min(taxableIncome, slab.max) - slab.min;
      annualTax += taxableInSlab * slab.rate;
    }
  }

  // 4% Health & Education Cess
  annualTax = annualTax * 1.04;
  return Math.round(annualTax / 12);
}

/* ═══════════════════════════════════════════════════════════════════
 * OPTIONS & MAIN CALCULATION
 * ═══════════════════════════════════════════════════════════════════ */

export interface CalculatePayslipOptions {
  bonus?: number;
  incentives?: number;
  overtimeHours?: number;
  overtimeMultiplier?: number;
  regime?: "oldRegime" | "newRegime";
  settings?: PayrollSettingsState;
}

/**
 * Calculates a single employee's payslip for a given month with full statutory & settings rules.
 */
export function calculatePayslip(
  structure: SalaryStructure,
  totalWorkingDays: number,
  lopDays: number,
  month: string,
  bonusOrOptions: number | CalculatePayslipOptions = 0,
): Payslip {
  // Normalize options
  let opts: CalculatePayslipOptions = {};
  if (typeof bonusOrOptions === "number") {
    opts = { bonus: bonusOrOptions };
  } else if (bonusOrOptions && typeof bonusOrOptions === "object") {
    opts = bonusOrOptions;
  }

  const bonus = Math.max(0, opts.bonus || 0);
  const incentives = Math.max(0, opts.incentives || 0);
  const overtimeHours = Math.max(0, opts.overtimeHours || 0);
  const overtimeMultiplier = Math.max(1, opts.overtimeMultiplier || 1.5);
  const settings = opts.settings;
  const regime = opts.regime || settings?.tdsConfig?.activeRegime || "newRegime";

  // Validate days & proration
  const safeTotalDays = Math.max(1, totalWorkingDays || 22);
  const safeLopDays = Math.max(0, Math.min(lopDays || 0, safeTotalDays));
  const payableDays = safeTotalDays - safeLopDays;
  const prorationRatio = payableDays / safeTotalDays;

  // ── Prorated Core Earnings ─────────────────────────────────────────
  const proratedBasic = Math.round((structure.basic || 0) * prorationRatio);
  const proratedHRA = Math.round((structure.hra || 0) * prorationRatio);
  const proratedAllowances = Math.round((structure.allowances || 0) * prorationRatio);

  // Overtime Calculation: hourlyRate = Basic / (workingDays * 8)
  const hourlyRate = (proratedBasic > 0 ? proratedBasic : structure.basic || 0) / (safeTotalDays * 8);
  const overtimePay = Math.round(overtimeHours * hourlyRate * overtimeMultiplier);

  // Total Gross
  const gross = proratedBasic + proratedHRA + proratedAllowances + overtimePay + bonus + incentives;

  const earnings: PayslipEarnings = {
    basic: proratedBasic,
    hra: proratedHRA,
    allowances: proratedAllowances,
    overtimePay,
    incentives,
    bonus,
    gross,
  };

  // ── Deductions ───────────────────────────────────────────────────

  // PF Calculation
  let pf = 0;
  let employerPf = 0;
  const pfEnabled = settings?.pfConfig ? settings.pfConfig.enabled : true;
  if (structure.pfApplicable && pfEnabled) {
    const pfCeiling = settings?.pfConfig?.wageCeiling
      ? parseFloat(settings.pfConfig.wageCeiling)
      : 15000;
    const pfWage = Math.min(proratedBasic, pfCeiling);

    const empRate = settings?.pfConfig?.employeeContrib
      ? parseFloat(settings.pfConfig.employeeContrib) / 100
      : 0.12;
    const emprRate = settings?.pfConfig?.employerContrib
      ? parseFloat(settings.pfConfig.employerContrib) / 100
      : 0.12;

    pf = Math.round(pfWage * empRate);
    employerPf = Math.round(pfWage * emprRate);
  }

  // ESI Calculation
  let esi = 0;
  let employerEsi = 0;
  const esiEnabled = settings?.esiConfig ? settings.esiConfig.enabled : true;
  const esiLimit = settings?.esiConfig?.salaryLimit
    ? parseFloat(settings.esiConfig.salaryLimit)
    : 21000;

  if (structure.esiApplicable && esiEnabled && gross <= esiLimit) {
    const empRate = settings?.esiConfig?.employeeContrib
      ? parseFloat(settings.esiConfig.employeeContrib) / 100
      : 0.0075;
    const emprRate = settings?.esiConfig?.employerContrib
      ? parseFloat(settings.esiConfig.employerContrib) / 100
      : 0.0325;

    esi = Math.round(gross * empRate);
    employerEsi = Math.round(gross * emprRate);
  }

  // Professional Tax
  let pt = 0;
  const ptEnabled = settings?.ptConfig ? settings.ptConfig.enabled : true;
  if (ptEnabled) {
    const customPtSlabs = settings?.ptConfig?.slabs;
    pt = getProfessionalTax(gross, structure.ptState, customPtSlabs);
  }

  // TDS Calculation
  let tds = 0;
  const tdsEnabled = settings?.tdsConfig ? settings.tdsConfig.enabled : true;
  if (tdsEnabled) {
    tds = estimateTDS(structure.ctc, regime);
  }

  const totalDeductions = pf + esi + pt + tds;

  const deductions: PayslipDeductions = {
    pf,
    esi,
    pt,
    tds,
    total: totalDeductions,
  };

  // Gratuity Accrual (Employer Liability Provision)
  const gratuityEnabled = settings?.gratuityConfig ? settings.gratuityConfig.enabled : true;
  let gratuityAccrual = 0;
  if (gratuityEnabled) {
    // Statutory Gratuity Provision Formula: (15 / 26) * (Basic / 12)
    gratuityAccrual = Math.round((15 / 26) * (proratedBasic / 12));
  }

  const employerContributions: EmployerContributions = {
    pf: employerPf,
    esi: employerEsi,
    gratuity: gratuityAccrual,
    total: employerPf + employerEsi + gratuityAccrual,
  };

  // ── Net Pay Calculation ──────────────────────────────────────────
  const netPay = Math.max(0, gross - totalDeductions);

  return {
    employeeId: structure.employeeId,
    employeeName: structure.employeeName,
    designation: structure.designation,
    department: structure.department,
    email: structure.email,
    bankAccount: structure.bankAccount,
    month,
    totalWorkingDays: safeTotalDays,
    payableDays,
    lopDays: safeLopDays,
    overtimeHours,
    earnings,
    deductions,
    employerContributions,
    bonus,
    incentives,
    overtimePay,
    regimeUsed: regime,
    netPay,
  };
}
