# AGENTS.md

Guidance for AI coding agents working in this repository.

## Project Overview

This is a Vite + React frontend application using React Router, Firebase,
styled-components, Recharts, and Vitest. The app is organized around page-level
features under `src/pages` and reusable UI, layout, context, and hook code under
`src/common`.

## Common Commands

- `npm i` installs dependencies.
- `npm run dev` starts the Vite development server.
- `npm run build` creates a production build.
- `npm run preview` serves the production build locally.
- `npm run test` runs Vitest.
- `npm run lint` currently runs `npx prettier --write .`; despite the name, it
  formats files rather than running ESLint diagnostics.

## Repository Structure

- `src/App.jsx` defines global providers and application routes.
- `src/App.css` and `src/index.css` contain global styles.
- `src/pages/<feature>` contains route-level page implementations and
  page-specific styles.
- `src/common/components` contains reusable components.
- `src/common/contexts/UserContext.jsx` owns shared user/auth context.
- `src/common/layouts/NavLayout.jsx` contains shared navigation layout.
- `src/common/hooks` contains custom hooks.
- `src/utils` contains non-hook utilities and constants.
- `src/assets` contains images, icons, and other static assets imported by the
  app.
- `public` contains static files served directly by Vite.

Avoid editing generated or tooling files unless the task requires it:
`node_modules`, `dist`, `build`, `.vscode`, `package-lock.json`,
`vite.config.js`, `jsconfig.json`, and `eslint.config.js`.

## Coding Conventions

- Use ES modules and React function components.
- Put JSX in `.jsx` files. Do not put JSX in `.js` files.
- Use semicolons, single quotes, `jsxSingleQuote`, 2-space indentation, and an
  approximate 80-character line width.
- Prefer absolute imports through the `@/` alias for cross-directory imports,
  for example `@/common/components/atoms/Button`.
- Relative imports are appropriate only for files in the same directory.
- Keep imports grouped and sorted according to `.prettierrc`.
- Define `prop-types` for reusable components when adding component props.
- Follow existing styled-components patterns for most styling unless a nearby
  page already uses a CSS file.
- Keep route additions in `src/App.jsx` consistent with the existing public,
  protected, and form route groups.
- Preserve existing user-facing flows for auth and Firebase unless the task is
  explicitly about changing them.

## UI And Frontend Expectations

- Build the actual app screen or workflow first; avoid adding marketing-style
  landing content unless requested.
- Match the existing visual language and component patterns before introducing
  new abstractions.
- Keep controls accessible: use semantic buttons and form elements, labels for
  inputs, keyboard-friendly interactions, and meaningful alt text for images.
- Make responsive behavior explicit for fixed-format UI such as grids,
  dashboards, cards, and toolbars.
- Ensure text fits within buttons, cards, nav items, and compact panels at both
  mobile and desktop widths.

## Testing And Verification

Before finishing changes, run the narrowest useful verification:

- For styling or component-only changes, run `npm run build` when practical.
- For behavior or utility changes, run `npm run test` if tests exist or add
  focused tests when risk justifies it.
- For formatting-heavy edits, run `npm run lint` to apply the configured
  Prettier rules.

Note that `vite.config.js` references `src/test/setup.js`. If test setup becomes
necessary, create that file intentionally rather than relying on an implicit
missing setup.

## Working Practices

- Keep changes scoped to the user's request.
- Do not rewrite unrelated pages, shared components, or configuration while
  working on a narrow feature.
- Do not revert user edits or unrelated working-tree changes.
- When adding assets, place them under the relevant `src/assets` subfolder and
  import them from code rather than hard-coding deep paths.
- When changing navigation, update both the route and the visible navigation
  entry if the page should be reachable from the app shell.
