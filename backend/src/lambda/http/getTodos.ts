import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import * as AWS from 'aws-sdk';

const docClient = new AWS.DynamoDB.DocumentClient();
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
    body: JSON.stringify(todosForUser1)
  }

}
