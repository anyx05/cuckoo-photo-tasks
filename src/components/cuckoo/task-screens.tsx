import { Link } from "@tanstack/react-router";
import { ArrowLeft, Check, CreditCard, Send, X } from "lucide-react";
import { useState } from "react";
import * as api from "@/mock/api";
import { useDemo } from "@/mock/store";
import type { Role } from "@/mock/types";
import { Feedback, useFeedback } from "./form-feedback";
import { AppShell, PageHeader, backLinkClass } from "./shell";
import { EvidenceBlock, HistoryList, TaskNotFound, TaskSummary, UnavailablePrivate } from "./task-bits";
import { Button, EmptyState, Field, Notice, inputClass } from "./ui";

export function TaskDetails({ taskId, role }: { taskId: string; role: Role }) {
  const { state } = useDemo();
  const result = api.getTask(state, taskId);
  return <AppShell role={role} title={`${role === "EMPLOYER" ? "Employer" : "Task Taker"} Task Details`}><PageHeader title="Task Details" back={<Link to={role === "EMPLOYER" ? "/employer" : "/taker"} className={backLinkClass} aria-label="Back to My Tasks"><ArrowLeft /></Link>} />{result.ok ? <TaskContent key={taskId} taskId={taskId} role={role} /> : <TaskNotFound />}</AppShell>;
}

