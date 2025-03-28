import { handle } from "hono/aws-lambda";
import { issuer } from "@openauthjs/openauth";
import { MemoryStorage } from "@openauthjs/openauth/storage/memory";
import { subjects } from "./subjects";
import { GithubProvider } from "@openauthjs/openauth/provider/github";
import { Resource } from "sst";
import { CodeProvider } from "@openauthjs/openauth/provider/code";
import { CodeUI } from "@openauthjs/openauth/ui/code";

async function getUser(email: string) {
  // Get user from database and return user ID
  return email;
}

const app = issuer({
  subjects,
  storage: MemoryStorage(),
  allow: async () => true,
  providers: {
    code: CodeProvider(
      CodeUI({
        sendCode: async (email, code) => {
          console.log(email, code);
        },
      })
    ),
    github: GithubProvider({
      clientID: Resource.GithubClientId.value,
      clientSecret: Resource.GithubClientSecret.value,
      scopes: ["user:email"],
    }),
  },
  success: async (ctx, value) => {
    if (value.provider === "code") {
      return ctx.subject("user", {
        id: await getUser(value.claims.email),
      });
    } else if (value.provider === "github") {
      return ctx.subject("user", {
        id: await getUser(value.tokenset.access),
      });
    }
    throw new Error("Invalid provider");
  },
});

export const handler = handle(app);
