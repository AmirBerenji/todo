import { OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

export class PrismaService extends PrismaClient implements OnModuleInit {
  // Initialize Prisma Client and connect on module initialization
  async onModuleInit() {
    try {
      await this.$connect(); // Attempt to connect to the Prisma client
      console.log('Prisma connected successfully');
    } catch (error) {
      console.error('Error connecting to Prisma:', error);
      throw error; // Rethrow error to notify the application of the failure
    }
  }
}
