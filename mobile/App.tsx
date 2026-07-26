import React, { useState, useEffect, useRef } from 'react';
import { 
  StyleSheet, Text, View, ScrollView, TouchableOpacity, 
  SafeAreaView, StatusBar, BackHandler, Platform, PanResponder, 
  Animated
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

// ----------------------------------------------------
// SKELETON PLACEHOLDER WIDGET
// ----------------------------------------------------
function SkeletonPlaceholder({ width, height, borderRadius = 8, style }: any) {
  const opacity = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.8,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.4,
          duration: 800,
          useNativeDriver: true,
        })
      ])
    ).start();
  }, []);

  return (
    <Animated.View 
      style={[
        {
          width: width,
          height: height,
          borderRadius: borderRadius,
          backgroundColor: '#E2E8F0', // light gray skeleton color
          opacity: opacity,
        },
        style
      ]}
    />
  );
}

// ----------------------------------------------------
// PAGE SKELETON LOADERS
// ----------------------------------------------------
function HomeSkeleton({ colors }: any) {
  return (
    <ScrollView style={{ flex: 1, padding: 16 }} showsVerticalScrollIndicator={false}>
      {/* Daily Quote Card Skeleton */}
      <View style={{ backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, borderRadius: 16, padding: 16, marginBottom: 24 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 }}>
          <SkeletonPlaceholder width={100} height={16} />
          <SkeletonPlaceholder width={80} height={16} />
        </View>
        <SkeletonPlaceholder width="90%" height={20} style={{ alignSelf: 'center', marginBottom: 8 }} />
        <SkeletonPlaceholder width="75%" height={20} style={{ alignSelf: 'center', marginBottom: 16 }} />
        <View style={{ borderTopWidth: 1, borderTopColor: colors.border, paddingTop: 12, flexDirection: 'row', justifyContent: 'space-between' }}>
          <SkeletonPlaceholder width="60%" height={14} />
          <SkeletonPlaceholder width={70} height={14} />
        </View>
      </View>

      {/* Title Skeleton */}
      <SkeletonPlaceholder width={150} height={20} style={{ marginBottom: 16 }} />

      {/* Chapters list skeleton (3 items) */}
      {[1, 2, 3].map((i) => (
        <View key={i} style={{ backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, borderRadius: 16, padding: 16, marginBottom: 12 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
            <SkeletonPlaceholder width={60} height={16} />
            <SkeletonPlaceholder width={40} height={16} />
          </View>
          <SkeletonPlaceholder width={140} height={18} style={{ marginBottom: 8 }} />
          <SkeletonPlaceholder width={100} height={14} style={{ marginBottom: 12 }} />
          <SkeletonPlaceholder width="95%" height={14} style={{ marginBottom: 6 }} />
          <SkeletonPlaceholder width="80%" height={14} />
        </View>
      ))}
    </ScrollView>
  );
}

function ChapterSkeleton({ colors }: any) {
  return (
    <ScrollView style={{ flex: 1, padding: 16 }} showsVerticalScrollIndicator={false}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
        <SkeletonPlaceholder width={100} height={16} />
      </View>
      
      <View style={{ backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, borderRadius: 16, padding: 20, marginBottom: 20 }}>
        <SkeletonPlaceholder width={70} height={12} style={{ marginBottom: 8 }} />
        <SkeletonPlaceholder width={200} height={24} style={{ marginBottom: 8 }} />
        <SkeletonPlaceholder width={120} height={14} style={{ marginBottom: 12 }} />
        <SkeletonPlaceholder width="100%" height={14} style={{ marginBottom: 6 }} />
        <SkeletonPlaceholder width="95%" height={14} style={{ marginBottom: 6 }} />
        <SkeletonPlaceholder width="80%" height={14} />
      </View>

      <SkeletonPlaceholder width={180} height={18} style={{ marginBottom: 16 }} />

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
        {Array.from({ length: 16 }).map((_, index) => (
          <View key={index} style={{ width: '23%', marginBottom: 10 }}>
            <SkeletonPlaceholder width="100%" height={48} borderRadius={16} />
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

function VerseSkeleton({ colors }: any) {
  return (
    <ScrollView style={{ flex: 1, padding: 16 }} showsVerticalScrollIndicator={false}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <SkeletonPlaceholder width={90} height={16} />
        <SkeletonPlaceholder width={110} height={16} />
      </View>

      {/* Shloka Card Skeleton */}
      <View style={{ backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, borderRadius: 16, padding: 20, alignItems: 'center', marginBottom: 24 }}>
        <SkeletonPlaceholder width={80} height={12} style={{ marginBottom: 16 }} />
        <SkeletonPlaceholder width="85%" height={22} style={{ marginBottom: 8 }} />
        <SkeletonPlaceholder width="90%" height={22} style={{ marginBottom: 8 }} />
        <SkeletonPlaceholder width="65%" height={22} style={{ marginBottom: 20 }} />
        <SkeletonPlaceholder width="100%" height={14} style={{ borderTopWidth: 1, borderTopColor: colors.border, paddingTop: 14 }} />
      </View>

      <SkeletonPlaceholder width={100} height={18} style={{ marginBottom: 14 }} />

      {/* 3 Translation Cards */}
      {[1, 2, 3].map((i) => (
        <View key={i} style={{ backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, borderRadius: 16, padding: 16, marginBottom: 16 }}>
          <SkeletonPlaceholder width={140} height={12} style={{ marginBottom: 10 }} />
          <SkeletonPlaceholder width="95%" height={14} style={{ marginBottom: 6 }} />
          <SkeletonPlaceholder width="80%" height={14} />
        </View>
      ))}
    </ScrollView>
  );
}

// ----------------------------------------------------
// MAIN APP COMPONENT
// ----------------------------------------------------
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

  // Load Gita Data and enforce light theme
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
    accent: "#F4A261", // Saffron / Gold
    background: "#FFFFFF",
    surface: "#FAFAFA",
    muted: "#F1F5F9",
    text: "#111827", // Near black text
    textSecondary: "#6B7280",
    border: "#E2E8F0",
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
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2,
    },
    text: {
      color: colors.text,
      fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
      fontSize: 15,
      lineHeight: 22,
    },
    header: {
      color: colors.text,
      fontWeight: 'bold',
      fontSize: 17,
    },
    titleSerif: {
      color: colors.text,
      fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
      fontWeight: '600',
    }
  });

  const renderScreen = () => {
    switch (currentScreen.name) {
      case 'Home':
        return (
          <HomeScreen 
            chapters={chapters} 
            navigateTo={navigateTo} 
            colors={colors}
            themeStyles={themeStyles}
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
          />
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={themeStyles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.surface} />
      
      {/* Header Bar */}
      <View 
        style={{ 
          paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 12 : 16,
          paddingBottom: 16,
          flexDirection: 'row', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          paddingHorizontal: 16,
          backgroundColor: colors.surface,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
          zIndex: 10,
        }}
      >
        <TouchableOpacity 
          onPress={() => { setScreenHistory([]); setCurrentScreen({ name: 'Home' }); }} 
          style={{ flexDirection: 'row', alignItems: 'center', minHeight: 48 }}
        >
          <View 
            style={{ 
              width: 36, 
              height: 36, 
              borderRadius: 18, 
              backgroundColor: colors.accent, 
              alignItems: 'center', 
              justifyContent: 'center', 
              marginRight: 10,
              borderWidth: 1,
              borderColor: '#FFFFFF',
            }}
          >
            <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' }}>ॐ</Text>
          </View>
          <Text style={[themeStyles.titleSerif, { fontSize: 20, fontWeight: 'bold' }]}>Geeta Slok</Text>
        </TouchableOpacity>
        
        {/* Placeholder to balance row layout alignment */}
        <View style={{ width: 36 }} />
      </View>

      <View style={{ flex: 1 }}>
        {loading ? (
          <HomeSkeleton colors={colors} />
        ) : error ? (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, backgroundColor: colors.background }}>
            <View style={[themeStyles.card, { alignItems: 'center', padding: 24 }]}>
              <Text style={[themeStyles.header, { fontSize: 20, marginVertical: 12 }]}>Connection Offline</Text>
              <Text style={[themeStyles.text, { textAlign: 'center', marginBottom: 20 }]}>{error}</Text>
            </View>
          </View>
        ) : (
          renderScreen()
        )}
      </View>
    </SafeAreaView>
  );
}

// ----------------------------------------------------
// 1. HOME SCREEN
// ----------------------------------------------------
function HomeScreen({ chapters, navigateTo, colors, themeStyles }: any) {
  const [daily, setDaily] = useState<Verse | null>(null);
  const [loadingDaily, setLoadingDaily] = useState(true);
  
  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    async function loadDaily() {
      try {
        setLoadingDaily(true);
        const verse = await getRandomVerse();
        setDaily(verse);
        
        // Trigger fade animation
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }).start();
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
      <View style={[themeStyles.card, { marginBottom: 24, borderColor: colors.accent + '40' }]}>
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
          <View style={{ paddingVertical: 10 }}>
            <SkeletonPlaceholder width="85%" height={18} style={{ alignSelf: 'center', marginBottom: 8 }} />
            <SkeletonPlaceholder width="60%" height={18} style={{ alignSelf: 'center', marginBottom: 16 }} />
            <SkeletonPlaceholder width="100%" height={14} style={{ borderTopWidth: 1, borderTopColor: colors.border, paddingTop: 10, marginTop: 10 }} />
          </View>
        ) : daily ? (
          <Animated.View style={{ opacity: fadeAnim }}>
            <Text 
              style={[
                themeStyles.titleSerif, 
                { fontSize: 18, textAlign: 'center', lineHeight: 28, marginVertical: 8, color: colors.text, fontWeight: 'bold' }
              ]}
            >
              {daily.slok}
            </Text>
            <Text style={[themeStyles.text, { fontSize: 13, lineHeight: 18, borderTopColor: colors.border, borderTopWidth: 1, paddingTop: 10, color: colors.textSecondary }]}>
              {daily.rams?.ht || daily.tej?.ht || 'No translation available.'}
            </Text>
            <TouchableOpacity 
              onPress={() => navigateTo('VerseDetails', { chapterNumber: daily.chapter, verseNumber: daily.verse })}
              style={{ marginTop: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', minHeight: 48, minWidth: 48 }}
            >
              <Text style={{ color: colors.accent, fontWeight: 'bold', fontSize: 13 }}>Study Shloka </Text>
              <ChevronRight size={14} color={colors.accent} />
            </TouchableOpacity>
          </Animated.View>
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
          style={[themeStyles.card, { marginBottom: 12, minHeight: 48 }]}
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
function ChapterDetailsScreen({ chapterNum, navigateTo, navigateBack, colors, themeStyles }: any) {
  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Animations
  const screenFade = useRef(new Animated.Value(0)).current;
  const screenSlide = useRef(new Animated.Value(15)).current;

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const data = await getChapterDetails(chapterNum);
        setChapter(data);
        
        // Trigger animations
        Animated.parallel([
          Animated.timing(screenFade, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(screenSlide, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
          })
        ]).start();
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [chapterNum]);

  if (loading) {
    return <ChapterSkeleton colors={colors} />;
  }

  if (!chapter) {
    return <Text style={themeStyles.text}>Chapter not found</Text>;
  }

  return (
    <Animated.View style={{ flex: 1, opacity: screenFade, transform: [{ translateY: screenSlide }] }}>
      <ScrollView style={{ flex: 1, padding: 16 }} showsVerticalScrollIndicator={false}>
        <TouchableOpacity 
          onPress={navigateBack} 
          style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16, minHeight: 48 }}
        >
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
                    justifyContent: 'center',
                    paddingVertical: 12,
                    minHeight: 48,
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
    </Animated.View>
  );
}

// ----------------------------------------------------
// 3. VERSE DETAILS SCREEN
// ----------------------------------------------------
function VerseDetailsScreen({ chapterNum, verseNum, navigateTo, navigateBack, colors, themeStyles }: any) {
  const [currentVerseNum, setCurrentVerseNum] = useState<number>(verseNum);
  const [verse, setVerse] = useState<Verse | null>(null);
  const [gujarati, setGujarati] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [loadingGu, setLoadingGu] = useState(false);
  const [slideDirection, setSlideDirection] = useState<'left' | 'right'>('right');

  const scrollRef = useRef<ScrollView>(null);
  
  // Transition Animations
  const contentFade = useRef(new Animated.Value(0)).current;
  const contentSlide = useRef(new Animated.Value(0)).current;
  const translationsFade = useRef(new Animated.Value(0)).current;

  const totalVerses = slokCounts[chapterNum - 1];

  const triggerTransition = () => {
    // Determine starting X offset based on slide direction
    const startX = slideDirection === 'right' ? 40 : -40;
    contentSlide.setValue(startX);
    contentFade.setValue(0.2);
    translationsFade.setValue(0);
    
    Animated.parallel([
      Animated.timing(contentFade, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(contentSlide, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      })
    ]).start();
  };

  useEffect(() => {
    async function load() {
      try {
        // Only show full skeleton loader on very first initial load (no verse present)
        const isFirstLoad = !verse;
        if (isFirstLoad) {
          setLoading(true);
        }

        // Fetch verse details
        const data = await getVerseDetails(chapterNum, currentVerseNum);
        setVerse(data);
        
        // Trigger slide transition on data load
        triggerTransition();

        // Reset scroll position on verse change
        if (scrollRef.current) {
          scrollRef.current.scrollTo({ y: 0, animated: false });
        }

        // Fetch Gujarati translation
        const hindiText = data.rams?.ht || data.tej?.ht || '';
        if (hindiText) {
          setLoadingGu(true);
          const guTranslation = await getGujaratiTranslation(chapterNum, currentVerseNum, hindiText);
          setGujarati(guTranslation);
          
          // Animate translation entry
          Animated.timing(translationsFade, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }).start();
          setLoadingGu(false);
        } else {
          setGujarati('અનુવાદ ઉપલબ્ધ નથી.');
          translationsFade.setValue(1);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [chapterNum, currentVerseNum]);

  const handleNext = () => {
    if (currentVerseNum < totalVerses) {
      setSlideDirection('right');
      setCurrentVerseNum(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentVerseNum > 1) {
      setSlideDirection('left');
      setCurrentVerseNum(prev => prev - 1);
    }
  };

  // Swipe Navigation (PanResponder setup)
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        // High sensitivity horizontal gesture capture
        return Math.abs(gestureState.dx) > 30 && Math.abs(gestureState.dy) < 18;
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dx < -45) {
          handleNext();
        } else if (gestureState.dx > 45) {
          handlePrev();
        }
      },
    })
  ).current;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Scrollable Container with Pan Handlers */}
      <View {...panResponder.panHandlers} style={{ flex: 1 }}>
        {loading && !verse ? (
          <VerseSkeleton colors={colors} />
        ) : (
          <ScrollView 
            ref={scrollRef} 
            style={{ flex: 1, padding: 16 }} 
            showsVerticalScrollIndicator={false}
          >
            {/* Back Navigation Bar */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <TouchableOpacity 
                onPress={navigateBack} 
                style={{ flexDirection: 'row', alignItems: 'center', minHeight: 48 }}
              >
                <ArrowLeft size={16} color={colors.accent} style={{ marginRight: 6 }} />
                <Text style={{ color: colors.accent, fontWeight: 'bold' }}>Chapter {chapterNum}</Text>
              </TouchableOpacity>
              <Text style={{ color: colors.textSecondary, fontWeight: 'bold', fontSize: 13 }}>
                Verse {currentVerseNum} of {totalVerses}
              </Text>
            </View>

            {verse && (
              <Animated.View style={{ opacity: contentFade, transform: [{ translateX: contentSlide }] }}>
                {/* Shloka Box */}
                <View style={[themeStyles.card, { padding: 22, alignItems: 'center', marginBottom: 24, borderLeftWidth: 4, borderLeftColor: colors.accent }]}>
                  <Text style={{ color: colors.textSecondary, fontSize: 11, fontWeight: 'bold', letterSpacing: 1, marginBottom: 8 }}>
                    VERSE {chapterNum}.{currentVerseNum}
                  </Text>
                  
                  {/* Sanskrit Shloka: Size 20, Accent color, centered, Georgia font as per before */}
                  <Text 
                    style={[
                      themeStyles.titleSerif, 
                      { 
                        fontSize: 20, 
                        textAlign: 'center', 
                        lineHeight: 30, 
                        marginVertical: 14, 
                        color: colors.accent, 
                        fontWeight: '600'
                      }
                    ]}
                  >
                    {verse.slok}
                  </Text>
                  
                  {/* Roman Transliteration */}
                  <Text 
                    style={[
                      themeStyles.text, 
                      { 
                        fontSize: 13, 
                        textAlign: 'center', 
                        fontStyle: 'italic', 
                        borderTopColor: colors.border, 
                        borderTopWidth: 1, 
                        paddingTop: 14, 
                        marginTop: 6,
                        color: colors.textSecondary, 
                        width: '100%',
                        lineHeight: 20
                      }
                    ]}
                  >
                    {verse.transliteration}
                  </Text>
                </View>

                {/* Translations List */}
                <View style={{ marginBottom: 40 }}>
                  <Text style={[themeStyles.header, { fontSize: 16, marginBottom: 14, fontWeight: 'bold', color: colors.text }]}>Translations</Text>

                  {/* Hindi (Gitapress) */}
                  <View style={[themeStyles.card, { marginBottom: 16 }]}>
                    <Text style={{ fontSize: 10, color: colors.accent, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 6 }}>
                      Hindi (Gita Press / स्वामी रामसुखदास)
                    </Text>
                    <Text style={[themeStyles.text, { fontSize: 14, lineHeight: 22, color: colors.text }]}>
                      {verse.rams?.ht || 'अनुवाद उपलब्ध नहीं है।'}
                    </Text>
                  </View>

                  {/* Gujarati */}
                  <View style={[themeStyles.card, { marginBottom: 16 }]}>
                    <Text style={{ fontSize: 10, color: colors.accent, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 6 }}>
                      Gujarati (ગુજરાતી અનુવાદ)
                    </Text>
                    {loadingGu ? (
                      <View style={{ paddingVertical: 4 }}>
                        <SkeletonPlaceholder width="95%" height={14} style={{ marginBottom: 6 }} />
                        <SkeletonPlaceholder width="70%" height={14} />
                      </View>
                    ) : (
                      <Animated.View style={{ opacity: translationsFade }}>
                        <Text style={[themeStyles.text, { fontSize: 14, lineHeight: 22, color: colors.text }]}>
                          {gujarati}
                        </Text>
                      </Animated.View>
                    )}
                  </View>

                  {/* English */}
                  <View style={[themeStyles.card, { marginBottom: 16 }]}>
                    <Text style={{ fontSize: 10, color: colors.accent, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 6 }}>
                      English (Swami Sivananda)
                    </Text>
                    <Text style={[themeStyles.text, { fontSize: 14, lineHeight: 22, color: colors.text }]}>
                      {verse.siva?.et || verse.prabhu?.et || 'Translation not available.'}
                    </Text>
                  </View>
                </View>
              </Animated.View>
            )}
          </ScrollView>
        )}
      </View>

      {/* Previous / Next Navigation Fixed at Bottom */}
      <View 
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: colors.surface,
          borderTopWidth: 1,
          borderTopColor: colors.border,
          paddingHorizontal: 16,
          paddingTop: 12,
          paddingBottom: Platform.OS === 'ios' ? 28 : 16, // Respect bottom notches
        }}
      >
        <TouchableOpacity 
          disabled={currentVerseNum === 1}
          onPress={handlePrev}
          style={{ 
            flexDirection: 'row', 
            alignItems: 'center', 
            opacity: currentVerseNum === 1 ? 0.35 : 1,
            paddingVertical: 12,
            paddingHorizontal: 16,
            minWidth: 120,
            justifyContent: 'center',
            borderRadius: 10,
            backgroundColor: currentVerseNum === 1 ? colors.muted : colors.accent,
            minHeight: 48,
          }}
        >
          <ArrowLeft size={16} color={currentVerseNum === 1 ? colors.textSecondary : '#FFFFFF'} style={{ marginRight: 6 }} />
          <Text style={{ color: currentVerseNum === 1 ? colors.textSecondary : '#FFFFFF', fontWeight: 'bold', fontSize: 14 }}>Prev Verse</Text>
        </TouchableOpacity>

        <Text style={{ color: colors.text, fontWeight: 'bold', fontSize: 14 }}>
          Verse {currentVerseNum}
        </Text>

        <TouchableOpacity 
          disabled={currentVerseNum === totalVerses}
          onPress={handleNext}
          style={{ 
            flexDirection: 'row', 
            alignItems: 'center', 
            opacity: currentVerseNum === totalVerses ? 0.35 : 1,
            paddingVertical: 12,
            paddingHorizontal: 16,
            minWidth: 120,
            justifyContent: 'center',
            borderRadius: 10,
            backgroundColor: currentVerseNum === totalVerses ? colors.muted : colors.accent,
            minHeight: 48,
          }}
        >
          <Text style={{ color: currentVerseNum === totalVerses ? colors.textSecondary : '#FFFFFF', fontWeight: 'bold', fontSize: 14 }}>Next Verse</Text>
          <ArrowRight size={16} color={currentVerseNum === totalVerses ? colors.textSecondary : '#FFFFFF'} style={{ marginLeft: 6 }} />
        </TouchableOpacity>
      </View>
    </View>
  );
}
