import { router } from "expo-router";
import React from "react";
import DangerSignQuestionScreen from "../../components/DangerSignQuestionScreen";

export default function DangerSignUnusuallySleepy() {
  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace("/danger_signs/danger_sign_eating_less");
  };

  const handleNext = () => {
    router.push("/danger_signs/danger_sign_dehydrated");
  };

  return (
    <DangerSignQuestionScreen
      question="Is the child very weak, unusually sleepy, or difficult to wake up?"
      dangerKey="unusuallySleepy"
      onBack={handleBack}
      onNext={handleNext}
    />
  );
}
