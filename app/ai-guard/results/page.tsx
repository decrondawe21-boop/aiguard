import { Meta, Schema } from "@once-ui-system/core/modules";
import { ExpectedResultsPage } from "../../../src/components/analytics/ExpectedResultsPage";
import { getPageMeta, getPageSchema } from "../../resources/seo";

export async function generateMetadata() {
  return Meta.generate(getPageMeta("results"));
}

export default function AiGuardResultsPage() {
  const schema = getPageSchema("results");

  return (
    <>
      <Schema {...schema} />
      <ExpectedResultsPage />
    </>
  );
}
