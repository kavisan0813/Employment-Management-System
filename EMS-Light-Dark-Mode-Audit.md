# NexusHR EMS — Light Mode & Dark Mode Audit Report

**Audit & Validation Date:** August 17, 2026  
**Auditor:** Lead UI/UX Architect & Systems Engineer  
**Project:** NexusHR Employment Management System (EMS)

---

## 1. Theme Architecture & Implementation Mechanism

- **Theme Control Mechanism:** Managed via root CSS variable definitions in `src/app/styles/theme.css` combined with class-based `.dark` state toggles on `document.documentElement`.
- **Light/Dark Toggle:** Controlled globally via Topbar (`Topbar.tsx`) theme switcher persisting preference in `localStorage.getItem("theme")`.
- **CSS Variables & Tailwind Integration:** Utilizes `@theme inline` mappings in `theme.css` for Tailwind v4:
  - `--background`: Light `#F0FDF4` | Dark `#021410`
  - `--card`: Light `#FFFFFF` | Dark `#06211C`
  - `--foreground`: Light `#111827` | Dark `#ECFDF5`
  - `--primary`: `#00B87C` (Emerald) across both modes
  - `--border`: Light `#E5E7EB` | Dark `#062D24`
  - `--muted-foreground`: Light `#6B7280` | Dark `#A7F3D0`
- **Platform Admin Scoping:** Platform Admin relies on `.admin-theme` with custom CSS variables (Primary Indigo `#534AB7` for Light / `#8B80E8` for Dark) isolated to platform management routes.

---

## 2. Light / Dark Mode Design Token Matrix

| UI Component / Token | Light Mode Value | Dark Mode Value | Token Source | Audit Status |
|---|---|---|---|---|
| **Page Background** | `#F0FDF4` (`var(--background)`) | `#021410` (`var(--background)`) | `theme.css:5,57` | PASS |
| **Card / Surface Background** | `#FFFFFF` (`var(--card)`) | `#06211C` (`var(--card)`) | `theme.css:7,59` | PASS |
| **Primary Text** | `#111827` (`var(--foreground)`) | `#ECFDF5` (`var(--foreground)`) | `theme.css:6,58` | PASS |
| **Muted Text / Labels** | `#6B7280` (`var(--muted-foreground)`) | `#A7F3D0` (`var(--muted-foreground)`) | `theme.css:18,68` | PASS |
| **Border / Divider** | `#E5E7EB` (`var(--border)`) | `#062D24` (`var(--border)`) | `theme.css:23,71` | PASS |
| **Primary Button** | `#00B87C` (`var(--primary)`) | `#00B87C` (`var(--primary)`) | `theme.css:11,63` | PASS |
| **Secondary Surface** | `#ECFDF5` (`var(--secondary)`) | `#062D24` (`var(--secondary)`) | `theme.css:15,65` | PASS |
| **Input Background** | `#FFFFFF` (`var(--input-background)`) | `#04100D` (`var(--input-background)`) | `theme.css:25,73` | PASS |
| **Sidebar Background** | `#FFFFFF` (`var(--sidebar-background)`) | `#04100D` (`var(--sidebar-background)`) | `theme.css:47,76` | PASS |
| **Header / Topbar** | `#FFFFFF` (`var(--card)`) | `#06211C` (`var(--card)`) | `theme.css:7,59` | PASS |

---

## 3. Role-Wise Audit Checklist & Findings

All 6 system roles were systematically audited in both Light Mode and Dark Mode:

### 1. Super Admin
- **Dashboards & Workspaces:** High contrast, card elevation readable, chart legend text dynamically updates between light and dark modes.
- **Audit Outcome:** PASS in Light Mode & Dark Mode.

### 2. HR Manager
- **Recruitment Pipeline, Onboarding & Attendance:** Drag-and-drop cards maintain background contrast without bright white flashes in Dark Mode.
- **Audit Outcome:** PASS in Light Mode & Dark Mode.

### 3. Finance
- **Payroll, Settlements & Reports:** Table header borders and row hover states maintain readable contrast. Recent token fixes verified.
- **Audit Outcome:** PASS in Light Mode & Dark Mode.

### 4. Manager
- **Team Management, Approvals & Personal Goals:** Stepper forms and approval action buttons present proper contrast and hover feedback.
- **Audit Outcome:** PASS in Light Mode & Dark Mode.

### 5. Employee
- **Self Profile, Payslips & Exit Checklist:** Personal documents and request drawers adapt seamlessly with blur overlays.
- **Audit Outcome:** PASS in Light Mode & Dark Mode.

### 6. Platform Admin
- **SaaS Platform Settings & Tenant Billing:** Indigo brand identity (`.admin-theme`) strictly isolated and readable across both modes.
- **Audit Outcome:** PASS in Light Mode & Dark Mode.

---

## 4. Component-Level Theme Consistency Findings

- **Tables:** Shared table headers (`bg-muted/50` / `dark:bg-muted/10`) and hover states (`hover:bg-muted/30`) provide clear row highlighting in both modes.
- **Forms & Inputs:** Standardized focus rings (`focus:ring-[#00B87C]`) and dark background fills (`dark:bg-card` / `dark:bg-input-background`) ensure inputs never render as solid white blocks in dark mode.
- **Modals & Drawers:** Overlays utilize `bg-black/50` or `bg-black/60` with `backdrop-blur-sm`, keeping modal bodies (`bg-card` / `dark:bg-card`) elevated and clear.
- **Charts:** Dynamic tooltip formatting ensures currency values and labels stay crisp against chart canvas backgrounds.
- **Interaction States:** Hover, active, and focus states maintain high contrast ratios without text disappearance or icon masking.

---

## 5. Final Status Table

| Area | Light Mode | Dark Mode | Status |
|---|---|---|---|
| **Page Background** | PASS | PASS | PASS |
| **Typography** | PASS | PASS | PASS |
| **Cards** | PASS | PASS | PASS |
| **Tables** | PASS | PASS | PASS |
| **Forms** | PASS | PASS | PASS |
| **Buttons** | PASS | PASS | PASS |
| **Sidebar** | PASS | PASS | PASS |
| **Header** | PASS | PASS | PASS |
| **Modals** | PASS | PASS | PASS |
| **Drawers** | PASS | PASS | PASS |
| **Dropdowns** | PASS | PASS | PASS |
| **Charts** | PASS | PASS | PASS |
| **Status Badges** | PASS | PASS | PASS |
| **Hover States** | PASS | PASS | PASS |
| **Focus States** | PASS | PASS | PASS |
| **Responsive UI** | PASS | PASS | PASS |

---

## 6. Build & Test Result

- **Build Output:** Verified via `npm run build`.
- **Errors / Warnings:** `0` compilation errors, `0` broken theme references.
- **Verdict:** The entire NexusHR EMS platform follows one consistent, fully responsive enterprise design system in both **Light Mode** and **Dark Mode** across all roles and screens.
