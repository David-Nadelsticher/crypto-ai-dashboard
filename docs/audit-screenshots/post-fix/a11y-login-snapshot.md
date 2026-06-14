# Login a11y snapshot (post-fix)

**Captured:** June 13, 2026  
**Route:** `/login` @ 1280px

## Landmarks and labels

- Page heading: `Welcome back` (level 1)
- Form fields: `Email` and `Password` textboxes with associated labels
- Primary action: `Log in` button
- Secondary navigation: `Create an account` link

## WCAG spot-check

| Check | Result |
|-------|--------|
| Labels associated with inputs | Pass |
| Error alert uses `role="alert"` | Pass (when invalid creds submitted) |
| Label contrast on `piggy-card` | Pass (post-fix `text-piggy-charcoal`) |
| Focus visible on interactive elements | Pass (`focus-ring` utility) |
| Logical tab order | Pass |

## Notes

Post-fix labels are clearly readable against the cream card background. See [login-desktop.png](login-desktop.png) and [login-error-desktop.png](login-error-desktop.png).
