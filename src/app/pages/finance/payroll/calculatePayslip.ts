/**
 * Payroll Engine — Pure Calculation Functions
 *
 * PURE FUNCTIONS — no React, no state, no side effects, no localStorage.
 * Input: salary structure + working days + LOP → Output: payslip.
 * This file can be unit-tested independently.
 */

import type { SalaryStructure, Payslip, PayslipEarnings, PayslipDeductions } from "./payroll.types";

/* ═══════════════════════════════════════════════════════════════════
 * HELPER: Professional Tax (PT)
 *
 * Slab-based monthly PT by state.
 * Values match FinancePayrollSettings.tsx defaults for Maharashtra
 * and Karnataka. Other states default to ₹200.
 * ═══════════════════════════════════════════════════════════════════ */

const PT_SLABS: Record<string, { min: number; max: number; amount: number }[]> = {
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

/**
 * Returns monthly Professional Tax based on gross salary and state.
 *
 * @param monthlyGross - Prorated gross salary for the month
 * @param state - State code (e.g. "Maharashtra", "Karnataka")
 * @returns PT amount in INR
 */
export function getProfessionalTax(monthlyGross: number, state: string): number {
  const slabs = PT_SLABS[state];
  if (!slabs) {
    // Default: ₹200 if gross > ₹15,000, else ₹0
    return monthlyGross > 15000 ? 200 : 0;
  }
  for (const slab of slabs) {
    if (monthlyGross >= slab.min && monthlyGross <= slab.max) {
      return slab.amount;
    }
  }
  return 200; // fallback
}

/* ═══════════════════════════════════════════════════════════════════
 * HELPER: TDS (Income Tax) — Simplified Estimate
 *
 * ⚠️ SIMPLIFIED: Real TDS computation requires employee declarations
 * (80C, 80D, HRA exemption, regime choice etc.). This is a rough
 * monthly estimate using the New Tax Regime FY 2025-26 slabs applied
 * to annual CTC. Suitable for demo/prototype purposes only.
 * ═══════════════════════════════════════════════════════════════════ */

const NEW_REGIME_SLABS: { min: number; max: number; rate: number }[] = [
  { min: 0, max: 300000, rate: 0 },
  { min: 300001, max: 700000, rate: 0.05 },
  { min: 700001, max: 1000000, rate: 0.10 },
  { min: 1000001, max: 1200000, rate: 0.15 },
  { min: 1200001, max: 1500000, rate: 0.20 },
  { min: 1500001, max: Infinity, rate: 0.30 },
];

/**
 * Returns estimated monthly TDS based on annual CTC.
 *
 * Uses New Tax Regime slabs. Returns ₹0 if CTC ≤ standard deduction
 * threshold. Includes 4% Health & Education Cess.
 *
 * @param annualCTC - Annual CTC in INR
 * @returns Estimated monthly TDS in INR (rounded)
 */
export function estimateTDS(annualCTC: number): number {
  // Standard deduction of ₹75,000 (Budget 2024)
  const taxableIncome = Math.max(0, annualCTC - 75000);

  if (taxableIncome <= 0) return 0;

  let annualTax = 0;
  for (const slab of NEW_REGIME_SLABS) {
    if (taxableIncome > slab.min) {
      const taxableInSlab = Math.min(taxableIncome, slab.max) - slab.min;
      annualTax += taxableInSlab * slab.rate;
    }
  }

  // Add 4% Health & Education Cess
  annualTax = annualTax * 1.04;

  // Monthly estimate
  return Math.round(annualTax / 12);
}

/* ═══════════════════════════════════════════════════════════════════
 * MAIN: calculatePayslip — Pure Function
 *
 * Takes a salary structure and attendance data, returns a fully
 * computed payslip with earnings, statutory deductions, and net pay.
 * ═══════════════════════════════════════════════════════════════════ */

/**
 * Calculates a single employee's payslip for a given month.
 *
 * @param structure - Employee's salary structure
 * @param totalWorkingDays - Total working days in the month (e.g. 22)
 * @param lopDays - Number of Loss-of-Pay (absent) days
 * @param month - Month label (e.g. "July 2026")
 * @returns Fully computed Payslip object
 *
 * @example
 * // Employee: CTC ₹6,00,000 (Basic ₹25,000, HRA ₹10,000, Allow ₹15,000)
 * // Full attendance (22 working days, 0 LOP), PF applicable, Maharashtra
 * //
 * // Earnings: Basic=25000, HRA=10000, Allowances=15000, Gross=50000
 * // Deductions: PF=3000 (12% of 25000), ESI=0 (gross>21000), PT=200, TDS≈1517
 * // Net ≈ 50000 - 4717 = ₹45,283
 *
 * @example
 * // Employee: CTC ₹12,00,000 (Basic ₹50,000, HRA ₹20,000, Allow ₹30,000)
 * // Full attendance, PF applicable, Karnataka
 * //
 * // Earnings: Gross = 100000
 * // Deductions: PF=6000 (12% of 50000), ESI=0 (gross>21000), PT=200, TDS≈5850
 * // Net ≈ 100000 - 12050 = ₹87,950
 *
 * @example
 * // Employee: CTC ₹3,00,000 (Basic ₹12,500, HRA ₹5,000, Allow ₹7,500)
 * // 2 LOP days out of 22 working days, PF + ESI applicable, Maharashtra
 * //
 * // Proration: payableDays=20, ratio=20/22 ≈ 0.909
 * // Earnings: Basic≈11364, HRA≈4545, Allow≈6818, Gross≈22727
 * // Deductions: PF≈1364, ESI=0 (gross>21000), PT=200, TDS≈0 (CTC<3.75L)
 * // Net ≈ 22727 - 1564 = ₹21,163
 *
 * @example
 * // Employee: CTC ₹2,40,000 (Basic ₹10,000, HRA ₹4,000, Allow ₹6,000)
 * // Full attendance, PF + ESI applicable, Maharashtra
 * //
 * // Earnings: Gross = 20000
 * // Deductions: PF=1200, ESI=150 (0.75% of 20000, gross<=21000), PT=200, TDS=0
 * // Net = 20000 - 1550 = ₹18,450
 */
export function calculatePayslip(
  structure: SalaryStructure,
  totalWorkingDays: number,
  lopDays: number,
  month: string,
  bonus: number = 0,
): Payslip {
  // Validate inputs
  const safeTotalDays = Math.max(1, totalWorkingDays);
  const safeLopDays = Math.max(0, Math.min(lopDays, safeTotalDays));
  const payableDays = safeTotalDays - safeLopDays;
  const prorationRatio = payableDays / safeTotalDays;

  // ── Earnings (prorated) ──────────────────────────────────────────
  const proratedBasic = Math.round(structure.basic * prorationRatio);
  const proratedHRA = Math.round(structure.hra * prorationRatio);
  const proratedAllowances = Math.round(structure.allowances * prorationRatio);
  const gross = proratedBasic + proratedHRA + proratedAllowances + bonus;

  const earnings: PayslipEarnings = {
    basic: proratedBasic,
    hra: proratedHRA,
    allowances: proratedAllowances,
    bonus,
    gross,
  };

  // ── Deductions ───────────────────────────────────────────────────

  // PF: 12% of basic (capped at ₹15,000 wage ceiling if applicable)
  let pf = 0;
  if (structure.pfApplicable) {
    const pfWage = Math.min(proratedBasic, 15000);
    pf = Math.round(pfWage * 0.12);
  }

  // ESI: 0.75% of gross, only if gross ≤ ₹21,000
  let esi = 0;
  if (structure.esiApplicable && gross <= 21000) {
    esi = Math.round(gross * 0.0075);
  }

  // Professional Tax: state slab-based
  const pt = getProfessionalTax(gross, structure.ptState);

  // TDS: simplified estimate from annual CTC
  const tds = estimateTDS(structure.ctc);

  const totalDeductions = pf + esi + pt + tds;

  const deductions: PayslipDeductions = {
    pf,
    esi,
    pt,
    tds,
    total: totalDeductions,
  };

  // ── Net Pay ──────────────────────────────────────────────────────
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
    earnings,
    deductions,
    bonus,
    netPay,
  };
}
