# BookShelf — Backend

GraphQL API built with Apollo Server v5, running on Bun.

## Stack

- **Runtime:** Bun
- **GraphQL:** Apollo Server v5
- **Subscriptions:** graphql-ws (WebSocket)
- **Schema tools:** @graphql-tools/schema + graphql-tag
- **Database:** In-memory (swap for real DB easily)

## Run

```bash
bun install
bun dev        # hot reload
bun start      # production
```

Runs at `http://localhost:4000`

## Structure

```
src/
  index.ts              # Server entry point
  schema/
    typeDefs.ts         # GraphQL schema (SDL)
  resolvers/
    resolvers.ts        # Query, Mutation, Subscription, Type resolvers
  data/
    db.ts               # In-memory data store + access functions
```

## Try queries in the sandbox

Open `http://localhost:4000/graphql` in your browser for Apollo Sandbox.

```graphql
# All books with authors
query {
  books {
    title
    status
    author { name }
  }
}

# Filter by status
query {
  booksByStatus(status: READING) {
    title
    rating
  }
}

# Add a book
mutation {
  addBook(input: {
    title: "Children of Dune"
    authorId: "author_1"
    status: WANT_TO_READ
  }) {
    id
    title
  }
}
```

## Replacing the in-memory DB

The `db.ts` file exposes a simple interface (`getAllBooks`, `createBook`, etc.).
Replace the implementations with real DB calls — the resolvers don't need to change.
