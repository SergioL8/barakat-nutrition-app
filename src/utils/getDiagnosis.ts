import { lhfaBoys } from "../data/lhfaBoys";
import { lhfaGirls } from "../data/lhfaGirls";
import { wfhBoys } from "../data/wfhBoys";
import { wfhGirls } from "../data/wfhGirls";
import { wflBoys } from "../data/wflBoys";
import { wflGirls } from "../data/wflGirls";
import type {
  Assessment,
  DiagnosisAssessment,
  HealthStatus,
  StuntingStatus,
  WastingStatus,
  YesNoUnsure,
} from "../state_management/Assessment";
import { colors } from "../theme/theme";

export type HealthStatusPresentation = {
  label: HealthStatus;
  accentColor: string;
  actionText: string;
};

export type RecommendedAction = {
  label: string;
  accentColor: string;
  actionText: string;
};

export type DiagnosisResult = DiagnosisAssessment & {
  displayLabel: HealthStatus | "Stunted";
  accentColor: string;
  actionText: string;
};

const healthStatusPresentations: Record<
  HealthStatus,
  HealthStatusPresentation
> = {
  Healthy: {
    label: "Healthy",
    accentColor: "#00c203",
    actionText: "Provide caregiver guidance on good nutrition and hygiene.",
  },
  MAM: {
    label: "MAM",
    accentColor: "#f77c12",
    actionText:
      "Enroll in Outpatient Treatment (OTP); provide or arrange RUSF/RUTF and set a follow-up visit with the doctor’s guidance.",
  },
  SAM: {
    label: "SAM",
    accentColor: "#ff3232",
    actionText:
      "Urgent referral for inpatient or stabilization-center care (IPD).",
  },
};

export const recommendedChwActions = Object.values(healthStatusPresentations);

export function getRecommendedChwAction(
  healthStatus: HealthStatus,
): HealthStatusPresentation {
  return healthStatusPresentations[healthStatus];
}

export function getStuntingRecommendedAction(
  stuntingStatus: StuntingStatus,
): RecommendedAction | null {
  switch (stuntingStatus) {
    case "moderately-stunted":
      return {
        label: "Moderately stunted",
        accentColor: "#6AC0CA",
        actionText: "Placeholder action for moderately stunted children.",
      };
    case "severely-stunted":
      return {
        label: "Severely stunted",
        accentColor: "#6AC0CA",
        actionText: "Placeholder action for severely stunted children.",
      };
    case "not-stunted":
    case "unknown":
      return null;
  }
}

export function getWastingRecommendedAction(
  wastingStatus: WastingStatus,
): RecommendedAction | null {
  switch (wastingStatus) {
    case "moderately-wasted":
      return {
        label: "Moderately wasted (WHZ)",
        accentColor: "#f77c12",
        actionText:
          "Support MAM management and arrange close follow-up per protocol.",
      };
    case "severely-wasted":
      return {
        label: "Severely wasted (WHZ)",
        accentColor: "#ff3232",
        actionText:
          "Urgent SAM referral and stabilization per local treatment protocol.",
      };
    case "not-wasted":
    case "unknown":
      return null;
  }
}

function getPrimaryHealthStatus(
  muacMeasurement: number | null,
  edemaDentRemain: YesNoUnsure | null,
): HealthStatus {
  if (edemaDentRemain === "yes") {
    return "SAM";
  }

  if (muacMeasurement === null) {
    return "Healthy";
  }

  if (muacMeasurement < 11.5) {
    return "SAM";
  }

  if (muacMeasurement < 12.5) {
    return "MAM";
  }

  return "Healthy";
}

function getHealthStatusFromWastingStatus(wastingStatus: WastingStatus): HealthStatus {
  if (wastingStatus === "severely-wasted") {
    return "SAM";
  }

  if (wastingStatus === "moderately-wasted") {
    return "MAM";
  }

  return "Healthy";
}

const healthStatusSeverity: Record<HealthStatus, number> = {
  Healthy: 0,
  MAM: 1,
  SAM: 2,
};

export function getHealthStatus(
  muacMeasurement: number | null,
  edemaDentRemain: YesNoUnsure | null,
  wastingStatus: WastingStatus,
): HealthStatus {
  const primaryStatus = getPrimaryHealthStatus(muacMeasurement, edemaDentRemain);
  const wastingStatusAsHealth = getHealthStatusFromWastingStatus(wastingStatus);

  return healthStatusSeverity[primaryStatus] >= healthStatusSeverity[wastingStatusAsHealth]
    ? primaryStatus
    : wastingStatusAsHealth;
}

