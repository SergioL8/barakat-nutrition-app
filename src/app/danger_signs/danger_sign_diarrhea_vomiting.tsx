import { router } from "expo-router";
import React from "react";
import DangerSignQuestionScreen from "../../components/DangerSignQuestionScreen";

export default function DangerSignDiarrheaVomiting() {
  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace("/danger_signs/danger_sign_skin_infection");
  };

  const handleNext = () => {
    router.push("/diagnosis_results");
  };

  return (
    <DangerSignQuestionScreen
      question="Has the child had diarrhea or vomiting in the last few days?"
      dangerKey="diarrheaVomiting"
      onBack={handleBack}
      onNext={handleNext}
    />
  );
}
