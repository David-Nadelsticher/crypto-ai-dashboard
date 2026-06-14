# Motion, Interaction & UX Audit — Piggy Daily

**Audit date:** June 13, 2026  
**Scope:** Full application — auth, onboarding, dashboard, settings  
**Methods:** Static code review, interaction flow analysis, motion inventory  
**Auditor roles:** Senior Product Designer, Motion Designer, UX Expert, Frontend Architect

---

## Executive Summary

Piggy Daily is functionally solid but **motion-immature**. Interaction feedback relies on instant state swaps, generic Tailwind `transition` classes, and utilitarian spinners. The best existing motion is the mobile sidebar slide and `SectionCard` collapse grid. There is **no motion design system**, no page transitions, and no orchestrated content reveal.

| Category | Critical | High | Medium | Low | Total |
|----------|----------|------|--------|-----|-------|
| Interaction Design | 0 | 6 | 4 | 2 | 12 |
| Motion Design | 0 | 5 | 6 | 3 | 14 |
| Engagement | 0 | 2 | 4 | 3 | 9 |
| Feedback System | 0 | 3 | 2 | 1 | 6 |
| **Total** | **0** | **16** | **16** | **9** | **41** |

**Post-implementation target:** CSS-first motion system (M12–M15) with zero animation library dependency for core polish.

---

## Current Motion Inventory

| Pattern | Location | Assessment |
|---------|----------|------------|
| `transition` opacity hover | `Button.jsx`, nav | Flat, no press state |
| Grid collapse 300ms | `SectionCard.jsx` | Good foundation |
| Drawer translate 300ms | `Sidebar.jsx` | Good |
| `animate-pulse` | `ContentSkeleton.jsx`, `LazyImage.jsx` | Generic |
| `animate-spin` | `Spinner.jsx`, loaders | Utilitarian |
| Chevron rotate | `SectionCard.jsx` | Good |
| Global RM override | `index.css` | Strong a11y baseline |
| **None** | Routes, Toast, Alert, prices, lists | Major gaps |

---

## Issue Register

Format: Title | Severity | Location | Description | User Impact | Solution | Effort | Dependencies

---

### MOT-01 — Instant Route Hard Cuts

| Field | Value |
|-------|-------|
| **Severity** | High |
| **Location** | `App.jsx`, all pages |
| **Description** | Login → onboarding → dashboard transitions are instant DOM swaps with no continuity. |
| **User Impact** | Feels like separate apps stitched together; breaks premium SaaS perception. |
| **Solution** | CSS View Transitions API wrapper on route outlet; crossfade root content. |
| **Effort** | Medium |
| **Dependencies** | M12 tokens, MOT-TASK-020 |

---

### MOT-02 — Toast Appears/Vanishes Without Motion

| Field | Value |
|-------|-------|
| **Severity** | High |
| **Location** | `Toast.jsx` |
| **Description** | Refresh success/error toasts pop in and out instantly at fixed position. |
| **User Impact** | Easy to miss feedback, especially on mobile; feels unpolished. |
| **Solution** | Slide-up enter + fade exit using `motion-slide-up` utility. |
| **Effort** | Small |
| **Dependencies** | M12 |

---

### MOT-03 — Alerts Pop In Abruptly

| Field | Value |
|-------|-------|
| **Severity** | Medium |
| **Location** | `Alert.jsx`, Login, Signup, Onboarding, Settings |
| **Description** | Error/success/info alerts appear without entrance animation. |
| **User Impact** | Jarring context shift; errors feel harsh rather than guided. |
| **Solution** | `motion-fade-in` + subtle slide on mount. |
| **Effort** | Small |
| **Dependencies** | M12 |

---

### MOT-04 — Buttons Lack Press Affordance

| Field | Value |
|-------|-------|
| **Severity** | High |
| **Location** | `Button.jsx` |
| **Description** | Only `hover:opacity-90`; no active/press scale or timing tokens. |
| **User Impact** | Buttons feel static; users unsure if click registered. |
| **Solution** | `motion-interactive` + `motion-press` (`active:scale-[0.98]`). |
| **Effort** | Small |
| **Dependencies** | M12 |

---

### MOT-05 — Selection Cards Snap State

| Field | Value |
|-------|-------|
| **Severity** | Medium |
| **Location** | `CheckboxCard.jsx`, `RadioCard.jsx` |
| **Description** | Border/background changes instantly on select; no spring or scale cue. |
| **User Impact** | Selection feels mechanical; onboarding lacks delight. |
| **Solution** | Transition colors with `duration-normal ease-snappy`; subtle scale on check. |
| **Effort** | Small |
| **Dependencies** | M12 |

---

### MOT-06 — LazyImage Opacity Swap Without Transition

| Field | Value |
|-------|-------|
| **Severity** | Medium |
| **Location** | `LazyImage.jsx` |
| **Description** | Image jumps from `opacity-0` to `opacity-100` without duration. |
| **User Impact** | Meme/illustration loads feel abrupt. |
| **Solution** | Add `transition-opacity duration-normal`. |
| **Effort** | Small |
| **Dependencies** | M12 |

