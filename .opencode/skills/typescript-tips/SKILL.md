---
name: typescript-tips
description: TypeScript type system patterns, generics, utility types, and common patterns for Node.js and React projects
license: MIT
compatibility: opencode
metadata:
  audience: developers
  domain: typescript
---

## Type System Fundamentals

- Prefer `interface` for object shapes that can be extended
- Use `type` for unions, intersections, and computed types
- `unknown` is safer than `any` - always narrow before using
- Use `as const` for literal types and readonly tuples

## Utility Types

- `Partial<T>` - all fields optional (good for update payloads)
- `Required<T>` - all fields required
- `Pick<T, K>` - select specific fields
- `Omit<T, K>` - exclude specific fields
- `Record<K, V>` - key-value maps with typed keys

## GraphQL + TypeScript

- Generate types from schema using `graphql-code-generator`
- Never manually write types that match GraphQL schema - generate them
- Use `DocumentNode` type for typed GraphQL queries

## Common Patterns

- Discriminated unions for state machines and variants
- Builder pattern using method chaining with typed returns
- Type guards with `is` keyword for narrowing
- Exhaustiveness checking with `never` in switch statements

## Project Setup

- Enable `strict: true` in tsconfig - always
- Use path aliases (`@/`) to avoid relative import hell
- `esModuleInterop: true` for CommonJS default imports
