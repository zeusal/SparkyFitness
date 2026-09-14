import { ExtensionStorage } from '@bacons/apple-targets';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

import { CalorieWidgetBridge } from './CalorieWidgetBridge';
import { addLog } from './LogService';

/**
 * Where each platform keeps the home-screen widget snapshots.
 *
 * Shared with `useWidgetSync`, which writes them, so the writer and the sweep
 * below cannot drift onto different keys and leave a widget nobody clears.
 */
export const CALORIE_SNAPSHOT_KEY = 'calorieSnapshot';
export const MACRO_SNAPSHOT_KEY = 'macroSnapshot';
export const WIDGET_KIND = 'widget';
export const MACRO_WIDGET_KIND = 'macroWidget';

export const iosAppGroup = (
  Constants.expoConfig?.extra as { iosAppGroup?: string } | undefined
)?.iosAppGroup;

/**
 * Drops the calorie and macro snapshots the home-screen widgets render from.
 *
 * These live outside every cache the app can clear: an App Group on iOS and
 * SharedPreferences plus Glance state on Android. Nothing rewrites them until
 * the Dashboard next opens on a day that is today, so after switching account
 * the widget keeps showing the previous one's calories and macros on the home
 * screen — the one surface where stale numbers are visible without opening the
 * app at all.
 *
 * Both platforms already render an empty state when the snapshot is missing or
 * unreadable, so clearing needs no native change: iOS falls back to `.empty`
 * when the key is absent, and Android's `parseSnapshot` returns null for a
 * string it cannot parse as JSON, which is what the empty string below gives
 * it. `setCalorieSnapshot` writes both the preference and the Glance state, so
 * one call covers the two places the widget reads.
 */
export async function clearWidgetSnapshots(): Promise<void> {
  try {
    if (Platform.OS === 'ios') {
      if (!iosAppGroup) return;
      const storage = new ExtensionStorage(iosAppGroup);
      storage.remove(CALORIE_SNAPSHOT_KEY);
      storage.remove(MACRO_SNAPSHOT_KEY);
      ExtensionStorage.reloadWidget(WIDGET_KIND);
      ExtensionStorage.reloadWidget(MACRO_WIDGET_KIND);
      return;
    }

    if (Platform.OS === 'android') {
      await CalorieWidgetBridge.setCalorieSnapshot('');
      await CalorieWidgetBridge.setMacroSnapshot('');
      await CalorieWidgetBridge.reloadWidget();
      await CalorieWidgetBridge.reloadMacroWidget();
    }
  } catch (error) {
    // Reported rather than passed over: a failure here leaves one account's
    // figures on another account's home screen, and nothing retries it until
    // the next Dashboard open.
    addLog(
      `Failed to clear the widget snapshots on an identity change: ${error}`,
      'ERROR'
    );
  }
}
