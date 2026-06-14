# Task Backlog — Piggy Daily Frontend

**Last updated:** June 13, 2026  
**Total tasks:** 42 (33 open, 9 complete in M6–M7)  
**Format:** Each task maps to audit issue IDs, includes acceptance criteria and technical notes.

---

## Priority Legend

| Priority | Meaning |
|----------|---------|
| P0 | Critical — blocks product acceptance |
| P1 | High — significant UX/trust impact |
| P2 | Medium — polish, a11y, maintainability |
| P3 | Low — nice-to-have |

---

## M6 — Trust & Compliance ✅ Complete

### TASK-101 — Sync AuthContext on 401 Response ✅

| Field | Value |
|-------|-------|
| **Status** | ✅ Complete (2026-06-13) |
| **Priority** | P0 |
| **Issue** | AUTH-01 |
| **Effort** | S (2–4h) |
| **Dependencies** | None |

**Description:** When axios interceptor receives 401, clear React auth state and redirect to login.

**Acceptance criteria:**
- [x] After simulated 401, `useAuth().isAuthenticated` is `false`
- [x] User is redirected to `/login`
- [x] No API calls succeed with stale in-memory token
- [x] Existing logout flow still works from sidebar

**Technical notes:**
- Option A: Export `onAuthExpired` callback from `AuthContext`, register in `client.js` interceptor
- Option B: Use custom event `window.dispatchEvent(new Event('auth:expired'))` listened to by provider
- Avoid circular imports between `client.js` and `AuthContext.jsx`
- Clear both `TOKEN_KEY` and `USER_KEY` consistently

**Files:** `api/client.js`, `context/AuthContext.jsx`, optionally `App.jsx`

---

### TASK-102 — Rollback Token on Failed /me After Login ✅

| Field | Value |
|-------|-------|
| **Status** | ✅ Complete (2026-06-13) |
| **Priority** | P1 |
| **Issue** | AUTH-02 |
| **Effort** | S (1–2h) |
| **Dependencies** | None |

**Description:** Do not leave orphan token in storage if `fetchCurrentUser()` fails during login.

**Acceptance criteria:**
- [x] If `/me` fails after successful `/login`, `localStorage` has no token
- [x] `isAuthenticated` remains false
- [x] Login form shows error message

**Technical notes:**
- Wrap login in try/catch; call `clearSession()` in catch before rethrowing
- Do not call `setToken(access_token)` until `/me` succeeds, OR rollback on failure

**Files:** `context/AuthContext.jsx`

---

### TASK-103 — Session Expired Message on Login ✅

| Field | Value |
|-------|-------|
| **Status** | ✅ Complete (2026-06-13) |
| **Priority** | P1 |
| **Issue** | AUTH-03 |
| **Effort** | S (1–2h) |
| **Dependencies** | TASK-101 |

**Description:** Show informative alert when user lands on login after session expiry.

**Acceptance criteria:**
- [x] 401 redirect includes reason (search param or location state)
- [x] Login page shows info/success `Alert`: "Your session expired. Please sign in again."
- [x] Alert is dismissible or clears on form interaction

**Technical notes:**
- Use `navigate('/login', { state: { reason: 'session_expired' } })` from auth handler
- Check `location.state?.reason` in `Login.jsx`

**Files:** `pages/Login.jsx`, auth expiry handler from TASK-101

---

### TASK-104 — Send content_snapshot with Votes ✅

| Field | Value |
|-------|-------|
| **Status** | ✅ Complete (2026-06-13) |
| **Priority** | P0 |
| **Issue** | VOTE-01 |
| **Effort** | M (4–8h) |
| **Dependencies** | None |

**Description:** Include section-specific metadata in vote POST payload.

**Acceptance criteria:**
- [x] Every successful vote POST includes non-empty `content_snapshot` object
- [x] Insight vote includes source, model, excerpt
- [x] News vote includes article IDs and titles
- [x] Prices vote includes coin IDs and price snapshot
- [x] Meme vote includes id, title, image_url, source
- [x] Backend stores snapshot (verify via API test)

