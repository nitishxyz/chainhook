import { vpc } from "./vpc";
import { auth } from "./auth";
import { database } from "./database";
import { domains } from "./domains";

export const platform = new sst.aws.Nextjs("ChainhookPlatform", {
  vpc: vpc,
  path: "./platform",
  link: [auth, database],
  domain: {
    name: domains.platform,
    redirects: [`www.${domains.platform}`],
  },
  dev: {
    command: "npm run dev",
  },
});
