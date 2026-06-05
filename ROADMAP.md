# JSCC — MVP Roadmap / Live Execution List

**Artifact version:** v3 (Day 0 Owner sign-off recorded; Lead sign-off outstanding)

Owner-facing execution list: the live path to MVP — order, ownership, gates,
blockers, and what proves each item done. Measured against `spec/` + disk truth.

**Scope boundary (not Project Health):** this file = *what must happen, in what
order, who owns it, what blocks it, what proves it done.* It is **not** a status
snapshot (`STATUS.md`), bootstrap (`HANDOFF.md`), backlog/drift sink
(`.agents/followups.md`), requirement source (`spec/`), or change rationale (commit
bodies). No session history; no findings dump. Sections 3–5/7 are overwrite-only.

**Baseline:** backend `api-00010-wav`; hosting `index-CdT2zp0V.js`; NEOGOV Sync
wired to Contra Costa + San Mateo (live).

---

## Day 0 gate (read first)

> **If** Owner **and** Lead approve the **Source Scope Amendment** and the
> **AI Helper scope** (§1) → the one-week MVP proceeds **NEOGOV-first** (§3).
> **If not** → the week is not spec-compatible and must expand to build CalCareers +
> USAJOBS-UI for §16/§18 multi-source acceptance. Agents do not pass Day 0 until cleared.

**Day 0 status — Owner cleared; Lead sign-off outstanding.**

- **Owner Day 0 sign-off (recorded):**
  - *Decision 1 — Source Scope Amendment:* "Owner approves the Source Scope Amendment
    for the one-week MVP: MVP acceptance is scoped to the GovernmentJobs/NEOGOV
    workflow. CalCareers and USAJOBS UI access are deferred to post-MVP / next-release
    Sync-parameters work."
  - *Decision 2 — AI Helper scope:* "Owner approves the AI helper only within the §10.2
    fit-assessment envelope: manual-request, assistive, non-autonomous, no checklist AI,
    no resume/cover editing, no status changes, and no override of deterministic gates.
    If implementation threatens MVP scope, AI remains design-only for this week."
- **Lead sign-off — OUTSTANDING.** B1 (Source Scope Amendment narrows §16/§18 spec
  acceptance) and B2 (AI §10.2 envelope) are correctness/spec-policy changes → Lead
  sign-off required per the CLAUDE.md authority split. Until Larry signs B1/B2: Day 1
  Inbox calibration may be *designed* (read-only diagnosis), but the week is not yet
  spec-compatible and no Lead-PASS-before-deploy step can complete.

---

## Operating model (coordination boundaries)

Recorded here; **does not change `CLAUDE.md`** (role/version touch deferred until new
implementation identities or CI are actually switched on).

- **GitHub = coordination bus, not source of truth.** Disk stays authoritative under
  §21 precedence: `spec/` → `ROADMAP` → `STATUS` → `HANDOFF` → `followups` → `git`.
  Reasoning lives in commit bodies (Rule 9), not PR threads.
- **Harness gate:** any new implementation-capable identity (Cursor, a separate AI
  implementation agent, new runtime/model/config) must pass §24.1 + record
  `last_success.md` **before touching code.** A tool is not authority.
- **AI / QA lanes carry no deploy, live-write, or semantic authority.** AI
  design-only work needs no §24.1.
- **CI fence:** Cloud/CI = build/test/lint/reconciliation only; **no deploy or
  live-write in v1**; new executable surface needs Owner/Lead approval.
- **Existing lanes unchanged:** PA/Claude backend · Antigravity/Gemini frontend ·
  Owner gates deploy/live-write · Lead reviews semantics.

---

## 1. MVP target

A usable **NEOGOV-first** workflow where the Owner can: run NEOGOV Sync from the UI ·
get a cleaner Inbox · shortlist/dismiss/move jobs through the pipeline · manually
import a job · run the Pre-Submit Checklist before submitting · see basic Dashboard /
Activity · optionally use a thin AI fit-assessment helper (non-blocking). Full §18
acceptance remains the eventual bar; this cut narrows it via the two amendments below.

**Source Scope Amendment — MVP (Owner approved; Lead sign-off outstanding).**
NEOGOV/GovernmentJobs is the active MVP source path and satisfies the primary-source
requirement (§5). CalCareers (§5/§11/§16/§18) is **unbuilt** → deferred. USAJOBS
backend is live by deploy provenance but UI-unreachable (hardcoded Sync scope) →
deferred to the future Sync-parameters feature; **no one-off USAJOBS button, no
Sync-parameters build this week.** Intentional Owner cut narrowing §16/§18 — recorded,
not silent (Dashboard-Amendment precedent). **Still needs Lead (B1) to be
spec-compatible.**

**AI Helper scope (Owner approved; Lead sign-off outstanding).** AI is a thin,
assistive review helper within the §10.2 fit-assessment envelope only: manual-request /
opt-in; assistive only; `useAiScoring` default **stays false**; no checklist AI
(§13.4); no resume or cover-letter editing; no status movement; no auto-apply; no
override of deterministic scoring. "Interview notes" / open-ended next-action deferred
unless approved. **If implementation threatens the one-week MVP scope, AI remains
design-only this week.** Still needs Lead (B2).

