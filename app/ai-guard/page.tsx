import { Meta, Schema } from "@once-ui-system/core/modules";
import App from "../../src/App";
import { getPageMeta, getPageSchema } from "../resources/seo";

export async function generateMetadata() {
  return Meta.generate(getPageMeta("aiGuard"));
}

export default function AiGuardPage() {
  const schema = getPageSchema("aiGuard");

  return (
    <>
      <Schema {...schema} />
      <App page="ai-guard" />
    </>
  );
}
