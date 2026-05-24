// ── LocationDropdown: City selector (Mumbai / Bangalore) ────────────────────
// Controls which pin is shown on the Leaflet map.

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../../constants/colors';
import TYPOGRAPHY from '../../constants/typography';
import { BORDER_RADIUS } from '../../constants/spacing';

export default function LocationDropdown({ selected, onSelect }) {
  const options = [
    { id: 'mumbai', label: 'Mumbai — Phoenix Marketcity' },
    { id: 'bangalore', label: 'Bangalore — Orion Mall' },
  ];

  return (
    <View style={styles.container}>
      {options.map((option) => {
        const isActive = selected === option.id;
        return (
          <TouchableOpacity
            key={option.id}
            style={[styles.option, isActive && styles.optionActive]}
            onPress={() => onSelect(option.id)}
            activeOpacity={0.7}
          >
            <Ionicons
              name={isActive ? 'location' : 'location-outline'}
              size={18}
              color={isActive ? COLORS.primary : COLORS.textMuted}
            />
            <Text style={[styles.label, isActive && styles.labelActive]}>
              {option.label}
            </Text>
            {isActive && (
              <Ionicons name="checkmark-circle" size={16} color={COLORS.primary} />
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  option: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 6,
  },
  optionActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary + '10',
  },
  label: {
    flex: 1,
    fontSize: TYPOGRAPHY.bodySmall,
    color: COLORS.textSecondary,
    fontWeight: TYPOGRAPHY.medium,
  },
  labelActive: {
    color: COLORS.textPrimary,
    fontWeight: TYPOGRAPHY.semiBold,
  },
});
