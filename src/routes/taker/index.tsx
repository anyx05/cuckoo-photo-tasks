import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/cuckoo/shell";
import { Notice } from "@/components/cuckoo/ui";

export const Route = createFileRoute("/taker/")({
  head: () => ({ meta: [{ title: "My Tasks — Cuckoo" }, { name: "description", content: "Cuckoo prototype: My Tasks" }] }),
  component: Page,
});

function Page() {
  return (
    <AppShell role="TASK_TAKER" title="My Tasks">
      <PageHeader title="My Tasks" />
      <Notice title="Screen not built yet">This screen is still to be built in the prototype.</Notice>
    </AppShell>
  );
}
