export type ResignationStatus = "pending_manager" | "pending_hr" | "approved" | "rejected";

export interface ResignationTimelineEvent {
  id: string;
  action: string;
  performedBy: string;
  role: string;
  date: string;
  comments?: string;
}

export interface ResignationRequest {
  id: string;
  employeeName: string;
  employeeId: string;
  department: string;
  designation: string;
  manager: string;
  joiningDate: string;
  status: ResignationStatus;
  resignationDate: string;
  lwd: string;
  noticePeriod: string;
  reason: string;
  comments: string;
  attachmentName?: string;
  timeline: ResignationTimelineEvent[];
}
