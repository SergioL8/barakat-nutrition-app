# Project Overview

- React Native / Expo app for a malnutrition assessment workflow.
- Main flow:
  1. Home
  2. Parent/child information
  3. MUAC instruction -> camera -> review
  4. Edema instruction -> camera -> review
  5. Hair/skin instruction -> camera -> review
  6. 7 danger-sign yes/no screens
  7. Final diagnosis / referral screen
- State is stored in Zustand until the end of the assessment.

# Tech Stack

- Expo Router for navigation
- React Native
- Zustand for app state
- `expo-camera` for photo/video capture
- `expo-video` for review playback of captured video

# Architecture / Structure

- Routes live in `src/app`.
- Reusable UI components live in `src/components`.
- Zustand model/store:
  - `src/state_management/Assessment.ts`
  - `src/state_management/AssessmentFunctions.ts`
  - `src/state_management/EmptyAssessment.ts`
- Validation helpers live in `src/validation`.
- Media persistence helper lives in `src/services/photoCaptureFlow.ts`.
- Small pure business logic helper for diagnosis:
  - `src/utils/getMuacClassification.ts`

# Key Components

- `AssessmentHeader`
  - Shared app bar for non-home, non-camera screens.
  - Includes back button, centered title, and `assets/icon_gold.png`.
- `InstructionComponentScreen`
  - Shared instruction-step layout for MUAC / edema / hair.
- `CameraComponentScreen`
  - Shared camera screen for photo and video capture.
  - Photo uses external `onCapturePress`.
  - Video manages record/stop internally and calls `onVideoRecorded`.
- `CapturedMediaPreview`
  - Image preview for MUAC/hair review screens.
- `CapturedVideoPreview`
  - Video preview using `expo-video` for edema review.
- `DangerSignQuestionScreen`
  - Shared yes/no danger-sign screen.
  - Immediate save to Zustand on `Yes`/`No`.

# Key Decisions

- Expo Router is used with explicit route files under `src/app`.
- Reusable screen-level components were preferred over large config maps.
- Parsing/validation is done in UI-layer validation helpers, not in Zustand store actions.
- Store actions are intentionally focused:
  - `setMuacPhotoUri`
  - `setMuacMeasurement`
  - `setEdemaVideoUri`
  - `setEdemaDentRemain`
  - `setHairPhotoUri`
  - `setHairIssue`
  - `setDangerSign`
- Parent address was changed from a single string to a nested object:
  - `parent.address.streetAddress`
  - `parent.address.city`
  - `parent.address.province`
  - `parent.address.country`
- Address validation is group-based:
  - all four blank is allowed
  - if any one is filled, all four become required
- `weight` and `height` are optional in the first form.
- Danger signs are modeled as 7 separate route files that all reuse one component.
- Final diagnosis is currently based only on MUAC.

# Current State

- Implemented routes:
  - `src/app/home.tsx`
  - `src/app/parent_child_information.tsx`
  - `src/app/muac_instructions.tsx`
  - `src/app/muac_camera.tsx`
  - `src/app/muac_review.tsx`
  - `src/app/edema_instructions.tsx`
  - `src/app/edema_camera.tsx`
  - `src/app/edema_review.tsx`
  - `src/app/hair_skin_instructions.tsx`
  - `src/app/hair_skin_camera.tsx`
  - `src/app/hair_skin_review.tsx`
  - `src/app/danger_signs/*`
  - `src/app/diagnosis_results.tsx`
- Home screen:
  - contains `multicolor_logo.png` between welcome text and CTA
  - bottom nav exists only on `/home` and `/PlaceHolderScreen`
- Parent/child form:
  - uses structured parent address
  - uses popup validation only
- MUAC review:
  - image preview
  - measurement input
  - validation required
- Edema review:
  - video preview
  - `Yes/No/Unsure`
- Hair/skin review:
  - image preview
  - `Yes/No/Unsure`
- Danger-sign flow:
  - 7 route files under `src/app/danger_signs`
  - first question entered from `hair_skin_review`
  - last question routes to diagnosis screen
- Diagnosis screen:
  - reads child name and MUAC from Zustand
  - computes classification from MUAC only
  - shows static CHW actions list
  - `Finish Assessment` resets Zustand and returns to `/home`

# Current Data Model

- `ParentInformation`
  - `name`
  - `phone`
  - `address: { streetAddress, city, province, country }`
  - `whatsappOptIn`
- `ChildInformation`
  - `name`
  - `age`
  - `weight`
  - `height`
  - `gender`
- `MuacAssessment`
  - `photoUri`
  - `measurement`
- `EdemaAssessment`
  - `videoUri`
  - `dentRemain`
- `HairAssessment`
  - `photoUri`
  - `hairIssue`
- `DangerSigns`
  - `eatingLess`
  - `unusuallySleepy`
  - `dehydrated`
  - `fever`
  - `breathingDifficulty`
  - `skinInfection`
  - `diarrheaVomiting`

# Known Issues / Open Problems

- Diagnosis logic only uses MUAC right now; edema/hair/danger-signs are not part of the classification yet.
- Some screen naming/history is inconsistent from earlier iterations:
  - `PlaceHolderScreen` still exists as a temporary route
  - older route naming was moved around; danger-sign pages now live in `src/app/danger_signs`
- The app currently depends on captured media being saved locally and stored as URI in Zustand until end-of-flow upload; Supabase upload has not been implemented.

# Next Steps

- Replace remaining temporary uses of `PlaceHolderScreen`.
- Implement upload/persistence strategy at end of assessment (likely Supabase).
- Expand diagnosis logic beyond MUAC if needed.
- Add any missing review/summary or saved-progress behavior.

# Constraints / Preferences

- User prefers:
  - pragmatic minimal changes
  - reusable screen components over heavy abstraction/config maps
  - popup validation (`Alert.alert`) instead of inline field styling
  - explicit route files are acceptable
- Use theme colors already defined in `src/theme/theme.ts`.
- Avoid unnecessary dependencies and redundant styles.
- Keep logs / summaries concise and optimized for fast handoff to another AI. Only update logfile when prompted to do so.
