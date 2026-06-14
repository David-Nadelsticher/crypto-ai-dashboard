# Crypto AI Dashboard (Piggy Daily) — Full-Stack Project Summary

## 1. Concept & User Flow

Crypto AI Dashboard (Piggy Daily) is a personalized crypto-investor dashboard built as a full-stack home assignment. Users register with name, email, and password, then authenticate via JWT. On first login, incomplete onboarding redirects to a three-step preference quiz collecting: (1) preferred crypto assets (Bitcoin, Ethereum, Solana, Cardano), (2) investor profile (HODLer, Day Trader, or NFT Collector), and (3) content focus areas (Market News, Charts, Social, Fun). Preferences persist in MongoDB and drive the daily dashboard experience.

The dashboard presents four sections—Daily AI Insight, Market News, Coin Prices, and a Fun Crypto Meme—refreshed in parallel via a single "Refresh Brief" action. Personalization is applied at multiple layers: coin prices and AI insights are tailored server-side to stored assets and investor type; the frontend reorders sections based on content-type preferences (e.g., Charts prioritizes prices, Fun elevates the meme). Users can update preferences later from Settings.

## 2. Architecture & Tech Stack

The frontend is a React 19 SPA built with Vite, styled with Tailwind CSS, and routed via React Router. Authentication state is managed through React Context with JWT tokens stored in localStorage; Axios interceptors attach Bearer tokens and handle session expiry. Protected routes enforce onboarding completion before dashboard access.

The backend is a FastAPI application using Motor for async MongoDB access. It exposes REST endpoints for auth, onboarding, dashboard content, and feedback. Business logic is layered into route handlers, services, and repositories. All third-party API keys are kept server-side; the frontend communicates only with the backend.

## 3. External Integrations & Resiliency

- **CoinGecko** — Live prices, 24h change, volume, and 7-day sparklines for user-selected assets.
- **CCData/CryptoCompare** — Market news feed (implemented as a free alternative to the assignment-recommended CryptoPanic API). On failure or empty responses, a curated 5-article static fallback ensures the section never breaks.
- **OpenRouter** — Generates a three-sentence daily AI insight prompted with the user's assets, investor type, and content preferences. Falls back to a locally simulated, preference-aware insight when the API key is missing or requests fail.
- **meme-api.com** — Fetches random crypto memes from Reddit; rotates on each dashboard refresh, with a static image fallback.

Resiliency is built into every integration via try/catch handling, structured logging, and graceful degradation. **SlowAPI** rate limiting (10 requests/minute per IP) protects signup and login endpoints from abuse. The frontend preserves stale section data during partial refresh failures and surfaces clear loading, empty, and error states.

## 4. Bonus — AI Feedback Loop

Every dashboard section includes reusable thumbs-up/down controls. Votes are submitted to `POST /api/votes` with `user_id`, section type, content reference ID, vote value (+1/−1), and a rich `content_snapshot` (e.g., insight excerpt and model source, news article IDs, coin prices, meme metadata). A unique MongoDB compound index plus upsert logic prevents duplicate votes per user per content item.

This feedback corpus creates a foundation for future model improvement. Positive votes on AI insights paired with user preference context could form chosen-response pairs for **DPO (Direct Preference Optimization)**; aggregated downvotes could identify prompt patterns to avoid in **RLHF** reward modeling. Over time, this loop would let the insight generator adapt tone, depth, and asset focus to each investor profile—turning passive dashboard ratings into a continuous personalization signal.
