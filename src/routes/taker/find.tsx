import { createFileRoute } from "@tanstack/react-router";
import { FindTasks } from "@/components/cuckoo/list-screens";
import { pageHead } from "@/components/cuckoo/page-meta";

export const Route = createFileRoute("/taker/find")({
  head: () => pageHead("Find Tasks", "Browse open permitted vehicle photo tasks by city."),
  component: Page,
});

function Page() {
  return <FindTasks  />;
}
