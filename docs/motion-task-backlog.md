# Motion Task Backlog — Piggy Daily

**Last updated:** June 13, 2026  
**Total tasks:** 22  
**Status:** ✅ All tasks complete (M12–M15)

---

## M12 — Motion Foundation

### MOT-TASK-001 — CSS Motion Variables

| Field | Value |
|-------|-------|
| **Priority** | P0 |
| **Issue** | MOT-25 |
| **Effort** | S |

**Acceptance criteria:**
- [x] `:root` defines `--motion-fast/normal/slow/slower` and easing vars
- [x] Documented in motion-audit.md

**Files:** `frontend/src/index.css`

---

### MOT-TASK-002 — Tailwind Motion Extensions

| Field | Value |
|-------|-------|
| **Priority** | P0 |
| **Issue** | MOT-25 |
| **Effort** | S |
| **Dependencies** | MOT-TASK-001 |

**Acceptance criteria:**
- [x] `transitionDuration`, `transitionTimingFunction` map to CSS vars
- [x] Keyframes: shimmer, fadeIn, slideUp, scaleIn, flash
- [x] Animations: shimmer, fade-in, slide-up, scale-in, flash

**Files:** `frontend/tailwind.config.js`

---

### MOT-TASK-003 — Motion Utility Classes

| Field | Value |
|-------|-------|
| **Priority** | P0 |
| **Effort** | S |
| **Dependencies** | MOT-TASK-001 |

**Acceptance criteria:**
- [x] `.motion-interactive`, `.motion-card`, `.motion-press`, `.motion-shimmer`, `.motion-fade-in`, `.motion-slide-up`, `.motion-stagger-item`
- [x] All include `motion-reduce:transition-none motion-reduce:animate-none`

**Files:** `frontend/src/index.css`

---

### MOT-TASK-004 — usePrefersReducedMotion Hook

| Field | Value |
|-------|-------|
| **Priority** | P0 |
| **Effort** | S |

**Acceptance criteria:**
- [x] Hook returns boolean synced to `(prefers-reduced-motion: reduce)`
- [x] Listens for media query changes

**Files:** `frontend/src/hooks/usePrefersReducedMotion.js`

---

## M13 — Feedback Layer

### MOT-TASK-010 — Toast Enter/Exit Motion

| Field | Value |
|-------|-------|
| **Priority** | P1 |
| **Issue** | MOT-02 |
| **Effort** | S |
| **Dependencies** | M12 |

**Acceptance criteria:**
- [x] Toast slides up + fades in on appear
- [x] Toast fades out on dismiss (before unmount)
- [x] RM: instant show/hide

**Files:** `frontend/src/components/ui/Toast.jsx`

---

### MOT-TASK-011 — Alert Fade-In

| Field | Value |
|-------|-------|
| **Priority** | P1 |
| **Issue** | MOT-03 |
| **Effort** | S |
| **Dependencies** | M12 |

**Acceptance criteria:**
- [x] Alert uses `motion-fade-in` on mount

**Files:** `frontend/src/components/ui/Alert.jsx`

---

### MOT-TASK-012 — Button Press & Interactive Motion

| Field | Value |
|-------|-------|
| **Priority** | P1 |
| **Issue** | MOT-04 |
| **Effort** | S |
| **Dependencies** | M12 |

**Acceptance criteria:**
- [x] Button uses `motion-interactive motion-press`
- [x] Hover uses tokenized duration/easing

**Files:** `frontend/src/components/ui/Button.jsx`

---

### MOT-TASK-013 — Selection Card Motion

| Field | Value |
|-------|-------|
| **Priority** | P2 |
| **Issue** | MOT-05 |
| **Effort** | S |
| **Dependencies** | M12 |

**Acceptance criteria:**
- [x] CheckboxCard/RadioCard use snappy transition on border/bg
- [x] Subtle scale on checked state

**Files:** `CheckboxCard.jsx`, `RadioCard.jsx`

---

### MOT-TASK-014 — Vote Thumb Motion

| Field | Value |
|-------|-------|
| **Priority** | P1 |
| **Issue** | MOT-07 |
| **Effort** | S |
| **Dependencies** | M12 |

**Acceptance criteria:**
- [x] Selected thumb scales subtly
- [x] Success/error message fades in

**Files:** `frontend/src/components/ui/FeedbackControls.jsx`

---

### MOT-TASK-015 — LazyImage Fade-In

| Field | Value |
|-------|-------|
| **Priority** | P2 |
| **Issue** | MOT-06 |
| **Effort** | S |
| **Dependencies** | M12 |

**Acceptance criteria:**
- [x] Image opacity transitions over `duration-normal`

**Files:** `frontend/src/components/ui/LazyImage.jsx`

---

### MOT-TASK-016 — Shimmer Skeleton

