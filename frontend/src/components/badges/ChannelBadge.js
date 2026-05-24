// ── ChannelBadge: WhatsApp (green) | Email (blue) | Call (amber) ─────────────
// Reusable across Leads, Escalations, and Conversation Detail screens.

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../../constants/colors';
import TYPOGRAPHY from '../../constants/typography';

const CHANNEL_CONFIG = {
  whatsapp: { label: 'WhatsApp', color: COLORS.channelWhatsApp, icon: 'logo-whatsapp' },
  email:    { label: 'Email',    color: COLORS.channelEmail,    icon: 'mail-outline' },
  call:     { label: 'Call',     color: COLORS.channelCall,     icon: 'call-outline' },
};

export default function ChannelBadge({ channel }) {
  const config = CHANNEL_CONFIG[channel] || CHANNEL_CONFIG.call;

  return (
    <View style={[styles.badge, { backgroundColor: config.color + '20' }]}>
      <Ionicons name={config.icon} size={12} color={config.color} />
      <Text style={[styles.label, { color: config.color }]}>{config.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  label: {
    fontSize: TYPOGRAPHY.badge,
    fontWeight: TYPOGRAPHY.semiBold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
