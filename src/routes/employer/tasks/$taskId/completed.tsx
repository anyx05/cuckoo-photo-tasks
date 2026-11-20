import { createFileRoute } from "@tanstack/react-router";
import { TaskCompleted } from "@/components/cuckoo/evidence-screens";
import { pageHead } from "@/components/cuckoo/page-meta";

export const Route = createFileRoute("/employer/tasks/$taskId/completed")({
  head: () => pageHead("Görev tamamlandı", "Kanıt onayını ve simüle ödeme durumunu görün."),
  component: Page,
});

function Page() {
  return <TaskCompleted taskId={Route.useParams().taskId} />;
}
