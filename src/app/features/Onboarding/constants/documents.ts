import type { DocumentItem } from "../types/onboarding.types";

/* ─── Default Documents Data ─── */
export const DOCUMENTS_DATA: DocumentItem[] = [
  { id: "d1", name: "Aadhar Card", status: "uploaded", uploadedBy: "Priya Sharma", date: "Apr 2" },
  { id: "d2", name: "PAN Card", status: "uploaded", uploadedBy: "Priya Sharma", date: "Apr 2" },
  { id: "d3", name: "Degree Certificate", status: "uploaded", uploadedBy: "Priya Sharma", date: "Apr 3" },
  { id: "d4", name: "Passport Photo", status: "pending" },
  { id: "d5", name: "Bank Account Details", status: "pending" },
  { id: "d6", name: "Experience Letter", status: "missing" },
  { id: "d7", name: "Medical Certificate", status: "optional" },
  { id: "d8", name: "NDA Signed Copy", status: "optional" },
];
