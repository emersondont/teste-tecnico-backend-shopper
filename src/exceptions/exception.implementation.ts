import { Response } from 'express';
import { Exception } from './exception';

export abstract class ExceptionImplementation extends Error implements Exception {
  status_code: number;

  constructor(name: string, status_code: number, message: string) {
    super(message);
    this.name = name;
    this.status_code = status_code;
  }

  public handleErrorResponse(response: Response): void {
    response.status(this.status_code).json({
      error_code: this.name,
      error_description: this.message
    }).send();
  }
}