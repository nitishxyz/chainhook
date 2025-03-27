import { vpc } from "./vpc";
import { domains } from "./domains";

export const frontend = new sst.aws.TanStackStart("ChainhookFrontend", {
  path: "./frontend",
  vpc: vpc,
  domain: {
    name: domains.frontend,
    redirects: [`www.${domains.frontend}`],
  },
  dev: {
    command: "npm run dev",
  },
});
