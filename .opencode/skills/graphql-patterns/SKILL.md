---
name: graphql-patterns
description: GraphQL schema design, resolver patterns, query/mutation/subscription best practices for Apollo Server and Apollo Client
license: MIT
compatibility: opencode
metadata:
  audience: developers
  domain: graphql
---

## GraphQL Schema Design

- Always define types explicitly - use `type`, `input`, `enum` to keep schema clean
- Use `!` for required fields - `String!` means never null
- Design queries to return exactly what clients need - no more, no less
- Use `input` types for mutations, never raw arguments for complex objects

## Apollo Server Patterns

- Resolvers should be thin - delegate business logic to service functions
- Always handle errors with `GraphQLError` for client-friendly messages
- Use `context` to pass auth info, dataloaders, and db connections
- Avoid N+1 queries - use DataLoader for batching

## Apollo Client Patterns

- Use `useQuery` for fetching, `useMutation` for changes
- Always handle `loading`, `error`, and `data` states
- Cache is your friend - understand `cache-first`, `network-only` policies
- Use `refetchQueries` after mutations to keep UI fresh

## Real-World Tips

- Schema-first development: define schema before writing resolvers
- Use GraphQL Playground / Studio for exploring and testing
- Fragment reuse prevents duplication in client queries
- Subscriptions use WebSockets - plan your infra accordingly
