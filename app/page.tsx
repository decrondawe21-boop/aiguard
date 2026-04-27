import { Meta, Schema } from "@once-ui-system/core/modules";
import App from "../src/App";
import { getPageMeta, getPageSchema } from "./resources/seo";

export async function generateMetadata() {
  return Meta.generate(getPageMeta("ultimate"));
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
