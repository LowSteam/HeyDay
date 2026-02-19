# 🍽️ Heyday Food Court

A modern food court website with 5 restaurants and an AI-powered chatbot using RAG backed by PostgreSQL + pgvector.

## Tech Stack
- **Frontend**: Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **Backend**: Next.js API Routes (TypeScript)
- **Database**: PostgreSQL 16 + pgvector (Docker)
- **ORM**: Prisma
- **AI**: Google Gemini (`gemini-2.0-flash` + `text-embedding-004`)

## Quick Start

### 1. Configure Environment
```bash
cp .env.example .env
# Edit .env and add your GEMINI_API_KEY from https://aistudio.google.com
```

### 2. Start PostgreSQL
```bash
npm run docker:up
```

### 3. Run Migration
```bash
npx prisma migrate dev
```

### 4. Seed Database (generates AI embeddings for all 100 menu items)
```bash
npm run seed
```

### 5. Start Dev Server
```bash
npm run dev
# Open http://localhost:3000
```

## How the AI Works
1. User asks a question → embedded with Gemini `text-embedding-004`
2. pgvector cosine similarity search finds top-8 relevant menu items
3. Results injected as context into Gemini `gemini-2.0-flash` prompt
4. AI returns a helpful conversational response
