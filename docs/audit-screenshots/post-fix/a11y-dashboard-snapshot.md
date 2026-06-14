# Dashboard a11y snapshot (post-fix)

**Captured:** June 13, 2026  
**Route:** `/dashboard` @ 1280px (seed user)

## Landmarks and structure

- Skip link: `Skip to dashboard content`
- Sidebar navigation: `Dashboard sections` (4 section buttons with icons)
- Main content: 4 section articles with IDs `section-insight`, `section-news`, `section-prices`, `section-meme`
- Section headers: numbered badges 1–4, collapsible toggle buttons with `aria-expanded` / `aria-controls`
- Feedback controls: `Helpful` / `Not helpful` buttons with `aria-pressed`
- Prices table: `<caption class="sr-only">` + `<th scope="col">` on all columns

## WCAG spot-check

| Check | Result |
|-------|--------|
| Skip link available | Pass |
| Mobile menu focus trap | Pass (Escape closes) |
| External links single new-tab cue | Pass (aria-label + visible icon) |
| Table caption and scope | Pass |
| Section collapse keyboard access | Pass (dedicated button, not nested in footer) |
| Loading states announced | Partial (`aria-busy` on refresh area) |

## Notes

Use `getByRole('button', { name: 'Helpful', exact: true })` in e2e tests — substring match also hits "Not helpful". See [dashboard-desktop.png](dashboard-desktop.png).
