import { GoogleAIFileManager } from "@google/generative-ai/server";
import { GeminiApiService, ReadMeterOutputDto } from "../geminiApi/geminiApi.service";
import fs from 'fs/promises';
import { GoogleGenerativeAI } from "@google/generative-ai";

export class GeminiApiServiceImplementation implements GeminiApiService {
  private constructor(
    private readonly fileManager: GoogleAIFileManager,
    private readonly genAI: GoogleGenerativeAI,
    private readonly filename: string = "medidor.png"
  ) { }

  public static build() {
    const apiKey = process.env.GEMINI_API_KEY || "";
    const fileManager = new GoogleAIFileManager(apiKey);
    const genAI = new GoogleGenerativeAI(apiKey);
    return new GeminiApiServiceImplementation(fileManager, genAI);
  }

  public async readMeter(base64Image: string): Promise<ReadMeterOutputDto> {
    // Decode the base64 image and save it to a file
    await this.base64DecodeImage(base64Image, this.filename);

    const uploadResponse = await this.fileManager.uploadFile(this.filename, {
      mimeType: "image/png",
      displayName: "Measure Image"
    });

    // Delete the file after uploading it
    await fs.unlink(this.filename);

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

  private async base64DecodeImage(base64Image: string, imageName: string): Promise<void> {
    try {
      let base64String = base64Image;

      // If the string contains a comma, it means it has the prefix "data:image/...;base64,"
      if (base64Image.includes(',')) {
        base64String = base64Image.split(',')[1];
      }
      
      const buf = Buffer.from(base64String, 'base64');
      await fs.writeFile(imageName, buf);
      console.log(`File ${imageName} created from base64 string`);
    } catch (error) {
      console.error(`Failed to create file ${imageName} from base64 string:`, error);
      throw error;
    }
  }
}
