import type { Route } from "next";
import { redirect } from "next/navigation";

export default function ExpectedResultsRoute() {
  redirect("/ai-guard/results" as Route);
}
