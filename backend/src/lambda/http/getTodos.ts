import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { databaseConnection } from '../../utils/dbclient';
import 'source-map-support/register'

const docClient = databaseConnection();
const todosTable = process.env.TODOS_TABLE;

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  // TODO: Get all TODO items for a current user
  console.log('event: ', event);

  const params = {
    TableName : todosTable,
    KeyConditionExpression: "#uId = :uId",
    ExpressionAttributeNames:{
        "#uId": "userId"
    },
    ExpressionAttributeValues: {
        ":uId":"1"
    }
  }

  const todosForUser1 = await docClient.query(params).promise();

  return {
    statusCode: 200,
    headers:{
      'Access-Control-Allow-Origin':'*'
    },
    body: JSON.stringify(todosForUser1)
  }

}