**Technical notes:**
- Add snapshot builders in each section component or `utils/voteSnapshots.js`
- Extend `FeedbackControls` props: `contentSnapshot`
- Extend `submitVote` in `api/votes.js`
- Pass through `SectionCard` from sections

**Files:** `api/votes.js`, `ui/FeedbackControls.jsx`, `ui/SectionCard.jsx`, all 4 section components

---

### TASK-105 — Disable Voting on Empty/Error Placeholders ✅

| Field | Value |
|-------|-------|
| **Status** | ✅ Complete (2026-06-13) |
| **Priority** | P2 |
| **Issue** | VOTE-04 |
| **Effort** | S (1–2h) |
| **Dependencies** | None |

**Description:** Prevent votes on synthetic empty IDs and error states.

**Acceptance criteria:**
- [x] When section status is `error`, feedback buttons are disabled
- [x] When content is empty placeholder, feedback buttons are disabled
- [x] No votes POSTed with `item_reference` ending in `-empty`

**Technical notes:**
- Update `resolveItemReference` to return `""` for error status
- Or pass `disableFeedback` prop to `SectionCard`

**Files:** `hooks/useDashboardData.js`, `ui/SectionCard.jsx`, `ui/FeedbackControls.jsx`

---

## M7 — Personalization ✅ Complete

### TASK-201 — Define content_types → Section Mapping ✅

| Field | Value |
|-------|-------|
| **Status** | ✅ Complete (2026-06-13) |
| **Priority** | P1 |
| **Issue** | UX-02 |
| **Effort** | S (2h) |
| **Dependencies** | Product decision |

**Description:** Document and implement mapping from onboarding content preferences to dashboard behavior.

**Acceptance criteria:**
- [x] Mapping documented in `config/personalization.js`
- [x] Unit tests for mapping function
- [x] Product rules reviewed and approved

**Technical notes:**
```javascript
// config/personalization.js
export function getOrderedSectionIds(contentTypes) { ... }
export function orderDashboardSections(sections, contentTypes) { ... }
export function shouldExpandSection(sectionId, contentTypes) { ... }
```

**Files:** New `config/personalization.js`

---

### TASK-202 — Reorder/Hide Dashboard Sections by Preferences ✅

| Field | Value |
|-------|-------|
| **Status** | ✅ Complete (2026-06-13) |
| **Priority** | P1 |
| **Issue** | UX-02 |
| **Effort** | L (8–16h) |
| **Dependencies** | TASK-201 |

**Description:** Dashboard section order and default expand state reflect `content_types`.

**Acceptance criteria:**
- [x] User with "Charts" preference sees Coin Prices higher in layout
- [x] User with "Fun" preference sees Meme promoted
- [x] Sidebar nav order matches content order
- [x] Scroll-spy IDs still work after reorder

**Technical notes:**
- Derive ordered sections from `user.preferences.content_types`
- Update `Dashboard.jsx` to map over ordered config
- Sync `dashboardSections.js` with dynamic order

**Files:** `pages/Dashboard.jsx`, `config/dashboardSections.js`, `config/personalization.js`

---

### TASK-203 — Pass content_types to Backend Insight ✅

| Field | Value |
|-------|-------|
| **Status** | ✅ Complete (2026-06-13) |
| **Priority** | P1 |
| **Issue** | UX-02 |
| **Effort** | M (4h) |
| **Dependencies** | Backend change |

**Description:** Include content preferences in insight API request for backend tailoring.

**Acceptance criteria:**
- [x] Insight fetch sends user content_types (via auth context / JWT)
- [x] Backend insight prompt references content preferences
- [x] Insight text reflects preference (simulated + OpenRouter prompt updated)

**Technical notes:**
- Backend already reads user from JWT; extend `dashboard.py` to pass `content_types` to `generate_ai_insight`
- Coordinate with backend task

**Files:** `backend/app/api/routes/dashboard.py`, `backend/app/services/dashboard_service.py`

---

### TASK-204 — Add Preferences Settings Page ✅

