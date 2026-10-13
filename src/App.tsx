/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { LandingHero } from './components/LandingHero';
import { SurahList } from './components/SurahList';
import { SurahDetailView } from './components/SurahDetailView';
import { TasbihModal } from './components/TasbihModal';
import { Footer } from './components/Footer';
import { FilterSidebar } from './components/FilterSidebar';
import { SimilarityMap } from './components/SimilarityMap';
import { getAllSurahs, searchSurahs } from './utils/quranApi';
import { internalDuplicates, surahsWithSameAyahCount, surahsWithSameTotal } from './utils/abjadStats';
import { useQuranStorage } from './hooks/useQuranStorage';
import { FilterKey, SurahMeta } from './types/quran';

const FILTER_FNS: Record<FilterKey, (s: SurahMeta) => boolean> = {
  sameAyahCount: (s) => surahsWithSameAyahCount(s.number_of_surah).length > 0,
  sameTotal: (s) => surahsWithSameTotal(s.number_of_surah).length > 0,
  internalDup: (s) => internalDuplicates(s.number_of_surah).length > 0,
  Makkiyah: (s) => s.type === 'Makkiyah',
  Madaniyah: (s) => s.type === 'Madaniyah',
  juz30: (s) => s.number_of_surah >= 78,
};

export default function App() {
  const allSurahs = useMemo(() => getAllSurahs(), []);

  // null = landing page, number = viewing specific surah
  const [selectedSurahNumber, setSelectedSurahNumber] = useState<number | null>(null);
  const [initialAyah, setInitialAyah] = useState<number | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<Set<FilterKey>>(new Set());
  const [isTasbihOpen, setIsTasbihOpen] = useState(false);

  const {
    progress,
    toggleAyatRead,
    setLastRead,
    tasbih,
    incrementTasbih,
    resetTasbih,
    setDhikrPreset,
    setCustomTarget,
  } = useQuranStorage();

  const filterCounts = useMemo(() => {
    const out = {} as Record<FilterKey, number>;
    (Object.keys(FILTER_FNS) as FilterKey[]).forEach((k) => (out[k] = allSurahs.filter(FILTER_FNS[k]).length));
    return out;
  }, [allSurahs]);

  // Semua filter yang dicentang harus terpenuhi (AND), urutan tetap 1..114
  const filteredSurahs = useMemo(() => {
    let list = searchSurahs(allSurahs, searchQuery);
    activeFilters.forEach((k) => (list = list.filter(FILTER_FNS[k])));
    return list;
  }, [allSurahs, searchQuery, activeFilters]);

  const toggleFilter = (k: FilterKey) =>
    setActiveFilters((prev) => {
      const next = new Set(prev);
      if (next.has(k)) next.delete(k);
      else next.add(k);
      return next;
    });

  const handleOpenSurah = (surahNumber: number, focusAyah?: number) => {
    if (surahNumber < 1 || surahNumber > 114) return;
    setSelectedSurahNumber(surahNumber);
    setInitialAyah(focusAyah ?? null);
    if (!focusAyah) window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGoHome = () => {
    setSelectedSurahNumber(null);
    setInitialAyah(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleJumpToLastRead = () => {
    if (progress.lastRead) handleOpenSurah(progress.lastRead.surahNumber, progress.lastRead.ayahNumber);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Navbar
        progress={progress}
        onOpenTasbih={() => setIsTasbihOpen(true)}
        onGoHome={handleGoHome}
        onJumpToLastRead={handleJumpToLastRead}
      />

      <main className="flex-1">
        {selectedSurahNumber === null ? (
          <>
            <LandingHero
              allSurahs={allSurahs}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              progress={progress}
              onOpenSurah={handleOpenSurah}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
              <FilterSidebar
                active={activeFilters}
                counts={filterCounts}
                onToggle={toggleFilter}
                onReset={() => setActiveFilters(new Set())}
                resultCount={filteredSurahs.length}
              />

              <div className="space-y-6 min-w-0">
                <div className="flex items-end justify-between">
                  <h2 className="text-xl font-extrabold text-slate-900">Daftar Surat</h2>
                  <span className="text-sm font-semibold text-slate-500">Al-Fatihah (1) — An-Nas (114)</span>
                </div>
                <SurahList
                  surahs={filteredSurahs}
                  progress={progress}
                  onSelectSurah={(n) => handleOpenSurah(n)}
                  onResetSearch={() => {
                    setSearchQuery('');
                    setActiveFilters(new Set());
                  }}
                />
                <SimilarityMap allSurahs={allSurahs} onOpenSurah={handleOpenSurah} />
              </div>
            </div>
          </>
        ) : (
          <SurahDetailView
            surahNumber={selectedSurahNumber}
            initialAyah={initialAyah}
            allSurahs={allSurahs}
            progress={progress}
            onBack={handleGoHome}
            onNavigateSurah={handleOpenSurah}
            onToggleRead={toggleAyatRead}
            onSetLastRead={setLastRead}
          />
        )}
      </main>

      {isTasbihOpen && (
        <TasbihModal
          tasbih={tasbih}
          onIncrement={incrementTasbih}
          onReset={resetTasbih}
          onSelectPreset={setDhikrPreset}
          onSetTarget={setCustomTarget}
          onClose={() => setIsTasbihOpen(false)}
        />
      )}

      <Footer />
    </div>
  );
}
