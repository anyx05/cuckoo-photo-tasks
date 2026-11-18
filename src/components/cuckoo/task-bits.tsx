import { Link } from "@tanstack/react-router";
import { ArrowLeft, CalendarClock, MapPin } from "lucide-react";
import type { ReactNode } from "react";
import { CATEGORY_LABEL, formatDate, formatDateTime, formatMoney } from "@/mock/format";
import { photoByRef, TASK_THUMB } from "@/mock/photos";
import type { DemoState, Evidence, HistoryEvent, Task } from "@/mock/types";
import { Card, Notice, PaymentBadge, StatusBadge } from "./ui";

export function TaskMeta({ task }: { task: Task }) {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
      <span className="inline-flex items-center gap-1.5"><MapPin className="size-4" aria-hidden /> {task.city}</span>
      {task.requestedBy && (
        <span className="inline-flex items-center gap-1.5"><CalendarClock className="size-4" aria-hidden /> Requested by {formatDate(task.requestedBy)}</span>
      )}
    </div>
  );
}

export function TaskCard({ task, role, extra }: { task: Task; role: "EMPLOYER" | "TASK_TAKER"; extra?: ReactNode }) {
  const inner = (
    <>
      <img src={TASK_THUMB} alt="" width={1024} height={768} loading="lazy" className="size-20 shrink-0 rounded-xl object-cover sm:size-24" />
      <div className="min-w-0 flex-1 space-y-2">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <p className="min-w-0 font-bold">{task.title}</p>
          <StatusBadge status={task.status} />
        </div>
        <TaskMeta task={task} />
        <div className="flex flex-wrap items-center gap-2">
          <PaymentBadge status={task.paymentSimulationStatus} />
          {extra}
        </div>
      </div>
    </>
  );
  const cls = "flex gap-4 rounded-2xl border bg-card p-4 shadow-card transition-colors hover:border-brand/40";
  return role === "EMPLOYER" ? (
    <Link to="/employer/tasks/$taskId" params={{ taskId: task.id }} className={cls}>{inner}</Link>
  ) : (
    <Link to="/taker/tasks/$taskId" params={{ taskId: task.id }} className={cls}>{inner}</Link>
  );
}

export function TaskSummary({ task }: { task: Task }) {
  return (
    <Card className="space-y-4">
      <div className="flex gap-4">
        <img src={TASK_THUMB} alt="Sample of the vehicle" width={1024} height={768} className="size-24 shrink-0 rounded-xl object-cover sm:size-28" />
        <div className="min-w-0 space-y-2">
          <h2 className="text-lg font-bold">{task.title}</h2>
          <TaskMeta task={task} />
          <div className="flex flex-wrap gap-2">
            <StatusBadge status={task.status} />
            <PaymentBadge status={task.paymentSimulationStatus} />
          </div>
        </div>
      </div>
      <dl className="grid gap-4 text-sm sm:grid-cols-2">
        <div className="sm:col-span-2"><dt className="font-semibold">Description</dt><dd className="text-muted-foreground">{task.description}</dd></div>
        <div className="sm:col-span-2"><dt className="font-semibold">Required evidence</dt><dd className="text-muted-foreground">{task.requiredEvidence}</dd></div>
        <div><dt className="font-semibold">Category</dt><dd className="text-muted-foreground">{CATEGORY_LABEL[task.category]}</dd></div>
        <div><dt className="font-semibold">Compensation</dt><dd className="text-muted-foreground">{formatMoney(task.proposedCompensation)} <span className="text-xs">(illustrative · simulated payment)</span></dd></div>
      </dl>
      <p className="rounded-xl bg-muted p-3 text-xs text-muted-foreground">
        Permission from the vehicle owner and location must be secured before photos are taken. Exterior photos only — no driving, custody or professional inspection.
      </p>
    </Card>
  );
}

export function PhotoGrid({ refs }: { refs: string[] }) {
  return (
    <ul className="grid grid-cols-2 gap-3">
      {refs.map((r) => {
        const p = photoByRef(r);
        if (!p) return null;
        return (
          <li key={r} className="overflow-hidden rounded-xl border bg-muted">
            <img src={p.src} alt={p.label} width={1024} height={768} loading="lazy" className="aspect-[4/3] w-full object-cover" />
            <p className="px-3 py-1.5 text-xs font-medium text-muted-foreground">{p.label}</p>
          </li>
        );
      })}
    </ul>
  );
}

export function EvidenceBlock({ evidence, title = "Latest evidence" }: { evidence: Evidence; title?: string }) {
  return (
    <Card className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="font-bold">{title}</h2>
        <span className="text-xs text-muted-foreground">Version {evidence.version} · {formatDateTime(evidence.submittedAt)}</span>
      </div>
      <PhotoGrid refs={evidence.photoRefs} />
      <div className="rounded-xl border p-4">
        <p className="text-sm font-semibold">Task taker notes</p>
        <p className="mt-1 whitespace-pre-wrap text-sm text-muted-foreground">{evidence.notes}</p>
      </div>
    </Card>
  );
}

export function HistoryList({ events, state }: { events: HistoryEvent[]; state: DemoState }) {
  return (
    <Card as="section" className="space-y-3">
      <h2 className="font-bold">Task history</h2>
      <ol className="space-y-3 border-l-2 border-border pl-4" aria-label="Task history">
        {events.map((e) => (
          <li key={e.id} className="relative">
            <span className="absolute top-1.5 -left-[1.4rem] size-2.5 rounded-full bg-brand" aria-hidden />
            <p className="text-sm font-medium">{e.message}</p>
            <p className="text-xs text-muted-foreground">{state.users.find((u) => u.id === e.actorId)?.displayName} · {formatDateTime(e.at)}</p>
          </li>
        ))}
      </ol>
    </Card>
  );
}

export function UnavailablePrivate({ what = "Evidence and task history" }: { what?: string }) {
  return (
    <Notice tone="locked" title={`${what} unavailable`}>
      Only the employer who posted this task and the assigned task taker can see this. Browse other open tasks or switch accounts in the demo bar.
    </Notice>
  );
}

export function TaskNotFound() {
  return <Notice tone="error" title="Task not found">This task doesn't exist, or the demo was reset. Go back to My Tasks.</Notice>;
}

export const BackIcon = () => <ArrowLeft className="size-5" />;
