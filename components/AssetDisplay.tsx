
import React from 'react';
import type { MarketingAssets } from '../types';
import { IMAGE_FORMATS } from '../constants';
import { ImageIcon } from './icons';

interface AssetDisplayProps {
  assets: MarketingAssets | null;
  isLoading: boolean;
  error: string | null;
}

const SkeletonLoader: React.FC<{className: string}> = ({className}) => {
    return <div className={`bg-gray-700 animate-pulse rounded-lg ${className}`}></div>
}

export const AssetDisplay: React.FC<AssetDisplayProps> = ({ assets, isLoading, error }) => {
  const renderContent = () => {
    if (isLoading) {
      return (
        <div>
            <div className="mb-8 p-6 bg-gray-800 rounded-lg border border-gray-700">
                <SkeletonLoader className="h-6 w-3/4 mb-3" />
                <SkeletonLoader className="h-5 w-1/2" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {IMAGE_FORMATS.map(format => (
                    <div key={format.format} className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                         <SkeletonLoader className="w-full aspect-[1/1] mb-3" />
                         <SkeletonLoader className="h-5 w-2/3" />
                    </div>
                ))}
            </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center h-full bg-gray-800 p-8 rounded-lg border border-red-500/50">
          <h3 className="text-xl font-semibold text-red-400">Generation Failed</h3>
          <p className="mt-2 text-center text-red-300">{error}</p>
        </div>
      );
    }

    if (assets) {
      return (
        <div>
          <div className="mb-8 p-6 bg-gray-800 rounded-lg border border-gray-700">
            <h3 className="text-sm uppercase text-purple-400 font-semibold tracking-wider">Tagline</h3>
            <p className="text-2xl font-bold text-white mt-1">"{assets.text.tagline}"</p>
            <h3 className="text-sm uppercase text-purple-400 font-semibold tracking-wider mt-4">Call to Action</h3>
            <p className="text-xl font-semibold text-white mt-1">{assets.text.cta}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {assets.images.map((image) => (
              <div key={image.format} className="bg-gray-800 p-4 rounded-lg border border-gray-700 text-center">
                <img src={image.url} alt={image.format} className="w-full h-auto object-contain rounded-md mb-3 bg-gray-700" />
                <h4 className="font-semibold text-white">{image.format}</h4>
                <p className="text-sm text-gray-400">{image.aspectRatio}</p>
              </div>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center justify-center h-full bg-gray-800/50 p-8 rounded-lg border-2 border-dashed border-gray-700">
        <ImageIcon className="w-16 h-16 text-gray-600 mb-4" />
        <h3 className="text-xl font-semibold text-gray-400">Your generated assets will appear here</h3>
        <p className="mt-2 text-center text-gray-500">Fill out the form and click "Generate Assets" to get started.</p>
      </div>
    );
  };

  return <div className="h-full">{renderContent()}</div>;
};
