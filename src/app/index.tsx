import NoteCard from "@/components/NoteCard";
import { loadNotes, Note, saveNotes } from "@/utils/storage";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import {
  FlatList,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  useColorScheme,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// ─── Seed notes shown on first launch ────────────────────────────────────────
const SEED_NOTES: Note[] = [
  {
    id: "seed-1",
    title: "Welcome to Notes!",
    content:
      "Tap the + button to create your first note. Long-press a card to delete it.",
    date: "Today",
    category: "Personal",
    keywords: ["welcome", "guide"],
  },
  {
    id: "seed-2",
    title: "Smart Home Project",
    content:
      "Interview with Stakeholders, Competitor Research, Typography Style.",
    date: "May 12",
    category: "UiUX",
    keywords: ["ux", "research", "design"],
  },
];

const CARD_BG_LIGHT = [
  "#EDE9FE",
  "#FFE8DF",
  "#FEF9C3",
  "#F0FDF4",
  "#E0F2FE",
  "#FDE8EF",
];
const CARD_BG_DARK = [
  "#2A1F42",
  "#2D1608",
  "#2D2500",
  "#0F2A18",
  "#082030",
  "#2D1020",
];

// ─── Color Palettes ───────────────────────────────────────────────────────────
const lightColors = {
  bg: "#FFFAF7",
  header: "#FFFFFF",
  text: "#1C1410",
  muted: "#7C6E68",
  accent: "#FF6B2B",
  tagBg: "rgba(255,107,43,0.10)",
  searchBg: "#F5EEE9",
  inputBorder: "#EDE6E1",
  pill: "#F5EEE9",
  pillText: "#7C6E68",
  pillActive: "#FF6B2B",
  pillActiveText: "#FFFFFF",
  tabBar: "#FFFFFF",
  tabBarBorder: "#F0EBE6",
  fabText: "#FFFFFF",
  border: "#EDE6E1",
};

const darkColors = {
  bg: "#110E0A",
  header: "#1A1510",
  text: "#F5EFE9",
  muted: "#9A8A82",
  accent: "#FF7A40",
  tagBg: "rgba(255,122,64,0.14)",
  searchBg: "#1E1812",
  inputBorder: "#2D2420",
  pill: "#1E1812",
  pillText: "#9A8A82",
  pillActive: "#FF7A40",
  pillActiveText: "#110E0A",
  tabBar: "#1A1510",
  tabBarBorder: "#2D2420",
  fabText: "#110E0A",
  border: "#2D2420",
};

// ─── Component ────────────────────────────────────────────────────────────────
export default function NotesListScreen() {
  const systemScheme = useColorScheme();
  const [darkOverride, setDarkOverride] = useState<boolean | null>(null);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [notes, setNotes] = useState<Note[]>([]);
  const { width } = useWindowDimensions();

  const isDark = darkOverride !== null ? darkOverride : systemScheme === "dark";
  const colors = isDark ? darkColors : lightColors;
  const cardBgSet = isDark ? CARD_BG_DARK : CARD_BG_LIGHT;
  const numColumns = width > 600 ? 2 : 1;

  // Derive pills: "All" + unique keywords collected from all notes
  const pills = useMemo(() => {
    const kwSet = new Set<string>();
    notes.forEach((n) => (n.keywords ?? []).forEach((k) => kwSet.add(k)));
    return ["All", ...Array.from(kwSet)];
  }, [notes]);

  // Reset active pill if it no longer exists in current keyword set
  const activePill = pills.includes(activeCategory) ? activeCategory : "All";

  // Reload notes every time the screen comes into focus (e.g. after saving in editor)
  useFocusEffect(
    useCallback(() => {
      loadNotes().then((stored) => {
        if (stored.length === 0) {
          // First launch — seed with 2 starter notes
          saveNotes(SEED_NOTES);
          setNotes(SEED_NOTES);
        } else {
          setNotes(stored);
        }
      });
    }, []),
  );

  const handleDelete = useCallback(
    (id: string) => {
      const updated = notes.filter((n) => n.id !== id);
      setNotes(updated);
      saveNotes(updated);
    },
    [notes],
  );

  const filteredNotes = useMemo(
    () =>
      notes.filter((n) => {
        const matchPill =
          activePill === "All" ||
          (n.keywords ?? []).some(
            (k) => k.toLowerCase() === activePill.toLowerCase(),
          );
        const q = search.toLowerCase();
        const matchSearch =
          n.title.toLowerCase().includes(q) ||
          n.content.toLowerCase().includes(q) ||
          (n.keywords ?? []).some((k) => k.toLowerCase().includes(q));
        return matchPill && matchSearch;
      }),
    [search, activePill, notes],
  );

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.bg }]}>
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={colors.header}
      />

      {/* ── Header ── */}
      <View style={[styles.header, { backgroundColor: colors.header }]}>
        <View>
          <Text style={[styles.greeting, { color: colors.muted }]}>Hey 👋</Text>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            Welcome Back
          </Text>
        </View>
        <View style={styles.headerRight}>
          <Text style={styles.themeEmoji}>{isDark ? "🌙" : "☀️"}</Text>
          <Switch
            value={isDark}
            onValueChange={(val) => setDarkOverride(val)}
            trackColor={{ false: "#E0D8D3", true: "#FF6B2B" }}
            thumbColor="#FFFFFF"
          />
          <View style={[styles.avatar, { backgroundColor: colors.accent }]}>
            <Text style={styles.avatarText}>R</Text>
          </View>
        </View>
      </View>

      {/* ── Search Bar ── */}
      <View style={[styles.searchRow, { backgroundColor: colors.header }]}>
        <View
          style={[
            styles.searchBox,
            {
              backgroundColor: colors.searchBg,
              borderColor: colors.inputBorder,
            },
          ]}>
          <Text style={[styles.searchIcon, { color: colors.muted }]}>🔍</Text>
          <TextInput
            style={StyleSheet.flatten([
              styles.searchInput,
              { color: colors.text },
            ])}
            placeholder="Search notes..."
            placeholderTextColor={colors.muted}
            value={search}
            onChangeText={setSearch}
            clearButtonMode="while-editing"
          />
        </View>
      </View>

      {/* ── Keyword Pills ── */}
      <View style={[styles.pillsWrapper, { backgroundColor: colors.header }]}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.pillsScroll}>
          {pills.map((pill) => {
            const isActive = pill === activePill;
            const count =
              pill === "All"
                ? notes.length
                : notes.filter((n) =>
                    (n.keywords ?? []).some(
                      (k) => k.toLowerCase() === pill.toLowerCase(),
                    ),
                  ).length;
            return (
              <Pressable
                key={pill}
                style={[
                  styles.pill,
                  {
                    backgroundColor: isActive ? colors.pillActive : colors.pill,
                  },
                ]}
                onPress={() => setActiveCategory(pill)}>
                <Text
                  style={[
                    styles.pillText,
                    {
                      color: isActive ? colors.pillActiveText : colors.pillText,
                    },
                  ]}>
                  {pill} ({count})
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {/* ── Notes count ── */}
      <Text style={[styles.countLabel, { color: colors.muted }]}>
        {filteredNotes.length} {filteredNotes.length === 1 ? "note" : "notes"}
      </Text>

      {/* ── Notes FlatList ── */}
      <FlatList
        data={filteredNotes}
        keyExtractor={(item) => item.id}
        numColumns={numColumns}
        key={numColumns}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={numColumns > 1 ? styles.columnWrapper : undefined}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <Pressable
            style={({ pressed }) => [
              styles.cardWrapper,
              numColumns > 1 && styles.cardWrapperMulti,
              { opacity: pressed ? 0.88 : 1 },
            ]}
            onPress={() =>
              router.push({
                pathname: "/editor",
                params: { id: item.id, dark: isDark ? "1" : "0" },
              })
            }
            onLongPress={() => handleDelete(item.id)}>
            <NoteCard
              title={item.title}
              content={item.content}
              date={item.date}
              tag={item.category}
              colors={colors}
              cardBg={cardBgSet[index % cardBgSet.length]}
            />
          </Pressable>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📝</Text>
            <Text style={[styles.emptyText, { color: colors.muted }]}>
              No notes found
            </Text>
          </View>
        }
      />

      {/* ── FAB ── */}
      <Pressable
        style={({ pressed }) => [
          styles.fab,
          { backgroundColor: colors.accent, opacity: pressed ? 0.85 : 1 },
        ]}
        onPress={() =>
          router.push({
            pathname: "/editor",
            params: { dark: isDark ? "1" : "0" },
          })
        }>
        <Text style={[styles.fabText, { color: colors.fabText }]}>+</Text>
      </Pressable>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safe: { flex: 1 },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 12,
  },
  greeting: {
    fontSize: 13,
    fontWeight: "500",
    marginBottom: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  themeEmoji: {
    fontSize: 18,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },

  // Search
  searchRow: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === "ios" ? 12 : 10,
    gap: 8,
  },
  searchIcon: {
    fontSize: 15,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    padding: 0,
  },

  // Category Pills
  pillsWrapper: {
    paddingBottom: 12,
  },
  pillsScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  pill: {
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  pillText: {
    fontSize: 13,
    fontWeight: "600",
  },

  // Count
  countLabel: {
    paddingHorizontal: 20,
    paddingBottom: 6,
    fontSize: 12,
    fontWeight: "500",
    letterSpacing: 0.2,
  },

  // List
  listContent: {
    paddingHorizontal: 12,
    paddingBottom: 110,
  },
  columnWrapper: {
    gap: 10,
  },
  cardWrapper: {
    marginHorizontal: 4,
    marginBottom: 10,
  },
  cardWrapperMulti: {
    flex: 1,
  },

  // Empty
  emptyContainer: {
    alignItems: "center",
    paddingTop: 60,
    gap: 10,
  },
  emptyIcon: {
    fontSize: 40,
  },
  emptyText: {
    fontSize: 15,
    fontWeight: "500",
  },

  // FAB
  fab: {
    position: "absolute",
    bottom: 36,
    right: 24,
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    elevation: 8,
    shadowColor: "#FF6B2B",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  fabText: {
    fontSize: 34,
    fontWeight: "300",
    lineHeight: 38,
  },
});
