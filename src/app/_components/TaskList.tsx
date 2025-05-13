'use client';

import { useState } from "react";
import { trpc } from "../_trpc/client";
import TaskItem from "./TaskItem";
import { serverClient } from "../_trpc/serverClient";
import Toast from "./Toast";

export default function TaskList({
    initialTasks,
}: {
    initialTasks: Awaited<ReturnType<(typeof serverClient)["task"]["getAll"]>>;
}) {
    const [toast, setToast] = useState<null | { type: 'success' | 'error'; message: string }>(null);
    const utils = trpc.useUtils();

    const listAllTasks = trpc.task.getAll.useQuery(undefined,
        { initialData: initialTasks }
    );

    const deleteTask = trpc.task.delete.useMutation({
        onSuccess: () => {
            utils.task.getAll.invalidate();
            setToast({ type: 'success', message: 'Tarefa deletada com sucesso!' });
        },
        onError: (error) => {
            setToast({ type: 'error', message: `Erro ao deletar: ${error.message}` });
        },
    });

    return (
        <main className="p-4 max-w-xl mx-auto relative">

            {/* Toast popup */}
            {toast && (
                <Toast
                    type={toast.type}
                    message={toast.message}
                    onClose={() => setToast(null)}
                />
            )}


            <ul className="mt-6 space-y-2">
                {listAllTasks.data?.map((t) => (
                    <TaskItem
                        key={t.id}
                        task={t}
                        onDelete={() => {
                            deleteTask.mutate({ id: t.id });
                        }}
                    />
                ))}
            </ul>
        </main>
    );
}
