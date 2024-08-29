import { ExceptionImplementation } from "./exception.implementation";

export class InvalidDataException extends ExceptionImplementation {
  constructor(error_description: string) {
    super("INVALID_DATA", 400, error_description);
  }
}