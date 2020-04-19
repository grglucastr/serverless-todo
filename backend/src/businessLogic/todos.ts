import { TodosService } from '../services/todoService';
import { TodoItem } from '../models/TodoItem';
import { CreateTodoRequest } from '../requests/CreateTodoRequest';
import * as uuid from 'uuid';

const todosService = new TodosService();
const imagesBucket = process.env.IMAGES_BUCKET_NAME;

export const getTodos = (userId: string): Promise<TodoItem[]> => {
    return todosService.getTodos(userId);
}

export const createTodo = (userId:string, newTodo: CreateTodoRequest): Promise<TodoItem> => {
  const todoId = uuid.v4();
  const todo: TodoItem = {
    createdAt: new Date().toISOString(),
    done: false,
    dueDate: newTodo.dueDate,
    name: newTodo.name,
    todoId: todoId,
    userId,
    attachmentUrl: `https://${imagesBucket}.s3.amazonaws.com/${todoId}`
  }

  return todosService.createTodo(todo);
}