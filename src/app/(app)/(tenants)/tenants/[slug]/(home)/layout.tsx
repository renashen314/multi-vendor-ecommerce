import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { Footer } from "@/modules/tenants/ui/components/Footer";
import {
  Navbar,
  NavbarIsLoading,
} from "@/modules/tenants/ui/components/Navbar";
import { getQueryClient, trpc } from "@/trpc/server";
import { Suspense } from "react";

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}

const layout = async ({ children, params }: LayoutProps) => {
  const { slug } = await params;
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(
    trpc.tenants.getOne.queryOptions({
      slug,
    })
  );

  return (
    <div className="min-h-screen bg-[#F4F4F0] flex flex-col">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<NavbarIsLoading />}>
          <Navbar slug={slug} />
        </Suspense>
      </HydrationBoundary>
      <div className="flex-1">
        <div className="max-w-(--breakpoint-xl) mx-auto">{children}</div>
      </div>
      <Footer />
    </div>
  );
};

export default layout;
