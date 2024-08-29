import { ExceptionImplementation } from "./exception.implementation";

export class InvalidTypeException extends ExceptionImplementation {
  constructor() {
    super("INVALID_TYPE", 400, "Tipo de medição não permitida");
  }
}