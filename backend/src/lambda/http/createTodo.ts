import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import { CreateTodoRequest } from '../../requests/CreateTodoRequest';
import { createTodo } from '../../businessLogic/todos';
import { parseUserId, extractJwtFromHeader } from '../../auth/utils';
import 'source-map-support/register';

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const newTodo: CreateTodoRequest = JSON.parse(event.body);

  const jwtToken = extractJwtFromHeader(event.headers.Authorization);
  const userId = parseUserId(jwtToken);

  const todo = await createTodo(userId, newTodo);

  return {
    statusCode: 201,
    headers:{
      'Access-Control-Allow-Origin':'*'
    },
    body: JSON.stringify({item: {...todo}})
  }
}
