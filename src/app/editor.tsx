import { loadNotes, Note, saveNotes } from "@/utils/storage";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  useColorScheme,
  useWindowDimensions,
  View,
  ViewStyle,
} from "react-native";

const headerImage = require("../../assets/images/logo-glow.png");

// ─── Color Palettes ───────────────────────────────────────────────────────────
const lightColors = {
  bg: "#FFFAF7",
  text: "#1C1410",
  muted: "#7C6E68",
  accent: "#FF6B2B",
  input: "#FFFFFF",
  inputBorder: "#EDE6E1",
  divider: "#EDE6E1",
  overlay: "rgba(20,10,2,0.60)",
  saveBtn: "#FF6B2B",
  saveBtnText: "#FFFFFF",
  chipBg: "rgba(255,107,43,0.10)",
  chipText: "#FF6B2B",
  keywordBorder: "#EDE6E1",
  deleteBtn: "rgba(220,38,38,0.08)",
  deleteBtnText: "#DC2626",
};

const darkColors = {
  bg: "#110E0A",
  text: "#F5EFE9",
  muted: "#9A8A82",
  accent: "#FF7A40",
  input: "#1E1812",
  inputBorder: "#2D2420",
  divider: "#2D2420",
  overlay: "rgba(0,0,0,0.68)",
  saveBtn: "#FF7A40",
  saveBtnText: "#110E0A",
  chipBg: "rgba(255,122,64,0.14)",
  chipText: "#FF7A40",
  keywordBorder: "#2D2420",
  deleteBtn: "rgba(220,38,38,0.12)",
  deleteBtnText: "#F87171",
};

