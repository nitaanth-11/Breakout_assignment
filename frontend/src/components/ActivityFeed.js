// ── ActivityFeed: Recent conversation timeline for Dashboard ────────────────
// Shows a scrollable list of recent activities with type-based icons.

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../constants/colors';
import TYPOGRAPHY from '../constants/typography';
import { BORDER_RADIUS } from '../constants/spacing';

const TYPE_CONFIG = {
  lead:       { icon: 'person-add-outline', color: COLORS.info },
  escalation: { icon: 'alert-circle-outline', color: COLORS.error },
  followup:   { icon: 'checkmark-done-outline', color: COLORS.success },
};

function ActivityItem({ item }) {
  const config = TYPE_CONFIG[item.type] || TYPE_CONFIG.lead;

  return (
    <View style={styles.item}>
      <View style={[styles.iconDot, { backgroundColor: config.color + '20' }]}>
        <Ionicons name={config.icon} size={14} color={config.color} />
      </View>
      <View style={styles.itemContent}>
        <Text style={styles.itemText} numberOfLines={2}>{item.text}</Text>
        <Text style={styles.itemTime}>{item.time}</Text>
      </View>
    </View>
  );
}

export default function ActivityFeed({ activities = [] }) {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Recent Activity</Text>
      {activities.map((item) => (
        <ActivityItem key={item.id} item={item} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  heading: {
    fontSize: TYPOGRAPHY.body,
    fontWeight: TYPOGRAPHY.semiBold,
    color: COLORS.textPrimary,
    marginBottom: 12,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    gap: 10,
  },
  iconDot: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  itemContent: {
    flex: 1,
  },
  itemText: {
    fontSize: TYPOGRAPHY.bodySmall,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  itemTime: {
    fontSize: TYPOGRAPHY.caption,
    color: COLORS.textMuted,
    marginTop: 3,
  },
});
