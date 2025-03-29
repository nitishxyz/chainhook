import { vpc } from "./vpc";
import { auth } from "./auth";
import { database } from "./database";
import { domains } from "./domains";
import { heliusApiKey, heliusRpcUrl } from "./secrets";

export const platform = new sst.aws.Nextjs("ChainhookPlatform", {
  vpc: vpc,
  path: "./platform",
  link: [auth, database, heliusApiKey, heliusRpcUrl],
  domain: {
    name: domains.platform,
    redirects: [`www.${domains.platform}`],
  },
  buildCommand:
    "npm install --frozen-lockfile && npx --yes @opennextjs/aws@3.5.3 build",
  dev: {
    command: "npm run dev",
  },
});
