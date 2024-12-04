import { Test, TestingModule } from '@nestjs/testing';
import { TodosService } from './todos.service';
import { PrismaService } from 'src/prisma.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { Todos } from './todos.model';

describe('TodosService', () => {
  let service: TodosService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TodosService,
        {
          provide: PrismaService,
          useValue: {
            todo: {
              findMany: jest.fn(),
              create: jest.fn(),
              findUnique: jest.fn(),
              update: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<TodosService>(TodosService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllTodoByUser', () => {
    it('should return all todos for a user', async () => {
      const mockTodos = [{ id: 1, title: 'Test Todo', completed: false, userId: 1 }];
      jest.spyOn(prisma.todo, 'findMany').mockResolvedValue(mockTodos);

      const result = await service.getAllTodoByUser(1);

      expect(prisma.todo.findMany).toHaveBeenCalledWith({ where: { userId: 1 } });
      expect(result).toEqual(mockTodos);
    });

    it('should return an empty array if no todos are found', async () => {
      jest.spyOn(prisma.todo, 'findMany').mockResolvedValue([]);

      const result = await service.getAllTodoByUser(1);

      expect(prisma.todo.findMany).toHaveBeenCalledWith({ where: { userId: 1 } });
      expect(result).toEqual([]);
    });

    it('should throw an error if fetching todos fails', async () => {
      jest.spyOn(prisma.todo, 'findMany').mockRejectedValue(new Error('Database error'));

      await expect(service.getAllTodoByUser(1)).rejects.toThrowError(
        'Could not fetch todos. Please try again later.',
      );
    });
  });

  describe('createTodo', () => {
    it('should create a new todo and return all todos for the user', async () => {
      const newTodo = {
        id: 1,
        title: 'New Todo',
        completed: false,
        userId: 1,
        user: { connect: { id: 1 } }, // Include user field
      };
      jest.spyOn(prisma.todo, 'create').mockResolvedValue(newTodo);
      jest.spyOn(prisma.todo, 'findMany').mockResolvedValue([newTodo]);

      const result = await service.createTodo(newTodo);

      expect(prisma.todo.create).toHaveBeenCalledWith({ data: newTodo });
      expect(prisma.todo.findMany).toHaveBeenCalledWith({ where: { userId: 1 } });
      expect(result);
    });

    it('should throw an error if todo creation fails', async () => {
      jest.spyOn(prisma.todo, 'create').mockRejectedValue(new Error('Database error'));

      const todo = new Todos();
      todo.title = 'test'
      todo.completed = false;
      todo.userId = 1;
      await expect(
         

        service.createTodo(todo ),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('updateTodo', () => {
    it('should update an existing todo and return all todos for the user', async () => {
      const existingTodo = { id: 1, title: 'Old Title', completed: false, userId: 1 };
      const updatedTodo = { id: 1, title: 'New Title', completed: true, userId: 1 };
      jest.spyOn(prisma.todo, 'findUnique').mockResolvedValue(existingTodo);
      jest.spyOn(prisma.todo, 'update').mockResolvedValue(updatedTodo);
      jest.spyOn(prisma.todo, 'findMany').mockResolvedValue([updatedTodo]);

      const result = await service.updateTodo(1, 'New Title', true, 1);

      expect(prisma.todo.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(prisma.todo.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { title: 'New Title', completed: true },
      });
      expect(result);
    });

    it('should throw NotFoundException if todo does not exist', async () => {
      jest.spyOn(prisma.todo, 'findUnique').mockResolvedValue(null);

      await expect(service.updateTodo(1, 'Test Title', false, 1)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw BadRequestException if update fails', async () => {
      const existingTodo = { id: 1, title: 'Old Title', completed: false, userId: 1 };
      jest.spyOn(prisma.todo, 'findUnique').mockResolvedValue(existingTodo);
      jest.spyOn(prisma.todo, 'update').mockRejectedValue(new Error('Database error'));

      await expect(service.updateTodo(1, 'New Title', true, 1)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
