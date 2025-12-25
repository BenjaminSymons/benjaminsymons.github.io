# Repository Guidelines

## Project Structure & Module Organization

- `src/routes/` contains SvelteKit routes; use file-based routing like `src/routes/+page.svelte` and shared layout in `src/routes/+layout.svelte`.
- `src/lib/` holds reusable code (components in `src/lib/components/`, tool logic in `src/lib/tools/`).
- `static/` is for assets copied as-is to the build output (e.g., `static/robots.txt`).
- `e2e/` contains Playwright end-to-end tests (e.g., `e2e/demo.test.ts`).
- Build output is written to `build/` via the static adapter.
- Tool routes live under `src/routes/tools/<tool-id>/+page.svelte` and are listed in `src/lib/tools/registry.ts`.
- Prefer adding new tool logic under `src/lib/tools/<tool-id>/` so routes stay thin.

## Build, Test, and Development Commands

- `npm run dev` starts the Vite dev server for local development.
- `npm run dev -- --open` starts the server and opens the browser.
- `npm run build` creates a production build in `build/`.
- `npm run preview` serves the production build locally.
- `npm run check` runs `svelte-check` with the project `tsconfig.json`.
- `npm run lint` checks formatting with Prettier and runs ESLint.
- `npm run format` applies Prettier formatting.
- `npm run test` runs Playwright E2E tests.

## Coding Style & Naming Conventions

- Formatting is enforced by Prettier: tabs, single quotes, `printWidth: 100`, and no trailing commas.
- ESLint is enabled for JS/TS and Svelte (`eslint.config.js`).
- Svelte components in `src/lib/components/` use PascalCase filenames (e.g., `ToolLayout.svelte`).
- Route files follow SvelteKit conventions (`+page.svelte`, `+layout.ts`).
- Favor `$state` and `$effect` for local UI state; avoid stores unless state is shared across routes.
- Keep tool pages client-only: avoid external network requests and ensure conversions run in the browser.

## UI & UX Conventions

- Wrap tool pages with `ToolLayout` and use the shared glass-card visual style.
- Inputs should be labeled, use monospace for textareas, and provide clear placeholders.
- Show parsing errors in a small inline alert; keep outputs read-only.
- Keep tool pages responsive: single column on mobile, two columns on wide screens.

## Data Handling & Safety

- All formatting and conversion runs locally in the browser; do not add telemetry or network calls.
- Prefer pure functions in `src/lib/tools/` and isolate DOM-dependent logic in route components.
- Normalize and sanitize output when emitting HTML or table formats.

## Testing Guidelines

- End-to-end tests use Playwright (`@playwright/test`) under `e2e/` with `*.test.ts` naming.
- Run tests with `npm run test` or `npm run test:e2e`.
- No unit-test framework is configured; add one only if a change warrants it.
- For new tools, consider adding Playwright coverage if the UI includes non-trivial parsing logic.

## Commit & Pull Request Guidelines

- No commit message convention is defined (no Git history in this checkout). If contributing, prefer short, imperative subjects (e.g., "Add JSON formatter") and include scope when helpful.
- PRs should include a concise description, affected routes/components, and screenshots/GIFs for UI changes.
- Call out any new dependencies and list the commands used to validate the change.

## Deployment Notes

- The project uses `@sveltejs/adapter-static` with a `404.html` fallback for GitHub Pages. Ensure routes work with SPA-style navigation after `npm run build` and `npm run preview`.
