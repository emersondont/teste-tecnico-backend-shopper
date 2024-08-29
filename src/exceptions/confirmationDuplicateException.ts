import { ExceptionImplementation } from "./exception.implementation";

export class ConfirmationDuplicateException extends ExceptionImplementation {
  constructor() {
    super("CONFIRMATION_DUPLICATE", 409, "Leitura do mês já realizada");
  }
}