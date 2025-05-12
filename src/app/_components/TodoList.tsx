"use client";
import { trpc } from "../_trpc/client";

export default function TodoList() {
    //   const { data, isLoading } = trpc.example.hello.useQuery({ text: "world" });

    //   if (isLoading) return <div>Loading...</div>;

    const getTodos = trpc.getExampleList.useQuery();
    return (
        <div>
            {/* <h1>{data?.greeting}</h1> */}
            <div>{JSON.stringify(getTodos.data)}</div>
        </div>
    );
}