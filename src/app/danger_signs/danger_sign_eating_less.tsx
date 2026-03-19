import { router } from "expo-router";
import React from "react";
import DangerSignQuestionScreen from "../../components/DangerSignQuestionScreen";

export default function DangerSignEatingLess() {
  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace("/hair_skin_review");
  };

  const handleNext = () => {
    router.push("/danger_signs/danger_sign_unusually_sleepy");
  };

  return (
    <DangerSignQuestionScreen
      question="Has the child been eating less than usual or refusing to eat or drink?"
      dangerKey="eatingLess"
      onBack={handleBack}
      onNext={handleNext}
    />
  );
}
