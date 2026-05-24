# Closira Frontend — React Native & Expo Customer Support Dashboard

![React Native](https://img.shields.io/badge/React%20Native-v0.85-61DAFB?style=for-the-badge&logo=react)
![Expo](https://img.shields.io/badge/Expo-v56-black?style=for-the-badge&logo=expo)
![Leaflet.js](https://img.shields.io/badge/Leaflet.js-Interactive%20Maps-green?style=for-the-badge&logo=leaflet)
![React 19](https://img.shields.io/badge/React-19.2-blue?style=for-the-badge)

The cross-platform user dashboard for **Closira**, styled in a premium **White & Royal Blue Gradient** design system. Built with **React Native (Expo)** and compatible with Web browsers, Android, and iOS. It allows human support operators to monitor inbound leads, view status timelines, track active AI escalations, review due follow-up tasks, and interact with Google Gemini in real-time.

---

## 📑 Table of Contents
- [🎨 Premium Design System & Tokens](#-premium-design-system--tokens)
- [🧩 Reusable Component Library](#-reusable-component-library)
- [🧭 Custom Navigation (React 19 Web Workaround)](#-custom-navigation-react-19-web-workaround)
- [🗺️ Interactive Leaflet Map WebView](#%ufe0f-interactive-leaflet-map-webview)
- [💬 Stateful Real-Time Chat Console](#-stateful-real-time-chat-console)
- [🚀 Quick Start & Installation](#-quick-start--installation)

---

## 🎨 Premium Design System & Tokens

The application features a premium light-themed layout designed to offer optimal reading contrast and micro-interactions.

*   **Colors (`src/constants/colors.js`):**
    *   `background`: Clean off-white app background (`#F8FAFC`, slate-50).
    *   `surface`: Pure white card and background surfaces (`#FFFFFF`).
    *   `textPrimary`: High-contrast dark slate (`#0F172A`, slate-900) for excellent typography readability.
    *   `accentGradient`: Royal blue to sky blue gradient (`['#1E3A8A', '#3B82F6']`).
    *   `chatUser` / `chatBot`: Vibrant blue (`#2563EB`) and soft cool slate (`#F1F5F9`) bubbles.
*   **Spacing (`src/constants/spacing.js`):** Modular margins (`SPACING.md: 12`, `SPACING.lg: 16`) and rounded corners (`BORDER_RADIUS.lg: 14`).
*   **Typography (`src/constants/typography.js`):** Balanced font scale with clean line heights for both body copy and headers.

---

## 🧩 Reusable Component Library

The app splits metrics and panels into focused, reusable modules inside `src/components`:

### 1. Cards (`src/components/cards`)
*   `StatCard`: High-impact numeric stats with dynamic icon indicators.
*   `LeadCard`: Tappable rows showing channel, status, and enquiry message previews.
*   `EscalationCard`: Alerts displaying urgency level (High vs Medium) and action button.
*   `FollowUpCard`: Scheduled tasks with complete check-off actions.

### 2. Badges (`src/components/badges`)
*   `StatusBadge`: Dynamic status pills (New, Qualified, Escalated).
*   `ChannelBadge`: Contact type indicators (WhatsApp, Email, Phone Call).

---

## 🧭 Custom Navigation (React 19 Web Workaround)

### The Problem
Stricter React 19 rules and react-native-web layout engine differences cause the default bottom navigation item (`BottomTabItem` inside `@react-navigation/bottom-tabs` v7) to crash when rendering in a web browser.

### The Solution
We implemented a bespoke, lightweight **`CustomTabBar`** in [BottomTabNavigator.js](file:///c:/Users/nitaa/Downloads/Breakout_Assignment/frontend/src/navigation/BottomTabNavigator.js). By replacing standard tab elements with customized `TouchableOpacity` buttons and emojis, the navigation renders flawlessly across all platforms:
```javascript
function CustomTabBar({ state, descriptors, navigation }) {
  return (
    <View style={styles.tabBar}>
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;
        const emoji = TAB_ICONS[route.name] || '•';
        
        return (
          <TouchableOpacity
            key={route.key}
            onPress={() => navigation.navigate(route.name)}
            style={[styles.tabItem, isFocused && styles.tabItemActive]}
          >
            <Text style={[styles.tabIcon, isFocused && styles.tabIconActive]}>{emoji}</Text>
            <Text style={[styles.tabLabel, isFocused && styles.tabLabelActive]}>{route.name}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
```

---

## 🗺️ Interactive Leaflet Map WebView

The map widget ([LocationMap.js](file:///c:/Users/nitaa/Downloads/Breakout_Assignment/frontend/src/components/maps/LocationMap.js)) utilizes an interactive Leaflet.js instance styled with CartoDB Voyager light tiles:

1.  **Mobile WebView PostMessage:** Toggling the city dropdown notifies the mobile WebView via `webViewRef.postMessage(payload)`. Leaflet handles the coordinates and triggers:
    ```javascript
    map.flyTo([lat, lng], 15, { duration: 1.5 });
    marker.setLatLng([lat, lng]);
    marker.openPopup();
    ```
2.  **Iframe rendering on Web:** The web implementation binds the Leaflet HTML source into a secure `iframe` utilizing a dynamic `srcDoc`. The map immediately updates coordinates when selection changes.

---

## 💬 Stateful Real-Time Chat Console

Inside [ConversationDetailScreen.js](file:///c:/Users/nitaa/Downloads/Breakout_Assignment/frontend/src/screens/ConversationDetailScreen.js), operators can talk to Closira directly:

*   **Stateful List:** Local state (`useState`) coordinates message timelines, keeping starting mock data intact while accepting new, live exchanges.
*   **Live Calls:** Chat text input dispatches questions to the backend's REST service (`api.js`).
*   **Automatic Status Upgrades:** If the user complains or triggers an out-of-SOP flow:
    *   The top status badge instantly updates to `escalated` in red.
    *   The AI Summary panel prepends the exact reason for the escalation.
*   **Suggested Lead Qualification:** Recommended follow-up questions from Gemini are parsed and listed as helpful operator prompts inside the Insight card.

---

## 🚀 Quick Start & Installation

1.  **Navigate to the frontend directory**:
    ```bash
    cd c:/Users/nitaa/Downloads/Breakout_Assignment/frontend
    ```
2.  **Install JS Dependencies**:
    ```bash
    npm install
    ```
3.  **Run the Web App**:
    ```bash
    npm run web
    ```
    *Metro Bundler starts up and hosts the web app at `http://localhost:8081`.*
4.  **Run on Mobile**:
    - **Android:** `npm run android`
    - **iOS:** `npm run ios`
