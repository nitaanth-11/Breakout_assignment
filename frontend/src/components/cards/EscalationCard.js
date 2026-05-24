// ── EscalationCard: Alert card with urgency indicator + resolve button ───────
// Used on the Escalations screen.

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ChannelBadge from '../badges/ChannelBadge';
import COLORS from '../../constants/colors';
import TYPOGRAPHY from '../../constants/typography';
import { BORDER_RADIUS } from '../../constants/spacing';

export default function EscalationCard({ escalation, onResolve, onPress }) {
  const isHigh = escalation.urgency === 'high';
  const urgencyColor = isHigh ? COLORS.urgencyHigh : COLORS.urgencyMedium;

  return (
    <TouchableOpacity
      style={[styles.card, { borderLeftColor: urgencyColor }]}
      onPress={() => onPress?.(escalation)}
      activeOpacity={0.7}
    >
      <View style={styles.topRow}>
        <View style={styles.nameRow}>
          <Text style={styles.name}>{escalation.customerName}</Text>
          <View style={[styles.urgencyBadge, { backgroundColor: urgencyColor + '20' }]}>
            <Ionicons
              name={isHigh ? 'alert-circle' : 'warning'}
              size={12}
              color={urgencyColor}
            />
            <Text style={[styles.urgencyText, { color: urgencyColor }]}>
              {isHigh ? 'HIGH' : 'MEDIUM'}
            </Text>
          </View>
        </View>
        <Text style={styles.time}>{escalation.time}</Text>
      </View>

      <Text style={styles.reason} numberOfLines={2}>{escalation.reason}</Text>

      <View style={styles.bottomRow}>
        <ChannelBadge channel={escalation.channel} />

        {!escalation.resolved ? (
          <TouchableOpacity
            style={styles.resolveButton}
            onPress={() => onResolve?.(escalation.id)}
          >
            <Ionicons name="checkmark-circle-outline" size={14} color={COLORS.success} />
            <Text style={styles.resolveText}>Resolve</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.resolvedBadge}>
            <Ionicons name="checkmark-circle" size={14} color={COLORS.success} />
            <Text style={styles.resolvedText}>Resolved</Text>
          </View>
        )}
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
    borderLeftWidth: 4,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  name: {
    fontSize: TYPOGRAPHY.body,
    fontWeight: TYPOGRAPHY.semiBold,
    color: COLORS.textPrimary,
  },
  urgencyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    gap: 3,
  },
  urgencyText: {
    fontSize: TYPOGRAPHY.badge,
    fontWeight: TYPOGRAPHY.bold,
    letterSpacing: 0.5,
  },
  time: {
    fontSize: TYPOGRAPHY.caption,
    color: COLORS.textMuted,
  },
  reason: {
    fontSize: TYPOGRAPHY.bodySmall,
    color: COLORS.textSecondary,
    marginBottom: 12,
    lineHeight: 18,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  resolveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.success + '15',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
  },
  resolveText: {
    fontSize: TYPOGRAPHY.bodySmall,
    fontWeight: TYPOGRAPHY.semiBold,
    color: COLORS.success,
  },
  resolvedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    opacity: 0.6,
  },
  resolvedText: {
    fontSize: TYPOGRAPHY.bodySmall,
    color: COLORS.success,
  },
});
