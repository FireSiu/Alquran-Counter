import React, { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, ChevronLeft, ChevronRight, Play, Pause, RefreshCw, Type, Copy, Layers, Equal } from 'lucide-react';
import { SurahDetail, ReadingProgress, SurahMeta } from '../types/quran';
import { getSurahDetail } from '../utils/quranApi';
import { formatNumber } from '../utils/abjad';
import { getSurahStat, internalDuplicates, surahsWithSameAyahCount, surahsWithSameTotal } from '../utils/abjadStats';
import { VerseCard } from './VerseCard';

interface SurahDetailViewProps {
  surahNumber: number;
  initialAyah?: number | null;
  allSurahs: SurahMeta[];
  progress: ReadingProgress;
  onBack: () => void;
  onNavigateSurah: (surahNumber: number, focusAyah?: number) => void;
  onToggleRead: (surahNumber: number, ayahNumber: number) => void;
  onSetLastRead: (surahNumber: number, surahName: string, ayahNumber: number) => void;
}

const FONT_SIZES = {
  normal: 'text-2xl sm:text-3xl leading-[2.1]',
  large: 'text-3xl sm:text-4xl leading-[2.2]',
  huge: 'text-4xl sm:text-5xl leading-[2.3]',
} as const;

export const SurahDetailView: React.FC<SurahDetailViewProps> = ({
  surahNumber,
  initialAyah,
  allSurahs,
  progress,
  onBack,
  onNavigateSurah,
  onToggleRead,
  onSetLastRead,
}) => {
  const [surah, setSurah] = useState<SurahDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fontSize, setFontSize] = useState<keyof typeof FONT_SIZES>('large');
  const [dupFilter, setDupFilter] = useState<'off' | 'all' | number>('off'); // number = nilai grup
  const [flashAyah, setFlashAyah] = useState<number | null>(null);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);

  const stat = getSurahStat(surahNumber);
  const dupGroups = useMemo(() => internalDuplicates(surahNumber), [surahNumber]);
  const twinMap = useMemo(() => {
    const m = new Map<number, { value: number; others: number[] }>();
    dupGroups.forEach((g) => g.ayat.forEach((a) => m.set(a, { value: g.value, others: g.ayat.filter((x) => x !== a) })));
    return m;
  }, [dupGroups]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    setDupFilter('off');
    getSurahDetail(surahNumber)
      .then((d) => !cancelled && (setSurah(d), setLoading(false)))
      .catch((e) => !cancelled && (setError(e.message || 'Gagal memuat data surat.'), setLoading(false)));
    return () => {
      cancelled = true;
    };
  }, [surahNumber]);

  // Hentikan audio saat ganti surat / unmount
  useEffect(() => {
    return () => {
      audio?.pause();
    };
  }, [audio]);
  useEffect(() => {
    setAudio(null);
    setPlaying(false);
  }, [surahNumber]);

  const jumpToAyah = (n: number) => {
    const el = document.getElementById(`ayah-${n}`);
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setFlashAyah(n);
    window.setTimeout(() => setFlashAyah((c) => (c === n ? null : c)), 2600);
  };

  // Lompat ke ayat awal (dari peta kesamaan / ayat surat lain)
  useEffect(() => {
    if (!loading && surah && initialAyah) {
      const t = window.setTimeout(() => jumpToAyah(initialAyah), 150);
      return () => window.clearTimeout(t);
    }
  }, [loading, surah, initialAyah]);

  const toggleAudio = () => {
    const url =
      surah?.recitations?.[0]?.audio_url ||
      surah?.recitation ||
      `https://download.quranicaudio.com/quran/mishaari_raashid_al_3afaasee/${String(surahNumber).padStart(3, '0')}.mp3`;
    if (playing && audio) {
      audio.pause();
      setPlaying(false);
      return;
    }
    const a = audio || new Audio(url);
    if (!audio) setAudio(a);
    a.onended = () => setPlaying(false);
    a.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-8 text-center animate-fadeIn">
        <div className="w-12 h-12 rounded-full border-4 border-emerald-100 border-t-emerald-600 animate-spin mb-4" />
        <h3 className="text-lg font-bold text-slate-800">Memuat surat…</h3>
      </div>
    );
  }

  if (error || !surah) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-8 text-center max-w-md mx-auto">
        <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mb-4">
          <RefreshCw className="w-7 h-7" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 mb-2">Gagal memuat surat</h3>
        <p className="text-base text-slate-600 font-medium mb-6">{error}</p>
        <div className="flex gap-3">
          <button onClick={() => onNavigateSurah(surahNumber)} className="px-5 py-2.5 text-sm font-bold text-white bg-emerald-600 rounded-xl cursor-pointer">
            Coba lagi
          </button>
          <button onClick={onBack} className="px-5 py-2.5 text-sm font-bold text-slate-700 bg-slate-100 rounded-xl cursor-pointer">
            Kembali
          </button>
        </div>
      </div>
    );
  }

  const isRead = (n: number) => Boolean(progress.readVerses[`${surahNumber}:${n}`]);
  const isInFilter = (n: number) => {
    if (dupFilter === 'off') return true;
    const t = twinMap.get(n);
    if (!t) return false;
    return dupFilter === 'all' || t.value === dupFilter;
  };
  const sameCount = surahsWithSameAyahCount(surahNumber);
  const sameTotal = surahsWithSameTotal(surahNumber);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 animate-fadeIn">
      {/* Top nav */}
      <div className="flex items-center justify-between gap-4 mb-5">
        <button onClick={onBack} className="flex items-center gap-2 text-base font-bold text-slate-700 hover:text-emerald-700 cursor-pointer">
          <ArrowLeft className="w-5 h-5" /> Daftar Surat
        </button>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigateSurah(surahNumber - 1)}
            disabled={surahNumber <= 1}
            className="p-2.5 rounded-xl border-2 border-slate-200 text-slate-700 hover:border-emerald-400 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            title="Surat sebelumnya"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-sm font-extrabold text-slate-700 tabular-nums">{surahNumber} / 114</span>
          <button
            onClick={() => onNavigateSurah(surahNumber + 1)}
            disabled={surahNumber >= 114}
            className="p-2.5 rounded-xl border-2 border-slate-200 text-slate-700 hover:border-emerald-400 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            title="Surat selanjutnya"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Header */}
      <div className="relative overflow-hidden bg-white border border-slate-200 rounded-3xl shadow-sm p-6 sm:p-8 mb-5 text-center">
        <div className="pointer-events-none absolute -top-20 -right-20 w-64 h-64 rounded-full bg-emerald-100/60 blur-3xl" />
        <div className="relative">
          <div className="font-arabic text-5xl text-slate-900 mb-2" dir="rtl">{surah.name_translations.ar}</div>
          <h1 className="text-3xl font-extrabold text-slate-900">{surah.name}</h1>
          <p className="text-base text-slate-500 font-semibold mt-1">
            {surah.name_translations.id} · {surah.type} · {surah.number_of_ayah} ayat
          </p>

          <div className="grid grid-cols-3 gap-3 max-w-lg mx-auto mt-6">
            <div className="rounded-2xl bg-emerald-600 text-white p-3">
              <div className="text-xs font-bold uppercase tracking-wider text-emerald-100">Total hisab</div>
              <div className="text-2xl font-extrabold tabular-nums">{formatNumber(stat?.total ?? 0)}</div>
            </div>
            <div className="rounded-2xl bg-slate-100 p-3">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Huruf</div>
              <div className="text-2xl font-extrabold tabular-nums text-slate-900">{formatNumber(stat?.letters ?? 0)}</div>
            </div>
            <div className="rounded-2xl bg-rose-50 p-3">
              <div className="text-xs font-bold uppercase tracking-wider text-rose-500">Ayat kembar</div>
              <div className="text-2xl font-extrabold tabular-nums text-rose-700">{twinMap.size}</div>
            </div>
          </div>

          {(sameCount.length > 0 || sameTotal.length > 0) && (
            <div className="mt-5 space-y-2">
              {sameCount.length > 0 && (
                <div className="flex flex-wrap items-center justify-center gap-1.5">
                  <span className="inline-flex items-center gap-1 text-sm font-bold text-amber-800">
                    <Layers className="w-4 h-4" /> Jumlah ayat sama:
                  </span>
                  {sameCount.map((n) => (
                    <button key={n} onClick={() => onNavigateSurah(n)} className="text-sm font-bold text-amber-900 bg-amber-50 border border-amber-200 hover:border-amber-500 rounded-lg px-2.5 py-1 cursor-pointer">
                      {n}. {allSurahs[n - 1]?.name}
                    </button>
                  ))}
                </div>
              )}
              {sameTotal.length > 0 && (
                <div className="flex flex-wrap items-center justify-center gap-1.5">
                  <span className="inline-flex items-center gap-1 text-sm font-bold text-sky-800">
                    <Equal className="w-4 h-4" /> Total hisab sama:
                  </span>
                  {sameTotal.map((n) => (
                    <button key={n} onClick={() => onNavigateSurah(n)} className="text-sm font-bold text-sky-900 bg-sky-50 border border-sky-200 hover:border-sky-500 rounded-lg px-2.5 py-1 cursor-pointer">
                      {n}. {allSurahs[n - 1]?.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
            <button onClick={toggleAudio} className="px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 bg-slate-900 hover:bg-emerald-700 text-white cursor-pointer transition-colors">
              {playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {playing ? 'Jeda murottal' : 'Putar murottal'}
            </button>
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
              <Type className="w-4 h-4 text-slate-500 mx-1.5" />
              {(['normal', 'large', 'huge'] as const).map((k, i) => (
                <button
                  key={k}
                  onClick={() => setFontSize(k)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-bold cursor-pointer transition-colors ${fontSize === k ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'}`}
                >
                  {['Sedang', 'Besar', 'Ekstra'][i]}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Sticky toolbar: pilih ayat + filter ayat kembar */}
      <div className="sticky top-16 z-30 -mx-4 sm:mx-0 px-4 sm:px-4 py-3 mb-5 bg-white/90 backdrop-blur-md border-y sm:border border-slate-200 sm:rounded-2xl shadow-sm">
        <div className="flex flex-col sm:flex-row gap-2.5">
          <label className="flex-1 flex items-center gap-2 rounded-xl border-2 border-emerald-500 bg-emerald-50 px-3 py-1">
            <span className="text-sm font-extrabold text-emerald-800 whitespace-nowrap">Pilih ayat</span>
            <select
              value=""
              onChange={(e) => e.target.value && jumpToAyah(Number(e.target.value))}
              className="flex-1 bg-transparent py-1.5 text-base font-bold text-slate-900 focus:outline-none cursor-pointer"
            >
              <option value="">Lompat ke ayat… (1–{surah.number_of_ayah})</option>
              {surah.verses.map((v) => (
                <option key={v.number} value={v.number}>
                  Ayat {v.number} — total {formatNumber(stat?.ayat[v.number - 1] ?? 0)}
                  {twinMap.has(v.number) ? ' • kembar' : ''}
                </option>
              ))}
            </select>
          </label>

          {dupGroups.length > 0 ? (
            <label className={`flex-1 flex items-center gap-2 rounded-xl border-2 px-3 py-1 transition-colors ${dupFilter === 'off' ? 'border-slate-200 bg-white' : 'border-rose-400 bg-rose-50'}`}>
              <Copy className="w-4 h-4 text-rose-600 shrink-0" />
              <select
                value={String(dupFilter)}
                onChange={(e) => {
                  const v = e.target.value;
                  setDupFilter(v === 'off' || v === 'all' ? v : Number(v));
                }}
                className="flex-1 bg-transparent py-1.5 text-base font-bold text-slate-900 focus:outline-none cursor-pointer"
              >
                <option value="off">Sorot ayat kembar: mati</option>
                <option value="all">Semua ayat kembar ({twinMap.size} ayat)</option>
                {dupGroups.map((g) => (
                  <option key={g.value} value={g.value}>
                    Nilai {formatNumber(g.value)} — ayat {g.ayat.join(', ')}
                  </option>
                ))}
              </select>
            </label>
          ) : (
            <div className="flex-1 flex items-center gap-2 rounded-xl border-2 border-dashed border-slate-200 px-3 py-2.5 text-sm font-semibold text-slate-400">
              <Copy className="w-4 h-4" /> Tidak ada ayat bernilai sama di surat ini
            </div>
          )}
        </div>
        {dupFilter !== 'off' && (
          <div className="mt-2 text-sm font-semibold text-rose-700 animate-fadeIn">
            Ayat kembar disorot, ayat lain diredupkan. Klik nomor ayat untuk lompat.
          </div>
        )}
      </div>

      {/* Basmalah (kecuali Al-Fatihah: sudah ayat 1, dan At-Taubah) */}
      {surahNumber !== 1 && surahNumber !== 9 && (
        <div className="text-center py-6 mb-5 rounded-2xl bg-white border border-slate-200">
          <p className="font-arabic text-3xl sm:text-4xl text-slate-800" dir="rtl">
            بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
          </p>
          <p className="text-sm text-slate-500 font-semibold mt-2">Basmalah · 786 (tidak dihitung dalam ayat 1)</p>
        </div>
      )}

      {/* Verses */}
      <div className="space-y-4">
        {surah.verses.map((verse) => {
          const inFilter = isInFilter(verse.number);
          return (
            <VerseCard
              key={verse.number}
              verse={verse}
              surahNumber={surahNumber}
              allSurahs={allSurahs}
              twins={twinMap.get(verse.number)?.others ?? []}
              dimmed={dupFilter !== 'off' && !inFilter}
              highlighted={dupFilter !== 'off' && inFilter}
              flash={flashAyah === verse.number}
              isRead={isRead(verse.number)}
              arabicClass={FONT_SIZES[fontSize]}
              onToggleRead={() => onToggleRead(surahNumber, verse.number)}
              onSetLastRead={() => onSetLastRead(surahNumber, surah.name, verse.number)}
              onJumpAyah={jumpToAyah}
              onOpenOther={(s, a) => onNavigateSurah(s, a)}
            />
          );
        })}
      </div>

      <div className="pt-10 pb-4 flex justify-center gap-3">
        <button onClick={onBack} className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-emerald-700 text-white text-sm font-bold cursor-pointer inline-flex items-center gap-2 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Kembali ke daftar surat
        </button>
        {surahNumber < 114 && (
          <button onClick={() => onNavigateSurah(surahNumber + 1)} className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold cursor-pointer inline-flex items-center gap-2 transition-colors">
            {allSurahs[surahNumber]?.name} <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