Also deferred (Dashboard Scope Amendment): `/metrics/dashboard` + KPI/analytics/charts.

---

## 2. Completed foundations (do not reopen)

Live on `api-00010-wav` / `index-CdT2zp0V.js`:

- Firestore + same-origin Hosting (§4.1).
- Search pipeline: adapters (NEOGOV, USAJOBS), dedupe, filter, Fit + Posting-Clarity
  scoring, persist, `sourceRuns` (§10–§11).
- Salary semantics (A.5 window + SALARY-02 starting-salary gate) (§10.4).
- USAJOBS CA geography fix — live, UI-unexercised (§10.3).
- `wrong_lane` occupational gate — production-verified (§10.6).
- Reason-keyed Sync accounting + §10.6 audit-CSV evidence path (§15.1).
- **NEOGOV ingestion + insert/merge/dedupe proven** via live Sync; **San Mateo live
  run completed.** Mechanics are not the blocker — Inbox *quality* is (1/5 cards
  shortlist-worthy).
- Notifications backend + `GET /notifications` (§14).

---

## 3. Live execution list (Day 0 → Day 7)

Each item: status · lane · gate · blocked-by · acceptance · deploy · live-write ·
evidence · spec. Status: `next`/`pending`/`blocked`/`deferred`/`done`. Lanes: Owner /
PA-backend / Antigravity-frontend / AI-agent / QA / Lead.
(Evidence = the proof that closes it; no item is `done` on say-so. Stop = the §22
trigger that forces a stuck report over a third attempt.)

**Day 0 / S-25 — Scope lock + ROADMAP finalization** · Owner+Lead (PA records) ·
`done`
- Gate: Day-0 gate above. Owner sign-off recorded (both decisions); Lead B1/B2
  outstanding. Acceptance: amendments recorded; next item = Inbox calibration.
  Deploy/live-write: no. Spec: §16/§18, §10.2/§13.4.

**Day 1 — Inbox quality / deterministic-scoring calibration** · PA-backend → Lead ·
`done` (design unblocked by Owner; Lead-PASS-before-deploy gated on B1/B4)
- Why: 1/5 cards shortlist-worthy; quality is the blocker, not ingestion.
- Gate: if weak cards trace to a tunable deterministic cause → bounded scoring/lane
  patch, explainable reject reasons, no AI scorer.
- Blocked-by: Day 0. Acceptance: same feed → fewer junk cards, the good card survives,
  Lead PASS pre-deploy. Deploy: yes (Day 2). Live-write: via Day 2. Spec: §10.1/§10.6/§18.
- Parallel: AI lane drafts helper contract (design-only).

**Day 2 — Deploy calibration + Owner-gated live Sync proof** · Owner/PA/QA · `wip`
- Gate: if Owner authorizes the run → deploy Lead-approved patch, run Sync, reconcile
  CSV↔UI, compare before/after quality. If quality improves → continue; else scoring
  stays the blocker.
- Blocked-by: Day 1; Owner live-write approval. Acceptance: UI = CSV; quality improves;
  insert/merge intact. Deploy: yes (backend). Live-write: **yes**. Spec: §9/§10.5/§15.1.

**Day 3 — Manual import UI + Settings minimum path** · Antigravity → Lead · `pending`
- Gate: import gives Sync-miss fallback; Settings unreachable → "tune without redeploy"
  underbuilt (route redirected, `App.jsx:25`).
- Blocked-by: frontend-lane assignment. Acceptance: URL → pending → verify → pipeline;
  Settings reachable; minimum controls only. Deploy: yes (frontend). Live-write: no.
  Spec: §8.3/§12, §8.8, §18.

**Day 4 — Pre-Submit Checklist contract + modal** · PA + Antigravity → Lead · `wip`
- Gate: if Lead resolves canonical submit-confirm route (B3) → build/verify; else
  `submitted` movement blocked.
- Blocked-by: B3. Acceptance: no Submitted without confirm; off/warn/block correct;
  transactional; `/jobs` PATCH refuses direct `status:submitted`; no AI in checklist.
  Deploy: yes. Live-write: no. Spec: §8.5/§13.3/§13.6/§18.

**Day 5 — Pipeline interactions + Activity/Dashboard smoke** · Antigravity (+PA B7)/QA
· `deferred`
- Gate: if checklist contract works (Day 4) → drag-to-Submitted intercepts.
- Blocked-by: Day 4; B7. Acceptance: desktop drag/drop + mobile long-press (or accepted
  fallback); Submitted intercept; red-dot reader; Dashboard counts/closing-soon/recent
  from existing data (no `/metrics/dashboard`); Fit + Clarity on cards. Deploy: yes
  (frontend). Live-write: no. Spec: §8.4/§8.0/§8.9/§8.2/§18.

