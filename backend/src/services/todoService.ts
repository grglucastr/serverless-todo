import { databaseConnection } from '../utils/dbclient';
import { TodoItem } from '../models/TodoItem';

const docClient = databaseConnection();
const todosTable = process.env.TODOS_TABLE;

export class TodosService{

  async getTodos(userId:string): Promise<TodoItem[]> {
    const params = {
      TableName : todosTable,
      KeyConditionExpression: "#uId = :uId",
      ExpressionAttributeNames:{
        "#uId": "userId"
      },
      ExpressionAttributeValues: {
        ":uId":userId
      }
    }

    const response = await docClient.query(params).promise();
    return response.Items as TodoItem[];
  }

}