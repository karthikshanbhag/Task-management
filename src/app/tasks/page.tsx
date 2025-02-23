"use client";

import { useEffect, useState } from "react";

import Task from "@/components/task/task";
import { Loader } from "lucide-react";
import { CreateTaskModal } from "@/components/modals/create-task-modal";
import { useTaskStore } from "@/store/useTaskStore";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";

const Tasks = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const { filteredTasks, fetchTasks, setFilters, filterByCompletion, filterByDueDate } = useTaskStore();

  useEffect(() => {
    fetchTasks();
    setLoading(false);
  }, []);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value ? e.target.value : null;
    setFilters(filterByCompletion, date);
  };

  return (
    <div className="bg-slate-700 p-4 min-h-screen overflow-y-auto flex flex-col items-center justify-center">
      <div className="flex gap-4 mb-4">
        <Select
          onValueChange={(value) => setFilters(value, filterByDueDate)}
          value={filterByCompletion}
        >
          <SelectTrigger className="w-[180px] rounded-md bg-slate-700 border-slate-800 border-2">
            <SelectValue placeholder="Filter by Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
          </SelectContent>
        </Select>

        <input
          type="date"
          className="p-1 rounded-md bg-slate-700 border-slate-800 border-2"
          onChange={handleDateChange}
          value={filterByDueDate ?? ""}
        />
      </div>

      {loading ? (
        <div className="text-white flex items-center justify-center">
          <Loader className="w-10 h-10 animate-spin" />
        </div>
      ) : filteredTasks().length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredTasks().map((task) => (
            <Task key={task._id} task={task} />
          ))}
        </div>
      ) : (
        <div className="text-white text-2xl flex flex-col gap-y-2">
          No tasks found! <CreateTaskModal />
        </div>
      )}
    </div>
  );
};

export default Tasks;
