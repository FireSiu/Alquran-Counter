import React from 'react';
import { Search, X, Sparkles, BookCheck, Hash, Layers } from 'lucide-react';
import { ReadingProgress, SurahMeta } from '../types/quran';
import { TOTAL_AYAT_IN_QURAN } from '../utils/quranApi';
import { GRAND_TOTAL, GRAND_LETTERS } from '../utils/abjadStats';
import { formatNumber } from '../utils/abjad';

interface LandingHeroProps {
  allSurahs: SurahMeta[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  progress: ReadingProgress;
  onOpenSurah: (surahNumber: number) => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  allSurahs,
  searchQuery,
  onSearchChange,
  progress,
  onOpenSurah,
}) => {
  const percentage = ((progress.totalAyatRead / TOTAL_AYAT_IN_QURAN) * 100).toFixed(1);

  const stats = [
    { label: 'Total Nilai Hisab', value: formatNumber(GRAND_TOTAL), icon: Sparkles, color: 'text-emerald-600' },
    { label: 'Huruf Dihitung', value: formatNumber(GRAND_LETTERS), icon: Hash, color: 'text-sky-600' },
    { label: 'Ayat / Surat', value: '6.236 / 114', icon: Layers, color: 'text-amber-600' },
    { label: 'Progres Baca', value: `${percentage}%`, icon: BookCheck, color: 'text-rose-500' },
  ];

  return (
    <section className="relative overflow-hidden border-b border-slate-200 bg-gradient-to-b from-emerald-50/70 via-white to-white">
      <div className="pointer-events-none absolute -top-24 -right-24 w-96 h-96 rounded-full bg-emerald-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-sky-200/30 blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-8">
        <div className="text-center max-w-3xl mx-auto animate-fadeUp">
          <p className="font-arabic text-3xl sm:text-4xl text-slate-800 mb-4 select-none" dir="rtl">
            بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
          </p>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-3">
            Hitung Hisabul Jumal <span className="text-emerald-600">Setiap Surat</span>
          </h1>
          <p className="text-slate-600 text-base sm:text-lg font-medium leading-relaxed">
            Setiap huruf hijaiyah dihitung sesuai tabel Abjad: satuan, puluhan, ratusan. Lihat total per
            ayat, per surat, dan temukan ayat atau surat yang nilainya sama.
          </p>
        </div>

        {/* Search + quick dropdown */}
        <div className="max-w-3xl mx-auto mt-7 flex flex-col sm:flex-row gap-3 animate-fadeUp" style={{ animationDelay: '80ms' }}>
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Cari surat: Yasin, 36, Pembukaan…"
              className="w-full pl-12 pr-11 py-4 bg-white border-2 border-slate-200 rounded-2xl text-slate-900 text-base font-semibold placeholder:text-slate-400 placeholder:font-medium shadow-sm focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
                aria-label="Bersihkan pencarian"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <select
            value=""
            onChange={(e) => e.target.value && onOpenSurah(Number(e.target.value))}
            className="sm:w-64 px-4 py-4 bg-white border-2 border-slate-200 rounded-2xl text-base font-bold text-slate-800 shadow-sm focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 cursor-pointer"
            aria-label="Pilih surat langsung"
          >
            <option value="">Langsung buka surat…</option>
            {allSurahs.map((s) => (
              <option key={s.number_of_surah} value={s.number_of_surah}>
                {s.number_of_surah}. {s.name}
              </option>
            ))}
          </select>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 max-w-4xl mx-auto mt-8">
          {stats.map((s, i) => (
            <div
              key={s.label}
              className="bg-white/90 border border-slate-200 rounded-2xl p-4 shadow-sm hover:-translate-y-0.5 hover:shadow-md transition-all animate-fadeUp"
              style={{ animationDelay: `${140 + i * 60}ms` }}
            >
              <div className="flex items-center justify-between text-sm font-semibold text-slate-500">
                <span>{s.label}</span>
                <s.icon className={`w-4 h-4 ${s.color}`} />
              </div>
              <div className="mt-1 text-2xl font-extrabold text-slate-900 tabular-nums">{s.value}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
