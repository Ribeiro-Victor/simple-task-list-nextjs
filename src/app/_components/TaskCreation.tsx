'use client';

import { trpc } from "../_trpc/client";
import { useEffect, useRef, useState } from 'react';
import TaskItem from "./TaskItem";
import { Task } from "@/shared/taskSchema";

export default function TaskCreation({
  initialTasks,
}: {
  initialTasks: Task[];
}) {
  
  const listAllTasks = trpc.task.getAll.useQuery(undefined, { initialData: initialTasks });

  const createTask = trpc.task.create.useMutation({
    onSettled: () => {
      listAllTasks.refetch();
      resetForm();
    },
  });

  const updateTask = trpc.task.update.useMutation({
    onSettled: () => {
      listAllTasks.refetch();
      resetForm();
    },
  });

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);

  const titleInputRef = useRef<HTMLInputElement>(null);

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

  useEffect(() => {
    listAllTasks.refetch();
    if (editingTaskId && titleInputRef.current) {
      titleInputRef.current.focus();
    }
  }, [editingTaskId]);

  return (
    <main className="p-4 max-w-xl mx-auto">

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
        {listAllTasks.data?.map((t) => (
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
    </main>
  );
}