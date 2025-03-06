import { Request as ExpressRequest } from 'express';

export interface RequestWithUser extends ExpressRequest {
  user: {
    id: string;
    username: string;
  }
}