import Link from "next/link";

export default function Nav() {
  return (
    <nav className="p-4 bg-gray-100 flex gap-4 justify-center">
      <Link href="/view" className="text-blue-600 hover:underline">Ver Tarefas</Link>
      <Link href="/edit" className="text-blue-600 hover:underline">Editar Tarefas</Link>
    </nav>
  );
}
