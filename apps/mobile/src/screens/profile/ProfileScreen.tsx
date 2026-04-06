import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const STREAK_DAYS = [true, true, true, false, true, true, false];
const DAY_LABELS  = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

export function ProfileScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>👤</Text>
          </View>
          <View>
            <Text style={styles.username}>Anonymous User</Text>
            <Text style={styles.tier}>Free Plan</Text>
          </View>
        </View>

        {/* Streak Card */}
        <View style={styles.card}>
          <View style={styles.streakHeader}>
            <Text style={styles.cardTitle}>🔥 Current Streak</Text>
            <Text style={styles.streakCount}>6 days</Text>
          </View>
          <View style={styles.weekRow}>
            {DAY_LABELS.map((day, i) => (
              <View key={i} style={styles.dayCol}>
                <View style={[styles.dayDot, STREAK_DAYS[i] && styles.dayDotActive]} />
                <Text style={styles.dayLabel}>{day}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>47</Text>
            <Text style={styles.statLabel}>Cards Reviewed</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>3</Text>
            <Text style={styles.statLabel}>Sections Done</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>82%</Text>
            <Text style={styles.statLabel}>Recall Rate</Text>
          </View>
        </View>

        {/* Save Progress Card */}
        <View style={[styles.card, styles.ctaCard]}>
          <Text style={styles.ctaTitle}>💾 Save Your Progress</Text>
          <Text style={styles.ctaBody}>
            Create a free account to sync across devices and keep your streak alive.
          </Text>
          <TouchableOpacity style={styles.signUpBtn}>
            <Text style={styles.signUpBtnText}>Create Free Account</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.signInLink}>
            <Text style={styles.signInLinkText}>Already have an account? Sign in</Text>
          </TouchableOpacity>
        </View>

        {/* Settings */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Settings</Text>
          <View style={styles.settingsList}>
            {[
              { icon: '🌙', label: 'Dark Mode', value: 'On' },
              { icon: '🔔', label: 'Daily Reminder', value: '9:00 AM' },
              { icon: '🎯', label: 'Daily Goal', value: '20 cards' },
            ].map(({ icon, label, value }) => (
              <TouchableOpacity key={label} style={styles.settingRow}>
                <Text style={styles.settingIcon}>{icon}</Text>
                <Text style={styles.settingLabel}>{label}</Text>
                <Text style={styles.settingValue}>{value} ›</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <Text style={styles.version}>CodeMemo v1.0.0</Text>
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
    gap: 16,
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingVertical: 8,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#1E2636',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 28,
  },
  username: {
    color: '#E2E4EC',
    fontSize: 18,
    fontWeight: '700',
  },
  tier: {
    color: '#7B8199',
    fontSize: 13,
    marginTop: 2,
  },
  card: {
    backgroundColor: '#151A24',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#1E2636',
  },
  cardTitle: {
    color: '#E2E4EC',
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 12,
  },
  streakHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  streakCount: {
    color: '#FBBF24',
    fontSize: 18,
    fontWeight: '700',
  },
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayCol: {
    alignItems: 'center',
    gap: 4,
  },
  dayDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#1E2636',
  },
  dayDotActive: {
    backgroundColor: '#FBBF24',
  },
  dayLabel: {
    color: '#7B8199',
    fontSize: 11,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#151A24',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1E2636',
  },
  statValue: {
    color: '#7C6AF6',
    fontSize: 22,
    fontWeight: '700',
  },
  statLabel: {
    color: '#7B8199',
    fontSize: 11,
    marginTop: 4,
    textAlign: 'center',
  },
  ctaCard: {
    borderColor: '#7C6AF644',
    backgroundColor: '#151A24',
  },
  ctaTitle: {
    color: '#E2E4EC',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },
  ctaBody: {
    color: '#7B8199',
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 16,
  },
  signUpBtn: {
    backgroundColor: '#7C6AF6',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  signUpBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  signInLink: {
    alignItems: 'center',
    marginTop: 12,
  },
  signInLinkText: {
    color: '#7C6AF6',
    fontSize: 13,
  },
  settingsList: {
    gap: 2,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1E2636',
  },
  settingIcon: {
    fontSize: 18,
    width: 24,
  },
  settingLabel: {
    flex: 1,
    color: '#E2E4EC',
    fontSize: 14,
  },
  settingValue: {
    color: '#7B8199',
    fontSize: 14,
  },
  version: {
    color: '#7B8199',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 8,
  },
});
