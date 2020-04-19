import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest';
import { parseUserId, extractJwtFromHeader } from '../../auth/utils';
import { getTodoById, updateTodo } from '../../businessLogic/todos';
import 'source-map-support/register'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const { todoId } = event.pathParameters;
  const todoUpdate: UpdateTodoRequest = JSON.parse(event.body);
  
  const jwtToken = extractJwtFromHeader(event.headers.Authorization);
  const userId = parseUserId(jwtToken);

  const foundTodo = await getTodoById(userId, todoId);
  if(!foundTodo){
    return {
      statusCode: 404,
      headers:{
        'Access-Control-Allow-Origin':'*'
      },
      body: JSON.stringify({message:'Todo not found.'})
    };
  }

  const updated = await updateTodo(foundTodo, todoUpdate);

  return {
    statusCode: 200,
    headers:{
      'Access-Control-Allow-Origin':'*'
    },
    body: JSON.stringify(updated)
  };
}