| Field | Value |
|-------|-------|
| **Status** | ✅ Complete (2026-06-13) |
| **Priority** | P1 |
| **Issue** | UX-03 |
| **Effort** | M (6–10h) |
| **Dependencies** | Backend PATCH endpoint (or reuse onboarding POST) |

**Description:** Allow users to edit preferences after onboarding.

**Acceptance criteria:**
- [x] `/settings` route accessible from dashboard header
- [x] Pre-populated with current preferences
- [x] Save updates user in context and backend
- [x] Dashboard reflects changes without full re-login

**Technical notes:**
- Reuse onboarding form components in edit mode
- Add `RequireAuth requireOnboarding` route
- Link from `MainHeader` or `PreferencesSummary`

**Files:** New `pages/Settings.jsx`, `App.jsx`, `layout/MainHeader.jsx`, `api/auth.js`

---

## M8 — Resilience & Feedback

### TASK-301 — Stale Data Label on Refresh Failure

| Field | Value |
|-------|-------|
| **Priority** | P1 |
| **Issue** | UX-01 |
| **Effort** | M (4h) |
| **Dependencies** | None |

**Description:** When refresh fails but old data is shown, label it as potentially outdated.

**Acceptance criteria:**
- [ ] Section with refresh error shows "Data may be outdated" with last successful timestamp
- [ ] OR section data cleared on refresh failure (choose one approach, document in code)
- [ ] User understands data freshness state

**Technical notes:**
- Track `lastSuccessfulFetch` per section in `useDashboardData`
- Pass `isStale` prop to `SectionCard`

**Files:** `hooks/useDashboardData.js`, `ui/SectionCard.jsx`

---

### TASK-302 — Per-Section Retry

| Field | Value |
|-------|-------|
| **Priority** | P2 |
| **Issue** | UX-07 |
| **Effort** | M (4–6h) |
| **Dependencies** | None |

**Description:** Section retry button re-fetches only that section.

**Acceptance criteria:**
- [ ] News retry does not re-fetch prices, meme, insight
- [ ] Meme does not rotate when unrelated section retried
- [ ] Section status transitions: error → loading → success/error

**Technical notes:**
- Extract single-section fetch from `SECTION_FETCHERS` config
- Export `retrySection(key)` from `useDashboardData`
- Pass section-specific handler to each section component

**Files:** `hooks/useDashboardData.js`, section components, `ui/SectionCard.jsx`

---

### TASK-303 — Initial Load Failure Banner

| Field | Value |
|-------|-------|
| **Priority** | P2 |
| **Issue** | UX-08 |
| **Effort** | S (2h) |
| **Dependencies** | None |

**Description:** Show page-level notification when all sections fail on first load.

**Acceptance criteria:**
- [ ] When 4/4 sections fail on initial load, toast or banner appears
- [ ] Message: "Unable to load dashboard. Check your connection and try again."
- [ ] Retry action available

**Technical notes:**
- After initial `Promise.all`, if all failed and `!isRefresh`, set global error toast

**Files:** `hooks/useDashboardData.js`, `pages/Dashboard.jsx`

---

### TASK-304 — Backend GET Votes Endpoint

| Field | Value |
|-------|-------|
| **Priority** | P1 |
| **Issue** | VOTE-02 |
| **Effort** | M (4h) |
| **Dependencies** | Backend |

**Description:** Expose endpoint to fetch existing vote for user/section/item.

**Acceptance criteria:**
- [ ] `GET /api/votes?section=news&item_reference=...` returns vote or 404
- [ ] Authenticated users only
- [ ] Backend test coverage

**Technical notes:**
- Add route in `backend/app/api/routes/votes.py`
- Repository query by user_id + section + item_reference

**Files:** Backend vote routes/repo

---

### TASK-305 — Hydrate Vote UI from Server

| Field | Value |
|-------|-------|
| **Priority** | P1 |
| **Issue** | VOTE-02 |
| **Effort** | M (4h) |
| **Dependencies** | TASK-304 |

**Description:** Load and display existing vote when section content loads.

