import { createFileRoute } from "@tanstack/react-router";
import { CreateTaskScreen } from "@/components/cuckoo/form-screens";
import { pageHead } from "@/components/cuckoo/page-meta";

export const Route = createFileRoute("/employer/tasks/new")({
  head: () => pageHead("Create a Task", "Post a permitted exterior vehicle photo task."),
  component: Page,
});

function Page() {
  return <CreateTaskScreen  />;
}
