import { Prisma} from "@prisma/client";

export class Todos implements Prisma.TodoCreateInput{
    user: Prisma.UserCreateNestedOneWithoutTodosInput;
    title: string;
    completed?: boolean;
    userId: number;
}
