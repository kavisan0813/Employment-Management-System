const fs = require('fs');

const files = [
  'src/app/admin/features/dashboard/hooks/useDashboard.ts',
  'src/app/features/Offboarding/hooks/useOffboarding.ts',
  'src/app/features/Onboarding/hooks/useOnboarding.ts',
  'src/app/pages/finance/ops/FinanceExpenses.tsx',
  'src/app/pages/finance/ops/FinanceIncrement.tsx',
  'src/app/pages/finance/ops/FinancePayroll.tsx',
  'src/app/pages/finance/ops/FinanceSettlements.tsx',
  'src/app/pages/finance/reports/FinanceReports.tsx',
  'src/app/pages/finance/workspace/FinanceLeaves.tsx',
  'src/app/pages/hr/hr-operations/Attendance.tsx',
  'src/app/pages/hr/hr-operations/Performance.tsx',
];

for (const file of files) {
  let code = fs.readFileSync(file, 'utf8');

  // We want to handle two common patterns:
  // Pattern 1:
  // const url = URL.createObjectURL(blob);
  // a.href = url;
  // a.download = ...
  // a.click();
  
  // Pattern 2:
  // a.href = URL.createObjectURL(blob);
  // a.download = ...
  // a.click();
  
  // A safe way is to regex replace a.click(); with a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 100);
  // But maybe the linter needs it without setTimeout?
  // Usually, revoking immediately after click() is fine:
  // a.click();
  // URL.revokeObjectURL(a.href);
  
  // Let's replace a.click(); with a.click(); URL.revokeObjectURL(a.href);
  // if it's not already there.
  
  if (code.includes('createObjectURL')) {
    code = code.replace(/a\.click\(\);(\s*URL\.revokeObjectURL)?/g, (match, hasRevoke) => {
      if (hasRevoke) return match;
      return 'a.click();\n    URL.revokeObjectURL(a.href);';
    });
    fs.writeFileSync(file, code, 'utf8');
    console.log('Fixed', file);
  }
}
