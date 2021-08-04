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
