import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import { CreateTodoRequest } from '../../requests/CreateTodoRequest';
import { TodoItem } from '../../models/TodoItem';
import { databaseConnection } from '../../utils/dbclient';
import 'source-map-support/register';
import * as uuid from 'uuid';

const todosTable = process.env.TODOS_TABLE;
const imagesBucket =  process.env.IMAGES_BUCKET_NAME;
const docClient = databaseConnection();

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const newTodo: CreateTodoRequest = JSON.parse(event.body);
  const todoId = uuid.v4();
  
  const todo: TodoItem = {
    createdAt: new Date().toISOString(),
    done: false,
    dueDate: newTodo.dueDate,
    name: newTodo.name,
    todoId: todoId,
    userId: "1",
    attachmentUrl: `https://${imagesBucket}.s3.amazonaws.com/${todoId}`
  }

  await docClient.put({
    TableName: todosTable,
    Item: todo,
    ReturnValues: 'ALL_OLD'
  }).promise();

  const response = {
    item:{
      ...todo
    }
  }
  
  return {
    statusCode: 201,
    headers:{
      'Access-Control-Allow-Origin':'*'
    },
    body: JSON.stringify(response)
  }
}
