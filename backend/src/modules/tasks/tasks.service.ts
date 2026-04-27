import { query, queryOne } from "../../config/database";
import { AppError } from "../../middleware/errorHandler";

export async function getTasks(filters: {
  status?: string;
  priority?: string;
  assigneeId?: string;
}) {
  let sql = `
    SELECT t.*, u.full_name as assignee_name
    FROM tasks t
    LEFT JOIN users u ON t.assignee_id = u.id
    WHERE 1=1
  `;
  const params: any[] = [];
  let i = 1;

  if (filters.status) {
    sql += ` AND t.status = $${i++}`;
    params.push(filters.status);
  }
  if (filters.priority) {
    sql += ` AND t.priority = $${i++}`;
    params.push(filters.priority);
  }
  if (filters.assigneeId) {
    sql += ` AND t.assignee_id = $${i++}`;
    params.push(filters.assigneeId);
  }

  sql += " ORDER BY t.created_at DESC";

  const rows = await query(sql, params);

  return rows.map((r) => ({
    id: r.id,
    title: r.title,
    description: r.description,
    status: r.status,
    priority: r.priority,
    tags: r.tags,
    dueDate: r.due_date,
    ticketId: r.ticket_id,
    order: r.order_index,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
    assigneeId: r.assignee_id,
    assigneeName: r.assignee_name,
  }));
}

export async function getTaskById(id: string) {
  const row = await queryOne(
    `SELECT t.*, u.full_name as assignee_name
     FROM tasks t
     LEFT JOIN users u ON t.assignee_id = u.id
     WHERE t.id = $1`,
    [id],
  );

  if (!row) throw new AppError(404, "Задача не найдена", "NOT_FOUND");

  return {
    id: row.id,
    title: row.title,
    description: row.description,
    status: row.status,
    priority: row.priority,
    tags: row.tags,
    dueDate: row.due_date,
    ticketId: row.ticket_id,
    order: row.order_index,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    assigneeId: row.assignee_id,
    assigneeName: row.assignee_name,
  };
}

export async function createTask(data: {
  title: string;
  description?: string;
  priority: string;
  status: string;
  assigneeId?: string;
  dueDate?: string;
  ticketId?: string;
  tags?: string[];
}) {
  const row = await queryOne(
    `INSERT INTO tasks
       (title, description, priority, status, assignee_id, due_date, ticket_id, tags)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING *`,
    [
      data.title,
      data.description ?? null,
      data.priority,
      data.status,
      data.assigneeId ?? null,
      data.dueDate ?? null,
      data.ticketId ?? null,
      data.tags ?? [],
    ],
  );

  return row;
}

export async function updateTask(
  id: string,
  data: Partial<{
    title: string;
    description: string;
    status: string;
    priority: string;
    assigneeId: string;
    dueDate: string;
    tags: string[];
  }>,
) {
  const fields: string[] = [];
  const params: any[] = [];
  let i = 1;

  if (data.title !== undefined) {
    fields.push(`title = $${i++}`);
    params.push(data.title);
  }
  if (data.description !== undefined) {
    fields.push(`description = $${i++}`);
    params.push(data.description);
  }
  if (data.status !== undefined) {
    fields.push(`status = $${i++}`);
    params.push(data.status);
  }
  if (data.priority !== undefined) {
    fields.push(`priority = $${i++}`);
    params.push(data.priority);
  }
  if (data.assigneeId !== undefined) {
    fields.push(`assignee_id = $${i++}`);
    params.push(data.assigneeId);
  }
  if (data.dueDate !== undefined) {
    fields.push(`due_date = $${i++}`);
    params.push(data.dueDate);
  }
  if (data.tags !== undefined) {
    fields.push(`tags = $${i++}`);
    params.push(data.tags);
  }

  fields.push(`updated_at = NOW()`);
  params.push(id);

  const row = await queryOne(
    `UPDATE tasks SET ${fields.join(", ")} WHERE id = $${i} RETURNING *`,
    params,
  );

  if (!row) throw new AppError(404, "Задача не найдена", "NOT_FOUND");
  return row;
}

export async function deleteTask(id: string) {
  const row = await queryOne("DELETE FROM tasks WHERE id = $1 RETURNING id", [
    id,
  ]);
  if (!row) throw new AppError(404, "Задача не найдена", "NOT_FOUND");
  return true;
}
