# Documentation Index — Piggy Daily Frontend Audit

**Audit date:** June 13, 2026  
**Re-audit date:** June 13, 2026 (post-fix)

This folder contains the complete UI/UX audit and improvement planning for the Piggy Daily crypto dashboard frontend.

---

## Documents

| Document | Description |
|----------|-------------|
| [UI Audit Report](ui-audit-report.md) | **Post-fix re-audit** — 11 open issues (4 Medium, 7 Low); 30 original issues resolved. Playwright observations and WCAG checklist. |
| [Frontend Roadmap](frontend-roadmap.md) | M1–M4 verified complete; **M5 Polish & Hardening** next. |
| [Task Backlog](task-backlog.md) | 41 tasks — TASK-001–031 verified; TASK-032–041 open (M5). |
| [Design System Improvements](design-system-improvements.md) | Reconciled token/component spec; M5 migration targets. |
| [Progress Log](progress-log.md) | Unified execution log + post-fix re-audit entry. |
| [Milestone 1 Progress Log](milestone-1-progress-log.md) | Detailed M1 execution log (historical). |

---

## Screenshots

### Post-fix (current)

Playwright re-audit screenshots: [`audit-screenshots/post-fix/`](audit-screenshots/post-fix/)

| File | Screen |
|------|--------|
| `login-{mobile,tablet,desktop}.png` | Login page |
| `login-error-desktop.png` | Login with invalid credentials |
| `signup-{mobile,tablet,desktop}.png` | Signup page |
| `onboarding-{mobile,tablet,desktop}.png` | Onboarding flow (PRD options) |
| `dashboard-{mobile,tablet,desktop}.png` | Dashboard |
| `dashboard-mobile-menu.png` | Mobile sidebar overlay |
| `dashboard-refresh-mobile.png` | Refresh overlay state |
| `dashboard-vote-success-desktop.png` | Feedback vote success |
| `loading-screen-desktop.png` | Auth bootstrap loading |
| `a11y-{login,dashboard}-snapshot.md` | Accessibility spot-check notes |

### Pre-fix (historical baseline)

Original audit evidence: [`audit-screenshots/`](audit-screenshots/) (if present from initial audit)

---

## Quick Stats (Post-Fix)

| Metric | Value |
|--------|-------|
| Original issues | 30 (all resolved) |
| Open issues | 11 (NEW-1 – NEW-11) |
| Implementation tasks | 41 (31 verified + 10 open) |
| Milestones complete | M1–M4 |
| Next milestone | M5 — Polish & Hardening |
| Screens audited | 5 routes + loading + mobile menu |
| Viewports tested | 375px, 768px, 1280px |
| Unit tests | 11 passing (`npm test` in frontend) |
| E2E tests | Spec written; run pending Playwright install |

---

## How to Re-Run Verification

```powershell
# Terminal 1 — backend
cd backend
uvicorn app.main:app --reload

# Terminal 2 — frontend
cd frontend
npm run dev

# Seed test user (if needed)
cd backend
python -m app.seed_db
```

```bash
# Unit tests
cd frontend && npm test

# E2E (after npm install + playwright install)
npm run test:e2e
```

Use Playwright MCP or `scripts/capture-audit-screenshots.mjs` to refresh post-fix screenshots.
