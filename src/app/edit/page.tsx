import { serverClient } from "../_trpc/serverClient";
import TaskCreation from "../_components/TaskCreation";

export default async function EditPage() {
  const tasks = await serverClient.task.getAll();

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Criar/Editar Tarefas</h1>
      <TaskCreation initialTasks={tasks} />
    </main>
  );
}
