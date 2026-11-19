import { createFileRoute } from "@tanstack/react-router";
import { TakerDashboard } from "@/components/cuckoo/list-screens";
import { pageHead } from "@/components/cuckoo/page-meta";

export const Route = createFileRoute("/taker/")({
  head: () => pageHead("Task Taker My Tasks", "View your applications and assigned Cuckoo tasks."),
  component: Page,
});

function Page() {
  return <TakerDashboard  />;
}
