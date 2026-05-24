// ── FollowUpsScreen: Scheduled follow-up tasks ──────────────────────────────
// Thin screen — composes FollowUpCard and EmptyState components.

import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import FollowUpCard from '../components/cards/FollowUpCard';
import EmptyState from '../components/EmptyState';
import COLORS from '../constants/colors';
import TYPOGRAPHY from '../constants/typography';
import SPACING from '../constants/spacing';
import { MOCK_FOLLOWUPS } from '../data/mockData';

export default function FollowUpsScreen() {
  const [followUps, setFollowUps] = useState(MOCK_FOLLOWUPS);

  const handleMarkDone = (id) => {
    setFollowUps((prev) =>
      prev.map((f) => (f.id === id ? { ...f, done: true } : f))
    );
  };

  const pendingCount = followUps.filter((f) => !f.done).length;

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.title}>Follow-ups</Text>
        <Text style={styles.subtitle}>
          {pendingCount} pending · {followUps.length - pendingCount} completed
        </Text>
      </View>

      {followUps.length === 0 ? (
        <EmptyState
          icon="calendar-outline"
          title="No follow-ups"
          message="Scheduled follow-ups from customer conversations will appear here."
        />
      ) : (
        <FlatList
          data={followUps}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <FollowUpCard followUp={item} onMarkDone={handleMarkDone} />
          )}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    padding: SPACING.lg,
    paddingBottom: 12,
  },
  title: {
    fontSize: TYPOGRAPHY.heading1,
    fontWeight: TYPOGRAPHY.bold,
    color: COLORS.textPrimary,
  },
  subtitle: {
    fontSize: TYPOGRAPHY.bodySmall,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  list: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: 40,
  },
});
