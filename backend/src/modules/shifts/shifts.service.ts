import { query, queryOne } from "../../config/database";
import { AppError } from "../../middleware/errorHandler";

export async function getShifts(filters: {
  userId?: string;
  dateFrom?: string;
  dateTo?: string;
  status?: string;
}) {
  let sql = `
    SELECT s.*, u.full_name as user_name, u.department
    FROM shifts s
    LEFT JOIN users u ON s.user_id = u.id
    WHERE 1=1
  `;
  const params: any[] = [];
  let i = 1;

  if (filters.userId) {
    sql += ` AND s.user_id = $${i++}`;
    params.push(filters.userId);
  }
  if (filters.dateFrom) {
    sql += ` AND s.date >= $${i++}`;
    params.push(filters.dateFrom);
  }
  if (filters.dateTo) {
    sql += ` AND s.date <= $${i++}`;
    params.push(filters.dateTo);
  }
  if (filters.status) {
    sql += ` AND s.status = $${i++}`;
    params.push(filters.status);
  }

  sql += " ORDER BY s.date ASC, u.full_name ASC";

  const rows = await query(sql, params);

  return rows.map((r) => ({
    id: r.id,
    userId: r.user_id,
    userName: r.user_name,
    department: r.department,
    date: r.date,
    type: r.type,
    startTime: r.start_time,
    endTime: r.end_time,
    overtimeMinutes: r.overtime_minutes,
    status: r.status,
    approvedById: r.approved_by_id,
    rejectReason: r.reject_reason,
    createdAt: r.created_at,
  }));
}

export async function createShift(data: {
  userId: string;
  date: string;
  type: string;
  startTime?: string;
  endTime?: string;
  overtimeMinutes?: number;
}) {
  const overtimeMinutes = data.overtimeMinutes ?? 0;

  const row = await queryOne(
    `INSERT INTO shifts (user_id, date, type, start_time, end_time, overtime_minutes, status)
     VALUES ($1, $2, $3, $4, $5, $6, 'pending')
     ON CONFLICT (user_id, date)
     DO UPDATE SET
       type = EXCLUDED.type,
       start_time = EXCLUDED.start_time,
       end_time = EXCLUDED.end_time,
       overtime_minutes = EXCLUDED.overtime_minutes,
       status = 'pending',
       updated_at = NOW()
     RETURNING *`,
    [
      data.userId,
      data.date,
      data.type,
      data.startTime ?? null,
      data.endTime ?? null,
      overtimeMinutes,
    ],
  );

  return row;
}

export async function approveShift(id: string, approvedById: string) {
  const row = await queryOne(
    `UPDATE shifts
     SET status = 'approved', approved_by_id = $1, updated_at = NOW()
     WHERE id = $2
     RETURNING *`,
    [approvedById, id],
  );

  if (!row) throw new AppError(404, "Смена не найдена", "NOT_FOUND");
  return row;
}

export async function rejectShift(
  id: string,
  rejectReason: string,
  rejectedById: string,
) {
  const row = await queryOne(
    `UPDATE shifts
     SET status = 'rejected', reject_reason = $1, approved_by_id = $2, updated_at = NOW()
     WHERE id = $3
     RETURNING *`,
    [rejectReason, rejectedById, id],
  );

  if (!row) throw new AppError(404, "Смена не найдена", "NOT_FOUND");
  return row;
}

export async function getOvertimeStats() {
  const rows = await query(`
    SELECT
      u.id,
      u.full_name,
      u.department,
      COALESCE(SUM(s.overtime_minutes), 0) as total_overtime
    FROM users u
    LEFT JOIN shifts s ON s.user_id = u.id
      AND s.status = 'approved'
      AND DATE_TRUNC('month', s.date) = DATE_TRUNC('month', NOW())
    GROUP BY u.id, u.full_name, u.department
    ORDER BY total_overtime DESC
  `);

  return rows.map((r) => ({
    userId: r.id,
    userName: r.full_name,
    department: r.department,
    totalOvertimeMinutes: Number(r.total_overtime),
  }));
}
