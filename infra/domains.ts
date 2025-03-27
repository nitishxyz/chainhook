const SUB = $app.stage === "prod" ? "" : `${$app.stage}.`;

export const domains = {
  api: `${SUB}api.chainhook.org`,
  frontend: `${SUB}chainhook.org`,
};
