# Resume Screening & AI Recruitment Copilot — Frontend

Template scaffold for the recruiter workspace described in [docs/resume-copilot-plan.html](../docs/resume-copilot-plan.html).
No backend integration yet — all data on screen is static/sample data, and "Sign in" is a demo button
that sets a local mock user (see [src/auth/AuthContext.tsx](src/auth/AuthContext.tsx)).

## Tech stack

- **React 19 + TypeScript** (strict) via Vite
- **Tailwind CSS v4** for styling (brand palette defined as CSS variables in [src/index.css](src/index.css))
- **Redux Toolkit** for shared UI state (selected candidate, history filters)
- **React Context** for auth session state
- **Axios + TanStack Query** for the API layer (stubbed, not yet connected to a backend)
- **React Router** for routing + a `ProtectedRoute` guard

## Folder structure

```
src/
  api/            axios client, TanStack Query client, one file per REST resource
    endpoints/
  auth/           AuthContext/useAuth (demo only), ProtectedRoute, MSAL config placeholder
  components/     presentational UI grouped by feature
    layout/       header + 3-pane layout shell
    jd/           job description form (placeholder)
    candidates/   ranked candidate list/card
    highlights/   application highlights placeholder (replaces the resume reader)
    questions/    interview question panel
    history/      session history sidebar (placeholder)
    feedback/     per-chat feedback widget
    chat/         standalone chat module (placeholder)
    common/       generic building blocks (Button, Card, Tag, TextInput)
  constants/      sample/mock data used until the backend is wired up
  hooks/          thin hooks wrapping the API layer / Redux slices
  pages/          routed pages (Login, Workspace)
  routes/         React Router route table
  store/          Redux store, typed hooks, slices
  types/          shared domain types (mirrors the MongoDB collections)
```

## Getting started

```bash
npm install
npm run dev
```

Copy `.env.example` to `.env.local` and fill in real values once the Django API and AAD app
registration exist.

## Next steps (not implemented yet)

- Wire `src/hooks/useSessions.ts` / `useMatch.ts` and the components under `components/` to the
  real API endpoints in `src/api/endpoints`.
- Replace `AuthContext`'s demo login with `@azure/msal-react` using `src/auth/msalConfig.ts`.
- Design and implement the `jd`, `history` and `chat` placeholders.
- Decide whether/how a resume reader is reintroduced (removed for now; `highlights/AppHighlights`
  is a placeholder in its place).
