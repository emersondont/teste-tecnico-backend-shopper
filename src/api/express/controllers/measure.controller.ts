import { Request, Response } from 'express';
import { MeasureRepositoryPrisma } from "../../../repositories/measure/prisma/measure.repository.prisma";
import { prisma } from "../../../util/prisma.utils";
import { MeasureServiceImplementation } from "../../../services/implementation/measure.service.implementation";
import { DoubleReportException } from "../../../exceptions/doubleReportException";
import { MeasureNotFoundException } from "../../../exceptions/measureNotFoundException";
import { ConfirmationDuplicateException } from "../../../exceptions/confirmationDuplicateException";
import { InvalidTypeException } from "../../../exceptions/invalidTypeException";
import { MeasuresNotFoundException } from "../../../exceptions/measuresNotFoundException";
import { MeasureType } from '../../../entities/measure';

export class MeasureController {

  private constructor() { }

  public static build() {
    return new MeasureController();
  }

  public async create(request: Request, response: Response) {
    const { image, customer_code, measure_datetime, measure_type } = request.body;

    const aMeasureRepository = MeasureRepositoryPrisma.build(prisma);
    const aMeasureService = MeasureServiceImplementation.build(aMeasureRepository);

    try {
      const output = await aMeasureService.create(image, customer_code, new Date(measure_datetime), measure_type);
      response.status(200).json(output).send();
    } catch (error) {
      if (error instanceof DoubleReportException) {
        error.handleErrorResponse(response);
      } else {
        response.status(500).json({ error: "Internal Server Error" }).send();
      }
    }
  }

  public async confirm(request: Request, response: Response) {
    const { measure_uuid, confirmed_value } = request.body;

    const aMeasureRepository = MeasureRepositoryPrisma.build(prisma);
    const aMeasureService = MeasureServiceImplementation.build(aMeasureRepository);

    try {
      const output = await aMeasureService.confirmMeasure(measure_uuid, confirmed_value);
      response.status(200).json(output).send();
    } catch (error) {
      if (
        error instanceof MeasureNotFoundException ||
        error instanceof ConfirmationDuplicateException
      ) {
        error.handleErrorResponse(response);
      } else {
        response.status(500).json({ error: "Internal Server Error" }).send();
      }
    }
  }

  public async list(request: Request, response: Response) {
    const { customer_code } = request.params;
    const { measure_type } = request.query || {};

    const aMeasureRepository = MeasureRepositoryPrisma.build(prisma);
    const aMeasureService = MeasureServiceImplementation.build(aMeasureRepository);

    try {
      const output = await aMeasureService.listMeasures(customer_code, measure_type as MeasureType);
      response.status(200).json({
        customer_code: customer_code,
        ...output
      }).send();
    } catch (error) {
      if (
        error instanceof InvalidTypeException ||
        error instanceof MeasuresNotFoundException
      ) {
        error.handleErrorResponse(response);
      } else {
        response.status(500).json({ error: "Internal Server Error" }).send();
      }
    }
  }
}