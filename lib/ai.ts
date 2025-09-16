import { GoogleGenAI, Modality } from "@google/genai"
import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";

const genai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_API_KEY,
});

export async function generateScript({ prompt }: { prompt: string }) {
  try {
    console.log({ prompt });
    const response = await genai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `${prompt}`,
      config: {
        thinkingConfig: {
          thinkingBudget: 0,
        }
      }
    })

    return response.text
  } catch (err) {
    return err
  }
}

// generate image with google imagen client
interface GenerateImageOptions {
  prompt: string;
  style: "realistic" | "cartoon" | "watercolor" | "sketch"
  aspectRatio: "1:1" | "9:16" | "16:9" | "4:3" | "3:4";
}

export async function generateImage({ prompt, style, aspectRatio }: GenerateImageOptions) {
  try {
    // Include aspect ratio instruction in the prompt
    const getStyleDescription = ({ style }: { style: "realistic" | "cartoon" | "watercolor" | "sketch" }) => {
      const styles = {
        realistic: "photorealistic, high-quality photography style with natural lighting and detailed textures",
        cartoon: "vibrant cartoon illustration with bold colors, clean lines, and animated style",
        watercolor: "soft watercolor painting with flowing colors, gentle brushstrokes, and artistic texture",
        sketch: "hand-drawn pencil sketch with detailed line work, shading, and artistic sketching"
      };
      return styles[style] || styles.realistic;
    };

    const imagePrompt = `Create a ${getStyleDescription({ style })} image with aspect ratio ${aspectRatio}: ${prompt}`;

    const response = await genai.models.generateImages({
      model: "imagen-4.0-generate-preview-06-06",
      prompt: `${imagePrompt}`,
      config: {
        numberOfImages: 1,
        aspectRatio: aspectRatio,
      }
    })

    return response.generatedImages
  } catch (err) {
    throw err
  }
}

// generate image with google flash client

export async function generateImageWithFlash({ prompt, style, aspectRatio }: GenerateImageOptions) {
  try {
    // Include aspect ratio instruction in the prompt
    const getStyleDescription = ({ style }: { style: "realistic" | "cartoon" | "watercolor" | "sketch" }) => {
      const styles = {
        realistic: "photorealistic, high-quality photography style with natural lighting and detailed textures",
        cartoon: "vibrant cartoon illustration with bold colors, clean lines, and animated style",
        watercolor: "soft watercolor painting with flowing colors, gentle brushstrokes, and artistic texture",
        sketch: "hand-drawn pencil sketch with detailed line work, shading, and artistic sketching"
      };
      return styles[style] || styles.realistic;
    };

    const imagePrompt = `Create a ${getStyleDescription({ style })} image with aspect ratio ${aspectRatio}: ${prompt}`;

    const response = await genai.models.generateContent({
      model: "gemini-2.0-flash-preview-image-generation",
      contents: imagePrompt,
      config: {
        responseModalities: [Modality.TEXT, Modality.IMAGE],
      },
    });

    // Check if response has candidates
    if (!response.candidates || response.candidates.length === 0) {
      throw new Error("No candidates returned in response");
    }

    // Find and return the first (and only) generated image
    for (const part of response.candidates[0].content?.parts || []) {
      if (part.inlineData) {
        return {
          data: part.inlineData.data,
          mimeType: part.inlineData.mimeType,
        };
      }
    }

    throw new Error("No image generated in response");
  } catch (err) {
    throw err
  }
}


