import { IsString, Length } from 'class-validator';

export class LoginDto {
  @IsString()
  @Length(5, 100)
  email: string;

  @IsString()
  @Length(6, 12)
  password: string;
}
