import { IsBoolean, IsString, Length } from 'class-validator';

export class CreateTodoDto {
 
  @IsString()
  @Length(3, 100)
  title: string;

  @IsBoolean()
  completed?:boolean
}
