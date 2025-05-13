import { z } from "zod";
import { publicProcedure, router } from "../trpc";
import { taskSchema } from "@/shared/taskSchema";

let tasks: z.infer<typeof taskSchema>[] = [];

for (let i = 1; i <= 50; i++) {
    tasks.push({
        id: i.toString(),
        title: `Mock Task ${i}`,
        description: i % 2 === 0 ? `This is mock task number ${i}.` : undefined,
        createdDate: new Date().toISOString(),
    });
}
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

    getAll: publicProcedure
        .input(
            z.object({
                cursor: z.string().optional(), // ID da última tarefa carregada
                limit: z.number().min(1).max(50).optional().default(10),
            }).optional()
        )
        .query(({ input }) => {
            const { cursor, limit = 10 } = input ?? {};
            let startIndex = 0;

            if (cursor) {
                const index = tasks.findIndex((t) => t.id === cursor);
                if (index !== -1) {
                    startIndex = index + 1;
                }
            }

            const items = tasks.slice(startIndex, startIndex + limit);
            const nextCursor = items.length === limit ? items[items.length - 1].id : undefined;

            return {
                items,
                nextCursor,
            };
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