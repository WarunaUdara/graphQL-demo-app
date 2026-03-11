---
name: git-workflow
description: Git commit conventions, branching strategy, and PR workflow for clean open source project history
license: MIT
compatibility: opencode
metadata:
  audience: maintainers
  workflow: github
---

## Commit Message Style

- Short, human first-person present tense: "add book list query" not "Added book list query"
- No emojis, no ticket numbers unless project requires
- Body (optional) explains the why, not the what
- Keep subject line under 72 chars

## Branching Strategy

- `main` - stable, always deployable
- Feature branches: `feat/book-subscriptions`
- Fix branches: `fix/resolver-null-check`
- Chores: `chore/update-deps`

## Commit Granularity

- Each commit should represent one logical change
- Don't mix refactoring with feature additions
- Working state at every commit - no broken builds

## PR Workflow

- PRs should be small and focused
- Link to relevant issues
- Include a test plan in the description
- Squash merge to keep history clean

## Open Source Etiquette

- CHANGELOG.md for user-facing changes
- Semantic versioning: MAJOR.MINOR.PATCH
- Tag releases on main
- Keep CONTRIBUTING.md up to date
