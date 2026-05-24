// ── BottomTabNavigator: Custom Tab Bar Implementation ───────────────────────
// Uses a custom component to completely bypass the default BottomTabItem,
// avoiding React 19 / react-native-web compatibility rendering crashes.
// Designed with a premium, sleek glassmorphism-style aesthetic.

import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import COLORS from '../constants/colors';
import TYPOGRAPHY from '../constants/typography';
import { BORDER_RADIUS } from '../constants/spacing';

import DashboardScreen from '../screens/DashboardScreen';
import LeadsScreen from '../screens/LeadsScreen';
import EscalationsScreen from '../screens/EscalationsScreen';
import FollowUpsScreen from '../screens/FollowUpsScreen';
import ConversationDetailScreen from '../screens/ConversationDetailScreen';

const Tab = createBottomTabNavigator();
const LeadsStack = createNativeStackNavigator();
const EscalationsStack = createNativeStackNavigator();

// ── Stack navigators for Leads & Escalations (to push ConversationDetail) ───

function LeadsStackNavigator() {
  return (
    <LeadsStack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: COLORS.background },
        headerTintColor: COLORS.textPrimary,
        headerTitleStyle: { fontWeight: '600' },
      }}
    >
      <LeadsStack.Screen name="LeadsList" component={LeadsScreen} options={{ headerShown: false }} />
      <LeadsStack.Screen
        name="ConversationDetail"
        component={ConversationDetailScreen}
        options={({ route }) => ({
          title: route.params?.customerName || 'Conversation',
          headerBackTitle: 'Back',
        })}
      />
    </LeadsStack.Navigator>
  );
}

function EscalationsStackNavigator() {
  return (
    <EscalationsStack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: COLORS.background },
        headerTintColor: COLORS.textPrimary,
        headerTitleStyle: { fontWeight: '600' },
      }}
    >
      <EscalationsStack.Screen name="EscalationsList" component={EscalationsScreen} options={{ headerShown: false }} />
      <EscalationsStack.Screen
        name="ConversationDetail"
        component={ConversationDetailScreen}
        options={({ route }) => ({
          title: route.params?.customerName || 'Conversation',
          headerBackTitle: 'Back',
        })}
      />
    </EscalationsStack.Navigator>
  );
}

// ── Custom Glassmorphism Tab Bar Component ──────────────────────────────────

const TAB_ICONS = {
  Home: '🏠',
  Leads: '👥',
  Escalations: '🚨',
  'Follow-ups': '📅',
};

function CustomTabBar({ state, descriptors, navigation }) {
  return (
    <View style={styles.tabBar}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        const emoji = TAB_ICONS[route.name] || '•';

        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={[styles.tabItem, isFocused && styles.tabItemActive]}
            activeOpacity={0.7}
          >
            <Text style={[styles.tabIcon, isFocused && styles.tabIconActive]}>
              {emoji}
            </Text>
            <Text style={[styles.tabLabel, isFocused && styles.tabLabelActive]}>
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

// ── Tab Navigator Component ──────────────────────────────────────────────────

export default function BottomTabNavigator() {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        freezeOnBlur: true,
      }}
    >
      <Tab.Screen name="Home" component={DashboardScreen} />
      <Tab.Screen name="Leads" component={LeadsStackNavigator} />
      <Tab.Screen name="Escalations" component={EscalationsStackNavigator} />
      <Tab.Screen name="Follow-ups" component={FollowUpsScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderTopColor: COLORS.border,
    borderTopWidth: 1,
    height: 70,
    paddingBottom: 12,
    paddingTop: 8,
    paddingHorizontal: 8,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.md,
  },
  tabItemActive: {
    backgroundColor: COLORS.primary + '10',
  },
  tabIcon: {
    fontSize: 20,
    marginBottom: 4,
    opacity: 0.6,
  },
  tabIconActive: {
    opacity: 1,
    transform: [{ scale: 1.1 }],
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: COLORS.textMuted,
  },
  tabLabelActive: {
    color: COLORS.primaryLight,
    fontWeight: '600',
  },
});
