export const vpc =
  $app.stage === "prod" || $app.stage === "dev"
    ? new sst.aws.Vpc("chainhookVpc", { bastion: true, nat: "ec2" })
    : sst.aws.Vpc.get("chainhookVpc", "vpc-03c5b91ff4f05d213");
