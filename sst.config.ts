/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "chainhook",
      removal: input?.stage === "production" ? "retain" : "remove",
      protect: ["production"].includes(input?.stage),
      home: "aws",
      providers: {
        aws: {
          profile: "slashforge",
          region: "us-east-1",
        },
      },
    };
  },
  async run() {
    const { vpc } = await import("./infra/vpc");
    const { database } = await import("./infra/database");
    const { auth } = await import("./infra/auth");
    const { platform } = await import("./infra/platform");
    await import("./infra/secrets");

    return {
      vpcId: vpc.id,
      platformUrl: platform.url,
      authUrl: auth.url,
      databaseHost: database.host,
      databasePort: database.port,
      databaseUsername: database.username,
      databasePassword: database.password,
      databaseName: database.database,
      databaseId: database.id,
    };
  },
  console: {
    autodeploy: {
      target(event) {
        // Only deploy to dev when the main branch is pushed
        if (
          event.type === "branch" &&
          event.branch === "main" &&
          event.action === "pushed"
        ) {
          return { stage: "dev" };
        }
      },
    },
  },
});
