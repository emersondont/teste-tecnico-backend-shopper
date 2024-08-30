import { GoogleAIFileManager } from "@google/generative-ai/server";
import { FileUploadOutputDto, GeminiApiService } from "../geminiApi/geminiApi.service";
import fs from 'fs';
import { GoogleGenerativeAI } from "@google/generative-ai";

export class GeminiApiServiceImplementation implements GeminiApiService {
  private constructor(
    private readonly fileManager: GoogleAIFileManager,
    private readonly genAI: GoogleGenerativeAI
  ) { }

  public static build() {
    const apiKey = process.env.GEMINI_API_KEY || "";
    const fileManager = new GoogleAIFileManager(apiKey);
    const genAI = new GoogleGenerativeAI(apiKey);
    return new GeminiApiServiceImplementation(fileManager, genAI);
  }

  public async uploadFile(base64Image: string): Promise<FileUploadOutputDto> {
    const filename = "medidor.png";
    this.base64DecodeImage(base64Image, filename);

    const uploadResponse = await this.fileManager.uploadFile(filename, {
      mimeType: "image/png",
      displayName: "Measure Image"
    });
     
    try {
      console.log("Reading measure_value from the meter using the Gemini-1.5-flash model");
      const model = this.genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
      });

      const generatedContent = await model.generateContent([
        {
          fileData: {
        mimeType: uploadResponse.file.mimeType,
        fileUri: uploadResponse.file.uri
          }
        },
        { text: `Based on the image, return only the integer number corresponding to the value displayed by the meter. If it is not possible to read the value, return 0.` },
      ]);

      console.log("Successfully read measure_value: ", generatedContent.response.text());

      const measure_value = Number(generatedContent.response.text()) || 0;

      return {
        image_url: uploadResponse.file.uri,
        measure_value: measure_value,
      };
    } catch (error) {
      console.log("Failed to read the measure_value with the Gemini-1.5-flash model, returning 0");
      return {
        image_url: uploadResponse.file.uri,
        measure_value: 0,
      };
    }
  }

  private base64DecodeImage(base64Image: string, imageName: string) {
    fs.writeFile(imageName, base64Image, function (error) {
      if (error) {
        throw error;
      } else {
        console.log('File created from base64 string');
        return true;
      }
    });
  }

}

