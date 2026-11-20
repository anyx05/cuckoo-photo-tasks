import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { describe, expect, it } from "vitest";

import { routeTree } from "@/routeTree.gen";

// Match routes without running loaders or rendering: loaders may need a server or
// network the test run lacks, and jsdom never loads the stylesheets React waits on.
describe("App routing", () => {
  it.each([
    ["/", "/"],
    ["/signin", "/signin"],
    ["/signup", "/signup"],
    ["/employer", "/employer/"],
    ["/employer/tasks/new", "/employer/tasks/new"],
    ["/employer/tasks/t-ankara/review", "/employer/tasks/$taskId/review"],
    ["/employer/tasks/t-ankara/completed", "/employer/tasks/$taskId/completed"],
    ["/taker/find", "/taker/find"],
    ["/taker/tasks/t-ankara/evidence", "/taker/tasks/$taskId/evidence"],
  ])("matches %s to %s", (pathname, routeId) => {
    const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });

    const matches = router.matchRoutes(pathname);

    expect(matches.at(-1)?.routeId).toBe(routeId);
  });
});
