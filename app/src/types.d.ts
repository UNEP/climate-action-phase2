export interface Footer {
  a: string;
  label; string;
}

export interface GDocs {
  article: Content[];
  meta: Meta;
}

export interface Meta {
  title: string;
  url: string;
  description: string;
  keywords: string;
}

type TextBlockType = "p";

export type TextBlock = Record<TextBlockType, string>;

type TextBlockType = "p";

export interface Embeds{
  title: string,
  head: string,
  embed: string,
}

export interface Content {
  type: string;
  head?: string;
  text?: TextBlock[];
  menu?: string;
  title?: string;
  icon?: string;
  menuicon?: string;
  embed?: string;
  id?: string;
  embedonly?: string;
  attribution?: string;
}

namespace Content {
  export interface AnnotatedImage extends Content {
    src: string;
    imgtitle: string;
    alt: string;
    head: string;
  }
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

type CSSOMString = string;
type FontFaceLoadStatus = 'unloaded'|'loading'|'loaded'|'error';
type FontFaceSetStatus = 'loading'|'loaded';

interface FontFace {
  family: CSSOMString;
  style: CSSOMString;
  weight: CSSOMString;
  stretch: CSSOMString;
  unicodeRange: CSSOMString;
  variant: CSSOMString;
  featureSettings: CSSOMString;
  variationSettings: CSSOMString;
  display: CSSOMString;
  readonly status: FontFaceLoadStatus;
  readonly loaded: Promise<FontFace>;
  load(): Promise<FontFace>;
}

interface FontFaceSet {
  readonly status: FontFaceSetStatus;
  readonly ready: Promise<FontFaceSet>;
  check(font: string, text?: string): boolean;
  load(font: string, text?: string): Promise<FontFace[]>
}

declare global {
  interface Document {
    fonts: FontFaceSet
  }
}