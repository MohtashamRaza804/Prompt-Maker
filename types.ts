export enum ViewState {
  HOME = 'HOME',
  ABOUT = 'ABOUT',
  PRIVACY = 'PRIVACY',
  TERMS = 'TERMS'
}

export interface PromptAttributes {
  lighting: number;
  complexity: number;
  vibrancy: number;
  realism: number;
  artistic: number;
}

export interface PromptVariations {
  minimal: string;
  balanced: string;
  detailed: string;
  cinematic: string;
  artistic: string;
}

export interface ModelAdvice {
  sdxl: string;
  midjourney: string;
  gemini: string;
}

export interface PromptResult {
  mainPrompt: string;
  negativePrompt: string;
  variations: PromptVariations;
  tags: string[];
  attributes: PromptAttributes;
  modelAdvice: ModelAdvice;
  timestamp: number;
}

export interface HistoryItem extends PromptResult {
  id: string;
  thumbnail?: string; // Base64 thumbnail for history list
}
