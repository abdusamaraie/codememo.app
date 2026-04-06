import React, { useCallback, useRef, useState } from 'react';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {
  GestureDetector,
  Gesture,
} from 'react-native-gesture-handler';
import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/routes';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type QualityRating = 1 | 3 | 4 | 5;

type Flashcard = {
  id: string;
  question: string;
  answer: string;
  hint?: string;
};

const MOCK_CARDS: Flashcard[] = [
  {
    id: '1',
    question: 'How do you create a list in Python?',
    answer: 'my_list = [1, 2, 3]\n# Or empty:\nmy_list = []',
    hint: 'Use square brackets [ ]',
  },
  {
    id: '2',
    question: 'How do you iterate over a list with index?',
    answer: 'for i, item in enumerate(my_list):\n    print(i, item)',
    hint: 'Use enumerate()',
  },
  {
    id: '3',
    question: 'How do you create a dictionary?',
    answer: 'my_dict = {"key": "value"}\n# Or empty:\nmy_dict = {}',
  },
];

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Study'>;
  route: RouteProp<RootStackParamList, 'Study'>;
};

export function FlashcardScreen({ navigation, route }: Props) {
  const { sectionTitle } = route.params;

  const [cardIndex, setCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [completed, setCompleted] = useState(false);

  const flipProgress = useSharedValue(0);
  const translateX = useSharedValue(0);
  const isAnimating = useRef(false);

  const currentCard = MOCK_CARDS[cardIndex];
  const totalCards = MOCK_CARDS.length;

  const flipCard = useCallback(() => {
    if (isAnimating.current) return;
    isAnimating.current = true;
    const toValue = isFlipped ? 0 : 1;
    flipProgress.value = withTiming(toValue, { duration: 450 }, () => {
      isAnimating.current = false;
    });
    setIsFlipped(!isFlipped);
    setShowHint(false);
  }, [flipProgress, isFlipped]);

  const handleRating = useCallback((quality: QualityRating) => {
    if (cardIndex < totalCards - 1) {
      translateX.value = withTiming(-SCREEN_WIDTH, { duration: 250 }, () => {
        translateX.value = SCREEN_WIDTH;
        translateX.value = withTiming(0, { duration: 200 });
      });
      setTimeout(() => {
        setCardIndex((prev) => prev + 1);
        setIsFlipped(false);
        flipProgress.value = 0;
        setShowHint(false);
      }, 200);
    } else {
      setCompleted(true);
    }
    // In production: call Convex mutation to record review with quality
    void quality;
  }, [cardIndex, flipProgress, totalCards, translateX]);

  const swipeGesture = Gesture.Pan()
    .runOnJS(true)
    .onEnd((event) => {
      if (!isFlipped) return;
      if (event.velocityX > 500 || event.translationX > 80) {
        handleRating(5);
      } else if (event.velocityX < -500 || event.translationX < -80) {
        handleRating(1);
      }
    });

  const frontAnimStyle = useAnimatedStyle(() => ({
    transform: [
      { rotateY: `${interpolate(flipProgress.value, [0, 1], [0, 180])}deg` },
    ],
    backfaceVisibility: 'hidden',
  }));

  const backAnimStyle = useAnimatedStyle(() => ({
    transform: [
      { rotateY: `${interpolate(flipProgress.value, [0, 1], [180, 360])}deg` },
    ],
    backfaceVisibility: 'hidden',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  }));

  const cardContainerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  if (completed) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <View style={styles.completedContainer}>
          <Text style={styles.completedEmoji}>🎉</Text>
          <Text style={styles.completedTitle}>Session Complete!</Text>
          <Text style={styles.completedSub}>You reviewed {totalCards} cards</Text>
          <TouchableOpacity style={styles.doneBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.doneBtnText}>Back to Sections</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (!currentCard) return null;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backBtn}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.sectionName} numberOfLines={1}>{sectionTitle}</Text>
        <Text style={styles.counter}>{cardIndex + 1}/{totalCards}</Text>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${((cardIndex + (isFlipped ? 0.5 : 0)) / totalCards) * 100}%` as `${number}%` }]} />
      </View>

      {/* Card Area */}
      <GestureDetector gesture={swipeGesture}>
        <Animated.View style={[styles.cardContainer, cardContainerStyle]}>
          {/* Front */}
          <Animated.View style={[styles.card, frontAnimStyle]}>
            <View style={styles.badgeRow}>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>PROMPT</Text>
              </View>
              {currentCard.hint && (
                <TouchableOpacity
                  style={styles.hintBtn}
                  onPress={() => setShowHint(!showHint)}
                >
                  <Text style={styles.hintBtnText}>💡 Hint</Text>
                </TouchableOpacity>
              )}
            </View>

            <ScrollView contentContainerStyle={styles.cardContent} showsVerticalScrollIndicator={false}>
              <Text style={styles.questionText}>{currentCard.question}</Text>

              {showHint && currentCard.hint && (
                <View style={styles.hintBox}>
                  <Text style={styles.hintText}>{currentCard.hint}</Text>
                </View>
              )}
            </ScrollView>

            <TouchableOpacity style={styles.flipBtn} onPress={flipCard}>
              <Text style={styles.flipBtnText}>Reveal Answer</Text>
            </TouchableOpacity>
          </Animated.View>

          {/* Back */}
          <Animated.View style={[styles.card, styles.cardBack, backAnimStyle]}>
            <View style={styles.badgeRow}>
              <View style={[styles.badge, styles.answerBadge]}>
                <Text style={styles.badgeText}>ANSWER</Text>
              </View>
            </View>

            <ScrollView contentContainerStyle={styles.cardContent} showsVerticalScrollIndicator={false}>
              <View style={styles.answerCodeBlock}>
                <Text style={styles.answerCode}>{currentCard.answer}</Text>
              </View>
            </ScrollView>

            {/* Rating Buttons */}
            <View style={styles.ratingRow}>
              <TouchableOpacity style={[styles.ratingBtn, styles.ratingForgot]} onPress={() => handleRating(1)}>
                <Text style={styles.ratingBtnText}>😅{'\n'}Forgot</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.ratingBtn, styles.ratingHard]} onPress={() => handleRating(3)}>
                <Text style={styles.ratingBtnText}>😓{'\n'}Hard</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.ratingBtn, styles.ratingGood]} onPress={() => handleRating(4)}>
                <Text style={styles.ratingBtnText}>👍{'\n'}Good</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.ratingBtn, styles.ratingNailed]} onPress={() => handleRating(5)}>
                <Text style={styles.ratingBtnText}>✅{'\n'}Nailed</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </Animated.View>
      </GestureDetector>

      {!isFlipped && (
        <Text style={styles.tapHint}>Tap card to reveal • Swipe after reveal</Text>
      )}
      {isFlipped && (
        <Text style={styles.tapHint}>Swipe right = Nailed it • Swipe left = Forgot</Text>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0E14',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  backBtn: {
    color: '#7B8199',
    fontSize: 18,
    padding: 4,
  },
  sectionName: {
    flex: 1,
    color: '#E2E4EC',
    fontSize: 15,
    fontWeight: '600',
  },
  counter: {
    color: '#7B8199',
    fontSize: 13,
  },
  progressBar: {
    height: 3,
    backgroundColor: '#1E2636',
    marginHorizontal: 16,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#7C6AF6',
  },
  cardContainer: {
    flex: 1,
    margin: 16,
    marginTop: 20,
  },
  card: {
    flex: 1,
    backgroundColor: '#151A24',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#1E2636',
  },
  cardBack: {
    borderColor: '#7C6AF6',
  },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  badge: {
    backgroundColor: '#7C6AF622',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  answerBadge: {
    backgroundColor: '#34D39922',
  },
  badgeText: {
    color: '#7C6AF6',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
  },
  hintBtn: {
    backgroundColor: '#FBBF2422',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  hintBtnText: {
    color: '#FBBF24',
    fontSize: 12,
    fontWeight: '600',
  },
  cardContent: {
    flexGrow: 1,
    paddingBottom: 12,
  },
  questionText: {
    color: '#E2E4EC',
    fontSize: 18,
    lineHeight: 28,
    fontWeight: '500',
  },
  hintBox: {
    backgroundColor: '#FBBF2411',
    borderRadius: 8,
    padding: 12,
    marginTop: 16,
    borderLeftWidth: 3,
    borderLeftColor: '#FBBF24',
  },
  hintText: {
    color: '#FBBF24',
    fontSize: 14,
    lineHeight: 20,
  },
  flipBtn: {
    backgroundColor: '#7C6AF6',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  flipBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  answerCodeBlock: {
    backgroundColor: '#1E1E2E',
    borderRadius: 10,
    padding: 16,
    borderWidth: 1,
    borderColor: '#34D39933',
  },
  answerCode: {
    color: '#34D399',
    fontFamily: 'JetBrainsMono-Regular',
    fontSize: 14,
    lineHeight: 22,
  },
  ratingRow: {
    flexDirection: 'row',
    gap: 8,
  },
  ratingBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  ratingBtnText: {
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 18,
  },
  ratingForgot: { backgroundColor: '#F8717133' },
  ratingHard:   { backgroundColor: '#FBBF2433' },
  ratingGood:   { backgroundColor: '#38BDF833' },
  ratingNailed: { backgroundColor: '#34D39933' },
  tapHint: {
    color: '#7B8199',
    fontSize: 12,
    textAlign: 'center',
    paddingBottom: 12,
  },
  completedContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    paddingHorizontal: 32,
  },
  completedEmoji: {
    fontSize: 64,
  },
  completedTitle: {
    color: '#E2E4EC',
    fontSize: 24,
    fontWeight: '700',
  },
  completedSub: {
    color: '#7B8199',
    fontSize: 16,
  },
  doneBtn: {
    backgroundColor: '#7C6AF6',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 8,
  },
  doneBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
