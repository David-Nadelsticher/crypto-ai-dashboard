# Progress Log — Piggy Daily Frontend

**Last updated:** 2026-06-13  
**Current milestone:** M8 — Resilience & Feedback (M6–M7, M12–M15 complete)

---

## Status Summary

| Milestone | Status | Tasks |
|-----------|--------|-------|
| M1 — Critical Fixes | Verified | TASK-001 – TASK-006 |
| M2 — Design System | Verified | TASK-007 – TASK-013 |
| M3 — UX Polish | Verified | TASK-014 – TASK-020 |
| M4 — Architecture | Verified | TASK-021 – TASK-031 |
| M5 — Polish | Verified (TASK-040 run pending TLS) | TASK-032 – TASK-041 |
| **M6 — Trust & Compliance** | **✅ Complete** | **TASK-101 – TASK-105** |
| **M7 — Personalization** | **✅ Complete** | **TASK-201 – TASK-204** |
| **M12 — Motion Foundation** | **✅ Complete** | **MOT-TASK-001 – 004** |
| **M13 — Feedback Layer** | **✅ Complete** | **MOT-TASK-010 – 016** |
| **M14 — Dashboard Orchestration** | **✅ Complete** | **MOT-TASK-030 – 035** |
| **M15 — Flow & Delight** | **✅ Complete** | **MOT-TASK-020 – 023** |
| M8 — Resilience & Feedback | Next | TASK-301 – TASK-306 |
| **Post-fix re-audit** | Complete | Docs + 18 screenshots |

---

## Milestone 6 Implementation (2026-06-13)

### TASK-101 — Sync AuthContext on 401
- Added `utils/authEvents.js` with `AUTH_EXPIRED_EVENT` and `dispatchAuthExpired()`
- Axios 401 interceptor clears storage and dispatches event
- `AuthContext` listens and calls `clearSession()` to sync React state
- Added `AuthExpiryHandler` inside router to redirect to `/login?reason=session_expired`

### TASK-102 — Rollback token on failed /me
- `login()` wraps `/me` fetch in try/catch; calls `clearSession()` on failure

### TASK-103 — Session expired message
- Login reads `?reason=session_expired` and shows info `Alert`
- Notice clears when user edits form fields

### TASK-104 — content_snapshot with votes
- New `utils/voteSnapshots.js` with builders for all 4 sections + unit tests
- `FeedbackControls` accepts and sends `content_snapshot`
- All section components pass snapshots on `status === "success"`

### TASK-105 — Disable voting on empty/error
- `resolveItemReference` only returns refs for `success` or `refreshing` status
- Removed `*-empty` synthetic IDs
- Feedback disabled when `itemReference` or `contentSnapshot` is missing

### Validation (M6)

| Check | Result |
|-------|--------|
| `npm run build` | Pass (145 modules) |
| `npm test` | Pass (19/19 unit tests) |
| Lint | No ESLint configured; no IDE linter errors on edited files |

---

## Milestone 7 Implementation (2026-06-13)

### TASK-201 — content_types mapping
- New `config/personalization.js` with section order + expand helpers
- Unit tests in `utils/personalization.test.js`

### TASK-202 — Personalized dashboard order
- `Dashboard.jsx` renders sections via `orderDashboardSections()`
- `DashboardLayout` + `Sidebar` accept dynamic `sections` prop
- Section components accept `defaultExpanded` from `shouldExpandSection()`

### TASK-203 — Backend insight personalization
- `dashboard.py` passes `content_types` to insight service
- `generate_ai_insight()` prompt and simulated fallback include content preferences

### TASK-204 — Settings page
- New `PATCH /me/preferences` backend route + `updatePreferences` API
- New `/settings` page with edit form; link from `PreferencesSummary`

### Validation (M7)

| Check | Result |
|-------|--------|
| `npm run build` | Pass (147 modules) |
| `npm test` | Pass (23/23 unit tests) |
| `pytest tests/` | Pass (38/38 backend tests) |

---

## Motion Milestones M12–M15 (2026-06-13)

### M12 — Motion Foundation
- CSS motion tokens (`--motion-*`, easing vars) in `index.css`
- Tailwind extensions for duration, timing, keyframes (shimmer, fadeIn, slideUp, scaleIn, flash)
- Utility classes: `.motion-interactive`, `.motion-card`, `.motion-press`, `.motion-shimmer`, `.motion-fade-in`, `.motion-slide-up`, `.motion-stagger-item`, `.motion-flash`, `.motion-draw-stroke`
- New `usePrefersReducedMotion` hook for JS-gated animations

