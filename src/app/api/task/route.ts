import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import Task from "@/models/Task";
import { connectToDatabase } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const token = cookies().get("token")?.value;
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    
    const secret = process.env.JWT_SECRET as string;
    const decoded = jwt.verify(token, secret) as { userId: string };
    
    if (!decoded?.userId) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    const data = await req.json();
    const newTask = await Task.create({
      ...data,
      userId: decoded.userId,
    });

    return NextResponse.json({ message: "Task created successfully", task: newTask }, { status: 201 });
  } catch (error) {
    console.error("Error creating task:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}