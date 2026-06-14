# Design System Improvements — Piggy Daily

**Last updated:** June 13, 2026  
**Status:** Recommendations for M10 milestone  
**Current foundation:** CSS variables in `index.css` → Tailwind `piggy-*` tokens; ~20 UI primitives in `components/ui/`

---

## Current State Assessment

### What works well
- Cohesive Piggy palette with semantic positive/negative colors
- Shared `Button`, `Input`, `FormField`, `SectionCard` patterns
- Global `.focus-ring` utility for keyboard focus
- `prefers-reduced-motion` respected in layout and animations
- Consistent cream/card background hierarchy

### Gaps
- No typography scale tokens (sizes applied ad hoc)
- No spacing scale documentation
- Card radius split between `rounded-card` and `rounded-xl`
- Three parallel status-banner styling systems
- Button ecosystem split: `Button` component vs inline vote/nav styles
- SVG illustrations hardcode hex values outside token set

---

## Token Recommendations

### 1. Color tokens (extend existing)

Current tokens in `:root` are sufficient for MVP. Add semantic aliases:

| Token | Maps to | Usage |
|-------|---------|-------|
| `--color-surface-page` | `piggy-cream` | Page background |
| `--color-surface-card` | `piggy-card` | Card background |
| `--color-surface-muted` | `piggy-cream/50` | Nested tiles |
| `--color-text-primary` | `piggy-charcoal` | Body, headings |
| `--color-text-secondary` | `piggy-gray` | Meta, captions |
| `--color-text-brand` | `piggy-pink` | Links, accents |
| `--color-border-default` | `piggy-border` | Card borders |
| `--color-status-error` | `piggy-negative` | Errors |
| `--color-status-success` | `piggy-positive` | Success |

**Action:** Add to `tailwind.config.js` as semantic names OR document mapping in this file only (minimal change).

### 2. Typography scale (new)

Add to `tailwind.config.js`:

```javascript
fontSize: {
  "display-lg": ["1.875rem", { lineHeight: "2.25rem", fontWeight: "700" }], // 30px — dashboard h1
  "display-md": ["1.5rem", { lineHeight: "2rem", fontWeight: "700" }],     // 24px — auth h1
  "title-lg": ["1.125rem", { lineHeight: "1.75rem", fontWeight: "600" }],  // section titles
  "title-md": ["1rem", { lineHeight: "1.5rem", fontWeight: "600" }],
  "body-md": ["0.875rem", { lineHeight: "1.5rem" }],                       // 14px default
  "body-sm": ["0.75rem", { lineHeight: "1.25rem" }],                       // 12px meta
  "overline": ["0.75rem", { lineHeight: "1rem", letterSpacing: "0.05em", fontWeight: "500" }],
}
```

| Component | Current | Target |
|-----------|---------|--------|
| Auth h1 | `text-2xl font-bold` | `text-display-md font-heading` |
| Dashboard h1 | `text-3xl font-bold` | `text-display-lg font-heading` |
| Section h2 | `text-lg` / `text-xl md:text-2xl` | `text-title-lg font-heading` |
| Body | `text-sm` | `text-body-md` |
| Meta | `text-xs text-piggy-gray` | `text-body-sm text-piggy-gray` |
| Overline | mixed xs/sm | `text-overline uppercase text-piggy-pink` |

### 3. Spacing scale (document, don't add new values)

Standardize on Tailwind defaults with these semantic roles:

| Role | Class | Usage |
|------|-------|-------|
| Page padding | `px-4 py-12` (auth/onboarding), `px-4 py-8 md:px-10 md:py-10` (dashboard) | Page shells |
| Form gap | `space-y-5` | Auth forms |
| Section gap | `space-y-6` | Dashboard, onboarding steps |
| Card padding — hero | `p-8` | Auth card, insight hero |
| Card padding — default | `p-6` | Section cards |
| Card padding — compact | `p-5` | Meme section |
| Nested tile | `p-4` | News article, price tile |
| Label gap | `mb-1.5` | FormField |

### 4. Radius tokens

| Token | Value | Usage |
|-------|-------|-------|
| `rounded-card` | 1rem | All top-level cards, auth shell |
| `rounded-lg` | 0.5rem | Nested tiles, inputs, buttons |
| `rounded-full` | 9999px | Badges, avatars |

**Rule:** Top-level cards MUST use `rounded-card`. Nested content tiles use `rounded-lg`. Remove `rounded-xl` from card shells.

### 5. Shadow tokens

| Token | Current | Usage |
|-------|---------|-------|
| `shadow-card` | defined | Cards at rest |
| `shadow-md` | Tailwind default | Compact cards hover — consider deprecating in favor of `shadow-card` |

---

## Component Standardization Plan

