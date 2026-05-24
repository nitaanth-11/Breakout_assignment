// ── ConversationDetailScreen: Full conversation view ────────────────────────
// Opens as a stack screen from Leads or Escalations.
// Shows: message thread, SOP match label, AI summary, and status timeline.
// Redesigned to be fully interactive and wired to the Closira Flask API!

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import ChatThread from '../components/chat/ChatThread';
import StatusBadge from '../components/badges/StatusBadge';
import ChannelBadge from '../components/badges/ChannelBadge';
import COLORS from '../constants/colors';
import TYPOGRAPHY from '../constants/typography';
import SPACING from '../constants/spacing';
import { BORDER_RADIUS } from '../constants/spacing';
import { MOCK_CONVERSATIONS } from '../data/mockData';
import { sendMessage } from '../services/api';

export default function ConversationDetailScreen({ route }) {
  const { conversationId, customerName } = route.params;
  const conversation = MOCK_CONVERSATIONS[conversationId];

  if (!conversation) {
    return (
      <View style={styles.screen}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Conversation not found</Text>
          <Text style={styles.emptySubtext}>
            This conversation hasn't been loaded yet.
          </Text>
        </View>
      </View>
    );
  }

  // State hooks for dynamic chat features
  const [messages, setMessages] = useState(conversation.messages);
  const [summary, setSummary] = useState(conversation.summary);
  const [sopMatch, setSopMatch] = useState(conversation.sopMatch);
  const [status, setStatus] = useState(conversation.status);
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSend = async () => {
    if (!inputText.trim() || isSending) return;

    const userText = inputText.trim();
    setInputText('');

    const newMsg = {
      id: 'user_' + Date.now(),
      role: 'user',
      content: userText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    // 1. Add user message locally
    setMessages((prev) => [...prev, newMsg]);
    setIsSending(true);

    try {
      // 2. Call Closira Gemini Flask Backend
      const res = await sendMessage(userText, conversationId);

      // 3. Append Bot's dynamic response
      const botMsg = {
        id: 'bot_' + Date.now(),
        role: 'assistant',
        content: res.answer,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botMsg]);

      // 4. Dynamically update SOP Match & Confidence
      if (res.confidence > 0.8) {
        setSopMatch(`SOP Grounded (Confidence: ${(res.confidence * 100).toFixed(0)}%)`);
      } else if (res.confidence > 0.4) {
        setSopMatch(`Partial Match (Confidence: ${(res.confidence * 100).toFixed(0)}%)`);
      } else {
        setSopMatch('Low Confidence Match');
      }

      // 5. If escalated, immediately trigger UI state change
      if (res.needs_escalation) {
        setStatus('escalated');
        setSummary((prev) => {
          const escNotice = `⚠️ AI Escalation Triggered\nReason: ${res.escalation_reason || 'Out of SOP bounds or explicit request.'}\n\n`;
          if (prev.includes('⚠️ AI Escalation Triggered')) return prev;
          return escNotice + prev;
        });
      }

      // 6. Append lead questions to summary if present to help operator qualify the lead
      if (res.lead_qualification_questions && res.lead_qualification_questions.length > 0) {
        setSummary((prev) => {
          const qualificationNote = `\n\n📌 Lead Questions Suggested:\n${res.lead_qualification_questions.map(q => `- ${q}`).join('\n')}`;
          if (prev.includes('📌 Lead Questions Suggested')) {
            // Replace old suggested questions
            const baseSummary = prev.split('\n\n📌 Lead Questions Suggested')[0];
            return baseSummary + qualificationNote;
          }
          return prev + qualificationNote;
        });
      }
    } catch (err) {
      console.error('Failed to communicate with Closira:', err);
      // Fallback for demo when backend is offline
      const botMsg = {
        id: 'bot_' + Date.now(),
        role: 'assistant',
        content: `⚠️ Failed to reach the Closira backend server. Please verify Flask is running on http://127.0.0.1:5000\n\n(Local simulated reply): I can help you book escape rooms in Mumbai (Phoenix Marketcity) or Bangalore (Orion Mall) according to our Breakout SOP data.`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botMsg]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <ScrollView style={styles.scrollSection} contentContainerStyle={styles.scrollContent}>
        {/* Conversation Header */}
        <View style={styles.headerCard}>
          <Text style={styles.customerName}>{conversation.customerName}</Text>
          <View style={styles.badgeRow}>
            <ChannelBadge channel={conversation.channel} />
            <StatusBadge status={status} />
          </View>
        </View>

        {/* SOP Match Label */}
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>SOP Match State</Text>
            <Text style={styles.infoValue}>{sopMatch}</Text>
          </View>
        </View>

        {/* AI Summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>🤖 AI Agent Session Insight</Text>
          <Text style={styles.summaryText}>{summary}</Text>
        </View>

        <Text style={styles.sectionTitle}>Conversation Log</Text>
      </ScrollView>

      {/* Chat Thread Console Box */}
      <View style={styles.chatContainer}>
        <ChatThread messages={messages} />
        {isSending && (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="small" color={COLORS.primary} />
            <Text style={styles.loaderText}>Closira is thinking...</Text>
          </View>
        )}
      </View>

      {/* Dynamic Keyboard Input */}
      <View style={styles.inputBar}>
        <TextInput
          style={styles.input}
          placeholder="Send a test message as the customer..."
          placeholderTextColor={COLORS.textMuted}
          value={inputText}
          onChangeText={setInputText}
          multiline={false}
          onSubmitEditing={handleSend}
          editable={!isSending}
        />
        <TouchableOpacity
          style={[styles.sendButton, (!inputText.trim() || isSending) && styles.sendButtonDisabled]}
          onPress={handleSend}
          disabled={isSending || !inputText.trim()}
        >
          <LinearGradient
            colors={inputText.trim() && !isSending ? COLORS.accentGradient : ['#94A3B8', '#CBD5E1']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.sendButtonGradient}
          >
            <Text style={styles.sendButtonText}>Send</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollSection: {
    flexGrow: 0,
  },
  scrollContent: {
    padding: SPACING.lg,
    paddingBottom: 0,
  },
  headerCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  customerName: {
    fontSize: TYPOGRAPHY.heading2,
    fontWeight: TYPOGRAPHY.bold,
    color: COLORS.textPrimary,
    marginBottom: 10,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 8,
  },
  infoCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: TYPOGRAPHY.bodySmall,
    color: COLORS.textMuted,
    fontWeight: TYPOGRAPHY.medium,
  },
  infoValue: {
    fontSize: TYPOGRAPHY.bodySmall,
    color: COLORS.primaryLight,
    fontWeight: TYPOGRAPHY.semiBold,
  },
  summaryCard: {
    backgroundColor: COLORS.primary + '10',
    borderRadius: BORDER_RADIUS.lg,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.primary + '30',
  },
  summaryTitle: {
    fontSize: TYPOGRAPHY.body,
    fontWeight: TYPOGRAPHY.semiBold,
    color: COLORS.primaryLight,
    marginBottom: 8,
  },
  summaryText: {
    fontSize: TYPOGRAPHY.bodySmall,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.heading3,
    fontWeight: TYPOGRAPHY.semiBold,
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  chatContainer: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginHorizontal: SPACING.lg,
    marginBottom: 12,
    overflow: 'hidden',
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: 12,
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    gap: 10,
  },
  input: {
    flex: 1,
    height: 44,
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: 16,
    color: COLORS.textPrimary,
    fontSize: TYPOGRAPHY.bodySmall,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  sendButton: {
    borderRadius: BORDER_RADIUS.md,
    overflow: 'hidden',
  },
  sendButtonDisabled: {
    opacity: 0.6,
  },
  sendButtonGradient: {
    paddingHorizontal: 20,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: TYPOGRAPHY.bodySmall,
  },
  loaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    backgroundColor: COLORS.surfaceLight,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    gap: 8,
  },
  loaderText: {
    fontSize: TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: TYPOGRAPHY.heading3,
    color: COLORS.textPrimary,
    fontWeight: TYPOGRAPHY.semiBold,
  },
  emptySubtext: {
    fontSize: TYPOGRAPHY.bodySmall,
    color: COLORS.textMuted,
    marginTop: 8,
  },
});

