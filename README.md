# 📒 Notes App — React Native + Expo

A clean, minimal Notes App UI built with **React Native** and **Expo Router**, featuring a **papaya orange** color theme, full **dark/light mode** support, and a responsive layout for phones and tablets.

Built as part of the **Mobile Development Cohort** assignment.

---

## Screens

### View 1 — Notes Listing

- Greeting header with avatar and dark/light mode toggle (`Switch`)
- Horizontal category filter pills (All, UiUX, Personal, Ideas)
- Searchable note list using `FlatList`
- Colorful note cards (pastel in light, deep-tinted in dark) via `Pressable`
- Bottom tab bar with a centered `+` FAB to open the editor

### View 2 — Note Editor

- `ImageBackground` header with live note title preview
- Back and Save buttons in the header (`Pressable`)
- `KeyboardAvoidingView` — keyboard never overlaps inputs
- Large title `TextInput` + multiline body `TextInput`
- Format toolbar (I, U, 🔗, A, H1, H2)
- Full-width Save Note footer button

---

## React Native Components Used

| Component              | Used in                                |
| ---------------------- | -------------------------------------- |
| `FlatList`             | Listing screen — note cards            |
| `TextInput`            | Search bar, note title, note body      |
| `Pressable`            | Cards, FAB, Back, Save, category pills |
| `Switch`               | Dark/light mode toggle                 |
| `KeyboardAvoidingView` | Editor screen                          |
| `ImageBackground`      | Editor header                          |
| `SafeAreaView`         | Listing screen wrapper                 |
| `ScrollView`           | Category pills, editor body            |
| `StatusBar`            | Theme-aware status bar                 |
| `View`, `Text`         | Layout and typography throughout       |

---

## Hooks Used

| Hook                   | Purpose                                                |
| ---------------------- | ------------------------------------------------------ |
| `useState`             | Theme override, search text, title/body state          |
| `useColorScheme`       | Auto-detect system dark/light mode                     |
| `useWindowDimensions`  | Responsive layout — 2 columns on tablets (width > 600) |
| `useLocalSearchParams` | Pass `isDark` param from listing → editor screen       |

---

## StyleSheet APIs Used

| API                    | Where                                                  |
| ---------------------- | ------------------------------------------------------ |
| `StyleSheet.create()`  | All styles in every file                               |
| `StyleSheet.flatten()` | Search bar (merges base + theme styles)                |
| `StyleSheet.compose()` | Editor save button (merges `btnBase` + `saveBtnExtra`) |

---

## Theme

The app uses a **papaya orange** (`#FF6B2B`) accent color throughout.

|            | Light                | Dark                    |
| ---------- | -------------------- | ----------------------- |
| Background | `#FFFAF7` warm cream | `#110E0A` espresso      |
| Accent     | `#FF6B2B`            | `#FF7A40`               |
| Cards      | Pastel tints         | Deep tinted backgrounds |

Theme is detected automatically via `useColorScheme()`. The `Switch` in the listing header lets the user override it. The selected theme is passed to the editor via Expo Router params so both screens always stay in sync.

---

## Project Structure

```
src/
├── app/
│   ├── _layout.tsx          — Expo Router Stack (headerShown: false)
│   ├── index.tsx            — View 1: Notes Listing Screen
│   └── editor.tsx           — View 2: Note Editor Screen
└── components/
    └── NoteCard.js          — Reusable note card component
assets/
└── images/
    └── logo-glow.png        — ImageBackground for editor header
```

---

## Getting Started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

3. Scan the QR code with **Expo Go** on your phone, or press `i` for iOS Simulator / `a` for Android Emulator.

---

## Additional Improvements

- Category filter pills with live count badges
- Colorful per-card background tints (6 rotating colors, theme-aware)
- Category tag chips on each note card
- Theme toggle synced across both screens via route params
- Bottom tab bar UI (Home, Calendar, +, Category, Profile)
- Format toolbar in the editor (I, U, 🔗, A, H1, H2)
- Responsive 2-column grid layout on tablets

---

## Tech Stack

- **React Native** 0.83.6
- **Expo** ~55.0.23
- **Expo Router** ~55.0.14 (file-based routing)
- **TypeScript** ~5.9.2

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Reference for the starter template:

https://dribbble.com/shots/24116561-Note-App-UXUI-Design
