import codecs

files_to_fix_filter_select = [
    'src/app/pages/FinanceExpenses.tsx',
    'src/app/pages/FinanceIncrement.tsx',
    'src/app/pages/FinancePayroll.tsx',
    'src/app/pages/FinanceReports.tsx',
    'src/app/pages/AuditLogs.tsx',
    'src/app/pages/FinanceAuditLogs.tsx',
    'src/app/pages/FinanceEmployees.tsx',
    'src/app/pages/HRAuditLogs.tsx'
]

for f in files_to_fix_filter_select:
    try:
        content = codecs.open(f, 'r', 'utf-8').read()
        content = content.replace('onClick={() => { setSelected(opt); setIsOpen(false); }}', 'onMouseDown={(e) => { e.preventDefault(); setSelected(opt); setIsOpen(false); }}')
        codecs.open(f, 'w', 'utf-8').write(content)
    except Exception as e:
        pass

files_to_fix_select = [
    'src/app/pages/EmployeeExpenses.tsx',
    'src/app/pages/FinanceMyExpenses.tsx',
    'src/app/pages/manager/ManagerPersonalExpenses.tsx'
]

for f in files_to_fix_select:
    try:
        content = codecs.open(f, 'r', 'utf-8').read()
        content = content.replace('appearance-none ', '')
        content = content.replace(' appearance-none', '')
        codecs.open(f, 'w', 'utf-8').write(content)
    except Exception as e:
        pass

print("Done")
