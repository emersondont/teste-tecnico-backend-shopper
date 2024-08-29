import { ExceptionImplementation } from "./exception.implementation";

export class MeasureNotFoundException extends ExceptionImplementation {
  constructor() {
    super("MEASURE_NOT_FOUND", 404, "Leitura do mês já realizada");
  }
}