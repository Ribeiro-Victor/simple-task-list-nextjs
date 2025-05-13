import { z } from "zod";

export const taskSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  createdDate: z.string(),
});

export type Task = z.infer<typeof taskSchema>;

export const taskListSchema = z.array(taskSchema);
