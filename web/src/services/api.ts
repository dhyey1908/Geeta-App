import type { Chapter, Verse } from '../types';

const STATIC_BASE_URL = 'https://vedicscriptures.github.io';

export async function getChapters(): Promise<Chapter[]> {
  const res = await fetch(`${STATIC_BASE_URL}/chapters`);
  if (!res.ok) throw new Error(`Failed to fetch chapters: ${res.status}`);
  return await res.json();
}

export async function getChapterDetails(chapterNum: number): Promise<Chapter> {
  const res = await fetch(`${STATIC_BASE_URL}/chapter/${chapterNum}`);
  if (!res.ok) throw new Error(`Failed to fetch chapter ${chapterNum}: ${res.status}`);
  return await res.json();
}

export async function getVerseDetails(chapterNum: number, verseNum: number): Promise<Verse> {
  const res = await fetch(`${STATIC_BASE_URL}/slok/${chapterNum}/${verseNum}`);
  if (!res.ok) throw new Error(`Failed to fetch verse ${chapterNum}.${verseNum}: ${res.status}`);
  return await res.json();
}

export async function getRandomVerse(): Promise<Verse> {
  const slokCounts = [
    47, 72, 43, 42, 29, 47, 30, 28, 34, 42, 55, 20, 35, 27, 20, 24, 28, 78
  ];
  const randomChapter = Math.floor(Math.random() * 18) + 1;
  const randomVerseNum = Math.floor(Math.random() * slokCounts[randomChapter - 1]) + 1;
  return getVerseDetails(randomChapter, randomVerseNum);
}

export async function getGujaratiTranslation(chapter: number, verse: number, hindiText: string): Promise<string> {
  const cacheKey = `bg_gu_${chapter}_${verse}`;
  const cached = localStorage.getItem(cacheKey);
  if (cached) return cached;

  try {
    const res = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(hindiText)}&langpair=hi|gu`);
    if (res.ok) {
      const data = await res.json();
      const translation = data?.responseData?.translatedText;
      if (translation) {
        localStorage.setItem(cacheKey, translation);
        return translation;
      }
    }
  } catch (err) {
    console.error("Gujarati translation error:", err);
  }
  return "અનુવાદ ઉપલબ્ધ નથી.";
}
