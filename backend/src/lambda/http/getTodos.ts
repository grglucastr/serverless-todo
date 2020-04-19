import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { databaseConnection } from '../../utils/dbclient';
import { parseUserId } from '../../auth/utils';
import 'source-map-support/register'

const docClient = databaseConnection();
const todosTable = process.env.TODOS_TABLE;

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  // TODO: Get all TODO items for a current user
  console.log('event: ', event);
  const authorization = event.headers.Authorization;
  const split = authorization.split(' ');
  const jwtToken = split[1];
  const userId = parseUserId(jwtToken);

  const params = {
    TableName : todosTable,
    KeyConditionExpression: "#uId = :uId",
    ExpressionAttributeNames:{
        "#uId": "userId"
    },
    ExpressionAttributeValues: {
        ":uId":userId
    }
  }

  const todosForUser1 = await docClient.query(params).promise();
  const response = {items:todosForUser1.Items};

  return {
    statusCode: 200,
    headers:{
      'Access-Control-Allow-Origin':'*'
    },
    body: JSON.stringify(response)
  }

}
