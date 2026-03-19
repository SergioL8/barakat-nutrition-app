import { router } from "expo-router";
import React from "react";
import DangerSignQuestionScreen from "../../components/DangerSignQuestionScreen";

export default function DangerSignBreathingDifficulty() {
  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace("/danger_signs/danger_sign_fever");
  };

  const handleNext = () => {
    router.push("/danger_signs/danger_sign_skin_infection");
  };

  return (
    <DangerSignQuestionScreen
      question="Is the child breathing faster than normal or having trouble breathing?"
      dangerKey="breathingDifficulty"
      onBack={handleBack}
      onNext={handleNext}
    />
  );
}
