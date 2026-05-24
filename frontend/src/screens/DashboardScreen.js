// ── DashboardScreen: Home tab with stats, map, and activity feed ────────────
// Thin screen — composes StatCard, LocationMap, LocationDropdown, ActivityFeed.
// Redesigned with a beautiful premium white surface and a blue gradient header card!

import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import StatCard from '../components/cards/StatCard';
import LocationMap from '../components/maps/LocationMap';
import LocationDropdown from '../components/maps/LocationDropdown';
import ActivityFeed from '../components/ActivityFeed';
import COLORS from '../constants/colors';
import TYPOGRAPHY from '../constants/typography';
import SPACING from '../constants/spacing';
import { BORDER_RADIUS } from '../constants/spacing';
import { MOCK_STATS, MOCK_ACTIVITY } from '../data/mockData';

export default function DashboardScreen() {
  const [selectedLocation, setSelectedLocation] = useState('mumbai');

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      {/* Header Gradient Card Banner */}
      <LinearGradient
        colors={COLORS.accentGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerBanner}
      >
        <Text style={styles.greeting}>Welcome back 👋</Text>
        <Text style={styles.title}>Closira Dashboard</Text>
        <Text style={styles.subtitle}>Powered by Closira AI Support Engine</Text>
      </LinearGradient>

      {/* Stats Grid */}
      <View style={styles.statsRow}>
        <StatCard icon="people-outline" label="Leads Today" value={MOCK_STATS.totalLeadsToday} color={COLORS.info} />
        <StatCard icon="eye-off-outline" label="Missed" value={MOCK_STATS.missedEnquiries} color={COLORS.warning} />
      </View>
      <View style={styles.statsRow}>
        <StatCard icon="alert-circle-outline" label="Open Escalations" value={MOCK_STATS.openEscalations} color={COLORS.error} />
        <StatCard icon="calendar-outline" label="Follow-ups Due" value={MOCK_STATS.followUpsDue} color={COLORS.primary} />
      </View>

      {/* Location Map */}
      <Text style={styles.sectionTitle}>Our Locations</Text>
      <LocationDropdown selected={selectedLocation} onSelect={setSelectedLocation} />
      <LocationMap selectedLocation={selectedLocation} />

      {/* Activity Feed */}
      <View style={styles.activitySection}>
        <ActivityFeed activities={MOCK_ACTIVITY} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: SPACING.lg,
    paddingBottom: 40,
  },
  headerBanner: {
    borderRadius: BORDER_RADIUS.lg,
    padding: 24,
    marginBottom: 20,
    boxShadow: '0 10px 15px -3px rgba(37, 99, 235, 0.15), 0 4px 6px -4px rgba(37, 99, 235, 0.15)',
  },
  greeting: {
    fontSize: TYPOGRAPHY.bodySmall,
    color: 'rgba(255, 255, 255, 0.85)',
    fontWeight: '500',
    marginBottom: 4,
  },
  title: {
    fontSize: TYPOGRAPHY.heading1,
    fontWeight: TYPOGRAPHY.bold,
    color: '#FFFFFF',
  },
  subtitle: {
    fontSize: TYPOGRAPHY.caption,
    color: 'rgba(255, 255, 255, 0.75)',
    marginTop: 4,
    fontWeight: '400',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.heading3,
    fontWeight: TYPOGRAPHY.semiBold,
    color: COLORS.textPrimary,
    marginTop: 20,
    marginBottom: 12,
  },
  activitySection: {
    marginTop: 20,
  },
});
