import rawSurahList from '../data/quran.json';
import { SurahDetail, SurahMeta } from '../types/quran';

// In-memory cache for loaded surah details
const surahCache = new Map<number, SurahDetail>();

// Surahs bundled locally for offline instant loading
import surah1 from '../data/surah/1.json';
import surah36 from '../data/surah/36.json';
import surah67 from '../data/surah/67.json';
import surah108 from '../data/surah/108.json';
import surah109 from '../data/surah/109.json';
import surah110 from '../data/surah/110.json';
import surah111 from '../data/surah/111.json';
import surah112 from '../data/surah/112.json';
import surah113 from '../data/surah/113.json';
import surah114 from '../data/surah/114.json';

const BUNDLED_SURAHS: Record<number, any> = {
  1: surah1,
  36: surah36,
  67: surah67,
  108: surah108,
  109: surah109,
  110: surah110,
  111: surah111,
  112: surah112,
  113: surah113,
  114: surah114,
};

// Populate memory cache with bundled surahs
Object.entries(BUNDLED_SURAHS).forEach(([key, val]) => {
  surahCache.set(Number(key), val as SurahDetail);
});

export const ALL_SURAHS: SurahMeta[] = rawSurahList as SurahMeta[];

export const TOTAL_AYAT_IN_QURAN = ALL_SURAHS.reduce(
  (acc, s) => acc + s.number_of_ayah,
  0
); // 6236

/**
 * Get all 114 surahs ordered 1..114
 */
export function getAllSurahs(): SurahMeta[] {
  return ALL_SURAHS;
}

/**
 * Fetch detailed surah data (with verses in Arabic, English, and Indonesian translation)
 */
export async function getSurahDetail(surahNumber: number): Promise<SurahDetail> {
  // 1. Check in-memory cache
  if (surahCache.has(surahNumber)) {
    return surahCache.get(surahNumber)!;
  }

  // 2. Check localStorage cache
  const cacheKey = `alquran_surah_v1_${surahNumber}`;
  try {
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      const parsed = JSON.parse(cached) as SurahDetail;
      if (parsed && parsed.verses && parsed.verses.length > 0) {
        surahCache.set(surahNumber, parsed);
        return parsed;
      }
    }
  } catch {
    // ignore localStorage errors
  }

  // 3. Check bundled fallback
  if (BUNDLED_SURAHS[surahNumber]) {
    const detail = BUNDLED_SURAHS[surahNumber] as SurahDetail;
    surahCache.set(surahNumber, detail);
    return detail;
  }

  // 4. Fetch from official QuranJSON repository
  const url = `https://raw.githubusercontent.com/penggguna/QuranJSON/master/surah/${surahNumber}.json`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Gagal memuat surat nomor ${surahNumber} (HTTP ${response.status})`);
    }

    const data = (await response.json()) as SurahDetail;

    // Cache locally
    surahCache.set(surahNumber, data);
    try {
      localStorage.setItem(cacheKey, JSON.stringify(data));
    } catch {
      // ignore quota exceeded
    }

    return data;
  } catch (error) {
    console.error(`Error fetching surah ${surahNumber}:`, error);
    // If network fails and we don't have it, throw friendly message
    throw new Error(
      `Tidak dapat memuat ayat untuk surat nomor ${surahNumber}. Periksa koneksi internet Anda atau coba lagi nanti.`
    );
  }
}

/**
 * Filter surahs based on keyword (name, meaning, number, type)
 */
export function searchSurahs(surahs: SurahMeta[], query: string): SurahMeta[] {
  const q = query.trim().toLowerCase();
  if (!q) return surahs;

  return surahs.filter((s) => {
    const num = s.number_of_surah.toString();
    const nameLatin = s.name.toLowerCase();
    const cleanLatin = nameLatin.replace(/[^a-z0-9]/g, '');
    const nameId = s.name_translations.id.toLowerCase();
    const nameEn = s.name_translations.en.toLowerCase();
    const nameAr = s.name_translations.ar;
    const cleanQuery = q.replace(/[^a-z0-9]/g, '');

    return (
      num === q ||
      nameLatin.includes(q) ||
      (cleanQuery.length > 0 && cleanLatin.includes(cleanQuery)) ||
      nameId.includes(q) ||
      nameEn.includes(q) ||
      nameAr.includes(q)
    );
  });
}
