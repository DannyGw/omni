# Copilot Project Instructions

## Framework & Routing

- Use **Next.js 14 App Router** patterns for all routing and file structure.

## Components

- **Default to Server Components.**

  - Only use Client Components when strictly necessary (for client-side interactivity or browser APIs).
- Use **shadcn/ui** components, and always import from `@/components/ui`.

## Styling

- Use **Tailwind CSS** utility classes for all styling.
- Avoid custom CSS except where absolutely required.

## TypeScript

- Write all code in **TypeScript**.

- Enforce strict type usage (`"strict": true` in `tsconfig.json`).
- Avoid use of `any` wherever possible.

## File & Folder Structure

- Follow **Next.js App Router** conventions:
  - Route files: `app/page.tsx`, `app/layout.tsx`, and nested routing.
- Place UI components in `@/components/ui` and import from there.

## Best Practices

- Build with a **server-first** approach—fetch and process data on the server by default.
- Encapsulate browser-only logic and effects in Client Components using `"use client"` directive.
- Prefer Tailwind utility classes for layout and design.

## Imports

- **Always** import `shadcn/ui` components from `@/components/ui`.
- Do **not** import directly from the package/library path.

---

> These rules ensure a modern, maintainable codebase with clear conventions for all contributors.
