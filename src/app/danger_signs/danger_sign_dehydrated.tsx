import { router } from "expo-router";
import React from "react";
import DangerSignQuestionScreen from "../../components/DangerSignQuestionScreen";

export default function DangerSignDehydrated() {
  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace("/danger_signs/danger_sign_unusually_sleepy");
  };

  const handleNext = () => {
    router.push("/danger_signs/danger_sign_fever");
  };

  return (
    <DangerSignQuestionScreen
      question="Does the child look dehydrated with sunken eyes or slow skin return after a pinch?"
      dangerKey="dehydrated"
      onBack={handleBack}
      onNext={handleNext}
    />
  );
}
