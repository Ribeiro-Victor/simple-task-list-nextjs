'use client';

import { useState } from "react";
import TaskCreation from "./_components/TaskCreation";
import TaskList from "./_components/TaskList";

export default function Home() {
  const [view, setView] = useState<'edit' | 'view'>('view');

  return (
    <main>
      <div className="bg-gray-100 p-4 flex gap-4 justify-center">
        <button
          onClick={() => setView('view')}
          className={`px-4 py-2 rounded ${view === 'view' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 border'}`}
        >
          Ver Tarefas
        </button>
        <button
          onClick={() => setView('edit')}
          className={`px-4 py-2 rounded ${view === 'edit' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 border'}`}
        >
          Editar Tarefas
        </button>

      </div>

      {view === 'edit' ? <TaskCreation /> : <TaskList />}
    </main>
  );
}
