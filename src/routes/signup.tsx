import { createFileRoute } from "@tanstack/react-router";
import { AuthScreen } from "@/components/cuckoo/auth-screen";
import { pageHead } from "@/components/cuckoo/page-meta";

export const Route = createFileRoute("/signup")({
  head: () => pageHead("Kayıt ol", "Kurgusal bir Cuckoo demo hesabı oluşturun."),
  component: Page,
});

function Page() {
  return <AuthScreen signup />;
}
