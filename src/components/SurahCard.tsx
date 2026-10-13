import React from 'react';
import { SurahMeta } from '../types/quran';
import { ChevronRight } from 'lucide-react';

interface SurahCardProps {
  surah: SurahMeta;
  readCountInSurah?: number;
  onSelect: (surahNumber: number) => void;
}

export const SurahCard: React.FC<SurahCardProps> = ({
  surah,
  readCountInSurah = 0,
  onSelect,
}) => {
  const isComplete = readCountInSurah >= surah.number_of_ayah;

  return (
    <div
      onClick={() => onSelect(surah.number_of_surah)}
      className="group relative bg-white hover:bg-[#FCFBF8] border border-stone-200/90 hover:border-pink-300/80 rounded-xl p-4 sm:p-5 transition-all duration-200 hover:shadow-md cursor-pointer flex flex-col justify-between"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        {/* Number badge & Latin name */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-stone-100 group-hover:bg-purple-100/60 text-stone-700 group-hover:text-purple-950 flex items-center justify-center text-sm font-semibold tabular-nums border border-stone-200 transition-colors">
            {surah.number_of_surah}
          </div>
          <div>
            <h3 className="text-base font-semibold text-stone-900 group-hover:text-purple-950 transition-colors tracking-tight">
              {surah.name}
            </h3>
            <p className="text-xs text-stone-500 font-normal">
              {surah.name_translations.id}
            </p>
          </div>
        </div>

        {/* Arabic Name */}
        <div className="text-right">
          <span
            className="font-arabic text-xl sm:text-2xl text-stone-800 group-hover:text-purple-900 transition-colors select-none font-medium"
            dir="rtl"
          >
            {surah.name_translations.ar}
          </span>
        </div>
      </div>

      {/* Clean Unboxed Metadata (Zero-Pill discipline) */}
      <div className="flex items-center justify-between pt-3 border-t border-stone-100 text-xs text-stone-500">
        <div className="flex items-center gap-1.5">
          <span>{surah.type}</span>
          <span aria-hidden="true" className="text-stone-300">·</span>
          <span className="tabular-nums">{surah.number_of_ayah} Ayat</span>
          {readCountInSurah > 0 && (
            <>
              <span aria-hidden="true" className="text-stone-300">·</span>
              <span className={`tabular-nums font-medium ${isComplete ? 'text-emerald-700' : 'text-purple-700'}`}>
                {readCountInSurah} dibaca
              </span>
            </>
          )}
        </div>

        <div className="flex items-center gap-1 text-stone-400 group-hover:text-pink-600 transition-colors text-xs font-medium">
          <span>Buka</span>
          <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </div>
      </div>
    </div>
  );
};
