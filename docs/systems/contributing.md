# Contributing

## Commits

This project uses [conventional commits](https://www.conventionalcommits.org/). Commit messages are enforced by commitlint via a husky hook.

| Prefix | Use When |
|---|---|
| `feat:` | New feature |
| `fix:` | Bug fix |
| `chore:` | Tooling, config, deps |
| `docs:` | Documentation |
| `refactor:` | No behavior change |
| `style:` | Formatting only |
| `test:` | Tests |

## Releases

```bash
pnpm run release        # Auto-bump based on commits
pnpm run release:minor  # Force minor bump
pnpm run release:major  # Force major bump
```

## Code Standards

- TypeScript strict mode, no `any`.
- Every component file starts with a comment: server or client, why, and what data it receives.
- Prefer server components. Only use client components for interactivity, hooks, or browser APIs.
- No component over 150 lines.
- All GraphQL operations in `src/graphql/` — never inline.
- Tailwind only for styling. Use `cn()` for conditional classes.
- shadcn/ui for all UI primitives.
- Result pattern for async operations. Never swallow errors.
- Loading skeletons on all async UI.
