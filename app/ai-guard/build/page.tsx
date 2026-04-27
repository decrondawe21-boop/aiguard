import { Meta, Schema } from "@once-ui-system/core/modules";
import App from "../../../src/App";
import { getPageMeta, getPageSchema } from "../../resources/seo";

export async function generateMetadata() {
  return Meta.generate(getPageMeta("build"));
}

export default function AiGuardBuildPage() {
  const schema = getPageSchema("build");

  return (
    <>
      <Schema {...schema} />
      <App page="build" />
    </>
  );
}
