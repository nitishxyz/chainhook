import type { APIGatewayProxyEvent, Handler } from "aws-lambda";

export const handler: Handler<APIGatewayProxyEvent> = async (event) => {
  const body = event.body ? JSON.parse(event.body) : null;
  console.log(body);
  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Hello, world!" }),
  };
};
