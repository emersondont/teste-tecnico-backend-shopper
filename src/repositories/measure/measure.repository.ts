import { Measure, MeasureType } from "../../entities/measure";

export interface MeasureRepository {
  save(measure: Measure): Promise<void>;
  update(measure: Measure): Promise<void>;
  find(measure_uuid: string): Promise<Measure | null>;
  findByCustomerAndTypeAndDatetime(customer_code: string, measure_type: MeasureType, measure_datetime: Date): Promise<Boolean>;
  list(customer_code: string, measure_type?: MeasureType): Promise<Measure[]>;
}