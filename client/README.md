# BookShelf — Frontend

React + TypeScript app demonstrating GraphQL concepts with Apollo Client.

## Stack

- **Framework:** React 19 + TypeScript
- **Build:** Vite
- **GraphQL client:** Apollo Client v4
- **Subscriptions:** graphql-ws (WebSocket transport)

## Run

```bash
bun install
bun dev
```

Runs at `http://localhost:5173`

> Backend must be running at `http://localhost:4000`

## Structure

```
src/
  App.tsx                     # ApolloProvider wrapper
  apolloClient.ts             # Apollo Client setup (HTTP + WebSocket split)
  types/index.ts              # TypeScript types
  queries/index.ts            # GraphQL queries + fragments
  mutations/index.ts          # GraphQL mutations
  subscriptions/index.ts      # GraphQL subscriptions
  components/
    BookShelf.tsx             # Main view (useQuery with filter variables)
    BookCard.tsx              # Book item (useMutation: toggle, update, delete)
    AddBookForm.tsx           # Add form (useMutation: addBook, addAuthor)
    LiveFeed.tsx              # Real-time notifications (useSubscription)
```

## GraphQL concepts in the UI

| Component | Concept | Hook |
|---|---|---|
| `BookShelf` | Query with variables | `useQuery` |
| `BookCard` (heart) | Mutation | `useMutation` |
| `BookCard` (status) | Mutation + refetch | `useMutation` |
| `AddBookForm` | Mutation with input type | `useMutation` |
| `LiveFeed` | Subscription | `useSubscription` |
