# Maestro flows (local kit)

[Maestro](https://maestro.dev) drives the installed app on a real phone, an emulator or an
iOS simulator from YAML flows, so the checks we repeat by hand on each device can run with one
command. The CLI and Maestro Studio are free and open source; nothing here needs a Maestro
account or Maestro Cloud.

Status: a local kit, written against Maestro CLI 2.12.1. It is not wired into CI. The flows
select elements by their English text, because the app has almost no test IDs on the screens
they visit yet (see "Toward the project"). Android first; iOS is blocked for now (see "iOS").

## What is here

| Path                                         | What it does                                                                                                   | Safe on your everyday build?                           |
| -------------------------------------------- | -------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------ |
| `flows/smoke-tabs.yaml`                      | Every tab, the + sheet and Calorie Settings open without an error-boundary message; a screenshot of each.      | Yes (see below)                                        |
| `flows/add-sheet-android-back.yaml`          | Android Back inside the + sheet: sub-menu, main menu, closed, app still open (#2868).                          | Yes (see below)                                        |
| `flows-data/food-log.yaml`                   | Creates a uniquely named food through the API, logs it from + → Food, finds it in the Diary, deletes it again. | Writes to the signed-in account: test account only     |
| `flows-clean-install/first-run-api-key.yaml` | Clean install: Onboarding, API key sign-in, tabs.                                                              | No: wipes the app under test. A `.e2e` test build only |
| `subflows/`                                  | Launch, announcement, error-boundary check, + sheet, API key sign-in.                                          | —                                                      |
| `scripts/`                                   | API seed and cleanup, and a guard that refuses to wipe anything but a `.e2e` build.                            | —                                                      |

`maestro test .maestro` runs only `flows/` (see `config.yaml`). The other folders run by path.

"Safe" means: no clearState, no data written, permissions left as they are (`permissions: {}`).
The flows still force-stop the app when they launch it, so finish any workout or run recording
first, and they dismiss the current announcement for good. The smoke flow checks that no
error-boundary message shows; it does not yet prove each tab's content loaded.

## Setup

Check each item before installing anything; most machines that build the app already have
some of them.

1. **Java 17 or newer** (17 or 21 recommended). Maestro uses `JAVA_HOME` when it is set, otherwise
   `java` on `PATH`, so check the one it will use: `java -version` and, if `JAVA_HOME` is set,
   `& "$env:JAVA_HOME\bin\java.exe" -version` (PowerShell). Gradle uses `JAVA_HOME` too: if it
   already points to a JDK 17 or newer, leave it. Android Studio ships one in its `jbr` folder;
   setting `$env:JAVA_HOME` to it in one terminal only changes nothing on the machine.
2. **adb** (Android SDK platform-tools): `adb version`. Android Studio installs it under
   `%LOCALAPPDATA%\Android\Sdk\platform-tools` (Windows) or `~/Library/Android/sdk/platform-tools`
   (macOS). `ANDROID_HOME` is only needed for emulators.
3. **Maestro CLI**: `maestro --version`.
   - Windows (runs natively; Maestro discourages WSL), PowerShell:
     ```powershell
     $ProgressPreference = 'SilentlyContinue'   # the progress bar makes the download very slow
     $dest = "$env:LOCALAPPDATA\Programs\maestro-2.12.1"
     Invoke-WebRequest https://github.com/mobile-dev-inc/maestro/releases/download/cli-2.12.1/maestro.zip -OutFile "$env:TEMP\maestro-2.12.1.zip"
     Expand-Archive "$env:TEMP\maestro-2.12.1.zip" -DestinationPath $dest
     $old = [Environment]::GetEnvironmentVariable('Path', 'User')   # keep this to undo
     [Environment]::SetEnvironmentVariable('Path', "$old;$dest\maestro\bin", 'User')
     $env:Path += ";$dest\maestro\bin"                                # this terminal
     ```
     Do not use `setx` for `PATH` (it can truncate it). Other terminals, including VS Code's,
     see the change only after a restart. Undo: set `Path` back to `$old` and delete `$dest`.
   - macOS / Linux: `export MAESTRO_VERSION=2.12.1; curl -Ls "https://get.maestro.mobile.dev" | bash`.
   - Optional: set `MAESTRO_CLI_NO_ANALYTICS=1` before the first `maestro` command; the CLI sends
     anonymous usage analytics by default.
   - Optional: [Maestro Studio](https://maestro.dev) (desktop app) to inspect screens and record
     steps.
4. **A device** with USB debugging: `adb devices` must list it as `device` (not `unauthorized`).
   Pass its serial to every command (`adb -s <serial>`, `maestro --device <serial>`).
   Xiaomi / HyperOS: in Developer options also turn on **Install via USB** and **USB debugging
   (Security settings)** (needs a Mi account and a reboot). Without them, installing Maestro's
   helper apps or injecting taps fails. These come from general adb tooling, not from Maestro's
   docs.
5. **The app**, installed and signed in to a server:
   `adb -s <serial> shell pm list packages | Select-String -Pattern sparky` (macOS: `| grep -i sparky`;
   the on-device filter is case-sensitive). The development build is
   `org.SparkyApps.SparkyFitnessMobile1.dev`; the store build is `com.SparkyApps.SparkyFitnessMobile`.
6. **English for the app under test** (the flows match English text). First note the current
   value, then set it (Android 13+):
   ```sh
   adb -s <serial> shell cmd locale get-app-locales <package>
   adb -s <serial> shell cmd locale set-app-locales <package> --locales en-US
   ```
   To restore it, run the same command with the old value, or without `--locales` if it was
   empty (`[]`, follow the system), or switch it in the app's Settings → App.
7. **Development build only**: Metro running (`pnpm start` in `SparkyFitnessMobile/`) and, for a
   USB phone, `adb -s <serial> reverse tcp:8081 tcp:8081`. A Release build needs neither.
8. Optional, for steadier runs: turn animations off and note the old values to restore them:
   `adb -s <serial> shell settings get global window_animation_scale` (also
   `transition_animation_scale` and `animator_duration_scale`), then
   `adb -s <serial> shell settings put global <name> 0`.
9. **Check that Maestro reaches the phone** before the first flow: keep the phone unlocked, run
   `maestro --device <serial> hierarchy` (`--device` goes before `hierarchy`) and accept the two
   install prompts on the phone (Maestro's helper apps `dev.mobile.maestro` and
   `dev.mobile.maestro.test`). A list of screen elements means it works. Each normal run installs
   and removes them again, so the prompts come back; `--no-reinstall-driver` keeps them installed
   (remove later with `adb -s <serial> uninstall dev.mobile.maestro` and `... dev.mobile.maestro.test`).

## Running

From `SparkyFitnessMobile/`:

```sh
maestro --no-ansi test .maestro --device <serial> -e APP_ID=org.SparkyApps.SparkyFitnessMobile1.dev \
  --test-output-dir .maestro-results --debug-output .maestro-results
```

- One flow: `maestro test .maestro/flows/smoke-tabs.yaml --device <serial> -e APP_ID=... --test-output-dir .maestro-results --debug-output .maestro-results`
- `--no-ansi` avoids slow console output on Windows. Keep `:`, `>`, `?` and `|` out of flow names.
- What Maestro sees on screen right now: `maestro --device <serial> hierarchy`.
- Always pass `--test-output-dir .maestro-results --debug-output .maestro-results` (ignored by
  git). Without `--debug-output`, Maestro's own log still goes to `~/.maestro/tests` even when
  `--test-output-dir` is set. Screenshots can show account data: look before you share them.

### Keeping the kit while you work on other branches

The flows test the installed app, not the checked-out code, so they can live in a second,
detached worktree next to the repo. From the repo root:

```sh
git fetch origin test/maestro-local-kit
git worktree add --detach ../SparkyFitness-maestro origin/test/maestro-local-kit
cd ../SparkyFitness-maestro/SparkyFitnessMobile
maestro --no-ansi test .maestro --device <serial> -e APP_ID=... \
  --test-output-dir .maestro-results --debug-output .maestro-results
```

Update it with `git fetch origin test/maestro-local-kit` and
`git -C ../SparkyFitness-maestro checkout --detach origin/test/maestro-local-kit`; remove it with
`git worktree remove ../SparkyFitness-maestro` (all from the repo root).

## Secrets

Maestro writes every `-e` value, `API_KEY` included, in plain text into the run's
`commands.json` and `maestro.log`. A `label` on `inputText` only changes the console line. So:

- Use a key of a **test account** that you can revoke, never of your real account.
- Always pass `--test-output-dir .maestro-results --debug-output .maestro-results`, and delete
  the run's folders there after a run that had `API_KEY` (if you forgot `--debug-output`, also the
  newest folder in `~/.maestro/tests`). Never add `--verbose`, which prints those lines, key
  included. Never attach a run folder or those files to an issue or PR.
- Do not type the key on the command line. Read it into a variable first:
  PowerShell 7: `$env:SPARKY_E2E_API_KEY = Read-Host 'API key' -MaskInput`;
  Windows PowerShell 5.1: `$env:SPARKY_E2E_API_KEY = [Net.NetworkCredential]::new('', (Read-Host 'API key' -AsSecureString)).Password`.
  Then pass `-e "API_KEY=$env:SPARKY_E2E_API_KEY"`.

## Data flows

`flows-data/food-log.yaml` needs a test account on your server and a full-access API key of
that same account (web app → Settings). The app under test must be signed in to that account,
and FoodSearch's ownership filter (menu on the search screen) must be All or Mine.

```powershell
maestro --no-ansi test .maestro/flows-data/food-log.yaml --device <serial> -e APP_ID=<package> `
  -e SERVER_URL=<server as this computer reaches it> -e "API_KEY=$env:SPARKY_E2E_API_KEY" `
  --test-output-dir .maestro-results
```

The API calls run on the computer, so `SERVER_URL` is the address the computer uses. The food is
deleted with its diary entry when the flow ends, also after a failed step, but not after Ctrl+C
or a killed run: then delete the "Maestro Oats …" food by hand (Library → Foods → the food →
Delete → Delete including history; a plain Delete keeps the diary entry).

## Clean-install flows

`flows-clean-install/` starts with `clearState`, which deletes the app's data: saved servers,
offline workouts not yet uploaded, local settings. `scripts/guard-test-app.js` refuses any
`APP_ID` that does not end in `.e2e`. Prefer an Android emulator over your everyday phone.

1. **A separate test app.** Build a Release app with its own id. In the main checkout it builds
   the code you are testing; from the detached worktree above (after `pnpm install` at its root)
   it leaves your main `android/` folder alone but builds the app as of the kit commit:
   ```powershell
   $env:EXPO_DEV_BUNDLE_IDENTIFIER = 'org.SparkyApps.SparkyFitnessMobile1.e2e'; pnpm android:release:clean; Remove-Item Env:EXPO_DEV_BUNDLE_IDENTIFIER
   ```
   Release avoids the dev client launcher, which a wiped dev build would show. Its launcher name is
   the same as the dev build's (DevSparkyFitness). If you built it in the main checkout, run
   `pnpm run prebuild` before your next everyday build, or that build becomes `.e2e` too. Never
   sign the test app in to a real account.
2. **English for the test app**: README Setup step 6 with `org.SparkyApps.SparkyFitnessMobile1.e2e`.
   Check it again after the first run, in case clearing the app resets it.
3. **HTTPS.** Builds without `__DEV__` refuse `http://` server URLs. Without changing the app:
   run [Caddy](https://caddyserver.com) in front of the server with its internal CA, without
   installing that CA on the computer:
   ```
   {
     skip_install_trust
   }
   localhost:8443 {
     tls internal
     reverse_proxy localhost:3010
   }
   ```
   Install Caddy's root certificate on the device as a user CA (Android release builds trust user
   CAs), run `adb -s <serial> reverse tcp:8443 tcp:8443`, and use `SERVER_URL=https://localhost:8443`.
   Remove the CA afterwards (Android: Settings → Security → Encryption & credentials → User
   credentials); it is trusted by every SparkyFitness build on that device while it is there.
4. **An API key** (full access) of a test account, read as in "Secrets".

```powershell
maestro --no-ansi test .maestro/flows-clean-install --device <serial> `
  -e APP_ID=org.SparkyApps.SparkyFitnessMobile1.e2e -e SERVER_URL=https://localhost:8443 `
  -e "API_KEY=$env:SPARKY_E2E_API_KEY" --test-output-dir .maestro-results --debug-output .maestro-results
```

## Writing flows

- Keep flows in `flows/` free of clearState and data writes, and use `permissions: {}` on
  `launchApp` (Maestro grants every permission on launch otherwise).
- Use variables (`-e`) for app ids, URLs and keys; never commit credentials, personal URLs or
  screenshots of real accounts.
- Tap tabs with `index: -1` (the bottom-most match): "Dashboard" and "Diary" are also Settings
  rows and screen titles. + sheet items are selected `below: 'Quick Actions'` with `index: 0`:
  "Food" and "Exercise" also appear on the Dashboard behind the sheet, and this narrows the
  overlap without ruling it out, so check where each tap led. Test IDs are the real fix.
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
  phone (`adb -s <serial> reverse tcp:8081 tcp:8081`).
- A dev build shows a yellow or red LogBox bar at the bottom: it covers the tab bar, so taps land
  on it. Dismiss it, or reload from Metro, before running, or use a Release build.
- A step taps the wrong element: run `maestro --device <serial> hierarchy`, then add `index`,
  `below` or a more specific text.

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

1. **Test IDs** on the screens the flows visit, so they stop depending on English text, first on
   the + sheet items (`add-menu-item-<key>`) and its Done button, then the tab buttons
   (`tabBarButtonTestID`, forwarded by `CustomTabBar`), each tab screen's root (so the smoke flow
   can prove the tab loaded), Onboarding fields and buttons, Settings rows (`SettingsRow` already
   takes `testID`), the FoodSearch input and result rows, the food entry footer button, the
   error-boundary fallbacks and the announcement buttons. Put ids on the touchable itself, not
   on inner text.
2. **The iOS overlay change** above, as its own fix (it also affects VoiceOver).
3. **Docs**: `SparkyFitnessMobile/AGENTS.md`, `agent-docs/testing-patterns.md`, `CONTRIBUTING.md`
   and `.agents/skills/simulator-testing/SKILL.md`.
4. **CI**: an Android emulator job on GitHub-hosted Linux runners (free for public repos), with
   the server and Postgres in the job, nightly or on a PR label. It needs an HTTPS answer for
   Release builds, a way to pass a test key without storing it in artifacts, and measured run
   times first.
