import { Meta, Schema } from "@once-ui-system/core/modules";
import App from "../../../src/App";
import { getPageMeta, getPageSchema } from "../../resources/seo";

export async function generateMetadata() {
  return Meta.generate(getPageMeta("defense"));
}

export default function AiGuardDefensePage() {
  const schema = getPageSchema("defense");

  return (
    <>
      <Schema {...schema} />
      <App page="defense" />
    </>
  );
}
