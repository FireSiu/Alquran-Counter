import React, { useState } from 'react';
import { Layers, Equal, Copy, ChevronRight } from 'lucide-react';
import { SurahMeta } from '../types/quran';
import {
  SAME_AYAH_COUNT_GROUPS,
  SAME_TOTAL_GROUPS,
  SURAHS_WITH_INTERNAL_DUPLICATES,
} from '../utils/abjadStats';
import { formatNumber } from '../utils/abjad';

interface SimilarityMapProps {
  allSurahs: SurahMeta[];
  onOpenSurah: (surahNumber: number, focusAyah?: number) => void;
}

type Tab = 'ayahCount' | 'total' | 'internal';

const ayahGroups = Array.from(SAME_AYAH_COUNT_GROUPS.entries()).sort((a, b) => a[0] - b[0]);
const totalGroups = Array.from(SAME_TOTAL_GROUPS.entries()).sort((a, b) => a[0] - b[0]);

/**
 * Peta kesamaan: hubungan antar surat (jumlah ayat sama, total hisab sama)
 * dan ayat kembar di dalam satu surat. Semua chip bisa diklik.
 */
export const SimilarityMap: React.FC<SimilarityMapProps> = ({ allSurahs, onOpenSurah }) => {
  const [tab, setTab] = useState<Tab>('ayahCount');

  const tabs: { key: Tab; label: string; count: number; icon: typeof Layers; active: string }[] = [
    { key: 'ayahCount', label: 'Jumlah ayat sama', count: ayahGroups.length, icon: Layers, active: 'bg-amber-500 text-white' },
    { key: 'total', label: 'Total hisab sama', count: totalGroups.length, icon: Equal, active: 'bg-sky-600 text-white' },
    { key: 'internal', label: 'Ayat kembar per surat', count: SURAHS_WITH_INTERNAL_DUPLICATES.length, icon: Copy, active: 'bg-rose-500 text-white' },
  ];

  const chip = (n: number) => (
    <button
      key={n}
      onClick={() => onOpenSurah(n)}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border-2 border-slate-200 hover:border-emerald-500 hover:text-emerald-800 text-sm font-bold text-slate-800 transition-colors cursor-pointer"
    >
      <span className="tabular-nums text-slate-400">{n}</span>
      {allSurahs[n - 1]?.name}
    </button>
  );

  const groupRow = (key: number, label: string, list: number[], tone: string) => (
    <div key={key} className={`flex flex-col sm:flex-row sm:items-center gap-2 p-3 rounded-xl border ${tone}`}>
      <div className="sm:w-28 shrink-0 text-base font-extrabold tabular-nums">{label}</div>
      <div className="flex flex-wrap gap-1.5">{list.map(chip)}</div>
    </div>
  );

  return (
    <section id="peta-kesamaan" className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 sm:p-6 animate-fadeUp">
      <div className="mb-4">
        <h2 className="text-xl font-extrabold text-slate-900">Peta Kesamaan</h2>
        <p className="text-sm text-slate-500 font-semibold">
          Surat yang saling terhubung, dan ayat bernilai sama di dalam satu surat. Klik untuk membuka.
        </p>
      </div>

      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 mb-4">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
              tab === t.key ? `${t.active} shadow-md` : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <t.icon className="w-4 h-4" />
            {t.label}
            <span className={`text-xs tabular-nums rounded-md px-1.5 ${tab === t.key ? 'bg-white/25' : 'bg-white'}`}>
              {t.count}
            </span>
          </button>
        ))}
      </div>

      <div key={tab} className="max-h-[480px] overflow-y-auto pr-1 space-y-2.5 animate-fadeIn">
        {tab === 'ayahCount' &&
          ayahGroups.map(([count, list]) =>
            groupRow(count, `${count} ayat`, list, 'bg-amber-50/60 border-amber-100 text-amber-900')
          )}

        {tab === 'total' &&
          (totalGroups.length === 0 ? (
            <div className="p-5 rounded-xl bg-sky-50/60 border border-sky-100 text-base font-semibold text-sky-900">
              Dari perhitungan seluruh huruf, tidak ada dua surat dengan total hisab yang persis sama — setiap
              surat memiliki total unik.
            </div>
          ) : (
            totalGroups.map(([total, list]) =>
              groupRow(total, formatNumber(total), list, 'bg-sky-50/60 border-sky-100 text-sky-900')
            )
          ))}

        {tab === 'internal' &&
          SURAHS_WITH_INTERNAL_DUPLICATES.map(({ surah, groups }) => (
            <div key={surah} className="p-3 rounded-xl bg-rose-50/50 border border-rose-100">
              <button
                onClick={() => onOpenSurah(surah)}
                className="flex items-center gap-2 text-base font-extrabold text-slate-900 hover:text-rose-700 cursor-pointer mb-2"
              >
                <span className="tabular-nums text-slate-400">{surah}</span>
                {allSurahs[surah - 1]?.name}
                <ChevronRight className="w-4 h-4" />
              </button>
              <div className="flex flex-wrap gap-2">
                {groups.map((g) => (
                  <div key={g.value} className="flex items-center gap-1 bg-white border border-rose-200 rounded-lg px-2 py-1">
                    <span className="text-xs font-extrabold text-rose-700 tabular-nums mr-1">= {formatNumber(g.value)}</span>
                    {g.ayat.map((a) => (
                      <button
                        key={a}
                        onClick={() => onOpenSurah(surah, a)}
                        className="text-sm font-bold tabular-nums text-slate-700 hover:text-white hover:bg-rose-500 rounded-md px-1.5 cursor-pointer transition-colors"
                        title={`Buka ayat ${a}`}
                      >
                        {a}
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          ))}
      </div>
    </section>
  );
};