| Field | Value |
|-------|-------|
| **Priority** | P2 |
| **Issue** | MOT-18 |
| **Effort** | S |
| **Dependencies** | M12 |

**Acceptance criteria:**
- [x] Skeleton bars use shimmer gradient animation
- [x] RM: static pulse fallback

**Files:** `frontend/src/components/ui/ContentSkeleton.jsx`

---

## M14 — Dashboard Orchestration

### MOT-TASK-030 — Dashboard Section Stagger

| Field | Value |
|-------|-------|
| **Priority** | P1 |
| **Issue** | MOT-11, MOT-19 |
| **Effort** | M |
| **Dependencies** | M12 |

**Acceptance criteria:**
- [x] Sections fade-in with 60ms stagger via `--motion-delay`
- [x] Hero insight section first (0ms delay)

**Files:** `Dashboard.jsx`, `SectionCard.jsx`

---

### MOT-TASK-031 — Refresh Overlay Fade

| Field | Value |
|-------|-------|
| **Priority** | P2 |
| **Issue** | MOT-12 |
| **Effort** | S |
| **Dependencies** | M12 |

**Acceptance criteria:**
- [x] Overlay fades in/out over 150ms

**Files:** `SectionCard.jsx`

---

### MOT-TASK-032 — Section Collapse Crossfade

| Field | Value |
|-------|-------|
| **Priority** | P2 |
| **Issue** | MOT-16 |
| **Effort** | M |
| **Dependencies** | M12 |

**Acceptance criteria:**
- [x] Preview/content swap uses opacity transition, not instant

**Files:** `SectionCard.jsx`

---

### MOT-TASK-033 — News List Stagger

| Field | Value |
|-------|-------|
| **Priority** | P2 |
| **Issue** | MOT-15 |
| **Effort** | S |
| **Dependencies** | M12 |

**Acceptance criteria:**
- [x] News article rows stagger fade-in

**Files:** `MarketNewsSection.jsx`

---

### MOT-TASK-034 — Price Tile Motion

| Field | Value |
|-------|-------|
| **Priority** | P2 |
| **Issue** | MOT-13, MOT-14 |
| **Effort** | M |
| **Dependencies** | M12 |

**Acceptance criteria:**
- [x] Price tiles use `motion-card` hover lift
- [x] Sparkline draw animation on mount (RM-off)

**Files:** `CoinPricesSection.jsx`, `PriceSparkline.jsx`

---

### MOT-TASK-035 — Sidebar & StateMessage Polish

| Field | Value |
|-------|-------|
| **Priority** | P3 |
| **Issue** | MOT-20, MOT-21, MOT-24 |
| **Effort** | S |
| **Dependencies** | M12 |

**Acceptance criteria:**
- [x] Nav items transition colors smoothly
- [x] Backdrop fades with drawer
- [x] StateMessage fades in

**Files:** `Sidebar.jsx`, `StateMessage.jsx`

---

## M15 — Flow & Delight

### MOT-TASK-020 — Route View Transitions

| Field | Value |
|-------|-------|
| **Priority** | P1 |
| **Issue** | MOT-01 |
| **Effort** | M |
| **Dependencies** | M12 |

**Acceptance criteria:**
- [x] Route changes use `document.startViewTransition()` when supported
- [x] Fallback: instant navigation (no regression)

**Files:** `App.jsx`, new `AnimatedOutlet.jsx` or similar

---

### MOT-TASK-021 — Onboarding Success Moment

| Field | Value |
|-------|-------|
| **Priority** | P1 |
| **Issue** | MOT-09 |
| **Effort** | M |
| **Dependencies** | M12 |

**Acceptance criteria:**
- [x] Success overlay shows ~400ms before navigate
- [x] RM: skip delay, navigate immediately

**Files:** `Onboarding.jsx`

---

### MOT-TASK-022 — Branded Loading Screen

| Field | Value |
|-------|-------|
| **Priority** | P2 |
| **Issue** | MOT-18 |
| **Effort** | S |
| **Dependencies** | M12 |

**Acceptance criteria:**
- [x] Avatar, spinner, text stagger fade-in

**Files:** `ProtectedRoute.jsx`

---

### MOT-TASK-023 — Signup Success on Login

| Field | Value |
|-------|-------|
| **Priority** | P2 |
| **Issue** | MOT-08 |
| **Effort** | S |
| **Dependencies** | MOT-011 |

**Acceptance criteria:**
- [x] Signup passes `signupSuccess: true`
- [x] Login shows animated success Alert

**Files:** `Signup.jsx`, `Login.jsx`

---

## Validation (Every Batch)

- [x] `npm run build`
- [x] `npm test`
- [x] Manual: `prefers-reduced-motion` in DevTools
- [x] No CLS from motion additions

---

## Related Documents

- [Motion Audit](motion-audit.md)
- [Motion Roadmap](motion-roadmap.md)
