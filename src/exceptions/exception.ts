import { Response } from 'express';

export interface Exception extends Error {
  status_code: number;
  handleErrorResponse(response: Response): void;
}