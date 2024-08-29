import { ExceptionImplementation } from "./exception.implementation";

export class DoubleReportException extends ExceptionImplementation {
  constructor() {
    super("DOUBLE_REPORT", 409, "Leitura do mês já realizada");
  }
}