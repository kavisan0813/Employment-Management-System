import os

src_file = r'd:\Employment Management System\src\app\pages\EmployeeSchedule.tsx'
finance_file = r'd:\Employment Management System\src\app\pages\FinanceSchedule.tsx'
manager_file = r'd:\Employment Management System\src\app\pages\manager\ManagerPersonalSchedule.tsx'

with open(src_file, 'r', encoding='utf-8') as f:
    content = f.read()

# Create FinanceSchedule.tsx
finance_content = content.replace('EmployeeSchedule', 'FinanceSchedule')
finance_content = finance_content.replace('Priya Sharma', 'Arjun Das')
finance_content = finance_content.replace('Engineering', 'Finance')
finance_content = finance_content.replace('Suresh Kumar', 'Rajan Kumar')
finance_content = finance_content.replace('>PS<', '>AD<')
finance_content = finance_content.replace('"PS"', '"AD"')

with open(finance_file, 'w', encoding='utf-8') as f:
    f.write(finance_content)

# Create ManagerPersonalSchedule.tsx
manager_content = content.replace('EmployeeSchedule', 'ManagerPersonalSchedule')
manager_content = manager_content.replace('Priya Sharma', 'Suresh Iyer')
manager_content = manager_content.replace('Engineering', 'Management')
manager_content = manager_content.replace('Suresh Kumar', 'Ryan Park')
manager_content = manager_content.replace('>PS<', '>SI<')
manager_content = manager_content.replace('"PS"', '"SI"')

with open(manager_file, 'w', encoding='utf-8') as f:
    f.write(manager_content)
