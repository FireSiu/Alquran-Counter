import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  CheckCircle,
  Eye,
  Type,
  Sparkles,
  RefreshCw,
} from 'lucide-react';
import { SurahDetail, Verse, ReadingProgress } from '../types/quran';
import { getSurahDetail } from '../utils/quranApi';
import { AyahFocusModal } from './AyahFocusModal';

interface SurahDetailViewProps {
  surahNumber: number;
  progress: ReadingProgress;
  onBack: () => void;
  onNavigateSurah: (surahNumber: number) => void;
  onToggleRead: (surahNumber: number, ayahNumber: number) => void;
  onSetLastRead: (surahNumber: number, surahName: string, ayahNumber: number) => void;
}

export const SurahDetailView: React.FC<SurahDetailViewProps> = ({
  surahNumber,
  progress,
  onBack,
  onNavigateSurah,
  onToggleRead,
  onSetLastRead,
}) => {
  const [surah, setSurah] = useState<SurahDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Selected ayah for the focused blur modal
  const [focusedAyah, setFocusedAyah] = useState<Verse | null>(null);

  // Arabic font size state
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'huge'>('large');

  // Full surah audio player state
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);

  // Fetch surah details
  useEffect(() => {
    let isCancelled = false;
    setLoading(true);
    setError(null);
    setFocusedAyah(null);

    // Stop current audio if playing
    if (audioElement) {
      audioElement.pause();
      setIsPlayingAudio(false);
    }

    getSurahDetail(surahNumber)
      .then((data) => {
        if (!isCancelled) {
          setSurah(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!isCancelled) {
          setError(err.message || 'Gagal memuat data surat.');
          setLoading(false);
        }
      });

    return () => {
      isCancelled = true;
      if (audioElement) {
        audioElement.pause();
      }
    };
  }, [surahNumber]);

  const handleToggleFullAudio = () => {
    const audioUrl =
      surah?.recitations?.[0]?.audio_url ||
      surah?.recitation ||
      `https://download.quranicaudio.com/quran/mishaari_raashid_al_3afaasee/${String(
        surahNumber
      ).padStart(3, '0')}.mp3`;

    if (isPlayingAudio && audioElement) {
      audioElement.pause();
      setIsPlayingAudio(false);
    } else {
      const audio = audioElement || new Audio(audioUrl);
      if (!audioElement) setAudioElement(audio);

      audio.play().then(() => setIsPlayingAudio(true)).catch(() => setIsPlayingAudio(false));
      audio.onended = () => setIsPlayingAudio(false);
    }
  };

  const isVerseRead = (num: number) => {
    return Boolean(progress.readVerses[`${surahNumber}:${num}`]);
  };

  const getFontSizeClass = () => {
    switch (fontSize) {
      case 'normal':
        return 'text-2xl leading-loose';
      case 'huge':
        return 'text-4xl sm:text-5xl leading-[2.6]';
      case 'large':
      default:
        return 'text-3xl sm:text-4xl leading-[2.3]';
    }
  };

  // If loading
  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-8 text-center">
        <div className="w-12 h-12 rounded-full border-3 border-pink-200 border-t-purple-900 animate-spin mb-4" />
        <h3 className="text-base font-medium text-stone-800">
          Memuat Surat Al-Qur'an...
        </h3>
        <p className="text-xs text-stone-500 mt-1">
          Mengambil data teks Arab dan terjemahan resmi
        </p>
      </div>
    );
  }

  // If error
  if (error || !surah) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-8 text-center max-w-md mx-auto">
        <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mb-4">
          <RefreshCw className="w-6 h-6" />
        </div>
        <h3 className="text-base font-semibold text-stone-900 mb-2">
          Terjadi Kendala Memuat Surat
        </h3>
        <p className="text-xs text-stone-600 mb-6 leading-relaxed">
          {error || 'Data surat tidak dapat diakses saat ini.'}
        </p>
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigateSurah(surahNumber)}
            className="px-4 py-2 text-xs font-medium text-white bg-stone-900 hover:bg-stone-800 rounded-lg cursor-pointer"
          >
            Coba Lagi
          </button>
          <button
            onClick={onBack}
            className="px-4 py-2 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg cursor-pointer"
          >
            Kembali ke Daftar Surat
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Top Navigation Bar: Back & Stepper */}
      <div className="flex items-center justify-between gap-4 mb-6 pb-4 border-b border-stone-200/80">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs sm:text-sm font-medium text-stone-700 hover:text-stone-900 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-stone-500" />
          <span>Kembali ke 114 Surat</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigateSurah(surahNumber - 1)}
            disabled={surahNumber <= 1}
            className={`p-2 rounded-lg border text-xs font-medium transition-colors ${
              surahNumber <= 1
                ? 'border-stone-200 text-stone-300 cursor-not-allowed'
                : 'border-stone-300 text-stone-700 hover:bg-stone-100 cursor-pointer'
            }`}
            title="Surat Sebelumnya"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="text-xs font-semibold text-stone-700 tabular-nums px-1">
            {surahNumber} / 114
          </span>

          <button
            onClick={() => onNavigateSurah(surahNumber + 1)}
            disabled={surahNumber >= 114}
            className={`p-2 rounded-lg border text-xs font-medium transition-colors ${
              surahNumber >= 114
                ? 'border-stone-200 text-stone-300 cursor-not-allowed'
                : 'border-stone-300 text-stone-700 hover:bg-stone-100 cursor-pointer'
            }`}
            title="Surat Selanjutnya"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Surah Header Card */}
      <div className="bg-white rounded-2xl border border-stone-200/90 shadow-sm p-6 sm:p-8 mb-8 text-center relative overflow-hidden">
        {/* Subtle decorative background glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-pink-50/50 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-50/50 rounded-full blur-3xl -z-10" />

        <div className="max-w-xl mx-auto">
          <div className="font-arabic text-4xl sm:text-5xl text-stone-900 mb-3 font-medium select-none" dir="rtl">
            {surah.name_translations.ar}
          </div>

          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 mb-1">
            {surah.name}
          </h1>

          <p className="text-sm text-stone-600 mb-4 font-normal">
            {surah.name_translations.id} ({surah.name_translations.en})
          </p>

          {/* Clean Unboxed Metadata */}
          <div className="flex items-center justify-center gap-2 text-xs text-stone-500 mb-6">
            <span>Surat ke-{surah.number_of_surah}</span>
            <span aria-hidden="true">·</span>
            <span>{surah.type}</span>
            <span aria-hidden="true">·</span>
            <span className="tabular-nums">{surah.number_of_ayah} Ayat</span>
          </div>

          {/* Audio Player and Font Controls */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={handleToggleFullAudio}
              className={`px-4 py-2 rounded-xl text-xs font-medium flex items-center gap-2 transition-colors cursor-pointer shadow-xs ${
                isPlayingAudio
                  ? 'bg-purple-900 text-white hover:bg-purple-950'
                  : 'bg-stone-900 text-white hover:bg-stone-800'
              }`}
            >
              {isPlayingAudio ? (
                <>
                  <Pause className="w-3.5 h-3.5 text-pink-300" />
                  <span>Jeda Murottal Surat</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 text-pink-300" />
                  <span>Putar Murottal Penuh</span>
                </>
              )}
            </button>

            {/* Font Size Adjuster */}
            <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl text-xs">
              <Type className="w-3.5 h-3.5 text-stone-500 ml-1.5 mr-0.5" />
              <button
                onClick={() => setFontSize('normal')}
                className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                  fontSize === 'normal' ? 'bg-white shadow-xs font-semibold text-stone-900' : 'text-stone-600'
                }`}
              >
                Sedang
              </button>
              <button
                onClick={() => setFontSize('large')}
                className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                  fontSize === 'large' ? 'bg-white shadow-xs font-semibold text-stone-900' : 'text-stone-600'
                }`}
              >
                Besar
              </button>
              <button
                onClick={() => setFontSize('huge')}
                className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                  fontSize === 'huge' ? 'bg-white shadow-xs font-semibold text-stone-900' : 'text-stone-600'
                }`}
              >
                Ekstra
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bismillah banner (All surahs except At-Taubah #9) */}
      {surahNumber !== 9 && (
        <div className="text-center py-6 mb-8 border-y border-stone-200/60 bg-[#FAF9F5]/70 rounded-xl">
          <p className="font-arabic text-2xl sm:text-3xl text-stone-800 select-none tracking-wide" dir="rtl">
            بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
          </p>
          <p className="text-xs text-stone-500 mt-2 font-normal">
            Dengan menyebut nama Allah Yang Maha Pemurah lagi Maha Penyayang
          </p>
        </div>
      )}

      {/* Interactive Guidance Banner for Focus Mode */}
      <div className="mb-6 bg-pink-50/70 border border-pink-200/80 rounded-xl p-3.5 sm:p-4 flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5 text-purple-950">
          <Sparkles className="w-4 h-4 text-pink-600 shrink-0" />
          <span className="leading-relaxed">
            <strong className="font-semibold">Mode Tadabbur & Fokus:</strong> Sesuai desain, artinya tidak dimunculkan langsung. Klik pada kotak ayat mana pun untuk memfokuskan layar dan membuka panel artinya dengan highlight kata-kata penting.
          </span>
        </div>
      </div>

      {/* Verses List */}
      <div className="space-y-4">
        {surah.verses.map((verse) => {
          const isRead = isVerseRead(verse.number);

          return (
            <div
              key={verse.number}
              onClick={() => setFocusedAyah(verse)}
              className={`group bg-white hover:bg-[#FCFBF8] border rounded-2xl p-5 sm:p-7 transition-all duration-200 cursor-pointer shadow-xs hover:shadow-md relative ${
                isRead
                  ? 'border-emerald-200/90'
                  : 'border-stone-200/90 hover:border-pink-300/80'
              }`}
            >
              {/* Verse Header Row */}
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-stone-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-stone-100 group-hover:bg-purple-100/70 text-stone-700 group-hover:text-purple-950 flex items-center justify-center text-xs font-semibold tabular-nums border border-stone-200 transition-colors">
                    {verse.number}
                  </div>
                  <span className="text-xs text-stone-500 font-medium">
                    Ayat ke-{verse.number}
                  </span>
                  {isRead && (
                    <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      <CheckCircle className="w-3 h-3 text-emerald-600" />
                      Dibaca
                    </span>
                  )}
                </div>

                {/* Focus affordance prompt */}
                <div className="flex items-center gap-1.5 text-xs text-stone-400 group-hover:text-purple-900 font-medium transition-colors">
                  <Eye className="w-3.5 h-3.5 text-pink-500 group-hover:scale-110 transition-transform" />
                  <span className="hidden sm:inline">Klik untuk fokus & lihat arti</span>
                  <span className="sm:hidden">Lihat arti</span>
                  <ChevronRight className="w-3.5 h-3.5 text-stone-300 group-hover:text-purple-900 group-hover:translate-x-0.5 transition-all" />
                </div>
              </div>

              {/* Arabic Verse Display */}
              <div className="text-right py-2">
                <p
                  className={`font-arabic text-stone-900 select-text font-medium group-hover:text-purple-950 transition-colors ${getFontSizeClass()}`}
                  dir="rtl"
                >
                  {verse.text}{' '}
                  <span className="inline-block text-pink-700/80 font-normal text-xl sm:text-2xl mr-2 font-arabic select-none">
                    ﴿{verse.number}﴾
                  </span>
                </p>
              </div>

              {/* Subtle hint indicator at bottom */}
              <div className="pt-3 mt-3 border-t border-stone-100/70 flex items-center justify-between text-[11px] text-stone-400">
                <span>Klik ayat untuk menampilkan terjemahan & sorotan kata kunci</span>
                <span className="text-pink-600/80 font-medium group-hover:underline">Buka Tafsir Ayat →</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Back Button */}
      <div className="pt-10 pb-6 text-center">
        <button
          onClick={onBack}
          className="px-6 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-medium transition-colors cursor-pointer shadow-xs inline-flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4 text-pink-300" />
          <span>Kembali ke 114 Surat</span>
        </button>
      </div>

      {/* The Focused Ayat Modal with Blur Backdrop */}
      {focusedAyah && (
        <AyahFocusModal
          verse={focusedAyah}
          surahNumber={surah.number_of_surah}
          surahName={surah.name}
          surahArabic={surah.name_translations.ar}
          totalAyah={surah.number_of_ayah}
          isRead={isVerseRead(focusedAyah.number)}
          onToggleRead={(ayahNum) => onToggleRead(surah.number_of_surah, ayahNum)}
          onSetLastRead={(ayahNum) => onSetLastRead(surah.number_of_surah, surah.name, ayahNum)}
          onClose={() => setFocusedAyah(null)}
          onNavigateAyah={(nextAyahNum) => {
            const nextVerse = surah.verses.find((v) => v.number === nextAyahNum);
            if (nextVerse) {
              setFocusedAyah(nextVerse);
            }
          }}
          audioUrl={
            surah.recitations?.[0]?.audio_url ||
            surah.recitation ||
            `https://download.quranicaudio.com/quran/mishaari_raashid_al_3afaasee/${String(
              surahNumber
            ).padStart(3, '0')}.mp3`
          }
        />
      )}
    </div>
  );
};
