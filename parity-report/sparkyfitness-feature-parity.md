# SparkyFitness: Web ↔ Mobile and iOS ↔ Android feature parity

> Source: static analysis of `SparkyFitnessFrontend/` (web) and `SparkyFitnessMobile/` (Expo/React Native) on `main` @ `5364674f`. Every difference was re-checked by two adversarial verifiers (one tries to prove that an "absent" feature actually exists; the other that a "present" feature is really reachable from the UI). The full matrix with all evidence is in the accompanying CSV.

## Updates since the analysis (2026-10-26)

The analysis below reflects `main` @ `5364674f` and is left as it was. Rows that later work changes carry a note under them, labelled with the merged PRs that changed them (**Updated in PR …** or **Partly covered by PR …**), or **Still open** for work that was planned and has not been done. In the CSV the same notes are in two extra columns, `update_status` and `update_notes`. The counts in sections 0 to 3 are not recalculated.

The notes cover everything merged into `main` up to `e5547e39f` (26 Oct 2026): 179 pull requests from 23 contributors, translation syncs and maintenance included. The 53 merged up to 20 Oct ship in v1.9.0; the other 126 are on `main` but not in a release yet. 173 rows carry a note, and the 27 new features that no row covers are listed after this section. The main changes for parity:

- **Wear OS app** ([#3052](https://github.com/CodeWithCJ/SparkyFitness/pull/3052)): Android now has a watch app too, the counterpart of the Apple Watch app. It has the same pages (goals, water, medications, weight and trend, workout with Now Playing, fasting and steps) and the same seven complications, runs strength workouts, records runs and walks on its own, works as a remote for the phone's GPS recording and sends live heart rate, so the heart rate alerts and the "Record with" choice now also appear on Android. Still Apple Watch only: following saved routes, Jump Rope, double tap, the effort rating at the end of a workout and saving workouts to a health app; per-set RPE on Wear OS goes from 5 to 10. Both watch apps' own texts are in English only.
- **Android quick access and widgets** ([#2989](https://github.com/CodeWithCJ/SparkyFitness/pull/2989), [#3020](https://github.com/CodeWithCJ/SparkyFitness/pull/3020), [#3021](https://github.com/CodeWithCJ/SparkyFitness/pull/3021)): the same four app icon quick actions as iOS; four Quick Settings tiles (Log water, Scan barcode, Search food and Calories left) as the counterpart of the Control Center controls; a water widget with − / + that logs without opening the app; and widgets that follow the app language. The tile names and the water widget are translated into 6 of the 15 languages the app ships besides English (Spanish, Polish, Brazilian Portuguese, Cantonese, and Simplified and Traditional Chinese).
- **The web catches up with mobile:** progress photo comparison and time-lapse ([#2965](https://github.com/CodeWithCJ/SparkyFitness/pull/2965)); run and walk training programs with a month calendar, without the guide, the reference paces or creating and editing plans ([#2948](https://github.com/CodeWithCJ/SparkyFitness/pull/2948)); and read-only fitness test results with their training paces ([#3154](https://github.com/CodeWithCJ/SparkyFitness/pull/3154)).
- **Mobile catches up with the web:** custom measurement categories in Settings ([#3194](https://github.com/CodeWithCJ/SparkyFitness/pull/3194)); photos in Sparky chat ([#3068](https://github.com/CodeWithCJ/SparkyFitness/pull/3068)); an Adherence & log screen for medications with the adherence figures, the month calendar, the day log and editing logged doses ([#3103](https://github.com/CodeWithCJ/SparkyFitness/pull/3103)); named food portions ([#2919](https://github.com/CodeWithCJ/SparkyFitness/pull/2919)); and Turkish as a 16th app language ([#2959](https://github.com/CodeWithCJ/SparkyFitness/pull/2959)).
- **New on both:** see the list below. Most of them work the same on web and mobile; the description says when they do not.
- **Possible issues found while updating** (to be confirmed on a device):
  - The project's Android release workflow (`.github/workflows/android.yml`) builds only the phone app and does not set `SPARKY_EMBED_WEAROS_RELEASE`, so the released APK and AAB do not include the Wear OS app; only debug builds, or release builds made with that flag, do.
  - Starting a fast from the Wear OS watch fails: the watch sends the preset as `16:8`, `18:6`, `20:4` or `OMAD`, while the phone only knows `16-8`, `18-6` and `20-4` (and has no OMAD preset), so it rejects the request and no fast is saved.
  - On Android with a Wear OS watch, a saved route still offers "Start on watch" and "Send to watch": the first starts an ordinary run without the route, and the second fails, because the Wear OS app cannot follow routes.
  - On iOS an account change does not clear the widgets, which keep the previous account's figures until the app next writes them; Android clears them.
- **Still open:** consumed and burned on the Android calories widget, and more sizes or resizing for the calories and macros widgets ([#2050](https://github.com/CodeWithCJ/SparkyFitness/issues/2050)). Lock-screen widgets, Siri/Shortcuts and the Remove water, Start fast and End fast controls stay iOS-only.

### Features added since the analysis (up to 26 Oct 2026)

- **Several mood check-ins a day** (web, iOS and Android; #3013, #3016, #3018): Log several mood check-ins a day, each with its own time, and see them listed with the day average; each one can be edited or deleted. On the web this is on the Check-In page (Fasting & Mood tab); in the phone app the Dashboard mood card opens the day's list.
- **Energy and focus ratings on mood check-ins** (web, iOS and Android; #3002, #3012): Rate energy (Drained to Energized) and focus (Scattered to Locked in) from 1 to 5 when logging a mood; both are optional and show in the day's check-ins and day average. Same on web, iOS and Android.
- **Mood check-in reminders** (iOS and Android; #3028): Get a daily reminder to log a mood check-in, at up to five times you choose under Settings > Notifications; tapping it opens a new check-in. Phone app only, the same on iOS and Android (Android gives them their own notification channel).
- **Compare report: do two tracked things go together?** (web, iOS and Android; #3058, #3076, #3108): Pick two of 24 tracked things (mood, sleep, heart rate, food, training, weight, steps and more) and a timing to see whether they go together, by day or by week, with an answer, a dots chart, an over-time chart and checks. Same on web and the phone app, but the web shows both charts at once and adds a table of the other timings and a day-by-day table.
- **Compare: before and since a habit started** (web, iOS and Android; #3084, #3116): Ask Compare whether something changed since a habit started: it compares the days before and since a start date that it suggests or you pick, with a before/since chart. Same on web and the phone app; the web adds a month-by-month table.
- **Compare questions in Sparky chat and MCP** (web, iOS and Android; #3089): Ask Sparky chat, or an AI assistant connected through MCP, whether two tracked things go together or whether something changed since a habit started; it uses the same analysis as the Compare report and only reads your own data. Available wherever the chat is: web, iOS and Android.
- **Heart Rate report** (web, iOS (partly) and Android (partly); #3143, #3165): A Heart Rate report with your resting heart rate trend and your own zone ranges. The web adds 24-hour and multi-day heart rate timelines and a per-workout section; the phone app instead shows summary figures (including 1-minute recovery) and insights, without timelines or the per-workout section.
- **Heart rate zone settings** (web, iOS and Android; #3078, #3165): Set your max and resting heart rate, choose how the five zones are worked out (% of max, heart rate reserve or custom bpm) and show them as five zones or four tiers; the zones drive time in zone, training load and suggested run ranges. Same on web and the phone app, except 'Use Apple Health zones', which only iPhones on iOS 27 have.
- **Readiness, form and running estimates** (web, iOS and Android; #3155): A Readiness and Form card (a readiness score out of 100 from form, sleep, resting heart rate and HRV, plus fitness, fatigue and form from your training load) and a Running Estimates card (estimated VO2 max and running power), in web Reports > Exercise and the phone's Exercise Statistics. Only the phone app also shows readiness on the Dashboard Training Load card and uses the estimate when no VO2 max is synced.
- **Saved routes library** (iOS and Android; #3022): Keep routes in Library > Routes: draw one on a map, import a GPX file or save a recorded activity's track, then view it with its distance and climb, rename it, share it as GPX or delete it. Phone app only; on Android, drawing on a map needs a build with a Google Maps key.
- **Route generation and route style** (web (partly), iOS and Android; #3071, #3141): With a routing provider (Valhalla) set up on the web, the phone app can generate a loop or out-and-back route by activity and distance, with up to three loop options and a route style (surface, hills, steps, busy roads), and can make drawn routes follow roads. The web only sets up the provider; on Android this needs a build with a Google Maps key.
- **Edit a saved route on the map** (iOS and Android; #3077): Edit a saved route's line on the map: drag, add or delete points, choose whether each stretch follows roads or goes straight, and undo or redo. Phone app only; hidden on Android builds without a Google Maps key.
- **Follow a saved route on Apple Watch** (iOS and Apple Watch; #3090): Send saved routes to the Apple Watch or start one from the phone, then follow it on an outdoor run or walk with turn prompts (haptic and spoken), a map and off-route warnings. iPhone and Apple Watch only; Wear OS cannot follow routes.
- **Share a cardio activity as an image** (iOS and Android; #3014): Share a cardio activity as an image: its stats over a photo from the library or the camera, in a Classic, Route or Minimal layout with a chosen text colour. Phone app only, the same on iOS and Android.
- **Running goals: weekly distance and race countdown** (iOS and Android; #3144): Set a weekly running distance goal and a race with a countdown on the training programs screen; the race day can also become the program's goal date. Phone app only, the same on iOS and Android.
- **Realign a run program to finish on the goal day** (web (partly), iOS and Android; #3109): When missed weeks or spare time mean a run program no longer ends on its goal day, realign the rest of the plan after a before/after preview. The phone app has a card for it on the training programs screen; on the web it can only be done by asking Sparky chat.
- **Guided running fitness tests** (web (partly), iOS and Android; #3154): Run a guided fitness test (5K time trial, 30-minute all-out run or 12-minute Cooper test) outdoors or on a treadmill to get your threshold and training paces, which then set your pace zones and plans. Tests are recorded only in the phone app, never on a watch; the web shows the results read-only in Reports > Exercise > Cardio.
- **Plate calculator** (web (partly), iOS and Android; #3186): See which plates to load on each side of a barbell, EZ bar or trap bar for a set, using the bars and plates you own (Equipment > Plates & bars), or the nearest weights you can load. The phone app offers it in the live workout and in the workout and preset forms; the web only in the workout player.
- **Link a logged workout to a synced workout** (web, iOS and Android; #3114): Link a workout logged in SparkyFitness to the same session synced from a watch or health app and choose which calories count (SparkyFitness, synced, higher, lower, average or a custom figure), so the day counts them only once; the link can be removed. Same on web, iOS and Android.
- **Workout effort score (1-10)** (web (partly), iOS, Android (partly) and Apple Watch; #3065): Rate how hard a workout felt, from 1 to 10, on the Apple Watch when a strength workout or a watch-recorded run or walk ends; the iPhone also reads effort ratings saved in Apple Health. The web and the Android app only show a stored rating, and no app lets you enter or change it.
- **Top food sources for a nutrient** (iOS and Android; #3009): See which logged foods supplied the most of a nutrient over 7, 30 or 90 days, filtered by meal or narrowed to one day, and open the entries behind each food. Phone app only (Nutrient Trends), the same on iOS and Android.
- **Enter sodium as grams of salt** (web only; #3150): In the web food and supplement forms, type the salt printed on a label in grams instead of sodium in mg; it is saved as sodium (1 g of salt = 400 mg). The phone app only has the sodium field in mg.
- **Arithmetic in quantity fields** (web only; #2935): Type a calculation such as 30*5 or (2+1)/2 in the web quantity fields for logging or editing food and meals, and it is replaced by the result. The phone app's quantity fields accept numbers only.
- **Count activity calories separately (adaptive calorie goal)** (web, iOS and Android; #3061): With Dynamic Goal and the adaptive method, an optional switch keeps past activity out of the learned calorie baseline and adds today's steps and workouts to the day's budget once. Same on web and the phone app; the web also explains it in the calorie target breakdown.
- **Food preferences and saved food tasks in Sparky chat** (web, iOS (partly) and Android (partly); #2808): Sparky can remember lasting food preferences and keep multi-step food work as tasks to resume later. The web chat has a panel to edit or forget preferences and to check, cancel or resume tasks; the phone chat can use them but has no panel.
- **Cited web research for food questions** (web, iOS (partly) and Android (partly); #2807): With an OpenAI GPT-6 AI service, Sparky can search the web to answer food questions, and the web chat lists the sources as links. The phone chat gets the same answers but does not show the sources.
- **Intervals.icu integration** (web only; #3139): Connect Intervals.icu with an Athlete ID and API key to import activities and daily wellness data (weight, resting heart rate, HRV, VO2 max and more), synced for a chosen range or every hour. Set up on the web only; the phone app shows the imported data but cannot connect it.

## 0. Executive summary

**Numbers:** 1,373 rows were inventoried: 1,204 from functional domains and 169 from the dedicated iOS/Android sweeps. Of the functional rows, **350 are at parity**, **217 exist in both clients with differences**, **376 are web only** and **241 are mobile only**. Within mobile there are **48 iOS-only features**, **10 Android-only** and **58 that differ** between platforms (counted per domain; section 3 has the full list, deduplicated by name).
Some capabilities appear in more than one domain, e.g. API keys under *Authentication*, *Administration* and *Settings*. The numbers measure granularity, not unique features.

### 0.1 What the web has and mobile does not (main blocks)
- **Account management:** sign-up, forgot and reset password, magic link, demo mode, enabling or disabling MFA (TOTP and email), recovery codes, changing email or password, and creating, revoking and cleaning up API keys. On mobile you can only *sign in*, including with MFA, passkey, OIDC or API key.
- **The full admin panel:** users, sign-in methods, OIDC providers, backups and restore, global AI services, global providers, CNF and Livsmedelsverket bulk imports, and log level.
- **Server-side third-party integrations:** connecting or disconnecting Garmin, Fitbit, Withings, Oura, Polar, COROS (and COROS MCP), Strava, Google Health, Hevy and Liftosaur; syncing by date range; the global sync button; deleting data by source; managing food and exercise providers (OFF, USDA, Mealie, Tandoor, wger…) and their priority.
- **Import and export:** CSV import of foods, diary, check-in and health data, exercises and workout history, `.FIT` files, plus CSV exports of the diary, reports and medications.
- **Profile and preferences:** avatar, name, phone, date of birth, gender, bio, date format, decimal places, standard drink and weekly alcohol limit, and chart scale mode.
- **Family access:** granting, editing, revoking and setting granular permissions. Also the *profile switcher* to act on behalf of a family member: log in their diary, their check-in, their medications and their reports. Mobile can only **view** the family diary and copy meals from it.
- **Advanced goals:** the goals onboarding wizard (body data, plan, diet, 6-month cascading plan), BMR and body-fat algorithms, measured adaptive TDEE, goal weight, goals for a single date, macros by %, and per-meal distribution templates.
- **Advanced reports:** Sleep Science (sleep debt, chronotype, energy curve, sleep need), strength trends (1RM, best set, time under tension), matching routes, structured telemetry, tables with CSV, chart zoom and maximize, and the medication report with correlations and a PDF for the prescriber.
- **Check-in:** custom category manager (including Hourly/All), custom moods, manual sleep logging with a stage editor, and editing or deleting sleep entries.
  - **Partly covered by PR #3194 (merged):** mobile now has the custom category manager, with Hourly and All, under Settings > Custom Measurements. Custom moods and logging, editing or deleting sleep by hand are still web only.
- **Medications and symptoms:** adherence, dose calendar, snoozing a dose, editing logged doses, a note when logging, effectiveness rating, pill photo, custom GLP-1 drug, Bristol stool scale, custom symptom fields, and the symptoms report and export.
  - **Partly covered by PRs #3005 and #3103 (merged):** mobile now has the adherence figures, the dose calendar and editing logged doses (time, note, injection site and status, Snoozed included) on a new Adherence & log screen, and a "Remind in" button on medication reminders. The other items are still web only.
- **Cycle and pregnancy:** kick counter, contraction timer, medical appointments, printable doctor report, article library, birth plan, menstrual products, conception probability, fertile-window chart and hormone simulation.
- **AI chat:** configuring personal AI providers (key, model, system prompt, vision), attaching images, editing messages and navigating branches, viewing reasoning, token statistics, and choosing tool categories and the Full/Core profile.
  - **Partly covered by PR #3068 (merged):** the mobile chat can now attach photos, up to 5 per message, and shows them again in the history. The rest is still web only.

### 0.2 What mobile has and the web does not
- **Device health:** sync with Apple Health / Health Connect (read, write-back of nutrition and hydration, background, on app open, history import, workout routes and heart rate). The web partly replaces this with the server's cloud integrations.
- **Running and GPS:** GPS recording from the phone (auto-pause, intervals, pace alerts and voice cues), indoor distance from steps, running programs with a calendar and race planning, GPX export and pace zones.
  - **Partly covered by PRs #2948 and #3154 (merged):** the web now has the running programs with a month calendar, can start plans made on mobile, and shows fitness test results and their training paces read-only. Recording, indoor distance, race planning, creating or editing plans and GPX export are still mobile only.
- **Live workout:** warm-up calculator, default rest, sounds (also in silent mode), keep the screen on, end-of-rest alert with a "Complete set" action, minimized workout bar, renaming or clearing sets in progress, and saving the workout as a preset.
- **Apple Watch** (full app), **widgets**, **quick actions**, **Siri/Shortcuts** and **Control Center controls** (see section 3).
- **Local notifications:** medication reminders with actions, water reminders, fasting goals and an open symptom episode. The web only has the server notifications icon.
- **Progress photos:** history per angle, before/after comparison, time-lapse and a zoomable viewer.
  - **Partly covered by PR #2965 (merged):** the web now has the before/after comparison and the time-lapse. The history per angle and the zoomable viewer are still mobile only.
- **Scanning:** nutrition label and *Supplement Facts* by photo (on iOS 27+ even on-device), supplement barcode, and alternatives when a barcode is not found.
- **Diary:** swiping between days, moving an entry to another date, editing the nutrition of a single entry, quick serving adjustment, multi-select when adding, and sleep, measurement and photo cards inside the diary.
- **Medications:** activating or deactivating a medication and **editing or pausing existing schedules**. The web can only create and delete them.
- **Reports:** macro split for the period, highlighted days, logging consistency, water streaks, weekday vs weekend sleep, and reordering or hiding reports.
- **Cycle:** symptom forecast, daily pregnancy log, editing the due date and syncing BBT and reproductive data from the health app.
- **Connection:** multiple servers or accounts, proxy headers, API-key sign-in, LAN or self-signed servers, and logs with a diagnostic report. Also the AMOLED theme.

### 0.3 iOS vs Android (the essentials)
- **iOS only:**
  - Full Apple Watch app: Goals, Water, Medications, Weight check-in, Fasting and Steps pages; complications; strength workouts on the wrist; standalone runs; live heart rate and heart-rate alerts while recording. There is no Wear OS app.
    - **Partly covered by PR #3052 (merged):** Android now has a Wear OS app with the same pages and complications, strength workouts on the wrist, standalone runs and walks, and live heart rate and heart rate alerts while recording. Following saved routes, Jump Rope, double tap and the effort rating at the end of a workout are still Apple Watch only.
  - Interactive Live Activities (workout and run) on the lock screen and Dynamic Island.
  - Water widget with +/−, lock-screen widgets, Control Center controls (iOS 18+) and Siri/Shortcuts (water, fasting, weight).
    - **Partly covered by PRs #2989 and #3020 (merged):** Android now has the water widget with − / + (PR #3020) and four Quick Settings tiles as the counterpart of the Control Center controls: Log water, Scan barcode, Search food and Calories left (PR #2989). Still iOS-only: lock-screen widgets, Siri/Shortcuts, and the Remove water, Start fast and End fast controls.
  - Four home-screen quick actions, versus one on Android.
    - **Updated in PR #2989 (merged):** Android now has the same four: Scan food, Log food and Fasting, plus the native Log water shortcut, which logs without opening the app.
  - On-device label reading with Apple Intelligence (iOS 27+) and *Liquid Glass* navigation (iOS 26+).
  - HealthKit-only metrics: mobility, running dynamics, cycling, Apple rings, blood alcohol and menstrual flow.
  - Immediate sync through HealthKit observers.
- **Android only:**
  - Exact-alarm permission and notification channels.
  - Health Connect-only metrics: generic speed and power, elevation gained, body water mass, step cadence, bone mass, wheelchair pushes and menstruation period.
  - Anonymized health data report in Sync.
  - Widget refresh from the background task.
  - Tip for recording with the screen off.
  - In-app language picker (on iOS it is delegated to system Settings).
  - Native tablet install (iOS has no iPad version).
- **Same feature, different behaviour:**
  - Workout in progress: Live Activity with buttons on iOS; read-only notification on Android.
  - Macros widget: composition ring on iOS; bars with goals on Android.
  - **HRV:** SDNN on iOS and RMSSD on Android; the values are not comparable.
    - **Updated in PRs #3019 and #3100 (merged):** the same split now reaches sleep: synced nights carry an overnight HRV from SDNN on iOS and from RMSSD on Android, stored in one field that does not record which, so overnight HRV in the sleep reports is not comparable across platforms either.
  - Maps: Android needs a Google Maps key; without it only the route line is drawn.
  - Passkeys: Android forces a compatible browser.
  - Certificates: Android trusts user-installed CAs.
  - History import: Android has a daily Health Connect quota and asks for route consent per session.
  - Rest sound: on iOS it also plays in the background and with the screen locked.
  - Trans fat write-back: Android only.

### 0.4 Possible issues found during the analysis
These are side findings of the inventory, to be confirmed on a device:
- iOS shows the **Bone mass**, **Wheelchair pushes** and **Menstruation period** toggles, which never read data from HealthKit. "Wheelchair pushes" should probably map to `PushCount`.
- On Android the **Back** button does not close `ServingAdjustSheet` or `CopyMealSheet`.
- Android's **"Log water"** launcher shortcut has a hard-coded English label, and the **Siri** phrases are English only.
  - **Updated in PRs #2989 and #3051 (merged):** the shortcut's label now comes from the app's translatable strings and is translated into 10 of the 15 languages the app ships besides English; its longer description, "Log water without opening the app", into 6 (Spanish, Polish, Brazilian Portuguese, Cantonese, and Simplified and Traditional Chinese). The Siri phrases are unchanged and still English only.
- The "Also use on my Apple Watch" toggle for reference paces shows up on iPhones **without** a paired watch: only `Platform.OS === 'ios'` is checked.
  - **Updated in PR #3052 (merged):** still the case, and now on Android too: the switch, worded "Also use on my Wear OS watch" there, shows on any iPhone or Android phone once a race is set, with or without a paired watch, because `RunProgramsScreen.tsx` only checks the platform.
- On the web, the email MFA challenge cannot **resend the code** without reloading the page. Mobile can.
- Some HealthKit metrics are defined but disabled (`enabled: false`): stress, dietary fat, protein and sodium, and audio exposure. They do not appear on any platform.


## 1. Summary by domain

| Domain | Total | Both (parity) | Partial | Web only | Mobile only | iOS only | Android only | Differs iOS/Android |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| Authentication & account security | 62 | 13 | 3 | 25 | 16 | 0 | 0 | 3 |
| Administration & developer resources | 90 | 5 | 1 | 61 | 12 | 0 | 1 | 2 |
| Food diary & daily logging | 91 | 28 | 29 | 14 | 19 | 3 | 0 | 7 |
| Food library, meals & meal plans | 84 | 43 | 18 | 18 | 5 | 0 | 0 | 1 |
| Exercises, workouts & running | 96 | 41 | 11 | 16 | 28 | 6 | 1 | 6 |
| Check-in, body measurements & wellbeing | 70 | 29 | 10 | 11 | 20 | 7 | 0 | 2 |
| Goals & onboarding | 77 | 31 | 10 | 31 | 5 | 1 | 0 | 3 |
| Reports & analytics | 118 | 20 | 49 | 38 | 11 | 1 | 0 | 1 |
| Medications, GLP-1 & symptoms | 98 | 33 | 24 | 28 | 13 | 1 | 1 | 1 |
| Menstrual cycle, fertility & pregnancy | 96 | 35 | 20 | 32 | 8 | 0 | 0 | 2 |
| AI chat (SparkyChat) & AI settings | 85 | 28 | 12 | 34 | 11 | 2 | 0 | 4 |
| Settings, profile, family & integrations | 130 | 32 | 21 | 51 | 25 | 2 | 2 | 8 |
| Native mobile capabilities | 82 | 8 | 6 | 7 | 60 | 25 | 5 | 18 |
| Items added by the completeness critic | 25 | 4 | 3 | 10 | 8 | 0 | 0 | 0 |
| **Total** | **1204** | **350** | **217** | **376** | **241** | **48** | **10** | **58** |

Legend: *Partial* = exists in both clients but one offers a reduced or different version. The iOS/Android columns only count features present on mobile.

## 2. Detail by domain

### 2.1 Authentication & account security

#### Web only (25)

- **New account registration (email/password)** — 'Sign Up' tab with full name, email and password. The password is validated live (minimum 8 characters, uppercase, lowercase, number and special character). The tab is hidden with a notice when the server has signup_disabled.
  - Web (Yes): SparkyFitnessFrontend/src/pages/Auth/Auth.tsx:295-312 (validatePassword), 314-346 (handleSignUp), 502-531 (tabs and 'Registration is currently disabled' notice), 664-760 (form)
  - Note: On mobile an account can only be created implicitly when signing in via SSO/OIDC, if the provider has auto_register (enforced by the server in SparkyFitnessServer/auth.ts:639-690 with disableImplicitSignUp false at 914).
- **Request a password reset ('Forgot password?')** — Link on the login screen that opens /forgot-password. There the user enters their email and a reset link is sent, with a neutral message that does not reveal whether the account exists.
  - Web (Yes): SparkyFitnessFrontend/src/pages/Auth/Auth.tsx:584-591 (link); src/pages/Auth/ForgotPassword.tsx:29-46, 73-105; src/App.tsx:319 (/forgot-password route)
- **Reset password with a token** — /reset-password?token=… page with new password, confirmation, a show/hide button and the same complexity validation as sign-up. When finished it redirects to the home page.
  - Web (Yes): SparkyFitnessFrontend/src/pages/Auth/ResetPassword.tsx:38-111 (token, validatePassword, confirmation); src/App.tsx:324 (/reset-password route)
- **Magic link sign-in** — 'Request Magic Link' button that opens a dialog to request a passwordless sign-in link by email. Verification returns to the /login/magic-link route.
  - Web (Yes): SparkyFitnessFrontend/src/pages/Auth/Auth.tsx:348-353, 623-630, 847-854; src/pages/Auth/MagicLinkRequestDialog.tsx; src/api/Auth/auth.ts:34-37; src/App.tsx:329
  - Note: On web the button is always shown whenever email login is enabled, without checking a specific magic link setting.
- **Demo mode (one-click access)** — If the server has demo_mode, the 'Explore Live Demo' button appears. It opens a disclaimer dialog (license, public sandbox, daily reset at 00:00 UTC, protected settings) with a mandatory acceptance checkbox, and then signs in to the demo account.
  - Web (Yes): SparkyFitnessFrontend/src/pages/Auth/Auth.tsx:820-842 (button), 855-880 (confirmation and demoLogin); src/pages/Auth/DemoDisclaimerDialog.tsx:48-192; src/hooks/Auth/useAuth.ts:18-30
- **Automatic OIDC redirect** — If there is a single OIDC provider, email login is disabled, auto_redirect is enabled and it is not demo mode, web automatically redirects to the provider after 800 ms.
  - Web (Yes): SparkyFitnessFrontend/src/pages/Auth/Auth.tsx:85-119
- **Passkey autofill (Conditional UI)** — As soon as the login screen opens, the browser can suggest saved passkeys from the email field's autofill (autocomplete='username webauthn'), without pressing any button.
  - Web (Yes): SparkyFitnessFrontend/src/pages/Auth/Auth.tsx:138-238 (signIn.passkey({autoFill:true})), 554
- **Recovery code in the MFA challenge** — 'Recovery Code' tab to sign in with a backup code if access to TOTP or email has been lost.
  - Web (Yes): SparkyFitnessFrontend/src/pages/Auth/MfaChallenge.tsx:173-212, 364-402 (twoFactor.verifyBackupCode)
  - Note: Without the authenticator, the mobile user has to fall back to web or to an API key.
- **Enable MFA with an authenticator app (TOTP)** — In Settings > Account Security: the password is confirmed, a QR code is shown, a 6-digit code is verified and TOTP is enabled; enabling it also generates backup codes.
  - Web (Yes): SparkyFitnessFrontend/src/pages/Settings/MFASettings.tsx:79-101 (twoFactor.enable with method totp), 162-197 (verification), 336-435 (UI and QR 380-382); mounted in AccountSecurity.tsx:283
  - Note: Web only shows the QR code, not the secret as text for manual entry.
- **Disable TOTP MFA** — Authenticator 'Disable' button, with password confirmation.
  - Web (Yes): SparkyFitnessFrontend/src/pages/Settings/MFASettings.tsx:103-120, 341-354, 275-334 (password confirmation card)
- **Enable/disable email code MFA** — Toggle (Enable/Disable) for the email second factor. Unlike TOTP, it does not ask for the password.
  - Web (Yes): SparkyFitnessFrontend/src/pages/Settings/MFASettings.tsx:199-255, 437-480 (useToggleEmailMfaMutation)
- **Generate, view and copy recovery codes** — Generates new backup codes (with password) and lets the user show or hide them and copy them to the clipboard, with a warning that they will not be shown again.
  - Web (Yes): SparkyFitnessFrontend/src/pages/Settings/MFASettings.tsx:121-137 (generateBackupCodes), 257-266 (copy), 484-559 (UI)
- **Change the account email** — Editable field with the current email and the current password (left empty when signed in via SSO), plus the 'Update Email' button.
  - Web (Yes): SparkyFitnessFrontend/src/pages/Settings/AccountSecurity.tsx:38-56, 116-165; src/hooks/Settings/useAccountSecurity.ts:6-30 (/identity/update-email); SettingsPage.tsx:216
- **Change the password** — Form with current password, new password and confirmation (minimum 8 characters). Changing it revokes the other sessions.
  - Web (Yes): SparkyFitnessFrontend/src/pages/Settings/AccountSecurity.tsx:58-102 (revokeOtherSessions: true at 95), 169-279; src/hooks/Settings/useAccountSecurity.ts:32-55
  - Note: Cross-platform effect: revoking the other sessions invalidates the mobile session tokens, so mobile will receive a 401 and open ReauthModal. Here the minimum complexity is only the length; sign-up and reset require more rules.
- **Generate an API key** — Creates an API key with a description, expiration (Never, 7, 30 or 90 days, 1 year) and scope (full access or read-only). The key is shown only once, with a copy button and a dismiss button.
  - Web (Yes): SparkyFitnessFrontend/src/pages/Settings/ApiSettings.tsx:60-79, 146-190 (key shown once), 192-273 (form); SettingsPage.tsx:455
- **API key list with metadata** — Shows each key with its name, ID (never the secret), 'Disabled' and 'Read-only' badges, creation date, expiration (in red if already expired) and last use.
  - Web (Yes): SparkyFitnessFrontend/src/pages/Settings/ApiSettings.tsx:295-381
- **Enable/disable an API key** — Per-key toggle to suspend it without deleting it.
  - Web (Yes): SparkyFitnessFrontend/src/pages/Settings/ApiSettings.tsx:98-105, 384-390
- **Delete an API key** — Deletes a key after confirming with window.confirm.
  - Web (Yes): SparkyFitnessFrontend/src/pages/Settings/ApiSettings.tsx:81-96, 391-399
- **Clean up expired API keys** — 'Cleanup Expired Keys' button that deletes all expired keys at once.
  - Web (Yes): SparkyFitnessFrontend/src/pages/Settings/ApiSettings.tsx:107-114, 276-292
- **Admin: enable sign-in methods and mandatory MFA** — In the admin panel: global toggles for email and password login, passkey login, global OIDC, and 'Enforce MFA for all users', with the 'Managed by Env' badge when the setting comes from environment variables.
  - Web (Partial): SparkyFitnessFrontend/src/pages/Admin/AuthenticationSettings.tsx:135-207; src/pages/Admin/Admin.tsx:11; src/App.tsx:446-461 (PermissionRoute admin)
  - Note: The mandatory MFA toggle is saved (SparkyFitnessServer/models/globalSettingsRepository.ts:110-127, 242-256), but I found no place in the server that enforces it (it never returns needs_mfa_setup).
  - _Verification: corrected during verification_
- **Admin: OIDC provider management** — Create, edit, enable, and delete OIDC providers: ID, display name, active, auto-registration, logo (file or URL), issuer, domain, client ID/secret, scope, redirect URI, token endpoint authentication method, and 'Reset to defaults'.
  - Web (Yes): SparkyFitnessFrontend/src/pages/Admin/OidcSettings.tsx:81-286; src/pages/Admin/OidcProviderDialog.tsx:128-562; src/App.tsx:457 (admin/oidc-settings)
- **Admin: security actions on users** — From user management: reset password, reset MFA, activate or deactivate the account, grant or remove the admin role, and view TOTP and email MFA status and the last login.
  - Web (Yes): SparkyFitnessFrontend/src/pages/Admin/UserManagement.tsx:125-183 (password reset, role, MFA reset), 300-345 (active/MFA columns), 387-444; src/App.tsx:466 (admin/user-management)
- **Admin: delete users, edit their name, and search/sort** — In the admin panel's user management: delete a user (with confirmation), edit their full name inline (with confirmation), and search or sort the table by column. Complements the security actions of auth-admin-user-security.
  - Web (Yes): SparkyFitnessFrontend/src/pages/Admin/UserManagement.tsx:60 (useUsers with search and sort), 71-109 (handleSaveFullName), 111-123 (handleDeleteUser with window.confirm), 445-453 (Delete button); src/App.tsx:466
  - _Verification: added during verification_
- **Admin: public API documentation without authentication** — Toggle in the administrator's authentication settings so the Swagger documentation (/api/api-docs) can be opened without signing in.
  - Web (Yes): SparkyFitnessFrontend/src/pages/Admin/AuthenticationSettings.tsx:211-232 ('Public API Documentation'); enforced on the server in SparkyFitnessServer/SparkyFitnessServer.ts:694-700 (isPublicApiDocsAllowed or SPARKY_FITNESS_PUBLIC_API_DOCS).
  - _Verification: added during verification_
- **Admin: delete a user account** — From user management, the administrator can delete another user's account after confirming.
  - Web (Yes): SparkyFitnessFrontend/src/pages/Admin/UserManagement.tsx:111-123 (window.confirm 'Are you sure you want to delete this user?'), 446-454 (Delete button); hooks/Admin/useUsers.ts:58.
  - Note: The auth-admin-user-security row did not include this action.
  - _Verification: added during verification_

#### Mobile only (16)

- **Initial server URL setup (onboarding)** — First step of startup on mobile: the user enters the 'Frontend URL' (with a button to paste from the clipboard), it is validated and normalized, the auth settings are requested (/api/auth/settings) and, if that fails, a fallback reachability check runs. If no configuration is saved, the app starts …
  - Mobile (Yes): SparkyFitnessMobile/src/screens/OnboardingScreen.tsx:174-241 (handleNext, fallback 60-78 and 216-237), 603-686 (URL input + paste button); src/hooks/useAppBootstrap.ts:38-41 (initial route Onboarding if there is no active configuration); App.tsx:523
  - Note: If the host times out, the fallback is skipped (#1767).
- **Skip connecting ('Later')** — 'Later' button in onboarding to enter the app without connecting any server. It leads to the Settings tab, where the Server row shows 'Tap to add a server'.
  - Mobile (Yes): SparkyFitnessMobile/src/screens/OnboardingScreen.tsx:161-164 (finishOnboarding), 1051-1059 (Later button); src/screens/SettingsScreen.tsx:145
- **Connect with an API key as the authentication method** — 'API Key' tab to connect the app by pasting a key generated on web. It is validated against /api/identity/user, has a paste button, can be hidden/shown in the server modal and is stored in secure storage.
  - Mobile (Yes): SparkyFitnessMobile/src/screens/OnboardingScreen.tsx:403-471 (handleConnectApiKey), 936-976; src/components/ServerConfigModal.tsx:620-705, 1061-1100 (show/hide 1074-1095); src/services/storage.ts:40-48 (SecureStore apiKey_<id>, AFTER_FIRST_UNLOCK)
  - Note: Passkeys are not available in API key configurations (PasskeySettingsScreen.tsx:326-340).
- **Go back/cancel from the MFA challenge** — 'Back' button to leave the MFA step and return to the credentials; it also clears pending 2FA cookies.
  - Mobile (Yes): SparkyFitnessMobile/src/components/MfaForm.tsx:229-237; src/screens/OnboardingScreen.tsx:580-586 (handleBackToAuth + clearAuthCookies), 1032-1040
- **Switch to an API key from reauthentication** — From the session expired modal (and from its MFA step), 'Use API Key Instead' opens the server modal on the API Key tab to change the authentication method of that configuration.
  - Mobile (Yes): SparkyFitnessMobile/src/components/ReauthModal.tsx:653-664, 680-683; src/components/MfaForm.tsx:239-248; src/hooks/useAuth.ts:125-137; App.tsx:1298-1316
- **Multiple servers/accounts and switching the active server** — Settings > Server shows the active server and 'Other Servers'. Tapping one lets the user activate it ('Set Active', with an HTTPS check in production), configure it or delete it. Switching servers switches identity and clears the caches.
  - Mobile (Yes): SparkyFitnessMobile/src/screens/ServerSettingsScreen.tsx:85-128 (handleSetActiveConfig), 258-332 (menu), 354-475; src/screens/SettingsScreen.tsx:215-230; App.tsx:1097
  - _Verification: corrected during verification_
- **Add server (configuration modal)** — 'Add Server' modal with URL, Sign In/SSO/Passkey and API Key tabs, MFA and advanced options. It also opens automatically when the last configuration is deleted (reason no_configs).
  - Mobile (Yes): SparkyFitnessMobile/src/screens/ServerSettingsScreen.tsx:193-197, 487-516; src/components/ServerConfigModal.tsx:1138-1143; src/hooks/useAuth.ts:46-49; App.tsx:1298-1316
- **Edit an existing server configuration** — 'Configure' opens the 'Edit Server' modal to change the URL, sign in again, switch from session to API key or edit the proxy headers. 'Save' saves without reauthenticating.
  - Mobile (Yes): SparkyFitnessMobile/src/screens/ServerSettingsScreen.tsx:187-191; src/components/ServerConfigModal.tsx:156-170, 708-773 (handleSaveWithoutAuth), 1302-1312
- **Delete a server configuration** — Deletes a saved server and its local credentials. If it was the active one, it activates the next one, clears the identity (caches and the copy of credentials for Siri/shortcuts) and, if none remain, opens the configuration modal.
  - Mobile (Yes): SparkyFitnessMobile/src/screens/ServerSettingsScreen.tsx:130-185; src/services/storage.ts (deleteServerConfig); src/hooks/useAuth.ts:46-52
- **Test the connection and server status** — 'Test Connection' button with a result toast, a green or red dot next to the active URL, and a status subtitle in the Server row of Settings.
  - Mobile (Yes): SparkyFitnessMobile/src/screens/ServerSettingsScreen.tsx:241-256, 380-383, 405-423; src/screens/SettingsScreen.tsx:215-230
- **Open the web dashboard from the app** — 'Open Web' button that opens the active server URL in the in-app browser (or in the external browser if that fails). It is the way to reach what only exists on web (MFA, password, API keys), although the user has to sign in again there.
  - Mobile (Yes): SparkyFitnessMobile/src/screens/ServerSettingsScreen.tsx:199-239, 393-404
- **Custom proxy headers (reverse proxy authentication)** — Under 'Advanced options' in the server modal, the user adds name/value pairs (with a maskable value) that are sent before the authentication headers on every request, for example for Cloudflare Access tokens. It warns if reserved headers are used (Authorization, Content-Type), and the headers are s…
  - Mobile (Yes): SparkyFitnessMobile/src/components/ServerConfigModal.tsx:254-275, 777-806 (reserved header warning), 1163-1285; src/services/storage.ts:44, 117-123; src/services/api/apiClient.ts:65; authService.ts:119-127 (pending headers during login)
  - Note: They are not available in onboarding (OnboardingScreen.tsx:247-258 saves proxyHeaders: []). With a server behind a proxy that requires them, the user has to tap 'Later' and add the server from Settings.
- **HTTPS requirement to connect to the server** — In production, mobile rejects http:// URLs during onboarding, login, server activation and in direct requests. In development, HTTP is allowed only for private or LAN hosts.
  - Mobile (Yes): SparkyFitnessMobile/src/utils/serverUrl.ts (isPrivateOrLocalHost, getInsecureUrlError); src/screens/OnboardingScreen.tsx:185-194; src/screens/ServerSettingsScreen.tsx:86-99; src/services/api/authService.ts:342-344, 645-647, 772-774
- **LAN servers and self-signed certificates** · _Differs iOS/Android_ — How the app connects to a self-hosted server on the local network or with its own certificate.
  - Mobile (Yes): SparkyFitnessMobile/plugins/withNetworkSecurityConfig.ts (Android: cleartextTrafficPermitted=false and trust in system and user CAs); app.config.ts:134 (production only), 171-188 (iOS: NSLocalNetworkUsageDescription and NSAppTransportSecurity with NSAllowsArbitraryLoads false)
  - iOS/Android: Android (production) trusts user-installed CA certificates, so a self-signed certificate works after installing its CA. iOS asks for the 'Local Network' permission and only trusts the system chain (a custom certificate requires installing a profile and marking it as trusted).
- **Resend the MFA code by email** — In the email MFA challenge, a 'Resend Code' button to request a new code after the first send. On web, once the code has been sent, the 'Send Code' button stays disabled and the code cannot be resent without reloading the page (which also loses the MFA step).
  - Mobile (Yes): SparkyFitnessMobile/src/components/MfaForm.tsx:216-227 ('auth.resendCode' button when emailOtpSent); used in OnboardingScreen.tsx:1012-1016, ServerConfigModal.tsx:1324-1328 and ReauthModal.tsx:674-678
  - _Verification: added during verification_
- **Notice for a server with no standard sign-in methods** — If the server has email login disabled and has no OIDC providers, mobile shows 'No standard sign-in methods are currently enabled on this server. Please use an API Key or contact an administrator.' On web, in that case only the existing passkey/OIDC buttons are rendered; if there are none, the card…
  - Mobile (Yes): SparkyFitnessMobile/src/screens/OnboardingScreen.tsx:919-931 (auth.noMethods); src/components/ServerConfigModal.tsx:1047-1056 (auth.noStandardMethods)
  - _Verification: added during verification_

#### In both, with differences (3)

- **Sign out** — 'Sign Out' button in the web header: it ends the session on the server, clears the cache and returns to /login. Mobile has no equivalent button; the closest thing is deleting the server configuration, which clears the local credentials but does not revoke the session on the server.
  - Web (Yes): SparkyFitnessFrontend/src/layouts/MainLayout.tsx:95-113, 531-540; src/hooks/useAuth.tsx:272-286 (authClient.signOut)
  - Mobile (Partial): signOut/logout does not appear in SparkyFitnessMobile/src. Only ServerSettingsScreen.tsx:130-185 (handleDeleteConfig → deleteServerConfig), with no server call.
  - Note: The session token deleted on mobile remains valid on the server until it expires.
- **Reauthentication when the session expires** — On mobile, a 401 on a session-based configuration opens a 'Session Expired' modal that lets the user sign in again with email/password, OIDC or passkey (including MFA) without losing navigation. On web, when the session is lost it is checked with /ping and the user is redirected to /login; if a gat…
  - Web (Partial): SparkyFitnessFrontend/src/hooks/useAuth.tsx:213-262 (/ping probe and cleanup); src/App.tsx:114-127 (PrivateRoute → /login); src/api/api.ts:54-101, 212-217 (gateway reload). There is no in-place reauthentication modal.
  - Mobile (Yes): SparkyFitnessMobile/src/services/api/apiClient.ts:81-82 (401 → notifySessionExpired); src/hooks/useAuth.ts:34-45; App.tsx:1288-1296; src/components/ReauthModal.tsx:46-190, 505-515 (sessionExpiredTitle title)
- **Show/hide the password in sign-in forms** — Eye button to view the password while typing. On web it is in login, sign-up, and password reset. On mobile it only exists in the server modal (Add/Edit Server), not in onboarding or in the session-expired modal.
  - Web (Yes): SparkyFitnessFrontend/src/pages/Auth/Auth.tsx:53, 563, 579-581 (login), 719, 739-741 (sign-up); src/pages/Auth/ResetPassword.tsx:17, 34
  - Mobile (Partial): Yes in SparkyFitnessMobile/src/components/ServerConfigModal.tsx:106, 954-973 (auth.showPassword/hidePassword). Not in OnboardingScreen.tsx:819-826 or in ReauthModal.tsx:566-574 (secureTextEntry only). The onboarding API key field (OnboardingScreen.tsx:961) also has no show button, unlike the one in the modal (ServerConfigModal.tsx:1074).
  - _Verification: added during verification_

#### In both clients, but with iOS/Android differences (2)

- **Passkey sign-in** · _Differs iOS/Android_ — 'Sign in with Passkey' button. On web it uses the browser's native WebAuthn (requires a secure HTTPS/localhost context). On mobile it opens a server bridge page (/api/auth/web-login/passkey) in the browser and receives the token in the URL fragment. In both cases it is hidden if the server disables…
  - Web (Yes): SparkyFitnessFrontend/src/pages/Auth/Auth.tsx:401-442 (handlePasskeySignIn and isSecureContext check 403-413), 612-622, 764-774
  - Mobile (Yes): SparkyFitnessMobile/src/screens/OnboardingScreen.tsx:367-401, 885-916; src/components/ServerConfigModal.tsx:468; src/components/ReauthModal.tsx:285, 620-635; src/services/api/authService.ts:766-843 (loginWithPasskey)
  - iOS/Android: Android: getPasskeyBrowserPackage (authService.ts:705-760) opens the ceremony in a browser from an allowlist (Chrome, Firefox, Samsung Internet, Edge) when the default one may not support passkeys (for example, Fennec from F-Droid). iOS: always the system browser session (returns undefined).
- **Register a new passkey** · _Differs iOS/Android_ — Registers a WebAuthn credential for the account. On web the name is optional and the browser's WebAuthn is used. On mobile the name is required and must be unique; a single-use ticket is requested and the server's registration page is opened in the browser. If the session is not fresh (SESSION_NOT_…
  - Web (Yes): SparkyFitnessFrontend/src/pages/Settings/PasskeySettings.tsx:36-42, 64-93 (button hidden if the server disables passkeys); src/hooks/Settings/usePasskeys.ts:24-43
  - Mobile (Yes): SparkyFitnessMobile/src/screens/PasskeySettingsScreen.tsx:170-232 (name validation and SESSION_NOT_FRESH at 210-216), 418-443, 466-515 (name modal), 519-526 (ReauthModal); src/services/api/authService.ts:888-975 (register-ticket + register-passkey)
  - iOS/Android: Android picks a passkey-capable browser from the allowlist (authService.ts:705-760); iOS uses the system browser. The copy also changes: 'Face ID, Touch ID, or your device PIN' and 'My iPhone' on iOS versus 'your fingerprint, face unlock, or device PIN' and 'My Android Phone' on Android (PasskeySettingsScreen.tsx:46-59).
  - Note: Web has no reauthentication flow for old sessions; a failure only shows a generic toast (usePasskeys.ts:37-41).

<details><summary>Web ↔ mobile parity (11)</summary>

- Email and password sign-in
- OIDC / SSO sign-in by provider
- Adapting to the sign-in methods enabled on the server
- Authenticator app (TOTP) MFA challenge at sign-in
- MFA challenge with a code sent by email
- View registered passkeys
- Delete a passkey
- Clearing local data on sign-out or account switch
  - **Updated in PRs #2989 and #3020 (merged):** On Android an account change now also empties the calorie, macro and water widgets and the Calories left Quick Settings tile. iOS does not clear its widgets then: they keep showing the previous account's figures until the app next writes them. The rest (query cache, cookie jar, image caches, shortcuts login copy and food basket) is cleared the same way on both platforms.
- List and delete registered passkeys
- List of registered passkeys
- Delete a passkey

</details>

<details><summary>Discarded after verification: exists in neither client (5)</summary>

- Server notice on the login screen — SparkyFitnessFrontend/src/pages/Auth/Auth.tsx:483-490
- Mandatory MFA setup notice at sign-in — SparkyFitnessFrontend/src/pages/Auth/MfaChallenge.tsx:222-230, 245-258; Auth.tsx:248-252. The server never emits needs_mfa_setup (it does not appear in SparkyFitnessServer), so it is a dead branch an…
- Self-service account deletion — There is no self-deletion option in SettingsPage.tsx or AccountSecurity.tsx; only the admin can delete in UserManagement.tsx:111-122, 449-451 (useDeleteUser).
- Active session management (view or revoke devices) — listSessions/revokeSession are not used; the only thing is the implicit revocation of other sessions when changing the password (AccountSecurity.tsx:95).
- Biometric app lock/unlock — Does not exist.

</details>

### 2.2 Administration & developer resources

#### Web only (61)

- **Admin panel access** — 'Admin' tab/route (/admin) visible only to users with the admin role and hidden when acting on behalf of another user (family access). It groups authentication, OIDC, global AI, global providers, backups, and user management.
  - Web (Yes): SparkyFitnessFrontend/src/layouts/MainLayout.tsx:303-304 (desktop tab) and :375-376 (mobile web navigation tab); SparkyFitnessFrontend/src/App.tsx:443-453 (PermissionRoute permission="admin" -> AdminPage); SparkyFitnessFrontend/src/pages/Admin/Admin.tsx:8-19
  - Note: All instance administration is web-only.
- **Standalone routes for admin subsections** — Direct routes /admin/oidc-settings and /admin/user-management protected by the admin permission.
  - Web (Partial): SparkyFitnessFrontend/src/App.tsx:455-472. No UI link points to them (they are only reachable by typing the URL); in addition, /admin/oidc-settings renders AuthenticationSettings rather than OidcSettings.
  - Note: Possible inconsistency: the 'oidc-settings' route shows login management, not OIDC provider management.
- **Enable/disable email and password sign-in** — Global toggle (Login Management) to enable or disable the email+password method; it is locked with the 'Managed by Env' badge if an environment variable sets it.
  - Web (Yes): SparkyFitnessFrontend/src/pages/Admin/AuthenticationSettings.tsx:118-141 (Switch id enable_email_password_login :136, env badge :127-134)
- **Enable/disable passkey sign-in (global)** — Global toggle to allow or disallow login with passkeys; it respects the environment configuration ('Managed by Env' badge).
  - Web (Yes): SparkyFitnessFrontend/src/pages/Admin/AuthenticationSettings.tsx:142-167 (Switch id enable_passkey_login :162)
- **Enable/disable OIDC login (global)** — Master toggle to enable OIDC sign-in across the whole instance; it can be locked by an environment variable.
  - Web (Yes): SparkyFitnessFrontend/src/pages/Admin/AuthenticationSettings.tsx:168-192 (Switch id is_oidc_active :188)
- **Enforce MFA for all users** — 'Enforce MFA for all users' toggle that makes multi-factor authentication mandatory.
  - Web (Yes): SparkyFitnessFrontend/src/pages/Admin/AuthenticationSettings.tsx:196-209 (Switch id is_mfa_mandatory :204); server SparkyFitnessServer/routes/adminAuthRoutes.ts:44,92
- **Public API documentation (Swagger without authentication)** — Toggle that allows access to /api/api-docs without signing in.
  - Web (Yes): SparkyFitnessFrontend/src/pages/Admin/AuthenticationSettings.tsx:210-232 (Switch id public_api_docs :227)
- **Developer diagnostic tools (MCP)** — 'Developer Diagnostic Tools' toggle that enables, for admins, the MCP database inspection tools exposed by the server's /mcp endpoint.
  - Web (Yes): SparkyFitnessFrontend/src/pages/Admin/AuthenticationSettings.tsx:233-256 (Switch id dev_tools_enabled :250); effect in SparkyFitnessServer/routes/mcpRoutes.ts:187-192
  - Note: Neither client offers a UI to connect an MCP client; the endpoint is used from external tools.
- **Emergency instructions to recover login** — Informational block with the variables SPARKY_FITNESS_FORCE_EMAIL_LOGIN=true and SPARKY_FITNESS_FORCE_PASSKEY_LOGIN=true and a button to copy them to the clipboard.
  - Web (Yes): SparkyFitnessFrontend/src/pages/Admin/AuthenticationSettings.tsx:258-277 and CopyableEnvVar component :18-43
- **OIDC provider list** — Table with the logo, display name, 'Managed by Env' badge, active status, and auto-registration of each configured OIDC provider.
  - Web (Yes): SparkyFitnessFrontend/src/pages/Admin/OidcSettings.tsx:231-355 (table :269-355, env badge :306-317)
- **Add OIDC provider** — 'Add New Provider' button that opens the creation dialog with default values (active, no auto-registration).
  - Web (Yes): SparkyFitnessFrontend/src/pages/Admin/OidcSettings.tsx:265-268, :56-73 (default template), :137-172 (creation + subsequent logo upload)
- **Edit and delete OIDC providers** — Per-row actions to edit a provider and delete it with confirmation; environment-defined providers cannot be deleted and their dialog is read-only.
  - Web (Yes): SparkyFitnessFrontend/src/pages/Admin/OidcSettings.tsx:336-352 (Edit/Trash, delete hidden if is_env_configured), :80-101 (handleDelete with confirm); OidcProviderDialog.tsx:131-136 (env badge) and fields readOnly={editedProvider.is_env_configured}
- **Quick Active / Auto-register toggles per provider** — Change from the table whether an OIDC provider is active and whether it automatically registers new users.
  - Web (Yes): SparkyFitnessFrontend/src/pages/Admin/OidcSettings.tsx:321-334 and handleToggleChange :186-215
- **Basic OIDC provider configuration** — Provider ID (slug), display name, Issuer URL, organization domain, Client ID, Client Secret, and Scope fields, plus Active/Auto Register toggles inside the dialog.
  - Web (Yes): SparkyFitnessFrontend/src/pages/Admin/OidcProviderDialog.tsx:157-310 (provider_id :161, display_name :175-183, is_active/auto_register :187-208, issuer_url :242, domain :253, client_id :271, client_secret :283, scope :306)
- **OIDC provider logo (file or URL)** — Upload a logo file or specify a logo URL that is shown on the login screen.
  - Web (Yes): SparkyFitnessFrontend/src/pages/Admin/OidcProviderDialog.tsx:212-235 (logo_file :216, logo_url :227); OidcSettings.tsx:107-170 (upload via /admin/oidc-settings/:id/logo, oidcSettingsService.ts:41)
  - _Verification: corrected during verification_
- **Redirect URI with custom-domain expert mode** — Shows the Redirect URI computed from the current origin, allows enabling 'Expert Mode: Custom Domain' to override the base URL (with http/https validation), and copying the full URI.
  - Web (Yes): SparkyFitnessFrontend/src/pages/Admin/OidcProviderDialog.tsx:312-410 (manual_redirect switch :319, copy :365-392, validation :395-404)
- **Advanced OIDC options** — Token endpoint authentication method (client_secret_post / client_secret_basic / none), ID token signing algorithm, userinfo signing algorithm, and request timeout (ms).
  - Web (Yes): SparkyFitnessFrontend/src/pages/Admin/OidcProviderDialog.tsx:421-451 (token_endpoint_auth_method), :454-480 (signing_algorithm :461, profile_signing_algorithm :475), :482-495 (timeout :489)
- **Reverse proxy configuration help for OIDC** — Warnings about localhost and a block of Nginx headers (Host, X-Forwarded-*) that can be copied to the clipboard.
  - Web (Yes): SparkyFitnessFrontend/src/pages/Admin/OidcProviderDialog.tsx:497-547 (pre id proxy-config-code :512, copy button)
- **Reset the OIDC provider to default values** — 'Reset to Defaults' button in the dialog that restores the default values.
  - Web (Yes): SparkyFitnessFrontend/src/pages/Admin/OidcProviderDialog.tsx:552-556 and toast defaultsRestored :79
- **Allow users to configure their own AI services** — Global toggle allow_user_ai_config; if it is disabled, users can only use the global AI services.
  - Web (Yes): SparkyFitnessFrontend/src/pages/Admin/GlobalAISettings.tsx:309-326 (Switch id allow_user_ai_config :322)
- **Allow AI endpoints on a private network/LAN** — Toggle that lets non-admin users connect AI services (e.g. Ollama) to private IPs.
  - Web (Yes): SparkyFitnessFrontend/src/pages/Admin/GlobalAISettings.tsx:329-358 (Switch id allow_private_network_ai :351)
- **Default global vision AI service** — Selector for the global service to which vision tasks (food photos) are routed for users without a personal service; 'None' option to fall back to the global text service.
  - Web (Yes): SparkyFitnessFrontend/src/pages/Admin/GlobalAISettings.tsx:363-402 (Select id global-vision-ai-service-select :381)
- **Add a global AI service** — Form to create an AI service shared by the whole instance: type, name, API key, custom URL, model (or custom name), chat tool set (Full/Core), and connection test before saving.
  - Web (Yes): SparkyFitnessFrontend/src/pages/Admin/GlobalAISettings.tsx:405-445 (ServiceForm :423 with onTestConnection); SparkyFitnessFrontend/src/components/ai/ServiceForm.tsx:198 (chat_tool_profile)
- **Edit, test, and delete global AI services** — List of global services with the 'Global' badge, inline editing (incl. active/inactive), connection test, and deletion with a confirmation dialog.
  - Web (Yes): SparkyFitnessFrontend/src/pages/Admin/GlobalAISettings.tsx:449-475 (ServiceList), :488-513 (delete AlertDialog); SparkyFitnessFrontend/src/components/ai/ServiceListItem.tsx:58-61, :96, :112
- **Allow recipe providers on a private network/LAN** — Toggle so that non-admin users can connect recipe providers (Mealie, Tandoor) to private IPs.
  - Web (Yes): SparkyFitnessFrontend/src/pages/Admin/GlobalProviderSettings.tsx:54-85 (Switch id allow_private_network_food_providers :74)
- **Allow local capture of provider responses** — mock_data_enabled toggle that adds raw-response capture/replay options to the sync dialog for debugging.
  - Web (Yes): SparkyFitnessFrontend/src/pages/Admin/GlobalProviderSettings.tsx:87-115 (Switch id mock_data_enabled)
- **Diagnostic sync modes (live / capture / replay)** — With capture enabled, a provider's sync range dialog shows the 'Troubleshooting' section to sync normally, save the raw responses to a file on the server, or replay that file.
  - Web (Yes): SparkyFitnessFrontend/src/pages/Settings/SyncRangeDialog.tsx:54-56 (useMockDataEnabled), :308-360 (live/capture/replay radios)
- **Allow Open Food Facts contributions on the server** — 'Open Food Facts contributions' card with the allow_openfoodfacts_contributions server toggle that enables manual user contributions (global credentials as fallback).
  - Web (Yes): SparkyFitnessFrontend/src/pages/Admin/OpenFoodFactsAdminContributionSettings.tsx:8-64; rendered in SparkyFitnessFrontend/src/pages/Admin/GlobalProviderSettings.tsx:119
- **Add global data provider (foods/exercises)** — Form to create global providers (e.g. USDA) with system keys used automatically by everyone; excludes strictly private/OAuth providers (Garmin, Strava).
  - Web (Yes): SparkyFitnessFrontend/src/pages/Admin/GlobalProviderSettings.tsx:121-126; SparkyFitnessFrontend/src/pages/Settings/AddExternalProviderForm.tsx:197 (isAdminMode branch), :377 (filters is_strictly_private)
- **Edit, enable/disable and delete global providers** — 'Configured Global Providers' list with editing (name, type, app id/key, base URL), active toggle and deletion with a warning that all users will lose access.
  - Web (Yes): SparkyFitnessFrontend/src/pages/Admin/GlobalProviderSettings.tsx:128-140; SparkyFitnessFrontend/src/pages/Settings/ExternalProviderList.tsx:307-320, :449-478; SparkyFitnessFrontend/src/pages/Settings/ProviderCard.tsx:343-346, :384-393, :668-671
- **Canadian Nutrient File (CNF) bulk import** — Bulk import/resync button on the global CNF provider with a dialog for scope, language, source (file), library cleanup and in-progress status.
  - Web (Yes): SparkyFitnessFrontend/src/pages/Settings/ProviderCard.tsx:146 (enabled only isAdminMode), :535-570, :1054; SparkyFitnessFrontend/src/pages/Settings/CnfBulkImportDialog.tsx:193-447
- **Livsmedelsverket (Swedish database) bulk import** — Bulk import/resync button on the global Livsmedelsverket provider with language selection and sync mode.
  - Web (Yes): SparkyFitnessFrontend/src/pages/Settings/ProviderCard.tsx:148-152, :572-610; SparkyFitnessFrontend/src/pages/Settings/LivsmedelsverketBulkImportDialog.tsx:149-306
- **Enable scheduled backups** — 'Enable Scheduled Backups' toggle in the backup settings.
  - Web (Yes): SparkyFitnessFrontend/src/pages/Admin/BackupSettingsForm.tsx:128-136; container SparkyFitnessFrontend/src/pages/Admin/BackupSettings.tsx:51-92
- **Scheduled backup days and time** — Per-weekday checkboxes and a time picker (showing the local timezone) for the scheduled backup.
  - Web (Yes): SparkyFitnessFrontend/src/pages/Admin/BackupSettingsForm.tsx:139-180 (type="time" :174)
- **Backup retention (days)** — 'Keep backups for (days)' field to purge old backups.
  - Web (Yes): SparkyFitnessFrontend/src/pages/Admin/BackupSettingsForm.tsx:182-196
- **Location and status of the last backup** — Shows the storage path (/app/SparkyFitnessServer/backup) and the status/date of the last backup.
  - Web (Yes): SparkyFitnessFrontend/src/pages/Admin/BackupSettingsForm.tsx:199-215; BackupSettings.tsx:79
- **Save backup settings** — 'Save Settings' button that persists schedule and retention.
  - Web (Yes): SparkyFitnessFrontend/src/pages/Admin/BackupSettingsForm.tsx:219-230; server SparkyFitnessServer/routes/backupRoutes.ts:328
- **Run an immediate manual backup** — 'Run Manual Backup Now' button.
  - Web (Yes): SparkyFitnessFrontend/src/pages/Admin/BackupSettingsForm.tsx:231-242; server SparkyFitnessServer/routes/backupRoutes.ts:102
- **Backup listing and download** — 'Download Backup' button that opens the 'Available Backups' dialog with start date, size and download for each file.
  - Web (Yes): SparkyFitnessFrontend/src/pages/Admin/BackupSettingsForm.tsx:243-254; SparkyFitnessFrontend/src/pages/Admin/BackupListDialog.tsx:82-215; server backupRoutes.ts:410,460
- **Restore backup** — Upload of a .tar.gz file with warnings (3-2-1 strategy, full data wipe), confirmation and automatic sign-out after restoring.
  - Web (Yes): SparkyFitnessFrontend/src/pages/Admin/BackupSettingsForm.tsx:252-293 (accept=".tar.gz" :286); SparkyFitnessFrontend/src/pages/Admin/BackupSettings.tsx:32-50 (confirm + signOut)
- **User list with search and sorting** — User table with search by name/email (multi-term, debounced) and sorting by name, email, admin, active, creation, last login, TOTP and email MFA.
  - Web (Yes): SparkyFitnessFrontend/src/pages/Admin/UserManagement.tsx:258-345 (search :264-273, SortableHead :286-344), :197-234 (processing)
- **Edit a user's full name** — Inline name editing (click on the cell) with confirmation.
  - Web (Yes): SparkyFitnessFrontend/src/pages/Admin/UserManagement.tsx:355-380, :71-109
- **Grant/revoke admin role** — Per-user toggle to switch between user and admin role, with confirmation.
  - Web (Yes): SparkyFitnessFrontend/src/pages/Admin/UserManagement.tsx:386-394, :158-176
- **Activate/deactivate user account** — Toggle to deactivate or reactivate an account, with confirmation.
  - Web (Yes): SparkyFitnessFrontend/src/pages/Admin/UserManagement.tsx:397-406, :138-156
- **View sign-up date, last login and MFA status** — Columns for creation date, last sign-in and TOTP / email MFA status (read-only).
  - Web (Yes): SparkyFitnessFrontend/src/pages/Admin/UserManagement.tsx:407-424 (Switch disabled :420)
- **Reset a user's password** — Action that sends the user a password reset email (via Better Auth).
  - Web (Yes): SparkyFitnessFrontend/src/pages/Admin/UserManagement.tsx:425-433, :124-136; server SparkyFitnessServer/routes/adminRoutes.ts:458-480
- **Reset a user's MFA** — Action to clear the MFA configuration of a locked-out user.
  - Web (Yes): SparkyFitnessFrontend/src/pages/Admin/UserManagement.tsx:435-443, :178-187; server adminRoutes.ts:511
- **Delete user** — Deletion of an account with confirmation.
  - Web (Yes): SparkyFitnessFrontend/src/pages/Admin/UserManagement.tsx:446-453, :111-122; server adminRoutes.ts:129
  - Note: Neither client allows creating users from the admin panel.
- **Developer resources: API documentation** — 'Developer Resources' section in Settings > Developer & Integrations with links to Swagger UI (interactive) and Redoc (read-only).
  - Web (Yes): SparkyFitnessFrontend/src/pages/Settings/DevloperResources.tsx:10-73 (/api/api-docs/swagger, /api/api-docs/redoc); mounted in SparkyFitnessFrontend/src/pages/Settings/SettingsPage.tsx:456
- **Generate API keys** — Create an API key with description, expiration (never, 7/30/90 days, 1 year) and access level (full or read-only); the key is shown only once with a copy button.
  - Web (Yes): SparkyFitnessFrontend/src/pages/Settings/ApiSettings.tsx:146-190 (new key + copy), :193-273 (description, Expires In, Access, Generate)
- **List and revoke API keys** — List of keys with description, status (disabled, read-only), creation date, expiration (highlighted if expired), last used and delete button.
  - Web (Yes): SparkyFitnessFrontend/src/pages/Settings/ApiSettings.tsx:295-400
- **Clean up expired API keys** — Button to bulk-delete expired keys.
  - Web (Yes): SparkyFitnessFrontend/src/pages/Settings/ApiSettings.tsx:277-291 (handleCleanupExpiredKeys)
- **Minimum logging level** — Preference that controls the verbosity of client logs (debug/info/warn/error).
  - Web (Yes): SparkyFitnessFrontend/src/pages/Settings/PreferenceSettings.tsx:516-530 ('Minimum Logging Level')
- **App/server version in 'About'** — The web shows the SparkyFitness version reported by the server (/version/current) in the footer and in the dialog.
  - Web (Yes): SparkyFitnessFrontend/src/api/general.ts:6-10; App.tsx:156, :237; AboutDialog.tsx:72-79; MainLayout.tsx:85, :673-675
- **Technologies and external APIs used** — List of frontend/backend technologies and external APIs (Wger, Nutritionix, FatSecret, Open Food Facts, USDA, Swiss database, CNF).
  - Web (Yes): SparkyFitnessFrontend/src/components/AboutDialog.tsx:116-170
- **Link to the Discord community** — Link to discord.gg/vcnMT5cPEA.
  - Web (Yes): SparkyFitnessFrontend/src/components/AboutDialog.tsx:80-97
- **Link to contribute translations (Weblate)** — 'Translate' pill that opens weblate.sparkyfitness.com.
  - Web (Yes): SparkyFitnessFrontend/src/layouts/MainLayout.tsx:497-501 and :661-665
- **GitHub star counter** — Badge with the repository's star count (GitHub API) that links to the repo.
  - Web (Yes): SparkyFitnessFrontend/src/components/GitHubStarCounter.tsx:12-48; used in MainLayout.tsx:488 (desktop) and :652 (mobile web footer); src/api/general.ts:14-31
- **Automatic new-version notice (GitHub)** — On sign-in, the latest GitHub release is fetched (/version/latest-github) and, if there is a new version that has not been dismissed, the new-version dialog opens with a 'Don't show again for this version' option.
  - **Updated in PR #3149 (merged):** Admins can now turn the release check off with a switch in the web admin settings (on by default); when it is off, the server does not contact GitHub and the new-version dialog never opens. Mobile still has no new-version notice.
  - Web (Yes): SparkyFitnessFrontend/src/components/AppSetup.tsx:36-62; App.tsx:165-168 (dismissedReleaseVersion in localStorage), :251-261; src/api/general.ts:36-40
- **'What's New' with GitHub release notes** — Footer 'What's New' link that refreshes and shows the latest release: Markdown notes with links to PRs, commits and @users, publication date and a 'View on GitHub' link.
  - Web (Yes): SparkyFitnessFrontend/src/layouts/MainLayout.tsx:679-684, :700-705; App.tsx:160-163 (invalidates cache and opens); src/components/NewReleaseDialog.tsx:35-60 (formatGithubReleaseNotes), :436-450 (View on GitHub)
- **Mandatory acknowledgment of breaking changes (BREAKING)** — If the notes contain 'breaking change', the dialog requires scrolling to the bottom, ticking an acknowledgment checkbox and typing 'BREAKING' before it can be closed; it tells the user to contact the administrator.
  - Web (Yes): SparkyFitnessFrontend/src/components/NewReleaseDialog.tsx:72-100 (hasBreakingChange, canClose, scroll), :370-432 (checkbox, admin text, BREAKING input), :451-462 (disabled button)

#### Mobile only (12)

- **Connect the client to the server using an API key** — 'API Key' tab in the server configuration to authenticate with a key instead of username/password.
  - Mobile (Yes): SparkyFitnessMobile/src/components/ServerConfigModal.tsx:62 (AuthTab 'apiKey'), :688, :739-741, :854, :1061
  - Note: The key is generated on web (admin-dev-api-key-generate) and consumed on mobile.
- **App log viewer** — 'View Logs' screen with persisted status filters (error, warning, info, debug), copying an entry to the clipboard and clearing all logs.
  - Mobile (Yes): SparkyFitnessMobile/src/screens/LogScreen.tsx:223-345 (filters), :230-265 (Clear), :272-290 (copy); entry point in src/screens/SettingsScreen.tsx:389-394; route App.tsx:954-958
- **Share diagnostic report** — Generates a local report (app version, connection/sync status, preferences, query state, logs) without personal data and shares it via the system share sheet.
  - Mobile (Yes): SparkyFitnessMobile/src/screens/SettingsScreen.tsx:148-180 (handleShareDiagnosticReport), :403-420; src/services/diagnosticReportService.ts:197-210 (File in Paths.cache + Sharing.shareAsync)
- **Native app version and build number** — Shows 'Version X (build Y)' of the installed app.
  - Mobile (Yes): SparkyFitnessMobile/src/screens/AboutScreen.tsx:64-71 (expo-application nativeApplicationVersion / nativeBuildVersion)
- **Privacy policy link** — Opens the privacy policy published in the documentation.
  - Mobile (Yes): SparkyFitnessMobile/src/screens/AboutScreen.tsx:23-24, :129-147
  - Note: SettingsScreen.tsx:57 and :431-434 mount a PrivacyPolicyModal that is never opened (setShowPrivacyModal(true) is never called): dead code.
- **'What's New' screen with feature cards** · _Differs iOS/Android_ — Screen with illustrated cards (medications, cycle and pregnancy, workouts, Liquid Glass, chat with Sparky, home screen widget, AI photo scanning) and buttons that lead to each feature.
  - Mobile (Yes): SparkyFitnessMobile/src/screens/WhatsNewScreen.tsx:559-690 (features with CTA to MedicationsList, AppSettings, Chat, FoodScan); row in src/screens/SettingsScreen.tsx:381-388; route App.tsx:1121-1125
  - iOS/Android: The 'A Liquid Glass look' card only appears on iOS 26+ with glass APIs (WhatsNewScreen.tsx:567-568, :615-637; canUseLiquidGlass in src/utils/liquidGlass.ts:9-10 returns false outside iOS). Android and older iOS see one fewer card.
- **What's New banner in the tab bar** · _Differs iOS/Android_ — Dismissible 'What's new' banner above the tab bar that opens the What's New screen; it appears when WHATS_NEW_CONTENT_VERSION changes, not on fresh installs, and is hidden during an active workout.
  - Mobile (Yes): SparkyFitnessMobile/src/components/WhatsNewBanner.tsx:38-89 (state/eligibility), :94-200 (legacy/glass presentations); src/components/TabsLayout.tsx:104-127, :256-259, :365; src/services/whatsNewBanner.ts:7, :39-42
  - iOS/Android: On iOS with native tabs (Liquid Glass) it is shown with an overlaid 'glass' presentation in each scene (NativeTabsBannerOverlay); on Android and on iOS without native tabs it renders in 'legacy' style inside the custom bar.
- **Anonymized health data report (Health Data Report)** · _Android only_ — 'Health Data Report' button on the health sync screen that reads the last 4 hours of Health Connect, rounds values for privacy and generates a report to attach to bug reports via the share sheet.
  - Mobile (Yes): SparkyFitnessMobile/src/screens/SyncScreen.tsx:100 (import shareHealthDiagnosticReport), :706-722 (handleShareHealthReport), :1011-1050 ('Health Data Report — Android only' block with isAndroid); src/services/healthDiagnosticService.ts:66, :364 (rounding for privacy).
  - iOS/Android: Gated on isAndroid = Platform.OS==='android' (SyncScreen.tsx:190, :1012); on iOS there is no equivalent HealthKit-based report.
  - Note: Complements 'Share diagnostic report' (Settings), which is available on both platforms but does not include health data.
  - _Verification: added during verification_
- **Switch to API key from the session-expired modal** — When the session expires, the reauthentication modal (and its MFA step) offers 'Use API Key Instead', which opens the server configuration directly on the 'API Key' tab so the user can stay connected with a key.
  - Mobile (Yes): SparkyFitnessMobile/src/components/ReauthModal.tsx:469-472 (handleSwitchToApiKey), :654-663 ('Use API Key Instead' button), :680-682 (onUseApiKey in MfaForm); App.tsx:1299-1312 (ServerConfigModal with defaultAuthTab='apiKey'); src/hooks/useAuth.ts:143.
  - _Verification: added during verification_
- **Open the web dashboard from the mobile app** — 'Open Web' button in Settings > Server that opens the active server's URL in an in-app browser (with Linking as a fallback). It is the only way for an admin to reach the admin panel from mobile, albeit outside the native UI.
  - Mobile (Yes): SparkyFitnessMobile/src/screens/ServerSettingsScreen.tsx:199-238 (openWebDashboard: WebBrowser.openBrowserAsync, fallback Linking.openURL), :395-404 ('Open Web' button); Server row in SettingsScreen.tsx:215-217.
  - Note: Relevant to admin-panel-access: mobile has no admin UI, but it can open the web app.
  - _Verification: added during verification_
- **Test server connection** — 'Test Connection' button that re-checks the connection to the active server and shows a 'Connected' or 'Connection failed' toast; the active server card also shows the connection status.
  - Mobile (Yes): SparkyFitnessMobile/src/screens/ServerSettingsScreen.tsx:241-256 (handleTestConnection with refetchConnection), :365-375 (Connected/Connection failed status), :406-422 (button).
  - _Verification: added during verification_
- **Custom proxy headers per server** — In the server configuration's 'Advanced options' you can add, hide/show and remove custom HTTP headers (e.g. X-Access-Token for Cloudflare Access or authenticating proxies) that the app sends with every request, with a warning when using reserved headers.
  - Mobile (Yes): SparkyFitnessMobile/src/components/ServerConfigModal.tsx:104-111 (proxyHeaders/showHeaders state), :786-800 ('Reserved Header' alert), :1163-1290 (Advanced options > Proxy Headers: Add header, name, value, show/hide, remove).
  - _Verification: added during verification_

#### In both, with differences (1)

- **Client-side application of the login methods configured by the admin** — The sign-in screen reads /api/auth/settings and shows or hides email/password, passkey, and OIDC provider buttons (with logo) according to what the admin has configured.
  - Web (Yes): SparkyFitnessFrontend/src/pages/Auth/Auth.tsx:66-100 (useAuthSettings; passkeyEnabled; auto-redirect to a single OIDC provider if auto_redirect and email is disabled :87-100)
  - Mobile (Partial): SparkyFitnessMobile/src/components/ServerConfigModal.tsx:829-863, :997-1012 (OIDC providers with logo_url), :1022 (passkey); src/components/ReauthModal.tsx:481-615; src/screens/OnboardingScreen.tsx:731-745. The auto_redirect field is typed in src/services/api/authService.ts:551 but not used.
  - Note: Partial on mobile: it does not implement auto-redirect to the single OIDC provider; instead, if there are no standard methods, it suggests using an API key or contacting the administrator (ServerConfigModal.tsx:1052).

<details><summary>Web ↔ mobile parity (5)</summary>

- 'About' screen/dialog
- Link to the GitHub repository
- Documentation link
- Project announcements (modal)
- Project announcements (announcement modal)

</details>

<details><summary>Discarded after verification: exists in neither client (11)</summary>

- React Query Devtools cache inspector — SparkyFitnessFrontend/src/App.tsx:36, :486 (ReactQueryDevtools buttonPosition="top-left"); only rendered in development builds (NODE_ENV=development).
- Mobile Dev Tools: seed test health data — No web equivalent.
- Mobile Dev Tools: seed rich workout and strength session — No web equivalent.
- Mobile Dev Tools: Health Connect shortcuts — No web equivalent.
- Mobile Dev Tools: force background sync — No web equivalent.
- Mobile Dev Tools: Apple Watch status — No web equivalent.
  - **Updated in PR #3052 (merged):** The Dev Tools watch section now also shows on Android, titled Wear OS, with the same paired and reachable indicators read from the Android watch link. It is still only in development builds.
- Mobile Dev Tools: show reauthentication modal — No web equivalent.
- Mobile Dev Tools: reset What's New banner — No web equivalent (the web only stores dismissedReleaseVersion in localStorage, App.tsx:165-168).
- Mobile Dev Tools: reset announcement — No web equivalent.
- Mobile Dev Tools: cycle card gallery — No web equivalent.
- GitHub Sponsor button — The component exists (SparkyFitnessFrontend/src/components/GitHubSponsorButton.tsx:11-34) but is disabled: SHOW_SPONSOR_BUTTON = false in src/layouts/MainLayout.tsx:52 (uses :489-491, :653-655).

</details>

### 2.3 Food diary & daily logging

#### Web only (14)

- **Deep link to a date (?date=) and food highlight (?highlight=)** — The diary date is reflected in the URL, and a specific food can be highlighted when arriving from another screen (e.g. food deletion).
  - **Partly covered by PR #2989 (merged):** Both platforms accept the sparkyfitnessmobile://diary link (the Android Calories left tile uses it), and it opens the Diary tab. The app does not read a date from the link and cannot highlight a food, so the web's ?date= and ?highlight= still have no mobile equivalent.
  - Web (Yes): Diary.tsx:74-76,510-513 (searchParams date); MealCard.tsx:153-154,400-402 (highlight); pages/Foods/DeleteFoodDialog.tsx:112
- **Customize diary layout (widgets)** — 'Layout' mode to drag, resize, hide/restore and maximize cards and to reset the layout; saved on the server.
  - Web (Yes): SparkyFitnessFrontend/src/pages/Diary/DiaryWidgetGrid.tsx; components/widgets/WidgetGrid.tsx:216-241 (hide/restore/reset), 257-291 (Layout/Done toolbar), 316-327 (drag/resize), 351-373 (maximize)
- **Advanced scanner options (engine, camera, continuous, refocus)** — Choose the decoding engine (zxing, html5-qrcode, quagga2), camera, continuous/single mode, and 'Refresh Focus'.
  - Web (Yes): components/FoodSearch/BarcodeScanner.tsx:38-46 (ENGINE_OPTIONS), 344-361 (Engine/Camera), 496-523 (Continuous/Single, Refresh Focus)
- **Copy meal from yesterday** — Copy in one click the entries of that meal type from the previous day.
  - Web (Yes): MealCard.tsx:232-237,352-361 (useCopyFoodEntriesFromYesterdayMutation)
- **Copy the whole day (to another date or from yesterday)** — Copy all of the day's meals to another date, or copy everything from yesterday.
  - Web (Yes): pages/Diary/NutritionSummaryCard.tsx:116-127 (Copy entire day / Copy all from yesterday), 279-284 (CopyFoodEntryDialog sourceMealType='all')
- **Create meal (template) from the diary** — Convert the entries of one of the day's meals into a reusable meal template (name, description, public).
  - Web (Yes): MealCard.tsx:362-371; pages/Diary/ConvertToMealDialog.tsx:72-126
- **Log/edit in a family member's diary** — Manage another person's diary by acting on their behalf with the can_manage_diary permission.
  - Web (Yes): components/ProfileSwitcher.tsx; contexts/ActiveUserContext.tsx (activeUserId used in Diary.tsx:64,272-283)
- **Copy meal to a family member** — Send your own entries to a family member's diary.
  - Web (Yes): CopyFamilyEntryDialog.tsx:157-175,233 ('Copy To Family' tab)
- **Calorie target calculation breakdown** — Dialog showing the target math: BMR and algorithm, body fat, activity multiplier, goal mode, and adjustments.
  - Web (Yes): DailyProgress.tsx:812-837; components/CalorieTargetBreakdown.tsx
- **Incomplete profile warning** — Alert when weight/height/age (or body fat) are missing to calculate BMR, with a link to profile or measurements.
  - Web (Yes): DailyProgress.tsx:595-639
- **Status based on goal direction** — Colors and icons based on the goal type (maximum, range): green check, red when exceeded, amber when out of range, and a target band on the ring.
  - Web (Yes): NutritionSummaryCard.tsx:186-249; DailyProgress.tsx:363-385 (targetBand)
  - _Verification: corrected during verification_
- **Daily wearable health summary** — Card with the day's Body Battery, average stress, resting HR, recovery, readiness, fitness age, and training load.
  - Web (Yes): Diary.tsx:401-411; components/Health/DailyHealthMetricsCard.tsx:53-316
- **Import food diary from CSV** — Upload or paste a CSV, download a template, edit rows, choose the food-matching scope and import.
  - Web (Yes): pages/Diary/FoodDiaryImportCSV.tsx:718-1000; pages/Settings/DataImportSettings.tsx:162-168
- **Export food diary to CSV** — Download the whole diary as CSV, choosing the delimiter.
  - Web (Yes): pages/Settings/DataManagementSettings.tsx:26-81 (useDownloadDiaryExport)

#### Mobile only (19)

- **Change day by swiping and return to today by re-tapping the tab** — Left/right swipe gesture to change day; tapping the Diary tab again returns to today and scrolls back to the top.
  - Mobile (Yes): SparkyFitnessMobile/src/screens/DiaryScreen.tsx:240-253 (Gesture.Fling), 132-139 (tabPress -> goToToday)
- **Calendar markers for days with progress photos** — The date picker marks days that have progress photos with a dot.
  - Mobile (Yes): SparkyFitnessMobile/src/screens/DiaryScreen.tsx:145-157 (useCheckInPhotoDates on open), 786/832 (markedDates in CalendarSheet)
- **Create a new meal (template) from search** — 'New Meal' option in search to create a meal template.
  - Mobile (Yes): FoodSearchScreen.tsx:473-475, 534-540 (New Meal -> MealAdd)
- **Choose date when logging ('Use Yesterday'/'Use Today')** — Change the target date within the logging form itself.
  - Mobile (Yes): FoodEntryAddScreen.tsx:1711-1745 (DateSelectRow + Use Yesterday/Use Today); FoodEntryMultiAddScreen.tsx:384
- **Multi-select and batch add** — Select several foods in search and review them (quantity, serving, meal per item or for all) before adding them together.
  - Mobile (Yes): FoodSearchScreen.tsx:228-262 (limit), 1253-1503 (Select/Select all/Review); screens/FoodEntryMultiAddScreen.tsx:344-623
- **Fallbacks when the barcode is not found** — When there is no match, offer to scan the nutrition label or add the food manually.
  - **Partly covered by PR #3126 (merged):** When a barcode is not found, the web now keeps a 'No product found' message on the page with an Other sources button that checks the other enabled barcode providers. The web still offers no nutrition label scan or add-manually button there, and the mobile No match card, which has both, cannot check other sources.
  - Mobile (Yes): FoodScanScreen.tsx:1044-1098 (No match -> Scan Nutrition Label / Add Food Manually)
  - _Verification: corrected during verification_
- **On-device label scanning (Apple Intelligence)** · _iOS only_ — Reads the label with Apple's local model before falling back to the server, with a source banner and an option to re-read with the other AI.
  - Mobile (Yes): modules/on-device-nutrition/expo-module.config.json (platforms: ios); services/onDeviceLabelScan.ts:15-21; FoodScanScreen.tsx:582-616 ('Label read on this iPhone'); screens/AiSettingsScreen.tsx:61-140; components/LabelScanSourceBanner.tsx
  - iOS/Android: Requires iOS 27+ with Apple Intelligence and the 'Scan Labels On Device' preference; on Android the server AI is always used.
- **Quick serving adjustment from the row** · _Differs iOS/Android_ — Tapping a row's calories (or long-pressing) opens a sheet to change the quantity without going into edit.
  - Mobile (Yes): SwipeableFoodRow.tsx:93-131,183-193; components/ServingAdjustSheet.tsx:139-183; DiaryScreen.tsx:661-663,788-793
  - iOS/Android: On Android the Back button does not close ServingAdjustSheet (BottomSheetModal without useSheetHardwareBack). Not available for components of logged meals.
- **Move an entry to another date** — Change the date of a logged entry or meal when editing it.
  - Mobile (Yes): FoodEntryViewScreen.tsx:1371-1380 (Date); EditLoggedMealScreen.tsx:556-564
- **Edit the nutrition of a specific entry** — Override the nutritional values stored on an entry without touching the library food.
  - Mobile (Yes): FoodEntryViewScreen.tsx:1138,1259 ('Tap to edit nutrition'), 1353-1356 (more nutrients)
- **Log water without opening the app** · _Differs iOS/Android_ — Log water from Siri/Shortcuts, a widget, Control Center, a quick action, or a launcher shortcut.
  - **Partly covered by PRs #2989 and #3020 (merged):** Android now logs water without opening the app from the launcher Log water shortcut, a Log water Quick Settings tile (also from the lock screen) and a 2x2 home screen water widget whose − and + buttons remove or add one drink of the Dashboard's container. Siri/Shortcuts, the Action button, the Remove a drink control and Lock Screen water widgets are still iOS-only, and the Android water widget comes in one size only (iOS has small and medium).
  - Mobile (Yes): targets/widget/ShortcutIntents.swift, Controls.swift, waterWidget.swift; hooks/useQuickActions.ts:24-35,142; targets/android-background-water
  - iOS/Android: iOS: Siri/Shortcuts, water widget with +/-, iOS 18 controls, and app icon quick action. Android: only the 'Log water' dynamic shortcut in the launcher.
- **Hydration reminders** — Local notifications to drink water within a time window.
  - Mobile (Yes): screens/NotificationSettingsScreen.tsx:80-90; components/HydrationReminderReconciler.tsx; utils/hydrationReminder.ts
- **Run program banner and effort rating** — Shows the program's scheduled run (Start / Count it) and prompts for an effort rating in the diary.
  - **Partly covered by PRs #2948 and #3154 (merged):** The web Diary now shows the training program's workout in the Exercise card (Scheduled Today, Scheduled or Up next), with a link to the program and, on today, a Mark as done button; the mobile banner has neither. Mobile still also has Start to record it, Count it for a run logged another way, Ease back in after a break or a jump in load, the effort rating prompt and the fitness retest prompt, none of which the web Diary has.
  - Mobile (Yes): DiaryScreen.tsx:675-691 (RunEffortPrompt, RunProgramBanner)
- **Sleep cards in the diary** — Wake-up, naps and bedtime cards for the day.
  - Mobile (Yes): DiaryScreen.tsx:303-309,648-652,740-745 (WakeUpCard, NapsCard, BedTimeCard)
- **Measurements and progress photos in the diary** — Summary of the day's manual measurements and progress photo thumbnails with an add shortcut.
  - Mobile (Yes): DiaryScreen.tsx:746-765 (MeasurementsSummary -> MeasurementsAdd, CheckInPhotosSummary -> ProgressPhotos)
- **Write diary nutrition and hydration to the health app** · _Differs iOS/Android_ — Send the diary's nutrition and water totals to Apple Health or Health Connect.
  - Mobile (Yes): src/services/writeback.ios.ts -> healthkit/writeback.ts; src/services/writeback.ts -> healthconnect/writeback.ts:90-175; components/HealthDataWriteback.tsx
  - iOS/Android: iOS writes to HealthKit; Android to Health Connect (WRITE_NUTRITION/WRITE_HYDRATION). Opt-in per metric.
- **Widgets with diary calories/macros** · _Differs iOS/Android_ — Home screen/lock screen widgets with the day's remaining calories and macros.
  - **Partly covered by PRs #2989 and #3020 (merged):** Android now has calories, macros and water widgets (the water one with − and + buttons that work without opening the app) and four Quick Settings tiles as the counterpart of the iOS controls: Log water, Scan barcode, Search food, and Calories left with today's kcal left in its label, also on the lock screen. Still iOS-only: the Lock Screen widget families and the Start fast, End fast and Remove a drink controls, though on Android the water widget's − button does the same as the last one. The Android calories widget still lacks consumed and burned, and the calories and macros widgets are still a fixed 2x1 and 2x2.
  - Mobile (Yes): targets/widget/widgets.swift, macroWidget.swift, waterWidget.swift; targets/android-widget/kotlin/.../CalorieWidget.kt.tmpl, MacroWidget.kt.tmpl
  - iOS/Android: iOS: calories, macros and water, plus lock screen families and controls. Android: Glance widgets for calories and macros.
- **Shortcuts to scan/log food** · _Differs iOS/Android_ — App icon actions and Control Center controls that open the food scanner or food search.
  - **Updated in PR #2989 (merged):** Android now has Scan food and Log food among the app icon actions, plus Scan barcode and Search food Quick Settings tiles that open the same screens and serve as the counterpart of the iOS Control Center controls. The iOS Action button, which can also run these controls, still has no Android equivalent.
  - Mobile (Yes): hooks/useQuickActions.ts:24-35,114-118,142,170 (Platform.OS === 'ios'); targets/widget/Controls.swift (ScanFoodControlIntent/LogFoodControlIntent)
  - iOS/Android: The Android shortcut only offers 'Log water'.
  - _Verification: corrected during verification_
- **Diary nutrition and water on Apple Watch** · _iOS only_ — Goals page with a calorie ring and selected nutrients, and a water page with tap-to-log and water from foods.
  - **Updated in PR #3052 (merged):** The Wear OS app now has the same two pages. Its Goals page shows a calorie ring with eaten against the goal, kcal left and the nutrients picked on the phone under Settings > Wear OS, but not calories burned, which the Apple Watch shows beside the ring. Its Water page has one button per container, progress against the goal, the water from food and a Log button with the day's drinks, plus an Undo Last button that removes a drink without asking (the day's earliest, not the latest, once taps have synced, because the phone sends the drinks newest first).
  - Mobile (Yes): targets/watch/Presentation/GoalSummaryView.swift, WaterIntakeView.swift; hooks/useWatchCheckInBridge.ts; utils/watchNutrients.ts
  - iOS/Android: No Wear OS equivalent.

#### In both, with differences (29)

- **Date navigation (previous/next/Today/calendar)** · _Differs iOS/Android_ — Previous and next day buttons, a 'Today' button and a calendar date picker.
  - Web (Yes): SparkyFitnessFrontend/src/components/DayNavigator.tsx:78-190 (prev/next, Today, Popover Calendar); Diary.tsx:508-515
  - Mobile (Partial): SparkyFitnessMobile/src/components/DateNavigator.tsx:60-95; CalendarSheet.tsx; DiaryScreen.tsx:173-232 (iOS native header), 801-817 (DateNavigator), 782-787/828-833 (CalendarSheet)
  - iOS/Android: iOS 26+ with Liquid Glass: the date controls are drawn as native header items (utils/nativeHeaderDatePicker.ts, services/nativeTabBarPreference.ts:25 iOS only). Android/older iOS: custom DateNavigator bar. On Android the system Back button does not close CalendarSheet (BottomSheetModal without useSheetHardwareBack) and navigates underneath it.
  - _Verification: corrected during verification_
- **Past/future date indicator and warning when adding** — Distinct color for past/future dates and an explicit warning when adding foods on a date other than today.
  - Web (Yes): DayNavigator.tsx:112-128 (date-past/future colors); MealCard.tsx:300-312 (warning 'You are adding food entries for a past/future date')
  - Mobile (Partial): DateNavigator.tsx:95 and DiaryScreen.tsx:176-182 color the date; there is no text warning in FoodSearch/FoodEntryAdd
- **Sections per meal type with calories and per-meal goal** — One card/section per meal type with calories consumed versus that meal's goal, plus totals.
  - Web (Yes): Diary.tsx:413-455 (one MealCard per visible type, including empty ones); MealCard.tsx:241-257 (kcal / goal), 769-817 (meal totals with configurable nutrients)
  - Mobile (Partial): SparkyFitnessMobile/src/components/FoodSummary.tsx:64-145 (header with Cal / goal), 152-170 (only groups with entries)
- **Detail of a day's meal** — Dedicated view with the full nutritional breakdown of a meal type and its list of foods.
  - Web (Partial): MealCard.tsx:769-817 shows meal totals inline (quick_info nutrients), with no dedicated view
  - Mobile (Yes): SparkyFitnessMobile/src/screens/MealTypeDetailScreen.tsx:196-252 (FoodNutritionSummary + list); DiaryScreen.tsx:260-276 (opens when tapping the header)
- **Information on each food row** — Name, brand, quantity/unit, time, thumbnail, allergens and nutrients for each entry; GI and 'From Plan' badges.
  - Web (Yes): MealCard.tsx:382-765 (per-entry nutrient grid based on quick_info preferences, GI 516-529/684-695, 'From Plan' 511-515/679-683, allergens 531-536/722-727, image 642-662)
  - Mobile (Partial): SparkyFitnessMobile/src/components/SwipeableFoodRow.tsx:142-196 (thumbnail, name, quantity, time, AllergenBadges, calories only)
- **Logged meals shown as a single entry** — A logged meal (template) appears as a single grouped row with its name and image.
  - Web (Yes): MealCard.tsx:385-414 (FoodEntryMeal as one row with meal_images); Diary.tsx:145-147
  - Mobile (Partial): SwipeableFoodRow.tsx:45,98-106 (each component is shown as its own row; tapping it opens EditLoggedMeal; deleting removes the whole meal)
- **Add food to a specific meal** — Button on each meal that opens the food search for that meal type.
  - Web (Yes): MealCard.tsx:259-336 (Utensils button -> EnhancedFoodSearch dialog)
  - Mobile (Partial): MealTypeDetailScreen.tsx:259-273 (+ button in header -> FoodSearch with mealTypeId); the diary sections have no button of their own (FoodSummary.tsx)
- **Custom unit with manual or AI-estimated conversion when logging** — Choose a unit the food does not have and obtain the conversion factor manually or via AI.
  - Web (Yes): FoodUnitSelector.tsx:703 (Custom unit...), 870-955 (manual conversion + AiEstimateSection); components/FoodUnitSelector/AiEstimateSection.tsx (Use this/Edit/Try again)
  - Mobile (Partial): Only via 'Adjust nutrition' -> FoodForm (screens/foodForm/AdjustNutritionMode.tsx) with components/FoodUnitSelectorSheet.tsx:373-510 (AI estimate, Saved Custom Units); FoodEntryAddScreen.tsx:982-1016 (saves equivalent units)
- **Adjust nutrition before logging and save an external food** — Modify nutritional/serving values before logging and save an online result to the library.
  - Web (Partial): components/FoodSearch/FoodResultCard.tsx:287-296 ('Edit & Add' only for online results, opens FoodFormDialog); local foods do not allow overrides in FoodUnitSelector
  - Mobile (Yes): FoodEntryAddScreen.tsx:1353-1400 (handleAdjustNutrition -> FoodForm 'adjust-entry-nutrition'), 1533-1562 (Adjust nutrition and Save Food)
- **Allergen warning when logging** — Warning banner when the food contains an allergen the user tracks, in addition to badges on rows.
  - Web (Partial): Badges in components/FoodSearch/FoodResultCard.tsx, VariantCard.tsx and MealCard.tsx:531-536; no banner in FoodUnitSelector
  - Mobile (Yes): components/AllergenWarning.tsx:48 used in FoodEntryAddScreen.tsx:1; AllergenBadges in SwipeableFoodRow.tsx:181 and foodSearch/FoodResultRow.tsx:136
- **Log a saved meal (template)** — Log a meal from the library, adjusting servings and ingredients before saving it.
  - Web (Yes): pages/Diary/LogMealDialog.tsx:44-95 (MealBuilder with editable ingredients, servings, time, favorite)
  - Mobile (Partial): FoodEntryAddScreen.tsx:1696-1698,1877 ('meal makes N servings', 'Add Meal'): servings only; ingredients can be edited afterwards in EditLoggedMealScreen
- **Choose data provider when scanning** — Picker inside the scanner for the provider that will resolve the barcode.
  - **Partly covered by PR #3126 (merged):** Mobile still has no provider picker in the scanner and looks the barcode up with the provider set in Food Settings. After a match, though, the add screen shows the result's source and an Other sources sheet with the other enabled providers' results, and picking one replaces the food for that entry. When the default lookup finds nothing, mobile offers no other source, while the web lets you pick the provider in the scanner and has the same Other sources comparison.
  - Web (Yes): components/FoodSearch/BarcodeScannerDialog.tsx:48-101 (Data Provider)
  - Mobile (Partial): FoodSearchScreen.tsx:481-487 (no providerId is passed; the server uses default_barcode_provider_id from Food Settings)
  - _Verification: corrected during verification_
- **Scan nutrition label with server AI** — Take a photo of a nutrition facts table or pick one from the gallery and create the food with its values read by AI.
  - Web (Partial): No use of /api/foods/scan-label in SparkyFitnessFrontend/src
  - Mobile (Yes): FoodScanScreen.tsx:168-189 (Label segment), 582-641, 1213-1237 (take/pick photo); services/api/externalFoodSearchApi.ts:732; screens/foodForm/CreateFoodMode.tsx:709
  - _Verification: corrected during verification_
- **AI meal estimate from a photo** — Take or pick a photo of the dish so the AI estimates ingredients and nutrition, and log it to the diary.
  - Web (Partial): Only inside the Sparky chat: components/thread.tsx:401 (sparky_analyze_food_image -> FoodPhotoEstimateToolUI); hooks/Foods/useFoodPhotoEstimate.ts:10-14 (web does not have the direct REST route)
  - Mobile (Yes): FoodScanScreen.tsx:1107-1173,1255-1311 (Photo mode); screens/FoodPhotoIntroScreen.tsx; components/FoodPhotoFlow.tsx; screens/FoodPhotoLogEntryScreen.tsx:332-420 (meal, date, servings)
- **Improve estimate (more photos, total weight, description)** — Add more images, enter total weight and a description, and regenerate the estimate.
  - Web (Partial): On web you can only keep chatting/attaching in the chat (components/thread.tsx); there is no dedicated form
  - Mobile (Yes): screens/FoodPhotoImproveScreen.tsx:557-807 (Add another image, Total weight g/oz, Description, Generate estimate)
- **View a family member's diary** — View the meals logged by a family member who has shared access.
  - Web (Yes): layouts/MainLayout.tsx:506 (ProfileSwitcher, act on behalf of another user); WidgetGrid.tsx:105-107 (read-only layout)
  - Mobile (Partial): DiaryScreen.tsx:158-164,203-210,808-816 (Family access); screens/FamilyMembersScreen.tsx:25-92 ('Family diary access is managed in the web app'); FamilyDiaryScreen.tsx:99-181 (foods only, read-only)
- **Energy burned breakdown and net energy** — Detail of exercise/active/steps calories and BMR (measured or algorithm), and net energy (eaten - burned).
  - Web (Yes): DailyProgress.tsx:405-499 (tooltip), 525-593 (Energy Burned Breakdown), 774-799 (Net Energy)
  - Mobile (Partial): CalorieRingCard.tsx:80 only shows the total burned
- **Adaptive TDEE panel / device projection** — Shows adaptive TDEE with confidence, weight trend, days of data, and fallback warnings, or the device's TDEE projection.
  - Web (Yes): DailyProgress.tsx:641-726 (Adaptive TDEE), 728-773 (Device Projection)
  - Mobile (Partial): DiaryCalorieMacroSummary.tsx:272-305 (only Projected TDEE / Goal Mode target / source in tdee mode); no adaptive panel
- **Edit goals for the diary date** — Change goals (calories, macros, per-meal distribution, presets) for the selected date from the diary.
  - Web (Yes): NutritionSummaryCard.tsx:128 (EditGoalsForToday); pages/Goals/EditGoalsForToday.tsx:194-531 ('Save for this Date')
  - Mobile (Partial): screens/GoalsScreen.tsx:998 (always today), accessible only from SettingsScreen.tsx:268
- **Mini nutrition trends** — Small charts of the last 14 days per nutrient inside the nutrition summary.
  - Web (Yes): pages/Diary/MiniNutritionTrends.tsx:204,237,261-264; NutritionSummaryCard.tsx:273-276
  - Mobile (Partial): screens/NutrientTrendsScreen.tsx:31-206 (per-nutrient screen, 7/30/90 days) opened from DailyNutritionDetailsScreen.tsx:304; not in the diary
- **Day's drink history (edit time / delete)** · _iOS only_ — List of drinks logged during the day with time editing and individual deletion.
  - **Partly covered by PR #3052 (merged):** Wear OS now has the drink list too: the Water page's Log button lists today's drinks with their time, and tapping one removes it after a confirmation, as on the Apple Watch, though Wear OS lists them oldest first. Wear OS also has an Undo Last button that removes a drink without asking: the day's earliest, not the latest, once taps have synced, because the phone sends the drinks newest first. The phone app still has no drink list on either platform, and neither watch can change a drink's time as the web does.
  - Web (Yes): WaterIntake.tsx:450-600 (Today's drinks, editTime, deleteEntry)
  - Mobile (Partial): The phone does not have this list; only the Apple Watch allows deleting (targets/watch/Presentation/WaterLogView.swift:4-36; hooks/useWatchCheckInBridge.ts:1140-1158)
  - iOS/Android: Only via Apple Watch (view and delete, no time editing); does not exist on Android.
- **Caffeine kinetics** — Active caffeine, daily curve, sleep threshold, last-coffee cutoff time, sleep impact, and recent doses.
  - Web (Yes): pages/Diary/CaffeineCard.tsx:198-574 (sleep impact, half-life, Last Coffee By, curve, Recent Doses 48h); Diary.tsx:473-478
  - Mobile (Partial): components/CaffeineCard.tsx:151-301 in DashboardScreen.tsx:797-805 (Active now, At bedtime, Last dose by, curve, threshold)
- **Configure which nutrients are shown in the diary** — Preferences for nutrients visible in diary rows/summary and toggling the summary.
  - Web (Yes): pages/Settings/NutrientDisplaySettings.tsx:61-66,189-263 (summary and quick_info groups per desktop/mobile platform)
  - Mobile (Partial): screens/DiarySettingsScreen.tsx:192-240 (Diary Summary toggle + up to 4 custom nutrients, 'diary' group); SettingsScreen.tsx:322
- **Copy a meal from a family member, choosing foods and quantities** — When copying a family member's meal into your diary, select specific foods, adjust each one's quantity, see the resulting nutrition and choose the target date and meal before copying.
  - Web (Partial): pages/Diary/CopyFamilyEntryDialog.tsx:134-155 (copyFromFamily copies the whole meal type: familyUserId, sourceDate, sourceMealType, targetDate, targetMealType), 230-233 ('From' tab); no per-food selection or quantity adjustment.
  - Mobile (Yes): screens/FamilyDiaryScreen.tsx:124 (open meal), FamilyMealDetailScreen.tsx:52-53,139-143 (Select all/Deselect, select food), 211 (Continue); FamilyCopyReviewScreen.tsx:242-272 (quantity per food), 296-317 (calories/macros), 327-369 (target date and meal), 380 ('Copy to my diary'); requires canCopy (services/api/familyApi.ts:23-29).
  - _Verification: added during verification_
- **Daily goal percentage and full breakdown when logging** — When logging a food, see what percentage of the daily goal its calories and macros contribute, and the full nutrient breakdown according to preferences.
  - Web (Partial): components/FoodUnitSelector.tsx:975-1010 ('Nutrition for {{serving}}': only kcal, protein, carbs and fat, no goal percentage).
  - Mobile (Yes): screens/FoodEntryAddScreen.tsx:1587-1599 (FoodNutritionHeader with goalPercentages for calories/protein/carbs/fat -> components/NutritionMacroCard.tsx:92-121,180-181), 1825-1830 (FoodNutrientBreakdown with all nutrients).
  - _Verification: added during verification_
- **Switch to a compatible or custom unit when editing an entry** — When editing an already logged entry, choose another compatible unit or create a custom unit with a manual conversion factor.
  - Web (Yes): pages/Diary/EditFoodEntryDialog.tsx:452-520 (unit selector with compatible units marked and 'Custom unit...'), 613-700 (unit name and 'manualConversion'), 286-330 (saves the converted variant).
  - Mobile (Partial): screens/FoodEntryViewScreen.tsx:1062-1090 ('Select Serving' only among saved variants); no custom unit or conversion when editing, although nutrition can be overridden ('Tap to edit nutrition', 1258).
  - _Verification: added during verification_
- **Button to set the meal's default time** — In the log/edit form, a 'Default' button that sets the entry time to the meal type's default time, in addition to 'Now' and 'Clear'.
  - Web (Yes): components/FoodUnitSelector.tsx:778-791 ('Default' button / 'Set to meal default (HH:MM)'); EditFoodEntryDialog.tsx:588-594 ('setMealDefault', 'Default').
  - Mobile (Partial): FoodEntryAddScreen.tsx:298-304 (the time is prefilled on open with default_time via prefillEntryTime), but it only offers 'Now' and 'Clear' (1757-1790); FoodEntryViewScreen.tsx:1453-1492 only time and 'Clear'. The default time can only be changed in MealTypeSettingsScreen.
  - _Verification: added during verification_
- **Daily nutrition summary vs. goals** — Diary block showing each consumed nutrient against its daily goal with a progress bar.
  - Web (Yes): SparkyFitnessFrontend/src/pages/Diary/NutritionSummaryCard.tsx:98-271 (all nutrients in the configured 'summary' group, with goal and bar)
  - Mobile (Partial): SparkyFitnessMobile/src/components/DiaryCalorieMacroSummary.tsx:198-341 (calorie bar + Protein/Carbs/Fat/Fiber + up to 4 custom nutrients; collapsible and hideable in DiarySettingsScreen). The full breakdown is in DailyNutritionDetailsScreen, reachable from the Dashboard (DashboardScreen.tsx:619-623)
  - _Verification: added during verification_
- **'Default' button for the entry time** — Reset an entry's time to the meal type's default time, in addition to 'Now' and 'Clear'.
  - Web (Yes): SparkyFitnessFrontend/src/components/FoodUnitSelector.tsx:214,781-789 ('Default' / setMealDefault); pages/Diary/EditFoodEntryDialog.tsx:586-595
  - Mobile (Partial): SparkyFitnessMobile/src/screens/FoodEntryAddScreen.tsx:295-304 (preloads the time from default_time with prefillEntryTime), 1745-1786 (only 'Now' and 'Clear'); there is no button to revert to the default time once changed
  - _Verification: added during verification_

#### In both clients, but with iOS/Android differences (1)

- **Copy a meal to another date/meal type** · _Differs iOS/Android_ — Copy the entries of a meal type to a target date and meal type.
  - Web (Yes): MealCard.tsx:338-344; pages/Diary/CopyFoodEntryDialog.tsx:96-189 (Target Date, Meal Type); Diary.tsx:201-224
  - Mobile (Yes): MealTypeDetailScreen.tsx:108-115,274-293; components/CopyMealSheet.tsx:159-303 (Target date, Target meal, duplicate warning)
  - iOS/Android: Only from the meal detail. On Android the Back button does not close CopyMealSheet.

<details><summary>Web ↔ mobile parity (27)</summary>

- Daily diary view
- Global entry point to log food
- Search foods and saved meals with ownership filter
- Search in a selectable online provider
- Aggregated search across all providers
- Favorites, recents and frequents in search
- Mark a food or meal as favorite
- Create a custom food from search (incl. 'quick add' without saving)
- Logging form: quantity, serving, meal, time and note
- Scan barcode
- Photo estimate review and save mode
- Edit food entry
- Edit logged meal
- Custom photos for an entry
- View entry images enlarged
- Delete entry
- Copy meal from a family member
- Daily energy summary (ring)
- Daily nutrition summary
- Supplements included in daily totals
- Water intake card
- Quick-add drinks
- Exercise card in the diary
- Scheduled plan workout in the diary
- Manage meal types
- Copy a meal from a family member's diary
- Add food from the global '+' menu

</details>

<details><summary>Discarded after verification: exists in neither client (1)</summary>

- Bulk actions / multi-delete in the diary — BulkActionToolbar/BulkDeleteDialog are only used in Foods.tsx, MealManagement.tsx, MealPlanCalendar.tsx, Exercises.tsx, WorkoutPresetsManager.tsx, WorkoutPlansManager.tsx; never in pages/Diary

</details>

### 2.4 Food library, meals & meal plans

#### Web only (18)

- **'Needs review' filter (foods and meals)** — Filter option to see items flagged as pending review.
  - Web (Yes): Foods.tsx:604-606 SelectItem 'needs-review'; MealManagement.tsx:684-686; MealFilter type in src/types/meal.ts:217; counter in GlobalNotificationIcon (src/hooks/Foods/useReview.ts).
- **Data source filter (provider / Manual)** — Filters foods by source provider (OpenFoodFacts, USDA, FatSecret, etc.) or manual entries.
  - Web (Yes): Foods.tsx:612-643 Select with FOOD_PROVIDER_TYPES + 'Manual'; providerFilter in useFoodDatabaseManager.ts:58, 76-83, 99-102.
- **Column sorting of the list** — Sort foods by name or by nutrient values (asc/desc).
  - Web (Yes): Foods.tsx:703-725 DataTable with manualSorting -> sortOrder; nutrient columns sortable except fiber and custom ones (Foods.tsx:397-398). MealManagement.tsx:484 sortable meal nutrient columns.
- **Edit food allergens** — Mark common or custom allergens on each food variant.
  - Web (Yes): VariantCard.tsx:602-665 COMMON_ALLERGENS chips + 'Custom allergen…' with Add button.
  - Note: Traces are only displayed on both platforms, not edited.
- **Refresh from source and view data source** — Show the source provider and reload the food's data from that provider.
  - Web (Yes): CustomFoodForm.tsx:308-341 read-only 'Data source' field and 'Refresh from source' button (useRefreshFoodFromSourceMutation, 123-140).
- **Provider nutrient field viewer (alias / new nutrient)** — View the provider's exact nutrient names and add them as aliases or create a custom nutrient in one click.
  - Web (Yes): src/components/FoodSearch/ProviderNutrientViewer.tsx (mounted in CustomFoodForm.tsx:368-371): 'Nutrient fields reported by…', 'Add as alias' (269), 'New custom nutrient' (300) with CustomNutrientDialog (313).
- **Duplicate food** — Create an editable private copy of any food (own, family, public or system).
  - Web (Yes): 'Duplicate food' menu (Foods.tsx:432-438) -> 'Duplicate Food' dialog (804-835); useFoodDatabaseManager.ts:123-187 (copy without barcode or provider link).
- **Multi-select and bulk delete** — Select several foods, meals or plans and delete them at once.
  - Web (Yes): Foods.tsx:646-672 'Select' mode + BulkActionToolbar/BulkDeleteDialog (738-774, 'delete' mode); meals MealManagement.tsx:604-625, 739; plans MealPlanCalendar.tsx:398-481.
- **Duplicate meal** — Create an editable copy of a meal.
  - Web (Yes): MealManagement.tsx:513-516 'Duplicate Meal' and dialog 780-811 ('(copy)' suffix in MealBuilder.tsx:293).
- **Contribute a product to Open Food Facts** — Publish an own food's data to Open Food Facts with a photo, exact preview and rights confirmation.
  - Web (Yes): 'Contribute to Open Food Facts' menu (Foods.tsx:439-451) and 'Save and preview contribution' button in the form (CustomFoodForm.tsx:499-512); src/pages/Foods/OpenFoodFactsContributionDialog.tsx:84-552 (own photo, photo type, language, field preview, ODbL/CC BY-SA checkboxes, 'Publish this contribution').
- **User's Open Food Facts contribution settings** — See which OFF account will be used and set the product data language.
  - Web (Yes): src/pages/Settings/OpenFoodFactsContributionSettingsCard.tsx:60-210 (personal/server account, 'Product data language', 'Save language'); mounted in ExternalProviderSettings.tsx:121.
- **Enable OFF contributions on the server (admin)** — Admin toggle to allow contributions, plus global fallback credentials.
  - Web (Yes): src/pages/Admin/OpenFoodFactsAdminContributionSettings.tsx:31-58 ('Allow Open Food Facts contributions on this server'), in GlobalProviderSettings.tsx:119 (/admin route).
- **Import food database from CSV** — Bulk load of foods with variants and nutrition from a CSV file or text.
  - Web (Yes): Settings > Data Import 'Food Database (CSV)' (DataImportSettings.tsx:150-158) -> src/pages/Foods/FoodImportFromCSV.tsx: 'Upload CSV' (≤25 MB, 678), paste and 'Parse Text' (705-717), 'Download Template' (687), 'Add Row'/'Delete Row' (669, 976), header mapping CsvHeaderMappingDialog (40, 127-137), 'Override existing food details' (1002-1008), 'Import Data' (1036).
- **Canadian Nutrient File bulk import/sync (admin)** — Import or re-sync the full Health Canada catalog (~5,700 foods) into the library.
  - Web (Yes): 'Bulk Import / Sync' button in ProviderCard.tsx:535-545 (isAdminMode only, Admin > GlobalProviderSettings.tsx:125-137) -> src/pages/Settings/CnfBulkImportDialog.tsx: scope library or library+past entries (193-246), EN/FR language (257-276), official source or local ZIP (286-343), sample of 10 (363-369), 'Clear CNF Library' (404, 441-447), progress (120-146).
- **Livsmedelsverket bulk import (admin)** — Download the Swedish food composition database (~2,600 foods) into the library for local search.
  - Web (Yes): ProviderCard.tsx:572-580 and 1062-1067 (isAdminMode) -> src/pages/Settings/LivsmedelsverketBulkImportDialog.tsx: language (157), sync mode library / with past entries (180-207), test mode of 10 (224), 'Purge Library Foods' (263, 300-306), progress (107).
- **Nutritionix provider (legacy)** — Search and import branded/natural foods from Nutritionix.
  - Web (Yes): FoodSearch.tsx:627-640 nutritionix handler and handleNutritionixEdit (1050-1080); credentials in ProviderSpecificFields.tsx:629-640.
- **Configure external food providers** — Add, edit credentials, enable/disable and delete food data providers.
  - Web (Yes): ExternalProviderSettings.tsx (SettingsPage.tsx:427) with AddExternalProviderForm.tsx, EditProviderForm.tsx and ProviderCard.tsx.
- **Connect food databases during onboarding** — Initial step to connect food sources (e.g. USDA API key).
  - Web (Yes): src/components/Onboarding/FoodSourcesStep.tsx:104-196 ('Connect food databases', 'USDA API Key', 'Get a free API key').

#### Mobile only (5)

- **Library hub with counters and 'Recently Logged'** — Overview screen with the number of foods/meals, quick-create shortcuts and a mixed list of recently logged foods, meals and exercises.
  - Mobile (Yes): LibraryScreen.tsx:109-117 (food count), 379 (meal count), 276-344 (Create section), 576-680 (Recently Logged with MealLibraryRow/FoodLibraryRow), 260-266 pull-to-refresh.
- **Switch variant/serving in the detail view** — Select another saved unit/serving to see its nutritional values.
  - Mobile (Yes): FoodDetailScreen.tsx:483-515 BottomSheetPicker 'Select Serving' with local or external variants (buildLocalVariantOptions/buildExternalVariantOptions, 192-213).
- **Scan nutrition label to fill in the food** · _Differs iOS/Android_ — Photograph the nutrition facts table and automatically fill in the food form.
  - Mobile (Yes): EditFoodMode.tsx:668-681 'Scan nutrition label' button -> FoodScan capture-label; creation from FoodScan lands in CreateFoodMode with LabelScanSourceBanner (CreateFoodMode.tsx:570-575); FoodScanScreen.tsx:582-611 (on-device first, then server /api/foods/scan-label in externalFoodSearchApi.ts:732).
  - iOS/Android: iOS 27+ with Apple Intelligence can read the label on-device (modules/on-device-nutrition, expo-module.config.json platforms ['ios']; src/services/onDeviceLabelScan.ts:17) with a toggle in Settings > AI and a banner to retry with the other AI; Android always uses the server AI.
- **Log a meal to the diary from the library** — Add a saved meal to the diary from its detail page.
  - Mobile (Yes): MealDetailScreen.tsx:509-517 'Log Meal' button -> FoodEntryAdd.
- **Plan meal from its detail page** — Create a meal plan pre-filled with the current meal.
  - Mobile (Yes): MealDetailScreen.tsx:519-528 'Plan Meal' button -> MealPlanForm {initialMeal}.

#### In both, with differences (18)

- **Configurable nutrient columns in the list** — The list shows the nutrients chosen in preferences (quick_info view) as columns.
  - Web (Yes): useFoodDatabaseManager.ts:42-52 (quick_info preference per platform) and Foods.tsx:359-400 (one column per visible nutrient, including custom ones).
  - Mobile (Partial): FoodLibraryRow.tsx:113-117 only shows calories of the default_variant; the quick_info view is not offered on mobile (src/screens/NutrientDisplaySettingsScreen.tsx:34-41).
  - Note: Mobile: only calories in the row; the full breakdown is in the detail view.
- **Verified provider badge** — Marks foods whose data comes from a verified provider.
  - Web (Partial): ProviderVerifiedBadge only in search results (src/components/FoodSearch/FoodResultCard.tsx:188-189) and in the edit form header (CustomFoodForm.tsx:236); it does not appear in the library table or the detail dialog (Foods.tsx).
  - Mobile (Yes): FoodLibraryRow.tsx:82-84 VerifiedBadge in the list; FoodNutritionSummary.tsx:68 in the detail view (FoodDetailScreen.tsx:457-464); also in search rows.
- **'AI estimate' badge on foods** — Flags foods/variants whose values were estimated by AI.
  - Web (Partial): Only inside the form, per variant: confidence badge and sparkle in the unit dropdown (src/components/FoodSearch/VariantCard.tsx:346-376, 556-588); not in the table.
  - Mobile (Yes): FoodLibraryRow.tsx:79-81 AiEstimateBadge when default_variant.source === 'ai_estimate'; AI variant confidence in FoodForm.tsx (~1166).
- **Standard nutrient fields in the form** — Editing calories, macros, micronutrients and other food values.
  - Web (Yes): NutrientGrid based on the food_database preference (CustomFoodForm.tsx:163-170); includes polyunsaturated/monounsaturated fats (src/constants/nutrients.ts:97-107) and glycemic index (src/components/FoodSearch/NutrientGrid.tsx:103, 139-140).
  - Mobile (Partial): Fixed list in FoodForm.tsx:1203-1373: calories, fat, carbs, protein, fiber and 'Show more' (saturated, trans, cholesterol, sodium, sugars, calcium, iron, vit. A, vit. C, potassium, caffeine, water, alcohol). No poly/monounsaturated or glycemic index (only carried over: EditFoodMode.tsx:310-311).
  - Note: Mobile does not honor the food_database preference for the form fields.
- **Multiple unit variants (add, duplicate, delete, default)** — Manage several units/servings with their own nutrition and choose which one is the default.
  - **Partly covered by PR #2919 (merged):** Mobile can now add named portions (such as a packet or bottle, given in g or ml) when creating or editing a food whose serving is a weight or volume; each is saved as its own variant with nutrition scaled from that serving, and can be removed again. Web has the same named portions editor beside its Unit Variants section. Mobile still has no default selector, no duplicating, no way to delete a unit with its own nutrition and no way to add one when creating a food.
  - Web (Yes): CustomFoodForm.tsx:373-462 'Unit Variants' section with 'Add Unit'; VariantCard.tsx:394-406 'Default' checkbox, 433-444 'Duplicate Unit', 446-457 'Remove Unit'.
  - Mobile (Partial): One variant is edited at a time, chosen with the unit selector (EditFoodMode.tsx:686-694); choosing a new unit saves 'Saved as new variant' (EditFoodMode.tsx:444-471). No default selector, no duplicating and no deleting of non-equivalent variants; creation saves a single default variant (CreateFoodMode.tsx:359).
- **Quick food (don't save to my list)** — Create a one-off food that does not stay in the saved foods list.
  - Web (Yes): CustomFoodForm.tsx:352-366 checkbox 'Quick Add (don't save to my food list for future use)', available in any context, including the library.
  - Mobile (Partial): 'Save to Database' toggle only in logging mode (CreateFoodMode.tsx:174, 358 is_quick_food = !saveToDatabase, 688-700); in library mode it is always saved.
- **Log a food to the diary from the library** — Add a saved food to the diary directly from its detail page.
  - Web (Partial): The table menu has no 'log' action (Foods.tsx:417-511); only after adding a new food with 'Add New Food' does FoodUnitSelector open with time and meal type to log it today (Foods.tsx:838-848; useFoodDatabaseManager.ts:202-247).
  - Mobile (Yes): FoodDetailScreen.tsx:564-579 'Log Food' button -> FoodEntryAdd for any food (own or not).
- **Impact details before deleting** — Show in how many diary entries, meals and plans the food is used before deleting it.
  - Web (Yes): DeleteFoodDialog.tsx:72-185: list of diary entries (date, meal type, 'View' link), counters for meal components, plan entries and templates, warning about use by other users.
  - Mobile (Partial): The impact (getFoodDeletionImpact, FoodDetailScreen.tsx:276-280) only decides which options appear (useDeleteFood.ts:126-149); it does not show counts or the list of entries.
- **View meal details** — View the ingredients, nutrition and notes of a saved meal.
  - Web (Partial): 'View Details' dialog (MealManagement.tsx:505-508, 813-862): description, 'quantity unit - name' list and notes; no nutrition totals or navigation to sub-meals.
  - Mobile (Yes): src/screens/MealDetailScreen.tsx: 'Per serving'/'Total' toggle (357-362), servings and ingredients (374-379), 'Foods in Meal' with macros (396-460), open linked meal (480), notes (499).
- **Meal within a meal (linked sub-meal)** — Use a saved meal as an ingredient of another, with preview and quantity.
  - Web (Yes): MealBuilder.tsx:1757 'Add Food or Meal to Meal', 1807 description, 1437-1446 'Linked meal' badge, 1832-1837 sub-meal quantity selection, LinkedMealPreviewDialog 1842.
  - Mobile (Partial): Only shows/deletes existing sub-meals (MealAddScreen.tsx:831; MealDetailScreen.tsx:443, 480). They cannot be added (meals hidden in meal-builder mode: FoodSearchScreen.tsx:155, 288, 796-804) or edited (MealAddScreen.tsx:288-303: 'Edit this sub-meal ingredient in the web app').
- **Plan start and end dates** — Define when a meal plan starts and (optionally) ends.
  - Web (Yes): MealPlanTemplateForm.tsx:495-515 'Start date' and 'End date' fields; end date validation (415-418).
  - Mobile (Partial): No date pickers in MealPlanFormScreen.tsx; a new plan starts today with no end date (MealPlanFormScreen.tsx:272; src/utils/mealPlanForm.ts:73-74, 140-141); when editing, existing dates are kept and only shown in the list (MealPlansScreen.tsx:216-225).
- **Activate / deactivate plan** — Activate a plan so it automatically fills the diary, or deactivate it.
  - Web (Yes): 'Set active' checkbox in the form (MealPlanTemplateForm.tsx:525-535) and quick 'Activate'/'Deactivate' action in the table menu (MealPlanCalendar.tsx:346-361).
  - Mobile (Partial): Only via the 'Active plan' toggle inside the form (MealPlanFormScreen.tsx:577-592); the list only shows the status (MealPlansScreen.tsx:195-210).
- **Allergen warnings in lists and when logging** — Highlight tracked allergens on cards/rows and warn before logging a food.
  - Web (Partial): Badges in the library table (Foods.tsx:332-335), search cards (FoodResultCard.tsx) and diary cards (pages/Diary/MealCard.tsx); no warning banner when logging (FoodUnitSelector does not use allergens).
  - Mobile (Yes): AllergenBadges in FoodLibraryRow.tsx:108, search rows and SwipeableFoodRow; AllergenWarning banner in FoodEntryAddScreen.tsx:1582 (also after scanning barcodes).
- **Auto-scale imports (OFF per 100 g and online)** — Automatically scale imported values to the product's serving size.
  - Web (Yes): src/pages/Settings/PreferenceSettings.tsx:610-646 'Auto-scale OpenFoodFacts Imports' and 'autoScaleOnlineImports'.
  - Mobile (Partial): Only 'Adjust Open Food Facts Values' (FoodSettingsScreen.tsx:273-290); auto_scale_online_imports is read but not editable (CreateFoodMode.tsx:102, AdjustNutritionMode.tsx:88).
- **Visible nutrient preferences in library and form** — Choose which nutrients are shown in the list (quick_info) and in the form/detail (food_database).
  - Web (Yes): NutrientDisplaySettings (SettingsPage.tsx:280) with quick_info and food_database views per desktop/mobile platform; consumed in useFoodDatabaseManager.ts:42-52 and CustomFoodForm.tsx:163-170.
  - Mobile (Partial): src/screens/NutrientDisplaySettingsScreen.tsx:34-41 only food_database (applied to the detail nutrient lists, FoodNutritionSummary.tsx:118) and report_tabular; quick_info is not offered and the form does not use it.
- **Calorie distribution by meal type (percentages)** — Split the calorie goal across breakfast, lunch, dinner and snacks with locks and automatic distribution.
  - Web (Yes): src/components/MealPercentageManager.tsx (Goals: DailyGoals.tsx:399, EditGoalsForToday.tsx:420, GoalPresetDialog.tsx:418; Onboarding NutrientGoals.tsx:684): distribution templates (157-180), 'distribute remaining', lock, sliders, 100% total.
  - Mobile (Partial): src/components/MealDistributionEditor.tsx in GoalsScreen.tsx:953: 'Distribute remaining evenly' (58), Lock/Unlock (83-87), percentages with PercentSlider, 'Total … (must be 100% to save)' (139-143); no predefined templates.
- **Nutrient columns in the meals list** — The library meals list shows the totals of the nutrients chosen in preferences as columns, and allows sorting by them; on mobile each row only shows calories.
  - Web (Yes): SparkyFitnessFrontend/src/pages/Foods/MealManagement.tsx:166 (visibleNutrients) and 431 (one column per visible nutrient in the meals table).
  - Mobile (Partial): SparkyFitnessMobile/src/components/MealLibraryRow.tsx:116-127 only shows calories and serving; MealsLibraryScreen.tsx has no columns or sorting by nutrients.
  - _Verification: added during verification_
- **Nutrient columns in the meals list** — The saved meals table shows, as sortable columns, the totals of the nutrients chosen in the quick_info view, calculated from their ingredients.
  - Web (Yes): MealManagement.tsx:158-166 reads the quick_info preference per platform; 431-484 one column per visible nutrient with the meal total (accessorFn sums scaled ingredients), with enableSorting: true.
  - Mobile (Partial): MealLibraryRow.tsx:116-120 only shows calories (and serving); MealsLibraryScreen.tsx has no columns or configurable sorting; quick_info is not offered in NutrientDisplaySettingsScreen.tsx:41.
  - Note: Complements the foods-list-nutrient-columns row, which only covers the foods list.
  - _Verification: added during verification_

<details><summary>Web ↔ mobile parity (43)</summary>

- Access to the foods, meals and plans library
- Food search in the library
- Ownership filter (All / Mine / Family / Public)
- Food list pagination
- Row badges: brand, private/family/public, allergens, favorite
- Image thumbnail and enlarged viewer (lightbox)
- View food details
- Create a manual (custom) food
- Add a food from an online provider to the library
- Barcode lookup to add a food
- Edit own food
- Basic form fields (name, brand, serving, unit)
- Custom nutrient values on the food
- Equivalent sizes of a variant
- Nutrition auto-scaling and compatible unit conversion
- Convert unit with AI
- Food barcode (field, scanning and conflict)
- Manage food images
- Food notes in markdown (with images)
- Sync past entries on edit (nutrition / photos)
- Mark food as favorite
- Share food publicly / make private
- Delete food with modes (hide / delete / delete with history)
- Saved meals list (search and filter)
- Create meal (meal builder)
- Edit meal
- Meal data: name, description, images and notes
- Meal units and servings
- Add, edit and remove foods in the meal
- Meal nutrition totals (per serving / total)
- Share meal publicly
- Favorite meal
- Delete or hide meal
- Meal plans list
- Create and edit weekly meal plan
- Duplicate meal plan
- Delete meal plan
- Custom nutrients management
- Allergen preferences
- Sync allergens from OpenFoodFacts
- Search external providers (single provider or 'All Providers')
- Default search and barcode provider, OFF fallback
- Show net carbs

</details>

### 2.5 Exercises, workouts & running

#### Web only (16)

- **Category filter, column sorting and configurable pagination** — Filter exercises by category, sort by name and choose the page size.
  - Web (Yes): src/pages/Exercises/Exercises.tsx:483-512 (EXERCISE_CATEGORIES category Select), 609-622 (onSortingChange), 624-640 (manual pagination with pageSize)
- **'Needs Review' filter** — Show only exercises flagged for review.
  - Web (Yes): src/pages/Exercises/Exercises.tsx:548-553 (SelectItem value='needs-review')
- **Multi-select and bulk delete of exercises, presets and plans** — 'Select' mode with checkboxes, select all and bulk delete (exercises in 'delete' mode, without deleting history).
  - Web (Yes): src/pages/Exercises/Exercises.tsx:565-600 (toggleEditMode), 647-680 (BulkActionToolbar + BulkDeleteDialog); WorkoutPresetsManager.tsx:575-596; WorkoutPlansManager.tsx:430-455, 524
- **Equipment filter in search** — Chips to filter search results by equipment (dumbbells, barbell, machine...).
  - Web (Yes): src/pages/Exercises/ExerciseSearch.tsx:271-290 (handleEquipmentToggle chips)
- **Body map filter (muscles)** — Interactive silhouette to filter exercises by muscle group.
  - Web (Yes): src/pages/Exercises/ExerciseSearch.tsx:292-297 (<BodyMapFilter>); src/pages/Exercises/BodyMapFilter.tsx
- **Upload, remove and reorder exercise images** — Attach photos/GIFs to the custom exercise, delete them and reorder them by dragging.
  - Web (Yes): src/pages/Exercises/AddCustomExerciseForm.tsx:377-410 (input type=file); src/pages/Exercises/EditExerciseDialog.tsx:355-460 (existing/new images with drag & drop and delete button)
- **Propagate exercise changes to past diary entries** — After editing an exercise, ask whether to update the snapshot of all past entries.
  - Web (Yes): src/hooks/Exercises/useEditExerciseForm.ts:178-193 (updateExerciseEntriesSnapshot); src/pages/Exercises/Exercises.tsx:712-722 (ConfirmationDialog 'update all your past diary entries')
- **Drag to reorder sets and duplicate a set** — In the preset/plan/log editor, drag sets to change their order and duplicate a specific set.
  - Web (Yes): src/pages/Exercises/SortableWorkoutSet.tsx:69 (useSortable), 287 (onDuplicateSet)
- **Entry photo and custom fields (key/value)** — Attach a photo to an exercise entry and add free-form activity details.
  - Web (Yes): src/pages/Diary/LogExerciseEntryDialog.tsx:578-600 ('Photo'); src/components/ExerciseActivityDetailsEditor.tsx:72-86 ('Field Name'/'Value'); EditExerciseEntryDialog.tsx:2090
- **Advanced activity telemetry editor** — Edit max HR, respiration, speed, cadence, power, TSS, running dynamics, elevation, strokes, steps, water loss and load; copy raw JSON.
  - Web (Yes): src/pages/Diary/EditExerciseEntryDialog.tsx:1091-1700 (sections Heart Rate & Respiration, Speed/Cadence/Power, Running Dynamics, Elevation/Swimming, Steps…), 2057-2062 ('Copy Raw JSON')
- **Advanced cardio analytics (web)** — Cardio volume per interval, matched courses, activity finder by distance and a list of synced activities with maps and session breakdown.
  - Web (Yes): src/pages/Reports/ExerciseReportsDashboard.tsx:895, 938-948 (CardioVolumeIntervalChart, MatchedCoursesList, ActivityInterrogationFinder, ActivityTelemetryList); WorkoutSessionBreakdown.tsx
- **Exercise entries table in Reports and CSV export** — Table of the exercises logged in the range, with CSV download.
  - Web (Yes): src/pages/Reports/ReportsTables.tsx:656 (onExportExerciseEntries); Reports.tsx:375-380 (exportExerciseEntries)
- **Import exercise database (CSV)** — Add reusable exercises from a CSV with column mapping.
  - Web (Yes): src/pages/Settings/DataImportSettings.tsx:186-196 (ExerciseImportCSV); SettingsPage.tsx:212
- **Import exercise entry history (CSV)** — Import past workouts from CSV with a configurable date format and a downloadable template.
  - Web (Yes): src/pages/Settings/DataImportSettings.tsx:200-212; src/pages/Exercises/ExerciseEntryHistoryImportCSV.tsx:216-268 (CsvFormatBar, 'Download Template')
- **Import .FIT files** — Import workouts and activity data from binary .fit files (Garmin, etc.) with a results table.
  - Web (Yes): src/pages/Settings/DataImportSettings.tsx:216-226; src/pages/Exercises/ExerciseImportFit.tsx:52-137
- **RPE (rate of perceived exertion) on cardio activities** — Enter an RPE of 1-10 when logging or editing a cardio activity (running, cycling, etc.).
  - **Partly covered by PR #3065 (merged):** The phone app still has no RPE field when logging or editing a cardio activity. On iOS, a run or walk recorded on the Apple Watch can be rated from 1 to 10 on the watch, and ratings given in Apple Health are read with synced workouts; the app shows this as Effort n/10 but cannot change it. Android has no way to add one: Health Connect sync reads no rating and the Wear OS app does not ask after a run.
  - Web (Yes): SparkyFitnessFrontend/src/pages/Exercises/CardioLog.tsx:111-127 ('RPE' field 1-10, also visible in simplified mode), used in LogExerciseEntryDialog.tsx:332-345 (saved in sets[0].rpe) and EditExerciseEntryDialog.tsx:932
  - _Verification: added during verification_

#### Mobile only (28)

- **Warm-up calculator and 'Add warm-ups'** — Configure the warm-up ramp (% and reps per set, plate and dumbbell rounding) and automatically insert the warm-up sets into an exercise.
  - Mobile (Yes): src/screens/WarmupSettingsScreen.tsx:126-330 (Warmup Method, Add/Remove set, Plate rounding, Dumbbell rounding); WorkoutSettingsScreen.tsx:224-234; ActiveWorkoutOverflowSheet.tsx:121 and WorkoutFormExerciseList.tsx:696-709 ('Add warm-ups')
- **Configurable default rest** — Choose the rest between sets that is applied to new exercises.
  - Mobile (Yes): src/screens/WorkoutSettingsScreen.tsx:104-131 ('Default rest period' with RestPeriodSheet)
- **Workout sound settings** · _Differs iOS/Android_ — Enable a sound when the rest ends, play in silent mode and lower other apps' music during beeps/voice cues.
  - Mobile (Yes): src/screens/WorkoutSettingsScreen.tsx:134-202 ('Rest timer sound', 'Play through silent mode', 'Lower music during cues'); src/services/sounds.ts:30-90
  - iOS/Android: On iOS 'Play through silent mode' also plays with the app in the background or the screen locked (keep-alive track; sounds.ts:37-45 isBackgroundRestChimeEnabled iOS only); on Android it only plays in the foreground, and in the background the notification is used. Different copy in WorkoutSettingsScreen.tsx:160-168.
- **Rest-complete notification with 'Complete Set' action** — Local alert when the rest ends, with a button to complete the next set, and its toggle in Notifications.
  - Mobile (Yes): src/services/notifications.ts:34-36 (rest-complete category and Complete Set action), 385-432; src/screens/NotificationSettingsScreen.tsx:253-270 ('Rest Timer')
- **Keep the screen on during the workout** — Prevent the screen from turning off while a workout is active.
  - Mobile (Yes): App.tsx:1320 (<ActiveWorkoutKeepAwake />); src/screens/WorkoutSettingsScreen.tsx:204-222 ('Keep screen awake')
- **Minimized active workout bar** — Keep using the app with the workout in progress: a floating bar with the next set, pause, skip rest, complete set and finish.
  - Mobile (Yes): src/components/ActiveWorkoutBar.tsx:548-899 (Next Up, Pause, Skip rest, 'Done, start next set', Finish, Clear); App.tsx:1319; TabsLayout.tsx:366
  - _Verification: corrected during verification_
- **Strength workout status outside the app** · _Differs iOS/Android_ — Show the active workout (current set, rest, progress) on the lock screen / in a notification.
  - Mobile (Yes): src/services/workoutLiveActivity.ios.ts:60-68 (rest ±15, skip, complete-set buttons) + WorkoutLiveActivityLayout.tsx; src/services/workoutLiveActivity.android.ts:21-40 + targets/android-workout-notification/.../WorkoutNotificationModule.kt:92-106; plugins/withWorkoutNotification.ts
  - iOS/Android: iOS: interactive Live Activity (lock screen / Dynamic Island) with −15 s, +15 s, skip rest and complete set. Android: persistent notification with a progress bar and countdown timer, no action buttons (it only opens the app).
- **Save a workout as a preset and update the source preset** — Turn a completed workout into a preset and, when finishing, offer to save the changes made during the session to the preset.
  - Mobile (Yes): src/screens/WorkoutCompleteScreen.tsx:290 ('Save as Preset'); WorkoutDetailScreen.tsx:828 ('Save as preset'); src/hooks/useWorkoutCompletePresetSync.ts (PresetUpdateOffer)
- **Resume or restart a logged workout live** — From a workout's detail screen, pick it back up in live mode ('Start workout here' on a set, or 'Start Workout').
  - Mobile (Yes): src/screens/WorkoutDetailScreen.tsx:419-426 ('Start workout here'), 972 ('Start Workout')
- **Pace zones and training load** — Personal pace zones calculated from the last 90 days and 4-week acute vs chronic load (also as a Dashboard card).
  - **Partly covered by PRs #3154 and #3155 (merged):** Web now shows training paces from the latest fitness test (which only the phone can run) and a Readiness and Form card with fitness, fatigue and form worked out from the same session load, a card mobile also has. Web still has no pace zones estimated from recent runs and no 4-week acute vs chronic load, which mobile also shows on its Dashboard. On mobile the pace zones now come from the latest fitness test when there is one.
  - Mobile (Yes): src/components/exerciseStats/PaceZonesCard.tsx:35-50 (usePaceZones.ts); TrainingLoadCard.tsx:41-162 (useTrainingLoad.ts -> reportsApi.ts:66); TrainingLoadDashboardCard (DashboardScreen.tsx:48, 391)
- **Export route to GPX** — Share a session's route as a GPX file.
  - Mobile (Yes): src/screens/CardioSessionScreen.tsx:214, 311 ('Export GPX'); src/services/gpxExport.ts:1-4 (expo-sharing)
- **New records notice on finish** — Highlight records broken when finishing a strength workout or a run.
  - Mobile (Yes): src/components/WorkoutCompletePrCard.tsx (WorkoutCompleteScreen.tsx:13); RunSummaryScreen.tsx:341 ('New personal records')
- **Activity recording with the phone's GPS** · _Differs iOS/Android_ — Record an outdoor or indoor walk, run or ride with a live map, time, distance, pace, elevation, HR, laps and splits; pause, resume, mark a lap, finish, save or discard.
  - **Updated in PR #3052 (merged):** Live heart rate during a phone recording now also works on Android with a connected Wear OS watch: the watch sends it to the recording screen and it is saved with the activity, as the Apple Watch does on iOS. Without a watch neither platform shows heart rate. The background indicator still differs: iOS shows the location indicator and Android a foreground service notification.
  - Mobile (Yes): src/screens/RecordActivityScreen.tsx:1034-1065 (Walk/Run/Ride, Outdoor/Indoor), 1528-1830 (map, Time, Distance, Avg pace, Elevation, Heart rate, Laps, Splits, Lap, Pause/Resume, Finish, Discard, Save activity); AddSheet.tsx:403-414; services/gpsRecordingService.ts:1115-1135
  - iOS/Android: Available on both; in the background iOS uses the location indicator and Android a foreground service with a notification (gpsRecordingService.ts:1130-1135). See the rows on Live Activity, watch GPS, battery tips and indoor distance.
  - _Verification: corrected during verification_
- **Recording options: auto-pause, countdown, intervals, pace alerts and voice cues** — Before starting: auto-pause, countdown, intervals (run/walk or fast/easy, by time or distance, rounds, warm-up and cool-down), pace alert, suggested ranges, voice cues with periodic updates and voice selection.
  - Mobile (Yes): src/screens/RecordActivityScreen.tsx:1135-1400; components/recording/IntervalSetup.tsx:34-414; PaceBandCard.tsx:92-113; SuggestedRangesCard.tsx:72-160; CheckInCard.tsx:21-34 ('Spoken updates'); RecordingVoiceCard.tsx:24-54
- **Heart rate alert during recording** · _iOS only_ — Alert if HR leaves a range (too low / too high) while recording.
  - **Updated in PR #3052 (merged):** Android now offers the heart rate alert too once a Wear OS watch has connected: during a phone recording the Wear OS app sends its heart rate to the phone, which buzzes (and speaks, with voice cues on) when it stays outside the range, and a run recorded on the Wear OS watch alerts on the watch, as the Apple Watch does. It still needs a watch on both platforms and is not offered for rides; web still has none.
  - Mobile (Yes): src/screens/RecordActivityScreen.tsx:1199-1215 (only if watchAvailable: 'Heart rate comes from the Apple Watch'); HeartRateBandCard.tsx:83-105
  - iOS/Android: Requires a paired Apple Watch (modules/watch-connectivity only declares the ios platform in expo-module.config.json); not shown on Android.
- **Record with Apple Watch GPS and follow it on the phone** · _iOS only_ — Choose 'Watch GPS' as the source and view the watch session live on mobile ('On your watch') with pause, finish, auto-pause and alerts.
  - **Updated in PRs #3052, #3065, #3069 and #3127 (merged):** Android now offers the same choice of recording device once a Wear OS watch has connected: a walk or run, outdoors or on a treadmill, is recorded on the Wear OS app with its own sensors and followed live on the phone, with pause, finish, auto-pause and pace and heart rate alerts. Unlike the Apple Watch, the Wear OS app cannot follow a saved route (the phone still offers the choice, but the watch ignores it), has no indoor jump rope, asks for no effort rating at the end and sends no step count for cadence and stride.
  - Mobile (Yes): src/screens/RecordActivityScreen.tsx:261-269, 1073-1127 ('Record with' Phone GPS / Watch GPS); src/screens/WatchRunLiveScreen.tsx:64-201; App.tsx:611
  - iOS/Android: Depends on WatchConnectivity (iOS only); no Wear OS support.
- **Recording status on the lock screen** · _iOS only_ — View the recording's time, distance and pace outside the app and control it.
  - Mobile (Yes): src/services/runLiveActivity.ios.ts (+ RunLiveActivityLayout.tsx:50-117, run-toggle and run-lap buttons 56-57); src/services/runLiveActivity.ts:1-13 (Android: empty functions)
  - iOS/Android: iOS: Live Activity with Pause/Resume and Lap buttons. Android: no Live Activity; only the foreground service notification with title and text (gpsRecordingService.ts:1111-1135), no controls.
  - _Verification: corrected during verification_
- **Tip for recording with the screen off** · _Android only_ — Prompt to set the app's battery usage to 'Unrestricted' and a link to manufacturer-specific steps (dontkillmyapp).
  - Mobile (Yes): src/screens/RecordActivityScreen.tsx:1443-1466 (Platform.OS === 'android' && !indoor)
  - iOS/Android: Only shown on Android for outdoor activities.
- **Indoor distance from steps and treadmill correction** · _Differs iOS/Android_ — Estimate the distance of indoor walks/runs with the pedometer, calibrate stride length and correct it afterwards with the treadmill's figure.
  - Mobile (Yes): src/screens/RunSummaryScreen.tsx:296-327 ('Treadmill distance', Update); src/services/stepCounter.ts:35-90; strideCalibration.ts; hooks/useIndoorDistanceEstimate.ts
  - iOS/Android: Android saves the hardware step counter at the start and subtracts it at the end (a reboot invalidates it) (stepCounter.ts:43-77); iOS queries the pedometer history for the window when finishing (stepCounter.ts:80-88).
- **Summary after saving the recorded activity** — Stats, new records, program progress (repeat or skip session), map, pace, laps/splits and effort rating.
  - Mobile (Yes): src/screens/RunSummaryScreen.tsx:187-548 (EffortScale, RouteMap, PaceChart, 'Repeat this workout', 'Skip the next workout', 'View program')
- **Running training programs** — Program catalog, start with a first-session date, switch programs, progress, guide and reference pace.
  - **Partly covered by PRs #2948, #3052, #3109, #3144 and #3154 (merged):** The web now has a Training programs page, opened from Exercises, with the built-in programs and their 3- or 4-runs-a-week versions, a first-workout date when starting, switching with a confirmation, starting plans made on mobile, the program card (progress, on/off switch, Mark workout as done, Skip, Start over, choosing another workout, run days, first workout and goal date) and a month calendar; it is not available while acting for a family member. Still mobile-only: the program guide, the reference pace card, creating, customizing or editing plans, Plan a race, recording the workout, and the cards for realigning the plan, running goals and fitness tests. The reference pace card's watch switch now also shows on Android, as 'Also use on my Wear OS watch', a text not yet translated into any language.
  - Mobile (Yes): src/screens/RunProgramsScreen.tsx:80-303, 418-446 (Start program, Switch, Customize, PaceReferenceCard); LibraryScreen.tsx:423 ('Training programs')
- **Program calendar** — Monthly view with all of the program's sessions.
  - **Partly covered by PR #2948 (merged):** Web now has the program schedule as a month calendar on the training programs page: days marked done, next or planned, each day's workouts with their minutes and state, the finish date against the goal date, a 'Coming up' list and the same offer to catch up by skipping workouts. Unlike mobile, a workout cannot be opened from web's calendar to see its steps, how hard it felt or the run, or to start it; web picks which workout comes next, a finished one included, from a list on the program card.
  - Mobile (Yes): src/screens/RunProgramCalendarScreen.tsx; RunProgramsScreen.tsx:290-293 ('Open the program calendar'); components/recording/ProgramMonthGrid.tsx
- **Plan a race** — Generate a plan for a half marathon or marathon based on level, race date and available days.
  - Mobile (Yes): src/screens/RunProgramRaceScreen.tsx:87-411
- **Custom running plans** — Create/edit plans with sessions and steps (warm-up, easy, work, cool-down), pace and HR targets, move, duplicate and delete.
  - **Partly covered by PR #2948 (merged):** The web Training programs page lists the plans made in the mobile app under 'Your plans' and can start one and follow it like any program. Creating and editing plans (workouts, steps, pace and heart rate targets, move, duplicate and delete) is still mobile-only.
  - Mobile (Yes): src/screens/RunProgramEditScreen.tsx:67-627
- **Program session: detail, diary banner and effort** — View the day's session, 'Next / Scheduled today' banner in the diary, start it while recording and rate the effort of the last session.
  - **Partly covered by PRs #2948, #3052 and #3065 (merged):** Web's Diary now shows the program's workout in the Exercise card ('Scheduled Today', or 'Up next' when no run days are set, both with Mark as done; 'Scheduled' on later days) with a link to the program, but web still has no workout detail, cannot start the workout as a recording and has no effort rating. On mobile a program workout can now also be run on a Wear OS watch; a run on the Apple Watch takes its effort from the rating given on the watch, while Wear OS runs and phone recordings are still rated in the app.
  - Mobile (Yes): src/screens/RunProgramWorkoutScreen.tsx; components/recording/RunProgramBanner.tsx:175-178 (DiaryScreen.tsx:56); RunEffortPrompt.tsx:48-75
- **Strength workout on Apple Watch** · _iOS only_ — The watch mirrors the phone's workout: log sets (double tap or crown), rest, RPE, edit exercises/sets, start a saved preset from the watch and send live HR to the phone.
  - **Updated in PRs #3052 and #3065 (merged):** Wear OS now runs strength workouts too: it follows a workout started on the phone or starts a preset or today's scheduled one, logs each set with the rotary crown, +/− or a keypad, runs a rest timer with +15 s and Skip, asks for an optional RPE, adds, deletes or changes the type of sets, adds, deletes or skips exercises, finishes or discards the workout and asks whether to update the preset, shows New PR banners and sends live heart rate to the phone. Still Apple Watch only: double tap to log a set, the full 1 to 10 RPE scale (Wear OS offers 5 to 10), volume, maximum heart rate and the effort rating in the summary, and saving the workout to a health app.
  - Mobile (Yes): targets/watch/Presentation/WorkoutView.swift:234-1982; src/hooks/useWatchWorkoutBridge.ts, useWatchWorkoutStart.ts:27-35, useWatchWorkoutEdit.ts:29-31, useWatchPlanSync.ts:32-35, useWatchSetTargetsSync.ts:115; live HR in ActiveWorkoutExerciseCard.tsx:1484-1500 (stores/liveHeartRateStore.ts)
  - iOS/Android: Apple Watch only (watchOS target and watch-connectivity module are iOS only).
- **Standalone run/walk on Apple Watch** · _iOS only_ — Start cardio on the watch, follow a program session, pace/HR alerts, voice and auto-pause; the activity is saved to the diary when syncing.
  - **Partly covered by PRs #3052, #3065, #3069, #3090 and #3127 (merged):** Wear OS now records runs and walks on its own too: outdoors with the watch GPS or indoors, free or following the program workout or an interval plan, with pace and heart rate alerts, auto-pause, spoken cues, laps and a treadmill distance correction; the phone can also start one there, follows it live and files it in the diary. Still Apple Watch only: following a saved route, Jump Rope, setting the alert ranges on the watch (Wear OS uses the ranges last set on the phone, or a default), ending distance steps when the distance is covered (Wear OS uses their expected time), the effort rating after the run, the step count behind cadence and stride, and saving the workout to a health app. On Android the phone still offers the watch route options, but a run started on the watch with a route is recorded without following it, and Send to watch fails.
  - Mobile (Yes): targets/watch/Presentation/WorkoutView.swift:2118-2333 ('Follow a plan', 'Alerts'); WatchRunView.swift:29-201; src/hooks/useWatchRunBridge.ts:29-33; services/watchRunQueue.ts
  - iOS/Android: Apple Watch only.
- **Apple Watch workout settings** · _iOS only_ — Double tap to log a set, ask for RPE after each set, keyboard or Digital Crown input, and page order.
  - **Updated in PR #3052 (merged):** Android now shows a Wear OS row in Settings once a Wear OS watch has connected to the phone; it opens the same screen, titled Wear OS, with the settings the Wear OS app applies: asking for effort (RPE) after each set, worded for its 5 to 10 scale, page order and visibility, and the Goals page nutrients. Double-tap to log a set and the Keypad or Digital Crown choice stay iOS-only, as Wear OS has no double tap and always offers both a keypad and the rotary crown. The Wear OS wording of the RPE hint is English in every language.
  - Mobile (Yes): src/screens/WatchSettingsScreen.tsx:124-243; visible only with a paired watch (SettingsScreen.tsx:53-55, 368-376)
  - iOS/Android: Only shown on iOS with a paired Apple Watch.

#### In both, with differences (11)

- **Exercise detail page** — Dedicated view with a summary (best record, last record, kcal/h, equipment, muscles, level/force/mechanic/source), a History tab and a 'How to' tab with an image carousel and full-screen viewer; Start Workout / Log actions.
  - Web (Partial): There is no detail page: the information is seen by expanding the search item (src/pages/Exercises/ExerciseSearchListItem.tsx:200-265) or in the edit dialog; image viewer in the player (WorkoutPlaybackExercisesList.tsx:110)
  - Mobile (Yes): src/screens/ExerciseDetailScreen.tsx:345-362 (Summary/History/How to tabs), 494-515 (ImageLightbox), 722-990 (instructions, description, Best/Last 787-807, details), 995-1006 (Start Workout / Log Exercise)
  - Note: Web does not show per-exercise 'best/last record' outside of Reports.
- **Instructions player with read-aloud** — Modal that walks through the instructions step by step with images and TTS narration, with voice selection and mute; 'read instructions aloud' button in search results.
  - Web (Yes): src/pages/Diary/ExercisePlaybackModal.tsx:51-499 (speechNarrator, voice selector 446); opened from ExerciseEntryDisplay.tsx:388-403 ('Play Instructions'); ExerciseSearchListItem.tsx:74, 251-265 ('Read instructions aloud')
  - Mobile (Partial): There is no standalone player: the 'How to' tab (ExerciseDetailScreen.tsx:722) shows text without voice; instructions are only read aloud inside guided mode ('Replay instructions', ActiveWorkoutGuidedCard.tsx:141; useGuidedWorkout.ts:401)
- **Weekly or sequential plan editor** — Name, description, start/end dates, active, diary behavior (prompt/prefill), days or sessions and assignments.
  - Web (Yes): src/pages/Exercises/AddWorkoutPlanDialog.tsx:206-425 (Schedule Mode, Diary Behavior prompt/prefill 306, dates 360-373, active 397); 480-500 (assignments with SortableExerciseItem: individual exercises with sets, copy assignment, drag & drop)
  - Mobile (Partial): src/screens/WorkoutPlanFormScreen.tsx:412-681 (same fields and 'Fill in my diary' 516-528), but only full presets can be added: presetOptions 97-104 and renderAddWorkout 333-350; individual exercises cannot be added, sets cannot be edited, and assignments cannot be copied/dragged
- **Per-set RPE/RIR, metric column and previous values in live mode** — Enter RPE or RIR for each set during the workout, switch the column to Volume / Est. 1RM / Est. 10RM, see the 'Prev' column and fill from the previous session.
  - Web (Partial): The live player has no RPE or metric column (WorkoutPlaybackSetRow.tsx has no rpe); RPE can only be entered in the set editor when logging/editing (SortableWorkoutSet.tsx:197-210, SetHeader.tsx:64)
  - Mobile (Yes): src/components/ActiveWorkoutSetRow.tsx:950 ('Fill set from previous'), 1252-1253 (RIR/RPE); ActiveWorkoutExerciseCard.tsx:362-374, 1589-1637 ('Prev', 'Change metric column'); WorkoutMenus.tsx:70-78
- **Edit the live workout structure** — During the session: add an exercise, reorder, supersets, remove an exercise, clear logged sets, rename the workout.
  - **Updated in PR #3102 (merged):** Mobile's Replace now keeps the sets when the new exercise is of the same type (planned values stay; notes, RPE/RIR, completion and PR marks are cleared) and resets to one default set otherwise. Web's workout player still only has Replace, which always resets the exercise to one default set, and still cannot add, reorder or rename. Same on iOS and Android.
  - Web (Partial): Replace exercise only: src/pages/Diary/WorkoutPlaybackPage.tsx:1167-1182; WorkoutPlaybackExercisesList.tsx:146-150. No add/reorder/rename
  - Mobile (Yes): src/components/ActiveWorkoutHeader.tsx:144-219 (Add exercise, Reorder exercises, Rename workout, Gym/Location, Workout settings, End, Clear all logged sets, Discard); ActiveWorkoutOverflowSheet.tsx:91-142; ActiveWorkoutRail.tsx:265-282
- **End-of-workout summary** — Final screen/dialog with session statistics.
  - Web (Partial): src/pages/Diary/WorkoutPlaybackFinishDialog.tsx:52-108 (Duration, Calories, Sets, Volume, feedback and Done)
  - Mobile (Yes): src/screens/WorkoutCompleteScreen.tsx:8-20 (Hero, confetti, StatTiles, WOD card, PR card, exercise list, feedback), 290-303 (Save as Preset, View Workout, Done)
  - Note: Web does not show new records, the WOD card, the exercise list or follow-up actions.
- **Per-exercise charts and advanced filters** — Volume trend, max weight, estimated 1RM, best set by rep range, reps vs weight, time under tension, PRs and their progression, per-set analysis; filters by exercise, muscle and equipment, comparison with the previous period and grouping by day/week/month/year.
  - **Partly covered by PR #3008 (merged):** Mobile's exercise page now also has an Effort card on the History tab: the last session's average RPE, bars for up to ten recent sessions, and, for weight-and-reps lifts, a best estimated 1RM counting the reps left next to the one from reps alone. Only sets logged with an RPE count. Mobile still has none of web's per-exercise trend charts (volume, max weight, 1RM trend, rep ranges, reps vs weight, time under tension, PR progression, per-set analysis), nor its filters or grouping.
  - Web (Yes): src/pages/Reports/ExerciseReportsDashboard.tsx:363-681 (cases volumeTrend, maxWeightTrend, estimated1RMTrend, bestSetRepRange, repsVsWeightScatter, timeUnderTension, prVisualization, setPerformance, prProgression), 818-850 (Group by); src/components/ExerciseCharts/ExerciseDashboardFilters.tsx:89-178
  - Mobile (Partial): Only 'Best' and 'Last' on the exercise page (ExerciseDetailScreen.tsx:787-807) and a History tab; ExerciseStatisticsScreen.tsx only has a range control (ReportRangeControl) with no per-exercise charts
- **Cardio session detail** · _Differs iOS/Android_ — Route map, pace and HR charts, HR zones and statistics for a session.
  - **Partly covered by PRs #3014, #3022, #3065, #3078 and #3135 (merged):** Mobile's session detail now also shows average cadence, stride length and the effort rating when the entry has them, a Splits card per km or mile worked out from the GPS track (pace bars, height change and average heart rate), and buttons to save the route to Routes and to share the session as an image; both apps now say how the heart rate zones were worked out. Mobile still has no cadence or elevation charts and no table of the device's own laps, which web has. On Android the real map still needs a build with a Google Maps key.
  - Web (Yes): src/pages/Reports/ActivityReportVisualizer.tsx:1-38 (pace, HR, zones, cadence, elevation, map, laps table) from CardioSessionList; WorkoutGpsMap/WorkoutLapsTable in EditExerciseEntryDialog.tsx:65-66
  - Mobile (Partial): src/screens/CardioSessionScreen.tsx:291-406 (Route, Pace, Heart Rate, Heart Rate Zones, statistics); no cadence/elevation charts or laps table for synced sessions
  - iOS/Android: The real map is always drawn on iOS (Apple Maps); on Android only if the build has a Google Maps key, otherwise a plain line is shown (src/utils/routeMapSupport.ts:14-21).
- **Exercise entry start time** — Optionally set the start time when logging or editing an exercise entry or when finishing a live workout, with 'Now' and 'Clear' buttons.
  - **Partly covered by PR #3052 (merged):** Mobile still has no start time field when logging or editing an exercise; the time is only filled in automatically. Besides phone GPS recordings, it now also comes from walks and runs recorded on a Wear OS watch on Android, not only on the Apple Watch.
  - Web (Yes): SparkyFitnessFrontend/src/pages/Diary/LogExerciseEntryDialog.tsx:284, 401-420 ('Start Time (optional)', Clear/Now); EditExerciseEntryDialog.tsx:308, 740, 1006; WorkoutPlaybackSummary.tsx:203-245 ('Start Time' in the live workout); WorkoutPlaybackPage.tsx:720, 1120
  - Mobile (Partial): No editable time field: ActivityAddScreen.tsx (fields 425-516), ActivityDetailScreen.tsx and WorkoutDetailScreen.tsx do not show it; entry_time is only filled in automatically when saving GPS recordings (services/gpsRecordingSave.ts:140) and watch runs (services/watchRunSave.ts:69). The CreateExerciseEntryPayload type supports it (services/api/exerciseApi.ts:379-380) but no screen asks for it.
  - Note: The rest of the mobile app (meals) does have a 'Time' field, which confirms the omission is specific to exercise.
  - _Verification: added during verification_
- **Available set types** — Tag each set with its type in the preset/log editor and during the live workout.
  - Web (Yes): SparkyFitnessFrontend/src/constants/excerciseWorkoutSetTypes.ts:1-12 (10 types: Normal, Working Set, Warm-up, Drop Set, Failure, AMRAP, Back-off, Rest-Pause, Cluster, Technique), used in SortableWorkoutSet.tsx:125 and WorkoutPlaybackSetRow.tsx:217
  - Mobile (Partial): SparkyFitnessMobile/src/utils/workoutSession.ts:1806-1811 SET_TYPE_OPTIONS = warmup, normal, drop, failure; SetTypeMenu in components/WorkoutMenus.tsx:106-165 only offers those 4 (plus 'Add N drop sets' and 'Delete set')
  - Note: Both clients have the 'Add N drop sets (-X%)' generator (web WorkoutPlaybackExercisesList.tsx:297-310; mobile WorkoutMenus.tsx:136-146 from ActiveWorkoutScreen.tsx:1036).
  - _Verification: added during verification_
- **Training-day calendar/heatmap** — Calendar that colors the days with a workout within the report range.
  - Web (Yes): SparkyFitnessFrontend/src/pages/Reports/ExerciseReportsDashboard.tsx:5, 868-876 (WorkoutHeatmap with rangeStart/rangeEnd from the filter); WorkoutHeatmap.tsx:15-34 (MonthCalendar, 12-month view)
  - Mobile (Partial): SparkyFitnessMobile/src/components/exerciseStats/TrainingConsistencyCard.tsx:8-47 (weekly grid with month labels), fixed at 26 weeks and not following the range control; there is no monthly heatmap that follows the report range
  - Note: Web also has TrainingConsistencyCard, but without a grid; its calendar is WorkoutHeatmap.
  - _Verification: added during verification_

#### In both clients, but with iOS/Android differences (1)

- **Route drawn on a map** · _Differs iOS/Android_ — Show the GPS route on a real map.
  - Web (Yes): src/pages/Reports/ActivityReportMap.tsx; src/components/Exercises/WorkoutGpsMap.tsx
  - Mobile (Yes): src/components/exerciseStats/RouteMap.tsx:12-15 (RouteTileMap with react-native-maps or RouteLine)
  - iOS/Android: iOS always uses Apple Maps; Android only if the build has GOOGLE_MAPS_ANDROID_API_KEY, otherwise only the line is drawn without a map (src/utils/routeMapSupport.ts:8-21).

<details><summary>Web ↔ mobile parity (40)</summary>

- Exercise library: listing and text search
- Ownership filter (All / Mine / Family / Public)
- Recent and Most Used sections in search
- Search external providers and import
- Create custom exercise
- Edit own exercise
- Duplicate exercise
- Share exercise publicly / make it private
- Delete exercise with impact analysis (Hide / Delete / Delete with history)
- Suggested alternatives when replacing an exercise
- Equipment section
  - **Updated in PR #3186 (merged):** Equipment now holds more than shoes on both: a 'Plates & bars' section lists the bars and plates you own, which the plate calculator uses, the same on iOS and Android. On web that section is hidden while you manage another person's data.
- Create, edit and delete shoes
- Shoe wear tracking
- Assign shoe to an activity
- Workout presets: listing and actions
- Preset editor (WOD formats included)
- Per-exercise progression / overload
- Supersets
- Replace and duplicate an exercise within a preset/plan
- Workout plans: listing and management
- Plan session in the diary (Scheduled Today / Up Next)
- Diary exercise section
- Log a past workout (sets and reps)
- Log manual cardio activity
- Edit or delete a logged entry
  - **Updated in PR #3114 (merged):** Both can now set how many calories an entry counts in the daily total (blank counts the estimate, 0 counts nothing), but web has the field in the edit dialog of every entry, synced entries and exercises inside a workout included, while mobile only has it when editing a single activity logged in the app, not in a workout's detail or on synced entries. Both can also link a workout logged in the app to a synced one so it is not counted twice. Same on iOS and Android.
- Logged workout detail
- Start a live workout
- Live set logging
- Rest timer
- Guided workout mode
- Guided workout settings
- Interval and WOD HUD
- Adaptive suggestions
- Live session data
- Session feedback
- Strength statistics: overview and muscles
- Cardio statistics and running trends
  - **Updated in PRs #3069 and #3154 (merged):** Both still show the cardio session list, weekly distance, longest run, efficiency and race time estimates. Mobile's Cardio view adds a Running form card the web lacks: the latest run's cadence and stride length, the average for the range, the change against earlier runs and a bar per run. The web's Cardio & GPS view adds a read-only Fitness tests card (the latest result, the training paces it set and up to four earlier tests); mobile shows the tests on its Training programs and Fitness tests screens, and its Cardio pace zones follow the latest test.
- Training consistency and workout calendar
- Cardio personal records
- Exercise history
  - **Updated in PR #3008 (merged):** Mobile's History tab now lists each session's sets with their RPE, adds an Effort card (average RPE of the last session, bars for up to the last ten sessions, and an estimated 1RM with effort next to the one from reps alone), and opens the workout a session came from. Web's 'Last N Entries' still shows only reps and weight, duration and distance per set, with no RPE, effort summary or link to the session. Same on iOS and Android.

</details>

### 2.6 Check-in, body measurements & wellbeing

#### Web only (11)

- **Unified Check-In screen with tabs** — A single Check-In page with Measurements, Fasting and mood, Mindfulness, Sleep, Photos and Symptoms tabs, and a shared date picker.
  - Web (Yes): SparkyFitnessFrontend/src/App.tsx:390-393 ('checkin' route); src/pages/CheckIn/CheckIn.tsx:115-195 (measurements/fasting/mindfulness/sleep/photos/symptoms tabs)
  - Note: A navigation architecture difference, not a capability difference.
- **Custom categories with Hourly / All frequency** — Save values for hourly categories (tied to the current hour) or free-frequency ones.
  - Web (Yes): src/hooks/CheckIn/useCheckInLogic.ts:659-682 (isHourly → entry_hour/hourlyTimestamp)
- **Custom category manager (create, edit, delete)** — Settings > Wellness > Custom Categories: create, edit and delete categories with name, unit, data type (Numeric/Text) and frequency (All/Daily/Hourly).
  - **Updated in PR #3194 (merged):** Mobile now has it on iOS and Android under Settings > Custom Measurements: a list with edit and delete, and a form with name, display name, measurement type with the same quick-pick units as web, Numeric/Text and All/Daily/Hourly. Unlike web, mobile asks before deleting and lets you change an existing category's name and data type; it also lists a habit (boolean) category as Numeric and saves it as numeric if you edit it. The mobile screens' own texts are English only in every shipped language, while the web manager is translated.
  - Web (Yes): src/pages/Settings/SettingsPage.tsx:376-391; src/pages/Settings/CustomCategoryManager.tsx:199-382 (create), 418-425 (edit/delete), 325-377 (data type and frequency)
- **Check-in on behalf of another user (family access)** — A delegate with 'checkin' permission can open another person's Check-In and log measurements, sleep, etc.
  - Web (Yes): src/layouts/MainLayout.tsx:156-160 (hasWritePermission('checkin')); src/pages/CheckIn/CheckIn.tsx:34-37 and SleepEntrySection.tsx:42-51 (activeUserId)
- **Create custom moods (name, emoji and color)** — In 'Manage moods', add your own emotion by choosing a name, emoji and color.
  - Web (Yes): src/pages/CheckIn/MoodMeter.tsx:171-182 (createCustom), 296-350 ('Add a custom mood')
- **Show or hide moods in the picker** — Hide built-in or custom emotions in the picker (preference saved on the server).
  - Web (Yes): src/pages/CheckIn/MoodMeter.tsx:165-170 (toggleHidden → updatePrefs), 357-365, 455-470; src/api/CheckIn/moodService.ts:58-65
- **Delete a custom mood (with option to purge history)** — Delete a user-created emotion and, optionally, also remove it from all past entries.
  - Web (Yes): src/pages/CheckIn/MoodMeter.tsx:475-520 (AlertDialog + checkbox 'Also remove it from all past entries')
- **Manual sleep logging (multiple sessions per day)** — Enter bedtime and wake time, add more sleep sessions and save.
  - Web (Yes): src/pages/CheckIn/SleepEntrySection.tsx:268-365 (Bedtime/Wake Time, 'Add Another Sleep Session', 'Save Sleep')
- **Sleep stage timeline editor** — Paint stages (awake, REM, light, deep) by dragging over the timeline, with a Clear button and a color legend.
  - Web (Yes): src/pages/CheckIn/SleepTimelineEditor.tsx:95-236 (dragging), 444-484 (stage buttons and Clear), 509-512 (mouse events only)
  - Note: The web editor only responds to mouse events, with no touch support.
- **Edit and delete existing sleep entries** — Modify the bedtime, wake time and stages of an existing entry, or delete it.
  - Web (Yes): src/pages/CheckIn/SleepEntrySection.tsx:370-470 (Edit/Save/Cancel/Delete per entry), 488-525
- **CSV import of health and check-in data** — Import measurements, sleep, vitals, activity, hydration and mood from CSV, with a downloadable template, editable table (add rows, delete) and import.
  - Web (Yes): src/pages/Settings/DataImportSettings.tsx:170-182; src/pages/CheckIn/HealthDataImportCSV.tsx:196-458; src/constants/healthDataImport.ts:76-330 (categories measurements/sleep/vitals/activity/hydration/mood)

#### Mobile only (20)

- **Day's measurement summary in the Diary** — Card in the Diary with the selected day's measurements; tapping it opens the editor.
  - Mobile (Yes): src/screens/DiaryScreen.tsx:745-754 (MeasurementsSummary → navigate('MeasurementsAdd')); src/components/MeasurementsSummary.tsx:86-228
- **Photo history by angle with weight and change** — List of photo sessions by angle (newest to oldest) with that day's weight, the change from the previous one and a link to log weight.
  - **Partly covered by PR #2965 (merged):** The web still has no History list, but the Compare and Time-lapse dialogs on the Check-In Photos tab now reach an angle's older photos. Time-lapse steps through the photo days in a chosen period, each with its weight or a 'Log weight' link, and Compare puts two chosen photo days side by side with the weight change between them. Only mobile lists an angle's seven latest shoots, newest first, with the change since the previous one.
  - Mobile (Yes): src/screens/ProgressPhotosScreen.tsx:355-378 (PhotoDayWeight + 'since previous'), 485-510 (History section with angle SegmentedControl), 213-216 (log weight → MeasurementsAdd)
- **Compare progress photos (before/after)** — Side-by-side comparison of two days, with weight difference, days elapsed and a picker for which photo to change.
  - **Updated in PRs #2965 and #3190 (merged):** The web now has it: Check-In > Photos has a Compare dialog with a Front/Back/Side toggle and Before and After panes (first and latest shoot of that angle by default). Each pane has a date picker limited to days with that angle and that day's weight or a Log weight link, with the weight change and days apart below. Remaining differences: a web pane opens a plain full-size view instead of the zoomable viewer, mobile picks the angle on the gallery before opening the comparison, and the mobile top padding now depends on whether the screen draws its own header (Android, and iOS 26 with Liquid Glass navigation off), not on the platform.
  - Mobile (Yes): App.tsx:991-995 (ProgressPhotoCompare); src/screens/ProgressPhotoCompareScreen.tsx:259-297 (before/after, deltaBadge, daysApart, pickWhich)
- **Progress photo time-lapse** — Plays an angle's photos as a time-lapse with range (all or custom), speed (slow, normal, fast), play/pause and previous/next frame.
  - **Updated in PR #2965 (merged):** The web now has it: a Time-lapse button opens a player with a Front/Back/Side toggle and the same windows as mobile (Last 30 days, Last 3 months by default, All time and a custom range; a preset with fewer than two photos widens to all time). It has the same Slow/Normal/Fast timings with a cross-fade, play/pause, previous/next frame and the arrow keys, and shows each frame's date, weight (or Log weight) and a frame counter. Both apps use the same window rules from @workspace/shared.
  - Mobile (Yes): App.tsx:996-1000; src/screens/ProgressPhotoTimelapseScreen.tsx:186-211 (range), 288-300 (speed), 390-418 (controls), 451-454 (range sheet)
- **Full-screen photo viewer with zoom** — Opens a progress photo full screen with pinch to zoom and drag to pan, showing the date and weight.
  - **Partly covered by PR #2965 (merged):** On web, a Before or After photo in the Compare dialog now opens full size in a lightbox, fitted to 85% of the screen height. It still has no pinch to zoom or drag to pan and does not show the date and weight, which stay under the pane. A photo in a Check-In slot still opens the file picker.
  - Mobile (Yes): src/components/ProgressPhotoViewer.tsx:35-40 (pinch to zoom, drag to pan); used in ProgressPhotosScreen.tsx:570, ProgressPhotoCompareScreen.tsx:316, CheckInPhotosSummary.tsx:166
- **Photo summary in Diary and 'Progress' card on Dashboard** — Thumbnails of the day's photos in the Diary and a Dashboard card with the latest photos and weight, with access to 'View all' or 'Tap to add photos'.
  - Mobile (Yes): src/screens/DiaryScreen.tsx:758-764 (CheckInPhotosSummary); src/screens/DashboardScreen.tsx:834-841; src/components/ProgressPhotosCard.tsx:86-154
- **Mood card on the Dashboard with 7-day trend** — Card showing today's mood or '+ Log' and a mini 7-day trend.
  - Mobile (Yes): src/screens/DashboardScreen.tsx:826-833; src/components/mood/MoodCard.tsx:75-118
- **Mindfulness card on the Dashboard with quick actions** — Card with today's minutes, the latest session, HR/HRV and Breathe, Timer and Log buttons.
  - Mobile (Yes): src/screens/DashboardScreen.tsx:905-917; src/components/mindfulness/MindfulnessCard.tsx:120-282
  - _Verification: verifiers disagreed (most conservative reading kept)_
- **Wake Up, Naps and Bedtime cards in the Diary** — Separates main sleep from naps and shows each part as a card that opens the detail view.
  - Mobile (Yes): src/screens/DiaryScreen.tsx:648,740-744; src/components/SleepCards.tsx:162-290 (WakeUpCard, NapsCard, BedTimeCard); src/hooks/useSleepDay.ts:30-64 (classifySleepDay)
- **Fasting goal and pre-end alert notifications** — Local notification when the goal is reached and X minutes beforehand (per pre_end_alert_minutes), with its own toggle in Notifications.
  - Mobile (Yes): src/services/notifications.ts:482-575 (scheduleFastGoalNotification / scheduleFastPreEndNotification); src/components/FastingGoalReconciler.tsx; src/screens/NotificationSettingsScreen.tsx:277-290 ('Fasting Goals')
  - Note: The eating_window_alert flag is not consumed by any client; it is only stored.
- **'Fasting' quick action on the app icon** · _iOS only_ — Long-press on the app icon → 'Fasting', which opens the fasting detail.
  - **Updated in PR #2989 (merged):** Android now also shows Fasting when you long-press the app icon (expo-quick-actions, with its own adaptive icon), and it opens the fasting detail as on iOS. Its title comes from the same quickActions string on both platforms.
  - Mobile (Yes): src/hooks/useQuickActions.ts:44-46,119-121, 142 (Platform.OS !== 'ios' → return)
  - iOS/Android: Only registered on iOS; on Android there are no app shortcuts.
- **Control Center controls and Siri shortcuts to start and end a fast** · _iOS only_ — 'Start fast' and 'End fast' controls (Control Center and Lock Screen) and Siri/Shortcuts AppIntents 'Start fast' (1-72 h) and 'End fast' that work without opening the app.
  - Mobile (Yes): targets/widget/Controls.swift:44-68 (StartFastControl, EndFastControl); targets/widget/ShortcutIntents.swift:370-410 (StartFastIntent, EndFastIntent)
  - iOS/Android: iOS widget extension; no equivalent on Android (targets/android-widget only has the calories widget).
- **Siri shortcut 'Log weight'** · _iOS only_ — AppIntent to log weight (20-700) from Siri or the Shortcuts app without opening SparkyFitness.
  - Mobile (Yes): targets/widget/ShortcutIntents.swift:338-366 (LogWeightIntent, openAppWhenRun=false)
  - iOS/Android: iOS only (App Intents).
- **Weight and body fat % check-in on Apple Watch** · _iOS only_ — Watch screen to enter weight and body fat % with the Digital Crown (or keyboard), with an outlier warning and a weight and body fat trends view after saving.
  - **Updated in PR #3052 (merged):** The Wear OS app now has it: a Weight Check-In page (rotary crown, +/− or keypad) with an optional body fat % step, the change since the last entry with a warning for an unlikely weight, and a Set Start button for a starting weight while there is no history. Its Trend page shows the last 14 weights with a 7-day rolling mean, or body fat, switched by tap or crown. Unlike the Apple Watch, saving stays on the entry page instead of moving to the trend, an unlikely body fat change gets no warning, and there is no one-time setup on first launch.
  - Mobile (Yes): targets/watch/Presentation/CheckInEntryView.swift:1-60; TrendView.swift:5-25; App.tsx:202-211 (WatchCheckInGate → useWatchCheckInBridge → upsertCheckIn, src/hooks/useWatchCheckInBridge.ts:16,686-687)
  - iOS/Android: watchOS app; on Android there is no Wear OS app (modules/watch-connectivity only has ios/).
- **Fasting on Apple Watch and fasting complication** · _iOS only_ — Fasting page on the watch with elapsed and remaining time, start with 16:8, 18:6 or 20:4 and end with confirmation, plus a complication showing the ongoing fast.
  - **Partly covered by PR #3052 (merged):** The Wear OS app now has a Fasting page (elapsed time and a ring with the share of the goal, but no time remaining), start buttons for 16:8, 18:6, 20:4 and OMAD, End Fast without a confirmation, and a Fasting complication with the hours elapsed. Starting a fast from Wear OS fails: the watch sends the label ('16:8', 'OMAD') as the preset id, but the phone looks presets up by id ('16-8', '18-6', '20-4') and has no OMAD, so it rejects the request and no fast is saved (the watch shows it only until the phone's next update). Ending a fast from the watch works.
  - Mobile (Yes): targets/watch/Presentation/FastingView.swift:18-116; targets/watch-widget/FastingComplication.swift; src/hooks/useWatchFastingBridge.ts:22-40
  - iOS/Android: watchOS only.
- **Steps on Apple Watch and steps complication** · _iOS only_ — Read-only page with today's steps versus the goal, and a steps complication.
  - **Updated in PR #3052 (merged):** The Wear OS app now has a Daily Steps page with today's steps against the goal on a ring and the steps left, plus a Steps complication. Unlike the Apple Watch, which only shows the count the phone last sent, Wear OS also raises the count from the watch's own step sensor when that is higher.
  - Mobile (Yes): targets/watch/Presentation/StepsView.swift:3-20; targets/watch-widget/StepsComplication.swift
  - iOS/Android: watchOS only.
- **Health trends on the Dashboard (steps, weight, sleep...)** — Carousel of charts for steps, weight (with goal line), sleep, hydration, calories and VO2 max, with a 7/30/90-day range and a screen to reorder or hide them.
  - **Updated in PRs #3143 and #3155 (merged):** The mobile carousel now has a seventh chart, Resting Heart Rate, with daily resting heart rate and its average and min–max over 7, 30 or 90 days; it only appears when there are readings and can be reordered or hidden like the others. With no synced VO2 max, the VO2 max chart now plots an estimate from logged runs, titled as estimated. The web Dashboard still has no such carousel; on web, resting heart rate is in Reports.
  - Mobile (Yes): src/screens/DashboardScreen.tsx:842-897 (HealthTrendsPager + SegmentedControl + link to Reports); src/constants/healthTrends.ts:11-18; src/screens/HealthTrendsSettingsScreen.tsx:47-86
- **Automatic sync of body metrics, sleep and steps from the device health store** · _Differs iOS/Android_ — Reads weight, body fat %, height, BMR, lean mass, bone mass, sleep, steps, resting HR, HRV, SpO2, respiratory rate, stress, etc. from the device health store and uploads them to the check-in.
  - Mobile (Yes): src/HealthMetrics.ts:54-520 (metric definitions with platforms); App.tsx:959-963 (Sync); src/screens/SyncScreen.tsx; src/services/healthConnectService.ts / .ios.ts
  - iOS/Android: iOS uses HealthKit and Android uses Health Connect. Body water mass only on Android (HealthMetrics.ts:505-518); Stress only on iOS (172-185); HRV and SpO2 use different record types on each platform (387-416, 606-646); iOS has background delivery (src/services/healthkit/backgroundDelivery.ts).
- **Health history import (backfill)** · _Differs iOS/Android_ — Import previous days from the health store, with pause, resume, start over and a summary of imported days.
  - Mobile (Yes): App.tsx:964-968; src/screens/ImportHistoryScreen.tsx:391-681
  - iOS/Android: On Android, Health Connect limits daily historical reads and the import resumes automatically later (ImportHistoryScreen.tsx:471-476). On iOS there is a dedicated notice if HealthKit is not available (461-468).
- **Apple Watch settings: reorder and hide pages (Check-in, Trend, Fasting, Steps…)** · _iOS only_ — From the phone, Settings > Apple Watch lets you drag to change the order in which the watch pages are swiped (including weight Check-in, Trend, Fasting and Steps) and disable unused ones; the watch respects that order and hides the disabled ones.
  - **Updated in PR #3052 (merged):** Android now shows a Wear OS row in Settings once a Wear OS watch has connected, and it opens the same screen: page order and visibility (the Wear OS app follows them and keeps the Workout page while a workout runs), the Goals page nutrients and the RPE switch. The Double-tap to log a set switch and the Keypad/Digital Crown set input are only on iOS, and the RPE switch's Wear OS description (a 5 to 10 scale instead of 1 to 10) is English only in every shipped language.
  - Mobile (Yes): src/screens/SettingsScreen.tsx:368-377 ('Apple Watch' row only if hasPairedWatch); src/screens/WatchSettingsScreen.tsx:190-215 ('Pages', ReorderSwitchList 'Drag a page by its handle… Toggle a page off to hide it'); targets/watch/Presentation/ContentView.swift:28-62 (pages 'as the phone last arranged them') and 183-185 (shown() discards hidden pages).
  - iOS/Android: Only appears with a paired Apple Watch; on Android there is no watch app (modules/watch-connectivity only has ios/).
  - Note: Directly affects the availability of the watch features checkin-watch-checkin, checkin-watch-fasting and checkin-watch-steps.
  - _Verification: added during verification_

#### In both, with differences (10)

- **Custom measurement category values (numeric or text)** — Log values for the user's categories, with unit conversion and an optional note per category.
  - Web (Yes): src/pages/CheckIn/CheckInForm.tsx:427-534 (all categories, UnitInput if the unit is convertible, 'Notes (optional)' field at 519-531)
  - Mobile (Partial): src/screens/MeasurementsAddScreen.tsx:149-162 ('Daily' frequency only), 1271-1375 (one row per category, no notes field), 1814-1847 (collapsible 'More categories' section)
  - Note: On mobile there are no per-category notes and only daily categories appear.
- **Boolean (Yes/No) custom categories** — Yes/No/Clear control for boolean-type categories (for example, habits), showing the last value.
  - Web (Partial): src/pages/CheckIn/CheckInForm.tsx:494-517 (anything that is not 'numeric' is shown as a free-text input; there is no Yes/No control)
  - Mobile (Yes): src/screens/MeasurementsAddScreen.tsx:1265-1269,1278,1314-1320 (YesNoClearControl), 1350-1363 ('Last: Yes/No')
  - Note: Boolean categories (habits) are created on the server (SparkyFitnessServer/models/habitRepository.ts:3); the web manager only offers the Numeric/Text types.
- **'Recent measurements' list with per-entry deletion** — List of the latest standard and custom measurements with time and date, and a trash button on each one.
  - Web (Yes): src/pages/CheckIn/CheckIn.tsx:269-282; src/pages/CheckIn/RecentActivity.tsx:77-258 (Trash2 at 215-229); useCheckInLogic.ts:546-620 (deletion without confirmation)
  - Mobile (Partial): There is no recent history list. Deletion is only possible by clearing the day's fields in MeasurementsAddScreen.tsx:1094-1135 (asks for confirmation 'Clear N measurements?') or with the category's trash button (1330-1345)
- **Overall mood (0-100 scale)** — Set the day's overall mood on the 0 to 100 scale with 9 emoji faces.
  - **Updated in PRs #3013, #3016 and #3018 (merged):** Mood is now set per check-in, not once a day: web and mobile both log several check-ins a day, each with its own time and an optional mood that can be cleared. The day's mood is the average of the moods logged by hand, or the Garmin or imported mood when there is none. The picker still differs: the web slider also stops half-way between the nine faces, while mobile offers only the nine faces.
  - Web (Yes): src/pages/CheckIn/MoodMeter.tsx:231-248 (continuous 'Overall mood' slider), 250-274 (9 emojis that set the value)
  - Mobile (Partial): src/screens/MoodLogScreen.tsx:200-237 (only 9 faces that save a representative value; no continuous slider)
  - Note: On mobile only 9 fixed levels can be chosen; on web, any intermediate value.
- **Detailed list of metabolic stages** — List of all fasting stages with hour range, description and the 'now' label on the current stage.
  - Web (Partial): Only a tooltip when hovering over each segment: src/pages/Fasting/FastingZoneBar.tsx:126-152
  - Mobile (Yes): src/screens/FastingDetailScreen.tsx:215-285 (METABOLIC_STAGES with rangeLabel, description and 'now')
- **Edit a logged fast** — Modify a past fast: protocol, protocol name, start time, end time and target end time.
  - Web (Yes): src/pages/Fasting/EditFastDialog.tsx:136-244 (Protocol, Protocol Name, Start, End, Target End Time); opened from RecentActivity.tsx:232-240
  - Mobile (Partial): src/components/FastingEditSheet.tsx:309-331 (start and end only); opened by tapping the history (FastingDetailScreen.tsx:111,344)
  - Note: On mobile the protocol and target time cannot be changed.
- **Fasting card on the Dashboard** — Card with the fast or eating window status, progress, quick start (protocol sheet) and access to the detail view.
  - Web (Partial): The equivalent HomeDashboardFasting widget is in the 'Fasting & Mood' tab of /checkin (CheckInTopRow.tsx:34), not on a home page
  - Mobile (Yes): src/screens/DashboardScreen.tsx:806-808; src/components/FastingCard.tsx:92-311
- **Home Dashboard with wellness cards** — Home tab with stacked cards (fasting, mood, photos, mindfulness, health trends, etc.) for the selected date.
  - Web (Partial): The web root route is the Diary (App.tsx:388); there is no wellness dashboard
  - Mobile (Yes): src/screens/DashboardScreen.tsx:566-917; src/components/TabsLayout.tsx:276-283 (Dashboard tab)
  - _Verification: corrected during verification_
- **Customize the Dashboard (reorder and hide cards)** — Settings > Dashboard Settings: drag to reorder and disable cards (fasting, mood, progress photos, mindfulness, health trends, etc.).
  - Web (Partial): Not applicable
  - Mobile (Yes): src/screens/SettingsScreen.tsx:314; src/screens/DashboardSettingsScreen.tsx:441-490; src/constants/dashboardCards.ts:3-19
  - _Verification: corrected during verification_
- **Quick logging shortcuts from the '+' menu** — The '+' menu directly opens Measurements, Progress photos, Mood, Mindfulness and Sync Health Data.
  - Web (Partial): src/layouts/MainLayout.tsx:114-123: the add menu only leads to the full Check-In page
  - Mobile (Yes): src/components/AddSheet.tsx:266 (Measurements), 429 (Progress photos), 452 (Mood), 459 (Mindfulness), 470 (Sync Health Data)

<details><summary>Web ↔ mobile parity (29)</summary>

- Date selection with markers for days with progress photos
- Weight logging
- Height logging (cm or feet/inches)
- Body circumferences: neck, waist and hips
- Manual daily steps
- Scale body composition: muscle mass, bone mass, water % and BMR
- Body fat % calculation (US Navy / BMI) with 'Use recent'
- 'Use last' button to reuse the previous value
- Progress photos: front, back and side (upload, replace, delete)
- Multi-select mood tags
- Mood notes
- Mood trend and most frequent emotions
- Daily mindfulness minutes and session count
- Guided breathing (Box, 4-7-8, coherence)
- Meditation timer (5/10/15/20 min or open-ended)
- Manual logging of a mindfulness session
- Edit and delete mindfulness sessions
- Single night sleep detail
- Start a fast (protocol and start time)
- Active fast timer ring
- Metabolic zones bar
- Eating window (countdown and bar)
- Indicator for fasts auto-calculated from meals
- End the fast with time adjustment
- Delete a fast
- Fasting history
- Quick fasting stats
- Fasting report
- Intermittent fasting settings

</details>

### 2.7 Goals & onboarding

#### Web only (31)

- **Macros as a percentage of calories** — Toggle 'Macros by: Grams/Percentages', with validation that the total is 100% and a preview of the resulting grams (excluding fiber).
  - Web (Yes): SparkyFitnessFrontend/src/pages/Goals/DailyGoals.tsx:218-239 (RadioGroup), 276-323 (total and grams), 126-145 (conversion on save); also EditGoalsForToday.tsx and GoalPresetDialog.tsx:204-330
- **Choose which nutrients appear in the goals editor** — Configure (Settings > Nutrient Display, 'Goal' group) which nutrients appear, and in what order, when editing goals.
  - Web (Yes): SparkyFitnessFrontend/src/pages/Settings/NutrientDisplaySettings.tsx:75,108 ('goal' group); consumed in src/pages/Goals/GoalsContent.tsx:119-145
- **Auto-calculation of 'Added Sugars' (custom nutrient)** — Calculate the limit for a custom nutrient named Added Sugar(s) whose direction is Maximum, using the chosen algorithm (WHO/AHA).
  - Web (Yes): SparkyFitnessFrontend/src/pages/Goals/nutrientAutoCalculateHelpers.ts:8-39; NutrientAutoCalculate.tsx:73-90; algorithm in pages/Settings/CalculationSettings.tsx:2085-2130
- **Meal distribution templates** — Predefined templates: Even, Intermittent Fasting, Protein in the Morning, and No Snacks.
  - Web (Yes): SparkyFitnessFrontend/src/components/MealPercentageManager.tsx:25-46,155-182 (Select disabled if there are custom meals)
- **Edit goals for a specific date only (no cascade)** — From the diary, edit the goals for a specific day (past or future) without affecting other days.
  - Web (Yes): SparkyFitnessFrontend/src/pages/Diary/NutritionSummaryCard.tsx:13,128 ('Edit Goals' button) -> src/pages/Goals/EditGoalsForToday.tsx:479-561 ('Edit Goals for {{date}}' dialog, cascade: false at 510, 'Save for this Date' at 448)
- **Reset a day's goals to default values** — 'Reset to default' button that replaces the date's goals with DEFAULT_GOALS.
  - Web (Yes): SparkyFitnessFrontend/src/pages/Goals/EditGoalsForToday.tsx:219-225 (onSave(DEFAULT_GOALS, true))
- **Goal weight (set or clear)** — Set or clear the profile's goal weight (target_weight) in kg or lbs.
  - Web (Yes): SparkyFitnessFrontend/src/pages/Goals/GoalWeight.tsx:16-137 (validation up to 999.99 kg, Save/Clear; with st/lb it is entered in lbs); also onboarding step 7 (components/Onboarding/OnBoardingSteps.tsx:366-400)
- **Reset onboarding** — Reset the onboarding state to redo the initial questionnaire.
  - Web (Yes): SparkyFitnessFrontend/src/pages/Goals/ResetOnboarding.tsx:6-53 (confirmation, useResetOnboarding, and reload); GoalsContent.tsx:159
- **Goal direction for custom nutrients** — Set Min/Max/Range on the user's custom nutrients.
  - Web (Yes): SparkyFitnessFrontend/src/pages/Settings/NutrientGoalDirectionSettings.tsx:597-610 ('other' and 'custom' sections)
- **Reset goal directions** — Revert a nutrient to its default direction or reset all of them ('Reset All' with confirmation).
  - Web (Yes): SparkyFitnessFrontend/src/pages/Settings/NutrientGoalDirectionSettings.tsx:445-450 (per nutrient), 636-660 ('Reset All' AlertDialog)
- **Progress evaluation based on goal direction** — Use the direction (min/max/range) to judge and color progress in the diary and reports.
  - Web (Yes): SparkyFitnessFrontend/src/pages/Diary/NutritionSummaryCard.tsx:11 (useNutrientGoalPreferences); src/pages/Diary/DailyProgress.tsx; src/pages/Reports/NutritionPeriodSummary.tsx
  - Note: What is edited on mobile only takes effect when viewing the data on web.
- **BMR algorithm selection** — Choose the basal metabolic rate formula (Mifflin-St Jeor, Katch-McArdle, Cunningham, etc.).
  - Web (Yes): SparkyFitnessFrontend/src/pages/Settings/CalculationSettings.tsx:673-703 (Settings > Nutrition > Calculation Settings)
- **Body fat algorithm selection** — Choose the body fat estimation formula.
  - Web (Yes): SparkyFitnessFrontend/src/pages/Settings/CalculationSettings.tsx:705-738
- **Energy unit (kcal / kJ)** — Choose whether energy is shown in kilocalories or kilojoules.
  - Web (Yes): SparkyFitnessFrontend/src/pages/Settings/CalculationSettings.tsx:816-845; also a toggle in the onboarding plan (components/Onboarding/PersonalPlanHeader.tsx:46-75)
- **Live calculation preview** — Panel with BMR, expenditure, applied deficit or surplus, resulting daily target, projected weekly rate (loss or gain, % of body weight) and a detailed breakdown.
  - Web (Yes): SparkyFitnessFrontend/src/pages/Settings/CalculationSettings.tsx:1486-1680 (includes CalorieTargetBreakdown 1655)
- **Measured adaptive TDEE and calibration status** — Show the measured adaptive TDEE and, while data is still missing, a calibration notice with tips (log weight 3-4 times a week and food daily).
  - Web (Yes): SparkyFitnessFrontend/src/pages/Settings/CalculationSettings.tsx:1586-1603 ('Measured Adaptive TDEE'), 1876-1913 ('Awaiting Adaptive TDEE Calibration'); src/api/Settings/adaptiveTdeeService.ts; pages/Diary/DailyProgress.tsx:98-99,262-280
  - Note: Mobile does not show the TDEE value, the days of data or the calibration status. The server applies the adaptive goal for both clients.
  - _Verification: corrected during verification_
- **Calorie goal safety warnings** — Alerts for a goal below RMR, below the absolute clinical floor, a goal raised to the minimum (with explanation and advice), and unsafe rates of loss (>1.5%/week) or gain (>0.5%/week).
  - Web (Yes): SparkyFitnessFrontend/src/pages/Settings/CalculationSettings.tsx:1708-1875
- **Coaching advice based on Goal Mode** — Card with advice based on the selected mode (recomposition, cut, bulk, etc.).
  - Web (Yes): SparkyFitnessFrontend/src/pages/Settings/CalculationSettings.tsx:1680-1706 (coachingAdvice), strings settings.goalMode.coaching.*
- **Nutrient calculation algorithms** — Choose the algorithms for the fat, mineral, vitamin, sugar and added sugar breakdown used by auto-calculation.
  - Web (Yes): SparkyFitnessFrontend/src/pages/Settings/CalculationSettings.tsx:1915-2130; also in onboarding (components/Onboarding/CalculationSettings.tsx:60-204)
- **Onboarding wizard (initial goals questionnaire)** — Full-screen wizard of about 13 steps that appears only after signing in if onboarding is neither completed nor skipped. It has a progress bar, a back button and a theme selector.
  - Web (Yes): SparkyFitnessFrontend/src/pages/Index.tsx:33-58; src/components/Onboarding/OnBoarding.tsx:14-41 (preloads profile, weight and height); OnBoardingForm.tsx:25-28,168-213
- **Skip onboarding** — 'Skip' button that marks onboarding as skipped.
  - Web (Yes): SparkyFitnessFrontend/src/components/Onboarding/OnBoardingForm.tsx:196-209 (useSkipOnboarding)
- **Reopen onboarding from the header ('Complete setup')** — If onboarding was skipped, the header offers a button to resume it.
  - Web (Yes): SparkyFitnessFrontend/src/layouts/MainLayout.tsx:512-525; src/pages/Index.tsx:62-70
- **Onboarding: body data** — Steps for sex, current weight (kg, lbs or st/lb), height (cm, in or ft/in), date of birth (with a date format selector) and body fat estimate (the midpoint of the range is saved).
  - Web (Yes): SparkyFitnessFrontend/src/components/Onboarding/OnBoardingSteps.tsx:70-93 (sex), 117-175 (weight), 177-229 (height), 231-327 (date of birth), 329-364 (body fat); PersonalPlan.tsx:40-54,304-327 (saves profile and measurements)
- **Onboarding: primary goal and habits** — Steps for goal (lose, maintain or gain weight), target weight, meals per day, activity level and whether burned calories are added back (dynamic or fixed mode).
  - Web (Yes): SparkyFitnessFrontend/src/components/Onboarding/OnBoardingSteps.tsx:94-116,366-400,402-421,423-465,467-509; PersonalPlan.tsx:271-299 (activityLevel and calorieGoalAdjustmentMode)
- **Onboarding: connect food databases** — Optional step to add the USDA key and FatSecret credentials. It only appears if the user does not already have a provider other than Open Food Facts.
  - Web (Yes): SparkyFitnessFrontend/src/components/Onboarding/FoodSourcesStep.tsx:100-200; OnBoardingForm.tsx:30-38,96-124
- **Onboarding: personal plan and calorie budget** — Plan summary with an editable calorie budget, kcal/kJ toggle, base BMR, 'Calorie Buyback' ON/OFF indicator and a medical disclaimer.
  - Web (Yes): SparkyFitnessFrontend/src/components/Onboarding/PersonalPlan.tsx:410-450; PersonalPlanHeader.tsx:46-124
- **Onboarding: diet approach** — Choose a diet template (carbohydrate, protein and fat split with a description) or a custom split with per-macro locking.
  - Web (Yes): SparkyFitnessFrontend/src/components/Onboarding/DietApproach.tsx:52-320 (DIET_TEMPLATES Select 74-118, 'Custom Macro Split' 135-305 with Lock/Unlock)
- **Onboarding: advanced calculation settings** — Choose the fat, mineral, vitamin and sugar algorithms within onboarding.
  - Web (Yes): SparkyFitnessFrontend/src/components/Onboarding/CalculationSettings.tsx:60-204; PersonalPlan.tsx:466-477
- **Onboarding: plan nutrient goals** — Review and edit macros, fiber, fat breakdown, minerals, sugars and vitamins, custom nutrients, water (with unit), exercise goals and meal distribution before starting.
  - Web (Yes): SparkyFitnessFrontend/src/components/Onboarding/NutrientGoals.tsx:50-693 (meals with MealPercentageManager 680-690)
- **Onboarding: start a 6-month cascading plan or save as preset** — Finish onboarding by saving profile, measurements, cascading goals, preferences (units, algorithms, modes) and onboarding data. Optionally it is also saved as a named preset.
  - Web (Yes): SparkyFitnessFrontend/src/components/Onboarding/PersonalPlan.tsx:270-375 (saving), 495-528 ('Start 6-Month Cascading Plan' and 'Save Preset & Start' buttons); OnboardingDialog.tsx:17-125
- **Per-nutrient hints on which direction to choose** — Informational popover next to Calories, Carbohydrates and Fat explaining that the right direction depends on the goal (e.g. Maximum to lose weight, Minimum to gain).
  - Web (Yes): SparkyFitnessFrontend/src/pages/Settings/NutrientGoalDirectionSettings.tsx:47-66 (GOAL_DEPENDENT_HINTS), 411 (shown in the nutrient row)
  - _Verification: added during verification_

#### Mobile only (5)

- **Display of progress against the step goal** · _Differs iOS/Android_ — Show the step goal in charts or progress surfaces.
  - **Updated in PR #3052 (merged):** Wear OS now also has a Steps page with today's steps against the goal and a Steps complication, so these watch surfaces are no longer iOS only; the goal line in Health Trends is unchanged on both platforms. Unlike the Apple Watch, which shows the phone's last count, Wear OS also uses the watch's own step sensor when its count is higher. Web still shows the step goal nowhere.
  - Mobile (Yes): SparkyFitnessMobile/src/hooks/useMeasurementsRange.ts:88 -> src/components/StepsBarChart.tsx:15-65 (goal line in Health Trends); src/hooks/useWatchCheckInBridge.ts:470-473 (stepGoal sent to the watch, 10,000 by default) -> targets/watch/Presentation/StepsView.swift and targets/watch-widget/StepsComplication.swift
  - iOS/Android: The goal line in Health Trends exists on iOS and Android; the Steps page and the Apple Watch complication only exist on iOS.
- **Adaptive mode notice and 'baseline calories' in the editor** — With adaptive calorie mode active, explains that the goal changes every day, shows today's adjusted goal, and treats the calorie field as the baseline.
  - **Partly covered by PR #2984 (merged):** Web now keeps Goal Mode and the Adaptive method when goals are saved without changing calories (for example, macros only), but still switches to Maintain and Manual when calories are changed or a day's goals are reset to default; mobile keeps them in every case. The web goal editors still have no adaptive-mode notice and no 'Baseline calories' label.
  - Mobile (Yes): SparkyFitnessMobile/src/screens/GoalsScreen.tsx:268-270,860-873 (note 'Adaptive mode is on... Today it is X kcal'), 394-397 ('Baseline calories' label); src/hooks/useGoals.ts:47-55 (useAdjustedCalorieGoal)
  - Note: Different behavior: on web, saving manual goals overrides the Goal Mode or the adaptive method; on mobile they are kept.
- **Mobile first-run onboarding (server connection)** — Initial app wizard: server URL (HTTPS required), sign-in with email and password, SSO/OIDC, Passkey, API key, MFA and a 'Later' option.
  - Mobile (Yes): SparkyFitnessMobile/App.tsx:523-524 (initial route 'Onboarding' when no server is configured); src/screens/OnboardingScreen.tsx:611-1060
  - Note: This belongs more to the authentication domain. It is included to make clear that the mobile 'Onboarding' is not equivalent to the web goals questionnaire.
- **Home screen widgets with goal progress** · _Differs iOS/Android_ — Widgets that show consumed versus goal for calories, macros or water.
  - **Partly covered by PR #3020 (merged):** Android now also has a water widget with today's water against the goal, a bar and − and + buttons, next to the calories and macros widgets. Still different: the Android calories widget shows only kcal left and its bar, without the food and burned calories; each Android widget comes in one fixed size, where iOS offers small and medium; and the Lock Screen formats are iOS only.
  - Mobile (Yes): iOS: SparkyFitnessMobile/targets/widget/widgets.swift, macroWidget.swift, waterWidget.swift; Android: targets/android-widget/kotlin/com/sparkyapps/sparkyfitness/widget/CalorieWidget.kt.tmpl, MacroWidget.kt.tmpl; plugins/withCalorieWidget.ts; src/services/CalorieWidgetBridge.ts
  - iOS/Android: iOS has calorie, macro and water widgets, with lock screen formats. Android has Glance calorie and macro widgets, with no water widget.
  - Note: Related to the widgets domain; here it only matters as a surface for displaying goals.
- **Apple Watch: Goals page and complications** · _iOS only_ — Watch page with today's nutrition versus goals (calorie ring and selected nutrients) and complications for energy, water, protein, carbohydrates, fat and steps.
  - **Updated in PR #3052 (merged):** Wear OS now has a Goals page too, with the calorie ring and the nutrients chosen in Settings > Wear OS, and the same seven complications as the Apple Watch (calories, protein, carbs, fat, water, fasting and steps), each opening its page. Still different: the Wear OS page shows calories eaten against the goal and kcal left but not calories burned, its calories complication has no macro rings, and its complications come only as ranged value and short text, while on Apple Watch the macro, steps and fasting ones also have corner, rectangular and inline formats. On both watches the texts are English only, apart from the nutrient names sent by the phone.
  - Mobile (Yes): SparkyFitnessMobile/targets/watch/Presentation/GoalSummaryView.swift; targets/watch-widget/EnergyGoalComplication.swift, WaterGoalComplication.swift, MacroComplications.swift, StepsComplication.swift; src/hooks/useWatchCheckInBridge.ts (goalNutrients, stepGoal); Settings > Apple Watch (WatchSettingsScreen)
  - iOS/Android: iOS only, with a paired Apple Watch; there is no Wear OS equivalent.

#### In both, with differences (10)

- **Daily calorie goal** — Field to set the daily calorie goal.
  - Web (Yes): SparkyFitnessFrontend/src/pages/Goals/DailyGoals.tsx:196-216 (NumericInput converted to the user's kcal/kJ energy unit)
  - Mobile (Partial): SparkyFitnessMobile/src/screens/GoalsScreen.tsx:97-103,387-398,885-888 (field always in kcal per NUTRIENT_META; in adaptive mode it is labeled 'Baseline calories (kcal)' 394-397)
  - Note: Mobile does not convert to kJ even when energy_unit is kJ; web does.
- **Bulk nutrient auto-calculation** — Calculate several nutrient goals at once.
  - Web (Yes): SparkyFitnessFrontend/src/pages/Goals/AutoCalculateToolbar.tsx:24-62 (Select all / None / 'Auto-calculate selected (n)') + checkbox per nutrient in NutrientAutoCalculate.tsx:105-114
  - Mobile (Partial): SparkyFitnessMobile/src/screens/GoalsScreen.tsx:892-902 (a single 'Calculate all from my profile' button for all calculable fields)
  - Note: Mobile does not let the user choose which nutrients to include.
- **Create and edit goal presets** — Preset form with name, calories, macros, nutrients, water, exercise, steps, and meal distribution.
  - Web (Yes): SparkyFitnessFrontend/src/pages/Goals/GoalPresetDialog.tsx:186-440 (name 195, macros g/% 204-330, auto-calculation 337-400, water/exercise 408, meals 413-426)
  - Mobile (Partial): SparkyFitnessMobile/src/screens/GoalsScreen.tsx:829-851,526-553,1013-1017 (the same Goals screen in preset mode via navigation.push('Goals', {presetId | newPreset}))
  - Note: The mobile preset lacks % macros, meal templates, and custom-nutrient auto-calculation. It does have the standard calculator, custom nutrients, water, exercise, and meals.
- **Direction guidance by health goal** — Guidance profiles (lose weight, gain weight, maintain, diabetes, heart health, low-carb) on which direction to choose.
  - Web (Partial): SparkyFitnessFrontend/src/pages/Settings/NutrientGoalDirectionSettings.tsx:71-115 (GUIDANCE_SCENARIOS), 232-270 (informational-only dropdown, nothing is applied), 623
  - Mobile (Yes): SparkyFitnessMobile/src/components/NutrientDirectionGuide.tsx:28-160 ('Apply' button per profile, 152-158); src/constants/nutrientDirectionGuides.ts:25-49 (buildGuideDirections calculates ranges using calories); src/screens/GoalsScreen.tsx:632-647,874-884
  - Note: Web only shows text; mobile applies the whole profile's directions with one tap.
- **Goal Mode (deficit or surplus over TDEE)** — Maintain (0%), Recomposition (-10%), Cut (-15%), Aggressive cut (-20%), Lean bulk (+10%), Bulk (+20%) and Manual (custom %).
  - **Updated in PR #3067 (merged):** Web and mobile now both offer an eighth Goal Mode, Weekly weight change, where you set how much to lose or gain each week. Mobile shows the estimated daily adjustment and a general note that the safety floor may limit loss, while web also states the largest weekly loss the floor allows. Mobile still does not mark unreachable modes or show the deficit ceiling.
  - Web (Yes): SparkyFitnessFrontend/src/pages/Settings/CalculationSettings.tsx:1184-1282 (includes 'Unreachable' labels and the maximum achievable deficit hint 1255-1280)
  - Mobile (Partial): SparkyFitnessMobile/src/screens/CalorieSettingsScreen.tsx:115-158,684-736
  - Note: Mobile offers all 7 modes, but does not warn about unreachable modes or the deficit ceiling.
- **Custom percentage for Manual Goal Mode** — Adjustment percentage (positive = surplus, negative = deficit).
  - Web (Yes): SparkyFitnessFrontend/src/pages/Settings/CalculationSettings.tsx:1312-1385 (with a warning when it exceeds what the safety floor allows)
  - Mobile (Partial): SparkyFitnessMobile/src/screens/CalorieSettingsScreen.tsx:712-736 (no 'unreachable' warning)
- **Calorie goal breakdown in the diary** — Explain in the diary where the day's goal comes from (BMR, body data, adaptive or projected TDEE, Goal Mode).
  - Web (Yes): SparkyFitnessFrontend/src/pages/Diary/DailyProgress.tsx:812-830 (CalorieTargetBreakdown asDialog with BMR, algorithm, weight, height, age, body fat, adaptive TDEE and Goal Mode)
  - Mobile (Partial): SparkyFitnessMobile/src/components/DiaryCalorieMacroSummary.tsx:203,274-305 (only with tdeeProjection: projected TDEE, Goal Mode target and the source)
- **Apply a preset to daily goals with cascade** — From the preset list in the goals editor, tap 'Apply' to load the preset values into the form and save them as goals from today onward.
  - Web (Partial): SparkyFitnessFrontend/src/pages/Goals/GoalPresetsSection.tsx:66-84 (on the Goals page each preset only has Edit/Delete); a preset can only be applied to a specific date, without cascade, from the diary dialog EditGoalsForToday.tsx:182-217 ('Apply Preset')
  - Mobile (Yes): SparkyFitnessMobile/src/components/GoalPresetsSection.tsx:81-86 ('Apply' button); src/screens/GoalsScreen.tsx:649-692 (handleApplyPreset, toast 'Preset applied. Tap Save to keep it.') and 598 (saved with cascade: true)
  - Note: The reverse (applying a preset to a single date only) is web-only and is covered in goals-edit-for-date.
  - _Verification: added during verification_
- **Target weight line and distance to goal in weight charts** — Draw the target weight as a line on the weight chart and show the estimated date to reach it (or 'Holding steady' / 'Moving away' / 'Over 2 years') and how much is left.
  - Web (Partial): SparkyFitnessFrontend/src/pages/Reports/MeasurementChartsGrid.tsx:163-172,532-556 (only the text 'Goal projected {{date}}' in the weight chart header, no goal line); the target weight line only appears in the GLP-1 medication report (pages/Reports/MedicationReports.tsx:225-230,771-774)
  - Mobile (Yes): SparkyFitnessMobile/src/components/WeightLineChart.tsx:295-301 (TrendGoalLine), 330-352 ('Goal date' tile with states), used in Health Trends (src/screens/DashboardScreen.tsx:326,890) and in src/screens/MeasurementsReportScreen.tsx:102,207-221 ('To goal weight'), 363
  - Note: On mobile the target weight can only be viewed, not edited (see goals-goal-weight-edit).
  - _Verification: added during verification_
- **Apply a goal preset** — Load a preset's values into the goals form and save them. On web this is only possible for a specific date from the Diary 'Edit Goals' dialog (without cascade); the Goals page only allows creating, editing and deleting presets. On mobile it is applied from Settings > Goals > Goal presets and saved …
  - Web (Partial): SparkyFitnessFrontend/src/pages/Goals/EditGoalsForToday.tsx:182-217 ('Apply Preset' Select -> handleApplyPreset) and 505-512 (saved with cascade:false for selectedDate); pages/Goals/GoalPresetsSection.tsx:66-82 only has Edit/Delete.
  - Mobile (Partial): SparkyFitnessMobile/src/components/GoalPresetsSection.tsx:81-86 ('Apply' button) -> src/screens/GoalsScreen.tsx:649-694 (handleApplyPreset loads the values, toast 'Tap Save to keep it'), 598 (saveGoals with date = today and cascade:true); there is no way to apply it to a single date only.
  - Note: Different scope in each client: web = a single day (past or future); mobile = from today onward. Neither offers both options.
  - _Verification: added during verification_

#### In both clients, but with iOS/Android differences (1)

- **Use measured BMR (check-ins and synced devices)** · _Differs iOS/Android_ — use_external_bmr toggle so that a BMR logged in a check-in or synced from a scale or provider replaces the formula for that day.
  - Web (Yes): SparkyFitnessFrontend/src/pages/Settings/CalculationSettings.tsx:766-790 (Checkbox 'calculationSettings.useExternalBmr' with its hint), Settings > Nutrition > Calculation settings (SettingsPage.tsx:321-341).
  - Mobile (Yes): SparkyFitnessMobile/src/screens/CalorieSettingsScreen.tsx:893-927 (Switch 'Use measured BMR from check-ins and synced devices'), Settings > Calories & BMR (SettingsScreen.tsx:272-280).
  - iOS/Android: On iOS, with the toggle enabled, an extra note appears (CalorieSettingsScreen.tsx:918-925, Platform.OS === 'ios') recommending setting the activity level to None (×1.0), because Apple Health Resting Energy already includes light activity. It does not appear on Android.
  - _Verification: added during verification_

<details><summary>Web ↔ mobile parity (30)</summary>

- Goals configuration screen
- Macronutrient goals in grams
- Goals for fiber, detailed fats, minerals, vitamins, sugar, caffeine, and alcohol
- Goals for custom nutrients
- Daily water goal
- Exercise goals (calories burned and duration)
- Daily step goal
- Auto-calculate a nutrient from the profile
- Calorie distribution by meal
- Save goals cascading from today
- Apply a goal preset
- Goal presets list
- Delete goal preset
- Weekly goal plans list
- Create and edit weekly plan (preset per day of the week)
- Delete weekly plan
- Use of goal weight in charts (goal line and forecast)
- Goal direction per nutrient (Min / Max / Range)
- Legend and explanation of Min/Max/Range
- Include BMR (resting calories) in net calories
- Use measured BMR (check-ins and devices)
- Show net carbs
- Calorie goal adjustment mode
- Exercise calorie earn-back percentage
  - **Updated in PR #2940 (merged):** When the Goal Mode calculation method is Adaptive and a BMR is known, web and mobile both hide the earn-back percentage and show the same notice: adaptive targets already include activity, so exercise earn-back applies only to Manual targets. Otherwise the percentage works as before, the same on web, iOS and Android.
- Activity level (TDEE multiplier)
- Allow the fallback projection to lower the goal
- Explanation of how calories are calculated
- Goal Mode calculation method (Adaptive / Manual)
- Calorie safety floor
- Manage goals via the Sparky chat

</details>

### 2.8 Reports & analytics

#### Web only (38)

- **Maximize and zoom charts** — Open a chart full screen and zoom in/out; tooltips synchronized across charts on the same page.
  - Web (Yes): ZoomableChart with Maximize/Minimize/ZoomIn/ZoomOut (SparkyFitnessFrontend/src/components/ZoomableChart.tsx:10-40) used in almost every chart (e.g. NutritionPeriodSummary.tsx:594,807; SleepAnalyticsCharts.tsx:350,429,543,660); synchronization via REPORTS_CHART_SYNC_ID (src/utils/chartUtils, NutritionChartsGrid.tsx:26)
- **Chart scale mode (time vs. point)** — Preference that determines whether the X axis is proportional to time or uses evenly spaced points.
  - Web (Yes): Settings → Preferences 'Chart Scale Mode' time/point (SparkyFitnessFrontend/src/pages/Settings/PreferenceSettings.tsx:206-230); applied with prepareTimeChartData(chartScaleMode) in NutritionPeriodSummary.tsx and NutritionChartsGrid.tsx
- **Energy unit (kcal/kJ) in reports** — Show calories in the user's preferred unit in reports and exports.
  - Web (Yes): convertEnergy/energyUnit in NutritionPeriodSummary.tsx:72-78,371-375 and exports (src/pages/Reports/Reports.tsx:339-385)
  - Note: Mobile shows the reports, but always in kcal.
- **View another user's reports (family access)** — View the reports of a family member/friend who has granted the 'reports' permission.
  - Web (Yes): PermissionRoute permission='reports' (SparkyFitnessFrontend/src/App.tsx:395-399); Reports uses activeUserId from ActiveUserContext (src/pages/Reports/Reports.tsx:55-56,123-139), selectable with ProfileSwitcher (src/components/ProfileSwitcher.tsx)
- **Cumulative balance chart** — Area chart that accumulates, day by day, the difference between what was consumed and the goal for the selected nutrient.
  - Web (Yes): 'Cumulative Balance - <nutrient>' AreaChart (SparkyFitnessFrontend/src/pages/Reports/NutritionPeriodSummary.tsx:396,807-860)
- **Net carbs in reports** — Replace carbs with net carbs when the user prefers it.
  - Web (Yes): withNetCarbsSubstitution and 'Net Carbs' label (SparkyFitnessFrontend/src/pages/Reports/NutritionPeriodSummary.tsx:82-85,129-133; NutritionChartsGrid.tsx:66-69,150-153); also in exportFoodDiary (Reports.tsx:349)
- **Custom measurement categories report** — A chart for each numeric custom category (with unit conversion) and values with notes.
  - Web (Yes): CustomCategoryReport 'Custom Measurements' (SparkyFitnessFrontend/src/pages/Reports/CustomCategoryReport.tsx:88-200); Measurements tab (Reports.tsx:264-269)
- **Raw stress levels (intraday)** — Chart of the device's unprocessed stress series.
  - Web (Yes): StressChart 'Raw Stress Levels' with useRawStressData (SparkyFitnessFrontend/src/pages/Reports/StressChart.tsx; Reports.tsx:123-124,294-308)
- **Sleep debt chart** — Daily sleep debt across the period.
  - Web (Yes): 'Sleep Debt' (SparkyFitnessFrontend/src/pages/Reports/SleepAnalyticsCharts.tsx:543-655)
- **Sleep science: sleep debt** — Sleep debt ring with estimated nights to recover and a 14-day debt/surplus history.
  - Web (Yes): SleepDebtRing and SleepDebtHistory (SparkyFitnessFrontend/src/pages/Reports/SleepScience/SleepScienceSection.tsx:145,167; SleepDebtRing.tsx; SleepDebtHistory.tsx)
- **Sleep science: chronotype** — Chronotype with average wake/sleep time, nadir, acrophase, and melatonin window.
  - Web (Yes): ChronotypeCard (SparkyFitnessFrontend/src/pages/Reports/SleepScience/ChronotypeCard.tsx; SleepScienceSection.tsx:152)
- **Sleep science: energy curve** — Predicted energy schedule/curve throughout the day with current energy.
  - Web (Yes): EnergySchedule 'Energy Curve' (SparkyFitnessFrontend/src/pages/Reports/SleepScience/EnergySchedule.tsx; SleepScienceSection.tsx:158)
- **Sleep science: sleep need tonight** — Breakdown of sleep need (baseline, strain, debt recovery, naps) and method.
  - Web (Yes): SleepNeedBreakdown 'Sleep Need Tonight' (SparkyFitnessFrontend/src/pages/Reports/SleepScience/SleepNeedBreakdown.tsx; SleepScienceSection.tsx:163)
- **Recalculate sleep baseline** — Button that recalculates the sleep baseline using the last 90 days.
  - Web (Yes): useCalculateBaselineMutation().mutate(90) 'Recalculate' button (SparkyFitnessFrontend/src/pages/Reports/SleepScience/SleepScienceSection.tsx:42,62-71)
- **Sleep analysis table and CSV export** — Per-night table (bedtime, wake time, duration, time asleep, score, efficiency, debt, impact, awake periods, insight) exportable to CSV.
  - Web (Yes): SleepAnalyticsTable (SparkyFitnessFrontend/src/pages/Reports/SleepAnalyticsTable.tsx) and exportSleepDataToCSV (SleepReport.tsx:43-70,461-468)
- **Exercise dashboard filters and grouping** — Compare with the previous period/last year, filter by equipment, muscle group and exercises, and group by day/week/month/year.
  - Web (Yes): ExerciseDashboardFilters (SparkyFitnessFrontend/src/components/ExerciseCharts/ExerciseDashboardFilters.tsx:66-177) and 'Group by' interval (ExerciseReportsDashboard.tsx:822-850)
- **Strength trends (volume, max weight, estimated 1RM)** — Charts of volume, max weight and estimated 1RM progression per exercise.
  - Web (Yes): VolumeTrendChart, MaxWeightTrendChart, Estimated1RMTrendChart under 'More analysis' (SparkyFitnessFrontend/src/pages/Reports/ExerciseReportsDashboard.tsx:399-461,647-651,700)
- **Best set by rep range and reps vs. weight scatter** — Chart of the best set per rep range and a scatter plot of reps versus weight.
  - Web (Yes): BestSetRepRangeChart and RepsVsWeightChart (SparkyFitnessFrontend/src/pages/Reports/ExerciseReportsDashboard.tsx:462,512)
- **Per-set performance analysis** — Comparison of each set's performance (first, best, last) per exercise.
  - Web (Yes): SetPerformanceAnalysisChart (SparkyFitnessFrontend/src/pages/Reports/SetPerformanceAnalysisChart.tsx; ExerciseReportsDashboard.tsx:581)
- **Time under tension** — Chart of time under tension per exercise.
  - Web (Yes): TimeUnderTensionChart (SparkyFitnessFrontend/src/pages/Reports/ExerciseReportsDashboard.tsx:534)
- **Cardio volume by interval** — Cardio distance, duration and calories grouped by week/month/year.
  - Web (Yes): CardioVolumeIntervalChart (SparkyFitnessFrontend/src/components/ExerciseCharts/CardioVolumeIntervalChart.tsx; ExerciseReportsDashboard.tsx:895,938)
- **Matched courses** — Groups activities that follow the same course so they can be compared.
  - Web (Yes): MatchedCoursesList with useMatchedCourses (SparkyFitnessFrontend/src/components/ExerciseCharts/MatchedCoursesList.tsx; ExerciseReportsDashboard.tsx:940)
- **Activity finder by distance** — Query activities by distance (5K, 10K, 15K…) showing average pace, average HR and calories.
  - Web (Yes): ActivityInterrogationFinder (SparkyFitnessFrontend/src/components/ExerciseCharts/ActivityInterrogationFinder.tsx; ExerciseReportsDashboard.tsx:942)
- **Switchable X-axis in activity charts** — View activity charts against time of day, duration or distance.
  - Web (Yes): X-Axis Time of Day / Duration / Distance selector (SparkyFitnessFrontend/src/pages/Reports/ActivityReportVisualizer.tsx:630-650)
- **Telemetry report and structured workout** — 'Activity Maps' list with the full report of provider (Garmin) activities, and a structured workout visualizer (steps, targets, PRs and session stats).
  - Web (Yes): ActivityTelemetryList (SparkyFitnessFrontend/src/components/ExerciseCharts/ActivityTelemetryList.tsx:30-60; ExerciseReportsDashboard.tsx:948) and WorkoutReportVisualizer 'Workout Steps' / 'Personal Records (PRs)' (src/pages/Reports/WorkoutReportVisualizer.tsx; ActivityReportVisualizer.tsx:38)
- **Medication report: indicators** — Average adherence, number of GLP-1 injections and symptom count for the period.
  - Web (Yes): Medications tab (SparkyFitnessFrontend/src/pages/Reports/Reports.tsx:390-413); KPIs (MedicationReports.tsx:590-640)
- **Medication report charts** — Nausea vs. dose, weight vs. goal, adherence trend and GLP-1 check-in trends (hunger, fullness, food noise, energy).
  - Web (Yes): SparkyFitnessFrontend/src/pages/Reports/MedicationReports.tsx:657-880
- **Medication correlations** — Hydration-constipation, protein-nausea, sleep-fatigue and dose-nausea correlations with a confidence score.
  - Web (Yes): SparkyFitnessFrontend/src/pages/Reports/MedicationReports.tsx:963-1290
- **Medication log table** — Table by date with doses taken, doses skipped, times and symptoms.
  - Web (Yes): MedicationLogTable (SparkyFitnessFrontend/src/pages/Reports/MedicationLogTable.tsx; MedicationReports.tsx:790)
- **Customize medication report charts** — Choose which charts and correlations appear in the medication report.
  - Web (Yes): 'Customize Charts' (SparkyFitnessFrontend/src/pages/Reports/MedicationReports.tsx:484-565)
- **Prescriber report (PDF) and medication CSV** — Print/save a prescriber report as PDF and download the data as CSV.
  - Web (Yes): 'Print / Save PDF Report' and 'Download CSV Data' (SparkyFitnessFrontend/src/pages/Reports/MedicationReports.tsx:1307-1340); print template medications.print.*
- **Food diary table and CSV** — Table of foods for the period (date, meal, food, quantity, nutrients) with a table selector and CSV export.
  - Web (Yes): 'All tables'/food/exercise/measurements/category selector (SparkyFitnessFrontend/src/pages/Reports/ReportsTables.tsx:119-120,456-485) and 'Food Diary Table' with export (ReportsTables.tsx:504; Reports.tsx:339-351, exportFoodDiary in src/utils/reportUtil)
- **Exercise entries table and CSV** — Exercise table with sets, reps, weight, rest, tonnage and calories, filters by name and set type, exportable to CSV.
  - Web (Yes): 'Exercise Entries Table' with filters (SparkyFitnessFrontend/src/pages/Reports/ReportsTables.tsx:651-680,721) and exportExerciseEntries (Reports.tsx:375-385)
- **Body measurements table and CSV** — Table of weight, neck, waist, hips, height, body fat %, muscle/bone mass, water %, BMR and steps, exportable to CSV.
  - Web (Yes): 'Body Measurements Table' (SparkyFitnessFrontend/src/pages/Reports/ReportsTables.tsx:855-920) and exportBodyMeasurements (Reports.tsx:352-362)
- **Custom measurement tables and CSV** — One table per custom category (date, time, value, notes), exportable to CSV per category.
  - Web (Yes): SparkyFitnessFrontend/src/pages/Reports/ReportsTables.tsx:1020-1040 and exportCustomMeasurement (Reports.tsx:363-374)
- **Percentage of each nutrient coming from supplements** — Each nutrient chart in the report shows what percentage of the average intake comes from supplements or medications with nutrients (only appears if supplements were taken).
  - Web (Yes): NutritionChartsGrid computes supplement_<nutrient> and shows '{{percent}}% from supplements' under 'Avg' (SparkyFitnessFrontend/src/pages/Reports/NutritionChartsGrid.tsx:215-265)
  - _Verification: added during verification_
- **Mood notes in the report chart** — Hovering over a day in the mood chart shows the value, emoji, label and the notes written that day.
  - **Updated in PRs #3016 and #3018 (merged):** Neither app now shows notes in the mood report chart: the web tooltip shows the mood value with its emoji and label and the number of check-ins that day. Instead, both show the start of each check-in's journal text (up to 120 characters) in the day's check-in list, on the web Check-In page and on the mobile Mood day screen.
  - Web (Yes): MoodChart's CustomTooltip shows 'Mood Value' and 'Notes:' + entry.notes (SparkyFitnessFrontend/src/pages/Reports/MoodChart.tsx:209-235), in the Stress tab of Reports (Reports.tsx:292-302)
  - _Verification: added during verification_
- **Sleep Science insufficient-data notice** — Notice with a recommendation and a count of workdays and free days available/needed for the full Sleep Science analysis.
  - Web (Yes): 'More data needed for full analysis' card with 'Workdays: x/y' and 'Free days: x/y' (SparkyFitnessFrontend/src/pages/Reports/SleepScience/SleepScienceSection.tsx:76-118).
  - _Verification: added during verification_

#### Mobile only (11)

- **Configurable default range** — Setting that defines which window each report opens with.
  - Mobile (Yes): Customize reports → 'Default range' 7d/30d/90d (SparkyFitnessMobile/src/screens/ReportsSettingsScreen.tsx:405-418); read by useReportCustomization (src/hooks/useReportCustomization.ts) and ExerciseStatisticsScreen.tsx:114-118
- **Reorder and hide reports in the hub** — Drag to change the order of the reports on the Reports page and turn off the ones you don't want to see.
  - Mobile (Yes): ReorderSwitchList in ReportsSettingsScreen.tsx:376-403 (prevents hiding the last visible one); applied in ReportsScreen.tsx:109-112; accessed from the hub header icon (ReportsScreen.tsx:29-37) and from Settings → Reports (src/screens/SettingsScreen.tsx:326-333)
- **Period macro split** — 'Where your calories come from' bar with the percentage of protein, carbs, and fat.
  - Mobile (Yes): MacroSplitBar (SparkyFitnessMobile/src/screens/NutritionReportScreen.tsx:416-432; src/components/reports/MacroSplitBar.tsx)
- **Highlight days and calories by weekday** — Day with the most and the fewest calories logged, and average calories per weekday.
  - Mobile (Yes): 'Highlights' (SparkyFitnessMobile/src/screens/NutritionReportScreen.tsx:441-463) and 'Calories by weekday' (lines 485-499)
- **Food logging consistency** — Current streak and longest streak of days with food logged.
  - Mobile (Yes): 'Logging consistency' (SparkyFitnessMobile/src/screens/NutritionReportScreen.tsx:500-527)
- **Water goal, streaks and highlight days** — Goals met, longest goal streak, total, best and worst day, and average per weekday.
  - Mobile (Yes): 'Water goal' (SparkyFitnessMobile/src/screens/HydrationReportScreen.tsx:227-262), 'Best and lowest days' (263-283), 'Average by weekday' (284-300)
- **Sleep stress per night** — Chart of each night's average stress.
  - Mobile (Yes): 'Sleep stress' metric (SparkyFitnessMobile/src/screens/SleepAnalyticsScreen.tsx:131,565-585)
- **Weekday vs. weekend sleep** — Time asleep and bedtime on weeknights versus weekends.
  - Mobile (Yes): 'Weekdays vs weekends' (SparkyFitnessMobile/src/screens/SleepAnalyticsScreen.tsx:588-596)
- **Pace zones** — Personal pace zones (Easy, Steady, Threshold, Interval, Repetition) with per-km/per-mile ranges.
  - **Partly covered by PR #3154 (merged):** Web now lists the five training pace ranges (Easy to Repetition) in a read-only 'Fitness tests' card on the Cardio view of Reports > Exercise, but only when the person has a fitness test, which is recorded in the mobile app. Web still has no pace zones estimated from recent runs; the mobile Pace zones card uses the latest test first, then recent runs.
  - Mobile (Yes): PaceZonesCard (SparkyFitnessMobile/src/components/exerciseStats/PaceZonesCard.tsx:35-110; ExerciseStatisticsScreen.tsx:237) with usePaceZones
- **Export route to GPX** — Generates a GPX file of the route and opens the share sheet (Files, Strava, Garmin Connect…).
  - Mobile (Yes): 'Export GPX' button (SparkyFitnessMobile/src/screens/CardioSessionScreen.tsx:203-216,305-312) with shareRouteAsGpx (src/services/gpxExport.ts:11-41)
- **Weight and body fat % trend on Apple Watch** · _iOS only_ — Watch 'Weight trend' page, shown after saving a check-in, with a weight and body fat % chart and rolling mean; the Digital Crown switches between metrics.
  - **Updated in PR #3052 (merged):** Wear OS now has a Weight Trend page as well: the last 14 weight check-ins with a 7-point rolling mean, switched to a body fat line by a tap or the rotary crown once there are two body fat readings, and it can be reordered or hidden in Settings → Wear OS. Unlike the Apple Watch, saving a weight check-in on Wear OS does not open the trend page; the wearer swipes to it.
  - Mobile (Yes): TrendView with weight and bodyFat metrics and rollingMean (SparkyFitnessMobile/targets/watch/Presentation/TrendView.swift:13-40), .trend page (ContentView.swift:168-169), can be enabled in Settings → Apple Watch ('Weight trend', src/constants/watchPages.ts:15,40-41; SettingsScreen.tsx:368-377, visible only with a paired watch).
  - iOS/Android: watchOS target created with @bacons/apple-targets; there is no Wear OS equivalent (targets/ only has Android widgets and notifications).
  - _Verification: added during verification_

#### In both, with differences (49)

- **Report date range selector** — Choose the period the reports cover (presets and custom range).
  - Web (Yes): DateRangePickerWithPresets with presets for 7, 14, 30, 90 days, 6 months, 1 year and a free calendar (SparkyFitnessFrontend/src/components/ui/DateRangeWithPresets.tsx:16-101); default range of 14 days, persisted in the URL along with the tab (?startDate&endDate&tab) (src/pages/Reports/Reports.tsx:88-115,181-203)
  - Mobile (Partial): ReportRangeControl with 7d/30d/90d + 'Custom', which opens DateRangeSheet (SparkyFitnessMobile/src/components/reports/ReportRangeControl.tsx:29-83); the custom range is limited to 180 days (src/utils/trendRange.ts:42,63-75); used by all reports via useReportCustomization (src/hooks/useReportCustomization.ts) and by ExerciseStatisticsScreen.tsx:599
  - Note: Mobile: no 14-day, 6-month or 1-year presets; maximum of 180 days; no deep link carrying the range. Some mobile cards use fixed windows (training load 28 days, running trends 12 weeks).
- **Show/hide sections of each report and reset** — Per-section toggles (key figures, insights, charts, cards) for each report and a button to restore the defaults.
  - Web (Partial): Only exists for the Measurements chart grid (hide/restore widgets and 'Reset layout', SparkyFitnessFrontend/src/components/widgets/WidgetGrid.tsx:210-277) and for the medication report ('Customize Charts', src/pages/Reports/MedicationReports.tsx:484-565)
  - Mobile (Yes): Per-report sections defined in SparkyFitnessMobile/src/constants/reports.ts (NUTRITION_SECTIONS, HYDRATION_SECTIONS, SUBSTANCES_SECTIONS, EXERCISE_SECTIONS, MEASUREMENTS_SECTIONS, SLEEP_SECTIONS + sleepMetricSection, MOOD_SECTIONS); toggles in ReportsSettingsScreen.tsx:328-352,420-504; 'Reset' button in the header (ReportsSettingsScreen.tsx:315-326)
- **Customizable Measurements chart layout** — Edit mode to drag, resize, hide and reset the measurement charts, with the layout saved on the server per user.
  - Web (Yes): WidgetGrid pageKey='reports-measurements' (SparkyFitnessFrontend/src/pages/Reports/Reports.tsx:243-250); edit/hide/reset and useDashboardLayout persistence (src/components/widgets/WidgetGrid.tsx:93-277); disabled when acting on behalf of another user (WidgetGrid.tsx:107)
  - Mobile (Partial): MeasurementsReportScreen has a fixed section order (SparkyFitnessMobile/src/screens/MeasurementsReportScreen.tsx:349-400); sections can only be hidden from Customize reports
  - _Verification: corrected during verification_
- **Key figures and insights with comparison to the previous period** — Card with highlighted figures and auto-generated sentences ('What stood out') that compare against the equivalent previous period.
  - Web (Partial): Only the exercise dashboard offers 'Compare to: Previous Period / Last Year' (SparkyFitnessFrontend/src/components/ExerciseCharts/ExerciseDashboardFilters.tsx:82-97); there are no text insights
  - Mobile (Yes): ReportHighlights + ReportInsights in Nutrition (SparkyFitnessMobile/src/screens/NutritionReportScreen.tsx:355-360), Hydration (HydrationReportScreen.tsx:209-214), Caffeine/alcohol (SubstancesReportScreen.tsx:327-332), Sleep (SleepAnalyticsScreen.tsx:513-518), Measurements (MeasurementsReportScreen.tsx:349-354), Mood (MoodReportScreen.tsx:213-218)
- **Nutrition period summary (balance and goal adherence)** — Net balance (consumed vs goal), totals, average daily variance, days within the target range and a notice of how many days were counted.
  - Web (Yes): 'Net Balance' and 'Avg Daily Variance' cards, 'days in target range' and coverage message (SparkyFitnessFrontend/src/pages/Reports/NutritionPeriodSummary.tsx:330-370,520-590)
  - Mobile (Partial): 'Calorie goal' card with days within 10%, above, below and average vs goal (SparkyFitnessMobile/src/screens/NutritionReportScreen.tsx:176-220,433-440) and key figures (average calories, average protein, days on target, days logged)
  - Note: Mobile: calories only, with no cumulative net balance and no support for range-type goals (target min/max) per nutrient.
- **Multi-nutrient selector for the summary** — Choose one or more nutrients (including custom ones) for the summary and the daily chart, with one marked as primary.
  - Web (Yes): DropdownMenu of checkboxes with '(Primary)' (SparkyFitnessFrontend/src/pages/Reports/NutritionPeriodSummary.tsx:86-90,478-512); options from CENTRAL_NUTRIENT_CONFIG + custom nutrients (lines 100-140)
  - Mobile (Partial): There is no selector in the report; in Customize reports you choose and order the nutrients of the 'Your nutrients' card (includes custom ones) (SparkyFitnessMobile/src/screens/ReportsSettingsScreen.tsx:428-454)
  - Note: On mobile the selection only affects the list of averages, not overlaid charts.
- **Daily calories/nutrient chart with goal** — Daily series for the nutrient with a goal line (or target range band) and the period average.
  - Web (Yes): LineChart with goal/range ReferenceLine/ReferenceArea and 'Avg' (SparkyFitnessFrontend/src/pages/Reports/NutritionPeriodSummary.tsx:594-700), calorie goal adjusted for exercise (calorieBalanceByDate)
  - Mobile (Partial): CaloriesBarChart with bars stacked by macros (carbs/fat/protein/other) with goal and average (SparkyFitnessMobile/src/screens/NutritionReportScreen.tsx:361-370; src/components/charts/caloriesStackLayout.ts)
  - Note: Mobile only covers calories (other nutrients are on the individual trend screen); in exchange it shows the macro composition in each bar.
- **Per-nutrient chart grid** — One chart per nutrient (macros, fats, micronutrients, caffeine, water, alcohol, custom) with a goal line and average.
  - Web (Yes): NutritionChartsGrid filtered by 'report_chart' desktop/mobile preferences (SparkyFitnessFrontend/src/pages/Reports/NutritionChartsGrid.tsx:72-75,239-370); rendered in Reports.tsx:230-237
  - Mobile (Partial): One nutrient at a time in NutrientTrendsScreen (SparkyFitnessMobile/src/screens/NutrientTrendsScreen.tsx:27-135), opened from 'Trend by nutrient' (protein/carbs/fat) (NutritionReportScreen.tsx:553-580), from each nutrient row (NutritionReportScreen.tsx:128-135) or from the diary's Nutrition Details (DailyNutritionDetailsScreen.tsx:304)
- **Single-nutrient trend statistics** — For one nutrient: daily average, highest intake day, daily goal, and average vs goal.
  - Web (Partial): Each NutritionChartsGrid chart shows only 'Avg' and the goal line (SparkyFitnessFrontend/src/pages/Reports/NutritionChartsGrid.tsx:239-370)
  - Mobile (Yes): 'Summary Statistics': Daily Average, Highest Intake Day, Target Daily Goal, Average vs. Target (SparkyFitnessMobile/src/screens/NutrientTrendsScreen.tsx:139-210) with its own 7d/30d/90d range (line 27,119-125)
- **Daily nutrition averages** — Card with calorie and macro averages and the number of days logged in the period.
  - Web (Partial): Only 'Avg: X' in each chart header (SparkyFitnessFrontend/src/pages/Reports/NutritionPeriodSummary.tsx:604-614; NutritionChartsGrid.tsx:250-262)
  - Mobile (Yes): 'Daily averages' (SparkyFitnessMobile/src/screens/NutritionReportScreen.tsx:373-415)
- **Macro goal adherence** — Average of each macro against its goal (g and % of goal).
  - Web (Partial): Only goal lines on each macro chart and the net balance of the selected nutrient (SparkyFitnessFrontend/src/pages/Reports/NutritionChartsGrid.tsx:96-120; NutritionPeriodSummary.tsx:520-590)
  - Mobile (Yes): 'Macro goals' (SparkyFitnessMobile/src/screens/NutritionReportScreen.tsx:464-484)
- **Fats, vitamins/minerals and 'Your nutrients' cards** — Period averages for the fat breakdown, micronutrients, and chosen nutrients (including custom ones) with % of goal and change vs. previous period; each row opens its trend.
  - Web (Partial): These nutrients only appear as individual charts in NutritionChartsGrid if enabled under 'Report (Chart)' (SparkyFitnessFrontend/src/pages/Reports/NutritionChartsGrid.tsx:72-75); no average cards
  - Mobile (Yes): 'Fat breakdown', 'Vitamins and minerals', 'Your nutrients' (SparkyFitnessMobile/src/screens/NutritionReportScreen.tsx:529-552; FAT_BREAKDOWN_NUTRIENTS/MICRONUTRIENTS lists in src/constants/reports.ts)
- **Weekly alcohol vs limit** — Standard drinks for the week against the weekly limit, with per-day breakdown and status (over/under/no limit).
  - Web (Yes): WeeklyAlcoholCard 'Weekly Alcohol Intake' (SparkyFitnessFrontend/src/pages/Reports/WeeklyAlcoholCard.tsx:15-60); Nutrients tab (Reports.tsx:212-214)
  - Mobile (Partial): 'Week by week' shows grams of alcohol (and average caffeine) per week, with no standard drinks or weekly limit (SparkyFitnessMobile/src/screens/SubstancesReportScreen.tsx:306-323,396-408)
- **Daily alcohol chart and summary** — Daily alcohol bars, days with alcohol, average on those days, peak day, alcohol-free days, and change vs previous period.
  - Web (Partial): Only as a generic 'alcohol_g' chart in NutritionChartsGrid if enabled (SparkyFitnessFrontend/src/constants/nutrients.ts:245; NutritionChartsGrid.tsx)
  - Mobile (Yes): 'Alcohol' chart and summary (SparkyFitnessMobile/src/screens/SubstancesReportScreen.tsx:366-395; figures 149-164, insights 218-222)
- **Caffeine report with daily limit** — Daily caffeine bars with a limit line, average on caffeine days, days over the limit, and peak day.
  - Web (Partial): Only a generic 'caffeine_mg' chart in NutritionChartsGrid if enabled (SparkyFitnessFrontend/src/constants/nutrients.ts:218), with no limit analysis
  - Mobile (Yes): TrendBarChart 'Caffeine' with goalValues=limitMg and 'Caffeine' card (SparkyFitnessMobile/src/screens/SubstancesReportScreen.tsx:333-365; rows 233-260)
- **Weight summary** — Latest weight, change over the period, min/max, and distance to goal weight.
  - Web (Partial): Only the trend summary line of the weight widget (SparkyFitnessFrontend/src/pages/Reports/MeasurementChartsGrid.tsx:515-560)
  - Mobile (Yes): 'Weight' card (SparkyFitnessMobile/src/screens/MeasurementsReportScreen.tsx:175-220,366-371)
- **Body composition charts** — Charts for body fat %, muscle mass, bone mass, body water %, and BMR.
  - Web (Yes): bodyFatPercentage, muscleMass, boneMass, bodyWaterPercentage, bmr widgets (SparkyFitnessFrontend/src/pages/Reports/MeasurementChartsGrid.tsx:384-450)
  - Mobile (Partial): Only 'Body composition' with body fat % and muscle mass rows (latest value and change), no charts and no bone mass/water/BMR (SparkyFitnessMobile/src/screens/MeasurementsReportScreen.tsx:131-146,372-380)
- **Body (tape) measurement charts** — Charts for neck, waist, hips, and height.
  - Web (Yes): neck, waist, hips, height widgets (SparkyFitnessFrontend/src/pages/Reports/MeasurementChartsGrid.tsx:328-382)
  - Mobile (Partial): 'Body measurements' with waist, hips, and neck rows (latest and change), no charts and no height (SparkyFitnessMobile/src/screens/MeasurementsReportScreen.tsx:147-174,381-388)
- **Body Battery** — Body Battery (charged/drained, highest, at wake, lowest, gauge, and trend) from Garmin-style custom measurements.
  - Web (Yes): BodyBatteryCard + BodyBatteryGauge (SparkyFitnessFrontend/src/pages/Reports/BodyBatteryCard.tsx, BodyBatteryGauge.tsx); Measurements tab (Reports.tsx:252-257)
  - Mobile (Partial): Only 'Body battery gained' per night as a bar chart in Sleep Analytics (SparkyFitnessMobile/src/screens/SleepAnalyticsScreen.tsx:139,565-585)
- **Daily respiration (asleep vs. awake)** — Daily averages of respiration while asleep and awake, with trend.
  - Web (Yes): RespirationCard 'Sleep Avg' / 'Awake Avg' / 'Trend' (SparkyFitnessFrontend/src/pages/Reports/RespirationCard.tsx); Measurements tab (Reports.tsx:258-263)
  - Mobile (Partial): Only overnight respiration per night ('Respiration') in Sleep Analytics (SparkyFitnessMobile/src/screens/SleepAnalyticsScreen.tsx:123,565-585)
- **Mood summary** — Average mood, days logged, best/worst day, average per weekday, and most logged moods.
  - Web (Partial): Only 'Most common moods' inside MoodChart (SparkyFitnessFrontend/src/pages/Reports/MoodChart.tsx)
  - Mobile (Yes): 'Summary', 'Highlights', 'Average by weekday', 'Most logged' (SparkyFitnessMobile/src/screens/MoodReportScreen.tsx:240-290)
- **Last night summary** — Duration, score, resting HR, battery, restless moments, SpO2, HRV, and respiration for the most recent night.
  - Web (Yes): SleepSummaryCard 'Last Night' (SparkyFitnessFrontend/src/pages/Reports/SleepSummaryCard.tsx; SleepAnalyticsCharts.tsx:298)
  - Mobile (Partial): Not in the report; per-night detail is opened from the Diary sleep cards (src/components/SleepCards.tsx:182) in SleepDetailScreen with duration, score, stages, and overnight biometrics (src/screens/SleepDetailScreen.tsx:199-203; src/components/SleepBiometrics.tsx:39-76)
- **Nightly hypnograms** — List of hypnograms for each night of the period with 'Show all/less'.
  - Web (Yes): 'Nightly Details' with SleepStageChart per night (SparkyFitnessFrontend/src/pages/Reports/SleepAnalyticsCharts.tsx:307-335; SleepStageChart.tsx)
  - Mobile (Partial): Hypnogram only inside SleepDetailScreen for a specific night (SparkyFitnessMobile/src/screens/SleepDetailScreen.tsx:201), not in Sleep Analytics
- **Sleep stages over the period** — Distribution of Deep, REM, Light, and Awake across the period.
  - Web (Yes): 'Sleep Stages' stacked bar chart per night (SparkyFitnessFrontend/src/pages/Reports/SleepAnalyticsCharts.tsx:350-427)
  - Mobile (Partial): 'Average night' card with the average percentage of each stage, no per-night chart (SparkyFitnessMobile/src/screens/SleepAnalyticsScreen.tsx:519-557)
- **Sleep schedule consistency** — Bedtimes and wake times across the period.
  - Web (Yes): 'Sleep Consistency' Bedtime/Wake Time chart (SparkyFitnessFrontend/src/pages/Reports/SleepAnalyticsCharts.tsx:429-540)
  - Mobile (Partial): 'Routine' card with average bedtime/wake time and ±min variation (SparkyFitnessMobile/src/screens/SleepAnalyticsScreen.tsx:558-564); band chart only in the Dashboard Health Trends (SleepTimelineChart, src/components/HealthTrendsPager.tsx:105)
- **Time asleep per night chart** — Bars of each night's time asleep.
  - Web (Partial): The per-night total can only be read from the stacked stages chart and the table (SparkyFitnessFrontend/src/pages/Reports/SleepAnalyticsCharts.tsx:237,350-427; SleepAnalyticsTable.tsx)
  - Mobile (Yes): 'Time asleep' metric (SparkyFitnessMobile/src/screens/SleepAnalyticsScreen.tsx:83,565-585)
- **Sleep score chart** — Sleep score for each night of the period.
  - Web (Partial): Only the table's 'Score' column and the last-night card (SparkyFitnessFrontend/src/pages/Reports/SleepAnalyticsTable.tsx; SleepSummaryCard.tsx)
  - Mobile (Yes): 'Sleep score' metric (SparkyFitnessMobile/src/screens/SleepAnalyticsScreen.tsx:91,565-585)
- **Night statistics and period averages** — Nights of 7 h or more, longest/shortest night, nights logged, and period averages.
  - Web (Partial): Per-night data in SleepAnalyticsTable (SparkyFitnessFrontend/src/pages/Reports/SleepAnalyticsTable.tsx), with no aggregates of this kind
  - Mobile (Yes): 'Nights' and 'Period averages' (SparkyFitnessMobile/src/screens/SleepAnalyticsScreen.tsx:597-610)
- **Sleep efficiency** — Time asleep as a percentage of time in bed.
  - Web (Yes): 'Sleep Efficiency' chart (SparkyFitnessFrontend/src/pages/Reports/SleepAnalyticsCharts.tsx:660-760) and the table's Efficiency column
  - Mobile (Partial): Only the average value in 'Routine'/'Period averages' (SparkyFitnessMobile/src/screens/SleepAnalyticsScreen.tsx:307,413), no chart
- **Overnight HRV** — HRV status with average, baseline, daily trend, and intra-night series.
  - Web (Yes): HRVCard with Trend / Night Series toggle and Baseline (SparkyFitnessFrontend/src/pages/Reports/HRVCard.tsx:183; SleepAnalyticsCharts.tsx:765)
  - Mobile (Partial): 'Overnight HRV' bars per night, no baseline or intra-night series (SparkyFitnessMobile/src/screens/SleepAnalyticsScreen.tsx:99,565-585)
- **Blood oxygen (SpO2)** — SpO2 trend, spot measurements, average, and minimum.
  - Web (Yes): SpO2Card 'Pulse Ox (SpO2)' with 'Spot Tests' (SparkyFitnessFrontend/src/pages/Reports/SpO2Card.tsx:131; SleepAnalyticsCharts.tsx:764)
  - Mobile (Partial): 'Blood oxygen (SpO2)' bars per night (SparkyFitnessMobile/src/screens/SleepAnalyticsScreen.tsx:115); average/min/max only per night in SleepDetail (src/components/SleepBiometrics.tsx:39-53); no spot measurements
- **Exercise report views** — Switch between exercise dashboard views.
  - Web (Yes): Three views: All / Strength & Resistance / Cardio & GPS (SparkyFitnessFrontend/src/pages/Reports/ExerciseReportsDashboard.tsx:771-810)
  - Mobile (Partial): Two views Strength / Cardio (SparkyFitnessMobile/src/screens/ExerciseStatisticsScreen.tsx:606-620)
  - Note: Mobile has no combined 'All' view.
- **Personal records in the report** — Cardio distance record badges and strength record badges (estimated 1RM, weight).
  - Web (Yes): CardioPRBadgesWidget with cardio and strength PRs (SparkyFitnessFrontend/src/components/ExerciseCharts/CardioPRBadgesWidget.tsx; ExerciseReportsDashboard.tsx:864)
  - Mobile (Partial): Separate cardio-only 'Personal records' screen, reachable from the Library or the run summary (SparkyFitnessMobile/src/screens/LibraryScreen.tsx:452; PersonalRecordsScreen.tsx; src/hooks/usePersonalRecords.ts)
- **Workout heatmap** — 12-month calendar of trained days, with previous/next navigation and highlighting of the report range.
  - Web (Yes): WorkoutHeatmap (SparkyFitnessFrontend/src/pages/Reports/WorkoutHeatmap.tsx:15-34; ExerciseReportsDashboard.tsx:871)
  - Mobile (Partial): Only the grid of trained days for recent weeks inside Training consistency (SparkyFitnessMobile/src/components/exerciseStats/TrainingConsistencyCard.tsx:180-233)
- **Sets per muscle in the range** — Working sets per primary muscle in the range, with bars and a selection that highlights the muscle on the figure.
  - Web (Partial): Sets per muscle are shown when tapping in MuscleHeatmap and in Consistency (this week vs. last week) (SparkyFitnessFrontend/src/components/ExerciseCharts/MuscleHeatmap.tsx:41-70)
  - Mobile (Yes): 'Sets per Muscle' (SparkyFitnessMobile/src/screens/ExerciseStatisticsScreen.tsx:334-395)
- **Exercise variety** — Score/count of unique exercises per muscle group.
  - Web (Yes): ExerciseVarietyScore 'Exercise Variety Score' (SparkyFitnessFrontend/src/pages/Reports/ExerciseVarietyScore.tsx; ExerciseReportsDashboard.tsx:390)
  - Mobile (Partial): Collapsible 'Exercise Variety' list with the number of exercises per muscle, no chart or score (SparkyFitnessMobile/src/screens/ExerciseStatisticsScreen.tsx:537-555)
- **Volume by muscle group** — Accumulated training volume per muscle group.
  - Web (Yes): TrainingVolumeByMuscleGroupChart (SparkyFitnessFrontend/src/components/ExerciseCharts/TrainingVolumeByMuscleGroupChart.tsx; ExerciseReportsDashboard.tsx:495)
  - Mobile (Partial): Collapsible 'Volume by Muscle' list without a chart (SparkyFitnessMobile/src/screens/ExerciseStatisticsScreen.tsx:556-572)
- **Strength PR progression and visualization** — PR progression and a card with estimated 1RM, max weight and max reps per exercise.
  - **Partly covered by PR #3008 (merged):** Each exercise's History tab on mobile now has an Effort card with two estimated 1RMs, one from reps alone and one counting the reps left by the RPE, both worked out only from sets logged with an RPE. Mobile still has no PR progression chart and no max reps figure, which web shows in Reports.
  - Web (Yes): PrProgressionChart and PrVisualizationWidget (SparkyFitnessFrontend/src/pages/Reports/PrProgressionChart.tsx; ExerciseReportsDashboard.tsx:363,558)
  - Mobile (Partial): Does not exist in SparkyFitnessMobile/src (mobile PRs are cardio-only)
  - _Verification: corrected during verification_
- **Training load** — This week's load versus the previous 4 weeks (minutes weighted by HR intensity), verdict and rest advice; summary card on the Dashboard.
  - **Partly covered by PRs #3108 and #3155 (merged):** Web Reports > Exercise now has the 'Readiness and Form' card that mobile's Exercise report also gained: fitness, fatigue and form from the same heart-rate-weighted session load, and a readiness score (form, sleep, resting heart rate, HRV) with advice on whether to train hard or rest; as on mobile, Reports > Compare can also set daily training load against another metric. Web still has no Training load card (this week against the previous four weeks, with a verdict and rest advice) and no Dashboard summary card; mobile's Dashboard card now also shows a readiness line.
  - Web (Partial): Only the acute/weekly/chronic load value reported by the device, as a daily figure in the Diary (SparkyFitnessFrontend/src/components/Health/DailyHealthMetricsCard.tsx:95-96,281-320); nothing in Reports
  - Mobile (Yes): TrainingLoadCard (SparkyFitnessMobile/src/components/exerciseStats/TrainingLoadCard.tsx:25-165; ExerciseStatisticsScreen.tsx:191-197) and TrainingLoadDashboardCard, which opens Exercise Statistics (src/components/TrainingLoadDashboardCard.tsx:36-40,100; DashboardScreen.tsx:900)
- **Cadence and elevation charts** — Cadence and elevation profile over the course of the activity.
  - **Partly covered by PRs #3014 and #3135 (merged):** The mobile cardio session screen now shows average cadence and stride length as figures when the activity has them, and its Splits table (for activities with a GPS track) gives the elevation change of each split. Mobile still has no cadence or elevation chart over the course of the activity, which web has.
  - Web (Yes): ActivityCadenceChart and ActivityElevationChart (SparkyFitnessFrontend/src/pages/Reports/ActivityReportVisualizer.tsx:674,684)
  - Mobile (Partial): Only the 'Elevation gain' figure and floors climbed, no charts or cadence (SparkyFitnessMobile/src/screens/CardioSessionScreen.tsx:96-130)
- **Laps table** — Per-lap table with time, distance, calories and totals.
  - **Partly covered by PR #3135 (merged):** The mobile cardio session screen now has a Splits table for any activity with a stored GPS track, with pace, elevation change and average heart rate for each km or mile. It is still not a laps table: laps marked during a run only show on the run summary right after it, there are no per-lap calories or totals, and activities without a GPS track get no splits.
  - Web (Yes): ActivityReportLapTable 'Laps' (SparkyFitnessFrontend/src/pages/Reports/ActivityReportLapTable.tsx; ActivityReportVisualizer.tsx:727)
  - Mobile (Partial): No laps table in CardioSessionScreen.tsx
  - _Verification: corrected during verification_
- **Detailed activity stats** — Stats grid for an activity: times, pace, elevation, weather, gear, event, course, water loss.
  - Web (Yes): ActivityStatsGrid with Moving/Elapsed Time, Avg Moving Pace, Min/Max Elev, Weather, Gear, Water Loss (SparkyFitnessFrontend/src/components/ExerciseCharts/ActivityStatsGrid.tsx; ActivityReportVisualizer.tsx:554-607)
  - Mobile (Partial): Distance, duration, pace, floors, elevation gain, average HR and calories (SparkyFitnessMobile/src/screens/CardioSessionScreen.tsx:58-160,273-285) plus a shoe picker (287) and an Edit activity button
- **Fasting trend and history** — Fasting trend chart and history table (start, end, duration, protocol, in progress).
  - Web (Yes): 'Fasting History' table (SparkyFitnessFrontend/src/pages/Reports/FastingReport.tsx:352-420) and 'Fasting Trends' LineChart (471-490)
  - Mobile (Partial): 'History' list of fasts in FastingDetailScreen (SparkyFitnessMobile/src/screens/FastingDetailScreen.tsx:317-365, FastingHistoryRow) without a trend chart
- **Symptoms report** — Episodes, days with and without symptoms, average duration, time of day, 'what came before', recent episodes, CSV export and printing for the doctor.
  - Web (Yes): Symptoms tab (SparkyFitnessFrontend/src/pages/Reports/Reports.tsx:414-419; src/pages/Symptoms/SymptomsReport.tsx)
  - Mobile (Partial): SymptomHistoryScreen with '30-Day Insights' (symptom-free days, top triggers and reliefs, ongoing episodes) reachable from SymptomsCard (SparkyFitnessMobile/src/screens/SymptomHistoryScreen.tsx:261-340; src/components/SymptomsCard.tsx:136); no CSV or printing
- **Nutrients shown in report charts and tables** — Preference for which nutrients appear in the report charts and table (per desktop/mobile).
  - Web (Yes): 'Report (Chart)' and 'Report (Tabular)' groups in Settings → Nutrient Display (SparkyFitnessFrontend/src/pages/Settings/NutrientDisplaySettings.tsx:77-86,579-586); consumed in NutritionChartsGrid.tsx:72-75
  - Mobile (Partial): Only the 'Nutrition report nutrients' picker in Customize Reports (SparkyFitnessMobile/src/screens/ReportsSettingsScreen.tsx:428-454); the mobile report_tabular group governs Nutrition Details, not reports, and report_chart is not exposed (src/screens/NutrientDisplaySettingsScreen.tsx:36-41)
- **Health Trends on the Dashboard** — Swipeable carousel of steps, weight, sleep, hydration, calories and VO2 max charts with a 7/30/90 range and a link to Reports.
  - **Updated in PR #3143 (merged):** The mobile carousel now also has a Resting Heart Rate page, shown only when there are readings. Web still has no carousel: its resting heart rate trend is in the new Heart Rate Analytics tab of Reports, and the Diary keeps its 14-day nutrition mini charts.
  - Web (Partial): The web Diary only shows the day's values in DailyHealthMetricsCard (SparkyFitnessFrontend/src/components/Health/DailyHealthMetricsCard.tsx; Diary.tsx:24)
  - Mobile (Yes): Dashboard 'healthTrends' case (SparkyFitnessMobile/src/screens/DashboardScreen.tsx:842-890) with HealthTrendsPager (src/components/HealthTrendsPager.tsx:96-117; src/constants/healthTrends.ts)
  - _Verification: corrected during verification_
- **Customize Health Trends** — Reorder and hide the charts in the Health Trends carousel.
  - Web (Partial): No equivalent exists
  - Mobile (Yes): HealthTrendsSettingsScreen with ReorderSwitchList (SparkyFitnessMobile/src/screens/HealthTrendsSettingsScreen.tsx:47-90), from Dashboard Settings (src/screens/DashboardSettingsScreen.tsx:465-466)
  - _Verification: corrected during verification_
- **VO2 max trend** — Chart of VO2 max over time.
  - **Partly covered by PR #3155 (merged):** Reports > Exercise on the web now has a Running Estimates card with one estimated VO2 max ('≈', from runs in the last 6 weeks), the same card mobile shows in Exercise Statistics; it is a single figure, not a trend. On mobile the Dashboard VO2 max trend now falls back to that run-based estimate, titled 'VO2 max (estimated)', when no VO2 max has been synced (a synced reading always replaces it); the web has no such fallback.
  - Web (Partial): Only the latest daily value in the Diary (SparkyFitnessFrontend/src/components/Health/DailyHealthMetricsCard.tsx:93,228-240); no chart in Reports
  - Mobile (Yes): Vo2MaxLineChart in Health Trends (SparkyFitnessMobile/src/components/HealthTrendsPager.tsx:117; src/hooks/useVo2MaxRange.ts with server data)
- **Daily water chart with goal line** — Daily water chart that draws each day's hydration goal.
  - Web (Partial): HydrationTrendChart only draws the water line and the 'Avg' in the header, with no goal line (SparkyFitnessFrontend/src/pages/Reports/HydrationTrendChart.tsx:66,94-98,156).
  - Mobile (Yes): HydrationBarChart with per-day goals in the Hydration report and in Health Trends (SparkyFitnessMobile/src/screens/HydrationReportScreen.tsx:215-223; src/components/HydrationBarChart.tsx:22-23,84,103; HealthTrendsPager.tsx:107).
  - _Verification: added during verification_

#### In both clients, but with iOS/Android differences (1)

- **Activity GPS route map** · _Differs iOS/Android_ — A cardio session's route drawn on a map.
  - Web (Yes): ActivityReportMap with react-leaflet (SparkyFitnessFrontend/src/pages/Reports/ActivityReportMap.tsx; ActivityReportVisualizer.tsx:463-480,598)
  - Mobile (Yes): RouteMap in CardioSessionScreen (SparkyFitnessMobile/src/screens/CardioSessionScreen.tsx:298; src/components/exerciseStats/RouteMap.tsx, RouteTileMap.tsx, RouteLine.tsx)
  - iOS/Android: iOS always draws on Apple Maps. Android only uses Google Maps if the build includes GOOGLE_MAPS_ANDROID_API_KEY (androidGoogleMapsEnabled); without a key it shows only the route line with no background map (src/utils/routeMapSupport.ts:14-21; app.config.ts:20-22,283-287,322).

<details><summary>Web ↔ mobile parity (19)</summary>

- Reports entry point and navigation
  - **Updated in PRs #3076, #3108 and #3143 (merged):** Both now have a heart rate report and Compare: web as two more tabs (Heart Rate Analytics and Compare, 11 in all) and mobile as two more hub links (Heart Rate and Compare, 9 reports that can still be reordered or hidden). The rest is unchanged: web still has Fasting, Medications, Symptoms and Table tabs that the mobile hub lacks, and mobile still has separate Hydration and Caffeine and alcohol reports.
- Daily hydration chart
- Weight chart with trend and goal projection
- Daily steps chart
- Daily mood chart
  - **Updated in PRs #3016 and #3018 (merged):** Both now plot one mood per day with the same shared rule (the average of the day's manual check-ins, else the mood synced from Garmin or imported), and neither tooltip shows notes. The web tooltip shows the mood value with its emoji and label and the day's number of check-ins; the mobile tooltip shows only the mood and the date.
- Resting heart rate during sleep
- Overnight respiration
- Key training stats
- Training consistency
- Muscle heatmap
- Recovery by muscle group
- Running trends and race time estimates
- Cardio session list
- Activity pace chart
- Activity heart rate and HR zones
  - **Updated in PRs #3078, #3143 and #3165 (merged):** Both still show the session heart rate chart and the time in each zone, and both now say how the zones were worked out when that is stored. The web session chart now colors the line by the person's zones, with a dashed line at each zone edge and a legend of their bpm ranges; the mobile chart is still a plain line.
- Fasting report: totals and daily duration
- Fasting zones/stages reached
- Fasting consistency heatmap (90 days)
- Fasting report: stats, daily duration, stages and consistency map

</details>

### 2.9 Medications, GLP-1 & symptoms

#### Web only (28)

- **Cabinet KPIs** — Tiles with counts: active prescriptions, GLP-1 medications, scheduled today and total.
  - Web (Yes): Medications.tsx:350-397 (Active scripts, GLP-1 meds, Scheduled today, Total meds).
- **Effectiveness rating (1-5 stars)** — Rate how effective a medication is.
  - Web (Yes): Advanced options in AddMedicationDialog.tsx:1203-1248; display in Medications.tsx:635-659.
- **Pill / packaging photo** — URL of a photo of the medication shown in the detail view.
  - Web (Yes): 'Pill / Label Photo URL' field in AddMedicationDialog.tsx:1251-1264; image in Medications.tsx:612-632.
- **Create custom nutrient (not listed)** — Add a free-text nutrient with its unit to the supplement.
  - Web (Yes): 'Not listed? Create your own' footer with name and unit in NutrientPicker.tsx:~420-450 (createFreeText).
- **Units per serving ('1 serving = N capsules')** — Define how many capsules/tablets make up one serving of the supplement.
  - Web (Yes): AddMedicationDialog.tsx:975-1002 (NumericInput units-per-serving).
- **'% from supplements' in nutrition reports** — In nutrition charts, shows what portion of a nutrient came from supplements.
  - Web (Yes): NutritionChartsGrid.tsx:216-260 (supplementShare, 'reports.supplementShare').
- **Custom GLP-1 drug** — Define an unlisted GLP-1 with name, half-life, time to peak, cadence and oral route.
  - Web (Yes): 'Custom GLP-1 / Other...' option with fields in AddMedicationDialog.tsx:819-927.
- **Snooze dose** — Mark a scheduled dose as snoozed.
  - **Partly covered by PR #3103 (merged):** On mobile a scheduled dose that is already logged can be switched to Snoozed in 'Edit logged dose', and snoozed entries show in the day log and the calendar. There is still no Snooze button when logging: the dose rows only log or skip, and the reminder's 'Remind in' button only shows the reminder again later, without recording the dose as snoozed.
  - Web (Yes): 'Snooze' button (status 'snoozed') in TodayMedications.tsx:371-376.
- **Note when logging a dose** — Add a comment to a scheduled or PRN dose when logging it.
  - **Partly covered by PR #3103 (merged):** On mobile a note can be added or changed after logging, in 'Edit logged dose' (opened from the day log on the Adherence screen), and the day log shows every entry's notes. Logging a scheduled or as-needed dose still has no note field, unlike the web's 'Add note...' field on each dose.
  - Web (Yes): Per-dose note field (TodayMedications.tsx:329) and 'Add note...' for PRN (461).
- **Edit logged dose** — Change the intake time, injection site or notes of an already logged dose.
  - **Updated in PR #3103 (merged):** Mobile has 'Edit logged dose', opened from the day log on the Adherence screen: it changes the time, the notes, the site of an injection and, unlike the web, the status (taken, skipped or snoozed) of a scheduled dose that is not an injection. Only the time of day can change, so a dose cannot be moved to another day as with the web's date-and-time field, and the screen's new texts are still in English in every other language the app ships.
  - Web (Yes): 'Edit logged dose' dialog (TodayMedications.tsx:1342-1398).
- **Adherence statistics** — KPIs 'Doses today', 14-day adherence, perfect days, adherence ring, 14-day strip and streak.
  - **Updated in PR #3103 (merged):** Mobile now shows the same adherence overview on a new Adherence screen, opened from 'Adherence & log' in the Medications list: doses today, 14-day adherence, perfect days, the ring, the last-14-days bars and the streak, computed with the same shared code as the web. Its new texts are still in English in every other language the app ships.
  - Web (Yes): TodayMedications.tsx:824-841 (tiles) and 927-1001 ('Adherence overview', ring, 'Last 14 days', '{{count}}-day streak').
- **Medication log calendar** — Monthly calendar with daily status (all taken, partial, skipped, snoozed, PRN), filter by medication/supplement, and side-effect symptoms.
  - **Updated in PR #3103 (merged):** Mobile has the month calendar on the Adherence screen, built on the same shared rules as the web: days coloured as all taken, partially taken, mostly skipped, all skipped or snoozed only, a count badge on days with more than one dose, side-effect and general symptom dots, a filter for all items or one medication, and the month's dose total; tapping a day selects it. The per-day counts and symptom names the web shows on hover are only in the screen-reader label on mobile, and the calendar's texts are still in English in every other language the app ships.
  - Web (Yes): MedicationLogCalendar.tsx (mounted in TodayMedications.tsx:1191-1196; statuses and tooltips 'All doses taken', 'Partially taken', 'Snoozed only', 'Side-effect symptom').
- **Customize injection sites** — Enable/disable and reorder the available injection sites.
  - Web (Yes): 'Customize sites' dialog (InjectionSiteSettings.tsx:95-172; button in Glp1LogInjection.tsx:101).
- **Log injection from the daily checklist** — Tapping 'Take' on an injectable GLP-1 dose asks for the site and creates a real injection (deducting from the pen); 'next injection' banner with 'Log shot'.
  - Web (Yes): TodayMedications.tsx:84-87,611-660 (logic), 861-909 ('Log shot' banner), Glp1QuickLogDialog.tsx:45-56 ('Where did you inject?').
  - Note: On mobile, an injection with a site can only be logged from the GLP-1 tracker.
- **Fasting timer for oral GLP-1** — 'Tablet taken' timer with a water-only instruction for oral GLP-1s.
  - Web (Yes): FastingTimer.tsx ('Oral GLP-1 fasting timer', 'Tablet taken — start timer', 'Water only'), mounted in Glp1Coach.tsx:81.
- **Medication report: KPIs and charts** — Reports > Medications with average adherence, number of GLP-1 injections, side effects, Nausea vs dose, Weight vs goal, Adherence trend and GLP-1 Check-in charts, and a daily log table.
  - Web (Yes): MedicationReports.tsx:469-951 (KPIs 590-635, charts 651-951) and MedicationLogTable.tsx (789); tab in ReportsControls.tsx:66-67 and Reports.tsx:393.
- **Side-effect correlation cards** — Hydration vs constipation, Protein vs nausea, Sleep vs fatigue and Dose size vs nausea.
  - Web (Yes): MedicationReports.tsx:976-1290 (hydration_constipation_card, protein_nausea_card, sleep_fatigue_card, dose_nausea_card).
- **Customize Medication report charts** — Choose which charts/cards are shown, saved on the server.
  - Web (Yes): 'Customize Charts' in MedicationReports.tsx:484-575; preferences via useMedicationDisplayPreferences (src/hooks/useMedicationDisplayPreferences.ts).
- **Printable prescriber report and CSV export** — Print/save a PDF with active medications, titration, injections and symptoms, and download a CSV.
  - Web (Yes): MedicationReports.tsx:1304-1580 ('Print / Save PDF Report', 'Download CSV Data', 'Prescriber Medication Report').
- **Bowel log (Bristol scale)** — Select type T1-T7 on the Bristol scale.
  - Web (Yes): SymptomLogForm.tsx:795-819.
- **Link symptom as a medication side effect** — Associate the entry with a medication as a possible side effect.
  - Web (Yes): 'Possible side effect of' in SymptomLogForm.tsx:821-854.
- **Custom symptom fields** — Define and fill in custom fields (number, text, yes/no, select, multi-select) per symptom.
  - Web (Yes): Logging in SymptomLogForm.tsx:856-939; 'Your own fields' definition in SymptomDefinitionEditor.tsx:250-362.
- **Symptom calendar with doses, 'Side-Effect Insights' and GI sub-tracker** — In Medications > Symptoms: symptom activity overlaid on doses, correlations with dosing, and nausea/vomiting/reflux per week and average Bristol.
  - Web (Yes): SymptomHistoryCalendar.tsx:203-466 ('GI sub-tracker', 'Side-Effect Insights & Hints'), used with variant='medications' in SymptomsHub.tsx:223-229.
- **Manage option lists ('Choices')** — Show/hide built-in options and add/remove custom options (locations, qualities, triggers...).
  - Web (Yes): 'Choices' tab in ManageSymptomsDialog.tsx:89-137,219.
- **Symptom report (Reports > Symptoms)** — KPIs, filter by symptom, recent episodes with context (sleep, previous day's food, water), 'What came before' and a time-of-day chart.
  - Web (Yes): SymptomsReport.tsx:225-640 (KPIs 225-248, filter 258-266, episodes 326-414, 'What came before' 493-560, 'Time of day' 565-596); tab in ReportsControls.tsx:71-72.
- **Export symptoms (CSV / print for the doctor)** — Download a CSV or print the symptom report.
  - Web (Yes): 'Export CSV' and 'Print for a doctor' in SymptomsReport.tsx:285-295.
- **Manage another person's medications/symptoms (family access)** — Delegates with can_manage_medications / can_manage_symptoms permissions act on behalf of the owner.
  - Web (Yes): Permissions in FamilyAccessManager.tsx:56-57,88-89,110; delegate navigation in MainLayout.tsx:283-298,357-370; SymptomsPanel.tsx checks the permission.
- **'Medications' category in the chat tool selector** — Enable or restrict the medication tools Sparky can use in chat.
  - Web (Yes): ChatToolCategoriesSelector.tsx:28 ('medications' category).
  - Note: Only the selector is compared; the server tools were not reviewed.

#### Mobile only (13)

- **Activate / deactivate medication** — Mark a medication as inactive without deleting it.
  - Mobile (Yes): 'Active' switch in MedicationFormScreen.tsx:1142-1150 (sent at 688 and 739); inactive items are grouped in MedicationsListScreen.tsx:215-239.
- **Scan supplement barcode to autofill** — Look up the product (NIH DSLD or Open Food Facts) by barcode and fill in nutrients.
  - Mobile (Yes): 'Scan barcode to fill in' button (MedicationFormScreen.tsx:957-981) that opens FoodScan in capture-barcode mode and processes the code (391-428, useSupplementLookup).
- **Scan 'Supplement Facts' label (photo)** · _Differs iOS/Android_ — Take or choose a photo of the label to read the nutrients automatically.
  - Mobile (Yes): 'Scan label to fill in' with 'Take photo'/'Choose photo' (MedicationFormScreen.tsx:276-389,983-1002); useSupplementLabelScan.ts:23 first tries scanSupplementLabelOnDevice (services/onDeviceSupplementScan.ts:177) and otherwise falls back to server AI.
  - iOS/Android: On iOS, Apple's on-device model is tried first (modules/on-device-nutrition only has an ios/ folder, FoundationModels iOS 27+ with Apple Intelligence, 'Scan Labels On Device' setting); on Android server AI is always used.
- **Edit existing schedule** — Modify an already created schedule rule.
  - Mobile (Yes): Tapping a schedule opens MedicationScheduleForm with scheduleId (MedicationDetailScreen.tsx:426-432); title 'Edit Schedule' (MedicationScheduleFormScreen.tsx:500).
- **Pause / resume a schedule** — Deactivate a schedule rule without deleting it.
  - Mobile (Yes): 'Active' switch in MedicationScheduleFormScreen.tsx:950-955; the detail view marks the schedule as 'Inactive' (MedicationDetailScreen.tsx:418-421).
- **'Medications' card on the Dashboard** — Card on the home screen with the day's scheduled and PRN doses and quick access to logging.
  - Mobile (Yes): DashboardScreen.tsx:815-817 (MedicationsCard); visibility configurable in DashboardSettingsScreen.tsx:109-113,171,207.
- **Medication reminders (local notifications)** — Notifications scheduled at each dose time, reconciled in the foreground and background.
  - Mobile (Yes): MedicationReminderReconciler mounted in App.tsx:1321 (src/components/MedicationReminderReconciler.tsx); reconcileMedicationReminders in src/services/medicationReminderService.ts:103; also in the background task backgroundSyncService.ts:356.
  - Note: Schedules without a time do not generate a reminder (MedicationScheduleFormScreen.tsx:816-817).
- **Medication reminder settings** — Enable reminders, repeat every 10 min up to 3 times, hide medication names, and consolidate simultaneous reminders.
  - **Updated in PR #3005 (merged):** The Medications section of Settings > Notifications also has 'Remind In' (10, 15, 30 or 60 minutes, 30 by default), shown while medication reminders are on; it sets how long the reminders' 'Remind in' button waits before showing the reminder again. Its texts are translated in 6 of the 15 other languages the app ships (Spanish, Polish, Brazilian Portuguese, Simplified and Traditional Chinese, and Cantonese), and the web still has no medication reminder settings.
  - Mobile (Yes): Settings > Notifications, 'Medications' section (src/screens/NotificationSettingsScreen.tsx:299-380: 'Medication Reminders', 'Repeat Reminders', 'Hide Medication Names', 'Consolidate Reminders').
- **Actions from the notification** — 'Log as taken' / 'Skip' buttons on each reminder and 'Log all as taken' / 'Skip all' on the grouped one, without opening the app.
  - **Updated in PRs #2985 and #3005 (merged):** Each reminder and the grouped one also have a 'Remind in' button (for example 'Remind in 30m') that shows the reminder again after the interval set in Settings, without logging the dose; its label is translated in 6 of the 15 other languages the app ships. On Android a background task handles the buttons when the app is in the background or closed, and on both platforms a dose logged or skipped from a reminder that cannot reach the server is saved and retried later.
  - Mobile (Yes): Categories in src/services/notifications.ts:102-140; handling in src/services/medicationNotificationHandler.ts:17-31,73-132.
- **Exact alarm permission for reminders** · _Android only_ — One-time prompt to grant 'Alarms & reminders' so that reminders fire on time.
  - Mobile (Yes): MedicationReminderReconciler.tsx:84-92 calls maybePromptForExactAlarmPermission (services/notifications.ts:336-348) via ExactAlarmBridge (targets/android-exact-alarm).
  - iOS/Android: Android only (ExactAlarmBridge.isAvailable is false on iOS).
- **'Medications' page on Apple Watch** · _iOS only_ — View today's scheduled and PRN doses on the watch and mark/unmark them with a tap.
  - **Updated in PR #3052 (merged):** Wear OS now has a Medications page: today's scheduled and as-needed doses with a taken count, where a tap marks a dose taken or not taken (sent to the phone at once or queued until it is reachable), and it follows the page order and hidden pages set on the phone. Unlike the Apple Watch page, it shows no sync status or retry, shows a skipped dose like a pending one, and before the first sync says nothing is scheduled instead of asking you to open the phone app. On both watches, skipping and logging an as-needed dose more than once stay on the phone.
  - Mobile (Yes): targets/watch/Presentation/MedicationsView.swift:12; page registered in src/constants/watchPages.ts:13,36; data and taps in src/hooks/useWatchCheckInBridge.ts:529 (medicationsForWatch) and 1319 (handleMedicationTaken); order/visibility in WatchSettingsScreen.
  - iOS/Android: iOS only with a paired Apple Watch; there is no Wear OS equivalent (watch-connectivity returns null on Android, modules/watch-connectivity/index.ts:1032).
  - Note: Skipping and repeating PRN doses cannot be done from the watch.
- **'Symptoms' card on the Dashboard** — Active episode, the day's entries, mark a symptom-free day, '+ Log' and 7-day trend with peak severity.
  - Mobile (Yes): src/components/SymptomsCard.tsx:133-335 (active banner 158-191, entries 194-239, 'Mark Free' / '+ Log' 260-290, '7-Day Trend' 293-335); visibility in DashboardSettingsScreen.tsx:115-119.
- **'Is the episode still active?' reminder** — Local notification 24 h after an open episode starts, with 'End now' / 'Still ongoing' buttons.
  - Mobile (Partial): It is scheduled when an episode is logged (useSymptoms.ts:271-326; services/symptomReminderService.ts:47-90) and the category with buttons is registered at startup (useAppStartup.ts:81; symptomReminderService.ts:17-38), but there is no listener that handles those actions and there is no dedicated setting.
  - Note: The notification buttons appear but do not perform any action.

#### In both, with differences (24)

- **Medical notice / disclaimer** — Notice that the app does not give medical advice and that reminders are not medical alerts.
  - Web (Yes): Mandatory MedicationDisclaimer acceptance screen while no medications or symptoms are logged (Medications.tsx:184-194; MedicationDisclaimer.tsx:74-88, 'Reminders Are Not Medical Alerts' block).
  - Mobile (Partial): Only a MedicalDisclaimer footnote (src/components/MedicalDisclaimer.tsx) at the bottom of MedicationsListScreen.tsx:265 and Glp1TrackerScreen.tsx:108; there is no acceptance screen.
  - Note: Web blocks access until accepted; mobile only informs.
- **Prescription (Rx) number** — Save and view the medication's prescription number.
  - Web (Yes): 'Rx number' field in AddMedicationDialog.tsx:1163-1176; display in Medications.tsx:596-608.
  - Mobile (Partial): Only shown if present (MedicationDetailScreen.tsx:507-514); MedicationFormScreen.tsx has no rx_number field.
  - Note: On mobile it is read-only (value created on web).
- **List of the day's logged intakes** — The day's history with the time and status of each intake, with an undo option.
  - **Updated in PR #3103 (merged):** Mobile has a day log on the Adherence screen ('Logged today', or 'Logged on {date}' for another day) that lists every scheduled, as-needed and injection entry of the day with its time, status, site and notes, with pencil and trash buttons to edit or delete it, like the web's 'Logged today' card. Delete asks for confirmation first, and the card's new texts are still in English in every other language the app ships.
  - Web (Yes): 'Logged today' card with Taken/PRN/Snoozed/Skipped, edit and undo (TodayMedications.tsx:1201-1308).
  - Mobile (Partial): Only in each medication's detail view and only for PRN intakes: list with time and a delete button (MedicationDetailScreen.tsx:315-350); scheduled ones are undone with the DoseRow toggle.
  - Note: Mobile has no aggregated view of all the day's intakes.
- **Log GLP-1 injection** — Log an injection with site, dose (mg), date/time, pen/vial deduction and notes.
  - **Partly covered by PR #3103 (merged):** The mobile log card has no time field: an injection logged for today takes the current time and one for a past day 12:00. The exact time can be set afterwards from the day log in Medications > 'Adherence & log', where the pencil on the entry opens 'Edit logged dose'.
  - Web (Yes): Glp1LogInjection.tsx:82-200 (dose 110-122, date and time datetime 124-131, 'Deduct from pen/vial' 136-160, notes 169-176).
  - Mobile (Partial): Glp1LogInjectionCard.tsx:167-266 (site, dose, pen, date with CalendarSheet 234-239, notes); the time cannot be chosen: today uses 'now' and past days use 12:00 (120-123).
  - Note: Mobile does not allow setting the exact injection time.
- **Recent injections** — Injection history with editing (dose, date/time, site, notes) and deletion.
  - **Partly covered by PR #3103 (merged):** The 'Recent injections' card in the mobile GLP-1 tracker still only lists and deletes. Injections also appear in the day log of Medications > 'Adherence & log', where the pencil opens 'Edit logged dose' to change their time, site and notes; the dose and the date can only be edited on the web.
  - Web (Yes): Glp1RecentInjections.tsx:93-237 (list, 'Edit injection' 172-237, delete 152).
  - Mobile (Partial): Glp1RecentInjectionsCard.tsx: list and 'Delete injection' with confirmation; no editing.
  - Note: Mobile only allows viewing and deleting.
- **Form adapted to the symptom template** — The sections asked depend on the symptom type/template (resolveSections).
  - Web (Yes): SymptomLogForm.tsx conditions each section on choice.sections.* (550-963); map based on template (248).
  - Mobile (Partial): SymptomLogScreen.tsx always shows the same fixed sections; the head map is only chosen if the name contains 'head'/'migraine' (343-347).
- **Create new symptom from the form** — Add a symptom that does not exist yet while logging.
  - Web (Yes): 'New symptom' creates a definition (SymptomLogForm.tsx:461-547).
  - Mobile (Partial): 'Or type custom symptom...' field (SymptomLogScreen.tsx:436-444) logs a free-text name without creating a definition (symptom_id undefined).
- **'Log again' shortcuts** — Chips for pinned and recent symptoms to log with one tap.
  - Web (Yes): SymptomsHub.tsx:90-97,186-209 (pinned + recentSymptomNames, max. 6).
  - Mobile (Partial): The form shows all definitions and built-in templates as chips (SymptomLogScreen.tsx:371-433), without prioritizing recent ones.
- **Severity scales** — Rate on 1-10, 1-5, none-severe, count ('how many times') or text only.
  - Web (Yes): SeverityControl.tsx:32-58 (text, count, none-severe and numeric scales).
  - Mobile (Partial): SeveritySlider.tsx:42-101 supports 1-5, none-severe and 1-10; 'count' and 'text' fall back to the 1-10 slider.
- **Episode vs quick log, and start/end** — Quick or episode mode, start via shortcuts or exact date-time, 'still ongoing' and end date.
  - Web (Yes): Quick log/Episode toggle (SymptomLogForm.tsx:493-518), shortcuts and 'Pick…' datetime (370-412), 'Still ongoing' and 'Ended' datetime (429-447).
  - Mobile (Partial): 'Track as ongoing episode' switch and Now/-15m/-1h/-3h shortcuts (SymptomLogScreen.tsx:448-498); no date-time picker or end time, only 'End Episode Now' (500-511).
- **Qualities, associated symptoms and triggers** — Chips for how it feels, other symptoms and possible triggers.
  - Web (Yes): SymptomLogForm.tsx:636-740 (add/remove custom options, grouped triggers and 'Not sure').
  - Mobile (Partial): SymptomLogScreen.tsx:540-644 with built-in options only (BUILT_IN_OPTIONS), without groups or custom options.
- **Symptom phases (prodrome, aura, etc.)** — Log options per episode phase.
  - Web (Yes): SymptomLogForm.tsx:603-634 (SYMPTOM_PHASES).
  - Mobile (Partial): They cannot be entered; they are only shown in the detail view if they exist (SymptomEpisodeDetailScreen.tsx:163).
  - Note: Read-only on mobile.
- **Treatments and relief ('did it help?')** — Log medications or relief methods taken and their effectiveness.
  - Web (Yes): TreatmentsEditor.tsx:30-160: add a medication from the cabinet, relief chips (built-in and custom) and 'Helped/Partly/Didn't help' (SymptomLogForm.tsx:742-761).
  - Mobile (Partial): TreatmentsSection.tsx: free-text name with relief/medication type and Helped/Partly/Didn't help/Unsure effectiveness (SymptomLogScreen.tsx:647-657); not linked to cabinet medications.
- **Symptom photos** — Attach, view and delete photos on a symptom entry.
  - Web (Yes): 'Photos' section in SymptomLogForm.tsx:961-1010; thumbnails in EpisodeDetailDialog.tsx:~190-200.
  - Mobile (Partial): Only shows '{{count}} photos attached' (SymptomEpisodeDetailScreen.tsx:220-226); the uploadPhoto hook exists in useSymptoms.ts but no screen uses it.
  - Note: Photos cannot be uploaded or viewed on mobile.
- **Add a severity reading to an episode** — Log how severity evolves during an ongoing episode.
  - **Updated in PRs #3031 and #3073 (merged):** On web, Update severity now also asks for the effect on the day and saves it with the reading when the episode or its symptom uses it. Mobile still has no dedicated reading action: a new severity or effect is saved only through a full edit of the episode, which the server adds to its severity and effect timelines.
  - Web (Yes): 'Update severity' / 'Save reading' in EpisodeActions.tsx:64-90.
  - Mobile (Partial): The addSeverity hook exists (useSymptoms.ts) but no screen calls it.
  - _Verification: corrected during verification_
- **Add relief to an ongoing episode** — Quick action to log treatments during the episode.
  - Web (Yes): 'Add relief' in EpisodeActions.tsx:102-147.
  - Mobile (Partial): There is no quick action; you have to open the entry (SymptomsCard.tsx:158-166 → SymptomLog) and edit the treatments section (SymptomLogScreen.tsx:647-657).
- **End episode** — Close an episode, recording when it ended and what helped.
  - Web (Yes): 'End episode' with time shortcuts, date-time, and 'Did anything help?' (EpisodeActions.tsx:162-252).
  - Mobile (Partial): 'End Episode Now' with the current time only (SymptomLogScreen.tsx:247,500-511).
- **30-day symptom summary** — Symptom-free days (%), top triggers, and most effective reliefs.
  - Web (Partial): The card does not exist; similar data appears in Reports > Symptoms (KPIs and 'What came before', SymptomsReport.tsx:225-248,493-560).
  - Mobile (Yes): '30-Day Insights' card in SymptomHistoryScreen.tsx:69-118,255-330.
- **Manage symptoms (definitions list)** — Create, edit, pin, hide, delete, and restore symptoms.
  - Web (Yes): ManageSymptomsDialog.tsx:216-355 (new, pin/unpin, edit, hide, delete, 'Hidden' and 'Show again'), opened with 'Manage' in SymptomsHub.tsx:126-134.
  - Mobile (Partial): ManageSymptomsScreen.tsx:26-145: create and edit custom symptoms; built-in templates are informational only; no hide or delete (the mobile API has no delete for definitions). Accessed from the gear icon in SymptomHistoryScreen.tsx:139-148.
- **Choose what to ask when logging** — Turn the form sections on/off for each symptom.
  - Web (Yes): 'What to ask when logging' in SymptomDefinitionEditor.tsx:231-248.
  - Mobile (Partial): SymptomDefinitionEditorScreen.tsx has no section selection.
  - _Verification: corrected during verification_
- **Pen/vial beyond-use date (BUD)** — Calculate and show the 'beyond-use' date (28 days after opening) of a GLP-1 pen or vial, with 'BUD Warning' and 'Expired (BUD)' alerts.
  - Web (Yes): Glp1InventoryManager.tsx:73-76 (calculatedBudDate = opened + 28), 151 (bud_date), 203,317-339 (badges 'BUD {{bud_date}}', 'Expired (BUD)', 'BUD Warning'), 538-548 ('Calculated Beyond-Use Date (BUD)', 'Based on 28-day stability window').
  - Mobile (Partial): Glp1PenFormScreen.tsx:142 silently calculates and saves bud_date when 'Opened' is set, but neither the form nor Glp1InventoryCard.tsx (68,99: only penExpiryStatus from expiry_date) shows or warns about the BUD.
  - Note: The mobile expiry warning is based only on expiry_date.
  - _Verification: added during verification_
- **GLP-1 serum level chart: Dates/Days axis and tooltip** — Modeled pharmacokinetic curve with an axis toggle (dates or days), a tooltip, and injection markers with an icon.
  - Web (Yes): Glp1Coach.tsx:37 (axisMode), 104-131 ('Dates' / 'Days' buttons), 159-225 (AreaChart with Tooltip 182 and ReferenceLine with Syringe 199-213).
  - Mobile (Partial): Glp1SerumCard.tsx:27-90: simple SVG line with dose marks and '~{{percent}}% now', with no axis toggle, no axis labels, and no tooltip.
  - _Verification: added during verification_
- **GLP-1 modeled level chart: Dates/Days axis and tooltip** — In the modeled serum level chart, the X axis can be toggled between dates and days since the dose, and hovering shows the day's %; injections are marked with a syringe icon.
  - Web (Yes): Glp1Coach.tsx:104-133 ('Dates'/'Days' buttons, axisMode), 170-193 (XAxis and Tooltip with 'Day {{day}}'), 195-222 (ReferenceLine with Syringe).
  - Mobile (Partial): Glp1SerumCard.tsx:62-127 draws a static SVG line with dashed dose marks and '~{{percent}}% now'; there is no axis toggle, axes, tooltip, or interaction (mounted in Glp1TrackerScreen.tsx:78).
  - Note: The rest of the GLP-1 tracker (check-in, inventory, titration) was not compared in this pass.
  - _Verification: added during verification_
- **Filter symptom history by symptom** — An 'All' chip plus one per defined symptom to filter the history's list of logs.
  - Web (Partial): SymptomHistoryList.tsx ('Recent symptoms' list in SymptomsHub) has no filter; only Reports > Symptoms has a symptom selector (SymptomsReport.tsx:258-266).
  - Mobile (Yes): Row of chips: 'All' plus the definitions, with setSelectedSymptomFilter in SymptomHistoryScreen.tsx:165-208; it also opens pre-filtered from the history button in SymptomLogScreen.tsx:318-328 (symptomId).
  - _Verification: added during verification_

<details><summary>Web ↔ mobile parity (33)</summary>

- Access to the Medications section
- Medications list / cabinet
- All / Medications / Supplements filter
  - **Updated in PR #3103 (merged):** On mobile the All / Meds / Supplements filter also appears on the Adherence screen, where it narrows the dose cards, checklist, adherence numbers, calendar and day log, as on the web. The list and the Adherence screen each have their own filter, shown only when there is a supplement and not kept between visits, while the web shows it even without supplements and remembers one choice for the whole page.
- Medication detail view
- Add / edit medication (basic fields)
- Delete medication
- Create supplement / supplement type
- Supplement nutrients per serving
- Nutrients from supplements taken, in the diary
- Mark as GLP-1 and choose drug (PK profile)
- Create dosing schedule
- Delete schedule
- Scheduled doses checklist (Take / Skip / Undo)
  - **Updated in PR #3103 (merged):** Mobile now has an adherence screen, opened from the medications list, with a checklist progress card and separate Today's medications and Today's supplements cards that use the same log, skip and undo rows; it can also show another day picked on its calendar. The Dashboard card is still a single list.
- Log an 'as needed' (PRN) intake
- Log doses on other days
  - **Updated in PR #3103 (merged):** The mobile Adherence screen has its own day, apart from the Diary date: it opens on today, and tapping a day in its month calendar moves the dose cards, checklist, adherence numbers and day log to that date, where doses can be logged, with a 'Back to today' link. There are no previous and next day arrows like the web's day navigator, and the Dashboard card, the medication detail and the GLP-1 tracker still follow the Diary/Dashboard date.
- Access to the GLP-1 panel (coach / tracker)
- Injection site body map with rotation
- Modeled level (pharmacokinetic curve)
- Pen / vial inventory
- Dose titration plan
- GLP-1 daily check-in
- Access to symptom tracking
- Log symptom (basic form)
- Location on body / head map
- Effect on the day
- Mark symptom-free day
- Ongoing episodes
- Episode / log detail
- Episode severity chart
  - **Updated in PRs #3031 and #3073 (merged):** The web episode chart now adds an effect-on-your-day band under the severity curve, one colour per level from the time it was recorded, with a legend. The mobile chart has no such band and the episode detail shows only the current effect as a label. An effect changed in a mobile edit is still recorded and appears in the web band.
- Edit and delete a symptom log
- Symptom history
- Monthly symptom calendar
- Symptom definition editor

</details>

### 2.10 Menstrual cycle, fertility & pregnancy

#### Web only (32)

- **Beta version notice** — 'Initial Beta Release' banner inviting users to report bugs on GitHub.
  - Web (Yes): SparkyFitnessFrontend/src/pages/Cycle/CyclePage.tsx:48-62
- **Quick adjustment of cycle and period length from the hub** — Pencil button on the 'Cycle length' card that opens a dialog to adjust the typical cycle and period length.
  - Web (Yes): pages/Cycle/CycleToday.tsx:203-216 (button) and 556-619 (dialog with upsertSettings).
- **'How are predictions calculated?' guide** — Collapsible section that explains, using the user's dates, how the next period, ovulation, follicular phase, and fertile window are calculated.
  - Web (Yes): pages/Cycle/CycleToday.tsx:291-465
- **Current phase tip (dismissible)** — Card with a tip based on the phase (rest, iron, energy, fertile window, PMS...) that can be dismissed.
  - Web (Partial): pages/Cycle/CycleToday.tsx:522-545 (insightKey and useDismissPromptMutation) and 711-726 (texts).
  - _Verification: corrected during verification_
- **Water, sleep, and weight summary in the daily log** — Read-only row with the water consumed, hours of sleep, and weight for the selected day.
  - Web (Yes): pages/Cycle/DailyLogPanel.tsx:209-238 (useWaterIntakeQuery, useSleepEntriesQuery, useLatestCheckInMeasurements).
- **Menstrual product counter** — +/- counters per product (pad, tampon, cup, panty liner, period underwear, disc) with the '+ more products' option. It feeds the volume estimate and the purchase forecast.
  - Web (Yes): pages/Cycle/DailyLogPanel.tsx:269-276 and 484-552.
- **Customize menstrual products** — Dialog to show or hide the predefined products, add custom products with a capacity in ml, and delete them.
  - Web (Yes): pages/Cycle/DailyLogPanel.tsx:277-483, with useUpsertDisplayPreferencesMutation('products').
- **Customize the symptom list** — Dialog to show or hide symptoms, create custom symptoms, and delete them.
  - Web (Yes): pages/Cycle/CycleSymptomPicker.tsx:179-319 (useCreateCustomSymptomMutation, useDeleteCustomSymptomMutation, display preferences 'symptoms').
- **Energy level (1-5)** — Slider for the day's energy, used in the correlations.
  - Web (Yes): pages/Cycle/DailyLogPanel.tsx:600-616
- **BBT status card** — If the BBT measurement does not exist, offers to create it with one click so it can be logged in Check-in. If the latest reading is old, warns that temperature confirmation is paused.
  - Web (Yes): pages/Cycle/ttc/BbtStatusCard.tsx:28-86, shown in standard and TTC modes (CycleToday.tsx:501-504).
- **Edit periods by painting days on the calendar** — 'Edit Periods' mode: days are marked or unmarked as period on the calendar and saved in bulk.
  - Web (Yes): pages/Cycle/CycleCalendar.tsx:100-160 (useBulkUpsert) and 327-355 (Edit Periods, Cancel and Save buttons).
- **Edit an existing cycle** — Change the start date, length and exclusion of an already logged cycle.
  - Web (Yes): pages/Cycle/CycleHistoryList.tsx:85-100 (updateMutation) and 365-427 ('Edit Cycle Record' dialog).
- **Insights unlock after 2 complete cycles** — Locks the advanced charts until 2 complete cycles are logged and shows the progress.
  - Web (Yes): pages/Cycle/CycleInsights.tsx:145-166 ('Insights Locked', 'Progress: n/2 cycles').
- **Cycle regularity chart** — Bars with the length of each cycle compared to the average.
  - Web (Yes): pages/Cycle/CycleInsights.tsx:169-229 (BarChart).
- **Product usage and purchase forecast** — Average flow volume, average products per period, estimated annual spend and units needed for the next period.
  - Web (Yes): pages/Cycle/CycleInsights.tsx:295-378
- **Symptom frequency by phase (heatmap)** — Matrix of symptoms by phase (menstrual, fertile, ovulation, luteal).
  - Web (Yes): pages/Cycle/CycleInsights.tsx:380-470
- **Hormone fluctuation simulation** — Typical estrogen, progesterone, LH and FSH curves over a 28-day cycle. Shows a flat-curve notice when hormonal contraception is used.
  - Web (Yes): pages/Cycle/CycleInsights.tsx:473-570
- **Conception probability** — Percentage probability of conception for the day with a color band (high, medium, low...).
  - Web (Yes): pages/Cycle/ttc/FertilityCard.tsx:62-84
- **Fertile window chart** — Chart with the daily conception probability around ovulation.
  - Web (Yes): pages/Cycle/ttc/FertileWindowChart.tsx:1-129, in CycleToday.tsx:517 (TTC mode).
- **Kick counter** — Fetal movement counting sessions with a target of 10, a tap button and a history of recent sessions.
  - Web (Yes): pages/Cycle/pregnancy/KickCounter.tsx:15-165, in the 'Kick counter' tile of PregnancyToday.tsx:51-57,195-200.
- **Contraction timer** — Time contractions with a summary of the last hour (count, interval, duration) and a 5-1-1 pattern alert.
  - Web (Yes): pages/Cycle/pregnancy/ContractionTimer.tsx:75-181 (5-1-1 on line 88), in PregnancyToday.tsx:201-203.
- **Quick log for prenatal vitamins** — Buttons to mark the linked prenatal medication or supplement as taken today.
  - Web (Yes): pages/Cycle/pregnancy/VitalsCard.tsx:170-248 (create/delete medication entry).
- **Blood pressure during pregnancy** — Log systolic/diastolic blood pressure (mmHg) as a custom measurement.
  - Web (Yes): pages/Cycle/pregnancy/VitalsCard.tsx:105-135 and 363-420.
- **Medical appointments** — Add appointments with date and time, type, title and location; list and delete them.
  - Web (Yes): pages/Cycle/care/AppointmentsPanel.tsx:44-152, in CareHub.tsx:23 (Care tab).
- **Printable report for the doctor** — Summary with average cycle and period length, regularity, and cycles analyzed, printable from the browser.
  - Web (Yes): pages/Cycle/care/DoctorReport.tsx:23-88 (window.print). Shown in modes other than pregnancy (CareHub.tsx:25).
- **Health article library** — Educational articles filtered by mode, read in a dialog.
  - Web (Yes): pages/Cycle/care/ArticleLibrary.tsx:80-131 (articlesForMode).
- **Birth plan and hospital bag** — Printable birth plan questions and hospital bag checklist. Saved in the browser's localStorage.
  - Web (Yes): pages/Cycle/care/BirthPrep.tsx:9-127 (localStorage) and CareHub.tsx:25 (pregnancy only).
  - Note: Because it is stored in localStorage, this data is not synced across devices or browsers.
- **'Cycle' badge in the general symptom history** — In the Symptoms module history, entries logged from the cycle carry the 'Cycle' label.
  - Web (Yes): pages/Symptoms/SymptomHistoryList.tsx:92-96 (entry.source === 'cycle').
- **Cycle phase in the symptom report CSV export** — The Reports > Symptoms CSV includes the cycle_phase column for each episode. Entries with source 'cycle' are excluded from the report.
  - Web (Yes): pages/Symptoms/SymptomsReport.tsx:204 (cycle_phase) and 114,125 (filter source !== 'cycle').
- **Cycle insights in pregnancy mode** — View cycle history charts and insights with the tracker in pregnancy mode.
  - Web (Yes): CyclePage.tsx:64-90: the Log, Insights and Care tabs are shown in all modes. Insights renders CycleInsights in pregnancy too.
  - _Verification: added during verification_
- **'Manual' or 'Auto' and 'Excluded' labels in cycle history** — Each cycle in the history indicates whether it was logged manually or derived from logs, and whether it is excluded from statistics.
  - Web (Yes): CycleHistoryList.tsx:276-285 ('Manual' or 'Auto' and 'Excluded').
  - _Verification: added during verification_
- **Ovulation estimate source and irregular cycle warning (TTC)** — The fertility card explains what the ovulation estimate is based on (BBT, LH or calendar) and warns if the cycle is irregular.
  - Web (Yes): ttc/FertilityCard.tsx:85-133: text 'Ovulation is estimated on X based on <basis>' and 'Irregular Cycle Detected'.
  - _Verification: added during verification_

#### Mobile only (8)

- **Cycle/pregnancy card on the Dashboard** — Summary card on the home screen. It shows the cycle ring with the phase, day, and next period or days late. In pregnancy it shows the week and day, baby size with a womb scene, and days until the estimated due date (EDD). In discreet mode it shows only 'Day N'. When not set up, it offers to start o…
  - Mobile (Yes): src/components/CycleCard.tsx:174-396. Rendered in src/screens/DashboardScreen.tsx:810-812. Visibility toggle in src/screens/DashboardSettingsScreen.tsx:170,204-206.
- **Symptom forecast for the coming days** — List of the coming days with the expected symptoms based on history.
  - Mobile (Yes): src/components/wellness/CycleInsightsView.tsx:76-94 (flattened) and 260-292 ('Symptom Forecast').
- **Edit the pregnancy / due date** — Modify the due date, its calculation basis or the number of babies of an existing pregnancy.
  - Mobile (Yes): Pencil icon in WeekBanner (src/components/wellness/pregnancy/WeekBanner.tsx:70-80) that opens PregnancySetup with the current pregnancy (PregnancyOverviewView.tsx:109-113). Title 'Edit Pregnancy' and updatePregnancy in PregnancySetupScreen.tsx:54-90.
- **Daily pregnancy log (symptoms and notes)** — Per-date form to log pregnancy-specific symptoms, weight and notes.
  - Mobile (Yes): src/components/wellness/pregnancy/PregnancyLogView.tsx:31-91 uses CycleTodayView in pregnancy mode: weight, pregnancy symptoms (CycleSymptomPicker.tsx:155-172) and notes, from CycleLogModal (CycleLogModalScreen.tsx:99-108).
- **Sync basal body temperature from Apple Health / Health Connect** — Imports BBT from the phone's health system into the 'basal_body_temperature' measurement, which the server uses in cycle predictions.
  - Mobile (Yes): basalBodyTemperature metric in src/HealthMetrics.ts:187-199, with no platform restriction, and in src/utils/autoHealthSyncCategories.ts:83. In HealthKit: HKQuantityTypeIdentifierBasalBodyTemperature (src/services/healthkit/index.ts:168,271).
- **Sync reproductive data from the system (menstruation, ovulation test, cervical mucus, intermenstrual bleeding)** · _Differs iOS/Android_ — Toggles in the 'Reproductive' category of health sync. The data is uploaded as generic health data; the cycle hub does not use it.
  - Mobile (Partial): 'Reproductive' metrics in src/HealthMetrics.ts:521-587 (Android) and 651-717 (iOS). The server does not use these types for the cycle: cycleRepository and cycleService only read basal_body_temperature.
  - iOS/Android: iOS offers menstruationFlow, menstruationPeriod, ovulationTest, cervicalMucus and intermenstrualBleeding. It uploads the raw value for flow, ovulation test, mucus and bleeding (src/services/healthkit/dataTransformation.ts:407-420). menstruationPeriod has no HealthKit identifier in index.ts, so it reads nothing. Android offers menstruationPeriod, ovulationTest, cervicalMucus and intermenstrualBleeding (not menstruati…
- **Due date calculated from ultrasound** — 'Ultrasound scan' option as the basis for calculating the due date, in addition to last period, conception date and manual due date.
  - Mobile (Yes): BASIS_OPTIONS includes { value: 'scan', label 'Ultrasound scan' } (PregnancyDueDateForm.tsx:10-19,141-170). Used in onboarding (CycleOnboardingScreen.tsx:357-367) and in PregnancySetupScreen (create and edit).
  - _Verification: added during verification_
- **Cycle calendar and history in pregnancy mode** — Access to the monthly calendar and the cycle list with pregnancy mode active.
  - Mobile (Yes): The hub's History tab is available in all modes (CycleHubScreen.tsx:172-182) and shows CycleCalendarGrid and CycleHistoryList (262-277).
  - _Verification: added during verification_

#### In both, with differences (20)

- **'Log Cycle / Log Pregnancy Entry' shortcut in the Add menu** — Row in the central Add menu that directly opens the day's log modal. The label depends on the mode and on discreet mode.
  - Web (Partial): AddComp/MainLayout has no cycle entry.
  - Mobile (Yes): SparkyFitnessMobile/App.tsx:359-364 (label) and 1283-1285. src/components/AddSheet.tsx:435-442. src/hooks/useAddSheetActions.ts:332-333 navigates to CycleLogModal.
  - _Verification: corrected during verification_
- **Mode selection in onboarding** — Choose the tracker mode during setup: standard, trying to conceive (TTC), pregnancy, postpartum, or menopause.
  - Web (Partial): It offers only 3 modes: standard, ttc and pregnant (pages/Cycle/CycleOnboarding.tsx:48 and 197-290). Postpartum and menopause can only be chosen later, in Settings (pages/Settings/CycleSettings.tsx:263-266).
  - Mobile (Yes): MODE_OPTIONS with all 5 modes (src/screens/CycleOnboardingScreen.tsx:41-47,325-343). For postpartum and menopause, step 2 shows 'No configuration needed' (lines 368-380).
- **Estimated due date within onboarding (pregnancy mode)** — When pregnancy mode is chosen, the onboarding itself asks for the basis for calculating the EDD and creates the pregnancy record.
  - Web (Partial): Step 2 always asks for the last period date and the durations, and seeds period days even in pregnancy mode (CycleOnboarding.tsx:70-100). Pregnancy is set up later, in a separate step, when PregnancyToday shows PregnancySetup (pregnancy/PregnancyToday.tsx:115-117).
  - Mobile (Yes): src/screens/CycleOnboardingScreen.tsx:357-367 (PregnancyDueDateForm) and 187-200,222-243 (validation and createPregnancyAsync/updatePregnancyAsync).
- **Navigate by day to view or log any date** — Change the selected day to see predictions and edit that day's log.
  - Web (Yes): DayNavigator in pages/Cycle/CycleToday.tsx:161-164. The calendar shares the selected day with the log panel (lines 285-289).
  - Mobile (Partial): The hub is pinned to today: selectedDate is constant (src/screens/CycleHubScreen.tsx:57). For another date you have to open the log modal and change it with CalendarSheet (CycleLogModalScreen.tsx:89-96,152-156) or tap a day on the calendar in History (CycleHubScreen.tsx:264-268). Predictions and alerts are only shown for today.
- **Prediction and statistics KPI cards** — Next period, ovulation, cycle length, average cycle with standard deviation, average period with regularity, and prediction confidence.
  - Web (Yes): pages/Cycle/CycleToday.tsx:179-257: six StatCard components with server data (stats.cycleLengthSd, stats.regularity, prediction.confidence).
  - Mobile (Partial): Only the 'Cycle Summary' card in Trends, with average cycle, average period, and 'Regularity' (src/components/wellness/CycleInsightsView.tsx:105-145). Regularity is a fixed value, 'Regular' or 'Set', that is not calculated (lines 59-63). There is no standard deviation or confidence. The averages are calculated on the client (src/hooks/useCyclePredictionData.ts).
- **List of upcoming predicted cycles** — Predicted dates of the next period and ovulation for the following cycles.
  - Web (Partial): Only the next cycle (prediction.cycles[0]) in the 'Next period' and 'Ovulation' cards (CycleToday.tsx:121,180-195).
  - Mobile (Yes): 'Next Predictions' with 2 cycles (the next one and the one after) and period and ovulation tiles (src/components/wellness/CycleInsightsView.tsx:148-215).
- **Cycle alerts (late, upcoming period, ovulation today)** — Contextual notices: period N days late, period expected today, period in 3 days or less, ovulation expected today.
  - Web (Partial): There is only a late-period banner (CycleToday.tsx:271-282) and the late or 'period in N days' text in the center of the ring (lines 151-157). It does not warn about ovulation today or an imminent period. buildCycleAlerts is not used on web.
  - Mobile (Yes): src/components/wellness/CycleAlerts.tsx, fed by buildCycleAlerts (shared/src/cycle/predictions.ts:711-760) in src/screens/CycleHubScreen.tsx:121-131,231-241. Localized texts in src/utils/cycleLocalization.ts:49-110. The Dashboard card also shows the lateness (CycleCard.tsx, periodLate).
- **Cycle symptom picker** — Mark the day's symptoms. They are saved as symptom entries with source='cycle' and feed the insights.
  - Web (Yes): pages/Cycle/CycleSymptomPicker.tsx:46-391: predefined and custom symptoms, plus a 'Severity for new symptoms' control (lines 56 and 373).
  - Mobile (Partial): src/components/wellness/CycleSymptomPicker.tsx:155-243: predefined symptoms only, a short list with 'see all', and a different list in pregnancy. Severity is fixed at 3 (CycleTodayView.tsx:296-303). There are no custom symptoms.
- **Basal body temperature (BBT) logging** — Enter the day's basal body temperature, which confirms ovulation in the predictions.
  - Web (Partial): The cycle panel has no BBT field. Temperature is logged as the custom measurement 'basal_body_temperature' in Check-in (comment in DailyLogPanel.tsx:553-554). BbtStatusCard only creates that category (ttc/BbtStatusCard.tsx:41-63).
  - Mobile (Yes): 'Basal Temperature' field in src/components/wellness/CycleTodayView.tsx:536-559, saved with upsertBbt (src/services/api/cycleApi.ts:212-250), which creates the category if missing. Hidden during pregnancy.
- **Exclude or include a cycle in statistics** — Toggle is_excluded on an already logged cycle.
  - Web (Yes): pages/Cycle/CycleHistoryList.tsx:127-138 (handleToggleExclude), with a button in the row (line ~299).
  - Mobile (Partial): It can only be set when creating a manual cycle (src/components/wellness/CycleHistoryList.tsx:127-131). It cannot be changed afterwards.
- **Cervical position** — Log the position of the cervix.
  - Web (Yes): pages/Cycle/ttc/CervicalPositionPicker.tsx:14-129: three axes (height, firmness, opening). In DailyLogPanel.tsx:587-592, TTC only.
  - Mobile (Partial): Only height (low, medium, high) with BottomSheetPicker (src/components/wellness/CycleTodayView.tsx:65-70 and 511-533, TTC only). Firmness and opening are missing.
- **Two-week wait (TWW / DPO)** — Tracking of the days past ovulation with information about the implantation window and when to take a test.
  - Web (Yes): pages/Cycle/ttc/TwoWeekWait.tsx:19-178: DPO, implantation window notice (6-12 DPO), countdown to 10 DPO, 'Log Positive/Negative HPT' buttons and a congratulations state after a positive. Replaces FertilityCard when dpo >= 0 (CycleToday.tsx:509-515).
  - Mobile (Partial): Inside FertilityCard only 'N days past ovulation' and the test accuracy tip appear (src/components/wellness/ttc/FertilityCard.tsx:136-160). There is no implantation window, HPT buttons or congratulations.
- **Week-by-week baby growth** — Size compared to a fruit, length and weight, notes about the baby and the mother's body, and browsing of other weeks.
  - Web (Yes): pages/Cycle/pregnancy/BabyGrowthView.tsx:26-204: previous/next week, slider, 'Jump to this week', 'Your baby' and 'Your body' blocks, and the 'Growth across pregnancy' chart. Also the 'Baby this week' card in PregnancyToday.tsx:131-161.
  - Mobile (Partial): src/components/wellness/pregnancy/BabyGrowthView.tsx:1-124: only the current week, with scene, 'Size of', length, weight and 'For you' (lines 66-113). Other weeks cannot be browsed and there is no chart.
- **Maternal weight during pregnancy** — Log weight and view its progress against the recommended gain range.
  - Web (Yes): pages/Cycle/pregnancy/VitalsCard.tsx:250-360: latest weight, 'kg since start', IOM range by week and a within/below/above indicator.
  - Mobile (Partial): Only a weight field in the pregnancy log, saved as a check-in with unit conversion (src/components/wellness/CycleTodayView.tsx:385-410 and 310-317). Does not show the delta or the IOM range.
- **Luteal phase length** — Days after ovulation, used to calculate ovulation.
  - Web (Partial): Field locked at 14 (pages/Settings/CycleSettings.tsx:390-404, Input disabled). handleSave always sends luteal_phase_length: 14 (line 116), so it overwrites a different value set from mobile.
  - Mobile (Yes): Editable StepperInput in src/screens/CycleSettingsScreen.tsx:445-458 (lutealLengthProps).
  - Note: Inconsistency risk: saving on web resets the luteal phase configured on mobile to 14.
- **Discreet mode** — Neutral labels and icons ('Wellness') so reproductive data is not revealed on screen.
  - Web (Partial): Only changes the navigation tab's label and icon (layouts/MainLayout.tsx:127-132,241-246; setting in CycleSettings.tsx:465-485). The hub content does not change.
  - Mobile (Yes): Fail-closed hook (src/hooks/useDiscreetMode.ts: active while loading or on error). Neutral phase names (src/utils/cycleDisplayUtils.ts), hub title (CycleHubScreen.tsx:137-141), Settings title (CycleSettingsScreen.tsx:311), modal (CycleLogModalScreen.tsx:47), Dashboard card 'Day N' (CycleCard.tsx), Settings row (SettingsScreen.tsx:339-347), AddSheet (App.tsx:360), WeekBanner and BabyGrowthView. Toggle in CycleSetting…
- **Permanent access to the cycle and pregnancy hub** — Fixed navigation path to open the hub (logging, trends, history and pregnancy tools) without depending on an optional card.
  - Web (Yes): 'Cycle', 'Pregnancy' or 'Wellness' tab in the desktop navigation bar (MainLayout.tsx:238-247) and entry in the '+' menu on narrow screens (MainLayout.tsx:124-133), visible while tracking is enabled.
  - Mobile (Partial): The only navigation to CycleHub is the Dashboard card (CycleCard.tsx:367). AddSheet only opens CycleLogModal (useAddSheetActions.ts:332-333) and Settings opens CycleSettings (SettingsScreen.tsx:348). If the card is hidden in DashboardSettingsScreen (204-206), there is no route left to the hub, its Trends, History or Tools.
  - _Verification: added during verification_
- **Fertility card outside TTC mode** — 'Fertility' card with estimated ovulation, fertile window notice, days until the next period and days past ovulation, in standard, postpartum and menopause modes.
  - Web (Partial): Outside TTC there are only the 'Next period' and 'Ovulation' StatCards (CycleToday.tsx:179-195). FertilityCard and TwoWeekWait render only with isTtc (CycleToday.tsx:507-520).
  - Mobile (Yes): CycleLogModalScreen.tsx:124-135 shows FertilityCard for the selected date in modes that are neither pregnancy nor TTC. The content is in ttc/FertilityCard.tsx:93-165 (badge 'Est. fertile window', 'Next period in', 'Two-week wait').
  - _Verification: added during verification_
- **Entry points to the cycle/pregnancy hub** — Where the main cycle/pregnancy section is opened from.
  - Web (Yes): Route /cycle (App.tsx:434-435). Navigation tab on desktop when cycleSettings.enabled (MainLayout.tsx:237-247) and entry in the narrow-viewport '+' menu (MainLayout.tsx:114-133).
  - Mobile (Partial): CycleHub only opens from the Dashboard CycleCard (CycleCard.tsx:367) or right after onboarding (CycleOnboardingScreen.tsx:260). There is no tab, deep link (linking in App.tsx:439-457 without CycleHub) or link from Settings: the 'Cycle & Pregnancy' row opens CycleSettings (SettingsScreen.tsx:348). The AddSheet opens the logging modal, not the hub. If the Dashboard card is hidden (DashboardSettingsScreen.tsx:204-206),…
  - Note: UX risk on mobile: the hub depends on a Dashboard card that the user can hide.
  - _Verification: added during verification_
- **Due date calculation basis and number of babies in pregnancy setup** — Options for estimating the due date when creating or editing the pregnancy.
  - Web (Partial): PregnancySetup.tsx:77-81: 3 bases (Last period, Due date, Conception). Babies 1, 2 or 3 with buttons (PregnancySetup.tsx:120-130).
  - Mobile (Yes): PregnancyDueDateForm.tsx:11-27: 4 bases (manual, scan/ultrasound, lmp, conception). Number of babies with StepperInput in PregnancySetupScreen.tsx:113-125. Onboarding sets fetus_count: 1 (CycleOnboardingScreen.tsx:226-231).
  - _Verification: added during verification_

#### In both clients, but with iOS/Android differences (1)

- **Saving the daily log** · _Differs iOS/Android_ — How the data entered in the day's log is saved.
  - Web (Yes): Autosave with a 400 ms debounce and a 'Saved' indicator (pages/Cycle/DailyLogPanel.tsx:98-108,200-206).
  - Mobile (Yes): Explicit save in the CycleLogModal modal: Save button in the header or in FooterSaveBar (src/screens/CycleLogModalScreen.tsx:53-67,143-150). handleSave validates the numbers before writing (CycleTodayView.tsx:226-339).
  - iOS/Android: On iOS with native headers (iOS earlier than 26, or 26+ with Liquid Glass enabled) Save goes in the native bar (placement 'native-only'). On Android, and on iOS 26+ with Liquid Glass disabled, the fixed bottom bar FooterSaveBar is used (useNativeIOSHeadersActive in src/services/nativeTabBarPreference.ts:23-27). On Android the modal applies the top inset (CycleLogModalScreen.tsx:74).
  - Note: The modal title ('Log Daily Entry', 'Log Fertility & Test', etc.) is hardcoded in English without i18n (CycleLogModalScreen.tsx:46-51).

<details><summary>Web ↔ mobile parity (34)</summary>

- Access to the Cycle/Pregnancy hub
- Medical disclaimer in the footer
- Initial setup wizard (onboarding)
- Health profile in onboarding (contraception and conditions)
- Visual cycle ring
- Menstrual flow logging
- Cervical mucus logging
- Daily notes
- Monthly cycle calendar
- Cycle history list
- Manually log a previous period or cycle
- Delete a cycle
- Clinical alerts / patterns to watch
- Basal body temperature (BBT) curve
- Per-phase correlation cards and condition alerts
- Fertility summary (estimated ovulation and fertile window)
- Quick log for ovulation (OPK) and pregnancy (HPT) tests
- Intercourse and protection log
- Postpartum and menopause modes
- Set up pregnancy (due date)
- Gestational week banner
- Womb illustration by week
- Weekly pregnancy checklist
- Bump photo journal
- Food and medication safety search
- Enable or disable cycle and pregnancy tracking
- Tracker mode in Settings
- Birth control method in Settings
- Average cycle and period length (override)
- Health conditions in Settings
- Show fertile window predictions
- Terminology (default / gender-neutral)
- Export cycle data (JSON)
- Reset and redo onboarding

</details>

<details><summary>Discarded after verification: exists in neither client (1)</summary>

- Switch to pregnancy mode after a positive test — The 'Start Pregnancy Mode' button only shows the toast 'coming soon in Phase 4' and does not change the mode (pages/Cycle/ttc/TwoWeekWait.tsx:55-63 and 87-95).

</details>

### 2.11 AI chat (SparkyChat) & AI settings

#### Web only (34)

- **Draggable floating chatbot button** — Floating launcher (animated GIF) that can be dragged around the screen, snaps to the nearest left/right edge, and opens/closes the chat panel. Hidden while the panel is open.
  - Web (Yes): SparkyFitnessFrontend/src/components/DraggableChatbotButton.tsx:25-399 (snapToEdge 125-153, drag 156-180, toggleChat 237-252, hidden if the chat is open 304-306); mounted globally in SparkyFitnessFrontend/src/App.tsx:212-222
- **Minimize/restore the floating button** — Shrinks the launcher to a small tab stuck to the edge (with a pulsing dot) and restores it with a tap. On desktop there is an X on hover; at mobile width it minimizes when dragged very close to the edge.
  - Web (Yes): SparkyFitnessFrontend/src/components/DraggableChatbotButton.tsx:131-147 (auto-minimize on mobile), 262-267 (handleMinimize), 312-341 (minimized tab), 366-385 (X on desktop only), 237-247 (restore)
- **Remember launcher position** — The button's vertical position, chosen edge and minimized state are saved in localStorage (key chatbot_button_state) and restored on reload, adjusting when the window is resized.
  - Web (Yes): SparkyFitnessFrontend/src/components/DraggableChatbotButton.tsx:14, 29-55, 97-111, 150, 244, 266
- **Minimize/expand the chat panel** — Collapses the panel to a compact 56 px bar and expands it again without losing the conversation or in-progress streaming (the UI stays mounted).
  - Web (Yes): SparkyFitnessFrontend/src/pages/Chat/SparkyChat.tsx:34, 90-96, 160-176, 191-197
- **AI provider selector within the chat** — Dropdown in the chat header (if more than one service is active) to change the active provider/model. Saves active_ai_service_id and resets the thread.
  - Web (Yes): SparkyFitnessFrontend/src/pages/Chat/SparkyChat.tsx:57-64 (handleServiceSwitch), 118-142
- **Images in history messages** — Older user messages with images show the images again as attachments (thumbnail and enlarged view).
  - **Updated in PR #3068 (merged):** Mobile now keeps the photos in earlier user messages and shows them as thumbnails that open in an enlarged view, as on web.
  - Web (Yes): SparkyFitnessFrontend/src/pages/Chat/SparkyChatInterface.tsx:75-86 (rebuilds attachments from image parts); src/components/attachment.tsx (UserMessageAttachments)
- **Copy code blocks** — Header on code blocks showing the language and a copy button.
  - Web (Yes): SparkyFitnessFrontend/src/components/markdown-text.tsx:31-48 (CodeHeader with copyToClipboard)
- **View the model's reasoning** — Collapsible "Reasoning (duration)" block that shows the reasoning of models that emit it. It opens automatically while it streams in.
  - Web (Yes): SparkyFitnessFrontend/src/components/thread.tsx:397 (Reasoning in MessagePrimitive.Parts); src/components/reasoning.tsx:150-160, 230-250
  - _Verification: corrected during verification_
- **Attach images to the message** — "+" button and drag-and-drop zone for attaching images. Thumbnails with an enlarged preview in a dialog and a remove button; images are resized on the client before being sent. Enables the vision tools (food photo, label).
  - **Updated in PR #3068 (merged):** Mobile now has it on iOS and Android: the + button in the composer lets you take a photo or choose from the library, up to 5 photos per message, resized on the phone before sending and shown as thumbnails with a preview and a remove button. An attached photo loads the vision tools, as on web. Only web has drag-and-drop.
  - Web (Yes): SparkyFitnessFrontend/src/components/thread.tsx:210-215, 232 (AttachmentDropzone, ComposerAttachments, ComposerAddAttachment); src/components/attachment.tsx:87-110 (preview dialog), 180-195 (remove), 223-241 (add); src/pages/Chat/SparkyChatInterface.tsx:116-136 (resizeImageBase64)
- **Interactive photo estimate card in the chat** — When a food photo is analyzed in the chat (sparky_analyze_food_image), a card appears with overall confidence, editable name, meal slot, date, macro totals, ingredients (editable grams, delete, "✓ Matched" badge), save mode, "Open in Meal Builder" and "Log to Diary".
  - **Partly covered by PR #3068 (merged):** The mobile chat can now send a food photo, so Sparky can run the photo analysis from mobile too, but the result shows in the generic tool card (the tool name and, when expanded, the raw result data) instead of the interactive card. Mobile has no editing of the name, meal, date or ingredients, no save mode and no Open in Meal Builder or Log to Diary buttons; to log the plate on mobile you ask Sparky in a follow-up message.
  - Web (Yes): SparkyFitnessFrontend/src/components/thread.tsx:401; src/components/ai/FoodPhotoEstimateToolUI.tsx:386-404 (analyzing), 411-450 (header and confidence), 460-540 (name, slot, date, macros), 580-650 (SET_GRAMS/REMOVE_ROW rows), 659-730 (modes), 747-781 (Meal Builder / log)
- **Edit a sent message** — Edit the text of one's own already-sent message and resend it (Cancel/Update), which creates a new branch of the conversation.
  - Web (Yes): SparkyFitnessFrontend/src/components/thread.tsx:109-111, 497-542 (ActionBarPrimitive.Edit, EditComposer)
- **Navigate between message versions (branches)** — Previous/next "N / M" picker for stepping through a message's versions after regenerating or editing it.
  - Web (Yes): SparkyFitnessFrontend/src/components/thread.tsx:414, 489-492, 544-573 (BranchPickerPrimitive)
- **Export message as Markdown** — "More" (…) menu on assistant messages with the "Export as Markdown" option.
  - Web (Yes): SparkyFitnessFrontend/src/components/thread.tsx:445-466 (ActionBarPrimitive.ExportMarkdown)
- **Token usage statistics** — Advanced option that shows the tokens for each response (input/output/total/cache) and the session total next to the composer. It is enabled with the "Show token stats" toggle in the AI settings and is stored only in the browser (localStorage).
  - Web (Yes): SparkyFitnessFrontend/src/components/thread.tsx:98, 301-381, 416; toggle in src/components/ai/UserChatPreferences.tsx:108-122; src/contexts/ChatbotVisibilityContext.tsx:13, 46-52
- **Chatbot tool category selector** — Popover in the composer ("Choose chatbot tools") to limit the chatbot's tool domains: 9 categories (Food & Water, Exercise, Body & Check-ins, Goals, Reports, Coaching, Vision, Profile & Habits, Medications), Full/Core presets, "Clear all" and a counter when the selection is partial. It is stored pe…
  - Web (Yes): SparkyFitnessFrontend/src/components/ai/ChatToolCategoriesSelector.tsx:19-29, 47-141; src/contexts/ChatToolCategoriesContext.tsx:23 (STORAGE_KEY 'chat_tool_categories'); src/components/thread.tsx:233; src/pages/Chat/SparkyChatInterface.tsx:144
- **Add a personal AI provider** — Form to add one's own AI service: name and type (OpenAI, OpenAI-compatible, Anthropic, Google, Mistral, Groq, Ollama, OpenRouter, xAI, Perplexity, Meta, Custom).
  - Web (Yes): SparkyFitnessFrontend/src/pages/Settings/AIServiceSettings.tsx:237-314, 647-689; src/components/ai/ServiceForm.tsx:98-141; src/utils/aiServiceUtils.ts:6-31
- **Provider API key and custom URL** — API key field (optional for Ollama, OpenAI-compatible and Custom; when editing, leave it empty to keep the current one) and base URL field for self-hosted servers.
  - Web (Yes): SparkyFitnessFrontend/src/components/ai/ServiceForm.tsx:146-186; src/utils/aiServiceUtils.ts:37-40 (requiresApiKey); src/pages/Settings/AIServiceSettings.tsx:366-368
- **Choose a model (recommended or custom)** — Model dropdown by provider type, with the first one marked as recommended, and a "Use custom model" toggle for typing a free-form model name.
  - Web (Yes): SparkyFitnessFrontend/src/components/ai/ServiceForm.tsx:262-317 (incl. recommendedModel 297, custom_model_name_input 310); src/utils/aiServiceUtils.ts:47-132
- **Chat tool profile (Full/Core)** — For self-hosted providers (Ollama, OpenAI-compatible, Custom): choose the full tool profile or the reduced "Core" one, with warnings about Ollama's context and the Full profile.
  - Web (Yes): SparkyFitnessFrontend/src/components/ai/ServiceForm.tsx:189-255
- **Mark provider as audio-capable** — "Supports audio input" toggle that allows the service to be used as a voice transcription model (or a warning if the provider type does not support it).
  - Web (Yes): SparkyFitnessFrontend/src/components/ai/ServiceForm.tsx:319-342
- **Custom system prompt** — Text field for a service-specific custom system prompt, which is then shown in the service list.
  - Web (Yes): SparkyFitnessFrontend/src/components/ai/ServiceForm.tsx:344-354; src/components/ai/UserServiceListItem.tsx:175-181
- **Test provider connection** — "Test Connection" button that checks the configuration and model live, with the result (success or error) shown beside it.
  - Web (Yes): SparkyFitnessFrontend/src/components/ai/ServiceForm.tsx:380-422; src/hooks/AI/useTestAIServiceConnection.ts; src/pages/Settings/AIServiceSettings.tsx:677-686, 830-841
- **Edit and delete own providers** — Edit one's own service inline (pencil) and delete it with a confirmation dialog. Global services show as "Managed by admin".
  - Web (Yes): SparkyFitnessFrontend/src/pages/Settings/AIServiceSettings.tsx:316-461, 556-616, 870-892; src/components/ai/UserServiceListItem.tsx:138-169
- **Enable/disable providers** — Per-service toggle to enable or disable it (several can be active). For other users' or global services, it changes the active service preference.
  - Web (Yes): SparkyFitnessFrontend/src/pages/Settings/AIServiceSettings.tsx:463-554; src/components/ai/UserServiceListItem.tsx:122-131; src/components/ai/ServiceForm.tsx:357-369 (is_active)
  - _Verification: corrected during verification_
- **List of configured/available services** — List of AI services with "Global", "Active" and "Managed by admin" badges, URL and system prompt. If per-user configuration is disabled, it is titled "Available services" and an empty state appears.
  - Web (Yes): SparkyFitnessFrontend/src/pages/Settings/AIServiceSettings.tsx:701-866; src/components/ai/UserServiceListItem.tsx:106-181
- **Separate vision configuration** — Choose a different service for vision tasks (photos, labels) or "Same as Chat configuration".
  - Web (Yes): SparkyFitnessFrontend/src/pages/Settings/AIServiceSettings.tsx:78-83, 754-800
- **Use or override the global configuration** — Banner showing the global service in use, with "Override global settings" (creates one's own "(My Override)" copy) or "Use global settings" (deletes one's own services, with confirmation). If the admin disables per-user configuration, an amber notice is shown.
  - Web (Yes): SparkyFitnessFrontend/src/components/ai/GlobalOverrideBanner.tsx:25-84; src/pages/Settings/AIServiceSettings.tsx:131-235, 637-644, 894-916
- **Automatic history clearing preference** — "Auto clear history" selector (Never / Each session / After 7 days / All) with the "Save chat preferences" button.
  - Web (Partial): SparkyFitnessFrontend/src/components/ai/UserChatPreferences.tsx:61-69, 124-168; used in src/pages/Settings/AIServiceSettings.tsx:620-626
  - _Verification: corrected during verification_
- **"AI Assisted Unit Conversions" toggle** — Enables or disables AI-assisted unit conversions (ai_assisted_conversions preference). It only appears if AI is allowed and there is an active service.
  - Web (Yes): SparkyFitnessFrontend/src/components/ai/UserChatPreferences.tsx:38-54, 71-106
- **Encryption key warning ("Invalid key length")** — Warning tooltip in the AI Service section: if "Invalid key length" appears, the server's encryption key must be 64 hex characters.
  - Web (Yes): SparkyFitnessFrontend/src/pages/Settings/SettingsPage.tsx:431-452
- **Admin: global AI providers** — The administrator creates, edits, deletes and tests global AI services (is_public) available to all users.
  - Web (Yes): SparkyFitnessFrontend/src/pages/Admin/GlobalAISettings.tsx:405-520 (incl. testConnection 436, 465); src/pages/Admin/Admin.tsx:5, 13; src/hooks/AI/useGlobalAIServiceSettings.ts
- **Admin: allow per-user AI configuration** — Global allow_user_ai_config toggle that allows or prevents users from configuring their own providers.
  - Web (Yes): SparkyFitnessFrontend/src/pages/Admin/GlobalAISettings.tsx:108-130, 312-326
- **Admin: allow AI on private network** — allow_private_network_ai toggle that allows providers on private network addresses (e.g. local Ollama).
  - Web (Yes): SparkyFitnessFrontend/src/pages/Admin/GlobalAISettings.tsx:333-358
- **Admin: default global vision service** — “Global vision AI service” selector (default_vision_ai_service_id) for users on the global configuration, or “None”.
  - Web (Yes): SparkyFitnessFrontend/src/pages/Admin/GlobalAISettings.tsx:364-403

#### Mobile only (11)

- **“Ask Sparky…” card on the Dashboard** — Dashboard card that opens the chat. It can be shown/hidden and reordered from Dashboard Settings (subtitle “Show the Ask Sparky chat launcher on the Dashboard”).
  - Mobile (Yes): SparkyFitnessMobile/src/screens/DashboardScreen.tsx:580-592 (navigate('Chat')); src/constants/dashboardCards.ts:5, 29-30, 68-71; src/stores/appPreferencesStore.ts:58, 89, 406 (askSparkyVisible)
- **“Ask Sparky” entry in the add (+) sheet** — Secondary “Ask Sparky” row in the quick-actions bottom sheet that navigates to the chat screen.
  - Mobile (Yes): SparkyFitnessMobile/src/components/AddSheet.tsx:464-468; src/hooks/useAddSheetActions.ts:328-330 (navigateFromSheet('Chat'))
- **“Start chatting” CTA in What's New** — Slide on the What's New screen that introduces the chat with a mockup and a button to open it.
  - Mobile (Yes): SparkyFitnessMobile/src/screens/WhatsNewScreen.tsx:645-658 (cta onPress navigate('Chat'))
- **“No AI provider / no server” state in the chat** — What the user sees if there is no active AI provider. Web hides the launcher and the panel entirely. Mobile lets the screen open and shows a message (“No active AI provider. Configure one in the web app first.” or “No active server config…”).
  - Mobile (Yes): SparkyFitnessMobile/src/screens/ChatScreen.tsx:1136-1150 (chat.noServer / chat.noProvider)
- **Copy own message** — Copy button below the user's messages.
  - Mobile (Yes): SparkyFitnessMobile/src/screens/ChatScreen.tsx:307-329 (MessagePrimitive.If user → ActionBarPrimitive.Copy)
- **“Scan Labels On Device” toggle (Apple Intelligence)** · _iOS only_ — On the mobile AI screen: “On-device (Apple Intelligence)” section with a toggle to read labels on the device itself, falling back to the server provider if it fails. If unavailable, it shows “Not available on this device. It needs iOS 27 or later…”.
  - Mobile (Yes): SparkyFitnessMobile/src/screens/AiSettingsScreen.tsx:61-67, 118-151; src/stores/appPreferencesStore.ts:94, 414 (onDeviceLabelScanEnabled)
  - iOS/Android: The native module only exists on iOS (modules/on-device-nutrition/expo-module.config.json platforms:['ios']; index.ts:52-58 returns null outside iOS). On Android the AI screen only shows the text “Not available on this device”.
- **On-device nutrition label reading** · _iOS only_ — Reads the nutrition facts table with the Apple Intelligence model (iOS 27+). Validates that the result is plausible (ranges, Atwater consistency) and, if it is not, falls back to the server. Notifies with “Label read on this iPhone” or “Label read by the server AI”.
  - Mobile (Yes): SparkyFitnessMobile/modules/on-device-nutrition/index.ts:44-50 (isAvailable, scanLabel); modules/on-device-nutrition/ios/OnDeviceNutritionModule.swift; src/services/onDeviceLabelScan.ts:15-70; src/screens/FoodScanScreen.tsx:576-620
  - iOS/Android: iOS 27+ only, with Apple Intelligence enabled; on Android the server is always used.
- **Reading source and “Read again” with the other engine** · _Differs iOS/Android_ — Banner on the form created from a label that indicates who read it (this iPhone or the server AI) and offers to repeat the reading with the other engine (“Read again with the server AI / on this iPhone”).
  - Mobile (Yes): SparkyFitnessMobile/src/components/LabelScanSourceBanner.tsx:15-62; src/hooks/useRetryLabelScan.ts:30-75; src/screens/foodForm/CreateFoodMode.tsx:547, 571
  - iOS/Android: The retry only appears when on-device reading is available (useRetryLabelScan.ts:44-50). On Android the source is always 'server', so at most the source label is shown, without “Read again”.
- **Supplement label scanning (Supplement Facts)** · _Differs iOS/Android_ — In the medication/supplement form, the Supplement Facts label is photographed. The on-device model is tried first and, failing that, the server vision; the server converts the ingredients into nutrients.
  - Mobile (Yes): SparkyFitnessMobile/src/hooks/useSupplementLabelScan.ts:20-31; src/services/onDeviceSupplementScan.ts:181-184; src/services/api/medicationsApi.ts (/api/v2/medications/supplement-label/scan and /map); src/screens/MedicationFormScreen.tsx:181, 306, 986-993
  - iOS/Android: iOS 27+ with Apple Intelligence reads it on-device first (OnDeviceNutrition.scanSupplementLabel); Android always uses the server vision.
- **Introduction to photo estimation** — “Estimate nutrition from a photo” screen with tips (add the weight, a short description, review before saving) and the “Log manually instead” option. It is shown the first time and afterwards from the “How photo estimation works” button.
  - Mobile (Yes): SparkyFitnessMobile/src/screens/FoodPhotoIntroScreen.tsx:84-145; src/services/foodPhotoIntro.ts:6, 20; src/screens/FoodScanScreen.tsx:698-707, 1302-1312
- **Confirmation and locking when clearing chat history** — Both clients can clear the entire history. Mobile asks for confirmation before clearing (“Clear chat – This permanently deletes your Sparky chat history. This cannot be undone.” with Cancel/Clear), disables the trash button while a response is in progress (so the server-side save does not bring the…
  - Mobile (Yes): SparkyFitnessMobile/src/screens/ChatScreen.tsx:1049-1090 (Alert.alert with Cancel/destructive Clear, chat.clearFailed toast), 1092-1110 (trash icon with disabled: running).
  - _Verification: added during verification_

#### In both, with differences (12)

- **Regenerate/retry response** — Regenerates an assistant response. Web: "Refresh" on any assistant message (on older ones it appears on hover). Mobile: "Retry" only on the last response.
  - Web (Yes): SparkyFitnessFrontend/src/components/thread.tsx:422-444 (ActionBarPrimitive.Reload, autohide='not-last')
  - Mobile (Partial): Only on the last message: SparkyFitnessMobile/src/screens/ChatScreen.tsx:272-283 (MessagePrimitive.If last → ActionBarPrimitive.Reload)
- **Jump to the end of the conversation** — Web: floating "Scroll to bottom" button. Mobile: no button; the list follows the stream only if the user is already at the bottom (40 px threshold) and re-anchors when a new response starts.
  - Web (Yes): SparkyFitnessFrontend/src/components/thread.tsx:97, 116-129 (ThreadPrimitive.ScrollToBottom)
  - Mobile (Partial): Auto-scroll only, no button: SparkyFitnessMobile/src/screens/ChatScreen.tsx:105, 836-905 (pinnedToBottomRef, handleScroll, scrollToBottomIfPinned)
- **Refresh app data after chat actions** — When the assistant logs something, the rest of the app updates. Web invalidates the diary/nutrition/check-in and chat queries at the end of each response. Mobile has no onFinish: it only invalidates the run program after sparky_manage_run_program; the other screens rely on their own refetch.
  - Web (Yes): SparkyFitnessFrontend/src/pages/Chat/SparkyChatInterface.tsx:151-155 (onFinish → invalidateDiary(), invalidateChat())
  - Mobile (Partial): SparkyFitnessMobile/src/components/chat/ToolCallCard.tsx:73-79 → src/services/runProgramService.ts:108-112 (only runProgramQueryKey); useChatRuntime without onFinish in src/screens/ChatScreen.tsx:165-181
- **Cancel dictation** — Web has an X button to cancel, plus the Escape key and cancellation when the tab is hidden or when a response starts. Mobile has no button: it only cancels when leaving the screen, going to the background or starting a response (tapping the mic again stops and transcribes).
  - Web (Yes): SparkyFitnessFrontend/src/components/ai/VoiceInputControl.tsx:120-130; src/hooks/AI/useVoiceInput.ts:50-59, 72-75
  - Mobile (Partial): No cancel button: SparkyFitnessMobile/src/hooks/useVoiceInputLifecycle.ts (blur/background/run-start/unmount)
- **Voice errors and access to their settings** — Error messages when dictating (not supported, no permission, recording > 10 MB, no speech, failure). On web the error includes a "Voice settings" link that opens a dialog with the voice settings. On mobile, toasts and permission alerts are shown, with no link to the settings.
  - Web (Yes): SparkyFitnessFrontend/src/components/ai/VoiceInputControl.tsx:44-65, 133-160, 165-179 (dialog with VoiceInputSettings)
  - Mobile (Partial): Toasts/alerts only: SparkyFitnessMobile/src/screens/ChatScreen.tsx:486-520, 553-565; src/components/chat/AiVoiceDictationButton.tsx:167-177, 195-208
- **Deep link and automatic refresh of voice settings** — Mobile opens the voice settings with sparkyfitnessmobile://settings/voice and reloads the voice preferences when the screen gains focus or the app returns to the foreground, to pick up changes made on web.
  - Web (Partial): Web has no deep link or special refresh; it reads preferences with React Query (SparkyFitnessFrontend/src/hooks/AI/useAIServiceSettings.ts).
  - Mobile (Yes): SparkyFitnessMobile/App.tsx:451 (ChatSettings: 'settings/voice'); src/hooks/useVoicePreferencesRefresh.ts; src/screens/ChatSettingsScreen.tsx:43-52; src/screens/ChatScreen.tsx:1005
  - _Verification: corrected during verification_
- **Active chat configuration (default provider)** — Choose which active service the chat uses ("Chat configuration": name and model). On mobile it is read-only: the AI screen shows "Server AI provider" with name·model and the Checking…/error/"No AI provider is configured" states.
  - Web (Yes): SparkyFitnessFrontend/src/pages/Settings/AIServiceSettings.tsx:68-76, 714-752
  - Mobile (Partial): Read-only: SparkyFitnessMobile/src/screens/AiSettingsScreen.tsx:53-59, 73-116; route App.tsx:1233-1235; accessed from src/screens/SettingsScreen.tsx:298-306
- **Nutrition label scanning with server AI** — Scanner “Label” mode: photo of the label → /foods/scan-label (vision provider) → pre-filled food form. Web has no scanner: a photo of the label can only be attached in the chat (sparky_scan_label tool) and the result appears in the generic tool card, without filling in any form.
  - Web (Partial): Only from the chat with an attached image: SparkyFitnessServer/ai/tools/visionTools.ts (sparky_scan_label), rendered with ToolFallback (SparkyFitnessFrontend/src/components/thread.tsx:403). There is no label-scanning UI in SparkyFitnessFrontend/src.
  - Mobile (Yes): SparkyFitnessMobile/src/screens/FoodScanScreen.tsx:62-64 ('label' mode), 576-620; src/services/api/externalFoodSearchApi.ts:727 (scanNutritionLabel); src/screens/foodForm/CreateFoodMode.tsx:547-575
- **Photo-based nutrition estimate (dedicated flow)** — Food scanner “Photo” mode: take or pick a photo of a meal so the AI estimates ingredients and macros. If there is no provider it shows “AI photo estimates aren't set up”. Web has no dedicated flow: only by attaching the photo in the chat (chat-food-photo-card card).
  - Web (Partial): Only through the chat: SparkyFitnessFrontend/src/hooks/Foods/useFoodPhotoEstimate.ts:9-14 (“Web runs the estimate itself only from the chat… The mobile app owns the direct POST /foods/estimate-food-photo path”).
  - Mobile (Yes): SparkyFitnessMobile/src/screens/FoodScanScreen.tsx:62-64, 202-209 (isFoodPhotoAvailable), 676-718, 760 (gallery), 1140-1160 (no-AI notice), 1255-1320; src/services/api/aiSettingsApi.ts:136-146
- **Improve the estimate: multiple photos, weight and description** — Before generating: add or remove images (camera or gallery), optional total weight in g/oz and an optional description with a character limit. During analysis, stages are shown (“Identifying ingredients…”, “Estimating portions…”, “Calculating nutrition…”) along with specific provider errors (timeou…
  - Web (Partial): In the web chat, multiple images can be attached with free text (SparkyFitnessFrontend/src/components/thread.tsx:210-232), but there is no weight field, no progress stages and no specific errors; only “Analyzing meal photo…” (src/components/ai/FoodPhotoEstimateToolUI.tsx:386-404).
  - Mobile (Yes): SparkyFitnessMobile/src/screens/FoodPhotoImproveScreen.tsx:102-108, 195, 520-530, 590-610, 654-700, 744
- **Open the estimate in the Meal Builder** — Open the estimated ingredients in the full Meal Builder (“Create Meal” dialog) to edit them and create a reusable meal.
  - Web (Yes): SparkyFitnessFrontend/src/components/ai/FoodPhotoEstimateToolUI.tsx:566, 747, 790-827 (<MealBuilder> in Dialog)
  - Mobile (Partial): The mobile flow saves the reusable meal with the “Ingredients + reusable meal” mode but does not open any meal builder (SparkyFitnessMobile/src/screens/FoodPhotoEstimateReviewScreen.tsx:857-866).
  - _Verification: corrected during verification_
- **Starter suggestions that send on tap (and are translated)** — Both clients show four suggestions in the empty chat. On mobile, tapping one sends the message immediately and the labels are translated (the prompt is sent in English). On web, clicking one only fills the composer (it has to be sent manually) and the texts are hard-coded in English, without i18n.
  - Web (Partial): SparkyFitnessFrontend/src/components/thread.tsx:150-181 (WELCOME_SUGGESTIONS hard-coded in English; ThreadPrimitive.Suggestion with clearComposer and without send → only inserts the text).
  - Mobile (Yes): SparkyFitnessMobile/src/screens/ChatScreen.tsx:910-941 (ThreadPrimitive.Suggestion with send and clearComposer; labels via getLocalizedSuggestionLabel 784-808); src/constants/chat.ts:10-31 (chat.suggestions.* keys).
  - _Verification: added during verification_

#### In both clients, but with iOS/Android differences (2)

- **Chat UI container** · _Differs iOS/Android_ — Web: 500 px non-modal side panel (the app behind it remains usable, with no overlay or focus trap), “Sparky AI Coach” title and close button. Mobile: full screen in the “Sparky” stack, with a back button.
  - Web (Yes): SparkyFitnessFrontend/src/pages/Chat/SparkyChat.tsx:76-97 (modal={false}, onInteractOutside), 101-107 (title), 178-186 (close); mounted in SparkyFitnessFrontend/src/layouts/MainLayout.tsx:630
  - Mobile (Yes): SparkyFitnessMobile/App.tsx:771-775 (Stack.Screen 'Chat'); src/screens/ChatScreen.tsx:978-1166
  - iOS/Android: iOS uses the native header (liquid glass, SF Symbol 'trash' icon) and RN core's KeyboardAvoidingView; Android uses the screen's own header and an ionicon, and react-native-keyboard-controller for keyboard avoidance (ChatScreen.tsx:107-115, 980-993, 1095-1105; src/services/nativeTabBarPreference.ts:23-27).
  - _Verification: corrected during verification_
- **Voice dictation with the system recognizer** · _Differs iOS/Android_ — Microphone button in the composer that transcribes using the device's or browser's speech recognizer, at no Sparky AI cost. Web uses the Web Speech API (SpeechRecognition/webkitSpeechRecognition); if it is unavailable it shows an error. Mobile uses expo-speech-recognition with interim results and p…
  - Web (Yes): SparkyFitnessFrontend/src/utils/browserVoiceInput.ts:11-31; src/hooks/AI/useVoiceInput.ts:18-89; src/components/ai/VoiceInputControl.tsx:102-119; src/components/thread.tsx:188-199, 236-242
  - Mobile (Yes): SparkyFitnessMobile/src/screens/ChatScreen.tsx:417-640 (SystemVoiceDictationButton), 735-743; app.config.ts:230-236 (expo-speech-recognition plugin with microphone and speech recognition permissions)
  - iOS/Android: iOS uses SFSpeechRecognizer and needs a regional locale (src/utils/speechLocale.ts converts 'en' into 'en-US' based on the device). Android uses the Google/Samsung recognizer with androidIntentOptions EXTRA_ENABLE_LANGUAGE_SWITCH='balanced' (ChatScreen.tsx:581-585). addsPunctuation is requested on both platforms (ChatScreen.tsx:578).

<details><summary>Web ↔ mobile parity (26)</summary>

- Clear chat history
- Persistent history when opening the chat
- Welcome screen with suggestions
- Streaming responses
- Stop generation
- “Thinking”/typing indicator
- Markdown in responses
- Tool call cards
- Question with quick replies (sparky_ask_user)
- Copy assistant response
- Chat errors
- Dictation with AI transcription
- Voice waveform while recording
- Dictation is appended to the draft (manual send)
- Setting: enable/disable voice input
- Setting: recognition mode (System / AI)
- Setting: voice model
- Review the photo estimate
- Log the estimate to the diary
- “Convert with AI”: AI unit conversion
- “AI estimate” badge on variants
- Clear chat history
- Welcome screen and empty-chat suggestions
- Assistant tool-call cards
- Voice dictation with server AI transcription
- Voice input settings (enable, System/AI, model)

</details>

### 2.12 Settings, profile, family & integrations

#### Web only (51)

- **Profile photo (avatar)** — Upload or change the profile image (PNG/JPG up to 5 MB) and see the initials when there is no photo.
  - Web (Yes): SparkyFitnessFrontend/src/pages/Settings/ProfileInformation.tsx:29-68 (type/size validation, useUploadAvatarMutation), :84-129 (Avatar + Change Photo button)
- **Full name** — Edit the full name shown in the app and to family members.
  - Web (Yes): SparkyFitnessFrontend/src/pages/Settings/ProfileFormContent.tsx:90-105 (full_name field), Save Profile button :241
- **Phone number** — Edit the profile phone number.
  - Web (Yes): SparkyFitnessFrontend/src/pages/Settings/ProfileFormContent.tsx:109-125
- **Date of birth** — Select the date of birth (used for age in BMR, suggested ranges, etc.).
  - Web (Yes): SparkyFitnessFrontend/src/pages/Settings/ProfileFormContent.tsx:128-165 (calendar picker)
- **Gender** — Choose gender (Male/Female/Other), used in BMR, body fat % and body figure.
  - Web (Yes): SparkyFitnessFrontend/src/pages/Settings/ProfileFormContent.tsx:168-196
- **Bio** — Free-text self-introduction of the user.
  - Web (Yes): SparkyFitnessFrontend/src/pages/Settings/ProfileFormContent.tsx:221-235
- **Date format** — Choose between MM/dd/yyyy, dd/MM/yyyy, dd-MMM-yyyy, yyyy-MM-dd, MMM dd, yyyy.
  - Web (Yes): SparkyFitnessFrontend/src/pages/Settings/PreferenceSettings.tsx:136-176
- **Chart scale mode** — Time-based or point-based scale in charts.
  - Web (Yes): SparkyFitnessFrontend/src/pages/Settings/PreferenceSettings.tsx:205-230
- **Standard drink and weekly alcohol limit** — Choose the grams in a standard drink (per-country presets) and the weekly limit in standard drinks.
  - Web (Yes): SparkyFitnessFrontend/src/pages/Settings/PreferenceSettings.tsx:329-390
- **Decimal places in measurements** — Number of decimal places shown in measurements.
  - Web (Yes): SparkyFitnessFrontend/src/pages/Settings/PreferenceSettings.tsx:430-446
- **Minimum logging level (logs)** — DEBUG, INFO, WARN, ERROR or SILENT for the web client console.
  - Web (Yes): SparkyFitnessFrontend/src/pages/Settings/PreferenceSettings.tsx:516-548
- **Grant access to a family member (by email)** — Create an access rule by looking up the family member by email, with validations (not yourself, no duplicates).
  - Web (Yes): SparkyFitnessFrontend/src/pages/Settings/FamilyAccessManager.tsx:125-215 (validation, findUserByEmail), :304-343 (Add Family Member + email); accordion in SettingsPage.tsx:180-195
- **Granular family access permissions** — Checkboxes: manage diary, view food library, view exercise library, manage check-in, manage medication, manage symptoms, view reports.
  - Web (Yes): SparkyFitnessFrontend/src/pages/Settings/FamilyAccessManager.tsx:50-57 (model), :367-600 (Checkbox per permission)
- **Share external data providers with the family member** — Lets the delegate search foods/exercises using your API providers (FatSecret, USDA...); health integrations are never shared.
  - Web (Yes): SparkyFitnessFrontend/src/pages/Settings/FamilyAccessManager.tsx:625-658 (share_external_providers + tooltip)
- **Access end date** — Optional date on which the access rule expires.
  - Web (Yes): SparkyFitnessFrontend/src/pages/Settings/FamilyAccessManager.tsx:664-680; End Date column in tables :711-836
- **Edit access rule** — Modify permissions or the end date of an existing rule.
  - Web (Yes): SparkyFitnessFrontend/src/pages/Settings/FamilyAccessManager.tsx:99-116 (openEditDialog), buttons :803 and :931 ('Update Access')
- **Activate/deactivate access rule** — Toggle to pause or resume a rule without deleting it.
  - Web (Yes): SparkyFitnessFrontend/src/pages/Settings/FamilyAccessManager.tsx:225-232 (toggleFamilyAccessActiveStatus), Switch :793 and :920
- **Revoke (delete) family access** — Delete an access rule.
  - Web (Yes): SparkyFitnessFrontend/src/pages/Settings/FamilyAccessManager.tsx:234-240 (handleDelete), buttons :814 and :939
- **Profile switcher (act on behalf of a family member)** — Header dropdown to switch to a family member's profile and operate as a delegate; shows a blue dot when acting on behalf of someone else and hides users with only food list permission.
  - Web (Yes): SparkyFitnessFrontend/src/components/ProfileSwitcher.tsx:13-88 (food_list filter :25-36, switchToUser :40-47), mounted in layouts/MainLayout.tsx:506; contexts/ActiveUserContext.tsx:55-60
- **Manage a family member's check-in, reports, medication and symptoms** — As a delegate, access the family member's Check-in, Reports, Medication and Symptoms according to their permissions.
  - Web (Yes): SparkyFitnessFrontend/src/layouts/MainLayout.tsx:155-171 (+ menu) and :269-301 (checkin, reports, medications, symptoms tabs when acting on behalf); PermissionRoute in App.tsx:395-401
- **Copy a meal from my diary to a family member** — Send a meal from your diary to a family member's diary.
  - Web (Yes): SparkyFitnessFrontend/src/pages/Diary/CopyFamilyEntryDialog.tsx:79-80 (useCopyFoodEntriesToUserMutation), 'Copy To Family' tab :233
- **Add/edit/delete food data providers** — Configure food sources: Open Food Facts, USDA, FatSecret, Nutritionix (legacy), Yazio (username/password), SwissFood, Canadian Nutrient File, Livsmedelsverket, NIH DSLD (supplements), with keys/IDs.
  - Web (Yes): SparkyFitnessFrontend/src/pages/Settings/AddExternalProviderForm.tsx:59,343-381 (dynamic types from external_provider_types), ProviderSpecificFields.tsx:314 (Yazio), EditProviderForm.tsx, ProviderCard.tsx:381,649-657 (edit/delete); section in SettingsPage.tsx:404-429
- **Self-hosted recipe servers (Mealie, Tandoor, Norish)** — Connect your own instances with the app URL and API key to search/import recipes as foods.
  - Web (Yes): SparkyFitnessFrontend/src/pages/Settings/ProviderSpecificFields.tsx (App URL / Enter Key), ProviderCard.tsx:356-363,700-722
- **Exercise providers (wger, Free Exercise DB)** — Cards for exercise catalog providers (global, read-only for the user).
  - Web (Yes): SparkyFitnessFrontend/src/pages/Settings/ProviderCard.tsx:884-905 (free-exercise-db, wger), Global/Read-only labels
- **Activate/deactivate a provider** — Toggle to enable or disable a configured provider.
  - Web (Yes): SparkyFitnessFrontend/src/pages/Settings/ProviderCard.tsx:341-380 (handleToggleActive), Switch :673
- **Open Food Facts contributions** — Consent to submit products to OFF, personal or global account, and product language.
  - Web (Yes): SparkyFitnessFrontend/src/pages/Settings/OpenFoodFactsContributionSettingsCard.tsx (keys settings.foodExerciseDataProviders.openFoodFacts.*), mounted in ExternalProviderSettings.tsx:121
- **Bulk catalog import (CNF and Livsmedelsverket)** — Import the full Canadian Nutrient File catalog or the Swedish Livsmedelsverket database with a progress bar.
  - Web (Partial): SparkyFitnessFrontend/src/pages/Settings/ProviderCard.tsx:144-149,539,576,792-869; CnfBulkImportDialog.tsx; LivsmedelsverketBulkImportDialog.tsx
  - _Verification: corrected during verification_
- **Connect/disconnect health accounts via OAuth** — Link and unlink Withings, Fitbit, Oura, Polar, Strava, Google Health and COROS; view last sync and token expiry.
  - **Updated in PR #3023 (merged):** Still web only: mobile has no screen to link or unlink these accounts. On the web the provider card now shows the token expiry only for Polar; the other OAuth providers, which refresh their tokens on their own, show just the last sync.
  - Web (Yes): SparkyFitnessFrontend/src/pages/Settings/ProviderCard.tsx:163-205 (connect/disconnect mutations), :415-480 (per-provider config), :625-640 (Connect/Disconnect buttons), :956-966 (Last Sync / Token Expires)
- **OAuth callback pages** — Routes that complete authorization and show the result.
  - Web (Yes): SparkyFitnessFrontend/src/App.tsx:335-372 (/withings, /fitbit, /oura, /polar, /coros, /coros-mcp, /strava, /googlehealth /callback); pages/Integrations/*Callback.tsx and CallbackStatus.tsx
- **Garmin Connect (credentials + MFA)** — Connect Garmin with email and password, enter an MFA code and disconnect.
  - Web (Yes): SparkyFitnessFrontend/src/pages/Settings/GarminConnectSettings.tsx:26-28 (email/password/MFA), ExternalProviderSettings.tsx:106-150, ProviderSpecificFields.tsx:457,596, ProviderCard.tsx:482-489
- **COROS MCP** — COROS provider via MCP server (preset URL) with a 90-day window per request.
  - Web (Yes): SparkyFitnessFrontend/src/pages/Settings/AddExternalProviderForm.tsx:357-359, ProviderSpecificFields.tsx:835, SyncRangeDialog.tsx:~150-156
- **Hevy and Liftosaur (API key)** — Connect workout apps with an API key and import workouts.
  - Web (Yes): SparkyFitnessFrontend/src/pages/Settings/ProviderSpecificFields.tsx:608,617; AddExternalProviderForm.tsx:220,233; ProviderCard.tsx:491-508
- **Manual sync by date range (per provider)** — Dialog to sync a provider between dates (7/30/90/180/365-day presets or custom), with Polar- and COROS-specific notices.
  - Web (Yes): SparkyFitnessFrontend/src/pages/Settings/SyncRangeDialog.tsx (titles and presets, notes :144,:156,:170); ProviderCard.tsx:250-290,613,1047
- **Raw data capture and replay (troubleshooting)** — Sync while saving the raw responses on the server or replay a saved file, to debug integrations; privacy notice.
  - Web (Partial): SparkyFitnessFrontend/src/pages/Settings/SyncRangeDialog.tsx:319-367; ProviderCard.tsx:1008-1016 ('Help improve this integration by sharing anonymized mock data')
  - _Verification: corrected during verification_
- **Provider sync frequency** — Manual, hourly or daily for Withings, Garmin, Fitbit, Oura, Google Health, Strava, Polar, COROS MCP, Hevy and Liftosaur.
  - Web (Yes): SparkyFitnessFrontend/src/pages/Settings/EditProviderForm.tsx:1183-1225; shown in ProviderCard.tsx:726-728
- **Global sync button** — Header icon that syncs all active manual-sync providers at once; only visible if there is at least one.
  - Web (Yes): SparkyFitnessFrontend/src/components/GlobalSyncButton.tsx:17-71 (useSyncAllMutation, MANUAL_SYNC_PROVIDERS), mounted in layouts/MainLayout.tsx:529
- **Delete synced data by source** — Delete all synced/imported entries from a source (e.g. Apple Health, Garmin) without touching manual data.
  - Web (Yes): SparkyFitnessFrontend/src/pages/Settings/DataManagementSettings.tsx:151-281 (source, scope, confirmation)
- **Export diary to CSV** — Download the entire food diary as CSV, choosing the delimiter (semicolon or comma).
  - Web (Yes): SparkyFitnessFrontend/src/pages/Settings/DataManagementSettings.tsx:60-142
  - Note: Neither client offers deleting the entire account.
- **Import food database (CSV)** — Add reusable foods with servings and nutrition from CSV.
  - Web (Yes): SparkyFitnessFrontend/src/pages/Settings/DataImportSettings.tsx:~150-157 (settings.dataImport.food)
- **Import food diary (CSV)** — Log past meals by date and meal type, creating or matching foods.
  - Web (Yes): SparkyFitnessFrontend/src/pages/Settings/DataImportSettings.tsx:~160-167 (settings.dataImport.diary)
- **Import check-in and health data (CSV)** — Import body measurements, sleep, vitals, activity, hydration and mood.
  - Web (Yes): SparkyFitnessFrontend/src/pages/Settings/DataImportSettings.tsx:172-180
- **Import exercise database (CSV)** — Add reusable exercises from CSV (with duplicate detection).
  - Web (Yes): SparkyFitnessFrontend/src/pages/Settings/DataImportSettings.tsx:186-194, duplicates :121-126
- **Import workout history (CSV)** — Import past workouts with sets, reps and weights.
  - Web (Yes): SparkyFitnessFrontend/src/pages/Settings/DataImportSettings.tsx:200-208
- **Import activities (.FIT files)** — Import workouts and activities from binary .fit files.
  - Web (Yes): SparkyFitnessFrontend/src/pages/Settings/DataImportSettings.tsx:216-224
- **Change password** — Update the account password.
  - Web (Yes): SparkyFitnessFrontend/src/pages/Settings/AccountSecurity.tsx ('Change Password', 'Update Password'); SettingsPage.tsx:216
- **Change email** — Update the account email.
  - Web (Yes): SparkyFitnessFrontend/src/pages/Settings/AccountSecurity.tsx ('Current Email', 'Update Email')
- **Multi-factor authentication (MFA)** — Enable/disable TOTP and email-code MFA, and generate recovery codes.
  - Web (Yes): SparkyFitnessFrontend/src/pages/Settings/MFASettings.tsx (totp, emailCode, recoveryCodes, generateNewCodes); AccountSecurity.tsx:283
- **API key management** — Generate API keys with an expiration (7/30/90 days, 1 year, never) and full or read-only access; copy, disable and delete.
  - Web (Yes): SparkyFitnessFrontend/src/pages/Settings/ApiSettings.tsx (settings.apiKeyManagement.*); SettingsPage.tsx:455
- **Developer resources** — Links to the API documentation (Swagger and Redoc).
  - Web (Yes): SparkyFitnessFrontend/src/pages/Settings/DevloperResources.tsx:45 (/api/api-docs/swagger), :57 (/api/api-docs/redoc); SettingsPage.tsx:456
- **Custom measurement categories** — Create and manage your own measurement categories for check-in.
  - **Updated in PR #3194 (merged):** Mobile Settings now has a Custom Measurements row, shown while connected to a server, that lists, adds, edits and deletes custom measurement categories with the same fields as the web: name, display name, unit, frequency and number or text type. Unlike the web, which locks the name and data type of an existing category, mobile lets you change both, and its screens are English only so far.
  - Web (Yes): SparkyFitnessFrontend/src/pages/Settings/CustomCategoryManager.tsx; SettingsPage.tsx:377-393
- **Reorder data providers (priority)** — Drag provider cards to change their order (sort_order), which defines the priority or display order of food and exercise sources.
  - Web (Yes): SparkyFitnessFrontend/src/pages/Settings/ExternalProviderList.tsx:65-87 (useSortable, 'Drag to reorder provider'), :358-380 (handleDragEnd saves sort_order with updateExternalProvider), :487-517 (SortableContext); mounted in ExternalProviderSettings.tsx:270
  - _Verification: added during verification_

#### Mobile only (25)

- **On-device health data sync** · _Differs iOS/Android_ — Screen to send Apple Health (iOS) or Health Connect (Android) data to the server, with last sync time and source.
  - Mobile (Yes): src/screens/SettingsScreen.tsx:237-245 → SyncScreen (App.tsx:959-962); SyncScreen.tsx:190-196,514-515 (Health Connect vs Apple Health), HealthSourceLabel.tsx:13-19
  - iOS/Android: iOS uses HealthKit (services/healthConnectService.ios.ts, services/healthkit); Android uses Health Connect (services/healthConnectService.ts) with a 'Not medical advice' notice on Android only (SyncScreen.tsx:961-972).
- **Health sync range and 'Sync Now'** — Choose a range (Today, 24 h, 3/7/30/90 days, 6 months, 1 year) and start a quick or full sync.
  - Mobile (Yes): src/screens/SyncScreen.tsx:114-160 (ranges), :760-790 (Quick Sync / All Sync), :840-893 (Sync Range, Sync Now)
- **Background sync** · _Differs iOS/Android_ — Toggle to sync health data automatically in the background.
  - Mobile (Yes): src/components/SyncFrequency.tsx:19-45; src/screens/SyncScreen.tsx:290-365,975-978
  - iOS/Android: Android requests the Health Connect BackgroundAccessPermission (SyncScreen.tsx:296-325); iOS starts HealthKit observers (SyncScreen.tsx:337-365) and warns that it updates 'when the phone allows it' (SyncFrequency.tsx:38-45).
- **Sync on app open** — Start a health sync every time the app is opened.
  - Mobile (Yes): src/components/SyncOnOpen.tsx:16-36; src/screens/SyncScreen.tsx:367-370,979-982
- **Selection of health metrics to sync** · _Differs iOS/Android_ — Enable/disable each metric (or all) and request read permissions.
  - Mobile (Yes): src/screens/SyncScreen.tsx:372-440 (per-metric permissions), :600-660 (all), :983-990 (HealthDataSync)
  - iOS/Android: Different permission flows (HealthKit vs Health Connect) but the same UI.
  - _Verification: corrected during verification_
- **Writing to Apple Health/Health Connect and deletion** — Write SparkyFitness metrics to the device's health store and delete that data (all or by date range).
  - Mobile (Yes): src/components/HealthDataWriteback.tsx:94-169; src/screens/SyncScreen.tsx:520-590,991-1000 (DateRangeSheet); services/writeback.ios.ts / writeback.ts
- **Import full health history** · _Differs iOS/Android_ — One-time import of the entire history with progress, time remaining, pause, resume and start over.
  - Mobile (Yes): src/screens/SyncScreen.tsx:945-957 → ImportHistoryScreen.tsx (App.tsx:964-967), actions :440-620
  - iOS/Android: Android warns about Health Connect's daily historical read limit and resumes automatically (ImportHistoryScreen.tsx:469-476); different unavailability messages (Health Connect vs HealthKit, :457-466).
- **Health data report for support** · _Android only_ — Export anonymized data from the last 4 h of Health Connect to report bugs.
  - Mobile (Yes): src/screens/SyncScreen.tsx:1004-1050 (rendered only if isAndroid)
  - iOS/Android: Gated by isAndroid (SyncScreen.tsx:190,1004).
- **Reorder water containers** — Move containers up/down in the list.
  - Mobile (Yes): src/screens/WaterContainersScreen.tsx:89,180-197 (reorderWaterContainersAsync), :338-351 (Move up/down)
- **Allow notifications (master toggle)** — Master toggle for all alerts, plus a banner that takes you to the system settings if the permission is missing.
  - Mobile (Yes): src/screens/AppSettingsScreen.tsx:229-239 → NotificationSettingsScreen.tsx:231-245; components/NotificationPermissionBanner.tsx:98-101
- **Rest timer notification** — Alert when the rest between sets ends.
  - Mobile (Yes): src/screens/NotificationSettingsScreen.tsx:253-272
- **Fasting goal notification** — Alert when the fasting goal is reached.
  - Mobile (Yes): src/screens/NotificationSettingsScreen.tsx:276-292
- **Medication reminders** · _Differs iOS/Android_ — Scheduled reminders with options to repeat, hide medication names and consolidate reminders.
  - **Updated in PR #3005 (merged):** Besides repeat, hide names and consolidate, medication reminders now have a Remind In setting (10, 15, 30 or 60 minutes) that sets the delay of the new Remind in button on the reminder notification, on iOS and Android. Android still adds its own channel and asks for exact alarms; the web still has no reminders.
  - Mobile (Yes): src/screens/NotificationSettingsScreen.tsx:298-392 (Medication Reminders, Repeat, Hide Medication Names, Consolidate)
  - iOS/Android: Android creates a dedicated channel (services/notifications.ts:144-157) and requests the exact alarm permission so they fire on time; iOS does not.
- **Water reminders** — Remind the user to drink water after X hours without a log, within a time window (start/end).
  - Mobile (Yes): src/screens/NotificationSettingsScreen.tsx:398-470 (interval, Start Time, End Time; validation :176)
- **Exact alarm permission** · _Android only_ — Dialog asking the user to enable 'Alarms & reminders' so timers and reminders fire on time.
  - Mobile (Yes): src/screens/NotificationSettingsScreen.tsx:125-133; services/notifications.ts:336-350 (ExactAlarmBridge); targets/android-exact-alarm; plugins/withExactAlarmModule.ts
  - iOS/Android: ExactAlarmBridge.isAvailable is only true on Android.
- **Haptic feedback** — Light vibrations on timers and confirmations.
  - **Updated in PR #3052 (merged):** The phone switch still works the same on both platforms. The Wear OS watch on Android does not follow it: it vibrates on button presses, as rest ends and on a new record even with the switch off, while the Apple Watch skips those vibrations when it is off.
  - Mobile (Yes): src/screens/AppSettingsScreen.tsx:241-252 (stores/appPreferencesStore hapticsEnabled)
- **Camera shutter sound** — Play a sound when capturing photos.
  - Mobile (Yes): src/screens/AppSettingsScreen.tsx:254-265 (soundsEnabled)
- **Liquid Glass navigation** · _iOS only_ — Use the iOS 26 glass tab bar and headers.
  - Mobile (Yes): src/screens/AppSettingsScreen.tsx:212-228; src/utils/liquidGlass.ts:9-17
  - iOS/Android: canUseLiquidGlass() returns false if Platform.OS !== 'ios' or the glass API is not available.
- **Apple Watch settings** · _iOS only_ — Gestures (double tap to log a set, prompt for RPE), input mode (keyboard/Digital Crown) and watch page order.
  - **Partly covered by PR #3052 (merged):** On Android a Wear OS row appears in Settings once a Wear OS watch has connected to the phone, and it opens the same screen: the effort (RPE) prompt after each set (5 to 10 on Wear OS, 1 to 10 on Apple Watch), the order and visibility of the watch pages and the Goals page nutrients, and the Wear OS app applies all of them. Double-tap to log a set and the Keypad or Digital Crown choice are Apple Watch only: Wear OS adjusts the selected value with the rotary crown and opens a keypad when you tap it again. The Wear OS description of the effort prompt is English only.
  - Mobile (Yes): src/screens/SettingsScreen.tsx:52-55,368-377 (only if a watch is paired) → WatchSettingsScreen.tsx:103-240; modules/watch-connectivity (ios/ only)
  - iOS/Android: WatchConnectivity only has an iOS implementation (modules/watch-connectivity/ios, index.ts:1032).
- **Server management** — Add, activate, configure, delete and test the connection of one or more server configurations; connected/failed status.
  - Mobile (Yes): src/screens/SettingsScreen.tsx:130-146,213-232 → ServerSettingsScreen.tsx:80-180 (activate/delete), :245-330 (actions), :418 (Test Connection), :442 (Other Servers), :491 (Add Server)
  - _Verification: corrected during verification_
- **Open the web dashboard** — Open the active server's web app in the in-app browser.
  - Mobile (Yes): src/screens/ServerSettingsScreen.tsx:199-240 (WebBrowser.openBrowserAsync), button :401
- **Local log viewer** — View app logs filtered by level, copy an entry and clear all.
  - Mobile (Yes): src/screens/SettingsScreen.tsx:389-394 → LogScreen.tsx:200-330 (filter, Clear Logs, copy to clipboard); App.tsx:954-957
- **Share diagnostic report** — Export a local report (version, sync status, logs, query state) without personal data.
  - Mobile (Yes): src/screens/SettingsScreen.tsx:148-186,403-420 (shareDiagnosticReport in services/diagnosticReportService.ts)
- **Privacy policy** — Open the app's privacy policy.
  - Mobile (Yes): src/screens/AboutScreen.tsx:23-24,128-139 (opens PRIVACY_POLICY_URL in the browser)
  - Note: src/components/PrivacyPolicyModal.tsx is mounted in SettingsScreen.tsx:431-434 but is never opened (setShowPrivacyModal(true) is never called): dead code.
- **Operating system shortcuts (Siri/Shortcuts, controls, and launcher shortcut)** · _Differs iOS/Android_ — Log data without opening the app from system shortcuts, using the active server session stored in the native module.
  - **Partly covered by PRs #2989, #3020 and #3051 (merged):** Android has Scan food, Log food and Fasting app icon shortcuts that open the app, plus four Quick Settings tiles and a water widget: the Log water shortcut and tile log a drink in the background (the tile also from the lock screen), and the widget's − and + buttons remove or add one, all with the stored login. The app icon shortcut names are translated in 10 of the 15 other languages the app ships, and the Log water long label, the Log water and Calories left tile names and the water widget texts in 6 (Spanish, Polish, Brazilian Portuguese, Cantonese and Simplified and Traditional Chinese), while the Log water result messages and the "Quick logging" notification channel are still English only. Siri/Shortcuts App Intents (log or remove water, log weight, start or end a fast) still have no Android equivalent, and no tile matches the iOS Remove a drink, Start fast and End fast controls.
  - Mobile (Yes): SparkyFitnessMobile/plugins/withBackgroundWater.ts:1-10; targets/widget/ShortcutIntents.swift:260 (LogWaterIntent), :300 (RemoveWaterIntent), :338 (LogWeightIntent), :370 and :408 (Start/End fast), :463-489 (Scan food, Log food, Open food diary controls); targets/android-background-water/.../BackgroundWaterModule.kt:32-33 (ShortcutInfoCompat 'Log water'); src/services/backgroundWater.ts; the session is cleared when …
  - iOS/Android: iOS: Siri/Shortcuts App Intents (log or remove water, log weight, start or end a fast) and Lock Screen / Control Center controls (scan and log food, open diary). Android: only a 'Log water' launcher shortcut (UI-less LogWaterActivity + WorkManager).
  - _Verification: added during verification_

#### In both, with differences (21)

- **Profile height** — Enter the profile height in the preferred measurement unit.
  - Web (Yes): SparkyFitnessFrontend/src/pages/Settings/ProfileFormContent.tsx:199-218
  - Mobile (Partial): No profile height field exists in src/screens (profileApi.ts is read-only)
  - Note: Height as a check-in measurement belongs to another domain.
  - _Verification: corrected during verification_
- **Time format** — 24 h, 12 h AM/PM or am/pm.
  - Web (Yes): SparkyFitnessFrontend/src/pages/Settings/PreferenceSettings.tsx:178-200
  - Mobile (Partial): Not editable on mobile; it honors the server value (time_format used in ~54 places, e.g. src/screens/SettingsScreen.tsx:87, ImportHistoryScreen/SyncScreen formatRelativeTime)
- **Weight unit** — kg, lbs or st+lbs.
  - Web (Yes): SparkyFitnessFrontend/src/pages/Settings/PreferenceSettings.tsx:234-257
  - Mobile (Partial): No selector; default_weight_unit is honored when reading (src/screens/WorkoutPresetFormScreen.tsx:323, WarmupSettingsScreen.tsx:102-103, WorkoutPresetDetailScreen.tsx:54)
- **Body measurement unit** — cm, inches or feet+inches.
  - Web (Yes): SparkyFitnessFrontend/src/pages/Settings/PreferenceSettings.tsx:261-286
  - Mobile (Partial): No selector; default_measurement_unit is only read (6 references in src/)
- **Distance unit** — Kilometers or miles.
  - Web (Yes): SparkyFitnessFrontend/src/pages/Settings/PreferenceSettings.tsx:290-305
  - Mobile (Partial): No selector; default_distance_unit is read (src/screens/WorkoutPresetDetailScreen.tsx:56, WorkoutPresetFormScreen.tsx:325)
- **Energy unit** — Calories (kcal) or kilojoules (kJ).
  - Web (Yes): SparkyFitnessFrontend/src/pages/Settings/PreferenceSettings.tsx:308-326
  - Mobile (Partial): No selector; energy_unit is only applied in src/screens/CalorieSettingsScreen.tsx:50-58 (displayEnergy/toKcal); the other screens show hard-coded kcal (e.g. FamilyDiaryScreen.tsx:147 '{{calories}} kcal')
- **Caffeine half-life and target bedtime** — Caffeine half-life (2-8 h) and bedtime for the caffeine curve.
  - Web (Yes): SparkyFitnessFrontend/src/pages/Settings/PreferenceSettings.tsx:395-428
  - Mobile (Partial): Not editable; src/components/CaffeineCard.tsx:63,199 uses the target_bedtime returned by the kinetics computed on the server
- **First day of the week** — Day on which weeks and calendars start.
  - Web (Yes): SparkyFitnessFrontend/src/pages/Settings/PreferenceSettings.tsx:449-508
  - Mobile (Partial): No selector; honored when reading (src/components/wellness/CycleCalendarGrid.tsx:43-44 and other calendars)
- **Time zone** — Select the account time zone that defines 'today' for the diary and reports.
  - Web (Yes): SparkyFitnessFrontend/src/pages/Settings/PreferenceSettings.tsx:510-513 + TimezoneSelect.tsx
  - Mobile (Partial): No selector: the device time zone is only sent if the account has none (src/services/api/preferencesApi.ts:99-160 ensureTimezoneBootstrapped, called in src/hooks/useAppStartup.ts:111)
  - Note: If the user travels, mobile does not update the server time zone; it has to be changed on web.
- **Displayed items limit** — 5/10/15/20 items in lists such as search recents/frequents.
  - Web (Yes): SparkyFitnessFrontend/src/pages/Settings/PreferenceSettings.tsx:550-580
  - Mobile (Partial): No selector; src/screens/FoodSearchScreen.tsx:148-149 uses item_display_limit from the server
- **Auto-scale foods by default** — Check the Auto-Scale checkbox by default when editing a food.
  - Web (Yes): SparkyFitnessFrontend/src/pages/Settings/PreferenceSettings.tsx:629-648
  - Mobile (Partial): No toggle; only read in src/screens/foodForm/CreateFoodMode.tsx:102 and AdjustNutritionMode.tsx:88
- **List of created and received access rules** — 'Rules I Created' and 'Rules Given to Me' tables with family member, permissions, end date and status (Active/Pending/Inactive).
  - Web (Yes): SparkyFitnessFrontend/src/pages/Settings/FamilyAccessManager.tsx:711-830 (Rules I Created), :836-960 (Rules Given to Me); statuses :246-270
  - Mobile (Partial): src/screens/FamilyMembersScreen.tsx:66-97 lists only those who gave you diary-related access, with a 'Can copy'/'View only' label (:81-83); no created rules, status or end date
- **View a family member's diary** — View the meals logged by a family member on a given date.
  - Web (Yes): Through the profile switcher: layouts/MainLayout.tsx:265-268 shows the Diary tab if hasWritePermission('diary') and renders the family member's full diary (read and write)
  - Mobile (Partial): src/screens/FamilyMembersScreen.tsx:91-93 → FamilyDiaryScreen.tsx (read-only food entries grouped by meal, totals and date navigation :112-210) via /api/daily-summary?userId (src/services/api/dailySummaryApi.ts:28-39); FamilyMealDetailScreen.tsx:126 'Viewing only'; registered in App.tsx:536-564
  - Note: Mobile does not allow editing the family member's diary or viewing exercise/water/check-in.
- **Delete meal type** — Delete a meal type; on web with an impact analysis (entries, logged meals, plans) and the option to move the items to another type or delete everything.
  - Web (Yes): SparkyFitnessFrontend/src/pages/Settings/DeleteMealTypeDialog.tsx:45-90 (impact and destination), buttons 'Move items and delete' / 'Delete everything'; MealTypeManager.tsx:95-105
  - Mobile (Partial): src/screens/MealTypeSettingsScreen.tsx:1046-1066 only a confirmation Alert 'Delete {{name}}?', with no impact analysis or reassignment
- **Predefined drink catalog (Quick-Add)** — Add drinks from the catalog (water, coffee, alcohol...) as quick-add presets.
  - Web (Yes): SparkyFitnessFrontend/src/pages/Settings/WaterContainerManager.tsx:99-140 (catalog with All/Alcohol/Caffeine filter), :442 ('Quick-Add Drink Presets' list), :457-475 ('Add from Catalog')
  - Mobile (Partial): src/screens/WaterContainersScreen.tsx:200-210,529-556: horizontal row of 'Quick-add presets' chips that adds the preset; no catalog dialog or filters by type
- **Nutrient display per view** — Choose which nutrients are shown in each view and in what order, with reset to defaults.
  - Web (Yes): SparkyFitnessFrontend/src/pages/Settings/NutrientDisplaySettings.tsx:59-86 (6 groups: Summary, Quick Info, Food Database, Goal, Report Tabular, Report Chart), :239 (desktop/mobile tab), :16-29 (drag with dnd-kit), :11 (reset); SettingsPage.tsx:266-281
  - Mobile (Partial): src/screens/NutrientDisplaySettingsScreen.tsx:31-40,88-100 (only food_database and report_tabular, only the 'mobile' platform), :317-332 (move up/down), :348 (show), :357-366 (reset); accessed from FoodSettingsScreen.tsx:213-220
  - Note: The quick_info, goal and report_chart groups are not offered on mobile; the summary is configured in the mobile Dashboard/Diary settings.
- **Sign out** — Log out of the current account.
  - Web (Yes): SparkyFitnessFrontend/src/layouts/MainLayout.tsx:95-112,531-541 (Sign Out button in header)
  - Mobile (Partial): There is no sign-out button (no signOut/logout in src); access is revoked by deleting the server configuration in ServerSettingsScreen.tsx:130-170
- **Links to GitHub, documentation, Discord, and translation** — External project links: repository, docs, Discord community, Weblate, and star counter.
  - Web (Yes): SparkyFitnessFrontend/src/components/AboutDialog.tsx:88 (Discord), :106 (GitHub); layouts/MainLayout.tsx:488-501 and 652-665 (GitHubStarCounter, Docs and Translate pills)
  - Mobile (Partial): src/screens/AboutScreen.tsx:22-25,92-121 only GitHub and Documentation; no Discord, Weblate, or star counter
- **Calculation settings (BMR, body fat, energy)** — BMR formula, body fat % algorithm, daily energy adjustments, deficit modes, and safety floors.
  - Web (Yes): SparkyFitnessFrontend/src/pages/Settings/CalculationSettings.tsx:673-720 (BMR Algorithm, Body Fat Algorithm) and the rest of the card; SettingsPage.tsx:323-341
  - Mobile (Partial): src/screens/CalorieSettingsScreen.tsx:60-200,290-410 (calorie mode, goal mode, activity level, external BMR, negative TDEE adjustment, safety floor, exercise calories %); no BMR or body fat algorithm selector (no bmr_algorithm in src/screens)
- **AI service** · _Differs iOS/Android_ — Configure the AI providers/services used by chat and smart features.
  - Web (Yes): SparkyFitnessFrontend/src/pages/Settings/AIServiceSettings.tsx; SettingsPage.tsx:432-453
  - Mobile (Partial): src/screens/AiSettingsScreen.tsx:69-101 only shows the server provider's status (without configuring it) and :120-160 adds on-device label scanning
  - iOS/Android: The 'On-device (Apple Intelligence)' / 'Scan Labels On Device' option requires iOS 27 with Apple Intelligence (AiSettingsScreen.tsx:146-150, services/onDeviceLabelScan); on Android it shows as unavailable.
- **Copy a family member's food into my diary** — Bring into your own diary the food logged by a family member who granted permission to manage their diary and view their food library.
  - Web (Partial): SparkyFitnessFrontend/src/pages/Diary/CopyFamilyEntryDialog.tsx:79 (useCopyFoodEntriesFromUserMutation), 'Copy From Family' tab :229-231, source and destination date and meal :286-397; opened from Diary.tsx:195-197,442. Copies the entire meal type: individual foods cannot be selected and quantities cannot be adjusted.
  - Mobile (Yes): SparkyFitnessMobile/src/screens/FamilyMealDetailScreen.tsx:52-74 (select/deselect foods) → FamilyCopyReviewScreen.tsx:217-386 (quantity per food, nutrition summary, destination date and meal, 'Copy to my diary'); requires canCopy (services/api/familyApi.ts:23-29); APIs copy-reviewed-from-user and copy-selected-from-user (foodEntriesApi.ts:157,172)
  - Note: Mobile is more granular than web: per-food selection, quantity editing, and nutrition preview.
  - _Verification: added during verification_

#### In both clients, but with iOS/Android differences (1)

- **App language** · _Differs iOS/Android_ — Choose the interface language.
  - **Updated in PR #2959 (merged):** Mobile now ships 16 languages, Turkish added, against 34 on the web. The rest is unchanged: Android has an in-app picker, iOS sends you to iOS Settings, and the mobile language is still not synced with the server language preference the web uses.
  - Web (Yes): SparkyFitnessFrontend/src/pages/Settings/PreferenceSettings.tsx:592-606 (getSupportedLanguages: 34 languages in utils/languageUtils.ts:85-126); saved in the server preferences and applied with components/LanguageHandler.tsx:5-15
  - Mobile (Yes): src/screens/AppSettingsScreen.tsx:165-210; 15 languages in src/localization/localeRegistry.json (en, de, es, fr, hu, it, lv, nb-NO, nl, pl, pt-BR, ru, yue-Hant, zh-Hans, zh-Hant) + 'System'; plugins/withAppLanguage.ts and targets/android-language
  - iOS/Android: Android: in-app picker (BottomSheetPicker, AppSettingsScreen.tsx:189-209) with native per-app language (Android 13+). iOS: the row only shows the current language 'Managed by iOS' and opens iOS Settings (Linking.openSettings, AppSettingsScreen.tsx:113-130,165-187).
  - Note: The mobile language is local and is not synced with the server language preference used by web; mobile offers fewer languages (15 vs 34).

<details><summary>Web ↔ mobile parity (31)</summary>

- Settings hub screen
  - **Updated in PR #3052 (merged):** The watch row now also appears on Android, titled 'Wear OS', once a Wear OS watch has connected to the phone. It opens the same watch settings screen as the 'Apple Watch' row on iOS, without the double-tap and set input options. Otherwise the list is the same on both platforms.
- Theme (light/dark)
- Auto-scale Open Food Facts imports
- Show net carbs
- Copy a family member's meal to my diary
- Default food provider
- Barcode provider and Open Food Facts fallback
- Create custom meal type
- Edit meal type name and default time
- Show/hide meal type in the diary
- Show/hide in quick log
- Reorder meal types
- Water display unit
- Add exercise water loss to goal
- Count water from foods
- Manage water containers
- Drink container linked to a food
- Hydration factor
- Primary container
- Meal type linked to the container
- Passkeys
- About / version
- What's New
- Server announcements
- Allergen preferences
- Custom nutrients
- Goal direction per nutrient
- Cycle and pregnancy settings
- Fasting settings
- Guided workout settings
- App theme

</details>

<details><summary>Discarded after verification: exists in neither client (1)</summary>

- Global notification icon (items to review) — SparkyFitnessFrontend/src/components/GlobalNotificationIcon.tsx:8-23 always returns null and the query is disabled (useNeedsReviewCountQuery(!!user && false)); mounted in MainLayout.tsx:528 but with …

</details>

### 2.13 Native mobile capabilities

#### Web only (7)

- **Sync with cloud health services (server-side alternative)** — OAuth connection with Garmin Connect, Fitbit, Withings, Polar, Strava, Oura, Coros, and Google Health, and API key connection with Hevy and Liftosaur. The server imports the data without going through the phone, with a dialog to choose the range.
  - Web (Yes): App.tsx:335-372 (OAuth callbacks /withings, /fitbit, /oura, /polar, /coros, /strava, /googlehealth); pages/Settings/ExternalProviderSettings.tsx; AddExternalProviderForm.tsx:157-240; GarminConnectSettings.tsx; SyncRangeDialog.tsx; utils/settings.ts:5-58
- **API keys for iPhone Shortcuts and external apps** — Create and revoke API keys that external apps, such as an iPhone Shortcut, use to send health data to the server (/health-data).
  - Web (Yes): pages/Settings/ApiSettings.tsx:169; translation.json:2374-2410 ('iPhone Health Shortcut')
  - _Verification: corrected during verification_
- **Health data import from CSV** — Upload of health measurements from a CSV file. It is the web alternative for bringing in history.
  - Web (Yes): pages/Settings/DataImportSettings.tsx:22 → pages/CheckIn/HealthDataImportCSV.tsx
- **Delete synced data by source** — Deletes all entries that came from a specific source (Apple Health, Garmin...) without touching manual entries.
  - Web (Yes): pages/Settings/DataManagementSettings.tsx:29-230; translation.json:2022-2035 ('deleteSynced')
- **Installable web app (PWA)** — The web app can be installed as a standalone app, with a self-updating service worker and shell caching.
  - Web (Yes): vite.config.ts:61-86 (VitePWA registerType autoUpdate, workbox navigateFallback); public/manifest.json (display standalone); index.html (apple-mobile-web-app-capable)
- **Import activities from FIT files** — Upload up to 10 .fit files exported from a watch or app. Each one becomes a diary entry with HR, laps and report data; re-uploading the same file updates its entry. This is the web's way to bring in the workout telemetry that mobile pulls from Apple Health or Health Connect.
  - Web (Yes): pages/Settings/DataImportSettings.tsx:27 and 217-226 ('garminFit' tool: 'Import workouts and activity data from binary .fit files'); pages/Exercises/ExerciseImportFit.tsx:33-59 ('Import FIT Files', useFitImport)
  - _Verification: added during verification_
- **Capture cloud provider responses for support** — The sync range dialog has troubleshooting modes: sync normally, sync and save the provider's raw responses on the server, or replay a saved file. It includes instructions for sharing the diagnostic bundle with the developer.
  - Web (Yes): pages/Settings/SyncRangeDialog.tsx:57 and 76 (SyncMode 'live' | 'capture' | 'replay'; saveMockData), 307-367 ('Troubleshooting' block visible with mockDataEnabled and privacy notice); pages/Settings/ProviderCard.tsx:1023-1036 (enable 'Allow Local Provider Response Capture' in Admin > Global Provider Settings and share the exported bundle)
  - _Verification: added during verification_

#### Mobile only (60)

- **Apple Health / Health Connect connection** · _Differs iOS/Android_ — Initializes the system health store, requests per-metric read permissions, warns when it is unavailable, and links to the system health settings. Accessed from Settings → 'Health Data Sync'.
  - Mobile (Yes): SettingsScreen.tsx:237-245 (Health Data Sync row → Sync); SyncScreen.tsx:190-197 (health settings name), 899-912 (unavailable messages); services/healthConnectService.ts (Android) and healthConnectService.ios.ts (iOS)
  - iOS/Android: iOS uses HealthKit (@kingstinct/react-native-healthkit) with the system permission sheet. Android requires Health Connect to be installed, with the permissions declared in app.config.ts:27-80. The 'Not medical advice' notice only appears on Android (SyncScreen.tsx:961-974).
  - _Verification: corrected during verification_
- **Manual health sync with range** — 'Sync Now' button with a selectable range (Today, 24 h, 3 days, 7 days, 30 days, 90 days, 6 months, 1 year). Offers 'Quick Sync' (keeps the map and HR of already-synced workouts) or 'All Sync' (re-reads them). Shows the last sync and the source. There is also a 'Sync Health Data' entry in the AddSh…
  - Mobile (Yes): SyncScreen.tsx:117-157 (ranges), 772-795 (Quick/All Sync), 885-893 (Sync Now), 917-943 (last sync and HealthSourceLabel); AddSheet.tsx:470; useAddSheetActions.ts:336
- **Selection of metrics to sync, with preview** · _Differs iOS/Android_ — Per-metric toggle, grouped by category (Common, Activity, Vitals, Body Measurements, Nutrition, Reproductive, Mobility, Running, Cycling, Apple), plus an 'enable all'. Shows the values read from the device in the selected range.
  - Mobile (Yes): SyncScreen.tsx:984-991 (HealthDataSync); components/HealthDataSync.tsx; HealthMetrics.ts:1076-1100 (platform filter and CATEGORY_ORDER)
  - iOS/Android: The list is filtered by each metric's `platforms` field (HealthMetrics.ts:1081-1083). The details of which metrics exist on each platform are in the next three rows.
- **Health metrics read on both platforms** · _Differs iOS/Android_ — Steps, active and total calories, HR, weight, blood pressure, nutrition, sleep, basal body temperature, basal metabolic rate, blood glucose, body fat %, body temperature, distance, exercise sessions, floors, height, hydration, lean body mass, respiratory rate, resting HR, HRV, VO2 max, SpO2, menstr…
  - **Updated in PRs #3019, #3034, #3042, #3091 and #3100 (merged):** Mindfulness sessions are now read on both platforms as a common metric: Android keeps the session type (meditation, breathwork, unguided or other), title and notes, while iOS sends every session as 'other' without notes. Sleep sessions now carry overnight HRV and resting heart rate on both platforms when those metrics are synced, and Android's daily heart rate average now gives each 5-minute stretch the same weight, while iOS keeps Apple Health's own daily average. Bone mass, wheelchair pushes and menstrual period still sync nothing on iOS.
  - Mobile (Yes): HealthMetrics.ts:54-445 and 492-503 (no platform restriction); HRV: separate entries at 387-400 (iOS) and 404-417 (Android); SpO2 and reproductive: Android entries at 521-617 and iOS entries at 636-718
  - iOS/Android: HRV, SpO2, and the reproductive metrics have a different definition on each platform. iOS also reads 'menstrual flow'. Bone mass (HealthMetrics.ts:492) and wheelchair pushes (435) appear in the iOS list, but have no identifier in HEALTHKIT_TYPE_MAP (healthkit/index.ts:232-290) and the read returns empty (index.ts:1929-1932). In practice they only work on Android.
  - _Verification: corrected during verification_
- **Apple Health-only metrics** · _iOS only_ — Blood alcohol; menstrual flow; walking speed, step length, asymmetry, and double support; ground contact time, stride length, power, vertical oscillation, and running speed; cycling speed, power, cadence, and FTP; Move, Exercise, and Stand minutes (Apple rings).
  - Mobile (Yes): HealthMetrics.ts:622-1072 (platforms: ['ios']); healthkit/index.ts:266-290 (HK identifiers)
  - iOS/Android: Stress (MindfulSession), dietary fat, protein, and sodium, and environmental and headphone audio exposure are defined with enabled:false (HealthMetrics.ts:185, 733, 749, 765, 1005, 1021), so they are not shown.
- **Health Connect-only metrics** · _Android only_ — Speed, power, elevation gained, body water mass (the server converts it to %), cycling pedaling cadence, and steps cadence.
  - Mobile (Yes): HealthMetrics.ts:450-518, 535-602 (platforms: ['android']); READ_SPEED/POWER/ELEVATION_GAINED/BODY_WATER_MASS/CYCLING_PEDALING_CADENCE/STEPS_CADENCE permissions in app.config.ts:27-70
  - iOS/Android: Health Connect only.
- **Background health sync** · _Differs iOS/Android_ — 'Enable Background Sync' toggle. Registers a periodic task (minimum interval of 240 min) with overlapping windows for sessions and per-day windows for cumulative metrics.
  - Mobile (Yes): components/SyncFrequency.tsx:17-46; SyncScreen.tsx:293-370 (toggle); services/backgroundSyncService.ts:366-414 (expo-background-task, minimumInterval 240); useAppStartup.ts:122-137
  - iOS/Android: Android requests the READ_HEALTH_DATA_IN_BACKGROUND permission when it is enabled (SyncScreen.tsx:296-330; app.config.ts:71). iOS, in addition to the task, starts HealthKit observers with background delivery that sync when new data arrives (healthkit/backgroundDelivery.ts:136-306; SyncScreen.tsx:337-360) and explains that it runs 'when the phone allows it' (SyncFrequency.tsx:38-45).
- **Sync when opening or returning to the app** — Toggle that triggers a sync on cold start and when returning to the foreground, with a cooldown window and coordination with background sync.
  - Mobile (Yes): components/SyncOnOpen.tsx; SyncScreen.tsx:979-982; hooks/useAutoSyncOnOpen.ts:151-161; services/autoSyncCoordinator.ts
- **Import full history (backfill)** · _Differs iOS/Android_ — 'Import History' screen for a one-time, resumable import of the entire history. It walks backward in 30-day windows and shows days imported, records written, and time remaining. It allows pausing, resuming, and starting over, and keeps the screen on while it runs.
  - Mobile (Yes): SyncScreen.tsx:947-958 (Import Full History row); ImportHistoryScreen.tsx:329-700; services/backfillService.ts; services/backfillCheckpoint.ts
  - iOS/Android: On Android, Health Connect limits daily reads and the import resumes on its own (ImportHistoryScreen.tsx:471-478). Without the READ_HEALTH_DATA_HISTORY permission it only reaches about 30 days (512-519; app.config.ts:72; patch patches/react-native-health-connect@4.1.3.patch). On iOS there are none of these limits.
  - _Verification: corrected during verification_
- **GPS routes and HR for synced workouts** · _Differs iOS/Android_ — When exercise sessions are synced, the HR samples, the GPS route, and the session metrics (calories, distance, steps) are attached.
  - Mobile (Yes): services/healthconnect/workoutTelemetry.ts; services/healthkit/workoutTelemetry.ts; healthkit/index.ts:190-202, 265 (HKWorkoutRoute)
  - iOS/Android: On Android the route requires per-session consent through the system dialog (requestExerciseRoute in workoutTelemetry.ts:140-172, 325-330; app.config.ts:41-46). On iOS the HKWorkoutRoute is read with the general authorization. On iOS, workouts written by the app's own Apple Watch are excluded to avoid duplicating them (isOwnWatchWorkout).
- **Nutrition write-back to Apple Health / Health Connect** — Option, off by default, to send the nutrition from the Sparky diary to the health store. It runs after each inbound sync and skips entries that were imported from that store.
  - Mobile (Yes): WritebackMetrics.ts:44-54; SyncScreen.tsx:992-997 (HealthDataWriteback); services/writeback.ios.ts → healthkit/writeback.ts; services/writeback.ts → healthconnect/writeback.ts; app.config.ts:75 (WRITE_NUTRITION)
- **Hydration write-back to Apple Health / Health Connect** — Option to send the water logged in Sparky to the health store.
  - Mobile (Yes): WritebackMetrics.ts:55-64; app.config.ts:76 (WRITE_HYDRATION); components/HealthDataWriteback.tsx
- **Delete data written by Sparky in the health app** — From the write-back section you can delete everything that was written or only a date range (DateRangeSheet), with confirmation and a warning if the deletion is partial.
  - Mobile (Yes): SyncScreen.tsx:520-590 (removeWrittenData and confirmation), 992-1001 (HealthDataWriteback and DateRangeSheet)
- **Health data report for support** · _Android only_ — Exports via the share sheet the last 4 h of Health Connect data, rounded and anonymized, to attach to bug reports.
  - Mobile (Yes): SyncScreen.tsx:1008-1050 ({isAndroid && ...} block); services/healthDiagnosticService.ts (expo-sharing)
  - iOS/Android: Only shown if Platform.OS === 'android'.
- **Calories widget** · _Differs iOS/Android_ — Shows the day's remaining, consumed, and burned calories, with 'Search food' and 'Scan barcode' buttons. Tapping it opens the Dashboard.
  - **Still open:** The consumed and burned view and the extra sizes or resizing planned for the Android calories widget are not in the code: it still shows only the kcal left, a bar and the search and scan buttons, at a fixed 2x1 on the home screen only. iOS keeps its small and medium sizes with food and burned calories, and the Lock Screen versions.
  - Mobile (Yes): iOS: targets/widget/widgets.swift:179-213, 280-324; Android: targets/android-widget/kotlin/.../CalorieWidget.kt.tmpl:91-157; plugins/withCalorieWidget.ts; hooks/useWidgetSync.ts:63-134; services/CalorieWidgetBridge.ts
  - iOS/Android: On iOS (WidgetKit) there are systemSmall and systemMedium sizes, plus Lock Screen accessories (widgets.swift:319-322); the buttons are on the medium one. On Android (Glance) it is only available on the home screen, at 2x1 and not resizable (res/xml/sparky_calorie_widget_info.xml).
  - _Verification: corrected during verification_
- **Macros widget** · _Differs iOS/Android_ — Shows the day's protein, carbs, and fat and the remaining calories, with shortcuts to search and scan.
  - **Still open:** The extra sizes or resizing planned for the Android macros widget are not in the code: it is still a fixed 2x2 on the home screen only. iOS keeps its small and medium sizes and the Lock Screen versions.
  - Mobile (Yes): iOS: targets/widget/macroWidget.swift:248-266, 396-428; Android: MacroWidget.kt.tmpl:89-104, 251; res/xml/sparky_macro_widget_info.xml
  - iOS/Android: iOS has small and medium sizes and Lock Screen versions. Android only has a home screen widget.
- **Interactive water widget** · _iOS only_ — Shows the day's water with − and + buttons that remove or add a drink without opening the app.
  - **Updated in PR #3020 (merged):** Android now has an interactive water widget too: a 2x2 home-screen widget with today's water against the goal, a bar, and − and + buttons that remove or add one drink of the container chosen on the Dashboard without opening the app. It comes in one fixed size with no Lock Screen versions, while iOS offers small and medium sizes and three Lock Screen shapes.
  - Mobile (Yes): targets/widget/waterWidget.swift:152-165 (Button(intent: RemoveWaterIntent/LogWaterIntent)), 250-264; targets/widget/index.swift:10
  - iOS/Android: Android has no water widget: targets/android-widget only includes Calorie and Macro.
- **Lock Screen widgets** · _iOS only_ — accessoryCircular, accessoryRectangular, and accessoryInline versions of the calories, macros, and water widgets.
  - Mobile (Yes): widgets.swift:319-322; macroWidget.swift:423-426; waterWidget.swift:260-263
  - iOS/Android: Android widgets declare widgetCategory="home_screen".
- **Control Center and Lock Screen controls** · _iOS only_ — Seven controls: Log water, Remove water, Calories remaining (opens the diary), Start fast, End fast, Scan food, and Log food. The last two open the app and pass the destination screen through the app group.
  - **Partly covered by PRs #2989 and #3020 (merged):** Android has four Quick Settings tiles as counterparts: Log water (logs a drink in the background, also from the lock screen), Scan barcode, Search food and Calories left (today's kcal left; opens the diary). Remove water, Start fast and End fast have no tile; on the phone, the only way to remove a drink without opening the app is the − button on the home screen water widget. The Log water tile does not show the day's total like the iOS control; on Android that total is on the water widget.
  - Mobile (Yes): targets/widget/index.swift:9-18 (if #available(iOS 18.0)); targets/widget/Controls.swift:11-146; ShortcutIntents.swift:455-497; hooks/useQuickActions.ts:162-170 (useControlRouteHandoff)
  - iOS/Android: Requires iOS 18 or later.
- **Siri and Shortcuts actions (App Intents)** · _iOS only_ — 'Log water' (1-20 drinks), 'Remove a water drink', 'Start fast' (1-72 h, 16 by default), 'End fast', and 'Log weight' (20-700, in the user's unit). They can be launched from Siri, Spotlight, the Shortcuts app, and the Action button, and they run without opening the app.
  - Mobile (Yes): plugins/ios/ShortcutProvider.swift:9-38; targets/widget/ShortcutIntents.swift:260-420; plugins/withBackgroundWater.ts:1-35; modules/background-water/ios/BackgroundWaterModule.swift; services/backgroundWater.ts (credentials to run without opening the app)
  - iOS/Android: Requires iOS 16 or later. Siri phrases are only in English (ShortcutProvider.swift:13-34).
  - _Verification: corrected during verification_
- **App icon quick actions (long press)** · _iOS only_ — Four actions: Scan food, Log food, Log water (logs a drink from the primary container without opening any screen), and Fasting.
  - **Updated in PRs #2989 and #3051 (merged):** Android now has these app icon actions too: Scan food, Log food and Fasting through expo-quick-actions, and Log water as the native shortcut, which logs without opening the app. Both platforms take the titles from the same quickActions strings, translated in 10 of the 15 other languages the app ships (Hungarian, Italian, Latvian, Norwegian and Russian still show English). On Android the Log water result messages are still English-only, and the shortcut's long label is translated only into Spanish, Polish, Brazilian Portuguese, Simplified and Traditional Chinese and Cantonese.
  - Mobile (Yes): hooks/useQuickActions.ts:26-49 (items), 115-131 (actions), 142 (if Platform.OS !== 'ios' return); App.tsx:219 (QuickActionsGate)
  - iOS/Android: On Android only the 'Log water' shortcut exists (next row).
- **'Log water' shortcut in the Android launcher** · _Android only_ — Dynamic app icon shortcut that logs a drink in the background with WorkManager, without opening the app, and confirms with a toast.
  - **Updated in PRs #2989, #3020 and #3051 (merged):** The short label comes from the app's quickActions strings, translated in 10 of the 15 other languages the app ships; the long label is translated only into Spanish, Polish, Brazilian Portuguese, Simplified and Traditional Chinese and Cantonese. The shortcut is put back after the expo-quick-actions items replace the dynamic list, no longer brings the app to the front and sits beside Scan food, Log food and Fasting, and a drink logged from it also updates a placed water widget. The result Toast is still English-only and only shows while the app's notifications are on (on HyperOS, its floating notifications too).
  - Mobile (Yes): targets/android-background-water/kotlin/.../BackgroundWaterModule.kt:21-43 (pushDynamicShortcut); LogWaterActivity.kt:23-60; plugins/withBackgroundWater.ts:7-10
  - iOS/Android: The 'Log water' label is hardcoded in English (BackgroundWaterModule.kt:33-34). Unlike iOS, there are no shortcuts for scanning, searching, or fasting.
- **Language of widgets, Live Activities, and native surfaces** · _Differs iOS/Android_ — Widgets, the Live Activity, and the other native surfaces reload in the app's effective language when it changes.
  - **Partly covered by PRs #2989, #3020, #3025, #3051 and #3052 (merged):** On Android the calorie, macro and water widgets, the Quick Settings tiles and the app icon shortcuts follow the app language and update when it changes; the water widget texts, the Log water and Calories left tile names and the Log water shortcut's long label are translated only into Spanish, Polish, Brazilian Portuguese, Simplified and Traditional Chinese and Cantonese, and the Log water results stay English-only. iOS has the same six translations for its water widget and controls, but its hook still reduces the language to en/pl and reloads only the calorie and macro timelines; on both platforms the shortcut titles are untranslated in Hungarian, Italian, Latvian, Norwegian and Russian and the Latvian widget strings are empty. The Wear OS app's own texts are English-only, as are the Apple Watch app's.
  - Mobile (Partial): App.tsx:329-330 (useWidgetLanguageRefresh, useIOSWidgetLanguageRefresh); targets/android-widget/kotlin/.../WidgetLocale.kt.tmpl, WidgetLocaleApi33.kt.tmpl; targets/widget/en.lproj
  - iOS/Android: Android uses its own resources and locale for Glance. iOS uses Localizable.strings and reloads via ExtensionStorage.
  - _Verification: corrected during verification_
- **Workout Live Activity (Lock Screen and Dynamic Island)** · _iOS only_ — Shows the workout name, the elapsed time, the exercise with 'Set X of Y', and the target with a Complete button. During rest it shows the countdown with −15 s, +15 s, and Skip. Tapping it opens the active workout.
  - Mobile (Yes): services/WorkoutLiveActivityLayout.tsx:316-349 (rest-add-15, rest-subtract-15, rest-skip, complete-set buttons); services/workoutLiveActivity.ios.ts:486; App.tsx:452 ('active-workout' link); app.config.ts:300-312 (expo-widgets)
  - iOS/Android: The buttons require iOS 17 or later. A tap made after force-quitting the app is lost. workoutLiveActivity.ts is a no-op on Android.
- **Persistent workout notification (Android)** · _Android only_ — Ongoing notification with the exercise, set progress, and rest. On Android 16+ it uses ProgressStyle with one segment per exercise and requests the 'Live Update' status chip (for example, 3/16).
  - Mobile (Yes): services/workoutLiveActivity.android.ts:12-60; targets/android-workout-notification/kotlin/.../WorkoutNotificationModule.kt:40-95 (SDK_INT >= 36 and ProgressStyle); RestDeadlineReceiver.kt; plugins/withWorkoutNotification.ts; app.config.ts:29 (POST_PROMOTED_NOTIFICATIONS)
  - iOS/Android: It has no buttons (the module does not use addAction), unlike the iOS Live Activity controls. Below Android 16 it is a regular ongoing notification showing overall progress.
- **Run and GPS recording Live Activity** · _iOS only_ — Shows the phone's GPS recording or the watch run (time, distance, pace) on the lock screen and the Dynamic Island, with Pause/Resume and Lap buttons. Opens Record Activity.
  - Mobile (Yes): services/RunLiveActivityLayout.tsx:118-134 (run-toggle, run-lap); services/runLiveActivity.ios.ts:460; App.tsx:454 ('record-activity' link); services/runLiveActivity.ts (no-op on Android)
  - iOS/Android: On Android there is only the fixed foreground service notification ('Recording your activity / Tracking your run with GPS', utils/recordingNotification.ts:7-25), with no live stats or buttons.
- **GPS activity recording (walk, run, bike; outdoor or indoor)** · _Differs iOS/Android_ — Records with GPS in the background, with a live map, distance, pace, elevation, HR, laps, auto-pause, countdown, intervals, and pace or HR ranges, and saves the result to the diary. Opened from the AddSheet, the diary, and running programs.
  - **Partly covered by PRs #3052, #3090 and #3154 (merged):** With a paired Wear OS watch, Android now offers 'Record with: Phone GPS / Watch GPS' for walks and runs, as iOS does with an Apple Watch, and the watch streams heart rate to a phone-GPS recording; fitness tests also open this screen, always with the phone. A walk or run recorded on the Wear OS watch reaches the phone with its GPS points and lap marks in a shape the phone drops, and heart rate times in seconds from the start instead of clock times, so it is saved with no map, splits or laps. The Route picker for following a saved route also shows on Android when recording outdoors on the watch, but the Wear OS app ignores the chosen route.
  - Mobile (Yes): screens/RecordActivityScreen.tsx:226-239, 1030-1160, 1520-1650; services/gpsRecordingService.ts:1115-1137; hooks/useAddSheetActions.ts:324
  - iOS/Android: iOS uses the 'location' background mode with the blue pill (app.config.ts:200; gpsRecordingService.ts:1130). Android uses a foreground service with a notification (gpsRecordingService.ts:1131-1135) and shows a battery tip, 'Recording with the screen off', with a link to dontkillmyapp.com (RecordActivityScreen.tsx:1443-1466). The 'Record with: Phone/Watch' option only appears with a paired Apple Watch (RecordActivity…
- **Indoor distance with the phone's pedometer** · _Differs iOS/Android_ — Counts steps to estimate the distance of indoor walks and runs, and learns stride length from outdoor recordings.
  - Mobile (Yes): services/stepCounter.ts:40-95; modules/step-counter/android/.../StepCounterModule.kt; services/strideCalibration.ts; hooks/useIndoorDistanceEstimate.ts; app.config.ts:267-270 (motionUsagePermission)
  - iOS/Android: iOS queries CMPedometer for the steps in the window when the session ends. Android stores the hardware counter at the start and subtracts it at the end (custom native module); if the phone reboots midway, there is no estimate.
- **Export the route as GPX** — Shares a cardio session's route as a GPX file via the system share sheet.
  - Mobile (Yes): screens/CardioSessionScreen.tsx:203-215, 305-312; services/gpxExport.ts:11 (shareRouteAsGpx)
- **Apple Watch companion app** · _iOS only_ — watchOS 10+ app with swipeable pages. It receives context from the iPhone via WatchConnectivity and sends logs back to it; the watch does not talk to the server directly.
  - **Updated in PR #3052 (merged):** Android now has a Wear OS companion app (Wear OS 3 or later) with the same pages, in the order and visibility set on the phone: Goals, Water, Medications, Weight, Trend, Workout, Fasting and Steps, plus Now Playing during a workout. Like the Apple Watch app, it talks only to the phone (through the Wearable Data Layer), never to the server. Only the Apple Watch has saved routes, indoor Jump Rope, the effort rating after a workout or run, double tap, and the choice between keypad and crown set input (Wear OS always adjusts the selected value with the rotary crown).
  - Mobile (Yes): targets/watch/expo-target.config.js:86-94; targets/watch/Presentation/ContentView.swift; modules/watch-connectivity/index.ts:905-907; App.tsx:479-481 (WatchCheckInGate, WatchWorkoutGate)
  - iOS/Android: The watch-connectivity module returns null on Android. There is no Wear OS app.
- **Apple Watch settings on the phone** · _iOS only_ — Order and visibility of the watch pages, Goals page nutrients, 'Double-tap to log a set', 'Ask for effort (RPE) after each set', and the set input method (keypad or Digital Crown).
  - **Updated in PR #3052 (merged):** Android now shows a Wear OS row in Settings once a Wear OS watch has connected to the phone. It opens the same screen with the RPE switch, page order and visibility, and the Goals page nutrients; Double-tap to log a set and the choice between keypad and Digital Crown set input are iOS only. The Wear OS description of the RPE switch (5 to 10, rotary crown or +/−) is English in every language, while the Apple Watch one is translated in 6 of the 15 other shipped languages.
  - Mobile (Yes): SettingsScreen.tsx:54-55 (isPaired), 368-376 (Apple Watch row); screens/WatchSettingsScreen.tsx:124-245; constants/watchPages.ts:10-19, 55-60
  - iOS/Android: The row only appears if WatchConnectivity.isSupported() and isPaired() return true.
- **Watch Goals page** · _iOS only_ — Calorie ring and the nutrients chosen on the phone (protein, carbs, and fat by default, or any others, including custom ones).
  - **Updated in PR #3052 (merged):** Wear OS now has the Goals page too: a calorie ring with what was eaten against the goal, the calories left or over, and the nutrients chosen on the phone (protein, carbs and fat by default, custom ones included). Unlike the Apple Watch, it does not show calories burned.
  - Mobile (Yes): targets/watch/Presentation/GoalSummaryView.swift; utils/watchNutrients.ts; hooks/useWatchCheckInBridge.ts
  - iOS/Android: Apple Watch only.
- **Watch Water page** · _iOS only_ — Log water from the wrist and see the day's total ('includes X from food' if enabled), with the list of entries and the option to delete each one.
  - **Updated in PR #3052 (merged):** Wear OS now has the Water page too: one button per water container, today's total against the goal with 'Includes X from food', and the day's drinks, each removable after a 'Remove Drink?' prompt. It also has an Undo Last button, which the Apple Watch lacks and which removes the latest drink without asking, and when no containers have synced it shows placeholder Glass (250 ml) and Bottle (500 ml) buttons, where the Apple Watch shows a message instead.
  - Mobile (Yes): targets/watch/Presentation/WaterIntakeView.swift; WaterLogView.swift:68-124; utils/watchWater.ts
  - iOS/Android: Apple Watch only.
- **Watch Medications page** · _iOS only_ — Lists today's scheduled doses and 'as needed' medications. One tap marks the dose as taken and another unmarks it; skipping doses and repeating as-needed doses are done on the phone.
  - **Updated in PR #3052 (merged):** Wear OS now has the Medications page: the same list the phone sends, with a count of doses taken, and a tap marks a dose as taken or unmarks it. Skipping a dose is still done on the phone. Unlike the Apple Watch, it shows no sync status or retry, and does not show which doses were skipped.
  - Mobile (Yes): targets/watch/Presentation/MedicationsView.swift; utils/watchMedications.ts; useWatchCheckInBridge.ts
  - iOS/Android: Apple Watch only.
- **Weight check-in and trend on the watch** · _iOS only_ — Log weight and body fat % from the watch (with the difference from the last measurement and a warning for sudden changes) and view the weight trend.
  - **Updated in PR #3052 (merged):** Wear OS now has the weight check-in and the Trend page: weight set with the rotating crown or bezel, +/− or a keypad, optional body fat %, the change since the last weigh-in with a warning for a sudden change, a starting weight when there is no history, and a chart of the last 14 weight entries with a rolling average, or of body fat. Unlike the Apple Watch, it does not say when it is replacing today's entry and does not show the body fat change since the last entry or warn about a sudden one.
  - Mobile (Yes): targets/watch/Presentation/CheckInEntryView.swift:12-31, 140-168; TrendView.swift:107; Application/CheckInStore.swift
  - iOS/Android: Apple Watch only.
- **Watch Fasting page** · _iOS only_ — Timer for the current fast. Lets you start a 16:8, 18:6, or 20:4 fast, or end the current one with confirmation.
  - **Partly covered by PR #3052 (merged):** Wear OS now has a Fasting page with the elapsed time and progress against the goal, End Fast (with no confirmation step), and a Fasting complication. Starting a fast from it does not work: it offers 16:8, 18:6, 20:4 and OMAD but sends the label ('16:8') where the phone expects a preset id ('16-8'), so the phone rejects every start and no fast is saved.
  - Mobile (Yes): targets/watch/Presentation/FastingView.swift:44-107; hooks/useWatchFastingBridge.ts
  - iOS/Android: Apple Watch only.
- **Watch Steps page** · _iOS only_ — Today's steps against a fixed goal of 10,000.
  - **Updated in PR #3052 (merged):** Wear OS now has a Steps page with today's steps against the person's step goal (10,000 when none is set), plus a Steps complication. Unlike the Apple Watch, which only shows the phone's count, it also uses the watch's own step sensor when that reads higher.
  - Mobile (Yes): targets/watch/Presentation/StepsView.swift; useWatchCheckInBridge.ts (steps, stepGoal)
  - iOS/Android: Apple Watch only.
  - _Verification: corrected during verification_
- **Strength workout tracking on the watch** · _iOS only_ — When a workout starts on the phone, the plan is sent to the watch and the watch app opens automatically. From the wrist you log sets (keypad or Digital Crown, double tap), the rest timer is synced (±15 s, Skip) with a vibration when it ends, HR is measured in the background with HKWorkoutSession, a…
  - **Updated in PR #3052 (merged):** On Wear OS too, a workout started on the phone is sent to the watch and brings the app to the front; sets are logged one per screen with the rotating crown or bezel or a keypad, heart rate is read in a foreground service and sent to the phone, and a Now Playing page appears during the workout. The rest timer has +15 s and Skip and vibrates when it ends, but a rest started or changed on the phone does not show on the watch (the watch's changes do reach the phone). There is no double tap and no −15 s button.
  - Mobile (Yes): targets/watch/Presentation/WorkoutView.swift; Application/WorkoutSessionStore.swift; Infrastructure/WorkoutHealthKitController.swift; Presentation/NowPlayingPage.swift; Domain/WatchPage.swift:13; hooks/useWatchWorkoutBridge.ts; useWatchSetTargetsSync.ts; modules/watch-connectivity/ios/WatchConnectivityModule.swift:285 (startWatchApp)
  - iOS/Android: Double tap requires watchOS 11 and a compatible watch.
- **Start and edit workouts from the watch** · _iOS only_ — Lists saved workouts and those scheduled for today, and lets you start them from the wrist. During the workout you can add or delete a set, change its type, add or delete exercises, and finish or discard.
  - **Updated in PRs #3010 and #3052 (merged):** Wear OS now lists saved workouts and those scheduled for today and starts them from the wrist; during the workout you can add or delete a set, change its type, add, delete or skip an exercise, jump to any set, and finish or discard, but without the confirmations the Apple Watch asks for. On both watches a workout started from the wrist now gets the phone's progression targets and PR detection even if the phone's workout screen is never opened, and neither watch can replace an exercise yet.
  - Mobile (Yes): targets/watch/Presentation/WorkoutEditPages.swift; hooks/useWatchWorkoutStart.ts; useWatchWorkoutEdit.ts; useWatchPlanSync.ts; utils/workoutPlanSchedule.ts
  - iOS/Android: 'Replace exercise' is not available on the watch yet.
- **Workout finish on the watch** · _iOS only_ — Celebrates personal records with a banner and vibration, shows a summary (duration, sets, volume, average and max HR, energy), and saves an HKWorkout to Apple Health, which counts toward the rings. If the workout came from a template and was changed, it asks 'Update workout?'.
  - **Updated in PRs #3052 and #3065 (merged):** Wear OS now also celebrates a new PR with a banner and a vibration, asks 'Update Preset?' when a workout from a preset was changed on the watch, and ends with a summary of sets, duration, average heart rate and calories (estimated from heart rate). It does not show volume or maximum heart rate, does not save the workout to Health Connect, and lacks the 1–10 'How hard was that?' effort rating that the Apple Watch summary now asks for and saves to the server and, on watchOS 11 or later, to Apple Health.
  - Mobile (Yes): Application/WorkoutSessionStore.swift (makeSummary, celebratedPrSetIds); App.tsx:482 (PendingPresetUpdatePrompt); hooks/useWorkoutCompletePresetSync.ts; services/healthkit/dataTransformation.ts (isOwnWatchWorkout)
  - iOS/Android: Apple Watch only.
- **Standalone run or walk on the watch** · _iOS only_ — Outdoor or indoor, using the watch's own GPS and HR: auto-pause, voice cues, pace and HR alerts, laps, treadmill distance correction at the end, and a summary. The phone follows it live in 'WatchRunLive' and can pause, mark a lap, finish, or discard.
  - **Updated in PRs #3052, #3065, #3069, #3090 and #3127 (merged):** Wear OS now records a run or walk on its own too: outdoors with the watch GPS or indoors, with plans, pace and heart-rate alerts, auto-pause, spoken cues, laps, treadmill distance correction and a summary, and the phone follows and controls it on WatchRunLive. Only the Apple Watch offers indoor Jump Rope, following a saved route (map, turn cues and off-route warning) and the effort rating after the run. Wear OS runs are also saved without cadence or stride, because the watch sends no step count and Android has no other source for one.
  - Mobile (Yes): targets/watch/Presentation/WatchRunView.swift:29-311; Application/WatchRunStore.swift; Infrastructure/WatchRunHealthKitController.swift, WatchRunCues.swift; screens/WatchRunLiveScreen.tsx; hooks/useWatchRunBridge.ts; App.tsx:611-612
  - iOS/Android: Apple Watch only.
- **Control the phone's GPS recording from the watch** · _iOS only_ — While the phone records the route, the watch shows time, distance, pace, and HR, lets you pause, resume, mark a lap, or finish, and sends HR, which is attached to the activity.
  - **Updated in PR #3052 (merged):** Wear OS now works as a remote for the phone's GPS recording too. It shows time, distance, pace, heart rate and the current plan step, has Pause/Resume, Lap and Stop, and sends the watch's heart rate to be attached to the activity. Unlike the Apple Watch, it shows no summary when the recording ends.
  - Mobile (Yes): targets/watch/Presentation/RecordingView.swift:14-109; hooks/useWatchRecordingBridge.ts:30-45
  - iOS/Android: Apple Watch only.
- **Apple Watch face complications** · _iOS only_ — Calories, Water, Protein, Carbs, Fat, Fasting, and Steps, in circular, corner, rectangular, and inline sizes. Tapping them opens the corresponding page.
  - **Updated in PR #3052 (merged):** Wear OS now has the same seven complications: Calories, Protein, Carbs, Fat, Water, Fasting and Steps, each as a ranged value (gauge) or short text. A tap opens the Goals page for calories and macros, or the Water, Fasting or Steps page. The sizes differ: on the Apple Watch, Calories and Water are circular only and the rest also come in corner, rectangular and inline.
  - Mobile (Yes): targets/watch-widget/index.swift:5-14; MacroComplications.swift; FastingComplication.swift; StepsComplication.swift; ComplicationLinks.swift
  - iOS/Android: Apple Watch only.
  - _Verification: corrected during verification_
- **Master switch and notification permission** — 'Allow Notifications' switch for all alerts, a warning when the system has denied them, and a shortcut to the system settings.
  - Mobile (Yes): AppSettingsScreen.tsx:228-238; NotificationSettingsScreen.tsx:231-250; services/notifications.ts:246-315; components/NotificationPermissionBanner.tsx, OSDeniedWarningCard.tsx
- **Rest-complete alert with 'Complete Set' action** · _Differs iOS/Android_ — Scheduled 'Rest complete' notification with a button to complete the set from the notification itself. Enabled with the 'Rest Timer' switch.
  - Mobile (Yes): services/notifications.ts:93-101 (category), 381-430 (scheduleRestNotification); NotificationSettingsScreen.tsx:256-275
  - iOS/Android: On iOS it is marked 'timeSensitive' and breaks through Focus modes (app.config.ts:212; notifications.ts:404-408). On Android it depends on the exact alarm permission (see native-notif-exact-alarm), and the notification is dismissed manually after tapping the action (notifications.ts:457).
- **Hydration reminders** — Reminder to drink water after N hours without logging, only within a configurable time window (start and end).
  - Mobile (Yes): services/notifications.ts:585-632; NotificationSettingsScreen.tsx:399-470; components/HydrationReminderReconciler.tsx (DashboardScreen.tsx:36); hooks/useHydrationReminder.ts
- **Reminder for a still-open symptom episode** — 24 h after an episode is opened, asks whether it is still active, with the 'End now' and 'Still ongoing' actions.
  - Mobile (Partial): services/symptomReminderService.ts:17-90; hooks/useSymptoms.ts; useAppStartup.ts:81
  - _Verification: corrected during verification_
- **Exact alarm permission** · _Android only_ — When a workout starts, prompts once to enable 'Alarms & reminders' so that rest timers and medication alerts fire on time (without it, Android delays them by about 15 s).
  - Mobile (Yes): services/notifications.ts:336-379; services/ExactAlarmBridge.ts; targets/android-exact-alarm/kotlin/.../ExactAlarmModule.kt; plugins/withExactAlarmModule.ts; app.config.ts:80
  - iOS/Android: Since Android 13 this special access is denied by default.
  - _Verification: corrected during verification_
- **Haptic feedback** — Subtle vibrations on timers and confirmations, with a 'Haptic Feedback' switch. It also determines whether the Apple Watch vibrates when rest ends or on a record.
  - **Updated in PR #3052 (merged):** The phone switch still works the same on both platforms. The Wear OS watch on Android does not follow it: it vibrates on button presses, as rest ends and on a new record even with the switch off, while the Apple Watch skips those vibrations when it is off.
  - Mobile (Yes): AppSettingsScreen.tsx:240-252; services/haptics.ts:6-20 (expo-haptics)
- **Lower music during cues** — Briefly lowers other apps' music while a workout beep or voice cue plays.
  - Mobile (Yes): WorkoutSettingsScreen.tsx:184-202; services/sounds.ts:84 (interruptionMode duckOthers)
- **Voice cues during GPS recording** — Spoken announcements (start, pause, auto-pause, resume, km or mile splits, interval steps) that can be enabled with 'Voice cues'.
  - Mobile (Yes): RecordActivityScreen.tsx:1150-1160; services/recordingCues.ts:29-55; utils/recordingCues.ts:23-25
- **Keep the screen on** — Prevents the screen from turning off during an active workout (via a switch, and always in guided mode) and during history import.
  - Mobile (Yes): WorkoutSettingsScreen.tsx:204-222; components/ActiveWorkoutKeepAwake.tsx:9-23 (App.tsx:1320); ImportHistoryScreen.tsx:17, 484
- **On-device label reading (Apple Intelligence)** · _iOS only_ — Reads 'Nutrition Facts' and 'Supplement Facts' with the iPhone's local model and, if that fails, falls back to the server AI. It has a switch in AI Settings and a 'Label read on this iPhone' notice.
  - Mobile (Yes): modules/on-device-nutrition/index.ts:44-50 (isAvailable: iOS 27+ with Apple Intelligence); ios/OnDeviceNutritionModule.swift; services/onDeviceLabelScan.ts:15, 251; onDeviceSupplementScan.ts:177; AiSettingsScreen.tsx:61-140; FoodScanScreen.tsx:582-615
  - iOS/Android: iOS 27+ only, with Apple Intelligence enabled. On Android the module is null.
- **Shutter sound** — 'Camera shutter' switch to turn the sound on or off when taking photos in the scanner.
  - Mobile (Yes): AppSettingsScreen.tsx:254-265; FoodScanScreen.tsx:88, 726 (shutterSound)
- **Liquid Glass navigation (iOS 26)** · _iOS only_ — Option to use the native tab bar and headers with iOS 26 glass.
  - Mobile (Yes): AppSettingsScreen.tsx:211-226; services/nativeTabBarPreference.ts:13, 26; components/TabsLayout.tsx; patches/react-native-bottom-tabs@1.4.0.patch
  - iOS/Android: The row only appears if canUseLiquidGlass() is true. Android always uses CustomTabBar.
- **sparkyfitnessmobile:// deep links** — Routes '' (Dashboard), scan, search, settings/voice, active-workout, and record-activity, used by widgets, Live Activities, and controls. They only work after onboarding.
  - **Updated in PRs #2989, #3020, #3071 and #3078 (merged):** There are now also routes for the diary ('diary', opened by the Android Calories left Quick Settings tile), the heart rate zone settings ('settings/heart-rate-zones') and route generation ('routes/generate'); no widget, tile or Live Activity uses the last two. The Scan barcode and Search food tiles use scan and search, and a tap outside the Android water widget's buttons opens the Dashboard through the root link, as on iOS. On Android only, a link or shortcut that started the app does not reopen its screen when Android restores the app after the system killed it (withQuickActionLaunchGuard).
  - Mobile (Yes): App.tsx:439-458 (linking), 466-476 (enabled after leaving Onboarding)
- **Local logs and diagnostic report** — 'View Logs' screen and 'Share Diagnostic Report' button, which exports version, sync status and logs without personal data.
  - Mobile (Yes): SettingsScreen.tsx:389-420; services/diagnosticReportService.ts (expo-sharing); services/LogService.ts
- **Self-hosted server management** · _Differs iOS/Android_ — Multiple saved servers; mark one as active, test the connection or open the web app; sign in with username or with API key; proxy headers; HTTPS required in production.
  - Mobile (Yes): screens/ServerSettingsScreen.tsx:335-500; components/ServerConfigModal.tsx:62-188; services/storage.ts (proxyHeaders)
  - iOS/Android: Android production builds trust user-installed CAs, useful with self-signed certificates (plugins/withNetworkSecurityConfig.ts:24-27; app.config.ts:134). iOS asks for local network permission for servers on the LAN (NSLocalNetworkUsageDescription, app.config.ts:171).
- **Live HR and HR range targets during GPS recording** · _iOS only_ — During GPS recording (or when recording from the watch), HR is shown and target HR ranges can be set: overall, work, easy and warm-up in intervals. Pace targets do not require a watch.
  - **Updated in PRs #3052 and #3078 (merged):** On Android a paired Wear OS watch now supplies the heart rate, so the heart rate range cards (overall, and work, easy and warm-up in intervals) appear and alert both when the phone records with its GPS and when the watch records the walk or run. As on iOS, there is no heart rate without a watch, none for rides and no support for Bluetooth heart rate monitors; on both platforms the suggested interval ranges now follow the heart rate zones from settings. The main card's Android description ('Needs your Wear OS watch…') is English-only, while the Apple Watch one is translated into six languages.
  - Mobile (Yes): screens/RecordActivityScreen.tsx:146-158 (default bands), 268-269 (watchAvailable = watchSupported && watchPaired && activity !== 'ride'), 407 (HR warm-up only with watch), 497, 1200-1201 and 1316-1345 (HeartRateBandCard only with watchAvailable); hooks/useWatchRecordingBridge.ts:251 (HR from the watch)
  - iOS/Android: A paired Apple Watch is required, so it only works on iOS and not for rides. On Android, GPS recording has no HR or HR targets; only pace targets. Bluetooth heart rate monitors are not supported.
  - _Verification: added during verification_
- **Scan a supplement label or barcode to fill in the medication** · _Differs iOS/Android_ — In the medication form, mobile offers 'Scan label to fill in': it takes a photo with the camera or picks one from the gallery, and the 'Supplement Facts' label is read first with the on-device model (iOS 27+) and otherwise with the server AI. It also offers 'Scan barcode to fill in', which opens Fo…
  - Mobile (Yes): screens/MedicationFormScreen.tsx:181 (useSupplementLabelScan), 276-306 (ImagePicker.launchCameraAsync or launchImageLibraryAsync), 959-999 ('Scan barcode to fill in' → FoodScan and 'Scan label to fill in'); hooks/useSupplementLabelScan.ts:23-28 (onDeviceSupplementScan first, then the server); services/api/medicationsApi.ts:56-62 (POST /api/v2/medications/supplement-label/scan); server: routes/v2/medicationRoutes.ts:…
  - iOS/Android: Available on both platforms through the server. Only on iOS 27+ with Apple Intelligence (and the AiSettingsScreen toggle on) is on-device reading attempted first (modules/on-device-nutrition/index.ts:44-59, null on Android).
  - _Verification: added during verification_

#### In both, with differences (6)

- **Watch HR during and after the workout** · _Differs iOS/Android_ — Live HR on each exercise card, average and max HR in the summary and in the workout detail, and an HR zone breakdown.
  - **Updated in PRs #3052 and #3078 (merged):** Android now gets live heart rate from a Wear OS watch, which streams it during a workout: the exercise cards show it live, and its samples give the same average, max and zone figures afterwards. Without a watch, Android still has no live heart rate. Zones are now worked out from each person's heart-rate zone settings, except Apple Watch sessions on watchOS 27, which keep Apple's own zones, and the zone bars say which method was used.
  - Web (Partial): Web shows HR zones for saved workouts (translation.json:4846), but not live HR.
  - Mobile (Yes): stores/liveHeartRateStore.ts; components/ActiveWorkoutExerciseCard.tsx; screens/WorkoutCompleteScreen.tsx; hooks/useWorkoutHeartRateZones.ts
  - iOS/Android: Live HR only comes from an Apple Watch, i.e., only on iOS. Saved figures from synced workouts are visible on both platforms.
- **Fasting alerts (goal reached and advance warning)** — Notifies when the fasting goal is reached and a few minutes before (30 by default, configurable between 0 and 180).
  - Web (Partial): pages/Settings/FastingSettings.tsx:48-72, 245 lets you configure 'Pre-Goal Warning (minutes)' and 'Goal & Eating Window Notifications' as server preferences, but web does not send notifications.
  - Mobile (Yes): services/notifications.ts:486-583; components/FastingGoalReconciler.tsx:15-27 (mounted in DashboardScreen.tsx:35); NotificationSettingsScreen.tsx:277-295; FastingSettingsScreen.tsx:77-153
- **Medication reminders** — A notification for each scheduled dose with 'Taken' and 'Skip' actions, plus options to repeat reminders, hide the medication name, and group simultaneous reminders.
  - **Updated in PRs #2985 and #3005 (merged):** Each reminder, single or grouped, now also has a button on both platforms to be reminded again after 10, 15, 30 or 60 minutes, as chosen in Notification settings. On Android the Taken, Skip and snooze buttons now also work while the app is in the background or closed, and on both platforms an action that fails is saved and retried later. The web still only sets the schedules and delivers no reminders.
  - Web (Partial): Web configures the schedules ('Schedules & Reminders', translation.json:703-704; pages/Medications/AddMedicationDialog.tsx) that the reminders are generated from, but does not deliver them.
  - Mobile (Yes): services/notifications.ts:103-142 (categories), 144; services/medicationReminderService.ts; medicationNotificationHandler.ts:22-30; NotificationSettingsScreen.tsx:299-395; App.tsx:1321 (MedicationReminderReconciler)
- **Rest-complete sound and 'Play through silent mode'** · _Differs iOS/Android_ — Chime when rest ends, with the option to play it even when the phone is on silent.
  - Web (Partial): Web Audio tones when rest or an interval ends, only while the tab is visible (pages/Diary/WorkoutPlaybackPage.tsx:535-576; utils/workoutSounds.ts). There is no silent mode option.
  - Mobile (Yes): WorkoutSettingsScreen.tsx:134-182; services/sounds.ts:32-120
  - iOS/Android: On iOS, with 'silent mode' enabled, it also plays in the background and with the screen locked thanks to a silent track (UIBackgroundModes 'audio', app.config.ts:200; sounds.ts:38-45). On Android it only plays with the app open (outside the app, the alert is the notification), although it ignores silent or vibrate mode.
- **Nutrition label scanning (server AI)** — Takes a photo of the nutrition facts table and fills in the food form with what the server AI reads.
  - Web (Partial): SparkyFitnessFrontend/src has no label scanning flow; there is only a 'Nutrition label' photo for contributing to Open Food Facts.
  - Mobile (Yes): screens/FoodScanScreen.tsx:576-640 ('label' mode); services/api/externalFoodSearchApi.ts:727 (POST /scan-label)
  - _Verification: corrected during verification_
- **Local persistence of in-progress work** — Keeps the active workout, drafts and unsaved GPS recordings on the device, and queues watch messages until a connection is available.
  - **Updated in PR #3052 (merged):** With a Wear OS watch, Android now queues watch messages too: the watch keeps what it could not send until the phone is reachable, the phone keeps incoming messages it cannot hand over yet in a file until the app reads them, and finished watch runs wait in the same saved queue as on iOS.
  - Web (Partial): Only stores the workout playback draft in localStorage (utils/workoutPlayback.ts:208-248) and the shell in the service worker cache.
  - Mobile (Yes): stores/activeWorkoutStore.ts:6 (zustand persist); services/workoutDraftService.ts; RecordActivityScreen.tsx:956-959 ('Your recording is kept on this phone'); services/watchRunQueue.ts; DashboardScreen.tsx:467 (offline state)

#### In both clients, but with iOS/Android differences (2)

- **Route map for cardio activities** · _Differs iOS/Android_ — Draws the session's GPS route on a map.
  - Web (Yes): components/Exercises/WorkoutGpsMap.tsx (Leaflet); pages/Reports/ActivityReportMap.tsx
  - Mobile (Yes): utils/routeMapSupport.ts:13-21; components/exerciseStats/RouteTileMap.tsx; app.config.ts:16-22, 283-289 (react-native-maps)
  - iOS/Android: iOS always uses Apple Maps. Android only uses Google Maps if the build includes GOOGLE_MAPS_ANDROID_API_KEY; otherwise, it draws the route line with no background map.
- **App language** · _Differs iOS/Android_ — Use the device language or choose one of the bundled languages.
  - **Updated in PR #2959 (merged):** Mobile now ships 16 languages, Turkish added, against 34 on the web. The rest is unchanged: Android has an in-app picker, iOS sends you to iOS Settings, and the mobile language is still not synced with the server language preference the web uses.
  - Web (Yes): pages/Settings/PreferenceSettings.tsx:592-595 (language Select); components/LanguageHandler.tsx
  - Mobile (Yes): AppSettingsScreen.tsx:113-130, 165-208; targets/android-language/kotlin/.../AppLanguageModule.kt, AppLanguageApi33.kt; plugins/withAppLanguage.ts; hooks/useAppLanguageForegroundSync.ts; app.config.ts:160-165, 192
  - iOS/Android: On iOS the language is changed in iOS Settings: the row opens Linking.openSettings and shows 'Managed by iOS'. On Android there is a custom picker synced with the system 'App languages' setting on Android 13+ (LocaleManager); on Android 12 or earlier it is saved as a local preference.

<details><summary>Web ↔ mobile parity (6)</summary>

- Guided voice in workouts (text-to-speech)
- Voice dictation in chat
- Barcode scanning with the camera
  - **Updated in PRs #2989 and #3126 (merged):** On Android the scanner now also opens from the 'Scan food' app icon quick action, as on iOS, and from the 'Scan barcode' Quick Settings tile, Android's counterpart of the iOS control, which asks you to unlock first if the phone is locked. The calorie and macro widgets have a Scan barcode button on Android and in their medium size on iOS; the water widget has none on either platform. After a scan, web and mobile both offer Other sources (English-only) to compare the matches of other enabled barcode providers without scanning again.
- Camera and gallery for photos
- Interface theme
- Choose the system voice for spoken cues

</details>

<details><summary>Discarded after verification: exists in neither client (1)</summary>

- Wear OS / Android watch app — Does not exist on web.
  - **Updated in PR #3052 (merged):** Android now has a Wear OS companion app with the Apple Watch app's pages (Goals, Water, Medications, Weight, Trend, Workout with Now Playing, Fasting and Steps), strength workouts, runs and walks, a remote for the phone's GPS recording, and the same seven complications (Calories, Protein, Carbs, Fat, Water, Fasting, Steps). Not on Wear OS: following saved routes, jump rope, double tap, the end-of-workout effort rating and saving workouts to Health Connect, and per-set RPE goes from 5 to 10 instead of 1 to 10. Both watch apps show their text in English only.

</details>

### 2.14 Items added by the completeness critic

#### Web only (10)

- **CSV: downloadable template, paste text, and edit rows before importing** — Every CSV importer lets you download a template, paste the CSV as text ('Parse Text'), and review the data in an editable table before importing: add rows, delete rows, and edit cells.
  - Web (Yes): pages/Foods/FoodImportFromCSV.tsx:496,687 (Download Template), 669 (Add Row), 704-717 (paste and Parse Text), 976 (Delete Row). pages/Diary/FoodDiaryImportCSV.tsx:495,749. pages/Exercises/ExerciseImportCSV.tsx:267. pages/Exercises/ExerciseEntryHistoryImportCSV.tsx:267. pages/CheckIn/HealthDataImportCSV.tsx:272.
  - _Verification: added by completeness critic_
- **CSV: format options with auto-detection** — A format bar detects and lets you change the delimiter (comma, semicolon, tab, or pipe), the number format (1,234.56 US or 1.234,56 EU), the date format, and the quote character. It includes a preview of the detected columns and rows.
  - Web (Yes): components/CsvImport/CsvFormatBar.tsx:134 (Delimiter), 168 (Number format), 215 (Date format), 271 (Quote character). components/CsvImport/CsvFormatPreview.tsx. Used in FoodImportFromCSV.tsx:727, FoodDiaryImportCSV, HealthDataImportCSV.tsx:36-37, and the exercise importers.
  - _Verification: added by completeness critic_
- **CSV: manual column mapping** — When the file's headers do not match the expected ones, a 'Map CSV Headers' dialog lets you assign each required field to a column in the file.
  - Web (Yes): components/CsvImport/CsvHeaderMappingDialog.tsx:61-66. Used in pages/Foods/FoodImportFromCSV.tsx:40,757, pages/CheckIn/HealthDataImportCSV.tsx:39, FoodDiaryImportCSV, and the exercise importers. Keys foodCsvImport.headersMismatchFile and diaryCsvImport.headersMismatch.
  - _Verification: added by completeness critic_
- **CSV: results panel with failed rows** — When the import finishes, a summary is shown (Imported, Skipped, Failed) with a 'View failed rows' option to see which rows failed and why.
  - Web (Yes): components/CsvImport/CsvImportResultPanel.tsx:57 ('View failed rows'). Keys csvImport.resultImported/resultSkipped/resultFailed. Used in HealthDataImportCSV.tsx:38 and in the other importers.
  - _Verification: added by completeness critic_
- **CSV: override existing foods and match scope** — The foods CSV can update the nutrition of existing foods (same name and brand) instead of failing, and it filters or highlights foods with no default variant. The diary CSV lets you choose which foods to match against (Mine, Family, or Public) and override the nutrition of your own foods.
  - Web (Yes): pages/Foods/FoodImportFromCSV.tsx:1001 (overrideLabel), 138 and 788-801 ('Show Missing Default' filter). pages/Diary/FoodDiaryImportCSV.tsx:841-893 (matchScope: My Items / Family / Public, overrideDescription).
  - _Verification: added by completeness critic_
- **Health CSV import by category** — The health data importer asks you to pick a category: Body Measurements, Sleep (with optional stages as stage_events JSON), Vitals & Custom, Daily Activity, Hydration (converted to ml), or Mood (with tags). Each category has its own template and fields.
  - Web (Yes): pages/CheckIn/HealthDataImportCSV.tsx:202 ('Data category' selector). constants/healthDataImport.ts:80 (Body Measurements), 128 (Sleep), 184 (Vitals & Custom), 231 (Daily Activity), 275 (Hydration), 305 (Mood). HealthDataImportCSV.tsx:134-138 uses AliasChipInput for mood tags.
  - Note: This is a breakdown of checkin-health-csv-import and settings-data-import-checkin, which only cover the importer in general.
  - _Verification: added by completeness critic_
- **Read-only and expiring API keys** — When generating an API key you choose the access, Full or Read-only (a read-only key can only read, including via MCP), and the expiry: Never, 7, 30, or 90 days, or 1 year. The list marks read-only keys with a badge.
  - Web (Yes): pages/Settings/ApiSettings.tsx:68 and 213 (Expires In: never/7/30/90 days/1 year), 256-259 (Access: Full access / Read-only), 326 (Read-only badge in the list).
  - _Verification: added by completeness critic_
- **Connect external AI assistants to the MCP server** — Lets you connect Claude Desktop, Cursor, Open WebUI, and other clients to the server's MCP endpoint (POST /mcp) using an API key as a Bearer token. The assistant can read and log food, exercise, biometrics, goals, etc.
  - Web (Partial): There is no MCP configuration screen. The user can only generate the key in Settings > Developer & Integrations > API Key Management (pages/Settings/ApiSettings.tsx), and the admin enables the MCP diagnostic tools in pages/Admin/AuthenticationSettings.tsx:245. Client setup is explained in docs/src/features/mcp-server.md ('Getting Started' section).
  - Note: The admin-auth-dev-tools-toggle row only covers the admin diagnostic tools toggle, not a regular user's MCP connection.
  - _Verification: added by completeness critic_
- **Copy/paste assignments between days and reorder workout plan sessions** — In the plan editor you can copy an assigned exercise or preset and paste it into another day or session. In sequential plans you can also move sessions up and down.
  - Web (Yes): pages/Exercises/AddWorkoutPlanDialog.tsx:458 and 608 ('Paste' button), 539 ('Move session up/down'). hooks/Exercises/useWorkoutPlanAssignments.tsx:465 ('Copied!' toast).
  - Note: Breaks down part of the 'partial' in exercise-plans-editor.
  - _Verification: added by completeness critic_
- **Notes on custom measurements** — Each value of a custom measurement category accepts an optional note when logging it in the check-in.
  - Web (Yes): pages/CheckIn/CheckInForm.tsx:519-531 (Input custom-notes-{category.id} with placeholder 'Notes (optional)'). Keys customMeasurements.notesOptionalLabel and notesLabel.
  - _Verification: added by completeness critic_

#### Mobile only (8)

- **AMOLED theme (pure black)** — A fourth theme option, in addition to Light, Dark, and System, with a pure black background designed for OLED screens.
  - Mobile (Yes): SparkyFitnessMobile/src/screens/AppSettingsScreen.tsx:81-98: the theme options are Light, Dark, AMOLED, and System. App.tsx computes isDarkMode = theme === 'dark' || theme === 'amoled'.
  - Note: The existing theme rows (settings-pref-theme, missed-settings-theme, native-theme) do not capture this difference.
  - _Verification: added by completeness critic_
- **Health sync: 'Quick Sync' or 'All Sync'** — When syncing manually you choose between Quick Sync, which sends the data but does not re-read already-synced workouts, and All Sync, which also re-reads the map and heart rate of those workouts (slower).
  - Mobile (Yes): src/screens/SyncScreen.tsx:773-791 (syncChoiceItems 'quick' and 'all' with runSync(false/true)) and 1005-1009 (ActionSheet).
  - _Verification: added by completeness critic_
- **Pull to refresh** — On the main screens you pull down to re-fetch data from the server.
  - Mobile (Yes): src/screens/DashboardScreen.tsx:417 and 550-552 (RefreshControl onRefresh), src/screens/DiaryScreen.tsx:482 and 615-617. RefreshControl appears in 14 files under src.
  - _Verification: added by completeness critic_
- **Paste the server URL and API key from the clipboard** — Buttons to paste the server URL and API key instead of typing them, both when connecting for the first time and when adding or editing a server.
  - Mobile (Yes): src/screens/OnboardingScreen.tsx:667 ('Paste URL from clipboard') and 968 ('Paste API key from clipboard'). src/components/ServerConfigModal.tsx:902 and 1083.
  - _Verification: added by completeness critic_
- **Warm-up calculator settings** — Screen to enable the calculator and define its scheme: warm-up sets with percentage and reps, add or remove sets, reset to the default scheme, and choose plate and dumbbell rounding.
  - Mobile (Yes): src/screens/WarmupSettingsScreen.tsx:187-200 (enable Warm-up Calculator), 209 (Warmup Method), 227-278 (W sets with % and reps, Add/Remove set), 289 (Reset to default), 296-309 (Plate rounding), 317-330 (Dumbbell rounding). Opened from WorkoutSettingsScreen.tsx:225-228.
  - Note: The exercise-warmup-calculator row only covers using the calculator and 'Add warm-ups', not its configuration.
  - _Verification: added by completeness critic_
- **Rename the in-progress workout** — From the live workout menu you can change the session name before saving it.
  - Mobile (Yes): src/components/ActiveWorkoutHeader.tsx:31 and 164 ('Rename workout' in the menu). src/components/ActiveWorkoutRenameModal.tsx:71 (modal with a 'Workout name' field).
  - _Verification: added by completeness critic_
- **Clear logged sets from the in-progress workout** — Action to clear at once all already-checked sets in the live workout, or those of a single exercise, without removing the exercises.
  - Mobile (Yes): src/components/ActiveWorkoutHeader.tsx:41 and 209 ('Clear all logged sets'). src/components/ActiveWorkoutOverflowSheet.tsx ('Clear logged sets' per exercise).
  - _Verification: added by completeness critic_
- **Swipe a row to delete or adjust** — In several lists you swipe the row to reveal actions such as Delete, Adjust serving, or Edit: food entries, the day's exercises, meal ingredients, cycle history, fertility tests, and fasting history.
  - Mobile (Yes): src/components/SwipeableFoodRow.tsx ('Adjust serving' / 'Delete food'), SwipeableExerciseRow.tsx ('Delete exercise'), SwipeableIngredientRow.tsx ('Edit' / 'Remove'), SwipeableDeleteRow.tsx. Used in MealTypeDetailScreen, EditLoggedMealScreen, FoodSummary, ExerciseSummary, wellness/CycleHistoryList, wellness/ttc/TestQuickLog, and FastingHistorySheet.
  - Note: Deletion itself is already covered in diary-delete-entry and serving adjustment in diary-serving-quick-adjust. This row covers the gesture, which extends to lists those rows do not mention.
  - _Verification: added by completeness critic_

#### In both, with differences (3)

- **'From Plan' badge on entries created by a meal plan** — Active meal plans populate the diary automatically. Web marks those entries with a 'From Plan' badge and warns in the plan editor that several plans can be active at once.
  - Web (Yes): pages/Diary/MealCard.tsx:387-388 (isFromMealPlan = meal_plan_template_id), 511-513 and 679-681 (Badge 'From Plan'). pages/Foods/MealPlanTemplateForm.tsx:533 (multipleActiveHint: 'Active plans automatically populate diary entries').
  - Mobile (Partial): Plan-generated entries appear in the diary because the server creates them, but they are not distinguished from the rest: the meal_plan_template_id field exists in src/types/foodEntries.ts:24 and no component uses it (SwipeableFoodRow, FoodSummary, and FoodEntryViewScreen do not show the origin).
  - _Verification: added by completeness critic_
- **Food glycemic index (GI)** — Glycemic index classification (None, Very low, Low, Medium, High, Very high) assigned to each food variant and shown in the diary.
  - Web (Yes): components/FoodSearch/NutrientFormGrid.tsx:143-156 ('Glycemic Index (GI)' selector in the form). pages/Diary/MealCard.tsx:417-435 and 520-525 / 686-691 ('GI: {{giValue}}' on each diary row if it is in quickInfoNutrients). Also in EditFoodEntryDialog.tsx and in NutrientDisplaySettings.
  - Mobile (Partial): Only shown as a daily summary in src/screens/DailyNutritionDetailsScreen.tsx:34-56, 147, and 248. It cannot be edited: components/FoodForm.tsx has no glycemic_index field. There is a label in constants/nutrients.ts:100.
  - _Verification: added by completeness critic_
- **Confirmation when closing with unsaved changes** — When closing a form or dialog with pending changes, the app asks for confirmation before discarding them.
  - Web (Yes): components/ui/dialog.tsx:88-110 (requireConfirmation: 'Are you sure you want to close this? Any unsaved changes will be lost.'). Used in FoodSearch/FoodFormDialog, Diary/EditFoodEntryDialog, Diary/ConvertToMealDialog, Foods/MealManagement, Foods/Foods, Exercises/WorkoutPresetForm, Exercises/AddWorkoutPlanDialog, Exercises/AddExerciseDialog, Settings/DataImportSettings, and CsvHeaderMappingDialog.
  - Mobile (Partial): There are only beforeRemove guards in some cases. screens/foodForm/CreateFoodMode.tsx:144-152, EditFoodMode.tsx:237, and AdjustNutritionMode.tsx:145 only protect unsaved equivalent serving sizes. FoodEntryMultiAddScreen.tsx:321-335 protects the multi-selection. GPS recording asks for confirmation on discard (RecordActivityScreen.tsx:810-825). The other forms (meals, presets, medication…) close without asking.
  - _Verification: added by completeness critic_

<details><summary>Web ↔ mobile parity (4)</summary>

- Error and recovery screens (404, screen error with 'Retry')
- Per-meal and per-day nutrition totals in the meal plan editor
- Scanner: type the barcode manually and turn on the flashlight
- Discard a live workout or a recorded activity

</details>

## 3. iOS ↔ Android

Platform differences inside the mobile app, gathered from the dedicated sweeps (native configuration, screens, components and services) and from the functional domains.

### 3.1 iOS only (113)

**iOS/Android differences: native configuration**

- **Apple Watch companion app (watchOS 10+)** — iOS only: watchOS target generated by @bacons/apple-targets (app.json plugin '@bacons/apple-targets') and a WatchConnectivity native module with only an ios/ folder. Android has no equivalent (no Wear OS either): all useWatch*Bridge hooks exit without doing anything because WatchConnectivity is null.
  - **Updated in PRs #3052, #3065, #3090 and #3127 (merged):** Android now has a Wear OS companion app (Wear OS 3 or later, with its options under Settings → Wear OS on the phone). It has the same pages, the same seven complications and the same links to the phone: water, weight, fasting and medication logging, strength workouts, and walks and runs recorded on the watch with its own GPS or on a treadmill, with program workouts, pace and heart rate alerts and spoken cues. Only the Apple Watch has following a saved route, jump rope, double tap to log a set, typing weight and reps on a keypad (Wear OS uses the rotary crown or + and − buttons), the effort rating at the end of a workout and saving workouts to Apple Health (the Wear OS app does not write to Health Connect). Wear OS also rates set effort from 5 to 10 instead of 1 to 10, estimates calories from heart rate, and its Now Playing page only has playback and volume buttons. Both watch apps' own texts are in English only.
  - Evidence: SparkyFitnessMobile/targets/watch/expo-target.config.js:135-173 (type 'watch', deploymentTarget 10.0, HealthKit + App Group); targets/watch/Presentation/ContentView.swift:126-321; targets/watch/Domain/WatchPage.swift:9-17; modules/watch-connectivity/expo-module.config.json (platforms ['ios']); src/hooks/useWatchConnectivity.ts:15 (isSupported = Pl…
- **Watch: Goals page (nutrition vs goals)** — Requires an iPhone with a paired Apple Watch. Does not exist on Android.
  - **Updated in PR #3052 (merged):** The Wear OS app has the same Goals page: a calorie ring with the calories left or over, and below it the nutrients chosen and ordered in Settings > Wear OS on the phone (protein, carbs and fat by default).
  - Evidence: SparkyFitnessMobile/targets/watch/Presentation/GoalSummaryView.swift:3-11; modules/watch-connectivity/index.ts:66-76 (WatchGoalNutrientPayload); src/constants/watchPages.ts (DEFAULT_WATCH_NUTRIENTS)
- **Watch: log water and delete drinks** — Apple Watch only. Android has no watch surface.
  - **Updated in PR #3052 (merged):** The Wear OS app has the Water page: progress against the goal (a ring instead of a bottle), one button per container from the server (Glass 250 ml and Bottle 500 ml when none are synced), the water from food, and the day's drink log, where each drink can be removed after a confirmation. It also has an Undo Last button that removes the latest drink without asking.
  - Evidence: SparkyFitnessMobile/targets/watch/Presentation/WaterIntakeView.swift:4-12; targets/watch/Presentation/WaterLogView.swift:3-11; modules/watch-connectivity/index.ts:101-118 (WatchWaterIntakePayload / WatchWaterDeletePayload)
- **Watch: mark medication doses** — Apple Watch only.
  - **Updated in PR #3052 (merged):** The Wear OS app has the Medications page: today's doses with a taken count, where a tap marks a dose as taken or unmarks it (the phone deletes the entry). Skipping is still only on the phone. Unlike Apple Watch, it does not show that a dose was skipped or whether a tap is still syncing.
  - Evidence: SparkyFitnessMobile/targets/watch/Presentation/MedicationsView.swift:4-12; modules/watch-connectivity/index.ts:120-144 (WatchMedicationTakenPayload / WatchMedicationDosePayload)
- **Watch: morning weight/body fat check-in with the Digital Crown and trend chart** — Apple Watch only.
  - **Updated in PR #3052 (merged):** The Wear OS app has the weight check-in too: weight set with the rotary crown or the −/+ buttons, a keypad on tap for large jumps, an optional body fat % step and the change since the last entry. A separate Trend page shows the last 14 weights with a rolling average line, or body fat, switched with a tap or the crown. Unlike Apple Watch, it does not open the trend after saving, and the first weight is picked from a 'Set Start' button rather than a guided screen shown on first launch.
  - Evidence: SparkyFitnessMobile/targets/watch/Presentation/CheckInEntryView.swift:4-11,319-321; targets/watch/Presentation/TrendView.swift:5-16; targets/watch/Presentation/ContentView.swift:325-368 (FirstRunEntryView); modules/watch-connectivity/index.ts:78-99
- **Watch: strength workout on the wrist** — On iOS with a paired watch, starting a workout automatically arms the watch and it provides live HR. On Android the workout only exists on the phone, without live HR.
  - **Updated in PRs #3052 and #3065 (merged):** A Wear OS watch now runs strength workouts too: today's scheduled workouts and presets to start, one set per screen with +/−, the rotating crown or a keypad, optional RPE, a rest timer with +15s and Skip, options to edit sets, exercises and the workout, a brief 'New PR!' banner, the 'Update Preset?' answer and a Now Playing page. Its live heart rate reaches the phone's exercise card, and starting a workout on an Android phone opens it on the connected watch. Unlike the Apple Watch it has no double tap, RPE only goes from 5 to 10, the summary lacks volume, max HR and the effort rating, finishing or discarding asks for no confirmation, and the workout is not saved to a health store, while the Apple Watch saves it to HealthKit.
  - Evidence: SparkyFitnessMobile/targets/watch/Presentation/WorkoutView.swift:53-57; targets/watch/Presentation/WorkoutEditPages.swift:3-12,95,134; targets/watch/Presentation/NowPlayingPage.swift:4-10; targets/watch/Infrastructure/WorkoutHealthKitController.swift; targets/watch/expo-target.config.js:112-123 (WKBackgroundModes workout-processing); src/hooks/use…
- **Watch: watch-only walk/run and 'WatchRunLive' screen on the phone** — iOS + Apple Watch only. On Android only phone GPS recording exists.
  - **Partly covered by PRs #3052, #3065, #3090 and #3127 (merged):** The Wear OS app now records walks and runs on its own, outdoor with the watch GPS or indoor from steps, with time, distance, pace, heart rate, pause, lap, interval plans, auto-pause, pace and heart rate alerts, spoken cues and treadmill distance correction; it starts from the watch or the phone, which follows it on WatchRunLive. Still Apple Watch only: Jump Rope, following a saved route, the effort rating after the run, interval steps that end on distance (Wear OS moves on after their expected time) and the fuller coaching (halfway, last minute, step warnings and countdowns, distance milestones). On Android the phone still offers a saved route for a watch run (on the Record screen and with 'Start on watch'), but the Wear OS run ignores it, and 'Send to watch' fails because the Android bridge cannot send routes.
  - Evidence: SparkyFitnessMobile/targets/watch/Presentation/WatchRunView.swift:3-7,274-276; targets/watch/Application/WatchRunStore.swift; targets/watch/Domain/WatchAutoPause.swift, WatchPaceAlert.swift, WatchHeartRateAlert.swift, WatchCoaching.swift, WatchIndoorAutoPause.swift; targets/watch/Infrastructure/WatchRunCues.swift; src/screens/WatchRunLiveScreen.ts…
- **Watch: remote for the phone's GPS recording** — Apple Watch only; on Android the recording can only be controlled from the phone/notification.
  - **Updated in PR #3052 (merged):** The Wear OS app is a remote for the phone's GPS recording too: while the phone records it shows the activity, time, distance, pace, heart rate and current interval, with Pause/Resume, Lap and Stop, and it sends its heart rate to the phone. Unlike Apple Watch, it shows no totals screen when the recording ends.
  - Evidence: SparkyFitnessMobile/targets/watch/Presentation/RecordingView.swift:3-7; targets/watch/Application/RecordingStore.swift; src/hooks/useWatchRecordingBridge.ts
- **Watch: Fasting and Steps pages** — Apple Watch only.
  - **Partly covered by PR #3052 (merged):** The Wear OS app has a Fasting page (elapsed time and progress toward the goal, End Fast without a confirmation step, and 16:8, 18:6, 20:4 or OMAD to start one) and a Daily Steps page against the goal, which also uses the watch's own step counter when it is ahead of the phone's figure. Starting a fast from Wear OS fails: the watch sends the plan name ('16:8', 'OMAD') where the phone expects its preset id ('16-8'), so the phone rejects it. Ending a fast works.
  - Evidence: SparkyFitnessMobile/targets/watch/Presentation/FastingView.swift:3-5; targets/watch/Presentation/StepsView.swift:3-5; src/hooks/useWatchFastingBridge.ts:27
- **Apple Watch face complications** — watchOS only.
  - **Updated in PR #3052 (merged):** The Wear OS app has seven complications too: Calories, Protein, Carbs, Fat, Water, Fasting and Steps, each opening its page on tap (the calorie and macro ones open Goals). They come only as ranged-value or short-text complications, where Apple Watch offers circular, corner, rectangular or inline layouts depending on the complication.
  - **Updated in PR #3052 (merged):** Wear OS now has the same seven complications: Calories, Protein, Carbs, Fat, Water, Fasting and Steps, each as a ranged value (gauge) or short text. A tap opens the Goals page for calories and macros, or the Water, Fasting or Steps page. The sizes differ: on the Apple Watch, Calories and Water are circular only and the rest also come in corner, rectangular and inline.
  - Evidence: SparkyFitnessMobile/targets/watch-widget/index.swift:4-14; targets/watch-widget/EnergyGoalComplication.swift:286-288; MacroComplications.swift:227-263; FastingComplication.swift:160-164; StepsComplication.swift:124-128; WaterGoalComplication.swift:220-223; targets/watch-widget/expo-target.config.js:218-255; targets/watch/Domain/WatchDeepLink.swift…
- **Settings > Apple Watch** — The row only appears on iOS with a paired watch; on Android it is never shown.
  - **Updated in PR #3052 (merged):** Android now shows a 'Wear OS' row in Settings once a Wear OS watch has connected. It opens the same screen with the switch that asks for effort (RPE) after each set, from 5 to 10 on Wear OS and 1 to 10 on Apple Watch, plus page order and visibility and the Goals page nutrients. The double-tap to log a set and the Keypad / Digital Crown set input choice are shown on iOS only.
  - Evidence: SparkyFitnessMobile/src/screens/SettingsScreen.tsx:53-55,368-376 (row only if WatchConnectivity.isSupported() && isPaired()); src/screens/WatchSettingsScreen.tsx:103-245; App.tsx:1082-1083; src/constants/watchPages.ts
- **Record activity: 'Record with' selector (phone/watch) and heart rate alerts** — On Android watchAvailable is always false, so neither the selector nor the HR alerts are shown (there is no HR source).
  - **Updated in PRs #3052 and #3090 (merged):** On Android with a paired Wear OS watch, the 'Record with' choice (phone or watch) and the heart rate range cards now appear too (not for rides), with heart rate from the watch's sensor. A watch run is recorded by the Wear OS app with its own GPS, or with its step counter indoors. For an outdoor watch run the phone also offers a saved route to follow, but the Wear OS app ignores it, so route following only works on Apple Watch. The Android wording of the heart rate cards ('Needs your Wear OS watch…') is not translated into any other language yet, while the Apple Watch wording is translated in 6 of the 15.
  - Evidence: SparkyFitnessMobile/src/screens/RecordActivityScreen.tsx:261-269 (watchAvailable), 1073-1100 (Record with), 1200-1215 (HeartRateBandCard), 1316-1400 (HR for fast/warm-up segments)
- **Run programs: show pace reference on the watch** — On Android the card appears without the watch option.
  - **Updated in PR #3052 (merged):** The switch to also use the pace reference on the watch now shows on Android too, worded 'Also use on my Wear OS watch', and it puts the race-based pace ranges on the program workout the Wear OS app offers. That wording is not translated into any other language yet, while the Apple Watch one is translated in 6 of the 15. On both platforms the switch shows whenever a reference race is set, with or without a paired watch, but the Apple Watch checks each step against its range on its own, while the Wear OS app only does so when the pace alert is turned on for that run.
  - Evidence: SparkyFitnessMobile/src/screens/RunProgramsScreen.tsx:325-336 and 443 (watch prop only if Platform.OS === 'ios')
- **Water widget with +/- buttons** — iOS only (the buttons require iOS 17+). Android has no water widget.
  - **Updated in PR #3020 (merged):** Android now has a Glance home-screen water widget whose − and + buttons remove or add one drink in the background (through WorkManager, with the same request as the Log water shortcut and tile), without opening the app. Unlike iOS it draws a bar instead of a ring, comes in one fixed 2x2 size and has no Lock Screen variants (accessoryCircular/Rectangular/Inline); it also shows a short status line when a change fails.
  - Evidence: SparkyFitnessMobile/targets/widget/waterWidget.swift:134-166 (LogDrinkButton with Button(intent: LogWaterIntent/RemoveWaterIntent), iOS 17+), 250-263 (families); src/hooks/useWidgetSync.ts:21-37,113 (waterSnapshot / canLog); src/screens/DashboardScreen.tsx:310
- **Lock Screen widgets (calories, macros, water)** — The Android widgets declare android:widgetCategory="home_screen" only (targets/android-widget/res/xml/*.xml).
  - Evidence: SparkyFitnessMobile/targets/widget/widgets.swift:198-213,319-322; targets/widget/macroWidget.swift:253-266,423-426; targets/widget/waterWidget.swift:175-193,260-263
- **Control Center / Lock Screen / Action button controls** — Requires iOS 18+. Android has no equivalent Quick Settings tiles.
  - **Partly covered by PRs #2989 and #3020 (merged):** Android has four Quick Settings tiles: Log water, Scan barcode, Search food and Calories left (shows today's kcal left and opens the diary). Still iOS-only: Remove water, Start fast and End fast as controls, the water amount on the Log water control, and the Action button; on Android the day's water and a − button to remove a drink are on the home screen water widget instead.
  - Evidence: SparkyFitnessMobile/targets/widget/index.swift:10-18 (if #available(iOS 18.0)); targets/widget/Controls.swift:11-156; targets/widget/ShortcutIntents.swift:463-496 (ScanFoodControlIntent, LogFoodControlIntent, OpenDiaryControlIntent with openAppWhenRun); src/hooks/useQuickActions.ts:155-189 (useControlRouteHandoff via App Group)
- **Siri and Shortcuts actions (without opening the app)** — iOS 16+. Android only has a 'Log water' launcher shortcut (see plat-native-quick-actions); there is no Log weight or Fasting via voice/shortcut.
  - **Partly covered by PRs #2989 and #3020 (merged):** Android logs a drink without opening the app from the launcher 'Log water' shortcut, the Log water Quick Settings tile (also on the lock screen) and the water widget's + button, and removes one with the widget's − button. Each tap is one drink, where the iOS Log water action takes 1 to 20. Android still has no voice, Shortcuts app or Action button equivalent, and no shortcut, tile or widget that logs weight or starts or ends a fast; the Fasting app icon shortcut only opens the fasting screen.
  - Evidence: SparkyFitnessMobile/targets/widget/ShortcutIntents.swift:1-30,260-445 (LogWaterIntent, RemoveWaterIntent, LogWeightIntent, StartFastIntent, EndFastIntent; openAppWhenRun=false); plugins/ios/ShortcutProvider.swift:8-38 (AppShortcutsProvider with phrases); plugins/withBackgroundWater.ts:26-35,62-98 (copies into the app target); modules/background-wa…
- **On-device nutrition and supplement label scanning (Apple Intelligence)** — iOS 27+ only with Apple Intelligence enabled. On Android (and older iOS) the Settings > AI screen shows 'Not available on this device. It needs iOS 27 or later with Apple Intelligence...' and all label scanning goes to the server.
  - Evidence: SparkyFitnessMobile/modules/on-device-nutrition/expo-module.config.json (platforms ['ios']); modules/on-device-nutrition/index.ts:43-59; modules/on-device-nutrition/ios/OnDeviceNutritionModule.swift:14,125-217 (@available(iOS 27)); src/services/onDeviceLabelScan.ts:15-21,250-258; src/services/onDeviceSupplementScan.ts:177-184; src/screens/FoodScan…
- **iOS-only health metrics (HealthKit)** — They do not appear on Android. Stress, dietary fat/protein/sodium and audio exposure are marked as iOS but disabled (enabled: false), so they are not shown on either platform.
  - Evidence: SparkyFitnessMobile/src/HealthMetrics.ts:622 (bloodAlcoholContent), 651 (menstruationFlow), 770-866 (walking*), 873-917 (running*), 924-972 (cycling*), 1026-1058 (appleMoveTime/ExerciseTime/StandTime) with platforms: ['ios']. Disabled on both: stress, nutritionDietary*, environmental/headphoneAudioExposure (enabled: false)
- **'Time Sensitive' rest-complete alert** — On Android the equivalent is the high-importance 'Workout timer' channel + exact alarms.
  - Evidence: SparkyFitnessMobile/src/services/notifications.ts:407-419 (interruptionLevel: 'timeSensitive'); app.config.ts:210-212 (entitlement com.apple.developer.usernotifications.time-sensitive)
- **Liquid Glass navigation (iOS 26 native tab bar)** — Only iOS 26+ with glass APIs available; on Android the row does not appear and the custom tab bar is always used.
  - Evidence: SparkyFitnessMobile/src/utils/liquidGlass.ts:9-19 (iOS only with expo-glass-effect); src/services/nativeTabBarPreference.ts:11-27; src/screens/AppSettingsScreen.tsx:211-226; App.tsx:332

**iOS/Android differences: components**

- **Health metrics syncable only on iOS (HealthKit)** — These metrics do not appear on Android. There are other iOS-only entries that are defined but disabled (enabled:false) and are not shown on any platform: stress (HealthMetrics.ts:183/185), nutritionDietaryFatTotal/Protein/Sodium (731-765) and environmentalAudioExposure/headphoneAudioExposure (1003-1021).
  - Evidence: The list is filtered by platform in SparkyFitnessMobile/src/HealthMetrics.ts:1076-1084 and rendered by SparkyFitnessMobile/src/components/HealthDataSync.tsx:117,252-271. Active platforms:['ios'] entries: bloodAlcoholContent (HealthMetrics.ts:632), menstruationFlow (661), walkingSpeed (780), walkingStepLength (796), walkingAsymmetryPercentage (814)…
- **Background sync note (iOS only)** — The toggle exists on both platforms. Only iOS explains that the system decides when the background work runs; Android shows no note.
  - Evidence: SparkyFitnessMobile/src/components/SyncFrequency.tsx:38-45 (Platform.OS === 'ios' && <Text>{t('syncFrequency.iosNote')}</Text>); shown in SparkyFitnessMobile/src/screens/SyncScreen.tsx:976
- **Bar above the keyboard ('Done' / 'Next' / 'Next set') when editing sets of a logged activity** — On Android, when editing sets in Activity detail there is no accessory bar: no 'Next set' or 'Done' button above the keyboard. You have to tap each cell or dismiss the keyboard with Back. On iOS the bar is attached to each field. The StepperInput +/- buttons are on both platforms.
  - Evidence: SparkyFitnessMobile/src/components/EditableSetRow.tsx:282-314 (inputAccessoryViewID only when Platform.OS === 'ios'), 404-413 (<InputAccessoryView> with SetInputAccessoryBar only on iOS). Its only consumer is SparkyFitnessMobile/src/screens/ActivityDetailScreen.tsx:749 (EditableSetList), which has no fallback StickySetInputAccessoryBar. In contras…
- **DevTools: Apple Watch link status** — iOS only, because it depends on the watchOS companion, and only in development builds. Android has no equivalent watch diagnostics.
  - **Updated in PR #3052 (merged):** The section now also appears on Android, titled 'Wear OS', with the same paired and reachable dots and texts, still only in development builds. On Android 'paired' means a Wear OS watch has connected to the phone at least once (remembered from then on) and 'reachable' that one is connected now, although the text still speaks of the watch app being in the foreground.
  - Evidence: SparkyFitnessMobile/src/components/DevTools.tsx:653-697 (Platform.OS === 'ios'; useWatchConnectivity → isWatchSupported/isWatchPaired/isWatchReachable); development builds only (SettingsScreen.tsx:421-425)

**iOS/Android differences: screens**

- **Liquid Glass navigation (iOS 26 native tab bar and headers)** — Only on iOS 26+ with the expo-glass-effect APIs available. On iOS earlier than 26 there is always the classic native header and the custom tab bar. Android never shows the toggle and always uses FallbackTabsLayout.
  - Evidence: SparkyFitnessMobile/src/screens/AppSettingsScreen.tsx:54, 212-226 ('Liquid Glass navigation' row, visible only if canUseLiquidGlass()); src/utils/liquidGlass.ts (returns false if Platform.OS !== 'ios'); src/services/nativeTabBarPreference.ts (useNativeIOSTabsActive / useNativeIOSHeadersActive); src/components/TabsLayout.tsx:240-335 (NativeTabsLayo…
- **Health metrics syncable only on iOS** — There are iOS metrics that are defined but disabled (enabled: false), so they do not appear on any platform: Stress (173/185), Dietary Fat, Protein and Sodium (733-765), and Environmental and Headphone Audio Exposure (991-1021).
  - Evidence: SparkyFitnessMobile/src/HealthMetrics.ts:622 (bloodAlcoholContent), 651 (menstruationFlow), 770-866 (walking*/running* metrics), 873 (runningPower), 972 (cyclingFunctionalThresholdPower), 1026-1068 (appleMoveTime/appleExerciseTime/appleStandTime), all with platforms: ['ios']; filtered by Platform.OS at 1076-1085; rendered by src/components/HealthD…
- **Record a walk or run with the Apple Watch ('Record with: Phone GPS / Watch GPS' picker)** — Requires iOS with a paired Apple Watch and is not available for cycling. Android has no watch integration (Wear OS) and recording always uses the phone.
  - **Updated in PRs #3052 and #3090 (merged):** With a Wear OS watch connected, Android shows the same 'Record with: Phone GPS / Watch GPS' picker (not for rides): a walk or run on the watch starts in the Wear OS app, which records it with its own GPS and heart rate sensor, or its step counter indoors, while the phone opens the 'On your watch' screen. Like the Apple Watch, it applies the intervals, auto-pause, voice cues and pace and heart rate alerts set on the phone, but only the Apple Watch follows the route chosen in the Route picker, which also appears for a Wear OS run.
  - Evidence: SparkyFitnessMobile/src/screens/RecordActivityScreen.tsx:261-269 (watchAvailable = watchSupported && watchPaired && activity !== 'ride'), 666-700 (startRunOnWatch -> navigate('WatchRunLive')), 1073-1126 (SegmentedControl phone/watch), 1165-1166; src/hooks/useWatchConnectivity.ts:15 (isSupported = Platform.OS === 'ios' && native module present); mo…
- **Heart rate alerts and ranges in GPS recording (and live HR)** — HR only comes from the Apple Watch, so Android has no alerts or HR reading. Exception: the 'live-hr' card of the in-progress recording (RecordActivityScreen.tsx:1902-1910) only checks that it is not finished, not indoor and not cycling, and does not look at watchAvailable. On Android it can appear but will never receive data.
  - **Updated in PRs #3052 and #3078 (merged):** With a Wear OS watch connected, Android shows the heart rate range cards, the suggested ranges (worked out on both platforms from the heart rate zones in Settings → Workout) and the live Heart rate stat, and the phone alerts on the readings the Wear OS app sends during a phone recording, as with an Apple Watch. As on iOS, the cards stay hidden for rides and without a watch, while the alert card shown during an outdoor walk or run still appears without a watch and gets no readings. Only the Apple Watch also sends its own heart rate zones for the saved activity.
  - Evidence: SparkyFitnessMobile/src/screens/RecordActivityScreen.tsx:1199-1216 (comment 'Heart rate comes from the Apple Watch'; shown only with watchAvailable), 1316-1360 and 1393-1410 (interval and warm-up HR only with watchAvailable), 497-508 (suggestedHeartRate only with a watch), 1622-1630 (live HR stat only if heartRate != null); src/stores/liveHeartRat…
- **'Also use on my Apple Watch' in program reference paces** — It only depends on Platform.OS === 'ios', so it also appears on iPhones without a paired watch. On Android the reference pace card is shown without this toggle.
  - **Updated in PR #3052 (merged):** The toggle now also shows on Android, reading 'Also use on my Wear OS watch', and as on iOS it depends only on the platform, so it appears on any Android phone once a race time is saved, with or without a watch. The Wear OS app holds the program workout to these ranges only when the run's pace alert is on, while the Apple Watch does so unless the pace alert is turned off during the run; the Wear OS label is English in every language, whereas the Apple Watch one is translated in 6 of the 15 other shipped languages.
  - Evidence: SparkyFitnessMobile/src/screens/RunProgramsScreen.tsx:325-336 and 439-449 (watch prop only with Platform.OS === 'ios'); src/components/recording/PaceReferenceCard.tsx:39-41, 206-218 ('Also use on my Apple Watch' toggle)
- **On-device nutrition label reading (Apple Foundation Models)** — Only on iOS 27+ with Foundation Models available (Apple Intelligence). On Android, and on unsupported iPhones, the label is always read by the server AI.
  - Evidence: SparkyFitnessMobile/src/screens/FoodScanScreen.tsx:41-43, 577-617 (scanLabelOnDevice, and if it fails, scanNutritionLabel on the server; foodScan.labelReadOnDevice notice); src/services/onDeviceLabelScan.ts:15-21; modules/on-device-nutrition/expo-module.config.json ('platforms': ['ios']); modules/on-device-nutrition/ios/OnDeviceNutritionModule.swi…
- **Control Center and lock screen controls (Scan food, Log food, Calories left)** — Depends on iOS 18+ controls (app group ExtensionStorage). Android has no Control Center equivalent.
  - **Updated in PR #2989 (merged):** The Android Scan barcode, Search food and Calories left Quick Settings tiles open the scanner, food search and the diary, asking to unlock first on the lock screen. They use sparkyfitnessmobile:// links (scan, search and diary) instead of the app-group handoff, which stays iOS-only.
  - Evidence: SparkyFitnessMobile/App.tsx:222-223 (useControlRouteHandoff); src/hooks/useQuickActions.ts:158-197 (return if Platform.OS !== 'ios' or there is no iosAppGroup; scan/search/diary routes)
- **Apple Watch app integration and 'Apple Watch' settings** — The WatchSettings and WatchRunLive screens are registered on both platforms, but they are only reachable on iOS with a paired Apple Watch. Android has no watch integration.
  - **Updated in PRs #3052, #3065 and #3090 (merged):** On Android the same bridges now run when Google Play services are present, so the Wear OS app also hands over weight and body fat, water, medications and fasting, starts and edits workouts, gets set targets, sends heart rate, ends workouts on the workout completed screen and records runs shown in WatchRunLive. Settings shows a 'Wear OS' row once a Wear OS watch has connected to the phone (remembered from then on), opening the same WatchSettings screen without the double-tap and Keypad/Digital Crown options. The effort rating and the saved-route library are Apple Watch only: on Android the route screen still offers Send to watch, which fails, and Start on watch, which records the run without following the route.
  - Evidence: SparkyFitnessMobile/App.tsx:208-213 (WatchCheckInGate), 238-261 (handleWatchFinishedWorkout), 263-303 (WatchWorkoutGate: watchSupported = WatchConnectivity?.isSupported()), 479-481, 1082-1084 (WatchSettings screen registered unconditionally); src/screens/SettingsScreen.tsx:53-55, 367-376 (row visible only with a paired watch); modules/watch-connec…
- **Siri and Shortcuts actions (Log water, Start fast, End fast, Log weight)** — Android has no Google Assistant integration or equivalent. Its only action that works without opening the app is the icon's 'Log water' shortcut.
  - **Partly covered by PRs #2989 and #3020 (merged):** Android's actions that work without opening the app are the launcher Log water shortcut, the Log water Quick Settings tile (also from the lock screen) and the water widget's − and + buttons. Android still has no Google Assistant or voice integration, and nothing on the phone logs weight or starts or ends a fast without opening the app.
  - Evidence: plugins/ios/ShortcutProvider.swift:9-35 (AppShortcutsProvider: 'Log water', 'Start fast', 'End fast', 'Log weight'); targets/widget/ShortcutIntents.swift:260-408 (LogWaterIntent, RemoveWaterIntent, LogWeightIntent, StartFastIntent, EndFastIntent); plugins/withBackgroundWater.ts:3-5, 24-34.
- **Control Center controls that act without opening the app (Log water, Remove water, Start fast, End fast)** — Requires iOS 18+. Android has no Quick Settings tiles (TileService).
  - **Partly covered by PRs #2989 and #3020 (merged):** On Android the Log water Quick Settings tile logs a drink without opening the app, also from the lock screen, and puts the result in the notification list when the app's notifications are on. The home screen water widget's − and + buttons also remove or add a drink without opening the app, but Remove water has no tile, and no tile or widget starts or ends a fast.
  - Evidence: targets/widget/Controls.swift:11-41 (LogWaterControl), 44-56 (StartFastControl), 59-71 (EndFastControl), 111-123 (RemoveWaterControl); targets/widget/index.swift:10-17 (registered only on iOS 18+); src/hooks/useWidgetSync.ts:124 (reloadControls).
- **Home screen water widget with +/− buttons** — Android has calorie and macro widgets, but no water widget.
  - **Updated in PR #3020 (merged):** Android has a water widget next to the calorie and macro widgets, with today's water against the goal and − and + buttons that remove or add a drink without opening the app. A drink logged from the Log water shortcut or Quick Settings tile also shows on it. Only iOS has a medium size and Lock Screen versions.
  - Evidence: iOS: targets/widget/waterWidget.swift:152-165 (Button(intent: RemoveWaterIntent/LogWaterIntent)), 258-260; targets/widget/index.swift:9. Android: only the Calories and Macros widgets exist (targets/android-widget/res/values/widget_strings.xml:3-6; targets/android-widget/kotlin/.../CalorieWidget.kt.tmpl and MacroWidget.kt.tmpl), with shortcuts to s…
- **On-device reading of the 'Supplement Facts' label (medication and supplements)** — iOS 27+ with Apple Intelligence and the AI settings toggle enabled. On Android the server AI always reads it.
  - Evidence: src/hooks/useSupplementLabelScan.ts (on-device reading first and then scanSupplementLabelImage on the server); src/services/onDeviceSupplementScan.ts:177-192 (requires onDeviceLabelScanEnabled and isOnDeviceLabelScanAvailable); src/screens/MedicationFormScreen.tsx:181, 306-338 (medications.supplement.labelReadOnDevice toast); modules/on-device-nut…
- **'Read again' the label with the other AI in the food form created from a scan** — It only makes sense where on-device reading exists (iOS 27+). On Android the source is always the server and the retry is not offered.
  - Evidence: src/hooks/useRetryLabelScan.ts:44-50 (canRetry requires the source to be 'device', or 'server' with on-device reading enabled and available), 52-95; src/components/LabelScanSourceBanner.tsx:24-35; src/screens/foodForm/CreateFoodMode.tsx:544-574.
- **'Apple Watch' screen options (gestures, set entry, pages and nutrients)** — Requires an iPhone with a paired Apple Watch. The screen is also registered on Android, but has no navigation path.
  - **Partly covered by PR #3052 (merged):** On Android, Settings lists a 'Wear OS' row once a Wear OS watch has connected to the phone, and it opens the same screen with the per-set effort (RPE) prompt, the page order and visibility, and the Goals page nutrients, all applied by the Wear OS app. Its RPE scale runs from 5 to 10 instead of 1 to 10, and that description is in English in every language. 'Double-tap to log a set' and the Keypad or Digital Crown set input choice are hidden on Android and have no Wear OS equivalent.
  - Evidence: src/screens/WatchSettingsScreen.tsx:103-243 (gesturesTitle, 'Double-tap to log a set', 'Ask for effort (RPE) after each set', setInputTitle 'Keypad'/'Digital Crown', pagesTitle and reordering, 'Goals page nutrients'); reached from src/screens/SettingsScreen.tsx:368-376, only with a paired watch.
- **Live per-exercise heart rate during a strength workout** — Live HR only comes from the Apple Watch. On Android only the average and max of already synced workouts are shown, if any.
  - **Updated in PR #3052 (merged):** With a Wear OS watch connected, Android exercise cards now show the live heart rate that the Wear OS app reads from its sensor during a strength workout, the same as with an Apple Watch. Without a watch there is still no live heart rate on either platform.
  - Evidence: src/components/ActiveWorkoutExerciseCard.tsx:670-688 (useLiveHeartRate during the active workout; 'it only ever arrives from a paired watch'); src/stores/liveHeartRateStore.ts, fed only by src/hooks/useWatchWorkoutBridge.ts.

**iOS/Android differences: services & hooks**

- **Control Center / lock screen controls** — Depends on WidgetKit/ControlWidget and the iOS App Group; there is no equivalent on Android (no Quick Settings tiles).
  - **Partly covered by PRs #2989 and #3020 (merged):** Android has Quick Settings tiles for Calories left, Log water, Scan barcode and Search food, redrawn each time the panel opens (Calories left reads the calorie widget snapshot). The three that open the app use sparkyfitnessmobile:// links rather than the App Group handoff. Remove water, Start fast and End fast have no tile, and the Log water tile does not show the day's total. That total is on the water widget, which also picks up drinks logged from the tile and has a − button to remove one.
  - Evidence: useQuickActions.ts:156-190 (useControlRouteHandoff reads 'pendingControlRoute' from the App Group: scan/search/diary; return if Platform.OS !== 'ios' at :170); useWidgetSync.ts:24-27 and :124 reload the caloriesLeft/logWater controls via BackgroundWaterModule.reloadControls; targets/widget/Controls.swift:11-146 (LogWaterControl, StartFastControl, …
- **Water widget** — There is no water widget on Android; the equivalent there is the launcher's 'Log water' shortcut.
  - **Updated in PRs #2989 and #3020 (merged):** Android now has its own water widget with − and + buttons, fed from the Dashboard through useWidgetSync like the iOS one; on Android the background sync also refreshes it, an account change clears it, and a drink logged from the Log water shortcut or Quick Settings tile (the same native request as the widget's buttons) updates its total. The Android widget comes in one fixed 2×2 size, while iOS also offers a medium size and lock-screen versions. On both platforms its texts are translated into Spanish, Polish, Brazilian Portuguese, Cantonese and Simplified and Traditional Chinese, but not into the other nine shipped languages.
  - Evidence: useWidgetSync.ts:29-37 (WaterWidgetInfo) and :105-116,122 write 'waterSnapshot' (consumedMl, goalMl, drinkMl, unit, canLog) and reload 'waterWidget'; targets/widget/waterWidget.swift. Android: androidWidgetSyncService.ts:34-62 only builds calorie and macro snapshots; targets/android-widget only contains CalorieWidget and MacroWidget.
- **Liquid Glass navigation (iOS 26 tab bar and headers)** — Only iOS 26+ with expo-glass-effect APIs available; on iOS < 26 classic native headers are used with no toggle; on Android it never appears.
  - Evidence: utils/liquidGlass.ts:9-18 (false if not iOS or there is no glass API); services/nativeTabBarPreference.ts:11-14 (useNativeIOSTabsActive) and :23-27 (useNativeIOSHeadersActive, false on Android); toggle in screens/AppSettingsScreen.tsx:212-227 (only if canUseLiquidGlass()).
- **'Time Sensitive' rest-end alert** — iOS-only property. On Android the priority comes from the HIGH 'Workout timer' channel and the exact alarm, not from an interruption level.
  - Evidence: services/notifications.ts:410-414 (interruptionLevel: 'timeSensitive'); app.config.ts:210-212 com.apple.developer.usernotifications.time-sensitive entitlement.
- **Apple Watch link status** — WatchConnectivity only exists on iOS; the watch app (targets/watch) and its bridges (useWatch*Bridge in App.tsx:23) are iOS-only.
  - **Updated in PR #3052 (merged):** The developer tools' watch link section now also shows on Android, titled 'Wear OS', and is still only in development builds. There the watch counts as paired once any Wear OS watch has connected, and stays paired. It counts as reachable whenever a Wear OS watch is connected, whether or not the watch app is open, although the row still says 'Watch app not in foreground' when none is connected.
  - Evidence: hooks/useWatchConnectivity.ts:15 (isSupported = Platform.OS === 'ios' && native module) and :54-59; components/DevTools.tsx:113-117 and :653-700 ('Apple Watch' section, iOS only); DevTools is only mounted in development builds (screens/SettingsScreen.tsx:422-426).
- **Immediate sync when new health data arrives** — Android has no observers: only the periodic task and the sync on app open.
  - Evidence: hooks/useAppStartup.ts:131-162 (iOS only: startObservers -> performBackgroundSync('healthkit-observer')) and :181-183 (stopObservers); services/healthkit/backgroundDelivery.ts:136-170 (enableBackgroundDeliveryForMetric), :366-397; HealthMetrics.ts backgroundDeliveryFrequency (hourly: steps, calories, totalCalories, heartRate, distance, exerciseSes…
- **Metric: Blood alcohol** — Health Connect does not have this type.
  - Evidence: HealthMetrics.ts:622 (platforms ['ios']); services/healthkit/index.ts:269 (HKQuantityTypeIdentifierBloodAlcoholContent).
- **Metric: Menstrual flow** — Android uses 'Menstruation Period' instead.
  - Evidence: HealthMetrics.ts:651 (platforms ['ios']); services/healthkit/index.ts:267 (HKCategoryTypeIdentifierMenstrualFlow).
- **Metric: Walking speed (Mobility)** — The 'Mobility' category only exists on iOS.
  - Evidence: HealthMetrics.ts:770 (platforms ['ios'], Mobility category, backgroundDelivery 'none'); services/healthkit/index.ts:278.
- **Metric: Walking step length** — No Health Connect equivalent.
  - Evidence: HealthMetrics.ts:786 (platforms ['ios']); services/healthkit/index.ts:279.
- **Metric: Walking asymmetry (%)** — No Health Connect equivalent.
  - Evidence: HealthMetrics.ts:802 (platforms ['ios']); services/healthkit/index.ts:280-281.
- **Metric: Walking double support (%)** — No Health Connect equivalent.
  - Evidence: HealthMetrics.ts:820 (platforms ['ios']); services/healthkit/index.ts:282-283.
- **Metric: Running ground contact time** — 'Running' category only on iOS.
  - Evidence: HealthMetrics.ts:839 (platforms ['ios'], Running category); services/healthkit/index.ts:284.
- **Metric: Running stride length** — No Health Connect equivalent.
  - Evidence: HealthMetrics.ts:857 (platforms ['ios']); services/healthkit/index.ts:285.
- **Metric: Running power** — Android only has generic 'Power'.
  - Evidence: HealthMetrics.ts:873 (platforms ['ios']); services/healthkit/index.ts:286.
- **Metric: Running vertical oscillation** — No Health Connect equivalent.
  - Evidence: HealthMetrics.ts:889 (platforms ['ios']); services/healthkit/index.ts:287-288.
- **Metric: Running speed** — Android only has generic 'Speed'.
  - Evidence: HealthMetrics.ts:907 (platforms ['ios']); services/healthkit/index.ts:289.
- **Metric: Cycling speed** — 'Cycling' category only on iOS; Android uses generic 'Speed'.
  - Evidence: HealthMetrics.ts:924 (platforms ['ios'], Cycling category); services/healthkit/index.ts:290.
- **Metric: Cycling power** — Android uses generic 'Power'.
  - Evidence: HealthMetrics.ts:940 (platforms ['ios']); services/healthkit/index.ts:291.
- **Metric: Cycling functional threshold power (FTP)** — No Health Connect equivalent.
  - Evidence: HealthMetrics.ts:972 (platforms ['ios'], aggregationStrategy 'last'); services/healthkit/index.ts:292-293.
- **Metric: Apple Move Time** — 'Apple' category (rings) only on iOS.
  - Evidence: HealthMetrics.ts:1026 (platforms ['ios'], Apple category); services/healthkit/index.ts:297.
- **Metric: Apple Exercise Time** — No Health Connect equivalent.
  - Evidence: HealthMetrics.ts:1042 (platforms ['ios']); services/healthkit/index.ts:298.
- **Metric: Apple Stand Time** — No Health Connect equivalent.
  - Evidence: HealthMetrics.ts:1058 (platforms ['ios']); services/healthkit/index.ts:299.
- **Siri actions, Shortcuts app, and Action button (App Intents)** — On Android the only equivalent is the 'Log water' launcher shortcut (BackgroundWaterModule.kt:21-43). There are no shortcuts for weight or fasting, and no Google Assistant integration.
  - **Partly covered by PRs #2989, #3020 and #3051 (merged):** On Android, the launcher 'Log water' shortcut, a Log water Quick Settings tile and the water widget's − and + buttons all use the same background water request (postWaterChange in LogWaterActivity.kt). The shortcut's short label is translated in 10 of the 15 non-English languages the app ships. Its long label, the tile's label and the water widget texts are translated in 6 of them (es, pl, pt-BR, yue-Hant, zh-Hans, zh-Hant), but the result Toasts, the notifications and their 'Quick logging' channel are English only. Android still has no weight or fasting shortcuts that work without opening the app, and no Google Assistant integration.
  - Evidence: plugins/ios/ShortcutProvider.swift:9-40 (AppShortcutsProvider with the phrases 'Log water in…', 'Start a fast in…', 'End my fast in…', and 'Log my weight in…'). targets/widget/ShortcutIntents.swift:260-489 (LogWaterIntent, RemoveWaterIntent, LogWeightIntent, StartFastIntent, and EndFastIntent, with openAppWhenRun=false and a direct POST to the ser…
- **On-device nutrition and supplement label reading (Apple Intelligence)** — Requires iOS 27+ with Apple Intelligence enabled. On Android the module is null (modules/on-device-nutrition/index.ts) and AiSettings only shows the text 'Not available on this device'.
  - Evidence: screens/AiSettingsScreen.tsx:117-150 ('On-device (Apple Intelligence)' section with ToggleCard; if there is no model, shows 'Not available on this device… iOS 27 or later'). Reached via SettingsScreen.tsx:304 to AiSettings (App.tsx:1233). services/onDeviceLabelScan.ts:15-21, hooks/useRetryLabelScan.ts:29-70, hooks/useSupplementLabelScan.ts:16-23, …
- **Apple Watch app and watch sync** — There is no Wear OS app: there is no Wear target or plugin in targets/ or plugins/. On Android neither the watch settings row nor the record-with-watch option appears.
  - **Partly covered by PR #3052 (merged):** Android now has a Wear OS app with the same pages as the Apple Watch app (goals, water, medications, weight, trend, workout, Now Playing, fasting and steps). It logs and edits strength sets, records runs and walks on the watch with intervals, alerts, auto-pause and voice cues, and shows and controls the phone's GPS recording. It follows the page order, hidden pages and Goals nutrients set on the phone, which shows a 'Wear OS' settings row and the watch option in Record Activity once a Wear OS watch has connected. Unlike the Apple Watch app it has no double tap and no keypad-or-crown setting (rotary input and keypad both work), and per-set RPE only goes from 5 to 10. It also asks for no effort rating at the end, saves nothing to a health app, estimates calories from heart rate and ignores the phone's haptics and rest-alert switches. It cannot follow saved routes, although the phone still offers one when you record outdoors with the watch. As on the Apple Watch, the watch app's text is English only.
  - Evidence: targets/watch/Presentation/*.swift (WorkoutView, WatchRunView, RecordingView, FastingView, WaterLogView, CheckInEntryView, MedicationsView, StepsView, TrendView…). Bridges useWatchWorkoutBridge, useWatchRunBridge, useWatchRecordingBridge, useWatchFastingBridge, useWatchCheckInBridge, useWatchPlanSync, and useWatchSetTargetsSync imported in App.tsx…
- **Apple Watch complications** — Requires Apple Watch. Android has no equivalent (neither Wear OS Tiles nor complications).
  - **Updated in PR #3052 (merged):** Wear OS now has seven complications for the same figures: calories, protein, carbs, fat, water, fasting and steps. Each is offered as a ranged value or a short text and opens its page when tapped (calories and the macros open Goals, as on the Apple Watch). The calories one shows calories only, without the Apple Watch's outer macro ring. There are no rectangular or inline versions, which the Apple Watch's macro, fasting and steps complications have, and no Wear OS Tiles. As on the Apple Watch, their names and texts are English only.
  - Evidence: targets/watch-widget/EnergyGoalComplication.swift:277-288, FastingComplication.swift:151-162, MacroComplications.swift:216-261 (Protein/Carbs/Fat Goal), StepsComplication.swift:115-126, and WaterGoalComplication.swift:211-220. The bundle is defined in targets/watch-widget/index.swift.

**Food diary & daily logging**

- **On-device label scanning (Apple Intelligence)** — Requires iOS 27+ with Apple Intelligence and the 'Scan Labels On Device' preference; on Android the server AI is always used.
  - Evidence: modules/on-device-nutrition/expo-module.config.json (platforms: ios); services/onDeviceLabelScan.ts:15-21; FoodScanScreen.tsx:582-616 ('Label read on this iPhone'); screens/AiSettingsScreen.tsx:61-140; components/LabelScanSourceBanner.tsx
- **Day's drink history (edit time / delete)** — Only via Apple Watch (view and delete, no time editing); does not exist on Android.
  - **Partly covered by PR #3052 (merged):** Wear OS now has the drink list too: the Water page's Log button lists today's drinks with their time, and tapping one removes it after a confirmation, as on the Apple Watch, though Wear OS lists them oldest first. Wear OS also has an Undo Last button that removes a drink without asking: the day's earliest, not the latest, once taps have synced, because the phone sends the drinks newest first. The phone app still has no drink list on either platform, and neither watch can change a drink's time as the web does.
  - Evidence: The phone does not have this list; only the Apple Watch allows deleting (targets/watch/Presentation/WaterLogView.swift:4-36; hooks/useWatchCheckInBridge.ts:1140-1158)
- **Diary nutrition and water on Apple Watch** — No Wear OS equivalent.
  - **Updated in PR #3052 (merged):** The Wear OS app now has the same two pages. Its Goals page shows a calorie ring with eaten against the goal, kcal left and the nutrients picked on the phone under Settings > Wear OS, but not calories burned, which the Apple Watch shows beside the ring. Its Water page has one button per container, progress against the goal, the water from food and a Log button with the day's drinks, plus an Undo Last button that removes a drink without asking (the day's earliest, not the latest, once taps have synced, because the phone sends the drinks newest first).
  - Evidence: targets/watch/Presentation/GoalSummaryView.swift, WaterIntakeView.swift; hooks/useWatchCheckInBridge.ts; utils/watchNutrients.ts

**Exercises, workouts & running**

- **Heart rate alert during recording** — Requires a paired Apple Watch (modules/watch-connectivity only declares the ios platform in expo-module.config.json); not shown on Android.
  - **Updated in PR #3052 (merged):** Android now offers the heart rate alert too once a Wear OS watch has connected: during a phone recording the Wear OS app sends its heart rate to the phone, which buzzes (and speaks, with voice cues on) when it stays outside the range, and a run recorded on the Wear OS watch alerts on the watch, as the Apple Watch does. It still needs a watch on both platforms and is not offered for rides; web still has none.
  - Evidence: src/screens/RecordActivityScreen.tsx:1199-1215 (only if watchAvailable: 'Heart rate comes from the Apple Watch'); HeartRateBandCard.tsx:83-105
- **Record with Apple Watch GPS and follow it on the phone** — Depends on WatchConnectivity (iOS only); no Wear OS support.
  - **Updated in PRs #3052, #3065, #3069 and #3127 (merged):** Android now offers the same choice of recording device once a Wear OS watch has connected: a walk or run, outdoors or on a treadmill, is recorded on the Wear OS app with its own sensors and followed live on the phone, with pause, finish, auto-pause and pace and heart rate alerts. Unlike the Apple Watch, the Wear OS app cannot follow a saved route (the phone still offers the choice, but the watch ignores it), has no indoor jump rope, asks for no effort rating at the end and sends no step count for cadence and stride.
  - Evidence: src/screens/RecordActivityScreen.tsx:261-269, 1073-1127 ('Record with' Phone GPS / Watch GPS); src/screens/WatchRunLiveScreen.tsx:64-201; App.tsx:611
- **Recording status on the lock screen** — iOS: Live Activity with Pause/Resume and Lap buttons. Android: no Live Activity; only the foreground service notification with title and text (gpsRecordingService.ts:1111-1135), no controls.
  - Evidence: src/services/runLiveActivity.ios.ts (+ RunLiveActivityLayout.tsx:50-117, run-toggle and run-lap buttons 56-57); src/services/runLiveActivity.ts:1-13 (Android: empty functions)
- **Strength workout on Apple Watch** — Apple Watch only (watchOS target and watch-connectivity module are iOS only).
  - **Updated in PRs #3052 and #3065 (merged):** Wear OS now runs strength workouts too: it follows a workout started on the phone or starts a preset or today's scheduled one, logs each set with the rotary crown, +/− or a keypad, runs a rest timer with +15 s and Skip, asks for an optional RPE, adds, deletes or changes the type of sets, adds, deletes or skips exercises, finishes or discards the workout and asks whether to update the preset, shows New PR banners and sends live heart rate to the phone. Still Apple Watch only: double tap to log a set, the full 1 to 10 RPE scale (Wear OS offers 5 to 10), volume, maximum heart rate and the effort rating in the summary, and saving the workout to a health app.
  - Evidence: targets/watch/Presentation/WorkoutView.swift:234-1982; src/hooks/useWatchWorkoutBridge.ts, useWatchWorkoutStart.ts:27-35, useWatchWorkoutEdit.ts:29-31, useWatchPlanSync.ts:32-35, useWatchSetTargetsSync.ts:115; live HR in ActiveWorkoutExerciseCard.tsx:1484-1500 (stores/liveHeartRateStore.ts)
- **Standalone run/walk on Apple Watch** — Apple Watch only.
  - **Partly covered by PRs #3052, #3065, #3069, #3090 and #3127 (merged):** Wear OS now records runs and walks on its own too: outdoors with the watch GPS or indoors, free or following the program workout or an interval plan, with pace and heart rate alerts, auto-pause, spoken cues, laps and a treadmill distance correction; the phone can also start one there, follows it live and files it in the diary. Still Apple Watch only: following a saved route, Jump Rope, setting the alert ranges on the watch (Wear OS uses the ranges last set on the phone, or a default), ending distance steps when the distance is covered (Wear OS uses their expected time), the effort rating after the run, the step count behind cadence and stride, and saving the workout to a health app. On Android the phone still offers the watch route options, but a run started on the watch with a route is recorded without following it, and Send to watch fails.
  - Evidence: targets/watch/Presentation/WorkoutView.swift:2118-2333 ('Follow a plan', 'Alerts'); WatchRunView.swift:29-201; src/hooks/useWatchRunBridge.ts:29-33; services/watchRunQueue.ts
- **Apple Watch workout settings** — Only shown on iOS with a paired Apple Watch.
  - **Updated in PR #3052 (merged):** Android now shows a Wear OS row in Settings once a Wear OS watch has connected to the phone; it opens the same screen, titled Wear OS, with the settings the Wear OS app applies: asking for effort (RPE) after each set, worded for its 5 to 10 scale, page order and visibility, and the Goals page nutrients. Double-tap to log a set and the Keypad or Digital Crown choice stay iOS-only, as Wear OS has no double tap and always offers both a keypad and the rotary crown. The Wear OS wording of the RPE hint is English in every language.
  - Evidence: src/screens/WatchSettingsScreen.tsx:124-243; visible only with a paired watch (SettingsScreen.tsx:53-55, 368-376)

**Check-in, body measurements & wellbeing**

- **'Fasting' quick action on the app icon** — Only registered on iOS; on Android there are no app shortcuts.
  - **Updated in PR #2989 (merged):** Android now also shows Fasting when you long-press the app icon (expo-quick-actions, with its own adaptive icon), and it opens the fasting detail as on iOS. Its title comes from the same quickActions string on both platforms.
  - Evidence: src/hooks/useQuickActions.ts:44-46,119-121, 142 (Platform.OS !== 'ios' → return)
- **Control Center controls and Siri shortcuts to start and end a fast** — iOS widget extension; no equivalent on Android (targets/android-widget only has the calories widget).
  - Evidence: targets/widget/Controls.swift:44-68 (StartFastControl, EndFastControl); targets/widget/ShortcutIntents.swift:370-410 (StartFastIntent, EndFastIntent)
- **Siri shortcut 'Log weight'** — iOS only (App Intents).
  - Evidence: targets/widget/ShortcutIntents.swift:338-366 (LogWeightIntent, openAppWhenRun=false)
- **Weight and body fat % check-in on Apple Watch** — watchOS app; on Android there is no Wear OS app (modules/watch-connectivity only has ios/).
  - **Updated in PR #3052 (merged):** The Wear OS app now has it: a Weight Check-In page (rotary crown, +/− or keypad) with an optional body fat % step, the change since the last entry with a warning for an unlikely weight, and a Set Start button for a starting weight while there is no history. Its Trend page shows the last 14 weights with a 7-day rolling mean, or body fat, switched by tap or crown. Unlike the Apple Watch, saving stays on the entry page instead of moving to the trend, an unlikely body fat change gets no warning, and there is no one-time setup on first launch.
  - Evidence: targets/watch/Presentation/CheckInEntryView.swift:1-60; TrendView.swift:5-25; App.tsx:202-211 (WatchCheckInGate → useWatchCheckInBridge → upsertCheckIn, src/hooks/useWatchCheckInBridge.ts:16,686-687)
- **Fasting on Apple Watch and fasting complication** — watchOS only.
  - **Partly covered by PR #3052 (merged):** The Wear OS app now has a Fasting page (elapsed time and a ring with the share of the goal, but no time remaining), start buttons for 16:8, 18:6, 20:4 and OMAD, End Fast without a confirmation, and a Fasting complication with the hours elapsed. Starting a fast from Wear OS fails: the watch sends the label ('16:8', 'OMAD') as the preset id, but the phone looks presets up by id ('16-8', '18-6', '20-4') and has no OMAD, so it rejects the request and no fast is saved (the watch shows it only until the phone's next update). Ending a fast from the watch works.
  - Evidence: targets/watch/Presentation/FastingView.swift:18-116; targets/watch-widget/FastingComplication.swift; src/hooks/useWatchFastingBridge.ts:22-40
- **Steps on Apple Watch and steps complication** — watchOS only.
  - **Updated in PR #3052 (merged):** The Wear OS app now has a Daily Steps page with today's steps against the goal on a ring and the steps left, plus a Steps complication. Unlike the Apple Watch, which only shows the count the phone last sent, Wear OS also raises the count from the watch's own step sensor when that is higher.
  - Evidence: targets/watch/Presentation/StepsView.swift:3-20; targets/watch-widget/StepsComplication.swift
- **Apple Watch settings: reorder and hide pages (Check-in, Trend, Fasting, Steps…)** — Only appears with a paired Apple Watch; on Android there is no watch app (modules/watch-connectivity only has ios/).
  - **Updated in PR #3052 (merged):** Android now shows a Wear OS row in Settings once a Wear OS watch has connected, and it opens the same screen: page order and visibility (the Wear OS app follows them and keeps the Workout page while a workout runs), the Goals page nutrients and the RPE switch. The Double-tap to log a set switch and the Keypad/Digital Crown set input are only on iOS, and the RPE switch's Wear OS description (a 5 to 10 scale instead of 1 to 10) is English only in every shipped language.
  - Evidence: src/screens/SettingsScreen.tsx:368-377 ('Apple Watch' row only if hasPairedWatch); src/screens/WatchSettingsScreen.tsx:190-215 ('Pages', ReorderSwitchList 'Drag a page by its handle… Toggle a page off to hide it'); targets/watch/Presentation/ContentView.swift:28-62 (pages 'as the phone last arranged them') and 183-185 (shown() discards hidden page…

**Goals & onboarding**

- **Apple Watch: Goals page and complications** — iOS only, with a paired Apple Watch; there is no Wear OS equivalent.
  - **Updated in PR #3052 (merged):** Wear OS now has a Goals page too, with the calorie ring and the nutrients chosen in Settings > Wear OS, and the same seven complications as the Apple Watch (calories, protein, carbs, fat, water, fasting and steps), each opening its page. Still different: the Wear OS page shows calories eaten against the goal and kcal left but not calories burned, its calories complication has no macro rings, and its complications come only as ranged value and short text, while on Apple Watch the macro, steps and fasting ones also have corner, rectangular and inline formats. On both watches the texts are English only, apart from the nutrient names sent by the phone.
  - Evidence: SparkyFitnessMobile/targets/watch/Presentation/GoalSummaryView.swift; targets/watch-widget/EnergyGoalComplication.swift, WaterGoalComplication.swift, MacroComplications.swift, StepsComplication.swift; src/hooks/useWatchCheckInBridge.ts (goalNutrients, stepGoal); Settings > Apple Watch (WatchSettingsScreen)

**Reports & analytics**

- **Weight and body fat % trend on Apple Watch** — watchOS target created with @bacons/apple-targets; there is no Wear OS equivalent (targets/ only has Android widgets and notifications).
  - **Updated in PR #3052 (merged):** Wear OS now has a Weight Trend page as well: the last 14 weight check-ins with a 7-point rolling mean, switched to a body fat line by a tap or the rotary crown once there are two body fat readings, and it can be reordered or hidden in Settings → Wear OS. Unlike the Apple Watch, saving a weight check-in on Wear OS does not open the trend page; the wearer swipes to it.
  - Evidence: TrendView with weight and bodyFat metrics and rollingMean (SparkyFitnessMobile/targets/watch/Presentation/TrendView.swift:13-40), .trend page (ContentView.swift:168-169), can be enabled in Settings → Apple Watch ('Weight trend', src/constants/watchPages.ts:15,40-41; SettingsScreen.tsx:368-377, visible only with a paired watch).

**Medications, GLP-1 & symptoms**

- **'Medications' page on Apple Watch** — iOS only with a paired Apple Watch; there is no Wear OS equivalent (watch-connectivity returns null on Android, modules/watch-connectivity/index.ts:1032).
  - **Updated in PR #3052 (merged):** Wear OS now has a Medications page: today's scheduled and as-needed doses with a taken count, where a tap marks a dose taken or not taken (sent to the phone at once or queued until it is reachable), and it follows the page order and hidden pages set on the phone. Unlike the Apple Watch page, it shows no sync status or retry, shows a skipped dose like a pending one, and before the first sync says nothing is scheduled instead of asking you to open the phone app. On both watches, skipping and logging an as-needed dose more than once stay on the phone.
  - Evidence: targets/watch/Presentation/MedicationsView.swift:12; page registered in src/constants/watchPages.ts:13,36; data and taps in src/hooks/useWatchCheckInBridge.ts:529 (medicationsForWatch) and 1319 (handleMedicationTaken); order/visibility in WatchSettingsScreen.

**AI chat (SparkyChat) & AI settings**

- **“Scan Labels On Device” toggle (Apple Intelligence)** — The native module only exists on iOS (modules/on-device-nutrition/expo-module.config.json platforms:['ios']; index.ts:52-58 returns null outside iOS). On Android the AI screen only shows the text “Not available on this device”.
  - Evidence: SparkyFitnessMobile/src/screens/AiSettingsScreen.tsx:61-67, 118-151; src/stores/appPreferencesStore.ts:94, 414 (onDeviceLabelScanEnabled)
- **On-device nutrition label reading** — iOS 27+ only, with Apple Intelligence enabled; on Android the server is always used.
  - Evidence: SparkyFitnessMobile/modules/on-device-nutrition/index.ts:44-50 (isAvailable, scanLabel); modules/on-device-nutrition/ios/OnDeviceNutritionModule.swift; src/services/onDeviceLabelScan.ts:15-70; src/screens/FoodScanScreen.tsx:576-620

**Settings, profile, family & integrations**

- **Liquid Glass navigation** — canUseLiquidGlass() returns false if Platform.OS !== 'ios' or the glass API is not available.
  - Evidence: src/screens/AppSettingsScreen.tsx:212-228; src/utils/liquidGlass.ts:9-17
- **Apple Watch settings** — WatchConnectivity only has an iOS implementation (modules/watch-connectivity/ios, index.ts:1032).
  - **Partly covered by PR #3052 (merged):** On Android a Wear OS row appears in Settings once a Wear OS watch has connected to the phone, and it opens the same screen: the effort (RPE) prompt after each set (5 to 10 on Wear OS, 1 to 10 on Apple Watch), the order and visibility of the watch pages and the Goals page nutrients, and the Wear OS app applies all of them. Double-tap to log a set and the Keypad or Digital Crown choice are Apple Watch only: Wear OS adjusts the selected value with the rotary crown and opens a keypad when you tap it again. The Wear OS description of the effort prompt is English only.
  - Evidence: src/screens/SettingsScreen.tsx:52-55,368-377 (only if a watch is paired) → WatchSettingsScreen.tsx:103-240; modules/watch-connectivity (ios/ only)

**Native mobile capabilities**

- **Apple Health-only metrics** — Stress (MindfulSession), dietary fat, protein, and sodium, and environmental and headphone audio exposure are defined with enabled:false (HealthMetrics.ts:185, 733, 749, 765, 1005, 1021), so they are not shown.
  - Evidence: HealthMetrics.ts:622-1072 (platforms: ['ios']); healthkit/index.ts:266-290 (HK identifiers)
- **Interactive water widget** — Android has no water widget: targets/android-widget only includes Calorie and Macro.
  - **Updated in PR #3020 (merged):** Android now has an interactive water widget too: a 2x2 home-screen widget with today's water against the goal, a bar, and − and + buttons that remove or add one drink of the container chosen on the Dashboard without opening the app. It comes in one fixed size with no Lock Screen versions, while iOS offers small and medium sizes and three Lock Screen shapes.
  - Evidence: targets/widget/waterWidget.swift:152-165 (Button(intent: RemoveWaterIntent/LogWaterIntent)), 250-264; targets/widget/index.swift:10
- **Lock Screen widgets** — Android widgets declare widgetCategory="home_screen".
  - Evidence: widgets.swift:319-322; macroWidget.swift:423-426; waterWidget.swift:260-263
- **Control Center and Lock Screen controls** — Requires iOS 18 or later.
  - **Partly covered by PRs #2989 and #3020 (merged):** Android has four Quick Settings tiles as counterparts: Log water (logs a drink in the background, also from the lock screen), Scan barcode, Search food and Calories left (today's kcal left; opens the diary). Remove water, Start fast and End fast have no tile; on the phone, the only way to remove a drink without opening the app is the − button on the home screen water widget. The Log water tile does not show the day's total like the iOS control; on Android that total is on the water widget.
  - Evidence: targets/widget/index.swift:9-18 (if #available(iOS 18.0)); targets/widget/Controls.swift:11-146; ShortcutIntents.swift:455-497; hooks/useQuickActions.ts:162-170 (useControlRouteHandoff)
- **Siri and Shortcuts actions (App Intents)** — Requires iOS 16 or later. Siri phrases are only in English (ShortcutProvider.swift:13-34).
  - Evidence: plugins/ios/ShortcutProvider.swift:9-38; targets/widget/ShortcutIntents.swift:260-420; plugins/withBackgroundWater.ts:1-35; modules/background-water/ios/BackgroundWaterModule.swift; services/backgroundWater.ts (credentials to run without opening the app)
- **Workout Live Activity (Lock Screen and Dynamic Island)** — The buttons require iOS 17 or later. A tap made after force-quitting the app is lost. workoutLiveActivity.ts is a no-op on Android.
  - Evidence: services/WorkoutLiveActivityLayout.tsx:316-349 (rest-add-15, rest-subtract-15, rest-skip, complete-set buttons); services/workoutLiveActivity.ios.ts:486; App.tsx:452 ('active-workout' link); app.config.ts:300-312 (expo-widgets)
- **Run and GPS recording Live Activity** — On Android there is only the fixed foreground service notification ('Recording your activity / Tracking your run with GPS', utils/recordingNotification.ts:7-25), with no live stats or buttons.
  - Evidence: services/RunLiveActivityLayout.tsx:118-134 (run-toggle, run-lap); services/runLiveActivity.ios.ts:460; App.tsx:454 ('record-activity' link); services/runLiveActivity.ts (no-op on Android)
- **Apple Watch companion app** — The watch-connectivity module returns null on Android. There is no Wear OS app.
  - **Updated in PR #3052 (merged):** Android now has a Wear OS companion app (Wear OS 3 or later) with the same pages, in the order and visibility set on the phone: Goals, Water, Medications, Weight, Trend, Workout, Fasting and Steps, plus Now Playing during a workout. Like the Apple Watch app, it talks only to the phone (through the Wearable Data Layer), never to the server. Only the Apple Watch has saved routes, indoor Jump Rope, the effort rating after a workout or run, double tap, and the choice between keypad and crown set input (Wear OS always adjusts the selected value with the rotary crown).
  - Evidence: targets/watch/expo-target.config.js:86-94; targets/watch/Presentation/ContentView.swift; modules/watch-connectivity/index.ts:905-907; App.tsx:479-481 (WatchCheckInGate, WatchWorkoutGate)
- **Apple Watch settings on the phone** — The row only appears if WatchConnectivity.isSupported() and isPaired() return true.
  - **Updated in PR #3052 (merged):** Android now shows a Wear OS row in Settings once a Wear OS watch has connected to the phone. It opens the same screen with the RPE switch, page order and visibility, and the Goals page nutrients; Double-tap to log a set and the choice between keypad and Digital Crown set input are iOS only. The Wear OS description of the RPE switch (5 to 10, rotary crown or +/−) is English in every language, while the Apple Watch one is translated in 6 of the 15 other shipped languages.
  - Evidence: SettingsScreen.tsx:54-55 (isPaired), 368-376 (Apple Watch row); screens/WatchSettingsScreen.tsx:124-245; constants/watchPages.ts:10-19, 55-60
- **Watch Goals page** — Apple Watch only.
  - **Updated in PR #3052 (merged):** Wear OS now has the Goals page too: a calorie ring with what was eaten against the goal, the calories left or over, and the nutrients chosen on the phone (protein, carbs and fat by default, custom ones included). Unlike the Apple Watch, it does not show calories burned.
  - Evidence: targets/watch/Presentation/GoalSummaryView.swift; utils/watchNutrients.ts; hooks/useWatchCheckInBridge.ts
- **Watch Water page** — Apple Watch only.
  - **Updated in PR #3052 (merged):** Wear OS now has the Water page too: one button per water container, today's total against the goal with 'Includes X from food', and the day's drinks, each removable after a 'Remove Drink?' prompt. It also has an Undo Last button, which the Apple Watch lacks and which removes the latest drink without asking, and when no containers have synced it shows placeholder Glass (250 ml) and Bottle (500 ml) buttons, where the Apple Watch shows a message instead.
  - Evidence: targets/watch/Presentation/WaterIntakeView.swift; WaterLogView.swift:68-124; utils/watchWater.ts
- **Watch Medications page** — Apple Watch only.
  - **Updated in PR #3052 (merged):** Wear OS now has the Medications page: the same list the phone sends, with a count of doses taken, and a tap marks a dose as taken or unmarks it. Skipping a dose is still done on the phone. Unlike the Apple Watch, it shows no sync status or retry, and does not show which doses were skipped.
  - Evidence: targets/watch/Presentation/MedicationsView.swift; utils/watchMedications.ts; useWatchCheckInBridge.ts
- **Weight check-in and trend on the watch** — Apple Watch only.
  - **Updated in PR #3052 (merged):** Wear OS now has the weight check-in and the Trend page: weight set with the rotating crown or bezel, +/− or a keypad, optional body fat %, the change since the last weigh-in with a warning for a sudden change, a starting weight when there is no history, and a chart of the last 14 weight entries with a rolling average, or of body fat. Unlike the Apple Watch, it does not say when it is replacing today's entry and does not show the body fat change since the last entry or warn about a sudden one.
  - Evidence: targets/watch/Presentation/CheckInEntryView.swift:12-31, 140-168; TrendView.swift:107; Application/CheckInStore.swift
- **Watch Fasting page** — Apple Watch only.
  - **Partly covered by PR #3052 (merged):** Wear OS now has a Fasting page with the elapsed time and progress against the goal, End Fast (with no confirmation step), and a Fasting complication. Starting a fast from it does not work: it offers 16:8, 18:6, 20:4 and OMAD but sends the label ('16:8') where the phone expects a preset id ('16-8'), so the phone rejects every start and no fast is saved.
  - Evidence: targets/watch/Presentation/FastingView.swift:44-107; hooks/useWatchFastingBridge.ts
- **Watch Steps page** — Apple Watch only.
  - **Updated in PR #3052 (merged):** Wear OS now has a Steps page with today's steps against the person's step goal (10,000 when none is set), plus a Steps complication. Unlike the Apple Watch, which only shows the phone's count, it also uses the watch's own step sensor when that reads higher.
  - Evidence: targets/watch/Presentation/StepsView.swift; useWatchCheckInBridge.ts (steps, stepGoal)
- **Strength workout tracking on the watch** — Double tap requires watchOS 11 and a compatible watch.
  - **Updated in PR #3052 (merged):** On Wear OS too, a workout started on the phone is sent to the watch and brings the app to the front; sets are logged one per screen with the rotating crown or bezel or a keypad, heart rate is read in a foreground service and sent to the phone, and a Now Playing page appears during the workout. The rest timer has +15 s and Skip and vibrates when it ends, but a rest started or changed on the phone does not show on the watch (the watch's changes do reach the phone). There is no double tap and no −15 s button.
  - Evidence: targets/watch/Presentation/WorkoutView.swift; Application/WorkoutSessionStore.swift; Infrastructure/WorkoutHealthKitController.swift; Presentation/NowPlayingPage.swift; Domain/WatchPage.swift:13; hooks/useWatchWorkoutBridge.ts; useWatchSetTargetsSync.ts; modules/watch-connectivity/ios/WatchConnectivityModule.swift:285 (startWatchApp)
- **Start and edit workouts from the watch** — 'Replace exercise' is not available on the watch yet.
  - **Updated in PRs #3010 and #3052 (merged):** Wear OS now lists saved workouts and those scheduled for today and starts them from the wrist; during the workout you can add or delete a set, change its type, add, delete or skip an exercise, jump to any set, and finish or discard, but without the confirmations the Apple Watch asks for. On both watches a workout started from the wrist now gets the phone's progression targets and PR detection even if the phone's workout screen is never opened, and neither watch can replace an exercise yet.
  - Evidence: targets/watch/Presentation/WorkoutEditPages.swift; hooks/useWatchWorkoutStart.ts; useWatchWorkoutEdit.ts; useWatchPlanSync.ts; utils/workoutPlanSchedule.ts
- **Workout finish on the watch** — Apple Watch only.
  - **Updated in PRs #3052 and #3065 (merged):** Wear OS now also celebrates a new PR with a banner and a vibration, asks 'Update Preset?' when a workout from a preset was changed on the watch, and ends with a summary of sets, duration, average heart rate and calories (estimated from heart rate). It does not show volume or maximum heart rate, does not save the workout to Health Connect, and lacks the 1–10 'How hard was that?' effort rating that the Apple Watch summary now asks for and saves to the server and, on watchOS 11 or later, to Apple Health.
  - Evidence: Application/WorkoutSessionStore.swift (makeSummary, celebratedPrSetIds); App.tsx:482 (PendingPresetUpdatePrompt); hooks/useWorkoutCompletePresetSync.ts; services/healthkit/dataTransformation.ts (isOwnWatchWorkout)
- **Standalone run or walk on the watch** — Apple Watch only.
  - **Updated in PRs #3052, #3065, #3069, #3090 and #3127 (merged):** Wear OS now records a run or walk on its own too: outdoors with the watch GPS or indoors, with plans, pace and heart-rate alerts, auto-pause, spoken cues, laps, treadmill distance correction and a summary, and the phone follows and controls it on WatchRunLive. Only the Apple Watch offers indoor Jump Rope, following a saved route (map, turn cues and off-route warning) and the effort rating after the run. Wear OS runs are also saved without cadence or stride, because the watch sends no step count and Android has no other source for one.
  - Evidence: targets/watch/Presentation/WatchRunView.swift:29-311; Application/WatchRunStore.swift; Infrastructure/WatchRunHealthKitController.swift, WatchRunCues.swift; screens/WatchRunLiveScreen.tsx; hooks/useWatchRunBridge.ts; App.tsx:611-612
- **Control the phone's GPS recording from the watch** — Apple Watch only.
  - **Updated in PR #3052 (merged):** Wear OS now works as a remote for the phone's GPS recording too. It shows time, distance, pace, heart rate and the current plan step, has Pause/Resume, Lap and Stop, and sends the watch's heart rate to be attached to the activity. Unlike the Apple Watch, it shows no summary when the recording ends.
  - Evidence: targets/watch/Presentation/RecordingView.swift:14-109; hooks/useWatchRecordingBridge.ts:30-45
- **On-device label reading (Apple Intelligence)** — iOS 27+ only, with Apple Intelligence enabled. On Android the module is null.
  - Evidence: modules/on-device-nutrition/index.ts:44-50 (isAvailable: iOS 27+ with Apple Intelligence); ios/OnDeviceNutritionModule.swift; services/onDeviceLabelScan.ts:15, 251; onDeviceSupplementScan.ts:177; AiSettingsScreen.tsx:61-140; FoodScanScreen.tsx:582-615
- **Liquid Glass navigation (iOS 26)** — The row only appears if canUseLiquidGlass() is true. Android always uses CustomTabBar.
  - Evidence: AppSettingsScreen.tsx:211-226; services/nativeTabBarPreference.ts:13, 26; components/TabsLayout.tsx; patches/react-native-bottom-tabs@1.4.0.patch
- **Live HR and HR range targets during GPS recording** — A paired Apple Watch is required, so it only works on iOS and not for rides. On Android, GPS recording has no HR or HR targets; only pace targets. Bluetooth heart rate monitors are not supported.
  - **Updated in PRs #3052 and #3078 (merged):** On Android a paired Wear OS watch now supplies the heart rate, so the heart rate range cards (overall, and work, easy and warm-up in intervals) appear and alert both when the phone records with its GPS and when the watch records the walk or run. As on iOS, there is no heart rate without a watch, none for rides and no support for Bluetooth heart rate monitors; on both platforms the suggested interval ranges now follow the heart rate zones from settings. The main card's Android description ('Needs your Wear OS watch…') is English-only, while the Apple Watch one is translated into six languages.
  - Evidence: screens/RecordActivityScreen.tsx:146-158 (default bands), 268-269 (watchAvailable = watchSupported && watchPaired && activity !== 'ride'), 407 (HR warm-up only with watch), 497, 1200-1201 and 1316-1345 (HeartRateBandCard only with watchAvailable); hooks/useWatchRecordingBridge.ts:251 (HR from the watch)

### 3.2 Android only (31)

**iOS/Android differences: native configuration**

- **Android-only health metrics (Health Connect)** — They do not appear in the metrics list on iOS.
  - Evidence: SparkyFitnessMobile/src/HealthMetrics.ts:450 (speed), 464 (power), 478 (elevationGained), 507 (bodyWaterMass), 535 (cyclingPedalingCadence), 591 (stepsCadence) with platforms: ['android']; filter in HealthMetrics.ts:1076-1085; app.config.ts:37-66 (READ_BODY_WATER_MASS, READ_CYCLING_PEDALING_CADENCE, READ_ELEVATION_GAINED, READ_POWER, READ_SPEED, R…
- **Exact alarms permission ('Alarms & reminders')** — Android 12+/13+ only; not applicable on iOS (canScheduleExactAlarms returns true).
  - Evidence: SparkyFitnessMobile/src/services/ExactAlarmBridge.ts:8-34; src/services/notifications.ts:329-376 (maybePromptForExactAlarmPermission); app.config.ts:77-80 (SCHEDULE_EXACT_ALARM); plugins/withExactAlarmModule.ts; targets/android-exact-alarm/kotlin/.../ExactAlarmModule.kt
- **Notification channels configurable in system settings** — iOS has no channels; only the app's global notifications toggle.
  - **Updated in PRs #2989 and #3028 (merged):** Android also has a 'Mood check-ins' channel (high importance, vibration) for the daily mood reminders, and a 'Quick logging' channel (default importance, no sound or vibration) for the result of the Log water Quick Settings tile. The Mood check-ins name goes through the app's strings like the other JS channels, but no other shipped language has translated it yet; the Quick logging name and its messages are written in English in the native code. iOS still has no channels.
  - Evidence: SparkyFitnessMobile/src/services/notifications.ts:57-92,144-170 (setNotificationChannelAsync only if Platform.OS === 'android'); targets/android-workout-notification/kotlin/.../WorkoutNotificationModule.kt (Ongoing workout channel, IMPORTANCE_LOW)

**iOS/Android differences: components**

- **Health metrics syncable only on Android (Health Connect)** — They do not appear on iOS. iOS has its own cycling and running metrics (see plat-components-health-metrics-ios-only), not these.
  - Evidence: platforms:['android'] entries in SparkyFitnessMobile/src/HealthMetrics.ts: speed (460), power (474), elevationGained (488), bodyWaterMass (517), cyclingPedalingCadence (545), stepsCadence (601). They are filtered in HealthMetrics.ts:1076-1084 and shown in SparkyFitnessMobile/src/components/HealthDataSync.tsx:252-271
- **DevTools: shortcuts to Health Connect settings and data** — Android only and only in development builds. iOS has no equivalent shortcut to the Health app.
  - Evidence: SparkyFitnessMobile/src/components/DevTools.tsx:594-615 (Platform.OS === 'android'; openHealthConnectSettings / openHealthConnectDataManagement). DevTools is only shown with __DEV__ and APP_VARIANT development/dev: SparkyFitnessMobile/src/screens/SettingsScreen.tsx:421-425
- **DevTools: check the background read permission** — Android only and only in development builds. The 'Trigger Sync' button (DevTools.tsx:627-636) is on both platforms.
  - Evidence: SparkyFitnessMobile/src/components/DevTools.tsx:420-440 (handleCheckBackgroundPermissions with getGrantedPermissions), 637-649 (Platform.OS === 'android'); development builds only (SettingsScreen.tsx:421-425)

**iOS/Android differences: screens**

- **Health metrics syncable only on Android** — On iOS there is no direct equivalent for generic speed, power and cadence, but there are running- and cycling-specific variants, which are iOS-only.
  - Evidence: SparkyFitnessMobile/src/HealthMetrics.ts:450 (speed), 464 (power), 478 (elevationGained), 507 (bodyWaterMass), 535 (cyclingPedalingCadence), 591 (stepsCadence), all with platforms: ['android']; filtered at 1076-1085
- **Health data report (anonymized export for bug reports)** — On iOS the button is not shown and there is no equivalent alternative on this screen.
  - Evidence: SparkyFitnessMobile/src/screens/SyncScreen.tsx:1011-1045 ({isAndroid && ...} block, comment 'Health Data Report — Android only'), 706-721 (handleShareHealthReport -> shareHealthDiagnosticReport)
- **Tips for recording with the screen off (battery optimization)** — Not shown on iOS because recording continues with the screen locked thanks to the background location task.
  - Evidence: SparkyFitnessMobile/src/screens/RecordActivityScreen.tsx:1443-1467 ({Platform.OS === 'android' && !indoor ? ...}, recordActivity.androidTips.* keys)
- **'On-time alerts' prompt to allow exact alarms** — On iOS the module does not exist and canScheduleExactAlarms returns true, so the prompt never appears.
  - Evidence: src/services/notifications.ts:336-370 (maybePromptForExactAlarmPermission with Alert 'On-time alerts' / 'Open Settings'); src/services/ExactAlarmBridge.ts:8-30 (Android-only module); called from src/screens/NotificationSettingsScreen.tsx:132, src/hooks/useStartLiveWorkout.ts:345, src/screens/WorkoutDetailScreen.tsx:361 and src/components/Medicatio…

**iOS/Android differences: services & hooks**

- **Widget refresh from the server in the background** — On iOS the snapshots are only written from useWidgetSync (app in the foreground showing today); WidgetKit does not receive new data from the background task.
  - **Updated in PRs #2989 and #3020 (merged):** The Android background refresh now also updates the water widget's total and goal, and keeps the drink size and unit the app last sent. The Calories left Quick Settings tile reads that same refreshed calorie snapshot whenever the panel opens. The snapshots are erased when the account changes, and a refresh that is still loading at that moment pushes nothing. iOS still has no background refresh: the background task does not touch its widgets.
  - Evidence: backgroundSyncService.ts:132-141 (only if Platform.OS === 'android') calls refreshAndroidWidgetsFromServer (androidWidgetSyncService.ts:94-118: timezone, loadDailySummaryRawData, push calorie+macro).
- **Exact alarm permission ('Alarms & reminders')** — Without the permission, Android batches alarms ~15 s late. On iOS the issue does not apply and it is never shown.
  - Evidence: services/ExactAlarmBridge.ts:8-34 (NativeModules.ExactAlarm only on Android; on iOS returns true); services/notifications.ts:330-377 maybePromptForExactAlarmPermission (Alert 'On-time alerts' with 'Open settings'); invoked from screens/NotificationSettingsScreen.tsx:132, screens/WorkoutDetailScreen.tsx:361, hooks/useStartLiveWorkout.ts:345 and com…
- **Per-category notification channels** — iOS has no channels; the user can only turn the app's notifications on/off in Settings. Categories with action buttons (Complete Set, Log as taken, Skip) exist on both.
  - **Updated in PRs #2989, #3005 and #3028 (merged):** The channels created from JS now also include 'Mood check-ins' (high importance, vibration) for the daily mood reminders, and its name is English only so far. Medication reminders on both platforms also gained a snooze button ('Remind in N m'). A native 'Quick logging' channel, with default importance and no sound, vibration or pop-up, is created the first time the Log water Quick Settings tile posts its result. Its name and messages are hard-coded in English. iOS still has no channels.
  - Evidence: services/notifications.ts:57-91 (registerLocalizedNotificationPresentation creates 4 channels only if Platform.OS === 'android'), :144-157 (ensureMedicationReminderChannel) and :159-170 (ensureSymptomReminderChannel); triggers use channelId (:419, :517, :567, :613).
- **Per-workout route consent for imported workouts** — On iOS the route is authorized once together with workouts (HKWorkoutRouteTypeIdentifier in WORKOUT_TELEMETRY_READ_IDENTIFIERS, services/healthkit/index.ts:197-212).
  - Evidence: services/healthconnect/provider.ts:94-123 (prepareInteractiveRead -> prefetchSessionRoutes before reads with timeout); services/healthconnect/workoutTelemetry.ts:30-75 (decisions stored in '@SparkyFitness/routeConsent:', denial expires after 24 h), :171-172 (serialized requestExerciseRoute), :241; app.config.ts:42-46 (READ_EXERCISE_ROUTES, not REA…
- **Metric: Speed (generic)** — iOS has no generic speed; it offers Walking Speed, Running Speed, and Cycling Speed separately (ios_only rows).
  - Evidence: HealthMetrics.ts:450 (platforms ['android'], type speed); app.config.ts:64 READ_SPEED; services/healthconnect/dataTransformation.ts:240.
- **Metric: Power (generic)** — iOS offers Running Power and Cycling Power separately.
  - Evidence: HealthMetrics.ts:464 (platforms ['android'], type power); app.config.ts:60 READ_POWER; services/healthconnect/dataTransformation.ts:234.
- **Metric: Elevation gain (Elevation Gained)** — On iOS only 'Floors Climbed' exists (both).
  - Evidence: HealthMetrics.ts:478 (platforms ['android']); app.config.ts:48 READ_ELEVATION_GAINED; services/healthconnect/dataTransformation.ts:228.
- **Metric: Body water mass** — No HealthKit equivalent.
  - Evidence: HealthMetrics.ts:505 (platforms ['android']); app.config.ts:37 READ_BODY_WATER_MASS; services/healthconnect/dataTransformation.ts:222.
- **Metric: Step cadence** — iOS does not read step cadence (neither daily nor in workout telemetry).
  - Evidence: HealthMetrics.ts:591 (platforms ['android'], aggregationStrategy min-max-avg); app.config.ts:66 READ_STEPS_CADENCE; services/healthconnect/dataTransformation.ts:875.
- **Metric: Bone mass** — Only works on Android. On iOS the toggle is shown but never reads data (HealthKit has no bone mass).
  - Evidence: HealthMetrics.ts:492 with no platform restriction (the toggle also appears on iOS, components/HealthDataSync.tsx:118), but HEALTHKIT_TYPE_MAP (services/healthkit/index.ts:232-300) has no BoneMass, so readHealthRecordsDetailed returns [] (:1929-1932). Android: app.config.ts:38 READ_BONE_MASS; services/healthconnect/dataTransformation.ts:216.
- **Metric: Wheelchair pushes** — On iOS the toggle exists but does nothing; likely a pending mapping to PushCount.
  - Evidence: HealthMetrics.ts:435 with no platform restriction; on iOS HEALTHKIT_TYPE_MAP does not map WheelchairPushes (although HKQuantityTypeIdentifierPushCount is listed in SUPPORTED_HK_TYPES, services/healthkit/index.ts:167), so no permission is requested and nothing is read. Android: app.config.ts:70 READ_WHEELCHAIR_PUSHES; services/healthconnect/dataTra…
- **Metric: Menstruation period** — On iOS only 'Menstruation Flow' works (ios_only row); the 'Menstruation Period' toggle appears but does not import data. Cervical mucus, ovulation test, and intermenstrual bleeding exist on both.
  - Evidence: Android HealthMetrics.ts:563 + services/healthconnect/dataTransformation.ts:828 + app.config.ts:57 READ_MENSTRUATION. iOS HealthMetrics.ts:665 defines the metric for iOS, but HEALTHKIT_TYPE_MAP does not contain MenstruationPeriod (services/healthkit/index.ts:232-300), so nothing is read.
- **Keyboard retry when focusing fields (Android)** — A behavior fix, not a visible option; does nothing on iOS.
  - Evidence: utils/keyboardFocus.ts:25-37 (scheduleAndroidImeShowRetry, returns undefined if not Android) and :66-71; used in components/ActiveWorkoutSetRow.tsx:412, components/EditableSetRow.tsx:148, and components/FormInput.tsx:74-78.

**Administration & developer resources**

- **Anonymized health data report (Health Data Report)** — Gated on isAndroid = Platform.OS==='android' (SyncScreen.tsx:190, :1012); on iOS there is no equivalent HealthKit-based report.
  - Evidence: SparkyFitnessMobile/src/screens/SyncScreen.tsx:100 (import shareHealthDiagnosticReport), :706-722 (handleShareHealthReport), :1011-1050 ('Health Data Report — Android only' block with isAndroid); src/services/healthDiagnosticService.ts:66, :364 (rounding for privacy).

**Exercises, workouts & running**

- **Tip for recording with the screen off** — Only shown on Android for outdoor activities.
  - Evidence: src/screens/RecordActivityScreen.tsx:1443-1466 (Platform.OS === 'android' && !indoor)

**Medications, GLP-1 & symptoms**

- **Exact alarm permission for reminders** — Android only (ExactAlarmBridge.isAvailable is false on iOS).
  - Evidence: MedicationReminderReconciler.tsx:84-92 calls maybePromptForExactAlarmPermission (services/notifications.ts:336-348) via ExactAlarmBridge (targets/android-exact-alarm).

**Settings, profile, family & integrations**

- **Health data report for support** — Gated by isAndroid (SyncScreen.tsx:190,1004).
  - Evidence: src/screens/SyncScreen.tsx:1004-1050 (rendered only if isAndroid)
- **Exact alarm permission** — ExactAlarmBridge.isAvailable is only true on Android.
  - Evidence: src/screens/NotificationSettingsScreen.tsx:125-133; services/notifications.ts:336-350 (ExactAlarmBridge); targets/android-exact-alarm; plugins/withExactAlarmModule.ts

**Native mobile capabilities**

- **Health Connect-only metrics** — Health Connect only.
  - Evidence: HealthMetrics.ts:450-518, 535-602 (platforms: ['android']); READ_SPEED/POWER/ELEVATION_GAINED/BODY_WATER_MASS/CYCLING_PEDALING_CADENCE/STEPS_CADENCE permissions in app.config.ts:27-70
- **'Log water' shortcut in the Android launcher** — The 'Log water' label is hardcoded in English (BackgroundWaterModule.kt:33-34). Unlike iOS, there are no shortcuts for scanning, searching, or fasting.
  - **Updated in PRs #2989, #3020 and #3051 (merged):** The short label comes from the app's quickActions strings, translated in 10 of the 15 other languages the app ships; the long label is translated only into Spanish, Polish, Brazilian Portuguese, Simplified and Traditional Chinese and Cantonese. The shortcut is put back after the expo-quick-actions items replace the dynamic list, no longer brings the app to the front and sits beside Scan food, Log food and Fasting, and a drink logged from it also updates a placed water widget. The result Toast is still English-only and only shows while the app's notifications are on (on HyperOS, its floating notifications too).
  - Evidence: targets/android-background-water/kotlin/.../BackgroundWaterModule.kt:21-43 (pushDynamicShortcut); LogWaterActivity.kt:23-60; plugins/withBackgroundWater.ts:7-10
- **Persistent workout notification (Android)** — It has no buttons (the module does not use addAction), unlike the iOS Live Activity controls. Below Android 16 it is a regular ongoing notification showing overall progress.
  - Evidence: services/workoutLiveActivity.android.ts:12-60; targets/android-workout-notification/kotlin/.../WorkoutNotificationModule.kt:40-95 (SDK_INT >= 36 and ProgressStyle); RestDeadlineReceiver.kt; plugins/withWorkoutNotification.ts; app.config.ts:29 (POST_PROMOTED_NOTIFICATIONS)

### 3.3 On both, but different (129)

**iOS/Android differences: native configuration**

- **Active workout outside the app: Live Activity (iOS) vs ongoing notification (Android)** — iOS: interactive Live Activity on the Lock Screen and Dynamic Island with +15 s / -15 s / Skip rest and Complete set buttons that work without opening the app. Android: ongoing notification ('Ongoing workout' channel, low importance) with a timer or rest countdown, exercise · set position text and, on Android 16+, a ProgressStyle segmented by exercise as a 'promoted ongoing' notification (Live Update); no action buttons (tapping it only opens th…
  - Evidence: iOS: SparkyFitnessMobile/src/services/workoutLiveActivity.ios.ts:37-70 (expo-widgets LiveActivity, Lock Screen + Dynamic Island, rest-add-15/rest-subtract-15/rest-skip/complete-set buttons); src/services/WorkoutLiveActivityLayout.tsx:314-361. Android: src/services/workoutLiveActivity.android.ts:21-41,136-160; targets/android-workout-notification/k…
- **GPS recording/run outside the app: Live Activity (iOS) vs foreground service notification (Android)** — iOS: Live Activity on the Lock Screen and Dynamic Island with clock, distance, pace and HR updated every ~5 s, and Pause/Resume and Lap buttons; it also covers runs started on the Apple Watch. Android: only the static location service notification ('Recording your activity' / 'Tracking your run with GPS'), with no live metrics or buttons.
  - Evidence: iOS: SparkyFitnessMobile/src/services/runLiveActivity.ios.ts:43-57,406-418 (run-toggle and run-lap buttons; distance, pace, HR, plan step); src/services/RunLiveActivityLayout.tsx. Android/fallback: src/services/runLiveActivity.ts:1-13 (no-op); src/services/gpsRecordingService.ts:1115-1137 (foregroundService notificationTitle/Body); src/utils/recor…
- **Home screen widgets: calories and macros** — iOS (WidgetKit): calories and macros in small and medium sizes (Search/Scan buttons in medium). Android (Jetpack Glance): 2x1 calories and 2x2 macros, fixed size (not resizable), home screen only, both with Search/Scan buttons (deep links sparkyfitnessmobile://search and ://scan).
  - **Still open:** The planned eaten and burned figures on the Android calories widget, a medium size and resizing have not been done. On Android the calories widget still shows only the calories left on a fixed 2x1 and the macros widget is a fixed 2x2, both home-screen-only with the Search and Scan buttons, while iOS has small and medium sizes and shows eaten and burned on the calories widget.
  - Evidence: iOS: SparkyFitnessMobile/targets/widget/index.swift:4-19; targets/widget/widgets.swift:309-323 (systemSmall/systemMedium + accessory), 290-299 (search/scan buttons in medium); targets/widget/macroWidget.swift:413-426,394-403. Android: targets/android-widget/kotlin/.../CalorieWidget.kt.tmpl:91-161; MacroWidget.kt.tmpl:64-66,89-132; targets/android-…
- **App icon quick actions** — iOS: 4 localized actions (Scan food, Log food, Log water, Fasting); the navigation ones open the screen and 'water' logs a drink with a toast. Android: a single dynamic 'Log water' shortcut (fixed English label) that logs a drink in the background via WorkManager without opening the app and confirms with a Toast; it only appears if there is a server with an active session and a water container.
  - **Updated in PR #2989 (merged):** Android now offers the same four actions: Scan food, Log food and Fasting through expo-quick-actions, plus the native Log water shortcut. All four titles come from the same quickActions strings as on iOS, translated in 10 of the 15 other languages the app ships (the rest show English). Log water still works differently: Android logs it in the background without opening the app and reports with an English-only Toast that only shows while the app's notifications are on, while iOS opens the app, logs from JS and shows a Toast from the same translated strings.
  - Evidence: iOS: SparkyFitnessMobile/src/hooks/useQuickActions.ts:26-49 (scan-food, search-food, log-water, fasting), 130-153 (only Platform.OS === 'ios', expo-quick-actions). Android: targets/android-background-water/kotlin/.../BackgroundWaterModule.kt:20-41 (ShortcutManagerCompat.pushDynamicShortcut 'Log water'); LogWaterActivity.kt:22-43 (UI-less activity …
- **Background widget refresh** — Android: the background sync task downloads the daily summary from the server and redraws the widgets, and also resets them at midnight. iOS: the widgets only show the last snapshot the app wrote (they reload every 15 min or at midnight, but without requesting new data from the server).
  - **Updated in PRs #3020 and #3021 (merged):** The new Android water widget gets the same background refresh and midnight reset as the calorie and macro widgets, and shows the server's total after a drink logged from its − / + buttons or the Log water shortcut or tile, much as the iOS water widget does after its buttons, controls or Siri. The midnight refresh is now set again even after a failed redraw. iOS widgets still get no server data in the background, only what the app or those water actions write.
  - Evidence: Android: SparkyFitnessMobile/src/services/backgroundSyncService.ts:132-140 (refreshAndroidWidgetsFromServer in the background task); src/services/androidWidgetSyncService.ts:94-109; targets/android-widget/kotlin/.../CalorieWidgetReceiver.kt.tmpl:84 and MacroWidgetReceiver.kt.tmpl:84 (midnight refresh). iOS: targets/widget/widgets.swift:64-85 (time…
- **Health store integration: Apple Health (HealthKit) vs Health Connect** — Same screen but a different backend: iOS uses HealthKit (no separate history permission, 'database locked' detection); Android uses Health Connect (client unavailable counter, per-record-type permissions). Only on Android is the 'Not medical advice. Consult a healthcare professional…' notice shown on the sync screen.
  - Evidence: SparkyFitnessMobile/app.json:10-17 (@kingstinct/react-native-healthkit, background true) and 28 (react-native-health-connect); app.config.ts:26-81 (android.permission.health.* permissions); src/services/healthConnectService.ts (Android) vs src/services/healthConnectService.ios.ts (iOS); src/components/HealthDataSync.tsx:63-71; src/components/Healt…
- **Heart rate variability (HRV)** — iOS sends SDNN (Apple Health); Android sends RMSSD (Health Connect). The values are not comparable across platforms.
  - **Updated in PRs #3019 and #3100 (merged):** The same split now reaches sleep: with the HRV sync switch on, synced nights also carry an overnight HRV. It is the mean of HealthKit SDNN during the night's main sleep on iOS and of Health Connect RMSSD on Android. Both go into the same overnight HRV field of the sleep reports, so those values are not comparable across platforms either.
  - Evidence: SparkyFitnessMobile/src/HealthMetrics.ts:387-401 (iOS, HeartRateVariabilitySDNN, type HRV_SDNN) and 404-418 (Android, HeartRateVariabilityRmssd, type HRV)
- **BMR / resting energy and total calories from the health store** — iOS maps BMR to 'Resting Energy' aggregated per day and, if 'Use external BMR' is enabled, shows a note recommending setting Activity level to 'None (×1.0)' to avoid counting it twice. Android reads raw BasalMetabolicRate records from Health Connect and does not show that note.
  - Evidence: SparkyFitnessMobile/src/services/healthkit/index.ts:236,272 (BasalMetabolicRate and TotalCaloriesBurned -> HKQuantityTypeIdentifierBasalEnergyBurned); src/services/healthConnectService.ios.ts:75-78 vs src/services/healthConnectService.ts:43-53 (empty stub on Android); src/services/healthDataDisplay.ts:320; src/screens/CalorieSettingsScreen.tsx:918…
- **Background health sync** — iOS: in addition to the periodic task, it uses HealthKit background delivery/observers that trigger a sync when there is new data; it shows the note 'it will update when the phone allows it'. Android: enabling it requests Health Connect's 'BackgroundAccessPermission' (if denied, it shows an alert and is not enabled) and relies only on the periodic WorkManager task; there are no observers.
  - Evidence: SparkyFitnessMobile/src/screens/SyncScreen.tsx:293-371; src/components/SyncFrequency.tsx:38-45; src/services/healthConnectService.ios.ts:118-129 (backgroundDelivery) vs src/services/healthConnectService.ts:132-148 (stubs); src/services/healthkit/backgroundDelivery.ts; src/hooks/useAppStartup.ts:131-183; src/services/backgroundSyncService.ts:382-39…
- **Import full health history** — Android: Health Connect limits daily reads (if the quota is reached, the import pauses and resumes the next day) and without the history permission it only reaches ~30 days; the screen shows both notices. iOS: no separate history permission or quota; it re-requests authorization for undetermined types before reading.
  - Evidence: SparkyFitnessMobile/src/screens/ImportHistoryScreen.tsx:45-46,289,455-530; src/services/backfillService.ts:225-231; app.config.ts:72 (READ_HEALTH_DATA_HISTORY); src/services/healthConnectService.ios.ts:33-35 (ensureHistoryReadPermission always true)
- **Importing workout GPS routes from the health store** — Android: each route requires a per-session system consent dialog (only during interactive syncs; routes are not collected in the background). iOS: the workout routes permission is granted once in the HealthKit sheet.
  - Evidence: Android: SparkyFitnessMobile/src/services/healthconnect/workoutTelemetry.ts:1,37-51 (requestExerciseRoute, per-session consent remembered); src/services/healthconnect/provider.ts:102-122; app.config.ts:42-46 (READ_EXERCISE_ROUTES). iOS: src/services/healthkit/index.ts:190-202,259-265 (HKWorkoutRouteTypeIdentifier)
- **Writing to the health store (nutrition and hydration)** — Equivalent functionality for the user; the destination differs: on iOS meals appear grouped as 'Food' in Apple Health; on Android as Nutrition records in Health Connect.
  - Evidence: SparkyFitnessMobile/src/services/writeback.ios.ts:1 -> healthkit/writeback.ts:44-53 (one HKCorrelationTypeIdentifierFood per food item, one DietaryWater sample per drink); src/services/writeback.ts:1-6 -> healthconnect/writeback.ts:45-100 (Nutrition/Hydration records with clientRecordId); src/components/HealthDataWriteback.tsx:54-61; app.json:14 (…
- **Route map for cardio sessions** — iOS: always on Apple Maps (no key). Android: on Google Maps only if the build includes GOOGLE_MAPS_ANDROID_API_KEY; without it, only the route line is drawn with no background map.
  - Evidence: SparkyFitnessMobile/src/utils/routeMapSupport.ts:8-21; src/components/exerciseStats/RouteMap.tsx:16-17 (RouteTileMap vs RouteLine); app.config.ts:16-21,282-289,320-322 (optional GOOGLE_MAPS_ANDROID_API_KEY); src/screens/RunSummaryScreen.tsx:10; src/screens/CardioSessionScreen.tsx:25
- **Indoor distance estimation from phone steps** — iOS: requests Motion & Fitness and queries CMPedometer for the window at the end (nothing needs to be running). Android: requests Activity recognition, stores the hardware counter at the start and subtracts at the end using a custom native module; if the phone restarts during the session there is no estimate.
  - Evidence: SparkyFitnessMobile/src/services/stepCounter.ts:34-92; modules/step-counter/expo-module.config.json (platforms ['android'], ACTIVITY_RECOGNITION permission); modules/step-counter/android/src/main/java/expo/modules/stepcounter/StepCounterModule.kt:20-60 (Sensor.TYPE_STEP_COUNTER); modules/step-counter/index.ts:36-41; app.config.ts:262-268 (iOS moti…
- **GPS recording with the screen off** — iOS: 'location' background mode with the blue pill in the status bar. Android: foreground service with a notification and, on Android only, a 'Recording with the screen off' card that advises setting battery to 'Unrestricted' with a link to dontkillmyapp.com.
  - Evidence: SparkyFitnessMobile/app.config.ts:200 (UIBackgroundModes 'location'), 251-273 (expo-location: isAndroidForegroundServiceEnabled true, no background location); src/services/gpsRecordingService.ts:1115-1137 (showsBackgroundLocationIndicator, foregroundService); src/screens/RecordActivityScreen.tsx:1443-1468
- **Rest-complete sound in silent mode / in the background** — iOS: plays even when the phone is on silent, and even with the app in the background or the screen locked (a silent track keeps the audio session alive). Android: plays in silent/vibrate mode only with the app in the foreground; in the background the alert is the notification.
  - Evidence: SparkyFitnessMobile/src/screens/WorkoutSettingsScreen.tsx:153-175; src/services/sounds.ts:37-45,64-90; app.config.ts:196-200 (UIBackgroundModes 'audio')
- **App language** — iOS: there is no in-app picker; the row shows the language as 'Managed by iOS' and opens iOS Settings. Android: in-app picker (device or a specific language) that on Android 13+ syncs with the system per-app language; on Android 12 or earlier it is stored only in the app.
  - **Updated in PR #2959 (merged):** Mobile now ships 16 languages, Turkish added, against 34 on the web. The rest is unchanged: Android has an in-app picker, iOS sends you to iOS Settings, and the mobile language is still not synced with the server language preference the web uses.
  - Evidence: SparkyFitnessMobile/src/screens/AppSettingsScreen.tsx:52-53,165-209; src/services/appLanguageNative.ts:11-30 (Android only, API 33+); plugins/withAppLanguage.ts; targets/android-language/kotlin/.../AppLanguageModule.kt, AppLanguageApi33.kt (LocaleManager); app.config.ts:190-195 (UIPrefersShowingLanguageSettings)
- **Native appearance and navigation** — iOS: SF Symbols icons, native stack headers, Liquid Glass icon. Android: Ionicons, each screen's own headers, modals that slide up from the bottom, system navigation bar adapted to the theme, bottom sheets that cannot be dragged from their content, and an adaptive icon.
  - Evidence: SparkyFitnessMobile/src/components/Icon.tsx:6-10,230 (SF Symbols on iOS, Ionicons on Android); App.tsx:192 (slide_from_bottom modals on Android), 402-411 (NavigationBar style on Android), 1337 (toasts in FullWindowOverlay on iOS); src/services/nativeTabBarPreference.ts:23-27 (native headers iOS only); src/components/TimeSheet.tsx:138, CalendarShee…
- **Passkey sign-in and management** — Android: if the default browser does not support passkeys (e.g. Fennec from F-Droid), it opens the ceremony in Chrome/Firefox/Samsung Internet/Edge if installed; copy says 'fingerprint, face unlock, or PIN' with the example 'My Android Phone'. iOS: always the system browser; copy says 'Face ID, Touch ID, or PIN' and 'My iPhone'.
  - Evidence: SparkyFitnessMobile/src/services/api/authService.ts:707-760 (getPasskeyBrowserPackage Android only), 766-785 (openAuthSessionAsync with browserPackage); src/screens/PasskeySettingsScreen.tsx:46-59
- **Connecting to self-hosted servers (local network / certificates)** — Android (production): blocks unencrypted HTTP and also trusts user-installed CA certificates (useful for servers with their own CA). iOS: App Transport Security with no exceptions, and it asks for 'Local Network' permission when connecting to servers on the LAN; a custom CA must be installed and marked as trusted in system Settings.
  - Evidence: SparkyFitnessMobile/plugins/withNetworkSecurityConfig.ts:20-41 (production builds only: cleartextTrafficPermitted=false, trust-anchors system + user); app.config.ts:134,314 (prodPlugins), 171-172 (NSLocalNetworkUsageDescription), 186-188 (NSAllowsArbitraryLoads false); src/utils/serverUrl.ts:82-86
- **Tablet support** — iOS: there is no iPad version (it runs in iPhone compatibility mode). Android: installs on tablets as a regular app, in portrait.
  - Evidence: SparkyFitnessMobile/app.config.ts:169 (ios.supportsTablet: false); app.json:6 (orientation portrait)
- **Chat dictation and read-aloud voice** — Available on both. Android enables automatic language switching in the recognizer; the tip for getting natural voices differs (iOS: download Premium/Enhanced voices in Settings > Accessibility; Android: its own Android-specific text).
  - Evidence: SparkyFitnessMobile/src/screens/ChatScreen.tsx:575-586 (androidIntentOptions EXTRA_ENABLE_LANGUAGE_SWITCH Android only); src/hooks/useSpeechVoiceChoices.ts:74-80; app.config.ts:229-250 (expo-speech-recognition, expo-audio)
- **Developer tools (dev builds only)** — Not visible to end users. Android: shortcuts to Health Connect settings and data, background permission check, 'Rich Workout (Route+HR+Laps)' seeding. iOS: Apple Watch pairing/reachability status and seeding via HealthKit.
  - **Updated in PR #3052 (merged):** Android dev builds now also show the watch link section, titled Wear OS, with the paired and reachable dots. On Android these mean that a Wear OS watch has connected before and that one is connected now, not that the watch app is open. The rest still differs: the Health Connect shortcuts and the background permission check are Android-only, and test data is seeded through Health Connect on Android and HealthKit on iOS.
  - Evidence: SparkyFitnessMobile/src/screens/SettingsScreen.tsx:422-425 (__DEV__ and APP_VARIANT dev); src/components/DevTools.tsx:522-575,594-680; src/services/seedHealthData.ts (Health Connect insertRecords) vs src/services/seedHealthData.ios.ts (saveQuantitySample); app.config.ts:83-131 (Health Connect WRITE_* permissions only in dev)

**iOS/Android differences: components**

- **'Source' label for health data in Sync** — iOS shows 'Source: Apple Health'; Android shows 'Source: Health Connect'. It is the same feature with a different data source.
  - Evidence: SparkyFitnessMobile/src/components/HealthSourceLabel.tsx:12-15 (Platform.OS === 'ios' ? 'Apple Health' : 'Health Connect'); shown in SparkyFitnessMobile/src/screens/SyncScreen.tsx:943
- **'Health Data to Sync' card: informational copy and 'Learn more'** — iOS refers to 'Apple Health (HealthKit)' and its detail explains how to revoke access: 'Settings → Health → Data Access & Devices → SparkyFitnessMobile'. Android refers to 'Health Connect' and gives no guidance on managing or revoking permissions. The rest of the card ('Enable All' toggle, battery notice, collapsible categories) is the same on both.
  - Evidence: SparkyFitnessMobile/src/components/HealthDataSync.tsx:63-83 (isIOS picks platformSubtitle/platformSummary/platformDetail), 187-226 (expandable block); shown in SparkyFitnessMobile/src/screens/SyncScreen.tsx:985
- **Heart rate variability (HRV): different metric per platform** — iOS syncs HRV SDNN (type HRV_SDNN) and Android syncs HRV RMSSD (type HRV), so values cannot be compared across platforms. SpO2 and the reproductive metrics (menstruationPeriod, ovulationTest, cervicalMucus, intermenstrualBleeding) also have one entry per platform, but with the same 'type', so they behave the same.
  - **Updated in PRs #3019 and #3100 (merged):** The same toggle now also decides whether synced nights get an overnight HRV, with the same split: the mean of HealthKit SDNN during the night's longest sleep on iOS, and the mean of Health Connect RMSSD on Android. Both are stored in the same overnight HRV field that the web and mobile sleep reports show, so overnight HRV cannot be compared across platforms either.
  - Evidence: SparkyFitnessMobile/src/HealthMetrics.ts:386-401 (iOS: recordType 'HeartRateVariabilitySDNN', type 'HRV_SDNN') versus 403-418 (Android: recordType 'HeartRateVariabilityRmssd', type 'HRV')
- **Writing SparkyFitness data to the system health store** — Offers the same options on both platforms (nutrition, hydration, delete all or by range). The destination changes: HealthKit on iOS (healthkit/writeback.ts) and Health Connect on Android (healthconnect/writeback.ts), and with it all the copy ('Write to Apple Health' versus 'Write to Health Connect').
  - Evidence: SparkyFitnessMobile/src/components/HealthDataWriteback.tsx:54-62 (hidden outside ios/android; storeName = 'Apple Health' on iOS or 'Health Connect' on Android), 112-177 (toggles and delete menu); metrics in SparkyFitnessMobile/src/WritebackMetrics.ts:3-14,44,54; shown in SparkyFitnessMobile/src/screens/SyncScreen.tsx:994
- **Keyboard for weight in bodyweight exercises (signed assisted or weighted sets)** — iOS opens the full numbers-and-punctuation keyboard, which is not a numeric keypad, so that '-' can be typed. Android uses the 'numeric' keyboard, which already includes the minus sign. In non-bodyweight exercises, both use 'decimal-pad'.
  - Evidence: SparkyFitnessMobile/src/components/ActiveWorkoutSetRow.tsx:1047-1053 (comment: "iOS's decimal pad has no minus key"; iOS 'numbers-and-punctuation', Android 'numeric'); SparkyFitnessMobile/src/components/EditableSetRow.tsx:345-351 (same logic)
- **Dragging bottom sheet content to move or dismiss the sheet** — On iOS any part of the content can be dragged to lower or dismiss the sheet. On Android only the top handle or a tap on the backdrop dismisses it, because the gesture over the content is disabled to avoid interfering with the time wheels (FlatList). FastingProtocolSheet also uses android_keyboardInputMode="adjustPan" (line 234) only on Android.
  - Evidence: enableContentPanningGesture={Platform.OS !== 'android'} in SparkyFitnessMobile/src/components/: MealTypeFormSheet.tsx:161, ExerciseSetRestSheet.tsx:197, MealTypeTimePickerSheet.tsx:92, CopyMealSheet.tsx:182, TimeSheet.tsx:138, DateRangeSheet.tsx:108, CalendarSheet.tsx:329, medications/WeekdaySheet.tsx:60, FastingEditSheet.tsx:301, FastingProtocolS…
- **Android Back button/gesture with a bottom sheet open** — Only affects Android, because iOS has no Back button. With AddSheet or ActionSheet, Back dismisses the sheet. With the other listed sheets, according to the code comment itself, Back is passed to navigation with the sheet still open: it closes the screen underneath, switches tabs or exits the app.
  - Evidence: SparkyFitnessMobile/src/components/ui/sheetChrome.tsx:42-65 (useSheetHardwareBack; the comment explains that BottomSheetModal does not handle Back and the press 'pops the screen under the sheet, switches another tab to the Dashboard, or exits the app'). Only AddSheet.tsx and ActionSheet.tsx use it (grep). None of the listed sheets (MealTypeFormShe…
- **Bottom tab bar with floating 'Add' button** — Android and iOS earlier than 26 always use CustomTabBar. On iOS 26+ with the Liquid Glass setting enabled, the native tabs (NativeTabsLayout) are used instead. Within CustomTabBar only the shadow of the '+' button changes (shadow on iOS, elevation:4 on Android), which is cosmetic.
  - Evidence: SparkyFitnessMobile/src/components/CustomTabBar.tsx:85-110 (Add button; Platform.select ios/android shadow); used by FallbackTabsLayout in SparkyFitnessMobile/src/components/TabsLayout.tsx:363-368; the choice is made in TabsLayout.tsx:431-450 (useNativeIOSTabsActive) and SparkyFitnessMobile/src/services/nativeTabBarPreference.ts:11-14
- **Header of full-screen forms (Cancel / Save)** — On iOS the native stack header is used, except on iOS 26+ with Liquid Glass disabled; in that case there is a header drawn by the screen with no extra top margin, because they are modal sheets. On Android the screen-drawn header is always used, with a top margin equal to the status bar. The controls are the same.
  - **Updated in PR #3200 (merged):** On iOS 26+ with Liquid Glass turned off, the screen-drawn header now also gets the status-bar top margin, the same rule as on Android; inside a modal sheet iOS reports no top inset, so sheets still get no extra margin. Nothing changes with the native iOS header.
  - Evidence: SparkyFitnessMobile/src/components/FormScreenChrome.tsx:103-127 (useNativeIOSHeadersActive; paddingTop: insets.top only on Android); SparkyFitnessMobile/src/services/nativeTabBarPreference.ts:23-27
- **DevTools: generate test workouts with more data ('Rich Workout' / 'Rich Strength')** — Android generates the workout with route, HR and laps; iOS generates it with route and HR, without laps. 'Rich Strength (Spiky HR)' exists on both with different implementations (Health Connect versus HealthKit). The 7/14/30 days, '1 year (steps)' and 'Old data' buttons are common to both.
  - Evidence: SparkyFitnessMobile/src/components/DevTools.tsx:522-555 (Android: seedRichWorkout '(Route+HR+Laps)' and seedRichStrengthWorkout, from services/seedHealthData), 558-590 (iOS: seedRichWorkoutIOS '(Route+HR)' and seedRichStrengthWorkoutIOS, from services/seedHealthDataIOS); development builds only (SettingsScreen.tsx:421-425)
- **Minor visual and technical differences between iOS and Android** — All of them are cosmetic, layout-related, or about keyboard and window robustness. None adds or removes options for the user. (8) prevents empty boxes in axis labels in Chinese, Japanese or Korean on iOS.
  - Evidence: SparkyFitnessMobile/src/components/: (1) Icon.tsx:206-252; (2) CompletionCheck.tsx:61-80; (3) wellness/pregnancy/WeeklyChecklist.tsx:197, medications/DoseRow.tsx:217,224; (4) FoodForm.tsx:127-130,1153, FoodUnitSelectorSheet.tsx:52-55,402,467; (5) CustomTabBar.tsx:96-108; (6) SetRowChrome.tsx:154-198,229; (7) chat/ToolCallCard.tsx:36,145,154; (8) c…
- **'Not medical advice' notice always visible in Sync (Android only)** — Android shows the notice always in view, in addition to inside 'Learn more'. On iOS it is only visible when expanding 'Learn more' in the 'Health Data to Sync' card.
  - Evidence: SparkyFitnessMobile/src/screens/SyncScreen.tsx:961-975 ({Platform.OS === 'android' && <Text>…notMedicalAdvice…</Text>}). On both platforms the text also appears inside the 'Learn more' block of SparkyFitnessMobile/src/components/HealthDataSync.tsx:191-207.
- **Enabling 'Background sync': Health Connect permission (Android) versus HealthKit observers (iOS)** — Android requires an additional Health Connect permission and can block enabling. iOS asks for no extra permission, registers HealthKit observers that trigger sync when the system allows it, and shows the iosNote (SyncFrequency.tsx:38-45).
  - Evidence: SparkyFitnessMobile/src/screens/SyncScreen.tsx:293-331: on Android BackgroundAccessPermission is requested; if it is denied, the 'Permission Required' alert appears and the toggle is not enabled. 334-358: on iOS startObservers is called, which triggers performBackgroundSync('healthkit-observer') when there is new data, and stopObservers is called …
- **Active workout bar, rest bar and active workout header buttons with Liquid Glass styling (iOS 26+)** — On iOS 26+ with the Liquid Glass setting enabled (useNativeIOSTabsActive), the bars are floating glass pills above the native bar. On Android and older iOS they are opaque full-width bars, integrated into CustomTabBar. The controls and information are the same.
  - Evidence: SparkyFitnessMobile/src/components/ActiveWorkoutBar.tsx:397-408 (above the native tab bar if usesNativeTabs), 934-960 (classic full-width bar with a top border if !usesNativeTabs) and 962-1054 (floating LiquidGlassSurface pill with the same controls). ActiveWorkoutRestBar.tsx:86,306-326 (interactive 'glass' pill). ActiveWorkoutHeader.tsx:72-89,130…
- **Header of the mobile report screens (native on iOS, screen-drawn on Android)** — On iOS the native stack header is used, except on iOS 26+ with Liquid Glass disabled. On Android, the header is drawn by the screen with a status bar margin. The controls (range picker, content) are the same.
  - Evidence: SparkyFitnessMobile/src/components/reports/ReportScreenLayout.tsx:36-41 (useNativeIOSHeadersActive; paddingTop: insets.top only if there is no native header). SparkyFitnessMobile/src/services/nativeTabBarPreference.ts:23-27.

**iOS/Android differences: screens**

- **App language picker** — iOS: the language cannot be chosen within the app; the row opens iOS Settings (per-app language) and the change is applied when the system restarts the app. Android: in-app BottomSheetPicker that changes the language instantly (on Android 13+ it uses the native LocaleManager; on Android 12 or earlier, a local i18next preference) and syncs with external changes from 'App Languages'.
  - Evidence: SparkyFitnessMobile/src/screens/AppSettingsScreen.tsx:52-53 (isIOS / getNativeIOSLanguage), 101-111 (picker options), 113-131 (openIOSLanguageSettings -> Linking.openSettings), 165-209 (iOS row testID ios-language-row versus BottomSheetPicker on Android); src/hooks/useAppLanguageForegroundSync.ts:6-30; App.tsx:315-322
- **Health sync source (Apple Health versus Health Connect)** — Works on both platforms, but with different health stores: HealthKit on iOS (src/services/healthConnectService.ios.ts) and Health Connect on Android (healthConnectService.ts). Permissions are managed in the iOS Health app or in the Health Connect settings.
  - Evidence: SparkyFitnessMobile/src/screens/SyncScreen.tsx:190-197 (healthSettingsName), 900-910 (Health Connect/HealthKit not-available message), 943 (HealthSourceLabel); src/components/HealthSourceLabel.tsx:12-15; src/components/HealthDataSync.tsx:63-84 (per-platform summary and detail; on iOS it includes the path Settings -> Health -> Data Access)
- **Background sync of health data** — Android: requires granting Health Connect's background read permission when enabling it, and runs as a periodic task roughly every 4 h. iOS: in addition to the background task, it registers HealthKit observers that trigger a sync when new data arrives (background delivery). The frequency is decided by the system.
  - Evidence: SparkyFitnessMobile/src/screens/SyncScreen.tsx:293-330 (on Android it requests Health Connect's BackgroundAccessPermission and blocks it if denied), 337-367 (on iOS it starts and stops the HealthKit observers with startObservers/stopObservers); src/components/SyncFrequency.tsx:38-45 (iOS-only note: 'will refresh in the background when the phone al…
- **'Not medical advice' notice in Sync** — Only shown on Android, probably because of Health Connect / Google Play requirements. iOS does not show it.
  - Evidence: SparkyFitnessMobile/src/screens/SyncScreen.tsx:960-975 ({Platform.OS === 'android' && ...})
- **Writing nutrition and hydration to the health store (writeback)** — Same functionality on both platforms. Only the destination (Apple Health or Health Connect) and the delete confirmation copy, which names that store, change.
  - Evidence: SparkyFitnessMobile/src/screens/SyncScreen.tsx:513-515 (writebackStoreName), 520-590 (delete all or by range), 994-1003; src/components/HealthDataWriteback.tsx:54-62; src/WritebackMetrics.ts:3-7 (supported on both platforms: Health Connect on Android, HealthKit on iOS)
- **Recording controls on the lock screen** — iOS: interactive Live Activity (lock screen and Dynamic Island) with live metrics and Pause/Resume and Lap buttons, also for runs recorded with the watch. Android: only a persistent foreground service notification with the text 'Recording your activity / Tracking your run with GPS', with no metrics or buttons.
  - Evidence: SparkyFitnessMobile/src/services/runLiveActivity.ios.ts:43-48 (Live Activity on the lock screen and Dynamic Island with distance, pace and HR, and Pause/Resume and Lap buttons); src/services/runLiveActivity.ts:1-13 (no-op on Android); src/services/gpsRecordingService.ts:1111-1133 (foreground service notification on Android); src/utils/recordingNot…
- **Step-based distance estimate for indoor sessions (treadmill)** — iOS queries the step history at the end, so nothing needs to be active during the session. Android stores the hardware counter at start. If the phone restarts during the session or the counter could not be read at start, there is no estimate and the distance field is left empty.
  - Evidence: SparkyFitnessMobile/src/services/stepCounter.ts:40-50 (captureStepCounterBaseline only on Android), 52-95 (iOS queries Pedometer.getStepCountAsync for the session window; Android subtracts the since-boot counter); src/hooks/useIndoorDistanceEstimate.ts; modules/step-counter/expo-module.config.json ('platforms': ['android'])
- **Rest timer sound 'through silent mode'** — iOS: the chime also sounds with the app in the background or the screen locked, because a silent track keeps the audio session alive. Android: the chime sounds on silent or vibrate only with the app open; in the background the alert is the rest notification sound.
  - Evidence: SparkyFitnessMobile/src/screens/WorkoutSettingsScreen.tsx:154-181 (different subtitle for iOS and Android); src/services/sounds.ts:37-45 (isBackgroundRestChimeEnabled only on iOS), 49-56, 64-90 (shouldPlayInBackground only on iOS)
- **Voice dictation in the Sparky chat** — Android enables the recognizer's automatic language switching (EXTRA_ENABLE_LANGUAGE_SWITCH 'balanced'), so it can detect another language while dictating. iOS recognizes only in the app's resolved language. Keyboard handling also differs, but it only changes the presentation.
  - Evidence: SparkyFitnessMobile/src/screens/ChatScreen.tsx:570-586 (ExpoSpeechRecognitionModule.start; on Android adds androidIntentOptions EXTRA_ENABLE_LANGUAGE_SWITCH: 'balanced'), 108-114 (on iOS uses RN's KeyboardAvoidingView; on Android the one from react-native-keyboard-controller)
- **App icon quick actions (long press)** — On Android no quick actions (launcher shortcuts) are registered.
  - **Updated in PR #2989 (merged):** Android now registers Scan food, Log food and Fasting through the same useQuickActions hook (mounted by QuickActionsGate in App.tsx), and they open the same screens as on iOS. Log water stays the native shortcut: it takes its label from the same quickActions string as iOS, logs in the background without opening the app and reports in English only. The withQuickActionLaunchGuard plugin keeps a shortcut's screen from opening again when Android restores the app after killing it.
  - Evidence: SparkyFitnessMobile/App.tsx:214-224 (QuickActionsGate, comment 'Home Screen long-press shortcuts (iOS)'), 480; src/hooks/useQuickActions.ts:26-49 (items), 52-60 (logWaterDrink), 135-156 (return if Platform.OS !== 'ios')
- **Platform-specific copy and hints (grouped, no capability change)** — Only the copy changes and the functionality is the same. The iOS BMR note only appears with 'Use measured BMR' enabled.
  - Evidence: SparkyFitnessMobile/src/screens/PasskeySettingsScreen.tsx:47-60 ('Face ID, Touch ID or PIN' and 'My iPhone' versus 'fingerprint, face unlock or PIN' and 'My Android phone'); src/screens/CalorieSettingsScreen.tsx:918-925 (iOS-only note: Apple Health 'Resting Energy' already includes light activity, Activity level None ×1.0 is suggested); src/screen…
- **Navigation and presentation visual differences (grouped)** — Only the presentation changes. On Android, the menu for an inactive server shows 3 buttons (Activate, Configure, Delete) without 'Cancel', due to Android's Alert button limit; on iOS it adds 'Cancel'. The same actions are available on both platforms.
  - **Updated in PR #3190 (merged):** The progress photos, compare and time-lapse screens now add the top safe-area padding whenever the native iOS header is off, on Android and on iOS 26 with Liquid Glass navigation turned off, instead of only on Android. The other screens the row lists still add it only on Android, and the other presentation differences are unchanged.
  - Evidence: SparkyFitnessMobile/App.tsx:373-395 (createIOSSmallNativeHeaderOptions versus headerShown:false), 191-192 and 685-1264 (slide_from_bottom modals on Android), 401-410 (NavigationBar.setStyle only on Android), 518 (headerTintColor on Android), 1335-1337 (Toast inside FullWindowOverlay on iOS); paddingTop with insets only on Android in DailyNutrition…
- **Metric toggles visible on iOS that read no data (Bone mass, Wheelchair pushes, Menstruation period)** — Android: they work with Health Connect. iOS: the toggle is visible and can be enabled, but the read always returns 0 records.
  - Evidence: src/HealthMetrics.ts:492-505 (boneMass without platforms), 435-446 (wheelchairPushes without platforms), 665-675 (menstruationPeriod with platforms ['ios'], recordType 'MenstruationPeriod'); src/services/healthkit/index.ts:232-298 (HEALTHKIT_TYPE_MAP has no BoneMass, WheelchairPushes or MenstruationPeriod), 1929-1932 (if there is no identifier, re…
- **Heart rate variability: SDNN on iOS and RMSSD on Android** — Same row in the UI, but a different metric and a different type sent to the server depending on the platform.
  - **Updated in PRs #3019 and #3100 (merged):** The toggle now also controls the overnight HRV attached to synced nights: the mean of SDNN during the sleep on iOS and of RMSSD on Android. Both go into the same overnight HRV field, which does not record the type and which the web and mobile sleep reports show, so those values also depend on the platform.
  - Evidence: src/HealthMetrics.ts:387-401 (recordType HeartRateVariabilitySDNN, type 'HRV_SDNN', platforms ['ios']), 404-418 (recordType HeartRateVariabilityRmssd, type 'HRV', platforms ['android']); src/services/healthkit/index.ts:249.
- **Real map under the GPS route (recording, summary and cardio session)** — iOS always shows the map (Apple Maps). Android only shows it if the app was built with a Google Maps key. Without it, it draws only the route line with no background map.
  - Evidence: src/utils/routeMapSupport.ts:8-20 (canShowRouteMap: iOS always, with Apple Maps; Android only if the build has GOOGLE_MAPS_ANDROID_API_KEY); src/components/exerciseStats/RouteMap.tsx:13-17 (RouteTileMap versus RouteLine); used in src/screens/RecordActivityScreen.tsx:1525, RunSummaryScreen.tsx:476 and CardioSessionScreen.tsx:298; app.config.ts:20-2…
- **Active strength workout on the lock screen (Live Activity or notification)** — iOS: interactive Live Activity, with buttons to add or subtract 15 s from the rest, skip it and complete the set. Android: read-only promoted notification, with a progress bar and timer. Tapping it opens the app.
  - Evidence: iOS: src/services/workoutLiveActivity.ios.ts:36-70 (Live Activity on the lock screen and Dynamic Island, rest-add-15, rest-subtract-15, rest-skip and complete-set buttons) and src/services/WorkoutLiveActivityLayout.tsx. Android: src/services/workoutLiveActivity.android.ts:1-40 and targets/android-workout-notification/kotlin/com/sparkyapps/sparkyfi…

**iOS/Android differences: services & hooks**

- **App icon quick actions (long press on Home Screen / launcher)** — iOS offers 4 shortcuts (Scan food, Log food, Log water without opening the app, Fasting). Android does not use expo-quick-actions: it only exposes 'Log water' as a launcher shortcut (WorkManager makes the POST without opening the app).
  - **Updated in PR #2989 (merged):** useQuickActions no longer skips Android. It registers Scan food, Log food and Fasting with expo-quick-actions, then puts the native Log water shortcut back (refreshBackgroundWaterShortcut), because registering replaces every dynamic shortcut. A language change runs both steps again, so the shortcut gets the new labels too. It only runs the action ids it registered for the platform, so on Android another app cannot trigger the JS log-water action through MainActivity. Log water still works differently on the two platforms: Android logs the drink with WorkManager without opening the app, while iOS opens the app and runs logWaterDrink.
  - Evidence: iOS: SparkyFitnessMobile/src/hooks/useQuickActions.ts:26-49 defines 4 actions (scan-food, search-food, log-water, fasting) and :136-154 registers them with expo-quick-actions (early return if Platform.OS !== 'ios' at :142); enabled in App.tsx:221. Android: only the dynamic 'Log water' shortcut published by targets/android-background-water/kotlin/.…
- **Home screen calorie widget** — Android: Glance with search/scan buttons and refresh from the background as well; deduplicates by snapshot content. iOS: WidgetKit, includes lock screen variants, and only updates when the foreground app has today's summary (no refresh from background sync).
  - **Still open:** The Android widget still shows only calories left with a progress bar. Its snapshot carries only remaining, goal and progress, with no eaten or burned. The Lock Screen variants are still iOS-only, and iOS still updates this widget only while the app is in the foreground.
  - Evidence: iOS: useWidgetSync.ts:63-122 writes 'calorieSnapshot' to ExtensionStorage (App Group) and reloads the 'widget' kind; targets/widget/widgets.swift:201-207 supports the accessoryCircular/Rectangular/Inline (lock screen) and systemSmall families. Android: useWidgetSync.ts:134-158 -> androidWidgetSyncService.ts:74-82 -> CalorieWidgetBridge.ts:22-37 (N…
- **Macronutrient widget** — Android shows per-macro bars with progress toward each goal (#2228); iOS draws a composition ring (the three proportions add up to 1) and does not receive goals (comment in useWidgetSync.ts:160-164).
  - Evidence: iOS: useWidgetSync.ts:88-95 writes 'macroSnapshot' (protein, carbs, fat, calories) without goals and reloads 'macroWidget' (:121); targets/widget/macroWidget.swift:413. Android: useWidgetSync.ts:160-182 and androidWidgetSyncService.ts:34-62 include proteinGoal/carbsGoal/fatGoal; MacroWidget.kt.tmpl.
- **Widget language** — iOS: the locale is decided by the system (per app). Android 13+: LocaleManager is the authority and a render cache is passed; Android <=12: the widget stores its own language override.
  - **Partly covered by PRs #2989 and #3020 (merged):** The Android hook passes the resolved app language (normalizeLanguage) to prepareWidgetLocale, dedupes on it and reloads the calorie, macro and water widgets, so the en/pl limitation is gone on Android. The iOS hook (useIOSWidgetLanguageRefresh.ts) still reduces the language to en/pl, so switching from German to French forces no reload there, and it reloads only the calorie and macro timelines, not the water widget or the controls.
  - Evidence: iOS: hooks/useIOSWidgetLanguageRefresh.ts:51 (iOS only) only reloads the 'widget' and 'macroWidget' timelines; the widget resolves its native locale. Android: hooks/useWidgetLanguageRefresh.ts:36-90 (Android only) calls CalorieWidgetBridge.prepareWidgetLocale(preference, effectiveLanguage) and then reloads both widgets; targets/android-widget/.../…
- **Screen headers, icons and action menus** — iOS uses a native header (UIMenu menus, native badges, large title); Android (and iOS 26 with Liquid Glass disabled) uses a header drawn by the screen with an anchored menu. With Liquid Glass the Save button has no accent.
  - Evidence: hooks/useScreenHeader.tsx:739-790 (iOS only: native unstable_headerLeftItems/RightItems and native menus with SF Symbols, :360-398), :415-424 (RawHeaderIcon: SymbolView on iOS, Ionicons on Android), :583 (useNativeIOSHeadersActive); on Android the custom bar is rendered with HeaderBarButton and AnchoredMenu. hooks/useHeaderActionColors.ts:5-25 (iO…
- **Passkey sign-in and registration (system browser)** — iOS always uses the system authentication session. On Android a passkey-compatible browser is forced (F-Droid-signed ones, e.g. Fennec, do not support passkeys); if none is installed the default one is used and it may fail.
  - Evidence: services/api/authService.ts:709-764 getPasskeyBrowserPackage (Android only: if the default browser is not in the Chrome/Firefox/Samsung Internet/Edge list, opens the ceremony in one of them via Custom Tabs); used in loginWithPasskey (:766-790) and addPasskey (:929-955).
- **Rest-end sound on silent and in the background** — iOS: the sound plays even on silent, with the app in the background or the screen locked. Android: it plays even on silent/vibrate, but only in the foreground; in the background the alert is the notification sound.
  - Evidence: services/sounds.ts:37-45 (isBackgroundRestChimeEnabled iOS only), :66-91 (audio mode; shouldPlayInBackground iOS only), :309-344 (silent keep-alive track to keep the audio session alive on iOS); notifications.ts:225-236 (the notification ping carries the chime when the app is not active); screens/WorkoutSettingsScreen.tsx:153-181 (different subtit…
- **Voice cues during GPS recording with the screen locked** — iOS opens the audio session in the background (playback category); Android relies on the location foreground service that keeps the app alive. Similar result for the user, different mechanism.
  - Evidence: services/sounds.ts:73-78 (shouldPlayInBackground if recordingCueSessionActive && Platform.OS === 'ios'); app.config.ts:247-266 (expo-location: isAndroidForegroundServiceEnabled true; 'location' background mode on iOS).
- **Voice picker and suggestion of higher-quality voices** — Only the help text changes: iOS points to Settings > Accessibility > Spoken Content > Voices; Android to the phone's text-to-speech settings. The voice tiers depend on each system's TTS engine.
  - Evidence: hooks/useSpeechVoiceChoices.ts:72-83 (different help text per platform); used in components/GuidedWorkoutSettingsSection.tsx:54 and components/recording/RecordingVoiceCard.tsx:22.
- **Route map in cardio activities** — iOS uses Apple Maps with no key. Android only shows a map if the build was compiled with a Google Maps key; otherwise it shows only the route line with no background map.
  - Evidence: utils/routeMapSupport.ts:15-20 (iOS always; Android only if extra.androidGoogleMapsEnabled); components/exerciseStats/RouteMap.tsx:17 (RouteTileMap vs RouteLine); app.config.ts:20-21,296-302,322 (GOOGLE_MAPS_ANDROID_API_KEY).
- **Phone steps for indoor walks/runs and stride learning** — iOS queries the step history at the end (Motion & Fitness permission) and needs nothing during the session. Android stores the counter at start (Activity recognition permission); a phone restart invalidates the measurement (returns null).
  - Evidence: services/stepCounter.ts:40-50 (captureStepCounterBaseline Android only) and :63-92 (Android subtracts the hardware counter since boot; iOS queries Pedometer.getStepCountAsync for the window); modules/step-counter; consumers services/gpsRecordingService.ts:1188 and services/stepDistance.ts:43; app.config.ts:258-262 (Motion & Fitness text on iOS).
- **Workout and run live activity** — Workout: iOS Live Activity (Dynamic Island/lock screen) vs Android ongoing notification. GPS/watch run: Live Activity only on iOS; Android has no live run card from this service.
  - Evidence: hooks/useAppStartup.ts:85-101 initializes initWorkoutLiveActivity and initRunLiveActivity; services/workoutLiveActivity.ios.ts:456 (iOS Live Activity) vs services/workoutLiveActivity.android.ts:21-30,162 (Android persistent notification, targets/android-workout-notification); services/runLiveActivity.ios.ts:450 vs services/runLiveActivity.ts:1-13 …
- **Periodic background sync** — Same task on both, but iOS decides when to run it (and it is complemented by HealthKit observers) and cannot read HealthKit while the phone is locked; Android uses WorkManager with a more reliable interval, reconnects the Health Connect client once per run, and also updates the widgets.
  - Evidence: services/backgroundSyncService.ts:382-396 (expo-background-task, minimumInterval 240 min: 'Android roughly honors it, iOS treats it as a suggestion'), :259-281 (Android: warns about a disconnected Health Connect client; iOS: detects a locked device/inaccessible database and does not advance the cursor), :132-141 (Android refreshes widgets).
- **Health history import (backfill)** — Android: requires 'Allow access to all past data' and is limited by the Health Connect API quota (per-metric probes save quota). iOS: unlimited history with the normal authorization, no quota, but it may show the permissions sheet again.
  - Evidence: services/backfillService.ts:151-157 (requests history permission; if denied it only reaches ~30 days), :225-241 (iOS only: re-requests HealthKit authorization before reading because undetermined types throw an error), :93-100 and :184 (Health Connect quota -> resumes another day); services/healthconnect/index.ts:141-175 (ReadHealthDataHistory); se…
- **Health permissions request** — On Android the app knows when permissions are missing and can report it; on iOS it cannot know whether read access was denied (the data simply comes back empty).
  - **Updated in PRs #2998 and #3059 (merged):** Android still reports missing permissions, and 'Enable All Health Metrics' now keeps every metric whose permissions were all granted, saying only write-back is missing when just write permissions were declined. iOS cannot tell what was granted, so there it still turns on all metrics or none. When the Sync screen opens, iOS now asks HealthKit whether any enabled type has never been requested and only then shows the request, while Android asks again only when an app update raises its stored permission version.
  - Evidence: iOS services/healthkit/index.ts:313-470: 'Health App Not Available' alert if HealthKit is missing (:316-326), requests nothing on the simulator (:333-347), expands types (systolic/diastolic blood pressure :359-381, workout telemetry :382-394, total calories = basal+active :395-405, nutrition = dietary types :406-425) and returns true even if the u…
- **Imported workout telemetry (series, laps, and distance)** — iOS adds running dynamics (GCT, vertical oscillation, stride) that Android does not read; Android adds step cadence that iOS does not read. iOS assigns the workout's exact samples; Android correlates them by time window with a density limit.
  - **Updated in PRs #3065 and #3078 (merged):** The iOS sync now sends two per-workout values the Health Connect sync does not: the person's own 1–10 effort rating saved in Apple Health (Apple's automatic estimate is ignored), stored as workout_effort, and, on iOS 27, the time Apple itself counted in each of the five heart rate zones, which the server stores instead of working it out. Otherwise, and always on Android, the server works out time in zone from the heart rate series with the person's zone settings. The series, laps and distance differences described here are unchanged.
  - Evidence: iOS services/healthkit/workoutTelemetry.ts:64-108 (HR, RunningSpeed/CyclingSpeed, RunningPower/CyclingPower, CyclingCadence, ground contact time, vertical oscillation, stride length) with a per-workout predicate; laps from HKWorkout events (:251-286, :399-400); distance trying walking/running, cycling, swimming, wheelchair, and snow (services/heal…
- **Nutrition writeback to the health store** — Trans fat is only written on Android. In Apple Health each food item appears grouped as a 'Food' correlation. Hydration is exported the same way on both (one sample per manual drink + the remaining water from foods at noon).
  - Evidence: WritebackMetrics.ts:14,42-63 (only nutrition and hydration on both); iOS services/healthkit/writebackMappers.ts:38-41 (no trans_fat), :225-245 (one HKCorrelationTypeIdentifierFood correlation per food item with name and meal) and services/healthkit/writeback.ts:55,67,78 (UUID tracking, per-type authorization); Android services/healthconnect/writeb…
- **Nutrition read from the health store** — iOS cannot read trans fat (there is no HealthKit identifier). The standalone iOS metrics 'Dietary Fat Total', 'Dietary Protein', and 'Dietary Sodium' are defined but disabled (HealthMetrics.ts:721-768, enabled:false).
  - Evidence: HealthMetrics.ts:144-158 (nutrition on both platforms, rollingLookbackDays 2); iOS services/healthkit/dataTransformation.ts:125-139 (inverse of DIETARY_HK_MAP, no trans fat) and handleNutrition (services/healthkit/index.ts:1782); Android services/healthconnect/dataTransformation.ts:605 (iterates HC_NUTRIENT_COLUMNS from services/shared/dataTransfo…
- **Metric: Daily distance** — On iOS daily distance only counts walking/running (not cycling, swimming, or wheelchair); on Android it includes all DistanceRecord entries.
  - Evidence: HealthMetrics.ts:256 (both platforms); iOS services/healthkit/index.ts:509-513 and :251 (only HKQuantityTypeIdentifierDistanceWalkingRunning); Android services/healthconnect/index.ts:1253-1267 (DISTANCE aggregate from DistanceRecord).
- **Metrics: active calories, total calories, and basal metabolic rate** — Same visible metrics, but different sources and calculations; values may not match between an iPhone and an Android device for the same user.
  - Evidence: HealthMetrics.ts:69,88,201; iOS: total = basal + active (services/healthkit/index.ts:700-725), BMR = daily sum of resting energy dated to the next day (services/healthkit/provider.ts:26-36; index.ts:782). Android: native total with capture timestamp (services/healthconnect/provider.ts:42-63), active with total − basal fallback on days without data…
- **Metric: Heart rate variability (HRV)** — iOS sends SDNN and Android sends RMSSD with different server types; they are not comparable across devices.
  - **Updated in PRs #3019 and #3100 (merged):** HRV sync now also feeds sleep: with the HRV toggle on, synced nights get avg_overnight_hrv, the mean of HealthKit SDNN during the sleep on iOS and of Health Connect RMSSD on Android. The server stores both in the same field without a type, so overnight HRV in the sleep reports cannot be compared across devices either.
  - Evidence: HealthMetrics.ts:387 (iOS: HeartRateVariabilitySDNN, type 'HRV_SDNN', permission :398) and :404 (Android: HeartRateVariabilityRmssd, type 'HRV'); services/healthkit/index.ts:249; services/healthconnect/dataTransformation.ts:265; app.config.ts:51.
- **Metric: Pedaling cadence** — Exists on both but as different metrics (different id, server type, and category).
  - Evidence: HealthMetrics.ts:535 (Android: CyclingPedalingCadence, type cycling_pedaling_cadence; app.config.ts:40; healthconnect/dataTransformation.ts:855) and :956 (iOS: CyclingCadence, type cycling_cadence, Cycling category; services/healthkit/index.ts:274).

**Authentication & account security**

- **Passkey sign-in** — Android: getPasskeyBrowserPackage (authService.ts:705-760) opens the ceremony in a browser from an allowlist (Chrome, Firefox, Samsung Internet, Edge) when the default one may not support passkeys (for example, Fennec from F-Droid). iOS: always the system browser session (returns undefined).
  - Evidence: SparkyFitnessMobile/src/screens/OnboardingScreen.tsx:367-401, 885-916; src/components/ServerConfigModal.tsx:468; src/components/ReauthModal.tsx:285, 620-635; src/services/api/authService.ts:766-843 (loginWithPasskey)
- **Register a new passkey** — Android picks a passkey-capable browser from the allowlist (authService.ts:705-760); iOS uses the system browser. The copy also changes: 'Face ID, Touch ID, or your device PIN' and 'My iPhone' on iOS versus 'your fingerprint, face unlock, or device PIN' and 'My Android Phone' on Android (PasskeySettingsScreen.tsx:46-59).
  - Evidence: SparkyFitnessMobile/src/screens/PasskeySettingsScreen.tsx:170-232 (name validation and SESSION_NOT_FRESH at 210-216), 418-443, 466-515 (name modal), 519-526 (ReauthModal); src/services/api/authService.ts:888-975 (register-ticket + register-passkey)
- **LAN servers and self-signed certificates** — Android (production) trusts user-installed CA certificates, so a self-signed certificate works after installing its CA. iOS asks for the 'Local Network' permission and only trusts the system chain (a custom certificate requires installing a profile and marking it as trusted).
  - Evidence: SparkyFitnessMobile/plugins/withNetworkSecurityConfig.ts (Android: cleartextTrafficPermitted=false and trust in system and user CAs); app.config.ts:134 (production only), 171-188 (iOS: NSLocalNetworkUsageDescription and NSAppTransportSecurity with NSAllowsArbitraryLoads false)

**Administration & developer resources**

- **'What's New' screen with feature cards** — The 'A Liquid Glass look' card only appears on iOS 26+ with glass APIs (WhatsNewScreen.tsx:567-568, :615-637; canUseLiquidGlass in src/utils/liquidGlass.ts:9-10 returns false outside iOS). Android and older iOS see one fewer card.
  - Evidence: SparkyFitnessMobile/src/screens/WhatsNewScreen.tsx:559-690 (features with CTA to MedicationsList, AppSettings, Chat, FoodScan); row in src/screens/SettingsScreen.tsx:381-388; route App.tsx:1121-1125
- **What's New banner in the tab bar** — On iOS with native tabs (Liquid Glass) it is shown with an overlaid 'glass' presentation in each scene (NativeTabsBannerOverlay); on Android and on iOS without native tabs it renders in 'legacy' style inside the custom bar.
  - Evidence: SparkyFitnessMobile/src/components/WhatsNewBanner.tsx:38-89 (state/eligibility), :94-200 (legacy/glass presentations); src/components/TabsLayout.tsx:104-127, :256-259, :365; src/services/whatsNewBanner.ts:7, :39-42

**Food diary & daily logging**

- **Date navigation (previous/next/Today/calendar)** — iOS 26+ with Liquid Glass: the date controls are drawn as native header items (utils/nativeHeaderDatePicker.ts, services/nativeTabBarPreference.ts:25 iOS only). Android/older iOS: custom DateNavigator bar. On Android the system Back button does not close CalendarSheet (BottomSheetModal without useSheetHardwareBack) and navigates underneath it.
  - Evidence: SparkyFitnessMobile/src/components/DateNavigator.tsx:60-95; CalendarSheet.tsx; DiaryScreen.tsx:173-232 (iOS native header), 801-817 (DateNavigator), 782-787/828-833 (CalendarSheet)
- **Quick serving adjustment from the row** — On Android the Back button does not close ServingAdjustSheet (BottomSheetModal without useSheetHardwareBack). Not available for components of logged meals.
  - Evidence: SwipeableFoodRow.tsx:93-131,183-193; components/ServingAdjustSheet.tsx:139-183; DiaryScreen.tsx:661-663,788-793
- **Copy a meal to another date/meal type** — Only from the meal detail. On Android the Back button does not close CopyMealSheet.
  - Evidence: MealTypeDetailScreen.tsx:108-115,274-293; components/CopyMealSheet.tsx:159-303 (Target date, Target meal, duplicate warning)
- **Log water without opening the app** — iOS: Siri/Shortcuts, water widget with +/-, iOS 18 controls, and app icon quick action. Android: only the 'Log water' dynamic shortcut in the launcher.
  - **Partly covered by PRs #2989 and #3020 (merged):** Android now logs water without opening the app from the launcher Log water shortcut, a Log water Quick Settings tile (also from the lock screen) and a 2x2 home screen water widget whose − and + buttons remove or add one drink of the Dashboard's container. Siri/Shortcuts, the Action button, the Remove a drink control and Lock Screen water widgets are still iOS-only, and the Android water widget comes in one size only (iOS has small and medium).
  - Evidence: targets/widget/ShortcutIntents.swift, Controls.swift, waterWidget.swift; hooks/useQuickActions.ts:24-35,142; targets/android-background-water
- **Write diary nutrition and hydration to the health app** — iOS writes to HealthKit; Android to Health Connect (WRITE_NUTRITION/WRITE_HYDRATION). Opt-in per metric.
  - Evidence: src/services/writeback.ios.ts -> healthkit/writeback.ts; src/services/writeback.ts -> healthconnect/writeback.ts:90-175; components/HealthDataWriteback.tsx
- **Widgets with diary calories/macros** — iOS: calories, macros and water, plus lock screen families and controls. Android: Glance widgets for calories and macros.
  - **Partly covered by PRs #2989 and #3020 (merged):** Android now has calories, macros and water widgets (the water one with − and + buttons that work without opening the app) and four Quick Settings tiles as the counterpart of the iOS controls: Log water, Scan barcode, Search food, and Calories left with today's kcal left in its label, also on the lock screen. Still iOS-only: the Lock Screen widget families and the Start fast, End fast and Remove a drink controls, though on Android the water widget's − button does the same as the last one. The Android calories widget still lacks consumed and burned, and the calories and macros widgets are still a fixed 2x1 and 2x2.
  - Evidence: targets/widget/widgets.swift, macroWidget.swift, waterWidget.swift; targets/android-widget/kotlin/.../CalorieWidget.kt.tmpl, MacroWidget.kt.tmpl
- **Shortcuts to scan/log food** — The Android shortcut only offers 'Log water'.
  - **Updated in PR #2989 (merged):** Android now has Scan food and Log food among the app icon actions, plus Scan barcode and Search food Quick Settings tiles that open the same screens and serve as the counterpart of the iOS Control Center controls. The iOS Action button, which can also run these controls, still has no Android equivalent.
  - Evidence: hooks/useQuickActions.ts:24-35,114-118,142,170 (Platform.OS === 'ios'); targets/widget/Controls.swift (ScanFoodControlIntent/LogFoodControlIntent)

**Food library, meals & meal plans**

- **Scan nutrition label to fill in the food** — iOS 27+ with Apple Intelligence can read the label on-device (modules/on-device-nutrition, expo-module.config.json platforms ['ios']; src/services/onDeviceLabelScan.ts:17) with a toggle in Settings > AI and a banner to retry with the other AI; Android always uses the server AI.
  - Evidence: EditFoodMode.tsx:668-681 'Scan nutrition label' button -> FoodScan capture-label; creation from FoodScan lands in CreateFoodMode with LabelScanSourceBanner (CreateFoodMode.tsx:570-575); FoodScanScreen.tsx:582-611 (on-device first, then server /api/foods/scan-label in externalFoodSearchApi.ts:732).

**Exercises, workouts & running**

- **Workout sound settings** — On iOS 'Play through silent mode' also plays with the app in the background or the screen locked (keep-alive track; sounds.ts:37-45 isBackgroundRestChimeEnabled iOS only); on Android it only plays in the foreground, and in the background the notification is used. Different copy in WorkoutSettingsScreen.tsx:160-168.
  - Evidence: src/screens/WorkoutSettingsScreen.tsx:134-202 ('Rest timer sound', 'Play through silent mode', 'Lower music during cues'); src/services/sounds.ts:30-90
- **Strength workout status outside the app** — iOS: interactive Live Activity (lock screen / Dynamic Island) with −15 s, +15 s, skip rest and complete set. Android: persistent notification with a progress bar and countdown timer, no action buttons (it only opens the app).
  - Evidence: src/services/workoutLiveActivity.ios.ts:60-68 (rest ±15, skip, complete-set buttons) + WorkoutLiveActivityLayout.tsx; src/services/workoutLiveActivity.android.ts:21-40 + targets/android-workout-notification/.../WorkoutNotificationModule.kt:92-106; plugins/withWorkoutNotification.ts
- **Cardio session detail** — The real map is always drawn on iOS (Apple Maps); on Android only if the build has a Google Maps key, otherwise a plain line is shown (src/utils/routeMapSupport.ts:14-21).
  - **Partly covered by PRs #3014, #3022, #3065, #3078 and #3135 (merged):** Mobile's session detail now also shows average cadence, stride length and the effort rating when the entry has them, a Splits card per km or mile worked out from the GPS track (pace bars, height change and average heart rate), and buttons to save the route to Routes and to share the session as an image; both apps now say how the heart rate zones were worked out. Mobile still has no cadence or elevation charts and no table of the device's own laps, which web has. On Android the real map still needs a build with a Google Maps key.
  - Evidence: src/screens/CardioSessionScreen.tsx:291-406 (Route, Pace, Heart Rate, Heart Rate Zones, statistics); no cadence/elevation charts or laps table for synced sessions
- **Activity recording with the phone's GPS** — Available on both; in the background iOS uses the location indicator and Android a foreground service with a notification (gpsRecordingService.ts:1130-1135). See the rows on Live Activity, watch GPS, battery tips and indoor distance.
  - **Updated in PR #3052 (merged):** Live heart rate during a phone recording now also works on Android with a connected Wear OS watch: the watch sends it to the recording screen and it is saved with the activity, as the Apple Watch does on iOS. Without a watch neither platform shows heart rate. The background indicator still differs: iOS shows the location indicator and Android a foreground service notification.
  - Evidence: src/screens/RecordActivityScreen.tsx:1034-1065 (Walk/Run/Ride, Outdoor/Indoor), 1528-1830 (map, Time, Distance, Avg pace, Elevation, Heart rate, Laps, Splits, Lap, Pause/Resume, Finish, Discard, Save activity); AddSheet.tsx:403-414; services/gpsRecordingService.ts:1115-1135
- **Indoor distance from steps and treadmill correction** — Android saves the hardware step counter at the start and subtracts it at the end (a reboot invalidates it) (stepCounter.ts:43-77); iOS queries the pedometer history for the window when finishing (stepCounter.ts:80-88).
  - Evidence: src/screens/RunSummaryScreen.tsx:296-327 ('Treadmill distance', Update); src/services/stepCounter.ts:35-90; strideCalibration.ts; hooks/useIndoorDistanceEstimate.ts
- **Route drawn on a map** — iOS always uses Apple Maps; Android only if the build has GOOGLE_MAPS_ANDROID_API_KEY, otherwise only the line is drawn without a map (src/utils/routeMapSupport.ts:8-21).
  - Evidence: src/components/exerciseStats/RouteMap.tsx:12-15 (RouteTileMap with react-native-maps or RouteLine)

**Check-in, body measurements & wellbeing**

- **Automatic sync of body metrics, sleep and steps from the device health store** — iOS uses HealthKit and Android uses Health Connect. Body water mass only on Android (HealthMetrics.ts:505-518); Stress only on iOS (172-185); HRV and SpO2 use different record types on each platform (387-416, 606-646); iOS has background delivery (src/services/healthkit/backgroundDelivery.ts).
  - Evidence: src/HealthMetrics.ts:54-520 (metric definitions with platforms); App.tsx:959-963 (Sync); src/screens/SyncScreen.tsx; src/services/healthConnectService.ts / .ios.ts

**Goals & onboarding**

- **Display of progress against the step goal** — The goal line in Health Trends exists on iOS and Android; the Steps page and the Apple Watch complication only exist on iOS.
  - **Updated in PR #3052 (merged):** Wear OS now also has a Steps page with today's steps against the goal and a Steps complication, so these watch surfaces are no longer iOS only; the goal line in Health Trends is unchanged on both platforms. Unlike the Apple Watch, which shows the phone's last count, Wear OS also uses the watch's own step sensor when its count is higher. Web still shows the step goal nowhere.
  - Evidence: SparkyFitnessMobile/src/hooks/useMeasurementsRange.ts:88 -> src/components/StepsBarChart.tsx:15-65 (goal line in Health Trends); src/hooks/useWatchCheckInBridge.ts:470-473 (stepGoal sent to the watch, 10,000 by default) -> targets/watch/Presentation/StepsView.swift and targets/watch-widget/StepsComplication.swift
- **Home screen widgets with goal progress** — iOS has calorie, macro and water widgets, with lock screen formats. Android has Glance calorie and macro widgets, with no water widget.
  - **Partly covered by PR #3020 (merged):** Android now also has a water widget with today's water against the goal, a bar and − and + buttons, next to the calories and macros widgets. Still different: the Android calories widget shows only kcal left and its bar, without the food and burned calories; each Android widget comes in one fixed size, where iOS offers small and medium; and the Lock Screen formats are iOS only.
  - Evidence: iOS: SparkyFitnessMobile/targets/widget/widgets.swift, macroWidget.swift, waterWidget.swift; Android: targets/android-widget/kotlin/com/sparkyapps/sparkyfitness/widget/CalorieWidget.kt.tmpl, MacroWidget.kt.tmpl; plugins/withCalorieWidget.ts; src/services/CalorieWidgetBridge.ts
- **Use measured BMR (check-ins and synced devices)** — On iOS, with the toggle enabled, an extra note appears (CalorieSettingsScreen.tsx:918-925, Platform.OS === 'ios') recommending setting the activity level to None (×1.0), because Apple Health Resting Energy already includes light activity. It does not appear on Android.
  - Evidence: SparkyFitnessMobile/src/screens/CalorieSettingsScreen.tsx:893-927 (Switch 'Use measured BMR from check-ins and synced devices'), Settings > Calories & BMR (SettingsScreen.tsx:272-280).

**Reports & analytics**

- **Activity GPS route map** — iOS always draws on Apple Maps. Android only uses Google Maps if the build includes GOOGLE_MAPS_ANDROID_API_KEY (androidGoogleMapsEnabled); without a key it shows only the route line with no background map (src/utils/routeMapSupport.ts:14-21; app.config.ts:20-22,283-287,322).
  - Evidence: RouteMap in CardioSessionScreen (SparkyFitnessMobile/src/screens/CardioSessionScreen.tsx:298; src/components/exerciseStats/RouteMap.tsx, RouteTileMap.tsx, RouteLine.tsx)

**Medications, GLP-1 & symptoms**

- **Scan 'Supplement Facts' label (photo)** — On iOS, Apple's on-device model is tried first (modules/on-device-nutrition only has an ios/ folder, FoundationModels iOS 27+ with Apple Intelligence, 'Scan Labels On Device' setting); on Android server AI is always used.
  - Evidence: 'Scan label to fill in' with 'Take photo'/'Choose photo' (MedicationFormScreen.tsx:276-389,983-1002); useSupplementLabelScan.ts:23 first tries scanSupplementLabelOnDevice (services/onDeviceSupplementScan.ts:177) and otherwise falls back to server AI.

**Menstrual cycle, fertility & pregnancy**

- **Saving the daily log** — On iOS with native headers (iOS earlier than 26, or 26+ with Liquid Glass enabled) Save goes in the native bar (placement 'native-only'). On Android, and on iOS 26+ with Liquid Glass disabled, the fixed bottom bar FooterSaveBar is used (useNativeIOSHeadersActive in src/services/nativeTabBarPreference.ts:23-27). On Android the modal applies the top inset (CycleLogModalScreen.tsx:74).
  - Evidence: Explicit save in the CycleLogModal modal: Save button in the header or in FooterSaveBar (src/screens/CycleLogModalScreen.tsx:53-67,143-150). handleSave validates the numbers before writing (CycleTodayView.tsx:226-339).
- **Sync reproductive data from the system (menstruation, ovulation test, cervical mucus, intermenstrual bleeding)** — iOS offers menstruationFlow, menstruationPeriod, ovulationTest, cervicalMucus and intermenstrualBleeding. It uploads the raw value for flow, ovulation test, mucus and bleeding (src/services/healthkit/dataTransformation.ts:407-420). menstruationPeriod has no HealthKit identifier in index.ts, so it reads nothing. Android offers menstruationPeriod, ovulationTest, cervicalMucus and intermenstrualBleeding (not menstruationFlow). It transforms the per…
  - Evidence: 'Reproductive' metrics in src/HealthMetrics.ts:521-587 (Android) and 651-717 (iOS). The server does not use these types for the cycle: cycleRepository and cycleService only read basal_body_temperature.

**AI chat (SparkyChat) & AI settings**

- **Chat UI container** — iOS uses the native header (liquid glass, SF Symbol 'trash' icon) and RN core's KeyboardAvoidingView; Android uses the screen's own header and an ionicon, and react-native-keyboard-controller for keyboard avoidance (ChatScreen.tsx:107-115, 980-993, 1095-1105; src/services/nativeTabBarPreference.ts:23-27).
  - Evidence: SparkyFitnessMobile/App.tsx:771-775 (Stack.Screen 'Chat'); src/screens/ChatScreen.tsx:978-1166
- **Voice dictation with the system recognizer** — iOS uses SFSpeechRecognizer and needs a regional locale (src/utils/speechLocale.ts converts 'en' into 'en-US' based on the device). Android uses the Google/Samsung recognizer with androidIntentOptions EXTRA_ENABLE_LANGUAGE_SWITCH='balanced' (ChatScreen.tsx:581-585). addsPunctuation is requested on both platforms (ChatScreen.tsx:578).
  - Evidence: SparkyFitnessMobile/src/screens/ChatScreen.tsx:417-640 (SystemVoiceDictationButton), 735-743; app.config.ts:230-236 (expo-speech-recognition plugin with microphone and speech recognition permissions)
- **Reading source and “Read again” with the other engine** — The retry only appears when on-device reading is available (useRetryLabelScan.ts:44-50). On Android the source is always 'server', so at most the source label is shown, without “Read again”.
  - Evidence: SparkyFitnessMobile/src/components/LabelScanSourceBanner.tsx:15-62; src/hooks/useRetryLabelScan.ts:30-75; src/screens/foodForm/CreateFoodMode.tsx:547, 571
- **Supplement label scanning (Supplement Facts)** — iOS 27+ with Apple Intelligence reads it on-device first (OnDeviceNutrition.scanSupplementLabel); Android always uses the server vision.
  - Evidence: SparkyFitnessMobile/src/hooks/useSupplementLabelScan.ts:20-31; src/services/onDeviceSupplementScan.ts:181-184; src/services/api/medicationsApi.ts (/api/v2/medications/supplement-label/scan and /map); src/screens/MedicationFormScreen.tsx:181, 306, 986-993

**Settings, profile, family & integrations**

- **On-device health data sync** — iOS uses HealthKit (services/healthConnectService.ios.ts, services/healthkit); Android uses Health Connect (services/healthConnectService.ts) with a 'Not medical advice' notice on Android only (SyncScreen.tsx:961-972).
  - Evidence: src/screens/SettingsScreen.tsx:237-245 → SyncScreen (App.tsx:959-962); SyncScreen.tsx:190-196,514-515 (Health Connect vs Apple Health), HealthSourceLabel.tsx:13-19
- **Background sync** — Android requests the Health Connect BackgroundAccessPermission (SyncScreen.tsx:296-325); iOS starts HealthKit observers (SyncScreen.tsx:337-365) and warns that it updates 'when the phone allows it' (SyncFrequency.tsx:38-45).
  - Evidence: src/components/SyncFrequency.tsx:19-45; src/screens/SyncScreen.tsx:290-365,975-978
- **Selection of health metrics to sync** — Different permission flows (HealthKit vs Health Connect) but the same UI.
  - Evidence: src/screens/SyncScreen.tsx:372-440 (per-metric permissions), :600-660 (all), :983-990 (HealthDataSync)
- **Medication reminders** — Android creates a dedicated channel (services/notifications.ts:144-157) and requests the exact alarm permission so they fire on time; iOS does not.
  - **Updated in PR #3005 (merged):** Besides repeat, hide names and consolidate, medication reminders now have a Remind In setting (10, 15, 30 or 60 minutes) that sets the delay of the new Remind in button on the reminder notification, on iOS and Android. Android still adds its own channel and asks for exact alarms; the web still has no reminders.
  - Evidence: src/screens/NotificationSettingsScreen.tsx:298-392 (Medication Reminders, Repeat, Hide Medication Names, Consolidate)
- **AI service** — The 'On-device (Apple Intelligence)' / 'Scan Labels On Device' option requires iOS 27 with Apple Intelligence (AiSettingsScreen.tsx:146-150, services/onDeviceLabelScan); on Android it shows as unavailable.
  - Evidence: src/screens/AiSettingsScreen.tsx:69-101 only shows the server provider's status (without configuring it) and :120-160 adds on-device label scanning
- **Operating system shortcuts (Siri/Shortcuts, controls, and launcher shortcut)** — iOS: Siri/Shortcuts App Intents (log or remove water, log weight, start or end a fast) and Lock Screen / Control Center controls (scan and log food, open diary). Android: only a 'Log water' launcher shortcut (UI-less LogWaterActivity + WorkManager).
  - **Partly covered by PRs #2989, #3020 and #3051 (merged):** Android has Scan food, Log food and Fasting app icon shortcuts that open the app, plus four Quick Settings tiles and a water widget: the Log water shortcut and tile log a drink in the background (the tile also from the lock screen), and the widget's − and + buttons remove or add one, all with the stored login. The app icon shortcut names are translated in 10 of the 15 other languages the app ships, and the Log water long label, the Log water and Calories left tile names and the water widget texts in 6 (Spanish, Polish, Brazilian Portuguese, Cantonese and Simplified and Traditional Chinese), while the Log water result messages and the "Quick logging" notification channel are still English only. Siri/Shortcuts App Intents (log or remove water, log weight, start or end a fast) still have no Android equivalent, and no tile matches the iOS Remove a drink, Start fast and End fast controls.
  - Evidence: SparkyFitnessMobile/plugins/withBackgroundWater.ts:1-10; targets/widget/ShortcutIntents.swift:260 (LogWaterIntent), :300 (RemoveWaterIntent), :338 (LogWeightIntent), :370 and :408 (Start/End fast), :463-489 (Scan food, Log food, Open food diary controls); targets/android-background-water/.../BackgroundWaterModule.kt:32-33 (ShortcutInfoCompat 'Log …

**Native mobile capabilities**

- **Apple Health / Health Connect connection** — iOS uses HealthKit (@kingstinct/react-native-healthkit) with the system permission sheet. Android requires Health Connect to be installed, with the permissions declared in app.config.ts:27-80. The 'Not medical advice' notice only appears on Android (SyncScreen.tsx:961-974).
  - Evidence: SettingsScreen.tsx:237-245 (Health Data Sync row → Sync); SyncScreen.tsx:190-197 (health settings name), 899-912 (unavailable messages); services/healthConnectService.ts (Android) and healthConnectService.ios.ts (iOS)
- **Selection of metrics to sync, with preview** — The list is filtered by each metric's `platforms` field (HealthMetrics.ts:1081-1083). The details of which metrics exist on each platform are in the next three rows.
  - Evidence: SyncScreen.tsx:984-991 (HealthDataSync); components/HealthDataSync.tsx; HealthMetrics.ts:1076-1100 (platform filter and CATEGORY_ORDER)
- **Health metrics read on both platforms** — HRV, SpO2, and the reproductive metrics have a different definition on each platform. iOS also reads 'menstrual flow'. Bone mass (HealthMetrics.ts:492) and wheelchair pushes (435) appear in the iOS list, but have no identifier in HEALTHKIT_TYPE_MAP (healthkit/index.ts:232-290) and the read returns empty (index.ts:1929-1932). In practice they only work on Android.
  - **Updated in PRs #3019, #3034, #3042, #3091 and #3100 (merged):** Mindfulness sessions are now read on both platforms as a common metric: Android keeps the session type (meditation, breathwork, unguided or other), title and notes, while iOS sends every session as 'other' without notes. Sleep sessions now carry overnight HRV and resting heart rate on both platforms when those metrics are synced, and Android's daily heart rate average now gives each 5-minute stretch the same weight, while iOS keeps Apple Health's own daily average. Bone mass, wheelchair pushes and menstrual period still sync nothing on iOS.
  - Evidence: HealthMetrics.ts:54-445 and 492-503 (no platform restriction); HRV: separate entries at 387-400 (iOS) and 404-417 (Android); SpO2 and reproductive: Android entries at 521-617 and iOS entries at 636-718
- **Import full history (backfill)** — On Android, Health Connect limits daily reads and the import resumes on its own (ImportHistoryScreen.tsx:471-478). Without the READ_HEALTH_DATA_HISTORY permission it only reaches about 30 days (512-519; app.config.ts:72; patch patches/react-native-health-connect@4.1.3.patch). On iOS there are none of these limits.
  - Evidence: SyncScreen.tsx:947-958 (Import Full History row); ImportHistoryScreen.tsx:329-700; services/backfillService.ts; services/backfillCheckpoint.ts
- **GPS routes and HR for synced workouts** — On Android the route requires per-session consent through the system dialog (requestExerciseRoute in workoutTelemetry.ts:140-172, 325-330; app.config.ts:41-46). On iOS the HKWorkoutRoute is read with the general authorization. On iOS, workouts written by the app's own Apple Watch are excluded to avoid duplicating them (isOwnWatchWorkout).
  - Evidence: services/healthconnect/workoutTelemetry.ts; services/healthkit/workoutTelemetry.ts; healthkit/index.ts:190-202, 265 (HKWorkoutRoute)
- **Calories widget** — On iOS (WidgetKit) there are systemSmall and systemMedium sizes, plus Lock Screen accessories (widgets.swift:319-322); the buttons are on the medium one. On Android (Glance) it is only available on the home screen, at 2x1 and not resizable (res/xml/sparky_calorie_widget_info.xml).
  - **Still open:** The consumed and burned view and the extra sizes or resizing planned for the Android calories widget are not in the code: it still shows only the kcal left, a bar and the search and scan buttons, at a fixed 2x1 on the home screen only. iOS keeps its small and medium sizes with food and burned calories, and the Lock Screen versions.
  - Evidence: iOS: targets/widget/widgets.swift:179-213, 280-324; Android: targets/android-widget/kotlin/.../CalorieWidget.kt.tmpl:91-157; plugins/withCalorieWidget.ts; hooks/useWidgetSync.ts:63-134; services/CalorieWidgetBridge.ts
- **Macros widget** — iOS has small and medium sizes and Lock Screen versions. Android only has a home screen widget.
  - **Still open:** The extra sizes or resizing planned for the Android macros widget are not in the code: it is still a fixed 2x2 on the home screen only. iOS keeps its small and medium sizes and the Lock Screen versions.
  - Evidence: iOS: targets/widget/macroWidget.swift:248-266, 396-428; Android: MacroWidget.kt.tmpl:89-104, 251; res/xml/sparky_macro_widget_info.xml
- **Language of widgets, Live Activities, and native surfaces** — Android uses its own resources and locale for Glance. iOS uses Localizable.strings and reloads via ExtensionStorage.
  - **Partly covered by PRs #2989, #3020, #3025, #3051 and #3052 (merged):** On Android the calorie, macro and water widgets, the Quick Settings tiles and the app icon shortcuts follow the app language and update when it changes; the water widget texts, the Log water and Calories left tile names and the Log water shortcut's long label are translated only into Spanish, Polish, Brazilian Portuguese, Simplified and Traditional Chinese and Cantonese, and the Log water results stay English-only. iOS has the same six translations for its water widget and controls, but its hook still reduces the language to en/pl and reloads only the calorie and macro timelines; on both platforms the shortcut titles are untranslated in Hungarian, Italian, Latvian, Norwegian and Russian and the Latvian widget strings are empty. The Wear OS app's own texts are English-only, as are the Apple Watch app's.
  - Evidence: App.tsx:329-330 (useWidgetLanguageRefresh, useIOSWidgetLanguageRefresh); targets/android-widget/kotlin/.../WidgetLocale.kt.tmpl, WidgetLocaleApi33.kt.tmpl; targets/widget/en.lproj
- **GPS activity recording (walk, run, bike; outdoor or indoor)** — iOS uses the 'location' background mode with the blue pill (app.config.ts:200; gpsRecordingService.ts:1130). Android uses a foreground service with a notification (gpsRecordingService.ts:1131-1135) and shows a battery tip, 'Recording with the screen off', with a link to dontkillmyapp.com (RecordActivityScreen.tsx:1443-1466). The 'Record with: Phone/Watch' option only appears with a paired Apple Watch (RecordActivityScreen.tsx:1073-1125).
  - **Partly covered by PRs #3052, #3090 and #3154 (merged):** With a paired Wear OS watch, Android now offers 'Record with: Phone GPS / Watch GPS' for walks and runs, as iOS does with an Apple Watch, and the watch streams heart rate to a phone-GPS recording; fitness tests also open this screen, always with the phone. A walk or run recorded on the Wear OS watch reaches the phone with its GPS points and lap marks in a shape the phone drops, and heart rate times in seconds from the start instead of clock times, so it is saved with no map, splits or laps. The Route picker for following a saved route also shows on Android when recording outdoors on the watch, but the Wear OS app ignores the chosen route.
  - Evidence: screens/RecordActivityScreen.tsx:226-239, 1030-1160, 1520-1650; services/gpsRecordingService.ts:1115-1137; hooks/useAddSheetActions.ts:324
- **Indoor distance with the phone's pedometer** — iOS queries CMPedometer for the steps in the window when the session ends. Android stores the hardware counter at the start and subtracts it at the end (custom native module); if the phone reboots midway, there is no estimate.
  - Evidence: services/stepCounter.ts:40-95; modules/step-counter/android/.../StepCounterModule.kt; services/strideCalibration.ts; hooks/useIndoorDistanceEstimate.ts; app.config.ts:267-270 (motionUsagePermission)
- **Route map for cardio activities** — iOS always uses Apple Maps. Android only uses Google Maps if the build includes GOOGLE_MAPS_ANDROID_API_KEY; otherwise, it draws the route line with no background map.
  - Evidence: utils/routeMapSupport.ts:13-21; components/exerciseStats/RouteTileMap.tsx; app.config.ts:16-22, 283-289 (react-native-maps)
- **Watch HR during and after the workout** — Live HR only comes from an Apple Watch, i.e., only on iOS. Saved figures from synced workouts are visible on both platforms.
  - **Updated in PRs #3052 and #3078 (merged):** Android now gets live heart rate from a Wear OS watch, which streams it during a workout: the exercise cards show it live, and its samples give the same average, max and zone figures afterwards. Without a watch, Android still has no live heart rate. Zones are now worked out from each person's heart-rate zone settings, except Apple Watch sessions on watchOS 27, which keep Apple's own zones, and the zone bars say which method was used.
  - Evidence: stores/liveHeartRateStore.ts; components/ActiveWorkoutExerciseCard.tsx; screens/WorkoutCompleteScreen.tsx; hooks/useWorkoutHeartRateZones.ts
- **Rest-complete alert with 'Complete Set' action** — On iOS it is marked 'timeSensitive' and breaks through Focus modes (app.config.ts:212; notifications.ts:404-408). On Android it depends on the exact alarm permission (see native-notif-exact-alarm), and the notification is dismissed manually after tapping the action (notifications.ts:457).
  - Evidence: services/notifications.ts:93-101 (category), 381-430 (scheduleRestNotification); NotificationSettingsScreen.tsx:256-275
- **Rest-complete sound and 'Play through silent mode'** — On iOS, with 'silent mode' enabled, it also plays in the background and with the screen locked thanks to a silent track (UIBackgroundModes 'audio', app.config.ts:200; sounds.ts:38-45). On Android it only plays with the app open (outside the app, the alert is the notification), although it ignores silent or vibrate mode.
  - Evidence: WorkoutSettingsScreen.tsx:134-182; services/sounds.ts:32-120
- **Self-hosted server management** — Android production builds trust user-installed CAs, useful with self-signed certificates (plugins/withNetworkSecurityConfig.ts:24-27; app.config.ts:134). iOS asks for local network permission for servers on the LAN (NSLocalNetworkUsageDescription, app.config.ts:171).
  - Evidence: screens/ServerSettingsScreen.tsx:335-500; components/ServerConfigModal.tsx:62-188; services/storage.ts (proxyHeaders)
- **Scan a supplement label or barcode to fill in the medication** — Available on both platforms through the server. Only on iOS 27+ with Apple Intelligence (and the AiSettingsScreen toggle on) is on-device reading attempted first (modules/on-device-nutrition/index.ts:44-59, null on Android).
  - Evidence: screens/MedicationFormScreen.tsx:181 (useSupplementLabelScan), 276-306 (ImagePicker.launchCameraAsync or launchImageLibraryAsync), 959-999 ('Scan barcode to fill in' → FoodScan and 'Scan label to fill in'); hooks/useSupplementLabelScan.ts:23-28 (onDeviceSupplementScan first, then the server); services/api/medicationsApi.ts:56-62 (POST /api/v2/medi…

## 4. Methodology and limitations

- Static analysis: the apps were not run. "Present" means reachable from the UI (a screen, dialog, menu or setting registered in navigation), not merely an API client function.
- Some features depend on server configuration (e.g. OIDC, demo mode, AI, providers) or on permissions (admin, family access).
- Some capabilities appear in more than one domain (e.g. API keys under Authentication, Administration and Settings), so the counts measure granularity rather than unique features.
- Row verification status: verified: 857, no difference: 311, added during verification: 91, corrected during verification: 81, added by completeness critic: 25, not adversarially verified: 7, verifiers disagreed (most conservative reading kept): 1.
- "Web only / Mobile only" rows marked "No" mean no UI path was found after searching by name, translation labels, endpoints and components.