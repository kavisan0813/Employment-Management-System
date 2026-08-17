const fs = require('fs');

let content = fs.readFileSync('src/app/pages/hr/hr-operations/Attendance.tsx', 'utf8');

const reducerDefinition = `
type AttendanceState = {
  formEmployeeId: string;
  formDate: string;
  formStatus: string;
  formCheckIn: string;
  formCheckOut: string;
  formNotes: string;
  formErrors: Record<string, string>;
};

type AttendanceAction =
  | { type: "fieldChanged"; field: string; value: unknown }
  | { type: "openAdd"; defaultDate: string; defaultEmployeeId: string }
  | { type: "openEdit"; record: AttendanceRecord }
  | { type: "setErrors"; errors: Record<string, string> }
  | { type: "resetForm" };

function attendanceReducer(
  state: AttendanceState,
  action: AttendanceAction
): AttendanceState {
  switch (action.type) {
    case "fieldChanged":
      return { ...state, [action.field]: action.value as any };
    case "openAdd":
      return {
        formEmployeeId: action.defaultEmployeeId,
        formDate: action.defaultDate,
        formStatus: "Present",
        formCheckIn: "09:00",
        formCheckOut: "18:00",
        formNotes: "",
        formErrors: {},
      };
    case "openEdit":
      return {
        formEmployeeId: action.record.employeeId,
        formDate: convertToInputDate(action.record.date),
        formStatus: action.record.status,
        formCheckIn: action.record.checkIn && action.record.checkIn !== "--:--" ? to24Hour(action.record.checkIn) : "09:00",
        formCheckOut: action.record.checkOut && action.record.checkOut !== "--:--" ? to24Hour(action.record.checkOut) : "18:00",
        formNotes: action.record.notes || "",
        formErrors: {},
      };
    case "setErrors":
      return { ...state, formErrors: action.errors };
    case "resetForm":
      return {
        formEmployeeId: "",
        formDate: "",
        formStatus: "Present",
        formCheckIn: "09:00",
        formCheckOut: "18:00",
        formNotes: "",
        formErrors: {},
      };
    default:
      return state;
  }
}

function AdminAttendance() {`;

content = content.replace('function AdminAttendance() {', reducerDefinition);

if (!content.includes('useReducer')) {
  content = content.replace('import { useState, useMemo, useEffect, useRef } from "react";', 'import { useState, useMemo, useEffect, useRef, useReducer } from "react";');
}

const useStateCalls = `  // Form State
  const [formEmployeeId, setFormEmployeeId] = useState("");
  const [formDate, setFormDate] = useState("");
  const [formStatus, setFormStatus] = useState("Present");
  const [formCheckIn, setFormCheckIn] = useState("09:00");
  const [formCheckOut, setFormCheckOut] = useState("18:00");
  const [formNotes, setFormNotes] = useState("");
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});`;

const useReducerCall = `  // Form State (managed by reducer to avoid many separate setStates)
  const [formState, dispatch] = useReducer(attendanceReducer, {
    formEmployeeId: "",
    formDate: "",
    formStatus: "Present",
    formCheckIn: "09:00",
    formCheckOut: "18:00",
    formNotes: "",
    formErrors: {},
  });
  const { formEmployeeId, formDate, formStatus, formCheckIn, formCheckOut, formNotes, formErrors } = formState;`;

content = content.replace(useStateCalls, useReducerCall);

const oldHandleOpenAdd = `  const handleOpenAdd = () => {
    setFormEmployeeId(
      selectedEmpId !== "All Employees"
        ? selectedEmpId
        : employees[0]?.id || "",
    );
    const formattedDate = \`\${selectedYear}-\${(selectedMonth + 1).toString().padStart(2, "0")}-01\`;
    setFormDate(formattedDate);
    setFormStatus("Present");
    setFormCheckIn("09:00");
    setFormCheckOut("18:00");
    setFormNotes("");
    setFormErrors({});
    setShowAddModal(true);
  };`;

const newHandleOpenAdd = `  const handleOpenAdd = () => {
    const defaultEmployeeId =
      selectedEmpId !== "All Employees"
        ? selectedEmpId
        : employees[0]?.id || "";
    const formattedDate = \`\${selectedYear}-\${(selectedMonth + 1).toString().padStart(2, "0")}-01\`;
    dispatch({ type: "openAdd", defaultDate: formattedDate, defaultEmployeeId });
    setShowAddModal(true);
  };`;

// normalize newlines for Windows
content = content.split('\\r\\n').join('\\n');

content = content.replace(oldHandleOpenAdd, newHandleOpenAdd);

const oldHandleOpenEdit = `  const handleOpenEdit = (rec: AttendanceRecord) => {
    setFormEmployeeId(rec.employeeId);
    setFormDate(convertToInputDate(rec.date));
    setFormStatus(rec.status);
    setFormCheckIn(
      rec.checkIn && rec.checkIn !== "--:--" ? to24Hour(rec.checkIn) : "09:00",
    );
    setFormCheckOut(
      rec.checkOut && rec.checkOut !== "--:--"
        ? to24Hour(rec.checkOut)
        : "18:00",
    );
    setFormNotes(rec.notes || "");
    setFormErrors({});
    setEditRecord(rec);
  };`;

const newHandleOpenEdit = `  const handleOpenEdit = (rec: AttendanceRecord) => {
    dispatch({ type: "openEdit", record: rec });
    setEditRecord(rec);
  };`;

content = content.replace(oldHandleOpenEdit, newHandleOpenEdit);

// Convert single calls with better regex to handle any parenthesis depth inside
content = content.replace(/setFormErrors\(([^;]+)\);/g, 'dispatch({ type: "setErrors", errors: $1 });');

content = content.replace(/setFormEmployeeId\(([^;]+)\)/g, 'dispatch({ type: "fieldChanged", field: "formEmployeeId", value: $1 })');
content = content.replace(/setFormDate\(([^;]+)\)/g, 'dispatch({ type: "fieldChanged", field: "formDate", value: $1 })');
content = content.replace(/setFormStatus\(([^;]+)\)/g, 'dispatch({ type: "fieldChanged", field: "formStatus", value: $1 })');
content = content.replace(/setFormCheckIn\(([^;]+)\)/g, 'dispatch({ type: "fieldChanged", field: "formCheckIn", value: $1 })');
content = content.replace(/setFormCheckOut\(([^;]+)\)/g, 'dispatch({ type: "fieldChanged", field: "formCheckOut", value: $1 })');
content = content.replace(/setFormNotes\(([^;]+)\)/g, 'dispatch({ type: "fieldChanged", field: "formNotes", value: $1 })');

// Ensure Windows newlines are restored if needed, but modern Node.js writeFileSync handles \n perfectly well
fs.writeFileSync('src/app/pages/hr/hr-operations/Attendance.tsx', content);
console.log("Refactoring complete");
