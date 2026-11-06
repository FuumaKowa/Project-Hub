# Editorial Portfolio Implementation Plan

> **For agentic workers:** Execute inline using superpowers:executing-plans. Owner explicitly requested implementation and launch; continue through local verification, review and publication.

**Goal:** Launch the portrait-led editorial portfolio on me.nielstudios.com while preserving the project Hub.

**Architecture:** A separate EditorialPortfolio React component receives the existing projects and callbacks. Its stylesheet is scoped to .editorial-site, with no changes to Hub presentation. Pure selection logic ranks active live projects; root HTML middleware supplies matching share metadata.

**Tech Stack:** Existing React/TypeScript/Vite, Firebase data, CSS, Sharp asset optimization, Cloudflare Pages.

**Spec:** ../specs/2026-11-06-editorial-portfolio-design.md

## Global constraints
- Keep the original portrait cutout and project records intact.
- No invented poetry, client claims or sensitive disclosures.
- Keep Hub and existing manager working.
- Honor reduced motion and accessible native links.

## Review focus
- Empty/failed project collection must not strand the visitor.
- Long real project names and tags must fit 320px.
- Modified-click links must retain browser behavior.
- No CSS selectors may change the Hub.
- Each live host must retain distinct metadata.

## Tasks
- [x] Add and run failing selection tests for active records, pinned ordering, stable ties, complete remaining index and input immutability; implement selectEditorialProjects in src/lib/editorialProjects.ts and rerun.
- [x] Optimize public/images/niel-editorial.webp from the preserved PNG; create portfolio social artwork in public/images/editorial-og.png using local SVG/Sharp.
- [x] Create src/components/EditorialPortfolio.tsx and editorial-portfolio.css; reuse exported ProjectPreview and props type from LiteraryPortfolio.tsx. Integrate only portfolio host in App.tsx.
- [x] Update portfolio metadata/social modal image and add meaningful metadata assertions.
- [x] Run routing, metadata and selection tests, TypeScript and production build. Browser-check live data, index, profile links and mobile overflow; static review loading/error handling and unit-test empty collection; inspect Hub.
- [ ] Request fresh-context code review, resolve material findings, publish allowlisted files to existing GitHub/Cloudflare deployment and verify both HTTPS sites.

## Execution record
- 2026-11-06: added the owner's three additional portraits as section04; red shirt cutout, glasses and grey-knit photographs, native dialog viewer.
- Eight tests, TypeScript and production build passed. Local browser:4featured+6index, all photos load, Escape restores focus, mobile menu closes on navigation,320/375/768px do not overflow, palettes/sketch toggle work. Hub retains10project cards and no editorial component.
- Fresh read-only reviewer found narrow hero overflow; fixed by clipping decorative portrait stage. Mobile theme/sketch controls corrected to44px. Reviewer found no remaining material issues.
- Owner explicitly approved publication of all four portrait assets in the public repository. All four uploaded. The separate typography-only social card was rejected by automatic approval review, despite verification that it contains no photos; retain the existing public social image unless the owner approves that additional payload. Main-branch publication is proceeding with complete portraits and existing share image.
