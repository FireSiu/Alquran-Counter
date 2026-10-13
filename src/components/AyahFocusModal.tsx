import React, { useEffect, useState } from 'react';
import {
  X,
  Volume2,
  VolumeX,
  CheckCircle,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Copy,
  Check,
  Sparkles,
} from 'lucide-react';
import { Verse } from '../types/quran';
import { renderHighlightedTranslation } from '../utils/highlightKeywords';

interface AyahFocusModalProps {
  verse: Verse;
  surahNumber: number;
  surahName: string;
  surahArabic: string;
  totalAyah: number;
  isRead: boolean;
  onToggleRead: (ayahNumber: number) => void;
  onSetLastRead: (ayahNumber: number) => void;
  onClose: () => void;
  onNavigateAyah: (nextAyahNumber: number) => void;
  audioUrl?: string;
}

export const AyahFocusModal: React.FC<AyahFocusModalProps> = ({
  verse,
  surahNumber,
  surahName,
  surahArabic,
  totalAyah,
  isRead,
  onToggleRead,
  onSetLastRead,
  onClose,
  onNavigateAyah,
  audioUrl,
}) => {
  const [copied, setCopied] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioObj, setAudioObj] = useState<HTMLAudioElement | null>(null);
  const [showEnglish, setShowEnglish] = useState(false);

  // Close on Escape key press, Arrow keys for navigating verses
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft' && verse.number > 1) {
        onNavigateAyah(verse.number - 1);
      } else if (e.key === 'ArrowRight' && verse.number < totalAyah) {
        onNavigateAyah(verse.number + 1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [verse.number, totalAyah, onClose, onNavigateAyah]);

  // Clean up audio if playing
  useEffect(() => {
    return () => {
      if (audioObj) {
        audioObj.pause();
      }
    };
  }, [audioObj]);

  const handleCopy = () => {
    const textToCopy = `QS. ${surahName}: ${verse.number}\n\n${verse.text}\n\nArtinya:\n"${verse.translation_id}"`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleToggleAudio = () => {
    // If surah audio exists
    if (!audioUrl) return;

    if (isPlaying && audioObj) {
      audioObj.pause();
      setIsPlaying(false);
    } else {
      const audio = audioObj || new Audio(audioUrl);
      if (!audioObj) setAudioObj(audio);
      audio.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
      audio.onended = () => setIsPlaying(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-6 overflow-y-auto backdrop-blur-md bg-stone-900/60 animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative w-full max-w-3xl bg-[#FAF9F5] border border-stone-300/80 rounded-2xl shadow-2xl overflow-hidden my-auto transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-stone-200/80 bg-white/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-950 flex items-center justify-center font-bold text-xs tabular-nums border border-purple-200">
              {verse.number}
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-semibold text-stone-900 leading-tight">
                {surahName} · Ayat {verse.number}
              </h3>
              <p className="text-[11px] text-stone-500">
                Surat ke-{surahNumber} · {surahArabic} · Dari {totalAyah} ayat
              </p>
            </div>
          </div>

          {/* Close & Action Buttons */}
          <div className="flex items-center gap-2">
            {audioUrl && (
              <button
                onClick={handleToggleAudio}
                className={`p-2 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                  isPlaying
                    ? 'bg-purple-100 text-purple-950 border-purple-300'
                    : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
                }`}
                title={isPlaying ? 'Hentikan Audio' : 'Dengarkan Audio Surat'}
              >
                {isPlaying ? <VolumeX className="w-4 h-4 text-purple-700" /> : <Volume2 className="w-4 h-4" />}
                <span className="hidden sm:inline text-xs">{isPlaying ? 'Hentikan' : 'Audio'}</span>
              </button>
            )}

            <button
              onClick={handleCopy}
              className="p-2 rounded-lg bg-white border border-stone-200 hover:bg-stone-50 text-stone-700 transition-colors cursor-pointer"
              title="Salin Ayat & Terjemahan"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            </button>

            {/* Tombol Close Utama */}
            <button
              onClick={onClose}
              className="flex items-center gap-1 px-3 py-2 rounded-lg bg-stone-900 hover:bg-stone-800 text-white text-xs font-medium transition-colors cursor-pointer shadow-xs ml-1"
              aria-label="Tutup fokus ayat"
            >
              <X className="w-4 h-4 text-pink-200" />
              <span>Tutup</span>
            </button>
          </div>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-5 sm:p-7 max-h-[75vh] overflow-y-auto space-y-6">
          {/* Focused Arabic Verse Display */}
          <div className="relative p-6 sm:p-8 bg-white rounded-xl border border-stone-200/90 shadow-xs">
            <div
              className="font-arabic text-2xl sm:text-3xl md:text-4xl leading-loose sm:leading-loose md:leading-loose text-right text-stone-900 select-text font-medium"
              dir="rtl"
            >
              {verse.text}{' '}
              <span className="inline-block text-pink-700 font-normal text-xl sm:text-2xl mr-2 font-arabic select-none">
                ﴿{verse.number}﴾
              </span>
            </div>
          </div>

          {/* Panel Artinya (Meaning Panel with Highlighted Important Words in Pink-Purple) */}
          <div className="bg-[#FAF8F5] p-5 sm:p-6 rounded-xl border border-pink-200/80 shadow-[0_1px_3px_rgba(236,72,153,0.06)] space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-stone-200/60">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-purple-950 uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-pink-600" />
                <span>Arti & Terjemahan Bahasa Indonesia</span>
              </div>
              <div className="text-[11px] text-pink-800/90 bg-pink-100/70 border border-pink-200 px-2 py-0.5 rounded-full font-medium">
                Kata penting disorot pink keunguan
              </div>
            </div>

            {/* The Highlighted Indonesian Translation */}
            <div className="text-base sm:text-lg text-stone-800 leading-relaxed font-sans pt-1">
              {renderHighlightedTranslation(verse.translation_id)}
            </div>

            {/* English translation accordion/toggle */}
            {verse.translation_en && (
              <div className="pt-3 border-t border-stone-200/50">
                <button
                  onClick={() => setShowEnglish(!showEnglish)}
                  className="text-xs text-stone-500 hover:text-purple-900 font-medium cursor-pointer transition-colors"
                >
                  {showEnglish ? '− Sembunyikan Terjemahan Inggris' : '+ Lihat Terjemahan Bahasa Inggris'}
                </button>
                {showEnglish && (
                  <p className="mt-2 text-sm text-stone-600 italic leading-relaxed">
                    "{verse.translation_en}"
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Counter & Reading Actions */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-2">
              <button
                onClick={() => onToggleRead(verse.number)}
                className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer border ${
                  isRead
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300 shadow-xs'
                    : 'bg-white text-stone-700 border-stone-300 hover:border-emerald-300 hover:bg-emerald-50/50'
                }`}
              >
                <CheckCircle className={`w-4 h-4 ${isRead ? 'text-emerald-600' : 'text-stone-400'}`} />
                <span>{isRead ? 'Telah Dibaca (Counter Aktif)' : 'Tandai Sudah Dibaca (+1 Counter)'}</span>
              </button>

              <button
                onClick={() => onSetLastRead(verse.number)}
                className="px-3.5 py-2 rounded-lg text-xs font-semibold bg-white border border-stone-300 hover:border-pink-300 text-stone-700 hover:text-purple-950 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Bookmark className="w-4 h-4 text-pink-600" />
                <span>Tandai Terakhir Dibaca</span>
              </button>
            </div>

            <div className="text-xs text-stone-400">
              Gunakan tombol panah keyboard ← → untuk beralih ayat
            </div>
          </div>
        </div>

        {/* Modal Footer with Ayah Stepper Navigation */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-3.5 bg-stone-100/80 border-t border-stone-200 text-xs">
          <button
            onClick={() => onNavigateAyah(verse.number - 1)}
            disabled={verse.number <= 1}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-colors ${
              verse.number <= 1
                ? 'text-stone-300 cursor-not-allowed'
                : 'text-stone-700 hover:text-stone-900 bg-white border border-stone-200 hover:bg-stone-50 cursor-pointer'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Ayat Sebelumnya</span>
          </button>

          <span className="text-stone-500 font-medium tabular-nums">
            {verse.number} / {totalAyah}
          </span>

          <button
            onClick={() => onNavigateAyah(verse.number + 1)}
            disabled={verse.number >= totalAyah}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-colors ${
              verse.number >= totalAyah
                ? 'text-stone-300 cursor-not-allowed'
                : 'text-stone-700 hover:text-stone-900 bg-white border border-stone-200 hover:bg-stone-50 cursor-pointer'
            }`}
          >
            <span>Ayat Selanjutnya</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
