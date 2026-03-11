# 02 — Schema & Types

> The schema is the contract. Frontend knows exactly what it can ask for. Backend knows exactly what it must provide.

---

## What is a schema?

A GraphQL schema is written in **Schema Definition Language (SDL)**. It describes:

- The shape of your data (types)
- What operations are available (Query, Mutation, Subscription)

Think of it as a type-safe API contract that both sides agree to.

---

## Scalar types — the building blocks

GraphQL ships with 5 built-in scalar types:

| Type | Example | Use for |
|---|---|---|
| `String` | `"Dune"` | Text |
| `Int` | `432` | Whole numbers |
| `Float` | `4.8` | Decimal numbers |
| `Boolean` | `true` | Yes/no flags |
| `ID` | `"abc123"` | Unique identifiers |

You can also define custom scalars (like `Date`, `URL`, `JSON`).

---

## Object types — your data models

```graphql
type Book {
  id: ID!
  title: String!
  description: String
  publishedYear: Int
  rating: Float
  isFavorite: Boolean!
  author: Author!
}

type Author {
  id: ID!
  name: String!
  bio: String
  books: [Book!]!
}
```

Notice the `!` — this means **non-null** (required). Without it, the field can be null.

- `String!` — definitely a string, never null
- `String` — might be null (optional)
- `[Book!]!` — definitely a list, and each item is definitely a Book
- `[Book]` — might be null, items might be null too (avoid this)

---

## The root types — where operations live

```graphql
type Query {
  books: [Book!]!
  book(id: ID!): Book
  authors: [Author!]!
  searchBooks(query: String!): [Book!]!
}

type Mutation {
  addBook(input: AddBookInput!): Book!
  updateBook(id: ID!, input: UpdateBookInput!): Book!
  deleteBook(id: ID!): Boolean!
  toggleFavorite(id: ID!): Book!
}

type Subscription {
  bookAdded: Book!
}
```

---

## Input types — for mutations

You can't use regular types as mutation arguments. You need `input` types:

```graphql
input AddBookInput {
  title: String!
  description: String
  publishedYear: Int
  authorId: ID!
}

input UpdateBookInput {
  title: String
  description: String
  publishedYear: Int
  rating: Float
}
```

Why separate `input` types? Because `Book` has computed fields, relationships, and server-generated IDs that don't make sense as inputs.

---

## Enum types — constrained values

```graphql
enum ReadStatus {
  WANT_TO_READ
  READING
  FINISHED
  ABANDONED
}

type Book {
  # ...
  status: ReadStatus!
}
```

Enums prevent typos and document valid states. Much better than `String`.

---

## Full schema — our BookShelf app

Here's the complete schema you'll find in `server/src/schema/typeDefs.ts`:

```graphql
type Author {
  id: ID!
  name: String!
  bio: String
  books: [Book!]!
}

type Book {
  id: ID!
  title: String!
  description: String
  publishedYear: Int
  rating: Float
  isFavorite: Boolean!
  status: ReadStatus!
  author: Author!
  createdAt: String!
}

enum ReadStatus {
  WANT_TO_READ
  READING
  FINISHED
  ABANDONED
}

input AddBookInput {
  title: String!
  description: String
  publishedYear: Int
  authorId: ID!
  status: ReadStatus
}

input UpdateBookInput {
  title: String
  description: String
  publishedYear: Int
  rating: Float
  status: ReadStatus
  isFavorite: Boolean
}

type Query {
  books: [Book!]!
  book(id: ID!): Book
  authors: [Author!]!
  booksByStatus(status: ReadStatus!): [Book!]!
}

type Mutation {
  addBook(input: AddBookInput!): Book!
  updateBook(id: ID!, input: UpdateBookInput!): Book!
  deleteBook(id: ID!): Boolean!
  toggleFavorite(id: ID!): Book!
  addAuthor(name: String!, bio: String): Author!
}

type Subscription {
  bookAdded: Book!
}
```

---

## Why schemas are powerful

1. **Auto-generated docs** — Apollo Sandbox explores your schema for free
2. **Type safety** — TypeScript types can be generated from schema (no drift)
3. **Contract testing** — schema changes are caught before they break clients
4. **Introspection** — any client can ask the server "what can I query?"

---

## Next: [03 — Queries](./03-queries.md)
