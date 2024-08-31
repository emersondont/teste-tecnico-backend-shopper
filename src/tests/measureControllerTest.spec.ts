import { MeasureController } from "../api/express/controllers/measure.controller";
import { Request, Response } from 'express';
import { CreateMeasureOutputDto } from "../services/measure/measure.service";

var measure_uuid = '';

describe('MeasureController create', () => {
  test('should return 200', async () => {
    const request = {
      body: {
        image: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEBLAEsAAD/4RdfRXhpZgAASUkqAAg',
        customer_code: '1',
        measure_datetime: '2023-05-10T10:10:10.000Z',
        measure_type: 'WATER'
      }
    }

    const response = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockImplementation((result: CreateMeasureOutputDto) => {
        measure_uuid = result.measure_uuid;
        return response;
      }),
      send: jest.fn(),
    } as unknown as Response<CreateMeasureOutputDto>;

    const controller = MeasureController.build();
    await controller.create(request as Request, response);

    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.send).toHaveBeenCalledTimes(1);
  })

  test('should return 409', async () => {
    const request = {
      body: {
        image: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEBLAEsAAD/4RdfRXhpZgAASUkqAAg',
        customer_code: '1',
        measure_datetime: '2023-05-10T10:10:10.000Z',
        measure_type: 'WATER'
      }
    }

    const response = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      send: jest.fn(),
    } as unknown as Response;

    const controller = MeasureController.build();
    await controller.create(request as Request, response);

    expect(response.status).toHaveBeenCalledWith(409);
    expect(response.send).toHaveBeenCalledTimes(1);
  })
});

describe('MeasureController confirm', () => {
  test('should return 200', async () => {
    const request = {
      body: {
        measure_uuid: measure_uuid,
        confirmed_value: 100
      }
    } as Request;

    const response = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      send: jest.fn(),
    } as unknown as Response;

    const controller = MeasureController.build();
    await controller.confirm(request, response);

    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.send).toHaveBeenCalledTimes(1);
  })

  test('should return 409', async () => {
    const request = {
      body: {
        measure_uuid: measure_uuid,
        confirmed_value: 100
      }
    } as Request;

    const response = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      send: jest.fn(),
    } as unknown as Response;

    const controller = MeasureController.build();
    await controller.confirm(request as Request, response);

    expect(response.status).toHaveBeenCalledWith(409);
    expect(response.send).toHaveBeenCalledTimes(1);
  })

  test('should return 404', async () => {
    const request = {
      body: {
        measure_uuid: 'uuid not found',
        confirmed_value: 100
      }
    } as Request;

    const response = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      send: jest.fn(),
    } as unknown as Response;

    const controller = MeasureController.build();
    await controller.confirm(request as Request, response);

    expect(response.status).toHaveBeenCalledWith(404);
    expect(response.send).toHaveBeenCalledTimes(1);
  })
});

describe('MeasureController list', () => {
  test('should return 200', async () => {
    const request = {
      params: {
        customer_code: '1'
      }
    } as unknown as Request;

    const response = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      send: jest.fn(),
    } as unknown as Response;

    const controller = MeasureController.build();
    await controller.list(request, response);

    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.send).toHaveBeenCalledTimes(1);
  })

  test('should return 400', async () => {
    const request = {
      params: {
        customer_code: '1'
      },
      query: {
        measure_type: 'water'
      }
    } as unknown as Request;

    const response = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      send: jest.fn(),
    } as unknown as Response;

    const controller = MeasureController.build();
    await controller.list(request, response);

    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.send).toHaveBeenCalledTimes(1);
  })

  test('should return 404', async () => {
    const request = {
      params: {
        customer_code: '2'
      }
    } as unknown as Request;

    const response = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      send: jest.fn(),
    } as unknown as Response;

    const controller = MeasureController.build();
    await controller.list(request, response);

    expect(response.status).toHaveBeenCalledWith(404);
    expect(response.send).toHaveBeenCalledTimes(1);
  })

});