// ─── Component ────────────────────────────────────────────────────────────────
export default function NoteEditorScreen() {
  const systemScheme = useColorScheme();
  const { dark, id } = useLocalSearchParams<{ dark?: string; id?: string }>();
  const isDark = dark !== undefined ? dark === "1" : systemScheme === "dark";
  const colors = isDark ? darkColors : lightColors;
  const { width } = useWindowDimensions();

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [category, setCategory] = useState("Personal");
  const [keywords, setKeywords] = useState<string[]>([]);
  const [kwInput, setKwInput] = useState("");

  // Load existing note when editing
  useEffect(() => {
    if (id) {
      loadNotes().then((notes) => {
        const note = notes.find((n: Note) => n.id === id);
        if (note) {
          setTitle(note.title);
          setBody(note.content);
          setCategory(note.category);
          setKeywords(note.keywords ?? []);
        }
      });
    }
  }, [id]);

  const addKeyword = () => {
    const kw = kwInput.trim().toLowerCase();
    if (kw && !keywords.includes(kw)) {
      setKeywords((prev) => [...prev, kw]);
    }
    setKwInput("");
  };

  const removeKeyword = (kw: string) => {
    setKeywords((prev) => prev.filter((k) => k !== kw));
  };

  const handleSave = async () => {
    if (!title.trim()) return;
    const notes = await loadNotes();
    const today = new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    if (id) {
      // Update existing
      const updated = notes.map((n: Note) =>
        n.id === id
          ? {
              ...n,
              title: title.trim(),
              content: body,
              date: today,
              category,
              keywords,
            }
          : n,
      );
      await saveNotes(updated);
    } else {
      // Create new
      const newNote: Note = {
        id: Date.now().toString(),
        title: title.trim(),
        content: body,
        date: today,
        category,
        keywords,
      };
      await saveNotes([newNote, ...notes]);
    }
    router.back();
  };

  const handleDelete = async () => {
    if (!id) return;
    const notes = await loadNotes();
    await saveNotes(notes.filter((n: Note) => n.id !== id));
    router.back();
  };

  const hPad = width > 600 ? 40 : 20;

  // StyleSheet.compose — merge shared base button with save-specific extras
  const saveButtonStyle = StyleSheet.compose(
    styles.btnBase,
    styles.saveBtnExtra,
  ) as ViewStyle;

  return (
    <KeyboardAvoidingView
      style={[styles.flex, { backgroundColor: colors.bg }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}>
      {/* ── ImageBackground Header ── */}
      <ImageBackground
        source={headerImage}
        style={styles.headerBg}
        resizeMode="cover">
        <View
          style={[styles.headerOverlay, { backgroundColor: colors.overlay }]}>
          {/* Back button */}
          <Pressable
            style={({ pressed }) => [
              styles.btnBase,
              styles.backBtnExtra,
              { opacity: pressed ? 0.65 : 1 },
            ]}
            onPress={() => router.back()}>
            <Text style={styles.backBtnText}>← Back</Text>
          </Pressable>

          {/* Header title mirrors note title */}
          <Text style={styles.headerScreenTitle} numberOfLines={1}>
            {title.trim() !== "" ? title : "New Note"}
          </Text>

          {/* Quick save in header */}
          <Pressable
            style={({ pressed }) => [
              styles.btnBase,
              styles.headerSaveExtra,
              { backgroundColor: colors.accent, opacity: pressed ? 0.8 : 1 },
            ]}
            onPress={handleSave}>
            <Text
              style={[styles.headerSaveText, { color: colors.saveBtnText }]}>
              Save
            </Text>
          </Pressable>
        </View>
      </ImageBackground>

      {/* ── Scrollable Body ── */}
      <ScrollView
        style={styles.flex}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingHorizontal: hPad },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        {/* Title Input */}
        <TextInput
          style={[
            styles.titleInput,
            { color: colors.text, borderBottomColor: colors.divider },
          ]}
          placeholder="Note title..."
          placeholderTextColor={colors.muted}
          value={title}
          onChangeText={setTitle}
          returnKeyType="next"
          maxLength={80}
        />

        <Text style={[styles.charHint, { color: colors.muted }]}>
          {title.length}/80
        </Text>

        {/* Body Input */}
        <TextInput
          style={[
            styles.bodyInput,
            {
              color: colors.text,
              backgroundColor: colors.input,
              borderColor: colors.inputBorder,
            },
          ]}
          placeholder="Start writing your note here..."
          placeholderTextColor={colors.muted}
          value={body}
          onChangeText={setBody}
          multiline
          textAlignVertical="top"
        />
        {/* Keywords section */}
        <View style={styles.keywordsSection}>
          <Text style={[styles.kwLabel, { color: colors.muted }]}>
            Keywords
          </Text>
          {/* Chip row */}
          {keywords.length > 0 && (
            <View style={styles.chipRow}>
              {keywords.map((kw) => (
                <Pressable
                  key={kw}
                  style={[styles.chip, { backgroundColor: colors.chipBg }]}
                  onPress={() => removeKeyword(kw)}>
                  <Text style={[styles.chipText, { color: colors.chipText }]}>
                    {kw} ×
                  </Text>
                </Pressable>
              ))}
            </View>
          )}
          {/* Keyword input */}
          <View
            style={[
              styles.kwInputRow,
              {
                borderColor: colors.keywordBorder,
                backgroundColor: colors.input,
              },
            ]}>
            <TextInput
              style={[styles.kwInput, { color: colors.text }]}
              placeholder="Add keyword..."
              placeholderTextColor={colors.muted}
              value={kwInput}
              onChangeText={setKwInput}
              onSubmitEditing={addKeyword}
              returnKeyType="done"
              autoCapitalize="none"
              blurOnSubmit={false}
            />
            <Pressable
              style={[styles.kwAddBtn, { backgroundColor: colors.accent }]}
              onPress={addKeyword}>
              <Text style={[styles.kwAddText, { color: colors.saveBtnText }]}>
                +
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
      <View
        style={[
          styles.footer,
          {
            backgroundColor: colors.bg,
            borderTopColor: colors.divider,
            paddingHorizontal: hPad,
          },
        ]}>
        {/* Delete button — only shown when editing an existing note */}
        {id ? (
          <Pressable
            style={({ pressed }) => [
              styles.deleteBtn,
              {
                backgroundColor: colors.deleteBtn,
                opacity: pressed ? 0.75 : 1,
              },
            ]}
            onPress={handleDelete}>
            <Text
              style={[styles.deleteBtnText, { color: colors.deleteBtnText }]}>
              🗑 Delete Note
            </Text>
          </Pressable>
        ) : null}
        <Pressable
          style={({ pressed }) => [
            saveButtonStyle,
            { backgroundColor: colors.saveBtn, opacity: pressed ? 0.85 : 1 },
          ]}
          onPress={handleSave}>
          <Text style={[styles.saveLabel, { color: colors.saveBtnText }]}>
            Save Note
          </Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  flex: { flex: 1 },

  // Header
  headerBg: {
    height: 180,
  },
  headerOverlay: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 20,
    paddingBottom: 18,
    gap: 10,
  },
  headerScreenTitle: {
    flex: 1,
    fontSize: 17,
    fontWeight: "700",
    color: "#FFFFFF",
    textAlign: "center",
    letterSpacing: -0.2,
  },

  // Shared base button (used with StyleSheet.compose)
  btnBase: {
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingVertical: 9,
  },

  // Back button extras
  backBtnExtra: {
    backgroundColor: "rgba(255,255,255,0.16)",
    minWidth: 76,
  },
  backBtnText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },

  // Header quick-save extras
  headerSaveExtra: {
    minWidth: 60,
    borderRadius: 10,
  },
  headerSaveText: {
    fontSize: 14,
    fontWeight: "700",
  },

  // Save button extras (composed with btnBase via StyleSheet.compose)
  saveBtnExtra: {
    borderRadius: 18,
    paddingVertical: 17,
  },
  saveLabel: {
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: 0.2,
  },

  // Scroll content
  scrollContent: {
    paddingTop: 26,
    paddingBottom: 16,
  },
  titleInput: {
    fontSize: 26,
    fontWeight: "700",
    paddingVertical: 10,
    borderBottomWidth: 1,
    letterSpacing: -0.5,
  },
  charHint: {
    fontSize: 11,
    textAlign: "right",
    marginTop: 4,
    marginBottom: 18,
  },
  bodyInput: {
    fontSize: 16,
    lineHeight: 27,
    minHeight: 200,
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginBottom: 24,
  },

  // Keywords
  keywordsSection: {
    gap: 10,
    paddingBottom: 24,
  },
  kwLabel: {
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  chipText: {
    fontSize: 13,
    fontWeight: "600",
  },
  kwInputRow: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    borderWidth: 1,
    overflow: "hidden",
  },
  kwInput: {
    flex: 1,
    fontSize: 15,
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === "ios" ? 12 : 10,
  },
  kwAddBtn: {
    width: 44,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "stretch",
  },
  kwAddText: {
    fontSize: 22,
    fontWeight: "300",
    lineHeight: 26,
  },

  // Save footer
  footer: {
    paddingVertical: 14,
    borderTopWidth: 1,
    gap: 10,
  },
  deleteBtn: {
    borderRadius: 16,
    paddingVertical: 13,
    alignItems: "center",
    justifyContent: "center",
  },
  deleteBtnText: {
    fontSize: 15,
    fontWeight: "600",
  },
});
