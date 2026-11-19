# Apple Watch app: complete feature inventory

_Inventory of everything the SparkyFitness Apple Watch app does, read from upstream `main` @ `efd5f8ba9` (19 Nov 2026) and checked against the code by a second pass. Written to rebuild the features one by one on another watch platform (Garmin Connect IQ). Paths are relative to `SparkyFitnessMobile/` unless they say otherwise; line numbers are for that commit._

How to use it: work through one feature at a time. Each entry says what the person sees and can do, the data the watch receives from the phone and what it sends back (message types and payload keys), the settings that change it, the platform capabilities it relies on, and where it lives in the code. The phone does every server call; the watch only talks to the phone.

## Contents

- [1. Pages, complications and settings](#1-pages-complications-and-settings) (30 features)
  - App shell: swipeable page deck, order, hiding and landing page
  - Phone-watch context sync (how every non-workout page gets its data)
  - First run, sign-in and empty states
  - Goals page (larger-text layout)
  - Goals page (classic layout)
  - Water page (larger-text layout): bottle, total and container buttons
  - Water page (classic layout)
  - Water log: today's drinks list and delete (the water 'undo')
  - Water offline queue, acknowledgement and reconciliation
  - Medications page: today's dose list and Log All
  - Medication dose screen: Taken, Skipped, Clear
  - Medication tap queue and reconciliation
  - Weight check-in (Digital Crown entry for weight and body fat)
  - Typed value entry (escape hatch for big weight or body-fat jumps)
  - Weight trend page
  - Sync status icon (shared by Trend, Water and Medications)
  - Fasting page: start presets, running timer, end fast
  - Steps page
  - Now Playing page
  - Larger text and screen-size scaling
  - Haptics on non-workout pages and the global haptics switch
  - Units on the watch (weight, energy, water)
  - Apple Watch settings screen on the phone (non-workout parts)
  - Complication: Daily Energy Goal (energyGoalComplication)
  - Complication: Water Intake (waterGoalComplication)
  - Complications: Protein, Carbs, Fat goals (proteinGoalComplication, carbsGoalComplication, fatGoalComplication)
  - Complication: Fasting (fastingComplication)
  - Complication: Steps (stepsComplication)
  - Complication data publishing, tap targets and refresh
  - Context data sent by the phone but not used by the Apple Watch (sleep and exercise summary)
- [2. Strength workouts](#2-strength-workouts) (41 features)
  - Idle Workout page: start a saved workout or today's scheduled one from the watch
  - Arming a workout from the phone (start on the phone, a preset tap, or a scheduled-workout tap)
  - Workout page layouts: classic vs new view, and the pages around the set screen
  - Set screen (classic view)
  - Set screen (new workout view)
  - Entering weight, reps and distance: keypad mode
  - Entering values: Digital Crown / drag mode (Hevy-style)
  - Values typed before the set is logged reach the phone (setValues)
  - Live target updates and sets logged on the phone (setTargets)
  - Workout structure changed mid-workout (workoutPlanUpdate)
  - Set types and warm-ups
  - Bodyweight exercises (added / assisted weight)
  - Timed sets: hold countdown, Get ready, stopwatch
  - Weighted carries (distance instead of reps)
  - Logging a set
  - Double tap gesture
  - Effort (RPE) after each set
  - Undo a logged set
  - Moving around the workout: previous/next, set dots, exercise list
  - Rest timer between sets
  - Countdown sound & haptic for the last seconds (new view)
  - Haptics used in strength workouts
  - Live metrics: elapsed time, heart rate, calories, sets done
  - Heart rate and energy recorded to the diary, per exercise
  - Up Next, Swap / Do first, Skip exercise
  - Editing the workout from the watch (sets, exercises, water)
  - Edit previous set (new view)
  - Plate calculator (new view)
  - Exercise demo pictures (new view)
  - Interval formats caption (AMRAP, EMOM, Tabata, For Time)
  - Supersets
  - Personal record (PR) celebration
  - Finishing the workout
  - 'Update Workout?' (update the saved preset after changes)
  - Discarding the workout
  - Post-workout summary
  - Workout effort rating (1-10, 'How hard was that?')
  - Saving the workout to Apple Health
  - Recovery after a crash, jetsam or relaunch
  - Working offline / phone out of range
  - Phone settings that affect strength workouts (summary)
- [3. Runs, walks, Jump Rope and routes](#3-runs-walks-jump-rope-and-routes) (37 features)
  - Where cardio lives and the Cardio entry row
  - Cardio start sheet (CardioChoicesView)
  - Pre-run Alerts setup (RunAlertsView)
  - Starting a wrist run (start flow and failure edge cases)
  - Outdoor GPS walk/run on the wrist alone
  - Indoor / treadmill walk and run (motion distance, learned correction)
  - Treadmill distance question at the end of an indoor walk/run
  - Jump Rope
  - Live cardio screen layout and controls
  - In-run settings sheet (gear)
  - Auto-pause outdoors (GPS speed)
  - Auto-pause indoors (pedometer steps)
  - Manual pause / resume
  - Laps
  - Splits (every whole km or mile)
  - Pace alert (live judging)
  - Heart rate alert (live judging)
  - Voice cue engine and relay to the phone's headphones
  - Spoken coaching cues (full list)
  - Interval and training-program plans
  - Phone starts a run on the watch (runStart)
  - Phone live view and remote control of a wrist run (runLive / runControl)
  - Live Activity / Smart Stack interplay
  - Following a saved route: turn prompts and off-route
  - Route map pages
  - Route library stored on the watch
  - Remote for a phone GPS recording
  - Live heart rate during a phone recording
  - Run summary on the watch
  - Effort rating after a run
  - What is saved: Apple Health
  - What is saved: diary entry and telemetry via the phone (runFinished)
  - Crash / app-kill recovery and Health session failure
  - One workout session at a time (conflicts)
  - Now Playing page during cardio
  - Haptic vocabulary for cardio
  - Run-related context the phone pushes to the watch
- [4. Phone link and settings](#4-phone-link-and-settings) (38 features)
  - Transport model: channels and delivery rules
  - Phone-side gates: which bridges run when
  - Context push (type 'context'): the snapshot the watch lives on
  - Watch side: receiving the context, cached context and complication refresh
  - Context request from the watch (type 'requestContext')
  - Acknowledgements (type 'ack' + ackedClientIds/failedClientIds in the context)
  - Weight / body-fat check-in from the watch (type 'checkIn')
  - Water container tap from the watch (type 'waterIntake')
  - Delete a logged drink from the watch (type 'waterDelete')
  - Medication / supplement dose: take, undo, skip from the watch (type 'medicationTaken')
  - Start / end a fast from the watch (types 'fastStart', 'fastEnd')
  - Account / server binding
  - Reachability / pairing status and Developer Tools watch status
  - Settings > Apple Watch: Gestures (double tap, RPE)
  - Settings > Apple Watch: Set input style
  - Settings > Apple Watch: Layout (classic vs new workout view)
  - Settings > Apple Watch: Pages order and visibility
  - Settings > Apple Watch: Goals page nutrients
  - Other phone settings mirrored to the watch through the context
  - Arm the watch when a strength workout starts on the phone (type 'workoutStart') + auto-launch
  - Start a saved workout from the watch (type 'workoutStartRequested')
  - Live plan updates during a workout (type 'workoutPlanUpdate')
  - Set targets, completions, timers, PRs and rest sync to the watch (type 'setTargets')
  - Interval / time-cap pause sync (type 'intervalTiming')
  - Exercise demo images to the watch (type 'exerciseImage')
  - Log / un-log a set from the watch (types 'setCompleted', 'setUncompleted')
  - Rest and set-timer changes from the watch (types 'restChanged', 'setTimerStarted', 'setTimerStopped')
  - Edit the running workout from the watch (type 'workoutEdit')
  - Strength workout heart rate and calories batches (type 'heartRateBatch')
  - Live heart rate to the phone (type 'liveHeartRate')
  - Finish, discard, rate effort, 'update saved workout?' (watch->phone 'workoutStop', 'workoutDiscard', 'workoutEffort', 'presetUpdateAnswer'; phone->watch 'workoutStop')
  - Watch as remote + HR sensor for a phone GPS recording (types 'recordingState', 'recordingControl', 'recordingHeartRate')
  - Start a watch-recorded walk/run from the phone (type 'runStart')
  - Live view and remote control of a wrist run on the phone (types 'runLive', 'runControl')
  - Spoken cues through the phone's headphones (types 'runCue', 'runCueAck')
  - Filing a finished wrist walk/run/jump rope into the diary (types 'runFinished', 'runEffort')
  - Route library on the watch (types 'routeSync', 'routeRemove', 'routeLibrary')
  - Watch-side resend and retry rules

## 1. Pages, complications and settings

_Apple Watch app shell and every non-workout page (Goals, Water, Water log, Medications, Weight check-in, Weight trend, Fasting, Steps, Now Playing), larger text, screen-size scaling, haptics and units, the phone sync plumbing for these pages, the phone's Apple Watch settings screen, and every complication in targets/watch-widget. Paths are relative to /home/user/sf-main/SparkyFitnessMobile. Checked against the code. Corrections to the previous pass: the classic Water label shows the percent and today's total, not the goal. Fasting buttons play no haptic. The Trend summary shows only the check-in made on this watch. A check-in that fails is reported only by a live ack. The steps-complication clear path never runs. Additions: food-linked containers, medicationSkip is not carried forward, the first-run edge cases, the shared sync icon and WatchStyle scaling._

### App shell: swipeable page deck, order, hiding and landing page

The app is one horizontal deck of full-screen pages. You move between them only by swiping; there are no navigation buttons. Page dots show automatically. Factory order: Goals, Water, Medications, Weight check-in (entry), Weight trend, Workout, Fasting, Steps.

The phone decides which pages show and in what order:
- Unknown or repeated page names are dropped.
- A page the saved order does not mention (added in a later build) goes at the end.
- A hidden Workout page still shows while a strength workout, wrist run or phone GPS recording is running.
- If everything is hidden, everything is shown.
- While one of those sessions is running, a Now Playing page sits right after Workout.

Where the app lands:
- It opens on the first shown page, or on Workout while a session runs.
- Returning to the foreground mid-session lands on Workout.
- When a phone-started workout (plan sessionId) or a recording (state sessionId) begins, it jumps to Workout once per session id. The wearer can swipe away and is not pulled back.
- A jump to a page that is turned off does nothing. If the selected page gets hidden, the deck falls back to the landing page.
- When the phone reorders or hides pages, the deck is rebuilt rather than diffed (moving the on-screen page used to crash).

A legacy 'recording' page name still decodes but is never put in the list.

Complication taps open sparkyfitness-watch://goals, water, fasting or steps. Unknown schemes or hosts are ignored. A link to a hidden page does nothing. A link that arrives while the first-run screen is owed waits behind it.

**Data from the phone:** Context keys pageOrder (string array of WatchPage raw values: goals, water, medications, entry, trend, workout, fasting, steps) and hiddenPages (string array). Each is carried forward when a push leaves the key out. Active state also comes from the workout, run and recording stores.

**Data the watch sends or saves:** None.

**Settings:** Phone: Settings > Apple Watch > Pages. Drag to reorder and toggle to hide; the last shown page cannot be switched off. Stored on the phone only (watchPageOrder defaults to all 8 in factory order; hiddenWatchPages defaults to empty).

**Capabilities:** Paged TabView and a URL scheme registered in the watch Info.plist for complication deep links. Garmin: a widget or app with a page loop (onNextPage/onPreviousPage or ViewLoop), the page list from phone settings or app properties, and a complication or glance launch into a given page.

**Code:** targets/watch/Domain/WatchPage.swift:9-57; targets/watch/Presentation/ContentView.swift:29-36,50-63,106-139,145-156,203-222; targets/watch/Domain/WatchDeepLink.swift:208-235; targets/watch/expo-target.config.js:22,40-52; src/constants/watchPages.ts:10-19; src/screens/WatchSettingsScreen.tsx:406-434; src/stores/appPreferencesStore.ts:178-179; src/hooks/useWatchCheckInBridge.ts:951-952

### Phone-watch context sync (how every non-workout page gets its data)

The watch never talks to the server; the phone makes every API call. The phone pushes one 'context' dictionary through updateApplicationContext (only the latest value is kept). It pushes:
- whenever anything in it changes (food logged, water, a setting flipped);
- when the watch asks (requestContext);
- when the watch becomes reachable;
- when the phone app returns to the foreground.

The watch saves the last context and shows it offline.

On launch and on foreground the watch:
- drops day data from a previous day;
- re-reads the context the system already holds, which works with the phone away;
- asks for a fresh one: a live sendMessage if reachable, otherwise at most one queued transferUserInfo request until the phone answers;
- re-publishes complications;
- on launch, also resends queued check-ins, water taps, water deletes and medication taps. The same resends run on session activation and whenever the phone becomes reachable.

Midnight handling:
- When the phone's data is for a different day than its 'today', it blanks the day-scoped figures (calories, macros, nutrients, water total and log, medications, sleep, exercise summary). The watch then shows 'not synced' instead of yesterday.
- The watch itself also clears nutrition, water and medication snapshots that are not today's on every launch, foreground and inbound context. Weight history is kept.

Other rules:
- Settings-like values (water goal, water unit, containers, haptics, rest alerts, larger text, page order and hidden pages, units, step goal, fast) are carried forward when a push leaves them out.
- The phone strips nulls before sending, so a missing key means null.
- On the phone, a push that finishes after a newer one has started is dropped (generation counter). So is a push whose active server changed while it was being built.
- The phone runs this bridge only while it is connected to its server (WatchCheckInGate). While it is offline, the watch keeps its items queued.

**Data from the phone:** Message type 'context'. Keys used in this area:
- Push metadata and acks: pushedAt (epoch ms, used as the context's build time), today (YYYY-MM-DD), ackedClientIds[] and failedClientIds[] (last 20 each).
- Weight: todayWeightKg, todayBodyFatPercentage, lastWeightKg, lastBodyFatPercentage, lastEntryDate, history[{day, weightKg, bodyFatPercentage}] (up to 14 days with a weight).
- Units: weightUnit (kg|lbs), energyUnit (kcal|kJ), distanceUnit.
- Nutrition: caloriesConsumed, caloriesBurned, caloriesRemaining, calorieGoalProgress, protein/carbs/fat Consumed, Goal and GoalProgress, goalNutrients[{key, label, unit, consumed, goal, progress}].
- Water: waterConsumedMl, waterFromFoodMl, waterLog[{id, name, volumeMl, time}], containers[{id, name, servingVolumeMl, unit}], waterGoalMl, waterDisplayUnit.
- Medications: medications[{id, medicationId, scheduleId, name, detail, time, status, supplement}], medicationSkip.
- Fasting and steps: fast{startedAt, targetEndAt, label}, fastKnown, steps{day, count}, stepGoal.
- Settings: hapticsEnabled, restAlertsEnabled, largerText, pageOrder, hiddenPages.
- Workout and run keys belong to other areas.

Also an 'ack' message {clientId, ok}. It is sent live only when the watch is reachable; the durable copy rides in the context lists.

**Data the watch sends or saves:** Message type 'requestContext' (no payload). Every outbound write goes through one path: sendMessage when reachable, falling back to transferUserInfo on error or when unreachable. Sends made before the session finishes activating are held in memory and flushed on activation.

**Settings:** None directly. The bridge is gated on the phone's server connection.

**Capabilities:** WatchConnectivity (application context, queued user info, live messages) and local persistence (UserDefaults). Garmin: Communications.registerForPhoneAppMessages and transmit, with Application.Storage holding the cached context and the outboxes; retry on app start and on each phone message.

**Code:** targets/watch/Infrastructure/WatchSessionManager.swift:133-191,577-623,625-666,668-710,712-729,1773-1813; targets/watch/Adapters/ContextPayloadMapper.swift:29-117,770-788; targets/watch/Application/CheckInStore.swift:286-377,453-505; targets/watch/Presentation/ContentView.swift:70-85,106-113; src/hooks/useWatchCheckInBridge.ts:152-190,803-961,1541-1621; modules/watch-connectivity/ios/WatchConnectivityModule.swift:633-650; App.tsx:242-253

### First run, sign-in and empty states

First-run gate. The app shows a one-time 'First check-in' screen instead of the deck when any of these is true:
- the watch has no weight to anchor the Digital Crown (neither todayWeightKg nor lastWeightKg);
- lastEntryDate is missing or unparseable;
- the last entry is more than 30 days old.
The gate is skipped when the phone has hidden the Weight check-in page.

The screen says 'Type today's numbers once — after this the Digital Crown starts from your last value.' It has two text fields: 'Weight <kg|lbs>' and 'Body fat % (optional)'. Comma or dot decimals are accepted. Save stays disabled until the weight parses. There is no range check here, and an unparseable body fat is simply left out. Save:
- plays a click;
- records the check-in (same message as the crown screen) and sends it;
- opens the deck on Weight trend if it is shown.
The gate stays off for the rest of the session even if a later context would turn it back on.

There is no sign-in on the watch; the phone owns authentication and the server. With no phone data, each page shows its own waiting text:
- Goals: dashes and 'Open SparkyFitness on your phone to sync today's numbers.'
- Water: 'Water not synced yet', plus 'Open SparkyFitness on your iPhone to sync your containers' (classic: '...on your phone...'). Once synced but empty: 'No containers set up on the server yet'.
- Medications: 'Open SparkyFitness on your iPhone to see your medications', or 'Nothing scheduled today'.
- Fasting: 'Waiting for your iPhone'.
- Steps: '--' and 'Waiting for your iPhone'.
- Trend: 'Log a few days to see your weight trend.'

While the phone app has no server connection its bridge is off, and the watch keeps everything queued.

**Data from the phone:** todayWeightKg, lastWeightKg, lastEntryDate, hiddenPages, weightUnit (kg if never synced).

**Data the watch sends or saves:** A 'checkIn' message (see Weight check-in).

**Settings:** Hiding the Weight check-in page on the phone skips the gate.

**Capabilities:** Text input (Scribble or dictation). Garmin: most devices lack free text, so use a numeric picker (NumberPicker or a custom up/down picker) for first weight.

**Code:** targets/watch/Application/CheckInStore.swift:83-88; targets/watch/Domain/CheckInModels.swift:618-670 (hasSeed, isSeedStale); targets/watch/Presentation/ContentView.swift:40-47,225-270; targets/watch/Presentation/GoalSummaryView.swift:28-34; targets/watch/Presentation/WaterIntakeView.swift:66-69,151-159; targets/watch/Presentation/ClassicWaterIntakeView.swift (noContainers / openPhoneClassic texts); targets/watch/Presentation/MedicationsView.swift:90-103; targets/watch/Presentation/FastingView.swift:110-112; targets/watch/Presentation/StepsView.swift:33,42-44; App.tsx:242-253

### Goals page (larger-text layout)

A read-only glance at today's nutrition.

Top: a large calorie ring in colour #8992DC. Its fill is the phone's calorie goal progress. Inside the ring is calories remaining as a signed whole number (negative when over), with the caption 'kcal left' / 'kcal over' (or 'kJ left' / 'kJ over').

Under the ring, one line: '<eaten> eaten · <burned> burned'.

Below that, one row per nutrient the phone picked (default Protein, Carbs, Fat):
- the name;
- the consumed amount in the nutrient's colour;
- '/ <goal><unit>', or just the unit when there is no goal;
- a gradient progress bar, hidden when there is no goal.
If the phone sends an empty list, no rows are shown. Custom nutrients show their own name and unit.

Colours: protein #DBB06F, carbs #97C692, fat #8AC2DA. Other nutrients take one of 5 extra colours by row position. All numbers are rounded to whole numbers. Nothing is computed on the watch; fractions arrive already clamped to 0-1.

Yesterday's snapshot is discarded. With no data the page shows dashes plus the 'Open SparkyFitness on your phone...' hint. VoiceOver reads unsigned text such as '254 calories over goal' or 'Protein 90 of 150 g'.

**Data from the phone:** caloriesConsumed, caloriesBurned and caloriesRemaining (all three are required, otherwise the page shows not synced), calorieGoalProgress, protein/carbs/fat Consumed, Goal and GoalProgress, goalNutrients[] (key, label, unit, consumed, goal (0 or absent means no goal), progress), today, energyUnit. A missing goalNutrients key (older phone) keeps the fixed protein, carbs and fat rows. Calories come from the phone's calorieBalance.

**Data the watch sends or saves:** None (read-only).

**Settings:** Phone: Settings > Apple Watch > Goals page nutrients. Pick and order any standard nutrient except calories and glycemic index, plus custom nutrients; default is protein, carbs, fat. The energy unit (kcal or kJ) comes from the account. Larger text on/off picks this layout or the classic one.

**Capabilities:** None special. Garmin: a simple view with an arc and bars.

**Code:** targets/watch/Presentation/GoalSummaryView.swift:18-21,23-40,47-57,59-127,136-177,179-250,253-281; targets/watch/Adapters/ContextPayloadMapper.swift:353-411; targets/watch/Domain/CheckInModels.swift:31-87,798-812; src/hooks/useWatchCheckInBridge.ts:143-147,636-653; src/utils/watchNutrients.ts:13-63; src/screens/WatchSettingsScreen.tsx:436-462

### Goals page (classic layout)

The same data as the larger Goals page in the original compact layout. 'Eaten' and 'Burned' numbers flank a smaller 76 pt calorie ring with remaining inside and the caption 'Kcal left' / 'Kcal over' (or 'kJ left' / 'kJ over'). Below are the same nutrient rows and bars, using small fixed font sizes. This is shown when Larger text is off, which is the default.

**Data from the phone:** Same as the larger Goals page.

**Data the watch sends or saves:** None.

**Settings:** Phone: Settings > Apple Watch > Layout > Larger text on the watch = off.

**Capabilities:** None special.

**Code:** targets/watch/Presentation/ClassicGoalSummaryView.swift:14-54,56-108,126-140; targets/watch/Presentation/ContentView.swift:161-166

### Water page (larger-text layout): bottle, total and container buttons

A bottle drawing (the same silhouette as the phone's hydration gauge) fills from the bottom with today's water as a fraction of the goal, animated.

Beside the bottle:
- Today's total in large cyan text, in the account's water unit. It shows '–' when there is no snapshot and nothing pending.
- A '60% of 2.50L' goal line. Without a goal it reads 'Water not synced yet'.
- 'Includes <x> from food', only when food water counts and is above 0.
- A sync icon next to the total, only while a tap or delete is outstanding. Orange means queued. Red means failed; tap it to resend failed taps.

Below, one full-width row per container configured on the server: a drop icon, the container name (2 lines) and the serving size in the container's own unit. Tapping a row immediately logs one full serving:
- a click haptic plays;
- while queued, the tap is drawn as a thin line above the fill;
- once the phone confirms (saved), it becomes part of the fill.
There is no selection state; every row is always live.

The last row, 'Today's Log', opens the drink list.

Containers are kept across days because they are configuration; the total is per day. Volume formatting: ml with 0 decimals, oz with 1, L with 2, and no space before the unit.

**Data from the phone:** waterConsumedMl (day total; absent means not synced), waterFromFoodMl (only when add_food_water_to_intake is on and the value is above 0), waterGoalMl and waterDisplayUnit (carried forward), containers[{id (int), name, servingVolumeMl, unit (ml|oz|liter)}], today, ackedClientIds and failedClientIds. servingVolumeMl is the per-tap amount: the phone has already divided out servings and applied the hydration factor; for a food-linked container it comes from the linked food's water. An absent containers key keeps the old list; an empty array means none.

**Data the watch sends or saves:** Message 'waterIntake' {clientId (UUID), entryDate (YYYY-MM-DD), containerId}. The phone adds one serving with changeWaterIntake (changeDrinks 1) to that day's water intake. For a container linked to a food, the server also logs the food, so calories change too. The phone then acks {clientId, ok} and pushes a new context.

**Settings:** Containers, water goal, water display unit and the food-water option are account settings on the server or phone. Larger text picks this layout or the classic one.

**Capabilities:** None special (button list and drawing). Garmin: a menu or button list and a custom-drawn bottle or arc.

**Code:** targets/watch/Presentation/WaterIntakeView.swift:16-72,93-140,145-160,165-238,242-298; targets/watch/Domain/CheckInModels.swift:89-133,602-612; targets/watch/Adapters/OutboundPayloads.swift:67-76; targets/watch/Adapters/ContextPayloadMapper.swift:413-457; targets/watch/Infrastructure/WatchSessionManager.swift:443-488; src/hooks/useWatchCheckInBridge.ts:505-515,580-598,1185-1310; src/utils/watchWater.ts

### Water page (classic layout)

The original layout, shown when Larger text is off (the default).

Left two-thirds, top to bottom:
- a row with the sync status icon (always shown here, including a green tick when caught up) and the label '<percent>% * <today's total>'. The asterisk is literal, and the figure is today's total, not the goal. Without a goal the label reads 'Water not synced yet'.
- the optional 'Includes ... from food' line;
- the bottle with the same fill and queued line.

Right third: a scrollable column of square container buttons (drop, name on one line, serving), ending with a neutral 'Log' square that opens today's drink list.

Tap behaviour is the same as the larger layout. Empty text: a drop icon with 'Open SparkyFitness on your phone to sync your containers' or 'No containers set up on the server yet'.

**Data from the phone:** Same as the larger Water page.

**Data the watch sends or saves:** The same 'waterIntake' message.

**Settings:** Larger text off (default).

**Capabilities:** None special.

**Code:** targets/watch/Presentation/ClassicWaterIntakeView.swift:72-77,90-140,150-240; targets/watch/Presentation/ContentView.swift:167-172

### Water log: today's drinks list and delete (the water 'undo')

Opened from 'Today's Log' or 'Log', with a back chevron and the inline title 'Today'.

It lists today's manual drinks newest first. Each row shows the container name (bold, 2 lines), the amount in cyan in the account's unit, and the time, already formatted by the phone in the account's 12 or 24 hour format. Only manual entries that have a container are listed; Apple Health and other synced records are not. Empty state: a drop icon and 'Nothing logged yet today'.

Tapping a row plays a click and opens a sheet: 'Delete this entry?' with '<name> · <amount>' and two buttons, No and Yes (red). Each plays a click. Yes deletes.

While a delete is being sent, the row is drawn at 40% opacity and cannot be tapped again. Once the phone confirms, the row disappears. If the delete fails, the row comes back.

There is no add on this screen and no undo of a delete. Deleting is how a mistaken tap is reversed.

**Data from the phone:** waterLog[{id (server row id), name, volumeMl, time}] in the day-scoped context, plus acks.

**Data the watch sends or saves:** Message 'waterDelete' {clientId, entryId}. The phone calls deleteWaterIntakeLogEntry, which makes the server lower the day total and also delete a linked food entry. The phone then acks and pushes a new context.

**Settings:** None.

**Capabilities:** Navigation push and a modal sheet. Garmin: a Menu2 list plus a Confirmation dialog.

**Code:** targets/watch/Presentation/WaterLogView.swift:11-157; targets/watch/Application/CheckInStore.swift:171-208; targets/watch/Adapters/OutboundPayloads.swift:78-85; src/hooks/useWatchCheckInBridge.ts:557-572,1312-1395

### Water offline queue, acknowledgement and reconciliation

Every tap and delete is saved on the watch first, with a client id and the state 'queued', and is then sent. The states are:
- queued: an orange clock icon; a tap is drawn as a line above the fill;
- saved: a green tick; the tap counts in the fill until a newer total arrives;
- failed: a red triangle; tapping the icon resends failed taps under the same id.

Queued taps and deletes are resent under their original id on launch (taps and deletes), on session activation, and whenever the phone becomes reachable. The phone ignores repeats by client id, and the ids it has settled survive a phone app restart (up to 200 stored). A resend therefore never adds a second serving; a tap that already landed is simply acked again.

Saved and failed items are dropped once a context built after them (pushedAt) arrives with today's water. Queued ones wait for their ack or for midnight.

At midnight all of yesterday's taps are dropped, including queued ones. A queued delete survives, because it names a specific row.

The page's status shows the worst state across all outstanding taps and deletes.

**Data from the phone:** 'ack' {clientId, ok}; ackedClientIds and failedClientIds in every context; pushedAt.

**Data the watch sends or saves:** waterIntake and waterDelete resends with the original clientId.

**Settings:** None.

**Capabilities:** Persistent storage and queued background transfer. Garmin: an Application.Storage outbox, with retry on app start and when the phone connection returns.

**Code:** targets/watch/Application/CheckInStore.swift:120-215,299-354,486-525; targets/watch/Infrastructure/WatchSessionManager.swift:466-508,712-729,1773-1813; targets/watch/Domain/CheckInModels.swift:299-340,668-690; src/hooks/useWatchCheckInBridge.ts:210-225,1076-1110,1185-1310

### Medications page: today's dose list and Log All

Laid out like Apple's Medications app, with the large title 'Medications'. The phone sends scheduled doses soonest first, then untimed ones, then as-needed medications. Consecutive doses with the same title form one section:
- one section per time, e.g. '8:00 AM';
- 'Any Time' for scheduled doses without a time;
- 'As Needed' for medications with no schedule or a PRN schedule.

Each row has:
- a round mint icon (a pill, or a leaf for a supplement);
- the name on up to 2 lines;
- the dose text, or 'Skipped' in its place with the row dimmed to 60%;
- a check-circle once taken, orange until the phone confirms and green after.

A scheduled section with more than one dose still pending shows a 'Log All as Taken' button. It plays one click and sends a taken tap for each pending dose.

A sync icon in the top-left toolbar appears only while a tap is outstanding. When red, tapping it retries failed taps.

Yesterday's list is discarded. No snapshot means not synced; an empty list means 'Nothing scheduled today'.

**Data from the phone:** medications[] for today. Each entry is {id = 'medicationId:scheduleId', medicationId, scheduleId ('' for as-needed), name, detail (formatted dose, may be empty), time (localized; '' for untimed), status (pending|taken|skipped), supplement}. The phone builds it from active medications and today's entries, using the same matching rule as the phone's card. Also medicationSkip, which is not carried forward.

**Data the watch sends or saves:** Log All sends one 'medicationTaken' per pending dose (see the dose screen).

**Settings:** None on the watch; medications and schedules are managed on the phone or web.

**Capabilities:** A sectioned list with navigation. Garmin: Menu2 with header-like separator items.

**Code:** targets/watch/Presentation/MedicationsView.swift:12-201; targets/watch/Adapters/ContextPayloadMapper.swift:459-484; src/utils/watchMedications.ts:11-79; src/hooks/useWatchCheckInBridge.ts:531-555

### Medication dose screen: Taken, Skipped, Clear

Tapping a dose opens it. The screen shows the icon, the name, 'dose · time', and a status line ('Taken' in green, or 'Skipped').

Buttons:
- 'Taken' (green), shown unless the dose is already taken.
- 'Skipped', shown only for a scheduled dose that is not already skipped, and only while the phone's context says medicationSkip is true.
- 'Clear' (red text), shown once the dose is taken or skipped. It undoes a mistaken tap; the phone deletes the entry.

Each press plays a click, records the tap on the watch, sends it and closes the screen. A new tap replaces an earlier failed one for the same dose.

As-needed doses log a once-a-day 'prn_taken' entry and cannot be skipped.

**Data from the phone:** The dose from the context; medicationSkip.

**Data the watch sends or saves:** Message 'medicationTaken' {clientId, entryDate, medicationId, scheduleId, taken, skipped}. taken is true for Taken and false for Skipped or Clear. skipped: true is included only for Skipped and is otherwise left out.

The phone handles taps one at a time, in arrival order. It reads the day's entries and then does one of:
- nothing, if the slot is already in the asked-for state;
- create (status taken, skipped or prn_taken);
- update a skipped or schedule-less entry;
- delete, for Clear.

It then acks {clientId, ok}, refreshes the medication and daily summary caches and pushes a new context. The result is saved as a server medication entry.

**Settings:** None.

**Capabilities:** Buttons only. Garmin: an action menu or a view with three buttons.

**Code:** targets/watch/Presentation/MedicationsView.swift:205-285; targets/watch/Domain/CheckInModels.swift:233-297; targets/watch/Adapters/OutboundPayloads.swift:87-102; targets/watch/Infrastructure/WatchSessionManager.swift:510-557; src/utils/watchMedications.ts:81-132; src/hooks/useWatchCheckInBridge.ts:1405-1520

### Medication tap queue and reconciliation

Medication taps follow the same lifecycle as water taps. Each tap is saved on the watch and shown at once: while it is outstanding, the dose reads as the tap says. A failed tap reads as the phone's state, so the dose can be tapped again.

Taps are resent under the same id on launch, on session activation and when the phone becomes reachable. They are settled by acks and by a later today-context built after them.

At midnight, resolved taps from yesterday are dropped. A queued one is kept and resent under the day it was made, so a tick at 23:58 belongs to that day.

The phone keeps its repeat filter for these in memory only. It is safe because the phone reads the day's entries before writing.

**Data from the phone:** ack, ackedClientIds, failedClientIds, the medications snapshot, pushedAt.

**Data the watch sends or saves:** medicationTaken resends.

**Settings:** None.

**Capabilities:** Persistent outbox.

**Code:** targets/watch/Application/CheckInStore.swift:217-282,356-365,477-483; targets/watch/Infrastructure/WatchSessionManager.swift:526-557; src/hooks/useWatchCheckInBridge.ts:1405-1430

### Weight check-in (Digital Crown entry for weight and body fat)

One screen with two values.

Header: the short date ('Mon 17 Aug'), plus an orange '· replacing' when today already has a value (pending on the watch, or the phone's todayWeightKg for today).

The active value is shown large (46 pt, one decimal) with its unit. Turning the Digital Crown changes it:
- weight in steps of 0.1 kg or 0.2 lb, limited to ±6 kg (converted to lb when needed) around the starting value;
- body fat in steps of 0.1, limited to ±5 % around the starting value and to 0-100.
The starting value is today's pending or server value, otherwise the last value, otherwise 80 kg / 20 %.

Under the value is a change line:
- weight: '+0.4 kg since last', compared with the phone's lastWeightKg (the most recent day other than today);
- body fat: '+0.5 % since last', compared with lastBodyFatPercentage.
The line turns bold orange when the change looks wrong: more than 1.5 kg per day since the last entry (days counted from 1 to 7), or more than 2 % body fat.

The other value is shown small; tapping it (click) swaps which value is active.

Bottom buttons:
- On weight: 'Next' (click), which moves to body fat.
- On body fat: 'Save'. When the weight looks wrong it reads 'Save +2.3 kg', naming the change. The button is tinted orange when either value looks wrong.
- On body fat: 'Skip body fat', which saves without body fat. The field is left out, so the day's existing body fat is kept.

Long-pressing the big number opens typed entry.

On save:
- the weight is rounded to 0.1 in the display unit, then converted to kg;
- the check-in is recorded and sent;
- a success haptic plays;
- the deck jumps to Weight trend if it is shown.

If the phone changes the weight unit while this screen is open, the dial value is converted, not reset. Crown detent haptics follow the haptics setting.

**Data from the phone:** todayWeightKg, todayBodyFatPercentage, lastWeightKg, lastBodyFatPercentage, lastEntryDate, today, weightUnit (kg|lbs; the phone's st_lbs maps to lbs).

**Data the watch sends or saves:** Message 'checkIn' {clientId, entryDate, weightKg, bodyFatPercentage (left out when skipped)}. The phone upserts that day's check-in measurement by date, acks {clientId, ok} and pushes a new context. A failure is reported only by the live ack, not in failedClientIds, so a watch that misses it keeps the check-in queued and resends it. Saved on the server as the day's body measurement; nothing is written to Apple Health.

**Settings:** The default weight unit comes from phone Settings. The page can be hidden or reordered.

**Capabilities:** Digital Crown with detent haptics, and a long-press gesture. Garmin: up/down buttons or swipes for increments, onSelect for Next/Save, a long press or the menu key for typed entry.

**Code:** targets/watch/Presentation/CheckInEntryView.swift:11-89,91-134,138-232,238-318; targets/watch/Application/CheckInStore.swift:54-118; targets/watch/Domain/CheckInModels.swift:675-690,707-730; targets/watch/Adapters/OutboundPayloads.swift:49-65; targets/watch/Infrastructure/WatchSessionManager.swift:370-378,419-427,712-724; src/hooks/useWatchCheckInBridge.ts:855-860,1116-1172

### Typed value entry (escape hatch for big weight or body-fat jumps)

A sheet opened by long-pressing the big number. It has a title ('Weight (kg)' or 'Weight (lbs)', or 'Body fat (%)'), a text field prefilled with the current value (Scribble or dictation), and 'Set', which stays disabled until the value is valid.

It accepts a comma or a dot. It rejects NaN and infinity, and values outside 2-500 kg (converted to lb when in lbs) or 0-100 %.

Set plays a click, writes the value back into the dial and closes the sheet. Typing a body-fat value cancels an earlier skip.

**Data from the phone:** The current dial value and unit.

**Data the watch sends or saves:** None by itself; the value is sent with the next Save.

**Settings:** None.

**Capabilities:** Text input. Garmin: NumberPicker or TextPicker where available.

**Code:** targets/watch/Presentation/CheckInEntryView.swift:123-133,160,262-269,321-369

### Weight trend page

A summary row on top: the check-in sync icon next to the last check-in captured on this watch (weight, and body fat if it was given). The value for the selected chart is bold. The summary is empty if this watch has never captured a check-in.

The sync icon is green when saved, orange for 'Saved on watch · sends near phone', and red for 'Couldn't send · tap to retry'. Tapping red plays a click and resends pending check-ins.

Turning the Digital Crown switches between two charts, with one click per switch:
- Weight: up to 14 daily points. Server history is combined with unconfirmed local check-ins and the last saved one. Dots plus a centred 7-day rolling mean line. A tight y-axis padded by 1 kg, about 2 y labels, and no x axis. Today's dot is larger: green when confirmed, a hollow faded orange ring while still unconfirmed. Other dots are small and grey.
- Body fat: a line only, with no axes and the latest value printed at the right.

With fewer than 2 points the chart is replaced by 'Log a few days to see your weight trend.' or 'Log body fat a few times to see its trend.' Weight is converted to the display unit only for drawing.

**Data from the phone:** history[{day, weightKg, bodyFatPercentage}] (server measurements, up to 14 days), weightUnit, plus local pending check-ins, the last captured check-in and acks.

**Data the watch sends or saves:** A resend of 'checkIn' through the status icon.

**Settings:** Default weight unit. The page can be hidden or reordered.

**Capabilities:** Digital Crown and charts (Swift Charts). Garmin: draw a line chart with Dc; use up/down to switch metric.

**Code:** targets/watch/Presentation/TrendView.swift:17-236; targets/watch/Application/CheckInStore.swift:384-431; targets/watch/Presentation/SyncStatusIcon.swift:10-47; targets/watch/Domain/CheckInModels.swift:735-755; src/hooks/useWatchCheckInBridge.ts:150-152,840-870

### Sync status icon (shared by Trend, Water and Medications)

An icon-only indicator:
- green tick (checkmark.circle.fill): 'Saved to SparkyFitness';
- orange clock (clock.arrow.circlepath): 'Saved on watch · sends near phone';
- red triangle (exclamationmark.triangle.fill): 'Couldn't send · tap to retry'.
The labels are read by VoiceOver.

Only the red state is tappable. It plays a click and runs that page's retry: check-ins on Trend, failed water taps on Water, failed medication taps on Medications.

Visibility:
- Trend always shows it.
- Classic Water always shows it.
- Larger Water and Medications show it only while something is outstanding.

**Data from the phone:** The local sync state of the related items.

**Data the watch sends or saves:** Resends (checkIn, waterIntake or medicationTaken).

**Settings:** None.

**Capabilities:** None. Garmin: a small coloured icon or dot, with a tap or menu item to retry.

**Code:** targets/watch/Presentation/SyncStatusIcon.swift:10-47; targets/watch/Domain/CheckInModels.swift:735-755; targets/watch/Presentation/WaterIntakeView.swift:112-119; targets/watch/Presentation/ClassicWaterIntakeView.swift:108-111; targets/watch/Presentation/MedicationsView.swift:34-46

### Fasting page: start presets, running timer, end fast

Idle: a fork-and-knife icon, 'Not fasting', and three full-width green buttons: 'Start 16:8', 'Start 18:6' and 'Start 20:4'. Before the phone has ever answered about fasting, the page says 'Waiting for your iPhone' and shows no buttons.

Running:
- the caption 'Fasting · <label>' (the phone's preset name, e.g. '16:8 Leangains'), or just 'Fasting';
- a ring that fills orange toward the target and turns green at 100 %;
- inside it, the elapsed time, updated every second on the watch ('14:05' as minutes:seconds under an hour, '16h 05m' after);
- '<time> to go', or a green 'Goal reached';
- a red 'End fast' button below the ring, which asks 'End your fast?' (End fast / Cancel).
An open-ended fast (no target) shows no ring and no remaining line.

After a request the buttons lock (a spinner replaces them on the idle page). They unlock when the phone's next context changes the fast, or after 8 seconds. These buttons play no haptic.

What the phone does:
- A start uses now as the start and now + the preset hours as the target, with the preset name as the type.
- A start is skipped if a manual fast is already running; an auto-calculated one does not block it.
- Ending an auto-calculated fast does nothing.
- The eating window of auto-calculated fasting is reported as no fast.

A fast continues across midnight.

**Data from the phone:** Context 'fast' {startedAt (epoch ms), targetEndAt (epoch ms or absent), label} and fastKnown: true. A null fast is stripped, so fastKnown is what tells the watch 'not fasting'. Both are carried forward when a push says nothing about fasting.

**Data the watch sends or saves:** 'fastStart' {presetId: '16-8'|'18-6'|'20-4', clientId} and 'fastEnd' {clientId}, sent through the queue. The phone ignores repeats by clientId in memory and calls startFast or endFast on the server fasting log. On end it also cancels the fast-goal notification. It then refreshes its fasting and daily summary queries and acks {clientId, ok}. The watch ignores that ack and waits for the context.

**Settings:** None on the watch; the three presets are fixed on the wrist.

**Capabilities:** A local 1 s timer and a confirmation dialog. Garmin: Timer plus onUpdate, Confirmation, and Menu2 for the presets.

**Code:** targets/watch/Presentation/FastingView.swift:5-157; targets/watch/Adapters/ContextPayloadMapper.swift:93-94,119-140; targets/watch/Adapters/OutboundPayloads.swift:104-114; targets/watch/Infrastructure/WatchSessionManager.swift:379-389; src/hooks/useWatchFastingBridge.ts:24-115; src/utils/watchFast.ts:16-34; src/constants/fasting.ts:19-40; src/hooks/useWatchCheckInBridge.ts:940-945

### Steps page

Read-only. The title 'Steps', then a ring (mint, turning green once the goal is reached) with a walking figure and today's count (grouped digits) inside, and 'of 10,000' (the goal) under it. Without a count for today it shows '--' and 'Waiting for your iPhone'.

The count is whatever the phone last read from today's check-in measurement row, not the watch's own pedometer. It only updates when the phone pushes.

**Data from the phone:** steps {day, count}: not carried forward, and absent means waiting. stepGoal: the daily summary's step goal, otherwise 10,000; carried forward.

**Data the watch sends or saves:** None.

**Settings:** None on the watch.

**Capabilities:** None on Apple Watch (the count comes from the phone). Garmin: could read ActivityMonitor.getInfo().steps and stepGoal natively instead.

**Code:** targets/watch/Presentation/StepsView.swift:3-50; targets/watch/Adapters/ContextPayloadMapper.swift:95-96,124-130; src/hooks/useWatchCheckInBridge.ts:507-510,826-840,946-950

### Now Playing page

The system Now Playing controls for whatever is already playing (Apple Music, a podcast, another app), as a full-screen page of its own. It exists only while a workout, wrist run or phone recording is running, right after the Workout page. It has no other controls; swipe back to the workout.

**Data from the phone:** Workout, run and recording active state only.

**Data the watch sends or saves:** None.

**Settings:** Cannot be arranged; it is automatic.

**Capabilities:** System media remote (NowPlayingView). Garmin: media controls are a system feature; there is no direct in-app equivalent.

**Code:** targets/watch/Presentation/NowPlayingPage.swift:1-14; targets/watch/Domain/WatchPage.swift:11-13,50-56; targets/watch/Presentation/ContentView.swift:29-36

### Larger text and screen-size scaling

One switch moves the whole watch between the original small fixed-size type (the default) and larger system text styles that follow the wearer's text size:
- Goals and Water swap to their larger layouts.
- Fasting, Steps, Check-in, Trend, the water log, Medications captions and the sync icons switch fonts.
- Medications keeps its list layout either way.
- The new workout view always uses its own large sizing.

Large numerals and rings are scaled by screen height (WatchStyle.s, about 0.82x to 1.1x of a 44 mm watch), so a 40 mm watch is not squeezed.

**Data from the phone:** Context key largerText (bool, carried forward, default false).

**Data the watch sends or saves:** None.

**Settings:** Phone: Settings > Apple Watch > Layout > 'Larger text on the watch' (iOS only, off by default).

**Capabilities:** Dynamic text styles. Garmin: two font sets per layout, chosen from a setting, and sizes scaled by screen size.

**Code:** targets/watch/Presentation/WatchTextSize.swift:3-46; targets/watch/Presentation/ContentView.swift:65-66,161-172,184-188; targets/watch/Presentation/WorkoutView.swift:821-830 (WatchStyle); targets/watch/Domain/CheckInModels.swift:658; src/screens/WatchSettingsScreen.tsx:283-301; src/stores/appPreferencesStore.ts:184; agent-docs/apple-watch.md:7

### Haptics on non-workout pages and the global haptics switch

Click haptic on: a container tap, dose Taken, Skipped and Clear, Log All (once), a water-log row, the Yes and No buttons, swapping focus on the check-in, Next, typed-entry Set, a first-run Save, a sync-icon retry, and each Trend chart switch.

Success haptic: saving a check-in, including 'Skip body fat'.

Crown detent clicks on the check-in screen follow the same switch. The Fasting start and end buttons play no haptic. There are no sounds or spoken cues on these pages.

One switch on the phone silences all watch haptics.

The app shell also handles notifications on the watch:
- The phone's 'Rest complete' notification (category 'rest-complete') is hidden while a watch workout is running and the app is in front, so it does not buzz twice.
- Other notifications show normally, with banner and sound.

**Data from the phone:** Context hapticsEnabled (default true, carried forward) and restAlertsEnabled (phone notifications on AND rest timer notifications on).

**Data the watch sends or saves:** None.

**Settings:** Phone app: Settings > Haptics switch (hapticsEnabled, default on), which also controls the watch.

**Capabilities:** Taptic engine (WKHapticType click and success) and a UNUserNotificationCenter delegate. Garmin: Attention.vibrate with short patterns, optionally Attention.playTone.

**Code:** targets/watch/Presentation/Haptics.swift:105-133,178-192; targets/watch/Presentation/CheckInEntryView.swift:107-115,186-188,209,305-318,360; targets/watch/Presentation/FastingView.swift:81-99,119-128,137-146; targets/watch/Presentation/MedicationsView.swift:74-76,277-283; targets/watch/Presentation/WaterLogView.swift:83,133,139; targets/watch/Presentation/TrendView.swift:85-87; targets/watch/Domain/CheckInModels.swift:640-651; targets/watch/Presentation/WatchAppDelegate.swift:40-91; src/hooks/useWatchCheckInBridge.ts:281-303; src/screens/AppSettingsScreen.tsx:40,250

### Units on the watch (weight, energy, water)

The watch always stores and sends kg and ml, and converts only for display:
- Weight: kg or lbs; stone+lbs shows as lbs.
- Energy: kcal or kJ (kJ = kcal x 4.184), on the Goals page.
- Water: the account's display unit (ml with 0 decimals, oz with 1, L with 2) for totals, the goal line and the log. Each container shows its own unit; a food-linked container uses the account unit.

**Data from the phone:** weightUnit, energyUnit, waterDisplayUnit, container unit.

**Data the watch sends or saves:** None.

**Settings:** Phone or account: default weight unit, energy unit and water display unit.

**Capabilities:** None.

**Code:** targets/watch/Domain/CheckInModels.swift:89-133,602-612,626-636,707-730,798-812; src/hooks/useWatchCheckInBridge.ts:318-331,515; src/utils/watchWater.ts (watchContainerDisplayUnit)

### Apple Watch settings screen on the phone (non-workout parts)

Phone: Settings > Apple Watch. The row appears only while a watch is paired (WatchConnectivity.isPaired).

Sections:
- Gestures: double-tap and RPE (workout).
- Set input (workout).
- Layout: 'Larger text on the watch', plus workout-only switches.
- Pages: a drag handle to reorder and a switch to hide each page. The last visible page cannot be hidden. A note says Workout still appears during a workout.
- Goals page nutrients: a switch and drag handle for every standard nutrient except calories and glycemic index, plus the account's custom nutrients. Default is protein, carbs and fat.

Changes are stored on the phone and reach the watch with the next context push. The phone app's general Haptics switch also controls the watch.

**Data from the phone:** Paired state.

**Data the watch sends or saves:** pageOrder, hiddenPages, largerText and goalNutrients (built from the shown nutrients in order) in the context.

**Settings:** This screen is the settings.

**Capabilities:** Garmin: Connect IQ app settings (properties, edited in Garmin Connect) or the phone app's own screen sending a settings message.

**Code:** src/screens/WatchSettingsScreen.tsx:143-147,162-301,404-465; src/screens/SettingsScreen.tsx:61-65,427-441; src/utils/watchNutrients.ts:13-63; src/stores/appPreferencesStore.ts:178-193

### Complication: Daily Energy Goal (energyGoalComplication)

Circular family only (accessoryCircular), with no visible text. An inner ring shows calorie goal progress (#8992DC). An outer ring is split into three fixed 120-degree sections, clockwise from 12 o'clock: fat, carbs, protein. Each fills 0-100 % of that macro's own goal, with gaps between sections.

It shows empty rings when the stored snapshot is not for today. A tap opens the watch app on Goals.

VoiceOver: 'Calories 60% of goal. Fat x%, carbs y%, protein z% of their goals.' Gallery name 'Daily Energy Goal'.

**Data from the phone:** Shared App Group key energyGoalSnapshot {date, calorieGoalProgress, proteinGoalProgress, carbsGoalProgress, fatGoalProgress, protein/carbs/fat Consumed and Goal}, written by the watch app.

**Data the watch sends or saves:** Deep link sparkyfitness-watch://goals.

**Settings:** Chosen by the user on the watch face.

**Capabilities:** WidgetKit complications and App Group shared storage. Garmin: complication publishing (Complications API, CIQ 4+) or a watch-face data field, plus a glance for a richer view.

**Code:** targets/watch-widget/EnergyGoalComplication.swift:54-110,159-230,256-290; targets/watch-widget/index.swift:5-14

### Complication: Water Intake (waterGoalComplication)

Circular family only. An open cyan arc with a 60-degree gap at the bottom, where a water drop sits, fills with today's water progress; the percentage is in the centre. Progress is the phone-confirmed total divided by the goal. Taps still pending on the watch are not counted, and with no goal it shows 0 %. It is also 0 % when the snapshot is not today's.

A tap opens the Water page. VoiceOver: 'Water 60% of goal.'

**Data from the phone:** App Group key waterGoalSnapshot {date, progress}.

**Data the watch sends or saves:** Deep link sparkyfitness-watch://water.

**Settings:** Watch face choice.

**Capabilities:** WidgetKit complication. Garmin: a complication or data field showing a percent.

**Code:** targets/watch-widget/WaterGoalComplication.swift:30-56,72-85,92-192,195-228; targets/watch/Infrastructure/WatchSessionManager.swift:615-622,702-707

### Complications: Protein, Carbs, Fat goals (proteinGoalComplication, carbsGoalComplication, fatGoalComplication)

One complication per macro, each in four families:
- Circular: a gauge with the letter P, C or F and the grams eaten (or the percent if grams are missing).
- Corner: the coloured letter with a curved progress bar labelled 'eaten/goal' (or the percent).
- Rectangular: the macro name with an icon, 'eaten/goal g' (or the percent) and a progress bar.
- Inline: e.g. 'P 90/150g' with an icon.

Colours: protein #DBB06F, carbs #97C692, fat #8AC2DA. Values are zero when the snapshot is not today's. A tap opens Goals. VoiceOver: '<Macro> 90 of 150 grams, 60% of goal.' Gallery names: 'Protein Goal', 'Carbs Goal', 'Fat Goal'.

**Data from the phone:** The same energyGoalSnapshot key: <macro>GoalProgress, <macro>Consumed and <macro>Goal.

**Data the watch sends or saves:** Deep link sparkyfitness-watch://goals.

**Settings:** Watch face choice.

**Capabilities:** WidgetKit accessory families. Garmin: complications or watch-face fields.

**Code:** targets/watch-widget/MacroComplications.swift:17-137,139-215,217-267

### Complication: Fasting (fastingComplication)

Four families:
- Circular: an orange gauge of progress toward the target, with whole hours elapsed ('14h'), or '--' when not fasting.
- Corner: a timer icon with an orange progress bar, or 'No fast'.
- Rectangular: the preset label (or 'Fasting') with a timer icon, a live running clock since the start, and a progress bar when there is a target; otherwise 'Not fasting'.
- Inline: a live timer, or 'No fast'.

It is not tied to a day, because a fast crosses midnight. A tap opens Fasting. VoiceOver: 'Fasting for N hours.' or 'Not fasting.'

**Data from the phone:** App Group key fastingSnapshot {active, startedAt (ms), targetEndAt (ms), label}. It is published only after the phone has answered about fasting.

**Data the watch sends or saves:** Deep link sparkyfitness-watch://fasting.

**Settings:** Watch face choice.

**Capabilities:** WidgetKit with self-updating timer text. Garmin: a complication with elapsed time computed on the watch.

**Code:** targets/watch-widget/FastingComplication.swift:9-166; targets/watch/Infrastructure/ComplicationPublisher.swift:171-183

### Complication: Steps (stepsComplication)

Four families, tinted mint:
- Circular: a gauge with a walking figure and the count ('9,512', or '12.3k' from 10,000 up).
- Corner: a figure icon with a progress bar.
- Rectangular: the label 'Steps', the count and a progress bar.
- Inline: '<count> steps'.

It shows 0 of 10,000 when there is no snapshot for today. A tap opens Steps. VoiceOver: '<count> of <goal> steps.'

**Data from the phone:** App Group key stepsSnapshot {date, count, goal}.

**Data the watch sends or saves:** Deep link sparkyfitness-watch://steps.

**Settings:** Watch face choice.

**Capabilities:** WidgetKit. Garmin: a native steps complication already exists; a custom one could show the phone's count.

**Code:** targets/watch-widget/StepsComplication.swift:15-60,62-130

### Complication data publishing, tap targets and refresh

The watch app is the only writer to shared storage. On every inbound context it publishes:
- nutrition, only if all four goal fractions came;
- water progress (water total / goal);
- steps;
- the fast, once the phone has answered about it.
On launch and foreground it publishes again from the stored context.

Numbers are written only when they describe today, so replaying an old context cannot relabel yesterday as today. Unchanged snapshots are not rewritten, so the daily reload budget is not spent.

The watch has a path to clear the steps snapshot when a push has no steps. Because the phone strips nulls, it never runs; a stale count falls back to 0 only through the widget's own date check.

The nutrition snapshot reloads the energy ring and all three macro complications together.

Widgets refresh every 15 minutes or at midnight, whichever comes first. While fasting, the fasting complication builds 48 entries 15 minutes apart (12 h); when not fasting it checks again hourly.

Taps use the URL scheme sparkyfitness-watch://<page>.

**Data from the phone:** The context keys listed above.

**Data the watch sends or saves:** App Group keys energyGoalSnapshot, waterGoalSnapshot, stepsSnapshot and fastingSnapshot, and WidgetCenter reloads of the kinds that read them.

**Settings:** None.

**Capabilities:** App Group, WidgetKit timelines and reload budget, and a URL scheme registered in Info.plist. Garmin: Complications.updateComplication from the app or a background service, and storage shared with the glance or watch face.

**Code:** targets/watch/Infrastructure/ComplicationPublisher.swift:35-249; targets/watch/Infrastructure/WatchSessionManager.swift:577-623,668-710; targets/watch/Adapters/ContextPayloadMapper.swift:507-532; modules/watch-connectivity/ios/WatchConnectivityModule.swift:633-638; targets/watch-widget/ComplicationLinks.swift:11-24; targets/watch-widget/FastingComplication.swift:65-81; targets/watch/expo-target.config.js:22,40-52

### Context data sent by the phone but not used by the Apple Watch (sleep and exercise summary)

The phone's context also carries:
- today's sleep: total, time in bed, score, bedtime, wake time, deep/REM/light/awake seconds, resting HR, HRV, SpO2 and naps;
- an exercise summary: minutes and goal, calories and goal, session count, and up to 3 sessions.

The Apple Watch app does not read either; only Wear OS does. So there is no sleep or exercise page on the Apple Watch.

**Data from the phone:** Context keys sleep and exerciseSummary (day-scoped, blanked across midnight).

**Data the watch sends or saves:** None.

**Settings:** None.

**Capabilities:** None on Apple Watch. Relevant if the Garmin build wants parity with Wear OS.

**Code:** src/hooks/useWatchCheckInBridge.ts:186-187,654-777; targets/watch/Adapters/ContextPayloadMapper.swift:29-117 (no sleep or exerciseSummary keys are parsed)

## 2. Strength workouts

_Strength workouts on the Apple Watch (targets/watch, with the phone bridge in src/hooks/useWatch*.ts and modules/watch-connectivity). Paths are relative to /home/user/sf-main/SparkyFitnessMobile. There are two layouts: the classic workout view (the default) and the opt-in "New workout view" (Settings > Apple Watch > New workout view, context key newWorkout). The phone owns the workout. The watch shows one set at a time, logs sets, runs the rest timer, records heart rate and energy, and saves the HKWorkout to Apple Health. Any change to the workout's structure goes to the phone as a request, and the phone sends the updated plan back. There are no workout complications: the watch-widget target has only steps, water, energy, macros and fasting._

### Idle Workout page: start a saved workout or today's scheduled one from the watch

When no workout is running, the Workout page lists, from the top: (1) A green 'Cardio' row, shown only while the watch's single workout session is free. It belongs to the run/walk area. (2) Today's scheduled workouts, each a blue row with a calendar icon, a caption ('Plan • Caption' in classic, only the caption in the new view), the workout name and a round play button. (3) The saved workouts (presets), sorted A-Z, as flat squircles; names wrap to 2 lines. A scheduled workout is listed only if it can also be started, and it is then left out of the saved list. A tap plays a click, changes that row to 'Starting…', and dims and disables the other rows. If the phone has not armed the workout within 3 s, the row unlocks so the wearer can try again. With no workouts, the page shows a strength figure and 'Start a workout on your phone'. The phone ignores the request if its app is offline or the account has changed. It keeps a queued request and runs it once its server connection is back, and it ignores a second delivery while that preset's session is already live. Precedence on this page: a strength workout in progress, then a wrist run, then a phone GPS recording, then the post-workout summary until Done, then this list.

**Data from the phone:** Context (updateApplicationContext) keys: startableWorkouts [{presetId,name}] (only presets with a non-empty name and at least one exercise, sorted by name); scheduledWorkouts [{presetId,name,planName,caption}] (today only; [] on other days); workoutServerId. An absent key keeps the previous list; an empty list is a real answer.

**Data the watch sends or saves:** workoutStartRequested {type, presetId, serverId?}. Sent through the queued path: sendMessage while the phone is reachable, otherwise transferUserInfo.

**Settings:** Nothing on the watch. Scheduled workouts come from the active workout plans in Library > Workout plans. The new view's picker follows 'Larger text on the watch', not the new view's own sizing.

**Capabilities:** Watch Connectivity application context and queued messages; haptics.

**Code:** targets/watch/Presentation/ClassicWorkoutView.swift:53-83 (page precedence),164-341 (picker, scheduledRow, start() with 3 s unlock); targets/watch/Presentation/WorkoutView.swift:98-286; targets/watch/Adapters/ContextPayloadMapper.swift:145-156,319-333; targets/watch/Adapters/OutboundPayloads.swift:123-132; targets/watch/Infrastructure/WatchSessionManager.swift:392-395; src/hooks/useWatchCheckInBridge.ts:108-118,389-443,935-939

### Arming a workout from the phone (start on the phone, a preset tap, or a scheduled-workout tap)

Starting a live preset session on the phone sends the whole plan to the watch: exercises, sets, targets, rests, set types and superset runs. The phone sends it with transferUserInfo, and also with sendMessage when the watch is reachable. It then calls HKHealthStore.startWatchApp with a Traditional Strength Training / indoor configuration, so watchOS opens the watch app if the watch is paired, the app is installed, and the watch is worn and unlocked. The watch jumps to the Workout page (once per sessionId) and starts the set screen at the first set in the phone's order. If the app launches or comes back to the foreground during a workout, it lands on the Workout page. The watch ignores: a start for the session already running (it does not restart from set 1); a queued copy of a start whose session has already stopped (armedAt at or before the stop); and a start while a wrist-only run is active or still being written to Health. If HealthKit recovery is still in progress, or a previous workout is still finishing, the new plan waits and starts afterwards. If a previous workout is still live, the watch finishes it first (finishCollection, without sending a stop) and then starts the new one. HealthKit authorization is requested on every start.

**Data from the phone:** workoutStart {sessionId, workoutName, exercises[{exerciseEntryId, name, supersetRun?, bodyweight?, equipment?, plates?{unit,barWeight,collarWeight,plates[{weight,pairs}]}, imageKey?, imageCount?, muscle?, sets[{setId, targetReps?, targetWeightKg?, restSeconds, restAfterSeconds?, setType?, targetDurationSec?, previousDurationSec?, timed?, carry?, targetDistanceKm?, weighted?}]}], setOrder[setId], workoutFormat?, timeCapSeconds?, startedAt?, armedAt?, capEndsAt?, fromPreset?}. Weights are always in kg and carry distances in km.

**Data the watch sends or saves:** Nothing is sent directly. The watch starts its HKWorkoutSession.

**Settings:** None. The Workout page shows while a workout runs even if it is hidden on the phone.

**Capabilities:** Phone-initiated app launch (startWatchApp with a workout configuration); HKWorkoutSession; Watch Connectivity queued transfer.

**Code:** targets/watch/Infrastructure/WatchSessionManager.swift:127-131 (startIsStale),778-865 (handle workoutStart, beginPlan); targets/watch/Adapters/ContextPayloadMapper.swift:614-676; targets/watch/Domain/WorkoutModels.swift:7-147; targets/watch/Application/WorkoutSessionStore.swift:551-621; targets/watch/Presentation/ContentView.swift:106-123,215-220; targets/watch/Domain/WatchPage.swift:30-57; modules/watch-connectivity/ios/WatchConnectivityModule.swift:279-300,662-671

### Workout page layouts: classic vs new view, and the pages around the set screen

Classic view (the default) is a vertical scroll that snaps one screen per page. In order: an optional Metrics page above (only when 'Metrics on the set screen' is off), the Set screen, an optional Up Next page (opt-in), Set options, Exercise options, then Workout (Add Exercise / Finish / Discard). New view, from the top: Demo (only while the current exercise has pictures), Metrics ('Live'), the Set screen, then 'More'. More is a free-scrolling list: an Up Next card, 'This set' and 'Exercise' tiles, and 'Workout' tiles. The scroll returns to the set screen whenever the current set changes (logged here or on the phone, an edit, or a jump). While any workout runs, a system Now Playing page is inserted right after the Workout page.

**Data from the phone:** Context newWorkout, setScreenMetrics, upNextPage, largerText.

**Data the watch sends or saves:** None.

**Settings:** Phone Settings > Apple Watch: 'New workout view' (watchNewWorkout, default off). 'Metrics on the set screen' (default on) and 'Up Next page' (default off) are shown only on iOS while the new view is off. 'Larger text on the watch' (default off) is a separate switch; the new view always uses its own large sizing.

**Capabilities:** Digital Crown scrolling between pages; SwiftUI vertical paging; Now Playing (media control).

**Code:** targets/watch/Presentation/ContentView.swift:183-191; targets/watch/Presentation/ClassicWorkoutView.swift:433-486; targets/watch/Presentation/WorkoutView.swift:400-494,628-652; targets/watch/Domain/WatchPage.swift:30-57; targets/watch/Presentation/NowPlayingPage.swift:4-13; targets/watch/Domain/CheckInModels.swift:656-659; src/stores/appPreferencesStore.ts:180-194; src/screens/WatchSettingsScreen.tsx:245-330

### Set screen (classic view)

Top strip: elapsed time (M:SS or H:MM:SS); a red heart with BPM and an orange flame with calories (only when 'Metrics on the set screen' is on); and a round list button that opens the exercise list. The list button is always available, including during rest. Below that: the exercise name (a marquee if too long), a 'Superset · partner names' line in the superset colour, and the set label in orange ('Set 2/3', 'Warmup 1/2', 'Drop 1/1', 'Failure 3/3'). Then the value boxes: Weight (LB/KG) and Reps. A timed set shows a countdown or stopwatch card instead; a carry shows a distance box (M/YD). On a timed set the weight box stays only if the set has a weight or is a weighted hold. Missing values show '–'. Whole numbers show no decimal; otherwise one decimal. Bottom row: ‹ previous set (disabled on the first), › next set (disabled on the last) and a large white ✓ tick. Once the set is logged, the tick becomes an orange undo arrow. After the last set, the screen shows 'Workout complete' with a green Finish button.

**Data from the phone:** Plan, setTargets overrides, latest HR and energy from HealthKit, and context weightUnit / distanceUnit / energyUnit (the watch defaults to kg when weightUnit is absent).

**Data the watch sends or saves:** See the logging, undo and navigation items.

**Settings:** setScreenMetrics; setInputStyle; weight unit and distance unit from the phone.

**Capabilities:** Touch; Digital Crown.

**Code:** targets/watch/Presentation/ClassicWorkoutView.swift:575-619,871-954,1021-1132,1395-1400,1560-1623; targets/watch/Domain/WorkoutModels.swift:203-215; targets/watch/Domain/CheckInModels.swift:628-638

### Set screen (new workout view)

Row 1 is a pill showing the block position among the workout's blocks ('2/6'; a superset counts as one block). A superset member also shows a letter badge such as 'A1' in the superset colour. Tapping the pill opens the exercise list. Under it, WorkoutTopLine shows either the elapsed time or the live HR + kcal; a tap switches between them. Then the exercise name, auto-shrunk to fit, or a marquee if it still does not fit. The detail row shows the equipment (or 'Set 2 of 3' / 'Warm-up 1 of 3' / 'Drop…' / 'Failure…'), '· logged' once the set is done, and one dot per set when the exercise has 6 sets or fewer. The current set is a bigger white dot, logged sets are filled (orange for warm-ups) and the rest are dim. Tapping a dot jumps to that set. With more than 6 sets, the label is shown instead of dots. Value tiles show a label (WEIGHT / REPS / DISTANCE / ADDED / ASSISTED), the number, a unit suffix, and a ± badge on standard tiles. Timed, carry, bodyweight and superset sets use a darker tile with no badge. At the bottom: a round ‹ button (Edit previous set; disabled until some set is logged) and a wide Log set capsule. The capsule shows 'Rest m:ss' (the rest that logging will start), or 'then A2' when the next set is the superset partner; once logged it shows 'Undo' in orange. The top line is hidden during rest and while a hold or Get ready is running. An interval-format caption appears under it when relevant. In always-on (dimmed) mode, the screen dims to 55% grey and the top line shows '24 min', updated once a minute, with frozen greyed metrics.

**Data from the phone:** Same as classic, plus the exercise equipment, heartRateZoneFloors and workoutTopLine.

**Data the watch sends or saves:** See the logging, undo and navigation items.

**Settings:** New workout view on. Top line: Time (default) or Metrics (workoutTopLine).

**Capabilities:** Always-on display (isLuminanceReduced), Digital Crown, touch.

**Code:** targets/watch/Presentation/WorkoutView.swift:580-624,1262-1408,2264-2370,2479-2640; targets/watch/Presentation/WorkoutTopLine.swift:3-160; targets/watch/Application/WorkoutSessionStore.swift:494-547

### Entering weight, reps and distance: keypad mode

With Set input = Keypad, tapping a value box opens a full-screen keypad. The current value shows in grey as a placeholder, so typing replaces it. The keys are 1-9, '.' (weight and distance only), 0 and ⌫. Bodyweight weights also get a ± key so negative (assisted) values can be entered. '.' on an empty entry becomes '0.'. OK with nothing typed keeps the grey value, and OK is disabled when nothing is typed and there is no value. Weight is typed in lb or kg and stored in kg. Distance is typed in metres, or yards when the phone uses miles, and stored in km. If the phone's distance unit changes while the distance keypad is open, the keypad closes so the old number is not saved in the new unit. Every key press clicks.

**Data from the phone:** weightUnit and distanceUnit from the context.

**Data the watch sends or saves:** Stored locally (editedValues, persisted in the snapshot), then sent to the phone as a workoutEdit setValues message (see value sync).

**Settings:** Phone Settings > Apple Watch > Set input: Keypad or Digital Crown (watchSetInputStyle, sent as setInputStyle; iOS only; default 'crown', and the watch treats an absent key as crown).

**Capabilities:** Touch; haptics.

**Code:** targets/watch/Presentation/ClassicWorkoutView.swift:1121-1131,1773-1875; targets/watch/Presentation/WorkoutView.swift:1420-1442,2848-2950; targets/watch/Domain/CheckInModels.swift:615-617; src/stores/appPreferencesStore.ts:194; src/screens/WatchSettingsScreen.tsx:209-240

### Entering values: Digital Crown / drag mode (Hevy-style)

With Set input = Digital Crown (the default), tapping a box selects it: a white border appears with the hint 'Crown or drag · tap again to type'. The crown then changes the value by 0.5 lb/kg, 1 rep or 5 m/yd per detent, at low sensitivity, with crown detent haptics. A vertical drag on the selected box also works, one step per 12 pt, with a click on each step. Caps: weight 1500 lb / 700 kg, reps 200, distance 5000. The floor is 0, or minus the cap for a bodyweight weight. Selecting a box does not rewrite a stored value above the cap; the first detent steps from it. When the crown hits the floor, its range is re-based, so the same turn can keep going down to zero. A second tap on the selected box opens the keypad for an exact value. The value is saved 0.5 s after the wearer stops turning, or immediately when the set is logged, the wearer navigates, or the view disappears. If the weight or distance unit changes while a box is selected, the edit is dropped. Weights are shown rounded the way the phone rounds them (0.1 lb, 0.01 kg), so 47.63 kg reads 105 lb.

**Data from the phone:** weightUnit, distanceUnit, hapticsEnabled.

**Data the watch sends or saves:** Same as keypad mode: a local edit, then workoutEdit setValues to the phone.

**Settings:** setInputStyle = crown. Crown detent haptics follow the phone's Haptics switch.

**Capabilities:** Digital Crown with focus; drag gesture; haptics.

**Code:** targets/watch/Presentation/ClassicWorkoutView.swift:966-999,1056-1075,1134-1314,1356-1383; targets/watch/Presentation/WorkoutView.swift:1362-1383,1476-1664,1736-1762; targets/watch/Domain/WeightRounding.swift:1-17

### Values typed before the set is logged reach the phone (setValues)

Any weight, reps or distance edited on the watch (set screen, Edit previous set, or Use in the plate calculator) is reported to the phone, so both screens show the same number before the set is logged. Edits are held until the wearer has stopped for 1.5 s, merged per set, and sent once. Values received from the phone are never echoed back. The phone drops: an edit for another session; an edit from an earlier arm of the same session (armedAt mismatch); an older edit per field when a newer one (by 'at') was already applied; and any setValues for a set the phone already has as logged. So editing an already-logged set on the watch changes only the watch's own summary volume, not the phone or the diary. The logged values are what setCompleted carried.

**Data from the phone:** None.

**Data the watch sends or saves:** workoutEdit {type:'workoutEdit', sessionId, clientId, action:'setValues', setId, at (epoch ms), weightKg?, reps?, distanceKm?, armedAt? (epoch ms)}. Queued.

**Settings:** None.

**Capabilities:** Watch Connectivity queued transfer.

**Code:** targets/watch/Application/WorkoutSessionStore.swift:893-920; targets/watch/Infrastructure/WatchSessionManager.swift:904-909,1312-1372; targets/watch/Adapters/OutboundPayloads.swift:171-201; src/hooks/useWatchWorkoutEdit.ts:28-46,63-99

### Live target updates and sets logged on the phone (setTargets)

After the start, the phone re-resolves every set's targets (history, progression bump, ramp, adaptive adjustment). Whenever anything changes, it sends them together with its logged set ids, rest state, running set timers and PR ids. Precedence on the watch: what the wearer typed, then the phone's latest target, then the plan's target. A set logged on the phone gets its tick on the watch. If that set is on screen, the watch moves to the next set still to do and starts the phone's rest, so both countdowns end together. A set the phone un-logs is reopened on the watch. A set just logged on the wrist is never treated as un-logged just because the phone has not listed it yet. The watch ignores an update from another session, an older revision, or another arm. An update that arrives before its plan is held until the plan starts.

**Data from the phone:** setTargets {sessionId, revision (JS ms, read as a Double), targets[{setId, targetWeightKg?, targetReps?, targetDurationSec?, previousDurationSec?, targetDistanceKm?}], completedSetIds[], restState 'resting'|'paused'|'ready', restEndsAt (epoch ms), restDurationSeconds, setTimers {setId: startedAtMs}, prSetIds[], armedAt (epoch ms)}.

**Data the watch sends or saves:** None (an inbound mirror).

**Settings:** None.

**Capabilities:** Watch Connectivity.

**Code:** targets/watch/Adapters/ContextPayloadMapper.swift:701-772; targets/watch/Application/WorkoutSessionStore.swift:260-364,423-470; targets/watch/Infrastructure/WatchSessionManager.swift:838-852,1278-1310; src/hooks/useWatchSetTargetsSync.ts:160-206

### Workout structure changed mid-workout (workoutPlanUpdate)

When exercises, supersets or sets are added, removed or regrouped on the phone (or through a watch edit request), the phone resends the full plan with a revision. The watch swaps it in without restarting anything: logged sets, typed values, targets, the running rest, HealthKit and the cursor all stay. If the current set was removed, the cursor moves to the first set still to do, and a pending Get ready for that set is cancelled. If the cursor lands on another exercise, the time window of the exercise just left is closed and its heart rate is sent. Phone completions for sets the watch did not know about yet are adopted.

**Data from the phone:** workoutPlanUpdate: the same shape as workoutStart, plus revision.

**Data the watch sends or saves:** Possibly a heartRateBatch for the exercise just left.

**Settings:** None.

**Capabilities:** Watch Connectivity.

**Code:** targets/watch/Application/WorkoutSessionStore.swift:660-720; targets/watch/Infrastructure/WatchSessionManager.swift:740,1374-1392; targets/watch/Adapters/ContextPayloadMapper.swift:604-612

### Set types and warm-ups

Each set carries a type from the phone: normal, warmup, drop or failure. The type changes the label ('Warmup 1/2', 'Drop 1/1', 'Failure 3/3' in classic; 'Warm-up 1 of 3' etc. in the new view), and warm-up dots are orange in the new view. A drop set gets no rest before it. The type can be changed from the watch: classic Set options > Set Type, or new view More > This set > Type (the subtitle shows the current type). Both open a list (Normal, Warm-up, Drop set, Failure) with a ✓ on the current one. Picking a type sends a request, and the label changes when the phone sends the plan back.

**Data from the phone:** PlannedSet.setType.

**Data the watch sends or saves:** workoutEdit {action:'setSetType', setId, setType} (the phone runs updateSetField set_type).

**Settings:** None.

**Capabilities:** Touch.

**Code:** targets/watch/Domain/WorkoutModels.swift:24-27,203-215; targets/watch/Presentation/WorkoutEditPages.swift:20-90; targets/watch/Presentation/WorkoutMorePage.swift:118-123,157-161,234-241; targets/watch/Domain/RestRule.swift:16-37; targets/watch/Adapters/OutboundPayloads.swift:153-156; src/hooks/useWatchWorkoutEdit.ts:101-105

### Bodyweight exercises (added / assisted weight)

For a bodyweight exercise, the weight is a signed change to body weight. Classic shows 'BW +10', 'BW −20' or 'BW'. The new view shows '+10' / '−20' / 'BW' with the tile label ADDED or ASSISTED, and no suffix at 0. The keypad gets a ± key and the crown can go below zero. The signed kg value is sent unchanged with the set. Up Next and Rest lines read 'BW +10 × 8'.

**Data from the phone:** PlannedExercise.bodyweight.

**Data the watch sends or saves:** setCompleted weightKg may be negative.

**Settings:** None.

**Capabilities:** Touch, Digital Crown.

**Code:** targets/watch/Application/WorkoutSessionStore.swift:252-256; targets/watch/Presentation/ClassicWorkoutView.swift:1139-1141,1380-1391; targets/watch/Presentation/WorkoutView.swift:1481-1488,1708-1721,1760-1770,1826-1830

### Timed sets: hold countdown, Get ready, stopwatch

A timed set with a planned length shows a countdown. Classic: an M:SS card with a green Start pill. New view: an amber HOLD tile ('45 s', '2 m') that starts on a tap. In the new view with 'Countdown before holds' on, a full-screen ring first counts 3-2-1 'Get ready' with the exercise name and weight and 'Tap to skip'. The hold starts when it ends or on a tap. Each number ticks if the countdown sound is on, and the start cue plays at 0. While the hold runs, the new view shows a big amber ring with the seconds left, live HR, the set dots, the name and weight, and 'Tap the ring to end early'. A tap logs the set with the time actually held. At 0:00 the wrist buzzes (or the end chime plays). In the new view the set then logs itself: at once if it is on screen, otherwise as soon as the wearer comes back to that set. A second Start tap while the hold is running does nothing. A timed set with no planned length is a stopwatch: a TIME tile shows 0:00 and, in grey, 'Last m:ss' from the last session. Start begins counting; while it runs the button becomes Stop, and double tap stops it. Logging sends the elapsed seconds. A countdown sends its target, or the time held if it was ended early. If the countdown was never started, the phone keeps the planned duration. Timers stay in step with the phone: one started here starts the phone's, and one started on the phone starts here from the phone's start time. A timer copied from the phone stops if the phone drops it. A countdown that already ran out on the phone does not buzz here. A running timer survives a relaunch, and one that ran out while the app was gone does not buzz again.

**Data from the phone:** PlannedSet.timed, targetDurationSec, previousDurationSec, weighted; setTargets.setTimers; targetDurationSec / previousDurationSec overrides.

**Data the watch sends or saves:** setTimerStarted {sessionId, setId, startedAt (ms), armedAt?}; setTimerStopped {sessionId, setId, seconds, startedAt (ms)}; setCompleted.duration (seconds).

**Settings:** Countdown before holds (watchHoldCountdown, default on, new view only). Countdown sound & haptic Off / 3 s / 5 s (new view only). The buzz at zero needs both Haptics and the rest alert on.

**Capabilities:** Timers that keep running with the wrist down (the HKWorkoutSession keeps the app alive); haptics/sound; double tap.

**Code:** targets/watch/Application/WorkoutSessionStore.swift:940-1133,1507-1530,1779-1827; targets/watch/Presentation/ClassicWorkoutView.swift:1427-1518; targets/watch/Presentation/WorkoutView.swift:1420-1449,1854-2156; targets/watch/Infrastructure/WatchSessionManager.swift:910-928; targets/watch/Adapters/OutboundPayloads.swift:513-544; targets/watch/Domain/CheckInModels.swift:661-662

### Weighted carries (distance instead of reps)

A carry set shows a Distance box beside the weight, in metres, or in yards when the phone's distance unit is miles. The keypad accepts one decimal and the crown moves 5 per detent. Distance is stored and sent in km. Rest and Up Next lines read '40 kg × 30 m'.

**Data from the phone:** PlannedSet.carry, targetDistanceKm; context distanceUnit.

**Data the watch sends or saves:** setCompleted.distanceKm (carry sets only).

**Settings:** Phone distance unit.

**Capabilities:** Touch, Digital Crown.

**Code:** targets/watch/Domain/WorkoutModels.swift:36-40; targets/watch/Presentation/ClassicWorkoutView.swift:1050-1052,1324-1329,1744-1751; targets/watch/Infrastructure/WatchSessionManager.swift:1484; targets/watch/Domain/CheckInModels.swift:638

### Logging a set

The tick (classic) or Log set (new view) plays a success haptic. It first commits any pending crown edit, then logs the values on screen. The set is marked done, its values at that moment are frozen for the summary volume, and the cursor moves to the next set still to do. That is the first unlogged set after this one, else the first unlogged set anywhere, because some sets may already be logged on the phone. The rest after the set starts (see rest timer). If no set is left, the screen shows 'Workout complete'. completedAt is the tap time, so the phone starts its rest from the same moment. The phone de-duplicates by clientId and ignores a set for a session it no longer has live. It applies the values with updateSetField before completeSet (watch values win), clears its own timer for that set, and saves the session at once.

**Data from the phone:** None.

**Data the watch sends or saves:** setCompleted {type, clientId (UUID, for de-duplication), sessionId, setId, weightKg?, reps?, duration?, distanceKm?, rpe?, completedAt (ISO 8601 with fractional seconds)}. A field the watch has no value for is left out rather than sent as null, so the planned value is not cleared. Queued, never dropped.

**Settings:** If RPE is on, the send waits for the effort screen (see RPE).

**Capabilities:** Haptics; Watch Connectivity queued transfer.

**Code:** targets/watch/Application/WorkoutSessionStore.swift:1143-1194; targets/watch/Domain/RestRule.swift:39-45; targets/watch/Presentation/ClassicWorkoutView.swift:1085-1101,1589-1596; targets/watch/Presentation/WorkoutView.swift:1453-1469,2319-2328; targets/watch/Infrastructure/WatchSessionManager.swift:1456-1490; targets/watch/Adapters/OutboundPayloads.swift:215-251; src/hooks/useWatchWorkoutBridge.ts:404-479

### Double tap gesture

On watchOS 11 and a watch that supports it (Series 9, Ultra 2 or later), double tap presses: Log set / the tick (only while the set is not logged); Stop on a running stopwatch, which takes the gesture from the tick so a hold is not logged mid-count; Skip on the rest screen (new view); and Save on the RPE screen (new view). It works only while the Workout page is the selected tab. In the new view it also requires that no RPE or New PR screen is covering the page; while one is, that screen owns the gesture. A sheet (keypad, list) takes the gesture first.

**Data from the phone:** Context doubleTapEnabled.

**Data the watch sends or saves:** Whatever the pressed button sends.

**Settings:** Settings > Apple Watch > 'Double-tap to log a set' (watchDoubleTapEnabled, default on; iOS only).

**Capabilities:** Double tap hand gesture (handGestureShortcut .primaryAction, watchOS 11+).

**Code:** targets/watch/Presentation/WorkoutView.swift:5-31,476-480,2149,2363-2366,2745,3204; targets/watch/Presentation/ClassicWorkoutView.swift:9-21,1499-1506,1613-1620; targets/watch/Domain/CheckInModels.swift:653; src/screens/WatchSettingsScreen.tsx:165-181

### Effort (RPE) after each set

Opt-in. After a set is logged, it is held behind an effort screen drawn over the page (not a sheet). The scale is 1, 2, 3, 4, 5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, starting at 8. Classic screen: the exercise name, 'Set 1/3: 65.0lbs × 12', one big value card with a white border that the crown moves, 'RPE', and a line explaining the value, from 'No more reps possible' (10) through 'Could've done 2 more reps' (8) to 'Light effort' (4), 'Very light effort' (3) and 'Little to no effort' (1-2). Then Skip / Save. New view: 'How hard?', 'Set N done', the number with a short form ('2 reps left', '0–1 reps left', 'Easy'), and a segmented track set with the crown or a drag (starting after the first touch), then Skip / Save; double tap = Save. The rest timer is already running underneath. Save sends the set with rpe; Skip sends it without. The held set (values, tick time, hold seconds at the tick, and the choice) is written to the snapshot. It is cleared only once an activated Watch Connectivity session has accepted it, so it survives a relaunch and is shown again or sent when the app comes back. The phone writes rpe only if it is within 1-10.

**Data from the phone:** Context rpeEnabled.

**Data the watch sends or saves:** setCompleted with rpe (Double).

**Settings:** Settings > Apple Watch > 'Ask for effort (RPE) after each set' (watchRpeEnabled, default off). Crown haptics follow the Haptics switch.

**Capabilities:** Digital Crown, drag, double tap, persistent storage.

**Code:** targets/watch/Presentation/ClassicWorkoutView.swift:492-520,535-545,1877-2045; targets/watch/Presentation/WorkoutView.swift:511-546,3068-3212; targets/watch/Presentation/EffortTrack.swift:36-126; targets/watch/Application/WorkoutSessionStore.swift:1184-1212,1477; targets/watch/Infrastructure/WatchSessionManager.swift:1505-1525; src/hooks/useWatchWorkoutBridge.ts:450-457; src/screens/WatchSettingsScreen.tsx:184-206

### Undo a logged set

Tapping the tick or Log set of a logged set (now an orange undo arrow, or 'Undo' in the new view) un-logs it. In the new view, More > Workout > 'Undo Set' (subtitle 'remove last log') reopens the most recently logged set; it is disabled when nothing is logged. Undo clears that set's frozen values and its timer, stops any rest on screen, and moves the cursor back to that set. The watch keeps the set out of the phone's completed list until the phone stops listing it or it is logged again.

**Data from the phone:** None.

**Data the watch sends or saves:** setUncompleted {clientId, sessionId, setId}. Queued; the phone runs uncompleteSet.

**Settings:** None.

**Capabilities:** Touch.

**Code:** targets/watch/Application/WorkoutSessionStore.swift:1222-1238; targets/watch/Presentation/ClassicWorkoutView.swift:1080-1084; targets/watch/Presentation/WorkoutView.swift:1395-1404; targets/watch/Presentation/WorkoutMorePage.swift:254-272; targets/watch/Adapters/OutboundPayloads.swift:253-262

### Moving around the workout: previous/next, set dots, exercise list

In classic, ‹ and › walk every set in workout order, crossing exercise boundaries. In the new view, tapping a dot jumps to that set of the exercise. Moving stops any rest on screen. Classic exercise list: opened from the list button as a sheet titled with the workout name. Superset members are grouped under a coloured 'Superset' header with a colour bar, and each row shows logged/planned counts ('2/4', green when done). Add Exercise, Finish Workout and Discard Workout sit below. New view exercise list: opened from the pill, the Up Next 'List' button or the rest screen's 'Next' line. It is a full-screen, text-only list with the workout name as a close button, rows showing done/total, and the current exercise highlighted. Choosing an exercise jumps to its first unlogged set, or to its first set if all are logged. Each exercise change sends the heart rate collected so far for the exercise being left.

**Data from the phone:** None.

**Data the watch sends or saves:** heartRateBatch at the exercise boundary (see heart rate).

**Settings:** None.

**Capabilities:** Touch.

**Code:** targets/watch/Application/WorkoutSessionStore.swift:1252-1294; targets/watch/Presentation/ClassicWorkoutView.swift:629-795,1580-1585; targets/watch/Presentation/WorkoutView.swift:683-776,2575-2600

### Rest timer between sets

Logging a set starts the same rest the phone runs, which is the completed set's own rest. There is no rest if the next set is a drop set or the next member of the same superset round, and none after the last set. With an older phone that does not send a set's own rest, the watch falls back to the next set's rest-before. Classic rest screen: a big M:SS, a blue progress bar, and three squircles (back 15 s, skip, forward 15 s). Below: 'Next set' or 'Next in superset' (in the superset colour), the next exercise name, and the target ('Set 2/3 · 60kg × 8'). New view: a ring with the time left and the live HR (zone-coloured), buttons −15 / Skip / +15 (double tap = Skip), then 'Next: name', the target and the set dots. A tap on it opens the list, and the ring grows on taller watches. Going below zero with −15 ends the rest, the same as Skip. Skip and ±15 are sent to the phone. When the phone pauses its rest, the watch shows 'Paused', freezes the countdown and disables Skip and ±15. The watch follows the phone's +15 / pause / skip, but only from updates that already list every set logged on the wrist, and only when the phone's rest actually changed. A rest skipped here that the phone brings back is skipped again on the phone. When the rest runs out on its own (not when skipped), the wrist buzzes. While a workout runs and the watch app is frontmost, the phone's forwarded 'Rest complete' notification (category rest-complete) is hidden. If another app is frontmost it still shows, as a duplicate cue.

**Data from the phone:** PlannedSet.restSeconds / restAfterSeconds; setTargets restState / restEndsAt / restDurationSeconds.

**Data the watch sends or saves:** restChanged {sessionId, previousEndsAt (ms), endsAt? (ms; omitted = skipped)}. Queued.

**Settings:** The buzz needs phone Haptics on AND the rest-complete alert on (restAlertsEnabled: notifications + rest-timer notifications). Countdown ticks: see countdown cues.

**Capabilities:** Timers that keep running with the wrist down (the HKWorkoutSession keeps the app alive); haptics; local notification presentation control (UNUserNotificationCenter delegate).

**Code:** targets/watch/Domain/RestRule.swift:1-46; targets/watch/Domain/StaleRest.swift:1-16; targets/watch/Application/WorkoutSessionStore.swift:349-361,423-450,1328-1354,1730-1777; targets/watch/Presentation/ClassicWorkoutView.swift:1625-1768; targets/watch/Presentation/WorkoutView.swift:2644-2843; targets/watch/Infrastructure/WatchSessionManager.swift:895-903; targets/watch/Adapters/OutboundPayloads.swift:551-561; targets/watch/Presentation/WatchAppDelegate.swift:1-65

### Countdown sound & haptic for the last seconds (new view)

For the last 3 or 5 seconds of a rest or a timed hold, and for each number of Get ready, the watch plays a short '.start' beep and tap each second. At zero it plays a distinct rising '.success' chime. The classic view plays no ticks, only a '.notification' buzz at zero. The cues are scheduled against the deadline as one-shot timers, so they fire on time with the wrist down and a late poll cannot skip or double one. Watch silent mode leaves only the tap.

**Data from the phone:** Context workoutCountdown (0, 3 or 5; absent = 3), holdCountdown.

**Data the watch sends or saves:** None.

**Settings:** Settings > Apple Watch > 'Countdown sound & haptic' Off / 3 s / 5 s (watchWorkoutCountdown, default 3). It is shown only while the new view is on, and the watch forces 0 in classic. The ticks and the end cue require Haptics AND the rest-complete alert.

**Capabilities:** Haptic engine with sound (WKHapticType .start / .success / .notification); background timers during the HKWorkoutSession.

**Code:** targets/watch/Application/CountdownCues.swift:1-44; targets/watch/Presentation/Haptics.swift:25-36; targets/watch/Presentation/WatchAppDelegate.swift:28-51; targets/watch/Domain/CheckInModels.swift:647-649,661-662; src/screens/WatchSettingsScreen.tsx:355-400

### Haptics used in strength workouts

Click on every button. Success on logging a set and on Use in the plate calculator. .notification for a new PR. Rest or hold end: .notification (classic) or .success (new view). Countdown ticks: .start. Crown detents (system). The phone's Haptics switch silences all of them. The rest/hold end cue and the ticks also need the rest-complete alert on. Strength workouts have no spoken cues.

**Data from the phone:** Context hapticsEnabled (absent = on), restAlertsEnabled (absent = on).

**Data the watch sends or saves:** None.

**Settings:** Phone Settings > Haptics; notifications and rest-timer notifications.

**Capabilities:** Taptic engine.

**Code:** targets/watch/Presentation/Haptics.swift:13-101; targets/watch/Presentation/WatchAppDelegate.swift:21-51; targets/watch/Domain/CheckInModels.swift:640-649; targets/watch/Presentation/WorkoutMorePage.swift:448

### Live metrics: elapsed time, heart rate, calories, sets done

Elapsed time ticks every second from the workout start. Heart rate comes from the HKWorkoutSession builder. Active calories come from HealthKit, shown in kcal or kJ. Classic: the strip on the set screen, or a separate Metrics page above it when 'Metrics on the set screen' is off. New view: a 'Live' page with the time, BPM with a heart, KCAL/KJ and 'X of Y SETS', plus the top line. Missing readings show '--' or are hidden. In the new view, HR and the heart icon take the person's zone colour (slate/blue/green/amber/red, zones 1-5) on the metrics page, top line, rest ring and hold ring, using floors the phone sends. While the wrist is down, the new view stops the per-second updates and freezes the readings. The watch also sends the current BPM to the phone at most every 3 s for its live chip. It does this only while the phone is reachable, and drops readings older than 5 s.

**Data from the phone:** Context heartRateZoneFloors (5 bpm floors), energyUnit.

**Data the watch sends or saves:** liveHeartRate {sessionId, exerciseEntryId, bpm, at (ms)}. sendMessage only, never queued.

**Settings:** setScreenMetrics (classic), workoutTopLine (new view).

**Capabilities:** Optical heart rate sensor through HKLiveWorkoutBuilder; active energy; always-on display.

**Code:** targets/watch/Presentation/ClassicWorkoutView.swift:871-954; targets/watch/Presentation/WorkoutView.swift:898-915,1177-1260; targets/watch/Domain/WatchHeartRateZone.swift; targets/watch/Presentation/WorkoutTopLine.swift:18-69; targets/watch/Infrastructure/WatchSessionManager.swift:191-229,875-890; targets/watch/Adapters/OutboundPayloads.swift:473-486; targets/watch/Application/WorkoutSessionStore.swift:876-892

### Heart rate and energy recorded to the diary, per exercise

Every heart-rate sample collected during the workout is buffered: from an anchored HealthKit query, with the builder's readings as a fallback. Samples are sent in batches tagged with the exercise that was on screen, every 60 s and at every exercise change. Each batch carries the active energy measured since the previous batch (a delta). When an exercise is left or the workout ends, it also carries the cumulative minutes spent on that exercise, rest included. At the finish, a final batch carries Apple's own time-in-zone numbers (watchOS 27). Batches are queued, so they survive the phone being out of range. The phone attaches them to the exercise entries (POST /api/exercise-entries/:id/watch-telemetry) as average and max HR, HR zones and calories. The measured calories replace the estimate.

**Data from the phone:** None.

**Data the watch sends or saves:** heartRateBatch {clientId, sessionId, exerciseEntryId, samples[{t: ISO, bpm}], activeEnergyKcal? (delta; 0 is sent), durationMinutes?, appleZones?[{index, minimumBpm?, maximumBpm?, seconds}]}. Queued.

**Settings:** Needs HealthKit read permission for heart rate and energy. Without it, the workout still runs as a timer and set tracker.

**Capabilities:** HKWorkoutSession + HKLiveWorkoutBuilder, HKAnchoredObjectQuery for heart rate, background execution, persistent queue.

**Code:** targets/watch/Infrastructure/WorkoutHealthKitController.swift:60-61,71,86,455-525; targets/watch/Infrastructure/WatchSessionManager.swift:881-890,929-937,1527-1595; targets/watch/Domain/WorkoutModels.swift:301-370; targets/watch/Adapters/OutboundPayloads.swift:268-290; targets/watch/Application/WorkoutSessionStore.swift:1300-1326; targets/watch/Infrastructure/AppleWorkoutZones.swift:1-43

### Up Next, Swap / Do first, Skip exercise

Up Next shows the next exercise still to do, leaving out the current exercise and its superset partners. Classic (the opt-in 'Up Next page', the first swipe below the set screen): 'Up Next', the name, one dot per set, its first target, and 'Then <next one>'. On the last exercise it shows 'This is the last exercise'. A tap opens the list, and there is a Swap button. New view: More starts with a card showing 'Next: name', the target, 'N sets', and the buttons 'Do first' and 'List'. Swap / Swap Exercise / More > Exercise > Swap opens a 'Do Now' list of upcoming exercises with their targets. Picking one, or 'Do first', asks the phone to move that exercise in front of the current one, and the watch jumps to it at once. These controls appear only when the phone says it supports this (exerciseDoNow true; an absent key hides them; this phone build always sends true) and there is an upcoming exercise. New view More > Exercise > 'Skip' (subtitle 'no log') jumps to the next exercise without logging anything. It appears only when there is a next exercise.

**Data from the phone:** Context exerciseDoNow, upNextPage.

**Data the watch sends or saves:** workoutEdit {action:'doExerciseNow', exerciseEntryId, anchorEntryId} (the phone runs doExerciseNow).

**Settings:** Up Next page (classic, default off).

**Capabilities:** Touch.

**Code:** targets/watch/Application/WorkoutSessionStore.swift:480-494; targets/watch/Presentation/WorkoutView.swift:976-1100; targets/watch/Presentation/WorkoutMorePage.swift:11-97,138-151; targets/watch/Presentation/WorkoutEditPages.swift:105-111; targets/watch/Presentation/ClassicWorkoutView.swift:455-459; targets/watch/Adapters/ContextPayloadMapper.swift:85; targets/watch/Adapters/OutboundPayloads.swift:163-166; src/hooks/useWatchWorkoutEdit.ts:109-113; src/hooks/useWatchCheckInBridge.ts:915

### Editing the workout from the watch (sets, exercises, water)

Classic pages: 'Set options' has Add Set, Set Type and Delete Set; delete asks 'Delete this set?' with 'An exercise's last set removes the exercise.'. 'Exercise options' has Swap Exercise (when available), Add Exercise and Delete Exercise; delete asks 'Delete <name>?' with 'Its sets are removed from this workout.'. 'Workout' has Add Exercise, Finish Workout and Discard Workout. New view More tiles: This set (Type; Plates, or Add Set when no plates apply; Add Set '+1 set'; Delete Set in red), Exercise (Swap, Skip, Delete Exercise), Workout (Water, which opens the regular water logging sheet; Undo Set; Add Exercise; Discard) and a full-width Finish Workout. Add Exercise lists up to 20 suggested exercises (recent first, then most used). With none it shows 'Recent exercises appear here once your iPhone has sent them.' Every edit is a request: nothing changes on the watch until the phone sends the new plan back. The phone applies an edit only for its live session, de-duplicates by clientId, and fetches the exercise from the server for Add Exercise; if that fetch fails, nothing is added. There is no 'Replace exercise'.

**Data from the phone:** Context suggestedExercises [{exerciseId, name}].

**Data the watch sends or saves:** workoutEdit {type, sessionId, clientId, action: addSet{exerciseEntryId} | deleteSet{setId} | setSetType{setId,setType} | addExercise{exerciseId} | deleteExercise{exerciseEntryId}}. Queued. Water: waterIntake (see the water area).

**Settings:** None.

**Capabilities:** Touch; confirmation dialogs.

**Code:** targets/watch/Presentation/WorkoutEditPages.swift:1-320; targets/watch/Presentation/WorkoutMorePage.swift:99-298; targets/watch/Adapters/OutboundPayloads.swift:134-169; targets/watch/Infrastructure/WatchSessionManager.swift:397-407; src/hooks/useWatchCheckInBridge.ts:120-140; src/hooks/useWatchWorkoutEdit.ts:63-134

### Edit previous set (new view)

The round ‹ button beside Log set opens a full-screen editor on the most recently logged set. It shows '✎ Set N', the name, '<equipment or label> · logged', the dots, and boxes for weight and reps (distance for a carry, or a read-only hold time for a timed set). Tapping a box opens the keypad, with ± for bodyweight. ‹ and › step through the logged sets in the order they were logged, across exercises; › past the newest returns to the current set. Moving discards unsaved edits. Save writes the edits and closes the editor. The watch's summary volume follows the edit, but the phone ignores setValues for a set it already has as logged, so the diary keeps the logged values. If the set is un-logged on the phone meanwhile, its draft is dropped. If no logged set remains, the editor closes ('No sets logged yet').

**Data from the phone:** None.

**Data the watch sends or saves:** workoutEdit setValues (through setValue); the phone drops it for logged sets.

**Settings:** New workout view.

**Capabilities:** Touch.

**Code:** targets/watch/Presentation/EditPreviousSetView.swift:1-290; targets/watch/Domain/LoggedSetOrder.swift:1-29; targets/watch/Presentation/WorkoutView.swift:505-510,1389-1394; targets/watch/Application/WorkoutSessionStore.swift:905-916; src/hooks/useWatchWorkoutEdit.ts:81-85

### Plate calculator (new view)

For a barbell exercise whose set has a weight, More > This set shows a 'Plates' tile. Its subtitle gives the plates per side ('20+10+1.25'), 'Bar only', or 'Not exact'. Opening it shows the weight with −/+ buttons (Lighter/Heavier), a side view of the barbell with the plates coloured by weight and the collar, and the per-side list ('20 · 10 · 1.25'). A weight the plates cannot make shows 'Closest X / Y' in amber with the bar dimmed, and an unusable config shows 'Cannot work this out'. Below are 'Bar 20 kg' and 'Use <weight>'. The crown and −/+ move only through weights the owned plates can build. The calculator uses a bounded knapsack (fewest plates, heaviest first) that mirrors the shared TypeScript calculator, in the plate config's unit (kg or lbs). Use is enabled only for an exact load; it writes the weight to the set with a success haptic. Closing any other way changes nothing. A config missing from or damaged in the payload hides the tile; Add Set takes its place.

**Data from the phone:** PlannedExercise.plates {unit 'kg'|'lbs', barWeight, collarWeight, plates[{weight, pairs}]}.

**Data the watch sends or saves:** setValue weightKg, then workoutEdit setValues.

**Settings:** The plate inventory comes from the phone.

**Capabilities:** Digital Crown (continuous), touch.

**Code:** targets/watch/Presentation/WorkoutMorePage.swift:117-136,170-176,218-232,387-584; targets/watch/Domain/WatchPlates.swift:1-214; targets/watch/Adapters/ContextPayloadMapper.swift:799-812

### Exercise demo pictures (new view)

When the phone has sent pictures for the current exercise, a full-screen page above Metrics shows the picture edge to edge. The start and end frames cross-fade every second, but only while that page is showing and the screen is not dimmed. The page also shows the name and 'equipment · muscle' over a dark gradient. Adding or removing the page keeps the scroll on the page that was showing. Pictures arrive separately as messages (240 px wide JPEG, about 15 KB). They are stored on the watch as <key>-<0|1>.jpg, and at most 80 files are kept (oldest removed first). The exercise list stays text-only.

**Data from the phone:** exerciseImage messages; PlannedExercise.imageKey, imageCount, muscle, equipment.

**Data the watch sends or saves:** None.

**Settings:** New workout view.

**Capabilities:** File storage; always-on awareness.

**Code:** targets/watch/Presentation/WorkoutView.swift:369-391,413-424,475-484,1102-1172; targets/watch/Application/ExerciseDemoStore.swift; targets/watch/Domain/ExerciseDemoFiles.swift:8-47; src/services/watchExerciseImages.ts:34

### Interval formats caption (AMRAP, EMOM, Tabata, For Time)

When the phone started a workout in a format other than standard, a yellow caption under the top line shows the format and the time left on the cap ('AMRAP 7:42'). It updates every second, freezes while the phone is paused, and adds the paused time back. Rounds added on the phone are not shown.

**Data from the phone:** Plan workoutFormat, timeCapSeconds, startedAt, capEndsAt; intervalTiming {sessionId, revision, paused, pausedAt, excludedPauseMs}.

**Data the watch sends or saves:** None.

**Settings:** None.

**Capabilities:** Timeline updates.

**Code:** targets/watch/Presentation/ClassicWorkoutView.swift:343-398; targets/watch/Presentation/WorkoutView.swift:288-345,597-599; targets/watch/Application/WorkoutSessionStore.swift:627-651; targets/watch/Adapters/ContextPayloadMapper.swift:678-699

### Supersets

Exercises in the same superset run share a colour (blue, orange, violet, green, pink, teal, amber, slate, as on the phone). Their sets are interleaved in the phone's set order. The set screen shows 'Superset · partner' and an A1/A2 badge. There is no rest between partners in the same round, and the Log set label reads 'then A2'. The rest screen says 'Next in superset'. In the list, superset members are grouped with a colour bar. A run of one exercise is not treated as a superset.

**Data from the phone:** PlannedExercise.supersetRun, plan setOrder.

**Data the watch sends or saves:** None.

**Settings:** None.

**Capabilities:** None special.

**Code:** targets/watch/Domain/WorkoutModels.swift:54-58,149-171; targets/watch/Presentation/ClassicWorkoutView.swift:23-41; targets/watch/Presentation/WorkoutView.swift:33-54; targets/watch/Application/WorkoutSessionStore.swift:509-529; targets/watch/Domain/RestRule.swift:30-35

### Personal record (PR) celebration

The phone decides what counts as a PR and flags it in setTargets.prSetIds. The watch celebrates only sets logged on the wrist, each once, one at a time in workout order. Classic: a yellow 'New PR!' capsule with a trophy and the exercise name at the top of the screen for 4 s; a tap dismisses it. New view: a full-screen gold 'New PR!' with a trophy, the exercise, '85 kg × 8', and a 'Continue · 5s' button that drains; it closes itself after 5 s. A .notification haptic plays if haptics are on. While the screen is up, double tap belongs to it. Sets logged on the phone, or carried over by a resumed session, do not celebrate. An older phone that does not send prSetIds never triggers it.

**Data from the phone:** setTargets.prSetIds[].

**Data the watch sends or saves:** None.

**Settings:** The haptic follows the Haptics switch.

**Capabilities:** Haptics.

**Code:** targets/watch/Application/WorkoutSessionStore.swift:366-420; targets/watch/Presentation/ClassicWorkoutView.swift:59-104; targets/watch/Presentation/WorkoutView.swift:72-88,476-480; targets/watch/Presentation/WorkoutFinishViews.swift:1-95; targets/watch/Presentation/WatchAppDelegate.swift:21-27

### Finishing the workout

Finish is reachable from the classic exercise list, the classic Workout page, the new view's More, and the 'Workout complete' screen. The 'Workout complete' green Finish has no confirmation; the others ask 'Finish workout?' ('Heart rate for this session is sent to your phone.'). Finishing closes the current exercise's time window and records that a finish has started, so it can be completed after a crash. It then stops the HealthKit session and sends the buffered heart rate right away. It waits up to 20 s for HealthKit to save the workout and its last readings, sends the final batch (with Apple zones), and then sends workoutStop. A tail that arrives later is sent then, or after a relaunch within 24 h. The phone then saves and closes its live session and shows its Workout Complete screen. If the server is unreachable, the phone queues the workout for upload; if the save fails, it keeps the session open so the phone's Finish can retry. A finish started on the phone sends workoutStop to the watch, and the watch finishes the same way but sends no stop back. A stop for a session the watch is not running is only remembered, so a queued start for it cannot revive it. A second Finish while one is running is merged into it. A plan armed during the finish starts right after, with no summary.

**Data from the phone:** workoutStop {sessionId, stoppedAt?, discarded?} from the phone.

**Data the watch sends or saves:** Final heartRateBatch(es); workoutStop {type, sessionId}. Queued.

**Settings:** None.

**Capabilities:** HKWorkoutSession end / finishWorkout; background time; persistent queue.

**Code:** targets/watch/Presentation/WorkoutEditPages.swift:262-320; targets/watch/Presentation/ClassicWorkoutView.swift:599-619; targets/watch/Presentation/WorkoutView.swift:656-675; targets/watch/Infrastructure/WatchSessionManager.swift:1162,1413-1454,1613-1623,1658-1760; targets/watch/Infrastructure/WorkoutHealthKitController.swift:71,263-360; targets/watch/Adapters/OutboundPayloads.swift:492-500; src/hooks/useWatchWorkoutBridge.ts:939-1000

### 'Update Workout?' (update the saved preset after changes)

This applies only when the workout started from a saved workout (fromPreset) and its structure changed: exercises (by entry id and name), order, superset grouping, or the number and type of sets. Weights and reps do not count. Classic: after Finish is confirmed (also from 'Workout complete'), an alert 'Update Workout?' appears with 'Save the changes you made to "name"?' and the buttons Update / Keep Original. Only those buttons close it. The answer is sent, then the workout ends. New view: Finish ends the workout at once, after first telling the phone to hold its own prompt (waiting:true). The summary then shows a card 'You changed <name>' with Update / Keep; Done without an answer counts as Keep. Only a finish started on the watch asks on the watch; a phone-started finish asks on the phone.

**Data from the phone:** Plan fromPreset.

**Data the watch sends or saves:** presetUpdateAnswer {sessionId, update: Bool, waiting: Bool}. Queued.

**Settings:** The New workout view setting changes where the question is asked.

**Capabilities:** Alerts / touch.

**Code:** targets/watch/Application/WorkoutSessionStore.swift:803-870; targets/watch/Presentation/ClassicWorkoutView.swift:423-431,521-534; targets/watch/Presentation/WorkoutFinishViews.swift:161-237; targets/watch/Infrastructure/WatchSessionManager.swift:409-415,1613-1622; targets/watch/Adapters/OutboundPayloads.swift:206-213

### Discarding the workout

Discard Workout (exercise list, classic Workout page, new view More > Discard) asks 'Discard workout?' ('This workout won't be saved.'). It ends the HealthKit session with a discard, so nothing is written to Apple Health. It sends no heart rate, shows no summary, and tells the phone to drop the session without saving. A discard made on the phone reaches the watch as workoutStop with discarded:true and is handled the same way, with nothing sent back. A finish that is already running cannot be discarded. A discard queued from an earlier arm does not clear a newer arm of the same session.

**Data from the phone:** workoutStop {discarded: true}.

**Data the watch sends or saves:** workoutDiscard {sessionId, armedAt? (ms)}. Queued.

**Settings:** None.

**Capabilities:** HKLiveWorkoutBuilder.discardWorkout.

**Code:** targets/watch/Presentation/WorkoutEditPages.swift:305-318; targets/watch/Infrastructure/WatchSessionManager.swift:1446-1452,1625-1656; targets/watch/Infrastructure/WorkoutHealthKitController.swift:387-403; targets/watch/Adapters/OutboundPayloads.swift:502-511

### Post-workout summary

After any finish (watch- or phone-started) that logged at least one set, and with no next workout queued, the Workout page shows the summary until Done or until a new workout is armed. Contents: 'Workout done'; Time (wall time since the start); Sets; Volume (sum of weight × reps as logged, in lb/kg; hidden if 0); heart rate (classic: 'Avg HR' and 'Max HR' rows in bpm; new view: 'Avg / Max HR'); Active energy (kcal/kJ; hidden if 0); the effort rating; in the new view, the 'You changed…' card; then Done. A finish with no logged sets, or a discard, shows no summary. The summary lives in memory only and is lost on relaunch. While a wrist run or phone recording is active, those take the Workout page instead.

**Data from the phone:** None.

**Data the watch sends or saves:** None (see effort rating and Update Workout).

**Settings:** The layout follows the new view setting.

**Capabilities:** None special.

**Code:** targets/watch/Application/WorkoutSessionStore.swift:797-832; targets/watch/Presentation/ClassicWorkoutView.swift:53-162; targets/watch/Presentation/WorkoutFinishViews.swift:97-246; targets/watch/Infrastructure/WatchSessionManager.swift:1744-1757

### Workout effort rating (1-10, 'How hard was that?')

Shown on the summary. Classic: 'How hard was that?' and a value card that starts at 5, with Apple's band underneath (Easy 1-3, Moderate 4-6, Hard 7-8, All Out 9-10, each in its own colour) and the hint 'Tap to change'. Tapping the card hands it the crown ('Turn the crown · tap to finish'), and a second tap gives the crown back to scrolling. Then Save. There is no Skip in classic. New view: 'How hard?', the number and band, a 10-segment coloured track (crown or drag), and Skip / Save. Saving shows '✓ Saved', and Save is disabled while a write is in flight. On watchOS 11+ the rating is written to Apple Health as a workout effort score related to the saved workout, with permission asked right before the write if it was not granted. It is also sent to the phone, which stores it on the session's exercise entries (workout_effort). If the Health write fails (for example, the workout is not saved yet), Save stays available to retry, and each retry sends the rating to the phone again. Older watchOS versions only send it to the phone.

**Data from the phone:** None.

**Data the watch sends or saves:** workoutEffort {sessionId, rating}. Queued. Health: HKQuantityType.workoutEffortScore, related with relateWorkoutEffortSample.

**Settings:** None.

**Capabilities:** HealthKit write (watchOS 11+), Digital Crown, drag.

**Code:** targets/watch/Presentation/WorkoutEffortPicker.swift:11-183; targets/watch/Presentation/EffortTrack.swift:3-34; targets/watch/Infrastructure/WorkoutEffort.swift:1-46; targets/watch/Infrastructure/WatchSessionManager.swift:1597-1611; targets/watch/Infrastructure/WorkoutHealthKitController.swift:378-386; targets/watch/Adapters/OutboundPayloads.swift:410-416

### Saving the workout to Apple Health

Each strength workout is a real HKWorkout: Traditional Strength Training, indoor, with the preset's name as the brand name shown in Fitness, and a SparkyFitnessSessionId metadata key. The phone uses that key so it does not import the workout a second time. Heart rate and active energy are written with it, and it closes Activity rings. HealthKit permission is asked at every start (share and read: workout, heart rate, active energy). If workout sharing is denied, the session still runs as a timer.

**Data from the phone:** None.

**Data the watch sends or saves:** HKWorkout + samples in Apple Health.

**Settings:** Health permissions.

**Capabilities:** HealthKit write, HKWorkoutSession, background workout mode.

**Code:** targets/watch/Infrastructure/WorkoutHealthKitController.swift:86,109-138,204-261

### Recovery after a crash, jetsam or relaunch

Every change writes a workout snapshot to UserDefaults. It holds the plan, cursor, logged sets in order, typed values, frozen logged values, phone targets and revisions, completions and un-logs, the running set timer, HR totals for the summary, the energy already reported, how far HR has been sent, per-exercise minutes, the original preset structure, a held RPE set, and whether a finish had started. On launch, the watch first lets a wrist run claim its session. Otherwise, if a finish was interrupted, it completes it: it reads the readings not yet sent back from the saved workout, then sends the duration and the stop. If no finish was interrupted, it restores the workout, reattaches the live HKWorkoutSession (or starts a new one if the system ended it), and resumes the HR query from the last instant sent, so nothing is sent twice and energy is not double-counted. A timer that ran out while the app was gone does not buzz again. The rest timer and Get ready are not restored; the next phone update brings the phone's rest back. The summary is not restored. Late tails from a timed-out finish are kept for 24 h and sent on a later launch.

**Data from the phone:** None.

**Data the watch sends or saves:** Possibly late heartRateBatch and workoutStop.

**Settings:** None.

**Capabilities:** HKHealthStore.recoverActiveWorkoutSession, persistent storage.

**Code:** targets/watch/Application/WorkoutSessionStore.swift:1356-1707; targets/watch/Infrastructure/WatchSessionManager.swift:940-1006,1008-1164; targets/watch/Infrastructure/WorkoutHealthKitController.swift:143-202,405-420

### Working offline / phone out of range

Everything the watch reports goes through one queued path: sendMessage when the phone is reachable, otherwise (or on error) transferUserInfo, which the system delivers later. That covers logged and un-logged sets, edits, rest changes, timers, heart rate batches, stop, discard, effort and preset answers. Sends made before Watch Connectivity has activated are held in memory and flushed on activation; a held RPE set waits in the snapshot instead. Each message has a clientId and/or session id plus armedAt, so the phone ignores duplicates, stale arms and sessions that have already ended. The watch remembers (in UserDefaults) the last 20 ended sessions with their end time, so a late queued start or update cannot revive them while a later re-arm still works. Only liveHeartRate is dropped when the phone is unreachable. The whole set screen keeps working without the phone, including rest, holds and HealthKit; structural edits wait until the phone answers.

**Data from the phone:** All inbound workout messages are matched on sessionId plus armedAt.

**Data the watch sends or saves:** See the individual message types.

**Settings:** None.

**Capabilities:** Watch Connectivity (sendMessage, transferUserInfo, applicationContext).

**Code:** targets/watch/Infrastructure/WatchSessionManager.swift:65-131,140-189,1394-1400; targets/watch/Adapters/OutboundPayloads.swift:20-46

### Phone settings that affect strength workouts (summary)

All of these are on the phone under Settings > Apple Watch and travel in the watch context. An absent key keeps the previous value, except exerciseDoNow. 'Double-tap to log a set' (doubleTapEnabled, default on, iOS only). 'Ask for effort (RPE) after each set' (rpeEnabled, default off). 'Set input' Keypad / Digital Crown (setInputStyle, default crown, iOS only). 'Metrics on the set screen' (setScreenMetrics, default on, classic only). 'Up Next page' (upNextPage, default off, classic only). 'Larger text on the watch' (largerText, default off). 'New workout view' (newWorkout, default off). With the new view on: 'Top line' Time / Metrics (workoutTopLine, default time); 'Countdown sound & haptic' Off / 3 s / 5 s (workoutCountdown, default 3); 'Countdown before holds' (holdCountdown, default on). From other settings: Haptics (hapticsEnabled), the rest-complete alert (restAlertsEnabled), weight unit (weightUnit; the watch defaults to kg), distance unit (distanceUnit; miles = yards for carries), energy unit (energyUnit), heart rate zone floors (heartRateZoneFloors). Pages order and hidden pages (pageOrder / hiddenPages): the Workout page always shows during a workout.

**Data from the phone:** The context keys listed above.

**Data the watch sends or saves:** None.

**Settings:** As listed.

**Capabilities:** Watch Connectivity application context.

**Code:** targets/watch/Adapters/ContextPayloadMapper.swift:29-117; targets/watch/Domain/CheckInModels.swift:615-662; src/stores/appPreferencesStore.ts:180-194; src/screens/WatchSettingsScreen.tsx:160-400; src/hooks/useWatchCheckInBridge.ts:901-939

## 3. Runs, walks, Jump Rope and routes

_Runs, walks and other cardio on the Apple Watch: wrist-only outdoor and indoor runs and walks, Jump Rope, plans, alerts, auto-pause, laps, cues, routes, the remote for a phone recording, live heart rate, the summary, effort rating, what gets saved, and Live Activity. All paths are relative to /home/user/sf-main/SparkyFitnessMobile. Checked against the code. Corrections to the first inventory: (1) The evidence line numbers for Haptics.swift (101 lines) and WatchRunCues.swift (237 lines) were wrong and are fixed. (2) A run rescued after a crash only needs 60 s of active time; it does not need any distance. (3) The live update to the phone goes out every 3 s, not every 2-3 s. (4) Test voice speaks even when Voice cues is off. (5) Added: the last step's 'Ten seconds to go.', the Finish wait of up to 10 s, a Finish tapped while the permission prompts are still up, the Now Playing page, the Classic/New workout view switch, splits counting indoors on the estimate, and the phone opening the watch app when a phone recording starts._

### Where cardio lives and the Cardio entry row

Cardio lives on the Workout page. That page is drawn by either ClassicWorkoutView (the default) or the new WorkoutView, depending on the phone's 'new workout view' switch; both have the same Cardio menu. When the page is idle and nothing else holds the watch's single workout session, a green-tinted row 'Cardio' (figure.run icon) sits above the saved and scheduled strength presets. Tapping it gives a tap haptic and opens the Cardio sheet. The row is hidden while any of these is going: a strength workout, a phone GPS recording (its view or its HR session), another wrist run (including its summary or treadmill question), an indoor workout still held for Health, or a crashed run not yet recovered. While a wrist run or phone recording is active, the Workout page replaces the picker with the run screen (strength workout first, then wrist run, then phone recording).

**Data from the phone:** Context: runPlans, routes from the on-watch library, distanceUnit, runPaceMinSecondsPerKm/runPaceMaxSecondsPerKm, runHeartRateMinBpm/runHeartRateMaxBpm, newWorkout (view choice).

**Data the watch sends or saves:** None.

**Settings:** Phone 'new workout view' switch (newWorkout, default off = classic). Larger-text setting affects sizing only.

**Capabilities:** Touch; single HKWorkoutSession rule.

**Code:** targets/watch/Presentation/WorkoutView.swift:78-104 (priority order), :109-165 (Cardio row, run.canStart gate, sheet); targets/watch/Presentation/ClassicWorkoutView.swift:165-220; targets/watch/Presentation/ContentView.swift:183-192; targets/watch/Domain/CheckInModels.swift:524,659; targets/watch/Application/WatchRunStore.swift:92-103 (canStart)

### Cardio start sheet (CardioChoicesView)

Sheet titled 'Cardio', scrolled with the crown. Contents in order: (1) an 'Alerts' row (bell.badge icon, grey when off, orange when on) with the subtitle 'Off' or a summary such as 'Pace 5:00–5:30 /km · Heart rate 130–150'; it opens RunAlertsView. (2) 'Outdoor' section with square tiles Run and Walk. (3) 'Indoor' section with Run, Walk and Jump Rope in a 2-column grid, so the last cell is empty. (4) 'Routes': routes stored on the watch, sorted by name (cyan path icon, name, length '5.20 km'/'3.23 mi'); shown only if any. (5) 'Follow a plan': plans from the phone (blue calendar icon for a training-program workout, orange timer icon for interval presets); shown only if any. Tapping a tile starts the run at once (tap haptic, sheet closes). A route opens RouteKindView: the route length plus the buttons 'Outdoor run' and 'Outdoor walk'. A plan opens PlanPlaceView with 'Outdoor run' and 'Indoor run' (or walk, if the plan's activity is 'walk'). A plan with distance steps offers Outdoor only, with the note 'Distance steps need GPS, so this plan is outdoor only.'. Alerts reset to off every time the sheet opens. If no phone has synced yet, the Plans and Routes sections are simply missing.

**Data from the phone:** runPlans, on-watch route library, distanceUnit ('miles' means mi), last pace/HR ranges as starting values.

**Data the watch sends or saves:** Nothing at selection; starting calls WatchRunStore.start(kind, place, plan, alerts[, route]).

**Settings:** Alerts are per run and off by default.

**Capabilities:** Touch, Digital Crown scrolling.

**Code:** targets/watch/Presentation/WorkoutView.swift:3288-3486 (sheet, alerts row :3373-3411, tiles :3313-3336 and :3424-3447, routes :3337-3349, plans :3350-3361, planRow :3470-3486), :3496-3528 (RouteKindView), :3532-3567 (PlanPlaceView); targets/watch/Application/WatchRouteLibraryStore.swift:21 (sorted by name); targets/watch/Domain/WatchRunModels.swift:254-257 (plan kind, hasDistanceSteps)

### Pre-run Alerts setup (RunAlertsView)

Screen titled 'Alerts' with two toggles. 'Pace alert' on shows two steppers, 'Fastest' and 'Slowest', in the phone's unit (e.g. '5:00 /km' or '/mi'). They step 5 s per unit and move with the crown or +/-. They start at the phone's last-used range, else 5:00–5:30 /km. Limits: 2:00/km to 20:00/km, and the two edges stay at least 10 s/km apart. 'Heart rate alert' on shows 'Lowest' and 'Highest' in bpm, step 5, starting at the phone's last range or 130–150; limits 40–220, at least 10 bpm apart. Settings last for this run only (like Apple's Workout app). Jump Rope drops the pace alert at start (no distance) but keeps the HR alert.

**Data from the phone:** runPaceMinSecondsPerKm/runPaceMaxSecondsPerKm, runHeartRateMinBpm/runHeartRateMaxBpm from context (invalid ranges ignored, previous kept).

**Data the watch sends or saves:** Become WatchRunSettings.paceBand/heartRateBand; reported as paceAlert/heartRateAlert in runLive.

**Settings:** Opt-in per run; off every time.

**Capabilities:** Digital Crown (Stepper), touch.

**Code:** targets/watch/Presentation/WorkoutView.swift:3569-3680; targets/watch/Domain/WatchPaceAlert.swift:7-25; targets/watch/Domain/WatchHeartRateAlert.swift:7-24; targets/watch/Application/WatchRunStore.swift:216-231; targets/watch/Adapters/ContextPayloadMapper.swift:101-108

### Starting a wrist run (start flow and failure edge cases)

Starting resets every counter and goes straight to the live screen. It then asks Health for permission (share: workouts, walking/running distance, active energy, heart rate, steps, and workout route if not yet granted; read the same). If the share is denied, the run still records as a timer. If Health is unavailable or a session is already live, the start fails silently and the watch returns to idle. If Finish is tapped while the permission prompts are still up, nothing was recorded, nothing is saved, and it goes back to idle. Without a plan, voice cues say '<Outdoor run> started.'; with a plan, the first step's cue replaces it. Plans with distance steps are dropped if started indoors. Routes are ignored indoors. Auto-pause, voice cues and check-in minutes come from the phone's saved preferences (auto-pause default on, voice cues default off).

**Data from the phone:** Context runAutoPause (default true), runVoiceCues (default false), runCheckInMinutes, indoorDistanceScale.

**Data the watch sends or saves:** First runLive (forced), snapshot file written.

**Settings:** Phone Record-screen preferences.

**Capabilities:** HealthKit authorization, HKWorkoutSession.

**Code:** targets/watch/Application/WatchRunStore.swift:193-273 (defaultSettings, start), :904-918 (finish before session -> idle); targets/watch/Infrastructure/WatchRunHealthKitController.swift:251-273 (permissions), :288-366 (start)

### Outdoor GPS walk/run on the wrist alone

Records a walk or run with the watch's own GPS; no phone needed. The live screen shows: a header with glyph and title ('Outdoor run'/'Outdoor walk'); three GPS bars (green good, accuracy <=10 m; yellow fair, <=25 m; red weak; grey 'No GPS signal' when there has been no fix for 15 s, re-checked every 5 s); a big active-time clock (pauses excluded, h:mm:ss after 1 h); distance with 2 decimals in km or mi; average pace for the whole run ('--:--' until 50 m are covered or if pace >= 60:00); heart rate (red heart, '--' grey until the first reading). Location permission (When In Use) is asked the first time. If it is denied, the run records with no route and Health's own distance estimate. Only fixes with accuracy 0–50 m go into the route, and only while not paused. Each resume starts a new route segment, so the gap is never counted as distance. GPS keeps running while paused so auto-pause can detect movement. Splits, milestones, check-ins and route following apply.

**Data from the phone:** distanceUnit; settings from context or runStart.

**Data the watch sends or saves:** runLive (every 3 s while the phone is reachable); runFinished at the end with route rows [t ms, lat, lon, alt (-9999 if none), hacc, seg] thinned to 1500 and HR rows [t ms, bpm] thinned to 600.

**Settings:** Auto-pause (default on), Voice cues (default off), check-in minutes.

**Capabilities:** HKWorkoutSession + HKLiveWorkoutBuilder (outdoor), CLLocationManager best accuracy with activityType .fitness, HKWorkoutRouteBuilder, heart rate sensor, workout-processing background mode.

**Code:** targets/watch/Domain/WatchRunModels.swift:28-55 (GpsSignal), :113-128 (pace >=50 m, text); targets/watch/Presentation/CardioLiveLayout.swift:109-113 (bars refresh 5 s); targets/watch/Infrastructure/WatchRunHealthKitController.swift:379-390 (resume -> new segment), :1584-1651 (GPS, filter <=50 m, route rows); targets/watch/Presentation/WatchRunView.swift:46-115; targets/watch/expo-target.config.js:57-68

### Indoor / treadmill walk and run (motion distance, learned correction)

Indoor Run or Walk has no GPS, no bars and no route; distance is the watch's motion estimate. When the pedometer can give distance, motion permission is granted, and an earlier run did not find that Health ignores self-written distance, the app turns off HealthKit's own distance collection. It then uses CMPedometer distance (with pauses weighed out using the pause/resume events) and writes one final distance sample itself. If the pedometer reports an error, it falls back to HealthKit distance and keeps what was measured so far as a floor. If a self-written distance did not show up in Health, a flag (indoorSelfWrittenDistanceFailed) makes later runs use HealthKit's collection. The live and final indoor distance is multiplied by a per-kind correction factor (walk or run) learned on the phone, clamped to 0.5–2. Pace, splits and pace alerts work on the scaled estimate. Milestones, and the distance and pace in check-ins, are outdoor only.

**Data from the phone:** Context indoorDistanceScale {walk, run}.

**Data the watch sends or saves:** runFinished distanceScale, distanceSeries [active s, m] every ~10 s (thinned to 300), lapDistances, steps.

**Settings:** Correction is learned on the phone (Settings > Workout > Treadmill & stride shows and resets it).

**Capabilities:** HealthKit (indoor), CMPedometer (Motion & Fitness), heart rate sensor.

**Code:** targets/watch/Domain/WatchRunModels.swift:138-155; targets/watch/Application/WatchRunStore.swift:119-129, 1046-1050, 781-790; targets/watch/Infrastructure/WatchRunHealthKitController.swift:152, 276-283, 313-315, 1370-1418, 1537-1545, 1745-1752; SparkyFitnessMobile/agent-docs/exercise-workouts-and-fasting.md

### Treadmill distance question at the end of an indoor walk/run

When an indoor walk or run is finished (not discarded, not Jump Rope), the watch shows 'Treadmill distance?' with: 'The watch measured X km. Enter what the machine showed, and the next run (walk) will read closer.' Buttons: 'Enter distance' (number icon; opens a numeric keypad in km/mi with decimals, prefilled with the measured value rounded to 0.01) and 'Keep watch distance' (both give a tap haptic). Zero or negative input counts as 'keep'. While waiting, the Health workout is held: session paused, all collection off. The answer becomes the run's distance, with laps and pace series rescaled; the watch's own figure goes along as estimatedDistanceMeters. The finish cue is then spoken with the final figure. The held workout's write is retried (3 attempts, again after 30 s, and at next launch). While it is held, no new run can start, unless the write has failed. If the app is killed while waiting, the question is asked again on relaunch; if it was already answered, the settled run is sent.

**Data from the phone:** distanceUnit.

**Data the watch sends or saves:** runFinished.distanceMeters = answer, estimatedDistanceMeters = watch figure, appleZones once Health answers (10 s timeout). Health gets the final distance sample.

**Settings:** None; always asked for indoor walk/run.

**Capabilities:** Touch keypad; held HKWorkoutSession.

**Code:** targets/watch/Presentation/WatchRunView.swift:32-33, 320-376; targets/watch/Application/WatchRunStore.swift:930-940, 987-1044; targets/watch/Infrastructure/WatchRunHealthKitController.swift:488-499, 583-660, 805-813, 909

### Jump Rope

Indoor-only tile 'Jump Rope' (figure.jumprope); title 'Jump Rope'. Live tiles: active energy (in the user's kcal/kJ unit, only once above 0) and heart rate. There is no distance or pace, no Lap button, no splits, and no treadmill question. The pace alert is forced off and cannot be turned on from the watch sheet or the phone; the HR alert works. Indoor auto-pause works from the pedometer (rope counts as steps), pausing after 8 s with no steps. Finish cue: 'Jump Rope saved. N minutes, N seconds.'. Saved to Health as a Jump Rope workout. The diary entry has no distance, laps or pace series.

**Data from the phone:** Same context as other runs.

**Data the watch sends or saves:** runFinished kind 'jumpRope'.

**Settings:** HR alert, auto-pause, voice cues.

**Capabilities:** HealthKit (.jumpRope), CMPedometer, heart rate sensor.

**Code:** targets/watch/Domain/WatchRunModels.swift:59-101; targets/watch/Presentation/WatchRunView.swift:96-104, 122-133; targets/watch/Application/WatchRunStore.swift:224-231, 561-565, 621, 935-960; targets/watch/Domain/WatchIndoorAutoPause.swift:15-23; targets/watch/Infrastructure/WatchRunCues.swift:130-132; src/services/watchRunSave.ts:88-92

### Live cardio screen layout and controls

Shared by wrist runs and phone recordings. Header: activity glyph plus title. While paused, the title becomes orange 'Paused' or 'Auto-paused' and the glyph turns orange. Outdoors the GPS bars show. Space is left for the system clock. Below: a big clock (white while running, grey while paused, ticking every second), an optional banner (cyan route-cue strip and/or orange plan-step strip), a row of value tiles, and a row of squircle buttons: Lap (flag; disabled while paused; accessibility label 'Lap, N so far'), Pause/Resume (prominent white), Finish (red stop), and a gear (wrist runs only) that opens the run's settings. Fits a 41 mm screen; scrolls only at larger text sizes. Finish has no confirmation and saves; discarding is only possible from the phone. After Finish the live screen stays (frozen) until Health hands back the saved workout, at most 10 s, then the summary appears.

**Data from the phone:** -

**Data the watch sends or saves:** Buttons call lap/pause/resume/finish.

**Settings:** Watch text size.

**Capabilities:** Touch.

**Code:** targets/watch/Presentation/CardioLiveLayout.swift:25-145, 147-212; targets/watch/Presentation/WatchRunView.swift:39-163; targets/watch/Infrastructure/WatchRunHealthKitController.swift:397, 501-547

### In-run settings sheet (gear)

A sheet titled with the run's title, containing: 'Auto-pause' toggle; 'Voice cues' toggle; 'Pace alert' (a toggle whose subtitle is the range '5:00–5:30 /km', or 'Each step has its own' for a plan with per-step ranges; if there is no range anywhere it is plain text 'Set a pace range on your iPhone'); 'Heart rate alert' (same pattern, e.g. '130–150 bpm' or 'Set a heart rate range on your iPhone'); and a 'Test voice' button that always speaks 'This is how your voice cues sound.', even with cues off, so a silent speaker can be told apart. Voice cues on says 'Voice cues on.'; off stops speech at once. Auto-pause off while auto-paused resumes the run. Turning a pace/HR alert on uses the run's range, else the phone's last range, else the default (if the plan has per-step ranges, those are used). Turning it off also silences a plan's per-step ranges.

**Data from the phone:** runPaceBand/runHeartRateBand from context.

**Data the watch sends or saves:** Forced runLive with autoPause, voiceCues, paceAlert, heartRateAlert; snapshot saved.

**Settings:** Per-run switches.

**Capabilities:** Touch, speech.

**Code:** targets/watch/Presentation/WatchRunView.swift:165-253; targets/watch/Application/WatchRunStore.swift:526-594

### Auto-pause outdoors (GPS speed)

While auto-pause is on, the run pauses itself when you stop and resumes when you move. Walk: pauses below 0.4 m/s for 10 s, resumes above 0.9 m/s for 3 s. Run: pauses below 0.6 m/s for 8 s, resumes above 1.5 m/s for 3 s. Fixes with no speed or accuracy worse than 30 m are ignored. On auto-pause: header 'Auto-paused', 'stop' haptic, voice 'Auto-paused.'. On auto-resume: 'start' haptic, voice 'Resumed.'. A manual pause is never auto-resumed. The pause is not backdated. Changing settings resets the detector.

**Data from the phone:** runAutoPause (context, default true) or autoPause in runStart.

**Data the watch sends or saves:** Forced runLive status 'paused', autoPaused true.

**Settings:** Auto-pause switch: phone preference, start request, gear sheet, or remote autoPauseOn/Off. Default on.

**Capabilities:** GPS speed, haptics, speech.

**Code:** targets/watch/Domain/WatchAutoPause.swift:23-84; targets/watch/Infrastructure/WatchRunHealthKitController.swift:1653-1670, 207-213; targets/watch/Application/WatchRunStore.swift:863-884; targets/watch/Presentation/Haptics.swift:44-51

### Auto-pause indoors (pedometer steps)

Indoors (treadmill and jump rope), auto-pause uses the step counter. No new step for 10 s (walk) or 8 s (run, jump rope) pauses the run; 5 steps after an auto-pause resume it. Checked once a second and on each pedometer update, and only after the pedometer has reported at least once. Denied or restricted motion permission, or no step counter, leaves only manual pause. A pedometer error switches it off.

**Data from the phone:** Same autoPause setting.

**Data the watch sends or saves:** Same as outdoor.

**Settings:** Auto-pause switch.

**Capabilities:** CMPedometer (Motion & Fitness permission), 1 s timer.

**Code:** targets/watch/Domain/WatchIndoorAutoPause.swift:1-66; targets/watch/Infrastructure/WatchRunHealthKitController.swift:1370-1408, 1559-1574

### Manual pause / resume

Pause pauses the Health session and stops route collection. The header shows orange 'Paused', voice says 'Paused.' (interrupting). Resume says 'Resumed.', starts a new route segment and resets the 30 s recent-pace window. Both can also come from the phone live view or the phone's Live Activity button.

**Data from the phone:** runControl action pause/resume.

**Data the watch sends or saves:** Forced runLive.

**Settings:** -

**Capabilities:** HKWorkoutSession pause/resume.

**Code:** targets/watch/Application/WatchRunStore.swift:496-513; targets/watch/Infrastructure/WatchRunHealthKitController.swift:370-390

### Laps

The Lap (flag) button marks a lap at that moment (only while running; not for Jump Rope). A second press within 3 s is ignored. Confirms with the 'step' haptic (notification type). Each new plan step after the first also forces a lap mark, regardless of the 3 s rule. Lap count is shown in the accessibility label. On the phone, outdoor laps cut the saved route at the marks; indoors the phone builds lap windows from lapDistances; with no marks it uses per-km/mile splits.

**Data from the phone:** runControl action 'lap'.

**Data the watch sends or saves:** runLive lapCount; runFinished laps (epoch ms) and lapDistances (cumulative m).

**Settings:** -

**Capabilities:** Haptics.

**Code:** targets/watch/Application/WatchRunStore.swift:648-656, 754-757; targets/watch/Infrastructure/WatchRunHealthKitController.swift:215-227; src/services/watchRunSave.ts:132-157

### Splits (every whole km or mile)

Each time the distance passes a whole km or mile (phone's unit), the watch gives the step haptic. With voice cues on it says e.g. 'Kilometer 3. 5 minutes, 24 seconds.' ('Mile 3. ...'); the time is that split, averaged if several were passed at once, and only the latest is spoken. Works indoors on the scaled estimate too. Splits passed while voice cues were off or while the app was gone are not spoken late.

**Data from the phone:** distanceUnit.

**Data the watch sends or saves:** -

**Settings:** Voice cues for speech; the haptic always plays (subject to the phone's haptics switch).

**Capabilities:** Haptics, speech.

**Code:** targets/watch/Application/WatchRunStore.swift:844-861, 417-423, 538-539; targets/watch/Infrastructure/WatchRunCues.swift:225-236

### Pace alert (live judging)

With a pace range (the run's, or a plan step's own, which wins for that step), the watch judges pace over the last 30 s of active time. It needs at least 10 s and 20 m of data, so pauses do not count. Being outside the range by more than 3% for 8 s triggers an alert. It repeats at most every 30 s while still outside. Crossing to the other side, or a new plan step, restarts the wait. Too fast: 'directionDown' haptic plus 'Too fast. Ease off.'. Too slow: 'directionUp' haptic plus 'Too slow. Pick it up.'. Speech only with voice cues; the haptic always. Also works indoors on the scaled estimate. Not for Jump Rope.

**Data from the phone:** paceMin/paceMax (runStart), per-step paceMin/paceMax, runPace* context.

**Data the watch sends or saves:** runLive paceAlert.

**Settings:** Pre-run Alerts, gear sheet, remote paceAlertOn/Off.

**Capabilities:** Haptics, speech.

**Code:** targets/watch/Domain/WatchPaceAlert.swift:27-99; targets/watch/Application/WatchRunStore.swift:620-646, 675-680; targets/watch/Presentation/Haptics.swift:76-78

### Heart rate alert (live judging)

With a bpm range (the run's or a plan step's), the watch alerts when heart rate stays more than 2 bpm outside it for 15 s, repeating at most every 45 s. Crossing sides or a new step restarts the wait. Too high: directionDown haptic plus 'Heart rate high. Ease off.'. Too low: directionUp haptic plus 'Heart rate low. Pick it up.'. Plain range, with no drift allowance.

**Data from the phone:** hrMin/hrMax (runStart), per-step hrMin/hrMax (the phone puts the user's Zone 2 range on Zone 2 program workouts), runHeartRate* context.

**Data the watch sends or saves:** runLive heartRateAlert.

**Settings:** Pre-run Alerts, gear sheet, remote heartRateAlertOn/Off.

**Capabilities:** Heart rate sensor, haptics, speech.

**Code:** targets/watch/Domain/WatchHeartRateAlert.swift:1-72; targets/watch/Application/WatchRunStore.swift:596-618, 682-686; targets/watch/Presentation/Haptics.swift:82-84; src/utils/watchRunPlans.ts:87-121

### Voice cue engine and relay to the phone's headphones

Every spoken cue goes through one speaker. If the watch is not on Bluetooth headphones (A2DP/HFP/LE) and the phone is reachable, the cue is sent to the phone to speak, because headphones are usually paired to the phone. If the phone does not acknowledge within 2 s, or the send fails, the watch says it itself. On the watch, speech uses the playback/voicePrompt audio session, ducks other audio, and releases audio when done. Cue text is in the watch app's resolved language. Cues containing phone-written words (plan step names, program start/done sentences, route text) use the app language, and are sent with an empty language tag so the phone uses its own. Pause, resume, step and countdown cues interrupt older speech; splits and coaching queue behind.

**Data from the phone:** appLanguage (context); runCueAck {id} (live).

**Data the watch sends or saves:** runCue {type, id, text, interrupt, language} via live sendMessage.

**Settings:** Voice cues (default off; phone 'audio cues' preference, start request, gear sheet, remote voiceCuesOn/Off).

**Capabilities:** AVSpeechSynthesizer, audio session, Bluetooth audio, WatchConnectivity live messages.

**Code:** targets/watch/Infrastructure/WatchRunCues.swift:26-105; targets/watch/Infrastructure/WatchSessionManager.swift:297-322, 759-760; targets/watch/Adapters/OutboundPayloads.swift:326-339; src/hooks/useWatchRunBridge.ts:106-129; modules/watch-connectivity/ios/WatchConnectivityModule.swift:782-786

### Spoken coaching cues (full list)

With voice cues on: start '<Title> started.' (not when a plan's first step speaks); 'Paused.', 'Resumed.', 'Auto-paused.'; 'Voice cues on.'. Periodic check-in every N minutes: indoors '25 minutes done.'; outdoors '<time>. 3.2 kilometers. Average pace 5 minutes, 10 seconds per kilometer.' (mile variants). Race milestones outdoors only: '5K done. Nice work.', '10K done. Strong effort.', 'Half marathon distance. Amazing.', 'Marathon distance. Incredible.'. Timed plan steps of 30 s or more: 'Ten seconds. Next, <step>.' (on the last step, 'Ten seconds to go.') and then 'Three. Two. One.'. Plans of 5 min or more: 'Halfway there. Keep it up.'. Plans of 3 min or more: 'One minute left. Finish strong.'. Neither of those two applies to plans with distance steps. Distance steps of 300 m or more: '100 meters to go.' (or '0.1 miles to go.'). 'Plan complete.'. Finish: '<Title> saved. 3.21 kilometers in 25 minutes, 10 seconds.' (Jump Rope: time only), with the program's done sentence appended when a program workout was completed. At most one coaching cue per second; the rest are marked as said. After a relaunch, cues already passed are not repeated.

**Data from the phone:** runCheckInMinutes (context) or checkInMinutes (runStart, only sent when voice cues are on); plan startText/doneText.

**Data the watch sends or saves:** Via the runCue relay.

**Settings:** Voice cues; check-in interval from the phone (0 = off).

**Capabilities:** Speech, 1 s timer.

**Code:** targets/watch/Domain/WatchCoaching.swift:1-140; targets/watch/Application/WatchRunStore.swift:254-256, 742-842, 941-964; targets/watch/Infrastructure/WatchRunCues.swift:117-221

### Interval and training-program plans

A plan is a list of named steps (already translated by the phone). Each step is timed (seconds), or a distance step (metres, shown as m/km or as mi if set in miles), and can have its own pace and HR range. Under the clock an orange strip shows the step label, time left (m:ss) or distance left ('400 m'), and 'Next: <step> <length>'. Steps follow active time (pauses never eat into a step) and recorded distance. Each new step: step haptic, a lap mark (not on the first step), and a spoken '<label>, 1 minute.' or '<label>, 400 meters.'. The first step of a program workout is prefixed with its start sentence. After the last step the strip shows 'Plan complete' and the run continues until Finish. 'Completed' means every step ended (by time or distance). The list shows the due training-program workout first, then the built-in interval presets (e.g. 6 x 400 m). Plans with no steps, or with a missing id or name, are dropped.

**Data from the phone:** Context runPlans: [{id, name, programId?, programIndex?, activity?('walk'), startText?, doneText?, steps:[{label, seconds, meters?, unit?('mi'), paceMin?, paceMax?, hrMin?, hrMax?}]}], or plan in runStart.

**Data the watch sends or saves:** runLive stepLabel (with ' · <distance left>' for distance steps), stepRemaining (timed steps only), nextLabel; runFinished planId, programId, programIndex, planCompleted.

**Settings:** Chosen per run.

**Capabilities:** Timer, haptics, speech, GPS for distance steps.

**Code:** targets/watch/Domain/WatchRunModels.swift:204-383; targets/watch/Adapters/ContextPayloadMapper.swift:177-224; targets/watch/Application/WatchRunStore.swift:742-772, 688-721; targets/watch/Presentation/WatchRunView.swift:61-67; targets/watch/Adapters/OutboundPayloads.swift:443-464; src/utils/watchRunPlans.ts:87-160

### Phone starts a run on the watch (runStart)

From the phone's Record screen (walk/run, 'Record with: Watch') or a route's 'Start on watch', the phone sends a start request and opens the watch app (HKHealthStore.startWatchApp with the matching configuration). The watch starts the run with the phone's switches: auto-pause, voice cues, check-in minutes, pace and HR ranges, plan, and the route (outdoors only). It ignores duplicates by requestId (remembers the last 20), requests older than 120 s, and requests while busy. The phone shows a pending 'Starting on your watch…' state until the first runLive carrying that requestId, for up to 90 s. An unreadable plan or route just means none.

**Data from the phone:** runStart {requestId, kind walk|run, place indoor|outdoor, requestedAt (ms), autoPause, voiceCues, checkInMinutes?, paceMin?, paceMax?, hrMin?, hrMax?, plan?, route?}, sent both queued (transferUserInfo) and live.

**Data the watch sends or saves:** runLive carries requestId.

**Settings:** Phone: Record with Phone/Watch.

**Capabilities:** WatchConnectivity, HKHealthStore.startWatchApp.

**Code:** src/services/watchRunControl.ts:18-77; modules/watch-connectivity/ios/WatchConnectivityModule.swift:285-300, 737-749; targets/watch/Adapters/ContextPayloadMapper.swift:226-243, 288-305; targets/watch/Application/WatchRunStore.swift:150-165; src/stores/watchRunLiveStore.ts:42

### Phone live view and remote control of a wrist run (runLive / runControl)

While a wrist run is running or paused and the phone is reachable, the watch sends live figures every 3 s, and immediately on pause, resume, lap, auto-pause, a setting change, or the end (status 'ended'). These are never queued: if the phone is not reachable they are dropped. The phone's WatchRunLive screen shows them and can Pause/Resume, Lap, Finish, Discard, and toggle Auto-pause, Voice cues, Pace alert and Heart rate alert. The watch only obeys controls for the current runId and ignores repeated controlIds (remembers 40). Discard ends the run, writes nothing to Health and sends nothing. The phone drops the live view after 20 s of silence.

**Data from the phone:** runControl {runId, action: pause|resume|lap|finish|discard|autoPauseOn|autoPauseOff|voiceCuesOn|voiceCuesOff|paceAlertOn|paceAlertOff|heartRateAlertOn|heartRateAlertOff, controlId}, queued and live.

**Data the watch sends or saves:** runLive {type, runId, kind, place, status running|paused|ended, autoPaused, autoPause, voiceCues, paceAlert, heartRateAlert, elapsed, distanceMeters, energyKcal, lapCount, sentAt, heartRate?, stepLabel?, stepRemaining?, nextLabel?, requestId?}.

**Settings:** -

**Capabilities:** WatchConnectivity sendMessage (only while reachable).

**Code:** targets/watch/Application/WatchRunStore.swift:167-191, 658-721; targets/watch/Infrastructure/WatchSessionManager.swift:283-295, 761-766; targets/watch/Adapters/OutboundPayloads.swift:360-406; modules/watch-connectivity/ios/WatchConnectivityModule.swift:770-780; src/stores/watchRunLiveStore.ts:10

### Live Activity / Smart Stack interplay

The watch app has no Smart Stack widget or complication of its own for runs (targets/watch-widget has nothing for runs). The phone shows a run Live Activity on the Lock Screen and Dynamic Island, either for its own GPS recording or for a watch run that is reporting (a phone recording wins). Its small banner (title, clock, 'distance · pace', no buttons) is what watchOS 11+ mirrors into the watch's Smart Stack. The Live Activity's toggle and lap buttons send runControl pause/resume/lap to the watch for a watch run. It ends when the watch run goes quiet for 20 s.

**Data from the phone:** runLive (phone side).

**Data the watch sends or saves:** runControl from the Live Activity buttons.

**Settings:** -

**Capabilities:** iOS ActivityKit; watchOS Smart Stack mirroring.

**Code:** src/services/RunLiveActivityLayout.tsx:227-243; src/services/runLiveActivity.ios.ts:405-427; SparkyFitnessMobile/AGENTS.md:366

### Following a saved route: turn prompts and off-route

An outdoor run or walk can follow a route, either from the phone's start request or from the watch's library. Under the clock a cyan strip shows the next turn's arrow and instruction ('Start', 'Continue straight', 'Bear left/right', 'Turn left/right', 'Sharp left/right', 'Make a U-turn', 'Finish', or the route's own text) and the distance to it. It shows 'Waiting for GPS' (location.slash icon) until a usable fix. When off route it shows red 'Off route' with a warning icon. Rules: fixes worse than 50 m are ignored. Off route means more than 40 m from the line for 6 s; back on is immediate. A turn is announced 50 m before it: routeCue haptic plus 'In 50 m, turn left' with voice cues (distance rounded to 10 m). Turns passed during a GPS gap are not announced late. Arrival is within 25 m of the end: success haptic plus 'You have reached the end of the route.'. Off route: failure haptic plus 'You are off the route.'. Back on: success haptic plus 'Back on route.'. While paused the strip and map update but nothing buzzes or speaks; a turn reached while paused is said on resume if it is still ahead. Loops are tracked on the right lap by searching 100 m behind and 500 m ahead of progress. A route with no usable line counts as none. Progress is kept in the snapshot.

**Data from the phone:** route {id, name, points: flat [lat,lon,...] in millionths of a degree (at least 2 points), cues:[{index, kind: depart|straight|slight_left|left|sharp_left|slight_right|right|sharp_right|uturn|arrive, text?}]}.

**Data the watch sends or saves:** Nothing extra.

**Settings:** Voice cues for speech.

**Capabilities:** GPS, haptics, speech.

**Code:** targets/watch/Domain/WatchRoute.swift:40-54, 147-230; targets/watch/Domain/WatchRouteCueText.swift:1-46; targets/watch/Presentation/WatchRouteView.swift:7-55; targets/watch/Application/WatchRunStore.swift:275-358; targets/watch/Adapters/ContextPayloadMapper.swift:245-269; targets/watch/Presentation/Haptics.swift:60-72

### Route map pages

With a route, the live run gets two more vertical pages (crown or swipe up). (1) A close map around the wearer, heading-up: route ahead in bold cyan, covered part grey, start/end markers, next-turn marker, 'you are here' dot, a footer with 'X km left' and the next instruction with distance (or 'Waiting for GPS'), and a red 'Off route' capsule. (2) An overview of the whole route, north-up. The close map's camera ranges from 450 m up to 1000 m to keep the next turn in view, looks 40 m ahead, and only moves after an 8 m shift, a 10° turn or a 50 m zoom change. Maps are static (no pan or zoom) and are drawn only while their page is showing and the screen is not dimmed. Apple Maps tiles; with no signal the tiles are blank but the line and position still draw.

**Data from the phone:** Route; own GPS fixes.

**Data the watch sends or saves:** -

**Settings:** -

**Capabilities:** MapKit, GPS, Digital Crown vertical paging, always-on dimming (isLuminanceReduced).

**Code:** targets/watch/Presentation/WatchRunView.swift:19-31; targets/watch/Presentation/WatchRouteView.swift:57-160; targets/watch/Domain/WatchRouteCamera.swift:15-20, 96-98, 124

### Route library stored on the watch

On the phone, RouteDetailScreen (iOS, paired watch) has 'Send to watch' and 'Remove from watch'. The watch keeps up to 10 routes in a file (watch-route-library.json), listed by name in the Cardio sheet and startable as an Outdoor run or walk without the phone. A full library turns a new route away rather than evicting one. An older or equal revision is ignored. If the file cannot be written, the route is rejected with reason 'storage'. A removal for the route currently being followed waits until that run ends. After every change, and when the session activates, the watch reports what it holds.

**Data from the phone:** routeSync {route, updatedAt (epoch ms)} and routeRemove {routeId}, both queued only.

**Data the watch sends or saves:** routeLibrary {type, routes:[{id, updatedAt}], rejected:[{id, reason 'full'|'storage'}], capacity, sentAt} (queued).

**Settings:** Phone buttons.

**Capabilities:** Local file storage, WatchConnectivity transferUserInfo.

**Code:** targets/watch/Application/WatchRouteLibraryStore.swift:1-72; targets/watch/Domain/WatchRouteLibrary.swift:9-112; targets/watch/Infrastructure/WatchSessionManager.swift:751-758, 349-352, 1786; targets/watch/Adapters/OutboundPayloads.swift:341-358; modules/watch-connectivity/ios/WatchConnectivityModule.swift:755-768; SparkyFitnessMobile/AGENTS.md:405

### Remote for a phone GPS recording

When the phone records a walk, run or ride (outdoor, or indoor/treadmill), the phone opens the watch app, and the watch jumps to the Workout page once per recording; swiping away is respected. The screen shows: title 'Walk'/'Run'/'Ride' (bicycle glyph for a ride), 'Paused' while paused, a clock ticking on the watch from startedAt/pausedMs, distance (2 decimals km/mi), pace from the phone ('--:--' if unknown, min per unit even for a ride), wrist heart rate, and, if the phone follows an interval plan, a yellow strip with the step, a countdown ticking on the watch (frozen while paused) and 'Next: …'. There is a step haptic when the step index changes. Lap (only while recording), Pause/Resume and Finish are requests; the screen changes only when the phone answers. There is no gear and no voice cues on the watch. Finished state: '<Run> finished', frozen time, distance and pace, and 'Save it on your iPhone' (iphone icon). When the phone saves or discards, the screen closes. Messages arriving out of order or late for ended sessions are ignored (by sentAt; the last 10 ended ids are remembered).

**Data from the phone:** recordingState {sessionId, activity walk|run|ride, indoor, status recording|paused|finished|ended, startedAt, pausedMs, pausedAt?, distanceMeters, paceSeconds?, distanceUnit, lapCount, sentAt, intervalIndex?, intervalLabel?, intervalRemaining?, intervalNext?, discarded?}, queued plus live.

**Data the watch sends or saves:** recordingControl {type, sessionId, action pause|resume|finish|lap, at (ms)} (queued).

**Settings:** -

**Capabilities:** WatchConnectivity; no watch GPS.

**Code:** targets/watch/Application/RecordingStore.swift:56-102, 188-191; targets/watch/Presentation/RecordingView.swift:1-115; targets/watch/Domain/RecordingModels.swift:1-119; targets/watch/Adapters/OutboundPayloads.swift:292-304; targets/watch/Presentation/ContentView.swift:125-130; modules/watch-connectivity/ios/WatchConnectivityModule.swift:718-731

### Live heart rate during a phone recording

While a phone recording is 'recording', the watch runs its own Health workout session (walking, running or cycling; indoor or outdoor) to keep the heart-rate sensor at workout rate, pausing and resuming with the phone. It shows the newest bpm on the wrist (cleared after 15 s without readings, or whenever not recording). It sends a live reading to the phone at most every 3 s (only if under 5 s old and the phone is reachable), and sends all readings in queued batches every 30 s and at the end. On finish, the Health workout is held until the phone says saved (then written to Health, stamped SparkyFitnessSessionId so the phone's import skips it) or discarded (nothing written). A new recording settles any earlier held one as saved. After a save, Apple's heart-rate zone totals (watchOS 27) are sent. This is skipped, and the recording runs without HR, while a strength workout, a wrist run, or a held indoor run owns the session. The phone uses the live reading for its own HR alert.

**Data from the phone:** recordingState status changes.

**Data the watch sends or saves:** liveHeartRate {type, sessionId, exerciseEntryId: '', bpm, at} (live); recordingHeartRate {type, sessionId, clientId, samples:[{t, bpm}], appleZones?} (queued).

**Settings:** -

**Capabilities:** HKWorkoutSession/HKLiveWorkoutBuilder, heart rate sensor, workout-processing background mode.

**Code:** targets/watch/Application/RecordingStore.swift:104-186; targets/watch/Infrastructure/RecordingHealthKitController.swift:1-160; targets/watch/Infrastructure/WatchSessionManager.swift:190-281; targets/watch/Adapters/OutboundPayloads.swift:306-324

### Run summary on the watch

After Finish (and after the treadmill answer indoors): a green '<Outdoor run> saved' with a check icon. Rows: Time; Distance and Pace (not for Jump Rope); 'Active' energy in kcal/kJ if above 0. Then the effort picker, the note 'Sent to your iPhone. It shows up in SparkyFitness once the phone can reach the server.', and a 'Done' button (tap haptic) that returns to idle and clears the route, plan and lap count. Discard shows no summary. The same summary appears for a run rescued after a crash or a Health session failure.

**Data from the phone:** distanceUnit, energy unit.

**Data the watch sends or saves:** -

**Settings:** -

**Capabilities:** Touch, crown scroll.

**Code:** targets/watch/Presentation/WatchRunView.swift:255-317; targets/watch/Application/WatchRunStore.swift:892-902, 975-982

### Effort rating after a run

A 'How hard was that?' card on the summary. The value is 1–10, starting at 5, with Apple's band word in colour (Easy 1–3, Moderate 4–6, Hard 7–8, All Out 9–10). Hint 'Tap to change'. Tapping the card gives it the Digital Crown ('Turn the crown · tap to finish'); until then the crown scrolls the page. 'Save' (tap haptic) shows 'Saved'. On watchOS 11+ it is written to Apple Health as a workout effort score related to the saved workout, asking for write permission right before writing. A rating made before Health returned the workout waits for it. A run rescued without a Health workout gets no Health rating. The rating is always sent to the phone, which files it on the diary entry and the program workout.

**Data from the phone:** -

**Data the watch sends or saves:** runEffort {type, clientId, rating} (queued).

**Settings:** Crown detent haptics follow the phone's haptics switch.

**Capabilities:** Digital Crown, HealthKit workout effort (watchOS 11+).

**Code:** targets/watch/Presentation/WorkoutEffortPicker.swift:1-160; targets/watch/Presentation/EffortTrack.swift:4-21; targets/watch/Infrastructure/WorkoutEffort.swift:1-46; targets/watch/Application/WatchRunStore.swift:1083-1097; targets/watch/Infrastructure/WatchRunHealthKitController.swift:405-432; targets/watch/Adapters/OutboundPayloads.swift:418-426; src/hooks/useWatchRunBridge.ts:158-176

### What is saved: Apple Health

Finish writes a real HKWorkout (Walking, Running or Jump Rope; indoor or outdoor) with distance, active energy, heart rate and steps; outdoors the GPS route is attached through the route builder after the workout is saved. Metadata SparkyFitnessSessionId = run clientId, so the phone's Health import skips it. An indoor walk/run waits for the treadmill answer and writes the final distance itself (a top-up sample if Health collected the distance). The effort score is related afterwards. Discard and short failed runs write nothing.

**Data from the phone:** -

**Data the watch sends or saves:** HealthKit writes.

**Settings:** -

**Capabilities:** HealthKit write/read, HKWorkoutRouteBuilder.

**Code:** targets/watch/Infrastructure/WatchRunHealthKitController.swift:81, 243-273, 350-356, 436-560, 628-660, 861-920

### What is saved: diary entry and telemetry via the phone (runFinished)

On finish the watch sends one runFinished message, queued so it survives being out of range. If the watch session is not activated yet, it goes into an outbox file that is flushed on activation. The phone stores it in a queue (deduplicated by clientId). When online, it creates a Running, Walking or Jump Rope exercise entry (duration, date/time, distance; no distance for jump rope) with cadence and stride from steps, the GPS track with laps or splits (outdoor) or indoor laps and distance series, and telemetry (HR samples, active energy, Apple zones). It ticks off a completed program workout and shows a toast that opens the Run Summary. Risk: a run whose message never reaches the phone exists only in Health.

**Data from the phone:** -

**Data the watch sends or saves:** runFinished {type, clientId, kind walk|run|jumpRope, place, startedAt, endedAt (ms), activeSeconds, distanceMeters, activeEnergyKcal, route<=1500, heartRate<=600, laps, lapDistances, distanceSeries<=300, planCompleted, distanceScale, estimatedDistanceMeters?, steps?, planId?, programId?, programIndex?, appleZones?}.

**Settings:** -

**Capabilities:** WatchConnectivity transferUserInfo, local outbox file.

**Code:** targets/watch/Adapters/OutboundPayloads.swift:428-470; targets/watch/Infrastructure/WatchSessionManager.swift:330-366, 1783; targets/watch/Domain/WatchRunModels.swift:385-449; src/hooks/useWatchRunBridge.ts:131-156; src/services/watchRunSave.ts:84-160

### Crash / app-kill recovery and Health session failure

While a run is going, a snapshot (ids, kind, place, plan and cursor, settings, route progress and held turn cue, laps, route and HR rows, figures) is written to a file at most every 15 s, and at once on pause, resume, lap, step change and setting change. When the session next activates, the watch tries to reclaim the same Health session and carries on: the clock is kept, and steps, splits and coaching already passed are not repeated, and route following continues. If the Health session was lost, a snapshot with at least 60 s of active time is sent to the phone as it stood and the summary is shown (that run has no Health workout). Shorter ones are dropped. Snapshots older than 12 h are dropped. If the app died during the treadmill question, the question is asked again; if it had been answered, the settled run is sent. A Health session failure mid-run sends the recorded run on, if at least 60 s, instead of discarding it. A pending recovery blocks new runs until it finishes.

**Data from the phone:** -

**Data the watch sends or saves:** runFinished (rescued).

**Settings:** -

**Capabilities:** HKHealthStore.recoverActiveWorkoutSession, file storage.

**Code:** targets/watch/Domain/WatchRunSnapshot.swift:60-110 (maxAge 12 h :74, 60 s :76); targets/watch/Application/WatchRunStore.swift:360-494, 1052-1081; targets/watch/Infrastructure/WatchRunHealthKitController.swift:985-1060, 1287-1335, 1683-1718; targets/watch/Infrastructure/WatchSessionManager.swift:945-962

### One workout session at a time (conflicts)

Only one workout can run on the watch. The Cardio row is hidden and starts (including phone runStart) are refused while a strength workout, a phone-recording HR session, another run, a held indoor workout, or a pending recovery exists. A strength workout armed by the phone is ignored while a wrist run is active or an indoor run is held. A phone recording runs without wrist HR while a wrist run is active. Any active run or recording keeps the Workout page visible (even if hidden in the phone's page settings) and lands on it when the app returns to the foreground.

**Data from the phone:** -

**Data the watch sends or saves:** -

**Settings:** Phone page order/hidden pages are overridden while active.

**Capabilities:** Single HKWorkoutSession.

**Code:** targets/watch/Application/WatchRunStore.swift:92-103; targets/watch/Infrastructure/WatchSessionManager.swift:789; targets/watch/Application/RecordingStore.swift:110-114; targets/watch/Presentation/ContentView.swift:28-36, 114-116; targets/watch/Domain/WatchPage.swift:30-57

### Now Playing page during cardio

While a wrist run or phone recording is active, a system Now Playing page (whatever audio is already playing: Music, podcast, another app) is added right after the Workout page, reached by swiping. It has no other controls.

**Data from the phone:** -

**Data the watch sends or saves:** -

**Settings:** -

**Capabilities:** WatchKit NowPlayingView.

**Code:** targets/watch/Presentation/NowPlayingPage.swift:1-14; targets/watch/Domain/WatchPage.swift:50-56; targets/watch/Presentation/ContentView.swift:30-35, 193-194

### Haptic vocabulary for cardio

tap = click (buttons, tiles, Done); step = notification (split, lap, plan step, phone interval step change); autoPaused = stop; autoResumed = start; pace and HR alerts = directionDown (ease off) or directionUp (speed up); routeCue = notification; offRoute = failure; back on route or arrived = success. All are silenced by the phone's Settings > Haptics switch.

**Data from the phone:** Context hapticsEnabled.

**Data the watch sends or saves:** -

**Settings:** Phone Haptics switch (default on).

**Capabilities:** Taptic engine (WKHapticType).

**Code:** targets/watch/Presentation/Haptics.swift:13-92

### Run-related context the phone pushes to the watch

Background data the watch needs before any run: distance unit, app language, haptics switch, default auto-pause, voice cues and check-in minutes, last pace and HR ranges, the plan list, indoor distance factors, energy unit, and which workout view to use. Missing or malformed keys keep the previous values; an invalid range is ignored.

**Data from the phone:** Context keys: distanceUnit, appLanguage, hapticsEnabled, runAutoPause, runVoiceCues, runCheckInMinutes, runPaceMinSecondsPerKm, runPaceMaxSecondsPerKm, runHeartRateMinBpm, runHeartRateMaxBpm, runPlans, indoorDistanceScale {walk, run}, newWorkout, energy unit.

**Data the watch sends or saves:** -

**Settings:** Phone Record-screen preferences.

**Capabilities:** WatchConnectivity application context.

**Code:** targets/watch/Adapters/ContextPayloadMapper.swift:79-110, 170-224; src/hooks/useWatchCheckInBridge.ts:893-934

## 4. Phone link and settings

_Phone link and settings (WatchConnectivity transport, every phone<->watch message, queueing/retries, account binding, reachability, Settings > Apple Watch, DevTools watch status, phone-side useWatch* hooks and watch* services). Checked against code; corrections: phone routes 27 inbound types (not 28), watch routes 14 (not 13); the watch's single transfer() sends live OR queued (not both); fasting requests are neither persisted nor resent and their ack is ignored by the watch; the 'offline start #1983' claim is unbacked and is removed (only the newest tap is held, in memory); Android-only credential copying is cut down to a note._

### Transport model: channels and delivery rules

The watch never talks to the SparkyFitness server. The phone is the only gateway, because auth lives there. Four WatchConnectivity channels: (1) application context: one latest-value slot that survives the watch app sleeping. It is used ONLY for the 'context' snapshot, never for workouts or recordings, which would overwrite it. (2) transferUserInfo: a durable FIFO queue the OS delivers later even if the other side is asleep or out of range. (3) sendMessage: live only, fails when not reachable. (4) transferFile: deliberately NOT used (paired simulators report it delivered but never hand the file over), so images go as Data inside a message or userInfo. PHONE send patterns: 'queue AND live copy when reachable' for workoutStart, recordingState (durable only), runStart, runControl, intervalTiming, setTargets, workoutPlanUpdate (receivers dedupe by revision, clientId or controlId). 'Live, fall back to queue on error' for stopWorkout and exerciseImage. Queue-only for routeSync and routeRemove, because a live copy landing after a later remove would bring the route back. Live-only, dropped when unreachable: ack, runCueAck, and the 3 s recordingState refreshes. setTargets and workoutPlanUpdate sent before the phone session activates are held in memory (only the newest of each) and queued on activation, plan first. WATCH send pattern: one transfer() door. Live sendMessage when reachable (falling back to transferUserInfo on error), otherwise transferUserInfo. Sends attempted before activation go to an in-memory deferredTransfers list (not persisted) and are flushed on activation. Live-only from the watch, never queued: liveHeartRate, runLive, runCue, requestContext when reachable. The phone re-activates the session when it deactivates, so switching paired watches keeps working. Each message carries 'type'. The phone routes 27 inbound types, the watch 14. Unknown types are ignored. Phone-side JS listeners are attached only while their hooks are enabled (see the gates item); an event arriving with no listener is not stored natively, except heart-rate batches and finished runs.

**Data from the phone:** Watch -> phone types (27): checkIn, requestContext, waterIntake, waterDelete, medicationTaken, setCompleted, setUncompleted, restChanged, setTimerStarted, setTimerStopped, heartRateBatch, liveHeartRate, workoutStop, workoutEffort, workoutDiscard, workoutStartRequested, workoutEdit, presetUpdateAnswer, recordingControl, recordingHeartRate, fastStart, fastEnd, runLive, runCue, runFinished, runEffort, routeLibrary.

**Data the watch sends or saves:** Phone -> watch types (14, as routed by the watch): context (application context), ack, workoutStart, workoutStop, intervalTiming, setTargets, workoutPlanUpdate, exerciseImage, recordingState, runStart, routeSync, routeRemove, runCueAck, runControl.

**Settings:** None. Always on when WCSession is supported.

**Capabilities:** Phone<->watch messaging with a durable OS queue, a latest-value context slot, live messages, reachability callbacks and an activation lifecycle. Garmin: Connect IQ Communications (transmit / registerForPhoneAppMessages) is live-only, with no OS queue and no context slot. Queueing, dedupe and the latest snapshot have to be built in the app: a persisted outbox with retry on connect on the watch, and a snapshot cache on the phone.

**Code:** modules/watch-connectivity/ios/WatchConnectivityModule.swift:60-99 (held setTargets/plan, transferOrHold), 101-168 (activate, route switch), 170-205 (activation flush, re-activate on deactivate, reachability, didReceiveMessage/UserInfo), 633-638 (updateContext), 655-671 (startWorkout, context-slot comment), 673-696 (exerciseImage, no transferFile), 711-731 (recordingState durable vs 3 s), 750-766 (route queue-only), 770-785 (runControl, runCueAck), 787-808 (stopWorkout), 810-833; targets/watch/Infrastructure/WatchSessionManager.swift:142-189 (deferredTransfers, transfer()), 729-765 (watch route switch)

### Phone-side gates: which bridges run when

WatchCheckInGate runs useWatchCheckInBridge (weight, water, medications, context push) and useWatchFastingBridge, with enabled = server connected. While the phone has NO server connection, no listeners are attached and no context is pushed. Weight, water and medication items survive because the watch keeps them pending and resends them later. A fast request in that window is lost: the watch never resends it. WatchWorkoutGate runs the workout bridge, set-target sync, recording bridge, wrist-run bridge (with the connection flag), route bridge, workout-start listener, plan sync and workout-edit listener whenever the watch is supported, including offline, so nothing is dropped. A server /health poll runs while watch telemetry is still pending.

**Data from the phone:** Server connection state (useServerConnection), WatchConnectivity.isSupported().

**Data the watch sends or saves:** None.

**Settings:** Follows the phone's active server connection.

**Capabilities:** Garmin: the phone companion must decide which watch messages it can accept while offline and buffer them (or tell the watch to keep them).

**Code:** App.tsx:242-253 (WatchCheckInGate), 277-366 (WatchWorkoutGate, polling while telemetry pending), 555-558; src/hooks/useWatchCheckInBridge.ts:1540-1621 (listeners and push only when enabled); src/hooks/useWatchFastingBridge.ts:24-30

### Context push (type 'context'): the snapshot the watch lives on

The phone pushes one big dictionary into the application context. The watch persists it and uses it for every page (Goals, Water, Medications, Weight entry/Trend, Workout list, Fasting, Steps, sleep/exercise summaries) and to feed complications. WHEN it is pushed: (a) whenever any value it contains changes (food or water logged on the phone, unit change, a settings toggle, presets, etc.); (b) when the watch sends requestContext; (c) when the watch becomes reachable; (d) when the phone app returns to the foreground; (e) after every watch write handler (check-in, water tap/delete, medication) so the watch sees the result. DAY SAFETY: before each inbound event, on foreground and on reachability the hook rolls 'summaryDate' to today. If the figures in memory belong to another day, every day-scoped figure is sent as null: calories, macros, goal progress, water consumed, food water, water log (empty), medications, goalNutrients, sleep, exerciseSummary. The watch then shows 'not synced yet' instead of yesterday's numbers. scheduledWorkouts is sent empty when the day has changed. NOT day-gated: weight seed and history, containers, water goal, water display unit. ORDERING SAFETY: a generation counter drops an older push that finishes after a newer one, and a push is dropped if the active server changed during it. 'pushedAt' is always set because the OS ignores a byte-identical context. NULLS: JS nulls are stripped natively (property list only), so null keys never arrive. That is why 'fastKnown' exists: fast:null means 'not fasting' but never reaches the watch. A failed push is only logged; the watch keeps its cached context and asks again. EDGE CASES: no daily summary yet -> calorie/macro figures null (the watch shows dashes, not zero); medications null until both medication queries load (empty array = nothing scheduled); fast and fastKnown left out entirely until the server has answered; an auto-calculated 'eating window' fast is sent as no fast; steps null when the phone has no step figure for today (stripped, so the watch keeps its previous steps snapshot and the complication's own date check hides a stale one); stepGoal = the summary's steps goal, else 10000.

**Data from the phone:** Phone queries: daily summary (calorie balance, macros, waterConsumed/waterGoal/waterFromFood, stepsGoal, exercise minutes/calories and entries), measurements for the last 14 days (weight, body fat, steps), water containers, today's water intake log, active medications and today's dose entries, current fast, sleep (main sleep + naps), workout presets, recent/top exercises, active workout plans, heart-rate zones, run program status, recording preferences, indoor distance scale, custom nutrients.

**Data the watch sends or saves:** Keys: pushedAt, today, todayWeightKg, todayBodyFatPercentage, lastWeightKg, lastBodyFatPercentage, lastEntryDate, history[{day, weightKg, bodyFatPercentage}] (14 days, only days with weight), ackedClientIds (last 20), failedClientIds (last 20), weightUnit ('kg'|'lbs'; st_lbs collapses to lbs), distanceUnit ('km'|'miles'), energyUnit ('kcal'|'kJ'; values always kcal), containers[{id,name,servingVolumeMl,unit}], waterGoalMl, waterDisplayUnit ('ml'|'oz'|'liter'), waterConsumedMl, waterFromFoodMl (only when food water counts and is > 0), waterLog[{id,name,volumeMl,time}] (manual entries with a container, newest first, time preformatted 12/24 h), hapticsEnabled, restAlertsEnabled, doubleTapEnabled, rpeEnabled, setScreenMetrics, upNextPage, largerText, newWorkout, workoutCountdown (0/3/5), holdCountdown, workoutTopLine ('time'|'metrics'), medicationSkip:true, exerciseDoNow:true, runVoiceCues, appLanguage (BCP 47), runAutoPause, runCheckInMinutes, runHeartRateMinBpm/MaxBpm and runPaceMinSecondsPerKm/MaxSecondsPerKm (only when a band is saved), runPlans[...], heartRateZoneFloors (5 ascending bpm, when known), indoorDistanceScale{walk,run} (when learned), startableWorkouts[{presetId,name}], suggestedExercises[{exerciseId,name}] (max 20), scheduledWorkouts[{presetId,name,planName,caption}], workoutServerId, fast{startedAt,targetEndAt,label} + fastKnown:true, steps{day,count}, stepGoal, pageOrder, hiddenPages, setInputStyle, calorieGoalProgress/proteinGoalProgress/carbsGoalProgress/fatGoalProgress (0..1 clamped, for complications), caloriesConsumed/Burned/Remaining, proteinConsumed/Goal, carbsConsumed/Goal, fatConsumed/Goal, goalNutrients[{key,label,unit,consumed,goal,progress}], medications[...], sleep{...}, exerciseSummary{...}.

**Settings:** Pushed only while the phone has a server connection. Many keys mirror phone settings (see the Settings items).

**Capabilities:** A latest-value slot that survives sleep, watch-side persistence, complications fed from it. Garmin: the phone app pushes a snapshot (or answers a watch request), the watch stores it in Application.Storage, and glances and complications read from storage.

**Code:** src/hooks/useWatchCheckInBridge.ts:142-188 (goalProgress clamp, step goal 10000, 14 days, NO_FIGURES_FOR_TODAY), 296-303 (restAlertsEnabled), 505-512 (stepGoal), 842-955 (history, day gate, payload), 957-960 (generation and server guards), 1540-1621 (triggers); modules/watch-connectivity/ios/WatchConnectivityModule.swift:633-638, 1312-1321 (withoutNulls); modules/watch-connectivity/index.ts:160-460; src/utils/watchFast.ts:17-37; src/utils/watchWater.ts:11-19

### Watch side: receiving the context, cached context and complication refresh

Every inbound context is applied to the watch store, which persists it. Complications are published from the same payload: goal rings when the phone vouched for today, the fast only when fastKnown, steps when present, and water progress. When the watch app appears, and whenever it returns to the foreground, it: prunes stale day data, re-applies the context the OS already holds (adoptReceivedContext, which works with the phone out of range and fixes the case where the OS refuses to redeliver an identical context), asks for a fresh context, and republishes complications from the stored context (today's data only). On first appearance it also resends pending check-ins, water taps/deletes and medication ticks. Returning to the foreground during a workout, wrist run or phone recording jumps to the Workout page.

**Data from the phone:** context payload; WCSession.receivedApplicationContext.

**Data the watch sends or saves:** requestContext (see next item); complication snapshots in shared storage.

**Settings:** None.

**Capabilities:** App group shared storage for complications, scene phase. Garmin: Application.Storage plus glance/complication data, refreshed on app start and onShow.

**Code:** targets/watch/Infrastructure/WatchSessionManager.swift:555-608 (refreshComplications), 615-630 (adoptReceivedContext), 657-697 (handle(context:)); targets/watch/Presentation/ContentView.swift:70-114

### Context request from the watch (type 'requestContext')

The watch asks for a fresh context. If the phone is reachable it sends a live message only. Otherwise it queues ONE request; a flag stops more piling up and is cleared when any context arrives. Sent on activation (last step), whenever the phone becomes reachable, on app appear and on return to the foreground. The phone answers by rolling to today and pushing the context, but only while it has a server connection (otherwise nothing is listening).

**Data from the phone:** Watch -> phone: {type:'requestContext'} (no other keys).

**Data the watch sends or saves:** Phone replies with a full 'context' push.

**Settings:** None.

**Capabilities:** Live message + queued fallback. Garmin: the watch transmits a request when connected; with no OS queue it must ask again on reconnect.

**Code:** targets/watch/Infrastructure/WatchSessionManager.swift:632-655 (requestContext), 657-660 (flag cleared); targets/watch/Adapters/OutboundPayloads.swift:118-119; modules/watch-connectivity/ios/WatchConnectivityModule.swift:112-113; src/hooks/useWatchCheckInBridge.ts:1576-1583

### Acknowledgements (type 'ack' + ackedClientIds/failedClientIds in the context)

Weight check-ins, water taps, water deletes and medication ticks carry a watch-generated clientId and show queued / saved / failed on the watch. The phone confirms twice: an immediate live {type:'ack', clientId, ok} (only if reachable, otherwise skipped) and durably by listing the id in the next context's ackedClientIds (success) or failedClientIds (server refused). The watch matches the id against check-ins first, then water taps, water deletes and medication ticks, and marks it saved or failed. Failed items offer a retry under the same id. A resend of an id the phone already handled is re-acked true only if that earlier write is known to have succeeded. The phone keeps the last 20 acked and 20 failed ids, and persists its handled/acked/failed sets to AsyncStorage 'sparky.watch.ackState.v1' (max 200 handled ids), so a JS restart does not double-log a re-delivered tap. In-flight reservations are never persisted. Each write handler waits for that state to load before deduping. Fast start/end also get a live ack, but the watch ignores it (no tracked item matches). The watch learns the result from the next context's fast.

**Data from the phone:** clientId on checkIn, waterIntake, waterDelete, medicationTaken (and fastStart, fastEnd).

**Data the watch sends or saves:** Live: {type:'ack', clientId, ok:boolean}. Durable: context.ackedClientIds[], context.failedClientIds[] (each last 20).

**Settings:** None.

**Capabilities:** Live message + durable snapshot. Garmin: the phone replies over the same connection and also lists acked/failed ids in its next snapshot; the watch persists its pending list.

**Code:** modules/watch-connectivity/ios/WatchConnectivityModule.swift:640-651 (sendAck, live only); src/hooks/useWatchCheckInBridge.ts:218-225, 890-891, 1036-1114, 1186-1209; targets/watch/Infrastructure/WatchSessionManager.swift:702-718 (handle(ack:)); src/hooks/useWatchFastingBridge.ts:62-68

### Weight / body-fat check-in from the watch (type 'checkIn')

The wearer enters weight (and optionally body fat) on the watch. It shows 'queued' until acked. The phone dedupes by clientId (re-acks true for one already saved), then upserts that day's check-in. Body fat is OMITTED, not null, when skipped, so an existing value for that day is not erased. On success: ack ok, refresh measurement and Apple Health sync caches, push context (new history and seed). On failure: ack false, and the watch shows retry. The watch resends unconfirmed check-ins on app appear, on activation and whenever the phone becomes reachable.

**Data from the phone:** {type:'checkIn', clientId, entryDate 'yyyy-MM-dd' (wearer's local day), weightKg (always kg), bodyFatPercentage? (absent when skipped)}. No ownerId from the Apple Watch.

**Data the watch sends or saves:** Server: check-in upsert = measurement row for that day. Watch: ack + context todayWeightKg/todayBodyFatPercentage/last*/history.

**Settings:** The watch displays weight in context.weightUnit (kg, or lbs for lbs/st_lbs) but always sends kg. Requires a phone server connection; otherwise it stays pending on the watch and is resent.

**Capabilities:** Durable queue, Digital Crown entry. Garmin: persisted outbox + retry on connect; input via up/down buttons or a picker.

**Code:** src/hooks/useWatchCheckInBridge.ts:1116-1173; targets/watch/Adapters/OutboundPayloads.swift:49-66; targets/watch/Infrastructure/WatchSessionManager.swift:370-379 (send), 417-428 (retryPending)

### Water container tap from the watch (type 'waterIntake')

One tap on a container square logs one full serving of that container for today (the same as the phone's + button). The watch bumps its bottle optimistically. Phone: dedupe (id reserved BEFORE the write because the write is additive, released on failure), +1 serving for that container, patch the cached daily summary, ack ok (live + ackedClientIds, removed from failedClientIds), refresh summary/water log, push context. On failure: id released, added to failedClientIds, ack false, push context. The watch resends queued taps under the same id on app appear, activation and reachability. Failed taps can be retried by the wearer under the same id. A tap made in the launch window before activation (e.g. from a complication cold start) is parked in memory; if lost, the optimistic bump clears on the next context.

**Data from the phone:** {type:'waterIntake', clientId, entryDate, containerId (int)}

**Data the watch sends or saves:** Server water intake (+1 serving; a food-linked container also creates the linked food entry). Watch: ack + context waterConsumedMl, waterLog, acked/failed ids.

**Settings:** Containers come from the phone's water container settings; serving volume per tap = container volume / servings (food-linked containers follow hydration rules). Water display unit from the phone.

**Capabilities:** Durable queue, optimistic UI. Garmin: same, with an app-level outbox.

**Code:** src/hooks/useWatchCheckInBridge.ts:1185-1309; src/utils/watchWater.ts:21-60; targets/watch/Infrastructure/WatchSessionManager.swift:146-163, 443-487; targets/watch/Adapters/OutboundPayloads.swift:68-77

### Delete a logged drink from the watch (type 'waterDelete')

From the watch's water log (today's manual entries, newest first) the wearer deletes a row, and the watch hides it immediately. Phone: dedupe (reserve id), delete the water entry by server row id (the server lowers the total and deletes a linked food entry), ack both ways, refresh, push context. On failure: id released, marked failed, ack false, context pushed so the row comes back. Ignored when entryId is empty. The watch resends queued deletes on app appear, activation and reachability.

**Data from the phone:** {type:'waterDelete', clientId, entryId (context.waterLog[].id)}

**Data the watch sends or saves:** Server delete; ack; context with the new waterLog/waterConsumedMl.

**Settings:** Synced (non-manual, e.g. Apple Health) water entries are never sent to the watch, so they cannot be deleted there.

**Capabilities:** Durable queue. Garmin: same.

**Code:** src/hooks/useWatchCheckInBridge.ts:690-720, 1316-1395; targets/watch/Infrastructure/WatchSessionManager.swift:490-506; targets/watch/Adapters/OutboundPayloads.swift:79-86

### Medication / supplement dose: take, undo, skip from the watch (type 'medicationTaken')

The watch Medications page lists today's dose slots (scheduled slots soonest first, untimed last, then as-needed meds as one untimed row each with an empty scheduleId). The wearer can tick (taken:true), un-tick (taken:false) or Skip (skipped:true, offered because the phone advertises medicationSkip:true). The phone processes ticks one at a time in arrival order, dedupes, reads the day's entries and decides: as-needed row -> one 'prn_taken' per day (no skip); skip -> create or update the entry as 'skipped'; un-tick -> delete that slot's taken/skipped entry or do nothing; tick -> turn an existing skipped/schedule-less entry into taken, else create taken with taken_at = now; already in the asked state -> no write. Idempotent, so a redelivery cannot double-log. Ack both ways, refresh, push context. A tick resent after midnight keeps the day it was made. The watch resends queued ticks on app appear, activation and reachability; failed ticks can be retried.

**Data from the phone:** {type:'medicationTaken', clientId, entryDate, medicationId, scheduleId ('' for as-needed), taken (bool), skipped? (true only when skipping)}

**Data the watch sends or saves:** Server medication entry create/update/delete (taken|skipped|prn_taken). context.medications[{id 'medId:scheduleId', medicationId, scheduleId, name, detail (e.g. '10 mg'), time (preformatted), status pending|taken|skipped, supplement}], medicationSkip:true.

**Settings:** 12/24 h time format from phone preferences. Day-scoped: medications are null when the push cannot vouch for today.

**Capabilities:** Durable queue, serialised processing. Garmin: same.

**Code:** src/hooks/useWatchCheckInBridge.ts:913, 1405-1514; src/utils/watchMedications.ts:33-131; targets/watch/Adapters/OutboundPayloads.swift:88-102; targets/watch/Infrastructure/WatchSessionManager.swift:510-557

### Start / end a fast from the watch (types 'fastStart', 'fastEnd')

Fasting page: when the phone has said whether a fast is running (fastKnown), not fasting shows one button per preset 'Start <preset>'. Fasting shows 'End fast' with a confirm dialog 'End your fast?' (End fast / Cancel). Before the first answer it shows 'Waiting for your iPhone'. A tap shows a spinner while waiting. Each tap sends a NEW clientId. It is not stored or resent, and the ack is ignored; the result arrives with the next context. Phone: dedupe by clientId (in memory). Start: preset by id (16-8 = 16 h '16:8 Leangains', 18-6 = 18 h, 20-4 = 20 h, circumadian = 13 h 'Circadian Rhythm', custom = 12 h); unknown preset -> fail. It only starts a fast if no manual fast is running (an auto-calculated fast does not block it): start = now, target = now + preset hours, type = preset name. End: ends the current fast only if it is a manual one and cancels the phone's fast-goal notification. Then fasting and daily-summary caches are invalidated, which triggers a context push, and a live ack is sent. On failure the id is released and a warning is logged. If the phone has no server connection the request is dropped (no listener) and the watch does not retry.

**Data from the phone:** {type:'fastStart', presetId, clientId}; {type:'fastEnd', clientId}

**Data the watch sends or saves:** Server fasting log start/end. Live ack (ignored by the watch). context.fast{startedAt, targetEndAt, label} / fastKnown.

**Settings:** Only while the phone has a server connection.

**Capabilities:** Queue or live message. Garmin: same; consider persisting the request for retry, which this design does not do.

**Code:** src/hooks/useWatchFastingBridge.ts:24-118; src/constants/fasting.ts:19-55; targets/watch/Infrastructure/WatchSessionManager.swift:381-389; targets/watch/Adapters/OutboundPayloads.swift:104-116; targets/watch/Presentation/FastingView.swift:85-125

### Account / server binding

Everything is tied to the phone's ACTIVE server configuration. (a) The context carries workoutServerId. The watch echoes it as serverId in a workout start request, and the phone drops a start whose serverId is missing or not the active one, so a tap queued across an account switch cannot start a preset. (b) A context push is discarded if the active server changed while it was being built. (c) Inbound check-in, water, medication and fast payloads are filtered by ownerId only when one is present. Apple Watch payloads carry none and always pass. (d) Heart-rate batches are stamped natively with the 'telemetry owner' (active config id, persisted in UserDefaults 'sparky.watchTelemetryOwner', so a cold-start batch is still stamped). A batch that arrives with no active config is not queued. A batch for another config stays queued and is not applied. On an account switch the phone purges the outgoing account's telemetry and restores again. (e) Wrist runs get an ownerId on the phone and are filed only under that config. On iOS no server credential is ever copied to the native side or the watch.

**Data from the phone:** serverId on workoutStartRequested.

**Data the watch sends or saves:** context.workoutServerId; native setTelemetryOwner(ownerId).

**Settings:** Follows the phone's active server config. Nothing to set on the watch.

**Capabilities:** Phone-held auth. Garmin: keep auth on the phone and route all writes through the companion app (or deliberately pass a scoped token for makeWebRequest).

**Code:** src/services/watchServerCredentials.ts:14-28 (iOS only reads the active id), 79-91 (isPayloadForActiveServer); modules/watch-connectivity/ios/WatchConnectivityModule.swift:234-237, 336-341, 838-846; src/hooks/useWatchWorkoutBridge.ts:511-522, 1405-1428, 1507-1516; src/hooks/useWatchWorkoutStart.ts:57-80; src/hooks/useWatchCheckInBridge.ts:957-960; targets/watch/Adapters/OutboundPayloads.swift:121-134

### Reachability / pairing status and Developer Tools watch status

useWatchConnectivity exposes isSupported (native module present and WCSession supported), isPaired and isReachable (watch app in the foreground and messageable now), refreshed by the native onReachabilityChange event. Developer tools show an 'Apple Watch' section with the text 'Status of the watch companion link. Check-ins captured on the watch are queued and delivered even when "reachable" is off, so a gray dot here does not mean data is lost.' Dot 1: green 'Watch paired' / red 'No watch paired' / 'Not supported on this platform'. Dot 2: green 'Watch app reachable now' / gray 'Watch app not in foreground'. Reachability turning true makes the phone push the context and the watch resend everything pending. The Settings > Apple Watch row appears only when supported AND paired.

**Data from the phone:** Native event onReachabilityChange {isReachable}; isPaired(), isReachable(), isSupported().

**Data the watch sends or saves:** None.

**Settings:** None.

**Capabilities:** Pairing/reachability APIs. Garmin: System.getDeviceSettings().phoneConnected on the watch; Connect IQ Mobile SDK device status on the phone.

**Code:** src/hooks/useWatchConnectivity.ts:1-65; src/components/DevTools.tsx:653-702; src/screens/SettingsScreen.tsx:61-65, 427-442; modules/watch-connectivity/ios/WatchConnectivityModule.swift:615-627

### Settings > Apple Watch: Gestures (double tap, RPE)

Section 'Gestures'. 'Double-tap to log a set' switch: on a supported watch the double-tap gesture logs the set on screen during a workout; when off, the watch ignores the gesture. 'Ask for effort (RPE) after each set' switch: after logging a set on the watch, turn the Digital Crown to pick 1-10, then Save or Skip. Changes reach the watch with the next context push.

**Data from the phone:** None.

**Data the watch sends or saves:** context.doubleTapEnabled, context.rpeEnabled; the chosen RPE travels on setCompleted.rpe.

**Settings:** Defaults: watchDoubleTapEnabled = true, watchRpeEnabled = false (opt-in). Stored on the phone only (persisted zustand store), not on the server.

**Capabilities:** Double tap gesture, Digital Crown. Garmin: no double tap, so map it to a hardware button; use up/down or touch for RPE.

**Code:** src/screens/WatchSettingsScreen.tsx:162-209; src/stores/appPreferencesStore.ts:180-181, 348-351; src/hooks/useWatchCheckInBridge.ts:903-904

### Settings > Apple Watch: Set input style

'Set input' segmented control: 'Keypad' (type weight/reps on a number keypad) or 'Digital Crown' (tap a value, then turn the crown or drag; weight moves 0.5 at a time).

**Data from the phone:** None.

**Data the watch sends or saves:** context.setInputStyle 'keypad' | 'crown' (the watch treats a missing key as keypad).

**Settings:** Default watchSetInputStyle = 'crown'.

**Capabilities:** Digital Crown / touch drag. Garmin: up/down buttons or a number picker.

**Code:** src/screens/WatchSettingsScreen.tsx:209-242; src/stores/appPreferencesStore.ts:194; src/constants/watchPages.ts:52-60; src/hooks/useWatchCheckInBridge.ts:953

### Settings > Apple Watch: Layout (classic vs new workout view)

Section 'Layout'. Only while 'New workout view' is OFF: 'Metrics on the set screen' (elapsed time, heart rate and calories on the set screen; off moves them to their own page) and 'Up Next page' (next exercise, its target and a Swap button). Always: 'Larger text on the watch' (larger type and newer layouts on Goals, Water, Fasting, Steps and more). 'New workout view' switch (Log set button, double tap also logs, edit-previous-set button, a More page with workout actions, a single summary at the finish). Only while New workout view is ON: 'Top line' segmented Time / Metrics (what the top line shows first; tap on the watch to switch), 'Countdown sound & haptic' segmented Off / 3 s / 5 s (sound and tap for each of the last seconds of a rest or timed hold, a different one at zero; silent mode gives the tap only), 'Countdown before holds' switch (a 3-2-1 get-ready screen before a timed hold, tap to skip).

**Data from the phone:** None.

**Data the watch sends or saves:** context.setScreenMetrics, upNextPage, largerText, newWorkout, workoutTopLine, workoutCountdown (0|3|5), holdCountdown; exerciseDoNow:true (the phone supports Swap).

**Settings:** Defaults: watchSetScreenMetrics = true, watchUpNextPage = false, watchLargerText = false, watchNewWorkout = false, watchWorkoutTopLine = 'time', watchWorkoutCountdown = 3, watchHoldCountdown = true.

**Capabilities:** Haptics + audio, paged UI. Garmin: Attention.vibrate / playTone, page navigation with up/down.

**Code:** src/screens/WatchSettingsScreen.tsx:243-406; src/stores/appPreferencesStore.ts:182-188; src/constants/watchPages.ts:62-71; src/hooks/useWatchCheckInBridge.ts:905-915

### Settings > Apple Watch: Pages order and visibility

Section 'Pages'. Drag to reorder the watch's swipeable pages (each row has a 'Reorder <name>' handle) and switch a page off to hide it. The last visible page cannot be switched off. The Workout page still appears during a workout even if hidden. Pages (wire key: label, factory order): goals: Goals, water: Water, medications: Medications, entry: Weight check-in, trend: Weight trend, workout: Workout, fasting: Fasting, steps: Steps. A page added in a later version appears at the end for people who already reordered.

**Data from the phone:** None.

**Data the watch sends or saves:** context.pageOrder (resolved full order), context.hiddenPages.

**Settings:** Defaults: factory order, nothing hidden.

**Capabilities:** Paged UI. Garmin: page loop or menu; glances for summary pages.

**Code:** src/screens/WatchSettingsScreen.tsx:126-128, 408-437; src/constants/watchPages.ts:1-45; src/stores/appPreferencesStore.ts:178-179; src/hooks/useWatchCheckInBridge.ts:951-952

### Settings > Apple Watch: Goals page nutrients

Section 'Goals page nutrients'. Choose and order the nutrients listed under the calorie ring on the watch's Goals page. Each shows today's amount against its goal. The list holds all standard nutrients except calories and glycemic index, then the account's custom nutrients (loaded only while connected), in the saved order.

**Data from the phone:** Custom nutrients from the server.

**Data the watch sends or saves:** context.goalNutrients[{key,label,unit,consumed,goal|null,progress 0..1}] (null when not for today; the watch falls back to protein, carbs, fat).

**Settings:** Default shown: protein, carbs, fat; natural order.

**Capabilities:** List UI. Garmin: same.

**Code:** src/screens/WatchSettingsScreen.tsx:130-140, 439-462; src/constants/watchPages.ts:47-48; src/utils/watchNutrients.ts:13-15; src/stores/appPreferencesStore.ts:192-193; src/hooks/useWatchCheckInBridge.ts:608-627

### Other phone settings mirrored to the watch through the context

Not on the Apple Watch screen but forwarded: Settings > Haptics (the watch plays button haptics and the rest-end buzz only when on); rest alerts = notifications ON AND rest-timer notifications ON; default weight/distance/energy units; time format (strings arrive preformatted); water display unit and 'count food water'; Record screen preferences (voice cues, auto-pause, check-in minutes, last pace band, last heart-rate band); app language; run programs (with optional race-based pace ranges via 'pace reference on watch'); heart-rate zone floors from the person's resolved zones; the learned treadmill distance factor per walk/run (resettable in Treadmill settings).

**Data from the phone:** Phone preferences store + server preferences.

**Data the watch sends or saves:** context.hapticsEnabled, restAlertsEnabled, weightUnit, distanceUnit, energyUnit, waterDisplayUnit, waterFromFoodMl, runVoiceCues, appLanguage, runAutoPause, runCheckInMinutes, runPace*, runHeartRate*, runPlans, heartRateZoneFloors, indoorDistanceScale.

**Settings:** Phone defaults: hapticsEnabled true, notificationsEnabled true, restTimerNotificationsEnabled true, paceReferenceOnWatch false; recording autoPause true, audioCues false, checkInMinutes 0.

**Capabilities:** Haptics, TTS. Garmin: vibration and tones; most devices have no on-device TTS.

**Code:** src/hooks/useWatchCheckInBridge.ts:280-317, 878-934; src/stores/appPreferencesStore.ts:109-112, 155, 269-270; src/services/gpsRecordingService.ts:605-607; src/hooks/useWatchHeartRateZoneFloors.ts:10-19; src/services/watchIndoorScale.ts:37-90; src/screens/RunProgramsScreen.tsx:104-108

### Arm the watch when a strength workout starts on the phone (type 'workoutStart') + auto-launch

When a preset or live workout starts on the phone (instant start, 'Start workout here', reopen, or a start the watch asked for), the phone sends the full plan: queued, plus live if reachable, so it stays ahead of later timing messages. The phone also asks HealthKit to launch the watch app with a traditional-strength, indoor configuration. That only works when Health data is available and the watch is paired, has the app installed, is on the wrist and unlocked; otherwise the plan waits until the app is next opened. The watch DROPS a start when: it is stale (a stop for that session already arrived and armedAt is not later); the same session is already running (no restart from set 1); or a wrist-only run is active or still saving its Health workout. If HealthKit recovery is still reattaching an older session, the plan is held until that finishes.

**Data from the phone:** None (phone-initiated).

**Data the watch sends or saves:** {type:'workoutStart', sessionId, workoutName, exercises[{exerciseEntryId, name, supersetRun|null, bodyweight?, equipment?, plates?{unit,barWeight,collarWeight,plates[{weight,pairs}]}, imageKey?, imageCount?, muscle?, sets[{setId, targetReps?, targetWeightKg?, targetDurationSec?, previousDurationSec?, timed?, carry?, weighted?, targetDistanceKm?, restSeconds, restAfterSeconds?, setType?}]}], setOrder[setId], workoutFormat?, timeCapSeconds?, startedAt?, armedAt, capEndsAt?, fromPreset?}

**Settings:** Only for preset-type sessions with a supported watch.

**Capabilities:** HealthKit startWatchApp (remote launch), workout session. Garmin: the phone cannot launch a watch app silently; the person opens the app, which then receives or asks for the plan.

**Code:** src/hooks/useStartLiveWorkout.ts:159-245; modules/watch-connectivity/ios/WatchConnectivityModule.swift:274-301 (launchWatchApp), 662-671; modules/watch-connectivity/index.ts:468-605; targets/watch/Infrastructure/WatchSessionManager.swift:773-795

### Start a saved workout from the watch (type 'workoutStartRequested')

The watch Workout page lists today's scheduled workouts (from active plans, with a caption such as 'Session 2 of 3') above saved workouts (non-empty presets, A-Z). Tapping one sends a request (live or queued). Phone: drops it if presetId is not numeric, or if serverId is missing or not the active server. It loads the preset (cache or server); unloadable or with no exercises -> ignored. If that preset's session is already live, it just re-arms the watch. Otherwise it links the session to today's due plan assignment if there is one and starts the live workout without changing the phone's current screen (an active-workout bar appears; a conflict prompt offers 'Go to Workout'). If the phone is offline, only the newest tap is held in memory and run once the connection returns.

**Data from the phone:** {type:'workoutStartRequested', presetId, serverId?}

**Data the watch sends or saves:** Then workoutStart. The context provides startableWorkouts, scheduledWorkouts, workoutServerId.

**Settings:** None.

**Capabilities:** Queue. Garmin: same.

**Code:** src/hooks/useWatchWorkoutStart.ts:32-189; src/hooks/useWatchCheckInBridge.ts:101-121, 433-455, 936-940; targets/watch/Infrastructure/WatchSessionManager.swift:397-401; App.tsx:322-363

### Live plan updates during a workout (type 'workoutPlanUpdate')

When exercises, supersets or sets are added, removed or regrouped (on the phone or by watch edits), the phone resends the plan with a rising revision (wall-clock ms). The watch swaps it in without restarting, keeps what was logged, and ignores older revisions. The phone waits until no set has a temporary id (it forces a save to get server ids) and sends only when the structure actually changed (ids, names, superset, bodyweight, equipment, plates, images, muscle, set ids/types/rest). Also resent when the plate inventory loads.

**Data from the phone:** Active workout store changes.

**Data the watch sends or saves:** {type:'workoutPlanUpdate', ...same keys as workoutStart, revision}

**Settings:** None.

**Capabilities:** Queue + live; held until activation. Garmin: same, with app-level revisions.

**Code:** src/hooks/useWatchPlanSync.ts:19-155; modules/watch-connectivity/ios/WatchConnectivityModule.swift:698-709, 75-99

### Set targets, completions, timers, PRs and rest sync to the watch (type 'setTargets')

Every relevant change on the phone (targets from history/progression, sets logged on the phone, a running set timer, PR flags, rest state such as +15 s / pause / skip) sends the full list. The watch keeps the highest revision but still prefers values typed on the wrist. It adds phone completions (never removes them) and moves past a set logged on the phone, starts its own stopwatch from the phone timer's start, celebrates a PR it logged once, and follows the phone's rest unless the update predates a set just logged on the wrist. Nothing is sent until the session was armed.

**Data from the phone:** Active workout store.

**Data the watch sends or saves:** {type:'setTargets', sessionId, armedAt (ms), revision, targets[{setId, targetWeightKg?, targetReps?, targetDurationSec?, previousDurationSec?, targetDistanceKm?}], completedSetIds[], setTimers{setId: startedAtMs} (max 1), prSetIds[], restState 'resting'|'paused'|'ready', restEndsAt?, restDurationSeconds?}

**Settings:** None.

**Capabilities:** Queue + live; held until activation. Garmin: same.

**Code:** src/hooks/useWatchSetTargetsSync.ts:124-232; modules/watch-connectivity/index.ts:1218-1265; modules/watch-connectivity/ios/WatchConnectivityModule.swift:824-833

### Interval / time-cap pause sync (type 'intervalTiming')

For time-capped formats, any pause or resume on the phone sends an absolute snapshot so the watch's cap freezes or resumes. The revision only rises and is persisted with the store. excludedPauseMs accumulates finished pauses so a late message cannot undo one. The watch keeps a snapshot that arrives before the plan.

**Data from the phone:** Phone pause/resume.

**Data the watch sends or saves:** {type:'intervalTiming', sessionId, revision, paused, pausedAt? ISO, excludedPauseMs}

**Settings:** None.

**Capabilities:** Queue + live. Garmin: same.

**Code:** src/stores/activeWorkoutStore.ts:78-108; modules/watch-connectivity/ios/WatchConnectivityModule.swift:810-822

### Exercise demo images to the watch (type 'exerciseImage')

For each exercise in the armed workout that has demo pictures (start and end positions), the phone downloads them, scales to 240 px wide JPEG at quality 0.7 (~15 KB) and sends the bytes. The watch caches them by exercise key and shows a demo page. Sent once per arm and exercise. A failed download is not retried for that arm; an unreadable file rejects, so it is retried on the next plan send.

**Data from the phone:** Exercise images from the server.

**Data the watch sends or saves:** {type:'exerciseImage', key, index (0 start, 1 end), data (JPEG bytes)}; the plan carries imageKey, imageCount, muscle.

**Settings:** None.

**Capabilities:** Binary payload over the link. Garmin: very small message limits; use makeImageRequest through the phone or bundled resources.

**Code:** src/services/watchExerciseImages.ts:20-110; modules/watch-connectivity/ios/WatchConnectivityModule.swift:673-696; targets/watch/Infrastructure/WatchSessionManager.swift:741-742

### Log / un-log a set from the watch (types 'setCompleted', 'setUncompleted')

Each set logged on the watch (with edited values, timed duration, carry distance, RPE) completes the same set in the phone's live workout. Values are patched first (only fields the watch sent; absent fields are never cleared), the phone timer for that set is cleared, the set is completed with the watch's tap time (bounded), and the workout is saved to the server at once (the phone screen may be closed). Rest timers, PR detection and autosave behave as for a phone-logged set. Deduped by clientId (a fresh UUID per send); ignored for a session that is no longer live. RPE accepted 1-10. Un-log uncompletes and saves; an un-log arriving before its log is deferred. If the wearer chose Save/Skip before the watch session was active, the completion is kept on the watch and sent on activation.

**Data from the phone:** {type:'setCompleted', clientId, sessionId, setId, weightKg?, reps?, rpe?, duration? (s), distanceKm? (carry sets), completedAt ISO}; {type:'setUncompleted', clientId, sessionId, setId}

**Data the watch sends or saves:** Server workout session sets. Then setTargets with completedSetIds.

**Settings:** The RPE prompt follows watchRpeEnabled.

**Capabilities:** Queue. Garmin: same.

**Code:** src/hooks/useWatchWorkoutBridge.ts:404-509; targets/watch/Adapters/OutboundPayloads.swift:205-249; targets/watch/Infrastructure/WatchSessionManager.swift:1463-1524

### Rest and set-timer changes from the watch (types 'restChanged', 'setTimerStarted', 'setTimerStopped')

Skip rest or +/-15 s on the watch moves the phone's rest only if the phone's rest still ends at previousEndsAt (+/-3 s); a missing endsAt means skip. Starting a hold countdown or stopwatch on the watch starts the phone timer from the same instant. It is ignored for another session, a set already logged, a bad or >3 h old start, or a different arm (>2 s apart). Stopping the stopwatch on the watch stops the phone timer and writes the measured seconds as the set duration, only for the same run (start within 20 ms).

**Data from the phone:** {type:'restChanged', sessionId, previousEndsAt ms, endsAt? ms}; {type:'setTimerStarted', sessionId, setId, startedAt ms, armedAt? ms}; {type:'setTimerStopped', sessionId, setId, seconds, startedAt ms}

**Data the watch sends or saves:** Phone store updates, echoed back in setTargets.

**Settings:** None.

**Capabilities:** Queue/live. Garmin: same.

**Code:** src/hooks/useWatchWorkoutBridge.ts:170-302; targets/watch/Adapters/OutboundPayloads.swift:507-560; targets/watch/Infrastructure/WatchSessionManager.swift:898-917

### Edit the running workout from the watch (type 'workoutEdit')

Actions: addSet (to exerciseEntryId), deleteSet (setId), setSetType (normal|warmup|drop|failure), addExercise (exerciseId from the context's suggestedExercises; the phone loads it, then adds it), deleteExercise, doExerciseNow (Swap: move exerciseEntryId in front of anchorEntryId), setValues (weightKg/reps/distanceKm typed before logging; dropped if the set is already logged, if from an earlier arm >10 ms apart, or if older ('at') than a newer edit of the same field). Ignored if not the live session; deduped by clientId (last 100). Plan sync sends the changed plan back.

**Data from the phone:** {type:'workoutEdit', sessionId, clientId, action, exerciseEntryId?, anchorEntryId?, setId?, exerciseId?, setType?, weightKg?, reps?, distanceKm?, at? ms, armedAt? ms}

**Data the watch sends or saves:** Phone live workout store (autosaved) -> workoutPlanUpdate / setTargets back.

**Settings:** Swap is offered because context.exerciseDoNow = true.

**Capabilities:** Queue. Garmin: same.

**Code:** src/hooks/useWatchWorkoutEdit.ts:1-150; targets/watch/Adapters/OutboundPayloads.swift:136-203; targets/watch/Infrastructure/WatchSessionManager.swift:403-411

### Strength workout heart rate and calories batches (type 'heartRateBatch')

During a watch-tracked workout the watch sends a batch about once a minute and at each exercise change, through the queued door (not reachability-gated). A batch holds HR samples, the active-energy DELTA since the last batch (0 is sent, nil means no reading), cumulative minutes on that exercise, and on the final batch Apple's time-in-zone. The phone's native side stamps the active owner and stores each batch as its own file (cap 10,080 = one week, evictions counted; 1 MB per batch; written once the phone is first unlocked). It keeps the batch until JS acks it, so batches arriving while the app is not running survive. JS waits for its saved encrypted per-account buffer to restore (wait 10 s; retries 2 s / 10 s / 30 s / 60 s / 5 min), replays the native queue, attributes samples and energy to exercises using the set timeline, merges by timestamp (energy only with a clientId, to avoid doubling) and shows the newest reading live. When the workout ends (from either side) it attaches the HR series (>= 2 samples), measured kcal (replacing the server estimate), duration and Apple zones to each exercise entry. Offline: it retries and polls /health. Buffers are kept 10 min after the end, max 3 sessions. Uploads are dropped on 4xx except 401/408/429. Dropped counts go to the app log.

**Data from the phone:** {type:'heartRateBatch', clientId, sessionId, exerciseEntryId, samples[{t ISO, bpm}], activeEnergyKcal?, durationMinutes?, appleZones?[{index?,minimumBpm?,maximumBpm?,seconds}]} (+ native ownerId/queueId)

**Data the watch sends or saves:** Server: exercise entry telemetry (hrSamples, activeEnergyKcal, durationMinutes, appleZones) -> diary calories, HR chart, zones.

**Settings:** None. Needs HealthKit permission on the watch (no energy if refused).

**Capabilities:** Heart rate sensor, HKLiveWorkoutBuilder, background workout mode. Garmin: ActivityRecording session + Sensor heart rate; batches persisted until acked.

**Code:** src/hooks/useWatchWorkoutBridge.ts:66-80, 511-790, 820-937, 1277-1505; modules/watch-connectivity/ios/WatchConnectivityModule.swift:225-245, 848-917, 1085-1175; targets/watch/Adapters/OutboundPayloads.swift:251-273; targets/watch/Infrastructure/WatchSessionManager.swift:1526-1594

### Live heart rate to the phone (type 'liveHeartRate')

While reachable the watch sends the current reading at most every 3 s, skipping readings older than 5 s or bpm <= 0. Live only, never queued. Used both for strength workouts (tagged with the current exercise) and for phone GPS recordings (empty exerciseEntryId). The phone shows it on the active workout / recording screen and checks the runner's HR band against it. Nothing is lost when it drops, because the batches carry the data.

**Data from the phone:** {type:'liveHeartRate', sessionId, exerciseEntryId ('' for a recording), bpm, at ms}

**Data the watch sends or saves:** None (display only).

**Settings:** None.

**Capabilities:** Heart rate sensor, live messaging. Garmin: transmit while connected.

**Code:** targets/watch/Infrastructure/WatchSessionManager.swift:191-258; src/hooks/useWatchWorkoutBridge.ts:1237-1252; src/hooks/useWatchRecordingBridge.ts:265-280

### Finish, discard, rate effort, 'update saved workout?' (watch->phone 'workoutStop', 'workoutDiscard', 'workoutEffort', 'presetUpdateAnswer'; phone->watch 'workoutStop')

Finish on the watch: the stop is sent once HealthKit has finished and the last batch is queued. The phone flushes telemetry, saves the session and stamps finished_at (revision-guarded, one retry on 409), clears the live workout and opens Workout Complete if the phone is on the workout. If saving fails because the server is unreachable, it queues the workout for offline upload; otherwise it leaves the workout open to finish on the phone. Discard on the watch: nothing goes to Health and no HR is sent. The phone clears the live session without saving, drops telemetry and deletes the diary session only if this live start created it (toast 'Couldn't delete workout' / 'It remains in your diary.' on failure); a discard for a re-armed session is ignored. Effort 1-10 on the watch summary: saved to Apple Health (watchOS 11+) and sent to the phone, which files it once the session is saved (waits up to 10 min). Preset question: only with New workout view and when the workout changed from its saved preset, the watch first sends 'waiting' (the phone holds its own prompt up to 10 min), then the wearer's answer update true/false, which the phone applies. Finish or discard on the phone sends workoutStop (with a discarded flag) so the watch ends its HealthKit session (discarded = not saved to Health, no summary).

**Data from the phone:** {type:'workoutStop', sessionId}; {type:'workoutDiscard', sessionId, armedAt? ms}; {type:'workoutEffort', sessionId, rating 1-10}; {type:'presetUpdateAnswer', sessionId, update, waiting}

**Data the watch sends or saves:** Phone->watch {type:'workoutStop', sessionId, stoppedAt ISO, discarded}. Server: finished_at, delete, effort, preset update.

**Settings:** The preset question requires New workout view.

**Capabilities:** Workout session end, Apple Health save, effort score. Garmin: ActivityRecording save/discard to Garmin Connect plus a summary screen.

**Code:** src/hooks/useWatchWorkoutBridge.ts:792-818, 939-1164, 1549-1610; src/stores/pendingPresetUpdateStore.ts:17; targets/watch/Infrastructure/WatchSessionManager.swift:1596-1630; targets/watch/Adapters/OutboundPayloads.swift:479-505; modules/watch-connectivity/ios/WatchConnectivityModule.swift:787-808; App.tsx:283-302

### Watch as remote + HR sensor for a phone GPS recording (types 'recordingState', 'recordingControl', 'recordingHeartRate')

While the phone records a walk, run or ride with its own GPS, the watch shows time, distance, pace, laps and the interval step, and can pause, resume, finish or lap. The phone sends: a durable state on every status change, which also launches the watch app in the matching workout type when status is 'recording' (walk/run outdoor or indoor, ride as outdoor cycling); a live-only refresh every 3 s while reachable; an immediate live update on each new interval step (the watch buzzes when intervalIndex changes); and 'ended' with discarded true/false when the recording leaves the store, so the watch saves or drops its Health workout. Watch controls carry the press time and act on the phone recording even with the recording screen closed. HR batches (deduped by clientId) are stored on the recording, and Apple zones go onto the saved entry.

**Data from the phone:** {type:'recordingControl', sessionId, action pause|resume|finish|lap, at ms}; {type:'recordingHeartRate', sessionId, clientId, samples[{t,bpm}], appleZones?}; liveHeartRate

**Data the watch sends or saves:** {type:'recordingState', sessionId, activity walk|run|ride, indoor?, status recording|paused|finished|ended, startedAt, pausedMs, pausedAt?, distanceMeters, paceSeconds?, distanceUnit km|mi, lapCount?, sentAt, intervalIndex?, intervalLabel?, intervalRemaining?, intervalNext?, discarded?}

**Settings:** Distance unit from the phone's default distance unit.

**Capabilities:** Heart rate sensor, workout session, remote launch, haptics. Garmin: watch app listens for phone state; no remote launch.

**Code:** src/hooks/useWatchRecordingBridge.ts:45-314; modules/watch-connectivity/ios/WatchConnectivityModule.swift:286-298, 711-731; targets/watch/Infrastructure/WatchSessionManager.swift:260-282; targets/watch/Adapters/OutboundPayloads.swift:275-307

### Start a watch-recorded walk/run from the phone (type 'runStart')

The Record screen shows 'Record with' Phone / Watch GPS (outdoor) or Phone / Watch (indoor) when a watch is paired and supported (not for rides or fitness tests). Hints: outdoor 'Your watch records it with its own GPS and heart rate sensor. Your phone can stay behind.'; indoor 'Your watch counts steps and estimates the distance. Correct it to the treadmill's figure afterwards.' Options: saved route (outdoor), interval/program plan, auto-pause, voice cues, check-in minutes, pace band, HR band. The route detail screen also has 'Start on your watch' (Run/Walk, outdoor; follows the route and buzzes at each turn). The phone sends the request queued + live, launches the watch app in the right activity, and opens the 'On your watch' screen showing 'Starting on your watch...' (pending up to 90 s). The watch ignores requests older than 2 minutes.

**Data from the phone:** None.

**Data the watch sends or saves:** {type:'runStart', requestId, kind run|walk, place indoor|outdoor, requestedAt ms, autoPause?, voiceCues?, checkInMinutes?, paceMin?, paceMax? (s/km), hrMin?, hrMax?, plan?{id,name,programId?,programIndex?,activity?,startText?,doneText?,steps[...]}, route?{id,name,points (1e-6 deg, max 2000), cues[{index,kind,text?}]}}

**Settings:** Record screen switches (phone-local recording preferences).

**Capabilities:** GPS, workout session, remote launch. Garmin: the person opens the app; the phone then sends the request.

**Code:** src/services/watchRunControl.ts:16-75; src/screens/RecordActivityScreen.tsx:289-306, 751-791, 1354-1418; src/screens/RouteDetailScreen.tsx:128-168; modules/watch-connectivity/ios/WatchConnectivityModule.swift:733-748; src/stores/watchRunLiveStore.ts:42

### Live view and remote control of a wrist run on the phone (types 'runLive', 'runControl')

While reachable the watch sends live figures at most every 2 s (immediately on a status change), never queued. The phone's 'On your watch' screen shows: title Run/Walk/Jump Rope on your watch; status (Auto-paused / Paused / Running...); interval step and 'Next:'; Distance, Avg pace, Heart rate, Energy, Laps. Buttons: Pause/Resume, Lap, Discard (confirm 'Discard this activity?'), Finish. Switches: Auto-pause, Voice cues, Pace alert (not for jump rope), Heart-rate alert. Each tap sends a queued + live control with a unique controlId, applied once. Error toast 'Could not reach your watch'. The run is hidden after 20 s without updates. The active-workout bar also shows the wrist run.

**Data from the phone:** {type:'runLive', runId, kind, place, status, autoPaused, autoPause, voiceCues, paceAlert, heartRateAlert, elapsed, distanceMeters, heartRate?, energyKcal, lapCount, stepLabel?, stepRemaining?, nextLabel?, sentAt, requestId?}

**Data the watch sends or saves:** {type:'runControl', runId, action pause|resume|lap|finish|discard|autoPauseOn|autoPauseOff|voiceCuesOn|voiceCuesOff|paceAlertOn|paceAlertOff|heartRateAlertOn|heartRateAlertOff, controlId}

**Settings:** None.

**Capabilities:** Live messaging. Garmin: same while connected.

**Code:** src/hooks/useWatchRunBridge.ts:84-104; src/screens/WatchRunLiveScreen.tsx:40-380; src/stores/watchRunLiveStore.ts:10, 153-202; src/services/watchRunControl.ts:77-98; src/hooks/useWatchRunBarContent.tsx; targets/watch/Infrastructure/WatchSessionManager.swift:284-293, 761-766; targets/watch/Adapters/OutboundPayloads.swift:349-406

### Spoken cues through the phone's headphones (types 'runCue', 'runCueAck')

During a wrist run the watch asks the phone to speak each cue (splits, check-ins, step changes, route turns) so it plays through the phone's headphones. If the phone is not reachable, the watch speaks the cue itself. Otherwise the phone acks live at once and speaks it with TTS (interrupt cues speak now and clear the queue; others wait their turn). If no ack arrives within 2 s, or the send fails, the watch speaks it itself. The language tag picks the voice; empty means the app language.

**Data from the phone:** {type:'runCue', id, text, interrupt, language}

**Data the watch sends or saves:** {type:'runCueAck', id} (live only)

**Settings:** Voice cues switch (runVoiceCues / per-run voiceCues).

**Capabilities:** TTS on phone and watch, audio routing. Garmin: most watches have no TTS; relay to the phone or use tones.

**Code:** src/hooks/useWatchRunBridge.ts:106-125; src/services/watchRunCueRelay.ts:1-69; targets/watch/Infrastructure/WatchSessionManager.swift:295-327, 759-760; modules/watch-connectivity/ios/WatchConnectivityModule.swift:779-785

### Filing a finished wrist walk/run/jump rope into the diary (types 'runFinished', 'runEffort')

When the watch finishes a run it sends it through the queued door. If the session is not yet active, the run goes to a persisted outbox file that is flushed on activation; if it cannot be kept, the recovery snapshot stays. Phone native keeps up to 50 runs (deduped by clientId) in a file until JS acks them. JS validates the kind (walk|run|jumpRope), stores it in an AsyncStorage queue and files it when connected: an exercise entry (date/time, duration, distance, cadence/stride when measurable), GPS route with km/mi or lap splits (outdoor), or laps and a distance series (indoor), HR series, active kcal and Apple zones. It also ticks off a completed program workout and learns the treadmill distance factor and stride when a corrected distance was entered on the wrist. If steps reached Apple Health late, cadence/stride are measured again (every 15 min, sweep every 30 min over the last 3 days, gives up after 3 days). Dedupe: a done list of 50. Retries after 30 s for offline/5xx/401/408/429; other 4xx are dropped. Toast 'Run/Walk/Jump Rope from your watch saved' with distance and time; tapping it opens the run summary. Effort 1-10 from the watch is saved on the entry and its program workout (kept up to 7 days while waiting for the run).

**Data from the phone:** {type:'runFinished', clientId, kind, place, startedAt ms, endedAt ms, activeSeconds, distanceMeters, activeEnergyKcal, route (<= 1500 pts), heartRate (<= 600), laps, lapDistances, distanceSeries (<= 300), planCompleted, distanceScale, estimatedDistanceMeters?, steps?, planId?, programId?, programIndex?, appleZones?}; {type:'runEffort', clientId, rating}

**Data the watch sends or saves:** Server exercise entry + GPS track/laps/distance series/telemetry, run program progress, effort.

**Settings:** Split unit from the phone's distance preference (waits for preferences to load).

**Capabilities:** GPS, workout session, background, Apple Health. Garmin: the FIT activity reaches Garmin Connect by itself; the app would also send a summary to the phone for SparkyFitness.

**Code:** src/hooks/useWatchRunBridge.ts:127-237; src/services/watchRunQueue.ts:32-44, 370; src/services/watchRunSave.ts:69-211; src/services/watchRunToast.ts:24-94; src/services/pendingWatchForm.ts:20-32; modules/watch-connectivity/ios/WatchConnectivityModule.swift:261-269, 879-906, 1220-1258; targets/watch/Infrastructure/WatchSessionManager.swift:329-367; targets/watch/Adapters/OutboundPayloads.swift:418-466

### Route library on the watch (types 'routeSync', 'routeRemove', 'routeLibrary')

From a saved route's detail screen the person sends it to the watch (queued only; toast 'Sent to your watch') or removes it. The watch keeps up to its capacity (default 10), stores the newest updatedAt, and reports its library after every change and on activation (sent through the watch's transfer door). The phone also keeps the latest report natively for a listener that attaches late. Status shown on the phone: 'Sent. Waiting for your watch to confirm.', 'On your watch', 'Out of date, send again', or library full / storage error. Removing a route not known to be on the watch sends nothing. Routes are thinned to 2000 points.

**Data from the phone:** {type:'routeLibrary', routes[{id,updatedAt}], rejected[{id, reason full|storage}], capacity, sentAt}

**Data the watch sends or saves:** {type:'routeSync', route{id,name,points,cues}, updatedAt}; {type:'routeRemove', routeId}

**Settings:** None; needs a paired watch.

**Capabilities:** Storage on the watch, GPS navigation with a buzz at each turn. Garmin: courses via Garmin Connect or app storage; navigation APIs are limited.

**Code:** src/services/watchRouteSync.ts:1-44; src/hooks/useWatchRouteBridge.ts:1-28; src/hooks/useWatchRouteStatus.ts:1-17; src/utils/watchRouteSync.ts:18-32; src/utils/watchRoute.ts:12; src/screens/RouteDetailScreen.tsx:92-190; modules/watch-connectivity/ios/WatchConnectivityModule.swift:589-612, 750-766, 873-878; targets/watch/Adapters/OutboundPayloads.swift:327-347

### Watch-side resend and retry rules

On activation, in order: flush sends made before activation, flush the persisted run outbox, report the route library, re-apply the context the OS holds, resend pending check-ins, recover a live workout, send a stored set completion, resend queued water taps, water deletes and medication ticks (same clientIds), then request a context. When the phone becomes reachable: resend check-ins, water taps/deletes and medication ticks, then request a context. When the app appears: re-apply context, request context, resend the same pending items, refresh complications. Failed items (ack false / failedClientIds) are retried by the wearer under the same id. Only one queued context request at a time. NOT resent: fast start/end requests, workout edits, set timers, rest changes and set completions after a successful handoff (all rely on the OS queue once accepted). Live-only data (live HR, runLive, cue relay) is dropped when unreachable. Minute HR batches and finished runs are queued.

**Data from the phone:** Activation, reachability and app-appear events.

**Data the watch sends or saves:** Resends of checkIn, waterIntake, waterDelete, medicationTaken, setCompleted (stored one), runFinished (outbox), routeLibrary, requestContext.

**Settings:** None.

**Capabilities:** OS-managed queue. Garmin: implement a persisted outbox with resend on connect (and on app start), plus clientId dedupe on the phone.

**Code:** targets/watch/Infrastructure/WatchSessionManager.swift:1773-1813, 417-557, 1507-1524, 632-655; targets/watch/Presentation/ContentView.swift:70-85
