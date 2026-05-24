// ── MessageBubble: Single chat message (user vs. AI styling) ────────────────
// Used inside ChatThread on Conversation Detail screen.

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import COLORS from '../../constants/colors';
import TYPOGRAPHY from '../../constants/typography';
import { BORDER_RADIUS } from '../../constants/spacing';

export default function MessageBubble({ message }) {
  const isUser = message.role === 'user';

  return (
    <View style={[styles.row, isUser ? styles.rowUser : styles.rowBot]}>
      <View style={[styles.bubble, isUser ? styles.bubbleUser : styles.bubbleBot]}>
        <Text style={[styles.text, isUser ? styles.textUser : styles.textBot]}>
          {message.content}
        </Text>
        <Text style={[styles.time, isUser ? styles.timeUser : styles.timeBot]}>
          {message.time}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    marginBottom: 10,
    paddingHorizontal: 4,
  },
  rowUser: {
    alignItems: 'flex-end',
  },
  rowBot: {
    alignItems: 'flex-start',
  },
  bubble: {
    maxWidth: '80%',
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  bubbleUser: {
    backgroundColor: COLORS.chatUser,
    borderRadius: BORDER_RADIUS.lg,
    borderBottomRightRadius: 4,
  },
  bubbleBot: {
    backgroundColor: COLORS.chatBot,
    borderRadius: BORDER_RADIUS.lg,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  text: {
    fontSize: TYPOGRAPHY.body,
    lineHeight: 21,
  },
  textUser: {
    color: '#FFFFFF',
  },
  textBot: {
    color: COLORS.textPrimary,
  },
  time: {
    fontSize: TYPOGRAPHY.caption,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  timeUser: {
    color: 'rgba(255,255,255,0.6)',
  },
  timeBot: {
    color: COLORS.textMuted,
  },
});
