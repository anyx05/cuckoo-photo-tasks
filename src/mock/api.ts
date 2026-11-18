// Local mock adapter. Function names mirror the draft operation IDs under /api/v1.
import type {
  Application, ApiError, DemoState, Evidence, HistoryEvent, Result, Role, Task, TaskCategory, TaskStatus, User,
} from "./types";

const ok = <T>(state: DemoState, data: T): Result<T> => ({ ok: true, state, data });
const fail = (code: ApiError["code"], message: string, fields?: Record<string, string>): Result<never> => ({
  ok: false,
  error: fields ? { code, message, fields } : { code, message },
});
const now = () => new Date().toISOString();

function nextId(s: DemoState, prefix: string): [DemoState, string] {
  const seq = s.seq + 1;
  return [{ ...s, seq }, `${prefix}-${seq}`];
}

function addHistory(s: DemoState, taskId: string, actorId: string, type: string, message: string): DemoState {
  const [s2, id] = nextId(s, "h");
  const ev: HistoryEvent = { id, taskId, actorId, type, message, at: now() };
  return { ...s2, history: [...s2.history, ev] };
}

function patchTask(s: DemoState, id: string, patch: Partial<Task>): DemoState {
  return { ...s, tasks: s.tasks.map((t) => (t.id === id ? { ...t, ...patch } : t)) };
}

const findUser = (s: DemoState, id: string | null) => s.users.find((u) => u.id === id);
const userName = (s: DemoState, id: string | null) => findUser(s, id)?.displayName ?? "Unknown";

/** Owner and assigned task taker are the only participants who see private evidence and history. */
export function isParticipant(task: Task, actorId: string | null): boolean {
  return !!actorId && (task.ownerId === actorId || task.assignedTaskTakerId === actorId);
}

// ---------- US-01 ----------
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function registerUser(
  s: DemoState,
  input: { email: string; password: string; role: Role | ""; operatingCity?: string },
): Result<User> {
  const fields: Record<string, string> = {};
  const email = input.email.trim().toLowerCase();
  if (!email) fields["email"] = "Enter your email address.";
  else if (!EMAIL_RE.test(email)) fields["email"] = "Enter a valid email address, like name@example.com.";
  if (input.password.length < 8) fields["password"] = "Use at least 8 characters.";
  if (input.role !== "EMPLOYER" && input.role !== "TASK_TAKER") fields["role"] = "Choose Employer or Task Taker.";
  if (Object.keys(fields).length) return fail("VALIDATION_ERROR", "Please fix the highlighted fields.", fields);
  if (s.users.some((u) => u.email === email))
    return fail("CONFLICT", "An account with this email already exists. Sign in instead.", { email: "This email is already registered." });
  const [s2, id] = nextId(s, "u");
  const user: User = {
    id,
    email,
    role: input.role as Role,
    displayName: email.split("@")[0] ?? email,
    operatingCity: input.operatingCity?.trim() || null,
    occupation: null,
    skills: null,
  };
  return ok({ ...s2, users: [...s2.users, user] }, user);
}

export function createSession(s: DemoState, input: { email: string; password: string }): Result<User> {
  const fields: Record<string, string> = {};
  if (!input.email.trim()) fields["email"] = "Enter your email address.";
  if (!input.password) fields["password"] = "Enter your password.";
  if (Object.keys(fields).length) return fail("VALIDATION_ERROR", "Please fix the highlighted fields.", fields);
  const user = s.users.find((u) => u.email === input.email.trim().toLowerCase());
  if (!user) return fail("UNAUTHORIZED", "We couldn't find that account. Check the email or use a demo account.");
  return ok(s, user);
}

// ---------- US-01/02 ----------
export function getMyProfile(s: DemoState, actorId: string): Result<User> {
  const u = findUser(s, actorId);
  return u ? ok(s, u) : fail("UNAUTHORIZED", "Sign in to view your profile.");
}

export function updateMyProfile(
  s: DemoState,
  actorId: string,
  input: { operatingCity: string; occupation: string; skills: string },
): Result<User> {
  const u = findUser(s, actorId);
  if (!u) return fail("UNAUTHORIZED", "Sign in to edit your profile.");
  if (u.role === "TASK_TAKER" && !input.operatingCity.trim())
    return fail("VALIDATION_ERROR", "Please fix the highlighted fields.", { operatingCity: "Choose your operating city. You need it to apply for tasks." });
  const updated: User = {
    ...u,
    operatingCity: input.operatingCity.trim() || null,
    occupation: input.occupation.trim() || null,
    skills: input.skills.trim() || null,
  };
  return ok({ ...s, users: s.users.map((x) => (x.id === actorId ? updated : x)) }, updated);
}

