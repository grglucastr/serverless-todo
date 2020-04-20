import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { parseUserId, extractJwtFromHeader } from '../../auth/utils';
import { deleteTodo, getTodoById } from '../../businessLogic/todos';
import 'source-map-support/register'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId
  
  const jwtToken = extractJwtFromHeader(event.headers.Authorization);
  const userId = parseUserId(jwtToken);
  const todo = await getTodoById(userId, todoId);
  
  if(!todo){
    return {
      statusCode: 404,
      headers:{
        'Access-Control-Allow-Origin':'*'
      },
      body: JSON.stringify({message: 'Todo not found'})
    }
  }
  
  await deleteTodo(todo);

  return {
    statusCode: 204,
    headers:{
      'Access-Control-Allow-Origin':'*'
    },
    body: JSON.stringify({})
  }
}
