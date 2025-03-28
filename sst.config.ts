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
    const { auth } = await import("./infra/auth");
    const { platform } = await import("./infra/platform");
    await import("./infra/secrets");

    return {
      vpcId: vpc.id,
      platformUrl: platform.url,
      authUrl: auth.url,
    };
  },
});
