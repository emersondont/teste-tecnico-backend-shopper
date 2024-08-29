import { MeasureProps, MeasureType } from "../../entities/measure";

export type ConfirmMeasureOutputDto = {
  success: boolean;
}

export type ListMeasuresOutputDto = {
  measures: Omit<MeasureProps, "customer_code" | "measure_value">[];
}

export type CreateMeasureOutputDto = Pick<MeasureProps, "image_url" | "measure_value" | "measure_uuid">

export interface MeasureService {
  create(image: string, customer_code: string, measure_datetime: Date, measure_type: MeasureType): Promise<CreateMeasureOutputDto>;
  confirmMeasure(measure_uuid: string, confirmed_value: number): Promise<ConfirmMeasureOutputDto>;
  listMeasures(customer_code: string, measure_type?: MeasureType): Promise<ListMeasuresOutputDto>;
}