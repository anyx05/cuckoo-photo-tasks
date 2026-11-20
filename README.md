# Cuckoo — Sprint 2 prototype

Clickable SENG 321 prototype for permitted exterior vehicle photos and visible observations. React, TypeScript, TanStack navigation, Vite and Tailwind. No business HTTP calls, accounts, upload service, storage or payment service. All changes are in memory and disappear on reload. The demo role switcher preserves progress within the current session; Reset demo restores fixtures.

## Demo walkthrough

1. Try employer demo (Deniz), Create a Task, complete required fields and acknowledge permission, then Post Task.
2. Switch to Sarah on the same task. Apply with an optional note. Apply again demonstrates the duplicate conflict.
3. Switch to Deniz and assign Sarah. Switch to Sarah and try Submit Evidence before the hold to see blocked submission.
4. Switch to Deniz and record the simulated hold. Switch to Sarah, select 1–5 synthetic photos, write 10–2,000 characters of observations and submit.
5. Switch to Mert or the other employer to see evidence unavailable. Return to Deniz, open Review Evidence, add an optional note and request revision.
6. Switch to Sarah, revise and resubmit. Return to Deniz and approve. Task Completed shows simulated release; history includes both evidence versions and the release.
7. For cancellation, open the seeded Çankaya task as Deniz. Cancel and confirm to see the hold voided. Cancel again shows a conflict without mutation.

No real money is moved. Sign-up and sign-in are fictional simulations; sign-in recognizes a demo email and any nonempty fictional password. Do not use real credentials.

## Figma capture

Each screen has a `data-screen` name. Evidence Review has desktop photo-gallery/review columns and a stacked mobile view. Use the same task with both roles rather than reloading, because data is deliberately not persisted. Both widths have been checked in the preview; Figma import itself has not been performed.

## Awaiting team review

- Final revision preconditions and review note policy
- Evidence download
- File limits beyond photo count
- Evidence retention
- Broader evidence visibility rules

These decisions remain visible in the demo bar; none adds functionality beyond the supplied draft demo rules. Ratings, suggestions, chat, ID/phone collection and real payments are not built.

## Local development and tests

```sh
bun install
bun run dev
bunx vitest run src/test/mock-workflow.test.ts src/test/app-routing.test.tsx
```

Twenty workflow tests cover permission, roles, city requirement, applications, assignment, hold, photo/note limits, evidence visibility, revision, approval/release, cancellation and terminal conflicts. A routing test checks the welcome page. Browser walkthroughs also verified the full posting-to-completion flow, history, cancellation/void, reset, simulated signup/signin and mobile review controls.
