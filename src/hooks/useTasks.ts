import { useEffect, useState } from "react";
import { Task, TaskPriority, TaskCategory } from "@/types";

const API_URL = "http://localhost:5000/api/tasks";

/* Backend task shape */
interface BackendTask {
  _id: string;
  title: string;
  description?: string;
  date: string;
  time: string;
  priority: TaskPriority;
  category: TaskCategory;
  status: "pending" | "completed";
  createdAt: string;
}

/* Map backend → frontend */
const mapTask = (task: BackendTask): Task => ({
  id: task._id,
  title: task.title,
  description: task.description,
  date: task.date,
  time: task.time,
  priority: task.priority,
  category: task.category,
  status: task.status,
  createdAt: task.createdAt,
});

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);

  // 🔹 Load tasks from MongoDB
  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data: BackendTask[]) => {
        setTasks(data.map(mapTask));
      })
      .catch((err) => console.error("Failed to load tasks", err));
  }, []);

  // 🔹 Add task
  const addTask = async (taskData: {
    title: string;
    description?: string;
    date: string;
    time: string;
    priority: TaskPriority;
    category: TaskCategory;
  }) => {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(taskData),
    });

    if (!res.ok) {
      throw new Error("Failed to create task");
    }

    const newTask = mapTask(await res.json());
    setTasks((prev) => [newTask, ...prev]);
  };

  // 🔹 Delete task
  const deleteTask = async (id: string) => {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  // 🔹 Toggle task status (✔ frontend + backend)
  const toggleTaskStatus = async (id: string) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;

    const newStatus =
      task.status === "pending" ? "completed" : "pending";

    const res = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });

    if (!res.ok) {
      throw new Error("Failed to update task");
    }

    const updatedTask = mapTask(await res.json());
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? updatedTask : t))
    );
  };

  // 🔹 Dashboard-safe stats (NO UI change needed)
  const getTaskStats = () => {
    const total = tasks.length;
    const completed = tasks.filter(
      (t) => t.status === "completed"
    ).length;
    const pending = total - completed;

    return { total, completed, pending };
  };

  return {
    tasks,
    addTask,
    deleteTask,
    toggleTaskStatus,
    getTaskStats,
  };
}
