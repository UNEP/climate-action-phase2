export interface Footer {
  a: string;
  label; string;
}

export interface Meta {
  title: string;
  url: string;
  description: string;
}

type ContentType = "visual" | "intro";
type VisualType = "carto-world" | "carto-region";

type TextBlockType = "p";

export type TextBlock = Record<TextBlockType, string>;

export interface Content {
  type: ContentType;
  visual: VisualType;
  head: string;
  text: TextBlock[];
}
