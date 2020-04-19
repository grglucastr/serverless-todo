import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest';
import { TodoItem } from '../../models/TodoItem';
import { databaseConnection } from '../../utils/dbclient';
import 'source-map-support/register'

const docClient = databaseConnection();
const todosTable = process.env.TODOS_TABLE; 

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const { todoId } = event.pathParameters;
  const todoUpdate: UpdateTodoRequest = JSON.parse(event.body);

  const foundTodo = await getUserTodoById("1", todoId);
  if(!foundTodo){
    return {
      statusCode: 404,
      body: JSON.stringify({message:'Todo not found.'})
    };
  }

  const updated = await docClient.update({
    TableName: todosTable,
    Key:{
      'userId': foundTodo.userId,
      'createdAt': foundTodo.createdAt
    },
    UpdateExpression: "set #nm = :name, #dd = :dueDate, #dn = :done",
    ExpressionAttributeNames:{
      '#nm':'name',
      '#dd':'dueDate',
      '#dn':'done',
    },
    ExpressionAttributeValues:{
      ':name': todoUpdate.name,
      ':dueDate':todoUpdate.dueDate,
      ':done':todoUpdate.done,
    },
    ReturnValues:'UPDATED_NEW'
  }).promise();

  return {
    statusCode: 200,
    headers:{
      'Access-Control-Allow-Origin':'*'
    },
    body: JSON.stringify({...foundTodo, ...updated.Attributes})
  };
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
