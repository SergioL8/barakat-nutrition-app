import { colors } from "../theme/theme";

export type MuacClassification = {
  label: "Healthy" | "Stunted" | "Wasted" | "MAM" | "SAM";
  accentColor: string;
  actionText: string;
};

const muacClassifications: MuacClassification[] = [
  {
    label: "Healthy",
    accentColor: "#1DBA2F",
    actionText:
      "Provide caregiver guidance on good nutrition and hygiene. (Future version: caregivers can opt into WhatsApp nutrition education.)",
  },
  {
    label: "Stunted",
    accentColor: "#ffe100",
    actionText:
      "Explain that height-for-age is low from long-term malnutrition; reinforce caregiver nutrition education and schedule follow-up growth monitoring.",
  },
  {
    label: "Wasted",
    accentColor: "#ffb300",
    actionText:
      "Record as acute malnutrition; arrange close follow-up within one week and discuss feeding support with supervisor or doctor.",
  },
  {
    label: "MAM",
    accentColor: "#e96d00",
    actionText:
      "Enroll in Outpatient Treatment (OTP); provide or arrange RUSF/RUTF and set a follow-up visit with the doctor’s guidance.",
  },
  {
    label: "SAM",
    accentColor: "#D62828",
    actionText:
      "Urgent referral for inpatient or stabilization-center care (IPD).",
  },
];

export const recommendedChwActions = muacClassifications;

export function getMuacClassification(
  muacMeasurement: number | null,
): MuacClassification {
  if (muacMeasurement === null) {
    return {
      label: "Healthy",
      accentColor: colors.status.success,
      actionText:
        "Provide caregiver guidance on good nutrition and hygiene. (Future version: caregivers can opt into WhatsApp nutrition education.)",
    };
  }

  if (muacMeasurement > 13.5) {
    return muacClassifications[0];
  }

  if (muacMeasurement > 12) {
    return muacClassifications[1];
  }

  if (muacMeasurement > 11) {
    return muacClassifications[2];
  }

  if (muacMeasurement > 10) {
    return muacClassifications[3];
  }

  return muacClassifications[4];
}
