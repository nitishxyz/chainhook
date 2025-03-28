import { vpc } from "./vpc";
import { domains } from "./domains";

export const frontend = new sst.aws.TanStackStart("ChainhookFrontend", {
  path: "./frontend",
  vpc: vpc,
  domain: {
    name: domains.platform,
    redirects: [`www.${domains.platform}`],
  },
  dev: {
    command: "npm run dev",
  },
});
