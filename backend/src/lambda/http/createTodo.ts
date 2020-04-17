import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import { CreateTodoRequest } from '../../requests/CreateTodoRequest';
import { TodoItem } from '../../models/TodoItem';
import { databaseConnection } from '../../utils/dbclient';
import 'source-map-support/register';
import * as uuid from 'uuid';

const todosTable = process.env.TODOS_TABLE;
const docClient = databaseConnection();

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const newTodo: CreateTodoRequest = JSON.parse(event.body);
  console.log('newTodo: ', newTodo);

  const todo: TodoItem = {
    createdAt: new Date().toISOString(),
    done: false,
    dueDate: newTodo.dueDate,
    name: newTodo.name,
    todoId: uuid.v4(),
    userId: "1",
  }

  await docClient.put({
    TableName: todosTable,
    Item: todo
  }).promise();

  return {
    statusCode: 201,
    headers:{
      'Access-Control-Allow-Origin':'*'
    },
    body: JSON.stringify(todo)
  }
}
