import { Schema } from "@once-ui-system/core/modules";
import App from "../../../src/App";
import { generatePageMetadata, getPageSchema } from "../../resources/seo";

export async function generateMetadata() {
  return generatePageMetadata("philosophy");
}

export default function AiGuardPhilosophyPage() {
  const schema = getPageSchema("philosophy");

  return (
    <>
      <Schema {...schema} />
      <App page="philosophy" />
    </>
  );
}
