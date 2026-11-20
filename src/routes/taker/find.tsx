import { createFileRoute } from "@tanstack/react-router";
import { FindTasks } from "@/components/cuckoo/list-screens";
import { pageHead } from "@/components/cuckoo/page-meta";

export const Route = createFileRoute("/taker/find")({
  head: () => pageHead("Görev bul", "Başvuruya açık izinli araç fotoğrafı görevlerini şehre göre inceleyin."),
  component: Page,
});

function Page() {
  return <FindTasks  />;
}
