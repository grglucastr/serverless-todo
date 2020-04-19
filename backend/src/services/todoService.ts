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

  async getTodoById(userId:string, todoId: string): Promise<TodoItem> {
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

  async createTodo(newTodo: TodoItem): Promise<TodoItem> {   
    await docClient.put({
      TableName: todosTable,
      Item: newTodo,
      ReturnValues: 'ALL_OLD'
    }).promise();

    return newTodo;
  }

  async updateTodo(todoUpdate: TodoItem): Promise<TodoItem> {
    await docClient.update({
      TableName: todosTable,
      Key:{
        'userId': todoUpdate.userId,
        'createdAt': todoUpdate.createdAt
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

    return todoUpdate as TodoItem;
  }
}