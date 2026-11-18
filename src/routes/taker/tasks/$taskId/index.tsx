import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/cuckoo/shell";
import { Notice } from "@/components/cuckoo/ui";

export const Route = createFileRoute("/taker/tasks/$taskId/")({
  head: () => ({ meta: [{ title: "Task Details — Cuckoo" }, { name: "description", content: "Cuckoo prototype: Task Details" }] }),
  component: Page,
});

function Page() {
  return (
    <AppShell role="TASK_TAKER" title="Task Details">
      <PageHeader title="Task Details" />
      <Notice title="Screen not built yet">This screen is still to be built in the prototype.</Notice>
    </AppShell>
  );
}
