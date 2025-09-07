
import React, { useState, useCallback } from 'react';
import { AdForm } from './components/AdForm';
import { AssetDisplay } from './components/AssetDisplay';
import { Header } from './components/Header';
import { generateMarketingText, generateImage } from './services/geminiService';
import type { MarketingAssets, AdFormData } from './types';
import { IMAGE_FORMATS } from './constants';

const App: React.FC = () => {
  const [assets, setAssets] = useState<MarketingAssets | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateAssets = useCallback(async (formData: AdFormData) => {
    setIsLoading(true);
    setError(null);
    setAssets(null);

    try {
      // 1. Generate marketing text (tagline + CTA)
      const marketingText = await generateMarketingText(formData);
      
      // 2. Create a unified prompt for image generation
      const imagePrompt = `Create a visually stunning, high-quality promotional image for a product called "${formData.productName}". 
      Product Description: "${formData.description}". 
      The ad's theme should be "${formData.theme}". 
      Incorporate the tagline: "${marketingText.tagline}".
      The image should be vibrant, professional, and eye-catching. Do not include any text in the image.`;

      // 3. Generate images for all formats in parallel
      const imagePromises = IMAGE_FORMATS.map(format => 
        generateImage(imagePrompt, format.aspectRatio).then(url => ({
          url,
          ...format
        }))
      );
      
      const images = await Promise.all(imagePromises);
      
      // 4. Set the final assets
      setAssets({ text: marketingText, images });

    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred. Please check the console and ensure your API key is configured correctly.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-sans">
      <main className="container mx-auto px-4 py-8 md:py-12">
        <Header />
        <div className="mt-8 md:mt-12 grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4">
            <AdForm onSubmit={handleGenerateAssets} isLoading={isLoading} />
          </div>
          <div className="lg:col-span-8">
            <AssetDisplay assets={assets} isLoading={isLoading} error={error} />
          </div>
        </div>
        <footer className="text-center mt-12 text-gray-500 text-sm">
            <p>Powered by Google Gemini. Built for you by a world-class React engineer.</p>
        </footer>
      </main>
    </div>
  );
};

export default App;
