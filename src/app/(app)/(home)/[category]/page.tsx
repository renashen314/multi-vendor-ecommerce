import { Suspense } from "react";
import { ProductList, ProductListIsLoading } from "@/modules/products/ui/components/ProductList";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

interface Props {
  params: Promise<{
    category: string;
  }>;
}
const Page = async ({params}: Props) => {
  const {category} = await params;

  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(trpc.products.getMany.queryOptions({
    category
  }));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<ProductListIsLoading />}>
      <ProductList category={category}/>
      </Suspense>
    </HydrationBoundary>
  );
};
export default Page;
