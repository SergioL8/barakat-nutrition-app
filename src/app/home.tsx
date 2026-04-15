import { router } from "expo-router";
import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import StartAssessmentButton from "../components/StartAssessmentButton";
import { colors } from "../theme/theme";
import AppHeader from "../components/AppHeader";

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <AppHeader />

      <View style={styles.body}>
        <Text style={styles.welcome}>Welcome, Guest!</Text>

        <View style={styles.logoWrap}>
          <Image
            source={require("../../assets/multicolor_logo.png")}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <View style={styles.buttonWrap}>
          <StartAssessmentButton
            onPress={() => router.push("/parent_child_information")}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.primary.teal
  },
  body: {
    flex: 1,
    paddingHorizontal: 44 / 2,
    paddingTop: 82 / 2,
  },
  welcome: {
    color: colors.brand.black,
    fontSize: 68 / 2,
    fontWeight: "500",
    marginBottom: 24,
  },
  logoWrap: {
    width: "100%",
    alignItems: "center",
    marginBottom: 36,
  },
  logo: {
    width: 320,
    height: 180,
  },
  buttonWrap: {
    width: "100%",
  },
});
