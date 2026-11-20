import { createFileRoute } from "@tanstack/react-router";
import { AuthScreen } from "@/components/cuckoo/auth-screen";
import { pageHead } from "@/components/cuckoo/page-meta";

export const Route = createFileRoute("/signin")({
  head: () => pageHead("Giriş yap", "Kurgusal Cuckoo demo hesabınızla giriş yapın."),
  component: Page,
});

function Page() {
  return <AuthScreen  />;
}
