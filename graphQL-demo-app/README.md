# GraphQL BookShelf

> A hands-on GraphQL tutorial disguised as a book management app.

---

**Live stack:** Apollo Server (backend) + React + Apollo Client (frontend)

This project teaches you GraphQL by building something you'd actually use — a personal bookshelf tracker. By the end, you'll understand every core concept that real companies use in production.

## What you'll learn

| Concept | Where you'll see it |
|---|---|
| Schema & Types | `server/src/schema/` |
| Queries | Fetching books and authors |
| Mutations | Adding, updating, deleting books |
| Subscriptions | Real-time "someone added a book" feed |
| Variables | Parameterized operations |
| Fragments | Reusable field selections |
| Error handling | Form validation, not-found errors |

## Project structure

```
graphQL-demo-app/
├── server/          # Apollo Server + GraphQL backend
├── client/          # React + Apollo Client frontend
├── opencode.json    # OpenCode AI agent config (MCP + skills)
├── .opencode/       # OpenCode agent skills
└── docs/            # Concept explainers
    ├── 01-what-is-graphql.md
    ├── 02-schema-and-types.md
    ├── 03-queries.md
    ├── 04-mutations.md
    ├── 05-subscriptions.md
    └── 06-real-world-patterns.md
```

## Quick start

```bash
# Backend (terminal 1)
cd server
bun install
bun dev

# Frontend (terminal 2)
cd client
bun install
bun dev
```

- Backend runs at: `http://localhost:4000`
- Apollo Sandbox: `http://localhost:4000` (open in browser)
- Frontend runs at: `http://localhost:5173`

## Tutorial

Start here: [docs/01-what-is-graphql.md](./docs/01-what-is-graphql.md)

---

*Made for learning. Fork it, break it, rebuild it.*
