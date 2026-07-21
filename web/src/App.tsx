import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, ArrowRight, ChevronRight, Sparkles
} from 'lucide-react';
import { getChapters, getChapterDetails, getVerseDetails, getRandomVerse, getGujaratiTranslation } from './services/api';
import type { Chapter, Verse } from './types';

export default function App() {
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('dark');
    localStorage.setItem('bg_theme', 'light');
  }, []);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-stone-50 text-stone-850 transition-colors duration-300">
        {/* Serene Saffron Header */}
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-orange-500/10 transition-all">
          <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center text-white shadow-md transition-all duration-300 group-hover:scale-105">
                <span className="font-serif font-bold text-lg">ॐ</span>
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-serif font-bold tracking-wider bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent leading-none">
                  श्रीमद्भगवद्गीता
                </h1>
                <p className="text-[10px] text-stone-500 uppercase tracking-widest mt-0.5">
                  Bhagavad Gita
                </p>
              </div>
            </Link>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<HomeView />} />
            <Route path="/chapter/:chapterNumber" element={<ChapterDetailsView />} />
            <Route path="/verse/:chapterNumber/:verseNumber" element={<VerseDetailsView />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

// ----------------------------------------------------
// 1. DASHBOARD HOME VIEW
// ----------------------------------------------------
function HomeView() {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [daily, setDaily] = useState<Verse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [chData, dailyVerse] = await Promise.all([
          getChapters(),
          getRandomVerse()
        ]);
        setChapters(chData);
        setDaily(dailyVerse);
        setError(null);
      } catch (err) {
        setError('Failed to connect to the scripture services. Please check your internet connection.');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-semibold text-stone-500 mt-4">Loading Adhyayans...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
        <p className="text-red-650 font-medium">{error}</p>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      {/* Daily wisdom card */}
      {daily && (
        <div className="bg-gradient-to-tr from-amber-500/10 to-orange-500/10 border border-orange-500/20 rounded-3xl p-6 md:p-8 relative overflow-hidden">
          <div className="flex items-center space-x-2 text-orange-600 mb-4 font-bold text-xs uppercase tracking-wider">
            <Sparkles size={16} />
            <span>Daily Shloka • Ch {daily.chapter}, Verse {daily.verse}</span>
          </div>
          <p className="text-xl md:text-2xl font-serif text-center text-orange-800 leading-relaxed mb-4 whitespace-pre-line">
            {daily.slok}
          </p>
          <p className="text-sm font-medium text-stone-600 mb-6 border-t border-orange-500/10 pt-4">
            {daily.rams?.ht || daily.tej?.ht || 'No translation.'}
          </p>
          <div className="flex justify-end">
            <Link 
              to={`/verse/${daily.chapter}/${daily.verse}`}
              className="text-sm font-bold text-orange-600 hover:text-orange-700 flex items-center space-x-1"
            >
              <span>Study Shloka</span>
              <ChevronRight size={16} />
            </Link>
          </div>
        </div>
      )}

      {/* Chapters header */}
      <h2 className="text-2xl font-serif font-bold text-stone-850 border-b border-orange-500/10 pb-3">
        The 18 Chapters (अध्याय)
      </h2>

      {/* Chapters list */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {chapters.map((ch) => (
          <Link
            key={ch.chapter_number}
            to={`/chapter/${ch.chapter_number}`}
            className="group block p-5 bg-white border border-stone-200/60 rounded-2xl hover:border-orange-500/40 hover:shadow-lg transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-orange-100 text-orange-600 uppercase tracking-wide">
                Adhyay {ch.chapter_number}
              </span>
              <span className="text-xs text-stone-500">
                {ch.verses_count} Verses
              </span>
            </div>
            <h3 className="text-lg font-serif font-bold text-stone-850 group-hover:text-orange-600 transition-colors">
              {ch.name}
            </h3>
            <p className="text-xs text-orange-600 font-serif italic mb-2">
              {ch.transliteration}
            </p>
            <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
              {ch.meaning.en} • {ch.meaning.hi}
            </p>
          </Link>
        ))}
      </div>
    </motion.div>
  );
}

// ----------------------------------------------------
// 2. CHAPTER DETAILS VIEW
// ----------------------------------------------------
function ChapterDetailsView() {
  const { chapterNumber } = useParams<{ chapterNumber: string }>();
  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const chNum = parseInt(chapterNumber || '1');

  useEffect(() => {
    async function loadChapter() {
      try {
        setLoading(true);
        const data = await getChapterDetails(chNum);
        setChapter(data);
        setError(null);
      } catch (err) {
        setError('Failed to load chapter details.');
      } finally {
        setLoading(false);
      }
    }
    loadChapter();
  }, [chNum]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !chapter) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
        <p className="text-red-650 font-medium">{error || 'Chapter not found.'}</p>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      {/* Back to all chapters */}
      <button 
        onClick={() => navigate('/')} 
        className="flex items-center space-x-2 text-sm font-bold text-orange-600 hover:text-orange-700 transition-colors"
      >
        <ArrowLeft size={16} />
        <span>All Chapters</span>
      </button>

      {/* Chapter header */}
      <div className="bg-white border border-stone-200/60 rounded-3xl p-6 md:p-8">
        <span className="text-xs font-bold text-orange-600 uppercase tracking-widest">
          Adhyay {chapter.chapter_number}
        </span>
        <h2 className="text-2xl md:text-3xl font-serif font-bold text-stone-850 my-2">
          {chapter.name}
        </h2>
        <p className="text-sm font-serif italic text-orange-600 mb-4">
          {chapter.transliteration}
        </p>
        <p className="text-base font-bold text-stone-850 mb-3">
          {chapter.meaning.en} • {chapter.meaning.hi}
        </p>
        <p className="text-sm text-stone-600 leading-relaxed border-t border-orange-500/10 pt-4">
          {chapter.summary.en}
        </p>
      </div>

      {/* Verses grid */}
      <div>
        <h3 className="text-lg font-bold text-stone-850 border-b border-orange-500/10 pb-2 mb-4">
          Select Shloka ({chapter.verses_count} Verses)
        </h3>
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3">
          {Array.from({ length: chapter.verses_count }, (_, index) => {
            const verseNum = index + 1;
            return (
              <Link
                key={verseNum}
                to={`/verse/${chapter.chapter_number}/${verseNum}`}
                className="flex items-center justify-center p-3.5 bg-white border border-stone-200/60 rounded-xl font-bold hover:border-orange-500 hover:text-orange-600 hover:shadow transition-all text-center"
              >
                {verseNum}
              </Link>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}

// ----------------------------------------------------
// 3. VERSE DETAILS VIEW
// ----------------------------------------------------
function VerseDetailsView() {
  const { chapterNumber, verseNumber } = useParams<{ chapterNumber: string, verseNumber: string }>();
  const [verse, setVerse] = useState<Verse | null>(null);
  const [gujarati, setGujarati] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [loadingGu, setLoadingGu] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const chNum = parseInt(chapterNumber || '1');
  const vNum = parseInt(verseNumber || '1');

  useEffect(() => {
    async function loadVerse() {
      try {
        setLoading(true);
        const data = await getVerseDetails(chNum, vNum);
        setVerse(data);
        setError(null);

        // Fetch dynamic Gujarati translation of the Gitapress Hindi text
        const hindiText = data.rams?.ht || data.tej?.ht || '';
        if (hindiText) {
          setLoadingGu(true);
          const guTranslation = await getGujaratiTranslation(chNum, vNum, hindiText);
          setGujarati(guTranslation);
          setLoadingGu(false);
        } else {
          setGujarati('અનુવાદ ઉપલબ્ધ નથી.');
        }
      } catch (err) {
        setError('Failed to load verse.');
      } finally {
        setLoading(false);
      }
    }
    loadVerse();
  }, [chNum, vNum]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !verse) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
        <p className="text-red-650 font-medium">{error || 'Verse not found.'}</p>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      {/* Back button */}
      <button 
        onClick={() => navigate(`/chapter/${chNum}`)} 
        className="flex items-center space-x-2 text-sm font-bold text-orange-600 hover:text-orange-700 transition-colors"
      >
        <ArrowLeft size={16} />
        <span>Chapter {chNum}</span>
      </button>

      {/* Shloka box */}
      <div className="bg-white border border-stone-200/60 rounded-3xl p-6 md:p-8 text-center shadow-sm">
        <span className="text-xs font-bold text-orange-600 uppercase tracking-widest">
          Chapter {chNum}, Verse {vNum}
        </span>
        <p className="text-2xl md:text-3xl font-serif text-orange-800 leading-relaxed my-6 font-bold whitespace-pre-line">
          {verse.slok}
        </p>
        <p className="text-sm font-medium text-stone-500 border-t border-orange-500/10 pt-4 italic whitespace-pre-line">
          {verse.transliteration}
        </p>
      </div>

      {/* Translations List */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-stone-850 border-b border-orange-500/10 pb-2">
          Translations (अनुवाद)
        </h3>

        {/* Hindi Gitapress */}
        <div className="bg-white border border-stone-200/60 rounded-2xl p-5 shadow-sm">
          <div className="text-[10px] font-bold uppercase tracking-wider text-orange-600 mb-2">
            Hindi (Gita Press / स्वामी रामसुखदास)
          </div>
          <p className="text-base text-stone-850 leading-relaxed">
            {verse.rams?.ht || 'अनुवाद उपलब्ध नहीं है।'}
          </p>
        </div>

        {/* Gujarati MyMemory */}
        <div className="bg-white border border-stone-200/60 rounded-2xl p-5 shadow-sm">
          <div className="text-[10px] font-bold uppercase tracking-wider text-orange-600 mb-2">
            Gujarati (ગુજરાતી અનુવાદ)
          </div>
          {loadingGu ? (
            <div className="flex items-center space-x-2 py-2">
              <div className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-xs text-stone-500">translating...</span>
            </div>
          ) : (
            <p className="text-base text-stone-850 leading-relaxed">
              {gujarati}
            </p>
          )}
        </div>

        {/* English */}
        <div className="bg-white border border-stone-200/60 rounded-2xl p-5 shadow-sm">
          <div className="text-[10px] font-bold uppercase tracking-wider text-orange-600 mb-2">
            English (Swami Sivananda)
          </div>
          <p className="text-base text-stone-850 leading-relaxed">
            {verse.siva?.et || verse.prabhu?.et || 'Translation not available.'}
          </p>
        </div>
      </div>

      {/* Prev / Next navigation */}
      <div className="flex items-center justify-between pt-6 border-t border-orange-500/10">
        <button
          onClick={() => navigate(`/verse/${chNum}/${vNum - 1}`)}
          disabled={vNum === 1}
          className="flex items-center space-x-2 text-sm font-bold text-orange-600 disabled:opacity-30 disabled:pointer-events-none hover:text-orange-700"
        >
          <ArrowLeft size={16} />
          <span>Previous Verse</span>
        </button>

        <span className="text-xs font-bold text-stone-500">
          Verse {vNum}
        </span>

        <button
          onClick={() => navigate(`/verse/${chNum}/${vNum + 1}`)}
          className="flex items-center space-x-2 text-sm font-bold text-orange-600 disabled:opacity-30 disabled:pointer-events-none hover:text-orange-700"
        >
          <span>Next Verse</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </motion.div>
  );
}
