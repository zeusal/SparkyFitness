# Agent setup checklist

Paste this into a coding agent running on the machine that will run the flows. It installs nothing without asking.

---

Set up Maestro on this Windows machine so I can run the SparkyFitness mobile UI flows locally against my Android phone. Work one step at a time, and stop and ask me whenever something is unclear or the choice is mine.

## Context

- This workspace is my SparkyFitness clone. The Maestro kit is on branch `test/maestro-local-kit` of my fork (remote `origin`), in `SparkyFitnessMobile/.maestro/`. Its `README.md` is the source of truth for setup, running and troubleshooting. Read it first without switching branches:
  `git fetch origin test/maestro-local-kit` and then `git show origin/test/maestro-local-kit:SparkyFitnessMobile/.maestro/README.md`.
- Shell: PowerShell. Phone: a Xiaomi on HyperOS, connected over USB. I already build and run the app from this repo (`pnpm run android -- --device`).

## Rules

1. **Look before you change.** For every prerequisite, first find out what is already installed, where and which version: `java -version`, `$env:JAVA_HOME`, `where.exe java`, `adb version`, `where.exe adb`, `$env:ANDROID_HOME`, `maestro --version`, `where.exe maestro`, `git --version`, `node -v`, `pnpm -v`. Then show me a short table: item, what you found (path and version), what the kit needs, and OK / missing / needs attention. Do not install anything before I have seen it.
2. **Ask before any change to my machine.** Never install, upgrade or uninstall software, and never change environment variables (`PATH`, `JAVA_HOME`, `MAESTRO_*`) without my explicit yes. When you ask, give the exact command, say what it changes, and say how to undo it. Ask one question at a time when the answers depend on each other.
3. **Java.** The kit needs Java 17 or newer (17 or 21 recommended). If `JAVA_HOME` already points to a JDK 17 or newer, leave it alone: Gradle uses it for my Android builds. If Java is missing or older than 17, ask me which option I want (Android Studio's bundled JBR, or installing Temurin 17) before doing anything.
4. **Maestro.** Use CLI version 2.12.1, the version the kit was written against, installed as the README describes, unless I say otherwise. If a different version is already installed, tell me and ask whether to keep it. Ask me whether to set `MAESTRO_CLI_NO_ANALYTICS=1`.
5. **Getting the kit.** Do not touch my current branch or working tree. Propose a separate git worktree (default folder `..\SparkyFitness-maestro`, local branch `test/maestro-local-kit` tracking `origin/test/maestro-local-kit`) and ask before creating it. Never stash, reset, clean or check out anything in my main working tree.
6. **The phone.** Run `adb devices`: it must show the phone as `device`, not `unauthorized` or `offline`. If more than one device is listed, ask me which one and pass its serial with `-s` and `--device` from then on. You cannot reliably check the Xiaomi developer options, so ask me to confirm that USB debugging, Install via USB and USB debugging (Security settings) are on. List the installed SparkyFitness packages (`adb shell pm list packages`, filtered for "sparky") and ask me which one to test. Never use `com.SparkyApps.SparkyFitnessMobile` (the store app) for anything that clears data.
7. **Phone settings.** Before changing anything on the phone (the app's language, the animation scales, `adb reverse`), read and show me the current value so it can be restored, ask me, and only then change it. At the end, give me the exact commands to put each one back.
8. **My processes.** Do not start Metro, the server or an app build yourself. Ask me to start them in my own terminal and to tell you when they are ready. You may run `adb reverse tcp:8081 tcp:8081` after asking.
9. **First run, safe flows only.** Run only the default suite, from the worktree: `maestro --no-ansi test <worktree>\SparkyFitnessMobile\.maestro --device <serial> -e APP_ID=<package> --test-output-dir <worktree>\SparkyFitnessMobile\.maestro-results`. Do not run `flows-data/` or `flows-clean-install/` unless I ask: the first writes data to the signed-in account, the second wipes the app.
10. **Secrets.** Never ask me to paste a password or API key into this chat, and never write one to a file. If a flow needs `API_KEY`, ask me to set it in my own terminal (for example `$env:SPARKY_E2E_API_KEY`) and refer to it only by name.
11. **Failures.** If a step fails, show me the relevant output, check the README's Troubleshooting section, propose a fix and ask before applying it. Do not retry the same thing in a loop.
12. **Repository.** Do not commit, push, open pull requests or edit files in the repo. If you think the kit needs a change, describe it and ask.

## When you finish

Give me a summary with: what was already installed; what you installed or changed, each with its undo command; the result of the first run (each flow passed or failed, and where the screenshots and logs are); and anything left for me to do.
