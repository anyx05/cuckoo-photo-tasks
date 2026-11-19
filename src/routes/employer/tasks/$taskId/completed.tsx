import { createFileRoute } from "@tanstack/react-router";
import { TaskCompleted } from "@/components/cuckoo/evidence-screens";
import { pageHead } from "@/components/cuckoo/page-meta";

export const Route = createFileRoute("/employer/tasks/$taskId/completed")({
  head: () => pageHead("Task Completed", "Confirm evidence approval and simulated payment release."),
  component: Page,
});

function Page() {
  return <TaskCompleted taskId={Route.useParams().taskId} />;
}