### Phase 1 — Extract shared foundations (Small effort)

#### `statusVariants.js`
Shared map for error/success/info/empty container classes.

```javascript
export const STATUS_VARIANTS = {
  error: "border-piggy-negative/30 bg-piggy-negative/5 text-piggy-negative",
  success: "border-piggy-positive/30 bg-piggy-positive/5 text-piggy-positive",
  info: "border-piggy-border bg-piggy-cream/50 text-piggy-gray",
  empty: "border-piggy-border bg-piggy-cream/50 text-piggy-gray",
};
```

**Consumers:** `Alert.jsx`, `Toast.jsx`, `StateMessage.jsx`

#### `BrandHeader.jsx`
Props: `overline`, `title`, `subtitle`, `size="auth" | "page"`

Replaces duplicated blocks in `AuthLayout` and `OnboardingLayout`.

#### `Spinner` consolidation
Replace inline border spinners in `ProtectedRoute.jsx` and `SectionCard.jsx` with `<Spinner />`.

---

### Phase 2 — Layout primitives (Medium effort)

#### `Panel.jsx`
Unified card shell for onboarding steps and nested content.

```jsx
<Panel padding="md" radius="card" shadow="card">
  {children}
</Panel>
```

| Prop | Options | Default |
|------|---------|---------|
| padding | `sm` (p-4), `md` (p-6), `lg` (p-8) | `md` |
| radius | `card`, `lg` | `card` |
| shadow | `none`, `card` | `card` |
| variant | `default`, `muted` | `default` |

**Migrates:** `SelectionCard` in Onboarding, nested tiles in news/prices (optional).

#### `PageTitle.jsx`
```jsx
<PageTitle size="lg">Hello, {userName}</PageTitle>
<PageTitle size="md">Welcome back</PageTitle>
```

#### `Overline.jsx`
```jsx
<Overline variant="brand">Piggy Daily</Overline>
<Overline variant="muted">Today's brief is based on:</Overline>
```

#### `Badge.jsx`
For related coins and future tags.

```jsx
<Badge variant="peach">{coin}</Badge>
```

---

### Phase 3 — Form and selection (Medium effort)

#### `FormField` enhancement
- Auto-generate error ID with `useId()`
- Pass `aria-describedby` and `aria-invalid` to child input via `cloneElement` or context
- Support `hint` prop for helper text

#### `SelectableCard.jsx`
Unify `RadioCard` and `CheckboxCard`:

```jsx
<SelectableCard
  type="radio" | "checkbox"
  id={id}
  name={name}
  label={label}
  checked={checked}
  onChange={onChange}
/>
```

Keep thin wrappers `RadioCard` / `CheckboxCard` exporting `SelectableCard` for backward compatibility.

#### `Fieldset.jsx`
Wraps onboarding groups with accessible legend:

```jsx
<Fieldset legend="Favorite crypto assets">
  <div className="grid gap-3 sm:grid-cols-2">...</div>
</Fieldset>
```

---

### Phase 4 — Feedback and actions (Medium effort)

#### `TextLink.jsx`
Standardize pink action links:

```jsx
<TextLink onClick={onRetry}>Try again</TextLink>
<TextLink to="/signup">Create an account</TextLink>
```

Variants: `default` (pink), `subtle` (charcoal hover pink).

#### `IconButton.jsx`
For collapse toggles, mobile menu, close buttons.

| Prop | Usage |
|------|-------|
| `aria-label` | Required |
| `size` | `sm` (32px), `md` (40px) |

**Migrates:** SectionCard collapse, MobileMenuButton, drawer close.

#### `VoteButton` / enhance `FeedbackControls`
- Accept `contentSnapshot` prop
- `role="group" aria-label="Rate this content"`
- Disable when `!itemReference`

#### `Toast` enhancement
- Dismiss button with `aria-label="Dismiss notification"`
- `aria-atomic="true"`
- Longer duration for error variant (5s vs 3s)

---

## Button Variant Matrix

| Variant | Background | Border | Text | Usage |
|---------|------------|--------|------|-------|
| `primary` | `piggy-pink` | none | `charcoal` | Submit, CTA |
| `ghost` | transparent | `piggy-border` | `gray` → hover charcoal | Refresh, logout, secondary |
| `danger` | `negative/15` | ring negative | `negative` | Destructive confirm (future) |
| `vote-up` | cream → pink/30 when selected | none | gray/charcoal | FeedbackControls |
| `vote-down` | cream → negative/15 when selected | none | gray/negative | FeedbackControls |

**Decision:** Keep vote styles in `FeedbackControls` OR extract `VoteButton` if reused elsewhere. Do not add vote variants to main `Button` unless needed.

---

## Form Control Spec

