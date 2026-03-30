import { router } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AssessmentHeader from "../components/AssessmentHeader";
import NextButton from "../components/NextButton";
import { useAssessmentStore } from "../state_management/AssessmentFunctions";
import { colors } from "../theme/theme";
import {
  getMuacClassification,
  recommendedChwActions,
} from "../utils/getMuacClassification";

export default function DiagnosisResults() {
  const assessment = useAssessmentStore((state) => state.assessment);
  const resetAssessment = useAssessmentStore((state) => state.resetAssessment);
  const childName = assessment.child.name.trim() || "Child";
  const classification = getMuacClassification(assessment.muac.measurement);

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace("/danger_signs/danger_sign_diarrhea_vomiting");
  };

  const handleFinish = () => {
    resetAssessment();
    router.replace("/home");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <AssessmentHeader
          title="Diagnosis Results and Referral"
          onBack={handleBack}
        />

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View
            style={[
              styles.resultPanel,
              { backgroundColor: classification.accentColor },
            ]}
          >
            <Text style={styles.resultLabel}>Classification Result</Text>

            <View style={styles.resultCenter}>
              <Text style={styles.childName}>{childName}</Text>
              <Text style={styles.classificationText}>
                {classification.label}
              </Text>
              <Text style={styles.resultDescription}>
                {classification.actionText}
              </Text>
            </View>
          </View>

          <View style={styles.actionsSection}>
            <Text style={styles.actionsTitle}>Recommended CHW Actions</Text>
          </View>

          <View style={styles.actionsBody}>
            {recommendedChwActions.map((action) => (
              <View key={action.label} style={styles.actionRow}>
                <View
                  style={[
                    styles.actionDot,
                    { backgroundColor: action.accentColor },
                  ]}
                />
                <Text style={styles.actionText}>
                  <Text style={styles.actionLabel}>{action.label}</Text>
                  <Text>{` → ${action.actionText}`}</Text>
                </Text>
              </View>
            ))}
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <NextButton title="Finish Assessment" onPress={handleFinish} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background.main,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background.main,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  resultPanel: {
    minHeight: 360,
    paddingHorizontal: 26,
    paddingTop: 34,
    paddingBottom: 28,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.1)",
  },
  resultLabel: {
    color: colors.brand.black,
    fontSize: 16,
    fontWeight: "700",
  },
  resultCenter: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 40,
    gap: 18,
  },
  childName: {
    color: colors.brand.black,
    fontSize: 54,
    fontWeight: "800",
    textAlign: "center",
  },
  classificationText: {
    color: colors.brand.black,
    fontSize: 26,
    fontWeight: "700",
    textAlign: "center",
  },
  resultDescription: {
    color: colors.brand.black,
    fontSize: 16,
    lineHeight: 24,
    textAlign: "center",
    paddingHorizontal: 8,
  },
  actionsSection: {
    backgroundColor: "#EEF3FB",
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#DBE2EC",
  },
  actionsTitle: {
    color: colors.text.primary,
    fontSize: 17,
    fontWeight: "700",
  },
  actionsBody: {
    backgroundColor: "#EEF3FB",
    paddingHorizontal: 24,
    paddingTop: 18,
    paddingBottom: 28,
    gap: 22,
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  actionDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginTop: 2,
  },
  actionText: {
    flex: 1,
    color: colors.text.primary,
    fontSize: 16,
    lineHeight: 24,
  },
  actionLabel: {
    fontWeight: "800",
  },
  footer: {
    backgroundColor: colors.primary.teal,
    paddingHorizontal: 24,
    paddingVertical: 18,
    alignItems: "flex-end",
  },
});
