import { create } from "zustand";
import axios from "axios";
import { toast } from "sonner";

type Task = {
  _id: string;
  title: string;
  description?: string;
  priority?: string;
  dueDate?: string;
  completed?: boolean;
  createdAt?: string;
};

type TaskState = {
  tasks: Task[];
  filterByCompletion: string;
  filterByDueDate: string | null;
  fetchTasks: () => Promise<void>;
  addTask: (task: Task) => void;
  deleteTask: (taskId: string) => Promise<void>;
  toggleTaskCompletion: (taskId: string, completed: boolean) => Promise<void>;
  updateTask: (taskId: string, updatedData: Partial<Task>) => Promise<void>;
  setFilters: (completion: string, dueDate: string | null) => void;
  filteredTasks: () => Task[];
};

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  filterByCompletion: "all",
  filterByDueDate: null,

  fetchTasks: async () => {
    try {
      const response = await axios.get("/api/tasks");
      if (response.status === 200) {
        const sortedTasks = response.data.tasks.sort(
          (a: Task, b: Task) =>
            new Date(b.createdAt ?? "").getTime() -
            new Date(a.createdAt ?? "").getTime()
        );
        set({ tasks: sortedTasks });
      } else {
        toast.error(response.data?.message || "Failed to fetch tasks.");
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Error fetching tasks.");
    }
  },

  addTask: (task: Task) => {
    set((state) => ({ tasks: [task, ...state.tasks] }));
  },

  deleteTask: async (taskId: string) => {
    try {
      const response = await axios.delete(`/api/task/${taskId}`);
      if (response.status === 200) {
        set((state) => ({
          tasks: state.tasks.filter((task) => task._id !== taskId),
        }));
        toast.success("Task deleted successfully.");
      } else {
        toast.error(response.data?.message || "Failed to delete task.");
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Error deleting task.");
    }
  },

  toggleTaskCompletion: async (taskId: string, completed: boolean) => {
    try {
      const response = await axios.patch(`/api/task/${taskId}`, { completed });
      if (response.status === 200) {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task._id === taskId ? { ...task, completed } : task
          ),
        }));
        toast.success("Task status updated.");
      } else {
        toast.error(response.data?.message || "Failed to update task.");
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Error updating task.");
    }
  },

  updateTask: async (taskId: string, updatedTask: Partial<Task>) => {
    try {
      const response = await axios.put(`/api/task/${taskId}`, updatedTask);
      if (response.status === 200) {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task._id === taskId ? { ...task, ...updatedTask } : task
          ),
        }));
        toast.success("Task updated successfully.");
      } else {
        toast.error(response.data?.message || "Failed to update task.");
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Error updating task.");
    }
  },

  setFilters: (completion: string, dueDate: string | null) => {
    set({ filterByCompletion: completion, filterByDueDate: dueDate });
  },

  filteredTasks: () => {
    const { tasks, filterByCompletion, filterByDueDate } = get();

    return tasks.filter((task) => {
      if (filterByCompletion !== "all") {
        const isCompleted = filterByCompletion === "completed";
        if (task.completed !== isCompleted) return false;
      }

      if (filterByDueDate && task.dueDate) {
        const dueDate = new Date(task.dueDate).toDateString();
        if (dueDate !== new Date(filterByDueDate).toDateString()) return false;
      }

      return true;
    });
  },
}));
