// ── LeadsScreen: List of inbound leads ──────────────────────────────────────
// Thin screen — composes LeadCard and EmptyState components.

import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import LeadCard from '../components/cards/LeadCard';
import EmptyState from '../components/EmptyState';
import COLORS from '../constants/colors';
import TYPOGRAPHY from '../constants/typography';
import SPACING from '../constants/spacing';
import { MOCK_LEADS } from '../data/mockData';

export default function LeadsScreen({ navigation }) {
  const handleLeadPress = (lead) => {
    navigation.navigate('ConversationDetail', {
      conversationId: lead.conversationId,
      customerName: lead.customerName,
    });
  };

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.title}>Leads</Text>
        <Text style={styles.subtitle}>{MOCK_LEADS.length} inbound enquiries</Text>
      </View>

      {MOCK_LEADS.length === 0 ? (
        <EmptyState
          icon="people-outline"
          title="No leads yet"
          message="New customer enquiries from WhatsApp, Email, and Calls will appear here."
        />
      ) : (
        <FlatList
          data={MOCK_LEADS}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <LeadCard lead={item} onPress={handleLeadPress} />
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
