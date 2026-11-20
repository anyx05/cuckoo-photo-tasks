import { createFileRoute } from "@tanstack/react-router";
import { pageHead } from "@/components/cuckoo/page-meta";
import { Welcome } from "@/components/cuckoo/welcome-screen";

export const Route = createFileRoute("/")({
  head: () => pageHead("Karşılama", "İzinli araç dış görünüm fotoğrafları için Cuckoo demosu."),
  component: Welcome,
});
