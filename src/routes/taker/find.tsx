import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/cuckoo/shell";
import { Notice } from "@/components/cuckoo/ui";

export const Route = createFileRoute("/taker/find")({
  head: () => ({ meta: [{ title: "Find Tasks — Cuckoo" }, { name: "description", content: "Cuckoo prototype: Find Tasks" }] }),
  component: Page,
});

function Page() {
  return (
    <AppShell role="TASK_TAKER" title="Find Tasks">
      <PageHeader title="Find Tasks" />
      <Notice title="Screen not built yet">This screen is still to be built in the prototype.</Notice>
    </AppShell>
  );
}
