# Implementation Priority List

An ordered, actionable list of improvements for Timed Mutes for Bluesky, grouped by priority level.

---

## Priority 1 — Bugs & Broken Behavior

These should be addressed first. They represent incorrect behavior, missing validation, or silent failures.

- [x] **1. Fix page title** — `index.html` still shows `<title>Bsky TTRPG</title>`. Changed it to `Timed Mutes for Bluesky`.
- [x] **2. Add proper error handling for non-200 responses** — Most fetch calls only check `response.status == 200` and silently ignore everything else. A user with an expired session sees a blank page with no explanation. Added `else`/`.catch` handlers to all fetch calls with `console.warn`/`console.error` messages.
- [x] **3. Validate handle field before submitting** — `SetMute` doesn't validate the handle input. Added client-side validation checking for a handle-like pattern (contains `.`, doesn't start with `@`) before firing the API request. Shows error text on the field.
- [x] **4. Add loading states to all async operations** — Login (OAuth + App Password), muting, unmuting, and data fetching now have loading states with `CircularProgress` spinners and disabled buttons during requests.

## Priority 2 — UX & User Feedback

These improve the user's sense of control and confidence in the app.

- [x] **5. Add success feedback on mute/unmute** — After successfully muting or unmuting a user, show a brief `Snackbar` toast (e.g., "User muted for 24 hours") so the action feels confirmed.
- [x] **6. Add confirmation dialog before unmute** — Clicking "Unmute" fires immediately with no confirmation. Add a MUI `Dialog` (or simple `confirm()`) to prevent accidental unmutes.
- [x] **7. Add OAuth logout cleanup** — `oauthClient.logout()` is now called in `AccountButton.tsx` after a successful server-side logout to terminate the OAuth session on Bluesky's end.

## Priority 3 — Code Quality & Technical Debt

These clean up the codebase, remove anti-patterns, and reduce maintenance burden.

- [ ] **8. Remove `as any` type assertions** — `App.tsx` (line 27) and `vite.config.ts` (line 15) use `as any`. Wrap OAuth token access in a typed helper instead.
- [ ] **9. Replace `Math.random()` refresh pattern** — `setRefresh(Math.random())` is used to trigger `useEffect`. Replace with `setRefresh(prev => prev + 1)` for clarity.
- [ ] **10. Remove unused imports and dead code**
  - `home.tsx`: `useNavigate` is imported but unused (and commented out in sub-components).
  - `AccountButton.tsx`: Remove the empty ternary `<div>{false && <></>}</div>` on lines 43-44.
- [ ] **11. Remove orphaned CSS class reference** — `className="buttonContainer"` in `AccountButton.tsx` has no corresponding styles (likely a pre-MUI leftover).
- [ ] **12. Add environment variable validation** — If `VITE_API_HOST` is missing or misconfigured, the app silently fails. Add a startup check that logs a clear warning or throws early.
- [ ] **13. Clean up `SetMute` radio button state** — Radio buttons use both `defaultValue` and individual `onChange` handlers. Consolidate with MUI's `RadioGroup` `onChange` to centralize state.

## Priority 4 — Architecture & Patterns

These address structural issues that make the codebase harder to navigate and extend.

- [ ] **14. Rename `Sidebar.tsx` to `Header.tsx` (or `AppBar.tsx`)** — The component renders a horizontal top header bar, not a sidebar. Renaming makes the codebase easier to navigate.
- [ ] **15. Parallelize initial data fetching** — On page load, `App.tsx` calls `/active`, then `home.tsx` calls `/timed-mutes` and `/timed-mute-words` sequentially. These could run in parallel, or mute data could be included in the session response.
- [ ] **16. Cache profile data** — Profile data is fetched fresh on every render (triggered by `refresh` state changes). Add a simple in-memory cache to avoid redundant API calls to Bluesky's `getProfiles`.
- [ ] **17. Fix `MuteEntry` key stability** — The `key` uses `item.muted_actor + item.expiration_date`. If the same actor is muted twice with the same expiration, React treats them as the same element. Use a unique ID from the backend instead.

## Priority 5 — Polish & Nice-to-Haves

Low effort, high polish. Good for a rainy afternoon.

- [ ] **18. Add meta tags and favicon to `index.html`** — Currently minimal. Add a description, Open Graph tags (for link previews), and a favicon.
- [ ] **19. Add dark mode toggle** — The theme in `theme.tsx` hardcodes `mode: 'dark'` with no way to switch. A toggle in the header is a small but appreciated touch.
- [ ] **20. Add screenshots to `README.md`** — Screenshots of the app would help people understand what it does at a glance.

---

## Legend

| Priority | Focus | Effort |
|----------|-------|--------|
| P1 | Bugs & broken behavior | Fixes incorrect behavior with minimal scope |
| P2 | UX & user feedback | Improves confidence and perceived quality |
| P3 | Code quality & technical debt | Reduces maintenance burden |
| P4 | Architecture & patterns | Structural improvements for extensibility |
| P5 | Polish & nice-to-haves | Low-effort, visible polish |
