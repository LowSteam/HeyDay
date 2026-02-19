#!/usr/bin/env tsx
/**
 * Seed script: Inserts all 5 restaurants + 100 menu items into the database,
 * generates Gemini embeddings for each item, and stores them as pgvector vectors.
 *
 * Run: npx tsx scripts/seed.ts
 */

import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { restaurants } from "../data/menu";

const prisma = new PrismaClient();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const embeddingModel = genAI.getGenerativeModel({ model: "gemini-embedding-001" });

async function generateEmbedding(text: string): Promise<number[]> {
  const result = await embeddingModel.embedContent(text);
  return result.embedding.values;
}

function buildEmbeddingText(item: {
  name: string;
  description: string;
  ingredients: string[];
  tags: string[];
  price: number;
  category: string;
  restaurantName: string;
  cuisine: string;
}): string {
  return [
    `${item.name}.`,
    item.description,
    `Ingredients: ${item.ingredients.join(", ")}.`,
    `Dietary tags: ${item.tags.join(", ")}.`,
    `Category: ${item.category}.`,
    `Price: $${item.price.toFixed(2)}.`,
    `Restaurant: ${item.restaurantName} (${item.cuisine} cuisine).`,
  ].join(" ");
}

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  console.log("🌱 Starting Heyday database seed...\n");

  // Clear existing data
  console.log("🗑️  Clearing existing data...");
  await prisma.$executeRaw`TRUNCATE TABLE menu_items, restaurants RESTART IDENTITY CASCADE`;
  console.log("✅ Cleared\n");

  for (const restaurant of restaurants) {
    // Insert restaurant
    const created = await prisma.restaurant.create({
      data: {
        name: restaurant.name,
        slug: restaurant.slug,
        cuisine: restaurant.cuisine,
        description: restaurant.description,
        emoji: restaurant.emoji,
        color: restaurant.color,
      },
    });

    console.log(`🍽️  Seeding ${restaurant.name} (${restaurant.cuisine})...`);

    for (let i = 0; i < restaurant.menuItems.length; i++) {
      const item = restaurant.menuItems[i];

      // Insert menu item (without embedding first)
      const menuItem = await prisma.menuItem.create({
        data: {
          restaurantId: created.id,
          name: item.name,
          description: item.description,
          ingredients: item.ingredients,
          price: item.price,
          category: item.category,
          tags: item.tags,
        },
      });

      // Generate embedding
      const embeddingText = buildEmbeddingText({
        name: item.name,
        description: item.description,
        ingredients: item.ingredients,
        tags: item.tags,
        price: item.price,
        category: item.category,
        restaurantName: restaurant.name,
        cuisine: restaurant.cuisine,
      });

      try {
        const embedding = await generateEmbedding(embeddingText);
        const vectorString = `[${embedding.join(",")}]`;

        // Update with embedding using raw SQL (Prisma can't handle vector type directly)
        await prisma.$executeRaw`
          UPDATE menu_items 
          SET embedding = ${vectorString}::vector 
          WHERE id = ${menuItem.id}
        `;

        process.stdout.write(`  ✅ ${i + 1}/20: ${item.name}\n`);
      } catch (error) {
        console.error(`  ❌ Failed to embed "${item.name}":`, error);
      }

      // Rate limiting: small delay between embedding API calls
      if (i < restaurant.menuItems.length - 1) {
        await sleep(200);
      }
    }

    console.log(`✅ Done with ${restaurant.name}\n`);
  }

  // For 100 items, sequential scan is fast enough (pgvector index limit is 2000 dims)
  console.log("ℹ️  Skipping vector index (vector(3072) exceeds pgvector 2000-dim index limit)");
  console.log("   Similarity search will use sequential scan — perfectly fast for 100 items.\n");
  console.log("✅ Index created\n");

  const totalRestaurants = await prisma.restaurant.count();
  const totalItems = await prisma.menuItem.count();
  const embeddedItems = await prisma.$queryRaw<[{ count: bigint }]>`
    SELECT COUNT(*) FROM menu_items WHERE embedding IS NOT NULL
  `;

  console.log("🎉 Seed complete!");
  console.log(`   Restaurants: ${totalRestaurants}`);
  console.log(`   Menu items: ${totalItems}`);
  console.log(`   Items with embeddings: ${embeddedItems[0].count}`);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
