import { Test, TestingModule } from '@nestjs/testing';
import { TodosController } from './todos.controller';
import { TodosService } from './todos.service';
import { JwtAuthGuard } from 'src/authentication/auth.guard';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateTodoDto } from 'src/dto/create-todo.dto';
import { UpdateTodoDto } from 'src/dto/update-todo.dto';

describe('TodosController', () => {
  let controller: TodosController;
  let service: TodosService;

  const mockTodosService = {
    getAllTodoByUser: jest.fn(),
    createTodo: jest.fn(),
    updateTodo: jest.fn(),
  };

  const mockUser = { id: 1 };
  const mockRequest = { user: mockUser };
  const mockResponse = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TodosController],
      providers: [
        {
          provide: TodosService,
          useValue: mockTodosService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: jest.fn(() => true),
      })
      .compile();

    controller = module.get<TodosController>(TodosController);
    service = module.get<TodosService>(TodosService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllTodos', () => {
    it('should return todos for the authenticated user', async () => {
      const mockTodos = [{ id: 1, title: 'Test Todo', completed: false, userId: 1 }];
      mockTodosService.getAllTodoByUser.mockResolvedValue(mockTodos);

      await controller.getAllTodos(mockRequest as any, mockResponse as any);

      expect(service.getAllTodoByUser).toHaveBeenCalledWith(1);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        status: 'ok!',
        message: 'Successfully fetched data',
        result: mockTodos,
      });
    });

    it('should return 400 if user ID is missing', async () => {
      await controller.getAllTodos({ user: null } as any, mockResponse as any);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        status: 'error',
        message: 'User not found in your token',
      });
    });

    it('should return 500 if an error occurs', async () => {
      mockTodosService.getAllTodoByUser.mockRejectedValue(new Error('Database error'));

      await controller.getAllTodos(mockRequest as any, mockResponse as any);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        status: 'error',
        message: 'Internal Server Error: Database error',
      });
    });
  });

  describe('createTodo', () => {
    it('should create a todo for the authenticated user', async () => {
      const createTodoDto: CreateTodoDto = { title: 'New Todo', completed: false };
      const mockTodos = [{ id: 1, title: 'New Todo', completed: false, userId: 1 }];
      mockTodosService.createTodo.mockResolvedValue(mockTodos);

      await controller.createTodo(
        mockRequest as any,
        mockResponse as any,
        createTodoDto,
      );

      expect(service.createTodo).toHaveBeenCalledWith({
        ...createTodoDto,
        userId: 1,
      });
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({
        status: 'ok!',
        message: 'Successfully created todo',
        result: mockTodos,
      });
    });

    it('should return 400 if user ID is missing', async () => {
      const createTodoDto: CreateTodoDto = { title: 'New Todo', completed: false };

      await controller.createTodo(
        { user: null } as any,
        mockResponse as any,
        createTodoDto,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        status: 'error',
        message: 'User not found in your token',
      });
    });

    it('should return 500 if an error occurs', async () => {
      const createTodoDto: CreateTodoDto = { title: 'New Todo', completed: false };
      mockTodosService.createTodo.mockRejectedValue(new Error('Database error'));

      await controller.createTodo(
        mockRequest as any,
        mockResponse as any,
        createTodoDto,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        status: 'error',
        message: 'Internal Server Error: Database error',
      });
    });
  });

  describe('updateTodo', () => {
    it('should update a todo for the authenticated user', async () => {
      const updateTodoDto: UpdateTodoDto = { id: 1, title: 'Updated Title', completed: true };
      const mockTodos = [{ id: 1, title: 'Updated Title', completed: true, userId: 1 }];
      mockTodosService.updateTodo.mockResolvedValue(mockTodos);

      await controller.updateTodo(
        mockRequest as any,
        mockResponse as any,
        updateTodoDto,
      );

      expect(service.updateTodo).toHaveBeenCalledWith(1, 'Updated Title', true, 1);
      expect(mockResponse.status).toHaveBeenCalledWith(202);
      expect(mockResponse.json).toHaveBeenCalledWith({
        status: 'ok!',
        message: 'Successfully updated todo',
        result: mockTodos,
      });
    });

    it('should return 404 if the todo does not exist', async () => {
      const updateTodoDto: UpdateTodoDto = { id: 1, title: 'Updated Title', completed: true };
      mockTodosService.updateTodo.mockRejectedValue(
        new NotFoundException('Todo not found'),
      );

      await controller.updateTodo(
        mockRequest as any,
        mockResponse as any,
        updateTodoDto,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        status: 'error',
        message: 'Todo not found',
      });
    });

    it('should return 400 if update fails due to bad request', async () => {
      const updateTodoDto: UpdateTodoDto = { id: 1, title: 'Updated Title', completed: true };
      mockTodosService.updateTodo.mockRejectedValue(
        new BadRequestException('Invalid data'),
      );

      await controller.updateTodo(
        mockRequest as any,
        mockResponse as any,
        updateTodoDto,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        status: 'error',
        message: 'Invalid data',
      });
    });

    it('should return 500 if an error occurs', async () => {
      const updateTodoDto: UpdateTodoDto = { id: 1, title: 'Updated Title', completed: true };
      mockTodosService.updateTodo.mockRejectedValue(new Error('Database error'));

      await controller.updateTodo(
        mockRequest as any,
        mockResponse as any,
        updateTodoDto,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        status: 'error',
        message: 'Internal Server Error: Database error',
      });
    });
  });
});