### M13 — Feedback Layer
- Toast slide-up entrance; Alert fade-in; Button press/interactive motion
- CheckboxCard/RadioCard selection spring; FeedbackControls thumb scale + message fade
- LazyImage load fade; ContentSkeleton shimmer; StateMessage fade-in

### M14 — Dashboard Orchestration
- Dashboard section stagger via `staggerIndex` on all section components
- SectionCard refresh overlay fade, collapse crossfade
- MarketNews list item stagger; CoinPrices card lift + price flash on refresh; sparkline stroke draw
- Sidebar nav transitions + backdrop fade

### M15 — Flow & Delight
- `AnimatedRoutes` with View Transitions API (RM/instant fallback)
- Onboarding success overlay (~400ms) with RM instant navigate
- Branded loading screen with staggered avatar/text
- Signup → Login success Alert

### Validation (M12–M15)

| Check | Result |
|-------|--------|
| `npm run build` | Pass (149 modules) |
| `npm test` | Pass (23/23 unit tests) |
| Animation library added | No — CSS-first + View Transitions only |

---

### TASK-032 — AI Insight deduplication
- Expanded view shows full insight once via `PiggyTakeBlock` (non-compact); removed duplicate paragraph
- Collapsed preview unchanged (excerpt via `extractPiggyTake`)

### TASK-033 — SectionContent hardening
- Added `renderContent` prop to defer nullable content rendering until after empty guard
- All 4 section components migrated to `renderContent` + guard components
- Pattern documented in `design-system-improvements.md`

### TASK-034 — useScrollSpy hook
- New `frontend/src/hooks/useScrollSpy.js`
- Used in `DashboardLayout.jsx` and `Onboarding.jsx`

### TASK-035 — Auth redirect helper
- New `frontend/src/utils/resolvePostAuthPath.js` + unit tests
- Used in `ProtectedRoute`, `NotFoundRedirect`, `Login.jsx`

### TASK-036 — CheckboxCard / RadioCard
- New primitives; onboarding selection steps refactored

### TASK-037 — Button system unification
- Sidebar Refresh/Logout use `<Button variant="ghost">`
- Removed dead `.btn-primary` / `.btn-ghost` CSS classes

### TASK-038 — DRY color tokens
- `:root` CSS variables in `index.css` are single source of truth
- Tailwind `piggy-*` colors reference `var(--color-piggy-*)`

### TASK-039 — SECTION_BY_ID map
- Exported from `config/dashboardSections.js`; all section files use keyed lookup

### TASK-040 — E2E CI (partial)
- Added `.github/workflows/e2e.yml`
- Updated `e2e/smoke.spec.js` with `{ exact: true }` for Helpful button
- **Blocked locally:** `npm install` fails with `UNABLE_TO_VERIFY_LEAF_SIGNATURE`

### TASK-041 — Format section files
- Reformatted `AiInsightSection.jsx`, `CoinPricesSection.jsx`, `MemeSection.jsx`, `MarketNewsSection.jsx`

### Validation

| Check | Result |
|-------|--------|
| `npm run build` | Pass (141 modules) |
| `npm test` | Pass (14/14 unit tests) |
| Lint | No ESLint configured; no IDE linter errors on edited files |
| `npm run test:e2e` | Blocked — `@playwright/test` install (TLS) |

---

## Post-Fix Re-Audit (2026-06-13)

**Scope:** Full UI/UX/architecture re-audit per attached plan. No application code modified during audit phase.

### Findings Summary

| Category | Original | Open |
|----------|----------|------|
| Critical | 5 | 0 |
| High | 9 | 0 |
| Medium | 10 | 0 |
| Low | 6 | 1 (NEW-9 local e2e run) |

All 30 original issues **resolved and verified**. All 11 post-fix issues **resolved in code**; e2e execution pending TLS fix.

---

## E2E Run Instructions

```bash
# From repo root (requires working npm registry access)
npm install
npx playwright install chromium
npm run test:e2e
```

**TLS workaround (corporate proxy):** configure npm CA certs or use a machine without cert interception, then re-run the commands above.

**CI:** GitHub Actions workflow `.github/workflows/e2e.yml` runs smoke tests on push/PR when registry access is available.

Seed user: `test@example.com` / `password123`

Screenshot capture script (optional): `node scripts/capture-audit-screenshots.mjs`

---

## Related Documents

- [UI Audit Report](ui-audit-report.md)
- [Frontend Roadmap](frontend-roadmap.md)
- [Task Backlog](task-backlog.md)
- [Design System Improvements](design-system-improvements.md)
- [Motion Audit](motion-audit.md)
- [Motion Roadmap](motion-roadmap.md)
- [Motion Task Backlog](motion-task-backlog.md)
