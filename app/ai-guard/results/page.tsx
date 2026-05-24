import { Schema } from "@once-ui-system/core/modules";
import { ExpectedResultsPage } from "../../../src/components/analytics/ExpectedResultsPage";
import { generatePageMetadata, getPageSchema } from "../../resources/seo";

export async function generateMetadata() {
  return generatePageMetadata("results");
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
