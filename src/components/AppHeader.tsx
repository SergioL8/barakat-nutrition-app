import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { colors } from "../theme/theme";
import { router } from "expo-router";

type AppHeaderProps = {
  title?: string;
  onMenuPress?: () => void;
};

export default function AppHeader() {
  return (
    <View style={styles.header}>
      <Pressable
        accessibilityRole="button"
        onPress={() => router.replace("/home")}
      >
        <Text style={styles.brandText}>Barakat Nutrition</Text>
      </Pressable>
      <Pressable
        style={styles.menuButton}
        accessibilityRole="button"
        onPress={() => console.log("clicked")}
      >
        <Text style={styles.menuIcon}>☰</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.primary.teal,
  },
  header: {
    height: 104,
    backgroundColor: colors.brand.white,
    paddingHorizontal: 22,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  brandText: {
    color: colors.primary.navy,
    fontSize: 40 / 2,
    fontWeight: "700",
  },
  menuButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  menuIcon: {
    color: colors.text.primary,
    fontSize: 30,
    lineHeight: 30,
  }
});