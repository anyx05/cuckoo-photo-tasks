import { createFileRoute, Link } from "@tanstack/react-router";
import mascot from "@/assets/mascot.png";
import { DemoBar, DemoEntryButtons, Logo } from "@/components/cuckoo/shell";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Welcome — Cuckoo" },
      { name: "description", content: "Cuckoo connects employers with task takers for permitted vehicle exterior photos." },
      { property: "og:title", content: "Welcome — Cuckoo" },
      { property: "og:description", content: "Permitted vehicle exterior photo tasks — clickable prototype." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Welcome,
});

function Welcome() {
  return (
    <div className="min-h-screen" data-screen="Welcome">
      <DemoBar />
      <main className="mx-auto flex max-w-xl flex-col items-center gap-6 px-6 py-12 text-center">
        <Logo size="lg" />
        <h1 className="text-4xl font-extrabold tracking-tight">Hello! Welcome to Cuckoo</h1>
        <p className="text-muted-foreground">Permitted exterior vehicle photos, posted and taken with care.</p>
        <img src={mascot} alt="Cuckoo mascot holding an envelope" width={1024} height={1024} className="size-56" />
        <Link to="/taker" className="inline-flex h-12 items-center rounded-xl bg-primary px-8 font-semibold text-primary-foreground shadow-soft">Get Started</Link>
        <DemoEntryButtons />
      </main>
    </div>
  );
}