**Acceptance criteria:**
- [ ] Returning user sees selected thumb state for unchanged content
- [ ] Vote change still works (upsert)
- [ ] Loading state while fetching vote (optional spinner)

**Technical notes:**
- Add `fetchVote` to `api/votes.js`
- `useEffect` in `FeedbackControls` when `itemReference` changes

**Files:** `api/votes.js`, `ui/FeedbackControls.jsx`

---

### TASK-306 — Stable Insight Vote Keys

| Field | Value |
|-------|-------|
| **Priority** | P2 |
| **Issue** | VOTE-03 |
| **Effort** | S (2h) |
| **Dependencies** | Optional backend insight ID |

**Description:** Use unique daily key for insight votes.

**Acceptance criteria:**
- [ ] Each day's insight has distinct `item_reference`
- [ ] Refresh on same day may update content but key strategy documented
- [ ] Votes don't overwrite across days

**Technical notes:**
- Prefer backend `insight.id` if added to response
- Fallback: `${source}-${YYYY-MM-DD}` or hash of insight text

**Files:** `hooks/useDashboardData.js`, possibly backend insight schema

---

## M9 — Accessibility

### TASK-401 — FormField aria-describedby and aria-invalid

| Field | Value |
|-------|-------|
| **Priority** | P1 |
| **Issue** | A11Y-01 |
| **Effort** | S (2–3h) |
| **Dependencies** | None |

**Acceptance criteria:**
- [ ] Input with error has `aria-invalid="true"`
- [ ] Input references error element via `aria-describedby`
- [ ] axe-core reports no "form field missing label" or "error not associated"

**Technical notes:**
- Use `useId()` for error ID in `FormField`
- Clone child input or use React context to pass aria props

**Files:** `ui/FormField.jsx`, `ui/Input.jsx`

---

### TASK-402 — Mobile Menu aria-expanded

| Field | Value |
|-------|-------|
| **Priority** | P2 |
| **Issue** | A11Y-02 |
| **Effort** | S (1h) |
| **Dependencies** | None |

**Acceptance criteria:**
- [ ] Hamburger has `aria-expanded={mobileOpen}`
- [ ] Label toggles between "Open menu" / "Close menu"

**Files:** `layout/Sidebar.jsx`, `layout/DashboardLayout.jsx`, `layout/MainHeader.jsx`

---

### TASK-403 — Inert Main Content When Drawer Open

| Field | Value |
|-------|-------|
| **Priority** | P2 |
| **Issue** | A11Y-03 |
| **Effort** | S (2h) |
| **Dependencies** | None |

**Acceptance criteria:**
- [ ] When mobile drawer open, main content not focusable
- [ ] Tab cycle stays within drawer
- [ ] Works in Chrome, Firefox, Safari (use `inert` polyfill if needed)

**Files:** `layout/DashboardLayout.jsx`

---

### TASK-404 — Onboarding Progressbar Semantics

| Field | Value |
|-------|-------|
| **Priority** | P2 |
| **Issue** | A11Y-04 |
| **Effort** | S (1h) |
| **Dependencies** | None |

**Acceptance criteria:**
- [ ] Container has `role="progressbar"`
- [ ] `aria-valuenow`, `aria-valuemin="1"`, `aria-valuemax="3"`

**Files:** `ui/OnboardingProgress.jsx`

---

### TASK-405 — Onboarding Fieldsets

| Field | Value |
|-------|-------|
| **Priority** | P2 |
| **Issue** | A11Y-05 |
| **Effort** | S (2h) |
| **Dependencies** | None |

**Acceptance criteria:**
- [ ] Each onboarding step wrapped in `<fieldset>`
- [ ] `<legend>` matches step title (can be visually styled)
- [ ] Screen reader announces group name when entering options

**Files:** `pages/Onboarding.jsx`, optionally new `ui/Fieldset.jsx`

---

### TASK-406 — Feedback Group aria-label

| Field | Value |
|-------|-------|
| **Priority** | P3 |
| **Issue** | A11Y-06 |
| **Effort** | S (30min) |
| **Dependencies** | None |

