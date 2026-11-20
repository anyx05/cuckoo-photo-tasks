import { createFileRoute } from "@tanstack/react-router";
import { ProfileScreen } from "@/components/cuckoo/form-screens";
import { pageHead } from "@/components/cuckoo/page-meta";

export const Route = createFileRoute("/taker/profile")({
  head: () => pageHead("Görev Alan profili", "Kendi beyanınıza dayanan çalışma şehri, meslek ve becerilerinizi düzenleyin."),
  component: Page,
});

function Page() {
  return <ProfileScreen  />;
}
