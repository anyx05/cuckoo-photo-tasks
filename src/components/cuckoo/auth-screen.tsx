import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, LogIn } from "lucide-react";
import { useState } from "react";
import { createSession, registerUser } from "@/mock/api";
import { CITIES } from "@/mock/seed";
import { useDemo } from "@/mock/store";
import type { Role } from "@/mock/types";
import { Feedback, useFeedback } from "./form-feedback";
import { DemoBar, DemoEntryButtons, Logo, backLinkClass } from "./shell";
import { Button, Field, Notice, inputClass } from "./ui";

export function AuthScreen({ signup = false }: { signup?: boolean }) {
  const { run, setActorId } = useDemo();
  const navigate = useNavigate();
  const feedback = useFeedback();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role | "">("");
  const [city, setCity] = useState("");
  const fields = feedback.error?.fields;
  return <div className="min-h-screen" data-screen={signup ? "Sign Up" : "Sign In"}><DemoBar /><main className="mx-auto max-w-md px-5 py-8"><div className="mb-6 flex items-center gap-4"><Link to="/" className={backLinkClass} aria-label="Back to Welcome"><ArrowLeft /></Link><Logo size="lg" /></div><h1 className="mb-6 text-2xl font-extrabold">{signup ? "Create Your Account" : "Welcome back"}</h1><form noValidate className="space-y-5" onSubmit={e => { e.preventDefault(); const result = run(s => signup ? registerUser(s, { email, password, role, operatingCity: city }) : createSession(s, { email, password })); feedback.accept(result); if (result.ok) { setActorId(result.data.id); setPassword(""); navigate({ to: result.data.role === "EMPLOYER" ? "/employer" : "/taker" }); } }}>
    <Notice title="Demo account only">No real account is created. Use fictional details; do not enter a real password.</Notice><Feedback {...feedback} />
    <Field id="email" label="Email" error={fields?.["email"]}><input id="email" type="email" autoComplete="off" className={inputClass} value={email} onChange={e => setEmail(e.target.value)} aria-invalid={!!fields?.["email"]} aria-describedby={fields?.["email"] ? "email-error" : undefined} /></Field>
    <Field id="password" label="Password" error={fields?.["password"]}><input id="password" type="password" autoComplete="off" className={inputClass} value={password} onChange={e => setPassword(e.target.value)} aria-invalid={!!fields?.["password"]} aria-describedby={fields?.["password"] ? "password-error" : undefined} /></Field>
    {signup && <><Field id="role" label="Role" error={fields?.["role"]}><select id="role" className={inputClass} value={role} onChange={e => { const v = e.target.value; setRole(v === "EMPLOYER" || v === "TASK_TAKER" ? v : ""); }} aria-invalid={!!fields?.["role"]}><option value="">Choose a role</option><option value="EMPLOYER">Employer</option><option value="TASK_TAKER">Task Taker</option></select></Field><Field id="registration-city" label="Operating city" tag="Self-declared" optional><select id="registration-city" className={inputClass} value={city} onChange={e => setCity(e.target.value)}><option value="">Not specified</option>{CITIES.map(c => <option key={c}>{c}</option>)}</select></Field></>}
    <Button type="submit" className="w-full"><LogIn />{signup ? "Register" : "Sign In"}</Button>
  </form><p className="my-5 text-center text-sm text-muted-foreground">{signup ? "Already have a demo account?" : "New to Cuckoo?"} <Link to={signup ? "/signin" : "/signup"} className="font-bold text-primary">{signup ? "Sign In" : "Sign Up"}</Link></p><DemoEntryButtons /></main></div>;
}