import React from 'react';
import { BookOpen, CheckCircle2, RotateCcw } from 'lucide-react';
import { ReadingProgress } from '../types/quran';

interface NavbarProps {
  progress: ReadingProgress;
  onOpenTasbih: () => void;
  onGoHome: () => void;
  onJumpToLastRead: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  progress,
  onOpenTasbih,
  onGoHome,
  onJumpToLastRead,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#FAF9F5]/90 backdrop-blur-md border-b border-stone-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Bar Contract: 3 zones separated by gap-8 */}
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single text element wordmark */}
          <button
            onClick={onGoHome}
            className="flex items-center gap-2.5 text-left group cursor-pointer"
          >
            <div className="w-9 h-9 rounded-lg bg-stone-900 text-stone-100 flex items-center justify-center font-serif text-lg font-bold shadow-xs group-hover:bg-purple-950 transition-colors">
              <BookOpen className="w-5 h-5 text-pink-200" />
            </div>
            <div className="leading-tight">
              <span className="text-lg font-bold tracking-tight text-stone-900 whitespace-nowrap group-hover:text-purple-950 transition-colors">
                Alquran Counter
              </span>
              <span className="block text-[11px] text-stone-500 font-normal">
                Baca · Tadabbur · Hitung
              </span>
            </div>
          </button>

          {/* Zone 2: Single-line text navigation links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-stone-600">
            <button
              onClick={onGoHome}
              className="hover:text-stone-900 transition-colors whitespace-nowrap cursor-pointer"
            >
              114 Surat
            </button>

            {progress.lastRead && (
              <button
                onClick={onJumpToLastRead}
                className="hover:text-stone-900 transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 text-stone-700 font-semibold"
                title="Lanjutkan bacaan terakhir"
              >
                <span>Terakhir: {progress.lastRead.surahName} : {progress.lastRead.ayahNumber}</span>
              </button>
            )}

            <button
              onClick={onOpenTasbih}
              className="hover:text-stone-900 transition-colors whitespace-nowrap cursor-pointer"
            >
              Tasbih Digital
            </button>

            <div className="flex items-center gap-1.5 text-xs text-stone-500 tabular-nums">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>{progress.totalAyatRead} Ayat Dibaca</span>
            </div>
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="flex items-center gap-2.5 shrink-0">
            {progress.lastRead && (
              <button
                onClick={onJumpToLastRead}
                className="md:hidden px-2.5 py-1.5 text-xs font-medium text-stone-700 bg-stone-100 rounded-lg hover:bg-stone-200 transition-colors whitespace-nowrap"
              >
                Ayat {progress.lastRead.ayahNumber}
              </button>
            )}

            <button
              onClick={onOpenTasbih}
              className="px-4 py-2 text-xs font-medium text-white bg-stone-900 rounded-lg hover:bg-stone-800 transition-colors whitespace-nowrap cursor-pointer shadow-xs flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5 text-pink-300" />
              <span>Tasbih Counter</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
