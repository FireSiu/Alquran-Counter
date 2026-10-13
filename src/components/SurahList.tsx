import React from 'react';
import { SurahMeta, ReadingProgress } from '../types/quran';
import { SurahCard } from './SurahCard';
import { BookOpen } from 'lucide-react';

interface SurahListProps {
  surahs: SurahMeta[];
  progress: ReadingProgress;
  onSelectSurah: (surahNumber: number) => void;
  onResetSearch?: () => void;
}

export const SurahList: React.FC<SurahListProps> = ({
  surahs,
  progress,
  onSelectSurah,
  onResetSearch,
}) => {
  // Calculate read count per surah
  const getReadCountForSurah = (surahNumber: number, totalAyah: number): number => {
    let count = 0;
    for (let i = 1; i <= totalAyah; i++) {
      if (progress.readVerses[`${surahNumber}:${i}`]) {
        count++;
      }
    }
    return count;
  };

  if (surahs.length === 0) {
    return (
      <div className="py-16 text-center max-w-md mx-auto">
        <div className="w-12 h-12 mx-auto rounded-full bg-stone-100 flex items-center justify-center text-stone-400 mb-3">
          <BookOpen className="w-6 h-6" />
        </div>
        <h3 className="text-base font-semibold text-stone-900 mb-1">
          Surat Tidak Ditemukan
        </h3>
        <p className="text-sm text-stone-500 mb-4">
          Coba cari dengan nama latin lain (contoh: "Kahfi", "Waqiah"), nomor surat, atau terjemahan artinya.
        </p>
        {onResetSearch && (
          <button
            onClick={onResetSearch}
            className="px-4 py-2 text-xs font-medium text-stone-800 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors cursor-pointer"
          >
            Tampilkan Semua 114 Surat
          </button>
        )}
      </div>
    );
  }

  return (
    <section className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-serif font-semibold text-stone-900">
          Daftar Surat Al-Qur'an
        </h2>
        <span className="text-xs text-stone-500">
          Al-Fatihah (1) — An-Nas (114)
        </span>
      </div>

      {/* Grid of Surahs ordered 1 to 114 from left to right */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5 sm:gap-4">
        {surahs.map((surah) => (
          <SurahCard
            key={surah.number_of_surah}
            surah={surah}
            readCountInSurah={getReadCountForSurah(surah.number_of_surah, surah.number_of_ayah)}
            onSelect={onSelectSurah}
          />
        ))}
      </div>
    </section>
  );
};
