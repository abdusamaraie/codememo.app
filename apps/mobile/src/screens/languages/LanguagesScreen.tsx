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
import type { RootStackParamList } from '@/navigation/routes';
import { LANGUAGE_GRID } from '@/constants';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Languages'>;
};

export function LanguagesScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Languages</Text>
        <Text style={styles.subtitle}>Choose a language to study</Text>
      </View>

      <FlatList
        data={LANGUAGE_GRID}
        keyExtractor={(item) => item.slug}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.card, { borderTopColor: item.color }]}
            onPress={() => navigation.navigate('Sections', { language: item.slug, languageName: item.name })}
            activeOpacity={0.7}
          >
            <Text style={styles.emoji}>{item.emoji}</Text>
            <Text style={styles.langName}>{item.name}</Text>
            <Text style={styles.sectionCount}>{item.sections} sections</Text>
          </TouchableOpacity>
        )}
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
    paddingBottom: 8,
  },
  title: {
    color: '#E2E4EC',
    fontSize: 28,
    fontWeight: '700',
  },
  subtitle: {
    color: '#7B8199',
    fontSize: 14,
    marginTop: 4,
  },
  list: {
    padding: 16,
    gap: 12,
  },
  row: {
    gap: 12,
  },
  card: {
    flex: 1,
    backgroundColor: '#151A24',
    borderRadius: 12,
    padding: 20,
    borderTopWidth: 3,
    minHeight: 120,
    justifyContent: 'space-between',
  },
  emoji: {
    fontSize: 32,
  },
  langName: {
    color: '#E2E4EC',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 12,
  },
  sectionCount: {
    color: '#7B8199',
    fontSize: 12,
    marginTop: 4,
  },
});
