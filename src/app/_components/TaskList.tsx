'use client';

import { useRef, useEffect, useState } from "react";
import { trpc } from "../_trpc/client";
import TaskItem from "./TaskItem";
import { serverClient } from "../_trpc/serverClient";
import Toast from "./Toast";

export default function TaskList({
  initialTasks,
}: {
    initialTasks: Awaited<ReturnType<(typeof serverClient)["task"]["getAll"]>>["items"];
}) {
  const [toast, setToast] = useState<null | { type: 'success' | 'error'; message: string }>(null);
  const utils = trpc.useUtils();
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const taskQuery = trpc.task.getAll.useInfiniteQuery(
    { limit: 5 },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      initialData: {
        pages: [{ items: initialTasks, nextCursor: undefined }],
        pageParams: [undefined],
      },
    }
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

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting && taskQuery.hasNextPage && !taskQuery.isFetchingNextPage) {
          taskQuery.fetchNextPage();
        }
      },
      { threshold: 1.0 }
    );

    const current = loadMoreRef.current;
    if (current) observer.observe(current);

    return () => {
      if (current) observer.unobserve(current);
    };
  }, [taskQuery]);

  const allTasks = taskQuery.data?.pages.flatMap((page) => page.items) ?? [];

  return (
    <main className="p-4 max-w-xl mx-auto relative">
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}

      <ul className="mt-6 space-y-2">
        {allTasks.map((t) => (
          <TaskItem
            key={t.id}
            task={t}
            onDelete={() => {
              deleteTask.mutate({ id: t.id });
            }}
          />
        ))}
      </ul>

      {/* Carregador de scroll infinito */}
      <div ref={loadMoreRef} className="h-10 flex justify-center items-center">
        {taskQuery.isFetchingNextPage && <span>Carregando mais tarefas...</span>}
      </div>
    </main>
  );
}
