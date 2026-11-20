import { createFileRoute } from "@tanstack/react-router";
import { SubmitEvidence } from "@/components/cuckoo/evidence-screens";
import { pageHead } from "@/components/cuckoo/page-meta";

export const Route = createFileRoute("/taker/tasks/$taskId/evidence")({
  head: () => pageHead("Kanıt gönder", "Kurgusal araç fotoğraflarını seçin ve görünür ayrıntıları yazın."),
  component: Page,
});

function Page() {
  return <SubmitEvidence taskId={Route.useParams().taskId} />;
}
