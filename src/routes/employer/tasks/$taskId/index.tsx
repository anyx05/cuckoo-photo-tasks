import { createFileRoute } from "@tanstack/react-router";
import { TaskDetails } from "@/components/cuckoo/task-screens";
import { pageHead } from "@/components/cuckoo/page-meta";

export const Route = createFileRoute("/employer/tasks/$taskId/")({
  head: () => pageHead("Employer Task Details", "Review applications, assign a taker and record a simulated hold."),
  component: Page,
});

function Page() {
  return <TaskDetails role="EMPLOYER" taskId={Route.useParams().taskId} />;
}
