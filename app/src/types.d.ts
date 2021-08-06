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
  head: string;
  text: TextBlock[];
}

interface Region {
  posX: number;
  posY: number;
  width: number;
  height: number;
  region: string;
  types: Sector[];
}

export interface CartoRegionData {
  regions: Region[];
  scale_width: number;
  scale_height: number;
}
