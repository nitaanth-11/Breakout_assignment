// ── StatCard: Single metric display for the Dashboard ───────────────────────
// Shows a number + label with an icon. Used for leads, escalations, follow-ups.

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../../constants/colors';
import TYPOGRAPHY from '../../constants/typography';
import { BORDER_RADIUS } from '../../constants/spacing';

export default function StatCard({ icon, label, value, color = COLORS.primary }) {
  return (
    <View style={styles.card}>
      <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
        <Ionicons name={icon} size={22} color={color} />
      </View>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  value: {
    fontSize: TYPOGRAPHY.heading2,
    fontWeight: TYPOGRAPHY.bold,
    color: COLORS.textPrimary,
  },
  label: {
    fontSize: TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    marginTop: 4,
    textAlign: 'center',
  },
});
