import { AppState } from 'react-native';
import {
  createAudioPlayer,
  setAudioModeAsync,
  type AudioPlayer,
} from 'expo-audio';
import { useAppPreferencesStore } from '../stores/appPreferencesStore';
import { addLog } from './LogService';

let restChimePlayer: AudioPlayer | null = null;
let configuredSilentModePlayback: boolean | null = null;

/**
 * Whether the rest-timer chime should play. Also consulted by the foreground
 * notification handler: while the chime owns the foreground cue, the
 * rest-complete notification's default sound is suppressed so the two never
 * ding on top of each other.
 */
export function isRestTimerSoundEnabled(): boolean {
  // Independent of `soundsEnabled`, which the settings UI presents as the
  // camera-shutter toggle.
  return useAppPreferencesStore.getState().restTimerSoundEnabled;
}

/**
 * Whether the chime would actually play right now. Callers that stand down in
 * favour of it must test this, not the preference alone: it is foreground-only,
 * so off screen the notification ping owns the cue.
 */
export function willPlayRestCompleteSound(): boolean {
  return isRestTimerSoundEnabled() && AppState.currentState === 'active';
}

/**
 * Whether the chime may play while the ringer is switched to silent. Off by
 * default, so the phone's mute switch wins and only the haptic fires; users who
 * keep the phone permanently muted can opt in from Workout Settings.
 */
function isRestTimerSoundInSilentModeEnabled(): boolean {
  return useAppPreferencesStore.getState().restTimerSoundInSilentMode;
}

/**
 * Plays the rest-complete chime. Foreground-only by design — in the background
 * the scheduled notification's sound is the cue. Fire-and-forget: playback
 * failures log but never propagate into rest-state transitions.
 */
export function playRestCompleteSound(): void {
  if (!willPlayRestCompleteSound()) return;
  void (async () => {
    try {
      const playsInSilentMode = isRestTimerSoundInSilentModeEnabled();
      // Keyed on the preference, not a one-shot flag, so flipping the toggle
      // reaches the next rest instead of waiting for an app restart.
      if (configuredSilentModePlayback !== playsInSilentMode) {
        try {
          // Short UI cue: mix with (never duck) the user's music.
          await setAudioModeAsync({
            playsInSilentMode,
            interruptionMode: 'mixWithOthers',
          });
          configuredSilentModePlayback = playsInSilentMode;
        } catch (err) {
          // Retry on the next chime; a config failure must not mute the cue.
          addLog(
            `rest chime audio mode config failed: ${(err as Error).message}`,
            'WARNING'
          );
        }
      }
      if (restChimePlayer == null) {
        restChimePlayer = createAudioPlayer(
          require('../../assets/sounds/rest-chime.wav')
        );
      }
      await restChimePlayer.seekTo(0);
      restChimePlayer.play();
    } catch (err) {
      addLog(
        `playRestCompleteSound failed: ${(err as Error).message}`,
        'ERROR'
      );
    }
  })();
}

/** Test-only helper — drops the cached player and audio-mode state. */
export function __resetSoundsForTests(): void {
  restChimePlayer = null;
  configuredSilentModePlayback = null;
}
