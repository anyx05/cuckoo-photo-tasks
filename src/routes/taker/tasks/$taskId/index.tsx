import { createFileRoute } from "@tanstack/react-router";
import { TaskDetails } from "@/components/cuckoo/task-screens";
import { pageHead } from "@/components/cuckoo/page-meta";

export const Route = createFileRoute("/taker/tasks/$taskId/")({
  head: () => pageHead("Görev Alan · Görev ayrıntıları", "Göreve başvurun veya size atanan görevin ayrıntılarını görün."),
  component: Page,
});

function Page() {
  return <TaskDetails role="TASK_TAKER" taskId={Route.useParams().taskId} />;
}
