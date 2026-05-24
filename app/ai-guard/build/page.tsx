import { Schema } from "@once-ui-system/core/modules";
import App from "../../../src/App";
import { generatePageMetadata, getPageSchema } from "../../resources/seo";

export async function generateMetadata() {
  return generatePageMetadata("build");
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