// ---------- US-03 ----------
export interface CreateTaskInput {
  title: string;
  description: string;
  city: string;
  category: TaskCategory | "";
  proposedCompensation: string;
  requiredEvidence: string;
  permissionConfirmed: boolean;
  requestedBy: string;
}

export function createTask(s: DemoState, actorId: string, input: CreateTaskInput): Result<Task> {
  const u = findUser(s, actorId);
  if (!u || u.role !== "EMPLOYER") return fail("FORBIDDEN", "Only employers can create tasks. Switch to an employer account.");
  const fields: Record<string, string> = {};
  if (!input.title.trim()) fields["title"] = "Enter a task title.";
  if (!input.description.trim()) fields["description"] = "Describe the vehicle and where it is parked.";
  if (!input.city.trim()) fields["city"] = "Choose a city.";
  if (input.category !== "VEHICLE_PHOTO_CHECK") fields["category"] = "Choose the Vehicle photo check category.";
  const comp = Number(input.proposedCompensation);
  if (!input.proposedCompensation.trim() || !Number.isFinite(comp) || comp <= 0)
    fields["proposedCompensation"] = "Enter an illustrative amount greater than 0.";
  if (!input.requiredEvidence.trim()) fields["requiredEvidence"] = "Describe which photos and observations you need.";
  if (!input.permissionConfirmed) fields["permissionConfirmed"] = "Confirm the permission statement to post this task.";
  if (input.requestedBy && Number.isNaN(Date.parse(input.requestedBy))) fields["requestedBy"] = "Enter a valid date and time.";
  if (Object.keys(fields).length) return fail("VALIDATION_ERROR", "Please fix the highlighted fields.", fields);
  const [s2, id] = nextId(s, "t");
  const task: Task = {
    id,
    ownerId: actorId,
    title: input.title.trim(),
    description: input.description.trim(),
    city: input.city.trim(),
    category: "VEHICLE_PHOTO_CHECK",
    proposedCompensation: comp,
    requiredEvidence: input.requiredEvidence.trim(),
    permissionConfirmed: true,
    requestedBy: input.requestedBy ? new Date(input.requestedBy).toISOString() : null,
    status: "OPEN",
    paymentSimulationStatus: "NOT_HELD",
    assignedTaskTakerId: null,
    lastReviewNote: null,
    createdAt: now(),
  };
  const s3 = addHistory({ ...s2, tasks: [task, ...s2.tasks] }, id, actorId, "TASK_CREATED", "Task posted");
  return ok(s3, task);
}

// ---------- US-04 ----------
export function listTasks(
  s: DemoState,
  filter: { status?: TaskStatus; city?: string; category?: TaskCategory; ownerId?: string } = {},
): Task[] {
  return s.tasks.filter(
    (t) =>
      (!filter.status || t.status === filter.status) &&
      (!filter.city || t.city === filter.city) &&
      (!filter.category || t.category === filter.category) &&
      (!filter.ownerId || t.ownerId === filter.ownerId),
  );
}

export function getTask(s: DemoState, taskId: string): Result<Task> {
  const t = s.tasks.find((x) => x.id === taskId);
  return t ? ok(s, t) : fail("NOT_FOUND", "This task doesn't exist or was removed when the demo was reset.");
}

// ---------- US-05/06 ----------
export function applyForTask(s: DemoState, actorId: string, taskId: string, input: { note: string }): Result<Application> {
  const u = findUser(s, actorId);
  if (!u || u.role !== "TASK_TAKER") return fail("FORBIDDEN", "Only task takers can apply. Switch to a task taker account.");
  const t = s.tasks.find((x) => x.id === taskId);
  if (!t) return fail("NOT_FOUND", "This task no longer exists.");
  if (!u.operatingCity) return fail("PROFILE_INCOMPLETE", "Add your operating city in Profile before applying.");
  if (s.applications.some((a) => a.taskId === taskId && a.applicantId === actorId))
    return fail("CONFLICT", "You've already applied to this task. Check My Tasks for your assignment status.");
  if (t.status !== "OPEN") return fail("CONFLICT", "This task is no longer open for applications. Browse other open tasks.");
  const [s2, id] = nextId(s, "a");
  const app: Application = { id, taskId, applicantId: actorId, note: input.note.trim() || null, createdAt: now() };
  const s3 = addHistory({ ...s2, applications: [...s2.applications, app] }, taskId, actorId, "APPLICATION_RECEIVED", `${u.displayName} applied`);
  return ok(s3, app);
}

