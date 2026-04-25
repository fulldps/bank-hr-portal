import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { Task, TaskStatus } from "@/entities/task";
import { TASK_COLUMN_ORDER } from "@/entities/task";

const MOCK_TASKS: Task[] = [
  {
    id: "TSK-001",
    title: "Подготовить онбординг для нового сотрудника",
    description: "Собрать пакет документов и настроить доступы",
    status: "todo",
    priority: "high",
    assigneeName: "Алексей Иванов",
    dueDate: "2024-11-08T18:00:00Z",
    tags: ["onboarding"],
    order: 0,
    createdAt: "2024-11-01T10:00:00Z",
    updatedAt: "2024-11-01T10:00:00Z",
  },
  {
    id: "TSK-002",
    title: "Обновить шаблоны трудовых договоров",
    status: "todo",
    priority: "medium",
    assigneeName: "Мария Петрова",
    dueDate: "2024-11-15T18:00:00Z",
    tags: ["docs"],
    order: 1,
    createdAt: "2024-11-01T11:00:00Z",
    updatedAt: "2024-11-01T11:00:00Z",
  },
  {
    id: "TSK-003",
    title: "Аудит отпускных дней за Q4",
    status: "in_progress",
    priority: "critical",
    assigneeName: "Алексей Иванов",
    dueDate: "2024-11-05T18:00:00Z",
    tags: ["audit", "vacation"],
    order: 0,
    createdAt: "2024-11-01T09:00:00Z",
    updatedAt: "2024-11-02T10:00:00Z",
  },
  {
    id: "TSK-004",
    title: "Проверить расчёт зарплат за октябрь",
    status: "review",
    priority: "high",
    assigneeName: "Ольга Козлова",
    order: 0,
    createdAt: "2024-10-28T10:00:00Z",
    updatedAt: "2024-11-01T14:00:00Z",
  },
  {
    id: "TSK-005",
    title: "Собеседование с кандидатом Николаев",
    status: "done",
    priority: "medium",
    assigneeName: "Мария Петрова",
    order: 0,
    createdAt: "2024-10-25T10:00:00Z",
    updatedAt: "2024-10-31T16:00:00Z",
  },
];

export const useTaskStore = defineStore("tasks", () => {
  const tasks = ref<Task[]>(MOCK_TASKS);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const columns = computed(() =>
    TASK_COLUMN_ORDER.map((status) => ({
      id: status,
      tasks: tasks.value
        .filter((t) => t.status === status)
        .sort((a, b) => a.order - b.order),
    })),
  );

  const stats = computed(() => ({
    total: tasks.value.length,
    byStatus: TASK_COLUMN_ORDER.reduce(
      (acc, status) => {
        acc[status] = tasks.value.filter((t) => t.status === status).length;
        return acc;
      },
      {} as Record<string, number>,
    ),
    overdue: tasks.value.filter(
      (t) =>
        t.dueDate && new Date(t.dueDate) < new Date() && t.status !== "done",
    ).length,
  }));

  function moveTask(taskId: string, newStatus: TaskStatus) {
    const task = tasks.value.find((t) => t.id === taskId);
    if (!task) return;
    task.status = newStatus;
    task.updatedAt = new Date().toISOString();
  }

  function createTask(
    data: Omit<Task, "id" | "createdAt" | "updatedAt" | "order">,
  ) {
    const task: Task = {
      ...data,
      id: `TSK-${String(tasks.value.length + 1).padStart(3, "0")}`,
      order: tasks.value.filter((t) => t.status === data.status).length,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    tasks.value.push(task);
    return task;
  }

  function updateTask(taskId: string, updates: Partial<Task>) {
    const task = tasks.value.find((t) => t.id === taskId);
    if (!task) return null;
    Object.assign(task, { ...updates, updatedAt: new Date().toISOString() });
    return task;
  }

  function deleteTask(taskId: string) {
    const index = tasks.value.findIndex((t) => t.id === taskId);
    if (index === -1) return false;
    tasks.value.splice(index, 1);
    return true;
  }

  return {
    tasks,
    isLoading,
    error,
    columns,
    stats,
    moveTask,
    createTask,
    updateTask,
    deleteTask,
  };
});
