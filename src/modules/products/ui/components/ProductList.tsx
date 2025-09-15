"use client";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";

interface Props {
  category?: string;
}

export const ProductList = ({ category }: Props) => {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(
    trpc.products.getMany.queryOptions({
      category,
    })
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
      {data?.docs.map((p) => (
        <div key={p.id} className="border rounded-md bg-white">
            <h2 className="text-xl font-medium">{p.name}</h2>
            <p>${p.price}</p>
        </div>
      ))}
    </div>
  );
};

export const ProductListIsLoading = () => {
  return <div>Loading...</div>;
};
