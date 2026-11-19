import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Check, CheckCircle2, RotateCcw, Send } from "lucide-react";
import { useState } from "react";
import * as api from "@/mock/api";
import { formatMoney } from "@/mock/format";
import { SAMPLE_PHOTOS } from "@/mock/photos";
import { useDemo } from "@/mock/store";
import { Feedback, useFeedback } from "./form-feedback";
import { AppShell, PageHeader, backLinkClass } from "./shell";
import { EvidenceBlock, HistoryList, TaskMeta, TaskNotFound, UnavailablePrivate } from "./task-bits";
import { Button, Field, Notice, PaymentBadge, StatusBadge, inputClass } from "./ui";

export function EvidenceReview({ taskId }: { taskId: string }) {
  return <AppShell role="EMPLOYER" title="Evidence Review"><PageHeader title="Evidence Review" back={<Link to="/employer/tasks/$taskId" params={{ taskId }} className={backLinkClass} aria-label="Back to Task Details"><ArrowLeft /></Link>} /><ReviewContent key={taskId} taskId={taskId} /></AppShell>;
}
function ReviewContent({ taskId }: { taskId: string }) {
  const { actor, state, run } = useDemo();
  const navigate = useNavigate();
  const feedback = useFeedback();
  const [note, setNote] = useState("");
  const result = api.getTask(state, taskId);
  if (!result.ok) return <TaskNotFound />;
  const task = result.data;
  const evidence = api.listTaskEvidence(state, actor?.id ?? null, taskId);
  if (!evidence.ok) return <UnavailablePrivate />;
  const latest = evidence.data[0];
  if (!latest) return <Notice title="No evidence submitted yet" />;
  const owner = actor?.id === task.ownerId;
  function review(decision: "APPROVE" | "REQUEST_REVISION") {
    if (!actor) return;
    const r = run(s => api.reviewTaskEvidence(s, actor.id, taskId, { decision, note }));
    feedback.accept(r, decision === "REQUEST_REVISION" ? "Revision requested." : "Task completed.");
    if (r.ok && decision === "APPROVE") navigate({ to: "/employer/tasks/$taskId/completed", params: { taskId } });
  }
  return <div className="space-y-6"><div className="flex flex-wrap items-start justify-between gap-3 border-b pb-5"><div><h2 className="text-lg font-bold">{task.title}</h2><div className="mt-2"><TaskMeta task={task} /></div></div><StatusBadge status={task.status} /></div>
    <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_280px]"><div className="space-y-5"><div className="flex items-center gap-3"><CheckCircle2 className="size-9 shrink-0 text-success" /><div><h2 className="font-bold">Evidence Submitted!</h2><p className="text-sm text-muted-foreground">{state.users.find(u => u.id === latest.submittedBy)?.displayName} · Version {latest.version}</p></div></div><EvidenceBlock evidence={latest} title="Submitted photos" />{evidence.data.length > 1 && <details className="border-t pt-4"><summary className="cursor-pointer text-sm font-semibold">Previous submissions ({evidence.data.length - 1})</summary><div className="mt-4 space-y-4">{evidence.data.slice(1).map(e => <EvidenceBlock key={e.id} evidence={e} title={`Evidence version ${e.version}`} />)}</div></details>}</div>
    <section className="space-y-4 border-y py-5 lg:sticky lg:top-6"><h2 className="font-bold">Review decision</h2><p className="text-2xl font-bold">{formatMoney(task.proposedCompensation)} <span className="text-xs font-normal text-muted-foreground">illustrative</span></p><PaymentBadge status={task.paymentSimulationStatus} /><p className="text-xs text-muted-foreground">No real money is moved.</p><Feedback {...feedback} />{task.status === "REVISION_REQUESTED" && <Notice tone="warning" title="Waiting for revised evidence">{task.lastReviewNote ?? "No review note was added."}</Notice>}{owner && <><Field id="review-note" label="Review note" optional><textarea id="review-note" rows={4} className={inputClass} value={note} onChange={e => setNote(e.target.value)} /></Field><Button className="w-full" onClick={() => review("APPROVE")}><Check /> Approve & Complete</Button><Button variant="outline" className="w-full" onClick={() => review("REQUEST_REVISION")}><RotateCcw /> Request Revision</Button></>}</section></div>
    {(() => { const h = api.getTaskHistory(state, actor?.id ?? null, taskId); return h.ok ? <HistoryList events={h.data} state={state} /> : null; })()}
  </div>;
}

