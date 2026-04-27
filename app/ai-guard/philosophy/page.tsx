import { Meta, Schema } from "@once-ui-system/core/modules";
import App from "../../../src/App";
import { getPageMeta, getPageSchema } from "../../resources/seo";

export async function generateMetadata() {
  return Meta.generate(getPageMeta("philosophy"));
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
