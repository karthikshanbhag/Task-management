import { connectToDatabase } from "@/lib/db";
import Task from "@/models/Task";
import { NextResponse } from "next/server";

export async function DELETE(req: Request, { params }: { params: { taskId: string } }) {
  const { taskId } = params;

  try {
    await connectToDatabase();

    const deletedTask = await Task.findByIdAndDelete(taskId);

    if (!deletedTask) {
      return NextResponse.json({ message: "Task not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Task deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting task:", error);
    return NextResponse.json({ message: "Failed to delete task" }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: { taskId: string } }) {
  const { taskId } = params;

  try {
    await connectToDatabase();

    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      { completed: true },
      { new: true }
    );

    if (!updatedTask) {
      return NextResponse.json({ message: "Task not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Task marked as completed", task: updatedTask }, { status: 200 });
  } catch (error) {
    console.error("Error completing task:", error);
    return NextResponse.json({ message: "Failed to mark task as completed" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { taskId: string } }) {
  const { taskId } = params;

  try {
    await connectToDatabase();

    const { title, description, dueDate } = await req.json();

    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      { title, description, dueDate },
      { new: true }
    );

    if (!updatedTask) {
      return NextResponse.json({ message: "Task not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Task updated successfully", task: updatedTask }, { status: 200 });
  } catch (error) {
    console.error("Error updating task:", error);
    return NextResponse.json({ message: "Failed to update task" }, { status: 500 });
  }
}
