
import { GoogleGenAI, Type } from "@google/genai";
import type { AdFormData, MarketingText } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const textModel = 'gemini-2.5-flash';
const imageModel = 'imagen-4.0-generate-001';

/**
 * Generates marketing text (tagline and CTA) using the Gemini API.
 */
export const generateMarketingText = async (formData: AdFormData): Promise<MarketingText> => {
    const { productName, description, theme } = formData;
    
    const prompt = `
        You are a world-class marketing copywriter. Your task is to generate a catchy tagline and a compelling call-to-action (CTA) for a product.
        
        Product Name: ${productName}
        Description: ${description}
        Marketing Theme: ${theme}

        Instructions:
        1. The tagline should be short, memorable, and capture the essence of the product.
        2. The CTA should be a clear, action-oriented phrase that encourages customers to engage.
        3. Respond ONLY with a JSON object.
    `;

    try {
        const response = await ai.models.generateContent({
            model: textModel,
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        tagline: {
                            type: Type.STRING,
                            description: 'A short, catchy tagline for the product.',
                        },
                        cta: {
                            type: Type.STRING,
                            description: 'A compelling call-to-action.',
                        },
                    },
                    required: ['tagline', 'cta'],
                },
            },
        });
        
        const jsonText = response.text.trim();
        return JSON.parse(jsonText);

    } catch (error) {
        console.error("Error generating marketing text:", error);
        throw new Error("Failed to generate marketing copy. The model may be overloaded or the prompt was blocked.");
    }
};

/**
 * Generates an image using the Gemini API (Imagen model).
 */
export const generateImage = async (prompt: string, aspectRatio: '1:1' | '9:16' | '16:9' | '4:3' | '3:4'): Promise<string> => {
    try {
        const response = await ai.models.generateImages({
            model: imageModel,
            prompt: prompt,
            config: {
                numberOfImages: 1,
                outputMimeType: 'image/jpeg',
                aspectRatio: aspectRatio,
            },
        });

        if (response.generatedImages && response.generatedImages.length > 0) {
            const base64ImageBytes = response.generatedImages[0].image.imageBytes;
            return `data:image/jpeg;base64,${base64ImageBytes}`;
        } else {
            throw new Error("No images were generated.");
        }
    } catch (error) {
        console.error(`Error generating image with aspect ratio ${aspectRatio}:`, error);
        throw new Error(`Failed to generate the ${aspectRatio} image. The model may have rejected the prompt.`);
    }
};
