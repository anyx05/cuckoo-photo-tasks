import { createFileRoute } from "@tanstack/react-router";
import { ProfileScreen } from "@/components/cuckoo/form-screens";
import { pageHead } from "@/components/cuckoo/page-meta";

export const Route = createFileRoute("/employer/profile")({
  head: () => pageHead("İşveren profili", "Cuckoo işveren demo profilinizi düzenleyin."),
  component: Page,
});

function Page() {
  return <ProfileScreen role="EMPLOYER" />;
}
