import { Schema } from "@once-ui-system/core/modules";
import App from "../../../src/App";
import { generatePageMetadata, getPageSchema } from "../../resources/seo";

export async function generateMetadata() {
  return generatePageMetadata("defense");
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
