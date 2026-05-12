import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function NoteCard({
  title,
  content,
  date,
  tag,
  colors,
  cardBg,
}) {
  return (
    <View
      style={StyleSheet.flatten([styles.card, { backgroundColor: cardBg }])}>
      {tag ? (
        <View style={[styles.tag, { backgroundColor: colors.tagBg }]}>
          <Text style={[styles.tagText, { color: colors.accent }]}>{tag}</Text>
        </View>
      ) : null}
      <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
        {title}
      </Text>
      <Text style={[styles.content, { color: colors.muted }]} numberOfLines={2}>
        {content}
      </Text>
      <Text style={[styles.date, { color: colors.accent }]}>{date}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    padding: 18,
  },
  tag: {
    alignSelf: "flex-start",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginBottom: 10,
  },
  tagText: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.6,
    textTransform: "uppercase",
  },
  title: {
    fontSize: 17,
    fontWeight: "700",
    marginBottom: 7,
    letterSpacing: -0.3,
  },
  content: {
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 14,
  },
  date: {
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 0.3,
  },
});
