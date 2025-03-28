import { domains } from "./domains";
import { githubClientId, githubClientSecret } from "./secrets";
export const auth = new sst.aws.Auth("ChainhookAuth", {
  domain: domains.auth,
  authorizer: {
    handler: "auth/auth.handler",
    link: [githubClientId, githubClientSecret],
  },
});
