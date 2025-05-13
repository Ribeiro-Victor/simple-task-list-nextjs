import TaskCreation from "../_components/TaskCreation";
import { serverClient } from "../_trpc/serverClient";

export default async function Page() {
  const { items } = await serverClient.task.getAll({ limit: 5 });

  return <TaskCreation initialTasks={items} />;
}
