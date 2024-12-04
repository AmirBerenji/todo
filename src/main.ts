import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const cors = {
    origin: ['http://localhost:3000'],
    methods: 'GET, HEAD, PUT, PATCH, POST, DELETE, OPTIONS',
  };

  app.enableCors(cors);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,  // Strip properties that are not part of the DTO
    forbidNonWhitelisted: true,  // Throw an error if non-whitelisted properties are found
    transform: true,  // Automatically transform payloads to DTO instances
  }));
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
