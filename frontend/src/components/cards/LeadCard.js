// ── LeadCard: Tappable lead row with channel badge + status + preview ────────
// Used on the Leads screen. Tapping opens ConversationDetailScreen.

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import ChannelBadge from '../badges/ChannelBadge';
import StatusBadge from '../badges/StatusBadge';
import COLORS from '../../constants/colors';
import TYPOGRAPHY from '../../constants/typography';
import { BORDER_RADIUS } from '../../constants/spacing';

export default function LeadCard({ lead, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress?.(lead)} activeOpacity={0.7}>
      <View style={styles.topRow}>
        <Text style={styles.name}>{lead.customerName}</Text>
        <Text style={styles.time}>{lead.time}</Text>
      </View>

      <Text style={styles.preview} numberOfLines={2}>{lead.preview}</Text>

      <View style={styles.bottomRow}>
        <ChannelBadge channel={lead.channel} />
        <StatusBadge status={lead.status} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  name: {
    fontSize: TYPOGRAPHY.body,
    fontWeight: TYPOGRAPHY.semiBold,
    color: COLORS.textPrimary,
  },
  time: {
    fontSize: TYPOGRAPHY.caption,
    color: COLORS.textMuted,
  },
  preview: {
    fontSize: TYPOGRAPHY.bodySmall,
    color: COLORS.textSecondary,
    marginBottom: 12,
    lineHeight: 18,
  },
  bottomRow: {
    flexDirection: 'row',
    gap: 8,
  },
});
