import type { APIGatewayProxyEvent, Handler } from "aws-lambda";

export const handler: Handler<APIGatewayProxyEvent> = async (event) => {
  console.log(event);
  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Hello, world!" }),
  };
};
