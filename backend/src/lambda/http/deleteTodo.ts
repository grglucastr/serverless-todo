import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { TodoItem } from '../../models/TodoItem'
import { databaseConnection } from '../../utils/dbclient';
import 'source-map-support/register'

const todosTable = process.env.TODOS_TABLE;

const docClient = databaseConnection();

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId
  const userId = "1";

  const foundTodo = await getUserTodoById(userId, todoId);
  if(!foundTodo){
    return {
      statusCode: 404,
      body: JSON.stringify({message: 'Todo not found'})
    }
  }

  await docClient.delete({
    TableName: todosTable,
    Key:{
      'userId':userId,
      'createdAt': foundTodo.createdAt
    }
  }).promise();

  return {
    statusCode: 204,
    headers:{
      'Access-Control-Allow-Origin':'*'
    },
    body: JSON.stringify({})
  }
}

async function getUserTodoById(userId:string, todoId:string): Promise<TodoItem>{
  const response = await docClient.query({
    TableName: todosTable,
    KeyConditionExpression: "userId = :userId",
    FilterExpression: "todoId = :todoId",
    ExpressionAttributeValues: {
      ":userId": userId,
      ":todoId": todoId
    }
  }).promise();
  return response.Items[0] as TodoItem;
}
