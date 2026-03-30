import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/routes';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList>;
};

export function HomeScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Greeting */}
        <View style={styles.greeting}>
          <Text style={styles.greetingText}>Good morning 👋</Text>
          <Text style={styles.dueBadge}>12 cards due today</Text>
        </View>

        {/* Streak */}
        <View style={styles.streakCard}>
          <Text style={styles.streakEmoji}>🔥</Text>
          <View>
            <Text style={styles.streakCount}>6 day streak</Text>
            <Text style={styles.streakSub}>Keep it up!</Text>
          </View>
          <View style={styles.xpBadge}>
            <Text style={styles.xpText}>+20 XP today</Text>
          </View>
        </View>

        {/* Continue Learning */}
        <Text style={styles.sectionLabel}>Continue Learning</Text>
        {[
          { slug: 'python',     name: 'Python',     emoji: '🐍', color: '#3572A5', pct: 42 },
          { slug: 'javascript', name: 'JavaScript', emoji: '⚡', color: '#F7DF1E', pct: 17 },
        ].map((lang) => (
          <TouchableOpacity
            key={lang.slug}
            style={[styles.langCard, { borderLeftColor: lang.color }]}
            onPress={() => navigation.navigate('Sections', { language: lang.slug, languageName: lang.name })}
            activeOpacity={0.7}
          >
            <Text style={styles.langEmoji}>{lang.emoji}</Text>
            <View style={styles.langInfo}>
              <Text style={styles.langName}>{lang.name}</Text>
              <View style={styles.langProgress}>
                <View style={styles.langProgressBg}>
                  <View style={[styles.langProgressFill, { width: `${lang.pct}%` as `${number}%`, backgroundColor: lang.color }]} />
                </View>
                <Text style={styles.langPct}>{lang.pct}%</Text>
              </View>
            </View>
            <Text style={styles.continueArrow}>›</Text>
          </TouchableOpacity>
        ))}

        {/* Daily Goals */}
        <Text style={styles.sectionLabel}>{"Today's Goals"}</Text>
        <View style={styles.goalsCard}>
          {[
            { label: 'Cards reviewed', current: 8,  target: 20 },
            { label: 'Perfect recalls', current: 3, target: 5 },
            { label: 'Minutes studied', current: 12, target: 10 },
          ].map(({ label, current, target }) => {
            const done = current >= target;
            const pct = Math.min(100, Math.round((current / target) * 100));
            return (
              <View key={label} style={styles.goalRow}>
                <View style={styles.goalRowTop}>
                  <Text style={styles.goalLabel}>{label}</Text>
                  <Text style={[styles.goalCount, done && styles.goalDone]}>{current}/{target}</Text>
                </View>
                <View style={styles.goalBarBg}>
                  <View style={[styles.goalBarFill, { width: `${pct}%` as `${number}%` }, done && styles.goalBarDone]} />
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0E14',
  },
  content: {
    padding: 16,
    gap: 12,
    paddingBottom: 32,
  },
  greeting: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  greetingText: {
    color: '#E2E4EC',
    fontSize: 20,
    fontWeight: '700',
  },
  dueBadge: {
    backgroundColor: '#7C6AF622',
    color: '#7C6AF6',
    fontSize: 12,
    fontWeight: '600',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  streakCard: {
    backgroundColor: '#151A24',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: '#FBBF2444',
  },
  streakEmoji: { fontSize: 32 },
  streakCount: {
    color: '#FBBF24',
    fontSize: 18,
    fontWeight: '700',
  },
  streakSub: {
    color: '#7B8199',
    fontSize: 12,
  },
  xpBadge: {
    marginLeft: 'auto',
    backgroundColor: '#34D39922',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  xpText: {
    color: '#34D399',
    fontSize: 12,
    fontWeight: '600',
  },
  sectionLabel: {
    color: '#7B8199',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginTop: 4,
  },
  langCard: {
    backgroundColor: '#151A24',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderLeftWidth: 3,
  },
  langEmoji: { fontSize: 28 },
  langInfo: { flex: 1 },
  langName: {
    color: '#E2E4EC',
    fontSize: 15,
    fontWeight: '600',
  },
  langProgress: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 6,
  },
  langProgressBg: {
    flex: 1,
    height: 4,
    backgroundColor: '#1E2636',
    borderRadius: 2,
    overflow: 'hidden',
  },
  langProgressFill: {
    height: '100%',
    borderRadius: 2,
  },
  langPct: {
    color: '#7B8199',
    fontSize: 11,
    width: 28,
  },
  continueArrow: {
    color: '#7B8199',
    fontSize: 20,
  },
  goalsCard: {
    backgroundColor: '#151A24',
    borderRadius: 12,
    padding: 16,
    gap: 16,
    borderWidth: 1,
    borderColor: '#1E2636',
  },
  goalRow: { gap: 6 },
  goalRowTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  goalLabel: {
    color: '#E2E4EC',
    fontSize: 13,
  },
  goalCount: {
    color: '#7B8199',
    fontSize: 13,
  },
  goalDone: { color: '#34D399' },
  goalBarBg: {
    height: 4,
    backgroundColor: '#1E2636',
    borderRadius: 2,
    overflow: 'hidden',
  },
  goalBarFill: {
    height: '100%',
    backgroundColor: '#7C6AF6',
    borderRadius: 2,
  },
  goalBarDone: { backgroundColor: '#34D399' },
});

