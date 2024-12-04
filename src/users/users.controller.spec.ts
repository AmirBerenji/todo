import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { Response } from 'express';
import { JwtAuthGuard } from 'src/authentication/auth.guard';


describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;
  let response: Response;

  beforeEach(async () => {
    const mockUsersService = {
      getAllUser: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { 
          provide: UsersService, 
          useValue: mockUsersService 
        },
        {
          provide: JwtAuthGuard,
          useValue: { canActivate: jest.fn().mockResolvedValue(true) }, // Mocking JwtAuthGuard
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
    response = { 
      status: jest.fn().mockReturnThis(), 
      json: jest.fn() 
    } as unknown as Response;
  });

  describe('getAllUsers', () => {
    it('should return a list of users', async () => {
      const mockUsers = [
        { id: 1, name: 'John Doe', email: 'john@example.com', password: '123456' },
        { id: 2, name: 'Jane Doe', email: 'jane@example.com', password: 'abcdef' },
      ];
      jest.spyOn(service, 'getAllUser').mockResolvedValue(mockUsers);

      const result = await controller.getAllUsers(null, response);

      expect(service.getAllUser).toHaveBeenCalled();
      expect(response.status).toHaveBeenCalledWith(200);
      expect(response.json).toHaveBeenCalledWith({
        status: 'ok',
        message: 'Successfuly fetch data',
        result: result,
      });
    });

    it('should handle errors and return a 500 response', async () => {
      const error = new Error('Internal Server Error');
      jest.spyOn(service, 'getAllUser').mockRejectedValue(error);

      await controller.getAllUsers(null, response);

      expect(service.getAllUser).toHaveBeenCalled();
      expect(response.status).toHaveBeenCalledWith(500);
      expect(response.json).toHaveBeenCalledWith({
        status: 'error',
        message: `Internal Server Error: ${error.message}`,
      });
    });
  });
});
