import { createFileRoute } from "@tanstack/react-router";
import { AuthScreen } from "@/components/cuckoo/auth-screen";
import { pageHead } from "@/components/cuckoo/page-meta";

export const Route = createFileRoute("/signin")({
  head: () => pageHead("Sign In", "Sign in to a fictional Cuckoo demo account."),
  component: Page,
});

function Page() {
  return <AuthScreen  />;
}
