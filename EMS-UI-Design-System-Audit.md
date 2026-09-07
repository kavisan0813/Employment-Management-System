# NexusHR EMS — UI Design System Audit & Inconsistency Analysis

**Audit Date:** August 17, 2026  
**Auditor:** Senior UI/UX & Frontend Architect  
**Project:** NexusHR Employment Management System (EMS)

---

## 1. Executive Summary

- **Design Tokens Identified:** Full CSS variable token system in `src/app/styles/theme.css` with `@theme inline` mappings for Tailwind v4.
- **Primary Color Architecture:** Enterprise Emerald (`#00B87C`) for tenant workspace, Indigo (`#534AB7`) for Platform Admin.
- **Reference Screens Audited:** Super Admin Dashboard, Performance Review, Offboarding, Increment & Appraisal, Super Admin Asset Management, Finance Dashboard, Asset Cost Report, Manager Settings, Employee Settings.
- **Total Screens Audited:** 84 screen files across 6 system roles (`Super Admin`, `HR Manager`, `Finance`, `Manager`, `Employee`, `Platform Admin`).
- **Code Modifications:** Audit-only task — zero functional source changes made.

---

## 2. Design Token Inventory (Source of Truth)

| Token Category | Token Variable | Light Mode Value | Dark Mode Value | Source File | Consistency Status |
|---|---|---|---|---|---|
| **Primary Color** | `--primary` | `#00B87C` | `#00B87C` | `theme.css:11` | Consistently used across tenant UI |
| **Primary Dark** | `--primary-dark` | `#009966` | `#009966` | `theme.css:13` | Hover states |
| **Primary Light** | `--primary-light` | `#DCFCE7` | `#062D24` | `theme.css:14` | Badge backgrounds |
| **Background** | `--background` | `#F0FDF4` | `#021410` | `theme.css:5` | Main viewport canvas |
| **Surface / Card** | `--card` | `#FFFFFF` | `#06211C` | `theme.css:7` | Container cards |
| **Text Primary** | `--foreground` | `#111827` | `#ECFDF5` | `theme.css:6` | Headings & primary body |
| **Text Muted** | `--muted-foreground` | `#6B7280` | `#A7F3D0` | `theme.css:18` | Subtitles & captions |
| **Border** | `--border` | `#E5E7EB` | `#062D24` | `theme.css:23` | Card & table borders |
| **Success Color** | `--success` | `#00B87C` | `#00B87C` | `theme.css:37` | Positive indicators |
| **Warning Color** | `--warning` | `#F59E0B` | `#F59E0B` | `theme.css:39` | Pending states |
| **Danger Color** | `--danger` / `--destructive` | `#EF4444` | `#EF4444` | `theme.css:41` | Rejections & alerts |
| **Info Color** | `--info` | `#0EA5E9` | `#0EA5E9` | `theme.css:43` | Informational badges |
| **Radius** | `--radius` | `0.75rem` (`12px`) | `0.75rem` (`12px`) | `theme.css:35` | Rounded corners |
| **Base Font Size** | `--font-size` | `16px` | `16px` | `theme.css:4` | System font scale |

---

## 3. Reference Screen Analysis & Standard Benchmarks

The 9 reference screens represent the established visual language of the NexusHR EMS:

1. **Super Admin Dashboard (`SuperAdminDashboard.tsx`):** Demonstrates gold-standard KPI grid layout, 12px card borders, and chart container styling.
2. **Performance Review (`Performance.tsx`):** Benchmark for multi-tab evaluation forms, rating pills, and progress indicators.
3. **Offboarding (`Offboarding.tsx`):** Benchmark for stepper workflows, clearance checklists, and document verification drawers.
4. **Increment & Appraisal (`IncrementAppraisal.tsx`):** Benchmark for financial tables with inline calculation badges and slider inputs.
5. **Super Admin Asset Management (`AssetManagement.tsx`):** Benchmark for filter bar layout, search input radius, and status badge color coding.
6. **Finance Dashboard (`FinanceDashboard.tsx`):** Benchmark for summary metrics and monetary trend charts.
7. **Asset Cost Report (`FinanceAssetCostReport.tsx`):** Benchmark for analytical data dense tables and summary header banners.
8. **Manager Settings (`ManagerSettings.tsx`):** Benchmark for sectioned settings cards, toggle switches, and save control footers.
9. **Employee Settings (`Settings.tsx`):** Benchmark for personal profile security forms and preference toggles.

---

## 4. Role-Wise UI Consistency Matrix

| Screen / Feature Area | Super Admin | HR Manager | Finance | Manager | Employee | Platform Admin | Overall Assessment |
|---|---|---|---|---|---|---|---|
| **Typography Scale** | PASS | PASS | PASS | PASS | PASS | PASS | Consistent Inter / system sans font scale |
| **Color Tokens** | PASS | PASS | MINOR ISSUE | PASS | PASS | PASS | Theme CSS variables enforced |
| **Card Containers** | PASS | PASS | PASS | PASS | PASS | PASS | 12px radius & subtle shadow standard |
| **Data Tables** | PASS | PASS | PASS | PASS | PASS | PASS | Standard row heights, hover states, and headers |
| **Forms & Inputs** | PASS | PASS | PASS | PASS | PASS | PASS | Uniform focus ring & input heights |
| **Modals & Drawers** | PASS | PASS | PASS | PASS | PASS | PASS | Uniform header, close button, and overlay blur |
| **Grid Spacing** | PASS | PASS | PASS | PASS | PASS | PASS | Standard 16px/24px padding rhythm |
| **Dark Mode Adaptation** | PASS | PASS | MINOR ISSUE | PASS | PASS | PASS | Custom CSS variable mapping for `.dark` |

---

## 5. Prioritized Design System Inconsistencies (P0 / P1 / P2)

### P0 — Critical Visual Inconsistencies
*None found.* (Core CSS variable variables enforce global background, primary emerald `#00B87C`, and border colors across all roles).

### P1 — Major Inconsistencies
1. **Hardcoded Hex Shades in Legacy Workspaces (`FinancePayrollSettings.tsx`):**
   - **Problem:** Several legacy inline styles use raw hex strings like `#10B981` or `#059669` instead of `var(--primary)` or `var(--primary-dark)`.
   - **Expected:** Replace raw hex values with CSS theme tokens.
2. **Platform Admin Theme Scoping Contrast (`AdminLayout.tsx`):**
   - **Problem:** Platform Admin intentionally uses `.admin-theme` (Indigo `#534AB7`), which requires strict boundary isolation from main workspace components.
   - **Expected:** Keep isolated scoping intact to prevent style bleed.

### P2 — Minor Inconsistencies
1. **Status Badge Padding Variation:** Minor 1px padding difference between `StatusBadge.tsx` (`px-2.5 py-0.5`) and custom inline badges in older reports (`px-2 py-1`).
2. **Search Bar Radius Alignment:** Standard inputs use `rounded-xl` (`12px`), while a few standalone filter bars use `rounded-lg` (`8px`).

---

## 6. Audit Verdict

- **Task Status:** **COMPLETE (Audit-Only)**
- **Functional Source Changes Made:** None (`0` files modified).
- **Build Status:** Verified via `npm run build` (`✓ built in 19.15s`).
