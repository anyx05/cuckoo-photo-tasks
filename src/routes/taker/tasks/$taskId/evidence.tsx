import { createFileRoute } from "@tanstack/react-router";
import { SubmitEvidence } from "@/components/cuckoo/evidence-screens";
import { pageHead } from "@/components/cuckoo/page-meta";

export const Route = createFileRoute("/taker/tasks/$taskId/evidence")({
  head: () => pageHead("Submit Evidence", "Select synthetic vehicle photos and record visible observations."),
  component: Page,
});

function Page() {
  return <SubmitEvidence taskId={Route.useParams().taskId} />;
}
