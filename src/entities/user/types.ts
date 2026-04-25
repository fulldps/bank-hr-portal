export type UserRole = "employee" | "manager" | "hr" | "admin";

export interface User {
  id: string;
  email: string;
  fullName: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  department: string;
  position: string;
  avatarUrl?: string;
  employeeId: string;
}
