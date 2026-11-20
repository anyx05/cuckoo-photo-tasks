import { createFileRoute } from "@tanstack/react-router";
import { TaskDetails } from "@/components/cuckoo/task-screens";
import { pageHead } from "@/components/cuckoo/page-meta";

export const Route = createFileRoute("/employer/tasks/$taskId/")({
  head: () => pageHead("İşveren · Görev ayrıntıları", "Başvuruları inceleyin, bir görev alan seçin ve simüle ödeme bekletmesini kaydedin."),
  component: Page,
});

function Page() {
  return <TaskDetails role="EMPLOYER" taskId={Route.useParams().taskId} />;
}