**Day 6 — Thin AI helper (only if approved, non-blocking) + workflow rehearsal** ·
AI-agent/Owner/QA · `pending`
- Gate: if Lead+Owner approved the §10.2 envelope → build gated fit-helper; else
  design-only + rehearsal. Must never block Days 1–5.
- Blocked-by: B2. Acceptance: helper opt-in/assistive, no status/resume/checklist/gate
  authority, `useAiScoring` stays false; rehearsal Sync→…→submitted passes. Deploy: yes
  if UI ships. Live-write: no. Spec: §5/§10.2/§13.4/§2/§19.2.

**Day 7 — MVP acceptance walkthrough + closeout** · Owner + all lanes / QA · `pending`
- Gate: if B1–B7 closed and walkthrough passes → tag MVP candidate.
- Blocked-by: Days 1–6. Acceptance: Owner uses JSCC as a real tool against the amended
  §18 bar; gaps documented + non-blocking; governance closeout. Live-write: yes
  (Owner-gated). Spec: §18.

---

## 4. Gate map

- **Day 0:** approve amendments → NEOGOV-first; else expand the week.
- Day-2 CSV shows tunable scoring → calibrate **before** more agencies.
- Inbox quality poor → agency expansion **pauses** (more sources = more noise).
- Sync source hardcoded → USAJOBS UI product-fit **blocked** (Sync-parameters).
- Submit-confirm unresolved → pipeline `submitted` **blocked** (Day 5 needs Day 4).
- Frontend bundle changes → hosting deploy before UI validation.
- Backend filter semantics change → Lead review before deploy.
- Live writes → explicit Owner in-session gate (`/search/run` writes even at
  `persist:false`).
- New implementation identity → §24.1 harness before code.
- CI wired → build/test only, no deploy/live-write, Owner/Lead-approved.

---

## 5. Blockers (B1–B7)

- **B1 — Source Scope Amendment** (CalCareers unbuilt; §16/§18 name 3 sources) · Owner
  **approved** · **Lead OUTSTANDING** · gates spec-compatibility of the week.
- **B2 — AI helper** constrained to §10.2 or deferred; never blocks Days 1–5 · Owner
  **approved** · **Lead OUTSTANDING**.
- **B3 — Submit-confirm canonical route** (§13.6 `/signals/…` vs code `/jobs/:id/…`) ·
  **Lead** · blocks Day 4/5.
- **B4 — Scoring/lane calibration** needs Lead review before deploy · Lead.
- **B5 — Live Sync proof** needs Owner in-session live-write approval · Owner.
- **B6 — Frontend bundle changes** need hosting deploy · Owner gate.
- **B7 — Activity `createdAt` / `search_run_completed` emission gap** may affect Day-5
  Activity/Dashboard smoke · PA + Lead.

**USAJOBS UI is intentionally not on the list** — backend live, UI deferred to the
Sync-parameters model; no execution slot unless Owner changes this roadmap.

---

## 6. Deferred post-MVP

- CalCareers adapter (unbuilt). USAJOBS frontend access → Sync-parameters feature.
- AI "interview notes" / open-ended next-action (out of §10.2).
- More NEOGOV agencies (Oakland = thin fallback). KPI/analytics dashboard + charts +
  `/metrics/dashboard`. Filters live-preview; RSI rule-weight loop; AI deep-review;
  Drive integration; email/push/scheduled reminders.
- Durable CA↔California geography matcher; CC-only tightening. RateIntervalCode
  annualization check. `governance-session-title` skill+hook. M-02/M-03 cleanup.
- Admin roadmap tab (separate frontend gate after this roadmap is approved; must not
  replace MVP feature work).
- Orchestration *platform* build (Project Command Layer, CI automation, agents-SDK) and
  the `CLAUDE.md` role/version touch — deferred behind MVP; must not displace Day 1.

---

## 7. Risks / watch

- **Inbox yield quality weak** — 1/5 shortlist-worthy. Central MVP risk; drives Day 1.
- **USAJOBS live but UI-unexercised** — geography fix in prod by provenance.
- **Nav vs spec drift** — `Sync`→`/filters`, no Settings/Add-Job in deployed nav
  (§8.1/§8.8); reconcile via Day 3.
- **Node.js 20 deprecation** — decommissions 2026-10-30; Node 22 upgrade standalone.
- **Live-write hazard** — `/search/run` emits an event even at `persist:false`;
  read-only diagnostics bypass the route or use `USE_MOCK_DB=true`.

---

## 8. Next execution item

**Day 1 — Inbox quality / deterministic-scoring calibration.** Owner cleared Day 0
(both decisions recorded above); Lead B1/B2 sign-off remains outstanding. PA-backend may
begin read-only diagnosis of why weak cards pass the deterministic scorer now; the
bounded patch is Lead-reviewed (B4) and verified by the Owner-gated live Sync (Day 2).
Ingestion, insert/merge, and San Mateo are proven; the lever is scoring quality, not
more sources (Rule 8). USAJOBS does not take this slot.
