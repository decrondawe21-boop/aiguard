import { Schema } from "@once-ui-system/core/modules";
import App from "../src/App";
import { generatePageMetadata, getPageSchema } from "./resources/seo";

export async function generateMetadata() {
  return generatePageMetadata("ultimate");
}

export default function Page() {
  const schema = getPageSchema("ultimate");

  return (
    <>
      <Schema {...schema} />
      <App page="ultimate" />
    </>
  );
}
