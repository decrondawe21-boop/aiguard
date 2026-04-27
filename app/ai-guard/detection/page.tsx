import { Meta, Schema } from "@once-ui-system/core/modules";
import App from "../../../src/App";
import { getPageMeta, getPageSchema } from "../../resources/seo";

export async function generateMetadata() {
  return Meta.generate(getPageMeta("detection"));
}

export default function AiGuardDetectionPage() {
  const schema = getPageSchema("detection");

  return (
    <>
      <Schema {...schema} />
      <App page="detection" />
    </>
  );
}