**Acceptance criteria:**
- [ ] Vote container has `role="group" aria-label="Rate this content"`

**Files:** `ui/FeedbackControls.jsx`

---

### TASK-407 — Loading Screen role=status

| Field | Value |
|-------|-------|
| **Priority** | P3 |
| **Issue** | A11Y-07 |
| **Effort** | S (30min) |
| **Dependencies** | None |

**Acceptance criteria:**
- [ ] LoadingScreen wrapper has `role="status" aria-live="polite"`

**Files:** `components/ProtectedRoute.jsx`

---

### TASK-408 — Submit Button aria-busy

| Field | Value |
|-------|-------|
| **Priority** | P3 |
| **Issue** | A11Y-08 |
| **Effort** | S (1h) |
| **Dependencies** | None |

**Acceptance criteria:**
- [ ] Login, Signup, Onboarding submit buttons set `aria-busy={submitting}`

**Files:** `pages/Login.jsx`, `Signup.jsx`, `Onboarding.jsx`

---

### TASK-409 — Dismissible Toast

| Field | Value |
|-------|-------|
| **Priority** | P3 |
| **Issue** | A11Y-09 |
| **Effort** | S (2h) |
| **Dependencies** | None |

**Acceptance criteria:**
- [ ] Toast has close button with accessible name
- [ ] `aria-atomic="true"` on container
- [ ] Error toasts stay 5s; success 3s

**Files:** `ui/Toast.jsx`

---

## M10 — Design System & UX Polish

### TASK-501 — Create statusVariants.js

| Field | Value |
|-------|-------|
| **Priority** | P2 |
| **Issue** | ARCH-02 |
| **Effort** | S (2h) |
| **Dependencies** | None |

**Acceptance criteria:**
- [ ] Single variant map file
- [ ] Alert, Toast, StateMessage import from it
- [ ] Visual appearance unchanged (regression check)

**Files:** New `ui/statusVariants.js`, `Alert.jsx`, `Toast.jsx`, `StateMessage.jsx`

---

### TASK-502 — Extract BrandHeader Component

| Field | Value |
|-------|-------|
| **Priority** | P3 |
| **Issue** | ARCH-04 |
| **Effort** | S (2h) |
| **Dependencies** | None |

**Acceptance criteria:**
- [ ] AuthLayout and OnboardingLayout use BrandHeader
- [ ] No duplicated avatar/overline/title block

**Files:** New `ui/BrandHeader.jsx`, `AuthLayout.jsx`, `OnboardingLayout.jsx`

---

### TASK-503 — Extract Panel / StepCard

| Field | Value |
|-------|-------|
| **Priority** | P3 |
| **Issue** | ARCH-03 |
| **Effort** | S (2h) |
| **Dependencies** | None |

**Acceptance criteria:**
- [ ] Onboarding SelectionCard uses Panel
- [ ] Uses `rounded-card` not `rounded-xl`

**Files:** New `ui/Panel.jsx`, `pages/Onboarding.jsx`

---

### TASK-504 — Typography Token Migration

| Field | Value |
|-------|-------|
| **Priority** | P2 |
| **Issue** | UI-01, UI-03 |
| **Effort** | M (4h) |
| **Dependencies** | design-system-improvements.md typography spec |

**Acceptance criteria:**
- [ ] fontSize tokens in tailwind.config.js
- [ ] PageTitle and Overline components created
- [ ] Auth, onboarding, dashboard titles consistent

**Files:** `tailwind.config.js`, new components, layout files

---

### TASK-505 — Unify Card Border Radius

| Field | Value |
|-------|-------|
| **Priority** | P2 |
| **Issue** | UI-02 |
| **Effort** | S (2h) |
| **Dependencies** | TASK-503 |

**Acceptance criteria:**
- [ ] No `rounded-xl` on top-level card shells
- [ ] Nested tiles use `rounded-lg`

**Files:** Onboarding, CoinPricesSection, etc.

---

### TASK-506 — AI Insight Mobile Layout Fix