function TaskContent({ taskId, role }: { taskId: string; role: Role }) {
  const { actor, state, run } = useDemo();
  const feedback = useFeedback();
  const [note, setNote] = useState("");
  const [cancelConfirm, setCancelConfirm] = useState(false);
  const result = api.getTask(state, taskId);
  if (!result.ok || !actor) return null;
  const task = result.data;
  const owner = task.ownerId === actor.id;
  const assigned = task.assignedTaskTakerId === actor.id;
  const applications = api.listTaskApplications(state, actor.id, taskId);
  const evidence = api.listTaskEvidence(state, actor.id, taskId);
  const history = api.getTaskHistory(state, actor.id, taskId);
  const applied = state.applications.some(a => a.taskId === taskId && a.applicantId === actor.id);
  return <div className="space-y-6"><TaskSummary task={task} /><Feedback {...feedback} />
    {role === "EMPLOYER" && owner && <>
      {task.status === "OPEN" && <section className="space-y-3"><h2 className="text-lg font-bold">Applicants ({applications.ok ? applications.data.length : 0})</h2>{applications.ok && applications.data.map(a => { const u = state.users.find(user => user.id === a.applicantId); return <article key={a.id} className="flex flex-wrap items-center justify-between gap-4 rounded-xl border bg-card p-4"><div className="min-w-0"><h3 className="font-bold">{u?.displayName}</h3><p className="text-xs text-muted-foreground">{u?.operatingCity} · Self-declared</p>{u?.occupation && <p className="mt-1 text-xs text-muted-foreground">Occupation: {u.occupation} · Self-declared</p>}{u?.skills && <p className="text-xs text-muted-foreground">Skills: {u.skills} · Self-declared</p>}{a.note && <p className="mt-2 text-sm">{a.note}</p>}</div><Button size="sm" aria-label={`Assign ${u?.displayName}`} onClick={() => feedback.accept(run(s => api.assignTask(s, actor.id, taskId, { applicationId: a.id })), "Task taker assigned.")}><Check /> Assign</Button></article>; })}{applications.ok && !applications.data.length && <EmptyState title="No applications yet" />}</section>}
      {task.assignedTaskTakerId && <section className="border-y py-4"><h2 className="text-sm font-semibold">Assigned to</h2><p className="mt-1 font-bold">{state.users.find(u => u.id === task.assignedTaskTakerId)?.displayName}</p></section>}
      {task.status === "ASSIGNED" && task.paymentSimulationStatus === "NOT_HELD" && <Notice title="Simulated hold required" action={<Button onClick={() => feedback.accept(run(s => api.simulatePaymentHold(s, actor.id, taskId)), "Simulated hold recorded.")}><CreditCard /> Record simulated hold</Button>}>No real money is moved.</Notice>}
      {task.status === "ASSIGNED" && task.paymentSimulationStatus === "HELD_SIMULATED" && <Notice title="Waiting for evidence">Simulated hold recorded. No real money is moved.</Notice>}
      {task.status === "EVIDENCE_SUBMITTED" && <Button asChild><Link to="/employer/tasks/$taskId/review" params={{ taskId }}><Check /> Review Evidence</Link></Button>}
      {task.status === "REVISION_REQUESTED" && <Notice tone="warning" title="Revision requested">{task.lastReviewNote ?? "No review note was added."}</Notice>}
      {task.status === "COMPLETED" && <Button asChild variant="outline"><Link to="/employer/tasks/$taskId/completed" params={{ taskId }}>View Completion</Link></Button>}
      {["OPEN", "ASSIGNED", "CANCELLED"].includes(task.status) && <div>{cancelConfirm ? <Notice tone="warning" title="Cancel this task?" action={<div className="flex flex-wrap gap-2"><Button variant="danger" onClick={() => { feedback.accept(run(s => api.cancelTask(s, actor.id, taskId)), "Task cancelled. Any simulated hold was voided."); setCancelConfirm(false); }}><X /> Confirm cancellation</Button><Button variant="ghost" onClick={() => setCancelConfirm(false)}>Keep Task</Button></div>}>This closes the task and voids an existing simulated hold.</Notice> : <Button variant="danger" onClick={() => setCancelConfirm(true)}><X /> {task.status === "CANCELLED" ? "Cancel again" : "Cancel Task"}</Button>}</div>}
    </>}
    {role === "TASK_TAKER" && <>
      {task.status === "OPEN" && <form className="space-y-3" onSubmit={e => { e.preventDefault(); feedback.accept(run(s => api.applyForTask(s, actor.id, taskId, { note })), "Application sent."); }}><h2 className="text-lg font-bold">{applied ? "Application sent" : "Apply for this task"}</h2>{!actor.operatingCity && <Notice tone="warning" title="Operating city needed" action={<Button asChild variant="outline"><Link to="/taker/profile">Edit Profile</Link></Button>}>Add your operating city before applying.</Notice>}<Field id="application-note" label="Application note" optional><textarea id="application-note" rows={3} className={inputClass} value={note} onChange={e => setNote(e.target.value)} /></Field><Button type="submit"><Send />{applied ? "Apply again" : "Apply for Task"}</Button></form>}
      {assigned && task.status === "ASSIGNED" && task.paymentSimulationStatus === "NOT_HELD" && <Notice tone="warning" title="Waiting for simulated hold">The employer must record a simulated hold before you can submit evidence. No real money is moved.</Notice>}
      {assigned && ["ASSIGNED", "REVISION_REQUESTED"].includes(task.status) && <>{task.status === "REVISION_REQUESTED" && <Notice tone="warning" title="Revision requested">{task.lastReviewNote ?? "No review note was added."}</Notice>}<Button asChild variant={task.paymentSimulationStatus === "NOT_HELD" ? "outline" : "primary"}><Link to="/taker/tasks/$taskId/evidence" params={{ taskId }}>{task.status === "REVISION_REQUESTED" ? "Revise Evidence" : "Submit Evidence"}</Link></Button></>}
      {assigned && task.status === "EVIDENCE_SUBMITTED" && <Notice title="Evidence submitted">Waiting for the employer's review.</Notice>}
      {assigned && task.status === "COMPLETED" && <Notice tone="success" title="Task completed">Simulated payment released. No real money is moved.</Notice>}
    </>}
    {evidence.ok ? evidence.data[0] && <EvidenceBlock evidence={evidence.data[0]} /> : <UnavailablePrivate />}
    {history.ok && <HistoryList events={history.data} state={state} />}
  </div>;
}