import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { parseUserId, extractJwtFromHeader } from '../../auth/utils'
import {getTodos} from '../../businessLogic/todos';
import 'source-map-support/register'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log('event: ', event);
  
  const jwtToken = extractJwtFromHeader(event.headers.Authorization);
  const userId = parseUserId(jwtToken);

  const todos = await getTodos(userId);
  const response = {items: todos};

  return {
    statusCode: 200,
    headers:{
      'Access-Control-Allow-Origin':'*'
    },
    body: JSON.stringify(response)
  }

}
