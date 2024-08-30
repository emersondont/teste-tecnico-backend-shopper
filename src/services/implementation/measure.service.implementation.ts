import { Measure, MeasureType } from "../../entities/measure";
import { ConfirmationDuplicateException } from "../../exceptions/confirmationDuplicateException";
import { DoubleReportException } from "../../exceptions/doubleReportException";
import { InvalidDataException } from "../../exceptions/invalidDataException";
import { InvalidTypeException } from "../../exceptions/invalidTypeException";
import { MeasureNotFoundException } from "../../exceptions/measureNotFoundException";
import { MeasureRepository } from "../../repositories/measure/measure.repository";
import { ConfirmMeasureOutputDto, CreateMeasureOutputDto, ListMeasuresOutputDto, MeasureService } from "../measure/measure.service";
import { GeminiApiServiceImplementation } from "./geminiApi.service.implementation";

export class MeasureServiceImplementation implements MeasureService {
  private geminiApiService: GeminiApiServiceImplementation;

  private constructor(readonly repository: MeasureRepository) {
    this.geminiApiService = GeminiApiServiceImplementation.build();
  }

  public static build(repository: MeasureRepository): MeasureServiceImplementation {
    return new MeasureServiceImplementation(repository);
  }

  public async create(image: string, customer_code: string, measure_datetime: Date, measure_type: MeasureType): Promise<CreateMeasureOutputDto> {
    const existingMeasure = await this.repository.findByCustomerAndTypeAndDatetime(customer_code, measure_type, measure_datetime);
    if (existingMeasure) {
      throw new DoubleReportException();
    }

    const meterValues = await this.geminiApiService.readMeter(image);

    const aMeasure = Measure.create({
      customer_code,
      measure_datetime,
      measure_type,
      image_url: meterValues.image_url,
      measure_value: meterValues.measure_value
    });

    await this.repository.save(aMeasure);

    return {
      image_url: aMeasure.image_url,
      measure_value: aMeasure.measure_value,
      measure_uuid: aMeasure.measure_uuid
    }
  }

  public async confirmMeasure(measure_uuid: string, confirmed_value: number): Promise<ConfirmMeasureOutputDto> {
    const aMeasure = await this.repository.find(measure_uuid)

    if (!aMeasure) {
      throw new MeasureNotFoundException();
    }

    if (aMeasure.has_confirmed) {
      throw new ConfirmationDuplicateException();
    }

    aMeasure.updateValue(confirmed_value);
    aMeasure.confirm();

    await this.repository.update(aMeasure);

    return { success: true }
  }

  public async listMeasures(customer_code: string, measure_type?: MeasureType): Promise<ListMeasuresOutputDto> {
    if (measure_type && measure_type != "WATER" && measure_type != "GAS") {
      throw new InvalidTypeException();
    }

    const aMeasures = await this.repository.list(customer_code, measure_type);

    if (aMeasures.length === 0) {
      throw new MeasureNotFoundException();
    }

    return {
      measures: aMeasures.map((m) => {
        return {
          measure_uuid: m.measure_uuid,
          measure_datetime: m.measure_datetime,
          measure_type: m.measure_type,
          has_confirmed: m.has_confirmed,
          image_url: m.image_url
        }
      })
    }
  }
}