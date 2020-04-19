import { TodosService } from '../services/todoService';
import { TodoItem } from '../models/TodoItem';
import { CreateTodoRequest } from '../requests/CreateTodoRequest';
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest';
import * as uuid from 'uuid';

const todosService = new TodosService();
const imagesBucket = process.env.IMAGES_BUCKET_NAME;

export const getTodos = (userId: string): Promise<TodoItem[]> => {
    return todosService.getTodos(userId);
}

export const getTodoById = (userId:string, todoId:string): Promise<TodoItem> => {
  return todosService.getTodoById(userId, todoId);
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

export const updateTodo = (foundTodo: TodoItem, todoUpdate: UpdateTodoRequest): Promise<TodoItem> => {

  const updateItem: TodoItem = {
    ...foundTodo,
    ...todoUpdate
  }

  return todosService.updateTodo(updateItem);
}
