// ── FollowUpCard: Task card with due time + mark-as-done action ─────────────
// Used on the Follow-ups screen.

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../../constants/colors';
import TYPOGRAPHY from '../../constants/typography';
import { BORDER_RADIUS } from '../../constants/spacing';

export default function FollowUpCard({ followUp, onMarkDone }) {
  return (
    <View style={[styles.card, followUp.done && styles.cardDone]}>
      <View style={styles.topRow}>
        <View style={styles.nameRow}>
          <Ionicons
            name={followUp.done ? 'checkmark-circle' : 'time-outline'}
            size={18}
            color={followUp.done ? COLORS.success : COLORS.warning}
          />
          <Text style={[styles.name, followUp.done && styles.nameDone]}>
            {followUp.customerName}
          </Text>
        </View>
        <Text style={[styles.due, followUp.done && styles.dueDone]}>
          {followUp.dueTime}
        </Text>
      </View>

      <Text style={[styles.preview, followUp.done && styles.previewDone]} numberOfLines={2}>
        {followUp.preview}
      </Text>

      {!followUp.done && (
        <TouchableOpacity
          style={styles.doneButton}
          onPress={() => onMarkDone?.(followUp.id)}
        >
          <Ionicons name="checkmark" size={14} color={COLORS.textPrimary} />
          <Text style={styles.doneText}>Mark as Done</Text>
        </TouchableOpacity>
      )}
    </View>
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
  cardDone: {
    opacity: 0.5,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  nameDone: {
    textDecorationLine: 'line-through',
  },
  due: {
    fontSize: TYPOGRAPHY.caption,
    color: COLORS.warning,
    fontWeight: TYPOGRAPHY.medium,
  },
  dueDone: {
    color: COLORS.textMuted,
  },
  preview: {
    fontSize: TYPOGRAPHY.bodySmall,
    color: COLORS.textSecondary,
    lineHeight: 18,
    marginBottom: 12,
  },
  previewDone: {
    textDecorationLine: 'line-through',
  },
  doneButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    backgroundColor: COLORS.surfaceLight,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 5,
  },
  doneText: {
    fontSize: TYPOGRAPHY.bodySmall,
    fontWeight: TYPOGRAPHY.medium,
    color: COLORS.textPrimary,
  },
});
