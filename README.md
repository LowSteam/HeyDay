# 🍽️ Heyday Food Court

A modern food court website with 5 restaurants and an AI-powered chatbot. Ask natural language questions like *"What's vegetarian under $15?"* or *"Spicy dishes?"* and get instant AI responses backed by semantic search.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js (App Router) + TypeScript + Tailwind CSS |
| Backend | Next.js API Routes (no separate server) |
| Database | PostgreSQL 16 + pgvector extension |
| ORM | Prisma |
| AI — Embeddings | Google Gemini `gemini-embedding-001` (3072 dimensions) |
| AI — Chat | Google Gemini `gemini-2.5-flash` |
| Infrastructure | Docker + Docker Compose |

---

## Option A — Full Docker (Recommended)

Runs the entire stack (database + app) in containers. Just needs Docker installed — no Node.js required on the host.

### Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- A free [Google AI Studio](https://aistudio.google.com) API key

### Steps

```bash
# 1. Clone the repo
git clone https://github.com/LowSteam/HeyDay.git
cd HeyDay

# 2. Add your Gemini API key
echo "GEMINI_API_KEY=your_key_here" > .env

# 3. Build and start everything (postgres + Next.js app)
docker compose up --build

# 4. In a separate terminal: apply DB schema
docker exec heyday_app npx prisma migrate deploy

# 5. Seed the database (inserts 100 menu items + generates AI embeddings)
#    Takes ~3-5 minutes due to Gemini API rate limits
DATABASE_URL=postgresql://heyday:heyday_secret@localhost:5432/heyday_db?schema=public \
GEMINI_API_KEY=your_key_here \
npx tsx scripts/seed.ts

# 6. Open the site
open http://localhost:3000
```

> **Note:** The seed script only needs to run once. Data persists in the `postgres_data` Docker volume across restarts.

---

## Option B — Local Dev (Node.js + Docker DB only)

Runs only PostgreSQL in Docker; Next.js runs locally with hot reload.

### Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- Node.js 18+
- A free [Google AI Studio](https://aistudio.google.com) API key

### Steps

```bash
# 1. Clone and install dependencies
git clone https://github.com/LowSteam/HeyDay.git
cd HeyDay
npm install

# 2. Configure environment
cp .env.example .env
# Edit .env — set GEMINI_API_KEY to your key from https://aistudio.google.com

# 3. Start PostgreSQL
npm run docker:up

# 4. Apply database schema
npx prisma migrate deploy

# 5. Seed the database (inserts 100 menu items + generates AI embeddings)
npm run seed

# 6. Start the dev server
npm run dev
# Open http://localhost:3000
```

---

## How the AI Works (RAG)

**RAG = Retrieval-Augmented Generation** — the AI only answers from real menu data, not from general knowledge.

```
User asks: "What's vegetarian under $15?"
         ↓
1. EMBED  — Gemini converts the question into a 3072-dim vector
         ↓
2. SEARCH — pgvector finds the 8 most semantically similar menu items
            using cosine similarity (the <=> operator)
         ↓
3. INJECT — Top results are formatted and injected into the AI prompt as context
         ↓
4. GENERATE — Gemini reads the real menu data and writes a helpful response
         ↓
"Here are vegetarian options under $15: Palak Paneer ($14.99)..."
```

---

## Restaurants

| Emoji | Name | Cuisine |
|---|---|---|
| 🍔 | The All-American Grill | American |
| 🌸 | Sakura Garden | Asian (Japanese, Thai, Korean) |
| 🌶️ | Spice Route | Indian |
| 🍝 | Trattoria Roma | Italian |
| 🌮 | El Rancho | Mexican |

Each restaurant has 20 menu items with detailed descriptions, ingredients, dietary tags, and AI embeddings.

---

## Useful Commands

```bash
npm run dev          # Start dev server (hot reload)
npm run build        # Production build
npm run seed         # Seed DB + generate AI embeddings
npm run docker:up    # Start PostgreSQL container
npm run docker:down  # Stop PostgreSQL container
npm run db:studio    # Open Prisma Studio (visual DB browser)
npm run db:migrate   # Create a new DB migration
```

---

## Environment Variables

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `GEMINI_API_KEY` | Google AI Studio API key — get one free at [aistudio.google.com](https://aistudio.google.com) |

See `.env.example` for the format.

