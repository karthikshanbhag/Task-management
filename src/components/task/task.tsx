"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Trash2, Edit3 } from "lucide-react";
import { useTaskStore } from "@/store/useTaskStore";
import axios from "axios";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface TaskProps {
  task: {
    _id: string;
    title: string;
    description?: string;
    priority?: string;
    dueDate?: string;
    completed?: boolean;
  };
}

const Task = ({ task }: TaskProps) => {
  const { deleteTask, toggleTaskCompletion, updateTask } = useTaskStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || "");
  const [dueDate, setDueDate] = useState(task.dueDate ? new Date(task.dueDate).toISOString().slice(0, 10) : "");

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this task?")) {
      deleteTask(task._id);
    }
  };

  const handleComplete = () => {
    toggleTaskCompletion(task._id, !task.completed);
  };

  const handleUpdate = async () => {
    const updatedTask = { title, description, dueDate };
    await updateTask(task._id, updatedTask);
    setIsDialogOpen(false);
  };

  return (
    <>
      <Card className="bg-slate-800 text-white p-4 w-full max-w-xs rounded-2xl border-slate-500 shadow-md transition-colors hover:bg-slate-900 group relative">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              size="icon"
              variant="ghost"
              className="absolute top-2 right-2 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity hover:text-white hover:bg-slate-800"
              onClick={() => setIsDialogOpen(true)}
            >
              <Edit3 className="w-5 h-5" />
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Task</DialogTitle>
              <DialogDescription>Update the task details below:</DialogDescription>
            </DialogHeader>

            <div className="flex flex-col gap-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="dueDate">Due Date</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpdate}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <CardHeader>
          <CardTitle className="text-lg font-semibold">{task.title}</CardTitle>
          <CardDescription className="text-sm text-slate-400">
            Due: {task.dueDate ? new Date(task.dueDate).toISOString().slice(0, 10) : "N/A"}
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col gap-2">
          <p className="text-sm">{task.description || "No description provided."}</p>
          <p className="text-xs text-slate-500">
            Status: {task.completed ? "Completed" : "Pending"}
          </p>

          <div className="flex gap-2 mt-4">
            <Button
              size="sm"
              variant="outline"
              className="flex-1 text-green-400 border-green-400 hover:bg-green-600"
              onClick={handleComplete}
            >
              <CheckCircle className="w-4 h-4 mr-1" />
              {task.completed ? "Undo" : "Complete"}
            </Button>

            <Button
              size="sm"
              variant="outline"
              className="flex-1 text-red-400 border-red-400 hover:bg-red-600"
              onClick={handleDelete}
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Delete
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
};


export default Task;
