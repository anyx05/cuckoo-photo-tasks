import { createFileRoute } from "@tanstack/react-router";
import { AuthScreen } from "@/components/cuckoo/auth-screen";
import { pageHead } from "@/components/cuckoo/page-meta";

export const Route = createFileRoute("/signup")({
  head: () => pageHead("Sign Up", "Create a fictional Cuckoo demo account."),
  component: Page,
});

function Page() {
  return <AuthScreen signup />;
}
