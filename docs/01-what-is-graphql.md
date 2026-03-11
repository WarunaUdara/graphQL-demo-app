# 01 — What is GraphQL?

> "GraphQL is a query language for your API, and a runtime for executing those queries."
>
> — GraphQL.org (they're not wrong, but let's make it make sense)

---

## The problem GraphQL solves

Imagine you're building a bookshelf app. Your app shows a list of books, and for each book you need:

- Title
- Author name
- Cover image

You call a REST API: `GET /books`

The server sends back:

```json
{
  "id": "1",
  "title": "The Pragmatic Programmer",
  "author": {
    "id": "42",
    "name": "David Thomas",
    "bio": "David Thomas is a programmer and author...",
    "birthDate": "1956-03-15",
    "nationality": "British",
    "totalBooks": 3
  },
  "isbn": "978-0135957059",
  "publishedYear": 1999,
  "publisher": "Addison-Wesley",
  "coverImage": "https://...",
  "description": "...(500 words)...",
  "tags": [...],
  "reviews": [...],
  "rating": 4.8
}
```

You needed 3 fields. You got 20. This is called **over-fetching**.

Now you want the author's other books for a sidebar. You call `GET /authors/42/books`. That's a second round trip. This is called **under-fetching** (one request wasn't enough).

**GraphQL fixes both problems in one shot.**

With GraphQL, you ask for exactly what you need:

```graphql
query GetBookWithAuthor {
  book(id: "1") {
    title
    coverImage
    author {
      name
    }
  }
}
```

The server sends back exactly that. No more, no less. One request.

---

## REST vs GraphQL — a real comparison

| Scenario | REST | GraphQL |
|---|---|---|
| Get book details | `GET /books/1` | `query { book(id: "1") { ... } }` |
| Get author too | `GET /books/1` + `GET /authors/42` | Same query, add `author { name }` |
| Add a book | `POST /books` | `mutation { addBook(...) { ... } }` |
| Real-time updates | Polling / WebSockets (custom) | `subscription { bookAdded { ... } }` |
| API docs | Swagger/OpenAPI (maintained separately) | Schema is the docs (always accurate) |

---

## How GraphQL works — the 3-second version

1. **Client** sends a query string to a single endpoint (`POST /graphql`)
2. **Server** parses the query, runs resolvers, assembles the result
3. **Client** gets back JSON shaped exactly like the query

```
Client                    Server
  |                          |
  |  POST /graphql           |
  |  { "query": "..." }      |
  |------------------------->|
  |                          |  Parse query
  |                          |  Run resolvers
  |                          |  Assemble result
  |  { "data": { ... } }     |
  |<-------------------------|
```

---

## The 3 operation types

GraphQL has exactly 3 ways to interact with data:

### 1. Query — read data

```graphql
query {
  books {
    title
    author {
      name
    }
  }
}
```

### 2. Mutation — write data

```graphql
mutation {
  addBook(title: "Dune", authorId: "5") {
    id
    title
  }
}
```

### 3. Subscription — listen for changes (real-time)

```graphql
subscription {
  bookAdded {
    title
    addedBy
  }
}
```

---

## Real-world companies using GraphQL

- **GitHub** — their entire public API v4 is GraphQL
- **Shopify** — admin and storefront APIs
- **Twitter/X** — internal API layer
- **Airbnb** — replaced REST microservices
- **Netflix** — federated GraphQL across teams

They didn't switch because it's trendy. They switched because it scales well with:
- Multiple clients (web, mobile, TV apps) needing different data shapes
- Large teams where schema is a contract between frontend and backend
- Performance requirements where bandwidth matters

---

## Next: [02 — Schema & Types](./02-schema-and-types.md)

