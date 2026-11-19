import { createFileRoute } from "@tanstack/react-router";
import { ProfileScreen } from "@/components/cuckoo/form-screens";
import { pageHead } from "@/components/cuckoo/page-meta";

export const Route = createFileRoute("/taker/profile")({
  head: () => pageHead("Task Taker Profile", "Edit self-declared operating city, occupation and skills."),
  component: Page,
});

function Page() {
  return <ProfileScreen  />;
}
