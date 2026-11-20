import { createFileRoute } from "@tanstack/react-router";
import { EvidenceReview } from "@/components/cuckoo/evidence-screens";
import { pageHead } from "@/components/cuckoo/page-meta";

export const Route = createFileRoute("/employer/tasks/$taskId/review")({
  head: () => pageHead("Kanıtları incele", "Örnek fotoğrafları inceleyin, düzeltme isteyin veya kanıtları onaylayın."),
  component: Page,
});

function Page() {
  return <EvidenceReview taskId={Route.useParams().taskId} />;
}
