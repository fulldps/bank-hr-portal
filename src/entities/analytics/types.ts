export interface DashboardStats {
  ticketsTotal: number;
  ticketsOpen: number;
  ticketsResolved: number;
  ticketsOverdue: number;
  tasksTotal: number;
  tasksOverdue: number;
  avgResolutionHours: number;
  slaCompliancePercent: number;
}

export interface TrendPoint {
  date: string;
  tickets: number;
  resolved: number;
}

export interface PriorityStats {
  critical: number;
  high: number;
  medium: number;
  low: number;
}

export interface DepartmentStat {
  name: string;
  open: number;
  closed: number;
  slaPercent: number;
}
