import mongoose, { Schema, Document, Types } from "mongoose";

export interface ITask extends Document {
  title: string;
  description?: string;
  dueDate?: Date;
  priority?: "low" | "medium" | "high";
  completed: boolean;
  userId: Types.ObjectId;
}

const TaskSchema = new Schema<ITask>({
  title: { type: String, required: true },
  description: String,
  dueDate: Date,
  priority: { type: String, enum: ["low", "medium", "high"], default: "medium" },
  completed: { type: Boolean, default: false },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

export default mongoose.models.Task || mongoose.model<ITask>("Task", TaskSchema);
