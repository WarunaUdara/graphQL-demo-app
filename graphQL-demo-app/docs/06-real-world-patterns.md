# 06 — Real-world Patterns

> The gap between "I understand GraphQL" and "I'm using GraphQL well" is these patterns.

---

## 1. Schema-first development

Write your schema before writing any resolver code. Share it with frontend early.

```
Week 1:
  - Backend writes schema
  - Frontend reviews it, asks questions
  - Both teams agree on types and operations

Week 2:
  - Backend implements resolvers
  - Frontend builds UI against mock data
  - Integration is smooth because the contract was set
```

Tools like [GraphQL Inspector](https://the-guild.dev/graphql/inspector) can detect breaking changes in your schema.

---

## 2. Generate TypeScript types from schema

Never manually write types that match your schema — they'll drift. Use `graphql-codegen`:

```bash
bunx graphql-code-generator
```

Config (`codegen.ts`):

```typescript
import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: 'http://localhost:4000/graphql',
  documents: ['src/**/*.tsx'],
  generates: {
    './src/__generated__/': {
      preset: 'client',
    },
  },
};

export default config;
```

This generates typed hooks like `useGetBooksQuery()` that know the shape of their return value. No `any`.

---

## 3. The N+1 problem and DataLoader

Consider this query:

```graphql
query {
  books {
    author {
      name
    }
  }
}
```

Naively, this runs:
- 1 query: get all books
- N queries: get author for each book

With 100 books, that's 101 database queries. This is the **N+1 problem**.

Fix it with [DataLoader](https://github.com/graphql/dataloader):

```typescript
import DataLoader from 'dataloader';

const authorLoader = new DataLoader(async (authorIds: readonly string[]) => {
  // One query for all authors
  const authors = await db.getAuthorsByIds([...authorIds]);
  return authorIds.map(id => authors.find(a => a.id === id));
});

const resolvers = {
  Book: {
    author: (book) => authorLoader.load(book.authorId), // batched automatically
  },
};
```

DataLoader batches all `authorLoader.load()` calls in one event loop tick into a single `getAuthorsByIds([...])` call. 101 queries become 2.

---

## 4. Authentication & authorization

Pass auth context to every resolver:

```typescript
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    const token = req.headers.authorization?.replace('Bearer ', '');
    const user = token ? verifyToken(token) : null;
    return { user };
  },
});
```

In a resolver:

```typescript
const resolvers = {
  Mutation: {
    deleteBook: (_, { id }, context) => {
      if (!context.user) {
        throw new GraphQLError('Not authenticated', {
          extensions: { code: 'UNAUTHENTICATED' }
        });
      }
      return db.deleteBook(id);
    },
  },
};
```

---

## 5. Pagination — don't return everything

Returning all books ever? Bad idea at scale. Use cursor-based pagination:

```graphql
type BookConnection {
  edges: [BookEdge!]!
  pageInfo: PageInfo!
}

type BookEdge {
  node: Book!
  cursor: String!
}

type PageInfo {
  hasNextPage: Boolean!
  endCursor: String
}

type Query {
  books(first: Int, after: String): BookConnection!
}
```

Or simpler offset pagination for beginners:

```graphql
type Query {
  books(limit: Int, offset: Int): [Book!]!
}
```

---

## 6. Error handling patterns

Three types of errors in GraphQL:

```
GraphQL Errors (expected)     -> { errors: [...] }
Network Errors (unexpected)   -> caught by Apollo Client's error link
Partial errors                -> { data: {...}, errors: [...] }  ← both!
```

Handling in Apollo Client:

```typescript
import { onError } from '@apollo/client/link/error';

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, extensions }) => {
      if (extensions?.code === 'UNAUTHENTICATED') {
        // redirect to login
      }
    });
  }
  if (networkError) {
    console.error('Network error:', networkError);
  }
});
```

---

## 7. Query complexity limits

In production, prevent expensive queries:

```typescript
import { createComplexityRule } from 'graphql-query-complexity';

const server = new ApolloServer({
  validationRules: [
    createComplexityRule({
      maximumComplexity: 100,
      estimators: [fieldExtensionsEstimator(), simpleEstimator({ defaultComplexity: 1 })],
    }),
  ],
});
```

Without this, a malicious client could query deeply nested data and crash your server.

---

## 8. Deprecating fields

Don't remove fields, deprecate them:

```graphql
type Book {
  title: String!
  name: String @deprecated(reason: "Use `title` instead")
}
```

Clients using `name` will see a warning in Apollo DevTools. Remove it in the next major version.

---

## Real-world architecture at companies

**GitHub:**
- Single GraphQL endpoint for the entire platform
- Schema is the source of truth for all client teams
- Deprecation policy: 3 months minimum before removal

**Shopify:**
- Two separate APIs: Admin (complex, authenticated) and Storefront (public, cached)
- GraphQL introspection is disabled in production for security
- Persisted queries to prevent arbitrary query execution

**Airbnb:**
- Replaced REST microservices with a GraphQL gateway
- Each team owns their part of the schema
- This pattern is called **Federation** (check out Apollo Federation for this)

---

## Where to go from here

1. **Apollo Federation** — split your schema across teams/services
2. **graphql-codegen** — typed operations, no manual type writing
3. **DataLoader** — solve N+1 in real apps
4. **Persisted queries** — production security and performance
5. **Schema stitching** — combine multiple schemas
6. **Rate limiting** — protect your API from abuse

---

*You've now got the foundation. The rest is practice. Build something.*
