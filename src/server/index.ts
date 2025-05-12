import { router } from './trpc';
import { publicProcedure } from './trpc';
import { taskRouter } from './routers/task';

export const appRouter = router({
    getExampleList: publicProcedure.query(async () => {
        return [1, 2, 3, 4];
    }),
    task: taskRouter
});

export type AppRouter = typeof appRouter;

