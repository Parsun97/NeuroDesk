# NeuroDesk AI

A multi-tenant AI chatbot SaaS platform — businesses sign up, train a chatbot on their knowledge base, customize it, get embed code, and deploy it on their site.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080, proxied at /api)
- `pnpm --filter @workspace/neurodesk run dev` — run the frontend (proxied at /)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL`, `OPENAI_API_KEY`, `SESSION_SECRET`, `VITE_CLERK_PUBLISHABLE_KEY`, `VITE_CLERK_PROXY_URL`

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite, Tailwind v4, framer-motion, recharts, wouter
- Auth: Clerk (Replit-managed), `@clerk/react` + `@clerk/express`
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- AI: OpenAI GPT-4o-mini (user's own `OPENAI_API_KEY`)
- API codegen: Orval (from OpenAPI spec in `lib/api-spec/openapi.yaml`)
- Build: esbuild (CJS bundle)

## Where things live

- `lib/api-spec/openapi.yaml` — source of truth for all API contracts
- `lib/api-zod/src/generated/api.ts` — generated Zod schemas (do not edit manually)
- `lib/api-client-react/src/generated/api.ts` — generated React Query hooks (do not edit manually)
- `lib/db/src/schema/` — Drizzle ORM schema (chatbots, knowledge_sources, bot_conversations, bot_messages, conversations, messages)
- `artifacts/api-server/src/routes/` — Express route handlers
- `artifacts/neurodesk/src/pages/` — React page components
- `artifacts/neurodesk/src/components/` — shared components (layout, UI library)

## Architecture decisions

- OpenAI client uses `OPENAI_API_KEY` directly (not Replit AI proxy) — user brings their own key
- Clerk proxy middleware routes through `/api/__clerk` so auth works in the Replit preview iframe
- Chat streaming uses SSE (text/event-stream) with POST — not EventSource (which only supports GET)
- Bot training is simulated async (setTimeout) — real implementation would use a job queue + vector embeddings
- All API routes are prefixed `/api` and served by the Express server; frontend is a pure SPA at `/`

## Product

- Landing page with live interactive demo chatbot, features, how-it-works, testimonials, pricing, FAQ
- Clerk-powered sign-up/sign-in (Google OAuth + email/password)
- Dashboard: stats overview, top bots, quick-create
- Chatbot management: create, train, update, delete; tabs for overview/knowledge/conversations/embed
- Multi-step chatbot creation wizard (basic info → knowledge sources → appearance → deploy)
- Knowledge base: URL, text, and FAQ sources per chatbot
- Real-time SSE streaming chat (used by demo widget and chatbot widget)
- Analytics page with charts (bar, line, pie) via recharts
- Pricing page (fetched from API) with monthly/yearly toggle
- Blog with 6 full articles on AI chatbot strategy
- Settings page with profile info and sign-out

## User preferences

- Dark premium AI vibe — near-black background, indigo/violet gradient accents
- No emojis in UI

## Gotchas

- Tailwind v4: do NOT use `@apply dark` — `dark` is a variant, not a utility class. Use `@custom-variant dark` to define it.
- `lib/integrations-openai-ai-server/src/image/client.ts` also uses `OPENAI_API_KEY` (not the Replit proxy vars) — keep both client files in sync.
- Run `pnpm --filter @workspace/api-spec run codegen` after changing `openapi.yaml`, then rebuild the API server.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