export function SubmitEvidence({ taskId }: { taskId: string }) {
  return <AppShell role="TASK_TAKER" title="Submit Evidence"><PageHeader title="Submit Evidence" back={<Link to="/taker/tasks/$taskId" params={{ taskId }} className={backLinkClass} aria-label="Back to Task Details"><ArrowLeft /></Link>} /><SubmitContent key={taskId} taskId={taskId} /></AppShell>;
}
function SubmitContent({ taskId }: { taskId: string }) {
  const { state, actor, run } = useDemo();
  const navigate = useNavigate();
  const feedback = useFeedback();
  const evidence = api.listTaskEvidence(state, actor?.id ?? null, taskId);
  const latest = evidence.ok ? evidence.data[0] : undefined;
  const [photos, setPhotos] = useState<string[]>(latest?.photoRefs ?? []);
  const [notes, setNotes] = useState(latest?.notes ?? "");
  const result = api.getTask(state, taskId);
  if (!result.ok) return <TaskNotFound />;
  const task = result.data;
  if (actor?.id !== task.assignedTaskTakerId) return <UnavailablePrivate />;
  const fields = feedback.error?.fields;
  return <form noValidate className="mx-auto max-w-2xl space-y-5" onSubmit={e => { e.preventDefault(); if (!actor) return; const r = run(s => api.submitTaskEvidence(s, actor.id, taskId, { photoRefs: photos, notes })); feedback.accept(r); if (r.ok) navigate({ to: "/taker/tasks/$taskId", params: { taskId } }); }}>
    <h2 className="text-lg font-bold">{task.title}</h2><Feedback {...feedback} />
    {task.paymentSimulationStatus !== "HELD_SIMULATED" && <Notice tone="warning" title="Waiting for simulated hold">The employer has not recorded the hold. Submission is blocked. No real money is moved.</Notice>}
    {task.status === "REVISION_REQUESTED" && <Notice tone="warning" title="Revision requested">{task.lastReviewNote ?? "No review note was added."}</Notice>}
    <fieldset aria-describedby={fields?.photos ? "photos-error" : "photos-hint"}><legend className="mb-1 font-semibold">Sample photos</legend><p id="photos-hint" className="mb-3 text-xs text-muted-foreground">{photos.length}/5 selected · Synthetic vehicle photos</p><div className="grid grid-cols-2 gap-3 sm:grid-cols-3">{SAMPLE_PHOTOS.map(p => <label key={p.ref} className={`relative cursor-pointer overflow-hidden rounded-xl border-2 bg-card ${photos.includes(p.ref) ? "border-brand" : "border-border"}`}><img src={p.src} alt={p.label} className="aspect-[4/3] w-full object-cover" /><span className="flex items-center gap-2 p-2 text-xs font-medium"><input type="checkbox" className="size-4 shrink-0 accent-primary" checked={photos.includes(p.ref)} onChange={e => setPhotos(old => e.target.checked ? [...old, p.ref] : old.filter(r => r !== p.ref))} />{p.label}</span></label>)}</div>{fields?.photos && <p id="photos-error" className="mt-2 text-sm text-destructive">{fields.photos}</p>}</fieldset>
    <Field id="evidence-notes" label="Visible observations" hint={`${notes.trim().length}/2,000 characters · Minimum 10`} error={fields?.notes}><textarea id="evidence-notes" rows={5} className={inputClass} value={notes} onChange={e => setNotes(e.target.value)} aria-invalid={!!fields?.notes} aria-describedby={fields?.notes ? "evidence-notes-error" : "evidence-notes-hint"} /></Field>
    <Button type="submit" className="w-full"><Send />{task.status === "REVISION_REQUESTED" ? "Resubmit Evidence" : "Submit Evidence"}</Button>
  </form>;
}

export function TaskCompleted({ taskId }: { taskId: string }) {
  const { state, actor } = useDemo();
  const result = api.getTask(state, taskId);
  const history = api.getTaskHistory(state, actor?.id ?? null, taskId);
  return <AppShell role="EMPLOYER" title="Task Completed"><PageHeader title="Task Completed" />{!result.ok ? <TaskNotFound /> : !history.ok ? <UnavailablePrivate /> : result.data.status !== "COMPLETED" ? <Notice title="This task is not completed yet" /> : <div className="space-y-8"><div className="mx-auto flex max-w-lg flex-col items-center gap-5 py-8 text-center"><span className="grid size-24 place-items-center rounded-full bg-success-soft text-success"><Check className="size-14" /></span><h2 className="text-3xl font-extrabold">Task Completed!</h2><p className="text-muted-foreground">{result.data.title}</p><PaymentBadge status={result.data.paymentSimulationStatus} /><p className="text-sm text-muted-foreground">Evidence approved and simulated payment released.<br />No real money is moved.</p><Button asChild><Link to="/employer">View My Tasks</Link></Button><Button asChild variant="ghost"><Link to="/employer/tasks/$taskId/review" params={{ taskId }}>View Evidence Review</Link></Button></div><HistoryList events={history.data} state={state} /></div>}</AppShell>;
}