export function getHeightForAgeZScore(
  ageMonths: number | null,
  heightCm: number | null,
  gender: Assessment["child"]["gender"],
): number | null {
  if (ageMonths === null || heightCm === null || gender === null) {
    return null;
  }

  if (!Number.isInteger(ageMonths) || ageMonths < 0 || ageMonths > 60) {
    return null;
  }

  const referenceTable = gender === "male" ? lhfaBoys : lhfaGirls;
  const reference = referenceTable[ageMonths];

  if (reference === undefined || reference.month !== ageMonths) {
    return null;
  }

  if (reference.l === 0) {
    return Math.log(heightCm / reference.m) / reference.s;
  }

  return (
    ((heightCm / reference.m) ** reference.l - 1) /
    (reference.l * reference.s)
  );
}

function getWeightForHeightReference(
  ageMonths: number,
  heightCm: number,
  gender: Assessment["child"]["gender"],
) {
  const normalizedHeight = Math.round(heightCm * 2) / 2;

  const table =
    ageMonths < 24
      ? gender === "male"
        ? wflBoys
        : wflGirls
      : gender === "male"
        ? wfhBoys
        : wfhGirls;

  const heightKey = normalizedHeight.toFixed(1);

  return (
    table.find((row) => row.measurementCm.toFixed(1) === heightKey) ?? null
  );
}

export function getWeightForHeightZScore(
  ageMonths: number | null,
  heightCm: number | null,
  weightKg: number | null,
  gender: Assessment["child"]["gender"],
): number | null {
  if (
    ageMonths === null ||
    heightCm === null ||
    weightKg === null ||
    gender === null
  ) {
    return null;
  }

  if (!Number.isInteger(ageMonths) || ageMonths < 0 || ageMonths > 60) {
    return null;
  }

  const reference = getWeightForHeightReference(ageMonths, heightCm, gender);

  if (reference === null) {
    return null;
  }

  if (reference.l === 0) {
    return Math.log(weightKg / reference.m) / reference.s;
  }

  return (
    ((weightKg / reference.m) ** reference.l - 1) /
    (reference.l * reference.s)
  );
}

export function getStuntingStatus(
  heightForAgeZScore: number | null,
): StuntingStatus {
  if (heightForAgeZScore === null) {
    return "unknown";
  }
  if (heightForAgeZScore < -3) {
    return "severely-stunted";
  }
  if (heightForAgeZScore < -2) {
    return "moderately-stunted";
  }
  return "not-stunted";
}

export function getWastingStatus(
  weightForHeightZScore: number | null,
): WastingStatus {
  if (weightForHeightZScore === null) {
    return "unknown";
  }

  if (weightForHeightZScore < -3) {
    return "severely-wasted";
  }

  if (weightForHeightZScore < -2) {
    return "moderately-wasted";
  }

  return "not-wasted";
}

export function getStuntingStatusLabel(stuntingStatus: StuntingStatus): string {
  switch (stuntingStatus) {
    case "not-stunted":
      return "Not stunted";
    case "moderately-stunted":
      return "Moderately stunted";
    case "severely-stunted":
      return "Severely stunted";
    case "unknown":
      return "Unknown stunted status";
  }
}

export function getWastingStatusLabel(wastingStatus: WastingStatus): string {
  switch (wastingStatus) {
    case "not-wasted":
      return "Not wasted";
    case "moderately-wasted":
      return "Moderately wasted";
    case "severely-wasted":
      return "Severely wasted";
    case "unknown":
      return "Unknown wasting status";
  }
}

export function getDiagnosisResult(
  muacMeasurement: number | null,
  edemaDentRemain: YesNoUnsure | null,
  childAgeMonths: number | null,
  childHeightCm: number | null,
  childWeightKg: number | null,
  childGender: Assessment["child"]["gender"],
): DiagnosisResult {
  const heightForAgeZScore = getHeightForAgeZScore(
    childAgeMonths,
    childHeightCm,
    childGender,
  );
  const stuntingStatus = getStuntingStatus(heightForAgeZScore);

  const weightForHeightZScore = getWeightForHeightZScore(
    childAgeMonths,
    childHeightCm,
    childWeightKg,
    childGender,
  );
  const wastingStatus = getWastingStatus(weightForHeightZScore);

  const healthStatus = getHealthStatus(
    muacMeasurement,
    edemaDentRemain,
    wastingStatus,
  );

  const presentation = healthStatusPresentations[healthStatus];
  const isHealthyButStunted =
    healthStatus === "Healthy" &&
    (stuntingStatus === "moderately-stunted" ||
      stuntingStatus === "severely-stunted");
  const displayLabel = isHealthyButStunted ? "Stunted" : healthStatus;
  const accentColor = isHealthyButStunted
    ? colors.status.info
    : presentation.accentColor;

  return {
    healthStatus,
    heightForAgeZScore,
    stuntingStatus,
    weightForHeightZScore,
    wastingStatus,
    displayLabel,
    accentColor,
    actionText: presentation.actionText,
  };
}
