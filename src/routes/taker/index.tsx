import { createFileRoute } from "@tanstack/react-router";
import { TakerDashboard } from "@/components/cuckoo/list-screens";
import { pageHead } from "@/components/cuckoo/page-meta";

export const Route = createFileRoute("/taker/")({
  head: () => pageHead("Görevlerim", "Başvurularınızı ve size atanan görevleri görün."),
  component: Page,
});

function Page() {
  return <TakerDashboard  />;
}
