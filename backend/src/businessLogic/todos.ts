import { TodosService } from '../services/todoService';
import { TodoItem } from '../models/TodoItem';

const todosService = new TodosService();

export const getTodos = (userId): Promise<TodoItem[]> => {
    return todosService.getTodos(userId);
}