| Field | Value |
|-------|-------|
| **Priority** | P2 |
| **Issue** | UI-04 |
| **Effort** | S (1h) |
| **Dependencies** | None |

**Acceptance criteria:**
- [ ] At 375px width, insight text and illustration stack vertically
- [ ] No horizontal overflow or text truncation below 320px

**Files:** `sections/AiInsightSection.jsx`

---

### TASK-507 — Suppress Duplicate Error+Empty in SectionCard

| Field | Value |
|-------|-------|
| **Priority** | P2 |
| **Issue** | UI-05 |
| **Effort** | S (1h) |
| **Dependencies** | None |

**Acceptance criteria:**
- [ ] When section error present, expanded empty StateMessage not shown
- [ ] AI insight error state shows single error message

**Files:** `ui/SectionCard.jsx`, `ui/SectionContent.jsx`

---

### TASK-508 — Completion-Based Onboarding Progress

| Field | Value |
|-------|-------|
| **Priority** | P2 |
| **Issue** | UX-04 |
| **Effort** | M (4h) |
| **Dependencies** | None |

**Acceptance criteria:**
- [ ] Progress step reflects completed selections, not scroll position
- [ ] Step 2 active only when ≥1 asset selected
- [ ] Step 3 active only when investor type selected

**Files:** `pages/Onboarding.jsx`, `ui/OnboardingProgress.jsx`

---

### TASK-509 — Inline Onboarding Validation

| Field | Value |
|-------|-------|
| **Priority** | P2 |
| **Issue** | UX-05 |
| **Effort** | M (4h) |
| **Dependencies** | TASK-405, TASK-401 |

**Acceptance criteria:**
- [ ] Field-level errors on each step
- [ ] Scroll to first invalid section on submit
- [ ] Top Alert retained as summary

**Files:** `pages/Onboarding.jsx`

---

### TASK-510 — Post-Signup Success Alert

| Field | Value |
|-------|-------|
| **Priority** | P2 |
| **Issue** | UX-06 |
| **Effort** | S (1h) |
| **Dependencies** | None |

**Acceptance criteria:**
- [ ] Login shows success Alert when redirected from signup
- [ ] Message: "Account created successfully. Sign in to continue."

**Files:** `pages/Signup.jsx`, `pages/Login.jsx`

---

### TASK-511 — Auth-Aware Root Redirect

| Field | Value |
|-------|-------|
| **Priority** | P3 |
| **Issue** | UX-09 |
| **Effort** | S (1h) |
| **Dependencies** | None |

**Acceptance criteria:**
- [ ] `/` resolves directly to login/onboarding/dashboard without double hop

**Files:** `App.jsx` — replace static Navigate with auth-aware component

---

### TASK-512 — Not Found Page

| Field | Value |
|-------|-------|
| **Priority** | P3 |
| **Issue** | UX-10 |
| **Effort** | S (2h) |
| **Dependencies** | None |

**Acceptance criteria:**
- [ ] Unknown routes show friendly 404 with link to dashboard/login
- [ ] Does not silently redirect without message

**Files:** New `pages/NotFound.jsx`, `App.jsx`

---

### TASK-513 — Consolidate Spinners

| Field | Value |
|-------|-------|
| **Priority** | P3 |
| **Issue** | ARCH-01 |
| **Effort** | S (1h) |
| **Dependencies** | None |

**Acceptance criteria:**
- [ ] ProtectedRoute and SectionCard use Spinner component
- [ ] No inline border spinners remain

**Files:** `ProtectedRoute.jsx`, `SectionCard.jsx`

---

### TASK-514 — Fix API Base URL Default

| Field | Value |
|-------|-------|
| **Priority** | P2 |
| **Issue** | ARCH-05 |
| **Effort** | S (30min) |
| **Dependencies** | None |

**Acceptance criteria:**
- [ ] Default base URL aligns with vite proxy (8000 or relative)
- [ ] `.env.example` documents `VITE_API_BASE_URL`

**Files:** `api/client.js`, `.env.example`

---

### TASK-515 — Remove Unused Code

