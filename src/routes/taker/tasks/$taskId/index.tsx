import { createFileRoute } from "@tanstack/react-router";
import { TaskDetails } from "@/components/cuckoo/task-screens";
import { pageHead } from "@/components/cuckoo/page-meta";

export const Route = createFileRoute("/taker/tasks/$taskId/")({
  head: () => pageHead("Task Taker Task Details", "Apply and view your assigned vehicle photo task."),
  component: Page,
});

function Page() {
  return <TaskDetails role="TASK_TAKER" taskId={Route.useParams().taskId} />;
}
