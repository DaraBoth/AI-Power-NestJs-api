import { Injectable } from "@nestjs/common";
import { AI } from "./entities/ai.entity";
import { GoogleGenerativeAI } from "@google/generative-ai";

@Injectable()
export class AIService {
  private readonly apiKey = process.env.GEMINI_KEY;
  private readonly genAI: GoogleGenerativeAI = new GoogleGenerativeAI(
    this.apiKey
  );

  async replyChat(question: string): Promise<AI> {
    const response = new AI();
    response.message = await this.generateResponse(question);
    return response
  }

  async generateResponse(prompt: string): Promise<string> {
    const model = this.genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    console.log(response);
    return response.text();
  }
}
