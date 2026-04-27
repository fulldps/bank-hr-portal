import { query, queryOne } from "../../config/database";

export async function getKpi() {
  const stats = await queryOne(`
    SELECT
      COUNT(*) FILTER (WHERE status != 'done') as open,
      COUNT(*) FILTER (WHERE status = 'done') as resolved,
      COUNT(*) as total,
      COUNT(*) FILTER (
        WHERE due_date < NOW() AND status != 'done'
      ) as overdue
    FROM tickets
  `);

  const taskStats = await queryOne(`
    SELECT
      COUNT(*) as total,
      COUNT(*) FILTER (
        WHERE due_date < NOW() AND status != 'done'
      ) as overdue
    FROM tasks
  `);

  const slaStats = await queryOne(`
    SELECT
      COUNT(*) as total,
      COUNT(*) FILTER (
        WHERE due_date IS NULL OR due_date >= NOW()
      ) as compliant
    FROM tickets
  `);

  const avgTime = await queryOne(`
    SELECT
      COALESCE(
        AVG(
          EXTRACT(EPOCH FROM (updated_at - created_at)) / 3600
        ),
        0
      ) as avg_hours
    FROM tickets
    WHERE status = 'done'
  `);

  const total = Number(slaStats?.total ?? 0);
  const compliant = Number(slaStats?.compliant ?? 0);

  return {
    ticketsTotal: Number(stats?.total ?? 0),
    ticketsOpen: Number(stats?.open ?? 0),
    ticketsResolved: Number(stats?.resolved ?? 0),
    ticketsOverdue: Number(stats?.overdue ?? 0),
    tasksTotal: Number(taskStats?.total ?? 0),
    tasksOverdue: Number(taskStats?.overdue ?? 0),
    avgResolutionHours: Math.round(Number(avgTime?.avg_hours ?? 0)),
    slaCompliancePercent:
      total > 0 ? Math.round((compliant / total) * 100) : 100,
  };
}

export async function getWeeklyTrend() {
  const rows = await query(`
    SELECT
      DATE(created_at) as date,
      COUNT(*) as tickets,
      COUNT(*) FILTER (WHERE status = 'done') as resolved
    FROM tickets
    WHERE created_at >= NOW() - INTERVAL '7 days'
    GROUP BY DATE(created_at)
    ORDER BY date ASC
  `);

  return rows.map((r) => ({
    date: new Date(r.date).toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
    }),
    tickets: Number(r.tickets),
    resolved: Number(r.resolved),
  }));
}

export async function getPriorityStats() {
  const rows = await query(`
    SELECT priority, COUNT(*) as count
    FROM tickets
    GROUP BY priority
  `);

  const result: Record<string, number> = {
    critical: 0,
    high: 0,
    medium: 0,
    low: 0,
  };

  rows.forEach((r) => {
    result[r.priority] = Number(r.count);
  });

  return result;
}

export async function getDepartmentStats() {
  const rows = await query(`
    SELECT
      u.department as name,
      COUNT(*) FILTER (WHERE t.status != 'done') as open,
      COUNT(*) FILTER (WHERE t.status = 'done') as closed,
      ROUND(
        COUNT(*) FILTER (WHERE t.due_date IS NULL OR t.due_date >= NOW())::numeric
        / NULLIF(COUNT(*), 0) * 100
      ) as sla_percent
    FROM tickets t
    JOIN users u ON t.author_id = u.id
    WHERE u.department IS NOT NULL
    GROUP BY u.department
    ORDER BY u.department ASC
  `);

  return rows.map((r) => ({
    name: r.name,
    open: Number(r.open),
    closed: Number(r.closed),
    slaPercent: Number(r.sla_percent ?? 100),
  }));
}
