import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { restaurants } from "@/data/menu";

// Only allow in development
export async function POST() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not available in production" }, { status: 403 });
  }

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const embeddingModel = genAI.getGenerativeModel({ model: "gemini-embedding-001" });

    function buildText(item: {
      name: string;
      description: string;
      ingredients: string[];
      tags: string[];
      price: number;
      category: string;
      restaurantName: string;
      cuisine: string;
    }) {
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

    // Clear existing data
    await prisma.$executeRaw`TRUNCATE TABLE menu_items, restaurants RESTART IDENTITY CASCADE`;

    let totalItems = 0;

    for (const restaurant of restaurants) {
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

      for (const item of restaurant.menuItems) {
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

        const text = buildText({
          ...item,
          restaurantName: restaurant.name,
          cuisine: restaurant.cuisine,
        });

        const result = await embeddingModel.embedContent(text);
        const embedding = result.embedding.values;
        const vectorString = `[${embedding.join(",")}]`;

        await prisma.$executeRaw`
          UPDATE menu_items SET embedding = ${vectorString}::vector WHERE id = ${menuItem.id}
        `;

        totalItems++;
        // Small delay to respect rate limits
        await new Promise((r) => setTimeout(r, 150));
      }
    }

    // Note: pgvector HNSW/ivfflat index max is 2000 dims; sequential scan is fine for 100 items

    return NextResponse.json({
      success: true,
      restaurants: restaurants.length,
      menuItems: totalItems,
      message: "Database seeded successfully with embeddings!",
    });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json(
      { error: "Seeding failed", details: String(error) },
      { status: 500 }
    );
  }
}
