---
name: react-best-practices
description: React component patterns, hooks usage, state management, and performance best practices for React + TypeScript apps
license: MIT
compatibility: opencode
metadata:
  audience: developers
  domain: react
---

## Component Patterns

- Prefer functional components with hooks over class components
- Keep components small and focused - one responsibility per component
- Use composition over inheritance
- Extract custom hooks for reusable stateful logic

## Hooks Best Practices

- `useEffect` dependencies must be exhaustive - lint rule enforces this
- Avoid effects for data fetching when using Apollo Client - useQuery handles it
- `useCallback` and `useMemo` only when profiling shows a real need
- Custom hooks should start with `use` - this is enforced by React

## TypeScript in React

- Type all props explicitly - avoid `any`
- Use `React.FC` sparingly - prefer explicit return types
- Type event handlers: `React.ChangeEvent<HTMLInputElement>`
- Use discriminated unions for component variants

## State Management

- Local state: `useState` for simple values
- Complex local state: `useReducer`
- Server state: Apollo Client cache (for GraphQL)
- Avoid prop drilling beyond 2 levels - use context or lift state up

## Performance

- Key prop on lists must be stable and unique - never use array index
- Lazy load routes with `React.lazy` and `Suspense`
- Images need width/height to avoid layout shift
