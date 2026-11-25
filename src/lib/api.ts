const API_BASE_URL = "http://localhost:5000/api";

/* ---------- Types ---------- */
export interface Task {
  _id: string;
  title: string;
  description?: string;
  dueDate?: string;
  completed: boolean;
  createdAt: string;
}

/* ---------- API Calls ---------- */
export const fetchTasks = async (): Promise<Task[]> => {
  const res = await fetch(`${API_BASE_URL}/tasks`);
  if (!res.ok) throw new Error("Failed to fetch tasks");
  return res.json();
};

export const createTask = async (task: {
  title: string;
  description?: string;
  dueDate?: string;
}): Promise<Task> => {
  const res = await fetch(`${API_BASE_URL}/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(task),
  });
  if (!res.ok) throw new Error("Failed to create task");
  return res.json();
};

export const deleteTask = async (id: string): Promise<void> => {
  const res = await fetch(`${API_BASE_URL}/tasks/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete task");
};

export const updateTask = async (
  id: string,
  data: Partial<Pick<Task, "completed">>
): Promise<Task> => {
  const res = await fetch(`${API_BASE_URL}/tasks/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update task");
  return res.json();
};
