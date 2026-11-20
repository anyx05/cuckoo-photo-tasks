import { createFileRoute } from "@tanstack/react-router";
import { CreateTaskScreen } from "@/components/cuckoo/form-screens";
import { pageHead } from "@/components/cuckoo/page-meta";

export const Route = createFileRoute("/employer/tasks/new")({
  head: () => pageHead("Görev oluştur", "İzinli araç dış görünüm fotoğrafları için görev yayınlayın."),
  component: Page,
});

function Page() {
  return <CreateTaskScreen  />;
}
