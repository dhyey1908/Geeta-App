import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, Text, View, ScrollView, TouchableOpacity, 
  ActivityIndicator, SafeAreaView, StatusBar, BackHandler, 
  Platform
} from 'react-native';
import { 
  ArrowLeft, ArrowRight, Sparkles, ChevronRight
} from 'lucide-react-native';
import { getChapters, getChapterDetails, getVerseDetails, getRandomVerse, getGujaratiTranslation } from './services/api';
import type { Chapter, Verse } from './types';
import AsyncStorage from '@react-native-async-storage/async-storage';

const slokCounts = [
  47, 72, 43, 42, 29, 47, 30, 28, 34, 42, 55, 20, 35, 27, 20, 24, 28, 78
];

export default function App() {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Navigation History
  const [currentScreen, setCurrentScreen] = useState<{ name: string; params?: any }>({ name: 'Home' });
  const [screenHistory, setScreenHistory] = useState<any[]>([]);

  const navigateTo = (screenName: string, params?: any) => {
    setScreenHistory(prev => [...prev, currentScreen]);
    setCurrentScreen({ name: screenName, params });
  };

  const navigateBack = () => {
    if (screenHistory.length > 0) {
      const prev = screenHistory[screenHistory.length - 1];
      setScreenHistory(prevHistory => prevHistory.slice(0, -1));
      setCurrentScreen(prev);
      return true;
    }
    return false;
  };

  // Hardware Back Press on Android
  useEffect(() => {
    const onBackPress = () => {
      return navigateBack();
    };
    const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => subscription.remove();
  }, [screenHistory, currentScreen]);

  // Load Initial Theme & Gita Data
  useEffect(() => {
    async function init() {
      try {
        setLoading(true);
        await AsyncStorage.setItem('bg_theme', 'light');
        const data = await getChapters();
        setChapters(data);
        setError(null);
      } catch (err) {
        setError('Failed to connect to the scripture services. Please check your internet connection.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  const isDark = false;
  
  const colors = {
    primary: "#F8F9FA",
    primaryDark: "#E2E8F0",
    secondary: "#F1F5F9",
    accent: "#F4A261",
    background: isDark ? '#111827' : '#FFFFFF',
    surface: isDark ? '#1f2937' : '#FAFAFA',
    muted: isDark ? '#1f2937' : '#F1F5F9',
    text: isDark ? '#F3F4F6' : '#111827',
    textSecondary: isDark ? '#9CA3AF' : '#6B7280',
    border: isDark ? '#374151' : '#E2E8F0',
  };

  const themeStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    card: {
      backgroundColor: colors.surface,
      borderColor: colors.border,
      borderWidth: 1,
      borderRadius: 16,
      padding: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDark ? 0.3 : 0.05,
      shadowRadius: 4,
      elevation: 2,
    },
    text: {
      color: colors.text,
      fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
      fontSize: 14,
    },
    header: {
      color: colors.text,
      fontWeight: 'bold',
      fontSize: 16,
    },
    titleSerif: {
      color: isDark ? colors.accent : colors.text,
      fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
      fontWeight: '600',
    }
  });

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background }}>
        <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={colors.background} />
        <ActivityIndicator size="large" color={colors.accent} />
        <Text style={[themeStyles.text, { marginTop: 12, fontSize: 16, fontWeight: 'bold' }]}>
          Loading Shrimad Bhagavad Gita...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, backgroundColor: colors.background }}>
        <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={colors.background} />
        <View style={[themeStyles.card, { alignItems: 'center', padding: 24 }]}>
          <Text style={[themeStyles.header, { fontSize: 20, marginVertical: 12 }]}>Connection Offline</Text>
          <Text style={[themeStyles.text, { textAlign: 'center', marginBottom: 20 }]}>{error}</Text>
        </View>
      </View>
    );
  }

  const renderScreen = () => {
    switch (currentScreen.name) {
      case 'Home':
        return (
          <HomeScreen 
            chapters={chapters} 
            navigateTo={navigateTo} 
            colors={colors}
            themeStyles={themeStyles}
            isDark={isDark}
          />
        );
      case 'ChapterDetails':
        return (
          <ChapterDetailsScreen 
            chapterNum={currentScreen.params?.chapterNumber} 
            navigateTo={navigateTo} 
            navigateBack={navigateBack}
            colors={colors}
            themeStyles={themeStyles}
            isDark={isDark}
          />
        );
      case 'VerseDetails':
        return (
          <VerseDetailsScreen 
            chapterNum={currentScreen.params?.chapterNumber}
            verseNum={currentScreen.params?.verseNumber}
            navigateTo={navigateTo}
            navigateBack={navigateBack}
            colors={colors}
            themeStyles={themeStyles}
            isDark={isDark}
          />
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={themeStyles.container}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={colors.background} />
      
      {/* Header Bar */}
      <View 
        style={{ 
          height: 60, 
          flexDirection: 'row', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          paddingHorizontal: 16,
          backgroundColor: colors.surface,
          borderBottomWidth: 1,
          borderBottomColor: colors.border
        }}
      >
        <TouchableOpacity onPress={() => { setScreenHistory([]); setCurrentScreen({ name: 'Home' }); }} style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center', marginRight: 8 }}>
            <Text style={{ color: '#fff', fontSize: 14, fontWeight: 'bold' }}>ॐ</Text>
          </View>
          <Text style={[themeStyles.titleSerif, { fontSize: 18, fontWeight: 'bold' }]}>શ્રીમદ્ ભગવદ્ ગીતા</Text>
        </TouchableOpacity>

        <View />
      </View>

      <View style={{ flex: 1 }}>
        {renderScreen()}
      </View>
    </SafeAreaView>
  );
}

// ----------------------------------------------------
// 1. HOME SCREEN
// ----------------------------------------------------
function HomeScreen({ chapters, navigateTo, colors, themeStyles, isDark }: any) {
  const [daily, setDaily] = useState<Verse | null>(null);
  const [loadingDaily, setLoadingDaily] = useState(true);

  useEffect(() => {
    async function loadDaily() {
      try {
        setLoadingDaily(true);
        const verse = await getRandomVerse();
        setDaily(verse);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingDaily(false);
      }
    }
    loadDaily();
  }, []);

  return (
    <ScrollView style={{ flex: 1, padding: 16 }} showsVerticalScrollIndicator={false}>
      {/* Daily Quote */}
      <View style={[themeStyles.card, { marginBottom: 24, borderColor: colors.accent + '30', borderStyle: 'solid' }]}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomColor: colors.border, borderBottomWidth: 1, paddingBottom: 8, marginBottom: 10 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Sparkles size={16} color={colors.accent} style={{ marginRight: 6 }} />
            <Text style={[themeStyles.header, { fontSize: 14, color: colors.accent }]}>Daily Shloka</Text>
          </View>
          {daily && (
            <Text style={{ color: colors.accent, fontWeight: 'bold', fontSize: 11 }}>
              Ch {daily.chapter}, Verse {daily.verse}
            </Text>
          )}
        </View>

        {loadingDaily ? (
          <ActivityIndicator size="small" color={colors.accent} style={{ marginVertical: 20 }} />
        ) : daily ? (
          <View>
            <Text 
              style={[
                themeStyles.titleSerif, 
                { fontSize: 18, textAlign: 'center', lineHeight: 28, marginVertical: 8, color: colors.accent }
              ]}
            >
              {daily.slok}
            </Text>
            <Text style={[themeStyles.text, { fontSize: 13, lineHeight: 18, borderTopColor: colors.border, borderTopWidth: 1, paddingTop: 10 }]}>
              {daily.rams?.ht || daily.tej?.ht || 'No translation available.'}
            </Text>
            <TouchableOpacity 
              onPress={() => navigateTo('VerseDetails', { chapterNumber: daily.chapter, verseNumber: daily.verse })}
              style={{ marginTop: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}
            >
              <Text style={{ color: colors.accent, fontWeight: 'bold', fontSize: 13 }}>Study Shloka </Text>
              <ChevronRight size={14} color={colors.accent} />
            </TouchableOpacity>
          </View>
        ) : (
          <Text style={themeStyles.text}>Could not load daily verse.</Text>
        )}
      </View>

      {/* Chapters Header */}
      <Text style={[themeStyles.header, { fontSize: 18, marginBottom: 12, fontWeight: 'bold' }]}>The 18 Chapters</Text>

      {/* Chapters List */}
      {chapters.map((ch: Chapter) => (
        <TouchableOpacity
          key={ch.chapter_number}
          onPress={() => navigateTo('ChapterDetails', { chapterNumber: ch.chapter_number })}
          style={[themeStyles.card, { marginBottom: 12 }]}
        >
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{ backgroundColor: colors.accent, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4, marginRight: 8 }}>
                <Text style={{ color: '#fff', fontSize: 10, fontWeight: 'bold' }}>CH {ch.chapter_number}</Text>
              </View>
              <Text style={[themeStyles.text, { fontSize: 11, color: colors.textSecondary }]}>{ch.verses_count} Verses</Text>
            </View>
            <ChevronRight size={16} color={colors.accent} />
          </View>
          <Text style={[themeStyles.header, { fontSize: 16 }]}>{ch.name}</Text>
          <Text style={[themeStyles.text, { fontSize: 12, color: colors.accent, fontStyle: 'italic', marginBottom: 4 }]}>{ch.transliteration}</Text>
          <Text style={[themeStyles.text, { fontSize: 12, color: colors.textSecondary }]} numberOfLines={2}>{ch.meaning.en} • {ch.meaning.hi}</Text>
        </TouchableOpacity>
      ))}
      <View style={{ height: 32 }} />
    </ScrollView>
  );
}

// ----------------------------------------------------
// 2. CHAPTER DETAILS SCREEN
// ----------------------------------------------------
function ChapterDetailsScreen({ chapterNum, navigateTo, navigateBack, colors, themeStyles, isDark }: any) {
  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const data = await getChapterDetails(chapterNum);
        setChapter(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [chapterNum]);

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="small" color={colors.accent} />
      </View>
    );
  }

  if (!chapter) {
    return <Text style={themeStyles.text}>Chapter not found</Text>;
  }

  return (
    <ScrollView style={{ flex: 1, padding: 16 }} showsVerticalScrollIndicator={false}>
      <TouchableOpacity onPress={navigateBack} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
        <ArrowLeft size={16} color={colors.accent} style={{ marginRight: 6 }} />
        <Text style={{ color: colors.accent, fontWeight: 'bold' }}>All Chapters</Text>
      </TouchableOpacity>

      <View style={[themeStyles.card, { padding: 20, marginBottom: 20 }]}>
        <Text style={{ color: colors.accent, fontSize: 11, fontWeight: 'bold', textTransform: 'uppercase' }}>Chapter {chapter.chapter_number}</Text>
        <Text style={[themeStyles.header, { fontSize: 22, marginVertical: 4 }]}>{chapter.name}</Text>
        <Text style={[themeStyles.text, { fontSize: 12, color: colors.accent, fontStyle: 'italic', marginBottom: 8 }]}>{chapter.transliteration}</Text>
        <Text style={[themeStyles.header, { fontSize: 14, marginBottom: 12 }]}>{chapter.meaning.en} • {chapter.meaning.hi}</Text>
        <Text style={[themeStyles.text, { fontSize: 13, lineHeight: 18, borderTopWidth: 1, borderTopColor: colors.border, paddingTop: 10, color: colors.textSecondary }]}>
          {chapter.summary.en}
        </Text>
      </View>

      <View style={{ borderBottomColor: colors.border, borderBottomWidth: 1, paddingBottom: 8, marginBottom: 12 }}>
        <Text style={[themeStyles.header, { fontSize: 16 }]}>Select Verse ({chapter.verses_count} Verses)</Text>
      </View>

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
        {Array.from({ length: chapter.verses_count }, (_, index) => {
          const verseNum = index + 1;
          return (
            <TouchableOpacity
              key={verseNum}
              onPress={() => navigateTo('VerseDetails', { chapterNumber: chapterNum, verseNumber: verseNum })}
              style={[
                themeStyles.card, 
                { 
                  width: '23%', 
                  marginBottom: 10, 
                  alignItems: 'center',
                  paddingVertical: 12,
                }
              ]}
            >
              <Text style={{ color: colors.accent, fontWeight: 'bold', fontSize: 14 }}>
                {verseNum}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
      <View style={{ height: 32 }} />
    </ScrollView>
  );
}

// ----------------------------------------------------
// 3. VERSE DETAILS SCREEN
// ----------------------------------------------------
function VerseDetailsScreen({ chapterNum, verseNum, navigateTo, navigateBack, colors, themeStyles, isDark }: any) {
  const [verse, setVerse] = useState<Verse | null>(null);
  const [gujarati, setGujarati] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [loadingGu, setLoadingGu] = useState(false);

  const totalVerses = slokCounts[chapterNum - 1];

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const data = await getVerseDetails(chapterNum, verseNum);
        setVerse(data);

        // Translate dynamic Gujarati on the fly
        const hindiText = data.rams?.ht || data.tej?.ht || '';
        if (hindiText) {
          setLoadingGu(true);
          const guTranslation = await getGujaratiTranslation(chapterNum, verseNum, hindiText);
          setGujarati(guTranslation);
          setLoadingGu(false);
        } else {
          setGujarati('અનુવાદ ઉપલબ્ધ નથી.');
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [chapterNum, verseNum]);

  if (loading && !verse) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="small" color={colors.accent} />
      </View>
    );
  }

  if (!verse) {
    return <Text style={themeStyles.text}>Verse not found</Text>;
  }

  return (
    <ScrollView style={{ flex: 1, padding: 16 }} showsVerticalScrollIndicator={false}>
      {/* Toolbar */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <TouchableOpacity onPress={navigateBack} style={{ flexDirection: 'row', alignItems: 'center' }}>
          <ArrowLeft size={16} color={colors.accent} style={{ marginRight: 6 }} />
          <Text style={{ color: colors.accent, fontWeight: 'bold' }}>Chapter {chapterNum}</Text>
        </TouchableOpacity>
        <Text style={{ color: colors.accent, fontWeight: 'bold', fontSize: 13 }}>
          Verse {verseNum} of {totalVerses}
        </Text>
      </View>

      {/* Shloka Box */}
      <View style={[themeStyles.card, { padding: 20, alignItems: 'center', marginBottom: 20 }]}>
        <Text style={{ color: colors.accent, fontSize: 11, fontWeight: 'bold' }}>VERSE {chapterNum}.{verseNum}</Text>
        <Text 
          style={[
            themeStyles.titleSerif, 
            { fontSize: 20, textAlign: 'center', lineHeight: 30, marginVertical: 14, color: colors.accent }
          ]}
        >
          {verse.slok}
        </Text>
        <Text style={[themeStyles.text, { fontSize: 12, textAlign: 'center', fontStyle: 'italic', borderTopColor: colors.border, borderTopWidth: 1, paddingTop: 10, color: colors.textSecondary, width: '100%' }]}>
          {verse.transliteration}
        </Text>
      </View>

      {/* Translations List */}
      <View>
        <Text style={[themeStyles.header, { fontSize: 16, marginBottom: 10, fontWeight: 'bold' }]}>Translations</Text>

        {/* Hindi (Gitapress) */}
        <View style={[themeStyles.card, { marginBottom: 12 }]}>
          <Text style={{ fontSize: 10, color: colors.accent, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>
            Hindi (Gita Press / स्वामी रामसुखदास)
          </Text>
          <Text style={[themeStyles.text, { fontSize: 14, lineHeight: 20 }]}>
            {verse.rams?.ht || 'अनुवाद उपलब्ध नहीं है।'}
          </Text>
        </View>

        {/* Gujarati */}
        <View style={[themeStyles.card, { marginBottom: 12 }]}>
          <Text style={{ fontSize: 10, color: colors.accent, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>
            Gujarati (ગુજરાતી અનુવાદ)
          </Text>
          {loadingGu ? (
            <ActivityIndicator size="small" color={colors.accent} style={{ alignSelf: 'flex-start', marginVertical: 4 }} />
          ) : (
            <Text style={[themeStyles.text, { fontSize: 14, lineHeight: 20 }]}>
              {gujarati}
            </Text>
          )}
        </View>

        {/* English */}
        <View style={[themeStyles.card, { marginBottom: 12 }]}>
          <Text style={{ fontSize: 10, color: colors.accent, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>
            English (Swami Sivananda)
          </Text>
          <Text style={[themeStyles.text, { fontSize: 14, lineHeight: 20 }]}>
            {verse.siva?.et || verse.prabhu?.et || 'Translation not available.'}
          </Text>
        </View>
      </View>

      {/* Prev / Next buttons */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 24, borderTopWidth: 1, borderTopColor: colors.border, paddingTop: 16, marginBottom: 32 }}>
        <TouchableOpacity 
          disabled={verseNum === 1}
          onPress={() => navigateTo('VerseDetails', { chapterNumber: chapterNum, verseNumber: verseNum - 1 })}
          style={{ flexDirection: 'row', alignItems: 'center', opacity: verseNum === 1 ? 0.3 : 1 }}
        >
          <ArrowLeft size={14} color={colors.accent} style={{ marginRight: 4 }} />
          <Text style={{ color: colors.accent, fontSize: 13, fontWeight: 'bold' }}>Prev Verse</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          disabled={verseNum === totalVerses}
          onPress={() => navigateTo('VerseDetails', { chapterNumber: chapterNum, verseNumber: verseNum + 1 })}
          style={{ flexDirection: 'row', alignItems: 'center', opacity: verseNum === totalVerses ? 0.3 : 1 }}
        >
          <Text style={{ color: colors.accent, fontSize: 13, fontWeight: 'bold' }}>Next Verse</Text>
          <ArrowRight size={14} color={colors.accent} style={{ marginLeft: 4 }} />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
