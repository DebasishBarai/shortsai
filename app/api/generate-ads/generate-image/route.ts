import { NextRequest, NextResponse } from "next/server";
import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Prompt for regular product showcase
const PROMPT = `Create a vibrant product showcase image featuring the uploaded image
in the center, surrounded by dynamic splashes of liquid or relevant material that complement the product.
Use a clean, colorful background to make the product stand out. Include subtle elements related to the product's flavor,
ingredients, or theme floating around to add context and visual interest. 
Ensure the product is sharp and in focus, with motion and energy conveyed through the splash effects.
Also give me image to video prompt for same in JSON format: {textToImage:'',imageToVideo:''}. Do not add any raw text or comment, Just give Json`;

// Prompt for avatar + product showcase
const AVATAR_PROMPT = `Create a professional product showcase image 
featuring the uploaded avatar naturally holding
the uploaded product image in their hands. Make 
the product the clear focal point of the scene. 
Use a clean, colorful background that highlights the product.
Include subtle floating elements related to the product's flavor, 
ingredients, or theme for added context, if relevant. Ensure both the avatar and product are sharp, well-lit, and in focus, 
conveying a polished and professional look. Also give me image to video prompt for same 
in JSON format: {textToImage:'',imageToVideo:''} Do not add any raw text or comment, Just give Json`;

export async function POST(req: NextRequest) {
  try {
    // Parse JSON body instead of form data
    const body = await req.json();
    const { base64Image, description, size, userEmail, base64Avatar } = body;

    // Validate required fields
    if (!base64Image) {
      return NextResponse.json(
        { error: 'Product image is required' },
        { status: 400 }
      );
    }

    if (!userEmail) {
      return NextResponse.json(
        { error: 'User email is required' },
        { status: 400 }
      );
    }

    console.log('Starting image generation process...');

    // Step 1: Generate optimized prompts using GPT-4
    const promptResponse = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: base64Avatar ? AVATAR_PROMPT : PROMPT
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`
              }
            },
            // Include avatar image if provided
            ...(base64Avatar ? [{
              type: "image_url" as const,
              image_url: {
                url: `data:image/jpeg;base64,${base64Avatar}`
              }
            }] : [])
          ]
        }
      ],
      max_tokens: 500
    });

    const promptText = promptResponse.choices[0]?.message?.content?.trim() || "";
    
    // Clean up the response and parse JSON
    const cleanedPromptText = promptText
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim();

    let promptData;
    try {
      promptData = JSON.parse(cleanedPromptText);
    } catch (parseError) {
      console.error('Failed to parse prompt JSON:', parseError);
      return NextResponse.json(
        { error: 'Failed to generate image prompts' },
        { status: 500 }
      );
    }

    console.log('Generated prompts:', promptData);

    // Step 2: Generate the actual image using DALL-E 3
    const imageResponse = await openai.images.generate({
      model: "dall-e-3",
      prompt: promptData.textToImage || "Create a professional product showcase image",
      size: (size as "1024x1024" | "1792x1024" | "1024x1792") || "1024x1024",
      quality: "standard",
      n: 1,
      response_format: "url"
    });

    const generatedImageUrl = imageResponse.data[0]?.url;

    if (!generatedImageUrl) {
      return NextResponse.json(
        { error: 'Failed to generate image' },
        { status: 500 }
      );
    }

    console.log('Image generated successfully');

    // Return the generated image URL and prompts
    return NextResponse.json({
      success: true,
      imageUrl: generatedImageUrl,
      textToImagePrompt: promptData.textToImage,
      imageToVideoPrompt: promptData.imageToVideo,
      description: description
    });

  } catch (error) {
    console.error('API Error:', error);
    
    // Handle specific OpenAI errors
    if (error instanceof Error) {
      if (error.message.includes('insufficient_quota')) {
        return NextResponse.json(
          { error: 'OpenAI API quota exceeded. Please try again later.' },
          { status: 429 }
        );
      }
      if (error.message.includes('rate_limit')) {
        return NextResponse.json(
          { error: 'Rate limit exceeded. Please try again in a moment.' },
          { status: 429 }
        );
      }
    }

    return NextResponse.json(
      { error: 'An error occurred while generating the image. Please try again.' },
      { status: 500 }
    );
  }
}
