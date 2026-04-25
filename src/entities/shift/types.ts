export type ShiftType =
  | "morning"
  | "evening"
  | "night"
  | "day_off"
  | "vacation"
  | "sick";

export type ShiftStatus = "draft" | "pending" | "approved" | "rejected";

export interface Shift {
  id: string;
  userId: string;
  userName: string;
  date: string;
  type: ShiftType;
  startTime?: string;
  endTime?: string;
  overtimeMinutes: number;
  status: ShiftStatus;
  approvedById?: string;
  rejectReason?: string;
  createdAt: string;
}