export async function generateAdsImageWithNanoBanana({ 
  base64Image, 
  description, 
  size, 
  base64Avatar 
}: { 
  base64Image: string; 
  description?: string; 
  size?: string; 
  base64Avatar?: string; 
}) {
  // Direct prompts for image generation
  const PROMPT = `Create a vibrant product showcase image featuring the uploaded product
  in the center, surrounded by dynamic splashes of liquid or relevant material that complement the product.
  Use a clean, colorful background to make the product stand out. Include subtle elements related to the product's flavor,
  ingredients, or theme floating around to add context and visual interest. 
  Ensure the product is sharp and in focus, with motion and energy conveyed through the splash effects.`;

  const AVATAR_PROMPT = `Create a professional product showcase image 
  featuring a person naturally holding the product in their hands. Make 
  the product the clear focal point of the scene. 
  Use a clean, colorful background that highlights the product.
  Include subtle floating elements related to the product's flavor, 
  ingredients, or theme for added context, if relevant. Ensure both the person and product are sharp, well-lit, and in focus, 
  conveying a polished and professional look.`;

  try {
    // Create the final prompt with description if provided
    let finalPrompt = base64Avatar ? AVATAR_PROMPT : PROMPT;
    if (description) {
      finalPrompt += ` Additional context: ${description}`;
    }

    if (size) {
      finalPrompt += ` Resolution: ${size}`;
    }
    const prompt = base64Avatar ? [
    { text: `${finalPrompt}` },
    {
      inlineData: {
        mimeType: "image/png",
        data: base64Image,
      },
    },
      {
      inlineData: {
        mimeType: "image/png",
        data: base64Avatar,
      },
    },
      
  ] : [
    { text: `${finalPrompt}` },
    {
      inlineData: {
        mimeType: "image/png",
        data: base64Image,
      },
    },
  ];

    const response = await genai.models.generateContent({
    model: "gemini-2.5-flash-image-preview",
    contents: prompt,
  });

    return {
      data: imageResult.data, // base64 image
    };

  } catch (error) {
    console.error('generateAdsImageWithNanoBanana error:', error);
    throw error;
  }
}


// generate image with AWS bedrock client
interface AWSGenerateImageOptions {
  prompt: string;
  aspectRatio: "1:1" | "9:16" | "16:9" | "4:3" | "3:4";
}

interface GeneratedImage {
  imageBase64?: string;
  finishReason?: string;
}

// Initialize Bedrock client
const bedrockClient = new BedrockRuntimeClient({
  region: 'ap-south-1',
  credentials: {
    accessKeyId: process.env.AWS_PUBLIC_ACCESS_KEY || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  }
});

// Map aspect ratios to Titan Image dimensions
function mapAspectRatioToDimensions(aspectRatio: string): { width: number; height: number } {
  const ratioMap: { [key: string]: { width: number; height: number } } = {
    "1:1": { width: 768, height: 512 },
    "9:16": { width: 768, height: 1280 }, // Portrait for mobile/YouTube Shorts
    "16:9": { width: 1280, height: 768 }, // Landscape for YouTube
    "4:3": { width: 1024, height: 768 },  // Traditional aspect ratio
    "3:4": { width: 768, height: 1024 }   // Portrait
  };

  return ratioMap[aspectRatio] || { width: 1024, height: 1024 };
}

export async function generateImageAws({ prompt, aspectRatio }: AWSGenerateImageOptions): Promise<GeneratedImage[]> {
  try {
    const dimensions = mapAspectRatioToDimensions(aspectRatio);

    // Using Amazon Titan Image Generator G1 for high quality images
    const requestBody = {
      taskType: "TEXT_IMAGE",
      textToImageParams: {
        text: prompt,
        negativeText: "blurry, low quality, distorted, watermark, signature, text, logo", // Improve quality
      },
      imageGenerationConfig: {
        numberOfImages: 1,
        height: dimensions.height,
        width: dimensions.width,
        quality: "standard", // Use premium quality for best results
        cfgScale: 7.5, // Controls adherence to prompt (1-10, higher = more adherence)
      }
    };

    const command = new InvokeModelCommand({
      modelId: "amazon.titan-image-generator-v1",
      contentType: "application/json",
      accept: "application/json",
      body: JSON.stringify(requestBody)
    });

    const response = await bedrockClient.send(command);
    const responseBody = JSON.parse(new TextDecoder().decode(response.body));

    // Transform response to match your expected format
    const generatedImages: GeneratedImage[] = responseBody.images.map((image: any) => ({
      imageBase64: image,
      finishReason: "SUCCESS"
    }));

    return generatedImages;

  } catch (error) {
    console.error("Error generating image with Bedrock:", error);
    throw error;
  }
}
