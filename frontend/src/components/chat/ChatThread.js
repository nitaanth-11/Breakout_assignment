// ── ChatThread: Scrollable message list ─────────────────────────────────────
// Composes MessageBubble components into a scrollable chat view.

import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import MessageBubble from './MessageBubble';

export default function ChatThread({ messages = [] }) {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {messages.map((msg) => (
        <MessageBubble key={msg.id} message={msg} />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
});
