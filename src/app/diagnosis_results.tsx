import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AssessmentHeader from "../components/AssessmentHeader";
import NextButton from "../components/NextButton";
import type { DangerSigns } from "../state_management/Assessment";
import { useAssessmentStore } from "../state_management/AssessmentFunctions";
import { colors } from "../theme/theme";
import {
  getDiagnosisResult,
  getRecommendedChwAction,
  getStuntingRecommendedAction,
  getStuntingStatusLabel,
  getWastingRecommendedAction,
  getWastingStatusLabel,
} from "../utils/getDiagnosis";

const dangerSignMetadata: { key: keyof DangerSigns; text: string }[] = [
  {
    key: "eatingLess",
    text: "The child has been eating less than usual or refusing to eat or drink.",
  },
  {
    key: "unusuallySleepy",
    text: "The child is very weak, unusually sleepy, or difficult to wake up.",
  },
  {
    key: "dehydrated",
    text: "The child looks dehydrated with sunken eyes or slow skin return after a pinch.",
  },
  {
    key: "fever",
    text: "The child has fever or feels unusually cold to touch.",
  },
  {
    key: "breathingDifficulty",
    text: "The child is breathing faster than normal or having trouble breathing.",
  },
  {
    key: "skinInfection",
    text: "The child has sores, swelling, or a visible skin infection.",
  },
  {
    key: "diarrheaVomiting",
    text: "The child has had diarrhea or vomiting in the last few days.",
  },
];

export default function DiagnosisResults() {
  const assessment = useAssessmentStore((state) => state.assessment);
  const resetAssessment = useAssessmentStore((state) => state.resetAssessment);
  const setDiagnosis = useAssessmentStore((state) => state.setDiagnosis);
  const childName = assessment.child.name.trim() || "Child";

  const diagnosis = getDiagnosisResult(
    assessment.muac.measurement,
    assessment.edema.dentRemain,
    assessment.child.age,
    assessment.child.height,
    assessment.child.weight,
    assessment.child.gender,
  );
  const recommendedAction = getRecommendedChwAction(diagnosis.healthStatus);
  const stuntingRecommendedAction = getStuntingRecommendedAction(
    diagnosis.stuntingStatus,
  );
  const wastingRecommendedAction = getWastingRecommendedAction(
    diagnosis.wastingStatus,
  );
  const stuntingStatusLabel = getStuntingStatusLabel(diagnosis.stuntingStatus);
  const wastingStatusLabel = getWastingStatusLabel(diagnosis.wastingStatus);
  const trueDangerSigns = dangerSignMetadata.filter(
    ({ key }) => assessment.dangerSigns[key] === "yes",
  );

  console.log("Diagnosis in diagnosis_results.tsx: ", diagnosis);

  useEffect(() => {
    setDiagnosis({
      healthStatus: diagnosis.healthStatus,
      heightForAgeZScore: diagnosis.heightForAgeZScore,
      stuntingStatus: diagnosis.stuntingStatus,
      weightForHeightZScore: diagnosis.weightForHeightZScore,
      wastingStatus: diagnosis.wastingStatus,
    });
  }, [
    diagnosis.healthStatus,
    diagnosis.heightForAgeZScore,
    diagnosis.stuntingStatus,
    diagnosis.weightForHeightZScore,
    diagnosis.wastingStatus,
    setDiagnosis,
  ]);

  console.log(
    "Zustand Model Completed:",
    useAssessmentStore.getState().assessment,
  );

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
              { backgroundColor: diagnosis.accentColor },
            ]}
          >
            <Text style={styles.resultLabel}>Classification Result</Text>

            <View style={styles.resultCenter}>
              <Text style={styles.childName}>{childName}</Text>
              <Text style={styles.classificationText}>
                {diagnosis.displayLabel}
              </Text>
              <Text style={styles.resultDescription}>
                {stuntingStatusLabel}
              </Text>
              <Text style={styles.resultDescription}>{wastingStatusLabel}</Text>
            </View>
          </View>

          <View style={styles.actionsSection}>
            <Text style={styles.actionsTitle}>Recommended CHW Action</Text>
          </View>

          <View style={styles.actionsBody}>
            <View style={styles.actionRow}>
              <View
                style={[
                  styles.actionDot,
                  { backgroundColor: recommendedAction.accentColor },
                ]}
              />
              <Text style={styles.actionText}>
                <Text style={styles.actionLabel}>
                  {recommendedAction.label}
                </Text>
                <Text>{` → ${recommendedAction.actionText}`}</Text>
              </Text>
            </View>

            {stuntingRecommendedAction ? (
              <View style={styles.actionRow}>
                <View
                  style={[
                    styles.actionDot,
                    { backgroundColor: stuntingRecommendedAction.accentColor },
                  ]}
                />
                <Text style={styles.actionText}>
                  <Text style={styles.actionLabel}>
                    {stuntingRecommendedAction.label}
                  </Text>
                  <Text>{` → ${stuntingRecommendedAction.actionText}`}</Text>
                </Text>
              </View>
            ) : null}

            {wastingRecommendedAction ? (
              <View style={styles.actionRow}>
                <View
                  style={[
                    styles.actionDot,
                    { backgroundColor: wastingRecommendedAction.accentColor },
                  ]}
                />
                <Text style={styles.actionText}>
                  <Text style={styles.actionLabel}>
                    {wastingRecommendedAction.label}
                  </Text>
                  <Text>{` → ${wastingRecommendedAction.actionText}`}</Text>
                </Text>
              </View>
            ) : null}
          </View>

          {trueDangerSigns.length > 0 ? (
            <>
              <View style={styles.actionsSection}>
                <Text style={styles.actionsTitle}>Danger Signs</Text>
              </View>

              <View style={styles.dangerSignsBody}>
                {trueDangerSigns.map((dangerSign) => (
                  <View key={dangerSign.key} style={styles.actionRow}>
                    <MaterialCommunityIcons
                      name="alert-outline"
                      size={24}
                      color={colors.status.danger}
                      style={styles.dangerIcon}
                    />
                    <Text style={styles.actionText}>{dangerSign.text}</Text>
                  </View>
                ))}
              </View>
            </>
          ) : null}
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
    paddingVertical: 8,
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
  dangerSignsBody: {
    backgroundColor: "#EEF3FB",
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 0,
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
  dangerIcon: {
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
