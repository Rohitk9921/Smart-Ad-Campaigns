
import React from 'react';
import { SparklesIcon } from './icons';

export const Header: React.FC = () => {
  return (
    <header className="text-center">
      <div className="flex items-center justify-center gap-4">
        <SparklesIcon className="w-10 h-10 text-purple-400" />
        <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
          AdWizard
        </h1>
      </div>
      <p className="mt-4 text-lg text-gray-400">
        Generate complete marketing asset packs in seconds with AI.
      </p>
    </header>
  );
};
