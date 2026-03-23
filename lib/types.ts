export interface Scene {
  id: number;
  name: string;
  timecode: string;
  duration: string;
  scriptExcerpt: string;
  motionStyle: string;
  colorHex: string[];
  colorDescription: string;
  textOverlay: string;
  assets: string[];
  transition: string;
  audioMood: string;
}

export interface Brief {
  title: string;
  totalDuration: string;
  overallMood: string;
  scenes: Scene[];
  technicalNotes: string;
  style?: string;
  createdAt?: string;
}

export type StyleType = 'Commercial' | 'Explainer' | 'Social Media' | 'Corporate' | 'Music Video' | 'Short Film';
