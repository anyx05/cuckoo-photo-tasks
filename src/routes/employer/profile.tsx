import { createFileRoute } from "@tanstack/react-router";
import { ProfileScreen } from "@/components/cuckoo/form-screens";
import { pageHead } from "@/components/cuckoo/page-meta";

export const Route = createFileRoute("/employer/profile")({
  head: () => pageHead("Employer Profile", "Edit your Cuckoo employer demo profile."),
  component: Page,
});

function Page() {
  return <ProfileScreen role="EMPLOYER" />;
}
