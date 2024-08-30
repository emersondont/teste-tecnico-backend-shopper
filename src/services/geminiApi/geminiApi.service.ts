
export interface ReadMeterOutputDto {
  image_url: string;
  measure_value: number;
}

export interface GeminiApiService {
  readMeter(base64Image: string): Promise<ReadMeterOutputDto>;
}
