import React from 'react';
import { Filter, RotateCcw, Check } from 'lucide-react';
import { FilterKey } from '../types/quran';
import { AbjadTable } from './AbjadTable';

export const FILTER_OPTIONS: { key: FilterKey; label: string; hint: string; group: 'kesamaan' | 'kategori' }[] = [
  { key: 'sameAyahCount', label: 'Jumlah ayat sama', hint: 'Surat yang jumlah ayatnya sama dengan surat lain', group: 'kesamaan' },
  { key: 'sameTotal', label: 'Total hisab sama', hint: 'Surat yang total nilai hurufnya sama dengan surat lain', group: 'kesamaan' },
  { key: 'internalDup', label: 'Ada ayat kembar', hint: 'Surat yang memiliki ayat bernilai sama di dalamnya', group: 'kesamaan' },
  { key: 'Makkiyah', label: 'Makkiyah', hint: 'Turun di Makkah', group: 'kategori' },
  { key: 'Madaniyah', label: 'Madaniyah', hint: 'Turun di Madinah', group: 'kategori' },
  { key: 'juz30', label: 'Juz 30', hint: 'An-Naba (78) – An-Nas (114)', group: 'kategori' },
];

interface FilterSidebarProps {
  active: Set<FilterKey>;
  counts: Record<FilterKey, number>;
  onToggle: (key: FilterKey) => void;
  onReset: () => void;
  resultCount: number;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({ active, counts, onToggle, onReset, resultCount }) => {
  const renderGroup = (group: 'kesamaan' | 'kategori', title: string) => (
    <div>
      <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">{title}</div>
      <div className="space-y-1.5">
        {FILTER_OPTIONS.filter((f) => f.group === group).map((f) => {
          const checked = active.has(f.key);
          return (
            <label
              key={f.key}
              title={f.hint}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border-2 cursor-pointer select-none transition-all ${
                checked
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-900'
                  : 'border-transparent bg-slate-50 hover:bg-slate-100 text-slate-700'
              }`}
            >
              <input type="checkbox" className="sr-only" checked={checked} onChange={() => onToggle(f.key)} />
              <span
                className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-colors ${
                  checked ? 'bg-emerald-600 border-emerald-600' : 'bg-white border-slate-300'
                }`}
              >
                {checked && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
              </span>
              <span className="flex-1 text-sm font-bold">{f.label}</span>
              <span className="text-xs font-bold tabular-nums text-slate-500 bg-white border border-slate-200 rounded-md px-1.5 py-0.5">
                {counts[f.key]}
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );

  return (
    <aside className="lg:sticky lg:top-20 space-y-5">
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-base font-extrabold text-slate-900">
            <Filter className="w-4 h-4 text-emerald-600" />
            Filter
          </div>
          {active.size > 0 && (
            <button
              onClick={onReset}
              className="flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-rose-600 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset
            </button>
          )}
        </div>
        {renderGroup('kesamaan', 'Kesamaan')}
        {renderGroup('kategori', 'Kategori')}
        <div className="text-sm font-semibold text-slate-600 pt-1 border-t border-slate-100">
          Menampilkan <span className="font-extrabold text-slate-900">{resultCount}</span> surat
          {active.size > 1 && <span className="block text-xs text-slate-400">Semua filter yang dicentang harus terpenuhi</span>}
        </div>
      </div>

      <details className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm group">
        <summary className="text-base font-extrabold text-slate-900 cursor-pointer list-none flex items-center justify-between">
          Tabel Abjad
          <span className="text-xs font-bold text-emerald-700 group-open:hidden">Lihat</span>
          <span className="text-xs font-bold text-slate-400 hidden group-open:inline">Tutup</span>
        </summary>
        <div className="pt-3">
          <AbjadTable compact />
        </div>
      </details>
    </aside>
  );
};
