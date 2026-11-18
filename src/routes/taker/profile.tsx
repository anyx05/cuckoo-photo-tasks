import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/cuckoo/shell";
import { Notice } from "@/components/cuckoo/ui";

export const Route = createFileRoute("/taker/profile")({
  head: () => ({ meta: [{ title: "Profile — Cuckoo" }, { name: "description", content: "Cuckoo prototype: Profile" }] }),
  component: Page,
});

function Page() {
  return (
    <AppShell role="TASK_TAKER" title="Profile">
      <PageHeader title="Profile" />
      <Notice title="Screen not built yet">This screen is still to be built in the prototype.</Notice>
    </AppShell>
  );
}
