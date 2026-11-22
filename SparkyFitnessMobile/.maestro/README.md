# Maestro flows (local kit)

[Maestro](https://maestro.dev) drives the installed app on a real phone, an emulator or an
iOS simulator from YAML flows, so the checks we repeat by hand on each device can run with one
command. The CLI and Maestro Studio are free and open source; nothing here needs a Maestro
account or Maestro Cloud.

Status: a local kit, written against Maestro CLI 2.12.1. It is not wired into CI. The flows
select elements by their English text, because the app has almost no test IDs on the screens
they visit yet (see "Toward the project"). Android first; iOS is blocked for now (see "iOS").

## What is here

| Path                                         | What it does                                                                                                                          | Safe on your everyday build?                           |
| -------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------ |
| `flows/smoke-tabs.yaml`                      | Every tab, the + sheet and Calorie Settings open without an error boundary; a screenshot of each.                                     | Yes: no clearState, no data, no permission changes     |
| `flows/add-sheet-android-back.yaml`          | Android Back inside the + sheet: sub-menu, main menu, closed, app still open (#2868).                                                 | Yes                                                    |
| `flows-data/food-log.yaml`                   | Creates a uniquely named food through the API, logs it from + → Food, finds it in the Diary, deletes it again (also after a failure). | Writes to the signed-in account: test account only     |
| `flows-clean-install/first-run-api-key.yaml` | Clean install: Onboarding, API key sign-in, tabs.                                                                                     | No: wipes the app under test. Separate test build only |
| `subflows/`                                  | Launch, first-run overlays, error-boundary check, + sheet, API key sign-in.                                                           | —                                                      |
| `scripts/`                                   | API seed and cleanup, and a guard that refuses to wipe the store or everyday app.                                                     | —                                                      |

`maestro test .maestro` runs only `flows/` (see `config.yaml`). The other folders run by path.

## Setup

Check each item before installing anything; most machines that build the app already have
some of them.

1. **Java 17 or newer** (17 or 21 recommended): `java -version`. Maestro uses `JAVA_HOME` if it
   is set, otherwise `java` on `PATH`. Gradle uses `JAVA_HOME` too, so if it already points to a
   JDK 17 or 21, leave it. Android Studio ships one in its `jbr` folder.
2. **adb** (Android SDK platform-tools): `adb version`. Android Studio installs it under
   `%LOCALAPPDATA%\Android\Sdk\platform-tools` (Windows) or `~/Library/Android/sdk/platform-tools`
   (macOS).
3. **Maestro CLI**: `maestro --version`.
   - Windows (runs natively; Maestro discourages WSL): download
     `https://github.com/mobile-dev-inc/maestro/releases/download/cli-2.12.1/maestro.zip`, extract it,
     and add its `maestro\bin` folder to the user `PATH`.
   - macOS / Linux: `export MAESTRO_VERSION=2.12.1; curl -Ls "https://get.maestro.mobile.dev" | bash`.
   - Optional: set `MAESTRO_CLI_NO_ANALYTICS=1`; the CLI sends anonymous usage analytics by
     default.
   - Optional: [Maestro Studio](https://maestro.dev) (desktop app) to inspect screens and record
     steps.
4. **A device** with USB debugging: `adb devices` must list it as `device` (not `unauthorized`).
   Xiaomi / HyperOS: in Developer options also turn on **Install via USB** and **USB debugging
   (Security settings)** (needs a Mi account and a reboot). Without them, installing Maestro's
   driver or injecting taps fails. These come from general adb tooling, not from Maestro's docs.
5. **The app**, installed and signed in to a server:
   `adb shell pm list packages | grep -i sparky` (PowerShell: `| Select-String -Pattern sparky`).
   The development build is `org.SparkyApps.SparkyFitnessMobile1.dev`; the store build is
   `com.SparkyApps.SparkyFitnessMobile`.
6. **English for the app only** (the flows match English text). First note the current value,
   then set it (Android 13+):
   ```sh
   adb shell cmd locale get-app-locales org.SparkyApps.SparkyFitnessMobile1.dev
   adb shell cmd locale set-app-locales org.SparkyApps.SparkyFitnessMobile1.dev --locales en-US
   ```
   Switch back later in the app's Settings → App, or with the same command and the old value.
7. **Development build only**: Metro running (`pnpm start` in `SparkyFitnessMobile/`) and, for a
   USB phone, `adb reverse tcp:8081 tcp:8081`. A Release build needs neither.
8. Optional, for steadier runs: turn animations off and note the old values to restore them:
   `adb shell settings get global window_animation_scale` (also `transition_animation_scale` and
   `animator_duration_scale`), then `adb shell settings put global <name> 0`.

## Running

From `SparkyFitnessMobile/`:

```sh
maestro test .maestro --device <serial> -e APP_ID=org.SparkyApps.SparkyFitnessMobile1.dev \
  --test-output-dir .maestro-results
```

- One flow: `maestro test .maestro/flows/smoke-tabs.yaml --device <serial> -e APP_ID=...`
- Windows: add `--no-ansi` (`maestro --no-ansi test ...`), which avoids slow console output,
  and keep `:`, `>`, `?` and `|` out of flow names.
- After the first run on a device, `--no-reinstall-driver` skips reinstalling Maestro's two
  helper apps each time.
- What Maestro sees on screen right now: `maestro hierarchy --device <serial>`.
- Screenshots and logs land in `.maestro-results/` (ignored by git). Do not attach them to a
  public issue or PR without looking: they can show account data.

### Keeping the kit while you work on other branches

The flows test the installed app, not the checked-out code, so they can live in a second
worktree that stays on this branch:

```sh
git worktree add ../SparkyFitness-maestro <this branch>
maestro test ../SparkyFitness-maestro/SparkyFitnessMobile/.maestro --device <serial> -e APP_ID=...
```

## Data flows

`flows-data/food-log.yaml` needs a test account on your server and a full-access API key of
that same account (web app → Settings). The app must be signed in to that account.

```sh
maestro test .maestro/flows-data/food-log.yaml --device <serial> \
  -e APP_ID=org.SparkyApps.SparkyFitnessMobile1.dev \
  -e SERVER_URL=<server as this computer reaches it> -e API_KEY=<key>
```

The API calls run on the computer, so `SERVER_URL` is the address the computer uses. Pass the key
from an environment variable rather than typing it into a shared terminal history.

## Clean-install flows

`flows-clean-install/` starts with `clearState`, which deletes the app's data: saved servers,
offline workouts not yet uploaded, local settings. `scripts/guard-test-app.js` refuses to run
against `com.SparkyApps.SparkyFitnessMobile` and `org.SparkyApps.SparkyFitnessMobile1.dev`.

1. **A separate test app.** Build a Release app with its own id, next to your other installs:
   ```sh
   EXPO_DEV_BUNDLE_IDENTIFIER=org.SparkyApps.SparkyFitnessMobile1.e2e pnpm android:release:clean
   ```
   (PowerShell: `$env:EXPO_DEV_BUNDLE_IDENTIFIER = '...'` first.) Release avoids the dev client
   launcher, which a wiped dev build would show. Switching back to your everyday dev build needs
   a new prebuild (`pnpm run prebuild` without that variable).
2. **HTTPS.** Builds without `__DEV__` refuse `http://` server URLs. Without changing the app:
   run [Caddy](https://caddyserver.com) with `tls internal` in front of the server (for example a
   `localhost:8443` site with `reverse_proxy localhost:3010`), install Caddy's root certificate on
   the phone as a user CA (Android release builds trust user CAs), run
   `adb reverse tcp:8443 tcp:8443`, and use `SERVER_URL=https://localhost:8443`.
3. **An API key** (full access) of a test account.

```sh
maestro test .maestro/flows-clean-install --device <serial> \
  -e APP_ID=org.SparkyApps.SparkyFitnessMobile1.e2e -e SERVER_URL=https://localhost:8443 -e API_KEY=<key>
```

## Writing flows

- Keep flows in `flows/` safe for an everyday build: no `clearState`, no data, and
  `permissions: {}` on `launchApp` (Maestro grants every permission on launch otherwise).
- Use variables (`-e`) for app ids, URLs and keys; never commit credentials, personal URLs or
  screenshots of real accounts. Give `inputText` of a secret a `label`, or the value is logged.
- Tap tabs with `index: -1` (the bottom-most match): "Dashboard" and "Diary" are also Settings
  rows and screen titles. Select + sheet items `below: 'Quick Actions'` with `index: 0`: "Food"
  and "Exercise" also appear on the Dashboard behind the sheet.
- No coordinate taps. Use `takeScreenshot` for review; `assertScreenshot` baselines only hold
  for one device and resolution.
- Run `pnpm exec prettier --write .maestro` before committing: `pnpm run validate` checks this
  folder's formatting.

## Troubleshooting

- "Failed to activate device" on a physical phone (a Maestro known issue, more common on Redmi):
  in Developer options reset to defaults, turn off permission monitoring, then turn USB
  debugging and the options above back on.
- Taps or typing do nothing on a Xiaomi: turn on USB debugging (Security settings) and reboot.
- The flow waits on the dev client launcher: Metro is not running or not reachable from the
  phone (`adb reverse tcp:8081 tcp:8081`).
- A step taps the wrong element: run `maestro hierarchy`, then add `index`, `below` or a
  more specific text.

## iOS

Maestro runs iOS flows on simulators only; physical iPhones are not supported. On iOS the app's
screens are probably invisible to Maestro today: `App.tsx` wraps the always-mounted toast in
react-native-screens' `FullWindowOverlay`, whose container is marked modal for accessibility by
default, which hides its sibling views (the whole app) from XCUITest and likely from VoiceOver.
Passing `unstable_accessibilityContainerViewIsModal={false}` to that overlay is the first thing
to try; it is not yet verified on a simulator. Check with `maestro hierarchy` on the Onboarding
screen before writing iOS flows. The `config.yaml` key `snapshotKeyHonorModalViews` is an
unconfirmed fallback, and `maestro hierarchy` ignores it.

## Toward the project

Before proposing these flows for everyone:

1. **Test IDs** on the screens the flows visit, so they stop depending on English text: tab
   buttons (`tabBarButtonTestID`, forwarded by `CustomTabBar`), Onboarding fields and buttons,
   - sheet items (`add-menu-item-<key>`), Settings rows (`SettingsRow` already takes `testID`),
     the FoodSearch input and result rows, the food entry footer button, the error-boundary
     fallbacks and the announcement buttons. Put ids on the touchable itself, not on inner text.
2. **The iOS overlay change** above, as its own fix (it also affects VoiceOver).
3. **Docs**: `SparkyFitnessMobile/AGENTS.md`, `agent-docs/testing-patterns.md`, `CONTRIBUTING.md`
   and `.agents/skills/simulator-testing/SKILL.md`.
4. **CI**: an Android emulator job on GitHub-hosted Linux runners (free for public repos), with
   the server and Postgres in the job, nightly or on a PR label. It needs an HTTPS answer for
   Release builds and measured run times first.
