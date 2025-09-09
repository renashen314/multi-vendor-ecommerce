"use client";
import { useRouter } from "next/navigation";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { CategoriesGetManyOutput, CategoriesGetManyOutputSingle } from "@/modules/categories/typs";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CategoriesSidebar = ({ open, onOpenChange }: Props) => {
  const trpc = useTRPC();
  const { data } = useQuery(trpc.categories.getMany.queryOptions());

  const router = useRouter();
  const [parentCategories, setParentCategories] = useState<
    CategoriesGetManyOutput | null
  >(null);
  const [selectedCategory, setSelectedCategory] =
    useState<CategoriesGetManyOutputSingle | null>(null);

  // if we have parent categories show them, otherwise show root categories
  const currentCategories = parentCategories ?? data ?? [];

  const handleOpenChange = (open: boolean) => {
    setSelectedCategory(null);
    setParentCategories(null);
    onOpenChange(open);
  };

  const handleCategoryClick = (category: CategoriesGetManyOutputSingle) => {
    if (category.subcategories && category.subcategories.length > 0) {
      setParentCategories(category.subcategories as CategoriesGetManyOutput);
      setSelectedCategory(category);
    } else {
      //this is a leaf category, no sub
      if (parentCategories && selectedCategory) {
        // this is a sub category - navigate to /category/subcategory
        router.push(`/${selectedCategory.slug}/${category.slug}`);
      } else {
        if (category.slug === "all") {
          router.push("/");
        } else {
          router.push(`/${category.slug}`);
        }
      }
      handleOpenChange(false);
    }
  };

  const handleBackClick = () => {
    if (parentCategories) {
      setParentCategories(null);
      setSelectedCategory(null);
    }
  };

  const backgroundColor = selectedCategory?.color || "white";

  return (
    <div>
      <Sheet open={open} onOpenChange={handleOpenChange}>
        <SheetContent
          side="left"
          className="p-0 transition-none"
          style={{ backgroundColor }}
        >
          <SheetHeader className="p-4 border-b">
            <SheetTitle>Categories</SheetTitle>
          </SheetHeader>
          <ScrollArea className="flex flex-col overflow-y-auto h-full pb-2">
            {parentCategories && (
              <button
                onClick={handleBackClick}
                className="w-full text-left p-4 hover:bg-black hover:text-white flex items-center text-base font-medium cursor-pointer"
              >
                <ChevronLeftIcon className="size-4 mr-2" />
              </button>
            )}
            {currentCategories.map((category) => (
              <button
                key={category.slug}
                onClick={() => handleCategoryClick(category)}
                className="w-full text-left p-4 hover:bg-black hover:text-white flex items-center text-base font-medium cursor-pointer"
              >
                {category.name}
                {category.subcategories &&
                  category.subcategories.length > 0 && (
                    <ChevronRightIcon className="size-4" />
                  )}
              </button>
            ))}
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </div>
  );
};
