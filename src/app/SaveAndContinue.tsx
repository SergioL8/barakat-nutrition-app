import React from "react";
import { StyleSheet, Text, View } from "react-native";
import AppHeader from "../components/AppHeader";
import { colors } from "../theme/theme";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SaveAndContinue() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <AppHeader />
      <View style={styles.body}>        
        <View style={styles.recordContainer}>
          <Text style={styles.header}>Case Records</Text>
          <View style={styles.titleBar}>
            <Text style={styles.titles}>Child Name</Text>
            <Text style={styles.titles}>Clinic</Text>
            <Text style={styles.titles}>Condition</Text>
            <Text style={styles.titles}>Last Visit</Text>
          </View>
          <View style={styles.savedCases}>
            <Text style={styles.noCases}>No saved cases yet</Text>
          </View>
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
    paddingTop: 15,
    paddingBottom: 15,
  },
  recordContainer: {
    flex: 1,
    backgroundColor: colors.brand.white
  },
  header: {
    fontSize: 18,
    fontWeight: "500",
    padding: 22
  },
  titleBar: {
    height: 30,
    backgroundColor: colors.others.grey,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  titles: {
    fontWeight: "600",
    paddingRight: 50,
    paddingLeft: 80
  },
  savedCases: {
    padding: 22,
    alignItems: "center",
  },
  noCases: {
    fontWeight: "200"
  }
});
