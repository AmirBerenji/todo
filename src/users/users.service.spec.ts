import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from 'src/prisma.service';
import { ConflictException } from '@nestjs/common';

describe('UsersService', () => {
  let service: UsersService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findMany: jest.fn(),
              findUnique: jest.fn(),
              create: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  describe('getAllUser', () => {
    it('should return an array of users', async () => {
      const mockUsers = [
        { id: 1, name: 'John Doe', email: 'john@example.com', password: '123456' },
        { id: 2, name: 'Jane Doe', email: 'jane@example.com', password: 'abcdef' },
      ];
      jest.spyOn(prisma.user, 'findMany').mockResolvedValue(mockUsers);

      const result = await service.getAllUser();
      expect(result).toEqual(mockUsers);
      expect(prisma.user.findMany).toHaveBeenCalledTimes(1);
    });
  });

  describe('createUser', () => {
    it('should create and return a new user', async () => {
      const mockUser = {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        password: '123456',
      };
      const createData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: '123456',
      };

      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(null);
      jest.spyOn(prisma.user, 'create').mockResolvedValue(mockUser);

      const result = await service.createUser(createData);
      expect(result).toEqual(mockUser);
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: createData.email },
      });
      expect(prisma.user.create).toHaveBeenCalledWith({ data: createData });
    });

    it('should throw ConflictException if email already exists', async () => {
      const existingUser = {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        password: '123456',
      };
      const createData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: '123456',
      };

      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(existingUser);

      await expect(service.createUser(createData)).rejects.toThrow(
        ConflictException,
      );
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: createData.email },
      });
      expect(prisma.user.create).not.toHaveBeenCalled();
    });
  });
});
