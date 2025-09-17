"use client";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useProductFilters } from "../../hooks/useProductFilters";
import { ProductCard } from "./ProductCard";

interface Props {
  category?: string;
}

export const ProductList = ({ category }: Props) => {
  const trpc = useTRPC();
  const [filters] = useProductFilters()
  const { data } = useSuspenseQuery(
    trpc.products.getMany.queryOptions({
      category,
      ...filters
    })
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
      {data?.docs.map((p) => (
        <ProductCard 
        key={p.id}
        id={p.id}
        name={p.name}
        imageUrl={p.image?.url}
        authorUsername="rena"
        authorImageUrl={undefined}
        reviewRating={3}
        reviewCount={5}
        price={p.price}
        />
      ))}
    </div>
  );
};

export const ProductListIsLoading = () => {
  return <div>Loading...</div>;
};
