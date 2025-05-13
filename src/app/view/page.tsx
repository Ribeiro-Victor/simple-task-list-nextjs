import { serverClient } from "../_trpc/serverClient";
import TaskList from "../_components/TaskList";

export default async function ViewPage() {
  const tasks = await serverClient.task.getAll();

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Listar Tarefas</h1>
      <TaskList initialTasks={tasks} />
    </main>
  );
}
