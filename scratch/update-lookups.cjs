const fs = require('fs');
const content = fs.readFileSync('scratch/find-lookups.cjs', 'utf8');
const newContent = content.replace(
  "console.log(JSON.stringify(results.filter(r => r.file.includes('EmployeePortal') || r.file.includes('FinanceExpenses') || r.file.includes('EmployeeTable')), null, 2));",
  "console.log(JSON.stringify(results, null, 2));"
);
fs.writeFileSync('scratch/find-lookups.cjs', newContent);
