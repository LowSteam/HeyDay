import { prisma } from "./db";
import { generateEmbedding } from "./embeddings";
import { getChatModel } from "./gemini";

export interface SearchResult {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  tags: string[];
  ingredients: string[];
  restaurantName: string;
  restaurantSlug: string;
  cuisine: string;
  similarity: number;
}

/**
 * Find the top-K most relevant menu items using pgvector cosine similarity.
 */
export async function searchMenuItems(
  query: string,
  topK: number = 8
): Promise<SearchResult[]> {
  const queryEmbedding = await generateEmbedding(query);
  const embeddingVector = `[${queryEmbedding.join(",")}]`;

  const results = await prisma.$queryRaw<SearchResult[]>`
    SELECT
      mi.id,
      mi.name,
      mi.description,
      mi.price::float AS price,
      mi.category,
      mi.tags,
      mi.ingredients,
      r.name AS "restaurantName",
      r.slug AS "restaurantSlug",
      r.cuisine,
      1 - (mi.embedding <=> ${embeddingVector}::vector) AS similarity
    FROM menu_items mi
    JOIN restaurants r ON mi."restaurantId" = r.id
    WHERE mi.embedding IS NOT NULL
    ORDER BY mi.embedding <=> ${embeddingVector}::vector
    LIMIT ${topK}
  `;

  return results;
}

/**
 * Format search results as a context block for the AI prompt.
 */
function formatContext(results: SearchResult[]): string {
  return results
    .map(
      (item, i) =>
        `${i + 1}. **${item.name}** (${item.restaurantName} — ${item.cuisine})
   Price: $${Number(item.price).toFixed(2)} | Category: ${item.category}
   Tags: ${item.tags.join(", ")}
   Description: ${item.description}
   Ingredients: ${item.ingredients.join(", ")}`
    )
    .join("\n\n");
}

const SYSTEM_PROMPT = `You are Heyday's friendly AI food guide. Heyday is a vibrant food court with 5 restaurants:
- 🍔 The All-American Grill (American comfort food)
- 🌸 Sakura Garden (Pan-Asian: Japanese, Thai, Korean, Vietnamese, Chinese)
- 🌶️ Spice Route (Indian regional cuisine)
- 🍝 Trattoria Roma (Authentic Italian)
- 🌮 El Rancho (Mexican regional cuisine)

Your job is to help guests find the perfect dishes based on their preferences, dietary needs, or cravings.
Be warm, enthusiastic, and concise. Always mention prices and restaurant names. If no items match, suggest they browse all restaurants.
Format your response in a clear, readable way. Use emojis sparingly for personality.`;

/**
 * Run the full RAG pipeline: search → format context → generate response.
 */
export async function ragChat(
  userMessage: string,
  chatHistory: Array<{ role: "user" | "model"; content: string }> = []
): Promise<string> {
  // 1. Semantic search
  const relevantItems = await searchMenuItems(userMessage, 8);

  // 2. Build context block
  const context =
    relevantItems.length > 0
      ? `Here are the most relevant menu items I found:\n\n${formatContext(relevantItems)}`
      : "No specific items matched the search, but I can still help guide the guest through all our restaurants.";

  // 3. Build conversation history for Gemini
  const history = chatHistory.map((msg) => ({
    role: msg.role,
    parts: [{ text: msg.content }],
  }));

  // 4. Build the augmented prompt
  const augmentedMessage = `${SYSTEM_PROMPT}

---
MENU CONTEXT (use this to answer the question):
${context}
---

Guest question: ${userMessage}

Please answer based on the menu context provided above.`;

  // 5. Start or continue chat with Gemini
  const chat = getChatModel().startChat({ history });
  const result = await chat.sendMessage(augmentedMessage);
  return result.response.text();
}