---

### MOT-07 — Vote Feedback Is Text-Only

| Field | Value |
|-------|-------|
| **Severity** | High |
| **Location** | `FeedbackControls.jsx` |
| **Description** | Thumb selection changes color instantly; success message fades in as plain text. |
| **User Impact** | Voting feels low-stakes; users may not notice confirmation. |
| **Solution** | Scale transition on selected thumb; animated success message entrance. |
| **Effort** | Small |
| **Dependencies** | M12 |

---

### MOT-08 — No Signup Success Moment

| Field | Value |
|-------|-------|
| **Severity** | Medium |
| **Location** | `Signup.jsx` → `Login.jsx` |
| **Description** | Signup redirects to login with email pre-fill but no success celebration. |
| **User Impact** | Users uncertain if account was created. |
| **Solution** | Pass `signupSuccess` state; show animated success Alert on login. |
| **Effort** | Small |
| **Dependencies** | MOT-03 |

---

### MOT-09 — Onboarding Completion Is Abrupt

| Field | Value |
|-------|-------|
| **Severity** | High |
| **Location** | `Onboarding.jsx` |
| **Description** | Successful save immediately navigates to dashboard. |
| **User Impact** | Missed milestone moment; onboarding feels transactional. |
| **Solution** | 400ms success overlay ("Your brief is ready") before navigate. |
| **Effort** | Medium |
| **Dependencies** | M12, MOT-TASK-021 |

---

### MOT-10 — Settings Save Success Is Static

| Field | Value |
|-------|-------|
| **Severity** | Low |
| **Location** | `Settings.jsx` |
| **Description** | Success Alert appears without motion after save. |
| **User Impact** | Minor; save confirmation easy to overlook. |
| **Solution** | Animated Alert entrance (same as MOT-03). |
| **Effort** | Small |
| **Dependencies** | MOT-03 |

---

### MOT-11 — Dashboard Sections Mount Simultaneously

| Field | Value |
|-------|-------|
| **Severity** | High |
| **Location** | `Dashboard.jsx` |
| **Description** | All four sections appear at once when data loads. |
| **User Impact** | No visual hierarchy; eye doesn't know where to start. |
| **Solution** | Stagger `motion-fade-in` via CSS `--motion-delay` per section (60ms steps). |
| **Effort** | Medium |
| **Dependencies** | M12, MOT-TASK-030 |

---

### MOT-12 — Refresh Overlay Is Binary

| Field | Value |
|-------|-------|
| **Severity** | Medium |
| **Location** | `SectionCard.jsx` |
| **Description** | Refresh overlay appears/disappears instantly. |
| **User Impact** | Jarring flash during refresh; feels broken rather than updating. |
| **Solution** | Fade overlay in/out over 150ms. |
| **Effort** | Small |
| **Dependencies** | M12 |

---

### MOT-13 — Price Values Jump on Refresh

| Field | Value |
|-------|-------|
| **Severity** | Medium |
| **Location** | `CoinPricesSection.jsx` |
| **Description** | Price numbers swap instantly when data refreshes. |
| **User Impact** | Hard to notice what changed; reduces trust in live data. |
| **Solution** | Brief highlight flash on updated values via `motion-flash` keyframe. |
| **Effort** | Medium |
| **Dependencies** | M12 |

---

### MOT-14 — Sparklines Are Static SVG

| Field | Value |
|-------|-------|
| **Severity** | Low |
| **Location** | `PriceSparkline.jsx` |
| **Description** | Sparkline paths render fully with no draw animation. |
| **User Impact** | Missed opportunity for data vitality. |
| **Solution** | CSS `stroke-dashoffset` draw on mount (RM-safe off). |
| **Effort** | Small |
| **Dependencies** | M12 |

---

### MOT-15 — News List Items Have No Enter Animation

| Field | Value |
|-------|-------|
| **Severity** | Medium |
| **Location** | `MarketNewsSection.jsx` |
| **Description** | Article rows appear instantly when section expands. |
| **User Impact** | Content feels dumped rather than curated. |
| **Solution** | Stagger fade-in per list item. |
| **Effort** | Small |
| **Dependencies** | M12 |

---

### MOT-16 — Section Collapse Preview Swap Is Abrupt

| Field | Value |
|-------|-------|
| **Severity** | Medium |
| **Location** | `SectionCard.jsx` L197–199 |
| **Description** | Collapsed preview appears instantly when expanded content hides. |
| **User Impact** | Layout feels jumpy during expand/collapse. |
| **Solution** | Crossfade preview/content with opacity transition. |
| **Effort** | Medium |
| **Dependencies** | M12 |

---

### MOT-17 — Onboarding Progress Bar Color-Only

| Field | Value |
|-------|-------|
| **Severity** | Low |
| **Location** | `OnboardingProgress.jsx` |
| **Description** | Step bars change color on scroll but don't animate fill. |
| **User Impact** | Progress feels passive, not earned. |
| **Solution** | `transition-colors duration-normal` (already partial); add width/fill if step-based. |
| **Effort** | Small |
| **Dependencies** | M12 |

