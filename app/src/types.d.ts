export interface Footer {
  a: string;
  label; string;
}

export interface Meta {
  title: string;
  url: string;
  description: string;
}

type TextBlockType = "p";

export type TextBlock = Record<TextBlockType, string>;

export interface Content {
  type: string;
  head?: string;
  text?: TextBlock[];
  menu?: string;
  anchor?: string;
}

interface Region {
  posX: number;
  posY: number;
  region: string;
  types: Sector[];
  numCountries: number
  totalValue: number
}

export interface CartoRegionData {
  regions: Region[];
  scale_width: number;
  scale_height: number;
  type: string;
}

export type PolicyDomain = 'Has policies' | 'Has no policies' | 'Could be better' | 'No data';