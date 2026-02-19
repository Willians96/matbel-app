Design tokens & usage

Where tokens live
- Colors, radii and fonts are declared in `src/app/globals.css` as CSS custom properties (HSL values). The UI playground page (`/dev/ui`) demonstrates token usage.

How Tailwind uses tokens
- We added `tailwind.config.cjs` which exposes CSS-based tokens to Tailwind utilities:
  - `bg-[hsl(var(--background))]` or `bg-background` (via extended theme)
  - `text-foreground`, `bg-card`, `rounded-md` (radius from tokens)

Recommendations
- Keep tokens minimal and semantic (primary, accent, background, foreground, surface).
- When changing core tokens, update `docs/design-tokens.md` and UI playground to reflect changes.
- Add visual regression tests (per-token snapshots) in the future.

