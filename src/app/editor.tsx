import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
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
  toolbar: "#FFFFFF",
  toolbarBorder: "#EDE6E1",
  toolbarIcon: "#A09080",
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
  toolbar: "#1A1510",
  toolbarBorder: "#2D2420",
  toolbarIcon: "#6A5A52",
};

const FORMAT_TOOLS = ["I", "U", "🔗", "A", "H1", "H2"];

// ─── Component ────────────────────────────────────────────────────────────────
export default function NoteEditorScreen() {
  const systemScheme = useColorScheme();
  const { dark } = useLocalSearchParams<{ dark?: string }>();
  const isDark = dark !== undefined ? dark === "1" : systemScheme === "dark";
  const colors = isDark ? darkColors : lightColors;
  const { width } = useWindowDimensions();

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

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
            onPress={() => router.back()}>
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
      </ScrollView>

      {/* ── Format Toolbar ── */}
      <View
        style={[
          styles.toolbar,
          {
            backgroundColor: colors.toolbar,
            borderTopColor: colors.toolbarBorder,
          },
        ]}>
        {FORMAT_TOOLS.map((tool) => (
          <Pressable key={tool} style={styles.toolBtn}>
            <Text style={[styles.toolText, { color: colors.toolbarIcon }]}>
              {tool}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* ── Save Footer ── */}
      <View
        style={[
          styles.footer,
          {
            backgroundColor: colors.bg,
            borderTopColor: colors.divider,
            paddingHorizontal: hPad,
          },
        ]}>
        <Pressable
          style={({ pressed }) => [
            saveButtonStyle,
            { backgroundColor: colors.saveBtn, opacity: pressed ? 0.85 : 1 },
          ]}
          onPress={() => router.back()}>
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
    minHeight: 280,
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
  },

  // Format toolbar
  toolbar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderTopWidth: 1,
  },
  toolBtn: {
    padding: 10,
    borderRadius: 8,
  },
  toolText: {
    fontSize: 15,
    fontWeight: "600",
  },

  // Save footer
  footer: {
    paddingVertical: 14,
    borderTopWidth: 1,
  },
});
