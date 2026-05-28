import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { image } = body;

    if (!image) {
      return NextResponse.json(
        { error: "No image payload provided. Please upload or capture an image." },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { 
          error: "Gemini API key is missing. Please configure GEMINI_API_KEY in your environment variables to enable active AI image scanning." 
        },
        { status: 400 }
      );
    }

    // Extract mimeType and raw base64 data from the Data URL
    // e.g. "data:image/jpeg;base64,/9j/4AAQSk..."
    const matches = image.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/);
    if (!matches || matches.length < 3) {
      return NextResponse.json(
        { error: "Invalid image format. Supported formats are JPEG, PNG, or WEBP." },
        { status: 400 }
      );
    }

    const mimeType = matches[1];
    const base64Data = matches[2];

    const systemPrompt = `You are a professional, friendly, and supportive AI Nutrition Scanner.
Analyze the provided food image. Estimate the meal composition, calories, macros, portions, sodium, fiber, chemical audits, and longevity insights.
You must output strictly valid, clean JSON. Do not return markdown blocks, backticks, or any conversational text before or after the JSON.

JSON Structure:
{
  "foodName": "Name of the detected food/meal",
  "ingredients": ["Ingredient 1", "Ingredient 2"],
  "portionSize": "1 plate (approx 350g)",
  "calories": 320,
  "protein": 14,
  "carbs": 38,
  "fat": 12,
  "sugar": 6,
  "sodium": 280,
  "fiber": 4,
  "healthScore": 82,
  "sugarAlert": false,
  "unhealthyAdditives": ["Additive 1"],
  "alternatives": ["Alternative choice 1", "Alternative choice 2"],
  "insights": ["Protein intake is low for recovery.", "Good fiber content for digestion."],
  "nutritionRecommendation": "Supportive 1-2 sentence AI coach recommendation in plain, simple, friendly language. Explain what it does for energy and how it helps recovery."
}

Ensure all metrics are realistic, and alternatives are highly practical, beginner-friendly options.`;

    // Make official REST API call to Google Gemini multimodal model
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: systemPrompt },
                {
                  inlineData: {
                    mimeType: mimeType,
                    data: base64Data
                  }
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.15,
            maxOutputTokens: 800
          }
        })
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { error: "Gemini Vision processing error", details: errorData },
        { status: response.status }
      );
    }

    const data = await response.json();
    let replyText = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    // Clean up Markdown backticks if returned by the model
    if (replyText.startsWith("```json")) {
      replyText = replyText.substring(7);
    } else if (replyText.startsWith("```")) {
      replyText = replyText.substring(3);
    }
    
    if (replyText.endsWith("```")) {
      replyText = replyText.substring(0, replyText.length - 3);
    }
    
    replyText = replyText.trim();

    try {
      const parsedResult = JSON.parse(replyText);
      return NextResponse.json({ result: parsedResult });
    } catch (parseError) {
      console.error("JSON parsing error on Gemini reply:", replyText);
      return NextResponse.json(
        { 
          error: "Could not identify this meal clearly. Please upload a clearer image of your plate.",
          rawText: replyText 
        },
        { status: 500 }
      );
    }
  } catch (err: any) {
    console.error("Food Scanner API Error:", err);
    return NextResponse.json(
      { error: err.message || "Internal server error during image analysis" },
      { status: 500 }
    );
  }
}