export function listTaskApplications(s: DemoState, actorId: string, taskId: string): Result<Application[]> {
  const t = s.tasks.find((x) => x.id === taskId);
  if (!t) return fail("NOT_FOUND", "This task no longer exists.");
  if (t.ownerId !== actorId) return fail("FORBIDDEN", "Only the task owner can see applicants.");
  return ok(s, s.applications.filter((a) => a.taskId === taskId));
}

export function assignTask(s: DemoState, actorId: string, taskId: string, input: { applicationId: string }): Result<Task> {
  const t = s.tasks.find((x) => x.id === taskId);
  if (!t) return fail("NOT_FOUND", "This task no longer exists.");
  if (t.ownerId !== actorId) return fail("FORBIDDEN", "Only the task owner can assign a task taker.");
  if (t.status !== "OPEN") return fail("CONFLICT", "A task taker is already assigned or the task is closed.");
  const app = s.applications.find((a) => a.id === input.applicationId && a.taskId === taskId);
  if (!app) return fail("NOT_FOUND", "That application wasn't found.");
  let s2 = patchTask(s, taskId, { status: "ASSIGNED", assignedTaskTakerId: app.applicantId });
  s2 = addHistory(s2, taskId, actorId, "TASK_ASSIGNED", `${userName(s, app.applicantId)} assigned`);
  return ok(s2, s2.tasks.find((x) => x.id === taskId)!);
}

// ---------- US-07 ----------
export function simulatePaymentHold(s: DemoState, actorId: string, taskId: string): Result<Task> {
  const t = s.tasks.find((x) => x.id === taskId);
  if (!t) return fail("NOT_FOUND", "This task no longer exists.");
  if (t.ownerId !== actorId) return fail("FORBIDDEN", "Only the task owner can record a simulated hold.");
  if (t.status !== "ASSIGNED") return fail("CONFLICT", "Assign a task taker before recording a simulated hold.");
  if (t.paymentSimulationStatus !== "NOT_HELD") return fail("CONFLICT", "A simulated hold is already recorded for this task.");
  let s2 = patchTask(s, taskId, { paymentSimulationStatus: "HELD_SIMULATED" });
  s2 = addHistory(s2, taskId, actorId, "PAYMENT_HELD", "Simulated payment hold recorded");
  return ok(s2, s2.tasks.find((x) => x.id === taskId)!);
}

// ---------- US-08/09/13 ----------
export function submitTaskEvidence(
  s: DemoState,
  actorId: string,
  taskId: string,
  input: { photoRefs: string[]; notes: string },
): Result<Evidence> {
  const t = s.tasks.find((x) => x.id === taskId);
  if (!t) return fail("NOT_FOUND", "This task no longer exists.");
  if (t.assignedTaskTakerId !== actorId) return fail("FORBIDDEN", "Only the assigned task taker can submit evidence.");
  if (t.status !== "ASSIGNED" && t.status !== "REVISION_REQUESTED")
    return fail("CONFLICT", "Evidence can't be submitted right now. It may already be waiting for review.");
  if (t.paymentSimulationStatus !== "HELD_SIMULATED")
    return fail("HOLD_REQUIRED", "The employer hasn't recorded the simulated hold yet. Check back after they do.");
  const fields: Record<string, string> = {};
  if (input.photoRefs.length < 1) fields["photos"] = "Choose at least 1 photo.";
  if (input.photoRefs.length > 5) fields["photos"] = "Choose no more than 5 photos.";
  const notes = input.notes.trim();
  if (notes.length < 10) fields["notes"] = "Write at least 10 characters about what you observed.";
  if (notes.length > 2000) fields["notes"] = "Keep notes to 2,000 characters or fewer.";
  if (Object.keys(fields).length) return fail("VALIDATION_ERROR", "Please fix the highlighted fields.", fields);
  const version = s.evidence.filter((e) => e.taskId === taskId).length + 1;
  const [s2, id] = nextId(s, "e");
  const ev: Evidence = { id, taskId, submittedBy: actorId, photoRefs: input.photoRefs, notes, version, submittedAt: now() };
  let s3 = patchTask({ ...s2, evidence: [...s2.evidence, ev] }, taskId, { status: "EVIDENCE_SUBMITTED" });
  s3 = addHistory(s3, taskId, actorId, "EVIDENCE_SUBMITTED", version > 1 ? `Evidence resubmitted (version ${version})` : "Evidence submitted");
  return ok(s3, ev);
}

