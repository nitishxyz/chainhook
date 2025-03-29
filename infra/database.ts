import { vpc } from "./vpc";

export const database = new sst.aws.Aurora("ChainhookDatabase", {
  engine: "postgres",
  dataApi: true,
  vpc,
  dev:
    $app.stage === "prod" || $app.stage === "dev"
      ? undefined
      : {
          host: "localhost",
          port: 5433,
          username: "postgres",
          password: "postgres",
          database: "postgres",
        },
});
