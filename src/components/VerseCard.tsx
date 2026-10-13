import React, { useMemo, useState } from 'react';
import { CheckCircle, Bookmark, Calculator, ChevronDown, Copy as CopyIcon, Link2 } from 'lucide-react';
import { Verse, SurahMeta } from '../types/quran';
import { abjadBreakdown, formatNumber, stripLeadingBismillah } from '../utils/abjad';
import { ayatInOtherSurahsWithValue } from '../utils/abjadStats';
import { renderHighlightedTranslation } from '../utils/highlightKeywords';
import { LetterBreakdown } from './LetterBreakdown';

interface VerseCardProps {
  verse: Verse;
  surahNumber: number;
  allSurahs: SurahMeta[];
  twins: number[]; // ayat lain dalam surat ini dengan nilai sama
  dimmed: boolean;
  highlighted: boolean;
  flash: boolean;
  isRead: boolean;
  arabicClass: string;
  onToggleRead: () => void;
  onSetLastRead: () => void;
  onJumpAyah: (ayah: number) => void;
  onOpenOther: (surah: number, ayah: number) => void;
}

export const VerseCard: React.FC<VerseCardProps> = ({
  verse,
  surahNumber,
  allSurahs,
  twins,
  dimmed,
  highlighted,
  flash,
  isRead,
  arabicClass,
  onToggleRead,
  onSetLastRead,
  onJumpAyah,
  onOpenOther,
}) => {
  const [open, setOpen] = useState(false);
  const [showOthers, setShowOthers] = useState(false);

  const text = useMemo(
    () => stripLeadingBismillah(surahNumber, verse.number, verse.text),
    [surahNumber, verse.number, verse.text]
  );
  const breakdown = useMemo(() => abjadBreakdown(text), [text]);
  const others = useMemo(
    () => ayatInOtherSurahsWithValue(breakdown.total, surahNumber),
    [breakdown.total, surahNumber]
  );

  return (
    <article
      id={`ayah-${verse.number}`}
      className={`scroll-mt-44 bg-white border-2 rounded-2xl p-5 sm:p-7 transition-all duration-300 ${
        highlighted ? 'border-rose-400 shadow-lg ring-4 ring-rose-100' : isRead ? 'border-emerald-200' : 'border-slate-100'
      } ${dimmed ? 'opacity-35 saturate-50 hover:opacity-70' : 'opacity-100'} ${flash ? 'animate-pulseRing' : ''}`}
    >
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-4 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <span
            className={`w-10 h-10 rounded-xl flex items-center justify-center text-base font-extrabold tabular-nums ${
              highlighted ? 'bg-rose-500 text-white' : 'bg-slate-900 text-white'
            }`}
          >
            {verse.number}
          </span>
          <span className="text-base font-bold text-slate-700">Ayat ke-{verse.number}</span>
          {isRead && (
            <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-2 py-1">
              <CheckCircle className="w-3.5 h-3.5" /> Dibaca
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={onToggleRead}
            className={`p-2 rounded-lg border cursor-pointer transition-colors ${
              isRead
                ? 'bg-emerald-600 border-emerald-600 text-white'
                : 'border-slate-200 text-slate-500 hover:border-emerald-400 hover:text-emerald-700'
            }`}
            title={isRead ? 'Batalkan tanda dibaca' : 'Tandai sudah dibaca'}
          >
            <CheckCircle className="w-4 h-4" />
          </button>
          <button
            onClick={onSetLastRead}
            className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:border-amber-400 hover:text-amber-600 cursor-pointer transition-colors"
            title="Tandai terakhir dibaca"
          >
            <Bookmark className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Arabic */}
      <p className={`font-arabic text-right text-slate-900 ${arabicClass}`} dir="rtl">
        {text}{' '}
        <span className="inline-block text-emerald-700 text-2xl mr-1 select-none">﴿{verse.number}﴾</span>
      </p>

      {/* Translation */}
      <p className="mt-4 text-base sm:text-lg text-slate-700 font-medium leading-relaxed">
        {renderHighlightedTranslation(verse.translation_id)}
      </p>

      {/* Total + kesamaan */}
      <div className="mt-5 flex flex-wrap items-center gap-2">
        <button
          onClick={() => setOpen((o) => !o)}
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 cursor-pointer transition-colors shadow-sm"
          aria-expanded={open}
        >
          <Calculator className="w-4 h-4" />
          <span className="text-sm font-semibold">Total</span>
          <span className="text-lg font-extrabold tabular-nums">{formatNumber(breakdown.total)}</span>
          <span className="text-xs font-semibold text-emerald-100">· {breakdown.letterCount} huruf</span>
          <span className="text-xs font-bold bg-white/20 rounded-md px-1.5 py-0.5">{open ? 'Tutup' : 'Rincian'}</span>
          <ChevronDown className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`} />
        </button>

        {twins.length > 0 && (
          <div className="inline-flex flex-wrap items-center gap-1 rounded-xl bg-rose-50 border border-rose-200 px-3 py-2">
            <CopyIcon className="w-4 h-4 text-rose-600" />
            <span className="text-sm font-bold text-rose-800 mr-1">Sama dengan ayat</span>
            {twins.map((t) => (
              <button
                key={t}
                onClick={() => onJumpAyah(t)}
                className="text-sm font-extrabold tabular-nums text-rose-700 bg-white border border-rose-200 hover:bg-rose-500 hover:text-white rounded-md px-1.5 cursor-pointer transition-colors"
              >
                {t}
              </button>
            ))}
          </div>
        )}

        {others.length > 0 && (
          <button
            onClick={() => setShowOthers((s) => !s)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-sky-50 border border-sky-200 hover:bg-sky-100 px-3 py-2 text-sm font-bold text-sky-800 cursor-pointer transition-colors"
          >
            <Link2 className="w-4 h-4" /> {others.length} ayat di surat lain bernilai sama
          </button>
        )}
      </div>

      {showOthers && others.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5 p-3 rounded-xl bg-sky-50/60 border border-sky-100 max-h-40 overflow-y-auto animate-fadeIn">
          {others.map((r) => (
            <button
              key={`${r.surah}:${r.ayah}`}
              onClick={() => onOpenOther(r.surah, r.ayah)}
              className="text-xs font-bold text-sky-900 bg-white border border-sky-200 hover:border-sky-500 rounded-lg px-2 py-1 cursor-pointer"
            >
              {allSurahs[r.surah - 1]?.name} : {r.ayah}
            </button>
          ))}
        </div>
      )}

      {open && (
        <div className="mt-5 pt-5 border-t border-slate-100">
          <LetterBreakdown breakdown={breakdown} />
        </div>
      )}
    </article>
  );
};
