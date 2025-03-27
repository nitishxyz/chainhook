export const vpc =
  $app.stage === "prod" || $app.stage === "dev"
    ? new sst.aws.Vpc("chainhookVpc", { bastion: true, nat: "ec2" })
    : sst.aws.Vpc.get("chainhookVpc", "vpc-04a16eef27b7b30e0");
