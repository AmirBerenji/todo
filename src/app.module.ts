import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { TodosModule } from './todos/todos.module';
import { AuthModule } from './authentication/auth.module';

@Module({
  imports: [UsersModule,AuthModule,TodosModule, ConfigModule.forRoot({
    isGlobal: true,  // Makes environment variables accessible globally
  }),
],
  controllers: [],
  providers: [],
})
export class AppModule {}
