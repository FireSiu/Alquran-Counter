import React from 'react';
import { SurahMeta } from '../types/quran';
import { ChevronRight, Copy, Equal, Layers } from 'lucide-react';
import { getSurahStat, internalDuplicates, surahsWithSameAyahCount, surahsWithSameTotal } from '../utils/abjadStats';
import { formatNumber } from '../utils/abjad';

interface SurahCardProps {
  surah: SurahMeta;
  readCountInSurah?: number;
  onSelect: (surahNumber: number) => void;
  index?: number;
}

export const SurahCard: React.FC<SurahCardProps> = ({ surah, readCountInSurah = 0, onSelect, index = 0 }) => {
  const n = surah.number_of_surah;
  const stat = getSurahStat(n);
  const sameCount = surahsWithSameAyahCount(n).length;
  const sameTotal = surahsWithSameTotal(n).length;
  const dupGroups = internalDuplicates(n).length;
  const readPct = Math.min(100, (readCountInSurah / surah.number_of_ayah) * 100);

  return (
    <button
      onClick={() => onSelect(n)}
      className="group text-left bg-white border-2 border-slate-100 hover:border-emerald-400 rounded-2xl p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg cursor-pointer flex flex-col gap-4 animate-fadeUp"
      style={{ animationDelay: `${Math.min(index, 20) * 25}ms` }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-11 h-11 shrink-0 rounded-xl bg-slate-100 group-hover:bg-emerald-600 group-hover:text-white text-slate-800 flex items-center justify-center text-base font-extrabold tabular-nums transition-colors">
            {n}
          </div>
          <div className="min-w-0">
            <h3 className="text-lg font-bold text-slate-900 truncate">{surah.name}</h3>
            <p className="text-sm text-slate-500 font-semibold truncate">{surah.name_translations.id}</p>
          </div>
        </div>
        <span className="font-arabic text-2xl text-slate-800 shrink-0" dir="rtl">
          {surah.name_translations.ar}
        </span>
      </div>

      {/* Total Hisab */}
      <div className="flex items-end justify-between rounded-xl bg-emerald-50/70 border border-emerald-100 px-4 py-3">
        <div>
          <div className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Total Hisab</div>
          <div className="text-2xl font-extrabold text-emerald-900 tabular-nums">{formatNumber(stat?.total ?? 0)}</div>
        </div>
        <div className="text-right text-sm font-semibold text-slate-600 leading-tight">
          <div className="tabular-nums">{surah.number_of_ayah} ayat</div>
          <div className="tabular-nums text-slate-400">{formatNumber(stat?.letters ?? 0)} huruf</div>
        </div>
      </div>

      {/* Badges kesamaan */}
      <div className="flex flex-wrap gap-1.5 min-h-[26px]">
        {sameCount > 0 && (
          <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-2 py-1">
            <Layers className="w-3.5 h-3.5" /> Ayat sama +{sameCount}
          </span>
        )}
        {sameTotal > 0 && (
          <span className="inline-flex items-center gap-1 text-xs font-bold text-sky-800 bg-sky-50 border border-sky-200 rounded-lg px-2 py-1">
            <Equal className="w-3.5 h-3.5" /> Hisab sama +{sameTotal}
          </span>
        )}
        {dupGroups > 0 && (
          <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-800 bg-rose-50 border border-rose-200 rounded-lg px-2 py-1">
            <Copy className="w-3.5 h-3.5" /> {dupGroups} grup ayat kembar
          </span>
        )}
      </div>

      <div className="flex items-center justify-between text-sm font-semibold text-slate-500">
        <span>{surah.type}</span>
        <span className="flex items-center gap-1 text-emerald-700 group-hover:gap-2 transition-all">
          Buka <ChevronRight className="w-4 h-4" />
        </span>
      </div>

      {readCountInSurah > 0 && (
        <div className="h-1.5 -mt-2 rounded-full bg-slate-100 overflow-hidden">
          <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${readPct}%` }} />
        </div>
      )}
    </button>
  );
};
