import { IsBoolean, IsNumber, IsString, Length } from 'class-validator';

export class UpdateTodoDto {
 
    @IsNumber()
    id:number;

  @IsString()
  @Length(3, 100)
  title: string;

  @IsBoolean()
  completed?:boolean
}
