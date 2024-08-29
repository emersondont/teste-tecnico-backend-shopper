import { PrismaClient } from "@prisma/client";
import { Measure, MeasureType } from "../../../entities/measure";
import { MeasureRepository } from "../measure.repository";

export class MeasureRepositoryPrisma implements MeasureRepository {
  private constructor(readonly prisma: PrismaClient) { }

  public static build(prisma: PrismaClient) {
    return new MeasureRepositoryPrisma(prisma);
  }

  public async save(measure: Measure): Promise<void> {
    const data = {
      measure_uuid: measure.measure_uuid,
      measure_value: measure.measure_value,
      measure_type: measure.measure_type,
      measure_datetime: measure.measure_datetime,
      customer_code: measure.customer_code,
      has_confirmed: measure.has_confirmed,
      image_url: measure.image_url
    }

    await this.prisma.measure.create({ data })
  }

  public async update(measure: Measure): Promise<void> {
    const data = {
      measure_uuid: measure.measure_uuid,
      measure_value: measure.measure_value,
      measure_type: measure.measure_type,
      measure_datetime: measure.measure_datetime,
      customer_code: measure.customer_code,
      has_confirmed: measure.has_confirmed,
      image_url: measure.image_url
    }

    await this.prisma.measure.update({
      where: {
        measure_uuid: data.measure_uuid,
      },
      data
    })
  }

  public async find(measure_uuid: string): Promise<Measure | null> {
    const aMeasure = await this.prisma.measure.findUnique({
      where: { measure_uuid }
    })

    if (!aMeasure) {
      return null;
    }

    const measure = Measure.with(aMeasure)

    return measure;
  }

  public async findByCustomerAndTypeAndDatetime(customer_code: string, measure_type: MeasureType, measure_datetime: Date): Promise<Boolean> {
    const existingMeasure = await this.prisma.measure.findFirst({
      where: {
        customer_code,
        measure_type,
        measure_datetime: {
          gte: new Date(measure_datetime.getFullYear(), measure_datetime.getMonth(), 1, 0, 0, 0),
          lt: new Date(measure_datetime.getFullYear(), measure_datetime.getMonth() + 1, 1, 0, 0, 0)
        }
      }
    })

    if (!existingMeasure) {
      return false;
    }

    return true;
  }

  public async list(customer_code: string, measure_type?: MeasureType): Promise<Measure[]> {
    const aMeasures = await this.prisma.measure.findMany({
      where: { customer_code, measure_type }
    })

    const measures: Measure[] = aMeasures.map((m) => {
      return Measure.with(m)
    })

    return measures;
  }

}