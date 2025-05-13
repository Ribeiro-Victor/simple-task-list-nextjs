import TaskList from "../_components/TaskList";
import { serverClient } from "../_trpc/serverClient";

export default async function Page() {
  const { items } = await serverClient.task.getAll({ limit: 5 });

  return <TaskList initialTasks={items} />;
}
