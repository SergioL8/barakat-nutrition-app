import { router } from "expo-router";
import React from "react";
import DangerSignQuestionScreen from "../../components/DangerSignQuestionScreen";

export default function DangerSignSkinInfection() {
  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace("/danger_signs/danger_sign_breathing_difficulty");
  };

  const handleNext = () => {
    router.push("/danger_signs/danger_sign_diarrhea_vomiting");
  };

  return (
    <DangerSignQuestionScreen
      question="Does the child have any sores swelling, or visible skin infection?"
      dangerKey="skinInfection"
      onBack={handleBack}
      onNext={handleNext}
    />
  );
}
