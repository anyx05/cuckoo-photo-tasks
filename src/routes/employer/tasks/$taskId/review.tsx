import { createFileRoute } from "@tanstack/react-router";
import { EvidenceReview } from "@/components/cuckoo/evidence-screens";
import { pageHead } from "@/components/cuckoo/page-meta";

export const Route = createFileRoute("/employer/tasks/$taskId/review")({
  head: () => pageHead("Evidence Review", "Review private sample photos, request revision or approve evidence."),
  component: Page,
});

function Page() {
  return <EvidenceReview taskId={Route.useParams().taskId} />;
}
