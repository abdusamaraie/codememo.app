import React from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '@/navigation/routes';

type Section = {
  id: string;
  slug: string;
  title: string;
  order: number;
  cardCount: number;
  status: 'locked' | 'available' | 'in_progress' | 'completed' | 'mastered';
};

const SECTION_STATUS_COLORS: Record<Section['status'], string> = {
  available:   '#7C6AF6',
  in_progress: '#FBBF24',
  completed:   '#34D399',
  mastered:    '#34D399',
  locked:      '#2A3349',
};

const SECTION_STATUS_ICONS: Record<Section['status'], string> = {
  available:   '○',
  in_progress: '◑',
  completed:   '✓',
  mastered:    '★',
  locked:      '🔒',
};

const MOCK_SECTIONS: Section[] = [
  { id: '1', slug: 'variables', title: 'Variables & Data Types', order: 1, cardCount: 12, status: 'completed' },
  { id: '2', slug: 'strings',   title: 'Strings & Methods',      order: 2, cardCount: 15, status: 'in_progress' },
  { id: '3', slug: 'operators', title: 'Operators',               order: 3, cardCount: 10, status: 'available' },
  { id: '4', slug: 'conditionals', title: 'Conditionals',         order: 4, cardCount: 8,  status: 'locked' },
  { id: '5', slug: 'lists',     title: 'Lists & Tuples',          order: 5, cardCount: 14, status: 'locked' },
  { id: '6', slug: 'dicts',     title: 'Dicts & Sets',            order: 6, cardCount: 12, status: 'locked' },
  { id: '7', slug: 'for-loops', title: 'For Loops',               order: 7, cardCount: 10, status: 'locked' },
  { id: '8', slug: 'functions', title: 'Functions',               order: 8, cardCount: 15, status: 'locked' },
];

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Sections'>;
  route: RouteProp<RootStackParamList, 'Sections'>;
};

export function SectionListScreen({ navigation, route }: Props) {
  const { languageName } = route.params;

  const completedCount = MOCK_SECTIONS.filter((s) => s.status === 'completed' || s.status === 'mastered').length;
  const progress = Math.round((completedCount / MOCK_SECTIONS.length) * 100);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>{languageName}</Text>
        <View style={styles.progressRow}>
          <Text style={styles.progressText}>{completedCount}/{MOCK_SECTIONS.length} sections</Text>
          <Text style={styles.progressPct}>{progress}%</Text>
        </View>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress}%` as `${number}%` }]} />
        </View>
      </View>

      <FlatList
        data={MOCK_SECTIONS}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => {
          const isLocked = item.status === 'locked';
          const color = SECTION_STATUS_COLORS[item.status];
          const icon  = SECTION_STATUS_ICONS[item.status];

          return (
            <TouchableOpacity
              style={[styles.sectionCard, isLocked && styles.lockedCard]}
              onPress={() => {
                if (!isLocked) {
                  navigation.navigate('Study', {
                    language: route.params.language,
                    sectionId: item.id,
                    sectionTitle: item.title,
                  });
                }
              }}
              activeOpacity={isLocked ? 1 : 0.7}
              disabled={isLocked}
            >
              <View style={[styles.statusBadge, { backgroundColor: color + '22' }]}>
                <Text style={[styles.statusIcon, { color }]}>{icon}</Text>
              </View>
              <View style={styles.sectionInfo}>
                <Text style={[styles.sectionTitle, isLocked && styles.lockedText]}>
                  {item.title}
                </Text>
                <Text style={styles.cardCount}>{item.cardCount} cards</Text>
              </View>
              {!isLocked && (
                <Text style={styles.chevron}>›</Text>
              )}
            </TouchableOpacity>
          );
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0E14',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1E2636',
  },
  title: {
    color: '#E2E4EC',
    fontSize: 24,
    fontWeight: '700',
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  progressText: {
    color: '#7B8199',
    fontSize: 13,
  },
  progressPct: {
    color: '#7C6AF6',
    fontSize: 13,
    fontWeight: '600',
  },
  progressBar: {
    height: 4,
    backgroundColor: '#1E2636',
    borderRadius: 2,
    marginTop: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#7C6AF6',
    borderRadius: 2,
  },
  list: {
    padding: 16,
    gap: 10,
  },
  sectionCard: {
    backgroundColor: '#151A24',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  lockedCard: {
    opacity: 0.5,
  },
  statusBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusIcon: {
    fontSize: 18,
    fontWeight: '700',
  },
  sectionInfo: {
    flex: 1,
  },
  sectionTitle: {
    color: '#E2E4EC',
    fontSize: 15,
    fontWeight: '600',
  },
  lockedText: {
    color: '#7B8199',
  },
  cardCount: {
    color: '#7B8199',
    fontSize: 12,
    marginTop: 2,
  },
  chevron: {
    color: '#7B8199',
    fontSize: 20,
  },
});
