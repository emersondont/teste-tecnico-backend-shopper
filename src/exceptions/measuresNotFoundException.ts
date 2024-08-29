import { ExceptionImplementation } from "./exception.implementation";

export class MeasuresNotFoundException extends ExceptionImplementation {
  constructor() {
    super("MEASURES_NOT_FOUND", 404, "Nenhuma leitura encontrada");
  }
}