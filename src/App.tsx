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
import { getAllSurahs, searchSurahs } from './utils/quranApi';
import { useQuranStorage } from './hooks/useQuranStorage';

export default function App() {
  const allSurahs = useMemo(() => getAllSurahs(), []);

  // Application view state: null = landing page, number = viewing specific surah
  const [selectedSurahNumber, setSelectedSurahNumber] = useState<number | null>(null);

  // Search & filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'Makkiyah' | 'Madaniyah' | 'juz30'>('all');

  // Tasbih Modal state
  const [isTasbihOpen, setIsTasbihOpen] = useState(false);

  // Persistent reading progress & tasbih storage
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

  // Filtered surahs for the landing page grid
  const filteredSurahs = useMemo(() => {
    return searchSurahs(allSurahs, searchQuery, activeFilter);
  }, [allSurahs, searchQuery, activeFilter]);

  // Navigate to specific surah
  const handleOpenSurah = (surahNumber: number) => {
    setSelectedSurahNumber(surahNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Return to landing page
  const handleGoHome = () => {
    setSelectedSurahNumber(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Jump to last read surah & verse
  const handleJumpToLastRead = () => {
    if (progress.lastRead) {
      setSelectedSurahNumber(progress.lastRead.surahNumber);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F5] text-stone-900 selection:bg-pink-100 selection:text-purple-900">
      {/* Navigation Top Bar */}
      <Navbar
        progress={progress}
        onOpenTasbih={() => setIsTasbihOpen(true)}
        onGoHome={handleGoHome}
        onJumpToLastRead={handleJumpToLastRead}
      />

      <main className="flex-1">
        {selectedSurahNumber === null ? (
          /* Landing Page View */
          <>
            <LandingHero
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              activeFilter={activeFilter}
              onFilterChange={setActiveFilter}
              filteredCount={filteredSurahs.length}
              progress={progress}
              onJumpToLastRead={handleJumpToLastRead}
              onQuickJumpSurah={handleOpenSurah}
            />

            <SurahList
              surahs={filteredSurahs}
              progress={progress}
              onSelectSurah={handleOpenSurah}
              onResetSearch={() => {
                setSearchQuery('');
                setActiveFilter('all');
              }}
            />
          </>
        ) : (
          /* Individual Surah Ayat Page View */
          <SurahDetailView
            surahNumber={selectedSurahNumber}
            progress={progress}
            onBack={handleGoHome}
            onNavigateSurah={handleOpenSurah}
            onToggleRead={toggleAyatRead}
            onSetLastRead={setLastRead}
          />
        )}
      </main>

      {/* Digital Tasbih & Counter Modal */}
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

      {/* Editorial Footer */}
      <Footer
        onQuickJumpSurah={handleOpenSurah}
        onOpenTasbih={() => setIsTasbihOpen(true)}
      />
    </div>
  );
}
