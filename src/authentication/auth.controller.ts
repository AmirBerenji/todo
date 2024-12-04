import { Body, Controller, Post, Req, Res, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';

import { Request, Response } from 'express';
import { LoginDto } from 'src/dto/login-user.dto';
import { RegisterUserDto } from 'src/dto/register-user.dto';

@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  async login(
    @Req() request: Request,
    @Res() response: Response,
    @Body() loginDto: LoginDto,
  ): Promise<any> {
    try {
      const result = await this.authService.login(loginDto);
      return response.status(200).json({
        status: 'Ok!',
        message: 'Successfully login!',
        result: result,
      });
    } catch (err) {
      response.status(500).json({
        status: 'Ok!',
        message: 'Internal Server Error: ' + err.message,
      });
    }
  }

  @Post('/register')
  async register(
    @Req() request: Request,
    @Res() response: Response,
    @Body(new ValidationPipe())registerDto: RegisterUserDto,
  ): Promise<any> {
    try {
      
      const result = await this.authService.register(registerDto);
      return response.status(200).json({
        status: 'Ok!',
        message: 'Successfully register!',
        result: result,
      });
    } catch (err) {
      response.status(500).json({
        status: 'Ok!',
        message: 'Internal Server Error: ' + err.message,
      });
    }
  }
}
