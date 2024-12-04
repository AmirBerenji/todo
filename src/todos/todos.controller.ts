import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Post,
  Put,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { TodosService } from './todos.service';
import { JwtAuthGuard } from 'src/authentication/auth.guard';
import { Response } from 'express';
import { CreateTodoDto } from 'src/dto/create-todo.dto';
import { CustomRequest } from 'src/interface/custom-request';
import { UpdateTodoDto } from 'src/dto/update-todo.dto';
import { Todos } from './todos.model';

@Controller('/todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getAllTodos(
    @Req() request: CustomRequest,
    @Res() response: Response,
  ): Promise<any> {
    try {
      const userId = request.user?.id;

      if (!userId) {
        return response.status(400).json({
          status: 'error',
          message: 'User not found in your token',
        });
      }

      const todos = await this.todosService.getAllTodoByUser(userId);

      return response.status(200).json({
        status: 'ok!',
        message: 'Successfully fetched data',
        result: todos,
      });
    } catch (err) {
      //console.error('Error fetching todos:', err);
      return response.status(500).json({
        status: 'error',
        message: 'Internal Server Error: ' + err.message,
      });
    }
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async createTodo(
    @Req() request: CustomRequest,
    @Res() response: Response,
    @Body() createTodoDto: CreateTodoDto,
  ): Promise<any> {
    try {
      const userId = request.user?.id;

      if (!userId) {
        return response.status(400).json({
          status: 'error',
          message: 'User not found in your token',
        });
      }
      const data = new Todos()
      data.completed = createTodoDto.completed;
      data.title = createTodoDto.title;
      data.userId = userId;

      const result = await this.todosService.createTodo(data);

      return response.status(201).json({
        status: 'ok!',
        message: 'Successfully created todo',
        result: result,
      });
    } catch (err) {
      //console.error('Error creating todo:', err);
      return response.status(500).json({
        status: 'error',
        message: 'Internal Server Error: ' + err.message,
      });
    }
  }




  @Put()
  @UseGuards(JwtAuthGuard)
  async updateTodo(
    @Req() request: CustomRequest,
    @Res() response: Response,
    @Body() updateTodoDto: UpdateTodoDto,
  ): Promise<any> {
    try {
      const userId = request.user?.id;
  
      if (!userId) {
        return response.status(400).json({
          status: 'error',
          message: 'User not found in your token',
        });
      }
  
      const { id, title, completed } = updateTodoDto;
  
      const result = await this.todosService.updateTodo(id, title, completed, userId);
  
      return response.status(202).json({
        status: 'ok!',
        message: 'Successfully updated todo',
        result: result,
      });
    } catch (err) {
      //console.error('Error updating todo:', err);
  
      if (err instanceof NotFoundException) {
        return response.status(404).json({
          status: 'error',
          message: err.message,
        });
      } else if (err instanceof BadRequestException) {
        return response.status(400).json({
          status: 'error',
          message: err.message,
        });
      }

      return response.status(500).json({
        status: 'error',
        message: `Internal Server Error: ${err.message}`,
      });
    }
  }
}


