import { getEmbeddingModel } from "./gemini";

/**
 * Generate a 768-dimensional embedding vector for a given text using Gemini text-embedding-004.
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  const result = await getEmbeddingModel().embedContent(text);
  return result.embedding.values;
}

/**
 * Build the text string to embed for a menu item.
 */
export function buildEmbeddingText(item: {
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
