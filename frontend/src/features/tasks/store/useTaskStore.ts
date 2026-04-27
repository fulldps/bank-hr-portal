import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { Task, TaskStatus } from "@/entities/task";
import { TASK_COLUMN_ORDER } from "@/entities/task";
import { api } from "@/shared/api/client";

export const useTaskStore = defineStore("tasks", () => {
  const tasks = ref<Task[]>([]);
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

  async function fetchTasks(filters?: {
    status?: string;
    priority?: string;
    assigneeId?: string;
  }) {
    isLoading.value = true;
    error.value = null;
    try {
      const params = new URLSearchParams(
        filters as Record<string, string>,
      ).toString();
      const url = `/tasks${params ? `?${params}` : ""}`;
      const data = await api.get<Task[]>(url);
      tasks.value = data.map((t) => ({ ...t, order: t.order ?? 0 }));
    } catch (e: any) {
      error.value = e.message;
    } finally {
      isLoading.value = false;
    }
  }

  async function createTask(
    taskData: Omit<Task, "id" | "createdAt" | "updatedAt" | "order">,
  ) {
    try {
      const created = await api.post<Task>("/tasks", taskData);
      tasks.value.unshift({ ...created, order: 0 });
      return created;
    } catch (e: any) {
      error.value = e.message;
      throw e;
    }
  }

  async function moveTask(taskId: string, newStatus: TaskStatus) {
    const task = tasks.value.find((t) => t.id === taskId);
    if (!task) return;

    const oldStatus = task.status;
    task.status = newStatus;

    try {
      await api.patch(`/tasks/${taskId}`, { status: newStatus });
    } catch (e: any) {
      task.status = oldStatus;
      error.value = e.message;
    }
  }

  async function updateTask(taskId: string, updates: Partial<Task>) {
    try {
      const updated = await api.patch<Task>(`/tasks/${taskId}`, updates);
      const index = tasks.value.findIndex((t) => t.id === taskId);
      if (index !== -1)
        tasks.value[index] = { ...tasks.value[index], ...updated };
      return updated;
    } catch (e: any) {
      error.value = e.message;
      throw e;
    }
  }

  async function deleteTask(taskId: string) {
    try {
      await api.delete(`/tasks/${taskId}`);
      tasks.value = tasks.value.filter((t) => t.id !== taskId);
      return true;
    } catch (e: any) {
      error.value = e.message;
      throw e;
    }
  }

  return {
    tasks,
    isLoading,
    error,
    columns,
    stats,
    fetchTasks,
    createTask,
    moveTask,
    updateTask,
    deleteTask,
  };
});
