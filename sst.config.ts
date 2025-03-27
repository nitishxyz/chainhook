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
    const { frontend } = await import("./infra/frontend");

    return {
      vpcId: vpc.id,
      frontendUrl: frontend.url,
    };
  },
});
