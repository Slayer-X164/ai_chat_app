import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();

    // Use a Gemini model, for example `gemini-1.5-flash` or `gemini-1.5-pro`
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(message);

    return NextResponse.json({
      status: 200,
      data: result.response.text(), // Gemini returns text differently
    });
  } catch (error) {
    console.error("Gemini API Error:", error);
    return NextResponse.json({
      status: 500,
      message: "Failed to process request",
    });
  }
}
