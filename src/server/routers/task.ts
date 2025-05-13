import { z } from "zod";
import { publicProcedure, router } from "../trpc";
import { taskSchema } from "@/shared/taskSchema";

let tasks: z.infer<typeof taskSchema>[] = [
    {
        id: "1",
        title: "Mock Task 1",
        description: "This is a mock task for testing.",
        createdDate: new Date().toISOString(),
    },
    {
        id: "2",
        title: "Mock Task 2",
        description: "Another mock task for testing purposes.",
        createdDate: new Date().toISOString(),
    },
    {
        id: "3",
        title: "Mock Task 3",
        createdDate: new Date().toISOString(),
    },
]
export const taskRouter = router({
    create: publicProcedure
        .input(
            z.object({
                title: z.string().min(1),
                description: z.string().optional(),
            }),
        )
        .mutation(({ input }) => {
            const newTask: z.infer<typeof taskSchema> = {
                id: crypto.randomUUID(),
                title: input.title,
                description: input.description,
                createdDate: new Date().toISOString(),
            };
            tasks.push(newTask);
            return newTask;
        }),

    getAll: publicProcedure.query(() => {
        return tasks.map((task) => ({
            ...task,
            createdDate: task.createdDate,
        }));
    }),

    update: publicProcedure
        .input(
            z.object({
                id: z.string(),
                title: z.string().min(1),
                description: z.string().optional(),
            }),
        )
        .mutation(({ input }) => {
            const task = tasks.find((t) => t.id === input.id);
            if (!task) throw new Error('Tarefa não encontrada');
            task.title = input.title;
            task.description = input.description;
            return task;
        }),

    delete: publicProcedure
        .input(z.object({ id: z.string() }))
        .mutation(({ input }) => {
            const index = tasks.findIndex((t) => t.id === input.id);
            if (index === -1) throw new Error('Tarefa não encontrada');
            const deleted = tasks.splice(index, 1)[0];
            return deleted;
        }),
});