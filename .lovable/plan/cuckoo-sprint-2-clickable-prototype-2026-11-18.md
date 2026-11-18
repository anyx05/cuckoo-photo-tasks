# Cuckoo — Sprint 2 clickable prototype

Frontend-only prototype matching the storyboard: blue/white bird mascot, deep navy buttons, pale blue background, white rounded cards, soft shadows. Fictional data, in-memory state, demo sign-in. No backend, uploads, or real payments.

## Screens (each its own page, with back navigation)
- Welcome (mascot, wordmark, Get Started, "Try employer demo" / "Try task taker demo"), Sign Up (email, password, Employer/Task Taker), Sign In (email, password) — all simulated.
- Employer: Dashboard (Create a Task banner + My Tasks), Create a Task, Task Details (applicants, select one, assigned taker, Record simulated hold, Cancel), Evidence Review (photo grid, notes, Approve / Request Revision with optional note), Task Completed.
- Task taker: Profile (city, occupation, skills — all "Self-declared"), Find Tasks (city + category filters, empty state), Task Details (apply once with note, waiting-for-hold state), Submit Evidence (pick 1–5 sample photos, preview, notes 10–2,000 chars), My Tasks.
- Sign Up also offers an optional operating city.
- Shared: task history timeline, separate simulated payment badge, "Evidence unavailable" state for non-participants.

## Layout
- Desktop: navy sidebar (Home, My Tasks / Find Tasks, Profile, Log out). Mobile: compact top bar + bottom nav.
- Persistent demo bar: role switcher (Employer: Deniz Kaya / Task taker: Sarah Ahmed / Other task taker: Mert Yılmaz), "Reset demo" button. Switching keeps task state.
- Single-column forms, persistent labels, visible focus rings, status badges with text + color.

## Rules
- Task status: Open → Assigned → Evidence Submitted → Completed; Evidence Submitted → Revision Requested → Evidence Submitted; Open/Assigned → Cancelled (only before evidence).
- Payment status (separate): Not held → Held (simulated) → Released (simulated) or Voided (simulated). All labels say "Simulated payment"; hold and completion screens say "No real money is moved".
- Evidence submit only by the selected taker after hold; approve releases hold in same action.
- Applying requires operating city (else guided to Profile); duplicate application shows feedback.
- Only the task owner sees applicants. Repeating a finished action (e.g. approving twice, cancelling a completed task) shows a conflict message and leaves the demo unchanged.
- Seed: Ankara "Exterior photos of white sedan" task with 2 applicants, plus an Istanbul listing and one other employer task.

## Open decisions panel
- A small "Awaiting team review" note lists: final revision rules and note policy, evidence download, file limits beyond photo count, retention, broader visibility. These are not built.

## Demo walkthrough at the end
- Full task from posting to completion with the revision loop, plus a cancellation on a second task, and blocked cases: duplicate application, missing hold, unrelated viewer.

## Visuals
- Generate mascot illustration and 4–5 sample car photos (front, rear, sides, bumper close-up).
- Evidence Review polished for desktop and mobile first (Figma import trial).

## Technical details
- TanStack routes per screen (`/`, `/signup`, `/signin`, `/employer`, `/employer/tasks/new`, `/employer/tasks/$id`, `/employer/tasks/$id/review`, `/employer/tasks/$id/completed`, `/taker`, `/taker/find`, `/taker/profile`, `/taker/tasks/$id`, `/taker/tasks/$id/evidence`).
- One typed mock adapter (`src/mock/api.ts`) with functions named after the draft operations: registerUser, createSession, getMyProfile, updateMyProfile, createTask, listTasks, getTask, applyForTask, listTaskApplications, assignTask, simulatePaymentHold, submitTaskEvidence, listTaskEvidence, reviewTaskEvidence, cancelTask, getTaskHistory. Draft enums: roles EMPLOYER/TASK_TAKER, category VEHICLE_PHOTO_CHECK, status OPEN/ASSIGNED/EVIDENCE_SUBMITTED/REVISION_REQUESTED/COMPLETED/CANCELLED, paymentSimulationStatus NOT_HELD/HELD_SIMULATED/RELEASED_SIMULATED/VOIDED_SIMULATED; task fields title, description, city, category, proposedCompensation, requiredEvidence, permissionConfirmed, requestedBy. Local photo previews kept outside these types.
- In-memory store (React context) wraps the adapter; no HTTP, no Cloud, no persistence. Vitest tests for status/payment/permission rules.
- Design tokens in styles.css (navy primary, pale blue background); shared Button/Card/Field/StatusBadge.
- Finish with a Playwright walkthrough of the full flow via the role switcher, checking history and payment status.
