export const vpc =
  $app.stage === "prod" || $app.stage === "dev"
    ? new sst.aws.Vpc("chainhookVpc", { bastion: true, nat: "ec2" })
    : sst.aws.Vpc.get("chainhookVpc", "vpc-0f1d148e6e44b7925");
