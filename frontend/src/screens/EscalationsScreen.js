// ── EscalationsScreen: Active escalation alerts ─────────────────────────────
// Thin screen — composes EscalationCard and EmptyState components.

import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import EscalationCard from '../components/cards/EscalationCard';
import EmptyState from '../components/EmptyState';
import COLORS from '../constants/colors';
import TYPOGRAPHY from '../constants/typography';
import SPACING from '../constants/spacing';
import { MOCK_ESCALATIONS } from '../data/mockData';

export default function EscalationsScreen({ navigation }) {
  const [escalations, setEscalations] = useState(MOCK_ESCALATIONS);

  const handleResolve = (id) => {
    setEscalations((prev) =>
      prev.map((e) => (e.id === id ? { ...e, resolved: true } : e))
    );
  };

  const handlePress = (escalation) => {
    navigation.navigate('ConversationDetail', {
      conversationId: escalation.conversationId,
      customerName: escalation.customerName,
    });
  };

  const openCount = escalations.filter((e) => !e.resolved).length;

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.title}>Escalations</Text>
        <Text style={styles.subtitle}>
          {openCount} open · {escalations.length - openCount} resolved
        </Text>
      </View>

      {escalations.length === 0 ? (
        <EmptyState
          icon="shield-checkmark-outline"
          title="All clear!"
          message="No active escalations. Closira is handling everything smoothly."
        />
      ) : (
        <FlatList
          data={escalations}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <EscalationCard
              escalation={item}
              onResolve={handleResolve}
              onPress={handlePress}
            />
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
