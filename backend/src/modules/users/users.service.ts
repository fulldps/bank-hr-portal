import { query, queryOne } from "../../config/database";
import { AppError } from "../../middleware/errorHandler";

export async function getUsers(filters: {
  role?: string;
  department?: string;
}) {
  let sql = `
    SELECT id, email, full_name, first_name, last_name,
           role, department, position, employee_id, is_active, created_at
    FROM users WHERE is_active = true
  `;
  const params: any[] = [];
  let i = 1;

  if (filters.role) {
    sql += ` AND role = $${i++}`;
    params.push(filters.role);
  }
  if (filters.department) {
    sql += ` AND department = $${i++}`;
    params.push(filters.department);
  }

  sql += " ORDER BY full_name ASC";

  const rows = await query(sql, params);

  return rows.map((r) => ({
    id: r.id,
    email: r.email,
    fullName: r.full_name,
    firstName: r.first_name,
    lastName: r.last_name,
    role: r.role,
    department: r.department,
    position: r.position,
    employeeId: r.employee_id,
  }));
}

export async function getUserById(id: string) {
  const row = await queryOne(
    `SELECT id, email, full_name, first_name, last_name,
            role, department, position, employee_id
     FROM users WHERE id = $1 AND is_active = true`,
    [id],
  );

  if (!row) throw new AppError(404, "Пользователь не найден", "NOT_FOUND");

  return {
    id: row.id,
    email: row.email,
    fullName: row.full_name,
    firstName: row.first_name,
    lastName: row.last_name,
    role: row.role,
    department: row.department,
    position: row.position,
    employeeId: row.employee_id,
  };
}

export async function getDepartments() {
  const rows = await query(
    `SELECT DISTINCT department FROM users
     WHERE department IS NOT NULL
     ORDER BY department ASC`,
  );
  return rows.map((r) => r.department);
}