### Input
- Height: `py-2.5` + `px-4`
- Radius: `rounded-lg`
- Border: `border-piggy-border`, focus `border-piggy-pink`
- Background: `bg-piggy-cream`
- Disabled: `opacity-50 cursor-not-allowed`
- Error state: `border-piggy-negative ring-1 ring-piggy-negative/40`

### Label
- `text-sm font-medium text-piggy-charcoal mb-1.5`

### Error message
- `text-sm text-piggy-negative mt-1.5`
- `role="alert"` with linked `id`

### Selection card
- Padding: `px-4 py-3`
- Radius: `rounded-lg`
- Unchecked: `border-piggy-border hover:border-piggy-peach`
- Checked: `border-piggy-pink bg-piggy-pink/10 ring-1 ring-piggy-pink`
- Focus: apply `.focus-ring` on label wrapper via `focus-within`

---

## Card and Section Patterns

### SectionCard variants (keep)

| Variant | Padding | Title size | Default expanded | Special |
|---------|---------|------------|------------------|---------|
| `hero` | p-8 | xl/2xl | true | gradient, pink border |
| `default` | p-6 | lg | false | shadow-card |
| `compact` | p-5 | base | false | smaller shadow |

### Section anatomy (standard)

```
┌─ SectionCard ─────────────────────────────┐
│ [icon] Title                    [collapse] │
│ ── error banner (if any) ──                  │
│ ── skeleton | content ──                     │
│ ── preview (collapsed) ──                    │
│ ── source + related coins ──                 │
│ ── FeedbackControls ──                       │
└─────────────────────────────────────────────┘
```

### ContentTile (nested item pattern)

For news articles, price tiles, preferences panel:

```
rounded-lg border border-piggy-border bg-piggy-cream/50 p-4
```

---

## Vote Snapshot Schema

Required for VOTE-01 compliance. Each section builds snapshot before vote:

| Section | content_snapshot fields |
|---------|------------------------|
| `insight` | `{ source, model, excerpt, generated_at }` |
| `news` | `{ article_ids: [], titles: [], count }` |
| `prices` | `{ coin_ids: [], symbols: [], snapshot_prices: {} }` |
| `meme` | `{ id, title, image_url, source }` |

Pass from section → `SectionCard` → `FeedbackControls` → `submitVote`.

---

## SVG / Illustration Guidelines

| File | Issue | Fix |
|------|-------|-----|
| `PiggyAvatar.jsx` | Hardcoded `#555`, `#E8A0B0` | Map to `piggy-gray` / `piggy-pink` variants |
| `InsightIllustration.jsx` | Hardcoded hex | Use CSS var references where possible |
| `OnboardingIllustration.jsx` | Raster PNG | Acceptable with LazyImage fallback |

Add `--color-piggy-pink-dark: #E8A0B0` if needed for illustration shading.

---

## Migration Checklist

### Immediate (M6–M8)
- [ ] Add `contentSnapshot` prop chain for votes
- [ ] Fix auth/session UX (no DS change)

### Short-term (M10)
- [ ] Create `statusVariants.js`; refactor Alert/Toast/StateMessage
- [ ] Create `BrandHeader`; refactor AuthLayout/OnboardingLayout
- [ ] Create `PageTitle`, `Overline`; unify heading scales
- [ ] Extract `SelectionCard` → `Panel`
- [ ] Replace `rounded-xl` card shells with `rounded-card`
- [ ] Consolidate spinners
- [ ] Enhance `FormField` with a11y wiring
- [ ] Add `Fieldset` to onboarding
- [ ] Fix AI insight mobile layout (`flex-col sm:flex-row`)

### Long-term (M11+)
- [ ] Unify `RadioCard`/`CheckboxCard` → `SelectableCard`
- [ ] Create `IconButton`, `TextLink`, `Badge`
- [ ] Add ESLint plugin for design token enforcement (no raw hex in JSX)
- [ ] Storybook or Ladle for component catalog (optional)

---

## File Structure (Target)

```
frontend/src/
├── components/ui/
│   ├── Alert.jsx
│   ├── Badge.jsx              ← new
│   ├── BrandHeader.jsx        ← new
│   ├── Button.jsx
│   ├── Fieldset.jsx           ← new
│   ├── FormField.jsx          ← enhanced
│   ├── IconButton.jsx         ← new
│   ├── Input.jsx
│   ├── Overline.jsx           ← new
│   ├── PageTitle.jsx          ← new
│   ├── Panel.jsx              ← new
│   ├── SelectableCard.jsx     ← new (replaces Radio/Checkbox internals)
│   ├── statusVariants.js      ← new
│   └── ...
```

---

## Related Documents

- [UI Audit Report](ui-audit-report.md)
- [Frontend Roadmap](frontend-roadmap.md)
- [Task Backlog](task-backlog.md)
