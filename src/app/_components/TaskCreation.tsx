'use client';

import { trpc } from "../_trpc/client";
import { useEffect, useRef, useState } from 'react';
import TaskItem from "./TaskItem";
import { Task } from "@/shared/taskSchema";
import Toast from "./Toast";

export default function TaskCreation({
  initialTasks,
}: {
  initialTasks: Task[];
}) {
  const [toast, setToast] = useState<null | { type: 'success' | 'error'; message: string }>(null);
  const utils = trpc.useUtils();
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const titleInputRef = useRef<HTMLInputElement>(null);

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

  const createTask = trpc.task.create.useMutation({
    onSuccess: () => {
      setToast({ type: 'success', message: 'Tarefa criada com sucesso!' });
    },
    onError: (error) => {
      setToast({ type: 'error', message: `Erro ao criar tarefa: ${error.message}` });
    },
    onSettled: () => {
      utils.task.getAll.invalidate();
      resetForm();
    },
  });

  const updateTask = trpc.task.update.useMutation({
    onSuccess: () => {
      setToast({ type: 'success', message: 'Tarefa atualizada com sucesso!' });
    },
    onError: (error) => {
      setToast({ type: 'error', message: `Erro ao atualizar tarefa: ${error.message}` });
    },
    onSettled: () => {
      utils.task.getAll.invalidate();
      resetForm();
    },
  });

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setEditingTaskId(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingTaskId) {
      updateTask.mutate({ id: editingTaskId, title, description });
    } else {
      createTask.mutate({ title, description });
    }
  };

  // Scroll infinito
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

  useEffect(() => {
    if (editingTaskId && titleInputRef.current) {
      titleInputRef.current.focus();
    }
  }, [editingTaskId]);

  const allTasks = taskQuery.data?.pages.flatMap((page) => page.items) ?? [];

  return (
    <main className="p-4 max-w-xl mx-auto">
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
      <form onSubmit={handleSubmit} className="space-y-2">
        <input
          ref={titleInputRef}
          placeholder="Título"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 w-full"
          required
        />
        <textarea
          placeholder="Descrição"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border p-2 w-full"
        />
        <div className="flex justify-between">
          <button
            type="button"
            onClick={resetForm}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            {editingTaskId ? 'Cancelar' : 'Limpar'}
          </button>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            {editingTaskId ? 'Alterar' : 'Criar'}
          </button>
        </div>
      </form>

      <ul className="mt-6 space-y-2">
        {allTasks.map((t) => (
          <TaskItem
            key={t.id}
            task={t}
            onEdit={() => {
              setTitle(t.title);
              setDescription(t.description || '');
              setEditingTaskId(t.id);
            }}
          />
        ))}
      </ul>

      <div ref={loadMoreRef} className="h-10 flex justify-center items-center">
        {taskQuery.isFetchingNextPage && <span>Carregando mais tarefas...</span>}
      </div>
    </main>
  );
}
