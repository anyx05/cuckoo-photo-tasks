import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Check, Plus } from "lucide-react";
import { useState } from "react";
import { createTask, updateMyProfile, type CreateTaskInput } from "@/mock/api";
import { CITIES } from "@/mock/seed";
import { useDemo } from "@/mock/store";
import { Feedback, useFeedback } from "./form-feedback";
import { AppShell, PageHeader, backLinkClass } from "./shell";
import { Button, Field, inputClass } from "./ui";

export function CreateTaskScreen() {
  const { actor, run } = useDemo();
  const navigate = useNavigate();
  const feedback = useFeedback();
  const [form, setForm] = useState<CreateTaskInput>({ title: "", description: "", city: "", category: "VEHICLE_PHOTO_CHECK", proposedCompensation: "", requiredEvidence: "", permissionConfirmed: false, requestedBy: "" });
  const fields = feedback.error?.fields;
  function control(key: keyof CreateTaskInput) { return { id: key, className: inputClass, value: String(form[key]), "aria-invalid": !!fields?.[key], "aria-describedby": fields?.[key] ? `${key}-error` : undefined, onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setForm(f => ({ ...f, [key]: e.target.value })) }; }
  return <AppShell role="EMPLOYER" title="Create a Task"><PageHeader title="Create a Task" back={<Link to="/employer" className={backLinkClass} aria-label="Back to My Tasks"><ArrowLeft /></Link>} />
    <form noValidate className="mx-auto max-w-xl space-y-5" onSubmit={e => { e.preventDefault(); if (!actor) return; const r = run(s => createTask(s, actor.id, form)); feedback.accept(r); if (r.ok) navigate({ to: "/employer/tasks/$taskId", params: { taskId: r.data.id } }); }}>
      <Feedback {...feedback} />
      <Field id="title" label="Task title" error={fields?.title}><input {...control("title")} placeholder="Exterior photos of a white sedan" /></Field>
      <Field id="description" label="Description" error={fields?.description}><textarea {...control("description")} rows={4} placeholder="Vehicle, parking location and visible observations needed" /></Field>
      <div className="grid gap-5 sm:grid-cols-2"><Field id="city" label="City" error={fields?.city}><select {...control("city")}><option value="">Choose a city</option>{CITIES.map(c => <option key={c}>{c}</option>)}</select></Field><Field id="category" label="Category" error={fields?.category}><select {...control("category")}><option value="VEHICLE_PHOTO_CHECK">Vehicle photo check</option></select></Field></div>
      <Field id="proposedCompensation" label="Proposed compensation (₺)" hint="Illustrative amount. No real money is moved." error={fields?.proposedCompensation}><input {...control("proposedCompensation")} type="number" min="0" step="0.01" /></Field>
      <Field id="requiredEvidence" label="Required evidence" error={fields?.requiredEvidence}><textarea {...control("requiredEvidence")} rows={3} placeholder="Front, rear, side photos and notes of visible marks" /></Field>
      <Field id="requestedBy" label="Requested by" optional error={fields?.requestedBy}><input {...control("requestedBy")} type="datetime-local" /></Field>
      <div className="rounded-xl border bg-card p-4"><label className="flex items-start gap-3 text-sm" htmlFor="permissionConfirmed"><input id="permissionConfirmed" type="checkbox" className="mt-1 size-4 shrink-0 accent-primary" checked={form.permissionConfirmed} onChange={e => setForm(f => ({ ...f, permissionConfirmed: e.target.checked }))} aria-invalid={!!fields?.permissionConfirmed} aria-describedby={fields?.permissionConfirmed ? "permissionConfirmed-error" : undefined} /><span>I acknowledge that permission from the vehicle owner and location must be secured before exterior photographs are taken.</span></label>{fields?.permissionConfirmed && <p id="permissionConfirmed-error" className="mt-2 text-sm text-destructive">{fields.permissionConfirmed}</p>}</div>
      <Button type="submit" className="w-full"><Plus /> Post Task</Button>
    </form>
  </AppShell>;
}

export function ProfileScreen({ role = "TASK_TAKER" }: { role?: "EMPLOYER" | "TASK_TAKER" }) {
  const { actor } = useDemo();
  return <AppShell role={role} title="Profile"><PageHeader title="Profile" />{actor && <ProfileForm key={actor.id} />}</AppShell>;
}
function ProfileForm() {
  const { actor, run } = useDemo();
  const feedback = useFeedback();
  const [form, setForm] = useState({ operatingCity: actor?.operatingCity ?? "", occupation: actor?.occupation ?? "", skills: actor?.skills ?? "" });
  const fields = feedback.error?.fields;
  return <form className="mx-auto max-w-xl space-y-5" noValidate onSubmit={e => { e.preventDefault(); if (actor) feedback.accept(run(s => updateMyProfile(s, actor.id, form)), "Profile saved."); }}>
    <div className="border-b pb-5"><h2 className="text-lg font-bold">{actor?.displayName}</h2><p className="mt-1 break-all text-sm text-muted-foreground">{actor?.email}</p><p className="mt-2 text-xs font-semibold text-info">{actor?.role === "EMPLOYER" ? "Employer" : "Task taker"}</p></div><Feedback {...feedback} />
    <Field id="operatingCity" label="Operating city" tag="Self-declared" optional hint="Task takers need an operating city to apply." error={fields?.operatingCity}><select id="operatingCity" className={inputClass} value={form.operatingCity} onChange={e => setForm(f => ({ ...f, operatingCity: e.target.value }))}><option value="">Not specified</option>{CITIES.map(c => <option key={c}>{c}</option>)}</select></Field>
    <Field id="occupation" label="Occupation" tag="Self-declared" optional><input id="occupation" className={inputClass} value={form.occupation} onChange={e => setForm(f => ({ ...f, occupation: e.target.value }))} /></Field>
    <Field id="skills" label="Skills" tag="Self-declared" optional><textarea id="skills" className={inputClass} rows={3} value={form.skills} onChange={e => setForm(f => ({ ...f, skills: e.target.value }))} /></Field>
    <Button type="submit"><Check /> Save Profile</Button>
  </form>;
}