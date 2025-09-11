import { Category } from "@/payload-types";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import type { Where } from "payload";
import z from "zod";

export const productsRouter = createTRPCRouter({
  getMany: baseProcedure
    .input(
      z.object({
        category: z.string().nullable().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const where: Where = {};

      if (input.category) {
        const categoriesData = await ctx.db.find({
          collection: "categories",
          limit: 1,
          depth: 1, //populate subcategories
          pagination: false,
          where: {
            slug: {
              equals: input.category,
            },
          },
        });

        const formattedData = categoriesData.docs.map((doc) => ({
          ...doc,
          subcategories: (doc.subcategories?.docs ?? []).map((d) => ({
            //because of 'depth: 1' we are confident that doc will be a type of "Category"
            ...(d as Category),
            subcategories: undefined,
          })),
        }));

        const subcategories = []
        const parentCategory = formattedData[0];

        if (parentCategory) {
          subcategories.push(
            ...parentCategory.subcategories.map((sub) => sub.slug)
          )
        }
        where["category.slug"] = {
          in: [parentCategory.slug, ...subcategories],
        };
      }

      const data = await ctx.db.find({
        collection: "products",
        depth: 1, //ensure img and category will populate
        where,
      });

      return data;
    }),
});
