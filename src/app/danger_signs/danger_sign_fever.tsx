import { router } from "expo-router";
import React from "react";
import DangerSignQuestionScreen from "../../components/DangerSignQuestionScreen";

export default function DangerSignFever() {
  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace("/danger_signs/danger_sign_dehydrated");
  };

  const handleNext = () => {
    router.push("/danger_signs/danger_sign_breathing_difficulty");
  };

  return (
    <DangerSignQuestionScreen
      question="Does the child have fever or feel unusually cold to touch?"
      dangerKey="fever"
      onBack={handleBack}
      onNext={handleNext}
    />
  );
}