| Field | Value |
|-------|-------|
| **Priority** | P3 |
| **Issue** | ARCH-07, ARCH-08 |
| **Effort** | S (1h) |
| **Dependencies** | None |

**Acceptance criteria:**
- [ ] No unused imports in Onboarding.jsx
- [ ] Button danger variant used or removed

**Files:** `pages/Onboarding.jsx`, `ui/Button.jsx`

---

### TASK-516 — Separate isInitialLoading from isRefreshing

| Field | Value |
|-------|-------|
| **Priority** | P3 |
| **Issue** | UI-06 |
| **Effort** | S (1h) |
| **Dependencies** | None |

**Acceptance criteria:**
- [ ] Refresh button enabled during initial section load (after first paint optional)
- [ ] Refresh disabled only during active refresh operation

**Files:** `hooks/useDashboardData.js`, `layout/Sidebar.jsx`

---

## M11 — Quality Infrastructure

### TASK-601 — Add Playwright to Frontend Tooling

| Field | Value |
|-------|-------|
| **Priority** | P2 |
| **Issue** | ARCH-09 |
| **Effort** | M (4h) |
| **Dependencies** | None |

**Acceptance criteria:**
- [ ] `@playwright/test` in devDependencies
- [ ] `npm run test:e2e` executes `e2e/smoke.spec.js`
- [ ] Document setup in README

**Files:** `frontend/package.json`, `playwright.config.js`

---

### TASK-602 — GitHub Actions E2E Workflow

| Field | Value |
|-------|-------|
| **Priority** | P2 |
| **Issue** | ARCH-09 |
| **Effort** | M (4h) |
| **Dependencies** | TASK-601 |

**Acceptance criteria:**
- [ ] CI starts backend + frontend, runs smoke tests
- [ ] Fails PR on test failure

**Files:** `.github/workflows/e2e.yml`

---

### TASK-603 — Component Tests with Vitest

| Field | Value |
|-------|-------|
| **Priority** | P3 |
| **Issue** | ARCH-10 |
| **Effort** | L (8–16h) |
| **Dependencies** | None |

**Acceptance criteria:**
- [ ] Vitest + RTL configured
- [ ] Tests for SectionCard states (loading, error, empty, success)
- [ ] Tests for resolvePostAuthPath
- [ ] Tests for AuthContext login/logout

**Files:** New test files, `vite.config.js`

---

### TASK-604 — ESLint + Prettier Setup

| Field | Value |
|-------|-------|
| **Priority** | P3 |
| **Issue** | ARCH-07 |
| **Effort** | M (4h) |
| **Dependencies** | None |

**Acceptance criteria:**
- [ ] ESLint catches unused imports
- [ ] Prettier formats JSX consistently
- [ ] npm run lint script

**Files:** `eslint.config.js`, `.prettierrc`, `package.json`

---

## Task Summary by Milestone

| Milestone | Tasks | P0 | P1 | P2 | P3 |
|-----------|-------|----|----|----|-----|
| M6 | 101–105 | 2 | 2 | 1 | 0 | **✅ Complete** |
| M7 | 201–204 | 0 | 4 | 0 | 0 | **✅ Complete** |
| M8 | 301–306 | 0 | 3 | 3 | 0 |
| M9 | 401–409 | 0 | 1 | 5 | 3 |
| M10 | 501–516 | 0 | 0 | 8 | 8 |
| M11 | 601–604 | 0 | 0 | 2 | 2 |
| **Total** | **42** | **2** | **10** | **19** | **13** |

---

## Definition of Done (Global)

- [ ] Code reviewed
- [ ] No new linter errors
- [ ] Existing unit tests pass (`npm test`)
- [ ] Manual QA on mobile (375px) and desktop (1280px)
- [ ] Accessibility spot-check for touched flows
- [ ] Audit issue marked resolved in ui-audit-report.md (when implementing)

---

## Related Documents

- [UI Audit Report](ui-audit-report.md)
- [Frontend Roadmap](frontend-roadmap.md)
- [Design System Improvements](design-system-improvements.md)
