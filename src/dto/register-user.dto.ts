import { IsString, Length, IsEmail, Matches } from 'class-validator';

export class RegisterUserDto {
  @IsString()
  @Length(6, 12)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,12}$/, {
    message: 'Password must contain both letters and numbers, and be between 6 and 12 characters long.',
  })
  password: string;

  @IsString()
  @Length(5, 10)
  name: string;

  @IsEmail({}, { message: 'Please provide a valid email address.' })  // Ensure valid email format
  @IsString()
  @Length(5, 50)
  email: string;
}