import dotenv from "dotenv";
dotenv.config();

import bcrypt from "bcryptjs";
import { pool, query } from "../config/database";

async function seed() {
  console.log("Seeding database...");

  const passwordHash = await bcrypt.hash("123456", 12);
  const adminHash = await bcrypt.hash("admin123", 12);

  await query(
    `INSERT INTO users
       (email, password_hash, full_name, first_name, last_name, role, department, position, employee_id)
     VALUES
       ('ivanov@bnb.by', $1, 'Алексей Иванов', 'Алексей', 'Иванов', 'hr', 'HR-отдел', 'HR-специалист', 'EMP-001'),
       ('petrova@bnb.by', $1, 'Мария Петрова', 'Мария', 'Петрова', 'manager', 'HR-отдел', 'Руководитель HR', 'EMP-002'),
       ('sidorov@bnb.by', $1, 'Иван Сидоров', 'Иван', 'Сидоров', 'employee', 'IT-отдел', 'Разработчик', 'EMP-003'),
       ('admin@bnb.by', $2, 'Администратор', 'Админ', 'Системы', 'admin', 'IT-отдел', 'Системный администратор', 'EMP-004')
     ON CONFLICT (email) DO NOTHING`,
    [passwordHash, adminHash],
  );

  console.log("✅ Users seeded");

  const users = await query<{ id: string; email: string }>(
    "SELECT id, email FROM users",
  );

  const ivanov = users.find((u) => u.email === "ivanov@bnb.by")!;
  const petrova = users.find((u) => u.email === "petrova@bnb.by")!;

  await query(
    `INSERT INTO tickets
       (title, description, status, priority, author_id, assignee_id, due_date, tags)
     VALUES
       ('Не начислена зарплата за октябрь', 'Не поступили средства на карту уже 3 дня', 'in_progress', 'critical', $1, $2, NOW() - INTERVAL '2 hours', ARRAY['payroll','urgent']),
       ('Запрос справки 2-НДФЛ за 2023', 'Нужна справка для банка', 'todo', 'high', $1, $2, NOW() + INTERVAL '2 hours', ARRAY['docs']),
       ('Перенос отпуска на декабрь', 'Прошу перенести отпуск с ноября на декабрь', 'backlog', 'medium', $1, NULL, NOW() + INTERVAL '2 days', ARRAY['vacation']),
       ('Обновить данные в трудовой книжке', 'Смена должности в августе не отражена', 'done', 'low', $2, $2, NULL, ARRAY['hr_doc'])
     ON CONFLICT DO NOTHING`,
    [ivanov.id, petrova.id],
  );

  console.log("✅ Tickets seeded");

  await query(
    `INSERT INTO tasks
       (title, description, status, priority, assignee_id, due_date, tags)
     VALUES
       ('Подготовить онбординг для нового сотрудника', 'Собрать пакет документов', 'todo', 'high', $1, NOW() + INTERVAL '7 days', ARRAY['onboarding']),
       ('Аудит отпускных дней за Q4', 'Проверить все остатки отпусков', 'in_progress', 'critical', $1, NOW() + INTERVAL '2 days', ARRAY['audit']),
       ('Проверить расчёт зарплат за октябрь', NULL, 'review', 'high', $2, NULL, ARRAY['payroll']),
       ('Собеседование с кандидатом Николаев', NULL, 'done', 'medium', $2, NULL, ARRAY['recruitment'])
     ON CONFLICT DO NOTHING`,
    [ivanov.id, petrova.id],
  );

  console.log("✅ Tasks seeded");

  await pool.end();
  console.log("✅ Seeding complete");
}

seed().catch(console.error);
