const fs = require('fs');

let content = fs.readFileSync('src/app/pages/hr/hr-operations/Attendance.tsx', 'utf8');

const regexMap = [
  {
    find: /const \[formEmployeeId, setFormEmployeeId\] = useState\(""\);\r?\n\s*const \[formDate, setFormDate\] = useState\(""\);\r?\n\s*const \[formStatus, setFormStatus\] = useState\("Present"\);\r?\n\s*const \[formCheckIn, setFormCheckIn\] = useState\("09:00"\);\r?\n\s*const \[formCheckOut, setFormCheckOut\] = useState\("18:00"\);\r?\n\s*const \[formNotes, setFormNotes\] = useState\(""\);\r?\n\s*const \[formErrors, setFormErrors\] = useState<Record<string, string>>\({}\);/,
    replace: `const [formState, dispatch] = useReducer(attendanceReducer, {
    formEmployeeId: "",
    formDate: "",
    formStatus: "Present",
    formCheckIn: "09:00",
    formCheckOut: "18:00",
    formNotes: "",
    formErrors: {},
  });
  const { formEmployeeId, formDate, formStatus, formCheckIn, formCheckOut, formNotes, formErrors } = formState;`
  },
  {
    find: /const handleOpenAdd = \(\) => {[\s\S]*?setShowAddModal\(true\);\r?\n\s*};/,
    replace: `const handleOpenAdd = () => {
    const defaultEmployeeId =
      selectedEmpId !== "All Employees"
        ? selectedEmpId
        : employees[0]?.id || "";
    const formattedDate = \`\${selectedYear}-\${(selectedMonth + 1).toString().padStart(2, "0")}-01\`;
    dispatch({ type: "openAdd", defaultDate: formattedDate, defaultEmployeeId });
    setShowAddModal(true);
  };`
  },
  {
    find: /const handleOpenEdit = \(rec: AttendanceRecord\) => {[\s\S]*?setEditRecord\(rec\);\r?\n\s*};/,
    replace: `const handleOpenEdit = (rec: AttendanceRecord) => {
    dispatch({ type: "openEdit", record: rec });
    setEditRecord(rec);
  };`
  },
  {
    find: /setFormErrors\(errors\)/g,
    replace: `dispatch({ type: "setErrors", errors })`
  },
  {
    find: /setFormEmployeeId\(([^)]+)\)/g,
    replace: `dispatch({ type: "fieldChanged", field: "formEmployeeId", value: $1 })`
  },
  {
    find: /setFormDate\(([^)]+)\)/g,
    replace: `dispatch({ type: "fieldChanged", field: "formDate", value: $1 })`
  },
  {
    find: /setFormStatus\(([^)]+)\)/g,
    replace: `dispatch({ type: "fieldChanged", field: "formStatus", value: $1 })`
  },
  {
    find: /setFormCheckIn\(([^)]+)\)/g,
    replace: `dispatch({ type: "fieldChanged", field: "formCheckIn", value: $1 })`
  },
  {
    find: /setFormCheckOut\(([^)]+)\)/g,
    replace: `dispatch({ type: "fieldChanged", field: "formCheckOut", value: $1 })`
  },
  {
    find: /setFormNotes\(([^)]+)\)/g,
    replace: `dispatch({ type: "fieldChanged", field: "formNotes", value: $1 })`
  }
];

// Apply each regex
regexMap.forEach(({ find, replace }) => {
  content = content.replace(find, replace);
});

// Finally replace useState to include useReducer
if (!content.includes('useReducer')) {
  content = content.replace('import { useState, useMemo, useEffect, useRef } from "react";', 'import { useState, useMemo, useEffect, useRef, useReducer } from "react";');
}

fs.writeFileSync('src/app/pages/hr/hr-operations/Attendance.tsx', content);
console.log("Refactoring complete");