export function listTaskEvidence(s: DemoState, actorId: string | null, taskId: string): Result<Evidence[]> {
  const t = s.tasks.find((x) => x.id === taskId);
  if (!t) return fail("NOT_FOUND", "This task no longer exists.");
  if (!isParticipant(t, actorId)) return fail("FORBIDDEN", "Evidence is only visible to the task owner and the assigned task taker.");
  return ok(s, s.evidence.filter((e) => e.taskId === taskId).sort((a, b) => b.version - a.version));
}

// ---------- US-09/10 ----------
export function reviewTaskEvidence(
  s: DemoState,
  actorId: string,
  taskId: string,
  input: { decision: "APPROVE" | "REQUEST_REVISION"; note?: string },
): Result<Task> {
  const t = s.tasks.find((x) => x.id === taskId);
  if (!t) return fail("NOT_FOUND", "This task no longer exists.");
  if (t.ownerId !== actorId) return fail("FORBIDDEN", "Only the task owner can review evidence.");
  if (t.status !== "EVIDENCE_SUBMITTED")
    return fail("CONFLICT", t.status === "COMPLETED" ? "This task is already completed. Nothing was changed." : "There's no submitted evidence waiting for review.");
  if (input.decision === "APPROVE") {
    if (t.paymentSimulationStatus !== "HELD_SIMULATED") return fail("HOLD_REQUIRED", "Record a simulated hold before approving.");
    let s2 = patchTask(s, taskId, { status: "COMPLETED", paymentSimulationStatus: "RELEASED_SIMULATED", lastReviewNote: null });
    s2 = addHistory(s2, taskId, actorId, "EVIDENCE_APPROVED", "Evidence approved — task completed");
    s2 = addHistory(s2, taskId, actorId, "PAYMENT_RELEASED", "Simulated payment released");
    return ok(s2, s2.tasks.find((x) => x.id === taskId)!);
  }
  const note = input.note?.trim() || null;
  let s2 = patchTask(s, taskId, { status: "REVISION_REQUESTED", lastReviewNote: note });
  s2 = addHistory(s2, taskId, actorId, "REVISION_REQUESTED", note ? `Revision requested: “${note}”` : "Revision requested");
  return ok(s2, s2.tasks.find((x) => x.id === taskId)!);
}

// ---------- US-11 ----------
export function cancelTask(s: DemoState, actorId: string, taskId: string): Result<Task> {
  const t = s.tasks.find((x) => x.id === taskId);
  if (!t) return fail("NOT_FOUND", "This task no longer exists.");
  if (t.ownerId !== actorId) return fail("FORBIDDEN", "Only the task owner can cancel this task.");
  if (t.status !== "OPEN" && t.status !== "ASSIGNED")
    return fail("CONFLICT", t.status === "CANCELLED" ? "This task is already cancelled. Nothing was changed." : "Tasks can only be cancelled while Open or Assigned, before evidence is submitted.");
  const voided = t.paymentSimulationStatus === "HELD_SIMULATED";
  let s2 = patchTask(s, taskId, { status: "CANCELLED", paymentSimulationStatus: voided ? "VOIDED_SIMULATED" : t.paymentSimulationStatus });
  s2 = addHistory(s2, taskId, actorId, "TASK_CANCELLED", "Task cancelled");
  if (voided) s2 = addHistory(s2, taskId, actorId, "PAYMENT_VOIDED", "Simulated payment hold voided");
  return ok(s2, s2.tasks.find((x) => x.id === taskId)!);
}

// ---------- US-12 ----------
export function getTaskHistory(s: DemoState, actorId: string | null, taskId: string): Result<HistoryEvent[]> {
  const t = s.tasks.find((x) => x.id === taskId);
  if (!t) return fail("NOT_FOUND", "This task no longer exists.");
  if (!isParticipant(t, actorId)) return fail("FORBIDDEN", "Task history is only visible to the task owner and the assigned task taker.");
  return ok(s, s.history.filter((h) => h.taskId === taskId));
}
