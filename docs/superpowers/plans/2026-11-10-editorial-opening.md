# Editorial Opening Implementation Plan

> Execute inline using superpowers:executing-plans. The owner approved the editorial-opening design and explicitly requested implementation.

**Goal:** A brief, skippable editorial opening on the personal portfolio.

**Approved design:** Warm parchment, pencil-drawn n. monogram, Between words & worlds, then reveal the homepage after approximately1.5seconds. Show once per tab session. Respect reduced motion. Hub remains unchanged.

**Architecture:** A self-contained EditorialOpening component inside EditorialPortfolio, using a native modal dialog for focus/inert background, sessionStorage for the seen marker and a bounded timer. CSS lives in editorial-opening.css. Pure eligibility policy is independently tested.

**Constraints:** Deep section links and manager requests bypass the intro. Reduced motion skips it altogether; a preference change during playback dismisses it. Skip and Escape dismiss immediately. Storage failures cannot prevent dismissal. Cleanup closes the dialog and restores body scrolling. No new images, fake progress, sound, external dependencies or actual data-loading delay.

## Tasks
- [x] Write and run failing eligibility tests: first visit, seen, reduced motion, deep links and manager requests; implement the policy.
- [x] Implement native-dialog opening, timer and cleanup; add scoped animation and portfolio integration.
- [x] Verify11tests, TypeScript and production build. Browser checked automatic dismissal, keyboard Skip/Escape, repeat reload bypass, deep section access, mobile entry and Hub isolation. Native-dialog cleanup restores scrolling and focus to the main landmark without a whole-page outline.
- [ ] Fresh review, publish allowlisted files, verify live deployment.

Review: no material findings. Reduced motion is covered by eligibility tests, a live media-query listener and a CSS fallback. Disabled session storage is caught so it cannot prevent dismissal. No new image assets or dependencies.
