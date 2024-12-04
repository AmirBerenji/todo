import { Request } from 'express';

export interface CustomRequest extends Request {
  user: {
    id: number;
    username?: string;
    email?: string;
    name?: string;
  };
}
