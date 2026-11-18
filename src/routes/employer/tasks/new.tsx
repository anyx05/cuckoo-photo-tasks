import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/cuckoo/shell";
import { Notice } from "@/components/cuckoo/ui";

export const Route = createFileRoute("/employer/tasks/new")({
  head: () => ({ meta: [{ title: "Create a Task — Cuckoo" }, { name: "description", content: "Cuckoo prototype: Create a Task" }] }),
  component: Page,
});

function Page() {
  return (
    <AppShell role="EMPLOYER" title="Create a Task">
      <PageHeader title="Create a Task" />
      <Notice title="Screen not built yet">This screen is still to be built in the prototype.</Notice>
    </AppShell>
  );
}
