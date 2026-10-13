import React from 'react';
import { Heart, ExternalLink } from 'lucide-react';

interface FooterProps {
  onQuickJumpSurah: (surahNumber: number) => void;
  onOpenTasbih: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onQuickJumpSurah, onOpenTasbih }) => {
  return (
    <footer className="mt-16 border-t border-stone-200/80 bg-white/60 py-12 text-stone-600 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand & Purpose */}
          <div className="md:col-span-2 space-y-3">
            <h3 className="text-base font-serif font-bold text-stone-900">
              Alquran Counter
            </h3>
            <p className="text-stone-500 max-w-md leading-relaxed">
              Website Al-Qur'an digital berestetika terang elegan yang dirancang untuk kenyamanan membaca, tadabbur per ayat dengan sorotan makna penting, serta tracking khatam dan zikir harian.
            </p>
            <div className="flex items-center gap-1.5 text-stone-400 pt-1">
              <span>Dibangun dengan ketenangan untuk pembaca Al-Qur'an</span>
              <Heart className="w-3.5 h-3.5 text-pink-400 fill-pink-400" />
            </div>
          </div>

          {/* Surat Pilihan */}
          <div>
            <h4 className="font-semibold text-stone-800 mb-3 text-xs uppercase tracking-wider">
              Surat Pilihan
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onQuickJumpSurah(1)}
                  className="hover:text-purple-950 hover:underline transition-colors cursor-pointer"
                >
                  Al-Fatihah (Pembukaan)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onQuickJumpSurah(18)}
                  className="hover:text-purple-950 hover:underline transition-colors cursor-pointer"
                >
                  Al-Kahf (Gua)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onQuickJumpSurah(36)}
                  className="hover:text-purple-950 hover:underline transition-colors cursor-pointer"
                >
                  Yasin (Jantung Al-Qur'an)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onQuickJumpSurah(67)}
                  className="hover:text-purple-950 hover:underline transition-colors cursor-pointer"
                >
                  Al-Mulk (Kerajaan)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onQuickJumpSurah(114)}
                  className="hover:text-purple-950 hover:underline transition-colors cursor-pointer"
                >
                  An-Nas (Manusia)
                </button>
              </li>
            </ul>
          </div>

          {/* Fitur & Sumber Data */}
          <div>
            <h4 className="font-semibold text-stone-800 mb-3 text-xs uppercase tracking-wider">
              Fitur & Sumber
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={onOpenTasbih}
                  className="hover:text-purple-950 hover:underline transition-colors cursor-pointer"
                >
                  Tasbih & Wirid Digital
                </button>
              </li>
              <li>
                <span className="text-stone-500">Mode Tadabbur & Fokus Ayat</span>
              </li>
              <li>
                <span className="text-stone-500">Sorotan Kata Kunci Ilahi</span>
              </li>
              <li className="pt-2">
                <a
                  href="https://github.com/penggguna/QuranJSON"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-stone-500 hover:text-stone-900 transition-colors"
                >
                  <span>Data: QuranJSON (penggguna)</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-stone-200/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-stone-400">
          <p>© 2026 Alquran Counter. Seluruh hak cipta terjemahan dan mushaf terjaga.</p>
          <p>Navigasi 114 Surat · 6.236 Ayat · 30 Juz</p>
        </div>
      </div>
    </footer>
  );
};
