// ── EmptyState: Friendly "no data" placeholder ─────────────────────────────
// Shown instead of blank screens when lists have no items.

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../constants/colors';
import TYPOGRAPHY from '../constants/typography';

export default function EmptyState({ icon = 'file-tray-outline', title, message }) {
  return (
    <View style={styles.container}>
      <View style={styles.iconCircle}>
        <Ionicons name={icon} size={40} color={COLORS.textMuted} />
      </View>
      <Text style={styles.title}>{title || 'Nothing here yet'}</Text>
      <Text style={styles.message}>
        {message || 'New items will appear here as they come in.'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 60,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: TYPOGRAPHY.heading3,
    fontWeight: TYPOGRAPHY.semiBold,
    color: COLORS.textPrimary,
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    fontSize: TYPOGRAPHY.bodySmall,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 20,
  },
});
