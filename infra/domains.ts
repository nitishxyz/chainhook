const SUB = $app.stage === "prod" ? "" : `${$app.stage}.`;

export const domains = {
  api: `${SUB}api.chainhook.org`,
  platform: `${SUB}chainhook.org`,
  auth: `${SUB}auth.chainhook.org`,
};
