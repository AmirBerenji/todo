import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { Todos } from './todos.model';

@Injectable()
export class TodosService {
  constructor(private prisma: PrismaService) {}

  async getAllTodoByUser(userId: number): Promise<any> {
    try {
      const todos = await this.prisma.todo.findMany({
        where: { userId },
      });

      if (!todos.length) {
       
      }

      return todos;
    } catch (error) {
      
      throw new Error('Could not fetch todos. Please try again later.');
    }
  }

  async createTodo(data: Todos): Promise<any> {
    try {
      
      const result = await this.prisma.todo.create({
        data: {
          title: data.title,
          completed: data.completed ?? false,
          user: {
            connect: { id: data.userId }, 
          },
        },
      });

      if (!result) {
        throw new BadRequestException('We have some problem');
      }

      return this.getAllTodoByUser(data.userId);
    } catch (error) {
    
      throw new BadRequestException('Failed to create todo');
    }
  }

  async updateTodo(
    todoId: number,
    title: string,
    completed: boolean,
    userId: number,
  ): Promise<any> {
    try {

      const existingTodo = await this.prisma.todo.findUnique({
        where: { id: todoId },
      });
  
      if (!existingTodo) {
        throw new NotFoundException(`Todo with ID ${todoId} not found`);
      }
      
      const result = await this.prisma.todo.update({
        where: {
          id: todoId,
        },
        data: {
          title: title,
          completed: completed,
        },
      });

      if (!result) {
        throw new BadRequestException('We have some problem');
      }

      return this.getAllTodoByUser(userId);
    } catch (error) {
      if(error.BadRequestException){
        throw new BadRequestException(error.message);  
      }
      throw new NotFoundException(error.message);
    }
  }
}
