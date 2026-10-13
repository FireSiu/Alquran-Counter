import React from 'react';
import { Search, X, Sparkles, BookCheck, Bookmark, Compass } from 'lucide-react';
import { ReadingProgress } from '../types/quran';
import { TOTAL_AYAT_IN_QURAN } from '../utils/quranApi';

interface LandingHeroProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  activeFilter: 'all' | 'Makkiyah' | 'Madaniyah' | 'juz30';
  onFilterChange: (filter: 'all' | 'Makkiyah' | 'Madaniyah' | 'juz30') => void;
  filteredCount: number;
  progress: ReadingProgress;
  onJumpToLastRead: () => void;
  onQuickJumpSurah: (surahNumber: number) => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  searchQuery,
  onSearchChange,
  activeFilter,
  onFilterChange,
  filteredCount,
  progress,
  onJumpToLastRead,
  onQuickJumpSurah,
}) => {
  const percentage = ((progress.totalAyatRead / TOTAL_AYAT_IN_QURAN) * 100).toFixed(2);

  return (
    <section className="pt-8 pb-6 border-b border-stone-200/60 bg-gradient-to-b from-[#FAF9F5] via-[#F6F4ED] to-[#FAF9F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Calligraphic Basmalah & Headline */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <p className="font-arabic text-2xl sm:text-3xl text-stone-700 mb-3 tracking-wide select-none" dir="rtl">
            بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
          </p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-medium text-stone-900 tracking-tight mb-3 text-balance">
            Alquran Counter
          </h1>
          <p className="text-stone-600 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
            Membaca dan mentadabburi 114 surat dengan desain terang yang elegan.
            Klik setiap ayat untuk memfokuskan layar serta menelaah arti dengan sorotan kata-kata penting.
          </p>

          {/* Quick jump popular surahs */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-4 text-xs text-stone-500">
            <span className="font-medium text-stone-400">Akses Cepat:</span>
            <button
              onClick={() => onQuickJumpSurah(1)}
              className="px-2.5 py-1 rounded bg-white border border-stone-200 hover:border-pink-300 hover:text-purple-900 transition-colors cursor-pointer"
            >
              Al-Fatihah (#1)
            </button>
            <button
              onClick={() => onQuickJumpSurah(18)}
              className="px-2.5 py-1 rounded bg-white border border-stone-200 hover:border-pink-300 hover:text-purple-900 transition-colors cursor-pointer"
            >
              Al-Kahf (#18)
            </button>
            <button
              onClick={() => onQuickJumpSurah(36)}
              className="px-2.5 py-1 rounded bg-white border border-stone-200 hover:border-pink-300 hover:text-purple-900 transition-colors cursor-pointer"
            >
              Yasin (#36)
            </button>
            <button
              onClick={() => onQuickJumpSurah(67)}
              className="px-2.5 py-1 rounded bg-white border border-stone-200 hover:border-pink-300 hover:text-purple-900 transition-colors cursor-pointer"
            >
              Al-Mulk (#67)
            </button>
            <button
              onClick={() => onQuickJumpSurah(112)}
              className="px-2.5 py-1 rounded bg-white border border-stone-200 hover:border-pink-300 hover:text-purple-900 transition-colors cursor-pointer"
            >
              Al-Ikhlas (#112)
            </button>
            <button
              onClick={() => onQuickJumpSurah(114)}
              className="px-2.5 py-1 rounded bg-white border border-stone-200 hover:border-pink-300 hover:text-purple-900 transition-colors cursor-pointer"
            >
              An-Nas (#114)
            </button>
          </div>
        </div>

        {/* Counter & Reading Statistics Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto mb-8">
          <div className="bg-white p-4 rounded-xl border border-stone-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
            <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
              <span>Ayat Telah Dibaca</span>
              <BookCheck className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-serif font-bold text-stone-900 tabular-nums">
              {progress.totalAyatRead}{' '}
              <span className="text-xs font-sans font-normal text-stone-400">/ 6.236</span>
            </div>
            <div className="w-full bg-stone-100 rounded-full h-1.5 mt-2 overflow-hidden">
              <div
                className="bg-emerald-600 h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, Math.max(1, (progress.totalAyatRead / TOTAL_AYAT_IN_QURAN) * 100))}%` }}
              />
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-stone-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
            <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
              <span>Progres Khatam</span>
              <Sparkles className="w-4 h-4 text-purple-600" />
            </div>
            <div className="text-2xl font-serif font-bold text-purple-900 tabular-nums">
              {percentage}%
            </div>
            <div className="text-[11px] text-stone-500 mt-2 truncate">
              {TOTAL_AYAT_IN_QURAN - progress.totalAyatRead} ayat tersisa
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-stone-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
            <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
              <span>Terakhir Dibaca</span>
              <Bookmark className="w-4 h-4 text-pink-600" />
            </div>
            {progress.lastRead ? (
              <button
                onClick={onJumpToLastRead}
                className="text-left group cursor-pointer w-full"
              >
                <div className="text-sm font-semibold text-stone-900 truncate group-hover:text-pink-700 transition-colors">
                  {progress.lastRead.surahName}
                </div>
                <div className="text-xs text-pink-700 font-medium mt-1 flex items-center gap-1">
                  <span>Ayat {progress.lastRead.ayahNumber}</span>
                  <span className="text-[10px] text-stone-400 underline">Lanjutkan →</span>
                </div>
              </button>
            ) : (
              <div>
                <div className="text-sm text-stone-400 italic">Belum ada</div>
                <div className="text-[11px] text-stone-400 mt-1">Buka surat untuk menandai</div>
              </div>
            )}
          </div>

          <div className="bg-white p-4 rounded-xl border border-stone-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
            <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
              <span>Katalog Surat</span>
              <Compass className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-2xl font-serif font-bold text-stone-900 tabular-nums">
              114 <span className="text-xs font-sans font-normal text-stone-400">Surat</span>
            </div>
            <div className="text-[11px] text-stone-500 mt-2">
              Al-Fatihah s.d. An-Nas
            </div>
          </div>
        </div>

        {/* Search Bar & Filter Controls */}
        <div className="max-w-3xl mx-auto">
          <div className="relative mb-3">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-stone-400">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Cari surat (contoh: Al-Baqarah, 36, Yasin, Pembukaan, Al-Mulk)..."
              className="w-full pl-11 pr-11 py-3.5 bg-white border border-stone-300 rounded-xl text-stone-900 text-sm sm:text-base placeholder:text-stone-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-800/20 focus:border-purple-800 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-stone-400 hover:text-stone-600 cursor-pointer"
                aria-label="Bersihkan pencarian"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Interactive Filter Tabs */}
          <div className="flex items-center justify-between flex-wrap gap-2 pt-1">
            <div className="flex items-center gap-1.5 p-1 bg-stone-200/70 rounded-lg">
              <button
                onClick={() => onFilterChange('all')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                  activeFilter === 'all'
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Semua (114)
              </button>
              <button
                onClick={() => onFilterChange('Makkiyah')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                  activeFilter === 'Makkiyah'
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Makkiyyah (86)
              </button>
              <button
                onClick={() => onFilterChange('Madaniyah')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                  activeFilter === 'Madaniyah'
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Madaniyyah (28)
              </button>
              <button
                onClick={() => onFilterChange('juz30')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                  activeFilter === 'juz30'
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Juz 30 (37)
              </button>
            </div>

            <div className="text-xs text-stone-500 tabular-nums">
              Menampilkan {filteredCount} surat
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
