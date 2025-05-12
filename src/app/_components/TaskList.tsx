'use client';

import { useState } from "react";
import { trpc } from "../_trpc/client";
import TaskItem from "./TaskItem";

export default function TaskList() {
    const [showToast, setShowToast] = useState(false);
    const utils = trpc.useUtils();

    const listAllTasks = trpc.task.getAll.useQuery();

    const deleteTask = trpc.task.delete.useMutation({
        onSuccess: () => {
            utils.task.getAll.invalidate();
            setShowToast(true);
            setTimeout(() => setShowToast(false), 4000);
        },
    });

    return (
        <main className="p-4 max-w-xl mx-auto relative">
            <h1 className="text-2xl font-bold mb-4">Todas as Tarefas</h1>

            {/* Toast popup */}
            {showToast && (
                <div
                    className="fixed top-5 right-5 z-50 px-4 py-2 rounded shadow-lg transition-opacity duration-300"
                    style={{
                        backgroundColor: "#d4edda", 
                        color: "#155724", 
                    }}
                >
                    Tarefa deletada com sucesso!
                </div>
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