---

### MOT-18 — Loading Screen Is Spinner-Only

| Field | Value |
|-------|-------|
| **Severity** | Medium |
| **Location** | `ProtectedRoute.jsx` |
| **Description** | Auth bootstrap shows spinner + text with no brand entrance. |
| **User Impact** | First impression is generic, not Piggy-branded. |
| **Solution** | Staggered fade-in for avatar, spinner, text. |
| **Effort** | Small |
| **Dependencies** | M12, MOT-TASK-022 |

---

### MOT-19 — AI Insight Hero Lacks Entrance Emphasis

| Field | Value |
|-------|-------|
| **Severity** | Medium |
| **Location** | `AiInsightSection.jsx`, `SectionCard.jsx` hero variant |
| **Description** | Hero card mounts without emphasis despite being primary content. |
| **User Impact** | AI insight doesn't feel like the centerpiece. |
| **Solution** | First section gets zero delay stagger; optional subtle scale-in. |
| **Effort** | Small |
| **Dependencies** | MOT-11 |

---

### MOT-20 — Sidebar Active Nav Snaps

| Field | Value |
|-------|-------|
| **Severity** | Low |
| **Location** | `Sidebar.jsx` |
| **Description** | Active nav item background/border changes instantly on scroll-spy. |
| **User Impact** | Navigation feels disconnected from scroll position. |
| **Solution** | Transition background/border colors with motion tokens. |
| **Effort** | Small |
| **Dependencies** | M12 |

---

### MOT-21 — Empty/Error States Are Static

| Field | Value |
|-------|-------|
| **Severity** | Low |
| **Location** | `StateMessage.jsx` |
| **Description** | Empty and error panels appear without entrance. |
| **User Impact** | States feel like afterthoughts. |
| **Solution** | `motion-fade-in` on StateMessage container. |
| **Effort** | Small |
| **Dependencies** | M12 |

---

### MOT-22 — Meme Image Reveal Is Functional Only

| Field | Value |
|-------|-------|
| **Severity** | Low |
| **Location** | `MemeSection.jsx`, `LazyImage.jsx` |
| **Description** | Meme loads with basic opacity swap; no scale or delight. |
| **User Impact** | Fun section doesn't feel fun. |
| **Solution** | Scale-in on image load; optional "new" badge on refresh. |
| **Effort** | Small |
| **Dependencies** | MOT-06 |

---

### MOT-23 — Login Submit Lacks Loading Feedback Beyond Text

| Field | Value |
|-------|-------|
| **Severity** | Medium |
| **Location** | `Login.jsx` |
| **Description** | Button text changes to "Signing in..." but no spinner or press feedback. |
| **User Impact** | Slow networks feel unresponsive. |
| **Solution** | Inline spinner in button + `aria-busy`; motion-press on click. |
| **Effort** | Small |
| **Dependencies** | MOT-04 |

---

### MOT-24 — Mobile Drawer Backdrop Instant

| Field | Value |
|-------|-------|
| **Severity** | Low |
| **Location** | `Sidebar.jsx` backdrop |
| **Description** | Backdrop appears/disappears without fade. |
| **User Impact** | Drawer feels less modal; context switch is harsh. |
| **Solution** | Backdrop fade 200ms with drawer slide. |
| **Effort** | Small |
| **Dependencies** | M12 |

---

### MOT-25 — No Motion Design Tokens

| Field | Value |
|-------|-------|
| **Severity** | High |
| **Location** | `index.css`, `tailwind.config.js` |
| **Description** | Durations and easings are ad hoc (`duration-300`, `ease-out`). |
| **User Impact** | Inconsistent motion rhythm across app. |
| **Solution** | Define `--motion-*` CSS vars + Tailwind extensions. |
| **Effort** | Medium |
| **Dependencies** | M12 foundation |

---

## Feedback Matrix (Pre-Implementation)

| Action | Visual | Motion | Audio/Haptic |
|--------|--------|--------|--------------|
| Login | Text change | None | — |
| Signup | Error alert | None | — |
| Onboarding save | Navigate | None | — |
| Dashboard refresh | Overlay + toast | Overlay instant | — |
| Vote | Inline text | None | — |
| Section expand | Grid collapse | Partial | — |
| Settings save | Static alert | None | — |
| Image load | Opacity snap | None | — |

---

## Accessibility Notes

- Global `prefers-reduced-motion: reduce` in `index.css` disables all transitions — correct behavior.
- New motion MUST use `motion-reduce:transition-none motion-reduce:animate-none` on animated elements.
- JS-driven animation MUST gate on `usePrefersReducedMotion()`.
- Toasts/alerts must retain `role="status"` / `role="alert"` and `aria-live`.
- Motion must not delay critical interactions beyond 500ms.

---

## Related Documents

- [Motion Roadmap](motion-roadmap.md)
- [Motion Task Backlog](motion-task-backlog.md)
- [Design System Improvements](design-system-improvements.md)
