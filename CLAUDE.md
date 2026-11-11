# CLAUDE.md

Resume screening app UI: React 19 + TypeScript + Vite, Redux Toolkit, TanStack Query, Axios, React Router, Tailwind CSS 4, Azure AD sign-in (MSAL).

## Commands

- `npm run dev` — start the dev server
- `npm run lint` — ESLint; must pass with no errors or warnings
- `npm run build` — type-check (`tsc -b`) and build; must pass before finishing a task

## Project layout

- `src/pages` — route-level screens
- `src/components` — UI grouped by feature (`candidates`, `chat`, `history`, `jd`, `questions`, ...); shared primitives in `components/common`
- `src/api` — Axios client, React Query client, and one file per endpoint group in `api/endpoints`
- `src/hooks` — React Query and other reusable hooks
- `src/store` — Redux store and slices
- `src/auth` — MSAL config, context and route protection
- `src/types` — shared domain types
- Use the `@/` import alias for anything under `src`.

## Code quality (keep Sonar and Snyk clean)

Write code that passes SonarQube and Snyk without suppressions.

Readability
- Small, single-purpose components and functions; extract when a function does more than one thing.
- Keep cognitive complexity low: use early returns, avoid nesting deeper than 3 levels, no nested ternaries.
- Descriptive names; no magic numbers or repeated string literals — use named constants.
- No duplicated blocks; reuse components in `components/common` and existing hooks.
- Match the surrounding code's naming, comment density and idiom. Comment the why, not the what.
- No dead code, unused imports, unused variables, commented-out code, or `console.log`.

TypeScript / React
- No `any`; use precise types or `unknown` with narrowing. Avoid non-null assertions (`!`) and unchecked casts.
- Mark component props `Readonly` where the lint rules ask for it; keep hook dependency arrays correct.
- Use stable, unique `key` values — never the array index for dynamic lists.
- Handle every promise: `await` it or catch errors; never leave floating promises.
- Add accessible markup: labels for inputs, `aria-*` where needed, semantic elements over clickable `div`s.

Security (Snyk)
- Never write secrets, tokens, keys or connection strings into source, config, tests or comments. Read configuration from `import.meta.env` variables and document them in `.env.example` by name only.
- Never use `dangerouslySetInnerHTML`, `eval`, `new Function`, or string-built HTML. React's default escaping is the output encoding.
- Treat API responses and URL/query params as untrusted: validate shape and type at the boundary; reject malformed input.
- Build URLs with `URLSearchParams`/`encodeURIComponent`; never concatenate user input into paths, redirects or `href`s. Only allow `http(s)` links.
- Do not store tokens or personal data in `localStorage`; rely on MSAL's configured cache.
- Fail closed: on an auth or validation error, deny access and show a safe error message without internal details.
- Use synthetic data only for fixtures and samples — no real candidate or client data.
- Do not add a dependency that is not already in `package.json` without approval; keep dependencies current and free of known vulnerabilities (`npm audit`).

## Before finishing a task

1. `npm run lint` and `npm run build` pass.
2. No new Sonar-style smells: unused code, duplication, high complexity, missing keys, floating promises.
3. No secrets, real data, or console output left in the change.
4. Run Sonar and Snyk scans and get a human review before merging; treat generated code as untrusted until reviewed.
