'use client'

import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";

export default function Home() {
  const trpc = useTRPC()
  const categories = useQuery(trpc.categories.getMany.queryOptions())
   
  return (
    <div className="p-4">
      home
    </div>
  );
}
