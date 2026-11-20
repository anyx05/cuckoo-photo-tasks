import { createFileRoute } from "@tanstack/react-router";
import { EmployerDashboard } from "@/components/cuckoo/list-screens";
import { pageHead } from "@/components/cuckoo/page-meta";

export const Route = createFileRoute("/employer/")({
  head: () => pageHead("İşveren paneli", "Araç fotoğrafı görevlerinizi yönetin."),
  component: Page,
});

function Page() {
  return <EmployerDashboard  />;
}
