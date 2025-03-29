import { vpc } from "./vpc";
import { database } from "./database";
import { domains } from "./domains";

const architecture = process.arch === "arm64" ? "arm64" : "x86_64";

export const helius = new sst.aws.Function("Helius", {
  url: true,
  vpc: vpc,
  link: [database],
  architecture,
  handler: "functions/src/helius.handler",
});

export const heliusRouter = new sst.aws.Router("HeliusRouter", {
  routes: {
    "/*": {
      url: helius.url,
    },
  },
  domain: domains.helius,
});
