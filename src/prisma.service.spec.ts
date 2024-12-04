import { Test, TestingModule } from '@nestjs/testing';

import { PrismaService } from 'src/prisma.service'; // Add the correct path
import { ConflictException } from '@nestjs/common';
import { UsersService } from './users/users.service';

describe('UsersService', () => {
  let service: UsersService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const mockPrismaService = {
      user: {
        findMany: jest.fn().mockResolvedValue([]), // Mock method
        create: jest.fn().mockResolvedValue({ id: 1, name: 'Test User', email: 'test@example.com' }),
        findUnique: jest.fn().mockResolvedValue(null),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return an empty list if no users are found', async () => {
    const result = await service.getAllUser();
    expect(result).toEqual([]);
  });

  it('should create a user successfully', async () => {
    const user = {name:'amir', password: '1231', email: 'test@example.com' };
    const result = await service.createUser(user);
    expect(result).toHaveProperty('id');
    expect(result.name).toBe('Test User');
  });

  it('should throw ConflictException if user already exists', async () => {
    const user = {name:'amir', password: '1231', email: 'test@example.com' };
    jest.spyOn(prismaService.user, 'findUnique').mockResolvedValueOnce({id:1,name:'amir', password: '1231', email: 'test@example.com'  });

    await expect(service.createUser(user)).rejects.toThrow(ConflictException);
  });
});