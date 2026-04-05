# Project Overview

- React Native / Expo app for a child malnutrition assessment workflow.
- Assessment flow:
  1. Home
  2. Parent/child information
  3. MUAC instruction -> camera -> review
  4. Edema instruction -> camera -> review
  5. Hair/skin instruction -> camera -> review
  6. 7 danger-sign yes/no screens
  7. Final diagnosis / referral screen
- State lives in Zustand until `Finish Assessment`, which resets the assessment and returns to `/home`.
- Tech stack:
  - Expo Router
  - React Native
  - Zustand
  - `expo-camera`
  - `expo-video`
  - `@expo/vector-icons`

# Architecture / Structure

- Routes: `src/app`
- Reusable UI components: `src/components`
- Zustand assessment model/store:
  - `src/state_management/Assessment.ts`
  - `src/state_management/AssessmentFunctions.ts`
  - `src/state_management/EmptyAssessment.ts`
- Validation helpers: `src/validation`
- Diagnosis/business logic: `src/utils/getDiagnosis.ts`
- WHO HAZ reference data:
  - `src/data/lhfaBoys.ts`
  - `src/data/lhfaGirls.ts`
  - `src/data/lhfaTypes.ts`

- Diagnosis flow:
  - `diagnosis_results.tsx` computes diagnosis from current assessment inputs via `getDiagnosisResult(...)`
  - It then persists `assessment.diagnosis` using `setDiagnosis(...)`
  - The screen renders from the just-computed `diagnosis` object, not from a second read of `assessment.diagnosis`

# Key Decisions

- Explicit route files are preferred over large config abstractions.
- Validation/parsing stays in UI-layer helpers instead of Zustand actions.
- Popup validation (`Alert.alert`) is preferred over inline error styling.
- Reusable screen-level components are preferred over config maps.

- Parent address is structured:
  - `parent.address.streetAddress`
  - `parent.address.city`
  - `parent.address.province`
  - `parent.address.country`
- Address validation rule:
  - all address fields blank is allowed
  - if any address field is filled, all address fields become required

- Current diagnosis data model:
  - `healthStatus`: `"Healthy" | "MAM" | "SAM"`
  - `heightForAgeZScore`: `number | null`
  - `stuntingStatus`: `"not-stunted" | "moderately-stunted" | "severely-stunted" | "unknown"`
- This computed diagnosis is persisted in `assessment.diagnosis`.

- Health status logic:
  - edema `yes` => `SAM`
  - else MUAC `< 11.5` => `SAM`
  - else MUAC `< 12.5` => `MAM`
  - else => `Healthy`

- Stunting logic:
  - Uses WHO height-for-age LMS tables for boys/girls, months `0..60`
  - Age must be a whole number for intake validation
  - HAZ returns `null` if age/height/gender is missing, age is non-integer, or age is outside `0..60`
  - Thresholds:
    - `HAZ >= -2` => `not-stunted`
    - `-3 <= HAZ < -2` => `moderately-stunted`
    - `HAZ < -3` => `severely-stunted`

- Display-only diagnosis override:
  - If `healthStatus === "Healthy"` and `stuntingStatus` is moderate or severe:
    - main diagnosis label becomes `Stunted`
    - diagnosis box color becomes `colors.status.info`
  - Stored `healthStatus` remains `Healthy`

- Final diagnosis UI behavior:
  - Colored diagnosis box shows:
    - child name
    - display label (`Healthy` / `MAM` / `SAM` / display-only `Stunted`)
    - stunting line (`Not stunted`, `Moderately stunted`, `Severely stunted`, or unknown text)
  - `Recommended CHW Action` section:
    - always shows one row for underlying `healthStatus`
    - conditionally adds a second light-blue stunting row for moderate/severe stunting
    - stunting action text is placeholder
  - `Danger Signs` section:
    - appears only if any danger-sign answer is `yes`
    - shows only true signs, in questionnaire order
    - rows use a red `alert-outline` triangle icon and plain statement text

# Current State

- Implemented routes include:
  - `src/app/home.tsx`
  - `src/app/parent_child_information.tsx`
  - `src/app/muac_*`
  - `src/app/edema_*`
  - `src/app/hair_skin_*`
  - `src/app/danger_signs/*`
  - `src/app/diagnosis_results.tsx`

- Parent/child form:
  - popup validation only
  - `age` must be a whole number `>= 0`
  - `gender` is required
  - `weight` and `height` remain optional

- Current Zustand sections:
  - `parent`
  - `child`
  - `muac`
  - `edema`
  - `hair`
  - `dangerSigns`
  - `diagnosis`

- Diagnosis screen currently:
  - computes from MUAC + edema + age + height + gender
  - persists `assessment.diagnosis`
  - shows a health-status CHW action row
  - optionally shows a second stunting CHW action row
  - optionally shows a `Danger Signs` section with only true signs

- Danger-sign summary text is currently statement-style, not question-style.

# Known Issues / Open Problems

- Hair/skin review and danger signs do not currently affect diagnosis computation itself; danger signs are presentation-only on the final screen.
- Stunting-specific recommended action text is still placeholder copy.
- `diagnosis_results.tsx` still contains debug `console.log(...)` calls.
- `getStuntingStatusLabel()` has a typo for the unknown state:
  - `"Unknonw stunted status"`
- `recommendedChwActions` is still exported from `getDiagnosis.ts` but is no longer used by the diagnosis screen.
- `src/app/PlaceHolderScreen.tsx` still exists.
- No test files are currently present in `src`.
- Captured media is still stored locally as URIs in Zustand; end-of-flow upload/persistence is not implemented.

# Next Steps

- Replace placeholder stunting recommendation copy with final text.
- Decide whether danger signs should affect diagnosis/referral logic, not just the final-screen summary.
- Remove diagnosis-screen debug logs.
- Fix the unknown stunting label typo.
- Add tests for:
  - HAZ computation
  - stunting thresholds
  - `Healthy` -> `Stunted` display override
  - whole-month age validation
  - danger-sign summary rendering rules
- Clean up unused exports / temporary routes if no longer needed.
- Implement end-of-flow upload/persistence strategy (likely Supabase).

# Constraints / Preferences

- User preferences:
  - pragmatic minimal changes
  - reusable screen components over heavy abstraction/config maps
  - popup validation (`Alert.alert`) instead of inline field styling
  - explicit route files are acceptable
- Prefer existing theme colors from `src/theme/theme.ts`.
- Avoid unnecessary dependencies and redundant styles.
- Keep logs concise and optimized for fast AI handoff.
