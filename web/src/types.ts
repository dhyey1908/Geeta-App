export interface Meaning {
  en: string;
  hi: string;
}

export interface Summary {
  en: string;
  hi: string;
}

export interface Chapter {
  chapter_number: number;
  verses_count: number;
  name: string;
  translation: string;
  transliteration: string;
  meaning: Meaning;
  summary: Summary;
}

export interface CommentaryOrTranslation {
  author: string;
  et?: string; // English translation
  ht?: string; // Hindi translation
  ec?: string; // English commentary
  hc?: string; // Hindi commentary
  sc?: string; // Sanskrit commentary
}

export interface Verse {
  _id: string;
  chapter: number;
  verse: number;
  slok: string;
  transliteration: string;
  tej?: CommentaryOrTranslation;
  siva?: CommentaryOrTranslation;
  purohit?: CommentaryOrTranslation;
  chinmay?: CommentaryOrTranslation;
  san?: CommentaryOrTranslation;
  adi?: CommentaryOrTranslation;
  gambir?: CommentaryOrTranslation;
  madhav?: CommentaryOrTranslation;
  anand?: CommentaryOrTranslation;
  rams?: CommentaryOrTranslation;
  raman?: CommentaryOrTranslation;
  abhinav?: CommentaryOrTranslation;
  sankar?: CommentaryOrTranslation;
  jaya?: CommentaryOrTranslation;
  vallabh?: CommentaryOrTranslation;
  ms?: CommentaryOrTranslation;
  srid?: CommentaryOrTranslation;
  dhan?: CommentaryOrTranslation;
  venkat?: CommentaryOrTranslation;
  puru?: CommentaryOrTranslation;
  neel?: CommentaryOrTranslation;
  prabhu?: CommentaryOrTranslation;
}

export interface Bookmark {
  chapter: number;
  verse: number;
  timestamp: number;
}

export interface Note {
  chapter: number;
  verse: number;
  text: string;
  timestamp: number;
}

export interface ReadingProgress {
  [chapterNumber: number]: number[]; // list of completed verses
}

export interface AppSettings {
  theme: 'light' | 'dark' | 'sepia';
  fontSize: 'sm' | 'base' | 'lg' | 'xl';
  translationAuthor: string;
  commentaryAuthor: string;
}
