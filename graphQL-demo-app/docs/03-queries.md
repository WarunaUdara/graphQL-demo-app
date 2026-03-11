# 03 — Queries

> Queries are how you ask for data. You describe the shape of what you want, and that's exactly what you get back.

---

## Basic query

```graphql
query {
  books {
    id
    title
    isFavorite
  }
}
```

Response:

```json
{
  "data": {
    "books": [
      { "id": "1", "title": "Dune", "isFavorite": true },
      { "id": "2", "title": "The Pragmatic Programmer", "isFavorite": false }
    ]
  }
}
```

The response shape **mirrors** the query shape. This is not a coincidence — it's by design.

---

## Nested queries — relationships for free

```graphql
query {
  books {
    title
    author {
      name
      bio
    }
  }
}
```

No second API call. No `JOIN`. You define the relationship in the schema, and the resolver handles it. The client just asks.

---

## Query with arguments — filtering

```graphql
query {
  book(id: "1") {
    title
    description
    publishedYear
  }
}
```

```graphql
query {
  booksByStatus(status: READING) {
    title
    author {
      name
    }
  }
}
```

---

## Variables — don't hardcode query arguments

Bad (hardcoded, not reusable):

```graphql
query {
  book(id: "1") {
    title
  }
}
```

Good (parameterized):

```graphql
query GetBook($id: ID!) {
  book(id: $id) {
    title
  }
}
```

Variables are passed separately as JSON:

```json
{
  "id": "1"
}
```

This matters because:
- Prevents injection attacks (variables are never interpolated into the query string)
- Enables query caching (same query, different variables = cache hit)
- Makes code reusable

In Apollo Client (React):

```typescript
const GET_BOOK = gql`
  query GetBook($id: ID!) {
    book(id: $id) {
      title
      description
    }
  }
`;

const { data } = useQuery(GET_BOOK, {
  variables: { id: bookId }
});
```

---

## Named queries — always name them

Anonymous:
```graphql
query {
  books { title }
}
```

Named:
```graphql
query GetAllBooks {
  books { title }
}
```

Names show up in:
- Apollo DevTools (you can see which query ran)
- Server logs (diagnose slow queries by name)
- Error messages (actually useful)

Always name your queries in production code.

---

## Fragments — reusable field selections

If you find yourself writing the same fields in multiple places:

```graphql
fragment BookCard on Book {
  id
  title
  isFavorite
  status
  author {
    name
  }
}

query GetBooks {
  books {
    ...BookCard
  }
}

query GetBooksByStatus($status: ReadStatus!) {
  booksByStatus(status: $status) {
    ...BookCard
  }
}
```

Fragments are the GraphQL equivalent of extracting a component. Use them.

---

## Aliases — rename fields in response

```graphql
query {
  readingNow: booksByStatus(status: READING) {
    title
  }
  finished: booksByStatus(status: FINISHED) {
    title
  }
}
```

Response:

```json
{
  "data": {
    "readingNow": [...],
    "finished": [...]
  }
}
```

You ran two queries in one request. The aliases prevent key collisions.

---

## How resolvers work (backend side)

For every field in your schema, you can write a resolver:

```typescript
const resolvers = {
  Query: {
    books: () => db.getAllBooks(),
    book: (_, { id }) => db.getBookById(id),
    booksByStatus: (_, { status }) => db.getBooksByStatus(status),
  },
  Book: {
    author: (book) => db.getAuthorById(book.authorId),
  },
};
```

The `Book.author` resolver is called for every book that includes the `author` field. If a query doesn't ask for `author`, it never runs. This is **resolver chaining** — and it's why GraphQL is efficient.

---

## Try it yourself

With the backend running, open `http://localhost:4000` and try:

```graphql
# Get all books with their authors
query {
  books {
    title
    status
    author {
      name
    }
  }
}

# Get only books you're reading
query {
  booksByStatus(status: READING) {
    title
    rating
  }
}

# Get a specific book
query GetBook($id: ID!) {
  book(id: $id) {
    title
    description
    publishedYear
    author {
      name
      bio
    }
  }
}
```

---

## Next: [04 — Mutations](./04-mutations.md)
