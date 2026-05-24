// ── StatusBadge: New (blue) | Qualified (green) | Escalated (red) ────────────
// Reusable across Leads, Escalations, and Conversation Detail screens.

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import COLORS from '../../constants/colors';
import TYPOGRAPHY from '../../constants/typography';

const STATUS_CONFIG = {
  new:       { label: 'New',       color: COLORS.statusNew },
  qualified: { label: 'Qualified', color: COLORS.statusQualified },
  escalated: { label: 'Escalated', color: COLORS.statusEscalated },
};

export default function StatusBadge({ status }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.new;

  return (
    <View style={[styles.badge, { backgroundColor: config.color + '20', borderColor: config.color + '40' }]}>
      <View style={[styles.dot, { backgroundColor: config.color }]} />
      <Text style={[styles.label, { color: config.color }]}>{config.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    gap: 5,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  label: {
    fontSize: TYPOGRAPHY.badge,
    fontWeight: TYPOGRAPHY.semiBold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
