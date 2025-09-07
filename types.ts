
export interface AdFormData {
  productName: string;
  description: string;
  theme: string;
}

export interface MarketingText {
  tagline: string;
  cta: string;
}

export interface GeneratedImage {
  url: string;
  format: string;
  aspectRatio: string;
}

export interface MarketingAssets {
  text: MarketingText;
  images: GeneratedImage[];
}
