import { MeasureType } from "../../entities/measure";

export interface FileUploadOutputDto {
  image_url: string;
  measure_value: number;
}

export interface GeminiApiService {
  uploadFile(base64Image: string): Promise<FileUploadOutputDto>;
}
