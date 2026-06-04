import codecs

def process_file(src, dst, old_name, new_name, fix_imports=False):
    content = codecs.open(src, 'r', 'utf-8').read()
    content = content.replace(old_name, new_name)
    if fix_imports:
        content = content.replace('from "../', 'from "../../')
    codecs.open(dst, 'w', 'utf-8').write(content)

# Manager
process_file('src/app/pages/FinanceLeaves.tsx', 'src/app/pages/manager/ManagerPersonalLeaves.tsx', 'FinanceLeaves', 'ManagerPersonalLeaves', True)
process_file('src/app/pages/EmployeeExpenses.tsx', 'src/app/pages/manager/ManagerPersonalExpenses.tsx', 'EmployeeExpenses', 'ManagerPersonalExpenses', True)

# Finance
process_file('src/app/pages/EmployeeExpenses.tsx', 'src/app/pages/FinanceMyExpenses.tsx', 'EmployeeExpenses', 'FinanceMyExpenses', False)
