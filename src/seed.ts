import { getPayload } from "payload";
import config from "@payload-config";

import dotenv from "dotenv";
dotenv.config();

const categories = [
  {
    name: "All",
    slug: "all",
  },
  {
    name: "Business & Money",
    color: "#FFB347",
    slug: "business-money",
    subcategories: [
      { name: "Accounting", slug: "accounting" },
      {
        name: "Entrepreneurship",
        slug: "entrepreneurship",
      },
      { name: "Gigs & Side Projects", slug: "gigs-side-projects" },
      { name: "Investing", slug: "investing" },
      { name: "Management & Leadership", slug: "management-leadership" },
      {
        name: "Marketing & Sales",
        slug: "marketing-sales",
      },
      { name: "Networking, Careers & Jobs", slug: "networking-careers-jobs" },
      { name: "Personal Finance", slug: "personal-finance" },
      { name: "Real Estate", slug: "real-estate" },
    ],
  },
  {
    name: "Software Development",
    color: "#7EC8E3",
    slug: "software-development",
    subcategories: [
      { name: "Web Development", slug: "web-development" },
      { name: "Mobile Development", slug: "mobile-development" },
      { name: "Game Development", slug: "game-development" },
      { name: "Programming Languages", slug: "programming-languages" },
      { name: "DevOps", slug: "devops" },
    ],
  },
  {
    name: "Writing & Publishing",
    color: "#D8B5FF",
    slug: "writing-publishing",
    subcategories: [
      { name: "Fiction", slug: "fiction" },
      { name: "Non-Fiction", slug: "non-fiction" },
      { name: "Blogging", slug: "blogging" },
      { name: "Copywriting", slug: "copywriting" },
      { name: "Self-Publishing", slug: "self-publishing" },
    ],
  },
  {
    name: "Other",
    slug: "other",
  },
  {
    name: "Education",
    color: "#FFE066",
    slug: "education",
    subcategories: [
      { name: "Online Courses", slug: "online-courses" },
      { name: "Tutoring", slug: "tutoring" },
      { name: "Test Preparation", slug: "test-preparation" },
      { name: "Language Learning", slug: "language-learning" },
    ],
  },
  {
    name: "Self Improvement",
    color: "#96E6B3",
    slug: "self-improvement",
    subcategories: [
      { name: "Productivity", slug: "productivity" },
      { name: "Personal Development", slug: "personal-development" },
      { name: "Mindfulness", slug: "mindfulness" },
      { name: "Career Growth", slug: "career-growth" },
    ],
  },
  {
    name: "Fitness & Health",
    color: "#FF9AA2",
    slug: "fitness-health",
    subcategories: [
      { name: "Workout Plans", slug: "workout-plans" },
      { name: "Nutrition", slug: "nutrition" },
      { name: "Mental Health", slug: "mental-health" },
      { name: "Yoga", slug: "yoga" },
    ],
  },
  {
    name: "Design",
    color: "#B5B9FF",
    slug: "design",
    subcategories: [
      { name: "UI/UX", slug: "ui-ux" },
      { name: "Graphic Design", slug: "graphic-design" },
      { name: "3D Modeling", slug: "3d-modeling" },
      { name: "Typography", slug: "typography" },
    ],
  },
  {
    name: "Drawing & Painting",
    color: "#FFCAB0",
    slug: "drawing-painting",
    subcategories: [
      { name: "Watercolor", slug: "watercolor" },
      { name: "Acrylic", slug: "acrylic" },
      { name: "Oil", slug: "oil" },
      { name: "Pastel", slug: "pastel" },
      { name: "Charcoal", slug: "charcoal" },
    ],
  },
  {
    name: "Music",
    color: "#FFD700",
    slug: "music",
    subcategories: [
      { name: "Songwriting", slug: "songwriting" },
      { name: "Music Production", slug: "music-production" },
      { name: "Music Theory", slug: "music-theory" },
      { name: "Music History", slug: "music-history" },
    ],
  },
  {
    name: "Photography",
    color: "#FF6B6B",
    slug: "photography",
    subcategories: [
      { name: "Portrait", slug: "portrait" },
      { name: "Landscape", slug: "landscape" },
      { name: "Street Photography", slug: "street-photography" },
      { name: "Nature", slug: "nature" },
      { name: "Macro", slug: "macro" },
    ],
  },
];

//script
function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const seed = async () => {
  console.log("\x1b[32mStarting database seeding...\x1b[0m");

  const payload = await getPayload({ config });

  // Create admin user
  await payload.create({
    collection: "users",
    data: {
      email: "admin@demo.com",
      password: "demo",
      roles: ["super-admin"],
      username: "admin",
    },
  });

  console.log("\x1b[32m✓ Admin user created\x1b[0m");
  await delay(100)

  // // Prepare all categories data
  // console.log("Preparing categories data...");
  // const parentCategories = [];
  // const subCategories = [];

  // for (const category of categories) {
  //   parentCategories.push({
  //     name: category.name,
  //     color: category.color,
  //     slug: category.slug,
  //     parent: null,
  //   });
  // }


  // Create all parent categories in batch
  console.log(`Creating ${categories.length} categories...`);
  for (const category of categories) {
    try {
      const parentCategory = await payload.create({
        collection: "categories",
        data: {
          name: category.name,
          slug: category.slug,
          color: category.color,
          parent: null,
        },
      });

      await delay(100)

      for (const subCategories of category.subcategories || []) {
        await payload.create({
          collection: "categories",
          data: {
            name: subCategories.name,
            slug: subCategories.slug,
            parent: parentCategory.id,
          },
        });
      }

      await delay(100)

    } catch (error) {
      console.error(
        `\x1b[33mFailed to create categories: ${category.name}\x1b[0m`,
        error
      );
      throw error;
    }
  }

  console.log("\x1b[32m✓ All categories created successfully\x1b[0m");

  // // Create all subcategories in batches
  // if (subCategories.length > 0) {
  //   console.log(`Creating ${subCategories.length} subcategories`);
  //   const batchSize = 10;
  //   for (let i = 0; i < subCategories.length; i += batchSize) {
  //     const batch = subCategories.slice(i, i + batchSize);
  //     await Promise.all(
  //       batch.map(async (subcategory) => {
  //         try {
  //           return await payload.create({
  //             collection: "categories",
  //             data: {
  //               name: subcategory.name,
  //               slug: subcategory.slug,
  //               parent: subcategory.parent,
  //             },
  //           });
  //         } catch (error) {
  //           console.error(
  //             `Failed to create subcategory: ${subcategory.name}`,
  //             error
  //           );
  //           throw error;
  //         }
  //       })
  //     );
  //     console.log(`✓ Created batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(subCategories.length/batchSize)} of subcategories`);
  //   }
  // }
};

try {
  await seed();
  console.log("\x1b[32m✓ Seeding completed successfully\x1b[0m");
  process.exit(0);
} catch (error) {
  console.error("\x1b[33mFailed to seed databse:\x1b[0m", error);
  process.exit(1);
}
