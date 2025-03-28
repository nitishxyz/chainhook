import { vpc } from "./vpc";
import { domains } from "./domains";

export const platform = new sst.aws.Nextjs("ChainhookPlatform", {
  vpc: vpc,
  path: "./platform",
  domain: {
    name: domains.platform,
    redirects: [`www.${domains.platform}`],
  },
  dev: {
    command: "npm run dev",
  },
});
