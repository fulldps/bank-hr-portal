import { query, queryOne } from "../../config/database";
import { AppError } from "../../middleware/errorHandler";

export async function getNotifications(userId: string) {
  const rows = await query(
    `SELECT * FROM notifications
     WHERE user_id = $1
     ORDER BY created_at DESC
     LIMIT 50`,
    [userId],
  );

  return rows.map((r) => ({
    id: r.id,
    type: r.type,
    title: r.title,
    body: r.body,
    isRead: r.is_read,
    relatedId: r.related_id,
    relatedType: r.related_type,
    createdAt: r.created_at,
  }));
}

export async function markRead(id: string, userId: string) {
  const row = await queryOne(
    `UPDATE notifications
     SET is_read = true
     WHERE id = $1 AND user_id = $2
     RETURNING *`,
    [id, userId],
  );

  if (!row) throw new AppError(404, "Уведомление не найдено", "NOT_FOUND");
  return row;
}

export async function markAllRead(userId: string) {
  await query(`UPDATE notifications SET is_read = true WHERE user_id = $1`, [
    userId,
  ]);
  return true;
}

export async function deleteNotification(id: string, userId: string) {
  const row = await queryOne(
    `DELETE FROM notifications WHERE id = $1 AND user_id = $2 RETURNING id`,
    [id, userId],
  );
  if (!row) throw new AppError(404, "Уведомление не найдено", "NOT_FOUND");
  return true;
}

export async function createNotification(data: {
  userId: string;
  type: string;
  title: string;
  body: string;
  relatedId?: string;
  relatedType?: string;
}) {
  const row = await queryOne(
    `INSERT INTO notifications (user_id, type, title, body, related_id, related_type)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [
      data.userId,
      data.type,
      data.title,
      data.body,
      data.relatedId ?? null,
      data.relatedType ?? null,
    ],
  );
  return row;
}

export async function getUnreadCount(userId: string) {
  const row = await queryOne<{ count: string }>(
    "SELECT COUNT(*) as count FROM notifications WHERE user_id = $1 AND is_read = false",
    [userId],
  );
  return Number(row?.count ?? 0);
}
